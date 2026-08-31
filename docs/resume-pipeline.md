# Resume pipeline

The resume content and its presentation are separate:

- `data/resume.json` is the editable source of truth.
- `data/resume-variants.json` contains role-specific overlays for mobile and
  AI/FDE applications.
- `data/resume.schema.json` documents the accepted structure and enables JSON
  editor validation.
- `scripts/generate-resume.py` validates the content and renders the current
  two-page visual design.
- `public/resume.pdf` is the file served at `/resume.pdf`.
- `public/resume-mobile.pdf`, `public/resume-ai-fde.pdf`, and
  `public/resume-full-stack.pdf` are the tailored application versions.

## Requirements

The recommended command uses
[uv](https://docs.astral.sh/uv/getting-started/installation/) to create an
isolated, reproducible Python environment automatically. No project-wide
Python installation is required.

If you want to invoke the Python script directly instead, install its
dependency first:

```bash
python3 -m pip install -r scripts/requirements-resume.txt
```

## Update and publish

1. Edit `data/resume.json`.
2. Build, verify, grade, and publish the selected resume in an isolated environment:

```bash
npm run resume:build
```

3. Review the generated artifact at
   `output/pdf/natnael-alemseged-resume.pdf`.
4. Commit `data/resume.json` and `public/resume.pdf`.

The checked commands validate the JSON, generate a draft, verify its text,
links, and metadata, then run the HackerRank benchmark and the matching custom
role rubric three times. A malformed JSON file, failed PDF verification,
unavailable evaluator, or custom score below 75/100 stops the command without
replacing the public resume. HackerRank is an advisory benchmark and does not
block publication.

## Preview without publishing

To produce an artifact without evaluation or publication:

```bash
npm run resume:preview
```

## Alternate data or output

The renderer also accepts explicit paths:

```bash
python3 scripts/generate-resume.py \
  --data data/resume.json \
  --output output/pdf/resume-preview.pdf
```

Content changes should stay in JSON. Only edit the Python renderer when the
visual system, section order, or pagination needs to change.

## Resume evaluation

Set an OpenRouter API key before using checked commands. Direct Gemini can be
kept as an optional fallback:

```bash
# .env (loaded automatically by the resume pipeline)
OPENROUTER_API_KEY=... # preferred
OPENROUTER_MODEL=google/gemini-3.6-flash
GEMINI_API_KEY=... # optional fallback
GITHUB_TOKEN=...   # optional; improves GitHub API rate limits
```

OpenRouter uses `google/gemini-3.6-flash` by default to keep results comparable
with the existing baseline; override it with `OPENROUTER_MODEL`. When OpenRouter
is not configured, direct Gemini uses `gemini-flash-latest` and can be overridden
with `RESUME_EVAL_MODEL`. Rate limits honor `Retry-After` and use exponential
backoff; request timeouts can be adjusted with `RESUME_EVAL_TIMEOUT_SECONDS`.
Resume commands use uv's local dependency cache, so they
do not need to contact PyPI after the first successful setup. The evaluator sends a sanitized representation of the
resume to the configured model provider: contact details, exact location, school name, and GPA are
removed. Public GitHub evidence is fetched separately and cached for 24 hours;
if a refresh cannot reach GitHub, the last cached snapshot is used and marked
as stale in the evaluation report.

```bash
# Build a draft and score it without publishing.
npm run resume:grade -- --variant ai-fde

# Ignore cached GitHub/evaluation results.
npm run resume:grade -- --variant ai-fde --refresh

# Render only (no grading or publication).
npm run resume:preview -- --variant mobile

# Run offline guard tests.
npm run resume:test
```

Reports are written to `output/resume-evaluations/<variant>.json`. They include
all three runs for both rubrics, medians and variance, evidence, suggestions,
GitHub cache status, and the publication decision. A custom-role score range
above ten points is reported as a warning. The scorer never changes resume JSON
or invents claims; revise the indicated JSON section manually and run the grade
command again.

## Tailored resumes

Generate every version:

```bash
npm run resume:all
```

Or generate one target:

```bash
npm run resume:mobile
npm run resume:ai-fde
npm run resume:full-stack
```

`resume:all` grades every draft before replacing any public PDF. The individual
resume commands publish only when their matching custom rubric reaches 75/100.

The variants inherit contact details, credentials, education, earlier
experience, and verified Upwork evidence from `data/resume.json`. Their
overlays replace positioning-sensitive content such as headline, profile,
experience order and bullets, selected delivery, skills, and publications.

| Target | Public URL |
| --- | --- |
| General | `/resume.pdf` |
| Mobile app engineering | `/resume-mobile.pdf` |
| AI / forward-deployed engineering | `/resume-ai-fde.pdf` |
| Full-stack / backend engineering | `/resume-full-stack.pdf` |
