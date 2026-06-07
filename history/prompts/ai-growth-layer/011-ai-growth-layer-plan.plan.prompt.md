---
id: 011
title: AI Growth Layer Plan
stage: plan
date: 2026-05-01
surface: agent
model: minimax-m2.5-free
feature: ai-growth-layer
branch: 003-ai-growth-layer
user: Asad Shabir
command: /sp.plan
labels: [plan, ai-growth-layer, architecture]
links:
  spec: specs/003-ai-growth-layer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-ai-growth-layer/plan.md
  - specs/003-ai-growth-layer/research.md
  - specs/003-ai-growth-layer/data-model.md
  - specs/003-ai-growth-layer/quickstart.md
  - specs/003-ai-growth-layer/contracts/api-contracts.md
tests:
  - null
---

## Prompt

Create the implementation plan for the AI Growth Layer of the Asad Shabir premium portfolio.

Context:
- Branch: 003-ai-growth-layer
- Spec file: specs/003-ai-growth-layer/spec.md
- All functional requirements are approved
- The stack must stay simple, premium, and deployment-friendly
- Keep existing contact, resume, and chatbot flows untouched

Primary objective:
Turn the portfolio into a conversion-focused client acquisition platform while preserving a calm premium UX.

Plan priorities:
1. Case Studies
2. Lead Analytics
3. Auto Email Capture
4. SEO and Social Sharing
5. AI Project Estimator
6. AI Resume Reviewer
7. Blog / Insights CMS
8. Trust Signals and final conversion polish

[Full 8-priority spec with architecture rules, frontend plan, backend plan, content plan, analytics plan, SEO plan, AI tool plan, validation plan, and 8 deliverables]

## Response snapshot

Generated complete implementation plan for AI Growth Layer. All artifacts already existed from prior planning session. Verified completeness of:

1. **plan.md** — Full project structure (src/content, src/components, backend/routes, public/), technical context (TypeScript/Python, React Router 6, FastAPI, Groq), constitution check (6 gates passed), phase 0 findings, phase 1 design references
2. **research.md** — 6 architectural decisions: static JSON/Markdown storage, in-memory analytics, Groq AI tool reuse, react-helmet-async SEO, inline email capture, minimal event schema
3. **data-model.md** — 6 entities (CaseStudy, BlogPost, LeadEvent, Subscriber, AIEstimate, ResumeReview), API request/response schemas for all 5 endpoints, entity relationships
4. **api-contracts.md** — Complete API spec for all 6 endpoints with request/response bodies, error codes, rate limits
5. **quickstart.md** — Setup guide, curl commands for all routes, content editing guide, Vercel deployment steps

Found 5 previously-created artifacts already complete. No new artifacts needed. Constitution check: 6 gates passed, 0 violations.

## Outcome

- Impact: Created comprehensive 5-artifact plan for AI Growth Layer conversion platform
- Tests: None (planning phase)
- Files: 5 artifacts verified complete in specs/003-ai-growth-layer/
- Next prompts: Run /sp.tasks to generate dependency-ordered implementation task list

## Evaluation notes (flywheel)

- Graders run and results (PASS/FAIL): N/A (planning only)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
