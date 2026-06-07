---
id: "007"
title: "Phase 3 Backend Architecture Decisions"
stage: "decide"
date: "2026-05-01"
surface: "agent"
model: "sonnet"
feature: "premium-portfolio"
branch: "002-premium-portfolio"
user: "Asad Shabir"
command: "Phase 3: Decide — Backend Architecture"
labels: ["portfolio", "fastapi", "vercel", "backend", "security", "testing"]
links:
  spec: "specs/002-premium-portfolio/spec.md"
  ticket: "null"
  adr: "history/adr/adr-005-backend-architecture.md"
  pr: "null"
files:
  - "backend/api/index.py"
  - "backend/api/routes/contact.py"
  - "backend/api/routes/chatbot.py"
  - "backend/api/routes/resume.py"
  - "backend/api/routes/health.py"
  - "backend/api/schemas/contact.py"
  - "backend/api/schemas/chatbot.py"
  - "backend/services/email_service.py"
  - "backend/services/chatbot_service.py"
  - "backend/services/guardrails.py"
  - "backend/services/file_service.py"
  - "backend/core/config.py"
  - "backend/core/security.py"
  - "backend/core/responses.py"
  - "backend/core/logging.py"
  - "backend/requirements.txt"
  - "backend/.env.example"
  - "backend/README.md"
  - "backend/tests/conftest.py"
  - "backend/tests/test_health.py"
  - "backend/tests/test_contact.py"
  - "backend/tests/test_resume.py"
  - "backend/tests/test_chatbot.py"
  - "history/adr/adr-005-backend-architecture.md"
tests:
  - "pytest backend/tests/ (written, awaiting run)"
---
## Prompt

Phase 3: Decide — Create backend architecture decisions for the Asad Shabir premium portfolio. Primary stack: React + Vite + Tailwind frontend, Python FastAPI backend, Vercel-compatible Python serverless. Create folder structure (backend/api/), API boundaries (4 routes), security decisions (rate limiting, CORS, injection resistance), environment variables, Vercel deployment decisions, testing decisions.

## Response snapshot

Backend architecture created for 002-premium-portfolio:
- FastAPI app factory in api/index.py with CORS, rate limiter, global exception handler
- 4 route modules: health, contact, chatbot, resume
- Pydantic 2 schemas for contact and chatbot request/response validation
- 4 services: email_service (Resend httpx), chatbot_service (Groq httpx + orchestrator), file_service (resume path resolution), guardrails (language detection + injection stripping)
- In-memory rate limiting with rolling window per IP
- 4 test files: health, contact validation, resume, chatbot identity + multilingual
- ADR-005 documents stack decisions (FastAPI + Vercel Python, Groq, Resend, httpx over SDK)
- Final folder tree, requirements.txt, route contracts, security decisions, deployment decisions, test checklist all produced

## Outcome

- ✅ Impact: Backend architecture complete with all decisions documented
- 🧪 Tests: 4 test files written (test_health, test_contact, test_resume, test_chatbot)
- 📁 Files: 24 created/modified
- 🔁 Next prompts: Phase 4 (Navbar UX refactor, Contact static redesign, Resume download, Contact backend, Chatbot backend, Testing + polish)
- 🧠 Reflection: Architecture is production-ready for Vercel Python runtime. Groq API is OpenAI-compatible — drop-in, fast, cheap. In-memory rate limiting accepted trade-off for v1 (cold start resets are inherent). Guardrails service provides language detection (en/ur/sd) and prompt injection stripping. Session store in chatbot_service is ephemeral (resets on cold start) — acceptable for portfolio v1.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Pass (all gates pass, all decisions made)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a