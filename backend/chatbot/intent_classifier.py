"""
Intent Classifier — determines whether a user message is casual chat,
greeting, farewell, or a knowledge-seeking query requiring RAG retrieval.

Uses fast pattern matching (no LLM call) so classification adds ~0ms latency.
Conversation context awareness prevents re-classifying follow-up questions.
"""
import re
from typing import Optional

# ── Greeting patterns ─────────────────────────────────────────────────
_GREETING_PATTERNS = [
    # Standard greetings
    r'^(hi|hello|hey)\s*[.!]*\s*$',
    r'^(hi|hello|hey)\s+there\s*[.!]*\s*$',
    # Repeated-char variants: hii, helloo, heyy, heyya, heyoo, etc.
    r'^h[i]+\s*[.!]*\s*$',                                    # hi, hii, hiii
    r'^he[l]+[o]+\s*[.!]*\s*$',                               # hello, helloo, helo
    r'^he[y]+[aou]*\s*[.!]*\s*$',                             # hey, heyy, heyya, heyoo
    r'^el+[o]+\s*[.!]*\s*$',                                  # ello
    r'^h[i]+\s+there\s*[.!]*\s*$',                            # hi there, hii there
    r'^he[l]+[o]+\s+there\s*[.!]*\s*$',                      # hello there, helloo there
    r'^he[y]+[aou]?\s+there\s*[.!]*\s*$',                    # hey there, heyy there
    # Salam variants
    r'^(salam|assalam[uo]?[ae]?laykum|was[sz]?[a]?[sz]?lam)\s*[.!]*\s*$',
    r'^(was\s+salam|mus(?:s?[a]?[sz]?lam|lim|alm[a]?n?))\s*[.!]*\s*$',
    # Time-based and slang
    r'^good\s*(morning|afternoon|evening|day)\s*[.!]*\s*$',
    r'^(howdy|yo|sup)\s*[.!]*\s*$',
    r'^what\'?s\s*up\s*[!?]*\s*$',
    r'^hey\s+there\s*[.!]*\s*$',
]

# ── Farewell / thanks patterns ────────────────────────────────────────
_FAREWELL_PATTERNS = [
    r'^(bye|goodbye|cya|gotta\s*go)\s*[.!]*\s*$',
    r'^see\s*you\s*(later|soon|around|next\s*time)?\s*[.!]*\s*$',
    r'^take\s*care\s*[.!]*\s*$',
    r'^(talk\s*(to\s*you\s*)?late[or]?|later|l8r)\s*[.!]*\s*$',
    r'^thanks?\s*(a\s*lot|so\s*much|you\s*too|a\s*bunch|very\s*much)?\s*[.!]*\s*$',
    r'^thank\s*you\s*(so\s*much|very\s*much|a\s*lot)?\s*[.!]*\s*$',
    r'thanks?\s+for\s+(your\s+)?(help|time|assistance|everything)\s*[.!]*\s*$',
    r'^(have\s+a\s+(good|great|nice|lovely)\s+(day|evening|weekend|time))\s*[.!]*\s*$',
    r'^(catch\s*you\s*late[or]?|ttfn|g2g|gtg)\s*[.!]*\s*$',
    r'^i\'?m\s*(off|done|leaving|heading\s*out)\s*[.!]*\s*$',
]

# ── Email-sending patterns ───────────────────────────────────────────
_EMAIL_SEND_PATTERNS = [
    r'(send|email|mail)\s+(a\s+)?(message|an\s+email|email)',
    r'(i\s+)?want\s+to\s+(send|contact|reach\s+out|message)',
    r'(i\s+)?(would\s+like|like)\s+to\s+(send|contact|reach\s+out)',
    r'(can\s+(i|you)\s+)?send\s+(a\s+)?message',
    r'(contact|reach)\s+(asad|him|you)\s*(about|regarding|for)',
    r'(send|shoot|drop)\s+(an\s+)?email',
    r'(write|compose)\s+(a\s+)?(message|email)',
    r'(let\s+me\s+)?(send|leave|drop)\s+(a\s+)?message',
    r'email\s+(asad|him|you)',
    r'message\s+(for|to)\s+(asad|him|you)',
    r'(get|stay)\s+in\s+touch',
    r'(i\'?d\s+like|i\s+want)\s+to\s+get\s+in\s+touch',
    r'(can\s+you\s+)?(pass|send|forward)\s+(a\s+)?message\s+(to|for)',
    r'(tell|inform|notify)\s+(him|asad|them)',
    # ── Request delivery patterns ─────────────────────────────────
    r'send\s+(me|us|it)\s+(your|the|a)\s+(resume|cv|portfolio|details|info|brochure|pdf|file)',
    r'(send|email|mail)\s+(me|us)\s+(the|a|your)\s+(resume|cv|portfolio)',
    r'(can\s+you\s+)?send?\s+(me|us)\s+(the|a|your)\s+(resume|cv|portfolio)\s+(at|to|on)\s+\S+@\S+',
    r'(i\'?d\s+like|i\s+want|can\s+i)\s+(to\s+)?(get|receive|have|download)\s+(your|the)\s+(resume|cv|portfolio)',
    r'(share|send|forward)\s+(your|the|a)\s+(resume|cv|portfolio|details)\s+(with|to)\s+(me|us)',
    # ── Bare email address (follow-up to email prompt) ──────────
    r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\s*$',
]

# ── Acknowledgment patterns (short affirmations) ──────────────────────
_ACKNOWLEDGMENT_PATTERNS = [
    r'^(ok|okay|sure|great|nice|cool|got\s*it|i\s*see|understood|'
    r'makes\s*sense|alright|right|fine|good|perfect|awesome|amazing|'
    r'excellent|understood|agreed|indeed|absolutely|definitely)\s*[.!]*\s*$',
    r'^that\'?s\s+(great|nice|cool|perfect|awesome|good|amazing|'
    r'interesting|helpful)\s*[.!]*\s*$',
    r'^sounds\s+good\s*[.!]*\s*$',
    r'^that\s+makes\s+sense\s*[.!]*\s*$',
    # Broader affirmation / compliment in short messages
    r'^(impressive|wonderful|fantastic|brilliant|lovely|stunning|'
    r'beautiful|elegant|outstanding|remarkable)\s*[.!]*\s*$',
    r'^very\s+(nice|cool|great|impressive|helpful|interesting|good)\s*[.!]*\s*$',
]

# ── Casual conversation indicators ────────────────────────────────────
_CASUAL_PATTERNS = [
    r'how\s+(are\s*you|are\s*you\s*doing|is\s*it\s*going|'
    r'have\s*you\s*been|was\s*your\s*day)',
    r'what\'?s\s*(up|going\s*on|new|happening)',
    r'(how|what)\s*(about|else)\s+(you|up)',
    r'nice\s*to\s*(meet|talk\s*to)\s*you',
    r'(tell\s*me\s*a\s*joke|make\s*me\s*laugh)',
    r'(are\s*you\s*(real|ai|bot|human|actually|a\s*robot|sure|serious))',
    # Fix: match both "i am X" AND "i'm X" / "im X"
    r"(?:i['’]*m\b|i\s+am)\s+(bored|happy|sad|tired|feeling|"
    r'just\s*(browsing|looking|checking|passing))',
    r'(what\s*do\s*you\s*think|what\s*do\s*you\s*think\s*about|do\s*you\s*like|do\s*you\s*enjoy)',
    r'(just|merely)\s+(saying\s*hi|saying\s*hello|checking|browsing|looking\s*around)',
    r'(not\s*looking\s*for\s*anything|nothing\s*special|just\s*exploring)',
    # ── New: Compliments & positive reactions ───────────────────────────
    r"(i['’]*m\b|i\s+am)\s+(impressed|amazed|enjoying|loving|really\s+liking)",
    r"(love|like|enjoy|appreciate)\s+(this|the|your|that)\s+(portfolio|site|work|design|project|website)",
    r'(impressed|blown\s+away)\s+(by|with)\s+(your|this|the)',
    r'(great|amazing|awesome|beautiful|fantastic|excellent)\s+(portfolio|work|project|site|design|website|job)(\s*[.!]*\s*)$',
    # ── New: "I was just looking/browsing" patterns ─────────────────────
    r'i\s+was\s+(just\s+)?(browsing|looking|checking|exploring|viewing|going\s+through)',
    r'i\s+just\s+(came\s+across|found|saw|discovered|stumbled\s+upon)',
    r'i\s+was\s+(wondering|thinking|curious)',
    # ── New: Meta commentary about the conversation ─────────────────────
    r'(that|this)\s+(is|was|has\s+been)\s+(very|really|quite|so)\s+(helpful|informative|interesting|useful|valuable)',
    r'(thanks|thank\s*you)\s+(for|that)\s+(the\s+)?(information|help|details|answer|response|chat)',
    r'(sure|alright|cool|okay|ok),\s*(i\'?ll|i\s+will|let\s+me|that)',
]

# ── Knowledge-seeking indicators ──────────────────────────────────────
_KNOWLEDGE_INDICATORS = [
    # Project / work / skills
    r'(what|tell|show|list|describe|explain|detail)\s+(me\s+)?(about\s+)?'
    r'(your\s+)?(project|skill|service|case.?study|tech.?stack|experience|'
    r'job|work|portfolio|achievement|client|product|solution|tool|offer|'
    r'specialt|expertise|capa(bilit|acit))',
    # Quantifiers
    r'(how\s+(much|many|long|does|do|can|would|did|is|are|was|were|have|has|will))',
    # Requests for help / action
    r'(can\s*you|could\s*you|would\s*you|canyou)\s+.*'
    r'(help|tell|show|send|build|create|develop|design|make|implement|'
    r'integrate|deploy|automate|explain|share|provide|recommend|suggest)',
    # Needs / wants
    r'(i\s+(want|need|would\s*like|am\s*looking\s*for|am\s*interested\s*in|'
    r'need\s*help\s*with|am\s*curious\s*about))',
    # Hiring / services
    r'(hire|recruit|freelance|contract|consult|book|service|pricing|cost|'
    r'price|rate|budget|estimate|engagement|retain|commission)',
    # Contact
    r'(contact|email|phone|whatsapp|linkedin|github|reach|call|message|'
    r'social|profile|connect|chat|number)',
    # Resume / download
    r'(resume|cv|download|portfolio\s*(site|link|url)|website)',
    # Technical
    r'(architecture|design\s*pattern|tech\s*stack|framework|library|tool|'
    r'platform|deploy|hosting|infrastructure|db|database|backend|frontend|'
    r'full.?stack)',
    r'(agent|rag|llm|ai\s*model|embedding|vector|vector.?db|api\s*endpoint|'
    r'microservice|container|docker|kubernetes|serverless|pipeline|ci\/cd)',
    # Personal / background
    r'(experience|background|history|profile|about\s+(me|you)|biography|bio|'
    r'journey|story|origin|started|began|career|path|roadmap)',
    r'(certification|certificate|degree|education|qualification|training|course|'
    r'university|college|school|learn|study|graduate)',
    # Advice / comparison
    r'(recommend|suggest|advise|opinion|thoughts?\s+on|feedback|review)',
    r'(compare|difference|vs\.?|versus|alternative|option|pro[sz]|cons)',
    # Open source
    r'(open.?source|github|repo|repository|contribute|collaboration|'
    r'contributing|fork|star|follow)',
    # Logistics
    r'(remote|on.?site|hybrid|location|relocate|visa|sponsorship|'
    r'relocation|timezone|hours|availability|available|free|busy|schedule|'
    r'calendar|meeting|call|zoom|teams|discord)',
    # Question words (strong signal for knowledge queries)
    r'^(what|who|how|why|when|where|which|whose)\s+(is|are|was|were|does|do|'
    r'did|can|could|would|will|should|have|has|had|the|a|an|your|you|this|that)',
]

# ── Follow-up in knowledge context ────────────────────────────────────
_KNOWLEDGE_FOLLOWUP = [
    r'^(tell\s*me\s*more|continue|go\s*on|and\s*then|what\s*else|also|more|'
    r'further|elaborate|explain\s*more|details?\s*please|expand)',
    r'^(how\s*(about|come|so|is\s*that|does\s*that|would\s*that))',
    r'^(why\s*(is|are|was|did|would|does|not|don\'?t))',
    r'^(what\s*(about|else|next|then|after|before|if|for|of|are|is|was|were|does|do))',
    r'^(can\s*you|could\s*you)\s+(elaborate|expand|detail|clarify|give\s*more)',
    r'^i\s+see[,.]?\s*(but|and|so|however|then)',
    r'^(and\s+)?(how|what|why|when|where|which)\s',
    r'^also[,.]?\s',
    r'^(interesting|fascinating|impressive|cool|nice)[,.]+\s+(tell|how|what|why|can|could)',
]

# ── Knowledge keywords for short-message heuristic ────────────────────
_KNOWLEDGE_SHORT_WORDS: set = {
    'what', 'who', 'how', 'why', 'when', 'where', 'which', 'whose',
    'project', 'projects', 'skill', 'skills', 'experience', 'work',
    'job', 'service', 'services', 'contact', 'email', 'price',
    'cost', 'hire', 'portfolio', 'about', 'tech', 'stack', 'tool',
    'tools', 'case', 'case-study', 'case_study', 'freelance',
    'resume', 'cv', 'linkedin', 'github', 'education', 'degree',
    'certification', 'client', 'rate', 'pricing', 'consult',
    'agent', 'rag', 'llm', 'ai', 'api', 'architecture',
}


def _matches_any(text: str, patterns: list[str]) -> bool:
    """Check if text matches any pattern in the list."""
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def classify_intent(message: str, last_mode: str = "casual") -> str:
    """
    Classify user message intent using fast pattern matching.

    Returns one of:
      - ``"greeting"``   → Short 1-2 line response, no RAG needed.
      - ``"farewell"``   → Sign-off response, no RAG needed.
      - ``"email_send"`` → Email sending flow.
      - ``"casual"``     → Friendly conversation, no RAG needed.
      - ``"knowledge"``  → Needs RAG retrieval + full portfolio context.

    Parameters
    ----------
    message : str
        The user's latest message text, stripped.
    last_mode : str
        The conversation mode of the previous assistant response
        (``"casual"`` or ``"knowledge"``). Used to keep follow-up
        questions in knowledge context without re-classifying.

    Order of checks is intentional:
    1. Greeting (fastest) → 2. Farewell → 3. Email-send intent
    → 4. Casual conversation → 5. Knowledge indicators
    → 6. Knowledge follow-up → 7. Acknowledgment
    → 8. Short-message heuristic → 9. Default
    """
    msg = message.strip()
    if not msg:
        return "casual"

    msg_lower = msg.lower()

    # 1. Greeting — fastest pattern check
    if _matches_any(msg_lower, _GREETING_PATTERNS):
        return "greeting"

    # 2. Farewell / thanks
    if _matches_any(msg_lower, _FAREWELL_PATTERNS):
        return "farewell"

    # 3. Email-send patterns — checked before casual so "send a message"
    #    doesn't fall through to casual or knowledge routes.
    if _matches_any(msg_lower, _EMAIL_SEND_PATTERNS):
        return "email_send"

    # 4. Casual conversation patterns — checked BEFORE knowledge indicators
    #    so social phrases like "how are you?" or "what do you think?"
    #    don't get caught by knowledge quantifier patterns (e.g. "how are").
    if _matches_any(msg_lower, _CASUAL_PATTERNS):
        return "casual"

    # 5. Explicit knowledge indicators
    if _matches_any(msg_lower, _KNOWLEDGE_INDICATORS):
        return "knowledge"

    # 6. Knowledge follow-up in an existing knowledge conversation
    if last_mode == "knowledge":
        if _matches_any(msg_lower, _KNOWLEDGE_FOLLOWUP):
            return "knowledge"
        # Single-word "go" or "next" in knowledge context
        if msg_lower.strip() in ('go', 'next', 'more', 'and', 'then', 'so', 'ok so'):
            return "knowledge"

    # 7. Pure acknowledgment — not in a knowledge context → casual
    if _matches_any(msg_lower, _ACKNOWLEDGMENT_PATTERNS):
        return "casual"

    # 8. Short messages (≤3 words) with no strong signal → fast heuristic
    words = msg_lower.split()
    if len(words) <= 3:
        # Check if any knowledge-related word appears
        if _KNOWLEDGE_SHORT_WORDS.intersection(words):
            return "knowledge"
        return "casual"

    # 9. Longer messages with no clear signal → check for question intent.
    #    Only route to knowledge if there's a real question or explicit
    #    request, not just because the message is long.
    ends_with_question = msg_lower.rstrip().endswith('?')
    starts_with_question_word = bool(
        re.match(
            r'^(what|who|how|why|when|where|which|whose|can|could|'
            r'would|will|should|do|does|did|are|is|have|has|tell|show|list)',
            msg_lower,
        )
    )
    has_question_mark = '?' in msg_lower

    # Check for knowledge keywords in the message
    has_knowledge_keywords = _KNOWLEDGE_SHORT_WORDS.intersection(words)

    if ends_with_question or has_question_mark or starts_with_question_word or has_knowledge_keywords:
        return "knowledge"

    # If none of the above apply, this is likely chit-chat / compliment /
    # commentary → route casual for fast response.
    return "casual"
