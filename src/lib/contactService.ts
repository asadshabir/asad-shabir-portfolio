/**
 * Contact API service — talks to /api/contact
 * Production: uses VITE_API_URL env var
 * Dev: proxies through Vite dev server
 */

const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  ok: boolean;
  message?: string;
  code?: string;
  details?: Array<{ field: string; error: string }>;
}

export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Backend always returns JSON even on errors — parse once and reuse
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Backend wraps errors in {detail: {ok, code, message}}
      const wrapper = body?.detail as { code?: string; message?: string } | undefined;
      const msg = wrapper?.message ?? wrapper?.code ?? body?.message ?? body?.code ?? `Request failed (${res.status})`;
      // Strip any nested "detail.X.Y:" prefix that leaks internal paths
      const clean = typeof msg === "string"
        ? msg.replace(/^detail\.\w+\.\w+:?\s*/i, "").trim()
        : `Something went wrong (${res.status}). Please try again.`;
      throw new Error(clean);
    }

    return body as ContactResponse;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw err;
  }
}
