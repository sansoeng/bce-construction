import { requireAdmin } from "../auth";
import {
  bumpContentVersion,
  DEFAULT_SETTINGS,
  invalidateBootstrap,
  parseSettings,
} from "../content";
import {
  clamp,
  cleanString,
  HttpError,
  isContentType,
  json,
  nowIso,
  pageParams,
  parseBody,
  randomId,
  safeJson,
  slugify,
  titleFor,
  type AdminIdentity,
  type DocumentRow,
  type Env,
} from "../types";

export const audit = async (
  env: Env,
  admin: AdminIdentity,
  action: string,
  resourceType: string,
  resourceId: string,
  detail: unknown,
) => {
  await env.DB.prepare(
    `INSERT INTO audit_log (id, actor, action, resource_type, resource_id, detail, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      randomId("aud_"),
      admin.email,
      action,
      resourceType,
      resourceId,
      JSON.stringify(detail).slice(0, 4000),
      nowIso(),
    )
    .run();
};

const validateSlug = (value: unknown, fallback?: string) => {
  const raw = typeof value === "string" && value.trim() ? value : fallback;
  const slug = slugify(String(raw ?? ""));
  if (!slug || slug.length < 2) throw new HttpError(400, "A slug of at least 2 characters is required", "invalid_slug");
  return slug.slice(0, 80);
};

const validateData = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "Document data must be an object", "invalid_data");
  }
  const text = JSON.stringify(value);
  if (text.length > 200_000) throw new HttpError(413, "Document is too large (200 KB max)", "too_large");
  return value as Record<string, unknown>;
};

const validateKm = (value: unknown) => (value ? validateData(value) : null);

const stageStatusFor = (value: unknown): "draft" | "staged" =>
  value === "draft" ? "draft" : "staged";

const slugFromData = (data: Record<string, unknown>) =>
  cleanString(data.slug, 80) ?? cleanString(data.id, 80) ?? undefined;

const identifier = (type: string, slug: string) => `${type}:${slug}`;

const documentColumns = `id, type, slug, status, sort, stage_sort, data, km, stage_data, stage_km, stage_status,
  stage_updated_at, stage_updated_by, created_at, updated_at, updated_by`;

const displayStatus = (row: DocumentRow) =>
  row.stage_status === "deleted" ? "deleted" : row.stage_status ?? row.status;

export const adminOverview = async (request: Request, env: Env) => {
  const admin = await requireAdmin(request, env);

  const [byType, leadStats, media, recentAudit, versions, leadTotal, pending] = await Promise.all([
    env.DB.prepare(
      `SELECT type, status, stage_status, COUNT(*) AS n FROM documents GROUP BY type, status, stage_status ORDER BY type`,
    ).all<{ type: string; status: string; stage_status: string | null; n: number }>(),
    env.DB.prepare(`SELECT status, COUNT(*) AS n FROM leads GROUP BY status ORDER BY status`).all<{
      status: string;
      n: number;
    }>(),
    env.DB.prepare(`SELECT COUNT(*) AS n, COALESCE(SUM(size), 0) AS bytes FROM media`).first<{
      n: number;
      bytes: number;
    }>(),
    env.DB.prepare(
      `SELECT actor, action, resource_type, resource_id, detail, created_at FROM audit_log ORDER BY created_at DESC LIMIT 12`,
    ).all(),
    env.DB.prepare(`SELECT key, value FROM meta WHERE key IN ('content_version','staging_version')`).all<{
      key: string;
      value: string;
    }>(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM leads").first<{ n: number }>(),
    env.DB.prepare(
      `SELECT ((SELECT COUNT(*) FROM documents WHERE stage_status IN ('staged','deleted')) + (SELECT COUNT(*) FROM settings WHERE stage_value IS NOT NULL)) AS n`,
    ).first<{ n: number }>(),
  ]);

  const counts: Record<string, { published: number; staged: number; draft: number; deleted: number }> = {};
  for (const row of byType.results ?? []) {
    counts[row.type] ??= { published: 0, staged: 0, draft: 0, deleted: 0 };
    if (row.status === "published") counts[row.type].published += row.n;
    if (row.stage_status === "deleted") counts[row.type].deleted += row.n;
    else if (row.stage_status === "staged") counts[row.type].staged += row.n;
    else if (row.stage_status === "draft") counts[row.type].draft += row.n;
    else if (row.status === "draft") counts[row.type].draft += row.n;
  }

  const versionMap = Object.fromEntries((versions.results ?? []).map((row) => [row.key, row.value]));

  return json({
    ok: true,
    admin: { email: admin.email, source: admin.source },
    contentVersion: versionMap.content_version ?? "1",
    stagingVersion: versionMap.staging_version ?? "1",
    pendingPublish: pending?.n ?? 0,
    counts,
    leads: {
      total: leadTotal?.n ?? 0,
      byStatus: Object.fromEntries((leadStats.results ?? []).map((row) => [row.status, row.n])),
    },
    media: { count: media?.n ?? 0, bytes: media?.bytes ?? 0 },
    recentAudit: recentAudit.results ?? [],
    services: {
      d1: "ok",
      kv: "bound",
      r2: env.MEDIA ? "bound" : "not_enabled",
      ai: env.AI ? "bound" : "not_bound",
      access: "enforced",
      turnstile: env.TURNSTILE_SECRET ? "enforced" : "dev_only",
    },
    limits: {
      workersRequestsPerDay: 100_000,
      d1RowsWrittenPerDay: 100_000,
      kvWritesPerDay: 1_000,
      r2StorageGb: 10,
      r2ClassAOperationsPerMonth: 1_000_000,
      accessUsers: 50,
      workersAiNeuronsPerDay: 10_000,
    },
  });
};

export const listContent = async (request: Request, env: Env, type: string) => {
  await requireAdmin(request, env);
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");
  const url = new URL(request.url);
  const { limit, offset } = pageParams(url);
  const status = url.searchParams.get("status");
  const q = cleanString(url.searchParams.get("q"), 120);

  const clauses = ["type = ?"];
  const binds: unknown[] = [type];
  if (status === "published") clauses.push("status = 'published'");
  else if (status === "staged") clauses.push("stage_status = 'staged'");
  else if (status === "draft") clauses.push("(stage_status = 'draft' OR (stage_status IS NULL AND status = 'draft'))");
  else if (status === "deleted") clauses.push("stage_status = 'deleted'");

  if (q) {
    clauses.push("(slug LIKE ? OR data LIKE ? OR stage_data LIKE ?)");
    binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const where = clauses.join(" AND ");
  const [rows, count] = await Promise.all([
    env.DB.prepare(
      `SELECT ${documentColumns} FROM documents WHERE ${where}
       ORDER BY COALESCE(stage_sort, sort) ASC, COALESCE(stage_updated_at, updated_at) DESC LIMIT ? OFFSET ?`,
    )
      .bind(...binds, limit, offset)
      .all<DocumentRow>(),
    env.DB.prepare(`SELECT COUNT(*) AS n FROM documents WHERE ${where}`)
      .bind(...binds)
      .first<{ n: number }>(),
  ]);

  return json({
    ok: true,
    type,
    total: count?.n ?? 0,
    limit,
    offset,
    items: (rows.results ?? []).map((row) => {
      const active = safeJson<Record<string, unknown>>(row.stage_data ?? row.data, {});
      return {
        id: row.id,
        slug: row.slug,
        status: displayStatus(row),
        live: row.status === "published",
        stageStatus: row.stage_status,
        hasStage: row.stage_data !== null,
        hasKm: Boolean(row.km || row.stage_km),
        sort: row.stage_sort ?? row.sort,
        title: titleFor(active, row.slug),
        excerpt: cleanString(active.summary ?? active.excerpt ?? active.overview ?? active.description, 180),
        image: cleanString(active.image ?? active.heroImage ?? active.downloadUrl, 400),
        updatedAt: row.stage_updated_at ?? row.updated_at,
        updatedBy: row.stage_updated_by ?? row.updated_by,
      };
    }),
  });
};

export const getContent = async (request: Request, env: Env, type: string, slug: string) => {
  await requireAdmin(request, env);
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");
  const row = await env.DB.prepare(
    `SELECT ${documentColumns} FROM documents WHERE type = ? AND slug = ?`,
  )
    .bind(type, slug)
    .first<DocumentRow>();
  if (!row) throw new HttpError(404, "Content not found", "not_found");
  return json({
    ok: true,
    id: row.id,
    type: row.type,
    slug: row.slug,
    status: row.status,
    stageStatus: row.stage_status,
    hasStage: row.stage_data !== null,
    hasKm: Boolean(row.km || row.stage_km),
    sort: row.stage_sort ?? row.sort,
    data: safeJson<Record<string, unknown>>(row.data, {}),
    km: row.km ? safeJson<Record<string, unknown>>(row.km, {}) : null,
    stageData: row.stage_data ? safeJson<Record<string, unknown>>(row.stage_data, {}) : null,
    stageKm: row.stage_km ? safeJson<Record<string, unknown>>(row.stage_km, {}) : null,
    createdAt: row.created_at,
    updatedAt: row.stage_updated_at ?? row.updated_at,
    updatedBy: row.stage_updated_by ?? row.updated_by,
  });
};

export const upsertContent = async (request: Request, env: Env, type: string, existingSlug?: string) => {
  const admin = await requireAdmin(request, env);
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");
  const body = await parseBody<{ slug?: string; status?: string; sort?: number; data?: unknown; km?: unknown }>(request);
  const data = validateData(body.data ?? {});
  const km = validateKm(body.km);
  const slug = validateSlug(body.slug, existingSlug ?? slugFromData(data));
  const stageStatus = stageStatusFor(body.status);
  const now = nowIso();

  const existing = await env.DB.prepare(
    `SELECT sort, created_at, status FROM documents WHERE type = ? AND slug = ?`,
  )
    .bind(type, existingSlug ?? slug)
    .first<{ sort: number; created_at: string; status: string }>();

  const sort = Number.isFinite(Number(body.sort)) ? clamp(Number(body.sort), 0, 100_000) : (existing?.sort ?? 0);
  const createdAt = existing?.created_at ?? now;

  if (existing) {
    await env.DB.prepare(
      `UPDATE documents SET slug = ?, stage_sort = ?, stage_data = ?, stage_km = ?, stage_status = ?,
         stage_updated_at = ?, stage_updated_by = ?, updated_at = ?, updated_by = ? WHERE type = ? AND slug = ?`,
    )
      .bind(slug, sort, JSON.stringify(data), km ? JSON.stringify(km) : null, stageStatus, now, admin.email, now, admin.email, type, existingSlug ?? slug)
      .run();
    if (existingSlug && existingSlug !== slug) {
      await env.DB.prepare(`UPDATE documents SET id = ? WHERE type = ? AND slug = ?`)
        .bind(identifier(type, slug), type, slug)
        .run();
    }
  } else {
    await env.DB.prepare(
      `INSERT INTO documents
        (id, type, slug, status, sort, stage_sort, data, km, stage_data, stage_km, stage_status, stage_updated_at, stage_updated_by, created_at, updated_at, updated_by)
       VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        identifier(type, slug),
        type,
        slug,
        sort,
        sort,
        JSON.stringify(data),
        km ? JSON.stringify(km) : null,
        JSON.stringify(data),
        km ? JSON.stringify(km) : null,
        stageStatus,
        now,
        admin.email,
        createdAt,
        now,
        admin.email,
      )
      .run();
  }

  await audit(env, admin, "stage", type, slug, { stageStatus, sort, hasKm: Boolean(km) });
  const version = await bumpContentVersion(env, "staging");
  await invalidateBootstrap(env, "staging", String(Number(version) - 1));
  return json({ ok: true, type, slug, status: stageStatus, stageStatus, hasStage: true, version });
};

export const patchContent = async (request: Request, env: Env, type: string, slug: string) => {
  const admin = await requireAdmin(request, env);
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");
  const body = await parseBody<{ slug?: string; status?: string; sort?: number; data?: unknown; km?: unknown }>(request);

  const row = await env.DB.prepare(`SELECT ${documentColumns} FROM documents WHERE type = ? AND slug = ?`)
    .bind(type, slug)
    .first<DocumentRow>();
  if (!row) throw new HttpError(404, "Content not found", "not_found");

  const nextData = body.data
    ? validateData(body.data)
    : safeJson<Record<string, unknown>>(row.stage_data ?? row.data, {});
  const nextKm =
    body.km !== undefined
      ? validateKm(body.km)
      : row.stage_km
        ? safeJson<Record<string, unknown>>(row.stage_km, {})
        : row.km
          ? safeJson<Record<string, unknown>>(row.km, {})
          : null;
  const nextSlug = body.slug ? validateSlug(body.slug) : slug;
  const nextStageStatus = body.status ? stageStatusFor(body.status) : row.stage_status ?? "staged";
  const nextSort = Number.isFinite(Number(body.sort)) ? clamp(Number(body.sort), 0, 100_000) : row.sort;
  const now = nowIso();

  await env.DB.prepare(
    `UPDATE documents SET slug = ?, stage_sort = ?, stage_data = ?, stage_km = ?, stage_status = ?,
       stage_updated_at = ?, stage_updated_by = ?, updated_at = ?, updated_by = ? WHERE id = ?`,
  )
    .bind(
      nextSlug,
      nextSort,
      JSON.stringify(nextData),
      nextKm ? JSON.stringify(nextKm) : null,
      nextStageStatus,
      now,
      admin.email,
      now,
      admin.email,
      row.id,
    )
    .run();

  if (nextSlug !== slug) {
    await env.DB.prepare(`UPDATE documents SET id = ? WHERE type = ? AND slug = ?`)
      .bind(identifier(type, nextSlug), type, nextSlug)
      .run();
  }

  await audit(env, admin, "stage:patch", type, nextSlug, { stageStatus: nextStageStatus, sort: nextSort });
  const version = await bumpContentVersion(env, "staging");
  await invalidateBootstrap(env, "staging", String(Number(version) - 1));
  return json({ ok: true, type, slug: nextSlug, status: nextStageStatus, stageStatus: nextStageStatus, version });
};

export const deleteContent = async (request: Request, env: Env, type: string, slug: string) => {
  const admin = await requireAdmin(request, env);
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");

  const row = await env.DB.prepare(`SELECT status, stage_status FROM documents WHERE type = ? AND slug = ?`)
    .bind(type, slug)
    .first<{ status: string; stage_status: string | null }>();
  if (!row) throw new HttpError(404, "Content not found", "not_found");

  const now = nowIso();
  if (row.status === "published") {
    await env.DB.prepare(
      `UPDATE documents SET stage_status = 'deleted', stage_updated_at = ?, stage_updated_by = ? WHERE type = ? AND slug = ?`,
    )
      .bind(now, admin.email, type, slug)
      .run();
    await audit(env, admin, "stage:delete", type, slug, {});
    const version = await bumpContentVersion(env, "staging");
    await invalidateBootstrap(env, "staging", String(Number(version) - 1));
    return json({ ok: true, deleted: false, staged: true, version });
  }

  await env.DB.prepare(`DELETE FROM documents WHERE type = ? AND slug = ?`).bind(type, slug).run();
  await audit(env, admin, "delete", type, slug, {});
  const version = await bumpContentVersion(env, "staging");
  await invalidateBootstrap(env, "staging", String(Number(version) - 1));
  return json({ ok: true, deleted: true, version });
};

export const promoteContent = async (request: Request, env: Env, type: string, slug: string) => {
  const admin = await requireAdmin(request, env);
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");

  const row = await env.DB.prepare(`SELECT ${documentColumns} FROM documents WHERE type = ? AND slug = ?`)
    .bind(type, slug)
    .first<DocumentRow>();
  if (!row) throw new HttpError(404, "Content not found", "not_found");
  if (!row.stage_data && !row.stage_status) throw new HttpError(400, "Nothing staged to promote", "nothing_staged");

  const now = nowIso();

  if (row.stage_status === "deleted") {
    await env.DB.prepare(`DELETE FROM documents WHERE id = ?`).bind(row.id).run();
    await audit(env, admin, "promote:delete", type, slug, {});
  } else {
    await env.DB.prepare(
      `UPDATE documents SET data = COALESCE(stage_data, data), km = COALESCE(stage_km, km), status = 'published',
         sort = COALESCE(stage_sort, sort), stage_sort = NULL,
         stage_data = NULL, stage_km = NULL, stage_status = NULL, stage_updated_at = NULL, stage_updated_by = NULL,
         updated_at = ?, updated_by = ? WHERE id = ?`,
    )
      .bind(now, admin.email, row.id)
      .run();
    await audit(env, admin, "promote", type, slug, {});
  }

  const productionVersion = await bumpContentVersion(env, "production");
  const stagingVersion = await bumpContentVersion(env, "staging");
  await invalidateBootstrap(env, "production", String(Number(productionVersion) - 1));
  await invalidateBootstrap(env, "staging", String(Number(stagingVersion) - 1));
  return json({ ok: true, published: row.stage_status !== "deleted", version: productionVersion });
};

export const publishStaging = async (request: Request, env: Env) => {
  const admin = await requireAdmin(request, env);
  const [rows, settingsCount] = await Promise.all([
    env.DB.prepare(
      `SELECT id, type, slug, stage_status FROM documents WHERE stage_status IN ('staged','deleted') LIMIT 500`,
    ).all<{ id: string; type: string; slug: string; stage_status: string }>(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM settings WHERE stage_value IS NOT NULL").first<{ n: number }>(),
  ]);

  const items = rows.results ?? [];
  const hasSettings = (settingsCount?.n ?? 0) > 0;
  if (!items.length && !hasSettings) {
    return json({ ok: true, published: 0, deleted: 0, settings: 0, version: await bumpContentVersion(env, "production") });
  }

  const now = nowIso();
  const statements = items.map((row) =>
    row.stage_status === "deleted"
      ? env.DB.prepare(`DELETE FROM documents WHERE id = ?`).bind(row.id)
      : env.DB.prepare(
          `UPDATE documents SET data = COALESCE(stage_data, data), km = COALESCE(stage_km, km), status = 'published',
             sort = COALESCE(stage_sort, sort), stage_sort = NULL,
             stage_data = NULL, stage_km = NULL, stage_status = NULL, stage_updated_at = NULL, stage_updated_by = NULL,
             updated_at = ?, updated_by = ? WHERE id = ?`,
        ).bind(now, admin.email, row.id),
  );

  if (hasSettings) {
    statements.push(
      env.DB.prepare(
        `UPDATE settings SET value = stage_value, stage_value = NULL, stage_updated_at = NULL, stage_updated_by = NULL,
           updated_at = ?, updated_by = ? WHERE stage_value IS NOT NULL`,
      ).bind(now, admin.email) as never,
    );
  }

  await env.DB.batch(statements);
  await audit(env, admin, "publish:staging", "documents", "bulk", {
    published: items.filter((row) => row.stage_status !== "deleted").length,
    deleted: items.filter((row) => row.stage_status === "deleted").length,
    settings: hasSettings,
  });

  const productionVersion = await bumpContentVersion(env, "production");
  const stagingVersion = await bumpContentVersion(env, "staging");
  await invalidateBootstrap(env, "production", String(Number(productionVersion) - 1));
  await invalidateBootstrap(env, "staging", String(Number(stagingVersion) - 1));

  return json({
    ok: true,
    published: items.filter((row) => row.stage_status !== "deleted").length,
    deleted: items.filter((row) => row.stage_status === "deleted").length,
    settings: hasSettings ? 1 : 0,
    version: productionVersion,
  });
};

export const duplicateContent = async (request: Request, env: Env, type: string, slug: string) => {
  const admin = await requireAdmin(request, env);
  if (!isContentType(type)) throw new HttpError(404, "Unknown content type", "unknown_type");
  const body = await parseBody<{ slug?: string }>(request).catch(() => ({ slug: undefined }));
  const row = await env.DB.prepare(`SELECT data, km, stage_data, stage_km FROM documents WHERE type = ? AND slug = ?`)
    .bind(type, slug)
    .first<{ data: string; km: string | null; stage_data: string | null; stage_km: string | null }>();
  if (!row) throw new HttpError(404, "Content not found", "not_found");

  const data = safeJson<Record<string, unknown>>(row.stage_data ?? row.data, {});
  const km = row.stage_km ?? row.km;
  const base = body.slug ? validateSlug(body.slug) : `${slug}-copy`;
  let next = base;
  for (let i = 2; i < 50; i++) {
    const exists = await env.DB.prepare(`SELECT 1 FROM documents WHERE type = ? AND slug = ?`).bind(type, next).first();
    if (!exists) break;
    next = `${base}-${i}`;
  }

  const now = nowIso();
  data.slug = next;
  if (type === "vacancies" || type === "resources") data.id = next;
  await env.DB.prepare(
    `INSERT INTO documents
      (id, type, slug, status, sort, stage_sort, data, km, stage_data, stage_km, stage_status, stage_updated_at, stage_updated_by, created_at, updated_at, updated_by)
     VALUES (?, ?, ?, 'draft', 0, 0, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?)`,
  )
    .bind(
      identifier(type, next),
      type,
      next,
      JSON.stringify(data),
      km,
      JSON.stringify(data),
      km,
      now,
      admin.email,
      now,
      now,
      admin.email,
    )
    .run();
  await audit(env, admin, "duplicate", type, next, { from: slug });
  const version = await bumpContentVersion(env, "staging");
  return json({ ok: true, type, slug: next, version });
};

export const reorderContent = async (request: Request, env: Env) => {
  const admin = await requireAdmin(request, env);
  const body = await parseBody<{ items?: { type: string; slug: string; sort: number }[] }>(request);
  const items = (body.items ?? []).slice(0, 300);
  const now = nowIso();
  const statements = items
    .filter((item) => isContentType(item.type) && item.slug)
    .map((item) =>
      env.DB.prepare(`UPDATE documents SET stage_sort = ?, stage_updated_at = ?, stage_updated_by = ? WHERE type = ? AND slug = ?`).bind(
        clamp(Number(item.sort) || 0, 0, 100_000),
        now,
        admin.email,
        item.type,
        item.slug,
      ),
    );
  if (statements.length) await env.DB.batch(statements);
  await audit(env, admin, "reorder", "documents", "bulk", { count: statements.length });
  const version = await bumpContentVersion(env, "staging");
  return json({ ok: true, updated: statements.length, version });
};

export const listLeads = async (request: Request, env: Env) => {
  await requireAdmin(request, env);
  const url = new URL(request.url);
  const { limit, offset } = pageParams(url);
  const status = cleanString(url.searchParams.get("status"), 40);
  const q = cleanString(url.searchParams.get("q"), 120);
  const clauses = ["1=1"];
  const binds: unknown[] = [];
  if (status && status !== "all") {
    clauses.push("status = ?");
    binds.push(status);
  }
  if (q) {
    clauses.push("(name LIKE ? OR phone LIKE ? OR email LIKE ? OR message LIKE ? OR project LIKE ?)");
    binds.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }
  const where = clauses.join(" AND ");
  const [rows, count] = await Promise.all([
    env.DB.prepare(
      `SELECT id, kind, status, name, phone, email, company, service, project, location, message,
              source, notes, created_at, updated_at FROM leads WHERE ${where}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(...binds, limit, offset)
      .all(),
    env.DB.prepare(`SELECT COUNT(*) AS n FROM leads WHERE ${where}`)
      .bind(...binds)
      .first<{ n: number }>(),
  ]);
  return json({ ok: true, total: count?.n ?? 0, limit, offset, items: rows.results ?? [] });
};

export const getLead = async (request: Request, env: Env, id: string) => {
  await requireAdmin(request, env);
  const row = await env.DB.prepare(`SELECT * FROM leads WHERE id = ?`).bind(id).first();
  if (!row) throw new HttpError(404, "Lead not found", "not_found");
  return json({ ok: true, lead: row });
};

export const patchLead = async (request: Request, env: Env, id: string) => {
  const admin = await requireAdmin(request, env);
  const body = await parseBody<{ status?: string; notes?: string }>(request);
  const statuses = ["new", "contacted", "quoted", "won", "closed", "spam"];
  const status = body.status && statuses.includes(body.status) ? body.status : undefined;
  const notes = cleanString(body.notes, 4000);
  if (!status && notes === undefined) throw new HttpError(400, "Nothing to update", "empty_update");
  const now = nowIso();
  const result = await env.DB.prepare(
    `UPDATE leads SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = ?, updated_by = ? WHERE id = ?`,
  )
    .bind(status ?? null, notes ?? null, now, admin.email, id)
    .run();
  if (!result.meta.changes) throw new HttpError(404, "Lead not found", "not_found");
  await audit(env, admin, "lead:update", "leads", id, { status, notes });
  return json({ ok: true, id, status, notes });
};

export const deleteLead = async (request: Request, env: Env, id: string) => {
  const admin = await requireAdmin(request, env);
  const result = await env.DB.prepare(`DELETE FROM leads WHERE id = ?`).bind(id).run();
  if (!result.meta.changes) throw new HttpError(404, "Lead not found", "not_found");
  await audit(env, admin, "lead:delete", "leads", id, {});
  return json({ ok: true, deleted: true });
};

export const getSettings = async (request: Request, env: Env) => {
  await requireAdmin(request, env);
  const rows = await env.DB.prepare(
    `SELECT key, value, stage_value, updated_at, updated_by, stage_updated_at, stage_updated_by FROM settings ORDER BY key`,
  ).all<{
    key: string;
    value: string;
    stage_value: string | null;
    updated_at: string;
    updated_by: string;
    stage_updated_at: string | null;
    stage_updated_by: string | null;
  }>();
  const results = rows.results ?? [];
  return json({
    ok: true,
    settings: parseSettings(results, "staging"),
    defaults: DEFAULT_SETTINGS,
    rows: results,
  });
};

export const putSettings = async (request: Request, env: Env) => {
  const admin = await requireAdmin(request, env);
  const body = await parseBody<Record<string, unknown>>(request);
  const now = nowIso();
  const statements = Object.entries(body)
    .filter(([key]) => /^[a-z][a-z0-9_]{1,40}$/.test(key))
    .slice(0, 60)
    .map(([key, value]) =>
      env.DB.prepare(
        `INSERT INTO settings (key, value, stage_value, updated_at, updated_by, stage_updated_at, stage_updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET stage_value = excluded.stage_value,
           stage_updated_at = excluded.stage_updated_at, stage_updated_by = excluded.stage_updated_by`,
      ).bind(key, JSON.stringify(value), JSON.stringify(value), now, admin.email, now, admin.email),
    );
  if (!statements.length) throw new HttpError(400, "No valid settings supplied", "empty_update");
  await env.DB.batch(statements);
  await audit(env, admin, "settings:stage", "settings", "all", Object.keys(body));
  const version = await bumpContentVersion(env, "staging");
  await invalidateBootstrap(env, "staging", String(Number(version) - 1));
  return json({ ok: true, updated: statements.length, version });
};

export const listAudit = async (request: Request, env: Env) => {
  await requireAdmin(request, env);
  const { limit, offset } = pageParams(new URL(request.url));
  const [rows, count] = await Promise.all([
    env.DB.prepare(
      `SELECT id, actor, action, resource_type, resource_id, detail, created_at
       FROM audit_log ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(limit, offset)
      .all(),
    env.DB.prepare(`SELECT COUNT(*) AS n FROM audit_log`).first<{ n: number }>(),
  ]);
  return json({ ok: true, total: count?.n ?? 0, limit, offset, items: rows.results ?? [] });
};

export const importContent = async (request: Request, env: Env) => {
  const admin = await requireAdmin(request, env);
  const body = await parseBody<{
    documents?: { type: string; slug: string; status?: string; sort?: number; data: unknown; km?: unknown }[];
  }>(request);
  const items = (body.documents ?? []).slice(0, 100);
  if (!items.length) throw new HttpError(400, "No documents to import", "empty_import");

  const now = nowIso();
  const statements = items
    .filter((item) => isContentType(item.type))
    .map((item) => {
      const data = validateData(item.data);
      const km = validateKm(item.km);
      const slug = validateSlug(item.slug, slugFromData(data));
      const stageStatus = stageStatusFor(item.status);
      return env.DB.prepare(
        `INSERT INTO documents
          (id, type, slug, status, sort, stage_sort, data, km, stage_data, stage_km, stage_status, stage_updated_at, stage_updated_by, created_at, updated_at, updated_by)
         VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           stage_data = excluded.stage_data, stage_km = excluded.stage_km, stage_status = excluded.stage_status,
           stage_updated_at = excluded.stage_updated_at, stage_updated_by = excluded.stage_updated_by,
           updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
      ).bind(
        identifier(item.type, slug),
        item.type,
        slug,
        clamp(Number(item.sort) || 0, 0, 100_000),
        clamp(Number(item.sort) || 0, 0, 100_000),
        JSON.stringify(data),
        km ? JSON.stringify(km) : null,
        JSON.stringify(data),
        km ? JSON.stringify(km) : null,
        stageStatus,
        now,
        admin.email,
        now,
        now,
        admin.email,
      );
    });

  if (!statements.length) throw new HttpError(400, "No valid documents", "invalid_import");
  await env.DB.batch(statements);
  await audit(env, admin, "import", "documents", "bulk", { count: statements.length });
  const version = await bumpContentVersion(env, "staging");
  await invalidateBootstrap(env, "staging", String(Number(version) - 1));
  return json({ ok: true, imported: statements.length, version });
};

export const revalidate = async (request: Request, env: Env) => {
  const admin = await requireAdmin(request, env);
  const productionVersion = await bumpContentVersion(env, "production");
  const stagingVersion = await bumpContentVersion(env, "staging");
  await invalidateBootstrap(env, "production", String(Number(productionVersion) - 1));
  await invalidateBootstrap(env, "staging", String(Number(stagingVersion) - 1));
  await audit(env, admin, "revalidate", "cache", "bootstrap", { productionVersion, stagingVersion });
  return json({ ok: true, version: productionVersion, stagingVersion });
};

export const aiTranslate = async (request: Request, env: Env) => {
  const admin = await requireAdmin(request, env);
  if (!env.AI) throw new HttpError(503, "Workers AI is not bound", "ai_unavailable");
  const body = await parseBody<{ text?: string; target?: string; source?: string }>(request);
  const text = cleanString(body.text, 3500);
  if (!text) throw new HttpError(400, "Text is required", "missing_text");
  const target = body.target === "en" ? "en" : "km";
  const source = body.source === "km" ? "km" : "en";

  const result = (await env.AI.run("@cf/meta/m2m100-1.2b", {
    text,
    source_lang: source,
    target_lang: target,
  })) as { translated_text?: string };

  await audit(env, admin, "ai:translate", "ai", target, { chars: text.length });
  return json({ ok: true, translated: result.translated_text ?? "", target });
};
