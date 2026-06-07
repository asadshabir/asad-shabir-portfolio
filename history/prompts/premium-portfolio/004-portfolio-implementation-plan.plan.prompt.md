---
id: "004"
title: "Portfolio Implementation Plan"
stage: "plan"
date: "2026-05-01"
surface: "agent"
model: "sonnet"
feature: "premium-portfolio"
branch: "002-premium-portfolio"
user: "Asad Shabir"
command: "/sp.plan"
labels: ["portfolio", "plan", "fastapi", "groq", "resend", "serverless"]
links:
  spec: "specs/002-premium-portfolio/spec.md"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "specs/002-premium-portfolio/plan.md"
  - "specs/002-premium-portfolio/research.md"
  - "specs/002-premium-portfolio/data-model.md"
  - "specs/002-premium-portfolio/contracts/api-contracts.md"
  - "specs/002-premium-portfolio/quickstart.md"
tests:
  - "none (plan phase)"
---

## Prompt

/sp.plan

Create a technical implementation plan for the Asad Shabir portfolio. Features: premium UI, dynamic navbar, sidebar, contact backend (Python), chatbot (OpenAI Agents SDK/Groq), EN/UR/SI support, resume download. Implementation priorities: 1. UI polish + navbar, 2. Contact section fix, 3. Resume download, 4. Contact backend, 5. Chatbot backend, 6. Tests.

## Response snapshot

Implementation plan created for 002-premium-portfolio:
- Technical context: Python 3.11 backend, FastAPI, Groq (OpenAI-compatible), Resend, Vercel serverless
- Constitution check: All 16 principles pass (simplicity justified via Python backend)
- Project structure: frontend (refined Vite+React) + backend (Python FastAPI)
- Phase 0 research: Resolved all 4 unknowns (OpenAI Agents SDK PyPI doesn't exist → use direct Groq API)
- Phase 1 artifacts: research.md, data-model.md, contracts/api-contracts.md, quickstart.md
- Entities: ContactFormSubmission, ChatMessage, ConversationSession, ResumeAsset, RateLimitEntry
- 3 API contracts: POST /api/contact, GET /api/resume, POST /api/chat
- Agent context updated via update-agent-context.ps1

## Outcome

- ✅ Impact: Plan complete with all phases executed
- 🧪 Tests: None (plan phase)
- 📁 Files: 5 created (plan.md, research.md, data-model.md, contracts/api-contracts.md, quickstart.md)
- 🔁 Next prompts: /sp.tasks to generate task list
- 🧠 Reflection: Key finding — OpenAI Agents SDK PyPI doesn't exist; using direct Groq API with custom router. FastAPI confirmed for Vercel Python runtime. Resend confirmed for email.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Pass (all gates pass, all research resolved)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a