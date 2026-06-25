"""
AI Resume Reviewer Service — Groq API integration.
Uses Groq models for fast, free resume analysis.
Returns schema matching ReviewResponse Pydantic model.
"""
import json
import os
import re
from typing import Dict, Any, Optional
import requests

from backend.core.logging import get_logger

logger = get_logger(__name__)


class ReviewerParseError(Exception):
    """Raised when AI response cannot be parsed into expected format."""
    pass


def sanitize_resume(resume_text: str) -> str:
    """
    Strip potential prompt injection and enforce size cap.
    Returns cleaned text (max 10000 chars).
    """
    cleaned = re.sub(
        r"(?i)(ignore\s+(prior|all|above|previous).*instructions|"
        r"system\s*(prompt|message)|"
        r"forget\s+everything|"
        r"you\s+are\s+(now|not)\s+.*)",
        "",
        resume_text,
    )
    return cleaned.strip()[:10000]


class ReviewerService:
    """
    Resume review using Gemini API (primary) with Groq fallback.
    Output: summary, strengths, weaknesses, ATS tips, skill gaps, improvements.
    """

    def __init__(
        self,
        gemini_key: str = "",
        groq_key: str = "",
        model: str = "gemini-2.0-flash",
        groq_model: str = "llama-3.3-70b-versatile",
        timeout: int = 45,
    ):
        self.gemini_key = gemini_key
        self.groq_key = groq_key
        self.model = model
        self.groq_model = groq_model
        self.timeout = timeout
        self.gemini_url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"

    def review(
        self,
        resume_text: str,
        target_role: Optional[str] = None,
        language: str = "en",
    ) -> Dict[str, Any]:
        """Generate a structured resume review — tries Groq first (fast), then Gemini."""
        system_prompt = self._build_system_prompt(language)
        user_prompt = self._build_user_prompt(resume_text, target_role)

        # Try Groq first (fast, reliable, free tier)
        if self.groq_key:
            try:
                response = self._call_api(self.groq_url, self.groq_key, self.groq_model, system_prompt, user_prompt)
                return self._parse_response(response)
            except requests.RequestException as e:
                logger.warning(f"Groq failed, falling back to Gemini: {e}")

        # Try Gemini (fallback)
        if self.gemini_key:
            try:
                response = self._call_api(self.gemini_url, self.gemini_key, self.model, system_prompt, user_prompt)
                return self._parse_response(response)
            except requests.RequestException as e:
                logger.error(f"Both Groq and Gemini failed: {e}")

        raise ReviewerParseError(
            "AI service temporarily unavailable. Please try again in a moment."
        )

    def _build_system_prompt(self, language: str) -> str:
        lang_map = {
            "en": "Respond in English.",
            "ur": "Respond in Urdu (اردو).",
            "sd": "Respond in Sindhi (سنڌي).",
        }
        lang_inst = lang_map.get(language, lang_map["en"])

        return f"""You are Asad Shabir, a senior technical recruiter and AI developer.

A job seeker submitted their resume. Provide a constructive review.

{lang_inst}

Output ONLY valid JSON — no markdown, no extra text:

{{
  "summary": "One-paragraph overall assessment.",
  "strengths": ["Strength 1", "Strength 2", ...],
  "weaknesses": ["Weakness 1", "Weakness 2", ...],
  "ats_suggestions": ["ATS tip 1", ...],
  "skill_gaps": ["Gap 1", ...],
  "improvement_tips": ["Tip 1", ...],
  "role_fit": ["Role 1", ...],
  "disclaimer": "This review is AI-generated and indicative."
}}

Guidelines:
- Summary: 2-3 sentences
- Strengths: 2-4 items
- Weaknesses: 2-4 items
- ATS suggestions: 2-3 items
- Skill gaps: 1-3 items
- Improvement tips: 3-5 items
- Role fit: 1-3 roles
- Be constructive and encouraging
- Score range is 0-100 (implicit in summary quality)"""

    def _build_user_prompt(self, resume_text: str, target_role: Optional[str] = None) -> str:
        prompt = f"Resume to review:\n\n{resume_text}"
        if target_role:
            prompt += f"\n\nTarget role: {target_role}"
        return prompt

    def _call_api(self, url: str, api_key: str, model: str, system_prompt: str, user_prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 2000,
        }
        response = requests.post(url, headers=headers, json=payload, timeout=self.timeout)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()

    def _parse_response(self, text: str) -> Dict[str, Any]:
        """Strip markdown fences, parse JSON with repair fallback."""
        text = text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            logger.warning("Standard JSON parse failed, attempting repair...")
            parsed = self._repair_json(text)

        # Validate and fill defaults for required keys
        required_keys = [
            "summary", "strengths", "weaknesses",
            "ats_suggestions", "skill_gaps", "improvement_tips", "role_fit"
        ]
        for key in required_keys:
            if key not in parsed:
                if key == "summary":
                    parsed[key] = "Review generated."
                else:
                    parsed[key] = []

        # Ensure lists
        for key in ("strengths", "weaknesses", "ats_suggestions",
                     "skill_gaps", "improvement_tips", "role_fit"):
            if not isinstance(parsed.get(key), list):
                parsed[key] = []

        if "disclaimer" not in parsed:
            parsed["disclaimer"] = "This review is AI-generated and indicative."

        return parsed

    def _repair_json(self, text: str) -> Dict[str, Any]:
        """Attempt to repair truncated or malformed JSON from LLM output."""
        # Strategy 1: Find last complete `}` and try parsing
        for idx in range(len(text) - 1, -1, -1):
            if text[idx] == "}":
                try:
                    return json.loads(text[: idx + 1])
                except json.JSONDecodeError:
                    continue

        # Strategy 2: Try to extract JSON-like object with regex
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            candidate = match.group(0)
            try:
                return json.loads(candidate)
            except json.JSONDecodeError:
                pass

        # Strategy 3: Build minimal valid response
        logger.error(f"Could not repair reviewer JSON, text length: {len(text)}")
        return {
            "summary": "Review could not be fully parsed from AI output.",
            "strengths": ["Unable to extract strengths"],
            "weaknesses": ["Unable to extract weaknesses"],
            "ats_suggestions": ["Unable to generate ATS suggestions"],
            "skill_gaps": ["Unable to identify skill gaps"],
            "improvement_tips": ["Unable to generate improvement tips"],
            "role_fit": ["Unable to determine role fit"],
            "disclaimer": "This review is AI-generated and indicative. Response was incomplete.",
        }


# ── Singleton ───────────────────────────────────────────────────
_reviewer_service: Optional[ReviewerService] = None


def get_reviewer_service() -> ReviewerService:
    global _reviewer_service
    if _reviewer_service is None:
        gemini_key = os.getenv("GEMINI_API_KEY", "")
        groq_key = os.getenv("GROQ_API_KEY", "")
        if not gemini_key and not groq_key:
            raise ValueError("Either GEMINI_API_KEY or GROQ_API_KEY environment variable is required")
        model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        timeout = int(os.getenv("REVIEWER_TIMEOUT", "45"))
        _reviewer_service = ReviewerService(
            gemini_key=gemini_key, groq_key=groq_key,
            model=model, groq_model=groq_model,
            timeout=timeout,
        )
        logger.info(f"ReviewerService initialized: Gemini={model}, Groq={groq_model}")
    return _reviewer_service
