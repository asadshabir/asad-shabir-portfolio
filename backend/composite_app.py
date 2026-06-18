"""
Composite ASGI app — routes requests to the Main API or Chatbot
based on URL prefix, enabling both services to run on a single port
for HuggingFace Spaces deployment.

Usage:
    uvicorn backend.composite_app:app --host 0.0.0.0 --port 7860

Routing logic:
  /api/*      → Main FastAPI app (estimator, reviewer, contact, health, etc.)
  /chat       → Chatbot FastAPI app
  /health     → Chatbot FastAPI app
  /debug-rag  → Chatbot FastAPI app
  /*          → Chatbot FastAPI app (catch-all)
"""
import os

from dotenv import load_dotenv

# Load ALL environment variables (also loads from .env file if present)
load_dotenv()

from backend.api.index import create_app
from backend.chatbot.app import app as chatbot_app

# Pre-create the main API app
main_app = create_app()


async def app(scope, receive, send):
    """ASGI application that routes by path prefix.

    Both apps see the full original path — no prefix stripping.
    Main API paths already begin with /api/ (e.g., /api/contact).
    Chatbot paths are /chat, /health, /debug-rag.
    """
    path = scope.get("path", "")

    if path.startswith("/api/"):
        await main_app(scope, receive, send)
    else:
        # /chat, /health, /debug-rag, and any other path → chatbot
        await chatbot_app(scope, receive, send)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
