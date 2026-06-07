"""
Backend configuration — reads from environment variables.
All secrets come from .env (local) or Vercel dashboard (production).
Never hardcoded here.
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Server ────────────────────────────────────────────
    environment: Literal["development", "production"] = Field(
        default="development",
        validation_alias="ENVIRONMENT",
    )
    frontend_url: str = Field(
        default="http://localhost:5173",
        validation_alias="FRONTEND_URL",
    )
    version: str = "1.0.0"

    # ── Email (Resend) ───────────────────────────────────
    resend_api_key: str = Field(validation_alias="RESEND_API_KEY")
    resend_from_email: str = Field(
        default="contact@asadshabir.com",
        validation_alias="RESEND_FROM_EMAIL",
    )
    resend_to_email: str = Field(
        default="asadshabir505@gmail.com",
        validation_alias="MAIL_TO",
    )

    # ── AI Services (Gemini — primary) ────────────────────
    gemini_api_key: str = Field(validation_alias="GEMINI_API_KEY")
    gemini_model: str = Field(
        default="gemini-2.0-flash",
        validation_alias="GEMINI_MODEL",
    )

    # ── AI Services (Groq — fallback) ─────────────────────
    groq_api_key: str = Field(validation_alias="GROQ_API_KEY")
    groq_model: str = Field(
        default="llama-3.3-70b-versatile",
        validation_alias="GROQ_MODEL",
    )

    # ── Rate Limiting ────────────────────────────────────
    contact_rate_limit: int = Field(default=5, validation_alias="CONTACT_RATE_LIMIT")
    contact_rate_window: int = Field(
        default=3600, validation_alias="CONTACT_RATE_WINDOW"
    )
    chatbot_rate_limit: int = Field(default=10, validation_alias="CHATBOT_RATE_LIMIT")
    chatbot_rate_window: int = Field(
        default=600, validation_alias="CHATBOT_RATE_WINDOW"
    )

    # ── Analytics ─────────────────────────────────────────
    analytics_password: str | None = Field(
        default=None,
        validation_alias="ANALYTICS_PASSWORD",
    )

    # ── CORS ─────────────────────────────────────────────
    @property
    def cors_origins(self) -> list[str]:
        origins = [self.frontend_url, "https://asadshabir.com"]
        if self.environment == "development":
            origins.append("http://localhost:5173")
        return origins

    # ── Debug helpers ────────────────────────────────────
    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def is_development(self) -> bool:
        return self.environment == "development"


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings singleton."""
    return Settings()
