/**
 * Chatbot API service — talks to /api/chat
 * Uses session_id for multi-turn context.
 * Defensively handles non-JSON responses (e.g., proxy errors).
 * Classifies errors into TRANSIENT (rate limit, timeout, unavailable) vs NON_TRANSIENT (auth, server).
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "/chat";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  language?: "en" | "ur" | "sd";
  session_id?: string;
}

export interface ChatResponse {
  ok: boolean;
  message: {
    role: "assistant";
    content: string;
  };
  language: string;
  session_id?: string;
  code?: string;
}

export type ChatErrorKind =
  | "RATE_LIMIT"   // 429 — transient
  | "TIMEOUT"      // abort / 504 — transient
  | "UNAVAILABLE"   // 503 — transient
  | "AUTH"         // 401 — non-transient
  | "SERVER"       // 500 — non-transient
  | "NETWORK"      // no response / empty — transient
  | "UNKNOWN";     // everything else — non-transient

export interface ChatError {
  kind: ChatErrorKind;
  message: string;
  retryAfter?: string; // human-readable wait time, e.g. "24 minutes"
}

// Parse Groq rate limit detail to extract human-readable wait time
function _parseRateLimitWait(detail: string, language: "en" | "ur" | "sd"): string {
  // Extract seconds from Groq error: "try again in 9.02s" or "try again in 24m43.488s"
  const match = detail.match(/try again in ([\d.]+)([smh])/);
  if (!match) return _defaultWait(language);

  const value = parseFloat(match[1]);
  const unit = match[2];

  if (unit === "s") {
    if (value < 60) return _seconds(Math.ceil(value), language);
    return _minutes(Math.ceil(value / 60), language);
  }
  if (unit === "m") {
    const mins = Math.ceil(value);
    if (mins >= 60) return _hours(Math.ceil(mins / 60), language);
    return _minutes(mins, language);
  }
  if (unit === "h") {
    return _hours(Math.ceil(value), language);
  }

  return _defaultWait(language);
}

function _seconds(n: number, lang: "en" | "ur" | "sd"): string {
  if (lang === "ur") return `${n} سیکنڈ`;
  if (lang === "sd") return `${n} سیکنڈ`;
  return `${n} second${n !== 1 ? "s" : ""}`;
}
function _minutes(n: number, lang: "en" | "ur" | "sd"): string {
  if (lang === "ur") return `${n} منٹ`;
  if (lang === "sd") return `${n} منٹ`;
  return `${n} minute${n !== 1 ? "s" : ""}`;
}
function _hours(n: number, lang: "en" | "ur" | "sd"): string {
  if (lang === "ur") return `${n} گھنٹے`;
  if (lang === "sd") return `${n} گھنٹے`;
  return `${n} hour${n !== 1 ? "s" : ""}`;
}
function _defaultWait(lang: "en" | "ur" | "sd"): string {
  if (lang === "ur") return "کچھ دیر";
  if (lang === "sd") return "ڪجهه وقت";
  return "a moment";
}

// Build a friendly, accurate message from kind + language
function _buildMessage(kind: ChatErrorKind, retryAfter: string | undefined, lang: "en" | "ur" | "sd"): string {
  switch (kind) {
    case "RATE_LIMIT":
      if (lang === "ur") return `روک دیا گیا — براہ کرم ${retryAfter ?? "کچھ دیر"} بعد دوبارہ کوشش کریں۔`;
      if (lang === "sd") return `روڪ ڪيو ويو — مهرباني ڪري ${retryAfter ?? "ڪجهه وقت"} پوءِ ٻيهر ڪوشش ڪريو۔`;
      return `Rate limit reached — please try again in ${retryAfter ?? "a moment"}.`;
    case "TIMEOUT":
      if (lang === "ur") return "ٹائم آؤٹ — براہ کرم دوبارہ کوشش کریں۔";
      if (lang === "sd") return "ٽائيم آئٽ — مهرباني ڪري ٻيهر ڪوشش ڪريو۔";
      return "Request timed out — please try again.";
    case "UNAVAILABLE":
      if (lang === "ur") return "چیٹ عارضی طور پر دستیاب نہیں — براہ کرم تھوڑی دیر بعد کوشش کریں۔";
      if (lang === "sd") return "چیٹ عارضي طور دستیاب نهہ — مهرباني ڪري تھوڙي دير پوءِ ڪوشش ڪريو۔";
      return "Chat is temporarily unavailable — please try again in a moment.";
    case "AUTH":
      if (lang === "ur") return "تصدیق میں خرابی — براہ کرم منتظم سے رابطہ کریں۔";
      if (lang === "sd") return "تصديق ۾ ناڪامي — مهرباني ڪري منتظم سان رابطو ڪريو۔";
      return "Authentication error — please contact the administrator.";
    case "SERVER":
      if (lang === "ur") return "سرور میں خرابی — براہ کرم تھوڑی دیر بعد کوشش کریں۔";
      if (lang === "sd") return "سرور ۾ ناڪامي — مهرباني ڪري تھوڙي دير پوءِ ڪوشش ڪريو۔";
      return "Server error — please try again in a moment.";
    case "NETWORK":
      if (lang === "ur") return "نیٹ ورک خرابی — براہ کرم اپنا کنکشن چیک کریں۔";
      if (lang === "sd") return "نيٽ ورڪ ناڪامي — مهرباني ڪري پنھجي ڪنيڪشن چيڪ ڪريو۔";
      return "Network error — please check your connection.";
    default:
      if (lang === "ur") return "کچھ غلط ہو گیا — براہ کرم دوبارہ کوشش کریں۔";
      if (lang === "sd") return "ڪجهه غلط ٿي ويو — مهرباني ڪري ٻيهر ڪوشش ڪريو۔";
      return "Something went wrong — please try again.";
  }
}

async function _safeJsonParse(
  res: Response,
  lang: "en" | "ur" | "sd"
): Promise<{ data: ChatResponse | null; isJson: boolean; rawText: string; kind: ChatErrorKind; retryAfter?: string }> {
  const rawText = await res.text().catch(() => "");

  if (!rawText.trim()) {
    return { data: null, isJson: false, rawText: "", kind: "NETWORK" };
  }

  try {
    const data = JSON.parse(rawText) as ChatResponse;
    return { data, isJson: true, rawText, kind: "UNKNOWN" };
  } catch {
    if (res.status === 503) {
      return { data: null, isJson: false, rawText, kind: "UNAVAILABLE" };
    }
    if (res.status === 502 || res.status === 504) {
      return { data: null, isJson: false, rawText: "Bad gateway.", kind: "NETWORK" };
    }
    return { data: null, isJson: false, rawText, kind: "UNKNOWN" };
  }
}

export async function sendChat(
  messages: ChatMessage[],
  language: "en" | "ur" | "sd" = "en",
  sessionId?: string
): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        language,
        session_id: sessionId ?? null,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const { data, isJson, rawText, kind: parsedKind } = await _safeJsonParse(res, language);

    // Non-JSON or empty responses
    if (!isJson || data === null) {
      const chatErr: ChatError = {
        kind: parsedKind,
        message: _buildMessage(parsedKind, undefined, language),
      };
      throw chatErr;
    }

    // HTTP error with valid JSON
    if (!res.ok || !data.ok) {
      let kind: ChatErrorKind = "UNKNOWN";
      let retryAfter: string | undefined;

      if (res.status === 429) {
        kind = "RATE_LIMIT";
        retryAfter = _parseRateLimitWait(rawText, language);
      } else if (res.status === 503) {
        kind = "UNAVAILABLE";
      } else if (res.status === 504 || res.status === 0) {
        kind = "TIMEOUT";
      } else if (res.status === 401) {
        kind = "AUTH";
      } else if (res.status >= 500) {
        kind = "SERVER";
      }

      const chatErr: ChatError = {
        kind,
        message: _buildMessage(kind, retryAfter, language),
        retryAfter,
      };
      throw chatErr;
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      throw { kind: "TIMEOUT" as ChatErrorKind, message: _buildMessage("TIMEOUT", undefined, language) } as ChatError;
    }

    // Already a ChatError
    if (err && typeof err === "object" && "kind" in err && "message" in err) {
      throw err as ChatError;
    }

    throw { kind: "UNKNOWN" as ChatErrorKind, message: _buildMessage("UNKNOWN", undefined, language) } as ChatError;
  }
}
