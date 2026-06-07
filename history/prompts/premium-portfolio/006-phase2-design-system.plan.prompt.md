---
id: "006"
title: "Phase 2 Design System"
stage: "plan"
date: "2026-05-01"
surface: "agent"
model: "sonnet"
feature: "premium-portfolio"
branch: "002-premium-portfolio"
user: "Asad Shabir"
command: "/sp.implement"
labels: ["portfolio", "implement", "phase2", "design-system", "ux"]
links:
  spec: "specs/002-premium-portfolio/spec.md"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "specs/002-premium-portfolio/design-system.md"
  - "specs/002-premium-portfolio/tasks.md (T007-T016 marked complete)"
tests:
  - "none (design phase)"
---

## Prompt

/sp.implement

Phase 2 — Orient. Define premium UX design system for Asad Shabir portfolio.

## Response snapshot

Phase 2 (OODA — Orient) complete. Design system document created at `specs/002-premium-portfolio/design-system.md` with 8 sections:

1. **Layout rules** — spacing scale (space-xs through space-4xl), container max-width 1120px, section structure
2. **Motion rules** — 300ms max micro, 500ms max reveals, ease-out/ease-in, no linear, animate transform+opacity only, reduced-motion CSS, DISALLOWED animations listed
3. **Navbar/sidebar rules** — fixed top-0, z-120, hide on 50px scroll down, reveal on scroll up, 300ms ease-out, sidebar fixed right z-100 always visible
4. **Contact section rules** — CRITICAL: remove all whileHover, 3D transforms, Card3D, BackgroundBeams from contact section. Static tiles, subtle opacity hover only
5. **Resume download rules** — Asad_Shabir_Developer.pdf, public/ directory, direct anchor, no JS interceptor, aria-label
6. **Chatbot placement rules** — floating bottom-right, z-90, compact widget, slide-up entry
7. **Mobile adaptation rules** — breakpoints 320/768/1280px, responsive multipliers, no horizontal scroll
8. **Accessibility rules** — WCAG AA contrast, keyboard nav, focus indicators, ARIA labels, reduced-motion

Also updated .gitignore (added .env protection) and created .env.example.

## Outcome

- ✅ Impact: Phase 2 design decisions complete, ready for Phase 3 implementation
- 🧪 Tests: None (design phase)
- 📁 Files: 1 created (design-system.md), 2 updated (.gitignore, .env.example, tasks.md)
- 🔁 Next prompts: Phase 3 — backend setup (create FastAPI skeleton)
- 🧠 Reflection: Design system document is actionable — developer can implement against it without additional questions. Key insight: contact section must be STATIC — removed all Framer Motion whileHover/3D from social tiles per constitution principle IV. Resume rename identified: Asad_Shabir_Resume.pdf → Asad_Shabir_Developer.pdf.

## Evaluation notes (flywheel)

- Failure modes observed: Agent subagent failed (API error) — fell back to direct file write
- Graders run and results (PASS/FAIL): Pass (all 8 design sections complete)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a