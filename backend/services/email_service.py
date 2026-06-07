"""
Email service — sends contact form submissions via Resend API.
"""
import os
from typing import Optional
import httpx
from backend.core.logging import get_logger

logger = get_logger(__name__)


class EmailSendError(Exception):
    """Raised when email sending fails."""
    pass


class EmailService:
    """Sends emails via Resend API."""

    def __init__(self, api_key: str, from_email: str, to_email: str):
        self.api_key = api_key
        self.from_email = from_email
        self.to_email = to_email
        self.api_url = "https://api.resend.com/emails"

    async def send_contact_email(
        self,
        name: str,
        email: str,
        subject: str,
        message: str,
    ) -> bool:
        """Send a contact form email via Resend (async)."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.api_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": self.from_email,
                        "to": [self.to_email],
                        "subject": f"[Portfolio Contact] {subject}",
                        "reply_to": email,
                        "text": f"From: {name} ({email})\n\n{message}",
                    },
                    timeout=15,
                )
                if response.status_code >= 400:
                    logger.error(f"Resend API error: {response.status_code} {response.text[:200]}")
                    raise EmailSendError(f"Email service returned {response.status_code}")
                logger.info(f"Contact email sent from {email}")
                return True
        except httpx.RequestError as e:
            logger.error(f"Email send failed: {e}")
            raise EmailSendError(str(e))


_service: Optional[EmailService] = None


def get_email_service() -> EmailService:
    """Get or create singleton email service."""
    global _service
    if _service is None:
        api_key = os.getenv("RESEND_API_KEY", "")
        from_email = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
        to_email = os.getenv("RESEND_TO_EMAIL", "asadshabir505@gmail.com")
        _service = EmailService(api_key=api_key, from_email=from_email, to_email=to_email)
    return _service
