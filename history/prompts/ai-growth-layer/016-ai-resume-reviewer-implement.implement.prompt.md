---
id: "016"
title: "Phase 7 AI resume reviewer"
stage: "implement"
date: "2026-05-02"
surface: "agent"
model: "claude-sonnet-4-7"
feature: "ai-resume-reviewer"
branch: "003-ai-growth-layer"
user: "Asad Shabir"
command: "/"
labels: ["resume-reviewer", "backend", "frontend", "groq", "multilingual"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "backend/api/schemas/reviewer.py"
  - "backend/api/routes/reviewer.py"
  - "backend/api/index.py (reviewer router mount + duplicate estimator fix)"
  - "backend/services/reviewer_service.py"
  - "src/lib/reviewerService.ts"
  - "src/components/ResumeReviewer.tsx"
  - "src/pages/Index.tsx"
  - "backend/tests/test_reviewer.py"
tests:
  - "backend/tests/test_reviewer.py — 12/12 tests passed (validation, rate-limit, schema, Urdu, Sindhi)"
  - "All 60 backend tests passing (48 existing + 12 new)"
  - "TypeScript — zero errors (tsc --noEmit)"
---

## Prompt

Implement Phase 7 — AI Resume Reviewer for Branch 003-ai-growth-layer.

Goal: Build a real AI Resume Reviewer that lets visitors paste resume text, receive strengths, weaknesses, ATS suggestions, skill-gap analysis, and improvement tips. Supports English, Urdu, and Sindhi. Tracks reviewer_use analytics event.

OODA Loop approach: Observe → Orient → Decide → Act.

## Response snapshot

### Audit Summary
All existing features verified and intact. The estimator (Phase 6) already established the Groq integration pattern. `reviewer_use` event already in `EventType`. `useAnalytics` has `trackReviewer()` method.

**Found in index.py during audit**: duplicate `estimator` import on line 58 and duplicate `app.include_router(estimator.router...)` on line 68. Fixed both.

### Architecture Decision

**Placement**: Homepage section between ProjectEstimator and Contact — natural post-estimator flow, both are AI lead magnets.

**Backend**: POST /api/review → ReviewerService → Groq → structured JSON
**Request schema**:
- `resume_text`: string (50-10000 chars) — required
- `target_role`: string (max 200) — optional
- `language`: "en"|"ur"|"sd" — default "en"

**Response schema**:
```json
{
  "ok": true,
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "ats_suggestions": ["string"],
  "skill_gaps": ["string"],
  "improvement_tips": ["string"],
  "role_fit": ["string"],
  "disclaimer": "string"
}
```

**Security**:
- Injection sanitization via `strip_injection()` from guardrails.py
- 10k character cap enforced at Pydantic validation layer (not a soft truncate)
- Rate limit: 10/IP/60s

**Output reliability**:
- System prompt enforces JSON-only output with explicit schema
- Multi-stage JSON extraction (strip markdown fences, try full parse, then partial parse)
- `ReviewerParseError` → 503 with user-friendly message

### Files Created

**backend/api/schemas/reviewer.py** — Pydantic schemas:
- `ReviewRequest`: resume_text (50-10000), target_role (optional, max 200), language (en/ur/sd)
- `ReviewResponse`: summary, strengths, weaknesses, ats_suggestions, skill_gaps, improvement_tips, role_fit, disclaimer

**backend/services/reviewer_service.py** — Groq integration:
- `sanitize_resume()`: strips injection via guardrails + enforces 10k cap
- `ReviewerService.review(resume_text, target_role, language)` → dict
- System prompts for en/ur/sd with Sindhi support
- `ReviewerParseError` for parse failures → 503

**backend/api/routes/reviewer.py** — FastAPI route:
- IP rate limiting (10/IP/60s)
- Calls `get_reviewer_service().review()` with sanitized text
- Emits `track_event("reviewer_use", metadata={target_role, language})`
- Returns `ReviewResponse`

**backend/api/index.py** — Fixed duplicate estimator import and duplicate router registration; added reviewer router mount

**src/lib/reviewerService.ts** — Frontend API client:
- `getReview(resumeText, targetRole, language)` → `ReviewResponse`
- 45s timeout, AbortController, user-friendly error messages

**src/components/ResumeReviewer.tsx** — UI component:
- Target role input (optional)
- Large textarea for resume text (50-10000 chars)
- Loading/success/error states
- Two-column grid layout for result sections (premium card design)
- Summary section (full width), list sections (2-col grid)
- Section icons from lucide-react (CheckCircle2, XCircle, FileText, etc.)
- Reset action ("Review another resume")
- Multilingual labels for en/ur/sd

**src/pages/Index.tsx** — Added ResumeReviewer import + placed between ProjectEstimator and Contact

**backend/tests/test_reviewer.py** — 12 tests:
- Validation (too short, missing, empty, invalid language, Urdu, Sindhi, over 10k chars)
- Rate limiting (429)
- Response schema (all required keys present and correct types)

### Bugs Fixed
- Duplicate `from backend.api.routes import ... estimator, estimator` in index.py line 58
- Duplicate `app.include_router(estimator.router...)` in index.py line 68

## Outcome

- ✅ Impact: Phase 7 AI Resume Reviewer fully implemented and tested. 60/60 backend tests pass. Zero TypeScript errors. Groq integration using established pattern. Analytics wired. Multilingual (en/ur/sd). Rate limited. Structured JSON. Premium 2-column result card UI.
- 🧪 Tests: 12 new reviewer tests; 60 total passing. 0 TS errors.
- 📁 Files: 9 files created/modified
- 🔁 Next prompts: add "contact me" CTA in review result, add share/copy review feature, add PDF resume file upload parsing
- 🧠 Reflection: Follows the same Groq pattern as the estimator. Main challenge was JSON reliability from the LLM — solved with explicit schema in system prompt, multi-stage extraction, and graceful 503 fallback. Also fixed a pre-existing duplicate import bug discovered during audit.

## Evaluation notes (flywheel)

- Failure modes observed: 10k char validation layer rejects too-large payloads (expected), LLM JSON parse failures (handled with graceful 503)
- Graders run and results (PASS/FAIL): tsc --noEmit — PASS; pytest 60/60 — PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add a "Book a call" CTA in the review result card to convert reviewers into leads