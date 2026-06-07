# Research: AI Growth Layer

**Branch**: `003-ai-growth-layer` | **Date**: 2026-05-01
**Purpose**: Document architectural decisions for Phase 5 AI Growth Layer

---

## Decision 1: Static Content Storage (Blog & Case Studies)

**Decision**: Store blog posts as Markdown files in `src/content/blog/` and case studies as a JSON file `src/content/case-studies.json`.

**Rationale**:
- No database needed for low-traffic portfolio
- Markdown files are author-friendly and version-controllable
- JSON case studies are easily editable without CMS
- React Router handles dynamic routes (`/blog/:slug`, `/case-study/:slug`)
- Frontmatter in Markdown for SEO metadata (title, description, tags, date)
- Can migrate to headless CMS (Contentlayer, Sanity) later without architectural changes

**Alternatives considered**:
- Sanity.io / Contentful CMS: Rejected — adds vendor dependency, costs, and complexity for a portfolio
- PostgreSQL / Supabase: Rejected — overkill for static content, cold-start issues on serverless
- GitHub API / Notion API: Rejected — adds authentication complexity, rate limits

---

## Decision 2: In-Memory Analytics (No DB)

**Decision**: Store analytics events in Python `dict` on the backend. Aggregate counts available via admin route.

**Rationale**:
- Portfolio has low traffic — even 10K events in memory is trivial
- In-memory aggregation provides the counts Asad needs (resume downloads, contact submits, chatbot sessions, CTA clicks)
- No persistence needed — aggregate counts survive cold start; raw events reset (acceptable)
- Admin route protected by password env var (`ANALYTICS_PASSWORD`)

**Alternatives considered**:
- Supabase / PlanetScale: Rejected — vendor lock-in, costs, over-engineered for portfolio analytics
- Google Analytics 4: Rejected — privacy concerns, GDPR complexity, not privacy-conscious
- Vercel Analytics: Rejected — no event-level data, limited customization
- Redis (Upstash): Rejected — adds another service, connection overhead on cold start

---

## Decision 3: AI Tool Architecture

**Decision**: Reuse existing Groq API for both the Project Estimator and Resume Reviewer. Custom system prompts enforce structured JSON output. Server-side formatting before response.

**Rationale**:
- Groq is fast (~1-3s response), cheap, and OpenAI-compatible
- Custom system prompts control response format (no raw model output exposed)
- Server-side JSON parsing catches malformed responses and returns graceful fallbacks
- Both tools share the existing `guardrails.py` for injection sanitisation
- Language detection from existing `detect_language()` — supports EN/UR/SD

**Alternatives considered**:
- OpenAI API: Rejected — slower, more expensive, same result
- Anthropic Claude API: Rejected — higher cost, no speed advantage for structured output
- Local LLM (Ollama): Rejected — requires self-hosting, inconsistent quality

---

## Decision 4: SEO Implementation

**Decision**: Use `react-helmet-async` for SPA SEO. Each page/route sets its own `<title>`, `<meta name="description">`, and Open Graph tags via `<Helmet>` components. React Router handles client-side routing with proper canonical URLs.

**Rationale**:
- Vite + React SPA requires client-side title/meta management
- `react-helmet-async` is the standard React 18 solution (Thread-safe, no SSR issues)
- Canonical URLs set per page via `window.location.href`
- OG images generated statically and served from `public/`
- JSON-LD for blog articles injected via Helmet as `<script type="application/ld+json">`

**Alternatives considered**:
- Next.js: Rejected — requires full migration away from Vite
- Gatsby: Rejected — heavy framework, over-engineered for portfolio
- prerender-spa-plugin: Rejected — complexity for dynamic routes

---

## Decision 5: Email Capture Strategy

**Decision**: Inline email capture module (not a popup/modal). Subscribers stored in Python `dict` in-memory. Admin exports as CSV via a password-protected route. No automated newsletter sending in v1.

**Rationale**:
- No popup = premium, calm UX (matches constitution principle IV)
- Inline placement after hero section = high visibility without annoyance
- Session suppression via `localStorage` (no repeat prompts in same session)
- CSV export = Asad can import into any email platform (Mailchimp, ConvertKit)
- Resend is only for transactional contact emails, not newsletters

**Alternatives considered**:
- Mailchimp embedded form: Rejected — external dependency, privacy concerns, limits on free tier
- ConvertKit: Rejected — same as Mailchimp
- Buttondown / Substack: Rejected — separate platform, breaks portfolio UX

---

## Decision 6: Analytics Event Schema

**Decision**: Simple, consistent event shape: `{ type, timestamp, metadata }`. No IP storage, no cookies, no fingerprinting.

**Rationale**:
- Small payload = fast, minimal bandwidth
- Privacy-first (no PII except voluntarily-submitted email)
- Types: `resume_download`, `contact_submission`, `chatbot_session`, `cta_click`, `estimator_use`, `reviewer_use`, `email_capture`
- Metadata is optional JSON for context (e.g., `{ cta_label: "Hire Asad", page: "/#contact" }`)

---

## Open Questions Resolved

| Question | Answer |
|-----------|--------|
| How does blog reading time get calculated? | Server-side: word count ÷ 200 WPM, rounded up |
| How does blog markdown get parsed? | `react-markdown` (already in package.json) with `remark-gfm` |
| How are case study detail pages routed? | React Router `/case-study/:slug` → loads from `case-studies.json` |
| How is the admin dashboard protected? | `GET /api/admin/analytics` checks `X-Analytics-Password` header against `ANALYTICS_PASSWORD` env var |
| How are AI tool responses formatted? | Groq returns text → server parses into structured JSON → frontend renders clean cards |
| How are non-resume documents handled? | Server-side heuristic: detect absence of name/email/education/skill patterns → return polite error |