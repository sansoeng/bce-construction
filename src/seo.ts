// Per-page search and social metadata.
//
// The build writes the homepage values into the document from .figma/make/site.json, and the admin settings can
// replace the description at runtime. Inner pages call applyPageSeo() so a shared link, a crawler or a browser tab
// names the page it actually opens: title, description, canonical, Open Graph, Twitter card and EN/KM alternates.
// The structured data (LocalBusiness) is page-independent and injected once.

const ORIGIN = "https://bce-construction.com";

// Keys are the routing flag (src/main.tsx); the value is the description a search result should show. Each one pairs
// a place with proof (own plants, own fleet, dates) because that is what wins a local construction query.
const DESCRIPTIONS: Record<string, string> = {
  projects:
    "Selected BCE construction projects across Cambodia: bridge foundations, factory floors, logistics warehouses and mixed-use towers, built with our own concrete, piling rigs and engineers.",
  about:
    "BCE is a Battambang construction company building across Cambodia since 1995: our story, our Chairwoman’s message, our vision, mission and core values.",
  businesses:
    "Five divisions under one roof: ready-mix concrete, foundation piling, civil construction, concrete slab works and equipment hire — run from our own plants in Battambang.",
  business:
    "Scope, capacity and typical works for this BCE business, with the concrete grades, fleet and delivery coverage behind every project in Cambodia.",
  quality:
    "Quality control at BCE: our own concrete laboratory, approved C15–C40 mix designs, certified raw materials, calibrated equipment and the engineers behind every pour.",
  coverage:
    "Where BCE builds: 13 provinces and Phnom Penh, our four batching plants, the fleet that reaches site and the projects completed in 2025.",
  fleet:
    "BCE’s own fleet for hire across Cambodia: four batching plants, 41 mixer trucks, eight pump trucks, seven piling rigs, plus loaders, cranes and lifts.",
  quote:
    "Request a ready-mix concrete, piling, construction, slab works or equipment hire quotation in Cambodia. Send your scope, location and schedule — our engineers reply with a clear price.",
  recruitment:
    "Construction jobs in Battambang with BCE: engineering, batching, piling, fleet maintenance and site supervision vacancies, with how to apply.",
  resources:
    "The BCE company profile, mix designs, licences and certificates — the documents procurement and tender teams ask for, to download or request.",
  partners:
    "BCE’s clients, partners and key suppliers across Cambodia: government institutions, contractors, developers, corporate clients and materials suppliers, as published in our Corporate Profile 2026.",
  contact:
    "Contact BCE, a construction company in Battambang, Cambodia: sales and quotation hotlines, email, Telegram and our head office, open Monday to Sunday.",
  privacy:
    "How BCE collects, uses and protects the information you send through this website, including quotation requests, contact messages and job applications.",
  terms: "The terms that apply when you use the BCE website, its content, downloads and quotation tools.",
  blog: "Engineering insight from BCE in Battambang: concrete technology, piling practice, quality control and the projects behind them.",
  news: "Engineering insight from BCE in Battambang: concrete technology, piling practice, quality control and the projects behind them.",
};

/** Clean-path pages described above; detail pages fall back to their section's description. */
export const routeKey = (pathname = typeof location === "undefined" ? "/" : location.pathname) => {
  const section = pathname.split("/").filter(Boolean)[0] ?? "";
  if (section === "project") return "projects";
  if (section === "business") return "businesses";
  if (section === "capabilities") return "quality";
  if (section === "careers" || section === "recruitment") return "recruitment";
  if (section === "news") return "blog";
  return section;
};

export const routeDescription = (pathname?: string) => DESCRIPTIONS[routeKey(pathname)] ?? "";

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

/** The page URL without the admin or hash parts. A Khmer page keeps `lang=km`, so its canonical is the Khmer page and
 * never the English one — otherwise Google is free to show a Khmer title on the English URL. */
const canonicalUrl = () => {
  if (typeof location === "undefined") return ORIGIN;
  const params = new URLSearchParams(location.search);
  params.delete("admin");
  if (params.get("lang") !== "km") params.delete("lang");
  const query = stringifyParams(params);
  return `${ORIGIN}${location.pathname}${query ? `?${query}` : ""}`;
};

const localizedUrl = (lang: "en" | "km") => {
  if (typeof location === "undefined") return ORIGIN;
  const params = new URLSearchParams(location.search);
  params.delete("admin");
  if (lang === "km") params.set("lang", "km");
  else params.delete("lang");
  return `${ORIGIN}${location.pathname}${params.toString() ? `?${stringifyParams(params)}` : ""}`;
};

// The five divisions, as an offer catalogue for search engines; the copy is the same claim as /businesses.
const SERVICES: [string, string][] = [
  ["Ready-mix concrete", "C15–C40 concrete from four batching plants, delivered by our own 41 mixer trucks and 8 pumps."],
  ["Foundation piling", "Bored piling and foundation works with our own hydraulic rigs, engineered per project."],
  ["Civil construction", "Roads, bridges, warehouses, factories and commercial or residential structures."],
  ["Concrete slab works", "Industrial floors, post-tensioned slabs and external hardstands."],
  ["Equipment hire", "Mixer trucks, pump trucks, piling rigs, loaders and cranes, with operators on request."],
];

// The places named in the coverage story, so the structured data and the Coverage page cannot drift apart.
const AREA_SERVED = [
  "Battambang", "Banteay Meanchey", "Siem Reap", "Pursat", "Kampong Chhnang", "Kampong Thom",
  "Pailin", "Oddar Meanchey", "Preah Vihear", "Stung Treng", "Phnom Penh", "Kandal", "Koh Kong", "Preah Sihanouk",
];

// Google's result shows a site name above the title (the "bce-construction.com" line today). A WebSite node is the
// signal it documents for that name, and `og:site_name` repeats it, so the SERP reads "BCE., Ltd." instead of the host.
const websiteData = () => ({
  "@type": "WebSite",
  "@id": `${ORIGIN}/#website`,
  url: `${ORIGIN}/`,
  name: "BCE., Ltd.",
  alternateName: ["BCE", "BCE Construction", "BCE Battambang"],
  inLanguage: ["en", "km"],
  publisher: { "@id": `${ORIGIN}/#organization` },
});

const organizationData = () => {
  const sameAs = ["https://t.me/thendLP"];
  return {
    "@type": "GeneralContractor",
    "@id": `${ORIGIN}/#organization`,
    name: "BCE., Ltd.",
    legalName: "Battambang Construction and Engineering Co., Ltd.",
    alternateName: ["BCE", "BCE Battambang", "BCE Construction Cambodia"],
    url: ORIGIN,
    logo: `${ORIGIN}/favicon.svg`,
    image: `${ORIGIN}/Image/bce/hero_batching_plant.webp`,
    description:
      "BCE is a Battambang construction company building across Cambodia since 1995: ready-mix concrete, foundation piling, civil works and equipment hire from our own plants and fleet.",
    slogan: "Building from Battambang since 1995.",
    knowsLanguage: ["en", "km"],
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
    geo: { "@type": "GeoCoordinates", latitude: 13.0957, longitude: 103.2022 },
    areaServed: [
      { "@type": "Country", name: "Cambodia" },
      ...AREA_SERVED.map((name) => ({ "@type": "AdministrativeArea", name })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Construction services in Cambodia",
      itemListElement: SERVICES.map(([name, description]) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name,
          description,
          areaServed: { "@type": "Country", name: "Cambodia" },
          provider: { "@id": `${ORIGIN}/#organization` },
        },
      })),
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "06:30",
      closes: "17:30",
    },
    sameAs,
  };
};

// One graph per page: the site (for the SERP site name) and the company (for the local/entity signals).
const structuredData = () => ({
  "@context": "https://schema.org",
  "@graph": [websiteData(), organizationData()],
});

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
