#!/usr/bin/env python3
"""Build, verify, score, and conditionally publish portfolio resumes.

This is intentionally a local/CI authoring tool.  It never edits resume JSON and
only replaces a public PDF after the matching custom-role evaluation passes.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import importlib.util
import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import UTC, datetime, timedelta
from pathlib import Path
from statistics import median
from typing import Any

import fitz

SCRIPTS_ROOT = Path(__file__).resolve().parent
_generator_spec = importlib.util.spec_from_file_location("resume_generator", SCRIPTS_ROOT / "generate-resume.py")
if not _generator_spec or not _generator_spec.loader:
    raise RuntimeError("Unable to load scripts/generate-resume.py")
_generator = importlib.util.module_from_spec(_generator_spec)
sys.modules[_generator_spec.name] = _generator
_generator_spec.loader.exec_module(_generator)
DEFAULT_DATA = _generator.DEFAULT_DATA
DEFAULT_VARIANTS_DATA = _generator.DEFAULT_VARIANTS_DATA
build = _generator.build
load_data = _generator.load_data


ROOT = Path(__file__).resolve().parents[1]


def load_project_env(path: Path) -> None:
    """Load simple KEY=VALUE entries without exposing or overriding shell secrets."""
    if not path.is_file():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.removeprefix("export ").strip()
        if not key or key in os.environ:
            continue
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        os.environ[key] = value


load_project_env(ROOT / ".env")
EVALUATOR_ROOT = ROOT / "scripts" / "resume_evaluator"
ROLES_ROOT = EVALUATOR_ROOT / "roles"
OUTPUT_ROOT = ROOT / "output" / "resume-evaluations"
CACHE_ROOT = OUTPUT_ROOT / "cache"
UPSTREAM_COMMIT = "70fd3ea9aa74d8f76519ec643a99f9871003e70d"
# OpenRouter is preferred when configured because it can route the same model
# across multiple upstream providers. Direct Gemini remains a fallback for
# existing local setups. Keep provider-specific model variables separate since
# OpenRouter model IDs include an organization prefix.
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-3.6-flash")
GEMINI_MODEL = os.getenv("RESUME_EVAL_MODEL", "gemini-flash-latest")
GEMINI_FALLBACK_MODELS = tuple(dict.fromkeys((GEMINI_MODEL, "gemini-3.6-flash")))
REQUEST_TIMEOUT_SECONDS = float(os.getenv("RESUME_EVAL_TIMEOUT_SECONDS", "90"))
RETRY_BASE_SECONDS = float(os.getenv("RESUME_EVAL_RETRY_BASE_SECONDS", "5"))
DISABLED_ENDPOINTS: set[str] = set()
CUSTOM_THRESHOLD = 75.0
RUNS = 3
CACHE_TTL = timedelta(hours=24)

VARIANTS: dict[str, dict[str, Any]] = {
    "general": {
        "overlay": None,
        "custom_role": "general_software_engineer",
        "output": ROOT / "output" / "pdf" / "natnael-alemseged-resume.pdf",
        "public": ROOT / "public" / "resume.pdf",
    },
    "mobile": {
        "overlay": "mobile",
        "custom_role": "mobile_engineer",
        "output": ROOT / "output" / "pdf" / "natnael-alemseged-mobile-resume.pdf",
        "public": ROOT / "public" / "resume-mobile.pdf",
    },
    "ai-fde": {
        "overlay": "ai-fde",
        "custom_role": "ai_fde_engineer",
        "output": ROOT / "output" / "pdf" / "natnael-alemseged-ai-fde-resume.pdf",
        "public": ROOT / "public" / "resume-ai-fde.pdf",
    },
    "full-stack-backend": {
        "overlay": "full-stack-backend",
        "custom_role": "full_stack_backend_engineer",
        "output": ROOT / "output" / "pdf" / "natnael-alemseged-full-stack-backend-resume.pdf",
        "public": ROOT / "public" / "resume-full-stack.pdf",
    },
}


class PipelineError(RuntimeError):
    pass


def now() -> datetime:
    return datetime.now(UTC)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    temporary.replace(path)


def read_json(path: Path) -> dict[str, Any] | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def load_role(name: str) -> dict[str, Any]:
    role_dir = ROLES_ROOT / name
    manifest_path = role_dir / "role.json"
    required = (manifest_path, role_dir / "criteria.jinja", role_dir / "system_message.jinja")
    if not all(path.is_file() for path in required):
        raise PipelineError(f"Role '{name}' is incomplete under {role_dir}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    categories = manifest.get("categories")
    if not isinstance(categories, list) or not categories:
        raise PipelineError(f"Role '{name}' needs one or more categories")
    keys = [category.get("key") for category in categories]
    if not all(isinstance(key, str) and key for key in keys) or len(keys) != len(set(keys)):
        raise PipelineError(f"Role '{name}' has invalid category keys")
    if any(not isinstance(category.get("max"), (int, float)) or category["max"] <= 0 for category in categories):
        raise PipelineError(f"Role '{name}' has invalid category maximums")
    manifest["name"] = name
    manifest["criteria"] = (role_dir / "criteria.jinja").read_text(encoding="utf-8")
    manifest["system_message"] = (role_dir / "system_message.jinja").read_text(encoding="utf-8")
    manifest["version"] = sha256_bytes(
        (manifest_path.read_bytes() + (role_dir / "criteria.jinja").read_bytes() + (role_dir / "system_message.jinja").read_bytes())
    )
    return manifest


def pdf_verification(data: dict[str, Any], path: Path) -> dict[str, Any]:
    document = fitz.open(path)
    try:
        if document.page_count != 2:
            raise PipelineError(f"PDF verification failed: expected 2 pages, found {document.page_count}")
        text = "\n".join(page.get_text() for page in document)
        required = ["PROFILE", "EXPERIENCE", "EARLIER EXPERIENCE", "TECHNICAL SKILLS", "EDUCATION"]
        required.extend(role["title"] for group in ("primary", "earlier") for role in data["experience"][group])
        required.extend(role["company"] for group in ("primary", "earlier") for role in data["experience"][group])
        required.extend(item["name"] for item in data["independentDelivery"])
        required.extend(item["degree"] for item in data["education"])
        required.extend(item["group"] for item in data["skills"])
        missing = [value for value in required if value not in text]
        if missing:
            raise PipelineError("PDF verification failed: missing extractable content: " + ", ".join(missing[:5]))

        expected_urls = {item["url"] for item in data["person"]["links"]}
        expected_urls.add(data["proof"]["url"])
        for collection in ("independentDelivery", "publications", "certifications"):
            expected_urls.update(item["url"] for item in data.get(collection, []) if item.get("url"))
        expected_urls.update(
            item_link["url"]
            for item in data["independentDelivery"]
            for item_link in item.get("links", [])
        )
        found_urls: set[str] = set()
        for page in document:
            for link in page.get_links():
                uri = link.get("uri")
                if uri:
                    found_urls.add(uri)
        missing_urls = sorted(expected_urls - found_urls)
        if missing_urls:
            raise PipelineError("PDF verification failed: missing embedded links: " + ", ".join(missing_urls[:3]))
        metadata = document.metadata
        if metadata.get("title") != data["metadata"]["title"] or metadata.get("author") != data["person"]["name"]:
            raise PipelineError("PDF verification failed: metadata title or author does not match source JSON")
        return {"pages": document.page_count, "links": len(found_urls), "status": "passed"}
    finally:
        document.close()


def json_resume_text(data: dict[str, Any]) -> str:
    """Create a deterministic, privacy-sanitized JSON Resume-style evaluation input."""
    lines = ["=== RESUME DATA ===", "SUMMARY", data["profile"], "", "PROFILES"]
    for link in data["person"]["links"]:
        lines.append(f"- {link['label']}: {link['url']}")
    lines.extend(["", "WORK EXPERIENCE"])
    for group in ("primary", "earlier"):
        for role in data["experience"][group]:
            lines.append(f"- {role['title']} at {role['company']} ({role['dates']})")
            lines.extend(f"  - {bullet}" for bullet in role["bullets"])
    lines.extend(["", "PROJECTS"])
    for item in data["independentDelivery"]:
        project_links = []
        if item.get("url"):
            project_links.append(item["url"])
        project_links.extend(
            f"{item_link['label']}: {item_link['url']}"
            for item_link in item.get("links", [])
        )
        links_text = f" | {' | '.join(project_links)}" if project_links else ""
        lines.append(f"- {item['name']}: {item['description']}{links_text}")
    lines.extend(["", "SKILLS"])
    lines.extend(f"- {item['group']}: {item['items']}" for item in data["skills"])
    if data["publications"]:
        lines.extend(["", "TECHNICAL WRITING"])
        lines.extend(f"- {item['title']} | {item['outlet']} | {item['url']}" for item in data["publications"])
    if data["certifications"]:
        lines.extend(["", "CERTIFICATIONS"])
        lines.extend(f"- {item['name']} | {item['issuer']}" for item in data["certifications"])
    # Degree is professionally relevant; institution, GPA, contact data, and location are deliberately omitted.
    lines.extend(["", "EDUCATION"])
    lines.extend(f"- {item['degree']}" for item in data["education"])
    return "\n".join(lines)


def github_username(data: dict[str, Any]) -> str | None:
    for link in data["person"]["links"]:
        parsed = urllib.parse.urlparse(link["url"])
        if parsed.netloc.lower() in {"github.com", "www.github.com"}:
            name = parsed.path.strip("/").split("/")[0]
            return name or None
    return None


def request_json(url: str, headers: dict[str, str] | None = None) -> Any:
    request = urllib.request.Request(url, headers=headers or {"Accept": "application/vnd.github+json"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        message = error.read().decode("utf-8", errors="replace")[:300]
        raise PipelineError(f"GitHub request failed ({error.code}): {message}") from error
    except urllib.error.URLError as error:
        raise PipelineError(f"GitHub request failed: {error.reason}") from error


def github_evidence(data: dict[str, Any], refresh: bool) -> tuple[str, dict[str, Any]]:
    username = github_username(data)
    if not username:
        return "", {"status": "not_present"}
    cache_path = CACHE_ROOT / f"github-{username.lower()}.json"
    cached = read_json(cache_path)
    if not refresh and cached and cached.get("expires_at", "") > now().isoformat():
        snapshot = cached["snapshot"]
        cache_status = "hit"
    else:
        headers = {"Accept": "application/vnd.github+json"}
        token = os.getenv("GITHUB_TOKEN")
        if token:
            headers["Authorization"] = f"Bearer {token}"
        try:
            profile = request_json(f"https://api.github.com/users/{urllib.parse.quote(username)}", headers)
            repos = request_json(
                f"https://api.github.com/users/{urllib.parse.quote(username)}/repos?per_page=100&sort=updated", headers
            )
            snapshot = {
                "profile": {key: profile.get(key) for key in ("login", "public_repos", "followers", "created_at", "blog")},
                "repos": [
                    {
                        "name": repo.get("name"), "html_url": repo.get("html_url"), "description": repo.get("description"),
                        "language": repo.get("language"), "stargazers_count": repo.get("stargazers_count", 0),
                        "forks_count": repo.get("forks_count", 0), "fork": repo.get("fork", False), "updated_at": repo.get("updated_at"),
                        "project_type": "open_source" if repo.get("fork") or repo.get("forks_count", 0) > 0 else "self_project",
                    }
                    for repo in repos
                ],
            }
            write_json(cache_path, {"cached_at": now().isoformat(), "expires_at": (now() + CACHE_TTL).isoformat(), "snapshot": snapshot})
            cache_status = "refreshed"
        except PipelineError as error:
            if not cached or not cached.get("snapshot"):
                raise
            snapshot = cached["snapshot"]
            cache_status = "stale_due_to_network_error"
            cache_error = str(error)
            return github_text(snapshot), {
                "status": cache_status, "username": username,
                "snapshot_hash": sha256_bytes(json.dumps(snapshot, sort_keys=True).encode()),
                "warning": cache_error,
            }
    return github_text(snapshot), {"status": cache_status, "username": username, "snapshot_hash": sha256_bytes(json.dumps(snapshot, sort_keys=True).encode())}


def github_text(snapshot: dict[str, Any]) -> str:
    repos = sorted(snapshot["repos"], key=lambda repo: (repo["stargazers_count"] + repo["forks_count"], repo.get("updated_at") or ""), reverse=True)[:7]
    lines = ["", "=== GITHUB DATA ===", f"Profile: {json.dumps(snapshot['profile'], ensure_ascii=False)}", "Top public repositories:"]
    for repo in repos:
        lines.append(f"- {repo['name']} ({repo['project_type']}) | stars={repo['stargazers_count']} forks={repo['forks_count']} | {repo['description'] or ''} | {repo['html_url']}")
    return "\n".join(lines)


def evaluation_schema(role: dict[str, Any]) -> dict[str, Any]:
    score_properties = {
        category["key"]: {
            "type": "object", "additionalProperties": False,
            "properties": {"score": {"type": "number", "minimum": 0, "maximum": category["max"]}, "max": {"type": "number"}, "evidence": {"type": "string", "minLength": 1}},
            "required": ["score", "max", "evidence"],
        }
        for category in role["categories"]
    }
    return {
        "type": "object", "additionalProperties": False,
        "properties": {
            "scores": {"type": "object", "additionalProperties": False, "properties": score_properties, "required": list(score_properties)},
            "bonus_points": {"type": "object", "additionalProperties": False, "properties": {"total": {"type": "number", "minimum": 0, "maximum": role.get("bonus_max", 0)}, "breakdown": {"type": "string"}}, "required": ["total", "breakdown"]},
            "deductions": {"type": "object", "additionalProperties": False, "properties": {"total": {"type": "number", "minimum": 0}, "reasons": {"type": "string"}}, "required": ["total", "reasons"]},
            "key_strengths": {"type": "array", "items": {"type": "string"}, "minItems": 1, "maxItems": 5},
            "areas_for_improvement": {"type": "array", "items": {"type": "string"}, "minItems": 1, "maxItems": 5},
        },
        "required": ["scores", "bonus_points", "deductions", "key_strengths", "areas_for_improvement"],
    }


def validate_evaluation(value: Any, role: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise PipelineError("Model returned a non-object evaluation")
    scores = value.get("scores")
    if not isinstance(scores, dict):
        raise PipelineError("Model evaluation is missing scores")
    normalized_scores: dict[str, dict[str, Any]] = {}
    for category in role["categories"]:
        entry = scores.get(category["key"])
        if not isinstance(entry, dict) or not isinstance(entry.get("score"), (int, float)) or not isinstance(entry.get("evidence"), str) or not entry["evidence"].strip():
            raise PipelineError(f"Model evaluation has an invalid {category['key']} score")
        normalized_scores[category["key"]] = {"score": min(float(entry["score"]), float(category["max"])), "max": category["max"], "evidence": entry["evidence"].strip()}
    bonus = value.get("bonus_points", {})
    deductions = value.get("deductions", {})
    if not isinstance(bonus, dict) or not isinstance(bonus.get("total"), (int, float)) or not isinstance(deductions, dict) or not isinstance(deductions.get("total"), (int, float)):
        raise PipelineError("Model evaluation has invalid bonus or deductions")
    for field in ("key_strengths", "areas_for_improvement"):
        if not isinstance(value.get(field), list) or not value[field] or not all(isinstance(item, str) and item.strip() for item in value[field]):
            raise PipelineError(f"Model evaluation has invalid {field}")
    return {
        "scores": normalized_scores,
        "bonus_points": {"total": min(max(float(bonus["total"]), 0), float(role.get("bonus_max", 0))), "breakdown": str(bonus.get("breakdown", "")).strip()},
        "deductions": {"total": max(float(deductions["total"]), 0), "reasons": str(deductions.get("reasons", "")).strip()},
        "key_strengths": [item.strip() for item in value["key_strengths"]][:5],
        "areas_for_improvement": [item.strip() for item in value["areas_for_improvement"]][:5],
    }


def evaluator_providers() -> list[dict[str, Any]]:
    providers: list[dict[str, Any]] = []
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    if openrouter_key:
        providers.append({
            "name": "openrouter",
            "api_key": openrouter_key,
            "url": "https://openrouter.ai/api/v1/chat/completions",
            "models": (OPENROUTER_MODEL,),
            "headers": {
                "HTTP-Referer": "https://natnaelalemseged.com",
                "X-OpenRouter-Title": "Portfolio Resume Evaluator",
            },
            "provider_options": {"require_parameters": True},
        })
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        providers.append({
            "name": "gemini",
            "api_key": gemini_key,
            "url": "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            "models": GEMINI_FALLBACK_MODELS,
            "headers": {},
        })
    return providers


def evaluator_identity() -> str:
    providers = evaluator_providers()
    if not providers:
        return "not-configured"
    provider = providers[0]
    return f"{provider['name']}:{provider['models'][0]}"


def retry_delay(error: urllib.error.HTTPError | None, attempt: int) -> float:
    if error is not None and error.headers is not None:
        retry_after = error.headers.get("Retry-After")
        if retry_after:
            try:
                return min(max(float(retry_after), 0), 60)
            except ValueError:
                pass
    return min(RETRY_BASE_SECONDS * (2 ** attempt), 60)


def call_evaluator(role: dict[str, Any], resume_text: str) -> dict[str, Any]:
    providers = evaluator_providers()
    if not providers:
        raise PipelineError("OPENROUTER_API_KEY or GEMINI_API_KEY is required for resume evaluation")
    criteria = role["criteria"].replace("{{ text_content }}", resume_text)
    last_error: Exception | None = None
    for provider in providers:
        for model in provider["models"]:
            endpoint_id = f"{provider['name']}:{model}"
            if endpoint_id in DISABLED_ENDPOINTS:
                continue
            body = {
                "model": model,
                # Resume scoring is a bounded classification task. Keeping
                # reasoning low controls latency and cost while preserving
                # schema-constrained output.
                "reasoning_effort": "low",
                "messages": [{"role": "system", "content": role["system_message"]}, {"role": "user", "content": criteria}],
                "response_format": {"type": "json_schema", "json_schema": {"name": "resume_evaluation", "strict": True, "schema": evaluation_schema(role)}},
            }
            if provider.get("provider_options"):
                body["provider"] = provider["provider_options"]
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {provider['api_key']}",
                **provider["headers"],
            }
            request = urllib.request.Request(
                provider["url"], data=json.dumps(body).encode(), headers=headers, method="POST"
            )
            for attempt in range(3):
                try:
                    with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                        payload = json.loads(response.read().decode("utf-8"))
                    content = payload["choices"][0]["message"]["content"]
                    evaluation = validate_evaluation(json.loads(content), role)
                    evaluation["model"] = endpoint_id
                    return evaluation
                except urllib.error.HTTPError as error:
                    last_error = error
                    if error.code in {404, 503}:
                        DISABLED_ENDPOINTS.add(endpoint_id)
                        break
                    if attempt < 2:
                        time.sleep(retry_delay(error if error.code == 429 else None, attempt))
                except TimeoutError as error:
                    last_error = error
                    if attempt < 2:
                        time.sleep(retry_delay(None, attempt))
                except (urllib.error.URLError, OSError, KeyError, IndexError, TypeError, json.JSONDecodeError, PipelineError) as error:
                    last_error = error
                    if attempt < 2:
                        time.sleep(retry_delay(None, attempt))
    raise PipelineError(f"Resume evaluation failed across configured providers: {last_error}") from last_error


def score_total(evaluation: dict[str, Any], role: dict[str, Any]) -> float:
    total = sum(item["score"] for item in evaluation["scores"].values()) + evaluation["bonus_points"]["total"] - evaluation["deductions"]["total"]
    return max(float(role.get("min_final_score", 0)), min(total, float(role.get("max_final_score", sum(category["max"] for category in role["categories"]) + role.get("bonus_max", 0)))))


def evaluate_role(role: dict[str, Any], resume_text: str) -> dict[str, Any]:
    runs = []
    for number in range(1, RUNS + 1):
        evaluation = call_evaluator(role, resume_text)
        model = evaluation.pop("model", evaluator_identity())
        runs.append({"run": number, "model": model, "total": score_total(evaluation, role), "evaluation": evaluation})
    ordered = sorted(runs, key=lambda item: item["total"])
    representative = ordered[len(ordered) // 2]
    totals = [item["total"] for item in runs]
    return {
        "role": role["name"], "role_version": role["version"], "max_score": role.get("max_final_score"),
        "runs": runs, "minimum": min(totals), "median": median(totals), "maximum": max(totals), "range": max(totals) - min(totals),
        "representative_run": representative["run"], "representative": representative["evaluation"],
    }


def print_summary(variant: str, report: dict[str, Any]) -> None:
    custom = report["evaluations"]["custom"]
    benchmark = report["evaluations"]["hackerrank"]
    status = "PASS" if report["gate"]["passed"] else "NEEDS REVISION"
    print(f"\n{variant}: {status}")
    print(f"  Custom role: {custom['median']:.1f}/100 (range {custom['minimum']:.1f}-{custom['maximum']:.1f})")
    print(f"  HackerRank benchmark: {benchmark['median']:.1f}/120 (advisory)")
    if custom["range"] > 10:
        print("  Warning: custom scoring variance is greater than 10 points.")
    print("  Custom role improvements:")
    for item in custom["representative"]["areas_for_improvement"]:
        print(f"  - {item}")
    print("  HackerRank benchmark improvements (advisory):")
    for item in benchmark["representative"]["areas_for_improvement"]:
        print(f"  - {item}")


def build_and_grade(variant: str, refresh: bool) -> dict[str, Any]:
    config = VARIANTS[variant]
    data = load_data(DEFAULT_DATA, DEFAULT_VARIANTS_DATA, config["overlay"])
    source_hash = sha256_bytes(json.dumps(data, sort_keys=True, ensure_ascii=False).encode("utf-8"))
    output = config["output"]
    build(data, output)
    verification = pdf_verification(data, output)
    artifact_hash = sha256_file(output)
    report_path = OUTPUT_ROOT / f"{variant}.json"
    existing = read_json(report_path)
    hackerrank_role = load_role("hackerrank_software_engineering_intern")
    custom_role = load_role(config["custom_role"])
    roles_match = (
        existing
        and existing.get("evaluations", {}).get("hackerrank", {}).get("role_version") == hackerrank_role["version"]
        and existing.get("evaluations", {}).get("custom", {}).get("role_version") == custom_role["version"]
    )
    identity = evaluator_identity()
    if not refresh and existing and roles_match and existing.get("source_sha256") == source_hash and existing.get("model") == identity and existing.get("upstream_commit") == UPSTREAM_COMMIT:
        return existing
    resume_text = json_resume_text(data)
    github_context, github_status = github_evidence(data, refresh)
    resume_text += github_context
    hackerrank = evaluate_role(hackerrank_role, resume_text)
    custom = evaluate_role(custom_role, resume_text)
    passing_runs = sum(run["total"] >= CUSTOM_THRESHOLD for run in custom["runs"])
    passed = custom["median"] >= CUSTOM_THRESHOLD and passing_runs >= 2
    report = {
        "variant": variant, "created_at": now().isoformat(), "artifact": str(output.relative_to(ROOT)), "artifact_sha256": artifact_hash, "source_sha256": source_hash,
        "model": identity, "upstream_commit": UPSTREAM_COMMIT, "runs_per_rubric": RUNS, "pdf_verification": verification,
        "github": github_status, "evaluations": {"hackerrank": hackerrank, "custom": custom},
        "gate": {"threshold": CUSTOM_THRESHOLD, "passing_runs": passing_runs, "passed": passed, "reason": "custom role median meets the threshold" if passed else "custom role median is below the threshold"},
        "publication": {"status": "not_requested"},
    }
    write_json(report_path, report)
    return report


def publish(variant: str, report: dict[str, Any]) -> None:
    if not report["gate"]["passed"]:
        raise PipelineError(f"{variant} was not published: {report['gate']['reason']}")
    source = VARIANTS[variant]["output"]
    target = VARIANTS[variant]["public"]
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_suffix(target.suffix + ".tmp")
    shutil.copyfile(source, temporary)
    temporary.replace(target)
    report["publication"] = {"status": "published", "public_artifact": str(target.relative_to(ROOT)), "published_at": now().isoformat()}
    write_json(OUTPUT_ROOT / f"{variant}.json", report)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--variant", choices=VARIANTS, default="general")
    parser.add_argument("--all", action="store_true", help="process every resume variant")
    parser.add_argument("--publish", action="store_true", help="publish only passing custom-role evaluations")
    parser.add_argument("--preview", action="store_true", help="render only; skip PDF verification and grading")
    parser.add_argument("--refresh", action="store_true", help="bypass evaluation and GitHub caches")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    variants = list(VARIANTS) if args.all else [args.variant]
    if args.preview and args.publish:
        raise PipelineError("--preview and --publish cannot be used together")
    if args.preview:
        for variant in variants:
            config = VARIANTS[variant]
            data = load_data(DEFAULT_DATA, DEFAULT_VARIANTS_DATA, config["overlay"])
            build(data, config["output"])
            print(f"Generated draft {config['output']}")
        return
    # A cached report is useful for repeatable local work, but checked commands
    # still require an explicitly configured provider so a missing credential
    # can never silently publish an old result.
    if not evaluator_providers():
        raise PipelineError("OPENROUTER_API_KEY or GEMINI_API_KEY is required for resume evaluation")
    reports = {variant: build_and_grade(variant, args.refresh) for variant in variants}
    for variant, report in reports.items():
        print_summary(variant, report)
    if args.publish:
        failed = [variant for variant, report in reports.items() if not report["gate"]["passed"]]
        if failed:
            raise PipelineError("No public files were replaced; custom evaluation failed for: " + ", ".join(failed))
        for variant, report in reports.items():
            publish(variant, report)
            print(f"Published {VARIANTS[variant]['public']}")
    if any(not report["gate"]["passed"] for report in reports.values()):
        raise PipelineError("One or more custom resume evaluations need revision")


if __name__ == "__main__":
    try:
        main()
    except PipelineError as error:
        print(f"resume pipeline: {error}", file=sys.stderr)
        raise SystemExit(1)
