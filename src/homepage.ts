/**
 * Homepage content.
 *
 * Every headline, paragraph, figure, button label and photo on the home page
 * lives here. The bundled defaults render first; Cloudflare D1 then replaces
 * them at runtime through `contentStore`, so the admin console edits the live
 * page without a deploy. Nested objects are replaced as a whole on each
 * bootstrap, and the page remounts (main.tsx keys on the content version).
 */

import { mergeDefaults, registerContentType } from "./contentStore";
import { offerings } from "./company";

export type HomepageIcon =
  | "years"
  | "projects"
  | "clients"
  | "plants"
  | "mixer"
  | "provinces"
  | "pump"
  | "piling";

export const HOMEPAGE_ICONS: HomepageIcon[] = [
  "years",
  "projects",
  "clients",
  "plants",
  "mixer",
  "provinces",
  "pump",
  "piling",
];

export type HomepageContent = {
  loader: {
    word: string;
    titleLines: string[];
    locationLines: string[];
    statusLines: string[];
  };
  hero: {
    video: string;
    poster: string;
    image: string;
    imageAlt: string;
    titleLines: string[];
    newsKicker: string;
    newsTitle: string;
    newsHref: string;
    newsDownload: string;
    newsImage: string;
    newsAlt: string;
  };
  about: {
    image: string;
    imageAlt: string;
    intro: string;
    ctaLabel: string;
    ctaHref: string;
    titleSegments: { text: string; label: string; icon: HomepageIcon; href: string }[];
    titleClosing: string;
  };
  expertise: {
    kicker: string;
    lead: string;
    scrollLabel: string;
    titleLines: string[];
  };
  glance: {
    title: string;
    stats: { value: number; suffix: string; label: string; note: string; icon: HomepageIcon }[];
    partnersTitle: string;
    groups: { label: string; items: { name: string; logo?: string }[] }[];
  };
  commitments: {
    label: string;
    image: string;
    imageAlt: string;
    ctaLabel: string;
    ctaHref: string;
    items: { lines: string[]; text: string }[];
  };
  projects: {
    titleLines: string[];
    ctaLabel: string;
    ctaHref: string;
  };
  coverage: {
    titleLines: string[];
    image: string;
    imageAlt: string;
    intro: string;
    hint: string;
    story: { label: string; lead: string }[];
    fleetNote: string;
    credit: string;
  };
  why: {
    eyebrow: string;
    beliefs: { word: string; tag: string }[];
  };
  quote: {
    /** Legacy photo field from the old image band; the closing section is typographic now. Kept for older documents. */
    image: string;
    title: string;
    text: string;
    ctaLabel: string;
    ctaHref: string;
  };
  footer: {
    columns: { title: string; links: { label: string; href: string }[] }[];
    enquiryTitle: string;
    enquiryText: string;
    primaryLabel: string;
    primaryHref: string;
    callLabel: string;
    officeTitle: string;
    hotlinesLabel: string;
    socialLabel: string;
    /** The design credit in the legal bar. */
    creditLabel: string;
  };
};

export const DEFAULT_HOMEPAGE: HomepageContent = {
  loader: {
    word: "BCE., LTD.",
    titleLines: ["Construction company", "Infrastructure & building"],
    locationLines: ["Battambang", "Cambodia"],
    statusLines: ["Loading", "0%"],
  },
  hero: {
    video: "/video/hero_highlight.mp4",
    poster: "/Image/bce/hero_batching_plant.webp",
    image: "/assets/6ae3a.webp",
    imageAlt: "",
    titleLines: ["Building on Strength.", "Delivering with Trust."],
    newsKicker: "Company profile",
    newsTitle: "Download the BCE Corporate Profile 2026",
    newsHref: "/assets/BCE_Corporate_Profile_2026_web.pdf",
    newsDownload: "BCE_Corporate_Profile_2026_web.pdf",
    newsImage: "/Image/bce/core_services.webp",
    newsAlt: "BCE Company Profile",
  },
  about: {
    image: "/assets/6ae3a.webp",
    imageAlt: "BCE architectural detail",
    intro:
      "BCE is a Battambang-based engineering and construction company, building across Cambodia since 1995 with modern equipment and a skilled team.",
    ctaLabel: "See more about us",
    ctaHref: "/about",
    titleSegments: [
      { text: "We supply ready-mix concrete", label: "Ready-Mix Concrete", icon: "plants", href: "/business/ready-mix-concrete" },
      { text: "foundation piling", label: "Foundation Piling", icon: "piling", href: "/business/piling" },
      { text: "civil construction", label: "Civil Construction", icon: "projects", href: "/business/construction" },
      { text: "slab works", label: "Concrete Slab Works", icon: "pump", href: "/business/concrete-slab-works" },
      { text: "and equipment rental", label: "Equipment Rental", icon: "mixer", href: "/business/equipment-rental" },
    ],
    titleClosing: "across Cambodia.",
  },
  expertise: {
    kicker: "Core business",
    lead: "Concrete supply, piling, construction, slab works and equipment rental under one roof.",
    scrollLabel: "Scroll to explore",
    titleLines: ["Our core", "business offering"],
  },
  glance: {
    title: "BCE at a glance 2025–2026",
    stats: [
      { value: 30, suffix: "+", label: "Years of experience", note: "Established 1995", icon: "years" },
      { value: 128, suffix: "", label: "Projects Completed in 2025", note: "Verified company records", icon: "projects" },
      { value: 1564, suffix: "", label: "Clients served", note: "In 2025", icon: "clients" },
      { value: 14, suffix: "", label: "Provinces served", note: "13 provinces + Phnom Penh", icon: "provinces" },
      { value: 4, suffix: "", label: "Batching plants", note: "70 m³/hr each · Battambang", icon: "plants" },
      { value: 41, suffix: "", label: "Mixer trucks", note: "Fleet as of 2026", icon: "mixer" },
      { value: 8, suffix: "", label: "Concrete pump trucks", note: "Boom reach up to 48m", icon: "pump" },
      { value: 7, suffix: "", label: "Hydraulic piling rigs", note: "Bore & hammer rigs", icon: "piling" },
    ],
    partnersTitle: "Trusted partners & clients",
    groups: [
      {
        label: "Clients",
        items: [
          { name: "Obayashi" },
          { name: "Hanshin Engineering & Construction" },
          { name: "Thang Long JSC" },
          { name: "SUMEC International Technology" },
          { name: "SchneiTec" },
          { name: "Build Bright University" },
        ],
      },
      {
        label: "Government & public sector",
        items: [
          { name: "Ministry of Public Works and Transport" },
          { name: "Ministry of Land Management, Urban Planning and Construction" },
          { name: "Ministry of Water Resources and Meteorology" },
          { name: "Ministry of Rural Development" },
          { name: "Ministry of Commerce" },
          { name: "Battambang Provincial Administration" },
        ],
      },
      {
        label: "Suppliers & technical partners",
        items: [
          { name: "Chip Mong Group" },
          { name: "SCG Distribution and Retail" },
          { name: "Sika Cambodia" },
          { name: "Battambang Conch Cement" },
          { name: "Hong Huot Ly Co., Ltd." },
        ],
      },
    ],
  },
  commitments: {
    label: "HSE & Operational Commitments",
    image: "/assets/slider-3@xxxl.webp",
    imageAlt: "BCE HSE and operational commitments",
    ctaLabel: "Explore Quality & HSE",
    ctaHref: "/quality",
    items: [
      {
        lines: ["Protecting", "people"],
        text: "We protect our people, our partners and the communities around every project we undertake.",
      },
      {
        lines: ["Working", "safely"],
        text: "Safe operations and a well-maintained fleet, run by a skilled and experienced team.",
      },
      {
        lines: ["Respecting", "the environment"],
        text: "We build today while protecting resources for future generations, through environmental responsibility and resource efficiency.",
      },
      {
        lines: ["Delivering", "quality"],
        text: "Built to last. From certified batching to precision placement, laboratory quality control ensures every structure remains strong, durable and enduring.",
      },
      {
        lines: ["Building", "trust"],
        text: "Stronger together. We grow alongside our clients, partners and suppliers through long-term relationships built on trust, respect and mutual success.",
      },
    ],
  },
  projects: {
    titleLines: ["Selected", "Projects"],
    ctaLabel: "See all projects",
    ctaHref: "/projects",
  },
  coverage: {
    titleLines: ["Everywhere You Build,", "We’ve Got You Covered."],
    image: "/Image/bce/about-business-banner.webp",
    imageAlt: "BCE engineers and crew on a concrete slab in Cambodia",
    intro:
      "We go where you build. With strong equipment capacity, experienced teams and reliable coordination, we support projects across 13 provinces and Phnom Penh.",
    hint: "Click on a province to see more details",
    story: [
      { label: "Operational coverage", lead: "Locations covered across Cambodia" },
      { label: "Years of experience", lead: "Building from Battambang since 1995" },
      { label: "Completed projects", lead: "Projects completed in 2025 across Cambodia" },
      { label: "Equipment fleet", lead: "Machines in our own fleet" },
    ],
    fleetNote: "Plus our own piling rigs.",
    credit: "Boundaries © OpenStreetMap contributors · Completed projects across Cambodia",
  },
  why: {
    eyebrow: "Why choose BCE",
    beliefs: [
      { word: "Quality", tag: "Tested at every stage" },
      { word: "Capacity", tag: "Our own plants and fleet" },
      { word: "Trust", tag: "Partners for the long term" },
    ],
  },
  quote: {
    image: "/Image/bce/hero_batching_plant.webp",
    title: "Planning a project? Request a quotation.",
    text: "Tell us your site, scope and schedule for ready-mix concrete, piling, construction, slab works or equipment rental. Our engineers will send a clear quotation from our own plants and fleet.",
    ctaLabel: "Request a quotation",
    ctaHref: "/quote",
  },
  footer: {
    columns: [
      {
        title: "Company",
        links: [
          { label: "Home", href: "#" },
          { label: "About BCE", href: "/about" },
          { label: "Projects", href: "/projects" },
          { label: "Blog & Insights", href: "/blog" },
          { label: "Coverage", href: "/coverage" },
          { label: "Resources & Downloads", href: "/resources" },
        ],
      },
      {
        title: "Our businesses",
        links: offerings.map((business) => ({ label: business.name, href: `/business/${business.slug}` })),
      },
      {
        title: "Capabilities",
        links: [
          { label: "Quality & capability", href: "/quality" },
          { label: "Laboratory", href: "/quality#laboratory" },
          { label: "Equipment & fleet", href: "/fleet" },
          { label: "Coverage", href: "/coverage" },
        ],
      },
      {
        title: "Work with us",
        links: [
          { label: "Request a quote", href: "/quote" },
          { label: "Careers & Recruitment", href: "/careers" },
          { label: "Contact us", href: "/contact" },
          { label: "Hire our equipment", href: "/quote?service=equipment-rental" },
        ],
      },
    ],
    enquiryTitle: "Talk to us about your project",
    enquiryText:
      "Tell us your site, scope and schedule. Our engineers will review it and come back with a clear, detailed quotation, supplied from our own plants and fleet.",
    primaryLabel: "Request a quote",
    primaryHref: "/quote",
    callLabel: "Call for a Quotation",
    officeTitle: "Battambang · Head office",
    hotlinesLabel: "Sales & Quotations Hotlines",
    socialLabel: "Social & Direct Contact",
    creditLabel: "Design & concept by BCE",
  },
};

/** Live content. Read these values during render; the object is replaced on bootstrap. */
export const homepage: HomepageContent = JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE)) as HomepageContent;

const LEGACY_QUOTE_TEXT =
  "Tell us your site, scope and schedule, whether it is ready-mix concrete, piling, construction, slab works or equipment rental. Our engineers will review it and come back with a clear, detailed quotation, supplied from our own plants and fleet across Cambodia.";
const SUMMARY_QUOTE_TEXT =
  "Tell us your site, scope and schedule for ready-mix concrete, piling, construction, slab works or equipment rental. Our engineers will send a clear quotation from our own plants and fleet.";

registerContentType("homepage", (items) => {
  const first = items[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) return;
  const merged = mergeDefaults(DEFAULT_HOMEPAGE, first);
  // D1 still carries the original long quote paragraph; replace the exact legacy sentence with the shorter one.
  if (merged.quote.text === LEGACY_QUOTE_TEXT) merged.quote.text = SUMMARY_QUOTE_TEXT;
  // Older D1 rows still carry the stand-in partner logos; show the approved names as wordmarks instead.
  for (const group of merged.glance.groups) {
    for (const item of group.items) {
      if (item.logo?.includes("/assets/partners/placeholder-")) delete item.logo;
    }
  }
  Object.assign(homepage, merged);
});
