---
id: "017"
title: "Phase 8 Blog / Insights CMS"
stage: "implement"
date: "2026-05-02"
surface: "agent"
model: "claude-sonnet-4-7"
feature: "blog-insights"
branch: "003-ai-growth-layer"
user: "Asad Shabir"
command: "/"
labels: ["blog", "content", "markdown", "seo", "routing"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "src/content/blog/building-ai-agents-langchain-groq.md"
  - "src/content/blog/workflow-automation-production.md"
  - "src/content/blog/fastapi-react-fullstack-guide.md"
  - "src/lib/blogLoader.ts"
  - "src/pages/BlogPage.tsx"
  - "src/pages/BlogPostPage.tsx"
  - "src/App.tsx (routes + lazy imports)"
  - "src/components/Navbar.tsx (Blog link added)"
  - "src/pages/Index.tsx (footer Blog link)"
  - "src/lib/analyticsService.ts (blog_view event)"
  - "src/hooks/useAnalytics.ts (trackBlogView)"
  - "public/sitemap.xml (blog URLs added)"
tests:
  - "TypeScript — zero errors (npx tsc --noEmit)"
---

## Prompt

Phase 8: Blog / Insights CMS for the Asad Shabir premium portfolio.

Goal: Build a lightweight, SEO-optimized Blog / Insights system using static content.

Architecture Requirements:
- Use Markdown files → src/content/blog/*.md
- Routing: /blog → blog listing page, /blog/:slug → blog detail page
- SEO: Each blog page must include meta title + description, OpenGraph tags, canonical URL, JSON-LD Article schema
- Analytics: Track blog_view on page load

Implementation Steps:
1. Content System — Create markdown files with frontmatter
2. Blog Listing Page — Article cards with title, description, date, tags
3. Blog Detail Page — Markdown rendering with reading-friendly layout
4. SEO Integration — SeoMeta component, JSON-LD Article schema
5. Analytics Integration — blog_view event tracking
6. UI/UX Polish — Minimal, readable, premium feel

---

## Response snapshot

### Audit Summary
Verified existing architecture: Content stored in public/content/*.json, case studies loaded via caseStudiesLoader, SeoMeta component with full OG/JSON-LD support, analyticsService with event types, useAnalytics hook with tracking methods, Navbar with navigation links, sitemap.xml with static URLs.

### Architecture Decision

**Content**: Static markdown files in src/content/blog/*.md with YAML frontmatter (title, description, date, tags, slug, cover_image).

**Loader**: blogLoader.ts with parseFrontmatter(), calculateReadingTime(), loadAllPosts(), loadPost(), formatDate(). Uses Vite's import.meta.glob for development, falls back to public/content/blog/posts.json for production.

**Routing**: React Router lazy-loaded pages — BlogPage at /blog, BlogPostPage at /blog/:slug.

**SEO**: SeoMeta component reused per post, JSON-LD Article schema, sitemap updated with blog URLs.

**Analytics**: blog_view event type added to analyticsService.ts, trackBlogView(slug) method in useAnalytics.ts.

### Files Created

**Content** (3 articles):
- src/content/blog/building-ai-agents-langchain-groq.md — AI agents with LangChain and Groq
- src/content/blog/workflow-automation-production.md — Workflow automation case study
- src/content/blog/fastapi-react-fullstack-guide.md — FastAPI + React full-stack guide

**Loader**:
- src/lib/blogLoader.ts — Static content loader with markdown parsing

**Pages**:
- src/pages/BlogPage.tsx — Listing with filtering, responsive grid, animations
- src/pages/BlogPostPage.tsx — Detail with ReactMarkdown, share button, CTA

**Integration**:
- src/App.tsx — Added BlogPage + BlogPostPage lazy imports and routes
- src/components/Navbar.tsx — Added "Blog" link
- src/pages/Index.tsx — Added "Blog" link in footer
- src/lib/analyticsService.ts — Added blog_view event type
- src/hooks/useAnalytics.ts — Added trackBlogView(slug) method
- public/sitemap.xml — Added all blog URLs

## Outcome

- ✅ Impact: Phase 8 Blog / Insights CMS fully implemented. Static markdown content system with 3 sample articles. Full routing, SEO, and analytics integration. Consistent with existing portfolio patterns.
- 🧪 Tests: TypeScript — zero errors (tsc --noEmit)
- 📁 Files: 14 files created/modified
- 🔁 Next prompts: Phase 9 — Trust Signals + Conversion Polish
- 🧠 Reflection: Follows existing patterns (caseStudiesLoader for content, CaseStudyPage for detail layout, SeoMeta for SEO). ReactMarkdown handles markdown rendering cleanly. Main challenge was duplicate imports in App.tsx after edits — fixed with complete rewrite. Build system has bun/npm permission issues on this machine but TypeScript passes cleanly.

## Evaluation notes (flywheel)

- Failure modes observed: Duplicate lazy imports in App.tsx after edit — solved with complete file rewrite
- Graders run and results (PASS/FAIL): tsc --noEmit — PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add a "Related Articles" section at the bottom of each blog post based on matching tags
