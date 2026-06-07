# Implementation Plan: Multi-Agent Chatbot (OpenAI Agents SDK + Groq)

**Branch**: `004-multiagent-chatbot` | **Date**: 2026-05-05 | **Spec**: [spec.md](./spec.md)

## Summary

Replace the existing httpx-based Groq chatbot with a production-ready OpenAI Agents SDK implementation. The new system uses a Router agent with handoff-based multi-agent orchestration (Profile, Projects, Technical, Fallback specialists), custom function tools that read from `asadshabir_all_info.md`, a Repair agent for validation, session management, rate limiting, and language detection. The entire codebase is Chainlit-free.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI 0.115+, openai-agents 1.x (or agents.OpenAI), httpx 0.28+, pydantic 2.10+
**Storage**: In-memory session store (dict with TTL), profile file read at startup and tool-call time
**Testing**: pytest (existing conftest), new tests for agent routing, tool calls, repair validation
**Target Platform**: Linux server (Vercel/serverless-compatible FastAPI)
**Project Type**: Web (FastAPI backend — extends existing `backend/` structure)
**Performance Goals**: <10s response time p95, <100MB memory, supports 100 concurrent sessions
**Constraints**: No Chainlit, no OpenAI API key, must use Groq, must read profile markdown, must support EN/UR/SD
**Scale/Scope**: Single-user portfolio chatbot, ~50-100 messages/day expected

## Constitution Check

| Principle | Status | Note |
|-----------|--------|------|
| I. Premium Experience | ✅ PASS | Multi-agent orchestration delivers intelligent, professional responses |
| XIV. Professional Chatbot | ✅ PASS | Speaks as Asad in first person, supports EN/UR/SD, stays on-brand |
| XV. Chatbot Backend Design | ✅ PASS | Tool use, multi-agent orchestration, safe function execution, voice consistency |
| XVI. Simplicity | ✅ PASS | Minimal new files, extends existing backend structure, no unnecessary complexity |
| XI. OODA Loop | ✅ PASS | Observe (spec) → Orient (research) → Decide (plan) → Act (implement) |
| XII. Phase Validation | ✅ PASS | Each phase validated before proceeding to next |
| VIII. Secrets Management | ✅ PASS | GROQ_API_KEY from env, no hardcoded keys |
| V. Subtle/Purpose Animations | N/A | No frontend animations in this scope |
| II. Polished UI | N/A | Backend only — UI is the frontend's responsibility |

**GATE STATUS**: ✅ All gates pass. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/004-multiagent-chatbot/
├── spec.md              # Feature specification (this file's input)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── api-contracts.md
```

### Source Code (backend extension)

```text
backend/
├── app.py                    # FastAPI app factory (create_app())
├── main.py                   # uvicorn entry point (run with uvicorn)
├── services/
│   ├── agent_router.py       # Router agent + handoff logic
│   ├── agent_profile.py      # Profile specialist agent
│   ├── agent_projects.py     # Projects specialist agent
│   ├── agent_technical.py     # Technical specialist agent
│   ├── agent_fallback.py     # Fallback specialist agent
│   ├── agent_repair.py       # Repair/validation agent
│   ├── tools_profile.py      # Function tools for profile data
│   ├── tools_projects.py     # Function tools for project data
│   ├── tools_technical.py     # Function tools for skills/tech
│   ├── tools_contact.py      # Function tool for contact info
│   ├── session_store.py      # In-memory session management
│   ├── guardrails.py         # Prompt injection, language detection
│   ├── profile_loader.py     # Load and cache asadshabir_all_info.md
│   └── groq_client.py        # Groq API client (httpx + AsyncOpenAI)
├── api/
│   ├── routes/
│   │   ├── chatbot.py        # /api/chat, /api/chat/raw endpoints
│   │   ├── profile.py         # /api/profile endpoint
│   │   └── health.py         # /api/health endpoint (already exists)
│   └── schemas/
│       └── chatbot.py        # Pydantic schemas (extend existing)
├── core/
│   ├── config.py             # Settings (extend for agents config)
│   └── responses.py         # Error responses (extend)
└── tests/
    ├── test_agent_router.py  # Router agent tests
    ├── test_agent_tools.py   # Tool function tests
    ├── test_agent_repair.py  # Repair agent validation tests
    ├── test_session_store.py # Session management tests
    └── conftest.py           # Shared fixtures
```

**Structure Decision**: Extend existing `backend/` structure. All new files are under `backend/services/` for agents and tools, `backend/api/routes/` for endpoints. No structural violations — consistent with existing patterns.

## Complexity Tracking

> No complexity violations. Simple extension of existing FastAPI backend.

## Phase 0: Research (COMPLETE)

- ✅ OpenAI Agents SDK handoff patterns and tool definitions resolved
- ✅ AsyncOpenAI client with Groq base URL resolved
- ✅ Repair/validation agent patterns resolved
- ✅ Documented in `research.md` — 8 key decisions

## Phase 1: Design & Contracts (COMPLETE)

- ✅ Data models defined (ChatSession, AgentMessage, ToolCall, RepairValidation, ProfileData)
- ✅ API contracts defined (POST /api/chat, /api/chat/raw, GET /api/profile, GET /api/health)
- ✅ Quickstart created with setup, usage, architecture, troubleshooting
- ✅ Agent context updated
- ✅ Documented in `data-model.md`, `contracts/api-contracts.md`, `quickstart.md`

## Phase 2: Tasks (PENDING)

Run `/sp.tasks 004-multiagent-chatbot` to generate `tasks.md` with implementation tasks.

📋 **Architectural decision detected**: Whether to use two-pass chain (specialist → repair) vs. embedding reflection prompts directly in the specialist — affects latency, cost, and quality. Document reasoning and tradeoffs? Run `/sp.adr repair-agent-architecture`.