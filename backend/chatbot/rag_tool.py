"""
RAG Tool — OpenAI Agents SDK function_tool wrapper for the portfolio knowledge base.
Agents call this tool to fetch factual data relevant to the user's question.
"""
import re

from agents import function_tool

from backend.chatbot.rag_retriever import retrieve_context


@function_tool(strict_mode=False)
async def get_rag_context_tool(query: str) -> str:
    """
    Semantic search of Asad Shabir's complete portfolio knowledge base.
    Use this tool when asked ANY factual question about Asad's background,
    skills, projects, case studies, services, or contact information.
    Returns the most relevant knowledge chunks based on semantic similarity.

    Args:
        query: The user's question or key search terms (e.g., "MediBridge project details",
               "skills in AI and backend", "professional background", "services offered")
    """
    context = retrieve_context(query=query)
    # Check if the top result is truly relevant by detecting generic filler
    if not context:
        return "NO_DATA"
    # If the context is just a generic project description with low relevance
    # it means no actual match was found
    return context


@function_tool(strict_mode=False)
async def get_portfolio_overview_tool() -> str:
    """
    Get a broad overview of everything in Asad's portfolio.
    Use when the user asks a general 'what can you tell me about yourself'
    or wants a summary of Asad's full capabilities.
    """
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

    if not parts:
        return "Portfolio information is being indexed. Please ask a specific question."

    return "\n\n".join(parts)
