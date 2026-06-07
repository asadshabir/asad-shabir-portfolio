"""
Admin routes — GET /api/admin/analytics and GET /api/admin/subscribers/export
Protected by ANALYTICS_PASSWORD header.
"""
from fastapi import APIRouter, Header, HTTPException, status

from backend.core.config import get_settings
from backend.core.logging import get_logger
from backend.core.responses import err_response, ERROR_UNAUTHORIZED
from backend.services.analytics_service import (
    get_summary,
    get_recent_events,
    export_events_csv,
    export_subscribers_csv,
)


logger = get_logger(__name__)
router = APIRouter()


def _check_admin_auth(x_analytics_password: str | None) -> None:
    """Raise 401 if password doesn't match. Does NOT log passwords."""
    settings = get_settings()
    expected = getattr(settings, "analytics_password", None)

    if not expected:
        logger.warning("ANALYTICS_PASSWORD not set — admin endpoint disabled")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Analytics admin is not configured on the server.",
        )

    if not x_analytics_password or x_analytics_password != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin password.",
        )


@router.get(
    "/admin/analytics",
    tags=["admin"],
)
async def get_analytics(
    x_analytics_password: str | None = Header(None, alias="X-Analytics-Password"),
):
    """
    Return aggregate analytics summary. Requires X-Analytics-Password header.
    """
    _check_admin_auth(x_analytics_password)

    logger.info("Admin analytics accessed")
    summary = get_summary()
    recent = get_recent_events(limit=100)

    return {
        "ok": True,
        "data": summary,
        "recent_events": recent,
    }


@router.get(
    "/admin/subscribers/export",
    tags=["admin"],
)
async def export_subscribers(
    x_analytics_password: str | None = Header(None, alias="X-Analytics-Password"),
):
    """
    Export all subscribers as a CSV file. Requires X-Analytics-Password header.
    """
    _check_admin_auth(x_analytics_password)

    logger.info("Admin subscriber export accessed")
    csv_content = export_subscribers_csv()

    return {
        "ok": True,
        "data": csv_content,
    }
