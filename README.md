<div align="center">

# 🚀 Asad Shabir — AI & Full-Stack Architect

> *Engineering intelligent agents. Building the bridge between AI and production.*

[![Live Site](https://img.shields.io/badge/Live-Portfolio-22D3EE?style=for-the-badge&logo=vercel&logoColor=white)](https://asad-shabir-portfolio.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-HuggingFace_Spaces-FF9E0F?style=for-the-badge&logo=huggingface&logoColor=white)](https://huggingface.co/spaces/Asadali110/asad-shabir-portfolio-backend)
[![GitHub](https://img.shields.io/badge/GitHub-asadshabir-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/asadshabir)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/asad-shabir-programmer110/)
[![Email](https://img.shields.io/badge/Email-Me-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:asadshabir505@gmail.com)

---

</div>

---

## 📖 The Story

> *"I believe the most powerful systems aren't just technical — they're **storytellers** in their own right. Every API endpoint, every agent, every line of code should serve a narrative."*

I'm **Asad Shabir** — an AI Engineer and Full-Stack Developer from **Sehwan Sharif, Sindh, Pakistan**. My journey has taken me from the discipline of the Pakistan Navy to the frontier of agentic AI, from telecom-grade DevOps at **Digitel FTE** to building intelligent systems that think, reason, and converse.

This portfolio isn't just a resume. It's a **living system** — an AI-infused digital presence where:

- 🤖 A **multi-agent chatbot** answers questions with RAG-powered precision
- 📊 A **project estimator** intelligently scopes your next build
- ⚡ A **resume reviewer** delivers NLP-driven feedback
- 🎨 A **3D animated interface** makes every interaction feel premium

Built with **Spec-Driven Development (SDD)** at its core — every feature starts with a spec, every plan precedes the code, and every commit tells a story.

---

## 🧠 The Brain — Multi-Agent Chatbot Architecture

The crown jewel of this portfolio is a **6-agent AI system** running on **Groq's llama-3.3-70b** via the **OpenAI Agents SDK**, orchestrated on a **FastAPI backend** hosted on HuggingFace Spaces.

```mermaid
graph TD
    User[👤 User] --> FE[⚛️ React Frontend]
    FE --> |/api/* Rewrite| BE[⚡ FastAPI Backend]
    FE --> |/chat Rewrite| CB[💬 Chatbot App]
    
    subgraph "🧠 Multi-Agent System"
        CB --> IC[Intent Classifier]
        IC --> Router[🗺️ Router Agent]
        Router --> P[👤 Profile Agent]
        Router --> PJ[📁 Projects Agent]
        Router --> T[🔧 Technical Agent]
        Router --> F[🔄 Fallback Agent]
        P --> RV[✅ Repair Validation]
        PJ --> RV
        T --> RV
        F --> RV
    end
    
    subgraph "🛡️ Security Layer"
        CB --> RL[⏱️ Rate Limiter<br/>10 req/IP/600s]
        RL --> PI[🛡️ Prompt Injection Filter]
    end
    
    subgraph "📚 Knowledge Layer"
        CB --> KB[(📋 Knowledge Base)]
        CB --> RAG[(🔍 RAG Indexer)]
        RAG --> RR[📎 RAG Retriever]
    end
    
    RV --> GR[🔮 Groq API<br/>llama-3.3-70b-versatile]
    RR --> GR
    KB --> GR
    GR --> Response[💬 Natural Response]
```

### The Agent Team

| Agent | Role | Superpower |
|-------|------|------------|
| 🗺️ **Router** | Intent Classifier | Routes queries to the right specialist in &lt;200ms |
| 👤 **Profile** | Personal Voice | Speaks as *me* — first person, warm, authentic |
| 📁 **Projects** | Portfolio Guide | Walks through projects with live demo links |
| 🔧 **Technical** | Knowledge Base | Deep-dive into skills, stack, and architecture |
| 🔄 **Fallback** | Graceful Handler | Polite redirection for off-topic queries |
| ✅ **Repair** | Validation Layer | 6-point safety check with auto-retry on failure |

> **🌐 Language Support:** The chatbot seamlessly switches between **English**, **Urdu (اردو)**, and **Sindhi (سنڌي)** — reflecting the linguistic diversity of Pakistan.

---

## ✨ Feature Showcase

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 🤖 | **AI ChatBot** | 6-agent system with RAG, intent routing, repair validation | ✅ Live |
| 📊 | **Project Estimator** | AI-powered cost & timeline estimation for your idea | ✅ Live |
| ⚡ | **Resume Reviewer** | NLP-driven resume scoring with actionable feedback | ✅ Live |
| 📝 | **Blog Engine** | Technical blog with 3 posts on AI, FastAPI, automation | ✅ Live |
| 📋 | **Case Studies** | Real-world project deep dives with architecture insights | ✅ Live |
| 📬 | **Contact Form** | Serverless email delivery via Resend API | ✅ Live |
| 📧 | **Email Capture** | Newsletter subscription for updates & insights | ✅ Live |
| 📈 | **Analytics Dashboard** | Admin metrics panel with Recharts visualization | ✅ Live |

---

## 🛠️ The Tech Stack

### Frontend — *The Canvas*

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat&logo=framer&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Radix-000000?style=flat&logo=shadcnui&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat&logo=reactrouter&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat&logo=reactquery&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-Zod-EC5990?style=flat&logo=reacthookform&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Charts-22B5BF?style=flat)

### Backend — *The Engine Room*

![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat&logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b-F55036?style=flat&logo=groq&logoColor=white)
![OpenAI Agents SDK](https://img.shields.io/badge/OpenAI_Agents_SDK-v0.4-412991?style=flat&logo=openai&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-Email-000000?style=flat&logo=resend&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063?style=flat&logo=pydantic&logoColor=white)

### Infrastructure — *The Backbone*

![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![HuggingFace](https://img.shields.io/badge/Backend-HuggingFace_Spaces-FF9E0F?style=flat&logo=huggingface&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)

### Design System

The visual identity is built on a **deep minimal** aesthetic with neon accents:

```css
--background: #0A0A0A;    /* Deep space black */
--primary:    #22D3EE;    /* Neon cyan — energy & precision */
--secondary:  #C026D3;    /* Magenta — creativity & depth */
```

Every component — from the **floating particles** to the **3D cards** to the **aceternity-style animations** — follows this palette.

---

## 🌐 Deployment Topology

```mermaid
graph LR
    subgraph "Vercel (Frontend)"
        A["⚛️ React SPA<br/>Vite + TypeScript"] --> B["vercel.json"]
        B --> C["/api/* → HuggingFace"]
        B --> D["/chat → HuggingFace"]
        B --> E["/* → index.html"]
    end
    subgraph "HuggingFace Spaces (Backend)"
        C --> F["🐍 FastAPI Server<br/>Port 8000"]
        D --> G["💬 Chatbot App<br/>Port 8001"]
        F --> H["🔮 Groq API<br/>llama-3.3-70b"]
        F --> I["📧 Resend API<br/>Email Delivery"]
        G --> H
    end
    subgraph "User"
        J["🌍 Browser"] --> A
    end
```

**Live URLs:**
| Layer | URL |
|-------|-----|
| 🌐 Frontend | [asad-shabir-portfolio.vercel.app](https://asad-shabir-portfolio.vercel.app) |
| ⚡ Backend | [huggingface.co/spaces/Asadali110/asad-shabir-portfolio-backend](https://huggingface.co/spaces/Asadali110/asad-shabir-portfolio-backend) |
| 🏠 GitHub | [github.com/asadshabir/asad-shine-hub](https://github.com/asadshabir/asad-shine-hub) |

---

## 🚀 Featured Projects

| Project | Story | Stack | Links |
|---------|-------|-------|-------|
| **ASA-Mind** | A flagship AI chat assistant powered by OpenAI Agents SDK. Multi-agent orchestration with streaming responses, memory, and tool use. Designed to be the *brain* behind intelligent applications. | OpenAI Agents SDK, FastAPI, React, Supabase | [GitHub](https://github.com/asadshabir/asa-mind) |
| **AI-Powered Robotics Book** | An interactive, AI-generated educational book exploring the intersection of robotics and artificial intelligence. Generated page-by-page using AI, then published as a dynamic Next.js site. | Next.js, OpenAI, TypeScript | [GitHub](https://github.com/asadshabir/robotics-ai-book) |
| **E-Commerce Platform** | A production-grade e-commerce platform with Stripe payment integration, Supabase authentication, admin dashboard, and inventory management. | Next.js, Supabase, Stripe | [GitHub](https://github.com/asadshabir/ecommerce-platform) |
| **Workflow Automation Engine** | A rule-based automation engine that connects APIs, schedules triggers, and orchestrates multi-step workflows. Built for production reliability. | Python, FastAPI, Celery, Redis | [GitHub](https://github.com/asadshabir/workflow-automation) |
| **AI Resume Analyzer** | An NLP-powered resume parser that scores, analyzes, and provides actionable improvement suggestions. Built with LangChain for intelligent document understanding. | Python, LangChain, React, FastAPI | [GitHub](https://github.com/asadshabir/ai-resume-analyzer) |
| **Real-Time Dashboard** | Live analytics dashboard with WebSocket-powered real-time updates, role-based access control, and interactive data visualizations. | React, Node.js, PostgreSQL, WebSockets | [GitHub](https://github.com/asadshabir/realtime-dashboard) |

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/asadshabir/asad-shine-hub.git
cd asad-shine-hub

# Install dependencies
npm install

# Start development server
npm run dev          # Frontend → localhost:8080
# (Backend requires HuggingFace Spaces or local Python setup)
```

> **💡 Pro tip:** The `vercel.json` proxy rewrites `/api/*` and `/chat` to the live HuggingFace backend — so the frontend works seamlessly against production AI services even in local development.

---

## 📜 Development Philosophy

This project follows **Spec-Driven Development (SDD)** — a disciplined approach where:

1. **📋 Spec** — Every feature begins with a detailed specification
2. **📐 Plan** — Architecture and design decisions are documented
3. **✅ Tasks** — Work is broken into testable, dependency-ordered tasks
4. **💚 Red/Green/Refactor** — TDD cycle with clear acceptance criteria
5. **📝 PHR** — Every prompt is recorded as a Prompt History Record for traceability

This repository contains **10+ Claude Code agents** (API Engineer, Chatbot Orchestrator, UI Enhance, QA/E2E, Security Guardrails, and more) that help enforce SDD discipline across every change.

---

## 🤝 Let's Connect

I'm always open to discussing AI, agentic systems, full-stack architecture, or potential collaborations.

<div align="center">

[![Email](https://img.shields.io/badge/asadshabir505@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:asadshabir505@gmail.com)
[![LinkedIn](https://img.shields.io/badge/asad--shabir--programmer110-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/asad-shabir-programmer110/)
[![GitHub](https://img.shields.io/badge/@asadshabir-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/asadshabir/)
[![Facebook](https://img.shields.io/badge/Asadalibhatti110-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/Asadalibhatti110)

📄 **Resume:** [Download PDF](/Asad_Shabir_Resume.pdf)

</div>

---

<div align="center">

*Built with passion, AI, and a commitment to Spec-Driven Development.*  
*© 2026 Asad Shabir — All rights reserved.*

⭐ Star this repo if you find it inspiring!  
[🔗 Live Portfolio](https://asad-shabir-portfolio.vercel.app) · [🐍 Backend](https://huggingface.co/spaces/Asadali110/asad-shabir-portfolio-backend)

</div>
