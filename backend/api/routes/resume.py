"""
Resume download route — GET /api/resume
"""
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from backend.core.logging import get_logger
from backend.core.responses import err_response, ERROR_NOT_FOUND, ERROR_INTERNAL
from backend.services.file_service import get_resume_path, RESUME_CANONICAL

logger = get_logger(__name__)

router = APIRouter()


@router.get(
    "/resume",
    responses={
        200: {
            "description": "Resume PDF download",
            "content": {"application/pdf": {}},
        },
        404: {"description": "Resume not found"},
        500: {"description": "Server error"},
    },
    tags=["resume"],
)
async def download_resume():
    """
    Serve the resume PDF as a direct download attachment.
    Primary approach: static file link.
    This endpoint exists for analytics/tracking hooks.
    """
    try:
        path = get_resume_path()
        logger.info(f"Serving resume: {path}")
        return FileResponse(
            path,
            media_type="application/pdf",
            filename=RESUME_CANONICAL,
            headers={
                "Content-Disposition": f'attachment; filename="{RESUME_CANONICAL}"',
                "Cache-Control": "public, max-age=3600",
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Resume serve error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=err_response(ERROR_INTERNAL, "Failed to serve resume."),
        )