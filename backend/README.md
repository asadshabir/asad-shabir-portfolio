# Asad Shabir Portfolio - Backend

Production-ready Python FastAPI backend for the Asad Shabir portfolio.
Powered by Groq AI with a multi-agent chatbot system.

## Stack

- **Framework**: FastAPI
- **Runtime**: Vercel Python Serverless / Uvicorn
- **Email**: Resend API
- **AI**: Groq API (`llama-3.3-70b-versatile`) via OpenAI Agents SDK
- **Profile Data**: `asadshabir_all_info.md`

## Quick Start

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Fill in your .env values
uvicorn api.index:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/resume` | Download resume PDF |
| POST | `/api/chat` | Multi-agent chatbot |
| POST | `/api/chat/raw` | Raw Groq completion (debug) |
| GET | `/api/profile` | Structured profile data |
| POST | `/api/email-capture` | Newsletter subscription |
| POST | `/api/ai/project-estimator` | AI-powered project cost estimator |
| POST | `/api/ai/resume-reviewer` | AI-powered resume review |

## Multi-Agent Chatbot Architecture

The chatbot uses a 4-agent system with a repair validation layer:

```
User Input
    │
    ▼
┌─────────────┐
│   Router    │  ← Classifies intent (keyword + LLM)
└──────┬──────┘
       │
       ├───────────────────────────────┐
       ▼                               ▼
  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐
  │ Profile │  │ Projects │  │Technical│  │ Fallback │
  │ Agent   │  │  Agent   │  │  Agent  │  │  Agent   │
  └────┬────┘  └────┬─────┘  └────┬────┘  └────┬─────┘
       │            │             │             │
       └────────────┴─────────────┴─────────────┘
                           │
                           ▼
               ┌─────────────────────┐
               │     Repair Agent    │  ← Validates: IDENTITY, GROUNDING,
               │  (1 retry on fail)  │    TONE, LANGUAGE, SAFETY, OFF_TOPIC
               └──────────┬──────────┘
                          │
                          ▼
                       Response
```

### Agents

| Agent | Intent | Description |
|-------|--------|-------------|
| **Router** | All inputs | Classifies user message into profile/projects/technical/fallback |
| **Profile** | Background, family, education | Speaks in first person as Asad, warm tone |
| **Projects** | Portfolio, work history | Structured, professional, project details |
| **Technical** | Skills, tech stack, tools | Precise, detailed, programming knowledge |
| **Fallback** | Greetings, off-topic | Polite deflection with on-brand redirect |
| **Repair** | All outputs | 6-point validation checklist, 1 retry on failure |

### Function Tools

Each specialist can call structured data tools:

- `get_profile_info()` — Personal profile from `asadshabir_all_info.md`
- `get_projects()` — Portfolio projects and resume highlights
- `get_technical_skills()` — Skills, tech stack, experience
- `get_contact_info()` — Email, phone, portfolio URL

## Language Support

The chatbot responds in the detected language:
- **EN** — English
- **UR** — اردو (Urdu)
- **SD** — سنڌي (Sindhi)

Language is detected via `detect_language()` from the user's message, or passed explicitly.

## Session Management

In-memory session store with:
- 30-minute TTL
- Rolling window of last 10 messages
- Session ID auto-generation (`sess_<timestamp>`)

## Safety

- Prompt injection stripping (`strip_injection()`)
- Rate limiting: 10 requests/IP/600s for `/chat`, 5/IP/600s for `/chat/raw`
- Repair agent guards against: fabricated claims, third-person identity breaches, off-brand tone

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `FRONTEND_URL` | Your frontend domain |
| `RESEND_API_KEY` | Resend email API key |
| `MAIL_TO` | Recipient email (asadshabir505@gmail.com) |
| `GROQ_API_KEY` | Groq API key |
| `MODEL_NAME` | Model to use (`llama-3.3-70b-versatile`) |
| `GROQ_BASE_URL` | Groq base URL (`https://api.groq.com/openai/v1`) |
| `ENVIRONMENT` | `development` or `production` |

## Project Structure

```
backend/
├── api/
│   ├── index.py                    # FastAPI entrypoint
│   ├── routes/
│   │   ├── chatbot.py              # POST /api/chat, /api/chat/raw
│   │   ├── profile.py             # GET /api/profile
│   │   ├── health.py              # GET /api/health
│   │   ├── contact.py             # POST /api/contact
│   │   ├── resume.py              # GET /api/resume
│   │   ├── estimator.py           # POST /api/ai/project-estimator
│   │   ├── reviewer.py            # POST /api/ai/resume-reviewer
│   │   └── email_capture.py        # POST /api/email-capture
│   └── schemas/
│       └── chatbot.py              # ChatRequest, ChatResponse
├── services/
│   ├── groq_client.py              # AsyncGroq client
│   ├── profile_loader.py           # Loads asadshabir_all_info.md
│   ├── session_store.py            # In-memory session management
│   ├── guardrails.py               # detect_language, strip_injection
│   ├── agent_router.py             # Router agent + specialist dispatch
│   ├── agent_profile.py            # Profile specialist
│   ├── agent_projects.py           # Projects specialist
│   ├── agent_technical.py          # Technical specialist
│   ├── agent_fallback.py           # Fallback specialist
│   ├── agent_repair.py             # Repair agent + validation
│   ├── tools_profile.py            # get_profile_info function tool
│   ├── tools_projects.py           # get_projects function tool
│   ├── tools_technical.py          # get_technical_skills function tool
│   └── tools_contact.py            # get_contact_info function tool
├── core/
│   ├── config.py                   # Settings from environment
│   ├── logging.py                  # Structured logging
│   └── security.py                 # IP extraction, rate limit keys
├── tests/
│   ├── test_agent_router.py        # Router intent classification
│   ├── test_agent_tools.py         # Function tools
│   ├── test_agent_repair.py        # Repair validation
│   ├── test_session_store.py       # Session management
│   └── test_chatbot.py            # Chat endpoint tests
├── requirements.txt
├── .env.example
└── README.md
```

## Testing

```bash
# Run all tests
pytest backend/tests/ -v

# Run only agent tests
pytest backend/tests/test_agent_router.py backend/tests/test_agent_tools.py backend/tests/test_agent_repair.py backend/tests/test_session_store.py -v

# Run with coverage
pytest backend/tests/ --cov=backend --cov-report=term-missing
```

## Deployment (Vercel)

1. Set up Vercel Python runtime
2. Configure environment variables in Vercel dashboard
3. Deploy — entrypoint is `api/index.py`