// Per-page search and social metadata.
//
// The build writes the homepage values into the document from .figma/make/site.json, and the admin settings can
// replace the description at runtime. Inner pages call applyPageSeo() so a shared link, a crawler or a browser tab
// names the page it actually opens: title, description, canonical, Open Graph, Twitter card and EN/KM alternates.
// The structured data (LocalBusiness) is page-independent and injected once.

const ORIGIN = "https://bce-construction.com";

// Keys are the routing flag (src/main.tsx); the value is the description a search result should show.
const DESCRIPTIONS: Record<string, string> = {
  projects:
    "Selected BCE projects across Cambodia: bridge foundations, factory floors, logistics warehouses and mixed-use towers, delivered with our own concrete, piling rigs and engineers.",
  about:
    "Battambang Construction and Engineering (BCE) has built across Cambodia since 1995: our story, our Chairwoman’s message, our vision, mission and core values.",
  businesses:
    "Five core businesses under one roof: ready-mix concrete, foundation piling, civil construction, concrete slab works and truck & equipment rental.",
  business:
    "Scope, capacity and typical works for this BCE business, with the concrete grades, fleet and delivery coverage behind every project.",
  quality:
    "Quality, capability and HSE at BCE: our own laboratory, approved mix designs, certified raw materials, calibrated equipment, our fleet and the engineers behind every pour.",
  coverage:
    "Where BCE builds: 13 provinces and Phnom Penh, our four batching plants, the fleet that reaches site and the projects completed in 2025.",
  quote:
    "Request a concrete, piling, construction, slab works or equipment hire quotation. Send your scope, location and schedule and our engineers will reply with a clear price.",
  recruitment:
    "Careers at BCE: current vacancies in engineering, batching, piling, fleet maintenance and site supervision, with how to apply.",
  resources:
    "BCE company profile, mix designs, licences and certificates: the documents procurement and tender teams ask for, available to download or on request.",
  contact:
    "Contact BCE in Battambang: sales and quotations hotlines, email, Telegram and our head office, open Monday to Sunday, 6:30 AM to 5:30 PM.",
  privacy:
    "How BCE collects, uses and protects the information you send through this website, including quotation requests, contact messages and job applications.",
  terms: "The terms that apply when you use the BCE website, its content, downloads and quotation tools.",
  blog: "Engineering insight from BCE: concrete technology, piling practice, quality control and the projects behind them.",
  news: "Engineering insight from BCE: concrete technology, piling practice, quality control and the projects behind them.",
};

const ROUTE_FLAGS = [
  "project",
  "projects",
  "about",
  "businesses",
  "business",
  "quality",
  "capabilities",
  "coverage",
  "quote",
  "recruitment",
  "careers",
  "resources",
  "contact",
  "privacy",
  "terms",
  "blog",
  "news",
];

export const routeKey = (search = typeof location === "undefined" ? "" : location.search) => {
  const params = new URLSearchParams(search);
  return ROUTE_FLAGS.find((flag) => params.has(flag)) ?? "";
};

export const routeDescription = (search?: string) => DESCRIPTIONS[routeKey(search)] ?? "";

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  if (typeof document === "undefined") return;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
    document.head.appendChild(element);
    return;
  }
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
};

const upsertLink = (rel: string, href: string, hreflang?: string) => {
  if (typeof document === "undefined") return;
  const selector = `link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ":not([hreflang])"}`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.appendChild(element);
  }
  element.href = href;
};

/** `projects` rather than `projects=`: keeps the canonical readable when a flag carries no value. */
const stringifyParams = (params: URLSearchParams) => {
  const parts: string[] = [];
  for (const [key, value] of params) {
    parts.push(value ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}` : encodeURIComponent(key));
  }
  return parts.join("&");
};

/** The page URL without the language, admin or hash parts, so a canonical stays stable. */
const canonicalUrl = () => {
  if (typeof location === "undefined") return ORIGIN;
  const params = new URLSearchParams(location.search);
  params.delete("lang");
  params.delete("admin");
  const query = stringifyParams(params);
  return `${ORIGIN}${location.pathname}${query ? `?${query}` : ""}`;
};

const localizedUrl = (lang: "en" | "km") => {
  if (typeof location === "undefined") return ORIGIN;
  const params = new URLSearchParams(location.search);
  params.delete("admin");
  params.set("lang", lang);
  return `${ORIGIN}${location.pathname}?${stringifyParams(params)}`;
};

const structuredData = () => {
  const sameAs = ["https://t.me/thendLP"];
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${ORIGIN}/#organization`,
    name: "BCE., Ltd.",
    legalName: "Battambang Construction and Engineering Co., Ltd.",
    alternateName: "BCE",
    url: ORIGIN,
    logo: `${ORIGIN}/favicon.svg`,
    image: `${ORIGIN}/Image/bce/hero_batching_plant.webp`,
    description:
      "Concrete, piling, civil construction, concrete slab works and equipment hire across Cambodia, building from Battambang since 1995.",
    foundingDate: "1995",
    telephone: "+855 12 932 700",
    email: "bcebtb999@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ang Village, Sangkat O’Char",
      addressLocality: "Battambang",
      addressRegion: "Battambang Province",
      addressCountry: "KH",
    },
    areaServed: { "@type": "Country", name: "Cambodia" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "06:30",
      closes: "17:30",
    },
    sameAs,
  };
};

/** Inject the company structured data once per document. */
export const applyStructuredData = () => {
  if (typeof document === "undefined" || document.getElementById("bce-structured-data")) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "bce-structured-data";
  script.textContent = JSON.stringify(structuredData());
  document.head.appendChild(script);
};

/**
 * Set the metadata for the page that is now on screen.
 * `title` is the page's own title (already translated); `description` overrides the route default for detail pages.
 */
export const applyPageSeo = (title: string, description?: string) => {
  if (typeof document === "undefined") return;
  const text = description?.trim() || routeDescription() || document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content || "";
  const url = canonicalUrl();

  document.title = title;
  if (text) upsertMeta('meta[name="description"]', { name: "description", content: text });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  if (text) upsertMeta('meta[property="og:description"]', { property: "og:description", content: text });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "BCE., Ltd." });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  if (text) upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: text });
  upsertLink("canonical", url);
  upsertLink("alternate", localizedUrl("en"), "en");
  upsertLink("alternate", localizedUrl("km"), "km");
  upsertLink("alternate", localizedUrl("en"), "x-default");
  applyStructuredData();
};
