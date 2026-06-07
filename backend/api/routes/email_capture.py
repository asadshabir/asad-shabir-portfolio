"""
Email capture route — POST /api/subscribe
"""
from datetime import datetime, timedelta
from typing import Dict

from fastapi import APIRouter, HTTPException, Request, status

from backend.api.schemas.subscriber import SubscribeRequest, SubscribeResponse
from backend.core.config import get_settings
from backend.core.logging import get_logger
from backend.core.responses import err_response
from backend.core.security import get_client_ip, rate_limit_key
from backend.services.analytics_service import add_subscriber


logger = get_logger(__name__)
router = APIRouter()

# ── Rate limit store ──────────────────────────────────────────
_rate_store: Dict[str, list[datetime]] = {}

EMAIL_RATE_LIMIT = 10  # per IP per window
EMAIL_RATE_WINDOW_SECONDS = 60


def _check_email_rate_limit(ip: str) -> tuple[bool, int]:
    """Returns (allowed, remaining). Mutates _rate_store."""
    key = f"email_capture:{ip}"
    now = datetime.utcnow()
    cutoff = now - timedelta(seconds=EMAIL_RATE_WINDOW_SECONDS)

    timestamps = _rate_store.get(key, [])
    timestamps = [ts for ts in timestamps if ts > cutoff]
    _rate_store[key] = timestamps

    if len(timestamps) >= EMAIL_RATE_LIMIT:
        return False, 0

    timestamps.append(now)
    return True, EMAIL_RATE_LIMIT - len(timestamps)


@router.post(
    "/subscribe",
    response_model=SubscribeResponse,
    responses={
        422: {"description": "Invalid email"},
        429: {"description": "Rate limited"},
        500: {"description": "Server error"},
    },
    tags=["email"],
)
async def subscribe(request: Request, body: SubscribeRequest):
    """
    Capture an email subscriber.
    10 requests per IP per rolling 60-second window.
    Duplicates return 'Already subscribed.' (200, not 400).
    """
    ip = get_client_ip(request)
    allowed, _ = _check_email_rate_limit(ip)

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You're going a bit fast — please try again in a minute.",
        )

    logger.info(
        f"Subscribe attempt: {body.email} from {body.source_page}"
        + (f" (name: {body.name})" if body.name else "")
    )

    # Add to subscriber store (dedup handled inside)
    new_subscriber = add_subscriber(
        email=body.email.strip().lower(),
        source_page=body.source_page,
    )

    if not new_subscriber:
        # Already subscribed — return 200 with friendly message, not error
        return SubscribeResponse(
            ok=True,
            message="Already subscribed. Thanks for your interest!",
        )

    return SubscribeResponse(
        ok=True,
        message="You're subscribed! I'll share updates and insights as I build things.",
    )