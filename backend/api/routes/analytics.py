"""
Analytics tracking route — POST /api/analytics/track
"""
from fastapi import APIRouter, Request

from backend.api.schemas.analytics import TrackEventRequest, TrackEventResponse
from backend.core.logging import get_logger
from backend.services.analytics_service import track_event, VALID_EVENT_TYPES


logger = get_logger(__name__)
router = APIRouter()


@router.post(
    "/analytics/track",
    response_model=TrackEventResponse,
    responses={
        422: {"description": "Validation error"},
    },
    tags=["analytics"],
)
async def track(request: Request, body: TrackEventRequest):
    """
    Record a lead/event action on the portfolio.
    No rate limit — aggregate-only, no abuse vector.
    No IP storage. No cookies. No fingerprinting.
    """
    # Validate event_type
    event_type = body.event_type.strip().lower()
    if event_type not in VALID_EVENT_TYPES:
        # Still record it as cta_click as safe fallback, don't reject
        event_type = "cta_click"

    logger.info(
        f"Analytics event: type={event_type} "
        f"| metadata={body.metadata} "
        f"| email={'yes' if body.visitor_email else 'no'}"
    )

    track_event(
        event_type=event_type,
        metadata=body.metadata,
        visitor_email=body.visitor_email,
    )

    return TrackEventResponse(ok=True)
