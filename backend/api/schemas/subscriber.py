"""
Pydantic schemas for the email subscribe endpoint.
"""
from pydantic import BaseModel, EmailStr, Field


class SubscribeRequest(BaseModel):
    """Validated subscriber sign-up payload."""

    email: EmailStr = Field(..., description="Visitor's email address")
    source_page: str = Field(
        default="/",
        max_length=500,
        description="URL where the subscriber opted in",
    )
    name: str | None = Field(
        default=None,
        max_length=100,
        description="Optional first name",
    )


class SubscribeResponse(BaseModel):
    """Subscribe response."""

    ok: bool = True
    message: str = "You're subscribed!"
