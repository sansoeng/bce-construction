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

const appliers = new Map<string, Applier>();
const listeners = new Set<() => void>();
let contentVersion = 0;
let bootstrapped = false;
let hasContent = false;
let rawContent: Record<string, Item[]> = {};
let activeLang: Lang = getLang();

export const registerContentType = (type: string, apply: Applier) => {
  appliers.set(type, apply);
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
const mergeTranslation = (en: unknown, km: unknown): unknown => {
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

const renderContent = (lang: Lang) => {
  if (!hasContent) return;
  for (const [type, apply] of appliers) {
    const items = rawContent[type] ?? [];
    apply(
      items.map(({ en, km }) =>
        lang === "km" && km ? (mergeTranslation(en, km) as Record<string, unknown>) : en,
      ),
    );
  }
  contentVersion += 1;
  listeners.forEach((listener) => listener());
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
      return { en, km };
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
