"""
Health check route — /api/health
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health():
    """Lightweight health check for monitoring."""
    return {"status": "ok"}
