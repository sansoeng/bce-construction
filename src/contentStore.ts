/**
 * Runtime content bridge.
 *
 * The site renders from the bundled TypeScript data first, then replaces it
 * with the Cloudflare D1 payload. Each D1 item carries an optional `__km`
 * overlay; the active language decides whether that overlay is merged.
 */

import { getLang, onLangChange, type Lang } from "./i18n";
import { applySiteSettings, type SiteSettings } from "./siteSettings";

type Applier = (items: unknown[]) => void;
type Item = { en: Record<string, unknown>; km: Record<string, unknown> | null };
type KmContentMap = Record<string, Record<string, Record<string, unknown>>>;

const appliers = new Map<string, Applier>();
const listeners = new Set<() => void>();
let contentVersion = 0;
let bootstrapped = false;
let hasContent = false;
let rawContent: Record<string, Item[]> = {};
let activeLang: Lang = getLang();

/**
 * A deep copy of each content type's bundled English defaults, captured when
 * the module registers. When the API is unavailable the site renders from the
 * bundled data exactly as it did before D1 existed, and the Khmer overlay is
 * applied to that copy as well.
 */
const bundledContent = new Map<string, unknown[]>();

export const registerContentType = (type: string, apply: Applier, bundled?: unknown[] | Record<string, unknown>) => {
  appliers.set(type, apply);
  if (bundled) {
    const copy = JSON.parse(JSON.stringify(bundled)) as unknown;
    bundledContent.set(type, Array.isArray(copy) ? copy : [copy]);
  }
};

/** The bundled Khmer overlays, loaded only when someone reads the site in Khmer. */
let kmDefaults: KmContentMap | null = null;
let kmLoading: Promise<void> | null = null;

const ensureKmDefaults = (): Promise<void> => {
  if (kmDefaults) return Promise.resolve();
  if (kmLoading) return kmLoading;
  kmLoading = import("./km")
    .then((mod) => {
      kmDefaults = mod.kmContent;
      if (activeLang === "km") renderContent("km");
    })
    .catch(() => {
      // A missing chunk must never keep the English fallback from rendering.
      kmLoading = null;
    });
  return kmLoading;
};

const overlayFor = (type: string, en: Record<string, unknown>, stored: Record<string, unknown> | null) => {
  // The three singleton defaults carry no slug of their own; their canonical row is "home".
  const singleton = type === "homepage" || type === "about" || type === "quality";
  const slug = String(en.slug ?? en.id ?? (singleton ? "home" : ""));
  const bundled = kmDefaults?.[type]?.[slug];
  if (!bundled && !stored) return en;
  const merged = bundled && stored ? mergeTranslation(bundled, stored) : stored ?? bundled!;
  // The overlay keeps slug/id only as its lookup key. Never let it override the live
  // document's identifier (renaming a slug must not resurrect the old one).
  const km = { ...(merged as Record<string, unknown>) };
  delete km.slug;
  delete km.id;
  return mergeTranslation(en, km) as Record<string, unknown>;
};

export const getRuntimeContentVersion = () => contentVersion;

export const onContentChange = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const isBlank = (value: unknown) =>
  value === undefined || value === null || (typeof value === "string" && value.trim() === "");

/** Overlay Khmer values on the English document shape; blanks fall back to English. */
export const mergeTranslation = (en: unknown, km: unknown): unknown => {
  if (Array.isArray(en)) {
    if (!Array.isArray(km)) return en;
    return en.map((item, index) => mergeTranslation(item, km[index]));
  }
  if (en && typeof en === "object") {
    if (!km || typeof km !== "object" || Array.isArray(km)) return en;
    const out: Record<string, unknown> = { ...(en as Record<string, unknown>) };
    for (const [key, value] of Object.entries(km as Record<string, unknown>)) {
      if (isBlank(value)) continue;
      out[key] = mergeTranslation((en as Record<string, unknown>)[key], value);
    }
    return out;
  }
  return isBlank(km) ? en : km;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

/**
 * Fill a partial document into the default shape so a draft can never blank the
 * page. Arrays are replaced whole, unknown keys pass through, and missing keys
 * keep their bundled default.
 */
export const mergeDefaults = <T>(base: T, incoming: unknown): T => {
  const walk = (fallback: unknown, value: unknown): unknown => {
    if (Array.isArray(fallback)) return Array.isArray(value) ? value : fallback;
    if (isPlainObject(fallback)) {
      if (!isPlainObject(value)) return fallback;
      const out: Record<string, unknown> = { ...fallback };
      for (const key of Object.keys(fallback)) {
        if (key in value) out[key] = walk(fallback[key], value[key]);
      }
      // Unknown-but-present keys pass through so newer fields survive an older bundle.
      for (const key of Object.keys(value)) if (!(key in out)) out[key] = value[key];
      return out;
    }
    return value === undefined || value === null ? fallback : value;
  };
  return walk(base, incoming) as T;
};

/** Render the bundled defaults (used when the API is unavailable). */
const renderBundled = (lang: Lang) => {
  for (const [type, apply] of appliers) {
    const source = bundledContent.get(type);
    if (!source) continue;
    apply(source.map((item) => (lang === "km" ? overlayFor(type, item as Record<string, unknown>, null) : item)));
  }
  contentVersion += 1;
  listeners.forEach((listener) => listener());
};

const renderContent = (lang: Lang) => {
  if (lang === "km" && !kmDefaults) {
    void ensureKmDefaults();
    if (!hasContent) return;
  }
  if (!hasContent) {
    renderBundled(lang);
    return;
  }
  for (const [type, apply] of appliers) {
    const items = rawContent[type] ?? [];
    apply(items.map(({ en, km }) => (lang === "km" ? overlayFor(type, en, km) : en)));
  }
  contentVersion += 1;
  listeners.forEach((listener) => listener());
};

/**
 * Files we have replaced under a new name to bust the one-year immutable cache on /assets/*.
 * Live D1 rows can still carry the old path, so upgrade them as they arrive instead of
 * requiring every content document to be re-saved in the admin console.
 */
const LEGACY_ASSETS: Record<string, string> = {
  "/assets/BCE_Corporate_Profile_2026.pdf": "/assets/BCE_Corporate_Profile_2026_web.pdf",
};

const upgradeAssetUrls = (value: unknown): unknown => {
  if (typeof value === "string") return LEGACY_ASSETS[value] ?? value;
  if (Array.isArray(value)) return value.map(upgradeAssetUrls);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) out[key] = upgradeAssetUrls(item);
    return out;
  }
  return value;
};

export const applyContent = (content: Record<string, unknown[]>, settings?: Partial<SiteSettings>) => {
  if (settings) applySiteSettings(settings);

  const next: Record<string, Item[]> = {};
  let total = 0;

  for (const [type, items] of Object.entries(content)) {
    if (!Array.isArray(items)) continue;
    next[type] = items.map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return { en: {}, km: null };
      const { __km, _meta, ...en } = item as Record<string, unknown>;
      const km = __km && typeof __km === "object" && !Array.isArray(__km) ? (__km as Record<string, unknown>) : null;
      return {
        en: upgradeAssetUrls(en) as Record<string, unknown>,
        km: km ? (upgradeAssetUrls(km) as Record<string, unknown>) : null,
      };
    });
    total += items.length;
  }

  // Never wipe the bundled fallback just because the database is empty.
  if (total === 0) return false;

  rawContent = next;
  hasContent = true;
  renderContent(activeLang);
  return true;
};

onLangChange(() => {
  activeLang = getLang();
  renderContent(activeLang);
});

/**
 * Apply the bundled content for the active language, then load the Khmer
 * overlays. Call once after every content module has registered.
 */
export const syncContentLanguage = () => {
  activeLang = getLang();
  if (activeLang === "km") void ensureKmDefaults();
  if (!hasContent) renderBundled(activeLang);
};

export const bootstrapContent = async (): Promise<boolean> => {
  if (bootstrapped) return true;
  bootstrapped = true;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`/api/content/bootstrap?ts=${Date.now()}`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
      credentials: "omit",
      cache: "no-store",
    });
    if (!response.ok) return false;
    const payload = (await response.json()) as {
      content?: Record<string, unknown[]>;
      settings?: Partial<SiteSettings>;
    };
    return applyContent(payload.content ?? {}, payload.settings);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

/** Test/dev helper: mark the next bootstrap as fresh. */
export const resetBootstrap = () => {
  bootstrapped = false;
};
