"""
Security helpers: sanitisation, IP extraction, prompt-injection stripping.
"""

from __future__ import annotations

import re
import html
from typing import Any


# ── HTML / script sanitisation ──────────────────────────────


def strip_html(value: str) -> str:
    """Remove HTML tags from a string."""
    return re.sub(r"<[^>]+>", "", value)


def escape_html(value: str) -> str:
    """Escape HTML entities in a string."""
    return html.escape(value, quote=True)


def sanitise_input(value: str, max_length: int = 2000) -> str:
    """
    Full sanitisation pipeline:
    1. Strip HTML tags
    2. Strip leading/trailing whitespace
    3. Truncate to max_length
    4. Escape remaining HTML entities
    """
    value = strip_html(value)
    value = value.strip()
    if len(value) > max_length:
        value = value[:max_length]
    return escape_html(value)


# ── Prompt injection detection ───────────────────────────────


_INJECT_PATTERNS = [
    re.compile(r"```[\s\S]*?```"),  # code fences
    re.compile(r"~~[\s\S]*?~~"),  # strikethrough code fences
    re.compile(r"\{\{[\s\S]*?\}\}"),  # template syntax
    re.compile(r"\[\[([^\]]+)\]\]"),  # double-bracket
    re.compile(r"\{%[\s\S]*?%\}"),  # Jinja/Django
    re.compile(r"INST:|SYSTEM:|INSTRUCTIONS:|You are a", re.IGNORECASE),
    re.compile(r"// You are|/# You are"),  # comment-prefixed overrides
    re.compile(r"<script[\s\S]*?</script>", re.IGNORECASE),  # script injection
    re.compile(r"javascript:"),  # URL protocol injection
]


def looks_like_injection(text: str) -> bool:
    """Return True if text matches any known injection pattern."""
    for pattern in _INJECT_PATTERNS:
        if pattern.search(text):
            return True
    return False


def strip_injection_attempts(text: str) -> str:
    """Remove known injection patterns from user input."""
    for pattern in _INJECT_PATTERNS:
        text = pattern.sub("", text)
    return text.strip()


# ── IP extraction ─────────────────────────────────────────────


def get_client_ip(request: Any) -> str:
    """Extract the real client IP from a FastAPI request."""
    # Vercel / Netlify proxy
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip
    # Direct connection
    if request.client:
        return request.client.host
    return "unknown"


# ── Rate limit key helper ─────────────────────────────────────


def rate_limit_key(ip: str, action: str) -> str:
    """Generate a rate-limit cache key."""
    return f"rl:{action}:{ip}"
