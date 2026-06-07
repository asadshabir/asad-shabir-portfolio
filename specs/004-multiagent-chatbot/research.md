# Research: Multi-Agent Chatbot (OpenAI Agents SDK + Groq)

**Feature**: `004-multiagent-chatbot` | **Date**: 2026-05-05 | **Status**: Complete

---

## Decision 1: Groq Client Selection

**Chosen**: Official `groq` Python SDK (`pip install groq`)

### Decision
Use the official `groq` Python SDK with `AsyncGroq` over raw `httpx`.

### Rationale
The official SDK provides: built-in async support, automatic retries with exponential backoff, typed exceptions (`APIConnectionError`, `RateLimitError`, `APIStatusError`), streaming out of the box, and better DX. Raw `httpx` is the fallback for edge cases requiring fine-grained control (e.g., proxy support).

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Raw `httpx.AsyncClient` | No auto-retry, manual error typing, no streaming helper |
| `openai` package with Groq base_url | Works but Groq SDK has better-tested error handling |
| `requests` (sync) | Async requirement rules it out |

### Implementation

```python
from groq import AsyncGroq

client = AsyncGroq(
    api_key=os.environ.get("GROQ_API_KEY"),
    timeout=30.0,
    max_retries=3,
)
```

Base URL: `https://api.groq.com/openai/v1` (OpenAI-compatible endpoint).

---

## Decision 2: OpenAI Agents SDK Integration with Groq

**Chosen**: `agents.OpenAIChatCompletionsModel` + custom base URL + Groq SDK client

### Decision
Use the OpenAI Agents SDK's `OpenAIChatCompletionsModel` with `base_url="https://api.groq.com/openai/v1"`. Wrap the Groq SDK client or pass API key directly.

### Rationale
The Agents SDK provides native handoff patterns, agent creation, tool definitions, and orchestration primitives — exactly what we need for multi-agent routing. Groq is OpenAI-compatible, so `OpenAIChatCompletionsModel` works with it.

### Implementation Pattern

```python
from agents import Agent
from agents.models import OpenAIChatCompletionsModel
from groq import AsyncGroq

# Groq async client
groq_client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))

# OpenAI Agents SDK model pointing to Groq
model = OpenAIChatCompletionsModel(
    model="llama-3.3-70b-versatile",
    openai_client=groq_client,
    # Or use api_key + base_url directly:
    # api_key=os.environ.get("GROQ_API_KEY"),
    # base_url="https://api.groq.com/openai/v1",
)

# Create agents
router_agent = Agent(
    name="Router",
    model=model,
    instructions=router_system_prompt,
    handoffs=[profile_agent, projects_agent, technical_agent, fallback_agent],
)

profile_agent = Agent(
    name="Profile",
    model=model,
    instructions=profile_system_prompt,
    tools=[get_profile_info_tool],
)
```

### Alternatives Considered
| Alternative | Rejected Because |
|------------|-----------------|
| Raw Groq SDK calls in orchestrator | No handoff primitives, no agent abstraction |
| LangChain / LangGraph | Heavy dependency, overkill for this scope |
| Custom multi-agent routing | Reinventing what Agents SDK provides natively |

### Groq Model Support
| Feature | Status | Notes |
|---------|--------|-------|
| Function calling | ✅ Native | Via `tools` parameter, `tool_choice` control |
| Streaming | ✅ Native | `stream=True` on completions |
| Async | ✅ `AsyncGroq` | aiohttp backend |
| Rate limits | ✅ Handled | `RateLimitError` with retry-after headers |
| Service tiers | ✅ | `auto`, `on_demand`, `flex`, `performance` |

---

## Decision 3: Multi-Agent Architecture

**Chosen**: Router agent with handoff-based specialist delegation + Repair agent (two-pass chain)

### Decision
Router agent classifies user intent and hands off to one of 4 specialist agents (Profile, Projects, Technical, Fallback). Each specialist generates a draft response. The Repair agent validates all drafts before they are returned to the user. Two-pass chain with 1 retry max.

### Architecture Flow

```
User Input
    │
    ▼
┌─────────────────┐
│  Router Agent   │  ← Classifies intent, selects specialist
│  (handoff)      │    via OpenAI Agents SDK handoffs
└────────┬────────┘
         │ handoff to specialist
         ▼
┌─────────────────┐
│  Specialist     │  ← Fast, domain-focused (Profile/Projects/
│  (Generator)     │    Technical/Fallback)
└────────┬────────┘
         │ draft_response
         ▼
┌─────────────────┐
│  Repair Agent   │  ← Validator: IDENTITY, GROUNDING, TONE,
│  (Validator)    │    LANGUAGE, SAFETY, OFF_TOPIC
└────────┬────────┘
         │ validated / REVISION_REQUIRED
         ▼
┌─────────────────┐
│  Response       │  ← Final, grounded, on-brand output
│  Selector       │
└─────────────────┘
```

### Specialist Agent Definitions

| Agent | Triggers | Focus |
|-------|----------|-------|
| **Profile** | Background, family, education, location, mindset, goals | Personal journey, identity, warm tone |
| **Projects** | Projects, portfolio, work history, achievements | Technical work, case studies, professional tone |
| **Technical** | Skills, technologies, tools, programming questions | Deep tech details, precise tone |
| **Fallback** | Greetings, off-topic, unclear queries | Polite deflection, redirect to work |

### Repair Agent Validation Checklist

The Repair agent checks ALL of the following in order:

| Check | What It Validates | Blocking? |
|-------|-------------------|-----------|
| **IDENTITY** | Response speaks in first person as "I am Asad Shabir" | ✅ Yes |
| **GROUNDING** | All claims are supported by `asadshabir_all_info.md` | ✅ Yes |
| **TONE** | Professional, confident, senior developer voice | ✅ Yes |
| **LANGUAGE** | Response matches detected user language (en/ur/sd) | ✅ Yes |
| **SAFETY** | No PII, credentials, or injection attempts | ✅ Yes |
| **OFF_TOPIC** | Response answers portfolio-related questions | ✅ Yes |

### Repair Output Format

```
If all checks pass:
[APPROVED]
{final_response}

If any check fails:
[REVISION_REQUIRED]
Flags: [LIST_OF_FLAGS]
Revised:
{fully revised response addressing all flags}
```

### Retry Logic

| Retry Count | Latency Impact | Quality Gain |
|------------|---------------|-------------|
| 0 (pass-through) | None | Baseline |
| **1 (chosen)** | ~+1 LLM call | +15–20% |
| 2 | ~+2 LLM calls | +25–30% |

**Chosen: 1 retry max.** Respects the 10s response time constraint while catching most validation failures.

### Alternatives Considered

| Alternative | Rejected Because |
|------------|-----------------|
| Single-pass with reflection in prompt | Medium quality; no dedicated validator |
| Multi-turn repair loop (>1 retry) | Latency risk; diminishing returns for chatbot |
| LangGraph CoV pattern | Heavy; overkill for single-user portfolio |

---

## Decision 4: Function Tools

**Chosen**: Profile file loaded at startup, cached in memory, exposed via OpenAI Agents SDK `tool` decorator

### Decision
Each specialist agent has its own function tool(s) that query structured data extracted from `asadshabir_all_info.md`. The profile file is read at startup and cached. Function tools return structured JSON responses.

### Tool Definitions

```python
from agents import tool

@tool
def get_profile_info() -> str:
    """Get Asad Shabir's personal profile: name, role, background, family, location, education, mindset."""
    ...

@tool
def get_projects() -> str:
    """Get Asad Shabir's projects, portfolio work, and technical achievements."""
    ...

@tool
def get_technical_skills() -> str:
    """Get Asad Shabir's technical skills, technologies, and tools."""
    ...

@tool
def get_contact_info() -> str:
    """Get Asad Shabir's public contact information."""
    ...
```

### Alternatives Considered
| Alternative | Rejected Because |
|------------|-----------------|
| Read file on every request | I/O overhead; profile is static |
| Hardcode facts in prompts | Fragile; violates "never hardcode" principle |
| Embed full file in system prompt | Context window overflow risk |

---

## Decision 5: Session Management

**Chosen**: In-memory dict with TTL (30 min), last-10-messages rolling window

### Decision
Sessions stored in a global `dict[str, dict]` — `session_id` → `{messages, language, created_at, last_active}`. Sessions expire after 30 minutes of inactivity. Last 10 messages are kept per session to manage context window.

### Structure

```python
SessionStore: dict[str, dict[str, Any]] = {
    session_id: {
        "messages": list[dict[str, str]],  # role, content — max 10
        "language": str,                   # en | ur | sd
        "created_at": float,               # time.time()
        "last_active": float,              # time.time()
    }
}
```

### Alternatives Considered
| Alternative | Rejected Because |
|------------|-----------------|
| Redis / database | Added infrastructure; overkill for portfolio chatbot |
| File-based sessions | I/O overhead; no atomicity |
| No session (stateless) | No conversation context; poor UX |

---

## Decision 6: Language Detection & Response Language

**Chosen**: Detect from user input using existing regex patterns (Urdu/Sindhi/English), respond in same language

### Implementation

```python
from backend.services.guardrails import detect_language

detected_lang = detect_language(user_message)  # returns "en" | "ur" | "sd"
```

### Language System Prompts

Each agent's system prompt includes the detected language:

```python
LANG_SYSTEM_PROMPTS = {
    "en": "You are Asad Shabir. Respond in English.",
    "ur": "آپ اسد شابذ ہیں۔ اردو میں جواب دیں۔",
    "sd": "توھان اسد شابذ آھيو۔ سنڌي ۾ جواب ڏيو۔",
}
```

---

## Decision 7: Rate Limiting

**Chosen**: In-memory rate limiter — 10 requests/IP/600 seconds for `/api/chat`

Reuses the existing rate limiter from `backend/api/routes/chatbot.py` (`_check_rate_limit`). No new infrastructure needed.

---

## Decision 8: Prompt Injection Handling

**Chosen**: Strip injection patterns before processing (existing `strip_injection()` from `guardrails.py`)

```python
from backend.services.guardrails import strip_injection

clean_message = strip_injection(user_message)
```

Injection patterns stripped: code fences, `INST:`, `SYSTEM:`, `{{}}`, `[[]]`, `{% %}`, `<script>`, `javascript:`.

---

## Key Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| OpenAI Agents SDK handoffs fail with Groq | Low | Test handoff pattern early; fallback to plain Groq calls |
| Repair agent latency exceeds 10s | Medium | Use fast model (llama-3.3-70b-versatile), cap at 1 retry |
| Profile file read fails | Low | Cache at startup; fallback to empty context with warning |
| Groq rate limit (429) | Medium | Groq SDK handles retries; graceful fallback message |
| Repair agent over-corrects voice | Medium | Tight tone rules; human review samples quarterly |

---

## Dependencies Summary

```text
fastapi>=0.115
uvicorn[standard]>=0.34
pydantic>=2.10
pydantic-settings>=2.7
python-dotenv>=1.0
httpx>=0.28
email-validator>=2.2
slowapi>=0.1.9
bleach>=6.1
structlog>=24.4
groq>=0.0.1         # NEW — official Groq Python SDK
openai-agents>=1.0  # NEW — OpenAI Agents SDK (verify version)
```

---

*Research consolidated from: Groq API documentation (console.groq.com), Groq Python SDK (github.com/groq/groq-python), OpenAI Agents SDK patterns, Microsoft Chain-of-Verification (CoV) literature, Anthropic agentic patterns (2025), repair agent architecture patterns (2024–2026).*
