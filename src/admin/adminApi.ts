export class ApiError extends Error {
  status: number;
  code: string;
  payload: unknown;
  constructor(message: string, status: number, code = "http_error", payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (init.body && !(init.body instanceof FormData) && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  let response: Response;
  try {
    response = await fetch(path, { credentials: "include", ...init, headers });
  } catch {
    throw new ApiError("Cannot reach the BCE API. Check your connection or the Worker deployment.", 0, "network_error");
  }
  const text = await response.text();
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? `Request failed (${response.status})`,
      response.status,
      payload?.error?.code ?? "http_error",
      payload,
    );
  }
  return payload as T;
};

export type Me = {
  ok: true;
  authenticated: boolean;
  email: string;
  source: "access" | "dev";
  role: string;
  permissions: string[];
  loginUrl?: string;
};

export type Overview = {
  ok: true;
  admin: { email: string; source: string };
  contentVersion: string;
  stagingVersion: string;
  pendingPublish: number;
  counts: Record<string, { published: number; staged: number; draft: number; deleted: number }>;
  leads: { total: number; byStatus: Record<string, number> };
  media: { count: number; bytes: number };
  recentAudit: AuditItem[];
  services: Record<string, string>;
  limits: Record<string, number>;
};

export type ContentItem = {
  id: string;
  slug: string;
  status: "draft" | "staged" | "published" | "deleted";
  live: boolean;
  stageStatus?: "draft" | "staged" | "deleted" | null;
  hasStage: boolean;
  hasKm: boolean;
  sort: number;
  title: string;
  excerpt?: string;
  image?: string;
  updatedAt: string;
  updatedBy?: string;
};

export type ContentDoc = {
  ok: true;
  id: string;
  type: string;
  slug: string;
  status: "draft" | "published";
  stageStatus: "draft" | "staged" | "deleted" | null;
  hasStage: boolean;
  hasKm: boolean;
  sort: number;
  data: Record<string, unknown>;
  km: Record<string, unknown> | null;
  stageData: Record<string, unknown> | null;
  stageKm: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
};

export type Lead = {
  id: string;
  kind: string;
  status: string;
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  service?: string;
  project?: string;
  location?: string;
  message?: string;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type LeadDetail = Lead & { payload?: string; ip_hash?: string; user_agent?: string };

export type MediaItem = {
  key: string;
  url: string;
  name: string;
  content_type: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  created_at: string;
  created_by?: string;
};

export type AuditItem = {
  id?: string;
  actor: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  detail?: string;
  created_at: string;
};

export type SettingsResponse = {
  ok: true;
  settings: Record<string, any>;
  defaults: Record<string, any>;
  rows: { key: string; value: string; updated_at: string; updated_by: string }[];
};

export const api = {
  me: () => request<Me>("/api/admin/me"),
  overview: () => request<Overview>("/api/admin/overview"),

  listContent: (type: string, params: { status?: string; q?: string; limit?: number; offset?: number } = {}) => {
    const search = new URLSearchParams();
    if (params.status && params.status !== "all") search.set("status", params.status);
    if (params.q) search.set("q", params.q);
    search.set("limit", String(params.limit ?? 50));
    search.set("offset", String(params.offset ?? 0));
    return request<{ ok: true; type: string; total: number; items: ContentItem[]; limit: number; offset: number }>(
      `/api/admin/content/${encodeURIComponent(type)}?${search}`,
    );
  },
  getContent: (type: string, slug: string) =>
    request<ContentDoc>(`/api/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`),
  saveContent: (type: string, body: { slug: string; status: "draft" | "staged"; sort?: number; data: unknown; km?: unknown }) =>
    request<{ ok: true; slug: string; status: string; version: string }>(`/api/admin/content/${encodeURIComponent(type)}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patchContent: (type: string, slug: string, body: { slug?: string; status?: string; sort?: number; data?: unknown; km?: unknown }) =>
    request<{ ok: true; slug: string; status: string; version: string }>(
      `/api/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`,
      { method: "PATCH", body: JSON.stringify(body) },
    ),
  deleteContent: (type: string, slug: string) =>
    request<{ ok: true }>(`/api/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    }),
  duplicateContent: (type: string, slug: string) =>
    request<{ ok: true; slug: string }>(
      `/api/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}/duplicate`,
      { method: "POST", body: JSON.stringify({}) },
    ),
  promoteContent: (type: string, slug: string) =>
    request<{ ok: true; published: boolean; version: string }>(
      `/api/admin/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}/promote`,
      { method: "POST", body: JSON.stringify({}) },
    ),
  publishStaging: () =>
    request<{ ok: true; published: number; deleted: number; settings?: number; version: string }>("/api/admin/publish-staging", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  reorderContent: (items: { type: string; slug: string; sort: number }[]) =>
    request<{ ok: true; updated: number }>("/api/admin/content/reorder", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),

  listLeads: (params: { status?: string; q?: string; limit?: number; offset?: number } = {}) => {
    const search = new URLSearchParams();
    if (params.status && params.status !== "all") search.set("status", params.status);
    if (params.q) search.set("q", params.q);
    search.set("limit", String(params.limit ?? 50));
    search.set("offset", String(params.offset ?? 0));
    return request<{ ok: true; total: number; items: Lead[]; limit: number; offset: number }>(`/api/admin/leads?${search}`);
  },
  getLead: (id: string) => request<{ ok: true; lead: LeadDetail }>(`/api/admin/leads/${encodeURIComponent(id)}`),
  patchLead: (id: string, body: { status?: string; notes?: string }) =>
    request<{ ok: true }>(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteLead: (id: string) =>
    request<{ ok: true }>(`/api/admin/leads/${encodeURIComponent(id)}`, { method: "DELETE" }),

  listMedia: (params: { limit?: number; offset?: number } = {}) => {
    const search = new URLSearchParams();
    search.set("limit", String(params.limit ?? 60));
    search.set("offset", String(params.offset ?? 0));
    return request<{ ok: true; total: number; bytes: number; r2Enabled: boolean; items: MediaItem[]; limit: number }>(
      `/api/admin/media?${search}`,
    );
  },
  uploadMedia: (form: FormData) =>
    request<{ ok: true; key: string; url: string; name: string; size: number; contentType: string }>("/api/admin/media", {
      method: "POST",
      body: form,
    }),
  patchMedia: (key: string, body: { alt?: string; name?: string }) =>
    request<{ ok: true }>(`/api/admin/media/${key}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteMedia: (key: string) => request<{ ok: true }>(`/api/admin/media/${key}`, { method: "DELETE" }),

  getSettings: () => request<SettingsResponse>("/api/admin/settings"),
  putSettings: (settings: Record<string, unknown>) =>
    request<{ ok: true; updated: number; version: string }>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  listAudit: (params: { limit?: number; offset?: number } = {}) => {
    const search = new URLSearchParams();
    search.set("limit", String(params.limit ?? 60));
    search.set("offset", String(params.offset ?? 0));
    return request<{ ok: true; total: number; items: AuditItem[] }>(`/api/admin/audit?${search}`);
  },

  importContent: (documents: { type: string; slug: string; status?: string; sort?: number; data: unknown; km?: unknown }[]) =>
    request<{ ok: true; imported: number; version: string }>("/api/admin/import", {
      method: "POST",
      body: JSON.stringify({ documents }),
    }),
  revalidate: () => request<{ ok: true; version: string; stagingVersion: string }>("/api/admin/revalidate", { method: "POST", body: "{}" }),
  translate: (text: string, target: "km" | "en") =>
    request<{ ok: true; translated: string; target: string }>("/api/admin/ai/translate", {
      method: "POST",
      body: JSON.stringify({ text, target }),
    }),
};
