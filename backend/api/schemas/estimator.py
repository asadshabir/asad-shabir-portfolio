"""
Pydantic schemas for the AI Project Estimator endpoint.
"""
from pydantic import BaseModel, Field


class EstimateRequest(BaseModel):
    """Validated project estimation payload."""

    project_description: str = Field(
        ...,
        min_length=20,
        max_length=2000,
        description="A brief but thorough description of the project to estimate",
    )
    language: str = Field(
        default="en",
        pattern="^(en|ur|sd)$",
        description="Interface language (en, ur, sd)",
    )


class ComplexityDetail(BaseModel):
    level: str = Field(description="Complexity level: Low, Medium, High, or Very High")
    reasons: list[str] = Field(description="Why this complexity was chosen")
    red_flags: list[str] = Field(
        default_factory=list,
        description="Specific risk factors that could push complexity higher",
    )


class TimelineDetail(BaseModel):
    estimate_min_weeks: int = Field(ge=1, le=52, description="Minimum estimated weeks")
    estimate_max_weeks: int = Field(ge=1, le=52, description="Maximum estimated weeks")
    assumptions: list[str] = Field(
        default_factory=list, description="Key assumptions made"
    )


class StackRecommendation(BaseModel):
    frontend: list[str] = Field(description="Recommended frontend technologies")
    backend: list[str] = Field(description="Recommended backend technologies")
    ai_ml: list[str] = Field(
        default_factory=list, description="Recommended AI/ML components"
    )
    infrastructure: list[str] = Field(
        default_factory=list, description="Recommended infrastructure/devops"
    )


class RiskItem(BaseModel):
    risk: str = Field(description="Name of the risk")
    severity: str = Field(description="Low, Medium, or High")
    mitigation: str = Field(description="How to reduce this risk")


class NextStepItem(BaseModel):
    step: str = Field(description="Recommended action")
    priority: str = Field(description="Immediate, Short-term, or Nice-to-have")


class EstimateResponse(BaseModel):
    """Structured project estimation response."""

    ok: bool = True
    complexity: ComplexityDetail
    timeline: TimelineDetail
    stack: StackRecommendation
    risks: list[RiskItem]
    next_steps: list[NextStepItem]
    disclaimer: str = Field(
        description="Disclaimer that estimates are indicative"
    )
