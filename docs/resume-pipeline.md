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
- `public/resume-mobile.pdf` and `public/resume-ai-fde.pdf` are the tailored
  application versions.

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
2. Generate the PDF in an isolated environment and replace the public copy:

```bash
npm run resume:build
```

3. Review the generated artifact at
   `output/pdf/natnael-alemseged-resume.pdf`.
4. Commit `data/resume.json` and `public/resume.pdf`.

The renderer validates required fields before writing either PDF. A malformed
JSON file or a missing required value stops the command without replacing the
public resume.

## Preview without publishing

To produce an artifact without changing `public/resume.pdf`:

```bash
python3 scripts/generate-resume.py
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

## Tailored resumes

Generate every version:

```bash
npm run resume:all
```

Or generate one target:

```bash
npm run resume:mobile
npm run resume:ai-fde
```

The variants inherit contact details, credentials, education, earlier
experience, and verified Upwork evidence from `data/resume.json`. Their
overlays replace positioning-sensitive content such as headline, profile,
experience order and bullets, selected delivery, skills, and publications.

| Target | Public URL |
| --- | --- |
| General | `/resume.pdf` |
| Mobile app engineering | `/resume-mobile.pdf` |
| AI / forward-deployed engineering | `/resume-ai-fde.pdf` |
