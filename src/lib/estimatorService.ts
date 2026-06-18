/**
 * Project Estimator API service.
 */

const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

export interface ComplexityDetail {
  level: string;
  reasons: string[];
  red_flags: string[];
}

export interface TimelineDetail {
  estimate_min_weeks: number;
  estimate_max_weeks: number;
  assumptions: string[];
}

export interface StackRecommendation {
  frontend: string[];
  backend: string[];
  ai_ml: string[];
  infrastructure: string[];
}

export interface RiskItem {
  risk: string;
  severity: "Low" | "Medium" | "High";
  mitigation: string;
}

export interface NextStepItem {
  step: string;
  priority: "Immediate" | "Short-term" | "Nice-to-have";
}

export interface EstimateResponse {
  ok: boolean;
  complexity: ComplexityDetail;
  timeline: TimelineDetail;
  stack: StackRecommendation;
  risks: RiskItem[];
  next_steps: NextStepItem[];
  disclaimer: string;
}

export async function getEstimate(
  projectDescription: string,
  language: "en" | "ur" | "sd" = "en"
): Promise<EstimateResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(`${API_BASE}/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_description: projectDescription,
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

    const data: EstimateResponse = await res.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  }
}
