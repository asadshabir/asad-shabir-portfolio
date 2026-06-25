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


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    """Create a test client for the FastAPI app."""
    from backend.api.index import app
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c
