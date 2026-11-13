import { getAdmin } from "../auth";
import { cachedBootstrap, contentMode, parseSettings, serializeDocument } from "../content";
import { requestIp } from "../cors";
import {
  cleanString,
  hashIp,
  HttpError,
  isContentType,
  json,
  nowIso,
  pageParams,
  randomId,
  type DocumentRow,
  type Env,
} from "../types";

const TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const LEAD_LIMIT_PER_HOUR = 8;

const verifyTurnstile = async (token: string | undefined, ip: string, env: Env) => {
  if (!env.TURNSTILE_SECRET) return env.ENVIRONMENT !== "production";
  if (!token) return false;
  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET);
  body.append("response", token);
  body.append("remoteip", ip);
  const response = await fetch(TURNSTILE_VERIFY, { method: "POST", body });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
};

const bumpRateLimit = async (env: Env, key: string, windowMs: number) => {
  const now = Date.now();
  const cutoff = now - windowMs;
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (key, count, window_start) VALUES (?, 1, ?)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN window_start < ? THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN window_start < ? THEN ? ELSE window_start END
     RETURNING count`,
  )
    .bind(key, now, cutoff, cutoff, now)
    .first<{ count: number }>();
  return row?.count ?? 1;
};

const notifyTelegram = async (env: Env, lead: Record<string, unknown>) => {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const lines = [
    `New BCE ${lead.kind ?? "quote"} request`,
    lead.name ? `Name: ${lead.name}` : "",
    lead.phone ? `Phone: ${lead.phone}` : "",
    lead.email ? `Email: ${lead.email}` : "",
    lead.service ? `Service: ${lead.service}` : "",
    lead.message ? `Message: ${String(lead.message).slice(0, 900)}` : "",
    `ID: ${lead.id}`,
  ].filter(Boolean);
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: lines.join("\n"),
      disable_web_page_preview: true,
    }),
  }).catch(() => undefined);
};

export const health = async (env: Env) => {
  const checks: Record<string, string> = {};
  try {
    await env.DB.prepare("SELECT 1").first();
    checks.d1 = "ok";
  } catch {
    checks.d1 = "error";
  }
  try {
    await env.KV.get("health:probe");
    checks.kv = "ok";
  } catch {
    checks.kv = "error";
  }
  checks.r2 = env.MEDIA ? "bound" : "not_enabled";
  checks.ai = env.AI ? "bound" : "not_bound";
  return json({
    ok: checks.d1 === "ok" && checks.kv === "ok",
    environment: env.ENVIRONMENT,
    version: env.VERSION?.id ?? "dev",
    services: checks,
    time: nowIso(),
  });
};

export const bootstrap = async (request: Request, env: Env) => {
  const mode = contentMode(new URL(request.url).hostname, env.ENVIRONMENT);
  const response = await cachedBootstrap(env, mode);
  const etag = response.headers.get("etag");
  if (etag && request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { etag } });
  }
  return response;
};

const documentColumns = `id, type, slug, status, sort, stage_sort, data, km, stage_data, stage_km, stage_status,
  stage_updated_at, stage_updated_by, created_at, updated_at, updated_by`;

const publishedWhere = (mode: "production" | "staging") =>
  mode === "staging"
    ? `(status = 'published' OR stage_status IS NOT NULL) AND (stage_status IS NULL OR stage_status != 'deleted')`
    : `status = 'published'`;

export const listPublished = async (request: Request, env: Env, type: string) => {
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");
  const mode = contentMode(new URL(request.url).hostname, env.ENVIRONMENT);
  const { limit, offset } = pageParams(new URL(request.url));
  const where = publishedWhere(mode);
  const [rows, count] = await Promise.all([
    env.DB.prepare(
      `SELECT ${documentColumns} FROM documents WHERE type = ? AND ${where}
       ORDER BY ${mode === "staging" ? "COALESCE(stage_sort, sort)" : "sort"} ASC, updated_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(type, limit, offset)
      .all<DocumentRow>(),
    env.DB.prepare(`SELECT COUNT(*) AS n FROM documents WHERE type = ? AND ${where}`)
      .bind(type)
      .first<{ n: number }>(),
  ]);
  return json({
    type,
    mode,
    total: count?.n ?? 0,
    items: (rows.results ?? []).map((row) => serializeDocument(row, mode)),
  });
};

export const getPublished = async (request: Request, env: Env, type: string, slug: string) => {
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");
  const mode = contentMode(new URL(request.url).hostname, env.ENVIRONMENT);
  const row = await env.DB.prepare(
    `SELECT ${documentColumns} FROM documents WHERE type = ? AND slug = ? AND ${publishedWhere(mode)}`,
  )
    .bind(type, slug)
    .first<DocumentRow>();
  if (!row) throw new HttpError(404, "Content not found", "not_found");
  return json(serializeDocument(row, mode));
};

export const publicSettings = async (request: Request, env: Env) => {
  const mode = contentMode(new URL(request.url).hostname, env.ENVIRONMENT);
  const rows = await env.DB.prepare("SELECT key, value, stage_value FROM settings ORDER BY key").all<{
    key: string;
    value: string;
    stage_value: string | null;
  }>();
  const settings = parseSettings(rows.results ?? [], mode);
  return json({
    site: settings.site,
    contact: settings.contact,
    seo: settings.seo,
    features: settings.features,
    turnstileSiteKey: env.TURNSTILE_SITE_KEY,
  });
};

export const createLead = async (request: Request, env: Env, ctx: ExecutionContext) => {
  const body = await jsonBody(request);
  const website = cleanString(body.website, 200);
  if (website) return json({ ok: true, id: "ignored" }, { status: 202 }); // honeypot

  const kind = ["quote", "contact", "careers"].includes(String(body.kind)) ? String(body.kind) : "quote";
  const name = cleanString(body.name ?? body.contact, 160);
  const phone = cleanString(body.phone, 80);
  const email = cleanString(body.email, 200);
  const message = cleanString(body.message ?? body.notes ?? body.summary, 4000);

  if (!name && !phone && !email) throw new HttpError(400, "Add a name, phone or email", "missing_contact");
  if (phone && !/^[+0-9 ().-]{6,40}$/.test(phone)) throw new HttpError(400, "Phone number looks invalid", "invalid_phone");
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new HttpError(400, "Email looks invalid", "invalid_email");

  const ip = requestIp(request);
  const ipHash = await hashIp(ip);
  const count = await bumpRateLimit(env, `lead:${ipHash}`, 60 * 60 * 1000);
  if (count > LEAD_LIMIT_PER_HOUR) {
    throw new HttpError(429, "Too many requests. Please try again later or call 012 932 700.", "rate_limited");
  }

  const verified = await verifyTurnstile(cleanString(body.turnstileToken, 4000), ip, env);
  if (!verified) throw new HttpError(400, "Please complete the security check", "turnstile_failed");

  const id = randomId("lead_");
  const now = nowIso();
  const payload = JSON.stringify(body).slice(0, 24_000);
  await env.DB.prepare(
    `INSERT INTO leads
      (id, kind, status, name, phone, email, company, service, project, location, message, payload, source, ip_hash, user_agent, created_at, updated_at)
     VALUES (?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      kind,
      name ?? null,
      phone ?? null,
      email ?? null,
      cleanString(body.company, 200) ?? null,
      cleanString(body.service, 120) ?? null,
      cleanString(body.project, 200) ?? null,
      cleanString(body.location, 200) ?? null,
      message ?? null,
      payload,
      cleanString(body.source, 120) ?? request.headers.get("referer")?.slice(0, 120) ?? null,
      ipHash,
      request.headers.get("user-agent")?.slice(0, 300) ?? null,
      now,
      now,
    )
    .run();

  ctx.waitUntil(
    notifyTelegram(env, {
      id,
      kind,
      name,
      phone,
      email,
      service: body.service,
      message: message ?? body.summary,
    }),
  );

  return json({ ok: true, id }, { status: 201 });
};

const jsonBody = async (request: Request): Promise<Record<string, unknown>> => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) throw new HttpError(415, "Expected JSON", "unsupported_media_type");
  const text = await request.text();
  if (text.length > 64_000) throw new HttpError(413, "Request too large", "too_large");
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    return parsed as Record<string, unknown>;
  } catch {
    throw new HttpError(400, "Invalid JSON", "invalid_json");
  }
};

export const adminMe = async (request: Request, env: Env) => {
  const admin = await getAdmin(request, env);
  if (!admin) {
    return json(
      { ok: false, authenticated: false, loginUrl: `/cdn-cgi/access/login?redirect_url=${encodeURIComponent(request.url)}` },
      { status: 401 },
    );
  }
  return json({
    ok: true,
    authenticated: true,
    email: admin.email,
    source: admin.source,
    role: "owner",
    permissions: ["content:read", "content:write", "leads:read", "leads:write", "media:write", "settings:write"],
  });
};
