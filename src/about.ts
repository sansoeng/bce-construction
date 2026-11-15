/**
 * About BCE content.
 *
 * The heritage, Chairwoman's message, vision, mission, core values and the two
 * Explore tiles on `/?about` live here. The bundled defaults render first;
 * Cloudflare D1 then replaces them at runtime through `contentStore`, so the
 * admin console edits the live page without a deploy.
 *
 * The "Who we are" photo grid in `AboutZoom` stays in code: its seven tiles are
 * tied to fixed grid positions, so only its two statements are editable.
 */

import { mergeDefaults, registerContentType } from "./contentStore";

export type AboutContent = {
  cover: {
    label: string;
    title: string;
    image: string;
    imageAlt: string;
  };
  intro: {
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  message: {
    quote: string;
    attribution: string;
  };
  story: {
    title: string;
    text: string;
    milestones: { year: string; text: string }[];
  };
  vision: {
    sectionLabel: string;
    label: string;
    statement: string;
  };
  mission: {
    label: string;
    statement: string;
  };
  values: {
    sectionLabel: string;
    items: { title: string; text: string; image: string; imageAlt: string }[];
  };
  zoom: {
    statements: string[];
  };
  explore: {
    label: string;
    tiles: { label: string; title: string; href: string; image: string; imageAlt: string }[];
  };
};

export const DEFAULT_ABOUT: AboutContent = {
  cover: {
    label: "Who we are",
    title: "About BCE",
    image: "/Image/bce/about-hero-banner.webp",
    imageAlt: "Aerial view of a BCE batching plant and aggregate yard",
  },
  intro: {
    text: "Battambang Construction and Engineering, Co., Ltd. (BCE) is a Battambang-based construction, concrete, piling and engineering company, supplying ready-mix concrete, reinforced concrete piling and civil construction to projects across Cambodia with its own plants, fleet and a team of 71.",
    primaryLabel: "Download Company Profile (PDF)",
    primaryHref: "/assets/BCE_Corporate_Profile_2026.pdf",
    secondaryLabel: "View all resources",
    secondaryHref: "/?resources",
  },
  message: {
    quote:
      "For more than thirty years we have built on four pillars: quality, safety, reliability and partnership. They guide every pour, every pile and every project.",
    attribution: "Chairwoman, BCE., Ltd.",
  },
  story: {
    title: "Our story",
    text: "Founded in Battambang in 1995, BCE has grown into an integrated operation, delivering concrete, piling, construction, slab works and equipment rental with its own plants and fleet.",
    milestones: [
      { year: "1995", text: "BCE is established in Battambang as an engineering and construction company." },
      { year: "2025", text: "128 projects completed and 1,564 clients served in a single year." },
      { year: "2026", text: "Operating across 13 provinces and Phnom Penh with 4 batching plants, 41 mixer trucks and 8 pump trucks." },
    ],
  },
  vision: {
    sectionLabel: "Vision & mission",
    label: "Our vision",
    statement: "To be Cambodia’s most trusted partner for concrete, piling and construction.",
  },
  mission: {
    label: "Our mission",
    statement: "To deliver quality-controlled concrete, foundations and construction on time and on spec, with our own plants, fleet and people.",
  },
  values: {
    sectionLabel: "Core values",
    items: [
      {
        title: "Quality",
        text: "Built to last. From material selection and production to construction and delivery, laboratory quality control keeps every structure strong, durable and lasting.",
        image: "/Image/bce/value-quality.webp",
        imageAlt: "Concrete frame and formwork rising beside a tower crane",
      },
      {
        title: "Safety",
        text: "Our top priority. We protect our people, our partners and the communities we serve, from the batching plant to the project site.",
        image: "/Image/bce/value-safety.webp",
        imageAlt: "Crew working at height on scaffolding in high-visibility vests",
      },
      {
        title: "Reliability",
        text: "On time, every time. Our own batching plants, mixer trucks and pump trucks give us the capacity to keep projects on schedule and on spec.",
        image: "/Image/bce/value-reliability.webp",
        imageAlt: "Tower crane and formwork keeping the construction programme on schedule",
      },
      {
        title: "Partnership",
        text: "Stronger together. We grow alongside our clients, partners and suppliers through long-term relationships built on trust, respect and mutual success.",
        image: "/Image/bce/value-partnership.webp",
        imageAlt: "Two steel fixers working together on reinforcement",
      },
    ],
  },
  zoom: {
    statements: [
      "Engineering and construction, from Battambang across Cambodia since 1995",
      "Concrete, piling, construction and fleet, all under one roof",
    ],
  },
  explore: {
    label: "Explore more",
    tiles: [
      {
        label: "What we do",
        title: "Our businesses",
        href: "/?businesses",
        image: "/Image/bce/about-business-banner.webp",
        imageAlt: "BCE site team reviewing a reinforced concrete slab",
      },
      {
        label: "Tested at every stage",
        title: "Quality & HSE",
        href: "/?quality",
        image: "/Image/bce/about-hse-banner.webp",
        imageAlt: "Concrete cylinder under compression testing in the BCE laboratory",
      },
    ],
  },
};

/** Live content. Read these values during render; the object is replaced on bootstrap. */
export const about: AboutContent = JSON.parse(JSON.stringify(DEFAULT_ABOUT)) as AboutContent;

registerContentType("about", (items) => {
  const first = items[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) return;
  Object.assign(about, mergeDefaults(DEFAULT_ABOUT, first));
});
