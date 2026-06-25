"""
RAG Indexer — comprehensive portfolio indexer.
Chunks ALL factual knowledge about Asad Shabir into Cohere embeddings
and uploads to Qdrant. Run once or on data changes.

Sources:
  - GitHub (51+ repos)
  - Case studies (public/content/case-studies.json)
  - Profile data (backend/services/profile_loader.py)
  - tools.py content (personal info, services, contact)
  - Pricing & consultation rules
  - Social links
"""
import json
import sys
import os
from pathlib import Path
from typing import Any

import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
from backend.chatbot.rag_config import (
    COHERE_API_KEY, COHERE_EMBED_MODEL, COHERE_EMBED_DIMS,
    QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION,
)


def build_chunks() -> list[dict[str, Any]]:
    """Build ALL knowledge chunks — every fact about Asad Shabir."""
    chunks = []

    # ════════════════════════════════════════════════════════════
    # SECTION 1: IDENTITY & BIO
    # ════════════════════════════════════════════════════════════
    chunks.append({
        "id": "professional-bio",
        "title": "Asad Shabir — Complete Professional Bio",
        "category": "bio",
        "tags": ["bio", "background", "about", "journey", "identity"],
        "content": """Name: Asad Shabir
Age: 23
Location: Sehwan Sharif / Karachi, Sindh, Pakistan
Languages: Sindhi (native), Urdu, English
Role: AI Full-Stack Developer | Agentic AI Engineer | Digital FTE Architect

PROFESSIONAL BIO:
Asad Shabir is a self-taught AI engineer from Sehwan Sharif, Sindh, Pakistan. He builds Agentic AI systems, Digital FTEs (AI Employees), RAG platforms, multi-agent architectures, and full-stack SaaS products.

JOURNEY:
2023 — Pakistan Navy (Marine Sailor). Resigned after 3 months — chose freedom and technology over a military career.
2023-2024 — Sindh Police SSU Commando. Cleared elite commando training. Officially rejected the offer — chose software engineering over government service.
Present — Self-taught AI Engineer. Works in healthcare by day, builds AI systems by night. Specializes in Agentic AI, Digital FTEs, RAG platforms, and full-stack applications.

PROFESSIONAL VALUES:
- Freedom and independence — driven by self-determination
- Discipline — forged through military and commando training, now applied to engineering
- Family — the motivation behind every project
- Continuous learning — self-taught across the full AI/software stack

GOALS:
1. Become a world-class AI Engineer working on meaningful problems
2. Build technology that delivers measurable business value
3. Help organizations automate and scale through intelligent AI systems

CERTIFICATIONS:
- GIAIC (Governor Initiative for Artificial Intelligence and Computing) — Certified""",
    })

    chunks.append({
        "id": "professional-positioning",
        "title": "Asad Shabir — Specialization & Positioning",
        "category": "specialization",
        "tags": ["specialization", "expertise", "positioning"],
        "content": """Asad Shabir specializes in transforming business processes into intelligent, automated systems using Agentic AI and Digital FTEs.

His focus is not simply building chatbots. He designs:
- AI Employees (Digital FTEs) — autonomous AI agents that act like human team members
- Multi-Agent Systems — orchestration of multiple AI agents working together
- Enterprise Automation — automating complex business workflows
- AI-Powered SaaS Products — full-stack AI applications delivered as services
- Advanced RAG Platforms — chat-with-your-data systems using vector databases
- Workflow Orchestration Systems — coordinating complex multi-step processes
- Production-Ready Cloud Applications — scalable, reliable, deployed systems

When discussing projects, emphasize:
- Business value and ROI
- Scalability and performance
- Automation and efficiency
- Production readiness
- Real-world deployment experience""",
    })

    # ════════════════════════════════════════════════════════════
    # SECTION 2: SKILLS
    # ════════════════════════════════════════════════════════════
    skills_data = []
    try:
        from backend.services.profile_loader import get_skills
        skills_data = get_skills()
    except Exception:
        pass

    if skills_data:
        for cat in skills_data:
            category_name = cat.get("category", "General")
            items = cat.get("items", [])
            slug = category_name.lower().replace("/", "-").replace(" ", "-")
            chunks.append({
                "id": f"skills-{slug}",
                "title": f"Asad Shabir — Skills: {category_name}",
                "category": "skills",
                "tags": ["skills", slug, category_name.lower()],
                "content": f"Asad Shabir's {category_name} skills: {', '.join(items)}. He uses these technologies in production-grade AI systems, full-stack applications, and enterprise automation platforms.",
            })
    else:
        chunks.append({
            "id": "skills-overview",
            "title": "Asad Shabir — Technical Skills Overview",
            "category": "skills",
            "tags": ["skills", "technology", "expertise"],
            "content": """Asad Shabir's technical skills span:
- Agentic AI Systems, Multi-Agent Orchestration
- Digital FTEs (AI Employees)
- RAG Applications & Vector Databases
- Full-Stack Engineering (React, Next.js, TypeScript, Tailwind)
- Backend (Python, FastAPI, Node.js, PostgreSQL, Redis)
- Cloud-Native (Docker, Kubernetes, AWS, Vercel)
- DevOps (CI/CD, Dapr, Kafka)
- AI/ML: OpenAI API, Claude API, Gemini, Cohere, LangChain, LlamaIndex
- Tools: n8n, MCP Servers, Firebase""",
        })

    # ════════════════════════════════════════════════════════════
    # SECTION 3: GITHUB PROJECTS (51+ repos)
    # ════════════════════════════════════════════════════════════
    github_projects = [
        {
            "name": "Personal-AI-Employee",
            "description": "A local-first constitutional AI employee system that runs autonomously on your machine. Features a 4-tier approval system, modular skill architecture, filesystem-based task pipeline (Inbox -> Orchestrator -> Skill Executor -> Done), audit trail with 11 mandatory events, and stale loop detection. Built with Python 3.8+, Claude API, and Git. Achieves fully autonomous task execution with no supervision required while maintaining complete data privacy.",
            "tech": ["Python", "Claude API", "Git", "Filesystem-based state"],
            "stars": 1,
        },
        {
            "name": "Medibridge",
            "description": "A production-grade, mobile-first Progressive Web App (PWA) for AI-powered telehealth services. Features doctor booking with browse-by-specialty, AI chatbot (Medi Assistant) for instant patient support, medical report upload with 10MB cap, multi-role system (Patient/Doctor/Admin), bilingual interface (English/Urdu with full RTL support), and offline capability. Designed with medical blue and healing teal color scheme, glassmorphism aesthetics, and ARIA accessibility.",
            "tech": ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Firebase", "PWA"],
            "stars": 0,
        },
        {
            "name": "Humanoid-Robotic-Book",
            "description": "An interactive AI-powered digital textbook for robotics and humanoid engineering. Built with Docusaurus 3, React, and CSS animations. Features an integrated RAG chatbot using Gemini 2.0 Flash Lite for generation, Cohere for embeddings, and Qdrant Cloud for vector search. Covers ROS 2, Gazebo/Unity simulation, NVIDIA Isaac, and Vision-Language-Action AI integration. Bilingual (English/Urdu). Follows Spec-Driven Development methodology.",
            "tech": ["Docusaurus 3", "React", "Gemini 2.0", "Cohere", "Qdrant", "FastAPI"],
            "stars": 0,
        },
        {
            "name": "full-stack-todo-app",
            "description": "A full-stack todo application built with Next.js 15, FastAPI, PostgreSQL, and JWT authentication. Features secure login with bcrypt password hashing, full CRUD operations, dark mode, multi-user data isolation, and responsive design. HTTP-only cookies for XSS protection, SQLModel ORM for SQL injection protection. Deployed on Railway (backend) and Vercel (frontend). Built by Asad Shabir for a hackathon.",
            "tech": ["Next.js 15", "FastAPI", "PostgreSQL", "JWT", "Tailwind CSS", "shadcn/ui", "TypeScript"],
            "stars": 1,
        },
        {
            "name": "AI-Content-Writter",
            "description": "An AI-powered content generation tool built with Python. Automates content creation using AI language models for blog posts, articles, and marketing copy. Part of Asad's portfolio of AI automation tools.",
            "tech": ["Python", "OpenAI API"],
            "stars": 1,
        },
        {
            "name": "AI-Study-Assistant-for-Students",
            "description": "An AI-powered study assistant designed to help students with their academic work. Provides intelligent tutoring, study material generation, and personalized learning support using AI.",
            "tech": ["Python", "AI", "NLP"],
            "stars": 0,
        },
        {
            "name": "Knowledge-Base-and-Research-Agent",
            "description": "An AI agent specialized in knowledge base management and academic research. Capable of retrieving, analyzing, and synthesizing information from multiple sources using RAG architecture.",
            "tech": ["Python", "RAG", "Vector DB", "LangChain"],
            "stars": 0,
        },
        {
            "name": "AI-Lead-Generation-and-E-Commerce-Bot",
            "description": "An AI-powered lead generation and e-commerce automation bot. Automates customer acquisition, product recommendations, and sales workflows using conversational AI and intelligent agents.",
            "tech": ["Python", "AI Agents", "Automation"],
            "stars": 0,
        },
        {
            "name": "Ai-Customer-support",
            "description": "An AI-powered customer support automation system. Handles customer inquiries, ticket routing, and resolution using intelligent conversational agents. Reduces response time and improves customer satisfaction.",
            "tech": ["Python", "Chatbot", "NLP", "Automation"],
            "stars": 0,
        },
        {
            "name": "Email-automation-whatsapp",
            "description": "An email and WhatsApp automation system that integrates both channels for unified communication. Automates sending, receiving, and processing messages across email and WhatsApp platforms.",
            "tech": ["Python", "WhatsApp API", "Email", "Automation"],
            "stars": 0,
        },
        {
            "name": "Content-writer-chatbot",
            "description": "A calm 3D AI chat interface project from Orchids.app. An AI-powered content writing assistant with an immersive 3D user interface for a premium user experience.",
            "tech": ["TypeScript", "Next.js", "3D UI", "AI Chat"],
            "stars": 0,
        },
        {
            "name": "Gemini-Cli",
            "description": "A command-line interface tool for interacting with Google's Gemini AI models directly from the terminal. Enables quick AI queries, code generation, and text processing without leaving the CLI.",
            "tech": ["Python", "Gemini API", "CLI"],
            "stars": 0,
        },
        {
            "name": "asad-shine-hub",
            "description": "A TypeScript-based web application. Part of Asad's project portfolio showcasing modern web development capabilities.",
            "tech": ["TypeScript", "React"],
            "stars": 0,
        },
        {
            "name": "Hackathon-II",
            "description": "A Python-based project developed during a hackathon. Demonstrates Asad's ability to build working solutions under time constraints.",
            "tech": ["Python"],
            "stars": 0,
        },
        {
            "name": "My_Official_Portfolio",
            "description": "Asad's official personal portfolio website showcasing full-stack projects from GIAIC, featuring React, Next.js, Tailwind CSS, and Python OOP mastery. Earlier version of the current portfolio.",
            "tech": ["HTML", "CSS", "JavaScript", "React"],
            "stars": 0,
        },
        {
            "name": "sleep_assistant",
            "description": "An AI-powered sleep assistant designed to help users improve their sleep quality through intelligent analysis and recommendations.",
            "tech": ["Python", "AI"],
            "stars": 0,
        },
    ]

    for proj in github_projects:
        chunks.append({
            "id": f"github-{proj['name'].lower()}",
            "title": f"GitHub Project: {proj['name']}",
            "category": "github-project",
            "tags": ["github", "project", "open-source"] + [t.lower() for t in proj["tech"]],
            "content": f"""GitHub Repository: {proj['name']}

Description: {proj['description']}

Technologies: {', '.join(proj['tech'])}

Stars: {proj['stars']}

View on GitHub: https://github.com/asadshabir/{proj['name']}""",
        })

    # Project directory — catches ANY "show me your projects" query
    project_dir_list = "\n".join(
        f"- {p['name']}: {p['description'][:120]}... [Stack: {', '.join(p['tech'][:4])}]"
        for p in github_projects
    )
    chunks.append({
        "id": "projects-directory",
        "title": "Asad Shabir — Complete Projects Directory",
        "category": "projects",
        "tags": ["projects", "portfolio", "github", "work", "showcase", "all-projects"],
        "content": f"""Asad Shabir has built over 50 projects on GitHub. Here are the key ones:

{project_dir_list}

Full GitHub profile: https://github.com/asadshabir
Portfolio: https://asadshabir.com

For detailed case studies with challenge, approach, and results, ask about specific projects like MediBridge, Humanoid Robotics Book, or Personal AI Employee.""",
    })

    # ════════════════════════════════════════════════════════════
    # SECTION 4: CASE STUDIES (from JSON)
    # ════════════════════════════════════════════════════════════
    case_studies_path = Path(__file__).resolve().parent.parent.parent / "public" / "content" / "case-studies.json"
    try:
        if case_studies_path.exists():
            with open(case_studies_path, encoding="utf-8") as f:
                case_studies = json.load(f)
        else:
            case_studies = []
    except Exception:
        case_studies = []

    for cs in case_studies:
        slug = cs.get("slug", "case-study")
        title = cs.get("title", "")
        excerpt = cs.get("excerpt", "")
        challenge = cs.get("challenge", "")
        approach = cs.get("approach", "")
        stack = cs.get("stack", [])
        results = cs.get("results", [])
        tags = cs.get("tags", [])
        screenshots = cs.get("screenshots", [])

        results_text = "\n".join(f"- {r}" for r in results)
        screenshots_text = "\n".join(f"- {s}" for s in screenshots) if screenshots else "None"

        chunks.append({
            "id": f"case-study-{slug}",
            "title": f"Case Study: {title}",
            "category": "case-study",
            "tags": ["case-study", "portfolio", "project"] + [t.lower() for t in tags],
            "content": f"""Project: {title}

Overview: {excerpt}

Challenge:
{challenge}

Approach:
{approach}

Technology Stack: {', '.join(stack)}

Key Results:
{results_text}

Screenshots:
{screenshots_text}

Published: {cs.get('published_date', 'N/A')}""",
        })

    # ════════════════════════════════════════════════════════════
    # SECTION 5: PROFILE PROJECTS (from profile_loader.py)
    # ════════════════════════════════════════════════════════════
    try:
        from backend.services.profile_loader import get_projects
        proj_data = get_projects()
    except Exception:
        proj_data = []

    for i, proj in enumerate(proj_data):
        proj_title = proj.get("title", f"Project {i+1}")
        proj_desc = proj.get("description", "")
        proj_tech = proj.get("tech", [])
        slug = proj_title.lower().replace(" ", "-").replace("/", "-")

        chunks.append({
            "id": f"profile-project-{slug}",
            "title": f"Portfolio Project: {proj_title}",
            "category": "portfolio-project",
            "tags": ["portfolio", "project"] + [t.lower() for t in proj_tech],
            "content": f"""Project: {proj_title}

Description: {proj_desc}

Technologies Used: {', '.join(proj_tech)}""",
        })

    # ════════════════════════════════════════════════════════════
    # SECTION 6: SERVICES
    # ════════════════════════════════════════════════════════════
    services = [
        {
            "id": "service-custom-ai-agents",
            "title": "Service: Custom AI Agents & Automation",
            "category": "service",
            "tags": ["service", "ai-agents", "automation", "digital-ftes"],
            "content": """Service: Custom AI Agents and Automation

Asad builds 24/7 autonomous AI agents for sales, support, and operations. Specializing in Digital FTEs (AI Employees) that act like human team members. These agents handle customer inquiries, lead qualification, appointment booking, and operational workflows without human intervention.

Cost: Starts under $500 for basic AI agents. Contact Asad for accurate pricing.
Timeline: 1-3 weeks depending on complexity.""",
        },
        {
            "id": "service-enterprise-rag",
            "title": "Service: Enterprise RAG Solutions",
            "category": "service",
            "tags": ["service", "rag", "enterprise", "knowledge-base"],
            "content": """Service: Enterprise RAG Solutions

Chat-with-your-data systems using vector databases (Pinecone/Qdrant/Chroma), LangChain, LlamaIndex, and custom knowledge bases. Enables organizations to query their documents, manuals, and data using natural language with accurate, source-cited responses.

Cost: Starts under $500 for basic RAG setup. Contact Asad for accurate pricing.""",
        },
        {
            "id": "service-fullstack-saas",
            "title": "Service: Full-Stack SaaS Development",
            "category": "service",
            "tags": ["service", "saas", "fullstack", "web-development"],
            "content": """Service: Full-Stack SaaS Development

Production-ready web apps built from scratch — React/Next.js frontend, FastAPI/Python backend, PostgreSQL, Redis. Includes authentication, payment integration, API design, and deployment.

Cost: Varies by complexity — contact Asad for accurate pricing.""",
        },
        {
            "id": "service-cloud-devops",
            "title": "Service: Cloud-Native DevOps",
            "category": "service",
            "tags": ["service", "devops", "cloud", "docker", "kubernetes"],
            "content": """Service: Cloud-Native DevOps

Docker, Kubernetes, CI/CD pipelines, and cloud deployment (AWS/Vercel/Railway). Infrastructure as code, automated testing, monitoring, and rollback strategies.

Cost: Contact Asad for accurate pricing.""",
        },
        {
            "id": "service-premium-ui",
            "title": "Service: Premium UI/UX Engineering",
            "category": "service",
            "tags": ["service", "ui", "ux", "frontend", "design"],
            "content": """Service: Premium UI/UX Engineering

Beautiful, performant interfaces built with Tailwind CSS, Framer Motion, Radix UI, and shadcn/ui. Focus on responsive design, accessibility, ARIA labels, and smooth animations.

Cost: Contact Asad for accurate pricing.""",
        },
    ]

    for svc in services:
        chunks.append(svc)

    # ════════════════════════════════════════════════════════════
    # SECTION 7: PRICING & CONSULTATION
    # ════════════════════════════════════════════════════════════
    chunks.append({
        "id": "pricing-general",
        "title": "Project Pricing & Consultation",
        "category": "pricing",
        "tags": ["pricing", "cost", "budget", "consultation", "hire"],
        "content": """PROJECT PRICING INFORMATION:

- Basic AI agents, chatbots, and automation projects: Starts under $500
- RAG systems and knowledge bases: Starts under $500
- Full-stack SaaS applications: Varies by complexity
- Custom AI integrations: Contact for accurate pricing

For accurate pricing on any project, contact Asad Shabir directly:
- Email: asadshabir505@gmail.com
- WhatsApp: +92 325 3939049
- Portfolio: https://asadshabir.com

Asad provides free initial consultation to understand your requirements before quoting.""",
    })

    chunks.append({
        "id": "consultation-process",
        "title": "How to Hire / Consultation Process",
        "category": "pricing",
        "tags": ["hire", "consultation", "process", "booking", "freelance"],
        "content": """HOW TO HIRE ASAD SHABIR:

1. INITIAL CONSULTATION (Free):
   - Discuss your project requirements
   - Understand business goals and technical needs
   - Ask any questions about approach and timeline

2. PROPOSAL:
   - Receive a detailed project proposal
   - Clear scope, timeline, and pricing
   - No obligation to proceed

3. DEVELOPMENT:
   - Agile development process
   - Regular updates and communication
   - Testing and quality assurance

4. DELIVERY:
   - Deployed to your preferred platform
   - Documentation and handover
   - Post-delivery support available

Asad is available for:
- Freelance projects
- Full-time remote roles
- Consulting engagements
- Collaborations

Contact to start: asadshabir505@gmail.com or +92 325 3939049""",
    })

    # ════════════════════════════════════════════════════════════
    # SECTION 8: CONTACT & SOCIAL LINKS
    # ════════════════════════════════════════════════════════════
    chunks.append({
        "id": "contact-info",
        "title": "Asad Shabir — Complete Contact Info",
        "category": "contact",
        "tags": ["contact", "email", "phone", "whatsapp", "reach", "call"],
        "content": """Asad Shabir's Contact Information:
Email: asadshabir505@gmail.com
Phone / WhatsApp: +92 325 3939049
Location: Sehwan Sharif / Karachi, Pakistan

Available for: Freelance projects, full-time roles, consulting, and collaborations.
Best way to reach: Email or WhatsApp for fastest response.""",
    })

    chunks.append({
        "id": "social-media-links",
        "title": "Asad Shabir — Social Media & GitHub Links",
        "category": "social",
        "tags": ["social", "github", "linkedin", "instagram", "twitter", "social media", "online", "follow"],
        "content": """Asad Shabir's Social Media and Online Profiles:

GitHub: https://github.com/asadshabir
- 51+ public repositories
- Active in AI agents, full-stack development, automation
- Projects include Personal-AI-Employee, Medibridge, Humanoid-Robotic-Book, full-stack-todo-app
- Tech stack: Python, TypeScript, JavaScript, HTML, CSS

LinkedIn: https://www.linkedin.com/in/asad-shabir-programmer110/
- AI Full-Stack Developer
- Agentic AI Developer & AI Automation Specialist
- Expertise: OpenAI Agents SDK, n8n, Chatbots, MCP Servers

Portfolio Website: https://asadshabir.com
- Complete portfolio with case studies, projects, and contact
- Interactive AI chatbot for visitor engagement""",
    })

    # ════════════════════════════════════════════════════════════
    # SECTION 9: PERSONAL INFO (from tools.py)
    # ════════════════════════════════════════════════════════════
    chunks.append({
        "id": "personal-background",
        "title": "Asad Shabir — Personal Background",
        "category": "background",
        "tags": ["background", "personal", "story", "journey", "about"],
        "content": """Asad Shabir Bhatti, Age 23
From: Shaikh Mohalla, Sehwan Sharif, Sindh, Pakistan
Languages: Sindhi (mother tongue), Urdu, English

PROFESSIONAL JOURNEY:
2023 — Pakistan Navy Marine Sailor. Served 3 months. Resigned — wanted freedom and chose technology.
2023-2024 — Sindh Police SSU Commando. Cleared elite training. Rejected the offer — chose software engineering.
Present — Self-taught AI Engineer. Healthcare by day, AI by night.

VALUES:
- Freedom (Azadi) — above everything
- Faith — deeply spiritual
- Family — reason for everything
- Sindhi Pride — proud of his land and language (Sehwan Sharif — home of Hazrat Lal Shahbaz Qalandar)

DREAMS:
1. World-class AI Engineer working abroad on meaningful problems
2. Give family everything — house, Hajj for parents
3. Help every human being in need

CURRENT LIFE:
Works as Nutrition Assistant at a hospital (8 AM to 3 PM).
Studies and codes AI systems until 2 AM every night.
Self-taught — never attended formal AI/software education.""",
    })

    # ════════════════════════════════════════════════════════════
    # SECTION 10: GUIDANCE & RULES
    # ════════════════════════════════════════════════════════════
    chunks.append({
        "id": "portfolio-priority",
        "title": "Portfolio Priority Order",
        "category": "guidance",
        "tags": ["priority", "presentation", "professional"],
        "content": """When presenting Asad Shabir professionally, the priority order is:
1. Skills — what he can do
2. Projects — what he has built
3. Experience — his professional journey
4. Technical architecture — how he thinks about systems
5. Education — formal learning background
6. Personal background — where he comes from

Always showcase professional capability before personal history.
Lead with expertise first. Personal background comes only if requested.""",
    })

    chunks.append({
        "id": "identity-core",
        "title": "Asad Shabir — Digital Representative Identity",
        "category": "identity",
        "tags": ["identity", "purpose", "representative"],
        "content": """Asad Shabir is the professional digital representative.
His primary responsibility is to accurately represent:
- skills
- projects
- experience
- technical expertise
- professional capabilities

He is not a general-purpose assistant. He is a portfolio intelligence system.
Every answer should help users understand:
- what Asad can build
- how Asad thinks
- what value Asad delivers""",
    })

    chunks.append({
        "id": "context-priority",
        "title": "Data Source Priority Order",
        "category": "guidance",
        "tags": ["priority", "data", "accuracy", "retrieval"],
        "content": """When answering questions about Asad Shabir, data sources should be trusted in this priority order:
1. Retrieved project data (from RAG/vector database)
2. Case studies
3. Skills database
4. Profile database
5. System prompt instructions

If retrieved data conflicts with the system prompt, trust retrieved data.
Always use real data from the portfolio.
Never invent projects, clients, achievements, certifications, years of experience, or technologies.""",
    })

    # ════════════════════════════════════════════════════════════
    # SECTION 11: PORTFOLIO WEBSITE — Complete Section-by-Section Guide
    # ════════════════════════════════════════════════════════════

    chunks.append({
        "id": "portfolio-website-overview",
        "title": "Asad Shabir — Portfolio Website Overview",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "overview", "frontend", "architecture", "tech-stack"],
        "content": """ASAD SHABIR PORTFOLIO WEBSITE — COMPLETE OVERVIEW

A premium, AI-integrated single-page portfolio built with React 18, TypeScript, Vite, and Tailwind CSS. The website showcases Asad Shabir's work as an AI Full-Stack Developer through interactive 3D UI components, Framer Motion animations, and a multi-agent AI chatbot.

Frontend Stack: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Radix UI, shadcn/ui, Lucide React icons
Backend Stack: Python 3.11+, FastAPI, PostgreSQL, Redis, OpenAI Agents SDK
Infrastructure: Docker, Vercel (frontend), Railway or Vercel (backend), Cloudflare
AI Features: Multi-agent chatbot (OpenAI Agents SDK), RAG with Qdrant vector DB, Cohere embeddings, Gemini/Groq LLM support

KEY SECTIONS:
1. Navbar — Premium floating navigation with scroll-hide/reveal
2. Hero — 3D interactive profile with particle background, FlipWords titles, CTA buttons
3. About — Card3D expertise grid (AI Systems, Full-Stack, DevOps)
4. Skills — 3D skill tokens with infinite tech marquee
5. Projects — Filterable project grid with 6 premium project cards
6. Case Studies — Detailed project case studies with 2 real examples
7. Certifications — Interactive carousel of 7 professional GIAIC certifications
8. Experience — Timelines with Card3D, tracing beam animation
9. Trust — Credibility stats (response time, projects shipped, clients)
10. Project Estimator — AI-powered project complexity/cost estimator
11. Resume Reviewer — AI-powered resume analysis tool
12. Email Capture — Newsletter signup form
13. Contact — Contact form + social links with Resend email integration
14. Footer — Premium footer with tech chips and social links
15. ChatBot — Multi-agent AI chatbot with multilingual support
16. Sidebar — Persistent quick-action sidebar (GitHub, LinkedIn, WhatsApp, Resume, Contact)
17. ScrollToTop — Smooth scroll-to-top button

DESIGN SYSTEM:
- Premium glass morphism (frosted glass cards with backdrop-blur)
- Neon glow effects on interactive elements
- Holographic text gradients
- 3D perspective tilt on cards (Card3D component)
- Metallic text effects
- Ambient mesh background
- Particle background with interactive mouse effects
- Animated glow pulses and border orbits
- Responsive: mobile-first with full tablet/desktop support
- Color scheme: Dark theme with cyan primary, magenta accent, emerald green accents
- Multi-language UI support (English, Urdu, Sindhi)

DEPLOYMENT:
- Frontend: Vite dev server (localhost:8080), production on Vercel
- Backend: FastAPI (localhost:8000) with Uvicorn + Vercel Python runtime
- Chatbot: Separate FastAPI service (localhost:8005) with OpenAI Agents SDK
- Vector DB: Qdrant Cloud cluster for RAG knowledge base
- AI Models: Gemini 2.0 Flash (primary), Groq Llama 3.3 (fallback)
- Embeddings: Cohere multilingual v3.0 for RAG""",
    })

    chunks.append({
        "id": "portfolio-navbar-section",
        "title": "Portfolio Section: Navbar — Premium Floating Navigation",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "navbar", "navigation", "ui-component", "header"],
        "content": """NAVBAR COMPONENT — PREMIUM FLOATING HEADER

The Navbar is a fixed-position premium floating header that appears at the top of every page. It is implemented in src/components/Navbar.tsx.

FEATURES:
- Fixed positioning with max-width constrained, centered layout (max-w-[1120px])
- Always visible by default, hides on scroll-down (threshold: 50px), reveals on scroll-up
- Uses useNavbarScroll() custom hook for scroll detection with 300ms CSS transition
- Two visual states: transparent (at top) → frosted glass (after 10px scroll)
- Brand logo with avatar image on the left with "Asad Shabir" text
- Desktop: centered navigation links (About, Skills, Projects, Case Studies, Blog, Experience, Contact)
- Desktop: right-side "Hire Me" CTA button with arrow-up-right icon
- Mobile: hamburger menu that opens a premium sidebar panel with all links
- Mobile menu closes on window resize above 768px

NAVIGATION LINKS (Desktop & Mobile):
- About (#about), Skills (#skills), Projects (#projects)
- Case Studies (/case-studies), Blog (/blog)
- Experience (#experience), Contact (#contact)

BEHAVIOR:
- Initial load: fade in from top (Framer Motion)
- Scroll down: transforms to compact frosted state
- Scroll further down: hides (slides up) to maximize content area
- Scroll up: immediately reveals
- No micro-scroll jitter (cooldown timer in hook)
- Respects prefers-reduced-motion
- ARIA labels for accessibility""",
    })

    chunks.append({
        "id": "portfolio-hero-section",
        "title": "Portfolio Section: Hero — Interactive 3D Landing",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "hero", "landing", "3d", "particles"],
        "content": """HERO COMPONENT — INTERACTIVE 3D LANDING SECTION

The Hero section is the first thing visitors see — located at the top of the page with id="hero". Implemented in src/components/Hero.tsx.

FEATURES:
- 3D interactive profile photo with mouse-tracking tilt effect (perspective: 1200px)
- ParticleBackground component with floating particles
- Ambient mesh gradient background with three floating glowing orbs (primary, accent, emerald)
- Premium name text with SparklesEffect and holo graphic text treatment
- Heartbeat SVG animation line with embedded coding symbols (</>, {}, ;, =>, ())
- FlipWords cycling through 13 role titles (cycling every 2500ms)
- Three CTA buttons with premium glass styling:
  1. "View My Work" — smooth scrolls to #projects section
  2. "Talk to My AI" — opens the ChatBot panel (onOpenChat prop)
  3. "Download Resume" — downloads Asad_Shabir_Developer.pdf with analytics tracking
- Premium badges: "Digital FTE" and "AI Agents" floating near profile photo
- 4 orbiting icon particles (Bot, Cpu, Network, Workflow) in circular animation
- Conic gradient border animation on profile photo

TECHNICAL:
- Framer Motion for all entrances (spring stiffness 80 for photo, staggered delays)
- useRef for photo DOM access, useState for tilt tracking
- useAnalytics() hook for download tracking
- Responsive: mobile-first layout with LG breakpoint for side-by-side
- 3D transformZ layering for premium depth effect""",
    })

    chunks.append({
        "id": "portfolio-about-section",
        "title": "Portfolio Section: About — AI Engineer Introduction",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "about", "expertise"],
        "content": """ABOUT COMPONENT — AI ENGINEER INTRODUCTION

The About section introduces Asad Shabir as an AI Engineer and Agentic AI Developer. Located with id="about". Implemented in src/components/About.tsx.

FEATURES:
- BackgroundBeams component for subtle animated light beams
- Shield icon with "About Me" uppercase mono label
- Holographic text for headline: "AI Engineer & Agentic AI Specialist"
- Three paragraph professional bio covering:
  1. Role as AI Engineer specializing in Digital FTEs, multi-agent orchestration, production conversational AI
  2. Current study at GIAIC in Agentic AI, SDD, CI/CD practices
  3. Technical toolkit: OpenAI Agents SDK, Groq, LangChain, Claude Code, FastAPI, Next.js, Docker, K8s, Kafka, Dapr, n8n
- 4 PremiumBadge chips: Agentic AI Expert, Digital FTE Builder, Spec-Driven Architect, Multi-Cloud DevOps
- 3 Card3D expertise cards in a grid:
  1. AI & Agentic Systems — multi-agent orchestration, RAG pipelines, MCP Servers
  2. Full-Stack & Cloud — Next.js, FastAPI, Docker, K8s, Supabase
  3. Automation & DevOps — n8n, CI/CD, SDD with Spec-Kit Plus
- Each card has: gradient icon container, title, description, custom glow color (cyan/magenta/emerald)

DESIGN:
- Premium glass card container with two large blurred gradient orbs
- Entrance animation: fade up from 40px with 0.6s duration
- Card grid staggered entrance (0.15s delay per card)
- Subtle "expertise-card" hover effects with 3D perspective""",
    })

    chunks.append({
        "id": "portfolio-skills-section",
        "title": "Portfolio Section: Skills — 3D Tech Arsenal Display",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "skills", "technology"],
        "content": """SKILLS COMPONENT — 3D TECH ARSENAL DISPLAY

The Skills section displays Asad's technical capabilities through interactive 3D cards. Located with id="skills". Implemented in src/components/Skills.tsx.

FEATURES:
- BackgroundBeams component for animated backdrop
- "Skills & Tech" monospace label with "My Arsenal" holographic headline
- 6 category Card3D tokens in a 3-column grid with 3D perspective:
  1. AI Chatbots (Bot icon) — cyan glow
  2. Agentic AI (Brain icon) — magenta glow
  3. Python AI (Cpu icon) — both glow, brand-python color
  4. n8n Flows (Workflow icon) — emerald glow, brand-n8n color
  5. React Apps (Code2 icon) — cyan glow, brand-react color
  6. DevOps (Cloud icon) — both glow, brand-devops color
- Each token: 3D card with isometric icon container with gradient background
- Animated gradient underline on each card
- Infinite tech marquee at bottom showing 16 technologies:
  React, Next.js, TypeScript, Python, FastAPI, OpenAI, LangChain, Supabase, Tailwind, Docker, Node.js, PostgreSQL, Vercel, Git, GraphQL, Framer Motion

DESIGN:
- Staggered entrance animation (staggerChildren: 0.1)
- 3D card rotation on hover via Card3D component
- Skill icon 3D depth with inner shadows and border highlights
- Responsive: 2 columns mobile → 3 columns desktop
- Premium glass marquee container""",
    })

    chunks.append({
        "id": "portfolio-projects-section",
        "title": "Portfolio Section: Projects — Filterable Project Grid",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "projects", "portfolio-showcase"],
        "content": """PROJECTS COMPONENT — FILTERABLE PROJECT GRID

The Projects section displays Asad's built projects in an interactive filterable grid. Located with id="projects". Implemented in src/components/Projects.tsx.

FEATURES:
- BackgroundBeams for animated backdrop
- "Built Projects" holographic headline with "Portfolio" label
- 3 filter tabs with animated layoutId transition:
  1. All — gradient from-primary to-accent
  2. AI & Agents — from-violet-500 to-primary
  3. Full-Stack Apps — from-accent to-primary
  4. Automation Tools — from-primary to-teal-400
- 6 project cards in responsive grid (1 → 2 → 3 columns):

1. MediBridge — AI healthcare platform for patients, doctors, pharmacies. Stack: Python, FastAPI, React, PostgreSQL, OpenAI, AWS
2. AI-Powered Robotics Book — Interactive AI educational book with 3D visuals. Stack: Next.js, OpenAI, TypeScript, Tailwind, Three.js
3. Todo App — Full-stack task management with kanban board. Stack: React, Node.js, PostgreSQL, WebSockets
4. AI Resume Analyzer — NLP resume parser with score and suggestions. Stack: Python, LangChain, React, FastAPI
5. Real-Time Dashboard — Live analytics with WebSocket charts. Stack: React, Node.js, PostgreSQL, WebSockets. FEATURED.
6. ASA-Mind — Multi-agent AI chat with streaming and memory. Stack: OpenAI Agents SDK, Python, FastAPI, React, Supabase. FEATURED.

Each card shows: category gradient image, Featured badge (if applicable), Live status indicator, title, description (2-line clamp), tech stack badges, action links (Live Demo, GitHub, Case Study when available).

DESIGN:
- AnimatePresence with scale/rotateX transitions on filter change
- Animated gradient on project images with screen blend overlay
- Hover: image scale 110%, card lift/y-translate, glow effects
- "View All Case Studies" link at bottom""",
    })

    chunks.append({
        "id": "portfolio-case-studies-section",
        "title": "Portfolio Section: Case Studies — In-Depth Project Analysis",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "case-studies", "portfolio"],
        "content": """CASE STUDIES SECTION — DETAILED PROJECT ANALYSIS

The Case Studies section provides in-depth analysis of Asad's major projects. Located with id="case-studies". Implemented in src/components/CaseStudiesSection.tsx.

TITLE: "Case Studies" with holographic text treatment
SUBTITLE: "Real problems. Strategic approaches. Measurable results. Here's how I turn ideas into production-grade solutions."

FEATURES:
- Loading state: skeleton animation with pulse effect (2 placeholders)
- Empty state: centered "No case studies yet." message
- Loads data asynchronously from loadCaseStudies() API function
- Two case study cards in responsive 2-column grid

CURRENT CASE STUDIES:
1. Medibridge Healthcare Platform — AI-powered healthcare management platform
   - Challenge: Fragmented patient records, manual scheduling, no unified communication
   - Approach: Multi-tenant platform with role-based access, AI symptom analysis, real-time scheduling
   - Stack: Python, FastAPI, React, PostgreSQL, OpenAI, Twilio, AWS, Docker, Redis
   - Results: 2-min scheduling (from 15min), 2000+ patients, 87% AI accuracy, 60% faster prescriptions

2. AI-Powered Robotics Book — Interactive learning platform
   - Challenge: No hands-on robotics experience from textbooks
   - Approach: Browser-based IDE with AI assistance, 3D Three.js simulations, progressive learning
   - Stack: Python, FastAPI, React, Three.js, OpenAI, WebSockets, MongoDB, Docker
   - Results: 1500+ students, 78% completion rate, 65% AI-resolved queries, 92% satisfaction""",
    })

    chunks.append({
        "id": "portfolio-certifications-section",
        "title": "Portfolio Section: Certifications — Professional GIAIC Credentials",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "certifications", "credentials", "giaic"],
        "content": """CERTIFICATIONS COMPONENT — PROFESSIONAL CREDENTIALS CAROUSEL

The Certifications section displays 7 professional certifications from GIAIC (Governor's Initiative for Artificial Intelligence and Computing) in an interactive swipeable carousel. Located with id="certifications". Implemented in src/components/Certifications.tsx.

TITLE: "Professional Certifications" with holographic text
SUBTITLE: "Validated expertise across cloud, AI, and full-stack development"

7 CERTIFICATIONS:
1. Agentic AI Developer — Skills: Agentic AI, Autonomous Agents, AI Orchestration
2. AI Engineer — Skills: Artificial Intelligence, Machine Learning, Deep Learning
3. AI-Native Developer — Skills: AI-Native Development, Prompt Engineering, LLM Integration
4. Cloud Native Developer — Skills: Cloud Computing, Docker, Kubernetes
5. Full Stack Developer — Skills: React, TypeScript, FastAPI, PostgreSQL
6. Prompt Engineer — Skills: Prompt Engineering, LLM Fine-tuning, RAG
7. QA Engineer — Skills: Software Testing, Automation, Quality Assurance

FEATURES:
- Mobile-optimized carousel with swipe gestures (drag detection)
- Left/right navigation buttons with premium glass styling
- Animated slide transitions with spring physics
- Dot indicator showing current position (active: 32px wide, inactive: 8px)
- Each card shows: certificate image in gradient background, award icon, title, issuer, skills tags
- Animated entrance with staggered timing
- Responsive height: mobile 500px → desktop 580px""",
    })

    chunks.append({
        "id": "portfolio-experience-section",
        "title": "Portfolio Section: Experience — Professional Timeline",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "experience", "timeline"],
        "content": """EXPERIENCE COMPONENT — PROFESSIONAL TIMELINE

The Experience section presents Asad's professional journey as an interactive timeline with Card3D cards. Located with id="experience". Implemented in src/components/Experience.tsx.

HEADER: "My Journey" with holographic text, "Experience" label with Sparkles icon
SUBTEXT: "A timeline of growth, impact, and continuous learning."

2 EXPERIENCE ENTRIES:

1. AI Full-Stack Engineer — Freelance / Self-Employed (2024 – Present)
   Key achievements:
   - Building Digital FTEs — 24/7 AI customer success agents with multi-channel support and PostgreSQL ticketing
   - Developing production-grade chatbots, RAG pipelines, multi-agent orchestration with OpenAI Agents SDK
   - Architecting full-stack AI apps with FastAPI, Next.js, Supabase, cloud-native deployment
   - Building custom MCP Servers and SDD workflows using Claude Code and Spec-Kit Plus

2. Agentic AI Engineering — GIAIC (2023 – Present)
   Key studies:
   - Advanced study of Agentic AI, prompt engineering, conversational AI systems
   - Enterprise-grade practices: SDD, CI/CD, cloud-native architecture
   - Hands-on: Docker, Kubernetes, Kafka, Dapr, n8n for scalable automation

DESIGN:
- Glowing vertical tracing beam line with animated scaleY entrance
- Floating animated dot that travels down the beam
- Each entry: glowing dot with gradient, Card3D with soft radial light beam behind
- Briefcase icon with date, role title (metallic text), company name
- Bullet points with small glowing gradient dots
- Spring animations with staggered delays""",
    })

    chunks.append({
        "id": "portfolio-trust-section",
        "title": "Portfolio Section: Trust — Credibility Stats & Signals",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "trust", "credibility", "stats"],
        "content": """TRUST SECTION — CREDIBILITY STATS AND SIGNALS

The Trust section displays credibility data without inflated claims. Located with id="trust". Implemented in src/components/TrustSection.tsx.

HEADER: "Why Work With Me" label, "Credibility, in numbers" headline
SUBTEXT: "No inflated claims. Just real delivery and honest commitments."

4 STAT CARDS in 4-column grid:
1. <24h Response Time — personal reply to every inquiry within 24 hours (primary color)
2. 30+ Projects Shipped — AI agents to full-stack apps, automation systems (accent color)
3. Multiple Happy Clients — small teams, startups, enterprises (emerald color)
4. 100% Production Ready — built to scale, not just to demo (cyan color)

PROJECT HIGHLIGHTS (2x2 grid below stats):
- E-commerce platforms with AI-powered product recommendations
- Multi-language support: English, Urdu, and Sindhi
- 500+ daily AI conversations handled in production
- Logistics automation: 10,000+ daily events processed

CLOSING STATEMENT: "I take on a limited number of projects at a time to ensure every client gets the attention they deserve."

DESIGN: Minimal grid with glass borders, entrance animation staggered by 0.1s, subtle hover effects""",
    })

    chunks.append({
        "id": "portfolio-project-estimator-section",
        "title": "Portfolio Section: Project Estimator — AI-Powered Cost/Timeline Tool",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "project-estimator", "ai-tool", "estimator"],
        "content": """PROJECT ESTIMATOR COMPONENT — AI-POWERED PROJECT COST/TIMELINE ESTIMATOR

An interactive AI-powered tool that analyzes project descriptions and provides complexity, timeline, tech stack, risk assessments, and next steps. Located with id="project-estimator". Implemented in src/components/ProjectEstimator.tsx.

FULL MULTILINGUAL SUPPORT — available in English, Urdu (اردو), and Sindhi (سنڌي):
- All labels, placeholders, buttons, and disclaimers are translated in all 3 languages
- Language prop: ProjectEstimator component accepts language prop

HOW IT WORKS:
1. User describes their project (min 20 chars, max 2000 chars)
2. AI analyzes the description via /api/estimator backend endpoint
3. Returns structured estimate with sections:
   - COMPLEXITY: Level (Low/Medium/High/Very High) + reasons + red flags
   - TIMELINE: Estimated min-max weeks + assumptions
   - TECH STACK: Frontend, Backend, AI/ML, Infrastructure recommendations
   - RISKS: Severity levels (Low/Medium/High) + risk descriptions + mitigation strategies
   - NEXT STEPS: Priority levels (Immediate/Short-term/Nice-to-have) with actionable steps

USER EXPERIENCE:
- Clean textarea with character counter (max 2000)
- Clear "Get Estimate" submit button with loading spinner state
- Results displayed in beautiful structured cards
- "Try another project" reset button
- Validation: minimum 20 characters, shows warning if too short
- Error state with message and toast notification
- CTA block at bottom: "Want a detailed estimate?" leads to contact section""",
    })

    chunks.append({
        "id": "portfolio-resume-reviewer-section",
        "title": "Portfolio Section: Resume Reviewer — AI Resume Analysis Tool",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "resume-reviewer", "ai-tool", "resume"],
        "content": """RESUME REVIEWER COMPONENT — AI-POWERED RESUME ANALYSIS

An interactive AI tool that analyzes resumes and provides actionable feedback on strengths, weaknesses, ATS optimization, skill gaps, and role targeting. Located with id="resume-reviewer". Implemented in src/components/ResumeReviewer.tsx.

FULL MULTILINGUAL SUPPORT — available in English, Urdu (اردو), and Sindhi (سنڌي):
- All labels, placeholders, buttons, and disclaimers translated in all 3 languages

HOW IT WORKS:
1. User optionally enters a target role (max 200 chars)
2. Pastes resume text (min 50 chars, max 10000 chars)
3. AI analyzes via /api/reviewer backend endpoint
4. Returns structured review with sections:
   - SUMMARY: Overall assessment paragraph
   - STRENGTHS: Identified resume strengths
   - WEAKNESSES: Areas for improvement
   - ATS OPTIMIZATIONS: ATS-specific suggestions
   - SKILL GAPS: Missing or underdeveloped skills
   - IMPROVEMENT TIPS: Actionable improvement suggestions
   - ROLES TO TARGET: Recommended job roles

USER EXPERIENCE:
- Optional target role input field with character limit
- Monospace textarea for natural resume paste
- Character counter for validation
- Minimum 50 character validation with clear warning
- Results in responsive 2-column grid layout
- Icons and color coding for each section
- "Review another resume" reset button
- Error state with toast notification
- CTA: "Want personalized career guidance?" links to contact section""",
    })

    chunks.append({
        "id": "portfolio-email-capture-section",
        "title": "Portfolio Section: Email Capture — Newsletter Signup",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "email-capture", "newsletter", "subscribe"],
        "content": """EMAIL CAPTURE COMPONENT — NEWSLETTER SIGNUP

A newsletter subscription form that appears once per browser session. Implemented in src/components/EmailCapture.tsx.

HEADLINE: "Stay in the loop"
DESCRIPTION: "I share insights on AI agents, full-stack development, and project lessons. No spam — just thoughtful updates when something is worth sharing."

FEATURES:
- Email input with subscribe button in responsive row layout
- Loading spinner state while subscribing
- Success state: green checkmark with confirmation message, auto-dismiss after 5 seconds
- Error state: inline error message with toast feedback
- localStorage suppression: appears only once per browser session (STORAGE_KEY check)
- Dismissible via X button (also sets localStorage)
- Clean card design with mail icon, subtle background glow""",
    })

    chunks.append({
        "id": "portfolio-contact-section",
        "title": "Portfolio Section: Contact — Form & Social Links",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "contact", "social", "form"],
        "content": """CONTACT COMPONENT — CONTACT FORM AND SOCIAL LINKS

The Contact section provides multiple ways to get in touch. Located with id="contact". Implemented in src/components/Contact.tsx.

HEADER: "Get In Touch" with Heart icon, "Let's Connect" holographic headline

TWO-PANEL LAYOUT:

LEFT PANEL — SOCIAL LINKS (Card3D with cyan glow):
- "Find me online" headline
- 4 social cards in 2x2 grid with brand colors:
  1. Gmail — asadshabir505@gmail.com (brand-gmail tone)
  2. LinkedIn — /in/asad-shabir-programmer110/ (brand-linkedin tone)
  3. GitHub — /asadshabir (brand-github tone)
  4. Facebook — /Asadalibhatti110 (brand-facebook tone)
- Each card: premium icon container, brand color hover glow, label
- Download Resume button with gradient (primary → emerald → accent) and shine hover effect

RIGHT PANEL — CONTACT FORM (Card3D with magenta glow):
- "Send a message" headline
- 3 fields: name (required), email (required), message (required) — all with validation
- Each field: frosted glass input with focus border glow, inline error messages with AlertCircle icon
- Form validation: field-level errors returned from backend
- Submit: Send Message button with gradient, loading spinner, shine effect
- Uses submitContact() service → POST /api/contact
- Analytics tracking (trackContact, trackDownload)
- Toast notifications for success/error/network states

BACKEND INTEGRATION: Resend API for email delivery, rate-limited (5/hr), Redis for rate tracking""",
    })

    chunks.append({
        "id": "portfolio-sidebar-section",
        "title": "Portfolio Section: Sidebar — Persistent Quick-Action Buttons",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "sidebar", "quick-actions", "navigation"],
        "content": """SIDEBAR COMPONENT — PERSISTENT QUICK-ACTION BUTTONS

A fixed right-side vertical toolbar with quick access to external profiles and actions. Implemented in src/components/Sidebar.tsx.

5 BUTTONS:
1. GitHub (Github icon) — https://github.com/asadshabir/ — opens in new tab
2. LinkedIn (Linkedin icon) — https://www.linkedin.com/in/asad-shabir-programmer110/ — opens in new tab
3. WhatsApp (MessageCircle icon) — https://wa.me/923253939049 — opens in new tab
4. Resume (Download icon) — /Asad_Shabir_Developer.pdf — downloads the file
5. Contact (Mail icon) — Gmail compose to asadshabir505@gmail.com — opens in new tab

DESIGN:
- Fixed right side: right-4 (desktop: right-8), centered vertically
- 44x44px tap targets for accessibility
- Premium glass hover effects with tooltip labels
- Hidden on mobile (md:flex)
- High z-index (z-100) to stay above content""",
    })

    chunks.append({
        "id": "portfolio-chatbot-section",
        "title": "Portfolio Section: ChatBot — Multi-Agent AI Assistant",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "chatbot", "ai-assistant", "multi-agent"],
        "content": """CHATBOT COMPONENT — MULTI-AGENT AI PORTFOLIO ASSISTANT

A sophisticated multi-agent AI chatbot that represents Asad Shabir and answers questions about his work, skills, experience, and services. Implemented in src/components/ChatBot.tsx (frontend) and backend/chatbot/app.py (backend).

TRILINGUAL SUPPORT:
- English: "Assalam o Alaikum! I'm Asad Shabir..."
- Urdu (اردو): "وعلیکم السلام! میں اسد شابر ہوں..."
- Sindhi (سنڌي): "وعليکم السلام! آئی اسد شابذ آھيان..."
- Language auto-detection from user input
- Language-specific input placeholders
- Language labels in header (AI Assistant / AI asistent / AI اسسٽنٽ)

HOW IT WORKS (Backend):
- Uses OpenAI Agents SDK with multi-agent orchestration
- 5 specialist sub-agents: ProjectExpert, SkillsExpert, BioExpert, SalesExpert, GeneralAssistant
- Main agent (ASAD-SHABIR-Mind) routes to the right specialist
- RAG knowledge retrieval from Qdrant vector database using Cohere embeddings
- Models: Gemini 2.0 Flash (primary), Groq Llama 3.3 (fallback), Groq Llama 3.1 (second fallback)
- Session memory: 30-minute TTL, stores last 8-10 messages
- Rate limiting: 1.5s minimum between requests from same session

USER INTERACTION:
- Floating chat button (bottom-right) with pulsing status indicator and "Chat with Asad" label
- Opens as a modal panel (full-screen mobile, 420px desktop)
- Profile photo header with online status dot
- Typing indicator with three bouncing dots
- Quick reply suggestions: "What is your tech stack?", "Show me your projects", "How can I hire you?", "How to contact you?"
- Send button with loading spinner
- Scroll-to-bottom on new messages
- Markdown rendering (bold, italic, inline code)
- Error handling: rate limit, timeout, server, auth, network errors with multilingual messages
- Analytics tracking on first message

BACKEND API: POST /chat endpoint at localhost:8005, proxied via Vite at /chat""",
    })

    chunks.append({
        "id": "portfolio-scrolltotop-section",
        "title": "Portfolio Section: ScrollToTop — Scroll-to-Top Button",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "scroll-to-top", "ui-component"],
        "content": """SCROLL TO TOP COMPONENT — SCROLL-TO-TOP FLOATING BUTTON

A floating button that appears when the user scrolls past 75% of the viewport height, allowing smooth navigation back to the hero section. Implemented in src/components/ScrollToTop.tsx.

FEATURES:
- Fixed bottom-left position (bottom-6, left-4/6/8 responsive)
- ArrowUp icon in 12x12 (mobile) to 14x14 (desktop) size
- Only visible after scrolling past 75vh threshold
- Hides automatically when ChatBot is open or user is scrolling
- Spring animation: fade up with scale, exit animation
- Hover effect: y-lift, rotateX, scale increase
- Smooth scroll to #hero on click
- Respects prefers-reduced-motion
- Safe area padding for mobile
- z-index: 50 to stay above content but below chatbot""",
    })

    chunks.append({
        "id": "portfolio-footer-section",
        "title": "Portfolio Section: Footer — Premium Footer",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "footer", "copyright"],
        "content": """FOOTER COMPONENT — PREMIUM FOOTER

The footer at the bottom of the page displays copyright and social links. Implemented in src/pages/Index.tsx inline.

FEATURES:
- "Powered by AI" badge with Sparkles icon
- "Premium AI Portfolio" monospace uppercase label
- "Asad Shabir" holographic text heading
- Description: "High-end AI agents, full-stack products, automation systems..."
- Two tech chips: "AI Native" (Bot icon) and "Full Stack" (Cpu icon)
- 4 social orb links with brand-colored hover glow: Gmail, LinkedIn, GitHub, Facebook
- Copyright: "© 2024 Asad Shabir. Built with passion & AI."
- Premium glass panel container with obsidian border
- Responsive layout: stacked on mobile, side-by-side on desktop""",
    })

    chunks.append({
        "id": "portfolio-multilingual-architecture",
        "title": "Portfolio Multi-Language Architecture — English, Urdu, Sindhi",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "i18n", "multilingual", "urdu", "sindhi"],
        "content": """PORTFOLIO MULTI-LANGUAGE ARCHITECTURE

The portfolio supports three languages: English (en), Urdu (ur), and Sindhi (sd). This is implemented as a UI-level language system, NOT a full i18n framework.

LANGUAGES SUPPORTED:
- English — default, used throughout
- Urdu (اردو) — right-to-left support needed for script
- Sindhi (سنڌي) — spoken in Sindh, Pakistan, Asad's mother tongue

WHERE MULTILINGUAL IS USED:
1. ChatBot (src/components/ChatBot.tsx):
   - Initial greeting in all 3 languages (INITIAL_GREETING object)
   - Language state: "en" | "ur" | "sd"
   - Input placeholder changes per language
   - Header subtitle: "AI Assistant" / "AI asistent" / "AI اسسٽنٽ"
   - Error messages from chatbotService.ts return language-appropriate messages

2. Project Estimator (src/components/ProjectEstimator.tsx):
   - Full UI labels in 3 languages (ESTIMATE_LABELS object in component)
   - Accepts language prop: <ProjectEstimator language="ur" />

3. Resume Reviewer (src/components/ResumeReviewer.tsx):
   - Full UI labels in 3 languages (REVIEW_LABELS object in component)
   - Accepts language prop: <ResumeReviewer language="sd" />

4. Chatbot Backend (backend/chatbot/knowledge_base.py):
   - build_identity_prompt() accepts language parameter
   - build_identity_prompt() instructions include language rules
   - "Always mirror the user's language" — Urdu → Urdu, Sindhi → Sindhi, English → English

IMPLEMENTATION APPROACH:
- Static label objects per component (not a shared i18n system)
- Language state tracked per-session in chatbot
- Language propagated via props to estimator/reviewer
- Chatbot auto-detects language from user input
- Font and typography: English (inter), Urdu/Sindhi (noto nastaliq)""",
    })

    chunks.append({
        "id": "portfolio-backend-api-structure",
        "title": "Portfolio Backend — FastAPI API Structure",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "backend", "api", "fastapi"],
        "content": """PORTFOLIO BACKEND — FASTAPI API STRUCTURE

The backend is a Python FastAPI application serving as the API layer for the portfolio.

BASE URL: http://localhost:8000, Production: /api

CORE INFRASTRUCTURE:
- FastAPI factory pattern (create_app() in backend/api/index.py)
- CORS middleware (allows localhost:5173, asadshabir.com)
- Rate limiting via slowapi (Limiter with remote address key)
- Global exception handler with structured error responses (ok, code, message)
- Logging via structlog
- Pydantic settings management (.env file with validation)

ENDPOINTS:
GET  /api/health   — Health check with version and environment
POST /api/contact  — Contact form submission via Resend email API
GET  /api/profile  — Profile data (name, title, projects, skills)
GET  /api/resume   — Resume download tracking
POST /api/analytics — Analytics event tracking
GET  /api/admin    — Admin dashboard (password protected)
POST /api/subscribe — Email capture subscription
POST /api/estimator — AI project estimate generation
POST /api/reviewer  — AI resume review generation

CHATBOT SERVICE (separate server, port 8005):
GET  /health       — Chatbot health check with model name
GET  /debug-rag    — Debug RAG retrieval (query param: ?q=)
POST /chat         — Main chat endpoint with session management

VITE PROXY CONFIGURATION:
/chat → http://localhost:8005 (chatbot)
/api  → http://localhost:8000 (main API)""",
    })

    chunks.append({
        "id": "portfolio-design-system",
        "title": "Portfolio Design System — Premium UI Components",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "design-system", "ui-components", "styling"],
        "content": """PORTFOLIO DESIGN SYSTEM — PREMIUM UI COMPONENTS LIBRARY

The portfolio uses a custom design system with premium glass-morphism aesthetics.

CORE COMPONENTS:
1. Card3D (src/components/Card3D.tsx):
   - Interactive 3D perspective tilt on mouse hover
   - 4 glow color modes: cyan, magenta, emerald, both
   - Radial gradient that follows cursor position (glowX%, glowY%)
   - Spring physics transitions (stiffness: 300, damping: 30)
   - Hover lift (-10px y), scale (1.02), rotateX/rotateY
   - Dynamic box shadows per glow color
   - Glass backdrop with glare sweep animation

2. PremiumBadge: Small rounded badge with color tones (cyan/magenta/emerald)

3. Premium Glass Effects:
   - premium-glass: backdrop-blur with semi-transparent background
   - premium-glass-strong: stronger blur for cards
   - premium-glass-button: interactive glass buttons
   - premium-glass-button--primary: primary variant with gradient
   - premium-glass-button--magenta: magenta variant
   - Frost-input: frosted glass input fields

4. Animated Backgrounds:
   - ParticleBackground: Floating particles with mouse interaction
   - BackgroundBeams: Animated light beam patterns
   - Ambient mesh: Gradient mesh overlay
   - Floating glow orbs: Large blurred circles that float

5. Typography Effects:
   - holographic-text: Gradient text with shimmer
   - metallic-text: Metallic shine effect
   - neon-text-cyan: Cyan neon glow text
   - FlipWords: Cycling word animation from aceternity

6. Animation Patterns:
   - Framer Motion spring transitions (default: stiffness 300, damping 30)
   - Stagger children entrance animations
   - AnimatePresence for exit animations
   - Viewport-based triggers (once: true, margin: -100px)
   - Heartbeat line animation (SVG path animation)
   - Border orbit rotation (conic gradient)
   - Glare sweep hover effect on cards""",
    })

    chunks.append({
        "id": "portfolio-Card3D-component-detailed",
        "title": "Portfolio Component: Card3D — Interactive 3D Tilt Card",
        "category": "portfolio-website",
        "tags": ["portfolio-website", "Card3D", "3d-tilt", "ui-component"],
        "content": """CARD3D COMPONENT — INTERACTIVE 3D PERSPECTIVE TILT CARD

A reusable 3D tilt card that responds to mouse movement with perspective transforms and dynamic glow effects. Used throughout the portfolio. Implemented in src/components/Card3D.tsx.

PROPS:
- children: ReactNode — card content
- className: string — additional CSS classes
- glowColor: "cyan" | "magenta" | "emerald" | "both" — determines glow color (default: cyan)
- intensity: number — tilt intensity in degrees (default: 15)

BEHAVIOR:
- On mouse move: calculates cursor position within card bounds (0-1 normalized)
- Rotates card on X/Y axis based on cursor position (up to ±intensity degrees)
- Moves radial gradient glow to follow cursor (glowX%, glowY%)
- On mouse leave: resets all transforms and glow to center
- Hover: lifts card 10px, scales to 1.02, adds custom box shadow per glow mode

GLOW COLORS:
- cyan: hsl(var(--primary) / 0.18) — used for AI/tech sections
- magenta: hsl(var(--accent) / 0.18) — used for creative/frontend sections
- emerald: hsl(var(--emerald) / 0.18) — used for DevOps/success sections
- both: mixed primary/accent at lower opacity

TECHNICAL:
- useRef for DOM access, useState for rotateX/Y and glow position
- Framer Motion animate prop for smooth rotation
- perspective: 1000px, transformStyle: preserve-3d
- Inner content at translateZ(34px) for depth illusion
- Glass background with radial gradient overlay
- Premium glass card class with glare-sweep animation""",
    })

    print(f"  Built {len(chunks)} knowledge chunks total")
    return chunks


# ── Embed & Index ────────────────────────────────────────────

def index_all_chunks(chunks: list[dict[str, Any]]) -> int:
    """Embed all chunks with Cohere and upsert into Qdrant."""
    print("Connecting to Cohere...")
    co = cohere.Client(COHERE_API_KEY)

    print(f"Connecting to Qdrant at {QDRANT_URL}...")
    # Try cloud first; if unreachable, use local file-based storage
    try:
        qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, timeout=5)
        qdrant.get_collections()  # test connectivity
        print("  Connected to Qdrant cloud")
    except Exception:
        print("  Qdrant cloud unreachable, switching to local file-based storage")
        import tempfile
        qdrant = QdrantClient(path=os.path.join(tempfile.gettempdir(), "qdrant_portfolio"))

    # Create/recreate collection
    collections = [c.name for c in qdrant.get_collections().collections]
    if QDRANT_COLLECTION in collections:
        print(f"  Deleting existing collection '{QDRANT_COLLECTION}'...")
        qdrant.delete_collection(QDRANT_COLLECTION)

    print(f"  Creating collection '{QDRANT_COLLECTION}' (dims={COHERE_EMBED_DIMS})...")
    qdrant.create_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=models.VectorParams(
            size=COHERE_EMBED_DIMS,
            distance=models.Distance.COSINE,
        ),
    )

    # Extract texts
    texts = [chunk["content"] for chunk in chunks]

    print(f"  Embedding {len(texts)} chunks with Cohere '{COHERE_EMBED_MODEL}'...")
    response = co.embed(
        texts=texts,
        model=COHERE_EMBED_MODEL,
        input_type="search_document",
        embedding_types=["float"],
    )
    embeddings = response.embeddings.float_

    # Build points
    points = []
    for i, chunk in enumerate(chunks):
        points.append(models.PointStruct(
            id=i,
            vector=embeddings[i],
            payload={
                "id": chunk["id"],
                "title": chunk["title"],
                "category": chunk["category"],
                "tags": chunk["tags"],
                "content": chunk["content"],
            },
        ))

    print(f"  Upserting {len(points)} points to Qdrant...")
    qdrant.upsert(
        collection_name=QDRANT_COLLECTION,
        points=points,
        wait=True,
    )

    count = qdrant.count(collection_name=QDRANT_COLLECTION).count
    print(f"  Verified: {count} points in collection")
    return count


def index_all_chunks_inmemory(qdrant: QdrantClient, chunks: list[dict[str, Any]]) -> int:
    """Embed all chunks with Cohere and index into an in-memory Qdrant instance."""
    co = cohere.Client(COHERE_API_KEY)

    # Create collection
    collections = [c.name for c in qdrant.get_collections().collections]
    if QDRANT_COLLECTION in collections:
        qdrant.delete_collection(QDRANT_COLLECTION)

    qdrant.create_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=models.VectorParams(
            size=COHERE_EMBED_DIMS,
            distance=models.Distance.COSINE,
        ),
    )

    texts = [chunk["content"] for chunk in chunks]
    response = co.embed(
        texts=texts,
        model=COHERE_EMBED_MODEL,
        input_type="search_document",
        embedding_types=["float"],
    )
    embeddings = response.embeddings.float_

    points = []
    for i, chunk in enumerate(chunks):
        points.append(models.PointStruct(
            id=i,
            vector=embeddings[i],
            payload={
                "id": chunk["id"],
                "title": chunk["title"],
                "category": chunk["category"],
                "tags": chunk["tags"],
                "content": chunk["content"],
            },
        ))

    qdrant.upsert(collection_name=QDRANT_COLLECTION, points=points, wait=True)
    return qdrant.count(collection_name=QDRANT_COLLECTION).count


# ── CLI ──────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("COMPREHENSIVE PORTFOLIO RAG INDEXER")
    print("=" * 60)

    if not COHERE_API_KEY:
        print("ERROR: COHERE_API_KEY is not set")
        sys.exit(1)

    print("\nPhase 1: Building knowledge chunks...")
    chunks = build_chunks()

    print("\nPhase 2: Embedding and indexing...")
    count = index_all_chunks(chunks)

    print(f"\nDone! {count} knowledge chunks indexed to Qdrant.")
    print("The chatbot is now ready to retrieve comprehensive portfolio data.\n")
