---
id: 001
title: Chatbot-migration-OpenRouter
stage: green
date: 2026-05-30
surface: agent
model: claude-sonnet-4-6
feature: 003-ai-growth-layer
branch: 003-ai-growth-layer
user: Asad Shabir
command: "Fix chatbot error, migrate all AI services to OpenRouter, rewrite chatbot with agentic architecture"
labels: ["chatbot", "openrouter", "openai-agents-sdk", "ai-migration", "multi-agent", "portfolio", "session-memory", "tools"]
links:
  spec: specs/003-ai-growth-layer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/chatbot/app.py
  - backend/chatbot/knowledge_base.py
  - backend/chatbot/tools.py
  - backend/chatbot/agent_defs.py
  - backend/services/analytics_service.py
  - backend/services/email_service.py
  - backend/services/profile_loader.py
  - backend/services/file_service.py
  - backend/services/estimator_service.py
  - backend/services/reviewer_service.py
  - backend/core/config.py
  - backend/.env.example
  - .env
  - backend/.env
  - backend/chatbot/.env
  - specs/003-ai-growth-layer/tasks.md
tests:
  - backend/tests/test_subscriber_service.py (verified passes)
  - curl /api/health, /api/estimate, /api/review, /api/analytics/track, /api/subscribe, /chat (all verified)
---

## Prompt

The conversation covered two major tasks:

1. **Fix chatbot showing "Network error"** — The chatbot backend was using Groq API that wasn't configured, while estimator/reviewer services were completely missing (their route files imported non-existent modules).

2. **Migrate all AI to OpenRouter with intelligence** — The user requested: "change the api as openrouter api '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' and select as openrouter/free models."

3. **Advanced chatbot rewrite** — The user then requested making the chatbot wise, intelligent, context-aware with full portfolio knowledge, project data, personal bio-data, and function tools using OpenAI Agents SDK.

## Response snapshot

### Phase 1: Infrastructure Fix
Created 4 missing services that were blocking app startup:
- `analytics_service.py` — In-memory event tracking + subscriber management
- `email_service.py` — Resend email integration
- `profile_loader.py` — Static portfolio profile data
- `file_service.py` — Resume PDF resolution

### Phase 2: OpenRouter Migration
Updated all AI services and configs from Groq to OpenRouter:
- `estimator_service.py` — Nemotron 30B free model with JSON repair
- `reviewer_service.py` — Nemotron 30B free model with sanitize_resume + JSON repair
- `chatbot/app.py` — OpenRouter client + model config
- `backend/core/config.py` — Added OPENROUTER_API_KEY, removed GROQ_API_KEY
- All `.env` files updated with the user's actual API key

### Phase 3: Intelligent Chatbot Architecture
Complete rewrite using OpenAI Agents SDK with:
- **agent_defs.py** — 5 specialist agents with proper handoffs (ProjectExpert, SkillsExpert, BioExpert, SalesExpert, GeneralAssistant)
- **knowledge_base.py** — Real portfolio data loader (case studies, skills, projects, bio)
- **tools.py** — 7 function tools that load live data: `get_portfolio_projects_tool`, `get_skills_tool`, `get_case_studies_tool`, `get_personal_info_tool`, `get_contact_details_tool`, `get_service_overview_tool`
- **Session memory** — 30-min TTL, last 8 messages context window
- **CORS** — Configured for Vite dev server

### Verified Working Endpoints
All endpoints verified with curl:
- GET /api/health → {"status":"ok"}
- POST /api/estimate → Full structured estimate (complexity, timeline, stack, risks, next_steps)
- POST /api/review → Full structured review (summary, strengths, weaknesses, ATS, skill gaps, role fit)
- POST /chat → Intelligent responses with real portfolio knowledge, session memory
- POST /api/subscribe → Subscriber capture
- POST /api/analytics/track → Event tracking

## Outcome

- ✅ Impact: Chatbot now responds with real portfolio data, project details, case studies, skills, and personal background. Estimator and reviewer work via OpenRouter free models (Nemotron 30B / GLM-4.5-air). Session memory keeps context across turns.
- 🧪 Tests: 12+ curl tests across all endpoints. All passing.
- 📁 Files: 16 files created or modified.
- 🔁 Next prompts: The project now has a working intelligent chatbot. Remaining tasks: Phase 8 (Blog CMS), Phase 9 (Trust Signals), Phase 10 (Conversion Polish), Phase 11 (QA).
- 🧠 Reflection: The free OpenRouter models (esp. GLM-4.5-air) handle agentic handoffs well. Session memory was the missing piece for natural conversation flow.

## Evaluation notes (flywheel)

- Failure modes observed: Python module naming conflicts (agents.py shadowed the OpenAI Agents SDK pip package), missing service dependencies blocking app startup, OpenRouter free tier rate limits required fallback model selection, model_override parameter not supported in agents SDK v0.15.1 (resolved by setting model directly on each agent).
- Graders run and results (PASS/FAIL): PASS — All endpoints return correct responses. PASS — Chatbot answers projects, skills, case studies with real data. PASS — Session memory retains context. PASS — Estimator/reviewer return structured JSON matching Pydantic schemas.
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test with higher-capacity OpenRouter models when rate limits allow, benchmark response quality vs latency.
