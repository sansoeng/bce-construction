export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  MEDIA?: R2Bucket;
  AI?: {
    run: (model: string, input: Record<string, unknown>) => Promise<unknown>;
  };
  VERSION?: { id: string; tag: string; timestamp: string };
  ENVIRONMENT: string;
  /** "true" on staging: reject admin/lead writes so production content stays untouched. */
  READ_ONLY?: string;
  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;
  ADMIN_EMAILS: string;
  PUBLIC_ORIGIN: string;
  ADMIN_ORIGIN: string;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  DEV_ADMIN_EMAIL?: string;
}

export interface DocumentRow {
  id: string;
  type: string;
  slug: string;
  status: "draft" | "published";
  sort: number;
  stage_sort: number | null;
  data: string;
  km: string | null;
  stage_data: string | null;
  stage_km: string | null;
  stage_status: "draft" | "staged" | "deleted" | null;
  stage_updated_at: string | null;
  stage_updated_by: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface AdminIdentity {
  email: string;
  source: "access" | "dev";
}

export class HttpError extends Error {
  status: number;
  code: string;
  constructor(status: number, message: string, code = "error") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const CONTENT_TYPES = [
  "homepage",
  "projects",
  "posts",
  "vacancies",
  "resources",
  "businesses",
  "offerings",
  "pages",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const isContentType = (value: string): value is ContentType =>
  (CONTENT_TYPES as readonly string[]).includes(value);

export const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      ...(init.headers ?? {}),
    },
  });

export const nowIso = () => new Date().toISOString();

export const randomId = (prefix = "") => {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${prefix}${hex}`;
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export const titleFor = (data: Record<string, unknown>, fallback: string) => {
  const candidate = [data.title, data.name, data.label, data.heading].find(
    (v) => typeof v === "string" && v.trim(),
  );
  return typeof candidate === "string" ? candidate.slice(0, 180) : fallback;
};

export const safeJson = <T = unknown>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

/** Stable, non-reversible IP key for rate limits and audit rows (no raw IPs stored). */
export const hashIp = async (ip: string, salt = "bce") => {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

export const toCsv = (rows: Record<string, unknown>[], columns: string[]) => {
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => escape(row[column])).join(",")),
  ].join("\n");
};

export const parseBody = async <T = Record<string, unknown>>(request: Request): Promise<T> => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new HttpError(415, "Expected application/json", "unsupported_media_type");
  }
  const text = await request.text();
  if (text.length > 512_000) throw new HttpError(413, "Request body too large", "too_large");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, "Invalid JSON body", "invalid_json");
  }
};

export const cleanString = (value: unknown, max = 2000): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
};

export const pageParams = (url: URL) => {
  const limit = clamp(Number(url.searchParams.get("limit") ?? 50), 1, 100);
  const offset = clamp(Number(url.searchParams.get("offset") ?? 0), 0, 100_000);
  return { limit, offset };
};

export const AUDIT_RETENTION_DAYS = 180;
