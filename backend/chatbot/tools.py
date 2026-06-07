"""
Real data tools for the chatbot — all tools load live data from the portfolio.
Each tool returns formatted markdown strings ready for AI response.
No emojis — consistent with the professional identity prompt.
"""
from agents import function_tool

from backend.chatbot.knowledge_base import (
    get_case_studies,
    get_case_study,
    get_projects,
    get_skills,
    get_profile,
    get_story,
    get_contact_info,
    summarize_case_studies,
    summarize_skills,
)
from backend.chatbot.rag_tool import get_rag_context_tool, get_portfolio_overview_tool


@function_tool(strict_mode=False)
async def get_portfolio_projects_tool() -> str:
    """
    Fetch Asad's real portfolio projects and their descriptions.
    Use when the user asks about projects, portfolio, or what Asad has built.
    """
    projects = get_projects()
    if not projects:
        return "Portfolio project data is loading. Ask about case studies for detailed project info."

    parts = ["## Asad's Key Projects\n"]
    for p in projects:
        tech = ", ".join(p.get("tech", []))
        parts.append(f"### {p.get('title', 'Project')}")
        parts.append(p.get("description", ""))
        parts.append(f"*Tech: {tech}*\n")
    return "\n".join(parts)


@function_tool(strict_mode=False)
async def get_skills_tool() -> str:
    """
    Fetch Asad's complete skills and tech stack organized by category.
    Use when asked about skills, tech stack, expertise, or technologies used.
    """
    return "## Asad's Technical Skills\n\n" + summarize_skills()


@function_tool(strict_mode=False)
async def get_case_studies_tool(detail: str = "summary") -> str:
    """
    Fetch real case studies from Asad's portfolio.
    Use when asked about past work, projects, client results, or proof of capability.

    Args:
        detail: "summary" for list view, "full" for all details, or a specific slug
    """
    if detail == "summary":
        return (
            "## Case Studies\n\n"
            + summarize_case_studies()
            + "\n\nAsk me for full details on any case study!"
        )

    if detail == "full":
        studies = get_case_studies()
        if not studies:
            return "No case studies found."
        parts = []
        for cs in studies:
            parts.append(f"## {cs.get('title', '')}")
            parts.append(f"**Challenge:** {cs.get('challenge', '')[:200]}...")
            parts.append(f"**Approach:** {cs.get('approach', '')[:200]}...")
            parts.append(f"**Results:** {' | '.join(cs.get('results', []))}")
            parts.append(f"**Stack:** {', '.join(cs.get('stack', []))}\n")
        return "\n".join(parts)

    # Specific slug
    cs = get_case_study(detail)
    if not cs:
        available = [s.get('slug', '') for s in get_case_studies()]
        return f"Case study '{detail}' not found. Available: {', '.join(available)}"

    results_bullets = "\n".join(f"- {r}" for r in cs.get("results", []))
    return (
        f"## {cs.get('title', '')}\n\n"
        f"**Challenge:**\n{cs.get('challenge', '')}\n\n"
        f"**Approach:**\n{cs.get('approach', '')}\n\n"
        f"**Stack:** {', '.join(cs.get('stack', []))}\n\n"
        f"**Results:**\n{results_bullets}"
    )


@function_tool(strict_mode=False)
async def get_personal_info_tool() -> str:
    """
    Fetch Asad Shabir's professional background, journey, and bio.
    Use when asked about who Asad is, his background, story, or identity.
    """
    return """# ASAD SHABIR — PROFESSIONAL BIO

## Identity
- Name: Asad Shabir | Age: 23
- From: Sehwan Sharif, Sindh, Pakistan
- Languages: Sindhi (native), Urdu, English
- Role: AI Full-Stack Developer

## Professional Journey

### 1. Pakistan Navy (2023)
Joined as a Marine Sailor. Resigned after 3 months — chose an independent path focused on technology and innovation rather than a military career.

### 2. Sindh Police SSU Commando (2023-2024)
Cleared elite SSU Commando training. Officially declined the position — chose software engineering over government service.

### 3. Self-Taught AI Engineer (Present)
Works in healthcare by day, builds AI systems by night. Specializes in Agentic AI, Digital FTEs, RAG platforms, and full-stack applications.

## Professional Values
- Freedom and independence — driven by a deep belief in self-determination
- Discipline — forged through military and commando training, now applied to engineering
- Family — the motivation behind every project and career move
- Continuous learning — self-taught across the full AI/software stack

## Goals
1. Become a world-class AI Engineer working on meaningful, high-impact problems
2. Build technology that delivers measurable business value
3. Help organizations automate and scale through intelligent AI systems

## Contact (share only when asked)
- Email: asadshabir505@gmail.com
- Phone/WhatsApp: +92 325 3939049
- GitHub: https://github.com/asadshabir
- LinkedIn: https://linkedin.com/in/asadshabir
- Portfolio: https://asadshabir.com
"""


@function_tool(strict_mode=False)
async def get_contact_details_tool() -> str:
    """
    Get Asad's contact information and booking details.
    Use when the user wants to hire, contact, book a call, or collaborate.
    """
    c = get_contact_info()
    return (
        "## Contact Asad Shabir\n\n"
        f"**Email:** [{c.get('email')}](mailto:{c.get('email')})\n"
        f"**WhatsApp/Call:** {c.get('phone')}\n"
        f"**LinkedIn:** [{c.get('linkedin')}]({c.get('linkedin')})\n"
        f"**GitHub:** [{c.get('github')}]({c.get('github')})\n"
        f"**Portfolio:** [{c.get('portfolio')}]({c.get('portfolio')})\n\n"
        "**Available for:** Freelance projects, full-time roles, consulting, and collaborations.\n"
        "Send a message via the contact form on the portfolio, or email directly!"
    )


@function_tool(strict_mode=False)
async def get_service_overview_tool() -> str:
    """
    Get an overview of services Asad offers.
    Use when asked about services, how to work with Asad, or what he can build.
    """
    return (
        "## Services Offered\n\n"
        "### 1. Custom AI Agents and Automation\n"
        "Build 24/7 autonomous AI agents for sales, support, and operations. "
        "Specializing in Digital FTEs (AI Employees) that act like human team members.\n\n"
        "### 2. Enterprise RAG Solutions\n"
        "Chat-with-your-data systems using vector databases (Pinecone/Qdrant), "
        "LangChain, and custom knowledge bases.\n\n"
        "### 3. Full-Stack SaaS Development\n"
        "Production-ready web apps from scratch — React/Next.js frontend, "
        "FastAPI/Python backend, PostgreSQL, Redis.\n\n"
        "### 4. Cloud-Native DevOps\n"
        "Docker, Kubernetes, CI/CD pipelines, and cloud deployment (AWS/Vercel).\n\n"
        "### 5. Premium UI/UX Engineering\n"
        "Beautiful, performant interfaces with Tailwind CSS, Framer Motion, and Radix UI."
    )
