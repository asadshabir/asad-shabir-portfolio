# Data Model: Multi-Agent Chatbot

**Feature**: `004-multiagent-chatbot` | **Date**: 2026-05-05

---

## Entity: ChatSession

In-memory session store entry.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `session_id` | `str` | Unique, max 64 chars | Auto-generated or client-provided |
| `messages` | `list[dict[str, str]]` | Max 10 items | Each: `{role: "user"|"assistant", content: str}` |
| `language` | `Literal["en", "ur", "sd"]` | Detected from user input | Defaults to "en" |
| `created_at` | `float` | `time.time()` at creation | UTC timestamp |
| `last_active` | `float` | Updated on every message | UTC timestamp |
| `ttl` | `int` | Default 1800 (30 min) | Seconds before expiration |

**State Transitions**:
- `NEW` → `ACTIVE` (first message)
- `ACTIVE` → `EXPIRED` (30 min inactivity, auto-cleaned)
- `EXPIRED` → (removed from store on next access)

---

## Entity: AgentMessage

A message in agent conversation flow.

| Field | Type | Notes |
|-------|------|-------|
| `role` | `Literal["system", "user", "assistant"]` | Standard chat role |
| `content` | `str` | Message text |
| `agent` | `str \| None` | Which agent generated this (router/profile/projects/technical/fallback/repair) |
| `timestamp` | `float \| None` | When generated |

---

## Entity: ToolCall

Function tool invocation during agent execution.

| Field | Type | Notes |
|-------|------|-------|
| `tool_name` | `Literal["get_profile_info", "get_projects", "get_technical_skills", "get_contact_info"]` | Which tool called |
| `arguments` | `dict[str, Any]` | Tool arguments (currently none for profile tools) |
| `result` | `str` | Tool's JSON response |
| `success` | `bool` | Whether tool succeeded |
| `error` | `str \| None` | Error message if failed |

---

## Entity: RepairValidation

Repair agent validation result.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `approved` | `bool` | Required | True if all checks passed |
| `flags` | `list[str]` | Can be empty | List of validation failures |
| `original_draft` | `str` | Required | The draft response |
| `revised_response` | `str \| None` | Required if not approved | Repaired version |
| `language` | `Literal["en", "ur", "sd"]` | Detected language | For language mismatch check |
| `attempts` | `int` | Default 0, max 1 | Number of repair attempts |

**Flag Values**:
- `IDENTITY_BREACH` — Not in first person as Asad Shabir
- `GROUNDING_UNCERTAINTY` — Claim has no/weak profile support
- `FABRICATED_CONTENT` — Fact not in profile, removed
- `OUT_OF_SCOPE` — Question asks about info not in profile
- `TONE_MISMATCH` — Apologetic, hedge-speak, casual slang detected
- `LANGUAGE_MISMATCH` — Response language ≠ detected user language
- `SAFETY_BREACH` — PII, credentials, or injection detected
- `OFF_TOPIC` — Question not about Asad's work

---

## Entity: AgentHandoff

OpenAI Agents SDK handoff instruction.

| Field | Type | Notes |
|-------|------|-------|
| `from_agent` | `str` | Agent handing off |
| `to_agent` | `str` | Target specialist agent |
| `reason` | `str \| None` | Why the handoff was chosen |
| `context` | `str \| None` | Summary of conversation so far |

---

## Entity: ProfileData

Structured data extracted from `asadshabir_all_info.md`.

| Field | Type | Notes |
|-------|------|-------|
| `name` | `str` | "Asad Shabir" |
| `title` | `str` | Current professional title |
| `location` | `str` | "Sehwan Sharif, Sindh, Pakistan" |
| `background` | `str` | Personal story and identity |
| `family` | `dict` | Family composition |
| `education` | `list[dict]` | GIAIC and other education |
| `mindset` | `str` | Personality and values |
| `work` | `dict` | Current job, freelancing |
| `goals` | `list[str]` | Dreams and aspirations |
| `contact` | `dict` | Email, phone, portfolio URL |

---

## Entity: ProjectsData

Structured project list extracted from `asadshabir_all_info.md`.

| Field | Type | Notes |
|-------|------|-------|
| `projects` | `list[dict]` | Each: `{name, description, stack, achievements}` |
| `resume_highlights` | `list[str]` | Key professional highlights |

---

## Entity: TechnicalSkillsData

Structured skills extracted from `asadshabir_all_info.md`.

| Field | Type | Notes |
|-------|------|-------|
| `core_skills` | `list[str]` | AI-native, agentic AI, conversational AI, etc. |
| `technical_skills` | `list[str]` | Python, TypeScript, React, etc. |
| `tools` | `list[str]` | Docker, Kubernetes, Kafka, etc. |
| `experience_story` | `str` | Pakistan Navy, SSU, freelancing journey |

---

## Schema Validation Rules

| Field | Rule |
|-------|------|
| `session_id` | Alphanumeric + underscore, max 64 chars |
| `messages[].content` | Min 1 char, max 2000 chars |
| `messages` | Max 10 items (rolling window) |
| `language` | One of: en, ur, sd |
| `repair_validation.flags` | Uppercase, underscore-separated |
| `profile_data` | Read-only after startup |

---

## Data Flow

```
User Message
    │
    ▼
ChatSession.get_or_create(session_id)
    │
    ▼
detect_language(user_message) → "en"|"ur"|"sd"
    │
    ▼
strip_injection(user_message) → clean_message
    │
    ▼
Router Agent (classify intent)
    │
    ├─▶ Profile Agent ──get_profile_info()──▶ ProfileData
    ├─▶ Projects Agent ──get_projects()──▶ ProjectsData
    ├─▶ Technical Agent ──get_technical_skills()──▶ TechnicalSkillsData
    └─▶ Fallback Agent
            │
            ▼
    Specialist Draft Response
            │
            ▼
    Repair Agent (validate against profile)
            │
    ├─ APPROVED → Response Selector → /api/chat response
    └─ REVISION_REQUIRED → 1 retry → APPROVED or Fallback
```

---

*Data model follows existing backend patterns (pydantic schemas in `backend/api/schemas/`). Extends `ChatMessage` and `ChatRequest` from `backend/api/schemas/chatbot.py`.*