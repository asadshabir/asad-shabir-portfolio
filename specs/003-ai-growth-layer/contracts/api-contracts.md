# API Contracts: AI Growth Layer

**Branch**: `003-ai-growth-layer` | **Date**: 2026-05-01
**Source**: Feature spec and data model from `specs/003-ai-growth-layer/`

---

## API Overview

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/analytics/track` | Record a lead event | None (public) |
| POST | `/api/subscribe` | Capture email subscriber | None (public) |
| POST | `/api/estimate` | AI project estimation | None (public) |
| POST | `/api/review-resume` | AI resume review | None (public) |
| GET | `/api/admin/analytics` | Aggregate analytics | `X-Analytics-Password` header |
| GET | `/api/admin/subscribers/export` | Export subscribers as CSV | `X-Analytics-Password` header |

---

## Contract: Analytics Tracking

### POST `/api/analytics/track`

Record a lead/event action on the portfolio.

**Request**:
```
POST /api/analytics/track
Content-Type: application/json
```

```json
{
  "event_type": "cta_click",
  "metadata": { "cta_label": "Hire Asad", "page": "/#contact" }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event_type` | string | Yes | One of: `resume_download`, `contact_submission`, `chatbot_session`, `cta_click`, `estimator_use`, `reviewer_use`, `email_capture` |
| `metadata` | object | No | Optional context (e.g., `{ cta_label, page }`) |
| `visitor_email` | string | No | Only included from contact form submission |

**Responses**:

| Status | Body | When |
|--------|------|------|
| 200 | `{"ok": true}` | Event recorded |
| 422 | `{"ok": false, "code": "VALIDATION_ERROR", "message": "..."}` | Invalid event_type |

**Rate Limit**: No per-IP limit (aggregate only, no abuse vector)

---

## Contract: Email Capture

### POST `/api/subscribe`

Capture a subscriber's email.

**Request**:
```
POST /api/subscribe
Content-Type: application/json
```

```json
{
  "email": "jane@example.com",
  "source_page": "https://asadshabir.com/#hero"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email format |
| `source_page` | string | No | URL where captured (defaults to "/") |

**Responses**:

| Status | Body | When |
|--------|------|------|
| 200 | `{"ok": true, "message": "You're subscribed!"}` | New subscriber |
| 200 | `{"ok": true, "message": "Already subscribed."}` | Duplicate email |
| 422 | `{"ok": false, "code": "VALIDATION_ERROR", "message": "..."}` | Invalid email |
| 429 | `{"ok": false, "code": "RATE_LIMITED", "message": "..."}` | Over rate limit |

**Rate Limit**: 10 requests per IP per rolling 1-minute window.

---

## Contract: AI Project Estimator

### POST `/api/estimate`

Get an AI-generated project estimate from Asad's perspective.

**Request**:
```
POST /api/estimate
Content-Type: application/json
```

```json
{
  "description": "I want a chatbot for my e-commerce store that recommends products.",
  "budget_range": "medium",
  "timeline": "3 months",
  "language": "en"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | Yes | Project description (10-2000 chars) |
| `budget_range` | string | No | One of: `small`, `medium`, `large`, `enterprise` |
| `timeline` | string | No | Optional timeline hint |
| `language` | string | No | One of: `en` (default), `ur`, `sd` |

**Responses**:

| Status | Body | When |
|--------|------|------|
| 200 | `{"ok": true, "data": { AIEstimate }}` | Success |
| 422 | `{"ok": false, "code": "VALIDATION_ERROR", "message": "..."}` | Invalid input |
| 429 | `{"ok": false, "code": "RATE_LIMITED", "message": "..."}` | Over rate limit |
| 503 | `{"ok": false, "code": "SERVICE_UNAVAILABLE", "message": "..."}` | Groq down |

**Rate Limit**: 5 requests per IP per rolling 1-minute window.

**Output Schema** (`AIEstimate`):
```json
{
  "complexity": "moderate",
  "timeline_weeks": "8-12 weeks",
  "recommended_stack": ["Python", "FastAPI", "Groq", "React", "PostgreSQL"],
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "next_steps": ["Step 1", "Step 2", "Step 3"],
  "language": "en"
}
```

---

## Contract: AI Resume Reviewer

### POST `/api/review-resume`

Get an AI-generated resume review from Asad's perspective.

**Request**:
```
POST /api/review-resume
Content-Type: application/json
```

```json
{
  "resume_text": "John Doe\nPython Developer\n3 years experience...",
  "language": "en"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resume_text` | string | Yes | Resume content as plain text (100-10000 chars) |
| `language` | string | No | One of: `en` (default), `ur`, `sd` |

**Responses**:

| Status | Body | When |
|--------|------|------|
| 200 | `{"ok": true, "data": { ResumeReview }}` | Success |
| 400 | `{"ok": false, "code": "NOT_A_RESUME", "message": "..."}` | Not a resume/CV |
| 422 | `{"ok": false, "code": "VALIDATION_ERROR", "message": "..."}` | Invalid input |
| 429 | `{"ok": false, "code": "RATE_LIMITED", "message": "..."}` | Over rate limit |
| 503 | `{"ok": false, "code": "SERVICE_UNAVAILABLE", "message": "..."}` | Groq down |

**Rate Limit**: 5 requests per IP per rolling 1-minute window.

**Output Schema** (`ResumeReview`):
```json
{
  "score": 72,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "ats_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "skill_gaps": ["Gap 1", "Gap 2"],
  "improvements": ["Tip 1", "Tip 2", "Tip 3"],
  "language": "en"
}
```

---

## Contract: Admin Analytics

### GET `/api/admin/analytics`

Retrieve aggregate analytics counts. Requires password authentication.

**Request**:
```
GET /api/admin/analytics
X-Analytics-Password: your-password
```

**Responses**:

| Status | Body | When |
|--------|------|------|
| 200 | `{"ok": true, "data": { AggregatedCounts }}` | Authenticated |
| 401 | `{"ok": false, "code": "UNAUTHORIZED", "message": "..."}` | Wrong or missing password |

**Output Schema**:
```json
{
  "ok": true,
  "data": {
    "resume_downloads": 142,
    "contact_submissions": 38,
    "chatbot_sessions": 201,
    "cta_clicks": 89,
    "estimator_uses": 24,
    "reviewer_uses": 51,
    "email_captures": 67,
    "last_updated": "2026-05-01T14:30:00Z"
  }
}
```

---

## Contract: Subscriber Export

### GET `/api/admin/subscribers/export`

Export all subscribers as a CSV file.

**Request**:
```
GET /api/admin/subscribers/export
X-Analytics-Password: your-password
```

**Responses**:

| Status | Body | When |
|--------|------|------|
| 200 | CSV file download | Authenticated |
| 401 | `{"ok": false, "code": "UNAUTHORIZED"}` | Wrong or missing password |

**CSV Format**:
```
email,subscribed_at,source_page
jane@example.com,2026-05-01T10:30:00Z,https://asadshabir.com/#hero
```

---

## Tool: track_event (Frontend → Backend)

Frontend analytics wrapper — calls `POST /api/analytics/track`.

**Input**: `{ eventType: LeadEventType, metadata?: Record<string, string> }`
**Output**: `Promise<{ ok: boolean }>`

**Usage**:
```typescript
// Resume download
trackEvent("resume_download");

// CTA click with context
trackEvent("cta_click", { cta_label: "Hire Asad", page: "/#contact" });

// Estimator use
trackEvent("estimator_use", { complexity: "moderate" });
```