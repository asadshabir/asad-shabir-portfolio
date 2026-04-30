## Plan: Premium $1500+ UI/UX Polish Layer

I will keep the existing profile image import, file, dimensions, object positioning, and all photo styling untouched. The changes will focus only on text, cards, controls, contact panels, chatbot button, and supporting CSS.

### 1. Hero section refinement
- Remove the hero badge row that currently renders `AI Agents`, `Digital FTE`, `Groq`, `OpenAI SDK`, and `Automation`, eliminating the concatenated text issue completely.
- Upgrade `Asad Shabir` into a more premium brand-logo treatment:
  - richer metallic/holographic gradient text fill using `background-clip: text`
  - subtle cyan/purple glow layers via text-shadow
  - slightly refined tracking and responsive sizing preservation
- Add a new animated neon EKG/heartbeat line directly below the name and above the animated title area.
  - Use an inline SVG or CSS-driven line with cyan-to-purple gradient stroke
  - Animate stroke dash/offset and glow for a continuous heartbeat pulse
- Rewrite the intro paragraph markup so `intelligent`, `production-ready`, and `automation` are individually highlighted with subtle neon gradient emphasis while the rest remains muted silver-white with improved line-height.

### 2. Floating “Back to Top” button
- Add a new React component, likely `ScrollToTop.tsx`, and mount it in `src/pages/Index.tsx`.
- The button will:
  - appear only after the user scrolls down past the hero area threshold
  - fade/slide in using Framer Motion
  - sit in a balanced floating position that does not conflict with the chatbot button, likely bottom-left on desktop/mobile
  - use frosted glass, a neon gradient border, inner shine, and 3D hover lift
  - smoothly scroll back to `#hero` when clicked

### 3. About expertise card redesign
- Replace the standard-looking expertise block cards for `AI & Agents`, `Full-Stack`, and `Automation` with asymmetrical/skewed 3D glass cards.
- Preserve the current content and legibility, but add:
  - clipped/skewed premium card silhouettes
  - counter-skewed inner content so text remains straight and readable
  - soft inner neon border tracing on hover
  - layered shadows and subtle depth highlights
- Keep the overall About section layout intact: same three-column desktop structure and stacked mobile behavior.

### 4. Dynamic chatbot button redesign
- Replace the current circular chat orb with a unique layered geometric AI icon shape.
- Use a hexagonal/teardrop-like 3D form with:
  - animated multi-color breathing glow
  - rotating geometric ring/layer
  - metallic/radial gradient body
  - preserved click behavior and label behavior
- Keep the chatbot panel itself functional and unchanged unless small class adjustments are needed for consistency.

### 5. Contact section premium panel upgrade
- Upgrade the two existing contact cards without changing their functional behavior.
- `Find me online` panel:
  - add overlapping multi-layer glass panel effects behind/around the card
  - convert social rows/icons into colorful floating geometric 3D tiles
  - maintain correct Gmail, LinkedIn, GitHub, Facebook links
  - apply brand-specific neon shadows and hover tilt/lift
- `Send a message` panel:
  - add layered glass panel styling matching the left card
  - enhance input and textarea focus states with animated gradient borders/glows
  - preserve current fake-send toast behavior and reset logic

### 6. Global CSS and animation support
- Extend `src/index.css` with reusable utilities/keyframes for:
  - premium name gradient/glow
  - heartbeat/EKG line animation
  - skewed expertise cards and hover-trace borders
  - scroll-to-top glass button
  - geometric chatbot orb breathing glow
  - layered contact panels
  - animated focused input gradient border
- Extend `tailwind.config.ts` only if needed for named keyframes/animations that are cleaner in Tailwind utilities.

### 7. Balance and responsive audit
- Review spacing affected by removing hero badges and adding the heartbeat line.
- Ensure mobile viewport balance around 390px wide:
  - no overlap between Back-to-Top and chatbot controls
  - contact cards remain readable
  - skewed About cards do not clip content
  - hero title/title animation spacing remains clean

## Files expected to change
- `src/components/Hero.tsx`
- `src/components/About.tsx`
- `src/components/ChatBot.tsx`
- `src/components/Contact.tsx`
- `src/pages/Index.tsx`
- `src/index.css`
- `tailwind.config.ts` if extra keyframes are needed
- New component: `src/components/ScrollToTop.tsx`

## Constraints I will follow
- The existing profile image will remain 100% unaltered and untouched.
- The core page layout and existing functional links/buttons will remain intact.
- Changes will be styling/detail upgrades plus the new Back-to-Top function only.