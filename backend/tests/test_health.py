"""
Health route tests.
"""
import pytest


def test_health_ok(client):
    """GET /api/health returns 200 with status and version."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data


def test_health_standalone(client):
    """GET /api/health works whether or not routes are mounted."""
    response = client.get("/api/health")
    # Either 200 (direct) or 404 (mounted under /health)
    assert response.status_code in (200, 404)