"""
Pydantic schemas for the contact form endpoint.
"""

from pydantic import BaseModel, EmailStr, Field


class ContactRequest(BaseModel):
    """Validated contact form submission."""

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Visitor's full name",
    )
    email: EmailStr = Field(
        ...,
        description="Visitor's email address",
    )
    subject: str | None = Field(
        default=None,
        max_length=200,
        description="Optional message subject",
    )
    message: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="Message content",
    )


class ContactResponse(BaseModel):
    """Contact form success response."""

    ok: bool = True
    message: str = "Message sent successfully."
