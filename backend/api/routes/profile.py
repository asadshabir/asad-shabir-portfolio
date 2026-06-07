"""
Profile route — GET /api/profile
Returns structured profile data from asadshabir_all_info.md.
"""
from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel, Field

from backend.core.logging import get_logger
from backend.services.profile_loader import (
    get_profile,
    get_projects,
    get_skills,
    get_experience_story,
    get_contact,
)


logger = get_logger(__name__)
router = APIRouter()


# ── Response models ──────────────────────────────────────────


class ContactResponse(BaseModel):
    email: str | None = None
    phone: str | None = None
    portfolio: str | None = None


class ProfileApiResponse(BaseModel):
    ok: bool = True
    name: str
    title: str
    location: str | None = None
    background: str | None = None
    family: dict[str, str] | None = None
    education: list[str] = Field(default_factory=list)
    skills: dict[str, list[str]] | None = None
    projects: list[dict[str, str]] = Field(default_factory=list)
    experience_story: str | None = None
    goals: list[str] = Field(default_factory=list)
    contact: ContactResponse | None = None
    loaded_at: str | None = None


# ── GET /api/profile ──────────────────────────────────────────


@router.get(
    "/profile",
    response_model=ProfileApiResponse,
    tags=["chatbot"],
)
async def get_profile_data():
    """
    Return structured profile data from asadshabir_all_info.md.

    Useful for:
    - Frontend displaying Asad's profile
    - Debugging what the chatbot knows
    - Health-checking the profile loader
    """
    logger.info("Profile endpoint hit")

    profile = get_profile()
    projects_data = get_projects()
    skills_data = get_skills()
    experience = get_experience_story()
    contact = get_contact()

    return ProfileApiResponse(
        ok=True,
        name=profile.get("name", "Asad Shabir"),
        title=profile.get("title", "AI-Native Full-Stack Developer"),
        location="Sehwan Sharif, Sindh, Pakistan",
        background=profile.get("personal", {}).get("location", "Sehwan Sharif, Sindh"),
        family=profile.get("family"),
        education=profile.get("education", []),
        skills={
            "core": skills_data.get("core_skills", []),
            "technical": skills_data.get("technical_skills", []),
            "general_strengths": skills_data.get("general_strengths", []),
        },
        projects=projects_data.get("projects", []),
        experience_story=experience,
        goals=profile.get("goals", []),
        contact=ContactResponse(
            email=contact.get("email"),
            phone=contact.get("phone"),
            portfolio=contact.get("portfolio"),
        ),
        loaded_at=datetime.utcnow().isoformat() + "Z",
    )
