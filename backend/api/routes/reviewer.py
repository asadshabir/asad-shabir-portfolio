"""
Reviewer route — POST /api/review
"""
from datetime import datetime, timedelta
from typing import Dict

from fastapi import APIRouter, HTTPException, Request, status

from backend.api.schemas.reviewer import ReviewRequest, ReviewResponse
from backend.core.logging import get_logger
from backend.core.responses import err_response, ERROR_RATE_LIMITED
from backend.core.security import get_client_ip
from backend.services.reviewer_service import (
    get_reviewer_service,
    ReviewerParseError,
    sanitize_resume,
)
from backend.services.analytics_service import track_event


logger = get_logger(__name__)
router = APIRouter()

# ── IP-based rate limit store ────────────────────────────────
_rate_store: Dict[str, list[datetime]] = {}

REVIEW_RATE_LIMIT = 10          # per IP per window
REVIEW_RATE_WINDOW_SECONDS = 60


def _check_rate_limit(ip: str) -> tuple[bool, int]:
    """Returns (allowed, remaining). Mutates _rate_store."""
    key = f"reviewer:{ip}"
    now = datetime.utcnow()
    cutoff = now - timedelta(seconds=REVIEW_RATE_WINDOW_SECONDS)

    timestamps = _rate_store.get(key, [])
    timestamps = [ts for ts in timestamps if ts > cutoff]
    _rate_store[key] = timestamps

    if len(timestamps) >= REVIEW_RATE_LIMIT:
        return False, 0

    timestamps.append(now)
    return True, REVIEW_RATE_LIMIT - len(timestamps)


@router.post(
    "/review",
    response_model=ReviewResponse,
    responses={
        422: {"description": "Invalid input"},
        429: {"description": "Rate limited"},
        503: {"description": "AI service error"},
    },
    tags=["reviewer"],
)
async def review(request: Request, body: ReviewRequest):
    """
    Produce a structured resume review with strengths, weaknesses,
    ATS suggestions, skill gaps, and improvement tips.
    """
    ip = get_client_ip(request)
    allowed, _ = _check_rate_limit(ip)

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You're going a bit fast — please wait a moment before trying again.",
        )

    # Sanitize the resume text (strip injection + enforce size cap)
    clean_text = sanitize_resume(body.resume_text)

    logger.info(
        f"Review request from {ip}, lang={body.language}, "
        f"chars={len(clean_text)}, role={body.target_role or 'general'}"
    )

    try:
        service = get_reviewer_service()
        result = service.review(
            resume_text=clean_text,
            target_role=body.target_role,
            language=body.language,
        )

        # Track analytics event
        track_event(
            event_type="reviewer_use",
            metadata={
                "target_role": body.target_role or "general",
                "language": body.language,
            },
        )

        return ReviewResponse(
            ok=True,
            summary=result["summary"],
            strengths=result["strengths"],
            weaknesses=result["weaknesses"],
            ats_suggestions=result["ats_suggestions"],
            skill_gaps=result["skill_gaps"],
            improvement_tips=result["improvement_tips"],
            role_fit=result["role_fit"],
            disclaimer=result.get(
                "disclaimer",
                "This review is AI-generated and indicative.",
            ),
        )

    except ReviewerParseError as e:
        logger.warning(f"Reviewer parse error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )