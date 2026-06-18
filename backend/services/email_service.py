"""
Email service — sends emails via Resend API AND Gmail SMTP.
- Resend: used for contact form submissions (visitor → Asad)
- Gmail SMTP: used by chatbot to send emails FROM Asad TO visitors
  (resume delivery, file sharing, etc.)
"""
import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

import httpx
from backend.core.logging import get_logger

logger = get_logger(__name__)


class EmailSendError(Exception):
    """Raised when email sending fails."""
    pass


class EmailService:
    """Sends emails via Resend API (contact form) or Gmail SMTP (chatbot delivery)."""

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

    async def send_email_to_recipient(
        self,
        recipient_email: str,
        subject: str,
        body_text: str,
    ) -> bool:
        """Send an email FROM Asad's Gmail TO a recipient via SMTP.

        Used by the chatbot for actions like:
        - Sending resumes to visitors
        - Sending project info on request
        - Any "send me X to my email" request

        Falls back to Resend if Gmail SMTP is unavailable.
        """
        gmail_user = os.getenv("GMAIL_EMAIL", "")
        gmail_pass = os.getenv("GMAIL_APP_PASSWORD", "")

        if not gmail_user or not gmail_pass:
            logger.warning("Gmail SMTP not configured, falling back to Resend")
            return await self._send_via_resend_fallback(recipient_email, subject, body_text)

        try:
            msg = MIMEMultipart()
            msg["From"] = gmail_user
            msg["To"] = recipient_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body_text, "plain", "utf-8"))

            context = ssl.create_default_context()
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                server.login(gmail_user, gmail_pass)
                server.sendmail(gmail_user, recipient_email, msg.as_string())

            logger.info(f"Gmail SMTP email sent to {recipient_email}: {subject}")
            return True
        except smtplib.SMTPAuthenticationError:
            logger.error("Gmail SMTP authentication failed — falling back to Resend")
            return await self._send_via_resend_fallback(recipient_email, subject, body_text)
        except smtplib.SMTPException as e:
            logger.error(f"Gmail SMTP error: {e}")
            raise EmailSendError(f"Failed to send email via Gmail: {e}")
        except Exception as e:
            logger.error(f"Email send error: {e}")
            raise EmailSendError(str(e))

    async def _send_via_resend_fallback(
        self,
        recipient_email: str,
        subject: str,
        body_text: str,
    ) -> bool:
        """Fallback: send via Resend when Gmail SMTP is unavailable."""
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
                        "to": [recipient_email],
                        "subject": subject,
                        "text": body_text,
                    },
                    timeout=15,
                )
                if response.status_code >= 400:
                    logger.error(f"Resend fallback error: {response.status_code}")
                    raise EmailSendError(f"Resend fallback returned {response.status_code}")
                logger.info(f"Resend fallback email sent to {recipient_email}")
                return True
        except httpx.RequestError as e:
            logger.error(f"Resend fallback failed: {e}")
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
