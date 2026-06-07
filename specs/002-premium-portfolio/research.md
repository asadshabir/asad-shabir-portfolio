# Research: Premium Portfolio Website

**Branch**: `002-premium-portfolio` | **Date**: 2026-05-01
**Source**: Technical research for backend stack, chatbot orchestration, and deployment

---

## 1. OpenAI Agents SDK / Chatbot Orchestration

**Decision**: Use direct Groq API calls (OpenAI-compatible) with a custom multi-agent routing layer

**Rationale**: The `openai-agents` PyPI package does not exist as a standalone pip-installable library. The OpenAI Agents API is a hosted product requiring platform subscription. For production Python agent orchestration on this portfolio:

1. **Direct Groq API calls** — Works via OpenAI-compatible `base_url=https://api.groq.com/openai/v1`. Supports tool_use/function_calling via the Responses API. Llama 3.3 70B Versatile is fast and capable.
2. **Custom agent router** — A lightweight Python class routes messages to sub-agents (identity, Q&A, contact, language, safety). This avoids LangGraph's learning curve and dependency overhead.
3. **LangGraph** — Rejected for v1 because: adds ~15+ dependencies, steep learning curve, overkill for single-developer portfolio. Revisit if multi-agent complexity grows.

**Groq API Compatibility**:
- Base URL: `https://api.groq.com/openai/v1`
- Models: `llama-3.3-70b-versatile` (recommended), `mixtral-8x7b-32768`
- Tool calling: Supported via `tools` parameter
- Known limitations: `logprobs`, `logit_bias`, `top_logprobs` not supported; `temperature=0` auto-converted to `1e-8`

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|-----------------|
| LangGraph | Adds 15+ heavy dependencies, steep learning curve, overkill for single-user portfolio |
| CrewAI | LangChain-based complexity, heavy dependency tree |
| OpenAI Agents API (hosted) | Requires OpenAI platform subscription, costs per token |
| Anthropic Claude | Different API contract, would require full refactor vs. Groq's OpenAI compatibility |

---

## 2. FastAPI on Vercel Serverless

**Decision**: Deploy FastAPI to Vercel using Python serverless runtime

**Rationale**: Vercel has first-class Python runtime support. FastAPI (ASGI app) is auto-detected from `requirements.txt` when the entry point follows Vercel's naming convention (`api/index.py` → exports `app`).

**Vercel Python Runtime Details**:
- Entry point: `api/index.py` must export `app = FastAPI()` instance
- Framework auto-detection: FastAPI, Flask, Django supported
- Cold start: Vercel Fluid Compute reduces cold start latency
- Max execution: 10s (Hobby), 60s (Pro) per request
- Bundle size: 500MB max
- Shutdown cleanup: 500ms max

**Alternative Approaches**:
| Alternative | Rejected Because |
|-------------|-----------------|
| Netlify Functions | Less mature Python ecosystem integration |
| AWS Lambda | Manual configuration overhead, no auto-detection |
| Railway/Render | Traditional hosting, not serverless (always-on instance) |
| Keep backend in frontend (Vite proxy) | Security risk: API keys in frontend bundle |

**Vercel Python Structure**:
```
api/
└── index.py         # FastAPI app entry — MUST export 'app'
    ├── contact.py   # Contact form endpoint
    └── chat.py      # Chatbot endpoint

requirements.txt     # Python dependencies
```

---

## 3. Resend API for Email

**Decision**: Use Resend Python SDK with domain verification (SPF + DKIM)

**Rationale**: Resend provides the simplest developer experience for transactional email from a Python backend. The Python SDK (`pip install resend`) is lightweight, well-documented, and integrates cleanly with FastAPI.

**Setup Requirements**:
1. Create Resend account at resend.com
2. Add DNS records: SPF (TXT), DKIM (CNAME)
3. Verify domain (24-48h propagation)
4. Add `RESEND_API_KEY` to Vercel environment variables
5. Configure sender: `contact@asadshabir.com` (or `onboarding@resend.dev` for testing)

**Environment Variables**:
```env
RESEND_API_KEY=re_xxxxx          # Vercel dashboard — encrypted
RESEND_FROM_EMAIL=contact@asadshabir.com
RESEND_TO_EMAIL=asadshabir505@gmail.com
```

**Email Template** (simple, plain-text):
```
Subject: Portfolio Contact: {name}
From: {email}
Message:
{name} ({email}) sent a message:

{message}
```

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|-----------------|
| SendGrid | Higher volume limits but more complex setup |
| Postmark | Simple API but no free tier |
| AWS SES | Lower cost at scale but complex IAM/credentials setup |
| Gmail SMTP | Rate limits (500/day), not designed for transactional email |

---

## 4. Multi-Agent Routing Design

**Decision**: Custom lightweight agent router with sub-agents for each concern

**Architecture**:
```
User Message
    ↓
Language Detector (EN/UR/SI)
    ↓
Agent Router (orchestrator)
    ├── Identity Agent     — "I am Asad Shabir..."
    ├── Portfolio Q&A Agent — Asad's skills/projects/experience
    ├── Contact Agent      — Collects name/email/message → sends via email tool
    └── Safety Agent       — Detects off-topic, inject attempts → polite redirect
    ↓
Response (in user's language)
```

**Safety Measures** (from constitution principles):
- Strip markdown code fences (` ``` `) before sending to model
- Strip bracketed template syntax (`{{...}}`, `[[...]]`, `{%...%}`)
- Strip lines starting with `INST:`, `SYSTEM:`, `// You are`
- Tool whitelist: `send_contact_email` only
- Rate limit: 10 requests/IP/10 minutes

**Language Detection**:
- Urdu: Unicode range `؀-ۿ` (Arabic script block)
- Sindhi: Unicode range detection + heuristic
- Default: English

---

## 5. Summary: Resolved Decisions

| Topic | Decision | Confidence |
|-------|----------|------------|
| Chatbot SDK | Direct Groq API + custom router | High |
| LLM Model | Llama 3.3 70B Versatile (Groq) | High |
| Backend Framework | FastAPI (Vercel Python runtime) | High |
| Email Service | Resend Python SDK | High |
| Deployment | Vercel (Python serverless) | High |
| Multi-agent routing | Custom lightweight router | High |

---

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Groq downtime | Low | Medium | Fallback: static error message in user's language |
| Resend deliverability | Low | Medium | Test with Resend dashboard; verify domain DNS |
| Cold start latency | Medium | Low | Vercel Fluid Compute; chatbot loads on first interaction only |
| Domain verification delay | Low | Low | Use Resend's `resend.dev` sender for testing first |
| LangGraph complexity | Low | Low | Skip LangGraph for v1; custom router is simpler |
| API key exposure | Low | Critical | Vercel dashboard env vars only; never `.env` in git |