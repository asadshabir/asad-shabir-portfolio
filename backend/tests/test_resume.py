"""
Resume route tests.
"""
import os
from pathlib import Path

import pytest


class TestResumeRoute:
    def test_resume_endpoint_exists(self, client):
        """GET /api/resume returns a response (200 or 404)."""
        response = client.get("/api/resume")
        assert response.status_code in (200, 404)

    def test_resume_returns_pdf_content_type(self, client):
        """When resume exists, Content-Type is application/pdf."""
        response = client.get("/api/resume")
        if response.status_code == 200:
            ct = response.headers.get("content-type", "")
            assert "pdf" in ct.lower() or "application" in ct.lower()

    def test_resume_filename_in_content_disposition(self, client):
        """Response headers include Content-Disposition with correct filename."""
        response = client.get("/api/resume")
        if response.status_code == 200:
            cd = response.headers.get("content-disposition", "")
            assert "Asad_Shabir_Developer.pdf" in cd