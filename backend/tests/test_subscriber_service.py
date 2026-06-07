"""
Unit tests for subscriber normalization in analytics_service.
These run in isolation so they don't inherit the module-scoped rate-limit state.
"""
import pytest
from backend.services.analytics_service import add_subscriber, _subscribers


class TestSubscriberNormalization:
    """Unit tests for email normalization — no HTTP, no rate limits."""

    def teardown_method(self):
        # Reset subscriber store between tests
        _subscribers.clear()

    def test_email_stored_lowercase(self):
        result = add_subscriber(email="Test@EXAMPLE.COM", source_page="/")
        assert result is True
        assert _subscribers[-1]["email"] == "test@example.com"

    def test_email_whitespace_trimmed(self):
        result = add_subscriber(email="  spaced@domain.com  ", source_page="/")
        assert result is True
        assert _subscribers[-1]["email"] == "spaced@domain.com"

    def test_duplicate_detection_case_insensitive(self):
        first = add_subscriber(email="alice@EXAMPLE.com", source_page="/")
        assert first is True

        second = add_subscriber(email="ALICE@example.com", source_page="/")
        assert second is False

        # Only one entry exists
        assert len(_subscribers) == 1
        assert _subscribers[0]["email"] == "alice@example.com"