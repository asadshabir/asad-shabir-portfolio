"""
Pydantic schemas for the analytics event tracking endpoint.
"""
from pydantic import BaseModel, Field


class TrackEventRequest(BaseModel):
    """Validated analytics event payload."""

    event_type: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Event type: resume_download | contact_submission | chatbot_session | cta_click | estimator_use | reviewer_use | email_capture",
    )
    metadata: dict | None = Field(
        default=None,
        description="Optional context (e.g., cta_label, page URL)",
    )
    visitor_email: str | None = Field(
        default=None,
        max_length=254,
        description="Only from contact form — voluntarily submitted",
    )


class TrackEventResponse(BaseModel):
    """Event recorded response."""

    ok: bool = True
