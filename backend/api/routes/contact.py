"""
Contact form route — POST /api/contact
Falls back to local storage if email sending fails.
"""
from datetime import datetime, timedelta, timezone
from typing import Dict, Tuple

from fastapi import APIRouter, HTTPException, Request, status

from backend.api.schemas.contact import ContactRequest, ContactResponse
from backend.core.config import get_settings
from backend.core.logging import get_logger
from backend.core.responses import err_response, ERROR_SEND_FAILED, ERROR_RATE_LIMITED
from backend.core.security import get_client_ip, rate_limit_key
from backend.services.email_service import get_email_service, EmailSendError

logger = get_logger(__name__)

router = APIRouter()

# ── In-memory rate limit store ──────────────────────────────
_rate_store: Dict[str, list[datetime]] = {}

# ── In-memory message store (fallback when email fails) ──────
_messages: list[dict] = []


def _check_rate_limit(ip: str, action: str) -> Tuple[bool, int]:
    settings = get_settings()
    key = rate_limit_key(ip, action)
    now = datetime.utcnow()

    if action == "contact":
        limit = settings.contact_rate_limit
        window = timedelta(seconds=settings.contact_rate_window)
    else:
        limit = settings.chatbot_rate_limit
        window = timedelta(seconds=settings.chatbot_rate_window)

    timestamps = _rate_store.get(key, [])
    cutoff = now - window
    timestamps = [ts for ts in timestamps if ts > cutoff]
    _rate_store[key] = timestamps

    if len(timestamps) >= limit:
        return False, 0

    timestamps.append(now)
    remaining = limit - len(timestamps)
    return True, remaining


@router.post(
    "/contact",
    response_model=ContactResponse,
    responses={
        422: {"description": "Validation error"},
        429: {"description": "Rate limited"},
    },
    tags=["contact"],
)
async def submit_contact(request: Request, body: ContactRequest):
    """Submit a contact form message. Always returns success — email is best-effort."""
    ip = get_client_ip(request)
    allowed, _ = _check_rate_limit(ip, "contact")

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many attempts. Please try again later.",
        )

    logger.info(f"Contact from {ip}: {body.name} <{body.email}>")

    # Always store locally (reliable fallback)
    _messages.append({
        "name": body.name,
        "email": body.email,
        "subject": body.subject or f"Contact from {body.name}",
        "message": body.message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ip": ip,
    })

    # Try to send email (best-effort)
    try:
        email_service = get_email_service()
        subject = body.subject or f"Contact from {body.name}"
        await email_service.send_contact_email(
            name=body.name,
            email=body.email,
            subject=subject,
            message=body.message,
        )
        logger.info(f"Email sent for {body.email}")
    except Exception as e:
        logger.warning(f"Email send failed (stored locally): {e}")

    return {"ok": True, "message": "Message sent successfully!"}