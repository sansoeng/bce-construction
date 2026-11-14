import { corsHeaders, withCors } from "./cors";
import { cachedBootstrap } from "./content";
import {
  aiTranslate,
  adminOverview,
  deleteContent,
  deleteLead,
  duplicateContent,
  getContent,
  getLead,
  getSettings,
  importContent,
  listAudit,
  listContent,
  listLeads,
  patchContent,
  patchLead,
  promoteContent,
  publishStaging,
  putSettings,
  reorderContent,
  revalidate,
  upsertContent,
} from "./routes/admin";
import {
  deleteMedia,
  listMedia,
  patchMedia,
  serveMedia,
  uploadMedia,
} from "./routes/media";
import {
  adminMe,
  bootstrap,
  createLead,
  getPublished,
  health,
  listPublished,
  publicSettings,
} from "./routes/public";
import { HttpError, json, type Env } from "./types";

const PUBLIC_CACHE = "public, max-age=30, s-maxage=120, stale-while-revalidate=600";

const segments = (pathname: string) =>
  pathname
    .split("/")
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });

const isAdminHost = (hostname: string) =>
  hostname.startsWith("admin.") ||
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.endsWith(".workers.dev");

const cachePublic = (response: Response) => {
  if (response.status !== 200) return response;
  const headers = new Headers(response.headers);
  if (!headers.has("cache-control")) headers.set("cache-control", PUBLIC_CACHE);
  return new Response(response.body, { status: response.status, headers });
};

const route = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
  const url = new URL(request.url);
  const host = url.hostname;
  const path = url.pathname;
  const parts = segments(path);
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }

  // Only /api/* is served by this Worker. Everything else belongs to Pages.
  if (parts[0] !== "api") return json({ ok: false, error: { code: "not_found", message: "Not found" } }, { status: 404 });

  // Staging is a read-only preview: it shares the content database with production, so
  // every write path (admin mutations, leads) must be refused here.
  if (env.READ_ONLY === "true" && method !== "GET" && method !== "HEAD" && (parts[1] === "admin" || parts[1] === "leads")) {
    return json(
      { ok: false, error: { code: "read_only", message: "Staging is a read-only preview. Publish from the admin console." } },
      { status: 403 },
    );
  }

  // Admin API is reachable only on the Access-protected admin host (or locally).
  if (parts[1] === "admin" && env.ENVIRONMENT === "production" && !isAdminHost(host)) {
    return json({ ok: false, error: { code: "not_found", message: "Not found" } }, { status: 404 });
  }

  // ---------- public ----------
  if (parts[1] === "health" && method === "GET") return health(env);
  if (parts[1] === "content" && parts[2] === "bootstrap" && method === "GET") return bootstrap(request, env);
  if (parts[1] === "settings" && method === "GET") return publicSettings(request, env);

  if (parts[1] === "content" && parts[2] && method === "GET") {
    const type = parts[2];
    if (parts[3]) return cachePublic(await getPublished(request, env, type, parts[3]));
    return cachePublic(await listPublished(request, env, type));
  }

  if (parts[1] === "media" && parts[2] && method === "GET") {
    return serveMedia(request, env, parts.slice(2).join("/"));
  }

  if (parts[1] === "leads" && method === "POST") return createLead(request, env, ctx);

  // ---------- admin ----------
  if (parts[1] === "admin") {
    const tail = parts.slice(2);

    if (tail[0] === "me" && method === "GET") return adminMe(request, env);
    if (tail[0] === "overview" && method === "GET") return adminOverview(request, env);
    if (tail[0] === "audit" && method === "GET") return listAudit(request, env);

    if (tail[0] === "content" && tail[1] === "reorder" && method === "POST") {
      return reorderContent(request, env);
    }
    if (tail[0] === "content" && tail[1] && tail[2] && tail[3] === "duplicate" && method === "POST") {
      return duplicateContent(request, env, tail[1], tail[2]);
    }
    if (tail[0] === "content" && tail[1] && tail[2] && tail[3] === "promote" && method === "POST") {
      return promoteContent(request, env, tail[1], tail[2]);
    }
    if (tail[0] === "publish-staging" && method === "POST") {
      return publishStaging(request, env);
    }
    if (tail[0] === "content" && tail[1] && !tail[2]) {
      if (method === "GET") return listContent(request, env, tail[1]);
      if (method === "POST") return upsertContent(request, env, tail[1]);
    }
    if (tail[0] === "content" && tail[1] && tail[2]) {
      if (method === "GET") return getContent(request, env, tail[1], tail[2]);
      if (method === "PATCH") return patchContent(request, env, tail[1], tail[2]);
      if (method === "PUT" || method === "POST") return upsertContent(request, env, tail[1], tail[2]);
      if (method === "DELETE") return deleteContent(request, env, tail[1], tail[2]);
    }

    if (tail[0] === "leads" && !tail[1] && method === "GET") return listLeads(request, env);
    if (tail[0] === "leads" && tail[1]) {
      if (method === "GET") return getLead(request, env, tail[1]);
      if (method === "PATCH") return patchLead(request, env, tail[1]);
      if (method === "DELETE") return deleteLead(request, env, tail[1]);
    }

    if (tail[0] === "settings") {
      if (method === "GET") return getSettings(request, env);
      if (method === "PUT" || method === "POST") return putSettings(request, env);
    }

    if (tail[0] === "media" && !tail[1]) {
      if (method === "GET") return listMedia(request, env);
      if (method === "POST") return uploadMedia(request, env);
    }
    if (tail[0] === "media" && tail[1]) {
      const key = tail.slice(1).join("/");
      if (method === "PATCH") return patchMedia(request, env, key);
      if (method === "DELETE") return deleteMedia(request, env, key);
    }

    if (tail[0] === "import" && method === "POST") return importContent(request, env);
    if (tail[0] === "revalidate" && method === "POST") return revalidate(request, env);
    if (tail[0] === "ai" && tail[1] === "translate" && method === "POST") return aiTranslate(request, env);
  }

  return json({ ok: false, error: { code: "not_found", message: "Not found" } }, { status: 404 });
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const requestId = crypto.randomUUID();
    try {
      const response = await route(request, env, ctx);
      const headers = new Headers(response.headers);
      headers.set("x-request-id", requestId);
      headers.set("x-content-type-options", "nosniff");
      return withCors(new Response(response.body, { status: response.status, statusText: response.statusText, headers }), request, env);
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      const code = error instanceof HttpError ? error.code : "internal_error";
      const message =
        error instanceof HttpError
          ? error.message
          : env.ENVIRONMENT === "production"
            ? "Something went wrong. Please try again."
            : String(error);
      if (!(error instanceof HttpError)) console.error("bce-api", requestId, error);
      return withCors(json({ ok: false, error: { code, message }, requestId }, { status }), request, env);
    }
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const now = Date.now();
    const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;
    const retention = now - 180 * 24 * 60 * 60 * 1000;

    ctx.waitUntil(
      env.DB.batch([
        env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(twoDaysAgo),
        env.DB.prepare("DELETE FROM audit_log WHERE created_at < ?").bind(new Date(retention).toISOString()),
        env.DB.prepare(
          `INSERT INTO meta (key, value, updated_at) VALUES ('last_cron', ?, ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        ).bind(new Date(now).toISOString(), new Date(now).toISOString()),
      ]),
    );

    // Warm the public caches after housekeeping.
    ctx.waitUntil(cachedBootstrap(env, "production"));
    ctx.waitUntil(cachedBootstrap(env, "staging"));
  },
};
