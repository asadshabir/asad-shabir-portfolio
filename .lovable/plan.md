Plan to overhaul the portfolio into a premium $1500+ futuristic 3D/glassmorphism experience while preserving all previous requirements: dark futuristic palette, uploaded profile photo, resume download, Built Projects before Experience, concise Skills, chatbot behavior, links, and mobile responsiveness.

1. Global premium visual system
- Upgrade `src/index.css` theme tokens while keeping the core identity:
  - Background stays near #0A0A0A but gains obsidian/midnight depth.
  - Cyan remains primary (#22D3EE), magenta/electric purple remains secondary (#C026D3), and add emerald as a premium tertiary accent.
- Add reusable high-end utility classes:
  - `premium-glass` / `premium-glass-strong` with blur(20px+), glossy 1px rgba white borders, layered inset shadows.
  - `holographic-text` / `metallic-text` for H1/H2 gradient fills.
  - `premium-badge` for 3D tags with inset shadows, micro gradients, and hover glow.
  - `glare-sweep` effect for glass cards on hover.
- Add ambient background animations:
  - Slow moving mesh gradients.
  - Subtle radial neon orbs.
  - Lightweight futuristic grid/noise depth.

2. Replace the profile image and rebuild hero image architecture
- Copy the uploaded image `portfolio_profile-2.png` into `src/assets/` and update `Hero.tsx` to import it instead of the current `profile-photo.png`.
- Replace the current circular profile photo with an independent dynamic 3D floating image box:
  - Non-basic premium shape: rounded-3xl / asymmetric card frame, not circle or plain square.
  - Continuous levitation using Framer Motion `translateY`, slight rotateX/rotateY, and slow scale breathing.
  - Existing pointer tilt preserved and enhanced.
  - Rotating conic neon gradient border around the image.
  - Pulsing outer drop shadow using cyan, purple, and emerald glow layers.
  - Keep the image crystal-clear: no blur/filter on the image itself, object-fit cover, sharp rendering.
- Add hero-side 3D visualization elements:
  - Floating tech/AI badges around the text/photo.
  - Small animated glowing particles/nodes.
  - Premium glass status chips such as AI Agents, Digital FTE, Automation, Groq, OpenAI SDK.

3. Upgrade shared 3D card architecture
- Refactor `Card3D.tsx` into a stronger premium card primitive:
  - Keep mouse-reactive perspective tilt.
  - Add hover elevation (`translateZ`/scale/y lift), stronger neon shadow, and smooth spring motion.
  - Add sweeping light glare across the surface on hover.
  - Use true glass styles by default instead of simpler current `glass` styling.
  - Support cyan, magenta, emerald, and mixed glow modes.
- This will automatically improve About, Skills, Projects, Experience, and Contact cards without duplicating logic.

4. Premium badges and pills
- Create or reuse a small `PremiumBadge` component for:
  - Project tech tags.
  - Skills marquee items.
  - Hero floating labels.
  - Featured/Live labels.
- Style badges with:
  - Semi-transparent dark glass base.
  - Inset shadows and metallic gradients.
  - 1px glossy borders.
  - Hover glow and small 3D lift.

5. Section-by-section layout refinement
- `Hero.tsx`
  - Apply holographic/metallic heading treatment.
  - Add layered depth behind text and profile image.
  - Upgrade CTA buttons with moving borders/glowing effects while keeping Download Resume and Talk to AI behavior.
- `About.tsx`
  - Convert to layered premium glass panels with subtle overlap and Z-depth.
  - Add authority-focused visual chips for AI Agents, Digital FTEs, and automated workflows.
- `Skills.tsx`
  - Preserve exactly 6 categories.
  - Upgrade category containers into heavier 3D glass modules.
  - Convert infinite marquee tags into premium 3D badges.
- `Projects.tsx`
  - Keep Built Projects before Experience.
  - Add premium hover glare, stronger tilt/elevation, holographic project labels, and 3D tech badges.
  - Replace flat placeholder look with richer gradient mockup panels if project screenshots are still unavailable.
- `Experience.tsx`
  - Upgrade timeline cards with glass depth, enhanced tracing beam, and layered glows.
- `Contact.tsx` and footer
  - Upgrade social/contact cards and footer icons to match the new premium 3D system.
  - Preserve Gmail compose redirect, LinkedIn, Facebook, GitHub, and resume download.
- `ChatBot.tsx`
  - Keep existing full mobile chatbot behavior and Ready to Talk label, but visually align the launcher with the premium 3D/glass theme.

6. Technical implementation details
- Files expected to change:
  - `src/index.css`
  - `tailwind.config.ts`
  - `src/components/Card3D.tsx`
  - `src/components/Hero.tsx`
  - `src/components/About.tsx`
  - `src/components/Skills.tsx`
  - `src/components/Projects.tsx`
  - `src/components/Experience.tsx`
  - `src/components/Contact.tsx`
  - `src/components/ChatBot.tsx`
  - `src/pages/Index.tsx`
  - New asset copied into `src/assets/portfolio_profile-2.png`
  - Possibly a new reusable component: `src/components/PremiumBadge.tsx`
- No backend changes are needed for this visual overhaul.
- I will avoid adding heavy 3D libraries unless necessary; Framer Motion + CSS 3D will keep performance smooth and mobile-friendly.
- If React Three Fiber is later required, it must use React 18-compatible versions, but this overhaul can be achieved without adding that dependency.

7. QA pass after implementation
- Check desktop, tablet, and mobile responsive layouts.
- Confirm profile photo remains sharp and correctly framed.
- Confirm Download Resume still downloads `/Asad_Shabir_Resume.pdf`.
- Confirm Gmail/LinkedIn/Facebook/GitHub links remain intact.
- Confirm chatbot launcher label remains visible on mobile and full-screen chat still works.
- Confirm no horizontal overflow from floating 3D elements.
- Run the project’s test command through the Lovable test harness if available after implementation.