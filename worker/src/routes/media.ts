import { requireAdmin } from "../auth";
import { audit } from "./admin";
import {
  cleanString,
  clamp,
  HttpError,
  json,
  nowIso,
  pageParams,
  randomId,
  type Env,
} from "../types";

const MAX_BYTES = 25 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

const safeKey = (key: string) => /^media\/\d{4}\/\d{2}\/[a-z0-9][a-z0-9._-]{1,140}$/i.test(key);

const mediaUrl = (key: string) => `/api/media/${key}`;

export const serveMedia = async (request: Request, env: Env, key: string) => {
  if (!env.MEDIA) {
    throw new HttpError(503, "R2 media storage is not enabled yet", "r2_not_enabled");
  }
  if (!safeKey(key)) throw new HttpError(400, "Invalid media key", "invalid_key");
  const object = await env.MEDIA.get(key);
  if (!object) throw new HttpError(404, "Media not found", "not_found");

  const etag = object.httpEtag;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { etag } });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", etag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-content-type-options", "nosniff");
  headers.set("access-control-allow-origin", "*");
  if (!headers.has("content-disposition")) {
    const name = object.customMetadata?.name ?? key.split("/").pop() ?? "download";
    headers.set("content-disposition", `inline; filename="${name.replace(/["\\]/g, "")}"`);
  }
  return new Response(object.body, { headers });
};

export const listMedia = async (request: Request, env: Env) => {
  await requireAdmin(request, env);
  const { limit, offset } = pageParams(new URL(request.url));
  const [rows, count, bytes] = await Promise.all([
    env.DB.prepare(
      `SELECT key, url, name, content_type, size, width, height, alt, created_at, created_by
       FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(limit, offset)
      .all(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM media").first<{ n: number }>(),
    env.DB.prepare("SELECT COALESCE(SUM(size), 0) AS bytes FROM media").first<{ bytes: number }>(),
  ]);
  return json({
    ok: true,
    total: count?.n ?? 0,
    bytes: bytes?.bytes ?? 0,
    r2Enabled: Boolean(env.MEDIA),
    limit,
    offset,
    items: (rows.results ?? []).map((row) => ({ ...row, url: mediaUrl(String(row.key)) })),
  });
};

export const uploadMedia = async (request: Request, env: Env) => {
  const admin = await requireAdmin(request, env);
  if (!env.MEDIA) {
    throw new HttpError(
      503,
      "R2 is not enabled. Enable R2 once in the Cloudflare dashboard (Storage & databases → R2), then redeploy.",
      "r2_not_enabled",
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    throw new HttpError(415, "Expected multipart/form-data", "unsupported_media_type");
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new HttpError(400, "A file is required", "missing_file");
  if (file.size > MAX_BYTES) throw new HttpError(413, "File is larger than 25 MB", "too_large");

  const type = file.type.toLowerCase();
  const extension = ALLOWED_TYPES[type];
  if (!extension) throw new HttpError(415, `Unsupported file type: ${type || "unknown"}`, "unsupported_type");

  const requestedKey = cleanString(form.get("key"), 200);
  const now = new Date();
  const folder = `media/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const original = (file.name || "upload").replace(/\.[^.]+$/, "");
  const base = original
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "file";
  const key = requestedKey && safeKey(requestedKey) ? requestedKey : `${folder}/${base}-${randomId("").slice(0, 10)}.${extension}`;
  if (!key.startsWith(folder) && !safeKey(key)) throw new HttpError(400, "Invalid media key", "invalid_key");

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: type,
      cacheControl: "public, max-age=31536000, immutable",
    },
    customMetadata: {
      name: file.name || `${base}.${extension}`,
      uploadedBy: admin.email,
    },
  });

  const width = Number(form.get("width"));
  const height = Number(form.get("height"));
  const alt = cleanString(form.get("alt"), 300) ?? null;
  const url = mediaUrl(key);
  const createdAt = nowIso();

  await env.DB.prepare(
    `INSERT INTO media (key, url, name, content_type, size, width, height, alt, created_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET name = excluded.name, alt = excluded.alt, size = excluded.size`,
  )
    .bind(
      key,
      url,
      file.name || `${base}.${extension}`,
      type,
      file.size,
      Number.isFinite(width) ? clamp(width, 0, 100_000) : null,
      Number.isFinite(height) ? clamp(height, 0, 100_000) : null,
      alt,
      createdAt,
      admin.email,
    )
    .run();

  await audit(env, admin, "media:upload", "media", key, { size: file.size, type });
  return json({ ok: true, key, url, name: file.name, size: file.size, contentType: type }, { status: 201 });
};

export const patchMedia = async (request: Request, env: Env, key: string) => {
  const admin = await requireAdmin(request, env);
  if (!safeKey(key)) throw new HttpError(400, "Invalid media key", "invalid_key");
  const body = (await request.json().catch(() => ({}))) as { alt?: string; name?: string };
  const alt = cleanString(body.alt, 300);
  const name = cleanString(body.name, 200);
  if (alt === undefined && name === undefined) throw new HttpError(400, "Nothing to update", "empty_update");
  const result = await env.DB.prepare(
    `UPDATE media SET alt = COALESCE(?, alt), name = COALESCE(?, name) WHERE key = ?`,
  )
    .bind(alt ?? null, name ?? null, key)
    .run();
  if (!result.meta.changes) throw new HttpError(404, "Media not found", "not_found");
  await audit(env, admin, "media:update", "media", key, { alt, name });
  return json({ ok: true, key, alt, name });
};

export const deleteMedia = async (request: Request, env: Env, key: string) => {
  const admin = await requireAdmin(request, env);
  if (!safeKey(key)) throw new HttpError(400, "Invalid media key", "invalid_key");
  if (env.MEDIA) await env.MEDIA.delete(key);
  await env.DB.prepare("DELETE FROM media WHERE key = ?").bind(key).run();
  await audit(env, admin, "media:delete", "media", key, {});
  return json({ ok: true, deleted: true });
};
