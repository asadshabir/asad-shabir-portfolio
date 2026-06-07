"""
ASAD-SHABIR Chatbot — Intelligent multi-agent portfolio assistant.
Uses OpenAI Agents SDK with handoffs, real portfolio data, and session memory.
"""
import asyncio
import logging
import os
import time
import uuid
from datetime import datetime, timedelta
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import AsyncOpenAI
from pydantic import BaseModel

from agents import (
    Agent, Runner, OpenAIChatCompletionsModel,
    set_tracing_disabled, ModelSettings,
)

logger = logging.getLogger("chatbot")

from openai import RateLimitError, NotFoundError, APIStatusError
from backend.chatbot.agent_defs import main_agent

load_dotenv()
set_tracing_disabled(disabled=True)

app = FastAPI(title="ASAD-SHABIR Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Multiprovider Configuration ─────────────────────────────
# Gemini is primary — best agentic capabilities.
# Groq is fallback — fast if Gemini is rate-limited.

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_BASE_URL = "https://api.groq.com/openai/v1"

# Pool: Groq Llama is primary (best tool-calling support).
# Gemini is fallback (may not handle OpenAI Agent SDK tools properly).
FALLBACK_MODELS = [
    ("groq", os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")),
    ("groq", "llama-3.1-8b-instant"),
    ("gemini", os.getenv("GEMINI_MODEL", "gemini-2.0-flash")),
]
MAX_RETRIES = len(FALLBACK_MODELS)

# In-memory request spacing: track last request time per session to avoid bursts
_last_request_time: dict[str, float] = {}
MIN_REQUEST_INTERVAL = 1.5  # seconds between requests from same session

# ── Session memory (in-memory, TTL: 30 min) ────────────────────
class SessionState:
    def __init__(self):
        self.messages: list[dict] = []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
        self.updated_at = datetime.utcnow()

    def get_history(self, max_messages: int = 10) -> list[dict]:
        """Return last N messages for context window management."""
        return self.messages[-max_messages:]

    def is_expired(self, ttl_minutes: int = 30) -> bool:
        return datetime.utcnow() - self.updated_at > timedelta(minutes=ttl_minutes)


_sessions: dict[str, SessionState] = {}


def _get_or_create_session(session_id: Optional[str]) -> tuple[str, SessionState]:
    """Get existing session or create a new one. Returns (session_id, session)."""
    if session_id and session_id in _sessions:
        sess = _sessions[session_id]
        if not sess.is_expired():
            return session_id, sess
        # Session expired — create new one
        del _sessions[session_id]

    new_id = uuid.uuid4().hex[:12]
    _sessions[new_id] = SessionState()
    return new_id, _sessions[new_id]


def _cleanup_expired_sessions():
    """Remove expired sessions from memory."""
    expired = [sid for sid, sess in _sessions.items() if sess.is_expired()]
    for sid in expired:
        del _sessions[sid]


# ── API Endpoints ──────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ASAD-SHABIR Chatbot",
        "model": FALLBACK_MODELS[0][1] if FALLBACK_MODELS else "unknown",
        "sessions_active": len(_sessions),
    }


@app.get("/debug-rag")
async def debug_rag(q: str = "share your projects"):
    """Debug endpoint to check RAG retrieval."""
    from backend.chatbot.rag_retriever import retrieve_context, get_qdrant_stats
    stats = get_qdrant_stats()
    ctx = retrieve_context(query=q)
    return {
        "query": q,
        "stats": stats,
        "rag_length": len(ctx) if ctx else 0,
        "rag_preview": ctx[:500] if ctx else "NO DATA",
    }


class MessageModel(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[MessageModel]
    language: Optional[str] = "en"
    session_id: Optional[str] = None


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        return await _handle_chat(request)
    except Exception as e:
        logger.error(f"Chat error: {type(e).__name__}: {str(e)[:300]}")
        return JSONResponse(
            content={
                "ok": True,
                "message": {
                    "role": "assistant",
                    "content": "I'm temporarily unable to process your request. Please try again in a moment."
                },
                "language": request.language or "en",
            },
            status_code=200,
        )


async def _handle_chat(request: ChatRequest):
    conv_messages = [{"role": m.role, "content": m.content} for m in request.messages]
    session_id, session = _get_or_create_session(request.session_id)

    # ── Session throttling ────────────────────────────────────────
    now = time.time()
    last_time = _last_request_time.get(session_id, 0.0)
    if now - last_time < MIN_REQUEST_INTERVAL:
        await asyncio.sleep(MIN_REQUEST_INTERVAL - (now - last_time))
    _last_request_time[session_id] = time.time()

    # Build conversation context
    history = session.get_history(8)
    context_messages = history + conv_messages
    from backend.chatbot.knowledge_base import build_identity_prompt
    from backend.chatbot.rag_retriever import retrieve_context

    identity_prompt = build_identity_prompt(request.language or "en")

    # Pre-fetch relevant RAG context based on user's last message
    last_user_msg = ""
    for m in reversed(conv_messages):
        if m.get("role") == "user":
            last_user_msg = m["content"]
            break
    rag_context = ""
    if last_user_msg:
        rag_context = retrieve_context(query=last_user_msg)

    # Build input: system (rules) + RAG (portrait data as user msg) + conversation
    full_input = [{"role": "system", "content": identity_prompt}]
    if rag_context:
        full_input.append({"role": "user", "content": f"[PORTFOLIO DATA]\n{rag_context}\n[/PORTFOLIO DATA]\nUse this data to answer questions about Asad."})
    full_input += context_messages

    # ── Retry: Gemini => Groq models ──────────────────────────────
    assistant_msg = ""
    tried_models = []

    for attempt, (provider, model_name) in enumerate(FALLBACK_MODELS):
        api_key = GEMINI_API_KEY if provider == "gemini" else GROQ_API_KEY
        base_url = GEMINI_BASE_URL if provider == "gemini" else GROQ_BASE_URL

        if not api_key:
            logger.warning(f"No API key for {provider}, skipping")
            continue

        client = AsyncOpenAI(api_key=api_key, base_url=base_url)
        retry_model = OpenAIChatCompletionsModel(model=model_name, openai_client=client)
        main_agent.model = retry_model
        for h in (main_agent.handoffs or []):
            h.model = retry_model

        try:
            logger.info(f"Agent attempt {attempt+1}/{len(FALLBACK_MODELS)}: {provider}/{model_name}")
            result = await Runner.run(main_agent, input=full_input)
            assistant_msg = result.final_output or ""
            # Strip tool-name leakage, "To provide..." preambles, and hallucinated tool calls
            import re as _re
            assistant_msg = _re.sub(
                r'(?:'
                r'`?get_\w+_tool\([^)]*\)`?\s*[:.]*\s*|'     # get_*_tool() with optional backticks
                r'\(get_\w+_tool\([^)]*\)\)\s*|'              # (get_rag_context_tool()) wraps
                r'Calling\s+`?\w+_\w+_tool\([^)]*\)`?\s*\.{2,3}\s*|'  # Calling get_X_tool()...
                r"To\s+(?:provide|answer|respond).*?I'?\'?(?:ll| will)\s+.*?(?:retrieve|fetch|look up|use|access|check).*?(?:context|info|data|portfolio|tool|knowledge).*?\.\s*|"
                r"Let me\s+.*?(?:retrieve|fetch|look up|check|access|search).*?(?:context|info|data|portfolio|knowledge|tool).*?\.\s*|"
                r"I'?\'?(?:ll| will)\s+(?:first\s+)?(?:need to\s+)?(?:retrieve|fetch|use|call|access).*?(?:context|info|data|portfolio|knowledge|tool).*?\.\s*|"
                r'Based on the retrieved (?:context|data).*?\.\s*'
                r')',
                '', assistant_msg, flags=_re.IGNORECASE | _re.DOTALL
            ).strip()
            if not assistant_msg:
                assistant_msg = result.final_output or ""
            break

        except RateLimitError:
            wait_time = min(1.5 ** attempt, 6)
            logger.warning(f"RateLimited on {model_name}, retry in {wait_time}s")
            tried_models.append(f"{model_name} (rate-limited)")
            await asyncio.sleep(wait_time)
            continue

        except NotFoundError as e:
            err_detail = str(e)
            if "tool use" in err_detail.lower() or "tool" in err_detail.lower():
                logger.warning(f"{model_name} doesn't support tools, skipping")
                tried_models.append(f"{model_name} (no tool support)")
                continue
            # Not a tool issue — raise on last attempt
            if attempt == len(FALLBACK_MODELS) - 1:
                raise HTTPException(status_code=500, detail="Chat service unavailable.")
            continue

        except Exception as e:
            logger.error(f"{model_name} failed: {type(e).__name__}: {str(e)[:150]}")
            tried_models.append(f"{model_name} (error)")
            if attempt == len(FALLBACK_MODELS) - 1:
                # Fall through to direct completion fallback
                pass
            continue

    # ── Attempt 2: Direct completion (no tools/agents — uses Groq) ─
    if not assistant_msg:
        logger.info("Agent failed — falling back to direct Groq completion")
        try:
            # Find the first Groq model that has an API key
            groq_api_key = os.getenv("GROQ_API_KEY")
            groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

            if groq_api_key:
                fallback_client = AsyncOpenAI(
                    api_key=groq_api_key,
                    base_url="https://api.groq.com/openai/v1",
                )

                from backend.chatbot.knowledge_base import build_identity_prompt, get_contact_info

                identity = build_identity_prompt(request.language or "en")

                # Conditionally append contact info ONLY if user asked for it
                last_msg = conv_messages[-1]["content"].lower() if conv_messages else ""
                contact_keywords = ["contact", "whatsapp", "email", "phone", "number", "call", "reach", "mobile"]
                if any(kw in last_msg for kw in contact_keywords):
                    c = get_contact_info()
                    identity += (
                        "\n\nCONTACT INFORMATION (user asked for it — provide directly):\n"
                        f"Email: {c.get('email')}\nWhatsApp: {c.get('phone')}\n"
                        f"GitHub: {c.get('github')}\nLinkedIn: {c.get('linkedin')}"
                    )

                # Build proper message chain: system + conversation history
                api_messages = [{"role": "system", "content": identity}]
                # Add last 6 context messages as proper chat messages (not text)
                for m in context_messages[-6:]:
                    role = m.get("role", "user")
                    content = m.get("content", "")
                    if content:
                        api_messages.append({"role": role, "content": content})

                completion = await fallback_client.chat.completions.create(
                    model=groq_model,
                    messages=api_messages,
                    max_tokens=600,
                    temperature=0.75,
                )
                assistant_msg = completion.choices[0].message.content or ""
                logger.info("Groq direct fallback succeeded")
            else:
                logger.warning("No Groq API key available for fallback")

        except Exception as e:
            logger.error(f"Fallback completion also failed: {e}")

    # ── Post-processing: sanitize hallucinations ─────────────────
    import re as _re
    if assistant_msg:
        # Strip "To provide..." tool-name preambles
        assistant_msg = _re.sub(
            r'(?:'
            r'`?get_\w+_tool\([^)]*\)`?\s*[:.]*\s*|'
            r'\(get_\w+_tool\([^)]*\)\)\s*|'
            r'Calling\s+`?\w+_\w+_tool\([^)]*\)`?\s*\.{2,3}\s*|'
            r"I'?\'?(?:ll| will)\s+(?:first\s+)?(?:need to\s+)?(?:retrieve|fetch|use|call).*?(?:context|info|data|portfolio|knowledge|tool).*?\.\s*"
            r')',
            '', assistant_msg, flags=_re.IGNORECASE | _re.DOTALL
        ).strip()
        # Check for price hallucinations: if model quoted prices that aren't "under $500"
        price_pattern = _re.findall(r'\$[\d,]+(?:,\d{3})*(?:k|K|,000)?', assistant_msg)
        for price in price_pattern:
            # Clean the price string for comparison
            num_str = price.replace('$', '').replace(',', '').replace('k', '000').replace('K', '000')
            if num_str.isdigit():
                val = int(num_str)
                if val > 5000 or (val > 1000 and val < 50000):
                    assistant_msg = assistant_msg.replace(price, 'under $500')

    # ── Final: If still no response, return helpful message ──────
    if not assistant_msg:
        assistant_msg = (
            "I'm temporarily at capacity due to high demand. "
            "Please try again in a few minutes. "
            "In the meantime, feel free to browse the portfolio — all projects and case studies are available!"
        )

    # Store in session
    for m in conv_messages:
        session.add_message(m["role"], m["content"])
    if assistant_msg:
        session.add_message("assistant", assistant_msg)

    _cleanup_expired_sessions()

    return JSONResponse(
        content={
            "ok": True,
            "message": {"role": "assistant", "content": assistant_msg},
            "language": request.language or "en",
            "session_id": session_id,
        },
        media_type="application/json; charset=utf-8",
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
