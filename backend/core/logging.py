"""
Structured logging configuration.
Uses Python's standard logging; easy to swap for any handler.
"""

import logging
import sys


def configure_logging(level: str = "INFO") -> None:
    """Configure structured logging for the FastAPI app."""

    class StructuredFormatter(logging.Formatter):
        """Appends timestamps and level to every log line."""

        fmt = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
        datefmt = "%Y-%m-%d %H:%M:%S"

        def format(self, record: logging.LogRecord) -> str:
            record.levelname = record.levelname[0]  # INFO → I
            return super().format(record)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredFormatter(fmt=StructuredFormatter.fmt, datefmt=StructuredFormatter.datefmt))

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(getattr(logging, level.upper(), logging.INFO))


def get_logger(name: str) -> logging.Logger:
    """Return a logger for the given module name."""
    return logging.getLogger(name)
