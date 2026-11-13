import { safeJson, type DocumentRow, type Env } from "./types";

export type ContentMode = "production" | "staging";

/** Staging hosts read the pending `stage_*` version; production reads only published data. */
export const contentMode = (hostname: string, environment = "production"): ContentMode =>
  environment !== "production" ||
  hostname.startsWith("staging.") ||
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.endsWith(".pages.dev")
    ? "staging"
    : "production";

export const DEFAULT_SETTINGS: Record<string, unknown> = {
  site: {
    nameEn: "Battambang Construction and Engineering Co., Ltd.",
    nameKm: "ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី",
    shortName: "BCE",
    founded: 1995,
    tagline: "Building Cambodia's foundations since 1995",
  },
  contact: {
    phones: ["012 932 700", "017 222 205", "012 867 475", "070 867 475"],
    email: "bcebtb999@gmail.com",
    telegram: "@thendLP",
    address: "Ang Village, Sangkat O'Char, Battambang City, Battambang Province, Kingdom of Cambodia",
    hours: "Monday – Sunday, 6:30 AM – 5:30 PM",
  },
  seo: {
    title: "BCE — Battambang Construction and Engineering Co., Ltd.",
    description:
      "Ready-mix concrete, piling, civil construction, concrete slab works and fleet hire across 14 Cambodian provinces since 1995.",
    ogImage: "/Image/bce/hero_batching_plant.webp",
  },
  features: {
    leadsEnabled: true,
    aiAssistEnabled: true,
    mediaEnabled: true,
  },
};

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export const parseSettings = (
  rows: { key: string; value: string; stage_value?: string | null }[],
  mode: ContentMode = "production",
) => {
  const settings: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    const raw = mode === "staging" && row.stage_value ? row.stage_value : row.value;
    settings[row.key] = safeJson(raw, raw);
  }
  return settings;
};

export const serializeDocument = (row: DocumentRow, mode: ContentMode = "production") => {
  const useStage = mode === "staging" && row.stage_data !== null;
  const data = safeJson<Record<string, unknown>>(useStage ? row.stage_data! : row.data, {});
  const kmRaw = useStage ? row.stage_km ?? row.km : row.km;
  const km = kmRaw ? safeJson<Record<string, unknown>>(kmRaw, {}) : null;

  // Keep the identifier inside the document so the public site can use it directly.
  if (row.type === "vacancies" || row.type === "resources") {
    if (!data.id) data.id = row.slug;
  } else if (!data.slug) {
    data.slug = row.slug;
  }

  return {
    ...data,
    __km: km,
    _meta: {
      type: row.type,
      slug: row.slug,
      status: mode === "staging" ? row.stage_status ?? row.status : row.status,
      stageStatus: row.stage_status,
      hasStage: row.stage_data !== null,
      sort: mode === "staging" ? row.stage_sort ?? row.sort : row.sort,
      createdAt: row.created_at,
      updatedAt: row.stage_updated_at ?? row.updated_at,
      mode,
    },
  };
};

const versionKey = (mode: ContentMode) => (mode === "staging" ? "staging_version" : "content_version");

export const getContentVersion = async (env: Env, mode: ContentMode = "production") => {
  const row = await env.DB.prepare("SELECT value FROM meta WHERE key = ?")
    .bind(versionKey(mode))
    .first<{ value: string }>();
  return row?.value ?? "1";
};

export const bumpContentVersion = async (env: Env, mode: ContentMode = "production") => {
  const now = new Date().toISOString();
  const key = versionKey(mode);
  await env.DB.prepare(
    `INSERT INTO meta (key, value, updated_at) VALUES (?, '2', ?)
     ON CONFLICT(key) DO UPDATE SET value = CAST(CAST(meta.value AS INTEGER) + 1 AS TEXT), updated_at = excluded.updated_at`,
  )
    .bind(key, now)
    .run();
  return getContentVersion(env, mode);
};

const documentColumns = `id, type, slug, status, sort, stage_sort, data, km, stage_data, stage_km, stage_status,
  stage_updated_at, stage_updated_by, created_at, updated_at, updated_by`;

export const buildBootstrap = async (env: Env, mode: ContentMode = "production") => {
  const where =
    mode === "staging"
      ? `(status = 'published' OR stage_status IS NOT NULL) AND (stage_status IS NULL OR stage_status != 'deleted')`
      : `status = 'published'`;

  const [version, documents, settingRows] = await Promise.all([
    getContentVersion(env, mode),
    env.DB.prepare(
      `SELECT ${documentColumns} FROM documents WHERE ${where}
       ORDER BY type ASC, ${mode === "staging" ? "COALESCE(stage_sort, sort)" : "sort"} ASC, updated_at DESC`,
    ).all<DocumentRow>(),
    env.DB.prepare("SELECT key, value, stage_value FROM settings ORDER BY key").all<{
      key: string;
      value: string;
      stage_value: string | null;
    }>(),
  ]);

  const content: Record<string, unknown[]> = {};
  for (const row of documents.results ?? []) {
    if (!content[row.type]) content[row.type] = [];
    content[row.type].push(serializeDocument(row, mode));
  }

  return {
    version,
    mode,
    generatedAt: new Date().toISOString(),
    content,
    settings: parseSettings(settingRows.results ?? [], mode),
  };
};

const cacheRequest = (version: string, mode: ContentMode) =>
  new Request(`https://bce-cache.internal/api/content/bootstrap?mode=${mode}&v=${encodeURIComponent(version)}`);

export const cachedBootstrap = async (env: Env, mode: ContentMode = "production"): Promise<Response> => {
  const version = await getContentVersion(env, mode);
  const request = cacheRequest(version, mode);
  const cache = (caches as unknown as { default?: Cache }).default;

  if (cache) {
    const hit = await cache.match(request);
    if (hit) return hit;
  }

  const payload = await buildBootstrap(env, mode);
  const body = JSON.stringify(payload);
  const response = new Response(body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=30, s-maxage=60, stale-while-revalidate=600",
      etag: `"bce-content-${mode}-${payload.version}"`,
      "x-content-version": payload.version,
      "x-content-mode": mode,
      "x-content-count": String(Object.values(payload.content).reduce((n, list) => n + list.length, 0)),
    },
  });

  if (cache) {
    const cacheable = response.clone();
    try {
      await cache.put(request, cacheable);
    } catch {
      /* Cache API may be unavailable in local dev. */
    }
  }
  return response;
};

export const invalidateBootstrap = async (env: Env, mode: ContentMode = "production", oldVersion?: string) => {
  const cache = (caches as unknown as { default?: Cache }).default;
  if (!cache) return;
  if (oldVersion) {
    try {
      await cache.delete(cacheRequest(oldVersion, mode));
    } catch {
      /* ignore */
    }
  }
};

export const settingValue = (settings: Record<string, unknown>, path: string) => {
  let current: unknown = settings;
  for (const key of path.split(".")) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
};

export const contactEmail = (settings: Record<string, unknown>) =>
  str(settingValue(settings, "contact.email")) ?? "bcebtb999@gmail.com";
