---
description: "Dependency-ordered implementation tasks for AI Growth Layer — 003-ai-growth-layer"
---

# Tasks: AI Growth Layer

**Branch**: `003-ai-growth-layer` | **Generated**: 2026-05-01
**Input**: `specs/003-ai-growth-layer/spec.md`, `plan.md`, `data-model.md`, `contracts/api-contracts.md`
**Strategy**: Foundation → High ROI → AI Tools → Authority → Polish

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Parallelizable (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1–US8) for story-phase tasks
- All paths are absolute from repository root

---

## Phase 1: Foundation Setup

**Purpose**: Create content folders, shared schemas, shared UI components, and backend route stubs. This phase unblocks ALL user stories.

### Backend Foundation

- [ ] T001 [P] Create `backend/api/schemas/analytics.py` — Pydantic models `LeadEventRequest`, `LeadEventResponse` per data-model.md
- [ ] T002 [P] Create `backend/api/schemas/estimator.py` — Pydantic models `EstimateRequest`, `EstimateResponse` per data-model.md
- [ ] T003 [P] Create `backend/api/schemas/reviewer.py` — Pydantic models `ReviewRequest`, `ReviewResponse` per data-model.md
- [ ] T004 [P] Create `backend/api/schemas/subscriber.py` — Pydantic models `SubscribeRequest`, `SubscribeResponse` per data-model.md
- [ ] T005 [P] Create `backend/services/analytics_service.py` — In-memory event store with `track_event()`, `get_summary()`, `export_csv()` per data-model.md
- [ ] T006 [P] Create `backend/services/subscriber_service.py` — In-memory subscriber store with `subscribe()`, `is_subscribed()`, `get_all()`, `export_csv()` per data-model.md
- [ ] T007 Register `analytics_service`, `subscriber_service` in `backend/api/index.py` include_router calls

### Frontend Foundation

- [x] T008 [P] ✅ Create `src/content/` folder structure: `src/content/case-studies/` and `src/content/blog/` (folders created; content served from `public/content/`)
- [x] T009 [P] ✅ Create `src/components/seo/SeoMeta.tsx` — reusable component accepting `title`, `description`, `ogImage`, `canonicalUrl`, `type`, `jsonLd` props
- [x] T010 [P] ✅ Create `src/lib/analyticsService.ts` — `trackEvent(eventType, metadata?)` wrapper calling `POST /api/analytics/track`
- [x] T011 [P] ✅ Create `src/hooks/useAnalytics.ts` — React hook wrapping `analyticsService`, provides `trackDownload()`, `trackCTA()`, `trackChatbot()`, `trackEstimator()`, `trackReviewer()`, `trackEmailCapture()`
- [x] T012 [P] ✅ Create `src/lib/contentLoader.ts` — utility to fetch and parse static JSON/Markdown content from `/content/`
- [x] T013 [P] ✅ Update `src/App.tsx` to import `BrowserRouter` and add placeholder routes for all new pages (register routes only, components imported later)

**Checkpoint**: Foundation ready — all schemas, services, and route stubs exist. Proceed to any user story.

---

## Phase 2: Case Studies (US1 — P1)

**Goal**: Display structured project pages with challenge, approach, tech stack, results, and screenshots. Highest-ROI feature — converts serious visitors immediately.

**Independent Test**: Visitor lands on `/case-studies`, reads cards, clicks into a detail page, reads full content, and forms positive assessment of capabilities.

- [x] T014 [P] [US1] ✅ Create `src/content/case-studies/ai-chatbot-platform.json` — Case study with slug, title, excerpt, challenge, approach, stack, results, screenshots, published_date, tags (per data-model.md) → `public/content/case-studies.json`
- [x] T015 [P] [US1] ✅ Create `src/content/case-studies/automation-dashboard.json` — Second case study with all required fields → `public/content/case-studies.json` (combined)
- [x] T016 [US1] ✅ Create `src/lib/caseStudiesLoader.ts` — Load and parse case studies from `public/content/case-studies.json`
- [x] T017 [US1] ✅ Create `src/components/CaseStudiesSection.tsx` — Section displaying case study cards with title, excerpt, tags, date
- [x] T018 [US1] ✅ Create `src/components/CaseStudyCard.tsx` — Individual premium card component with image, title, excerpt, stack badges, CTA link
- [x] T019 [US1] ✅ Create `src/pages/CaseStudyPage.tsx` — Dynamic page rendering case study by slug: challenge, approach, stack chips, results list, screenshots, JSON-LD schema
- [x] T020 [US1] ✅ Add route `Route path="case-studies" element={<CaseStudyPage />}` in `src/App.tsx` (using lazy-loaded CaseStudyPage)
- [x] T021 [US1] ✅ Add route `Route path="case-studies/:slug" element={<CaseStudyPage />}` in `src/App.tsx`
- [x] T022 [US1] ✅ Add `CaseStudiesSection` to `src/pages/Index.tsx` after Projects section with SectionDivider
- [x] T023 [US1] ✅ Add SEO meta in `CaseStudyPage.tsx` using `SeoMeta`: title from case study, description from excerpt, og:image from first screenshot, canonical URL, JSON-LD Article schema
- [x] T024 [US1] ✅ Wire `useAnalytics` in `CaseStudyPage` to fire `trackCTA("Case Study: <title>", page)` on page load (backend now live)
- [x] T025 [US1] ⏳ Validate: case study pages render at 320px, 768px, 1280px with no layout shifts (requires visual QA pass)

**Checkpoint**: Case Studies visible at `/case-studies` and `/case-studies/:slug`. SEO metadata correct.

---

## Phase 3: Lead Analytics (US2 — P1)

**Goal**: Track resume downloads, contact submissions, chatbot sessions, and CTA clicks. Provide admin dashboard for aggregate counts.

**Independent Test**: Resume download fires event → admin dashboard shows incremented count within 5 minutes.

### Backend

- [x] T026 [P] [US2] ✅ Create `backend/api/routes/analytics.py` — POST `/api/analytics/track` endpoint: validates event_type, calls `analytics_service.track_event()`, returns `{ ok: true }`
- [x] T027 [P] [US2] ✅ Create `backend/api/routes/admin.py` — GET `/api/admin/analytics` with `X-Analytics-Password` auth, GET `/api/admin/subscribers/export` for CSV
- [x] T028 [US2] ✅ Wire rate limiting in `analytics.py`: no per-IP limit on POST `/api/analytics/track` (aggregate only, per spec)
- [x] T029 [US2] ✅ Wire routes in `backend/api/index.py`: include `analytics.router` and `admin.router` with prefix `/api`
- [x] T030 [US2] ✅ Add `ANALYTICS_PASSWORD` to `backend/.env.example`

### Frontend

- [x] T031 [US2] ✅ Add `onClick` tracker in `Contact.tsx` to fire `trackContact()` on successful submit
- [x] T032 [US2] ✅ Add `onClick` tracker in Hero + Contact resume download CTAs to fire `trackDownload()`
- [x] T033 [US2] ✅ Add tracker in `ChatBot.tsx` to fire `trackChatbot()` on first user message (sessionTracked guard prevents duplicates)
- [x] T034 [US2] ✅ Create `src/pages/AdminAnalytics.tsx` — Password gate → summary metric cards (7 metrics) → recent events table → subscriber CSV export
- [x] T035 [US2] ✅ Add route `Route path="admin/analytics" element={<AdminAnalytics />}` in `src/App.tsx`

**Checkpoint**: Analytics events recording. Admin dashboard shows aggregate counts. Existing flows (contact, resume, chatbot) unmodified.

---

## Phase 4: Email Capture (US3 — P1)

**Goal**: Non-intrusive inline email capture module. Subscriber list grows over time for newsletter use.

**Independent Test**: Visitor enters email → success confirmation shown → subscriber stored in backend.

### Backend

- [x] T036 [P] [US3] ✅ Create `backend/api/routes/email_capture.py` — POST `/api/subscribe`: validates email, calls `subscriber_service.subscribe()`, returns "You're subscribed!" or "Already subscribed"
- [x] T037 [US3] ✅ Wire rate limiting in `email_capture.py`: 10 requests per IP per 1-minute rolling window using existing `_rate_store` pattern
- [x] T038 [US3] ✅ Wire route in `backend/api/index.py`: include `email_capture.router` with prefix `/api`

### Frontend

- [x] T039 [US3] ✅ Create `src/components/EmailCapture.tsx` — Inline email capture module: single email input, subscribe button, success state ("You're in!"), localStorage check to suppress if already shown in session
- [x] T040 [US3] ✅ Place `EmailCapture` component in `src/pages/Index.tsx` after Hero section (before About), wrapped in non-intrusive container
- [x] T041 [US3] ✅ Wire `trackEvent("email_capture")` in `EmailCapture` on successful subscription

**Checkpoint**: Email capture visible after hero. Subscribers stored. No repeat prompt in same session.

---

## Phase 5: SEO Metadata (US7 partial — P1)

**Goal**: Meta title, description, Open Graph, Twitter Card, and canonical URL on all key pages. Every day delayed = lost indexing time.

**Independent Test**: View page source → all required meta tags present with correct values.

- [x] T042 [P] [US7] ✅ Add `SeoMeta` to `src/pages/Index.tsx` (homepage): title "Asad Shabir — AI Full-Stack Developer Pakistan", description (max 160 chars), og:image pointing to `/og-image.jpg`, canonical from `window.location.href`
- [x] T043 [P] [US7] ✅ Add Person JSON-LD schema in `Index.tsx` via `SeoMeta jsonLd` prop: name, jobTitle, url, sameAs (LinkedIn, GitHub, Facebook URLs)
- [x] T044 [US7] ✅ Add `SeoMeta` to `src/pages/CaseStudyPage.tsx`: per-case-study title, description, og:image from first screenshot or default, JSON-LD Article schema
- [ ] T045 [US7] ⏳ Add `SeoMeta` to `src/pages/BlogIndex.tsx` (blog listing page — created in Phase 7): blog listing meta
- [ ] T046 [US7] ⏳ Add `SeoMeta` to `src/pages/BlogArticle.tsx` (article page — created in Phase 7): per-article title, description, og:image, canonical
- [ ] T047 [US7] ⏳ Create `public/og-image.jpg` — 1200x630px image with Asad's photo, title "Asad Shabir — AI Full-Stack Developer", subtle branding (placeholder SVG created — needs real photo)
- [x] T048 [US7] ✅ Update `public/robots.txt` to ensure `/admin/` is disallowed, all other pages allowed
- [x] T049 [US7] ✅ Create `public/sitemap.xml` — list all static routes: `/`, `/case-studies`, `/case-studies/:slug` for each case study

**Checkpoint**: All pages have correct meta tags. OG image renders on LinkedIn/Twitter/WhatsApp.

---

## Phase 6: AI Project Estimator (US4 — P2)

**Goal**: Visitor describes a project → receives complexity, timeline, stack, risks, and next steps. Pre-qualifies leads before contact.

**Independent Test**: Visitor enters project description → receives structured response within 10 seconds.

### Backend

- [x] T050 [P] [US4] Create `backend/services/estimator_service.py` — Groq API call with custom system prompt: persona (Asad Shabir), EN/UR/SD language support, output format (JSON with complexity, timeline_weeks, recommended_stack, risks, next_steps), reuse `guardrails.strip_injection()`, catch and handle malformed JSON responses
- [x] T051 [US4] Create `backend/api/routes/estimator.py` — POST `/api/estimate`: validates description (10-2000 chars), language (en/ur/sd), budget_range optional, timeline optional, calls `estimator_service.get_estimate()`, returns structured response
- [x] T052 [US4] Wire rate limiting in `estimator.py`: 5 requests per IP per 1-minute window using existing pattern
- [x] T053 [US4] Wire route in `backend/api/index.py`: include `estimator.router` with prefix `/api`

### Frontend

- [x] T054 [US4] Create `src/components/ProjectEstimator.tsx` — Multi-step form: project description textarea, budget range select (optional), timeline input (optional), language select (en/ur/sd), submit button, loading state, results display (complexity badge, timeline, stack chips, risks list, next steps list), CTA to contact on results
- [x] T055 [US4] Add route `Route path="estimator" element={<ProjectEstimator />}` in `src/App.tsx`
- [x] T056 [US4] Wire `trackEvent("estimator_use")` in `ProjectEstimator` on successful estimate
- [x] T057 [US4] Add `SeoMeta` to `ProjectEstimator` page: title "AI Project Estimator — Asad Shabir", description "Get an instant AI estimate for your project"
- [x] T058 [US4] Add nav link or footer link to `/estimator`

**Checkpoint**: Estimator accessible at `/estimator`. Responds within 10s. Non-English inputs handled.

---

## Phase 7: AI Resume Reviewer (US5 — P2)

**Goal**: Visitor pastes resume text → receives score, strengths, weaknesses, ATS tips, skill gaps, improvements. Viral shareable tool.

**Independent Test**: Visitor pastes resume → receives structured review within 15 seconds.

### Backend

- [x] T059 [P] [US5] Create `backend/services/reviewer_service.py` — Groq API call with custom system prompt: persona (Asad Shabir), EN/UR/SD language support, output format (JSON with score 1-100, strengths, weaknesses, ats_tips, skill_gaps, improvements), detect non-resume documents (no name/email/education patterns), reuse `guardrails.strip_injection()`, handle malformed JSON
- [x] T060 [US5] Create `backend/api/routes/resume_reviewer.py` — POST `/api/review-resume`: validates resume_text (100-10000 chars), language (en/ur/sd), calls `reviewer_service.get_review()`, returns structured response or polite error if not a resume
- [x] T061 [US5] Wire rate limiting in `resume_reviewer.py`: 5 requests per IP per 1-minute window using existing pattern
- [x] T062 [US5] Wire route in `backend/api/index.py`: include `resume_reviewer.router` with prefix `/api`

### Frontend

- [x] T063 [US5] Create `src/components/ResumeReviewer.tsx` — Form: resume text textarea, language select, submit button, loading state, results display (score ring/progress, strengths list, weaknesses list, ATS tips accordion, skill gaps, improvements), share button, CTA to hire Asad
- [x] T064 [US5] Add route `Route path="resume-reviewer" element={<ResumeReviewer />}` in `src/App.tsx`
- [x] T065 [US5] Wire `trackEvent("reviewer_use")` in `ResumeReviewer` on successful review
- [x] T066 [US5] Add `SeoMeta` to `ResumeReviewer` page: title "AI Resume Reviewer — Asad Shabir", description "Get an instant AI review of your resume"
- [x] T067 [US5] Add nav link or footer link to `/resume-reviewer`

**Checkpoint**: Resume reviewer accessible at `/resume-reviewer`. Responds within 15s. Detects non-resume input politely.

---

## Phase 8: Blog / Insights CMS (US7 — P2)

**Goal**: Publish technical articles with SEO metadata and JSON-LD. Drive long-term organic search traffic.

**Independent Test**: Visitor reads article → sees reading time, tags, SEO metadata, JSON-LD schema.

- [ ] T068 [P] [US7] Create `src/content/blog/building-ai-agent.md` — Article with YAML frontmatter (title, excerpt, published_date, tags) and Markdown body
- [ ] T069 [P] [US7] Create `src/content/blog/fastapi-deployment.md` — Second article with all frontmatter
- [ ] T070 [P] [US7] Create `src/content/blog/groq-api-best-practices.md` — Third article with all frontmatter
- [ ] T071 [US7] Create `src/lib/blogLoader.ts` — Load blog posts: parse frontmatter, calculate `reading_time_minutes` from word count, return sorted by date descending
- [ ] T072 [US7] Create `src/components/BlogSection.tsx` — Section displaying latest 3 blog post cards on homepage
- [ ] T073 [US7] Create `src/components/BlogCard.tsx` — Article card: title, excerpt, date, reading time, tags
- [ ] T074 [US7] Create `src/pages/BlogIndex.tsx` — Full blog listing page with all posts, tag filtering, search input
- [ ] T075 [US7] Create `src/pages/BlogArticle.tsx` — Dynamic article page: render Markdown with `react-markdown`, display reading time, tags, date, author, prev/next navigation
- [ ] T076 [US7] Add Article JSON-LD schema in `BlogArticle.tsx` via `SeoMeta jsonLd` prop: headline, author, datePublished, image, publisher
- [ ] T077 [US7] Add routes in `src/App.tsx`: `Route path="blog" element={<BlogIndex />}` and `Route path="blog/:slug" element={<BlogArticle />}`
- [ ] T078 [US7] Add `BlogSection` to `src/pages/Index.tsx` after Experience section
- [ ] T079 [US7] Update `public/sitemap.xml` to include all blog routes
- [ ] T080 [US7] Validate: blog pages render readable typography at 320px, 768px, 1280px

**Checkpoint**: Blog visible at `/blog`. Articles indexable with correct SEO. Reading time shown.

---

## Phase 9: Trust Signals (US8 — P3)

**Goal**: Visitors see years of experience, stack highlights, response time, and collaboration style above the fold or in first viewport.

**Independent Test**: Page loads → trust signals visible within 1.5 seconds without scrolling.

- [ ] T081 [P] [US8] Create `src/data/trustSignals.ts` — Constants: years_experience, role_title, focus_areas[], response_time, collaboration_style, stack_highlights[], client_types[]
- [ ] T082 [US8] Create `src/components/TrustSignals.tsx` — Premium horizontal stats bar: experience years, projects completed, clients served, avg response time. Minimal, above-the-fold placement in Hero or just below.
- [ ] T083 [US8] Integrate `TrustSignals` into `src/components/Hero.tsx` below the name/title/tagline, above the CTA buttons — must appear without scroll on initial load
- [ ] T084 [US8] Add "Powered by Groq" subtle badge in Hero or Footer (visible but not dominant)
- [ ] T085 [US8] Update `src/components/About.tsx` to prominently list stack highlights, years experience, and collaboration style in the first paragraph
- [ ] T086 [US8] Validate: trust signals visible on homepage load within 1.5s on 3G connection

**Checkpoint**: Trust signals visible immediately on page load. No scroll required.

---

## Phase 10: Conversion Polish (US8 — P3)

**Goal**: Ensure every AI tool, case study, and blog article has clear conversion CTAs. Reduce friction for serious visitors.

- [ ] T087 [P] Create `src/components/ConversionCTA.tsx` — Reusable CTA banner: "Ready to start? Let's talk." with contact link, used across estimator results, resume review results, case study pages, blog articles
- [ ] T088 [P] Add `ConversionCTA` to `src/pages/CaseStudyPage.tsx` after results section
- [ ] T089 [P] Add `ConversionCTA` to `src/pages/BlogArticle.tsx` after article body
- [ ] T090 [P] Add `ConversionCTA` to `src/components/ProjectEstimator.tsx` after results display
- [ ] T091 [P] Add `ConversionCTA` to `src/components/ResumeReviewer.tsx` after review display
- [ ] T092 [P] Update `src/components/Contact.tsx` — Add a "Quick Project Estimator" link above the form as secondary CTA
- [ ] T093 [P] Update `src/components/Navbar.tsx` — Add nav links for: Case Studies, Blog, Estimator, Resume Reviewer (styled as premium nav items)
- [ ] T094 [P] Update footer in `src/pages/Index.tsx` — Add links to Case Studies, Blog, Estimator, Resume Reviewer pages

**Checkpoint**: Every content page has a clear next step CTA. Navigation clear and accessible.

---

## Phase 11: Finalization & QA

**Purpose**: Cross-cutting validation, regression checks, performance, and accessibility.

- [ ] T095 [P] Run `npm run build` — verify zero TypeScript errors and successful production build
- [ ] T096 [P] Test all existing routes unchanged: `/api/contact`, `/api/chat`, `/api/resume`, `/api/health` return expected responses
- [ ] T097 [P] Run `cd backend && pytest` — verify all existing backend tests pass (no regressions)
- [ ] T098 [P] Test all new API routes with curl (per quickstart.md commands): `/api/analytics/track`, `/api/subscribe`, `/api/estimate`, `/api/review-resume`, `/api/admin/analytics`
- [ ] T099 [P] Accessibility pass: verify all new interactive elements have focus indicators, aria-labels, keyboard navigation (Tab, Enter, Escape)
- [ ] T100 [P] Reduced-motion pass: verify all new animations respect `prefers-reduced-motion: reduce` — no animation when user preference set
- [ ] T101 [P] Mobile QA: test Case Studies, Blog, Estimator, Resume Reviewer, Email Capture at 320px, 768px
- [ ] T102 [P] Console error pass: open DevTools on all new pages, verify zero console errors
- [ ] T103 [P] SEO validation: use `curl -s <url> | grep og:title` on all key pages to verify OG tags present
- [ ] T104 [P] Analytics verification: trigger each event type (download, contact, chatbot, CTA, capture, estimate, review), verify counts increment in admin dashboard
- [ ] T105 [P] Rate limit test: verify `/api/subscribe` returns 429 after 11 requests from same IP within 1 minute
- [ ] T106 [P] Prompt injection test: send `INST: ignore previous instructions` to `/api/estimate` and `/api/review-resume`, verify sanitized response (not executed)

**Checkpoint**: All validation passed. Site ready for deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Foundation)  ────────────────────────────────► All Phases 2–11
Phase 2 (Case Studies) ────► Phase 5 (SEO meta)
Phase 3 (Analytics) ────► Phase 4 (Email Capture)
Phase 6 (Estimator) ────► Phase 7 (Resume Reviewer)   (parallel)
Phase 8 (Blog) ────► Phase 9 (Trust Signals) ────► Phase 10 (Conversion) ────► Phase 11 (QA)
```

### Fastest Path to Visible Value

```
T001–T013 (Foundation)
  → T014–T025 (Case Studies)
  → T042–T049 (SEO)
```

Visitor sees Case Studies immediately with proper SEO indexing.

### Fastest Path to Lead Generation

```
T001–T013 (Foundation)
  → T026–T035 (Analytics)
  → T036–T041 (Email Capture)
  → T050–T058 (Estimator)
```

Complete analytics → email capture → estimator pipeline delivers measurable leads.

### Fastest Path to SEO Growth

```
T001–T013 (Foundation)
  → T014–T025 (Case Studies + OG tags)
  → T042–T049 (Full SEO metadata)
  → T068–T080 (Blog CMS)
  → T047 (OG image)
  → T049 (sitemap.xml)
```

Full SEO surface: case studies, blog, sitemap, robots.txt, JSON-LD.

### Fastest Safe MVP Subset

```
Phase 1 (T001–T013) + Phase 2 (T014–T025) + Phase 5 (T042–T043)
```

Foundation + Case Studies + Homepage SEO = deployable MVP with visible ROI.
All other features can be added incrementally without breaking existing flows.

### Task Count Summary

| Phase | Tasks | User Story |
|-------|-------|------------|
| 1 — Foundation | T001–T013 (13 tasks) | — |
| 2 — Case Studies | T014–T025 (12 tasks) | US1 |
| 3 — Analytics | T026–T035 (10 tasks) | US2 |
| 4 — Email Capture | T036–T041 (6 tasks) | US3 |
| 5 — SEO | T042–T049 (8 tasks) | US7 |
| 6 — Estimator | T050–T058 (9 tasks) | US4 |
| 7 — Resume Reviewer | T059–T067 (9 tasks) | US5 |
| 8 — Blog | T068–T080 (13 tasks) | US7 |
| 9 — Trust Signals | T081–T086 (6 tasks) | US8 |
| 10 — Conversion | T087–T094 (8 tasks) | US8 |
| 11 — Finalization | T095–T106 (12 tasks) | — |
| **Total** | **106 tasks** | |

### Parallel Execution Groups

**Group A** (Phase 1, can run in parallel):
- T001, T002, T003, T004 (backend schemas)
- T008, T009, T010, T011, T012 (frontend foundation)

**Group B** (Phase 2, can run in parallel):
- T014, T015 (content creation)

**Group C** (Phase 3–4 backend, can run in parallel):
- T026, T027 (analytics + admin routes)
- T036, T037 (email capture route)

**Group D** (Phase 6–7 backend, can run in parallel):
- T050, T059 (AI services)

**Group E** (Phase 10 conversion CTAs, can run in parallel):
- T088, T089, T090, T091 (CTA on each page)

**Group F** (Phase 11 QA, can run in parallel):
- T095, T096, T097, T099, T100, T101, T102, T103, T104, T105, T106

---

## Implementation Strategy

### Week 1: Highest ROI
1. Complete Phase 1 (Foundation)
2. Complete Phase 2 (Case Studies) — converts serious visitors immediately
3. Complete Phase 3 (Analytics) — data needed before traffic grows
4. Complete Phase 5 (SEO) — every day delayed = lost indexing time
5. Complete Phase 4 (Email Capture) — start list building now

### Week 2: Lead Magnet Layer
6. Complete Phase 6 (AI Estimator) — best client acquisition tool
7. Complete Phase 7 (AI Resume Reviewer) — best shareable viral tool

### Week 3: Authority Layer
8. Complete Phase 8 (Blog CMS) — long-term ranking moat
9. Complete Phase 9 (Trust Signals) — visible credibility
10. Complete Phase 10 (Conversion Polish) — close more leads

### Week 4: Polish
11. Complete Phase 11 (Finalization QA) — deploy with confidence
