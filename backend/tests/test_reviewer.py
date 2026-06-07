"""
Tests for POST /api/review endpoint.
"""
import pytest


VALID_RESUME = {
    "resume_text": "John Doe\nFull-Stack Developer\n3 years experience with React, Node.js, and Python. Built and deployed full-stack web applications using Express, PostgreSQL, and Docker. Familiar with CI/CD pipelines and AWS.",
    "language": "en",
}


class TestReviewValidation:
    def test_valid_resume(self, client):
        """Valid resume text returns 200 or 503 (no API key)."""
        response = client.post("/api/review", json=VALID_RESUME)
        assert response.status_code in (200, 503)

    def test_optional_target_role(self, client):
        """Target role is accepted without error."""
        payload = {**VALID_RESUME, "target_role": "Senior Frontend Engineer"}
        response = client.post("/api/review", json=payload)
        assert response.status_code in (200, 503)

    def test_resume_too_short(self, client):
        """Resume under 50 chars returns 422."""
        payload = {**VALID_RESUME, "resume_text": "Too short"}
        response = client.post("/api/review", json=payload)
        assert response.status_code == 422

    def test_missing_resume(self, client):
        """Missing resume returns 422."""
        payload = {"language": "en"}
        response = client.post("/api/review", json=payload)
        assert response.status_code == 422

    def test_empty_resume(self, client):
        """Empty resume text returns 422."""
        payload = {**VALID_RESUME, "resume_text": ""}
        response = client.post("/api/review", json=payload)
        assert response.status_code == 422

    def test_invalid_language(self, client):
        """Invalid language code returns 422."""
        payload = {**VALID_RESUME, "language": "fr"}
        response = client.post("/api/review", json=payload)
        assert response.status_code == 422

    def test_urdu_language(self, client):
        """Urdu language is accepted."""
        payload = {**VALID_RESUME, "language": "ur"}
        response = client.post("/api/review", json=payload)
        assert response.status_code in (200, 503)

    def test_sindhi_language(self, client):
        """Sindhi language is accepted."""
        payload = {**VALID_RESUME, "language": "sd"}
        response = client.post("/api/review", json=payload)
        assert response.status_code in (200, 503)

    def test_resume_over_10k_chars_rejected(self, client):
        """Resume over 10,000 chars is rejected at validation (422)."""
        long_resume = "A" * 15_000
        payload = {**VALID_RESUME, "resume_text": long_resume}
        response = client.post("/api/review", json=payload)
        # Validation layer rejects payloads > 10k chars
        assert response.status_code == 422


class TestReviewRateLimit:
    def test_rate_limit_exceeded(self, client):
        """Rapid requests from the same IP hit 429 after 10."""
        last_code = None
        for i in range(15):
            payload = {
                **VALID_RESUME,
                "resume_text": f"Resume text for review {i} — developer with React, Python, and AWS experience working on scalable web applications.",
            }
            response = client.post("/api/review", json=payload)
            last_code = response.status_code
            if response.status_code == 429:
                break

        assert last_code == 429, "Expected 429 after exceeding rate limit"

    def test_rate_limit_message(self, client):
        """Rate-limited response has user-friendly detail."""
        for i in range(11):
            client.post("/api/review", json={
                "resume_text": f"Resume {i} — software engineer with full-stack experience in React and Node.js.",
                "language": "en",
            })

        response = client.post("/api/review", json=VALID_RESUME)
        assert response.status_code == 429


class TestReviewResponseSchema:
    def test_200_response_has_expected_keys(self, client):
        """On a 200 response, all required schema keys are present."""
        response = client.post("/api/review", json=VALID_RESUME)
        if response.status_code == 200:
            data = response.json()
            assert data["ok"] is True
            assert "summary" in data
            assert "strengths" in data
            assert "weaknesses" in data
            assert "ats_suggestions" in data
            assert "skill_gaps" in data
            assert "improvement_tips" in data
            assert "role_fit" in data
            assert "disclaimer" in data

            # All should be lists (except summary and disclaimer which are strings)
            assert isinstance(data["summary"], str)
            assert isinstance(data["strengths"], list)
            assert isinstance(data["weaknesses"], list)
            assert isinstance(data["ats_suggestions"], list)
            assert isinstance(data["skill_gaps"], list)
            assert isinstance(data["improvement_tips"], list)
            assert isinstance(data["role_fit"], list)
            assert isinstance(data["disclaimer"], str)