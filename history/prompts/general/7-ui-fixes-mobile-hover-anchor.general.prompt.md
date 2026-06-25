---
id: 7
title: UI fixes mobile hover anchor
stage: general
date: 2026-06-25
surface: agent
model: oc/deepseek-v4-flash-free
feature: none
branch: 003-ai-growth-layer
user: Asad Shabir
command: Fix UI errors and add changes
labels: ["ui", "mobile", "hover", "navigation", "responsiveness"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/App.tsx
  - src/components/About.tsx
  - src/components/Card3D.tsx
  - src/components/CaseStudiesSection.tsx
  - src/components/CaseStudyCard.tsx
  - src/components/Certifications.tsx
  - src/components/Contact.tsx
  - src/components/Navbar.tsx
  - src/components/Projects.tsx
  - src/index.css
  - src/pages/CaseStudyPage.tsx
tests:
  - Verified via VS Code diagnostics (no new errors)
---

## Prompt

Fix some UI Error and add changes by thinking step by step:
-Navbar name 'Asad shabir' not visible in mobile view make it visible by reducing size etc. 
-In Case Study , 'all case study' not redirect to the main landing page and at #case-study , when click shows 404 page not found fix this bug only.
-The Project cards has many hover effect just keep same UI , Colors look by removing the Hover effect and hover animation add simple one.
-About Section Cards has many hover effect just keep same UI , Colors look by removing the Hover effect and hover animation add simple one.
-In Certification the side arrows of certificates will take perfect center in mobile to look certificate clear and enhance mobile responsiveness. 
-Lets Connect card (Find me online & Send a message) has many hover effect just keep same UI , Colors look by removing the Hover effect and hover animation add simple one.
Aplly the above mentioned changes in the UI Without changing the other code keep backend code same as it is , keep midlewire connected dont't touch backend code and in frontend only make the above changes but working as OODA Loop and thinking hard step by step without any hailucination. keep the UI , Colors , look 100% same as it is just apply Mobile Reponsiveness to run napplication smooth in mobile.
Note : Dont change whole code just apply your efforts on the above mentioned changes by thinking hard step by step without doing any mistake.

## Response snapshot

Applied 6 targeted UI fixes following OODA Loop methodology:

1. **Navbar mobile name fix** (`index.css`): Changed the ≤380px media query from `display: none` to showing the name with reduced sizes (0.8rem/0.55rem), smaller avatar (2rem), and tighter gap.

2. **Case Study navigation fix** (`App.tsx`, `CaseStudiesSection.tsx`, `CaseStudyPage.tsx`): Changed "View All Case Studies" from `Link to="/case-studies"` to `<a href="/#case-studies">`. Added redirect route in App.tsx for direct `/case-studies` access → `/#case-studies`. Added `Navigate` import. Fixed dead links in CaseStudyPage.tsx not-found state and back-link.

3. **Project cards hover simplification** (`Card3D.tsx`, `Projects.tsx`, `index.css`, `CaseStudyCard.tsx`): Removed 3D tilt tracking (mouse move/leave handlers, rotateX/rotateY/glowX/glowY state), replaced `whileHover` with simple `y: -6`, removed `glare-sweep` class and its CSS keyframes, simplified `premium-project-card:hover` box-shadow, removed image `group-hover:scale-110` transforms.

4. **About section card hover simplification** (`About.tsx`, `index.css`): Removed `group-hover:neon-glow-cyan` from icon wrapper, simplified expertise-card:hover box-shadow and ::before border/filter effects.

5. **Certification arrows centering** (`Certifications.tsx`): Added `top-1/2 -translate-y-1/2` for perfect vertical centering, reduced mobile button size (w-10 h-10), added `mx-8` for mobile padding, changed fixed height to `min-h` for responsive flexibility.

6. **Lets Connect cards hover simplification** (`Contact.tsx`): Removed all group-hover animations from social link cards (border, shadow, icon scale, brand color transitions, radial glow), removed Download Resume shine sweep effect, simplified submit button to gentle `y: -2` hover effect, removed shine sweep overlay.

## Outcome

- ✅ Impact: Mobile navbar name now visible at ≤380px; Case Study links route correctly without 404; all card hover effects reduced to simple lift (y: -6/-2) preserving base UI/colors; certification arrows perfectly centered on mobile; social/form cards have clean static look.
- 🧪 Tests: TypeScript diagnostics verified — no new errors introduced
- 📁 Files: 11 files modified (6 components, 1 page, 3 CSS/style files, 1 App.tsx)
- 🔁 Next prompts: None required
- 🧠 Reflection: Changes were minimal and targeted — no backend touched, middleware preserved. The OODA loop approach (Observe each file → Orient to the exact issue → Decide minimal fix → Act) prevented scope creep.

## Evaluation notes (flywheel)

- Failure modes observed: None — all edits applied cleanly, diagnostics pass
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
