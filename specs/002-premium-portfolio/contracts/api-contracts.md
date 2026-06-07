# Contracts: Premium Portfolio Website

**Branch**: `002-premium-portfolio` | **Date**: 2026-05-01
**Source**: Functional requirements from `specs/002-premium-portfolio/spec.md`

---

## API Overview

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/contact` | Submit contact form | None (public) |
| GET | `/api/resume` | Download resume PDF | None (public) |
| POST | `/api/chat` | Chatbot message | None (public) |

---

## Contract: Contact Form

### POST `/api/contact`

Submit a contact message that gets emailed to Asad.

**Request**:
```
POST /api/contact
Content-Type: application/json
```

```json
{
  "name": "string (2-100 chars)",
  "email": "string (valid email)",
  "message": "string (10-2000 chars)"
}
```

**Responses**:

| Status | Body | When |
|--------|------|------|
| 200 | `{"ok": true, "message": "Message sent successfully."}` | Success |
| 422 | `{"ok": false, "code": "VALIDATION_ERROR", "message": "...", "details": [...]}` | Invalid input |
| 429 | `{"ok": false, "code": "RATE_LIMITED", "message": "Too many attempts..."}` | Over rate limit |
| 500 | `{"ok": false, "code": "SEND_FAILED", "message": "Failed to send..."}` | Resend error |
| 503 | `{"ok": false, "code": "SERVICE_UNAVAILABLE", "message": "Service temporarily unavailable..."}` | Resend down |

**Validation Rules**:
- `name`: required, 2-100 chars, no HTML
- `email`: required, valid RFC 5322 format, no HTML
- `message`: required, 10-2000 chars, no HTML

**Rate Limit**: 5 requests per IP per rolling 1-hour window.

**Error Codes**:
- `VALIDATION_ERROR`: Input failed Zod/Pydantic validation
- `RATE_LIMITED`: Too many requests from this IP
- `SEND_FAILED`: Resend API error
- `SERVICE_UNAVAILABLE`: Resend service down

---

## Contract: Resume Download

### GET `/api/resume`

Redirect to the static resume PDF file. (Note: direct link `<a href="/Asad_Shabir_Developer.pdf" download>` is the primary approach; this endpoint exists for analytics/tracking if needed.)

**Request**:
```
GET /api/resume
```

**Response**:
```
302 Found
Location: /Asad_Shabir_Developer.pdf
```

Alternative (if tracking needed):
```
200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="Asad_Shabir_Developer.pdf"
[Binary PDF data]
```

**Errors**:
| Status | Body | When |
|--------|------|------|
| 404 | `{"ok": false, "code": "NOT_FOUND", "message": "Resume not found."}` | File missing |
| 500 | `{"ok": false, "code": "INTERNAL_ERROR", "message": "Server error."}` | Read error |

---

## Contract: Chatbot

### POST `/api/chat`

Send a chatbot message and receive an AI-generated response from Asad Shabir's persona.

**Request**:
```
POST /api/chat
Content-Type: application/json
X-Session-ID: uuid-v4-string (optional, auto-generated if missing)
```

```json
{
  "messages": [
    { "role": "user", "content": "What are your main skills?" }
  ],
  "session_id": "uuid-v4-string (optional)",
  "language": "en | ur | si (optional, auto-detected if missing)"
}
```

**Responses**:

| Status | Body | When |
|--------|------|------|
| 200 | `{"ok": true, "message": {"role": "assistant", "content": "..."}, "language": "en"}` | Success |
| 400 | `{"ok": false, "code": "BAD_REQUEST", "message": "..."}` | Malformed JSON |
| 422 | `{"ok": false, "code": "VALIDATION_ERROR", "message": "..."}` | Invalid input |
| 429 | `{"ok": false, "code": "RATE_LIMITED", "message": "You're going a bit fast..."}` | Over rate limit |
| 500 | `{"ok": false, "code": "INTERNAL_ERROR", "message": "An unexpected error occurred."}` | Server error |
| 503 | `{"ok": false, "code": "SERVICE_UNAVAILABLE", "message": "..."}` | Groq or AI service down |

**Input Validation**:
- `messages`: required, array, 1-10 items, each has `role` (user|assistant) and `content` (1-2000 chars)
- `session_id`: optional, valid UUID v4 format
- `language`: optional, one of `en`, `ur`, `si`

**Rate Limit**: 10 requests per IP per rolling 10-minute window.

**System Prompt** (sealed — never modified at runtime):
```
You are Asad Shabir — a software engineer and AI specialist.
You speak in first person ("I").
You answer questions about Asad's skills, projects, and experience.
You do NOT answer questions outside this scope.
Respond in the language the user wrote in: English, Urdu (اردو), or Sindhi (سنڌي).
Keep responses brief, professional, and helpful.
If asked off-topic: respond politely in the same language, decline, and redirect to Asad's work.
Never claim to be an AI model. Never say "as an AI language model."
```

**Error Fallback Messages** (by language):
| Code | EN | UR | SI |
|------|----|----|-----|
| AI_TIMEOUT | "I'm having trouble thinking right now — please try again in a moment." | "مجھے ابھی الجھنے دیا — براہ کرم دوبارہ کوشش کریں۔" | "آئی کو ڏاھن لڳو آھيان — وھار ڪريو." |
| AI_UNAVAILABLE | "I'm temporarily unavailable. Please reach out directly at asadshabir505@ gmail.com." | | |
| RATE_LIMITED | "You're going a bit fast — let's continue in a few minutes." | | |

---

## Tool: send_contact_email

**Tool Name**: `send_contact_email`

**Purpose**: Send a contact message via email from the chatbot.

**Input Schema**:
```json
{
  "name": "string (2-100 chars)",
  "email": "string (valid email)",
  "message": "string (10-20000 chars)"
}
```

**Output Schema**:
```json
{
  "ok": true,
  "message": "Email sent successfully."
}
```

**When to Call**: User explicitly asks to send a message or "contact Asad".

**Constraints**:
- Only callable via `chat` endpoint tool_use
- No dynamic tool name construction from user input
- Rate limited (same as chatbot endpoint)