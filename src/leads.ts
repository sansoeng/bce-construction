export type LeadPayload = {
  kind?: "quote" | "contact" | "careers";
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  service?: string;
  project?: string;
  location?: string;
  message?: string;
  summary?: string;
  turnstileToken?: string;
  website?: string;
  source?: string;
  [key: string]: unknown;
};

export type LeadResult = { ok: true; id: string };

/** Send a website lead to the Cloudflare Worker (D1 + optional Telegram alert). */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ ...payload, source: payload.source ?? location.pathname + location.search }),
  });
  const data = (await response.json().catch(() => null)) as
    | { ok?: boolean; id?: string; error?: { message?: string } }
    | null;
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Could not send your request. Please call 012 932 700.");
  }
  return { ok: true, id: data?.id ?? "" };
}
