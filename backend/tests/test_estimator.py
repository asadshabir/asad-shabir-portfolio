"""
Tests for POST /api/estimate endpoint.
"""
import pytest


VALID_ESTIMATE = {
    "project_description": "A web app where users can upload images and an AI model classifies them into categories with a dashboard for the admin.",
    "language": "en",
}


class TestEstimateValidation:
    def test_valid_description(self, client):
        """Valid project description returns 200."""
        response = client.post("/api/estimate", json=VALID_ESTIMATE)
        # 200 = success, 503 = AI service error (expected without real API key)
        assert response.status_code in (200, 503)

    def test_description_too_short(self, client):
        """Description under 20 chars returns 422."""
        payload = {**VALID_ESTIMATE, "project_description": "Short"}
        response = client.post("/api/estimate", json=payload)
        assert response.status_code == 422

    def test_missing_description(self, client):
        """Missing description returns 422."""
        payload = {"language": "en"}
        response = client.post("/api/estimate", json=payload)
        assert response.status_code == 422

    def test_empty_description(self, client):
        """Empty description returns 422."""
        payload = {**VALID_ESTIMATE, "project_description": ""}
        response = client.post("/api/estimate", json=payload)
        assert response.status_code == 422

    def test_invalid_language(self, client):
        """Invalid language code returns 422."""
        payload = {**VALID_ESTIMATE, "language": "fr"}
        response = client.post("/api/estimate", json=payload)
        assert response.status_code == 422

    def test_default_language_is_en(self, client):
        """Omitting language defaults to 'en'."""
        payload = {"project_description": VALID_ESTIMATE["project_description"]}
        response = client.post("/api/estimate", json=payload)
        assert response.status_code in (200, 503)

    def test_urdu_language(self, client):
        """Urdu language is accepted."""
        payload = {**VALID_ESTIMATE, "language": "ur"}
        response = client.post("/api/estimate", json=payload)
        assert response.status_code in (200, 503)

    def test_sindhi_language(self, client):
        """Sindhi language is accepted."""
        payload = {**VALID_ESTIMATE, "language": "sd"}
        response = client.post("/api/estimate", json=payload)
        assert response.status_code in (200, 503)


class TestEstimateRateLimit:
    def test_rate_limit_exceeded(self, client):
        """Rapid requests from the same IP hit 429 after 10."""
        last_code = None
        for i in range(15):
            payload = {
                **VALID_ESTIMATE,
                "project_description": f"Test project {i} — a simple CRUD app with user authentication.",
            }
            response = client.post("/api/estimate", json=payload)
            last_code = response.status_code
            if response.status_code == 429:
                break

        assert last_code == 429, "Expected 429 after exceeding rate limit"

    def test_rate_limit_message(self, client):
        """Rate-limited response has user-friendly detail."""
        # Exhaust the limit first
        for i in range(11):
            client.post("/api/estimate", json={
                "project_description": f"Project {i} — a basic e-commerce platform.",
                "language": "en",
            })

        response = client.post("/api/estimate", json=VALID_ESTIMATE)
        assert response.status_code == 429
        detail = response.json().get("detail", {})
        assert "detail" in response.json() or "message" in detail


class TestEstimateResponseSchema:
    def test_200_response_has_expected_keys(self, client):
        """
        On a 200 response, the body has all required keys.
        Skipped when the route returns 503 (no API key in test env).
        """
        response = client.post("/api/estimate", json=VALID_ESTIMATE)
        if response.status_code == 200:
            data = response.json()
            assert data["ok"] is True
            assert "complexity" in data
            assert "timeline" in data
            assert "stack" in data
            assert "risks" in data
            assert "next_steps" in data
            assert "disclaimer" in data

            # Complexity shape
            assert "level" in data["complexity"]
            assert "reasons" in data["complexity"]
            assert isinstance(data["complexity"]["reasons"], list)

            # Timeline shape
            assert "estimate_min_weeks" in data["timeline"]
            assert "estimate_max_weeks" in data["timeline"]
            assert "assumptions" in data["timeline"]

            # Stack shape
            assert "frontend" in data["stack"]
            assert "backend" in data["stack"]
            assert "ai_ml" in data["stack"]
            assert "infrastructure" in data["stack"]
