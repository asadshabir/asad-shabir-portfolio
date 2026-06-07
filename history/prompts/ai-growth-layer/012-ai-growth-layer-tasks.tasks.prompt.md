---
id: 012
title: AI Growth Layer Tasks
stage: tasks
date: 2026-05-01
surface: agent
model: minimax-m2.5-free
feature: ai-growth-layer
branch: 003-ai-growth-layer
user: Asad Shabir
command: /sp.tasks
labels: [tasks, ai-growth-layer, implementation]
links:
  spec: specs/003-ai-growth-layer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-ai-growth-layer/tasks.md
tests:
  - null
---

## Prompt

Generate dependency-ordered implementation tasks for Branch: 003-ai-growth-layer using the completed plan artifacts (plan.md, research.md, data-model.md, contracts/api-contracts.md, quickstart.md).

Features: Case Studies (US1), Lead Analytics (US2), Email Capture (US3), SEO (US7), AI Estimator (US4), AI Resume Reviewer (US5), Blog CMS (US7), Trust Signals (US8).

User provided strategic execution order: Week 1 = Case Studies + Analytics + SEO + Email Capture; Week 2 = AI Estimator + Resume Reviewer; Week 3 = Blog + Trust + Conversion Polish; Week 4 = QA.

Output: 106 tasks across 11 phases, organized by user story, with task IDs, priorities, dependencies, file paths, and acceptance criteria.

## Response snapshot

Generated `specs/003-ai-growth-layer/tasks.md` with 106 tasks across 11 phases:

- Phase 1 (Foundation): T001–T013 — 13 tasks: backend schemas (analytics, estimator, reviewer, subscriber), services (analytics, subscriber), route registration, frontend folder structure, SeoMeta component, analyticsService, useAnalytics hook, contentLoader, App.tsx route stubs
- Phase 2 (Case Studies / US1): T014–T025 — 12 tasks: 2 case study JSON files, loader, Section/Card/Page components, routes, analytics tracking, SEO meta, responsive validation
- Phase 3 (Analytics / US2): T026–T035 — 10 tasks: analytics + admin backend routes, frontend trackers in Contact/Resume/ChatBot, AdminAnalytics page
- Phase 4 (Email Capture / US3): T036–T041 — 6 tasks: email_capture route with rate limiting, EmailCapture component, session suppression, analytics tracking
- Phase 5 (SEO / US7): T042–T049 — 8 tasks: SeoMeta on all pages, Person JSON-LD, og-image.jpg, robots.txt, sitemap.xml
- Phase 6 (Estimator / US4): T050–T058 — 9 tasks: estimator_service + route with rate limiting, ProjectEstimator component + routes + SeoMeta
- Phase 7 (Resume Reviewer / US5): T059–T067 — 9 tasks: reviewer_service + route with rate limiting, ResumeReviewer component + routes + SeoMeta
- Phase 8 (Blog / US7): T068–T080 — 13 tasks: 3 blog articles, loader, Section/Card/Index/Article components, JSON-LD, routes, sitemap update
- Phase 9 (Trust Signals / US8): T081–T086 — 6 tasks: trustSignals data, TrustSignals component, Hero integration, About updates
- Phase 10 (Conversion / US8): T087–T094 — 8 tasks: ConversionCTA component, CTA on all content pages, Contact secondary CTA, Navbar links, footer links
- Phase 11 (QA): T095–T106 — 12 tasks: build test, existing routes regression, pytest, new API routes, accessibility, reduced-motion, mobile QA, console errors, SEO validation, analytics verification, rate limit test, injection test

Identified 6 parallel execution groups. Fastest path to visible value: Foundation → Case Studies → SEO. Fastest safe MVP: Phase 1 + Phase 2 + Phase 5 (T042–T043 homepage SEO only).

## Outcome

- Impact: 106 executable tasks generated with exact file paths and acceptance criteria
- Tests: None (planning only)
- Files: 1 artifact — specs/003-ai-growth-layer/tasks.md
- Next prompts: Implement Phase 1 foundation tasks (T001–T013) for /sp.implement

## Evaluation notes (flywheel)

- Graders run and results (PASS/FAIL): N/A (task generation only)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
