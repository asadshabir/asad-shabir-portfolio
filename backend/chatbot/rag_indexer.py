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

    print(f"  Built {len(chunks)} knowledge chunks total")
    return chunks


# ── Embed & Index ────────────────────────────────────────────

def index_all_chunks(chunks: list[dict[str, Any]]) -> int:
    """Embed all chunks with Cohere and upsert into Qdrant."""
    print("Connecting to Cohere...")
    co = cohere.Client(COHERE_API_KEY)

    print(f"Connecting to Qdrant at {QDRANT_URL}...")
    qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

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


# ── CLI ──────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("COMPREHENSIVE PORTFOLIO RAG INDEXER")
    print("=" * 60)

    if not COHERE_API_KEY:
        print("ERROR: COHERE_API_KEY is not set")
        sys.exit(1)
    if not QDRANT_API_KEY:
        print("ERROR: QDRANT_API_KEY is not set")
        sys.exit(1)

    print("\nPhase 1: Building knowledge chunks...")
    chunks = build_chunks()

    print("\nPhase 2: Embedding and indexing...")
    count = index_all_chunks(chunks)

    print(f"\nDone! {count} knowledge chunks indexed to Qdrant.")
    print("The chatbot is now ready to retrieve comprehensive portfolio data.\n")
