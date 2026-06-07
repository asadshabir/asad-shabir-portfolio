---
id: "001"
title: "Portfolio Constitution Creation"
stage: "constitution"
date: "2026-05-01"
surface: "agent"
model: "sonnet"
feature: "none"
branch: "none"
user: "Asad Shabir"
command: "/sp.constitution"
labels: ["portfolio", "constitution", "ai-assistant", "spec-driven"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - ".specify/memory/constitution.md"
tests:
  - "none (constitution phase, no tests)"
---

## Prompt

Create a project constitution for a premium personal portfolio and AI assistant platform for Asad Shabir.

Non-negotiable principles:
1. This is a premium $2500-level portfolio experience, not a template.
2. UI must feel polished, fast, modern, and highly intentional.
3. The navbar must be stateless in appearance, but behaviorally dynamic:
   - visible on load
   - hides on scroll down
   - reappears on scroll up
   - never blocks content
   - sidebar quick buttons remain accessible at all times
4. The "Let's Connect" section must be static, calm, and elegant.
   - no distracting hover animation
   - no gimmicky motion
   - prioritize readability and trust
5. All animations must be subtle, performance-safe, and purpose-driven.
6. Accessibility matters:
   - readable contrast
   - keyboard support
   - responsive layout
   - reduced-motion support
7. Contact form must send real email to asadshabir505@gmail.com through backend credentials stored only in .env.
8. Resume button must download the file Asad_Shabir_Developer.pdf directly.
9. Backend secrets must never be hardcoded.
10. Use spec-driven development strictly.
11. Claude must always delegate specialized work to matching agents and skills when available.
12. Use OODA as the execution loop:
   - Observe
   - Orient
   - Decide
   - Act
13. Every implementation phase must end with validation, bug cleanup, and UX review.
14. Chatbot must stay professional, speak as Asad Shabir, support English, Urdu, and Sindhi, and remain aligned with portfolio context.
15. The chatbot backend must be designed for tool use, multi-agent orchestration, and safe function execution.
16. Do not over-engineer. Keep the architecture simple, scalable, and maintainable.

## Response snapshot

Constitution created with 16 core principles covering:
- Premium experience mandate (I. Premium Experience)
- UI polish and intentionality (II. Polished UI)
- Dynamic navbar behavior with scroll detection (III. Dynamic Navbar)
- Calm "Let's Connect" section (IV. Calm Connect Section)
- Animation guidelines (V. Subtle Animations)
- Accessibility requirements (VI. Accessibility)
- Real email contact via .env (VII. Real Email Contact)
- Resume direct download (VIII. Resume Direct Download)
- Secrets management (IX. Secrets Management)
- Spec-driven development (X. Spec-Driven Development)
- Agent delegation (XI. Agent Delegation)
- OODA execution loop (XII. OODA Execution Loop)
- Phase validation (XIII. Phase Validation)
- Professional chatbot (XIV. Professional Chatbot)
- Chatbot backend design (XV. Chatbot Backend Design)
- Simplicity mandate (XVI. Simplicity)

Technology stack adjusted to Vite + React (actual project stack), not Next.js.

## Outcome

- ✅ Impact: Constitution created with 16 principles, technology stack corrected to match actual Vite + React project
- 🧪 Tests: None (constitution phase)
- 📁 Files: 1 created (.specify/memory/constitution.md)
- 🔁 Next prompts: Create feature specification(s), implement portfolio features
- 🧠 Reflection: Constitution now guides all future implementation. Tech stack corrected during edit to match actual project (Vite + React vs assumed Next.js)

## Evaluation notes (flywheel)

- Failure modes observed: None (successful creation)
- Graders run and results (PASS/FAIL): Pass (valid constitution with all 16 principles)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a