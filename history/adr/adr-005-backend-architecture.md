# ADR-005: Backend Architecture — FastAPI + Vercel Python Runtime

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-05-01
- **Feature:** premium-portfolio

<!-- Significance checklist (ALL must be true to justify this ADR
     1) Impact: Long-term consequence for architecture/platform/security? YES
     2) Alternatives: Multiple viable options considered with tradeoffs? YES
     3) Scope: Cross-cutting concern (not an isolated detail)? YES
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

Python FastAPI backend deployed on Vercel Python serverless runtime, with Groq API for AI and Resend for email.

### Stack Components

- **Framework**: FastAPI 0.115+ with Pydantic 2
- **Runtime**: Vercel Python (api/index.py entrypoint)
- **Email**: Resend API (httpx, no SDK dependency)
- **AI**: Groq API via direct httpx (OpenAI-compatible, no SDK)
- **Rate Limiting**: In-memory rolling window (dict + datetime)
- **Validation**: Pydantic 2 schemas
- **Security**: HTML/prompt injection stripping, IP extraction, CORS

### Project Structure

```
backend/
├── api/
│   ├── index.py              # FastAPI factory, CORS, rate limiter
│   ├── routes/
│   │   ├── contact.py       # POST /api/contact
│   │   ├── chatbot.py        # POST /api/chat
│   │   ├── resume.py         # GET /api/resume
│   │   └── health.py         # GET /api/health
│   ├── schemas/
│   │   ├── contact.py        # ContactRequest / ContactResponse
│   │   └── chatbot.py         # ChatRequest / ChatResponse
│   └── services/
│       ├── email_service.py   # Resend httpx wrapper
│       ├── chatbot_service.py # Groq httpx wrapper + orchestrator
│       ├── file_service.py    # Resume path resolution
│       └── guardrails.py      # Language detection, injection stripping
└── core/
    ├── config.py              # pydantic-settings (no pydantic-settings dep)
    ├── logging.py             # Structured logging
    ├── responses.py           # ErrorResponse, ok_response helpers
    └── security.py            # IP extraction, rate limit keys
```

## Consequences

### Positive

- Fastest path to Vercel deployment (native Python support)
- Groq is OpenAI-compatible — drop-in, cost-effective, fast inference
- httpx over SDK = fewer dependencies, full control
- Pydantic 2 = native type coercion, validation, error messages
- Service-layer separation = testable, clean routing
- In-memory rate limiting = zero infrastructure for v1

### Negative

- Vercel Python cold starts (2-5s) — acceptable for low-traffic portfolio
- In-memory rate limiting = resets on cold start (no sticky sessions)
- No persistent sessions — session store resets on cold start
- No database (intentional for v1) — all state is ephemeral

## Alternatives Considered

### Alternative A: Next.js API Routes
- Rejected: Mixing React frontend with Next.js API adds framework coupling
- Python backend is isolated, deployable separately, easier to test

### Alternative B: Node.js Express backend
- Rejected: Python ecosystem (Groq, Resend) more natural for AI + email
- FastAPI's Pydantic integration superior for validation

### Alternative C: Supabase Edge Functions
- Rejected: Adds vendor dependency without benefit over Vercel Python
- Resend + Groq = already serverless-native

### Alternative D: LangChain / OpenAI Agents SDK
- Rejected: Overkill for simple persona chatbot; adds latency and dependency surface
- Custom orchestrator + direct Groq API = simpler, faster, cheaper

## References

- Feature Spec: specs/002-premium-portfolio/spec.md
- Plan: specs/002-premium-portfolio/plan.md
- API Contracts: specs/002-premium-portfolio/contracts/api-contracts.md
- Data Model: specs/002-premium-portfolio/data-model.md
- Constitution: .specify/memory/constitution.md (Principles V, VII, IX, XIV, XV)