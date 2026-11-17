export type LeadPayload = {
  kind?: "quote" | "contact" | "careers";
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  service?: string;
  project?: string;
  location?: string;
  role?: string;
  message?: string;
  summary?: string;
  turnstileToken?: string;
  website?: string;
  source?: string;
  /** Careers applications and quote drawings; sent as multipart and stored under `leads/…` in R2. */
  files?: File[];
  [key: string]: unknown;
};

export type LeadResult = { ok: true; id: string };

/** Send a website lead to the Cloudflare Worker (D1, optional R2 attachments, optional Telegram/email alert). */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const { files, ...fields } = payload;
  const body = { ...fields, source: fields.source ?? location.pathname + location.search };

  let response: Response;
  if (files && files.length > 0) {
    const form = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value === undefined || value === null || value === "") continue;
      form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
    }
    for (const file of files) form.append("file", file, file.name);
    response = await fetch("/api/leads", {
      method: "POST",
      headers: { accept: "application/json" },
      body: form,
    });
  } else {
    response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
    });
  }

  const data = (await response.json().catch(() => null)) as
    | { ok?: boolean; id?: string; error?: { message?: string } }
    | null;
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Could not send your request. Please call 012 932 700.");
  }
  return { ok: true, id: data?.id ?? "" };
}

/** Shared limit, mirrored from the Worker (worker/src/routes/public.ts). */
export const LEAD_FILE_LIMIT = { maxFiles: 4, maxBytes: 8 * 1024 * 1024, maxTotalBytes: 16 * 1024 * 1024 };

export const LEAD_FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.dwg,.dxf,.xls,.xlsx,.doc,.docx";

/** Client-side check so an oversized or unsupported file is caught before the upload starts. */
export function describeFileProblem(files: File[]): string {
  if (files.length > LEAD_FILE_LIMIT.maxFiles) return `Please attach at most ${LEAD_FILE_LIMIT.maxFiles} files.`;
  const allowed = LEAD_FILE_ACCEPT.split(",").map((value) => value.replace(".", "").toLowerCase());
  let total = 0;
  for (const file of files) {
    const extension = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!allowed.includes(extension)) return `“${file.name}” is not a PDF, image, drawing, Excel or Word file.`;
    if (file.size > LEAD_FILE_LIMIT.maxBytes) return `“${file.name}” is larger than 8 MB.`;
    total += file.size;
  }
  if (total > LEAD_FILE_LIMIT.maxTotalBytes) return "Attachments are larger than 16 MB in total.";
  return "";
}

export const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(Math.round(bytes / 1024), 1)} KB`;
