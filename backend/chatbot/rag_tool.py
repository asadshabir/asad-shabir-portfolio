"""
RAG Tool — OpenAI Agents SDK function_tool wrapper for the portfolio knowledge base.
Agents call this tool to fetch factual data relevant to the user's question.
Tools fall back to local data when RAG infrastructure isn't configured.
"""
import os
import re

from agents import function_tool

from backend.chatbot.rag_retriever import retrieve_context


_HAS_RAG_KEYS: bool | None = None


def _rag_available() -> bool:
    """Check if RAG infrastructure (Cohere + Qdrant) is configured.
    Result is cached after first check."""
    global _HAS_RAG_KEYS
    if _HAS_RAG_KEYS is None:
        _HAS_RAG_KEYS = bool(os.getenv("COHERE_API_KEY")) and bool(os.getenv("QDRANT_API_KEY"))
    return _HAS_RAG_KEYS


@function_tool(strict_mode=False)
async def get_rag_context_tool(query: str) -> str:
    """
    Deep semantic search of Asad Shabir's complete portfolio knowledge base.
    Use this tool ONLY when you need specific technical details, implementation
    specifics, architecture decisions, or in-depth information that is NOT already
    covered in your system prompt context.

    For simple questions about skills, case study names, or general project
    overviews — answer from your system prompt context first without calling tools.

    Args:
        query: The user's question or key search terms (e.g., "MediBridge project details",
               "skills in AI and backend", "professional background", "services offered")
    """
    if not _rag_available():
        return "NO_DATA"
    context = retrieve_context(query=query)
    if not context:
        return "NO_DATA"
    return context


@function_tool(strict_mode=False)
async def get_portfolio_overview_tool() -> str:
    """
    Get a broad overview of everything in Asad's portfolio.
    Use when the user asks a general 'what can you tell me about yourself'
    or wants a summary of Asad's full capabilities.
    """
    if _rag_available():
        bio = retrieve_context("Asad Shabir professional background and bio")
        skills = retrieve_context("technical skills and technology stack")
        projects = retrieve_context("projects case studies portfolio work")
        services = retrieve_context("services offered what Asad can build")

        parts = []
        if bio:
            parts.append("## Background\n" + bio)
        if skills:
            parts.append("## Skills\n" + skills)
        if projects:
            parts.append("## Projects\n" + projects)
        if services:
            parts.append("## Services\n" + services)

        if parts:
            return "\n\n".join(parts)
        return "Portfolio information is being indexed. Please ask a specific question."
    else:
        # Fallback: build overview from local data (no RAG API calls)
        from backend.chatbot.knowledge_base import get_profile, get_projects, get_skills, get_contact_info, summarize_case_studies

        profile = get_profile()
        name = profile.get("name", "Asad Shabir")
        title = profile.get("title", "Agentic AI Engineer")

        lines = [
            f"# {name}",
            f"**{title}**\n",
            "## Skills\n" + _build_skills_summary(get_skills()),
            "## Case Studies\n" + summarize_case_studies(),
        ]
        return "\n\n".join(lines)


def _build_skills_summary(skills: list) -> str:
    if not skills:
        return "Agentic AI, Multi-Agent Systems, RAG, Full-Stack, Cloud-Native"
    parts = []
    for cat in skills:
        items = cat.get("items", [])
        if items:
            parts.append(f"- **{cat.get('category', 'General')}**: {', '.join(items)}")
    return "\n".join(parts) if parts else "Skills data available."
