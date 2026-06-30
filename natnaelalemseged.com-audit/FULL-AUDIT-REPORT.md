# Full SEO Audit — natnaelalemseged.com

**Date:** 2026-06-30
**Business type:** Personal brand / engineering portfolio (project case-study site)
**Stack:** Next.js 16.1.1 (App Router, SSR), React 19, deployed on Vercel
**Pages in sitemap:** 19 (home, /projects, 17 project case studies)
**Data sources:** Live crawl + ground-truth repo source. No Google/Moz API credentials (Core Web Vitals are lab-estimated, not field data).

---

## SEO Health Score: 83 / 100 — Strong

| Category | Weight | Score | Notes |
|----------|:------:|:-----:|-------|
| Technical SEO | 22% | 88 | Clean SSR, complete dynamic sitemap, HSTS, canonical present |
| Content Quality | 23% | 85 | Unique, deep case studies; strong E-E-A-T; brand positioning inconsistent |
| On-Page SEO | 20% | 90 | Excellent titles/descriptions, 1×H1 + 9×H2, keyword-rich |
| Schema / Structured Data | 10% | 55 | **Fabricated AggregateRating + broken Person image + $0 Offer** |
| Performance (CWV) | 10% | 78 | Next/Image + compression; 1.47 MB source avatar; lab-only |
| AI Search Readiness | 10% | 92 | Excellent llms.txt with machine-readable JSON project index |
| Images | 5% | 80 | All alt text present, Next/Image optimized; oversized source files |

This is an above-average site. The headline risk is **structured-data policy compliance**, not visibility plumbing.

---

## Executive Summary

### Top 5 issues
1. **[Critical] Fabricated `AggregateRating` on every project** — `ratingValue: 5, ratingCount: 1` is hardcoded into the `SoftwareApplication` JSON-LD for all projects, regardless of real reviews. This violates Google's [review snippet policy](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) and risks a structured-data manual action.
2. **[High] Person schema `image` returns 404** — `/images/profile.jpg` doesn't exist (the code even comments "Ensure this exists"). A broken entity image weakens Person-entity / knowledge-panel eligibility.
3. **[High] Self-serving `$0 Offer` on portfolio projects** — `offers: { price: '0' }` on non-commercial case studies is misleading markup; pair it with the rating issue and it compounds policy risk.
4. **[Medium] Brand positioning is inconsistent across signals** — four different job titles across title tag, layout fallback, Person schema, and llms.txt. Dilutes the entity signal.
5. **[Medium] Oversized source images** — `avatar_HD.png` is 1.47 MB at source; the LCP hero candidate. Next/Image mitigates delivery but the source bloats the optimization pipeline and any non-`next/image` use.

### Top 5 quick wins
1. Delete the hardcoded `aggregateRating` block (and `offers` for non-products) — ~5 min, removes the only Critical.
2. Fix or remove the Person `image` — point to a real file (e.g. `/avatar_HD.png`) — ~5 min.
3. Standardize one job-title/positioning string across title, schema, layout, llms.txt — ~15 min.
4. Compress/resize `avatar_HD.png` to ~150–250 KB (or a WebP) — ~10 min.
5. Add `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` headers — ~10 min.

---

## Technical SEO — 88

**What works**
- `robots.txt`: `Allow: /`, `Disallow: /admin`, sitemap referenced. Correct.
- Dynamic `sitemap.ts` produces 19 accurate URLs with realistic `lastmod`/`changefreq`/`priority`; all 17 projects present (verified against `llms.txt`). No index bloat.
- Server-rendered HTML (200, no SPA shell) — fully crawlable without JS.
- HTTPS with `Strict-Transport-Security: max-age=63072000`.
- Per-page canonicals via `alternates.canonical`.
- `metadataBase` configured with env fallback.

**Findings**
- *[Low] Canonical trailing-slash inconsistency.* Homepage canonical renders as `https://natnaelalemseged.com` (no slash) while `og:url`, sitemap, and `BASE_URL` use the trailing slash. Pick one form to avoid mixed signals.
- *[Low] Missing security headers.* Only HSTS present; no `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options`, or CSP. Not a ranking factor but a hardening/quality gap. Add via `next.config.ts` `headers()`.

## Content Quality (E-E-A-T) — 85

**What works**
- Genuine Experience/Expertise signals: 17 detailed, distinct project case studies (problem → solution → stack → takeaway), no thin/templated duplication.
- Identity is real and verifiable: name, GitHub, LinkedIn linked and consistent.
- Homepage carries ~1,400 visible words with substantive sections (About, Technologies, Work Experience, Publications, Contact).

**Findings**
- *[Medium] Inconsistent personal-brand positioning.* The entity is described four different ways:
  - Title/OG: "Senior AI Agent Engineer | Forward Deployed Engineer"
  - Layout fallback metadata: "AI Engineer & Full-Stack Developer"
  - Person schema `jobTitle`: "Full-Stack Software Engineer & AI Automation Engineer"
  - llms.txt: "AI Engineer & Full-Stack Developer"
  For a personal-brand site, entity consistency is the SEO lever — align these so Google/LLMs resolve one coherent identity.
- *[Low] Person schema is thin.* Add `description`, `knowsAbout` (key skills), and `alumniOf`/`worksFor` if applicable to strengthen the entity and knowledge-panel candidacy.

## On-Page SEO — 90

**What works**
- Homepage title 71 chars, keyword-led, brand-suffixed. Meta description compelling and within length.
- Clean heading hierarchy: exactly 1 `H1`, 9 `H2`.
- Per-project `generateMetadata` builds title/description/keywords from real project data; OG `type: article`; Twitter `summary_large_image`.
- Full OG/Twitter coverage with image dimensions and alt.

**Findings**
- *[Low] Twitter `@site`/`@creator` not set* and no X profile in `sameAs`. Add if an X presence exists; otherwise fine.

## Schema / Structured Data — 55 (drags the overall score)

**What works**
- Root `@graph` with `Person` + `WebSite` + `BreadcrumbList`, correctly `@id`-linked.
- Per-project `SoftwareApplication`/`MobileApplication` JSON-LD with author, image, dateCreated.

**Findings**
- *[Critical] Fabricated `AggregateRating`.* `ratingValue: '5', ratingCount: '1'` is hardcoded on every project. Google requires aggregate ratings to reflect genuine user reviews collected by the site. Self-assigned ratings are a policy violation and can trigger a manual action that removes ALL rich results. **Remove it** (or replace with real, verifiable reviews only).
- *[High] `offers: { price: '0' }` on non-products.* Portfolio case studies aren't purchasable software. Remove `offers`, or only include it for projects that are genuinely free downloadable software (e.g. the open-source Dart package).
- *[High] Person `image` 404.* `/images/profile.jpg` is missing. Point it at an existing asset.

## Performance (CWV) — 78 *(lab estimate — no field data)*

**What works**
- Next.js 16 with `compress: true`, `next/image` optimization (auto WebP/AVIF), `@vercel/speed-insights` installed.
- Server-rendered, low render-blocking risk.

**Findings**
- *[Medium] 1.47 MB source `avatar_HD.png`* is the likely LCP element. `next/image` resizes for delivery, but the heavy source slows the optimizer cold path and hurts any direct use. Resize to display dimensions and ship WebP.
- *[Info] No field (CrUX) data available.* Configure a Google PageSpeed/CrUX API key (or check Search Console) to confirm real-world LCP/INP/CLS. Recommend `/seo google` once credentials are set.

## AI Search Readiness (GEO) — 92

**What works**
- `llms.txt` is exemplary: human-readable project summaries **plus** a machine-readable JSON index with slugs, URLs, stacks, and tags — ideal for ChatGPT/Perplexity/AI Overviews citation.
- Clean SSR HTML means AI crawlers get full content without JS execution.
- Strong, declarative passages (problem/solution framing) are highly citable.

**Findings**
- *[Low] Keep llms.txt and sitemap in sync automatically.* They currently match — ensure the same DB source feeds both so new projects can't drift.

## Images — 80

**What works**: All 8 homepage images carry alt text; served through `next/image`.
**Findings**: Oversized source files (see Performance). Confirm project case-study images are also right-sized at source.

---

## Notes / limitations
- Core Web Vitals are **lab-estimated**; no GSC/CrUX/GA4 credentials were configured.
- Crawl scoped to the 19 sitemap URLs (full site). `/admin` correctly disallowed and excluded.
