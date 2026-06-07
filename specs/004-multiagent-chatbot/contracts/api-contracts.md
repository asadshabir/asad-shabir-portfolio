# API Contracts: Multi-Agent Chatbot

**Feature**: `004-multiagent-chatbot` | **Date**: 2026-05-05

---

## Endpoint: `POST /api/chat`

Agent-powered chatbot response with multi-agent orchestration and repair validation.

### Request

**Path**: `/api/chat`
**Method**: `POST`
**Auth**: None (public)
**Rate Limit**: 10 requests per IP per 600 seconds (429 on violation)

```yaml
RequestBody:
  application/json:
    schema:
      type: object
      required: [messages]
      properties:
        messages:
          type: array
          minItems: 1
          maxItems: 10
          items:
            type: object
            required: [role, content]
            properties:
              role:
                type: string
                enum: [user, assistant]
                description: "Message sender role"
              content:
                type: string
                minLength: 1
                maxLength: 2000
                description: "Message text"
        language:
          type: string
          enum: [en, ur, sd]
          default: en
          description: "Interface language (auto-detected from input)"
        session_id:
          type: string
          nullable: true
          maxLength: 64
          description: "Session identifier for context continuity"
```

### Response (Success — 200 OK)

```yaml
ResponseBody:
  application/json:
    schema:
      type: object
      properties:
        ok:
          type: boolean
          const: true
        message:
          type: object
          properties:
            role:
              type: string
              const: assistant
            content:
              type: string
              description: "Chatbot response text — plain, portable"
        language:
          type: string
          enum: [en, ur, sd]
        session_id:
          type: string
          description: "Session ID (generated if not provided)"
```

**Example**:
```json
{
  "ok": true,
  "message": {
    "role": "assistant",
    "content": "Asad Shabir ek proud Sindhi AI-Native Full-Stack Developer hain ✨ Woh Sehwan Sharif se hain..."
  },
  "language": "ur",
  "session_id": "sess_1746460800000"
}
```

### Response (Error — 429 Too Many Requests)

```yaml
ResponseBody:
  application/json:
    schema:
      type: object
      properties:
        detail:
          type: string
          description: "Rate limit message in user's language"
```

**Example** (English default):
```json
{
  "detail": "You're going a bit fast — let's continue in a few minutes."
}
```

### Response (Error — 422 Validation Error)

```yaml
ResponseBody:
  application/json:
    schema:
      type: object
      properties:
        detail:
          type: string
          description: "Validation error description"
```

### Response (Error — 503 Service Unavailable)

```yaml
ResponseBody:
  application/json:
    schema:
      type: object
      properties:
        detail:
          type: string
          description: "Fallback message when Groq API fails"
```

---

## Endpoint: `POST /api/chat/raw`

Raw Groq completion without agent processing (for testing/debugging).

### Request

**Path**: `/api/chat/raw`
**Method**: `POST`
**Auth**: None (public)
**Rate Limit**: 5 requests per IP per 600 seconds

```yaml
RequestBody:
  application/json:
    schema:
      type: object
      required: [messages]
      properties:
        messages:
          type: array
          description: "Messages array sent directly to Groq"
        system_prompt:
          type: string
          nullable: true
          description: "Optional custom system prompt override"
        temperature:
          type: number
          minimum: 0
          maximum: 2
          default: 0.7
        max_tokens:
          type: integer
          minimum: 1
          maximum: 2048
          default: 500
```

### Response (Success — 200 OK)

```yaml
ResponseBody:
  application/json:
    schema:
      type: object
      properties:
        ok:
          type: boolean
          const: true
        content:
          type: string
          description: "Raw model completion"
        model:
          type: string
          description: "Model used (llama-3.3-70b-versatile)"
        usage:
          type: object
          description: "Token usage stats from Groq"
```

**Example**:
```json
{
  "ok": true,
  "content": "Hello! I'm Asad Shabir, an AI-native full-stack developer...",
  "model": "llama-3.3-70b-versatile",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 85,
    "total_tokens": 235
  }
}
```

---

## Endpoint: `GET /api/profile`

Returns structured profile data from `asadshabir_all_info.md`.

### Request

**Path**: `/api/profile`
**Method**: `GET`
**Auth**: None (public)

### Response (Success — 200 OK)

```yaml
ResponseBody:
  application/json:
    schema:
      type: object
      properties:
        ok:
          type: boolean
          const: true
        profile:
          type: object
          description: "Full structured profile data"
          properties:
            name:
              type: string
            title:
              type: string
            location:
              type: string
            background:
              type: string
            family:
              type: object
            education:
              type: array
            skills:
              type: object
            projects:
              type: array
            experience_story:
              type: string
            goals:
              type: array
            contact:
              type: object
        loaded_at:
          type: string
          format: date-time
          description: "When profile was loaded"
```

**Example**:
```json
{
  "ok": true,
  "profile": {
    "name": "Asad Shabir",
    "title": "AI-Native Full-Stack Developer",
    "location": "Sehwan Sharif, Sindh, Pakistan",
    "background": "Proud Sindhi, hardworking, family-oriented",
    "family": {"brothers": 3, "sisters": 5, "father": "Shabir"},
    "education": [{"institution": "GIAIC", "field": "AI Engineer", "2023-Present"}],
    "skills": {
      "core": ["AI-native development", "Agentic AI", "Full-stack"],
      "technical": ["Python", "TypeScript", "React", "FastAPI", "Docker"]
    },
    "contact": {
      "email": "asadshabir505@gmail.com",
      "phone": "+923253939049",
      "portfolio": "https://asadshabir.netlify.app"
    }
  },
  "loaded_at": "2026-05-05T12:00:00Z"
}
```

---

## Endpoint: `GET /api/health`

Health check endpoint.

### Request

**Path**: `/api/health`
**Method**: `GET`
**Auth**: None

### Response (Success — 200 OK)

```yaml
ResponseBody:
  application/json:
    schema:
      type: object
      properties:
        status:
          type: string
          const: ok
        version:
          type: string
        timestamp:
          type: string
          format: date-time
```

**Example**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-05-05T12:00:00Z"
}
```

---

## Error Taxonomy

| Status Code | When | Response |
|-------------|------|----------|
| `200` | Success | `{ok: true, message: {...}}` |
| `422` | Validation error | `{detail: "No user message found in history."}` |
| `429` | Rate limited | `{detail: "You're going a bit fast..."}` |
| `500` | Unexpected error | `{detail: "Something went wrong. Please try again."}` |
| `503` | Groq unavailable | `{detail: "AI service temporarily unavailable..."}` |

---

## Idempotency & Timeouts

| Endpoint | Timeout | Idempotent? |
|----------|---------|-------------|
| `POST /api/chat` | 30s (includes agent + repair) | No (creates session entry) |
| `POST /api/chat/raw` | 30s | No |
| `GET /api/profile` | 5s | Yes (cached) |
| `GET /api/health` | 2s | Yes |

---

## Versioning

- **Current Version**: `v1`
- **URL Prefix**: `/api` (no versioning in path for simplicity)
- **Breaking Changes**: Will introduce `/api/v2` if needed
- **Deprecation**: Old versions supported for 6 months after new version release

---

*API contracts follow existing FastAPI patterns in `backend/api/routes/`. Response format is portable — suitable for any frontend (portfolio, mobile, Claude-based UI).*