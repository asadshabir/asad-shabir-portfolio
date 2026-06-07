"""
Profile data loader — returns static portfolio profile data.
"""
from typing import Any


def get_profile() -> dict[str, Any]:
    return {
        "name": "Asad Shabir",
        "title": "AI Full-Stack Developer",
        "location": "Sehwan Sharif / Karachi, Pakistan",
        "email": "asadshabir505@gmail.com",
        "phone": "+92 325 3939049",
        "available": True,
    }


def get_projects() -> list[dict[str, Any]]:
    return [
        {
            "title": "AI Agent Platform",
            "description": "Multi-agent orchestration platform built with OpenAI Agents SDK.",
            "tech": ["Python", "FastAPI", "OpenAI", "Docker"],
        },
        {
            "title": "MediBridge PWA",
            "description": "Production-grade AI health companion and telehealth platform.",
            "tech": ["React", "TypeScript", "FastAPI", "AI"],
        },
    ]


def get_skills() -> list[dict[str, Any]]:
    return [
        {"category": "AI/ML", "items": ["Agentic AI", "RAG", "NLP", "LLM Fine-tuning"]},
        {"category": "Backend", "items": ["Python", "FastAPI", "Node.js", "PostgreSQL"]},
        {"category": "Frontend", "items": ["React", "TypeScript", "Next.js", "Tailwind"]},
        {"category": "DevOps", "items": ["Docker", "Kubernetes", "Vercel", "CI/CD"]},
    ]


def get_experience_story() -> str:
    return """Asad Shabir is an AI Full-Stack Developer from Pakistan with expertise in building production-grade AI agents, automation systems, and modern web applications. His journey spans from serving in the Pakistan Navy to becoming a specialist in agentic AI and full-stack development."""


def get_contact() -> dict[str, str]:
    return {
        "email": "asadshabir505@gmail.com",
        "phone": "+92 325 3939049",
        "github": "https://github.com/asadshabir",
        "linkedin": "https://linkedin.com/in/asadshabir",
    }
