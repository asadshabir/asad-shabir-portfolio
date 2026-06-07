# Quickstart: AI Growth Layer

**Branch**: `003-ai-growth-layer` | **Date**: 2026-05-01

---

## What Was Built

8 new features transforming the portfolio into a client acquisition platform:

1. **Case Studies** — Structured project showcase pages with challenge/approach/stack/results
2. **Lead Analytics** — In-memory event tracking + password-protected admin dashboard
3. **Email Capture** — Inline module, in-memory subscriber store, CSV export
4. **AI Project Estimator** — Groq-powered, returns complexity/timeline/stack/risks/next steps
5. **AI Resume Reviewer** — Groq-powered, returns score/strengths/weaknesses/ATS/skill gaps
6. **Blog/Insights CMS** — Static Markdown articles with SEO metadata and JSON-LD
7. **SEO & Social Sharing** — Per-page meta tags, OG, Twitter Card, canonical URLs
8. **Trust Signals** — Above-the-fold credibility indicators

---

## Quick Setup

### 1. Backend Environment

Add to your `.env` (existing vars unchanged):

```bash
# Analytics admin password
ANALYTICS_PASSWORD=your-secure-password-here

# Rate limits (optional overrides)
ESTIMATOR_RATE_LIMIT=5
REVIEWER_RATE_LIMIT=5
EMAIL_CAPTURE_RATE_LIMIT=10
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Run Backend Locally

```bash
cd backend
uvicorn api.index:app --reload --port 8000
```

### 4. Test New Routes

```bash
# Track analytics event
curl -X POST http://localhost:8000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event_type": "cta_click", "metadata": {"cta_label": "Hire Asad"}}'

# Email capture
curl -X POST http://localhost:8000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Project estimator
curl -X POST http://localhost:8000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{"description": "I need a chatbot for my online store", "language": "en"}'

# Resume reviewer
curl -X POST http://localhost:8000/api/review-resume \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "John Doe\nPython Developer\n3 years experience", "language": "en"}'

# Admin analytics (requires password)
curl http://localhost:8000/api/admin/analytics \
  -H "X-Analytics-Password: your-secure-password-here"

# Admin subscriber export
curl http://localhost:8000/api/admin/subscribers/export \
  -H "X-Analytics-Password: your-secure-password-here"
```

---

## Frontend Changes

### New Components

| Component | File | Purpose |
|-----------|------|---------|
| `SeoMeta` | `src/components/seo/SeoMeta.tsx` | Helmet-async SEO wrapper |
| `CaseStudies` | `src/components/CaseStudies.tsx` | Case study cards section |
| `CaseStudyPage` | `src/pages/CaseStudyPage.tsx` | Case study detail page |
| `BlogSection` | `src/components/BlogSection.tsx` | Blog listing section |
| `BlogArticle` | `src/pages/BlogArticle.tsx` | Article detail page |
| `EmailCapture` | `src/components/EmailCapture.tsx` | Inline email capture module |
| `TrustSignals` | `src/components/TrustSignals.tsx` | Trust stats display |
| `ProjectEstimator` | `src/components/ProjectEstimator.tsx` | AI estimator tool |
| `ResumeReviewer` | `src/components/ResumeReviewer.tsx` | AI resume reviewer tool |
| `useAnalytics` | `src/hooks/useAnalytics.ts` | Analytics tracking hook |

### New Content Files

| File | Purpose |
|------|---------|
| `src/content/case-studies.json` | Case study data (edit to add projects) |
| `src/content/blog/*.md` | Blog articles (create markdown files) |

### Adding a Case Study

Edit `src/content/case-studies.json`:

```json
{
  "slug": "ai-chatbot-platform",
  "title": "Building an AI Chatbot Platform",
  "excerpt": "How I built a production AI chatbot that handles 500+ daily conversations...",
  "challenge": "A client needed a chatbot that could handle complex customer queries...",
  "approach": "I used FastAPI for the backend, Groq for AI inference...",
  "stack": ["Python", "FastAPI", "Groq", "React", "PostgreSQL"],
  "results": ["Reduced response time by 60%", "Increased customer satisfaction by 40%"],
  "screenshots": [],
  "published_date": "2026-03-15",
  "tags": ["AI", "Python", "FastAPI"]
}
```

### Adding a Blog Article

Create `src/content/blog/my-article-title.md`:

```markdown
---
title: "Building AI Agents with Groq"
excerpt: "A practical guide to building production-ready AI agents."
published_date: "2026-04-10"
tags: ["AI", "Python", "Groq"]
---

# My Article Title

Your article content here...
```

---

## Vercel Deployment

### Backend (Python Runtime)

1. Set environment variables in Vercel dashboard:
   - `RESEND_API_KEY`, `GROQ_API_KEY`, `MODEL_NAME` (existing)
   - `ANALYTICS_PASSWORD` (new)
2. Deploy — entrypoint is `api/index.py`
3. Update `vite.config.ts` proxy if needed:
   ```typescript
   proxy: { "/api": { target: "https://your-backend.vercel.app", changeOrigin: true } }
   ```

### Frontend

1. Add `VITE_API_URL=https://your-backend.vercel.app` to Vercel env vars
2. Deploy — all existing routes preserved

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Static JSON/Markdown | No database = zero cost, zero maintenance |
| In-memory analytics | Privacy-first, acceptable for portfolio scale |
| Groq reuse | Fast, cheap, existing infrastructure |
| react-helmet-async | Standard React 18 SPA SEO solution |
| Basic-auth admin | Simple, no OAuth, works for single-user |
| CSV export | Works with any email platform (Mailchimp, ConvertKit, etc.) |

---

## What's Next

Run `/sp.tasks` to generate the implementation task list ordered by dependency.