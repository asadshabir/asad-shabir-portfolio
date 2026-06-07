# Data Model: AI Growth Layer

**Branch**: `003-ai-growth-layer` | **Date**: 2026-05-01
**Source**: Feature spec from `specs/003-ai-growth-layer/spec.md`

---

## Entities

### 1. CaseStudy

Static content object served as JSON. No database.

```
CaseStudy {
  slug:       string    (URL-safe, e.g., "ai-chatbot-platform")
  title:      string    (max 80 chars)
  excerpt:    string    (max 200 chars — shown on cards)
  challenge:  string    (1-3 paragraphs)
  approach:   string    (1-3 paragraphs)
  stack:      string[]  (technology names, e.g., ["Python", "FastAPI", "Groq"])
  results:    string[]  (outcome statements, e.g., ["Reduced response time by 60%"])
  screenshots: string[] (URLs or empty array)
  published_date: string (ISO 8601: "2026-03-15")
  tags:       string[]
}
```

**Constraints**:
- Minimum 2 case studies required (per FR-001)
- `slug` must be unique, URL-safe, kebab-case
- `stack` array: 2-8 technology names
- `screenshots` can be empty array (placeholder shown)

---

### 2. BlogPost

Static Markdown file with YAML frontmatter. Loaded at request time or build time.

```
BlogPost {
  slug:       string    (filename without .md, kebab-case)
  title:      string    (max 80 chars)
  excerpt:    string    (max 200 chars)
  content:    string    (full Markdown body)
  published_date: string (ISO 8601)
  tags:       string[]
  reading_time_minutes: number (auto-calculated: ceil(word_count / 200))
  og_image:   string | null (optional override image URL)
}
```

**Frontmatter schema** (YAML):
```yaml
title: "Building an AI Agent with Groq"
excerpt: "A practical guide to building production-ready AI agents using Groq and FastAPI."
published_date: "2026-04-10"
tags: ["AI", "Python", "Groq"]
og_image: null
```

**Constraints**:
- Minimum 3 blog posts recommended for SEO (per SC-005)
- `reading_time_minutes` is auto-calculated, never stored in frontmatter
- Content supports: headings (h2-h4), code blocks, images, blockquotes, lists

---

### 3. LeadEvent

Analytics event record — stored in-memory only.

```
LeadEvent {
  event_type: enum  (
    | "resume_download"
    | "contact_submission"
    | "chatbot_session"
    | "cta_click"
    | "estimator_use"
    | "reviewer_use"
    | "email_capture"
  )
  timestamp:   datetime (UTC, server-generated)
  metadata:    object | null (optional context, e.g., { cta_label: "Hire Asad" })
  visitor_email: string | null (only if voluntarily submitted in contact form)
}
```

**Constraints**:
- No IP address stored
- No cookies or device fingerprinting
- Maximum 50,000 events in memory (FIFO eviction when exceeded)
- Events older than 90 days pruned on each request

**Aggregation** (what admin dashboard reads):
```
AggregatedCounts {
  resume_downloads: number
  contact_submissions: number
  chatbot_sessions: number
  cta_clicks: number
  estimator_uses: number
  reviewer_uses: number
  email_captures: number
  last_updated: datetime (UTC)
}
```

---

### 4. Subscriber

Email subscriber record — stored in-memory only.

```
Subscriber {
  email:         string (valid email format, unique)
  subscribed_at: datetime (UTC)
  source_page:   string (URL where captured)
}
```

**Constraints**:
- `email` must be unique — duplicate submission returns "Already subscribed"
- No PII beyond email address
- Export: CSV with columns `email,subscribed_at,source_page`

---

### 5. AIEstimate

Structured output of the AI Project Estimator.

```
AIEstimate {
  complexity:       enum ("simple" | "moderate" | "complex")
  timeline_weeks:   string (e.g., "2-4 weeks" or "3-6 months")
  recommended_stack: string[] (technology names, 3-6 items)
  risks:            string[] (top 3 risks, 1 sentence each)
  next_steps:       string[] (3 actionable next steps)
  language:         enum ("en" | "ur" | "sd")
}
```

---

### 6. ResumeReview

Structured output of the AI Resume Reviewer.

```
ResumeReview {
  score:        number (1-100)
  strengths:    string[] (3-5 items, each 1 sentence)
  weaknesses:   string[] (3-5 items, each 1 sentence)
  ats_tips:     string[] (ATS optimisation tips, 3-5 items)
  skill_gaps:   string[] (identified gaps, 2-4 items)
  improvements: string[] (actionable tips, 3-5 items)
  language:     enum ("en" | "ur" | "sd")
}
```

---

## API Request/Response Schemas

### POST /api/analytics/track

**Request**:
```json
{
  "event_type": "cta_click",
  "metadata": { "cta_label": "Hire Asad", "page": "/#contact" }
}
```

**Success Response (200)**:
```json
{ "ok": true }
```

---

### POST /api/subscribe

**Request**:
```json
{
  "email": "jane@example.com",
  "source_page": "https://asadshabir.com/#hero"
}
```

**Success Response (200)**:
```json
{ "ok": true, "message": "You're subscribed!" }
```

**Already Subscribed (200)**:
```json
{ "ok": true, "message": "Already subscribed." }
```

**Validation Error (422)**:
```json
{ "ok": false, "code": "VALIDATION_ERROR", "message": "Invalid email address." }
```

---

### POST /api/estimate

**Request**:
```json
{
  "description": "I want a chatbot for my e-commerce store that recommends products based on browsing history.",
  "budget_range": "medium",
  "timeline": "3 months",
  "language": "en"
}
```

**Success Response (200)**:
```json
{
  "ok": true,
  "data": {
    "complexity": "moderate",
    "timeline_weeks": "8-12 weeks",
    "recommended_stack": ["Python", "FastAPI", "Groq", "React", "PostgreSQL"],
    "risks": [
      "Integration with existing e-commerce platform may require custom API work",
      "Personalization accuracy depends on data quality and volume",
      "Maintenance overhead for model retraining as catalog grows"
    ],
    "next_steps": [
      "Audit your existing e-commerce data and API documentation",
      "Define clear success metrics (CTR, conversion rate, customer satisfaction)",
      "Schedule a discovery call to scope the MVP"
    ]
  }
}
```

**Rate Limited (429)**:
```json
{ "ok": false, "code": "RATE_LIMITED", "message": "Too many requests. Please try again later." }
```

---

### POST /api/review-resume

**Request**:
```json
{
  "resume_text": "John Doe\nPython Developer\n3 years experience...",
  "language": "en"
}
```

**Success Response (200)**:
```json
{
  "ok": true,
  "data": {
    "score": 72,
    "strengths": [
      "Strong Python foundation with production experience",
      "Good understanding of REST API design patterns",
      "Demonstrates full-stack capability with React frontend work"
    ],
    "weaknesses": [
      "Limited DevOps experience — no mention of CI/CD or containerisation",
      "No AI/ML specific projects despite using Python extensively",
      "Communication skills not evidenced in the resume"
    ],
    "ats_tips": [
      "Add keywords from job descriptions (e.g., 'AWS', 'Docker', 'PostgreSQL')",
      "Quantify achievements with metrics (e.g., 'Reduced API latency by 40%')",
      "Use standard section headers to improve ATS parser recognition"
    ],
    "skill_gaps": [
      "Cloud infrastructure (AWS/GCP)",
      "Testing frameworks (Pytest coverage)",
      "System design and architecture patterns"
    ],
    "improvements": [
      "Add a projects section with measurable outcomes",
      "Include certifications (AWS Solutions Architect, etc.)",
      "Write a strong professional summary at the top"
    ]
  }
}
```

---

## Relationships

```
LeadEvent  →  tracks: resume_download, contact, chatbot, CTA, estimator, reviewer, email_capture
Subscriber →  email capture only, CSV export via admin
CaseStudy  →  static JSON, no relationships
BlogPost   →  static Markdown, no relationships
AIEstimate →  output of estimator route, Groq API call
ResumeReview → output of reviewer route, Groq API call
```

No database. All state held in-memory using Python `dict` structures within the FastAPI app instance (resets on serverless cold start — acceptable for v1).