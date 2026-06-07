---

description: "Task list for premium portfolio implementation"

---

# Tasks: Premium Portfolio Website

**Feature Branch**: `002-premium-portfolio`
**Input**: Design documents from `specs/002-premium-portfolio/`
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅)
**User stories**: 5 (First Impression P1, Explore Expertise P1, Make Contact P1, Download Resume P2, Chat with Asad P2)

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in all descriptions

---

## Phase 1: Setup (OODA — Observe)

**Purpose**: Audit current codebase, identify existing structure, map all assets and entry points.

- [ ] T001 [P] Audit current frontend structure — list all components in `src/`, identify all page files, check `package.json` for dependencies
- [ ] T002 [P] Audit current navbar and sidebar implementation — locate in `src/components/`, identify scroll logic if any, note current behavior
- [ ] T003 [P] Audit current hero, About, Projects, Skills, and Contact sections — locate component files, identify existing styles, note animation usage
- [ ] T004 [P] Audit resume and chatbot integration — check `public/` for existing resume files, check for existing chatbot component
- [ ] T005 List all frontend entry points — `src/main.tsx` or `src/index.tsx`, routing setup, Vite config
- [ ] T006 Audit `.gitignore` and verify no `.env` is committed

**Checkpoint**: All current files and structure documented. Ready for Phase 2.

---

## Phase 2: Foundational (OODA — Orient)

**Purpose**: Define the premium UX system, decide on all design decisions, finalize structure before implementation.

**Output**: `specs/002-premium-portfolio/design-system.md` — complete design system document

- [x] T007 Define spacing system — space-xs through space-4xl scale defined
- [x] T008 Define typography system — display, h1-h2, body, small, caption with sizes/weights
- [x] T009 Define card and button styles — rounded-xl, shadow-sm, border subtle, primary + secondary button variants
- [x] T010 Define motion system — 300ms max micro, 500ms max reveals, ease-out/ease-in, reduced-motion CSS
- [x] T011 Define color palette — WCAG AA contrast verified, CSS variables for all palette tokens
- [x] T012 Define responsive breakpoints — 320px (mobile), 768px (tablet), 1280px (desktop), responsive multipliers
- [x] T013 Design navbar scroll behavior — fixed top-0, z-120, hide on 50px down, reveal on scroll up, 300ms ease-out
- [x] T014 Design sidebar persistence — fixed right, z-100, always visible, 44x44px tap targets mobile
- [x] T015 Design contact section — NO whileHover, NO 3D transforms, static tiles, calm styling
- [x] T016 Design chatbot UI — floating bottom-right, z-90, compact widget, slide-up entry

**Checkpoint**: All design decisions documented and approved. No implementation yet.

---

## Phase 3: Backend Setup (OODA — Decide)

**Purpose**: Finalize backend architecture, create project structure, set up Python FastAPI.

- [ ] T017 Create `backend/` directory structure per plan.md
- [ ] T018 Create `backend/requirements.txt` with: fastapi, uvicorn, pydantic, resend, groq, python-dotenv
- [ ] T019 Create `backend/api/index.py` — FastAPI app entry with CORS middleware
- [ ] T020 Create `backend/api/contact.py` — Contact form endpoint skeleton (no implementation yet)
- [ ] T021 Create `backend/api/chat.py` — Chatbot endpoint skeleton (no implementation yet)
- [ ] T022 Create `backend/api/resume.py` — Resume download endpoint skeleton (no implementation yet)
- [ ] T023 Create `backend/services/email.py` — Resend service skeleton (no implementation yet)
- [ ] T024 Create `backend/models/schemas.py` — Pydantic models for ContactSchema, ChatRequest, ChatResponse
- [ ] T025 Create `backend/tests/` directory with placeholder test files
- [ ] T026 Create `.env.example` documenting: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL, GROQ_API_KEY
- [ ] T027 Verify Vercel Python runtime compatibility — `api/index.py` exports `app` at top level

**Checkpoint**: Backend skeleton exists, no business logic yet. Secrets remain in .env only.

---

## Phase 4: User Story 1 — First Impression & Navigation (Priority: P1) 🎯 MVP START

**Goal**: Premium hero, working navbar (hide on scroll down, reveal on scroll up), accessible sidebar

**Independent Test**: Page loads on mobile; hero visible; sidebar buttons accessible; clicking scrolls to section; navbar hides on scroll down, reveals on scroll up.

### Implementation

- [ ] T028 [P] Create `src/hooks/useNavbarScroll.ts` — detect scroll direction, expose `isNavbarHidden`, scroll threshold 50px
- [ ] T029 [P] Refactor `src/components/Navbar.tsx` — apply `useNavbarScroll` hook, add hide/reveal CSS class, ensure `position: sticky`
- [ ] T030 [P] Refactor `src/components/Sidebar.tsx` — ensure always visible, set `z-index` above navbar, 44x44px tap targets on mobile
- [ ] T031 Refactor hero section — apply premium typography (large heading, subheading, CTA button), clean layout, fast load
- [ ] T032 Add smooth scroll behavior — CSS `scroll-behavior: smooth` or Framer Motion scroll-to-section
- [ ] T033 Add reduced-motion support — `@media (prefers-reduced-motion: reduce)` removes scroll animation

**Checkpoint**: Navbar hides on scroll down, reveals on scroll up. Sidebar always visible. Hero renders at all breakpoints.

---

## Phase 5: User Story 2 — Explore Expertise (Priority: P1)

**Goal**: Premium About, Services, Projects, Skills sections with polished visuals, consistent spacing

**Independent Test**: All four sections render without broken layouts at 320px, 768px, 1280px. No overlapping elements.

### Implementation

- [ ] T034 [P] Refactor About section — apply typography hierarchy, consistent padding, credibility indicators
- [ ] T035 [P] Refactor Projects section — premium card design, clean typography, consistent spacing, no glitchy hover
- [ ] T036 [P] Refactor Skills section — visual polish, grid layout, skill badges with consistent styling
- [ ] T037 Refactor Services section — clear presentation, icon usage, consistent card styling
- [ ] T038 Apply consistent spacing system — verify all sections use defined Tailwind spacing scale
- [ ] T039 Apply consistent border-radius and shadows — verify all cards and buttons match defined styles
- [ ] T040 Add keyboard navigation — Tab through all sections, visible focus indicators, ARIA labels
- [ ] T041 Run responsive testing — verify at 320px (mobile), 768px (tablet), 1280px (desktop)

**Checkpoint**: All sections render without broken layouts. Typography and spacing consistent. Keyboard navigation works.

---

## Phase 6: User Story 4 — Resume Download (Priority: P2)

**Goal**: One-click resume download of Asad_Shabir_Developer.pdf

**Independent Test**: Click "Download Resume" button → browser downloads Asad_Shabir_Developer.pdf. Works on mobile and desktop.

### Implementation

- [ ] T042 Place `Asad_Shabir_Developer.pdf` in `public/` directory — verify filename exactly matches
- [ ] T043 [P] Create resume download button component — `<a href="/Asad_Shabir_Developer.pdf" download>` with ARIA label
- [ ] T044 [P] Add "Download Resume" button to hero section and sidebar — accessible placement, visible styling
- [ ] T045 Verify download works — test on desktop (Chrome, Firefox) and mobile (Safari, Chrome Android)
- [ ] T046 Add cache headers — `Cache-Control: public, max-age=31536000` for resume file

**Checkpoint**: Resume downloads correctly on all browsers and devices. No server round-trip needed.

---

## Phase 7: User Story 3 — Make Contact (Priority: P1)

**Goal**: Contact form sends email to asadshabir505@gmail.com via Resend

**Independent Test**: User fills form, submits, receives email. Validation errors shown for invalid input.

### Backend Implementation

- [ ] T047 Implement `backend/api/contact.py` — POST /api/contact endpoint
- [ ] T048 Implement `backend/services/email.py` — Resend email sending with template
- [ ] T049 Implement Pydantic validation — ContactSchema with name (2-100), email (valid format), message (10-2000)
- [ ] T050 Implement rate limiting — 5 requests per IP per rolling 1-hour window
- [ ] T051 Implement error responses — 422 VALIDATION_ERROR, 429 RATE_LIMITED, 500 SEND_FAILED, 503 SERVICE_UNAVAILABLE
- [ ] T052 Create `backend/tests/test_contact.py` — pytest tests for valid submission, validation errors, rate limit

### Frontend Implementation

- [ ] T053 [P] Refactor contact form component — name, email, message fields with labels
- [ ] T054 [P] Add client-side validation — inline error messages on blur and submit
- [ ] T055 Connect form to backend — fetch POST /api/contact, handle success/error states, loading state
- [ ] T056 Style contact section — static, calm, no hover animation, readable typography (per FR-004)
- [ ] T057 Add graceful error handling — if backend down, show friendly message + alternative email

**Checkpoint**: Contact form sends email successfully. Validation works. Error handling graceful.

---

## Phase 8: User Story 5 — Chat with Asad (Priority: P2)

**Goal**: AI chatbot speaks as Asad Shabir in first person, supports EN/UR/SI, portfolio-aware

**Independent Test**: User types question about Asad's experience; chatbot responds in first person. Urdu message → Urdu response.

### Backend Implementation

- [ ] T058 Implement `backend/api/chat.py` — POST /api/chat endpoint
- [ ] T059 Implement Groq API integration — `base_url=https://api.groq.com/openai/v1`, `llama-3.3-70b-versatile`
- [ ] T060 Implement custom agent router — identity agent, portfolio Q&A agent, contact agent, safety agent
- [ ] T061 Implement system prompt — sealed prompt, first person, EN/UR/SI, portfolio scope, no off-topic
- [ ] T062 Implement language detection — Urdu Unicode range (؀-ۿ), Sindhi heuristic, fallback English
- [ ] T063 Implement prompt injection sanitization — strip code fences, template syntax, INST/SYSTEM lines
- [ ] T064 Implement tool whitelist — `send_contact_email` only, no dynamic tool construction
- [ ] T065 Implement rate limiting — 10 requests per IP per rolling 10-minute window
- [ ] T066 Implement error fallbacks — AI_TIMEOUT, AI_UNAVAILABLE, RATE_LIMITED messages in EN/UR/SI
- [ ] T067 Implement conversation state — in-memory session, last 10 messages, 30-minute TTL
- [ ] T068 Create `backend/tests/test_chatbot.py` — pytest tests for language detection, off-topic rejection, tool use

### Frontend Implementation

- [ ] T069 [P] Create chatbot widget component — message bubbles, input field, send button
- [ ] T070 [P] Create chatbot service — calls POST /api/chat, handles session_id, message history
- [ ] T071 Add chatbot language indicator — show detected language (EN/UR/SI) in UI
- [ ] T072 Add loading state — disable input during AI response
- [ ] T073 Add error state — show fallback message if API down
- [ ] T074 Connect chatbot to page or as floating widget — accessible placement

**Checkpoint**: Chatbot responds in first person as Asad Shabir. Urdu messages get Urdu responses. Off-topic requests redirected. Tool use limited to email only.

---

## Phase 9: Polish & Cross-Cutting (Final Phase)

**Purpose**: Final polish, accessibility audit, regression checks, cleanup

### Accessibility & UX

- [ ] T075 [P] Accessibility audit — axe-core on all pages, WCAG AA contrast, keyboard navigation
- [ ] T076 [P] Responsive regression — verify at 320px, 768px, 1280px, no horizontal scroll
- [ ] T077 [P] Reduced-motion regression — verify no animation plays with `prefers-reduced-motion: reduce`
- [ ] T078 Verify all focus indicators visible — no `outline: none` without replacement

### Performance & Security

- [ ] T079 [P] Bundle size check — initial JS < 200KB (check Vite build output)
- [ ] T080 [P] FCP check — verify First Contentful Paint < 1.5s (Playwright performance API)
- [ ] T081 Verify no hardcoded secrets — grep source for API_KEY, RESEND, GROQ; only in .env and Vercel dashboard
- [ ] T082 Verify rate limiting in place — contact (5/IP/hour) and chatbot (10/IP/10min)

### Final Validation

- [ ] T083 [P] Run QA_E2E smoke tests — Playwright tests for homepage, contact, resume, chatbot
- [ ] T084 [P] Run backend pytest suite — all tests pass
- [ ] T085 Verify edge cases — JS disabled (static content readable), resume 404 (graceful error), backend down (fallback messages)
- [ ] T086 Update CHANGELOG.md — document all changes for this release

**Checkpoint**: All tests pass. No console errors. No broken layouts. Secrets in .env only. Ready for release.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — no implementation until design is finalized
- **Phase 3 (Backend Setup)**: Can start after Phase 2 — backend skeleton before frontend integration
- **Phase 4 (US1 - Navbar)**: Depends on Phase 2 — needs design decisions before implementation
- **Phase 5 (US2 - Sections)**: Depends on Phase 4 — build on refined navbar/navigation
- **Phase 6 (US4 - Resume)**: Depends on Phase 4 — can run parallel with US2
- **Phase 7 (US3 - Contact)**: Depends on Phase 3 (backend) and Phase 5 (section polish)
- **Phase 8 (US5 - Chatbot)**: Depends on Phase 3 (backend) and Phase 7 (email tool built first)
- **Phase 9 (Polish)**: Depends on all user stories complete

### Critical Path

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 (US1) → Phase 5 (US2) → Phase 7 (US3 backend) → Phase 8 (US5)
                                      ↓
                              Phase 6 (US4 - parallel)
```

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **US2 (P1)**: Can start after US1 — uses refined navbar/navigation
- **US3 (P1)**: Can start after Phase 3 (backend ready) — independent of other stories
- **US4 (P2)**: Can start after Phase 4 (navbar done) — can run parallel with US2
- **US5 (P2)**: Can start after Phase 3 (backend ready) AND US3 (contact tool built) — depends on email tool

### Within Each User Story

- Design decisions → Implementation → Integration → Testing

### Parallel Opportunities

- T001, T002, T003, T004 run in parallel (Phase 1 — audit)
- T028, T029, T030 run in parallel (Phase 4 — US1 components)
- T034, T035, T036 run in parallel (Phase 5 — US2 sections)
- T043, T044 run in parallel (Phase 6 — US4 button placement)
- T053, T054 run in parallel (Phase 7 — US3 form frontend)
- T069, T070 run in parallel (Phase 8 — US5 chatbot UI)
- T075, T076, T077, T079, T080 run in parallel (Phase 9 — polish checks)
- T083, T084 run in parallel (Phase 9 — tests)

---

## Implementation Strategy

### MVP First (US1 + US2 + US4)

1. Complete Phase 1: Setup (observe)
2. Complete Phase 2: Foundational (orient)
3. Complete Phase 3: Backend Setup (decide)
4. Complete Phase 4: US1 — Navbar + Sidebar (act)
5. **STOP and VALIDATE**: Navbar hides on scroll, sidebar visible, hero polished
6. Complete Phase 5: US2 — Sections polish
7. **STOP and VALIDATE**: All sections render without broken layouts
8. Complete Phase 6: US4 — Resume download
9. **STOP and VALIDATE**: Resume downloads correctly
10. Deploy MVP — premium portfolio with polished UI and resume download

### Incremental Delivery

1. MVP (above) → Deploy — polish, navbar, resume
2. Add US3 — Contact form → Test independently → Deploy
3. Add US5 — Chatbot → Test independently → Deploy
4. Polish (Phase 9) → Final validation → Release

---

## Notes

- Tests are included in this spec — pytest for backend, Playwright for e2e
- No [NEEDS CLARIFICATION] markers remain — all decisions made in Phase 2
- All implementation follows constitution principles (premium experience, no hardcoded secrets, accessibility, subtle animations)
- Agent delegation: UI work → UI_Enhance agent, animations → Motion_Architect agent, backend → API_Engineer/Contact_Engineer agents