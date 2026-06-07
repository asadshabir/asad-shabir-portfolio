"""
FastAPI entrypoint — mounts all route modules.
Compatible with uvicorn (local dev) and Vercel Python runtime.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.core.config import get_settings
from backend.core.logging import configure_logging, get_logger

# Configure logging
configure_logging()
logger = get_logger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Settings
settings = get_settings()


def create_app() -> FastAPI:
    """Factory — creates and configures the FastAPI application."""
    app = FastAPI(
        title="Asad Shabir Portfolio API",
        version=settings.version,
        description="Backend API for the Asad Shabir portfolio.",
    )

    # Rate limiter state
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )

    # Health route (no router needed)
    @app.get("/api/health", tags=["health"])
    async def health_check():
        return {
            "status": "ok",
            "version": settings.version,
            "environment": settings.environment,
        }

    # Mount route modules
    from backend.api.routes import contact, resume, health, analytics, admin, email_capture, estimator, reviewer, profile

    app.include_router(health.router, prefix="/api", tags=["health"])
    app.include_router(contact.router, prefix="/api", tags=["contact"])
    app.include_router(profile.router, prefix="/api", tags=["profile"])
    app.include_router(resume.router, prefix="/api", tags=["resume"])
    app.include_router(analytics.router, prefix="/api", tags=["analytics"])
    app.include_router(admin.router, prefix="/api", tags=["admin"])
    app.include_router(email_capture.router, prefix="/api", tags=["email"])
    app.include_router(estimator.router, prefix="/api", tags=["estimator"])
    app.include_router(reviewer.router, prefix="/api", tags=["reviewer"])

    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "ok": False,
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred.",
            },
        )

    return app


# Vercel entrypoint (uses `app` as the export name)
app = create_app()
