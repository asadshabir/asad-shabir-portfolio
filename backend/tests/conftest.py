"""
conftest.py — shared test fixtures.
"""
import os
from collections.abc import Generator
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

# Ensure test environment
os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("RESEND_API_KEY", "test_re_key")
os.environ.setdefault("GROQ_API_KEY", "test_gsk_key")


# ── Groq client mock ──────────────────────────────────────────


@pytest.fixture(autouse=True)
def mock_groq_client():
    """
    Mock Groq API calls in all tests.
    Patches are applied at multiple import locations to catch all callers.
    """
    mock_response = "[APPROVED]\n\nMocked response for testing."

    async def fake_chat(*args, **kwargs):
        return mock_response

    # Patch all import locations for chat_completion_text
    with patch("backend.services.groq_client.chat_completion_text", new=AsyncMock(side_effect=fake_chat)):
        with patch("backend.services.agent_repair.chat_completion_text", new=AsyncMock(side_effect=fake_chat)):
            with patch("backend.services.agent_router.chat_completion_text", new=AsyncMock(side_effect=fake_chat)):
                yield


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    """Create a test client for the FastAPI app."""
    # Import lazily to avoid module-level env issues
    from backend.api.index import app
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c