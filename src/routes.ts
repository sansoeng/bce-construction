// Clean URLs.
//
// The site used to be one document with query flags (`/projects`, `/project/slug`, `/business/slug`). Each page now
// has a real path, and every legacy address keeps working: `legacyPath()` maps an old query to its new path so the
// first load can rewrite the address bar, and `pathFor()` normalises any href that still carries the old form (the
// footer and header links are editable in the admin, so stored content can be older than this file).
//
// Query parameters for a page's own state stay: /quote?service=piling, /careers?job=id, /blog?post=slug,
// /projects?category=piling, and ?lang=en|km anywhere.

export const ROUTES = {
  home: "/",
  about: "/about",
  businesses: "/businesses",
  business: "/business",
  projects: "/projects",
  project: "/project",
  quality: "/quality",
  coverage: "/coverage",
  fleet: "/fleet",
  quote: "/quote",
  careers: "/careers",
  resources: "/resources",
  partners: "/partners",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  blog: "/blog",
} as const;

/** Old flag → new path for the one-page routes. */
const FLAG_PATHS: Record<string, string> = {
  projects: ROUTES.projects,
  about: ROUTES.about,
  businesses: ROUTES.businesses,
  quality: ROUTES.quality,
  capabilities: ROUTES.quality,
  coverage: ROUTES.coverage,
  fleet: ROUTES.fleet,
  quote: ROUTES.quote,
  recruitment: ROUTES.careers,
  careers: ROUTES.careers,
  resources: ROUTES.resources,
  partners: ROUTES.partners,
  contact: ROUTES.contact,
  privacy: ROUTES.privacy,
  terms: ROUTES.terms,
  blog: ROUTES.blog,
  news: ROUTES.blog,
};

/** Detail routes take the slug from the query. */
const DETAIL_FLAGS: Record<string, string> = {
  project: ROUTES.project,
  business: ROUTES.business,
};

const FLAGS = [...Object.keys(FLAG_PATHS), ...Object.keys(DETAIL_FLAGS)];

const params = (search: string) => new URLSearchParams(search.startsWith("?") ? search : `?${search}`);

/** Keep the page's own state (service, job, post, category, lang) when moving to the clean path. */
const carryOver = (input: URLSearchParams) => {
  const next = new URLSearchParams();
  for (const key of ["service", "job", "post", "category", "lang"]) {
    const value = input.get(key);
    if (value) next.append(key, value);
  }
  return next;
};

/** The clean path for a legacy query string, or null when the query has no page flag. */
export const legacyPath = (search: string): string | null => {
  const input = params(search);
  for (const [flag, base] of Object.entries(DETAIL_FLAGS)) {
    const slug = input.get(flag);
    if (slug) return `${base}/${encodeURIComponent(slug)}${querySuffix(carryOver(input))}`;
  }
  for (const flag of FLAGS) {
    if (!input.has(flag)) continue;
    const base = FLAG_PATHS[flag];
    if (base) return `${base}${querySuffix(carryOver(input))}`;
  }
  return null;
};

const querySuffix = (values: URLSearchParams) => {
  const text = values.toString();
  return text ? `?${text}` : "";
};

/**
 * Normalise any href to its clean form. Absolute URLs, hashes and files pass through untouched.
 * `/ ?quote&service=piling` → `/quote?service=piling`; `/about` → `/about`; `/project/x` → `/project/x`.
 */
export const pathFor = (href: string): string => {
  if (!href) return href;
  if (!href.startsWith("/?") && !href.startsWith("?")) return href;
  const [rawPath, rawQuery = ""] = href.split("?");
  const input = params(rawQuery);
  const prefix = rawPath === "" ? "" : rawPath;
  const detail = Object.entries(DETAIL_FLAGS).find(([flag]) => input.get(flag));
  if (detail) {
    const [flag, base] = detail;
    const slug = input.get(flag)!;
    input.delete(flag);
    input.delete("admin");
    return `${prefix}${base}/${encodeURIComponent(slug)}${querySuffix(carryOver(input))}`;
  }
  for (const flag of FLAGS) {
    if (!input.has(flag)) continue;
    const base = FLAG_PATHS[flag];
    if (!base) continue;
    input.delete(flag);
    input.delete("admin");
    return `${prefix}${base}${querySuffix(carryOver(input))}`;
  }
  return href;
};

/** True when the current query is an old one-page address that should be rewritten. */
export const isLegacyAddress = (search: string) => {
  const input = params(search);
  return FLAGS.some((flag) => input.has(flag));
};
