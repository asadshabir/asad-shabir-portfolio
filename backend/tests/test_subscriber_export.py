"""
Admin subscriber export tests.
"""
import pytest


class TestSubscriberExport:
    def test_export_returns_503_when_password_not_configured(self):
        """
        When ANALYTICS_PASSWORD is not set, the endpoint returns 503.
        This test patches the settings to simulate unconfigured state.
        """
        from unittest.mock import patch
        from backend.api.index import app
        from fastapi.testclient import TestClient

        # Simulate unconfigured analytics by patching get_settings
        mock_settings = type("MockSettings", (), {"analytics_password": None})()
        with patch("backend.api.routes.admin.get_settings", return_value=mock_settings):
            with TestClient(app, raise_server_exceptions=False) as c:
                response = c.get("/api/admin/subscribers/export")
                assert response.status_code == 503

    def test_export_returns_401_with_wrong_password(self):
        """
        When ANALYTICS_PASSWORD is set but a wrong password is provided, return 401.
        """
        import os
        from backend.api.index import app
        from fastapi.testclient import TestClient

        # Set and clear settings cache so the new env var is picked up
        os.environ["ANALYTICS_PASSWORD"] = "correct-secret"

        # Clear lru_cache so new env var is picked up
        from backend.core.config import get_settings
        get_settings.cache_clear()

        try:
            with TestClient(app, raise_server_exceptions=False) as c:
                response = c.get(
                    "/api/admin/subscribers/export",
                    headers={"X-Analytics-Password": "wrong-password"},
                )
                assert response.status_code == 401
        finally:
            get_settings.cache_clear()
            os.environ.pop("ANALYTICS_PASSWORD", None)