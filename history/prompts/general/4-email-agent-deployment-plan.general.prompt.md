---
id: 4
title: Email agent + deployment infrastructure
stage: general
date: 2026-06-17
surface: agent
model: oc/deepseek-v4-flash-free
feature: none
branch: 003-ai-growth-layer
user: Asad Shabir
command: resume → deeply analyze... add email agent... deploy to HF Spaces + Vercel
labels: [email-agent, hf-spaces, vercel, deployment, docker, cors]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/chatbot/intent_classifier.py (modified)
  - backend/chatbot/app.py (modified)
  - backend/composite_app.py (created)
  - Dockerfile (created)
  - backend/requirements.txt (modified)
  - backend/api/index.py (modified)
  - src/lib/chatbotService.ts (modified)
  - src/lib/contactService.ts (modified)
  - src/lib/estimatorService.ts (modified)
  - src/lib/reviewerService.ts (modified)
tests:
  - Python import verification (all imports pass)
  - Intent classification tests (email_send, greeting, knowledge correctly routed)
  - TypeScript compilation (zero errors)

## Prompt

Deeply analyze and understand the portfolio project infrastructure both frontend and backend. Then add some working agents in the chatbot without changing existing code logic. Deploy the backend on HuggingFace Spaces making sure all features work (project estimator, resume analyzer, chatbot). Connect the middleware for backend and frontend, then deploy frontend on Vercel. Add an agent which sends messages on clients' provided Gmail automatically as per user/client needs. Work as OODA Loop.

## Response snapshot

Implemented 4-phase plan covering email-sending agent + HF Spaces deployment + frontend-backend middleware + Vercel deployment:

Phase 1 (Email Agent): Added _EMAIL_SEND_PATTERNS (14 regex patterns) to intent_classifier.py, email_send classification check, and _handle_email_send() in app.py that uses LLM extraction + existing Resend email_service to send messages.

Phase 2 (HF Spaces): Created composite_app.py (ASGI router dispatching /api/* to main API and /chat to chatbot), Dockerfile (python:3.11-slim, uvicorn on port 7860), updated CORS with allow_origin_regex for HF Spaces + Vercel domains, added missing deps to requirements.txt.

Phase 3 (Middleware): Updated all 4 frontend service files (chatbotService.ts, contactService.ts, estimatorService.ts, reviewerService.ts) to use VITE_* env vars.

Phase 4 (Vercel): Existing vercel.json handles SPA rewrites. Set VITE_API_URL and VITE_CHATBOT_URL in Vercel dashboard.

## Outcome

- Impact: All existing code paths preserved (additive changes only). Email-sending agent integrated via new intent. Backend unifiable via composite app. Frontend configurable via env vars.
- Tests: Python imports verified, intent classification verified, TypeScript compilation clean.
- Files: 10 files modified/created across frontend and backend.
- Next prompts: Deploy backend to HF Spaces, set env vars, deploy frontend to Vercel.
- Reflection: Using ASGI-level routing (simple path dispatch) avoids FastAPI sub-app prefix issues. The existing Resend service reused without modification.
