/**
 * Resume Reviewer API service.
 */

const API_BASE = "/api";

export interface ReviewResponse {
  ok: boolean;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  ats_suggestions: string[];
  skill_gaps: string[];
  improvement_tips: string[];
  role_fit: string[];
  disclaimer: string;
}

export async function getReview(
  resumeText: string,
  targetRole: string | undefined,
  language: "en" | "ur" | "sd" = "en"
): Promise<ReviewResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(`${API_BASE}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_text: resumeText,
        target_role: targetRole || null,
        language,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.status === 429) {
      throw new Error("You're going a bit fast — please wait a moment.");
    }
    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      const msg = Array.isArray(body?.detail)
        ? body.detail.map((d: { msg?: string }) => d.msg ?? d).join(", ")
        : body?.detail ?? "Invalid request.";
      throw new Error(msg);
    }
    if (!res.ok) {
      throw new Error("Something went wrong. Please try again.");
    }

    const data: ReviewResponse = await res.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  }
}