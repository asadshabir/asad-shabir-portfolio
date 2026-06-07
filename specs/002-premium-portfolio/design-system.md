# Design System: Premium Portfolio — Asad Shabir

**Branch**: `002-premium-portfolio`
**Date**: 2026-05-01
**Status**: Approved — Ready for Implementation
**Source**: Phase 2 (OODA — Orient) design decisions

---

## Design Philosophy

**Feel**: Premium, calm, high-trust, founder-level presentation. Modern but restrained. Strong hierarchy, generous spacing, sharp readability. No gimmicks, no noisy effects, no flashy hover behavior in contact areas.

---

## 1. Layout Rules

### Grid & Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Icon gaps, tight gaps |
| `space-sm` | 8px | Component internal padding |
| `space-md` | 16px | Card padding, form field gaps |
| `space-lg` | 24px | Section internal spacing |
| `space-xl` | 32px | Section padding (mobile) |
| `space-2xl` | 48px | Section padding (tablet) |
| `space-3xl` | 64px | Section padding (desktop) |
| `space-4xl` | 96px | Hero section vertical padding |

### Container

- Max-width: `1120px` centered
- Padding: `px-4` (mobile), `px-6` (tablet), auto (desktop)
- No full-bleed sections — all content constrained to container

### Section Structure

```
.section
  └── container (max-w-[1120px] mx-auto px-4/6)
        └── section-header (text-center mb-12/16)
        └── section-body (grid/blocks)
```

---

## 2. Motion Rules

### Principles

- Motion improves comprehension or confirms state — nothing else
- Never animate for decoration alone
- All animations respect `prefers-reduced-motion: reduce`

### Rules

| Rule | Value | Rationale |
|------|-------|----------|
| **Max micro-interaction duration** | 300ms | Responsive feel, not distracting |
| **Max section reveal duration** | 500ms | Gentle, not sluggish |
| **Easing — entrances** | `ease-out` | Feels natural, decelerates |
| **Easing — exits** | `ease-in` | Accelerates naturally |
| **Never use** | `linear` | Feels robotic |
| **Animate only** | `transform` + `opacity` | GPU-composited, no layout jank |
| **Never animate** | width, height, margin, padding, top, left | Layout jank |

### Allowed Animations

| Animation | Trigger | Duration | Easing |
|-----------|---------|----------|--------|
| Navbar hide | Scroll down 50px+ | 300ms | ease-out |
| Navbar reveal | Scroll up | 300ms | ease-out |
| Section scroll-reveal | Intersection Observer | 500ms | ease-out |
| Button hover | Hover | 150ms | ease-out (scale 1.02) |
| Button press | Active/click | 100ms | ease-in (scale 0.98) |
| Form field focus | Focus | 150ms | ease-out (border color + shadow) |
| Loading spinner | State change | continuous | linear (rotation) |
| Chatbot message appear | New message | 200ms | ease-out (opacity) |

### DISALLOWED Animations

- `whileHover` with scale, rotate, or translate on contact section social tiles
- `whileHover` with `y: -8, rotateX: 8` on any element (removes Card3D hover on contact tiles)
- `whileInView` with complex transforms on contact section
- BackgroundBeams, Sparkles, particles in hero/contact — heavy, distracting
- Any 3D transforms (`rotateX`, `rotateY`) in contact areas
- Bouncing, springing, or elastic animations
- Staggered delays > 100ms between elements

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

All Framer Motion `transition` and `animate` props must have equivalent instant state for reduced-motion.

---

## 3. Navbar / Sidebar Rules

### Navbar (Top)

| Property | Value |
|----------|-------|
| **Position** | `fixed`, `top: 0` |
| **Z-index** | `z-[120]` |
| **Max-width** | `max-w-[1120px]`, centered |
| **Horizontal offset** | `left-3 right-3` (mobile), `left-6 right-6` (tablet+) |
| **Border-radius** | `rounded-2xl` |
| **Background** | Glass morphism (`backdrop-blur-md`, `bg-background/80`) |
| **Hide trigger** | Scroll down 50px+ (threshold: 50) |
| **Reveal trigger** | Scroll up any amount |
| **Direction detection** | Track last scroll position; hide if `currentY < lastY - 50` |
| **Animation** | `transform: translateY(-100%)` → `translateY(0)`, 300ms ease-out |
| **On page load** | Always visible |

### Sidebar Quick-Actions (Always Visible)

| Property | Value |
|----------|-------|
| **Position** | `fixed`, right side (desktop), bottom or side (mobile) |
| **Z-index** | `z-[100]` — below navbar when navbar shown |
| **Visibility** | Always visible, never obscured |
| **Content** | Quick-action buttons (Resume, Contact, Chatbot) — utility-first |
| **Mobile** | Compact bottom bar or side drawer, always reachable |
| **Tap targets** | Minimum 44x44px on mobile |

### Sidebar Button Style

- Small icon-only buttons or icon+label pills
- Subtle glass background, not heavy
- Hover: slight scale (1.02) + opacity change
- No heavy animation, no 3D transforms

---

## 4. Contact Section Rules (CRITICAL)

### Required: Static, Calm, Elegant

This is the conversion section. It must feel safe, trustworthy, and professional. No distracting motion.

### What to REMOVE from current Contact.tsx

```diff
- motion.a (whileHover on social tiles)
- { y: -8, rotateX: 8, rotateY: -8, scale: 1.035 }
- { scale: 1.03, y: -2 } on resume button
- BackgroundBeams (heavy background effect)
- Card3D hover effects
```

### What to KEEP / ADD

- **Static social tiles**: No `whileHover`, no scale, no rotation
- **Hover state**: Only `opacity` change (0.8 → 1.0) and subtle `bg` shift
- **Resume button**: `<a href="/Asad_Shabir_Developer.pdf" download>` — NO `whileHover`/`whileTap`
- **Submit button**: `whileHover` scale 1.02 only on the button itself — allowed
- **Form fields**: Subtle focus ring — allowed
- **Static message**: "Let's Connect" heading with calm styling — no animation on heading

### Contact Section Layout

```
#contact section
  └── "Let's Connect" heading (static, centered)
  └── max-w-5xl grid (2-col: socials + form)
        └── Social links panel (static cards, subtle hover only)
        └── Contact form panel (static, clean)
  └── Resume download button (direct, no animation)
```

### Social Tile Hover (Allowed)

```css
/* CSS only — no Framer Motion on contact section tiles */
.social-tile {
  transition: background-color 150ms ease-out, opacity 150ms ease-out;
}
.social-tile:hover {
  background-color: rgba(foreground, 0.05);
  opacity: 0.85;
}
/* No transform, no scale, no rotation */
```

---

## 5. Resume Download Rules

| Rule | Value |
|------|-------|
| **Filename** | `Asad_Shabir_Developer.pdf` (canonical — never change) |
| **Location** | `public/Asad_Shabir_Developer.pdf` |
| **HTML** | `<a href="/Asad_Shabir_Developer.pdf" download="Asad_Shabir_Developer.pdf">` |
| **No JS interceptor** | Direct anchor only |
| **No API call** | Static file serve |
| **Cache headers** | `Cache-Control: public, max-age=31536000, immutable` |
| **ARIA label** | `aria-label="Download Asad Shabir's resume (PDF)"` |
| **Button style** | Primary gradient button, consistent with button family |

### Placement

- Hero section: CTA button (primary)
- Sidebar quick-actions: Download icon button
- Contact section: Download Resume panel

### Rename Required

Rename `public/Asad_Shabir_Resume.pdf` → `public/Asad_Shabir_Developer.pdf`

---

## 6. Chatbot Placement Rules

| Property | Value |
|----------|-------|
| **Position** | Floating bottom-right (desktop), bottom-center (mobile) |
| **Z-index** | `z-[90]` |
| **Trigger** | ChatButton (bottom-right corner) |
| **Entry** | Slide up from bottom-right, 300ms ease-out |
| **Visual dominance** | Not dominant — portfolio is the hero |
| **Size** | Compact widget (max-w-md, max-h-[500px]) |
| **Backdrop** | No heavy overlay — semi-transparent panel |
| **Loading state** | Typing indicator (pulse dots) |
| **Error state** | Fallback message + direct email link |
| **Accessibility** | Keyboard open/close, aria-expanded, focus trap |

---

## 7. Mobile Adaptation Rules

### Breakpoints

| Breakpoint | Width | Spacing multiplier |
|-----------|-------|------------------|
| Mobile | < 640px | 0.5x desktop |
| Tablet | 640px – 1024px | 0.75x desktop |
| Desktop | > 1024px | 1.0x |

### Mobile Layout Rules

| Element | Mobile Treatment |
|---------|-----------------|
| **Navbar** | Hamburger menu, full-screen panel on tap |
| **Sidebar** | Bottom compact bar or side drawer |
| **Hero heading** | `text-3xl` → `text-4xl` → `text-5xl` |
| **Section padding** | `py-12` → `py-20` → `py-32` |
| **Card grid** | 1 col (mobile), 2 col (tablet), 3 col (desktop) |
| **Contact grid** | Stack vertically (mobile), 2-col (tablet+) |
| **Chatbot** | Bottom-center, full-width or narrow |

### Mobile Behavior

- No horizontal scroll at 320px
- All sections reflow cleanly
- Tap targets: 44x44px minimum
- Font sizes: readable on small screens (body: 14px+)
- Images: responsive (`w-full h-auto`)

---

## 8. Accessibility Rules

### Contrast

| Element | Minimum Ratio | Target |
|---------|--------------|--------|
| Body text | 4.5:1 (WCAG AA) | 7:1 |
| Large text (>18pt) | 3:1 (WCAG AA) | 4.5:1 |
| UI components | 3:1 (WCAG AA) | 4.5:1 |

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals/dialogs
- Arrow keys for tab navigation
- Visible focus indicator on all focusable elements

### Focus Indicators

```css
/* Replace any outline: none without replacement */
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

No `outline: none` anywhere without a `:focus-visible` replacement.

### ARIA Labels

| Element | ARIA Label |
|---------|-----------|
| Navbar | `aria-label="Primary navigation"` |
| Mobile menu button | `aria-label="Open navigation menu"` / "Close navigation menu" |
| Sidebar buttons | `aria-label="Download resume"` / `aria-label="Open chatbot"` |
| Form fields | `aria-label="Your name"` / `aria-label="Your email"` / `aria-label="Your message"` |
| Submit button | `aria-label="Send message"` |

### Reduced Motion

- All animations: disabled or reduced to instant state
- CSS `@media (prefers-reduced-motion: reduce)`
- Framer Motion: `motion` with `transition: { duration: 0.01 }`

---

## Component Style Reference

### Card (One Style Across Site)

```css
/* One card family */
.card {
  border-radius: 12px;        /* rounded-xl */
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); /* shadow-sm */
  border: 1px solid rgba(255,255,255,0.05); /* subtle border */
}
```

### Button Family

**Primary**:
```css
.btn-primary {
  bg-gradient-to-r from-primary via-emerald to-accent;
  text-primary-foreground;
  font-bold;
  rounded-full or rounded-xl;
  shadow;
}
```

**Secondary**:
```css
.btn-secondary {
  bg-transparent;
  border border-foreground/10;
  text-foreground;
  rounded-full or rounded-xl;
}
```

**Hover**: `scale(1.02)` only — no other transforms
**Press**: `scale(0.98)` only

### Typography Scale

| Token | Size | Weight | Line-height |
|-------|------|--------|-------------|
| Display | 3xl–6xl | black/extrabold | 1.1 |
| H1-H2 | 2xl–4xl | bold | 1.2 |
| Body | base/lg (16–18px) | normal/medium | 1.6 |
| Small | sm (14px) | normal | 1.5 |
| Caption | xs (12px) | normal | 1.4 |

---

## Success Criteria

| Criteria | How to Verify |
|----------|---------------|
| Site feels expensive and intentional | Manual review: no clutter, no random effects |
| Navigation feels dynamic but calm | Scroll down/up: navbar hides/reveals smoothly |
| Contact area feels static and trustworthy | No hover animation on contact social tiles |
| Portfolio looks polished on desktop and mobile | Responsive test at 320px, 768px, 1280px |
| No heavy background effects | BackgroundBeams, Sparkles, particles removed from hero/contact |
| Accessibility | axe-core audit: 0 violations |
| Motion-safe | `prefers-reduced-motion: reduce` → no animation plays |