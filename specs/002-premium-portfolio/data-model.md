# Data Model: Premium Portfolio Website

**Branch**: `002-premium-portfolio` | **Date**: 2026-05-01
**Source**: Functional requirements from `specs/002-premium-portfolio/spec.md`

---

## Entities

### 1. ContactFormSubmission

Represents a visitor-submitted contact message sent to Asad.

```
ContactFormSubmission {
  id:          string    (UUID, auto-generated)
  name:        string    (2-100 chars, required)
  email:       string    (valid email format, required)
  message:     string    (10-2000 chars, required)
  timestamp:   datetime  (UTC, server-generated)
  status:      enum      (pending | sent | failed)
}
```

**Validation Rules**:
- `name`: min 2, max 100 characters; stripped of HTML/scripts
- `email`: must match RFC 5322 email regex; stripped of HTML/scripts
- `message`: min 10, max 2000 characters; stripped of HTML/scripts
- All fields are required

**State Transitions**:
```
pending → sent    (email delivered successfully)
pending → failed  (Resend API error)
failed  → sent   (retry succeeded)
```

---

### 2. ChatMessage

Represents a single turn in the chatbot conversation.

```
ChatMessage {
  role:        enum      (user | assistant)
  content:     string    (1-2000 chars)
  language:    enum      (en | ur | si)
  timestamp:   datetime  (UTC, server-generated)
  session_id:  string    (UUID, from cookie or header)
}
```

**Validation Rules**:
- `role`: must be `user` or `assistant`
- `content`: min 1, max 2000 characters
- `language`: auto-detected from user message; fallback `en`
- `session_id`: UUID v4; stored in `X-Session-ID` header or cookie

---

### 3. ConversationSession

Groups ChatMessages into a session for multi-turn context.

```
ConversationSession {
  session_id:  string    (UUID, client-generated or server-assigned)
  language:    enum      (en | ur | si, current detected language)
  messages:    ChatMessage[] (last 10 messages max)
  created_at:  datetime  (UTC)
  last_active: datetime  (UTC, updated on each message)
}
```

**Constraints**:
- Max 10 messages per session (prevents context overflow)
- Session expires after 30 minutes of inactivity (TTL)
- In-memory storage (Python `dict`); no persistent DB needed for v1

---

### 4. ResumeAsset

Represents the downloadable resume PDF.

```
ResumeAsset {
  canonical_name:  string  = "Asad_Shabir_Developer.pdf"
  current_version: string = "v1.0"
  public_path:     string = "/Asad_Shabir_Developer.pdf"
  versioned_paths: {
    "v1.0": "public/resumes/v1.0-2026-05.pdf"
  }
}
```

**Constraints**:
- Canonical filename never changes (permalink stability)
- Versioned copies stored in `public/resumes/` for history
- Served as static file (HTTP 200), no API call needed

---

### 5. RateLimitEntry

Tracks request frequency per IP for rate limiting.

```
RateLimitEntry {
  ip_address:   string    (client IP from X-Forwarded-For or client_host)
  action:       enum      (contact | chatbot)
  request_count: int       (number of requests)
  window_start:  datetime  (UTC, start of rolling 1-hour window)
}
```

**Constraints**:
- Contact: max 5 requests per IP per rolling 1-hour window
- Chatbot: max 10 requests per IP per rolling 10-minute window
- Cleanup: entries older than window are pruned on each request

---

## API Request/Response Schemas

### POST /api/contact

**Request**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello, I'd love to discuss a project opportunity."
}
```

**Success Response (200)**:
```json
{
  "ok": true,
  "message": "Message sent successfully."
}
```

**Validation Error (422)**:
```json
{
  "ok": false,
  "code": "VALIDATION_ERROR",
  "message": "Please check your input and try again.",
  "details": [
    { "field": "email", "error": "Invalid email address" }
  ]
}
```

**Rate Limited (429)**:
```json
{
  "ok": false,
  "code": "RATE_LIMITED",
  "message": "Too many attempts. Please try again later."
}
```

---

### POST /api/chat

**Request**:
```json
{
  "messages": [
    { "role": "user", "content": "What are your main skills?" }
  ],
  "session_id": "uuid-v4-string",
  "language": "en"
}
```

**Success Response (200)**:
```json
{
  "ok": true,
  "message": {
    "role": "assistant",
    "content": "I'm a software engineer specializing in..."
  },
  "language": "en"
}
```

**Rate Limited (429)**:
```json
{
  "ok": false,
  "code": "RATE_LIMITED",
  "message": "You're going a bit fast — let's continue in a few minutes."
}
```

---

## Relationships

```
ConversationSession 1──N ChatMessage
ContactFormSubmission 1──1 Email (sent via Resend)
RateLimitEntry       tracks ContactFormSubmission + ChatMessage
ResumeAsset          static file, no relationships
```

No persistent database. All state held in-memory using Python `dict`/`list`/`map` structures within the FastAPI app instance (resets on serverless cold start — acceptable for v1).