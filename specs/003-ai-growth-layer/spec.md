# Feature Specification: AI Growth Layer

**Feature Branch**: `003-ai-growth-layer`
**Created**: 2026-05-01
**Status**: Draft
**Input**: Build the AI Growth Layer for the Asad Shabir premium portfolio — transforming it from a presentation site into a conversion-focused client acquisition platform. Add: Case Studies (structured pages), Lead Analytics (tracking), Auto Email Capture (newsletter), AI Resume Reviewer, AI Project Estimator, Blog/Insights CMS, SEO metadata, Trust signals.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Case Studies: Showcasing Project Impact (Priority: P1)

A recruiter or potential client lands on the portfolio, reads Asad's case studies, and gains confidence in his ability to deliver. They see structured proof of skills before reaching out.

**Why this priority**: Case studies are the highest-trust content format for technical hiring. They convert visitors who aren't ready to contact yet but are evaluating.

**Independent Test**: Visitor reads a case study page, understands the challenge, approach, and results, and forms a positive assessment of Asad's capabilities.

**Acceptance Scenarios**:
1. **Given** a visitor reads a case study, **When** they arrive, **Then** the page clearly shows: challenge, approach, tech stack, results, and visual proof
2. **Given** a visitor lands on a case study from a search engine or social link, **When** the page loads, **Then** all SEO metadata is present (title, description, OG tags)
3. **Given** a recruiter reviews case studies, **When** they finish reading, **Then** they have clear evidence to decide to hire or collaborate

---

### User Story 2 - Lead Analytics: Understanding Visitor Behavior (Priority: P1)

Asad can view aggregate data about how visitors interact with the portfolio — which CTAs drive downloads, contact form submissions, and chatbot engagement. This data informs conversion optimization.

**Why this priority**: Without analytics, Asad cannot measure which features drive leads. Analytics turn the portfolio from a static site into a data-informed client acquisition machine.

**Independent Test**: Asad opens a simple analytics dashboard and sees counts of: resume downloads, contact form submissions, chatbot sessions, and key CTA clicks.

**Acceptance Scenarios**:
1. **Given** a visitor downloads the resume, **When** the download triggers, **Then** the event is recorded with a timestamp and source page
2. **Given** a visitor submits the contact form, **When** the submission succeeds, **Then** the event is recorded with the visitor's email (if provided)
3. **Given** Asad opens the analytics dashboard, **When** the page loads, **Then** the dashboard shows aggregate counts for all tracked events over time
4. **Given** Asad wants privacy, **When** analytics are collected, **Then** no personally identifiable information beyond email (voluntarily submitted) is stored

---

### User Story 3 - Auto Email Capture: Growing the Subscriber List (Priority: P1)

A visitor who is interested but not ready to contact opts into Asad's newsletter or update list. Later, Asad sends valuable content that converts subscribers into clients.

**Why this priority**: Email capture creates a long-term asset — a list of warm leads who have already shown interest in Asad's work. Even a small list (50-200 subscribers) drives significant value.

**Independent Test**: Visitor enters their email in a capture module and receives a confirmation. Asad can export the subscriber list.

**Acceptance Scenarios**:
1. **Given** a visitor scrolls past the hero section, **When** they encounter an email capture module, **Then** the module is non-intrusive and does not block content
2. **Given** a visitor enters their email and submits, **When** the submission succeeds, **Then** they receive confirmation and no spam
3. **Given** a visitor chooses not to subscribe, **When** they continue browsing, **Then** they are not repeatedly prompted or blocked

---

### User Story 4 - AI Project Estimator: Pre-Qualifying Leads (Priority: P2)

A potential client describes their project idea and receives an instant AI-generated estimate: complexity, timeline, tech stack, risks, and next steps. This qualifies the lead and sets expectations before a conversation.

**Why this priority**: The estimator engages visitors who have a project in mind but aren't sure if Asad is the right fit. It captures intent and filters time-wasters while providing real value.

**Independent Test**: Visitor enters a project description and receives a structured response within 10 seconds.

**Acceptance Scenarios**:
1. **Given** a visitor enters a project description, **When** they submit, **Then** they receive complexity level, estimated timeline, recommended stack, key risks, and next steps
2. **Given** the project description is too vague, **When** submitted, **Then** a polite message asks for more detail without rejecting the request
3. **Given** a visitor is satisfied with the estimate, **When** they want to proceed, **Then** a clear CTA to contact Asad or book a call is shown

---

### User Story 5 - AI Resume Reviewer: Demonstrating Expertise (Priority: P2)

A job seeker or peer uploads or pastes their resume text and receives an AI-generated review: strengths, weaknesses, ATS score, skill gaps, and improvement tips. This demonstrates Asad's AI expertise while providing value.

**Why this priority**: The resume reviewer creates viral, shareable value — each reviewer shares the result with their network, driving organic traffic back to the portfolio.

**Independent Test**: Visitor pastes resume text, receives a structured review with scores and actionable tips within 15 seconds.

**Acceptance Scenarios**:
1. **Given** a visitor pastes resume text or uploads a PDF/TXT file, **When** they submit, **Then** they receive a review with: overall score, strengths, weaknesses, ATS suggestions, skill gaps, and tips
2. **Given** the resume text is empty or too short, **When** submitted, **Then** a polite message asks for more content
3. **Given** the resume review is complete, **When** displayed, **Then** Asad's branding is present with a CTA to hire Asad or contact him

---

### User Story 6 - Blog / Insights: Establishing Authority (Priority: P2)

Asad publishes technical insights, project learnings, and industry perspectives. Visitors read articles, share them, and gain trust in Asad's expertise — converting to leads over time.

**Why this priority**: Blog content is the engine of organic SEO — it creates dozens of indexed pages that drive long-term search traffic, establishing Asad as a thought leader.

**Independent Test**: Visitor reads a blog article, sees estimated reading time, tags, and can navigate back to the main blog listing.

**Acceptance Scenarios**:
1. **Given** a visitor arrives on a blog article, **When** the page loads, **Then** SEO metadata (title, description, OG, canonical URL) is correctly set for the specific article
2. **Given** a visitor reads a blog article, **When** they scroll, **Then** reading time estimate and article tags are visible
3. **Given** a search engine indexes a blog article, **When** the crawler arrives, **Then** structured data (JSON-LD) helps the article appear correctly in search results

---

### User Story 7 - SEO & Social Sharing: Discoverable Portfolio (Priority: P2)

The portfolio ranks on Google for Asad's name and relevant keywords. When shared on LinkedIn, Twitter, or WhatsApp, it renders rich previews with Asad's photo and tagline.

**Why this priority**: Without SEO, the portfolio only gets traffic from direct links. With SEO, it gets organic discovery from recruiters and clients searching for Asad's skills.

**Independent Test**: Search for "Asad Shabir AI developer" — the portfolio appears in top results. Share on LinkedIn — rich preview renders with Asad's photo and description.

**Acceptance Scenarios**:
1. **Given** someone searches for "Asad Shabir", **When** they search, **Then** the portfolio appears in the top 3 results
2. **Given** someone shares the portfolio URL on LinkedIn, **When** the link is pasted, **Then** a rich preview shows: Asad's photo, title "Asad Shabir — AI Full-Stack Developer", and description
3. **Given** a search engine indexes any page on the portfolio, **When** the crawler arrives, **Then** canonical URLs prevent duplicate content issues

---

### User Story 8 - Trust Signals: Instant Credibility (Priority: P3)

Visitors immediately see years of experience, tech stack highlights, and collaboration style. These signals reduce friction in the decision to contact or hire.

**Why this priority**: Trust signals are the psychological bridge between "interesting portfolio" and "I should hire this person." They accelerate the conversion funnel.

**Acceptance Scenarios**:
1. **Given** a visitor arrives on any section of the portfolio, **When** they look for credibility, **Then** years of experience and key technologies are clearly visible above the fold or in the first section
2. **Given** a visitor reads the trust section, **When** they evaluate, **Then** response time and collaboration style are stated clearly

---

### Edge Cases

- What happens when a case study page has no screenshots? Show a placeholder that maintains the page structure without broken images.
- What happens when the analytics dashboard has no data? Show a friendly empty state with instructions, not an error.
- What happens when a visitor submits an email that is already subscribed? Show "Already subscribed" with no error.
- What happens when the AI project estimator receives a description in Urdu? Respond in Urdu with the same structure.
- What happens when the AI resume reviewer receives a non-resume document? Politely detect and ask for a CV or resume.
- What happens when a blog article has no tags? Show the article without tags — not a broken layout.
- What happens when the portfolio is shared on a platform that doesn't support OG tags? Fall back to plain-text title and URL.
- What happens on reduced-motion preference? Disable all non-essential animations on the blog, case studies, and AI tools.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display a Case Studies section with at least 2 structured project pages, each containing: challenge, approach, tech stack, results, and at least one screenshot or visual
- **FR-002**: Each case study page MUST have complete SEO metadata: meta title, meta description, Open Graph tags (og:title, og:description, og:image), Twitter Card tags, and canonical URL
- **FR-003**: The site MUST collect and display aggregate analytics: resume download count, contact form submission count, chatbot session count, and CTA click counts — updated within 5 minutes of each event
- **FR-004**: Analytics data MUST NOT include IP addresses, device fingerprints, or any identifying data beyond voluntarily-submitted email addresses
- **FR-005**: The site MUST have an email capture module that appears non-intrusively and stores subscriber emails for newsletter use
- **FR-006**: Email capture MUST show a success confirmation after submission and MUST NOT re-prompt the same visitor within the same session
- **FR-007**: The AI Project Estimator MUST accept a text description and return: complexity level (simple/moderate/complex), estimated timeline (range), recommended tech stack, top 3 risks, and next steps
- **FR-008**: The AI Project Estimator MUST respond within 10 seconds and gracefully handle vague descriptions by asking for clarification
- **FR-009**: The AI Resume Reviewer MUST accept pasted text or .txt/.pdf upload and return: overall score (1-100), strengths list (3-5 items), weaknesses list (3-5 items), ATS suggestions, skill gap analysis, and improvement tips
- **FR-010**: The AI Resume Reviewer MUST respond within 15 seconds and MUST detect and handle non-resume documents politely
- **FR-011**: The Blog/Insights section MUST display article cards with: title, excerpt, publication date, reading time estimate, and tags
- **FR-012**: Each blog article MUST have: SEO metadata (title, description, OG, canonical), JSON-LD structured data for Article schema, and readable typography at 320px, 768px, and 1280px
- **FR-013**: All pages MUST have: meta title (max 60 chars), meta description (max 160 chars), og:title, og:description, og:image (1200x630), og:url, and canonical URL
- **FR-014**: Trust signals (years of experience, stack highlights, response time, collaboration style) MUST be visible above the fold or in the first viewport on any page
- **FR-015**: All AI-powered features (Project Estimator, Resume Reviewer) MUST use the existing Groq API backend and follow the same identity rules (Asad Shabir persona, EN/UR/SD support)
- **FR-016**: All public endpoints MUST be rate-limited to prevent abuse: email capture (10/IP/minute), AI tools (5/IP/minute), analytics (no per-IP limit)
- **FR-017**: All user inputs to AI tools MUST be sanitised to prevent prompt injection — no HTML, no code fences, no system instruction overrides
- **FR-018**: The AI Project Estimator and Resume Reviewer MUST NOT expose raw model outputs — all responses MUST be formatted and structured server-side

### Key Entities

- **CaseStudy**: A structured project showcase with: slug, title, challenge, approach, stack (array of technology names), results (array of outcome strings), screenshots (array of image URLs), published_date, tags
- **LeadEvent**: An analytics record with: event_type (resume_download | contact_submission | chatbot_session | cta_click), timestamp (UTC), metadata (optional JSON — e.g., CTA label, page URL), visitor_email (optional, only if voluntarily submitted)
- **Subscriber**: An email capture record with: email, subscribed_at (UTC), source_page (URL where captured)
- **BlogPost**: A published article with: slug, title, excerpt, content (markdown), published_date, tags (array of strings), reading_time_minutes (auto-calculated)
- **AIEstimate**: The structured output of the Project Estimator with: complexity, timeline_weeks, recommended_stack, risks (array), next_steps (array)
- **ResumeReview**: The structured output of the Resume Reviewer with: score (1-100), strengths (array), weaknesses (array), ats_tips (array), skill_gaps (array), improvements (array)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Case study pages achieve an average time-on-page of at least 2 minutes (indicating genuine reading, not bounce)
- **SC-002**: The email capture module achieves a conversion rate of at least 5% of visitors who scroll past the hero section
- **SC-003**: The AI Project Estimator receives at least 10 submissions per month within 3 months of launch
- **SC-004**: The AI Resume Reviewer receives at least 20 uses per month within 3 months of launch and drives at least 3 shares or referrals
- **SC-005**: The blog section achieves at least 5 indexed articles within 3 months, with at least 1 article ranking on Google for a relevant long-tail keyword
- **SC-006**: Analytics dashboard shows data for all 4 tracked event types (resume downloads, contact submissions, chatbot sessions, CTA clicks) within 2 weeks of launch
- **SC-007**: Portfolio ranks in top 3 Google results for "Asad Shabir" within 1 month of SEO implementation
- **SC-008**: Trust signals are visible on initial page load (within 1.5 seconds) without requiring scroll
- **SC-009**: Zero console errors on any new page (blog, case studies, AI tools) at launch — verified by automated scan
- **SC-010**: No layout shifts or broken grids on any new page at 320px, 768px, and 1280px breakpoints

---

## Assumptions

- The blog will be content-managed via static JSON/Markdown files (no database) for simplicity and deployment speed
- Analytics will be stored in-memory on the backend (acceptable for low-traffic portfolio, resets on cold start)
- The email subscriber list will be exported as a CSV — no built-in email sending system (Resend handles contact, not newsletters)
- Case studies will be hardcoded as data objects initially, migratable to a CMS later
- SEO metadata for blog articles will be generated from frontmatter in each article file
- The AI Project Estimator and Resume Reviewer will reuse the existing Groq API with custom system prompts
- Analytics dashboard will be a protected route (basic password) to avoid exposing lead data publicly