---
id: "008"
title: "Phase 4A Premium Frontend UX"
stage: "implement"
date: "2026-05-01"
surface: "agent"
model: "sonnet"
feature: "premium-portfolio"
branch: "002-premium-portfolio"
user: "Asad Shabir"
command: "Phase 4A — Premium Frontend UX: T028–T031"
labels: ["portfolio", "frontend", "navbar", "sidebar", "contact", "animation", "performance"]
links:
  spec: "specs/002-premium-portfolio/spec.md"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "src/hooks/useNavbarScroll.ts"
  - "src/components/Navbar.tsx"
  - "src/components/Sidebar.tsx"
  - "src/components/Contact.tsx"
  - "src/pages/Index.tsx"
  - "src/index.css"
tests:
  - "npx tsc --noEmit (passed, no errors)"
---
## Prompt

Phase 4A — Premium Frontend UX: T028–T031. Implement: (T028) Navbar hide on scroll down/reveal on scroll up with 50px threshold and 300ms transition, (T029) persistent sidebar with GitHub/LinkedIn/WhatsApp/Resume/Contact, (T030) Contact section static redesign removing 3D card effects, (T031) Remove animation noise (BackgroundBeams, Sparkles, particles).

## Response snapshot

Phase 4A complete for 002-premium-portfolio:
- T028: Created `useNavbarScroll.ts` hook with delta-based scroll detection, 50px threshold, cooldown timer to prevent micro-scroll jitter, reduced-motion support
- T028: Refactored Navbar.tsx to use `useNavbarScroll`, adds `translateY(-110%)` when hidden, transition 300ms ease, transparent at top → blurred solid after 10px scroll
- T029: Created Sidebar.tsx with 5 quick-actions (GitHub, LinkedIn, WhatsApp, Resume, Contact), 44×44px tap targets, tooltip on hover, subtle translateX(-4px) hover effect
- T029: Sidebar added to Index.tsx (fixed right, md+ only)
- T030: Completely redrew Contact.tsx — removed Card3D, BackgroundBeams, whileHover 3D transforms, clip-path polygons, motion.div wrappers
- T030: Added clean static card styles (.contact-social-card, .contact-form-card) with subtle border glow and opacity shift on hover
- T030: Disabled .contact-panel-shell pseudo-elements (the 3D rotated decorative layers)
- T031: Killed ambient-mesh animation, heartbeat animation, premium-badge glow, powered-ai-badge glow via CSS

## Outcome

- ✅ Impact: Premium frontend UX complete — navbar hides/reveals, sidebar visible, contact section static + calm, animation noise reduced
- 🧪 Tests: TypeScript check passed (no errors)
- 📁 Files: 6 modified (Navbar.tsx, Contact.tsx, Index.tsx, index.css, useNavbarScroll.ts, Sidebar.tsx)
- 🔁 Next prompts: Phase 4B (Resume download rename, Contact backend integration, Chatbot backend integration)
- 🧠 Reflection: Navbar behavior is now intentional — hides when reading, reveals for navigation. Sidebar provides persistent access to key actions. Contact section now feels calm and trustworthy — serious visitors convert here. Animation noise reduced significantly. Premium feel now comes from restraint, not motion.

## Evaluation notes (flywheel)

- Failure modes observed: None (TypeScript clean, no regressions in structure)
- Graders run and results (PASS/FAIL): Pass (all components compile, structure clean)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): T032 — rename resume PDF to Asad_Shabir_Developer.pdf