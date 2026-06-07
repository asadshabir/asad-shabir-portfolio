"""
In-memory analytics tracking and subscriber management.
Events are stored in-memory (no database). FIFO eviction at 50k events.
Subscribers stored in-memory with dedup by lowercase email.
"""
from datetime import datetime, timezone
from typing import Any, Optional
import csv
import io

from backend.core.logging import get_logger

logger = get_logger(__name__)

# ── Valid event types ───────────────────────────────────────────
VALID_EVENT_TYPES: set[str] = {
    "resume_download",
    "contact_submission",
    "chatbot_session",
    "cta_click",
    "estimator_use",
    "reviewer_use",
    "email_capture",
}

# ── In-memory storage ───────────────────────────────────────────
MAX_EVENTS = 50000
MAX_SUBSCRIBERS = 10000

_events: list[dict[str, Any]] = []
_subscribers: list[dict[str, Any]] = []
_seen_emails: set[str] = set()  # lowercase dedup set


# ── Event tracking ──────────────────────────────────────────────
def track_event(
    event_type: str,
    metadata: Optional[dict[str, Any]] = None,
    visitor_email: Optional[str] = None,
) -> dict[str, Any]:
    """
    Record an analytics event in memory.

    Returns the stored event dict.
    FIFO eviction when MAX_EVENTS is exceeded.
    """
    event: dict[str, Any] = {
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metadata": metadata or {},
        "visitor_email": visitor_email,
    }
    _events.append(event)

    # FIFO eviction
    if len(_events) > MAX_EVENTS:
        _events.pop(0)

    logger.debug(f"Tracked event: {event_type}")
    return event


# ── Subscriber management ───────────────────────────────────────
def add_subscriber(
    email: str,
    source_page: str = "/",
    name: Optional[str] = None,
) -> bool:
    """
    Add a new subscriber. Returns True if new, False if duplicate.
    Email is normalized to lowercase and trimmed.
    """
    normalized = email.strip().lower()

    if normalized in _seen_emails:
        logger.debug(f"Duplicate subscriber: {normalized}")
        return False

    subscriber: dict[str, Any] = {
        "email": normalized,
        "source_page": source_page,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if name:
        subscriber["name"] = name.strip()

    _subscribers.append(subscriber)
    _seen_emails.add(normalized)

    # FIFO eviction
    if len(_subscribers) > MAX_SUBSCRIBERS:
        old = _subscribers.pop(0)
        _seen_emails.discard(old["email"])

    logger.info(f"New subscriber: {normalized}")
    return True


def is_subscribed(email: str) -> bool:
    """Check if an email is already subscribed (case-insensitive)."""
    return email.strip().lower() in _seen_emails


def get_all_subscribers() -> list[dict[str, Any]]:
    """Return all stored subscribers (newest first)."""
    return list(reversed(_subscribers))


# ── Analytics queries ──────────────────────────────────────────
def get_summary() -> dict[str, Any]:
    """Return aggregated counts for all event types."""
    counts: dict[str, int] = {event_type: 0 for event_type in VALID_EVENT_TYPES}
    total = 0

    for event in _events:
        et = event.get("event_type", "")
        if et in counts:
            counts[et] += 1
        total += 1

    return {
        "total_events": total,
        "total_subscribers": len(_subscribers),
        "counts": counts,
    }


def get_recent_events(limit: int = 50) -> list[dict[str, Any]]:
    """Return most recent events (newest first)."""
    return list(reversed(_events[-limit:]))


# ── CSV export ──────────────────────────────────────────────────
def export_events_csv() -> str:
    """Export all events as CSV string."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["event_type", "timestamp", "metadata", "visitor_email"])

    for event in _events:
        writer.writerow([
            event.get("event_type", ""),
            event.get("timestamp", ""),
            str(event.get("metadata", {})),
            event.get("visitor_email", ""),
        ])

    return output.getvalue()


def export_subscribers_csv() -> str:
    """Export all subscribers as CSV string."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["email", "source_page", "timestamp", "name"])

    for sub in _subscribers:
        writer.writerow([
            sub.get("email", ""),
            sub.get("source_page", ""),
            sub.get("timestamp", ""),
            sub.get("name", ""),
        ])

    return output.getvalue()


# ── Module-level reset (for testing) ───────────────────────────
def reset_for_testing() -> None:
    """Clear all events and subscribers. Only used in tests."""
    _events.clear()
    _subscribers.clear()
    _seen_emails.clear()
