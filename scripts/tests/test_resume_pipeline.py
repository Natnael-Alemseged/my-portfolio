import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import resume_pipeline as pipeline


class ResumePipelineTests(unittest.TestCase):
    def test_all_custom_roles_total_one_hundred(self):
        for name in ("general_software_engineer", "mobile_engineer", "ai_fde_engineer", "full_stack_backend_engineer"):
            role = pipeline.load_role(name)
            self.assertEqual(sum(category["max"] for category in role["categories"]), 100)
            self.assertEqual(role["bonus_max"], 0)

    def test_hackerrank_snapshot_is_guarded(self):
        expected = json.loads((ROOT / "scripts/resume_evaluator/upstream-role-sha256.json").read_text())
        role_dir = ROOT / "scripts/resume_evaluator/roles/hackerrank_software_engineering_intern"
        for name, digest in expected["files"].items():
            self.assertEqual(hashlib.sha256((role_dir / name).read_bytes()).hexdigest(), digest)

    def test_adapter_removes_personal_and_academic_identifiers(self):
        data = pipeline.load_data(pipeline.DEFAULT_DATA, pipeline.DEFAULT_VARIANTS_DATA, "ai-fde")
        text = pipeline.json_resume_text(data)
        self.assertIn(data["profile"], text)
        self.assertNotIn(data["person"]["name"], text)
        self.assertNotIn(data["person"]["phone"], text)
        self.assertNotIn(data["person"]["email"], text)
        self.assertNotIn(data["person"]["location"], text)
        self.assertNotIn(data["education"][0]["institution"], text)
        self.assertNotIn("GPA:", text)

    def test_mobile_adapter_includes_all_labeled_project_links(self):
        data = pipeline.load_data(pipeline.DEFAULT_DATA, pipeline.DEFAULT_VARIANTS_DATA, "mobile")
        text = pipeline.json_resume_text(data)
        expected_links = [
            item_link
            for item in data["independentDelivery"]
            for item_link in item.get("links", [])
        ]
        self.assertGreaterEqual(len(expected_links), 8)
        for item_link in expected_links:
            self.assertIn(f"{item_link['label']}: {item_link['url']}", text)

    def test_score_caps_bonus_and_deductions(self):
        role = pipeline.load_role("general_software_engineer")
        evaluation = {
            "scores": {category["key"]: {"score": category["max"] + 50, "evidence": "supported"} for category in role["categories"]},
            "bonus_points": {"total": 5, "breakdown": "not allowed"},
            "deductions": {"total": 26, "reasons": "missing evidence"},
            "key_strengths": ["strong evidence"],
            "areas_for_improvement": ["[experience] Add a truthful metric."],
        }
        validated = pipeline.validate_evaluation(evaluation, role)
        self.assertEqual(validated["bonus_points"]["total"], 0)
        self.assertEqual(pipeline.score_total(validated, role), 74)

    def test_pdf_verification_for_generated_resume(self):
        data = pipeline.load_data(pipeline.DEFAULT_DATA, pipeline.DEFAULT_VARIANTS_DATA, None)
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "resume.pdf"
            pipeline.build(data, output)
            result = pipeline.pdf_verification(data, output)
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["pages"], 2)

    def test_custom_gate_uses_median_and_hackerrank_is_advisory(self):
        role = pipeline.load_role("general_software_engineer")
        values = []
        for total in (74, 75, 76):
            scores = {}
            remaining = total
            for category in role["categories"]:
                score = min(remaining, category["max"])
                scores[category["key"]] = {"score": score, "max": category["max"], "evidence": "evidence"}
                remaining -= score
            values.append({"scores": scores, "bonus_points": {"total": 0, "breakdown": ""}, "deductions": {"total": 0, "reasons": ""}, "key_strengths": ["strength"], "areas_for_improvement": ["[skills] Add evidence."]})
        with patch.object(pipeline, "call_evaluator", side_effect=values):
            result = pipeline.evaluate_role(role, "resume")
        self.assertEqual(result["median"], 75)
        self.assertEqual(sum(run["total"] >= 75 for run in result["runs"]), 2)

    def test_missing_evaluator_key_fails_before_a_request(self):
        role = pipeline.load_role("general_software_engineer")
        with patch.dict("os.environ", {}, clear=True):
            with self.assertRaisesRegex(pipeline.PipelineError, "OPENROUTER_API_KEY or GEMINI_API_KEY"):
                pipeline.call_evaluator(role, "resume")

    def test_evaluator_timeout_becomes_a_clean_pipeline_error(self):
        role = pipeline.load_role("general_software_engineer")
        with patch.dict("os.environ", {"OPENROUTER_API_KEY": "test-key"}, clear=True):
            with patch.object(pipeline.urllib.request, "urlopen", side_effect=TimeoutError("timed out")):
                with patch.object(pipeline.time, "sleep"):
                    with self.assertRaisesRegex(pipeline.PipelineError, "Resume evaluation failed"):
                        pipeline.call_evaluator(role, "resume")

    def test_openrouter_is_preferred_when_both_keys_are_present(self):
        with patch.dict("os.environ", {"OPENROUTER_API_KEY": "or-key", "GEMINI_API_KEY": "gemini-key"}, clear=True):
            providers = pipeline.evaluator_providers()
        self.assertEqual([provider["name"] for provider in providers], ["openrouter", "gemini"])
        self.assertEqual(providers[0]["models"], (pipeline.OPENROUTER_MODEL,))

    def test_retry_after_is_honored_and_capped(self):
        error = pipeline.urllib.error.HTTPError("https://example.com", 429, "limited", {"Retry-After": "120"}, None)
        self.assertEqual(pipeline.retry_delay(error, 0), 60)

    def test_publish_refuses_a_failed_gate(self):
        with self.assertRaisesRegex(pipeline.PipelineError, "not published"):
            pipeline.publish("general", {"gate": {"passed": False, "reason": "below threshold"}})


if __name__ == "__main__":
    unittest.main()
