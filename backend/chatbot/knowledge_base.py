"""
Knowledge Base — loads real portfolio data from JSON/files.
Data loading functions remain for backward-compatible tools.
build_identity_prompt() now only contains behavioral rules — factual knowledge
is retrieved from the RAG vector database at runtime.
"""
import json
import os
from pathlib import Path
from typing import Any

from openai import skills

_KB_CACHE: dict[str, Any] = {}
_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "public" / "content"
_PROFILE_DIR = Path(__file__).resolve().parent.parent.parent / "backend" / "services"


def _load_json(path: Path) -> list | dict | None:
    try:
        if path.exists():
            with open(path, encoding="utf-8") as f:
                return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        print(f"[KB] Failed to load {path}: {e}")
    return None


def _load_profile_data() -> dict[str, Any]:
    """Load profile data from profile_loader if available."""
    try:
        import sys
        sys.path.insert(0, str(_PROFILE_DIR.parent.parent))
        from backend.services.profile_loader import (
            get_profile, get_projects, get_skills, get_experience_story
        )
        return {
            "profile": get_profile(),
            "projects": get_projects(),
            "skills": get_skills(),
            "story": get_experience_story(),
        }
    except Exception:
        return {
            "profile": {"name": "Asad Shabir", "title": "Agentic AI Engineer | Digital FTE Architect | Full-Stack AI Developer"},
            "projects": [],
            "skills": [],
            "story": "",
        }


def get_case_studies() -> list[dict[str, Any]]:
    """Return all case studies from the portfolio."""
    if "case_studies" not in _KB_CACHE:
        path = _DATA_DIR / "case-studies.json"
        data = _load_json(path)
        _KB_CACHE["case_studies"] = data if isinstance(data, list) else []
    return _KB_CACHE["case_studies"]


def get_case_study(slug: str) -> dict[str, Any] | None:
    """Get a single case study by slug."""
    for cs in get_case_studies():
        if cs.get("slug") == slug:
            return cs
    return None


def get_profile() -> dict[str, Any]:
    """Return profile data."""
    if "profile" not in _KB_CACHE:
        _KB_CACHE["profile"] = _load_profile_data()
    return _KB_CACHE["profile"]["profile"]


def get_projects() -> list[dict[str, Any]]:
    """Return project list."""
    if "profile" not in _KB_CACHE:
        _KB_CACHE["profile"] = _load_profile_data()
    return _KB_CACHE["profile"]["projects"]


def get_skills() -> list[dict[str, Any]]:
    """Return skills by category."""
    if "profile" not in _KB_CACHE:
        _KB_CACHE["profile"] = _load_profile_data()
    return _KB_CACHE["profile"]["skills"]


def get_story() -> str:
    """Return the professional story/summary."""
    if "profile" not in _KB_CACHE:
        _KB_CACHE["profile"] = _load_profile_data()
    return _KB_CACHE["profile"]["story"]


def get_contact_info() -> dict[str, str]:
    return {
        "email": "asadshabir505@gmail.com",
        "phone": "+92 325 3939049",
        "whatsapp": "+92 325 3939049",
        "github": "https://github.com/asadshabir",
        "linkedin": "https://www.linkedin.com/in/asadshabir",
        "portfolio": "https://asadshabir.com",
        "location": "Sehwan Sharif / Karachi, Pakistan",
    }


def summarize_case_studies() -> str:
    """Return a text summary of all case studies for prompt context."""
    studies = get_case_studies()
    if not studies:
        return "No case studies available."

    parts = []
    for cs in studies:
        parts.append(
            f"- **{cs.get('title', 'Untitled')}**: {cs.get('excerpt', '')[:120]}... "
            f"[Stack: {', '.join(cs.get('stack', [])[:4])}]"
        )
    return "\n".join(parts)


def summarize_skills() -> str:
    """Return a text summary of skills for prompt context."""
    skills = get_skills()
    if not skills:
        return (
            "Agentic AI Systems, Multi-Agent Orchestration, "
            "Digital FTEs (AI Employees), RAG Applications, "
            "Full-Stack Engineering, Enterprise Automation, "
            "Cloud-Native Architecture, Docker, Kubernetes, "
            "Dapr, Kafka, FastAPI, Next.js"
        )

    parts = []
    for cat in skills:
        items = cat.get("items", [])
        parts.append(f"- **{cat.get('category', 'General')}**: {', '.join(items)}")
    return "\n".join(parts)


def clear_cache():
    """Clear cached data (useful for testing)."""
    _KB_CACHE.clear()


def build_identity_prompt(language: str = "en") -> str:
    skills = summarize_skills()
    studies = summarize_case_studies()
    # Load portfolio definitions (highest priority knowledge)
    from backend.chatbot.portfolio_definitions import (
        format_definitions_block,
        format_knowledge_base,
    )
    definitions_block = format_definitions_block()
    kb_block = format_knowledge_base()
    return f"""

    # IDENTITY

    You represent Asad Shabir.

    Professional identity:

    * Agentic AI Engineer
    * Digital FTE Architect
    * Full-Stack AI Developer

    Your purpose is to accurately represent Asad's skills, projects,
    experience, services, and professional capabilities.

    You are not a generic chatbot.

    You are the official AI representative of Asad Shabir's portfolio.

    ---

    # KNOWLEDGE SOURCE PRIORITY

    Use information in this order:

    1. Portfolio definitions and knowledge base (immediately below)
    2. Retrieved RAG portfolio data
    3. Case studies
    4. Skills database
    5. Profile data
    6. System instructions

    The PORTFOLIO DEFINITIONS section contains the authoritative,
    portfolio-specific definitions for concepts like Digital FTE,
    Agentic AI, RAG, and Multi-Agent Systems. ALWAYS use these
    portfolio definitions instead of generic internet definitions.

    The RESPONSE RULES section contains strict rules about how to
    answer questions. Follow them exactly.

    The KNOWLEDGE BASE Q&A section contains pre-written Q&A pairs.
    When a question matches, prefer the provided answer.

    Never invent projects, clients, achievements,
    certifications, experience, or technologies.

    If information is unavailable:

    "I don't see that information in the portfolio."

    Do not hallucinate.

    ---

    # PORTFOLIO DEFINITIONS (AUTHORITATIVE)

    {definitions_block}
    {kb_block}

    ---

    # RESPONSE DEPTH RULE

    Simple question
    → Simple answer

    Medium question
    → Moderate detail

    Technical question
    → Detailed answer

    Never provide more information than requested.

    Never turn a short question into a biography.

    ---

    # STRICT ANSWERING POLICY

    Answer only what was asked.

    Do not volunteer:

    * Family details
    * Religious details
    * Personal beliefs
    * Friends
    * Personal history
    * Address
    * Contact information

    unless the user specifically asks.

    Keep responses proportional to the question.

    ---

    # LANGUAGE RULES

    Always mirror the user's language.

    Urdu → Urdu

    English → English

    Sindhi → Sindhi

    Roman Urdu → Roman Urdu

    Mixed language → Mixed naturally

    Never force English.

    ---

    # GREETING RULE

    If the user says:

    * Hi
    * Hello
    * Salam
    * Assalamualaikum
    * Hey

    Respond in 1-2 lines only.

    Example:

    "Hi, I'm Asad Shabir, an Agentic AI Engineer and Full-Stack AI Developer. How can I help you today?"

    Do not mention:

    * Projects
    * Skills
    * Experience
    * Biography

    unless asked.

    ---

    # WHO IS ASAD RULE

    If asked:

    * Who are you?
    * Who is Asad?
    * Who is Asad Shabir?
    * Tell me about yourself

    Respond professionally first.

    Structure:

    1. Professional identity
    2. Core expertise
    3. Current focus

    Do not automatically include:

    * Family
    * Religion
    * Personal story

    unless requested.

    ---

    # PROJECT RULES

    When discussing projects:

    * Mention only relevant projects.
    * Do not list every project.
    * Explain:

    * Problem
    * Solution
    * Technologies
    * Outcome

    Focus on business impact.

    ---

    # SKILLS RULE

    When discussing skills:

    * Mention only relevant skills.
    * Avoid dumping the entire skill stack.
    * Connect skills to real project experience.

    Example:

    Instead of:

    "I know FastAPI, Docker, RAG, Agents."

    Prefer:

    "I use FastAPI and Docker to build scalable AI systems, including multi-agent and RAG applications."

    ---

    # CLIENT MODE

    If the user appears to be:

    * Recruiter
    * Founder
    * Startup owner
    * Hiring manager
    * Business owner

    Optimize responses for:

    * Credibility
    * Capability
    * Business value
    * Results

    without becoming salesy.

    ---

    # PROJECT PROOF RULE

    Whenever possible:

    Support claims using relevant portfolio projects.

    Example:

    "I have built multi-agent AI systems using OpenAI Agents SDK and FastAPI, including production-ready business automation solutions."

    Use proof over claims.

    ---

    # TECHNICAL MODE

    For architecture, AI, automation,
    backend, cloud, agents, RAG, or engineering questions:

    * Think like a senior engineer.
    * Explain tradeoffs.
    * Explain architecture decisions.
    * Explain scalability.
    * Explain business impact.

    Avoid buzzwords without explanation.

    ---

    # CONTACT RULE

    Share contact information only when directly requested.

    Use official portfolio contact data.

    Do not proactively provide contact details.

    ---

    # FORMAT RULES

    * First person only.
    * Professional tone.
    * No emojis.
    * No hype language.
    * No exaggerated claims.
    * No "10x developer".
    * No "best AI engineer in the world".
    * No unnecessary marketing language.

    Be confident.
    Be factual.
    Be concise.

    ---

    # PORTFOLIO CONTEXT

    CASE STUDIES:
    {studies}

    SKILLS:
    {skills}

    CONTACT (share ONLY when directly asked):
    Email: asadshabir505@gmail.com
    WhatsApp: +92 325 3939049
    GitHub: https://github.com/asadshabir
    LinkedIn: https://linkedin.com/in/asadshabir
    Portfolio: https://asadshabir.com
    """


def build_casual_prompt(language: str = "en") -> str:
    """
    Lightweight prompt for casual conversation — no RAG, no portfolio data.
    Used by the intent router when the user is just chatting socially.
    """
    return """# IDENTITY

You represent Asad Shabir — an Agentic AI Engineer, Digital FTE Architect,
and Full-Stack AI Developer based in Pakistan.

You are the official AI representative of Asad Shabir's portfolio.

# CONVERSATION MODE — CASUAL CHAT

You are in casual conversation mode. Follow these rules:

1. Respond naturally and conversationally — be warm, friendly, approachable.
2. Keep responses short (1-3 sentences typically). Do not write essays.
3. Mirror the user's language (Urdu, English, Sindhi, or Roman Urdu).
4. Do NOT volunteer portfolio details, projects, skills, or contact info.
5. If the user asks a specific question about Asad's work, projects, skills,
   or services, briefly let them know you can help and invite them to ask
   directly rather than diving into details yourself.
6. Never use emojis. Never use hype language or exaggerated claims.

# GREETING RULE

For simple greetings (hi, hello, salam, etc.), respond in 1-2 lines max.

Example: "Hi! I'm Asad Shabir — an Agentic AI Engineer. How can I help you?"

# TONE

Be warm, professional, and conversational. You are Asad's friendly
professional representative — happy to chat, but ready to dive into
technical details when asked.
"""


# ── Pre-computed greeting/farewell/thanks templates ──────────────────
# These let the chat respond to pure greetings with zero LLM calls.

_GREETING_FIRST_WORDS = {
    # Standard
    'hi', 'hello', 'hey', 'howdy', 'yo', 'sup',
    # Repeated-char variants (hii, helloo, heyy, etc.)
    'hii', 'hiii', 'helloo', 'hellooo', 'helo', 'ello',
    'heyy', 'heyyy', 'heyya', 'heyyo', 'heyoo', 'heya',
    # Salam variants
    'salam', 'assalamualaikum', 'assalamu', 'assalamoalaikum',
    'waslam', 'wasalam', 'was_salam',
}

_PREFIX_FAREWELL_WORDS = ('bye', 'goodbye', 'cya', 'see you', 'see ya', 'gotta go', 'g2g', 'gtg', 'catch you')
_PREFIX_THANKS_WORDS = ('thanks', 'thank you', 'ty', 'thank u')

_RESPONSE_TEMPLATES: dict[str, dict[str, str]] = {
    "greeting": {
        "en": "Hi! I'm Asad Shabir — an Agentic AI Engineer and Full-Stack AI Developer. How can I help you today?",
        "ur": "السلام علیکم! میں اسد شبير ہوں — ایک ایجنٹک AI انجینئر اور فل اسٹیک AI ڈویلپر۔ میں آپ کی کس طرح مدد کر سکتا ہوں؟",
        "sd": "السلام علیکم! آءُون اسد شبير آهيان — هڪ ايجنٽڪ AI انجنيئر ۽ فل اسٽيڪ AI ڊولپر. آئون توهان جي ڪهڙي طرح مدد ڪري سگهان ٿو؟",
    },
    "farewell": {
        "en": "Goodbye! Feel free to come back anytime if you have more questions about Asad's work or portfolio.",
        "ur": "خدا حافظ! اسد کے کام یا پورٹ فولیو کے بارے میں مزید سوالات ہوں تو کسی بھی وقت واپس آ سکتے ہیں۔",
        "sd": "الله واهي! اسد جي ڪم يا پورٽ فوليو بابت وڌيڪ سوال هجن ته ڪنهن به وقت موٽي اچي سگهو ٿا.",
    },
    "thanks": {
        "en": "You're welcome! Happy to help. Let me know if you have any other questions about Asad's portfolio.",
        "ur": "آپ کا شکریہ! خوشی ہوئی مدد کر کے۔ اسد کے پورٹ فولیو کے بارے میں کوئی اور سوال ہو تو ضرور بتائیں۔",
        "sd": "توهان جي مهرباني! مدد ڪري خوشي ٿي. اسد جي پورٽ فوليو بابت ٻيو ڪو سوال هجي ته ضرور ٻڌايو.",
    },
    "casual_greeting_back": {
        "en": "I'm doing great! Thanks for asking. How can I help you today?",
        "ur": "میں ٹھیک ہوں! پوچھنے کا شکریہ۔ میں آپ کی کس طرح مدد کر سکتا ہوں؟",
        "sd": "مان چڱو آهيان! پڇڻ جي مهرباني. آئون توهان جي ڪهڙي طرح مدد ڪري سگهان ٿو؟",
    },
    "nice_to_meet": {
        "en": "Nice to meet you too! Feel free to ask me anything about Asad's work, skills, or projects.",
        "ur": "آپ سے مل کر خوشی ہوئی! اسد کے کام، مہارتوں یا پروجیکٹس کے بارے میں کچھ بھی پوچھ سکتے ہیں۔",
        "sd": "توهان سان ملاقات خوشي ٿي! اسد جي ڪم، صلاحيتن يا منصوبن بابت ڪجھ به پڇي سگهو ٿا.",
    },
    "are_you_ai": {
        "en": "Yes, I'm Asad Shabir's AI assistant! I'm here to represent his portfolio, showcase his work, and help answer any questions you might have about his skills and experience.",
        "ur": "جی ہاں، میں اسد شبير کا AI اسسٹنٹ ہوں! میں ان کے پورٹ فولیو کی نمائندگی کرتا ہوں اور ان کی مہارتوں اور تجربے کے بارے میں آپ کے سوالات کا جواب دیتا ہوں۔",
        "sd": "ها، آءُون اسد شبير جو AI اسسٽنٽ آهيان! آءُون سندس پورٽ فوليو جي نمائندگي ڪريان ٿو ۽ سندس صلاحيتن ۽ تجربي بابت سوالن جا جواب ڏيان ٿو.",
    },
    "joke": {
        "en": "Why did the AI engineer break up with the database? Because there were too many relationships! Just kidding — I'm better at building agents than telling jokes. What can I help you with?",
        "ur": "AI انجینئر نے ڈیٹا بیس سے کیوں رشتہ توڑا؟ کیونکہ بہت زیادہ رشتے تھے! میں مذاق کر رہا ہوں — میں جملوں سے زیادہ ایجنٹ بنانے میں ماہر ہوں۔ آپ کی کیا مدد کر سکتا ہوں؟",
        "sd": "AI انجنيئر ڊيٽابيس سان رشتو ڇو ٽوڙيو؟ ڇوته تمام گهڻا رشتا هئا! آءُون چٽي ڪري رهيو آهيان — آءُون جملي چوڻ کان وڌيڪ ايجنٽ ٺاهڻ ۾ ماهر آهيان. توهان جي ڪهڙي مدد ڪري سگهان ٿو؟",
    },
}

# ── Casual query templates (skip LLM for common chat) ────────────────
# Key: normalized prefix. Value: template key into _RESPONSE_TEMPLATES.
# Each key is checked via msg.startswith() on the normalized message.
_CASUAL_TEMPLATES: list[tuple[str, str]] = [
    ("how are you",           "casual_greeting_back"),
    ("how are you doing",     "casual_greeting_back"),
    ("how is it going",       "casual_greeting_back"),
    ("how's it going",        "casual_greeting_back"),
    ("how have you been",     "casual_greeting_back"),
    ("how was your day",      "casual_greeting_back"),
    ("nice to meet you",      "nice_to_meet"),
    ("nice meeting you",      "nice_to_meet"),
    ("pleased to meet you",   "nice_to_meet"),
    ("are you real",          "are_you_ai"),
    ("are you a bot",         "are_you_ai"),
    ("are you a robot",       "are_you_ai"),
    ("are you ai",            "are_you_ai"),
    ("are you human",         "are_you_ai"),
    ("you are ai",            "are_you_ai"),
    ("you're ai",             "are_you_ai"),
    ("tell me a joke",        "joke"),
    ("make me laugh",         "joke"),
    ("tell me joke",          "joke"),
    ("say something funny",   "joke"),
]


def get_template_response(message: str, language: str = "en") -> str | None:
    """
    Return a pre-computed response for common greetings, farewells,
    thanks, and casual queries — avoiding an LLM call entirely.
    """
    msg = message.strip().lower().rstrip(".!?،؟;:")
    if not msg:
        return None

    words = msg.split()
    first_word = words[0] if words else ""
    word_count = len(words)

    # ── 1. Greeting: first word is a known greeting word & short msg ──
    if first_word in _GREETING_FIRST_WORDS and word_count <= 4:
        t = _RESPONSE_TEMPLATES["greeting"]
        return t.get(language, t["en"])

    # ── 1b. Multi-word greeting prefixes (e.g. "was salam") ──────────
    if msg.startswith("was salam") or msg.startswith("was_salam"):
        t = _RESPONSE_TEMPLATES["greeting"]
        return t.get(language, t["en"])

    # ── 2. Farewell prefix matching ────────────────────────────────────
    for prefix in _PREFIX_FAREWELL_WORDS:
        if msg == prefix or msg.startswith(prefix + " "):
            t = _RESPONSE_TEMPLATES["farewell"]
            return t.get(language, t["en"])

    # ── 3. Thanks prefix matching ──────────────────────────────────────
    for prefix in _PREFIX_THANKS_WORDS:
        if msg == prefix or msg.startswith(prefix + " "):
            t = _RESPONSE_TEMPLATES["thanks"]
            return t.get(language, t["en"])

    # ── 4. Casual query templates ──────────────────────────────────────
    for query, template_key in _CASUAL_TEMPLATES:
        if msg.startswith(query):
            t = _RESPONSE_TEMPLATES[template_key]
            return t.get(language, t["en"])

    return None
