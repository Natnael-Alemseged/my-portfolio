# Action Plan — natnaelalemseged.com

Ordered by priority and dependency. Each item: the fix, the file, and how you'll know it worked.

## Phase 1 — Critical (this week)

### 1. Remove fabricated `AggregateRating` from project schema  `[Critical]`
- **File:** `app/projects/[slug]/page.tsx` (~lines 209–212)
- **Fix:** Delete the `aggregateRating` block. Only re-add it if you collect real, on-site, verifiable reviews.
- **Why:** Hardcoded `5★ / 1 rating` on every project violates Google's review-snippet policy and risks a manual action that strips all rich results.
- **Verify:** Re-test a project URL in [Rich Results Test](https://search.google.com/test/rich-results) — no review markup should appear; no policy warning.
- **Leading indicator:** No "Structured data" manual actions in Search Console.

### 2. Fix the broken Person `image` (404)  `[High]`
- **File:** `components/StructuredData.tsx` (~line 9)
- **Fix:** Replace `https://natnaelalemseged.com/images/profile.jpg` with a real asset (e.g. `/avatar_HD.png`, ideally a square ≥400px headshot).
- **Verify:** `curl -I` the new URL → 200; Rich Results Test shows the image resolving on the Person entity.

### 3. Remove `$0 Offer` from non-product projects  `[High]`
- **File:** `app/projects/[slug]/page.tsx` (~lines 204–208)
- **Fix:** Drop `offers` entirely, or gate it to genuinely free, installable software only (e.g. the open-source Dart package).
- **Verify:** Rich Results Test on a case-study URL shows no price/offer.

## Phase 2 — High-impact (weeks 2–3)

### 4. Standardize personal-brand positioning  `[Medium]`
- **Files:** `app/page.tsx`, `app/layout.tsx`, `components/StructuredData.tsx`, `app/llms.txt`
- **Fix:** Choose ONE canonical title (e.g. "Senior AI Agent Engineer & Forward Deployed Engineer") and use it verbatim in the title tag, layout fallback metadata, Person `jobTitle`, and llms.txt intro.
- **Verify:** Grep the four sources — identical positioning string. Improves entity resolution for Google + LLMs.

### 5. Right-size hero/avatar images  `[Medium]`
- **File:** `public/avatar_HD.png` (1.47 MB) and project images
- **Fix:** Resize to display dimensions and export WebP (~150–250 KB). Confirm `priority` is set on the LCP image in the Hero component.
- **Verify:** `next/image` delivers a sub-100 KB optimized variant; Lighthouse LCP improves.

### 6. Add baseline security headers  `[Low→Medium]`
- **File:** `next.config.ts` — add an `async headers()` returning `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN` (consider a CSP).
- **Verify:** `curl -I https://natnaelalemseged.com` shows the new headers.

## Phase 3 — Content & authority (month 2)

### 7. Enrich the Person entity  `[Low]`
- Add `description`, `knowsAbout` (top skills), `sameAs` (X/other profiles) to the Person schema.
- **Verify:** Rich Results Test parses the expanded Person without errors.

### 8. Resolve canonical trailing-slash convention  `[Low]`
- Pick with-or-without trailing slash and apply consistently across canonical, `og:url`, sitemap, and `BASE_URL`.

## Phase 4 — Monitoring (ongoing)

### 9. Wire up Google field data  `[Info]`
- Configure a PageSpeed/CrUX API key and verify Search Console ownership (BingSiteAuth.xml already present — add GSC too).
- Then run `/seo google` for real LCP/INP/CLS, indexation status, and query performance.
- **Leading indicator:** CrUX "good" CWV thresholds; rising impressions for "Natnael Alemseged" + AI-engineer queries.

### 10. Keep llms.txt + sitemap DB-synced  `[Low]`
- Ensure both regenerate from the same project source so new case studies never drift out of either.
