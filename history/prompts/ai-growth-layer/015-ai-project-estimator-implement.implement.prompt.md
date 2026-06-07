---
id: "015"
title: "Phase 6 AI project estimator"
stage: "implement"
date: "2026-05-02"
surface: "agent"
model: "claude-sonnet-4-7"
feature: "ai-project-estimator"
branch: "003-ai-growth-layer"
user: "Asad Shabir"
command: "/"
labels: ["ai-estimator", "backend", "frontend", "groq", "multilingual"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "backend/api/schemas/estimator.py"
  - "backend/api/routes/estimator.py"
  - "backend/api/index.py"
  - "backend/services/estimator_service.py"
  - "src/lib/estimatorService.ts"
  - "src/components/ProjectEstimator.tsx"
  - "src/pages/Index.tsx"
  - "src/components/ChatBot.tsx (duplicate useAnalytics import removed)"
  - "backend/tests/test_estimator.py"
tests:
  - "backend/tests/test_estimator.py — 11/11 tests passed (validation, rate-limit, schema)"
  - "All 48 backend tests passing (37 existing + 11 new)"
  - "TypeScript — zero errors (tsc --noEmit)"
---

## Prompt

Implement Phase 6 — AI Project Estimator for Branch 003-ai-growth-layer.

Goal: Build a real AI Project Estimator that helps visitors describe a project and receive: complexity level, rough timeline, suggested stack, key risks, next steps. Uses Groq / AI backend pattern already in the project. Supports English, Urdu, and Sindhi. Tracks estimator_use analytics event.

OODA Loop approach: Observe → Orient → Decide → Act.

## Response snapshot

### Audit Summary
All existing features verified:
- Homepage, case studies, analytics, email capture, contact form, chatbot, admin dashboard all in place
- Groq integration pattern established in `chatbot_service.py` using httpx + async client
- Language detection pattern in `guardrails.py` for en/ur/sd
- Analytics service with `estimator_use` event already in EventType
- `useAnalytics` hook already has `trackEstimator(complexity?)` method
- ChatBot.tsx had duplicate `import { useAnalytics }` on line 9 — fixed

### Architecture Decision
Chosen: Section on homepage (between Experience and Contact) — best conversion placement, not intrusive, natural flow after seeing Asad's work.

**Backend**: POST /api/estimate → EstimatorService → Groq → structured JSON response
**Request**: `{ project_description: string (20-2000 chars), language: "en"|"ur"|"sd" }`
**Response**: Structured JSON with complexity, timeline, stack, risks, next_steps, disclaimer
**Rate limit**: 10/IP/60s (same pattern as chatbot)
**Output**: Validated Pydantic model, guard against malformed JSON from model

### Files Created

**backend/api/schemas/estimator.py** — Pydantic schemas:
- `EstimateRequest`: project_description (20-2000 chars), language (en/ur/sd)
- `EstimateResponse`: complexity, timeline, stack, risks, next_steps, disclaimer

**backend/services/estimator_service.py** — Groq integration:
- System prompt enforces JSON-only output with explicit schema
- Safe JSON extraction (handles markdown fences, partial JSON)
- `EstimateParseError` for parse failures → 503
- `EstimatorService.estimate(project_description, language)` → dict
- Singleton pattern `get_estimator_service()`

**backend/api/routes/estimator.py** — FastAPI route:
- IP rate limiting (10/IP/60s)
- Calls `get_estimator_service().estimate()`
- Emits `track_event("estimator_use", metadata={"source_page": language})`
- Returns `EstimateResponse`

**backend/api/index.py** — Added estimator router mount

**src/lib/estimatorService.ts** — Frontend API client:
- `getEstimate(projectDescription, language)` → `EstimateResponse`
- 45s timeout, AbortController
- Status code → user-friendly error messages

**src/components/ProjectEstimator.tsx** — UI component:
- Form with textarea (20-2000 chars) + submit
- Loading state (spinner + "Analyzing your project...")
- Success state: 5-section result card (Complexity, Timeline, Stack, Risks, Next Steps)
- Error state (toast notification)
- Reset action ("Try another project")
- Multilingual labels for en/ur/sd
- Mobile responsive, premium glass styling
- `trackEstimator(result.complexity?.level)` on success

**src/pages/Index.tsx** — Added ProjectEstimator import + placed between Experience and Contact

**backend/tests/test_estimator.py** — 11 tests covering:
- Validation (too short, missing, empty, invalid language, valid, Urdu, Sindhi)
- Rate limiting (429 after 10)
- Response schema (all required keys present)

### Bugs Fixed
- Duplicate `import { useAnalytics }` removed from ChatBot.tsx line 9
- TypeScript `import type` deduplication in ProjectEstimator.tsx

## Outcome

- ✅ Impact: Phase 6 AI Project Estimator fully implemented and tested. 48/48 backend tests pass. Zero TypeScript errors. Groq integration using existing pattern. Analytics wired. Multilingual support (en/ur/sd). Rate limited. Structured JSON output. Premium UI.
- 🧪 Tests: 11 new estimator tests; 48 total passing. 0 TS errors.
- 📁 Files: 10 files created/modified (3 backend, 1 service, 2 frontend, 1 page, 1 fix, 1 test)
- 🔁 Next prompts: add "contact me" CTA in estimator result card, add budget range estimation, add share/copy estimate feature
- 🧠 Reflection: The estimator follows the established Groq pattern from chatbot_service.py closely. The main challenge was ensuring the LLM returns valid JSON — solved with explicit schema in system prompt and safe JSON extraction fallback.

## Evaluation notes (flywheel)

- Failure modes observed: LLM JSON parsing failure (handled with multi-stage extraction and graceful 503); duplicate import in ChatBot.tsx was pre-existing
- Graders run and results (PASS/FAIL): tsc --noEmit — PASS; pytest 48/48 — PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add complexity level badge in result card header for quick visual scan