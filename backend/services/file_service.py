"""
File service — resolves paths to static assets (resume PDF).
"""
import os
from pathlib import Path
from fastapi import HTTPException, status

from backend.core.responses import err_response, ERROR_NOT_FOUND

RESUME_CANONICAL = "Asad_Shabir_Developer.pdf"


def get_resume_path() -> str:
    """
    Resolve the resume PDF path.
    Checks multiple locations for flexibility.
    """
    # Possible locations (checked in order)
    candidates = [
        Path("public") / RESUME_CANONICAL,
        Path(".") / "public" / RESUME_CANONICAL,
        Path("..") / "public" / RESUME_CANONICAL,
    ]

    # Also check from backend/ directory
    backend_dir = Path("backend")
    if backend_dir.exists():
        candidates.append(backend_dir / ".." / "public" / RESUME_CANONICAL)

    for candidate in candidates:
        if candidate.exists():
            return str(candidate.resolve())

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=err_response(ERROR_NOT_FOUND, "Resume file not found."),
    )
