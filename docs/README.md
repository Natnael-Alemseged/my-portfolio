# Portfolio

This is a [Next.js](https://nextjs.org) portfolio project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Resume workflow

Resume content lives in `data/resume.json`; role-specific versions live in
`data/resume-variants.json`. The checked workflow generates a draft, verifies
the PDF, runs the HackerRank benchmark plus the matching custom-role evaluation
three times, and publishes only when the custom median score is at least 75/100.

Add an OpenRouter key once to `.env`; the resume commands load it automatically.
OpenRouter is preferred when both keys are present, while direct Gemini remains
an optional fallback:

```env
OPENROUTER_API_KEY=your_actual_openrouter_key
OPENROUTER_MODEL=google/gemini-3.6-flash
GEMINI_API_KEY=optional_fallback_gemini_key
GITHUB_TOKEN=optional_token_for_higher_GitHub_rate_limits
```

| Goal | Command |
| --- | --- |
| Preview a draft only | `npm run resume:preview -- --variant mobile` |
| Grade a draft, without publishing | `npm run resume:grade -- --variant mobile` |
| Regrade without using caches | `npm run resume:grade -- --variant mobile --refresh` |
| Grade and publish the general resume if it passes | `npm run resume:build` |
| Grade and publish the mobile resume if it passes | `npm run resume:mobile` |
| Grade and publish the AI/FDE resume if it passes | `npm run resume:ai-fde` |
| Grade and publish the full-stack/backend resume if it passes | `npm run resume:full-stack` |
| Grade all variants before publishing any passing set | `npm run resume:all` |
| Run offline pipeline tests | `npm run resume:test` |

Valid grading variants are `general`, `mobile`, `ai-fde`, and
`full-stack-backend`. Reports are written to
`output/resume-evaluations/<variant>.json`; failed drafts remain in
`output/pdf/` while public PDFs remain unchanged. See
[the complete resume pipeline guide](resume-pipeline.md) for rubric,
privacy, caching, and publishing details.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
