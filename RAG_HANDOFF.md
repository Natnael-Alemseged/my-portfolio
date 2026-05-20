# RAG Chatbot — Handoff Document

Last updated: 2026-05-20

---

## What Was Built

A full RAG improvement pass on the portfolio chatbot covering safety, retrieval quality, observability, and knowledge coverage. The chatbot now:

- Blocks prompt injection attempts at the input layer before any LLM call
- Sanitizes client-provided conversation history (role whitelist, length cap, content cap)
- Retrieves with a score threshold (≥ 0.55 cosine similarity) — no weak matches injected
- Caps profile chunks at 2 per result set so project chunks are not crowded out
- Fetches a 3× wider candidate pool from Qdrant before filtering, ensuring project chunks compete
- Labels every retrieved source with title, type, slug, and score
- Wraps retrieved context in injection-defense delimiters
- Logs every retrieval (query, candidates, filtered count, scores, latency)
- Uses bounded retries on HuggingFace embedding calls (max 3, 5/10/20s backoff)
- Knows about contact info, work experience, skills, testimonials, and availability (not just projects)

---

## Architecture Overview

```
User message (POST /api/chat)
    │
    ├─ Injection guard (23 pattern strings, zero LLM cost)
    ├─ History sanitize (user/assistant only, last 10 turns, 2000 char/msg)
    ├─ Follow-up heuristic (append last 2 turns to query if pronoun detected)
    │
    ├─ HuggingFace bge-large-en-v1.5 → 1024-dim query embedding
    ├─ Qdrant chat_memories_v2 → top 20 candidates (3× limit)
    ├─ Score filter ≥ 0.55
    ├─ Profile cap: max 2 profile chunks per result set
    ├─ Slice to limit (10)
    │
    ├─ Format context with [Source N] labels + RETRIEVED CONTEXT BEGIN/END delimiters
    └─ Groq llama-3.3-70b-versatile → streamed answer
```

---

## Files Changed or Created

| File | What changed |
|---|---|
| `lib/qdrant-sync.ts` | Embedding model → bge-large-en-v1.5, collection → chat_memories_v2, bounded retries, score threshold, profile diversity cap, wider candidate pool, retrieval logging, MemoryResult interface |
| `app/api/chat/route.ts` | Injection guard, history sanitization, follow-up heuristic, context formatting with source labels, hardened system prompt |
| `scripts/sync-profile.ts` | New — indexes contact, skills, work experience, testimonials, availability into Qdrant |
| `scripts/sync-qdrant.ts` | Unchanged — still the main project sync script |
| `scripts/run-rag-eval.ts` | New — runs the eval set against live Qdrant + Groq, saves results to JSON |
| `scripts/rag-eval-set.json` | New — 20 evaluation questions with expected sources and behaviors |
| `scripts/rag-eval-results-baseline.json` | New — baseline results from the last eval run |
| `RAG_IMPROVEMENT_PLAN.md` | Updated plan (already in repo) |

---

## Qdrant Collections

| Collection | Embedding model | Dims | Status |
|---|---|---|---|
| `chat_memories` | bge-small-en-v1.5 | 384 | Legacy — keep as rollback, do not delete yet |
| `chat_memories_v2` | bge-large-en-v1.5 | 1024 | **Production** — 22 docs (17 projects + 5 profile) |

---

## What's Indexed Right Now

**Projects (17):**
- Mood Ride, Moteregna, Mindflix, AI By The Hour, polyline_tools, Ordo, AI-Workspace, Tenacious Conversion Engine, SalesConversion-Bench, Data Contract Enforcer, Document Intelligence Refinery, Axiom Ledger, DataAgentBench Evaluation Fork, Brownfield Cartographer, GitHub Evaluator / Automaton Auditor, Project Chimera, TRP1 AI Artist

**Profile chunks (5):**
- Contact & Availability, Technical Skills & Expertise, Work Experience, Client Testimonials, Availability, Services & Engagement

---

## Known Gaps (Resume Here)

### 1. Education chunk missing
The chatbot returns "I don't have that detail" for education questions. Need to provide:
- Degree and field of study
- University / institution
- Graduation year or expected year
- Any notable coursework, GPA, or honors

Then add it to `scripts/sync-profile.ts` as a new `education` chunk and re-run `npx tsx scripts/sync-profile.ts`.

### 2. New projects not yet indexed
~10 new projects are being prepared (descriptions, screenshots, etc.). Once ready:

```bash
# After adding projects to MongoDB:
npx tsx scripts/sync-qdrant.ts

# Then re-run eval to see improvement:
npx tsx scripts/run-rag-eval.ts
# Rename output to rag-eval-results-v2.json to compare against baseline
```

### 3. Testimonials retrieval — RESOLVED
"What do people say about working with Natnael?" retrieves Client Testimonials at 0.684 with bge-large. Fixed.

### 4. Phase 4: Hierarchical chunking — wait for new projects
Current projects are mostly 200-600 word summaries. Splitting them would create tiny fragments. Once detailed new projects are added (architecture docs, problem/solution sections, metrics), implement per-project multi-chunk indexing:
- `overview` chunk (always created)
- `problem_solution` chunk (if substantial content)
- `architecture` chunk (if architecture field is filled)
- `metrics_impact` chunk (if metrics field is filled)
- `detailed_content` chunks (split at paragraph boundaries, 150+ words each)

Update `syncProjectToQdrant` in `lib/qdrant-sync.ts` to produce multiple points per project instead of one.

### 5. Phase 5 is done (bge-large) but embedding cold start remains
`BAAI/bge-large-en-v1.5` on HuggingFace still has a cold-start problem (5-15s on first call after inactivity). Once budget allows, add `OPENAI_API_KEY` and switch to `text-embedding-3-small`:
- Always warm (no cold start)
- 1536 dims (better than bge-large's 1024)
- ~$0.02 per 1M tokens (negligible for portfolio traffic)
- Requires creating `chat_memories_v3` and full re-sync

### 6. `web-vs-mobile-experience` retrieval miss
The query "Compare his web and mobile experience" returned 0 results — Work Experience scored below 0.55. The query is too abstract for the embedding to match the chunk. Fix options:
- Add a `web_mobile_experience` dedicated profile chunk with a header like "Natnael's web development and mobile development experience comparison"
- Or lower threshold to 0.50 (risks more noise, not recommended)
- Will likely self-resolve once the Work Experience chunk is richer after new projects are added

### 7. Prompt injection — LLM-level defense weak
The eval script bypasses the HTTP route's input guard (23 patterns) and calls `searchMemories` + Groq directly. At LLM level, the Security section in the system prompt was insufficient — the model answered "Hello, I am Claude." In **production**, the HTTP guard catches this before the LLM is invoked. If tightening LLM-level defense is needed:
- Strengthen the Security instruction: add "Never claim to be Claude or any named AI"
- Or add an output filter pass on the streamed response

### 8. `demo-url-request` — link not surfaced
Retrieved polyline_tools at 0.751 but model answered "I don't have that detail." The project's GitHub/pub.dev link may not be stored in its Qdrant payload `content` field. Check that `formatProjectMemory` in `lib/qdrant-sync.ts` includes the `links` array for this project, then re-run `npx tsx scripts/sync-qdrant.ts`.

### 9. Phase 3.5/3.6: Metadata-aware retrieval + Hybrid search — wait for eval evidence
After new projects are added and the eval is re-run, check if any questions still fail to retrieve the right project by name. If exact-name failures appear (e.g., "Tell me about Project X" returns unrelated results), that's the signal to add:
- Qdrant payload text filters for slug/title exact match
- A BM25 keyword pass merged with vector scores

---

## Commands to Resume

```bash
# Add education to Qdrant (after user provides education data)
npx tsx scripts/sync-profile.ts

# After adding new projects to MongoDB
npx tsx scripts/sync-qdrant.ts

# Re-run evaluation
npx tsx scripts/run-rag-eval.ts

# Type check
npx tsc --noEmit

# Dev server
npm run dev
```

---

## Eval Baseline (bge-large v2, 2026-05-20)

Full results in `scripts/rag-eval-results-baseline.json`.

| Metric | Baseline |
|---|---|
| Source hit rate | **85%** (17/20) |
| Zero-result questions | 5 (3 expected: education, off-topic, injection; 2 unexpected: web-vs-mobile, follow-up) |
| Avg retrieval latency | **1365ms** (warm HF model) |
| Avg generation latency | **716ms** |

Targets to beat after new projects are added:
- Source hit rate: ≥ 90% (18/20)
- Zero unexpected zero-results: ≤ 1
- Avg retrieval latency: < 1200ms (warm HF model)
- Injection defense: HTTP guard blocks 100% before LLM (already achieved)

---

## Decision Log

| Decision | Reason |
|---|---|
| Profile chunks capped at 2 per retrieval | Profile chunks score 0.73-0.79 broadly, crowding out project chunks at 0.63-0.68 |
| Fetch 3× wider pool from Qdrant | With cap at 2 profiles, need wider pool so project chunks make it into candidate set |
| No judge/reranker LLM | 22 docs is too small to justify extra LLM call latency; heuristic reranking sufficient |
| bge-large over OpenAI embeddings | No OPENAI_API_KEY available; bge-large is meaningful upgrade (384→1024 dims) without new key |
| Phase 4 chunking deferred | Current projects are short summaries; splitting produces tiny fragments. Revisit with detailed new projects |
| chat_memories kept as rollback | v1 collection untouched; safe to delete after v2 proves stable over 1-2 weeks |
