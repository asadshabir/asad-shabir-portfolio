"""
Standardised API response helpers.
All responses follow a consistent shape so the frontend can handle them uniformly.
"""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field


T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Wrap all successful API responses."""

    ok: bool = True
    data: T | None = None
    meta: dict[str, Any] = Field(default_factory=dict)



class ErrorResponse(BaseModel):
    """Wrap all error responses."""

    ok: bool = False
    code: str
    message: str
    details: list[dict[str, Any]] | None = None


# ── Factory helpers ──────────────────────────────────────────


def ok_response(data: T = None, **meta: Any) -> dict[str, Any]:
    return ApiResponse[T](data=data, meta=meta).model_dump(exclude_none=True)


def err_response(
    code: str,
    message: str,
    details: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    return ErrorResponse(code=code, message=message, details=details).model_dump()


# ── Common error codes ────────────────────────────────────────

ERROR_BAD_REQUEST = "BAD_REQUEST"
ERROR_VALIDATION = "VALIDATION_ERROR"
ERROR_RATE_LIMITED = "RATE_LIMITED"
ERROR_NOT_FOUND = "NOT_FOUND"
ERROR_SEND_FAILED = "SEND_FAILED"
ERROR_SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
ERROR_INTERNAL = "INTERNAL_ERROR"
ERROR_UNAUTHORIZED = "UNAUTHORIZED"
ERROR_UNAUTHORIZED = "UNAUTHORIZED"
