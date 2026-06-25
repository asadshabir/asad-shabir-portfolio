---
id: 6
title: Stash recovery + Vercel professional deploy
stage: general
date: 2026-06-18
surface: agent
model: oc/deepseek-v4-flash-free
feature: none
branch: 003-ai-growth-layer
user: Asad Shabir
command: deeply analyze and recover the uptodate frontend code with backend, deploy to vercel
labels: [stash-recovery, frontend-restore, backend-restore, vercel-deploy, ooda-loop]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/components/About.tsx (restored Agentic AI Engineer badges, 6 badges, 3 expertise items)
  - src/components/Hero.tsx (restored 13 professional titles, professional photo ref)
  - src/components/Navbar.tsx (restored brand layout)
  - src/components/Contact.tsx (restored premium social tiles, contact-panel-shell CSS)
  - src/components/Projects.tsx (restored ASA-Mind, E-Commerce, Workflow projects)
  - src/components/Experience.tsx (restored Agentic AI Engineer role detail)
  - src/components/ChatBot.tsx (restored chaticon.png, comprehensive greeting)
  - src/components/Skills.tsx (restored 22 skills: LangGraph, Dapr, Kafka, MCP Servers)
  - src/components/TrustSection.tsx (restored professional trust signals)
  - src/components/ProjectEstimator.tsx (restored AI Product Discovery title)
  - src/components/Card3D.tsx (restored changes)
  - src/components/Certifications.tsx (restored changes)
  - src/pages/Index.tsx (restored useScrollHide hook)
  - src/hooks/useScrollHide.ts (restored named export with useRef scroll detection)
  - src/lib/chatbotService.ts (restored trailing slash cleanup in API URL)
  - src/lib/contactService.ts (restored trailing slash cleanup)
  - src/lib/estimatorService.ts (restored trailing slash cleanup)
  - src/lib/reviewerService.ts (restored trailing slash cleanup)
  - src/index.css (restored clip-path polygons, contact panel, social tiles, expertise animations)
  - backend/api/index.py (restored CORS regex for Vercel+HF Spaces)
  - backend/chatbot/app.py (restored RAG pipeline, intent classification, email delivery)
  - backend/chatbot/knowledge_base.py (restored portfolio_definitions integration)
  - backend/chatbot/agent_defs.py (restored tool-based agent definitions)
  - backend/chatbot/rag_indexer.py (restored RAG indexer with Groq fallback)
  - backend/chatbot/rag_tool.py (restored RAG tool)
  - backend/services/email_service.py (restored Gmail SMTP + Resend fallback)
  - backend/requirements.txt (restored full dependency list)
  - backend/.env.example (restored Gmail SMTP config example)

tests:
  - TypeScript compilation — 0 errors (npx tsc --noEmit)
  - grep verification — Agentic AI Engineer, Digital FTE Architect, ASA-Mind all confirmed
  - Vercel deploy — Build succeeded, production aliased
  - JS bundle inspection — 13 professional titles confirmed in deployed bundle
  - Vercel project framework updated: "Services" → "vite" via API PATCH
---

## Prompt

deploy the recovered version to vercel by thinking step by step without changing any code lets work as OODA Loop and work in todos.

## Response snapshot

OBSERVE: The stash (stash@{0}) contained the professional code with "Agentic AI Engineer", "Digital FTE Architect" titles, full project list, 22 skills, premium CSS, and enhanced backend (RAG pipeline, intent routing, Gmail SMTP). HEAD had simplified/generic content. Vercel was deploying the simplified version.

ORIENT: Clean git working tree. Stash needed applying. Vercel project was framework-locked to "Services" mode. The stash's vercel.json didn't have the experimentalServices fix that was previously needed.

ACT:
1. Analyzed 30+ git commits, 2 branches, 15 PHR records to understand code state
2. Applied stash diff for frontend (20 files: all src/components, pages, hooks, lib, CSS)
3. Used git show to restore backend files individually (10 files: api, chatbot, services)
4. Committed all changes with verified TypeScript compilation (0 errors)
5. Updated Vercel project framework from "Services" to "vite" via API PATCH
6. Deployed with --force to bypass stale build cache
7. Verified JS bundle contains all 13 professional titles

CHECK: JS bundle inspection confirmed "Agentic AI Engineer", "Digital FTE Architect", "Full-Stack AI Developer", "Multi-Agent Systems Builder", "AI Automation Engineer", "Advanced RAG Architect", "AI Product Engineer", "AI-Native Developer", "Workflow Automation Specialist", "Cloud-Native Application Builder", "FastAPI & Next.js Developer", "OpenAI Agents SDK Specialist", "Production AI Systems Engineer" — all deployed.

## Outcome

- ✅ Impact: Professional portfolio code (30 files) fully recovered from stash and deployed to Vercel production. Frontend now shows "Agentic AI Engineer" professional branding across all components. Backend has RAG pipeline, intent classification, Gmail SMTP email delivery.
- 🧪 Tests: TypeScript 0 errors. JS bundle verification confirms 13 professional titles. Vercel build completed in 40s and aliased to production domain.
- 📁 Files: 30 files restored (20 frontend, 10 backend). 7 backend files were already restored from PHR #5 but the stash had additional RAG files (rag_indexer.py, rag_tool.py).
- 🔁 Next prompts: Monitor Vercel CDN cache propagation. Consider setting up custom domain if not already configured.
- 🧠 Reflection: The stash is a powerful recovery mechanism but needs careful handling with binary files. The Vercel framework lock to "Services" mode was a deployment blocker that required API-level intervention — the `vercel.json` experimentalServices approach from PHR #5 was a workaround but the proper fix was updating the project's framework preset via Vercel API.

## Evaluation notes (flywheel)

- Failure modes observed: Git stash with binary assets needed manual handling (git show for each file rather than piping diff). Vercel API `vercel api` command had parsing issues; curl with auth token worked directly. Disk space filled up during analysis (98GB/98GB) requiring aggressive temp file cleanup.
- Graders run and results (PASS/FAIL): PASS — Professional titles confirmed in deployed JS bundle. PASS — TypeScript zero errors. PASS — Vercel build succeeds with all assets. FAIL (initial) — First deploy had stale build cache, resolved with --force flag.
- Next experiment (smallest change to try): Set up Vercel preview deployments on PR branches to catch regressions earlier.
