# Asad Shabir Portfolio Constitution
<!-- Spec- Driven Development: SpecKit Plus Template for Portfolio + AI Assistant Platform -->

## Core Principles

### I. Premium Experience (NON-NEGOTIABLE)
This portfolio MUST deliver a $25,000-level professional experience. It is a bespoke product, not a template. Every detail must reflect craft, intentionality, and attention to quality. No shortcuts, no placeholder aesthetics.

### II. Polished UI
The user interface MUST feel polished, fast, modern, and highly intentional. Visual design serves usability and trust. Performance is a feature—pages must load instantly and interactions must feel immediate. Animations, when present, serve purpose and never distract.

### III. Dynamic Navbar (NON-NEGOTIABLE)
The navbar MUST be stateless in appearance but behaviorally dynamic:
- Visible on initial page load
- Hides on scroll down (user is reading/engaging)
- Reappears on scroll up (user wants to navigate)
- Never blocks content (use `position: sticky` with appropriate z-index management)
- Sidebar quick-action buttons remain accessible at all times

### IV. Calm "Let's Connect" Section (NON-NEGOTIABLE)
The contact/connect section MUST be static, calm, and elegant:
- No distracting hover animations
- No gimmicky motion effects
- Prioritize readability and trust over novelty
- This is where serious visitors convert; it must feel safe and professional

### V. Subtle, Purpose-Driven Animations
All animations MUST be subtle, performance-safe, and purpose-driven. Every animation must answer "why does this animate?" before implementation. Default to no animation unless motion serves a functional purpose (e.g., state feedback, attention direction).

### VI. Accessibility (NON-NEGOTIABLE)
Accessibility is non-negotiable and must be implemented from the start:
- Readable color contrast (WCAG AA minimum, target AA)
- Full keyboard support (Tab, Enter, Escape, Arrow keys)
- Responsive layout (mobile-first, tested at 320px, 768px, 1280px breakpoints)
- Reduced-motion support (`prefers-reduced-motion: reduce`) — respect user's OS preference
- Focus indicators visible on all interactive elements

### VII. Real Email Contact (NON-NEGOTIABLE)
The contact form MUST send real email to asadshabir505@ gmail.com:
- Backend credentials stored only in `.env` (RESEND_API_KEY or SMTP credentials)
- No hardcoded secrets, tokens, or API keys anywhere in source
- Server-side implementation only — never expose credentials to client

### VIII. Resume Direct Download
The resume download button MUST download `Asad_Shabir_Developer.pdf` directly:
- File lives in `public/` or `static/` directory
- Direct anchor download link — no JS拦截, no API call
- Filename must match the spec: `Asad_Shabir_Developer.pdf`

### IX. Secrets Management
Backend secrets MUST never be hardcoded. Use `.env` for all credentials and never commit `.env` to version control. Use `.env.example` as a template documenting required variables.

### X. Spec-Driven Development (NON-NEGOTIABLE)
Development MUST follow spec-driven development strictly:
- Constitution → spec → plan → tasks → implement → validate
- No implementation without a spec
- No feature expansion beyond spec scope
- All changes reference spec. md

### XI. Agent Delegation
When specialized agents or skills are available that match the current task, Claude MUST delegate to them. Do not attempt to solve specialized problems with general-purpose reasoning when a matching agent/skill exists. Available skills: security-review, sp.* commands, vercel.* commands, react-*-practices.

### XII. OODA Execution Loop
Every implementation task MUST follow the OODA loop:
- **Observe**: Gather context, read spec, understand constraints
- **Orient**: Analyze, detect patterns, identify gaps
- **Decide**: Choose the smallest viable change
- **Act**: Implement, validate, record PHR

### XIII. Phase Validation (NON-NEGOTIABLE)
Every implementation phase MUST end with:
1. Validation (does the implementation match spec?)
2. Bug cleanup (fix regressions before proceeding)
3. UX review (does it feel right to a first-time visitor?)

Do not proceed to the next phase with unresolved validation failures.

### XIV. Professional Chatbot (NON-NEGOTIABLE)
The AI chatbot MUST:
- Speak as Asad Shabir (first person, professional tone)
- Support English, Urdu (اردو), and Sindhi (سنڌي)
- Remain aligned with portfolio context (only answer about Asad's skills/experience/projects)
- Refuse off-topic requests politely

### XV. Chatbot Backend Design
The chatbot backend MUST be designed for:
- Tool use (function calling, safe sandboxed execution)
- Multi-agent orchestration (routing, delegation, response aggregation)
- Safe function execution (no arbitrary code execution, no data exfiltration)
- Professional voice consistency (always responds as Asad Shabir)

### XVI. Simplicity, Scalability, Maintainability
Architecture decisions MUST favor simplicity. Every complexity must be justified by a specific current need — not anticipated future requirements. Keep the architecture simple, scalable, and maintainable. YAGNI applies unless a principle here explicitly requires it.

## Additional Constraints

### Technology Stack
- Framework: Vite + React 18 with React Router 6 (App Router pattern)
- Styling: Tailwind CSS with Radix UI (shadcn/ui concepts)
- Backend: Vite backend proxy or Netlify Functions (if server functions needed)
- Email: Resend API (via .env RESEND_API_KEY)
- Deployment: Vercel (via @vercel/async)
- AI Backend: Anthropic Claude API (via .env ANTHROPIC_API_KEY)
- Animations: CSS transitions + Framer Motion (only where needed)
- State: Zustand (or React Context + useReducer for simplicity)
- Fonts: @fontsource or Google Fonts via CDN

### Deployment & Environment
- All secrets in `.env`; never committed
- `.env.example` documents all required variables
- Preview deployments for every branch
- Production deployment only on main merge
- Environment parity between local and Vercel

### Performance Budget
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Bundle size: < 200KB initial JS (code-split aggressively)
- No animation on reduced-motion preference
- Static assets: `public/` directory with cache headers

### SEO & Metadata
- Open Graph tags on all pages
- Structured data (JSON-LD) for Person/SoftwareApplication
- Sitemap and robots.txt via vercel.json or custom endpoint
- Canonical URLs
- Descriptive meta titles and descriptions per page

### Security
- No client-side secrets
- CSP headers on API routes
- Input sanitization on contact form
- Rate limiting on API endpoints
- No eval() or Function() in any code path
- Dependencies audited (npm audit) before production deploy

## Development Workflow

### Execution Loop (OODA)
1. **Observe**: Read spec.md, constitution.md, understand constraints
2. **Orient**: Analyze gap between current state and spec
3. **Decide**: Choose smallest viable change
4. **Act**: Implement → validate → PHR → commit

### Validation Checklist (end of each phase)
- [ ] Implementation matches spec.md
- [ ] No regressions in existing features
- [ ] No hardcoded secrets
- [ ] Accessibility check (keyboard navigation, contrast)
- [ ] Responsive check (320px, 768px, 1280px)
- [ ] Reduced-motion respected
- [ ] Performance feels instantaneous
- [ ] UX review: first-time visitor impression

### Code Standards
- TypeScript strict mode
- ESLint + Prettier configured
- Components: functional with hooks only
- No class components
- CSS variables for theming (no hardcoded colors)
- Comments only for intent, not for explaining obvious code

### Git Workflow
- Branch naming: `feature/`, `fix/`, `docs/`, `chore/`
- Commits: conventional commits (feat, fix, docs, chore)
- PRs: required for all changes to main
- Each commit: PHR recorded under `history/prompts/`
- Never skip pre-commit hooks

## Governance

### Versioning
- **Constitution Version**: 1.0.0
- **Ratification Date**: 2026-05-01
- **Last Amended**: 2026-05-01
- Version bumps: MAJOR (backward-incompatible principle changes), MINOR (new principle or expanded guidance), PATCH (clarifications)

### Amendment Procedure
1. Propose change in writing with rationale
2. Impact analysis on all templates and existing specs
3. Update constitution.md with version bump
4. Propagate changes to dependent templates
5. Notify all active spec/plan owners

### Compliance
- All PRs MUST verify constitutional compliance
- Complexity must be justified (simple alternative rejected because)
- Templates must stay in sync with constitution
- Runtime guidance must reference constitution

### Supersession
This constitution supersedes all other development practices in this project. When in conflict, this document wins.

**Version**: 1.0.0 | **Ratified**: 2026-05-01 | **Last Amended**: 2026-05-01