const API_BASE = "/api";

export type EventType =
  | "resume_download"
  | "contact_submission"
  | "chatbot_session"
  | "cta_click"
  | "estimator_use"
  | "reviewer_use"
  | "email_capture"
  | "blog_view";

interface TrackEventOptions {
  metadata?: Record<string, string>;
  visitorEmail?: string;
}

export async function trackEvent(
  eventType: EventType,
  options: TrackEventOptions = {}
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        metadata: options.metadata ?? null,
        visitor_email: options.visitorEmail ?? null,
      }),
    });
    return await res.json();
  } catch {
    // Silently fail — analytics should never break user experience
    return { ok: false };
  }
}
