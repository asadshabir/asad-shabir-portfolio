"""
Pydantic schemas for the AI Resume Reviewer endpoint.
"""
from pydantic import BaseModel, Field


class ReviewRequest(BaseModel):
    """Validated resume review payload."""

    resume_text: str = Field(
        ...,
        min_length=50,
        max_length=10000,
        description="Resume or CV text content",
    )
    target_role: str | None = Field(
        default=None,
        max_length=200,
        description="Optional target job title or role",
    )
    language: str = Field(
        default="en",
        pattern="^(en|ur|sd)$",
        description="Interface language (en, ur, sd)",
    )


class ReviewResponse(BaseModel):
    """Structured resume review response."""

    ok: bool = True
    summary: str = Field(description="One-paragraph overall assessment")
    strengths: list[str] = Field(
        default_factory=list, description="Key strengths found in the resume"
    )
    weaknesses: list[str] = Field(
        default_factory=list, description="Areas that need improvement"
    )
    ats_suggestions: list[str] = Field(
        default_factory=list,
        description="Suggestions for ATS (Applicant Tracking System) optimization",
    )
    skill_gaps: list[str] = Field(
        default_factory=list,
        description="Skills missing or underrepresented relative to the target role",
    )
    improvement_tips: list[str] = Field(
        default_factory=list, description="Actionable tips to improve the resume"
    )
    role_fit: list[str] = Field(
        default_factory=list,
        description="Roles or positions the resume is well-suited for",
    )
    disclaimer: str = Field(
        description="Disclaimer that this is AI-generated feedback"
    )