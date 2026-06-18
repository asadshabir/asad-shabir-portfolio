"""
ASAD-SHABIR Chatbot — Intelligent multi-agent portfolio assistant.
Uses OpenAI Agents SDK with handoffs, real portfolio data, and session memory.
"""
import asyncio
import logging
import os
import re
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
from pathlib import Path
from pydantic import BaseModel

from agents import set_tracing_disabled

logger = logging.getLogger("chatbot")

# Pre-warm fast-path imports (pay the ~2s import tax once at startup,
# not on the first user request)
from backend.chatbot.intent_classifier import classify_intent
from backend.chatbot.knowledge_base import get_template_response

# Load .env from the chatbot directory (has Groq + Gemini keys)
_dotenv_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=_dotenv_path)
# Also load from CWD for any shared env vars
load_dotenv()
set_tracing_disabled(disabled=True)

app = FastAPI(title="ASAD-SHABIR Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=(
        r"https?://(?:localhost|127\.0\.0\.1)(?::\d+)?|"
        r"https://[a-zA-Z0-9-]+\.hf\.space|"
        r"https://[a-zA-Z0-9-]+\.vercel\.app|"
        r"https://asadshabir\.com"
    ),
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

# For casual / greetings — use smaller, faster model first
CASUAL_MODELS = [
    ("groq", "llama-3.1-8b-instant"),       # 3-5x faster than 70b
    ("groq", os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")),
    ("gemini", os.getenv("GEMINI_MODEL", "gemini-2.0-flash")),
]

# ── Singleton LLM clients (created once, reused across requests) ───
_groq_client: Optional[AsyncOpenAI] = None
_gemini_client: Optional[AsyncOpenAI] = None
_cached_casual_prompt: str | None = None


def _get_client(provider: str) -> AsyncOpenAI | None:
    """Get or create a cached AsyncOpenAI client for the given provider."""
    global _groq_client, _gemini_client
    if provider == "groq":
        if _groq_client is None and GROQ_API_KEY:
            _groq_client = AsyncOpenAI(api_key=GROQ_API_KEY, base_url=GROQ_BASE_URL)
        return _groq_client
    if provider == "gemini":
        if _gemini_client is None and GEMINI_API_KEY:
            _gemini_client = AsyncOpenAI(api_key=GEMINI_API_KEY, base_url=GEMINI_BASE_URL)
        return _gemini_client
    return None


def _get_casual_prompt() -> str:
    """Cached casual prompt — built once, reused for all casual/greeting requests."""
    global _cached_casual_prompt
    if _cached_casual_prompt is None:
        from backend.chatbot.knowledge_base import build_casual_prompt
        _cached_casual_prompt = build_casual_prompt()
    return _cached_casual_prompt


# In-memory request spacing: track last request time per session to avoid bursts
_last_request_time: dict[str, float] = {}
MIN_REQUEST_INTERVAL = 1.5   # seconds between knowledge queries
CASUAL_INTERVAL = 0.3        # seconds between casual / greeting / farewell

# ── Session memory (in-memory, TTL: 30 min) ────────────────────
class SessionState:
    def __init__(self):
        self.messages: list[dict] = []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.conversation_mode: str = "casual"  # "casual" | "knowledge"

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


async def _direct_chat_completion(
    system_prompt: str,
    messages: list[dict],
    max_tokens: int = 300,
    temperature: float = 0.75,
    model_list: list[tuple[str, str]] | None = None,
) -> str:
    """Fast direct LLM completion without agent/tool overhead.

    Uses singleton LLM clients (no per-request creation overhead).
    Uses the given model_list, or FALLBACK_MODELS if not specified.
    Used by the casual/greeting/farewell routes so those responses
    are snappy without the overhead of agent handoffs and RAG retrieval.
    """
    models = model_list or FALLBACK_MODELS
    for provider, model_name in models:
        client = _get_client(provider)
        if client is None:
            continue

        api_messages = [{"role": "system", "content": system_prompt}]
        for m in messages[-6:]:
            role = m.get("role", "user")
            content = m.get("content", "")
            if content:
                api_messages.append({"role": role, "content": content})

        try:
            completion = await client.chat.completions.create(
                model=model_name,
                messages=api_messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )
            msg = completion.choices[0].message.content or ""
            if msg:
                return msg
        except Exception as e:
            logger.warning(f"Direct completion on {provider}/{model_name} failed: {e}")
            continue

    return ""


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


async def _casual_chat_route(session: SessionState, context_messages: list[dict]) -> str:
    """Handle casual conversation — fast, no RAG, 8b model first."""
    casual_prompt = _get_casual_prompt()
    msg = await _direct_chat_completion(
        system_prompt=casual_prompt,
        messages=context_messages,
        max_tokens=80,          # casual responses are 1-2 sentences
        temperature=0.75,
        model_list=CASUAL_MODELS,
    )
    if not msg:
        msg = (
            "I'm here to help! Feel free to ask me anything "
            "about Asad's work, skills, or projects."
        )
    session.conversation_mode = "casual"
    return msg


async def _handle_email_send(
    user_message: str,
    language: str,
) -> str:
    """Extract email fields from natural language and deliver appropriately.

    Two modes:
    1. DELIVERY MODE — user asks for something sent TO them
       (e.g. "send me your resume", "email me details")
       → Sends FROM Asad's Gmail TO user's email via send_email_to_recipient()

    2. INQUIRY MODE — user wants to send a message TO Asad
       (e.g. "tell Asad I'm interested", "send a message")
       → Sends via existing Resend send_contact_email() (visitor → Asad)
    """
    # ── 1. Also check if the message IS just an email (follow-up) ──
    bare_email = user_message.strip().lower()
    import re as _re_import
    email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    if email_pattern.match(bare_email):
        # User just provided their email as a follow-up — send resume to it
        from backend.services.email_service import get_email_service, EmailSendError
        portfolio_link = "https://asadshabir.com"
        body = (
            f"Hi there,\n\n"
            f"Thank you for your interest in my work!\n\n"
            f"As requested, here is my resume and portfolio information:\n\n"
            f"Portfolio: {portfolio_link}\n"
            f"GitHub: https://github.com/asadshabir\n"
            f"LinkedIn: https://www.linkedin.com/in/asad-shabir-programmer110/\n\n"
            f"You can also download my resume directly from my portfolio website.\n\n"
            f"If you have any questions about my experience, skills, or how I can "
            f"contribute to your projects, feel free to reach out.\n\n"
            f"Best regards,\n"
            f"Asad Shabir\n"
            f"Agentic AI Engineer | Digital FTE Architect | Full-Stack AI Developer\n"
            f"Email: asadshabir505@gmail.com"
        )
        try:
            email_service = get_email_service()
            sent = await email_service.send_email_to_recipient(
                recipient_email=bare_email,
                subject="Resume and Portfolio — Asad Shabir",
                body_text=body,
            )
            if sent:
                logger.info(f"Chatbot delivered resume to {bare_email} (bare email follow-up)")
                return (
                    f"I've sent my resume to your email at {bare_email}. "
                    f"Please check your inbox (and spam folder just in case)! "
                    f"Is there anything else I can help you with?"
                )
        except Exception as e:
            logger.error(f"Bare email delivery failed: {e}")
        return (
            f"I'll make sure you get it. Since the email service is temporarily busy, "
            f"you can download my resume directly from https://asadshabir.com. "
            f"Is there anything else I can help you with?"
        )

    # ── 2. Extract email fields via LLM ────────────────────────────
    extraction_prompt = (
        "Extract email delivery details from the user's message.\n\n"
        "Determine the DIRECTION:\n"
        '- If the user is asking to RECEIVE something (resume, info, etc.): direction="deliver"\n'
        '- If the user wants to SEND a message to Asad: direction="inquiry"\n\n'
        "IMPORTANT: The email address is where the user wants to RECEIVE the item.\n"
        "Even if the email looks familiar (like asadshabir505@gmail.com), treat it as "
        "the delivery address the user provided.\n\n"
        "Return ONLY valid JSON with these fields (use null if not found):\n"
        '{\n'
        '  "direction": "deliver" | "inquiry",\n'
        '  "name": "<sender or recipient name>",\n'
        '  "email": "<target email address>",\n'
        '  "subject": "<subject line>",\n'
        '  "message": "<message body or item requested>",\n'
        '  "requested_item": "<resume|portfolio|details|info|null>"\n'
        '}\n\n'
        "For delivery: find the email address where the user wants to receive the item.\n"
        "For inquiry: find the sender's email to use as reply-to.\n"
        "User message: " + user_message
    )

    extraction = await _direct_chat_completion(
        system_prompt="You extract structured email data from user messages. Return ONLY valid JSON, no other text.",
        messages=[{"role": "user", "content": extraction_prompt}],
        max_tokens=300,
        temperature=0.1,
        model_list=CASUAL_MODELS,
    )

    # Parse JSON safely
    import json as _json
    fields: dict[str, str | None] = {
        "direction": None, "name": None, "email": None,
        "subject": None, "message": None, "requested_item": None,
    }
    try:
        cleaned = extraction.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[-1]
            cleaned = cleaned.rsplit("```", 1)[0]
        parsed = _json.loads(cleaned.strip())
        fields.update({k: parsed.get(k) for k in fields})
    except (_json.JSONDecodeError, Exception):
        pass

    direction = fields.get("direction") or "inquiry"
    name = fields.get("name") or "Portfolio Visitor"
    target_email = fields.get("email") or ""
    subject = fields.get("subject") or ("From Asad Shabir" if direction == "deliver" else "Portfolio Chat Inquiry")
    message = fields.get("message") or user_message
    requested_item = fields.get("requested_item")

    # ── 2. Validate email ──────────────────────────────────────────
    if not target_email or "@" not in target_email:
        return (
            "I'd be happy to help with that! "
            "Could you please provide your email address so I know where to send it?"
        )

    if len(message) < 3 and direction != "deliver":
        return (
            "I'd love to help. "
            "Could you tell me what you'd like the message to say?"
        )

    # ── 3a. DELIVERY MODE: send FROM Asad's Gmail TO the visitor ────
    if direction == "deliver":
        from backend.services.email_service import get_email_service, EmailSendError

        # Build a delivery message
        if requested_item and requested_item in ("resume", "cv"):
            item_name = "my resume"
            portfolio_link = "https://asadshabir.com"
            body = (
                f"Hi {name},\n\n"
                f"Thank you for your interest in my work!\n\n"
                f"As requested, here is my resume and portfolio information:\n\n"
                f"Portfolio: {portfolio_link}\n"
                f"GitHub: https://github.com/asadshabir\n"
                f"LinkedIn: https://www.linkedin.com/in/asad-shabir-programmer110/\n\n"
                f"You can also download my resume directly from my portfolio website.\n\n"
                f"If you have any questions about my experience, skills, or how I can "
                f"contribute to your projects, feel free to reach out.\n\n"
                f"Best regards,\n"
                f"Asad Shabir\n"
                f"Agentic AI Engineer | Digital FTE Architect | Full-Stack AI Developer\n"
                f"Email: asadshabir505@gmail.com"
            )
            delivery_subject = "Resume and Portfolio — Asad Shabir"
        else:
            body = message
            delivery_subject = subject

        try:
            email_service = get_email_service()
            sent = await email_service.send_email_to_recipient(
                recipient_email=target_email,
                subject=delivery_subject,
                body_text=body,
            )
            if sent:
                logger.info(f"Chatbot delivered to {target_email}: {delivery_subject}")
                return (
                    f"I've sent {item_name if requested_item else 'the information'} "
                    f"to your email at {target_email}. "
                    f"Please check your inbox (and spam folder just in case)! "
                    f"Is there anything else I can help you with?"
                )
        except EmailSendError as e:
            logger.error(f"Chatbot delivery failed: {e}")
        except Exception as e:
            logger.error(f"Chatbot delivery unexpected error: {e}")

        # Fallback if Gmail fails
        return (
            f"I'll make sure you get the information. Since the email service "
            f"is temporarily busy, you can also download my resume directly "
            f"from my portfolio at https://asadshabir.com. "
            f"Is there anything else I can help you with?"
        )

    # ── 3b. INQUIRY MODE: send visitor message TO Asad via Resend ──
    try:
        from backend.services.email_service import get_email_service, EmailSendError
        email_service = get_email_service()
        sent = await email_service.send_contact_email(
            name=name,
            email=target_email,
            subject=subject,
            message=message,
        )
        if sent:
            logger.info(f"Chatbot inquiry sent from {target_email}: {subject}")
            return (
                "Your message has been sent successfully! "
                "Asad typically responds within 24 hours. "
                "Is there anything else I can help you with?"
            )
    except EmailSendError as e:
        logger.error(f"Chatbot email send failed: {e}")
    except Exception as e:
        logger.error(f"Chatbot email unexpected error: {e}")

    return (
        "Thank you for your message! I've noted it down. "
        "While the email service is temporarily unavailable, "
        "your message has been received and Asad will see it. "
        "Feel free to also use the contact form on the page."
    )


async def _handle_chat(request: ChatRequest):
    conv_messages = [{"role": m.role, "content": m.content} for m in request.messages]
    session_id, session = _get_or_create_session(request.session_id)

    # ── Extract last user message ──────────────────────────────────
    last_user_msg = ""
    for m in reversed(conv_messages):
        if m.get("role") == "user":
            last_user_msg = m["content"]
            break

    # ── Intent classification ──────────────────────────────────────
    intent = classify_intent(last_user_msg, session.conversation_mode)

    # Build conversation context
    history = session.get_history(8)
    context_messages = history + conv_messages

    # ── EMAIL-SEND ROUTE (before template path) ───────────────────
    if intent == "email_send":
        for m in conv_messages:
            session.add_message(m["role"], m["content"])

        assistant_msg = await _handle_email_send(
            user_message=last_user_msg,
            language=request.language or "en",
        )

        session.add_message("assistant", assistant_msg)
        session.conversation_mode = "casual"
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

    # ── FAST PATH: Check templates BEFORE throttle ─────────────────
    # If the message matches a pre-computed template (greeting/farewell/
    # thanks/casual), respond immediately — zero throttle, zero LLM call.
    if intent in ("greeting", "farewell", "casual"):
        template_msg = get_template_response(last_user_msg, request.language or "en")
        if template_msg:
            session.conversation_mode = "casual"
            for m in conv_messages:
                session.add_message(m["role"], m["content"])
            session.add_message("assistant", template_msg)
            _cleanup_expired_sessions()
            return JSONResponse(
                content={
                    "ok": True,
                    "message": {"role": "assistant", "content": template_msg},
                    "language": request.language or "en",
                    "session_id": session_id,
                },
                media_type="application/json; charset=utf-8",
            )

    # ── NON-KNOWLEDGE ROUTE: greeting/farewell/casual → FAST ────
    # Template was already checked above and didn't match (would have returned).
    # Use fast small-model LLM call (no RAG, no agents, 8b model).
    if intent in ("greeting", "farewell", "casual"):
        assistant_msg = await _casual_chat_route(session, context_messages)

    # ── KNOWLEDGE ROUTE: fast direct completion with identity prompt ──
    # Uses the identity prompt (which includes case study summaries and skills)
    # for context. Single LLM call — no OpenAI Agents SDK overhead, no tools,
    # no RAG pre-injection. Fast and reliable.
    else:
        from backend.chatbot.knowledge_base import build_identity_prompt
        identity_prompt = build_identity_prompt(request.language or "en")
        # Use 8b model first (3-5x faster than 70b), fall back to 70b then Gemini
        # The identity prompt has structured summaries so 8b quality is sufficient
        assistant_msg = await _direct_chat_completion(
            system_prompt=identity_prompt,
            messages=context_messages,
            max_tokens=600,
            temperature=0.7,
            model_list=CASUAL_MODELS,
        )

        session.conversation_mode = "knowledge"

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
