/**
 * Admin analytics API service.
 * All endpoints require X-Analytics-Password header.
 */

const API_BASE = "/api";

interface AnalyticsSummary {
  resume_downloads: number;
  contact_submissions: number;
  chatbot_sessions: number;
  cta_clicks: number;
  estimator_uses: number;
  reviewer_uses: number;
  email_captures: number;
  subscriber_count: number;
  last_updated: string;
  total_events: number;
}

interface RecentEvent {
  event_type: string;
  timestamp: string;
  metadata: Record<string, string> | null;
}

interface AnalyticsResponse {
  ok: boolean;
  data: AnalyticsSummary;
  recent_events: RecentEvent[];
}

export async function fetchAnalyticsSummary(
  password: string
): Promise<AnalyticsResponse> {
  const res = await fetch(`${API_BASE}/admin/analytics`, {
    headers: {
      "X-Analytics-Password": password,
    },
  });

  if (res.status === 401) {
    throw new Error("Invalid admin password.");
  }
  if (res.status === 503) {
    throw new Error("Analytics admin is not configured on the server.");
  }
  if (!res.ok) {
    throw new Error(`Failed to load analytics (${res.status}).`);
  }

  return res.json() as Promise<AnalyticsResponse>;
}

export async function exportSubscribersCsv(password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/subscribers/export`, {
    headers: {
      "X-Analytics-Password": password,
    },
  });

  if (res.status === 401) {
    throw new Error("Invalid admin password.");
  }
  if (!res.ok) {
    throw new Error(`Failed to export subscribers (${res.status}).`);
  }

  const json = (await res.json()) as { ok: boolean; data: string };
  // Download as CSV file
  const blob = new Blob([json.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export type { AnalyticsSummary, RecentEvent };
