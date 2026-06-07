"""
AI Project Estimator Service — Groq API integration.
Uses Groq models for fast, free project estimation.
Returns detailed schema matching EstimateResponse Pydantic model.
"""
import json
import os
import re
from typing import Dict, Any, Optional
import requests

from backend.core.logging import get_logger

logger = get_logger(__name__)


class EstimateParseError(Exception):
    """Raised when AI response cannot be parsed into expected format."""
    pass


class EstimatorService:
    """
    Project estimation using Gemini API (primary) with Groq fallback.
    Output: complexity + timeline + stack + risks + next_steps.
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

    def estimate(
        self,
        project_description: str,
        language: str = "en",
    ) -> Dict[str, Any]:
        """Generate a structured project estimate — tries Gemini first, then Groq."""
        system_prompt = self._build_system_prompt(language)
        user_prompt = f"Project description:\n\n{project_description}"

        # Try Gemini (primary)
        if self.gemini_key:
            try:
                response = self._call_api(self.gemini_url, self.gemini_key, self.model, system_prompt, user_prompt)
                return self._parse_response(response)
            except requests.RequestException as e:
                logger.warning(f"Gemini failed, falling back to Groq: {e}")

        # Try Groq (fallback)
        if self.groq_key:
            try:
                response = self._call_api(self.groq_url, self.groq_key, self.groq_model, system_prompt, user_prompt)
                return self._parse_response(response)
            except requests.RequestException as e:
                logger.error(f"Both Gemini and Groq failed: {e}")

        raise EstimateParseError(
            "AI service temporarily unavailable. Please try again in a moment."
        )

    def _build_system_prompt(self, language: str) -> str:
        lang_map = {
            "en": "Respond in English.",
            "ur": "Respond in Urdu (اردو).",
            "sd": "Respond in Sindhi (سنڌي).",
        }
        lang_inst = lang_map.get(language, lang_map["en"])

        return f"""You are Asad Shabir, an AI full-stack developer from Pakistan.

A potential client described their project. Provide a professional estimate.

{lang_inst}

Output ONLY valid JSON — no markdown, no extra text:

{{
  "complexity": {{
    "level": "Low" | "Medium" | "High" | "Very High",
    "reasons": ["reason 1", "reason 2", ...],
    "red_flags": ["flag 1", ...]
  }},
  "timeline": {{
    "estimate_min_weeks": 4,
    "estimate_max_weeks": 8,
    "assumptions": ["assumption 1", ...]
  }},
  "stack": {{
    "frontend": ["React", "Tailwind"],
    "backend": ["FastAPI", "Python"],
    "ai_ml": ["OpenAI", "LangChain"],
    "infrastructure": ["Docker", "Vercel"]
  }},
  "risks": [
    {{"risk": "...", "severity": "Low" | "Medium" | "High", "mitigation": "..."}}
  ],
  "next_steps": [
    {{"step": "...", "priority": "Immediate" | "Short-term" | "Nice-to-have"}}
  ],
  "disclaimer": "This estimate is indicative and subject to detailed scoping."
}}

Guidelines: realistic, modern stack, 2-4 risks, 3-5 next steps."""

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
        """
        Strip markdown fences, parse JSON with repair fallback.
        Handles common LLM truncation errors.
        """
        text = text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        # Attempt standard parse first
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            # Repair: try to extract and close the JSON object
            logger.warning("Standard JSON parse failed, attempting repair...")
            parsed = self._repair_json(text)

        # Validate top-level keys
        for key in ("complexity", "timeline", "stack", "risks", "next_steps"):
            if key not in parsed:
                raise EstimateParseError(f"Missing key: {key}")

        # Ensure nested fields
        c = parsed["complexity"]
        for k in ("level", "reasons", "red_flags"):
            if k not in c:
                c[k] = [] if k != "level" else "Medium"

        t = parsed["timeline"]
        for k in ("estimate_min_weeks", "estimate_max_weeks", "assumptions"):
            if k not in t:
                t[k] = [] if k == "assumptions" else 4

        s = parsed["stack"]
        for k in ("frontend", "backend", "ai_ml", "infrastructure"):
            if k not in s:
                s[k] = []

        # Validate sub-objects
        for r in parsed.get("risks", []):
            for k in ("risk", "severity", "mitigation"):
                if k not in r:
                    r[k] = "Unknown"
        for n in parsed.get("next_steps", []):
            for k in ("step", "priority"):
                if k not in n:
                    n[k] = "TBD"
        if "disclaimer" not in parsed:
            parsed["disclaimer"] = "This estimate is indicative."

        return parsed

    def _repair_json(self, text: str) -> Dict[str, Any]:
        """
        Attempt to repair truncated or malformed JSON from LLM output.
        Tries progressively more aggressive repair strategies.
        """
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
            # Try closing unclosed strings
            for quote_char in ('"', "'"):
                if candidate.count(quote_char) % 2 != 0:
                    candidate += quote_char
            try:
                return json.loads(candidate)
            except json.JSONDecodeError:
                pass

        # Strategy 3: Build minimal valid response
        logger.error(f"Could not repair JSON, text length: {len(text)}")
        return {
            "complexity": {"level": "Medium", "reasons": ["Could not parse AI response"], "red_flags": []},
            "timeline": {"estimate_min_weeks": 4, "estimate_max_weeks": 8, "assumptions": ["Default estimate"]},
            "stack": {"frontend": ["React"], "backend": ["FastAPI"], "ai_ml": [], "infrastructure": ["Docker"]},
            "risks": [{"risk": "Scope may change", "severity": "Medium", "mitigation": "Start with MVP"}],
            "next_steps": [{"step": "Schedule a consultation", "priority": "Immediate"}],
            "disclaimer": "This estimate is indicative. AI response was incomplete.",
        }


# ── Singleton ───────────────────────────────────────────────────
_estimator_service: Optional[EstimatorService] = None


def get_estimator_service() -> EstimatorService:
    global _estimator_service
    if _estimator_service is None:
        gemini_key = os.getenv("GEMINI_API_KEY", "")
        groq_key = os.getenv("GROQ_API_KEY", "")
        if not gemini_key and not groq_key:
            raise ValueError("Either GEMINI_API_KEY or GROQ_API_KEY environment variable is required")
        model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        timeout = int(os.getenv("ESTIMATOR_TIMEOUT", "45"))
        _estimator_service = EstimatorService(
            gemini_key=gemini_key, groq_key=groq_key,
            model=model, groq_model=groq_model,
            timeout=timeout,
        )
        logger.info(f"EstimatorService initialized: Gemini={model}, Groq={groq_model}")
    return _estimator_service
