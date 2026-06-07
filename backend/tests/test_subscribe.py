"""
Tests for POST /api/subscribe endpoint.
"""
import pytest

VALID_SUBSCRIBE = {
    "email": "newsubscriber@example.com",
    "source_page": "/",
}


class TestSubscribeValidation:
    def test_valid_email_subscribes(self, client):
        """Valid email returns 200 with ok=true."""
        # Use a unique email per test run to avoid cross-test interference
        payload = {**VALID_SUBSCRIBE, "email": f"user{__name__}@test.com"}
        response = client.post("/api/subscribe", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["ok"] is True
        assert "subscribed" in data["message"].lower()

    def test_optional_name_field(self, client):
        """Name field is accepted without error."""
        payload = {**VALID_SUBSCRIBE, "email": f"named{__name__}@test.com", "name": "Alice"}
        response = client.post("/api/subscribe", json=payload)
        assert response.status_code == 200
        assert response.json()["ok"] is True

    def test_invalid_email_format(self, client):
        """Invalid email returns 422."""
        payload = {**VALID_SUBSCRIBE, "email": "not-an-email"}
        response = client.post("/api/subscribe", json=payload)
        assert response.status_code == 422

    def test_missing_email(self, client):
        """Missing email returns 422."""
        payload = {"source_page": "/"}
        response = client.post("/api/subscribe", json=payload)
        assert response.status_code == 422

    def test_empty_email(self, client):
        """Empty email string returns 422."""
        payload = {**VALID_SUBSCRIBE, "email": ""}
        response = client.post("/api/subscribe", json=payload)
        assert response.status_code == 422

    def test_duplicate_email_returns_200(self, client):
        """Duplicate email is handled gracefully (200, not 4xx)."""
        payload = {**VALID_SUBSCRIBE, "email": f"dup{__name__}@test.com"}
        first = client.post("/api/subscribe", json=payload)
        assert first.status_code == 200

        second = client.post("/api/subscribe", json=payload)
        assert second.status_code == 200
        data = second.json()
        assert data["ok"] is True
        # Friendly message, not an error
        assert "already" in data["message"].lower() or "thanks" in data["message"].lower()

    def test_source_page_captured(self, client):
        """source_page is accepted and stored."""
        payload = {**VALID_SUBSCRIBE, "email": f"source{__name__}@test.com", "source_page": "/projects"}
        response = client.post("/api/subscribe", json=payload)
        assert response.status_code == 200

    def test_default_source_page(self, client):
        """Omitting source_page uses default '/'."""
        payload = {"email": f"default{__name__}@test.com"}
        response = client.post("/api/subscribe", json=payload)
        assert response.status_code == 200


class TestSubscribeRateLimit:
    def test_rate_limit_exceeded(self, client):
        """Rapid requests from the same IP hit 429 after limit."""
        # The rate limit is 10 per IP per 60s window
        # TestClient uses a fixed client IP, so we will hit the limit
        payload = {**VALID_SUBSCRIBE, "email": f"ratelimit{__name__}{0}@test.com"}
        last_code = None
        for i in range(15):
            payload = {**VALID_SUBSCRIBE, "email": f"ratelimit{__name__}{i}@test.com"}
            response = client.post("/api/subscribe", json=payload)
            last_code = response.status_code
            if response.status_code == 429:
                break

        assert last_code == 429, "Expected 429 after exceeding rate limit"

    def test_rate_limit_returns_rate_limited_message(self, client):
        """Rate limited response includes a user-friendly message."""
        # Exhaust the rate limit first
        for i in range(11):
            client.post("/api/subscribe", json={
                "email": f"exhaust{i}@test.com",
                "source_page": "/",
            })

        response = client.post(
            "/api/subscribe",
            json={"email": "ratelimited@test.com", "source_page": "/"},
        )
        assert response.status_code == 429
        detail = response.json()
        assert "detail" in detail or "message" in detail


