"""
Estimator route — POST /api/estimate
"""
from datetime import datetime, timedelta
from typing import Dict

from fastapi import APIRouter, HTTPException, Request, status

from backend.api.schemas.estimator import EstimateRequest, EstimateResponse
from backend.core.logging import get_logger
from backend.core.responses import err_response, ERROR_RATE_LIMITED
from backend.core.security import get_client_ip
from backend.services.estimator_service import (
    get_estimator_service,
    EstimateParseError,
)
from backend.services.analytics_service import track_event


logger = get_logger(__name__)
router = APIRouter()

# ── IP-based rate limit store ────────────────────────────────
_rate_store: Dict[str, list[datetime]] = {}

ESTIMATE_RATE_LIMIT = 10          # per IP per window
ESTIMATE_RATE_WINDOW_SECONDS = 60


def _check_rate_limit(ip: str) -> tuple[bool, int]:
    """Returns (allowed, remaining). Mutates _rate_store."""
    key = f"estimator:{ip}"
    now = datetime.utcnow()
    cutoff = now - timedelta(seconds=ESTIMATE_RATE_WINDOW_SECONDS)

    timestamps = _rate_store.get(key, [])
    timestamps = [ts for ts in timestamps if ts > cutoff]
    _rate_store[key] = timestamps

    if len(timestamps) >= ESTIMATE_RATE_LIMIT:
        return False, 0

    timestamps.append(now)
    return True, ESTIMATE_RATE_LIMIT - len(timestamps)


@router.post(
    "/estimate",
    response_model=EstimateResponse,
    responses={
        422: {"description": "Invalid input"},
        429: {"description": "Rate limited"},
        503: {"description": "AI service error"},
    },
    tags=["estimator"],
)
async def estimate(request: Request, body: EstimateRequest):
    """
    Produce a structured project estimate.
    Returns complexity, timeline, stack, risks, and next steps.
    """
    ip = get_client_ip(request)
    allowed, _ = _check_rate_limit(ip)

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You're going a bit fast — please wait a moment before trying again.",
        )

    logger.info(
        f"Estimate request from {ip}, lang={body.language}, "
        f"chars={len(body.project_description)}"
    )

    try:
        service = get_estimator_service()
        result = service.estimate(
            project_description=body.project_description,
            language=body.language,
        )

        # Track analytics event
        track_event(
            event_type="estimator_use",
            metadata={"source_page": body.language},
        )

        return EstimateResponse(
            ok=True,
            complexity=result["complexity"],
            timeline=result["timeline"],
            stack=result["stack"],
            risks=result["risks"],
            next_steps=result["next_steps"],
            disclaimer=result.get(
                "disclaimer",
                "This estimate is indicative and subject to detailed scoping.",
            ),
        )

    except EstimateParseError as e:
        logger.warning(f"Estimator parse error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
