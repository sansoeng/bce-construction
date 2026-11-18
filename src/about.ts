/**
 * About BCE content.
 *
 * The heritage, Chairwoman's message, vision, mission, core values and the two
 * Explore tiles on `/about` live here. The bundled defaults render first;
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
    milestones: { year: string; title: string; text: string; image: string; imageAlt: string }[];
  };
  leadership: {
    label: string;
    title: string;
    people: {
      name: string;
      role: string;
      image: string;
      imageAlt: string;
      bio: string[];
    }[];
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
    primaryHref: "/assets/BCE_Corporate_Profile_2026_web.pdf",
    secondaryLabel: "View all resources",
    secondaryHref: "/resources",
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
      {
        year: "1995",
        title: "Foundation",
        text: "BCE begins in Battambang as Hong Huot Ly Co., Ltd., supplying concrete and construction services to projects across the province.",
        image: "/Image/bce/about-hero-banner.webp",
        imageAlt: "Aerial view of the batching plant and aggregate yard BCE started from",
      },
      {
        year: "2015",
        title: "Restructured for growth",
        text: "The company is restructured into its current organisation, bringing batching, piling and civil works under one management team.",
        image: "/Image/bce/about-zoom-batching.webp",
        imageAlt: "Batching plant and aggregate stockpiles",
      },
      {
        year: "2018",
        title: "Modern plant and fleet",
        text: "Computerized batching and a larger mixer and pump fleet expand capacity beyond Battambang.",
        image: "/Image/bce/machinery_fleet.webp",
        imageAlt: "BCE mixer and pump trucks lined up at the plant",
      },
      {
        year: "2020",
        title: "Incorporated as BCE",
        text: "The business is incorporated as Battambang Construction and Engineering Co., Ltd. (BCE).",
        image: "/Image/bce/about-business-banner.webp",
        imageAlt: "BCE engineers and crew on site in Battambang",
      },
      {
        year: "2023",
        title: "Laboratory and quality system",
        text: "An in-house materials laboratory and formal mix-design records bring testing and quality control under one roof.",
        image: "/Image/bce/laboratory_qa.webp",
        imageAlt: "Concrete test specimens in the BCE laboratory",
      },
      {
        year: "2024",
        title: "Partnerships and coverage",
        text: "Long-term supply and technical partnerships extend deliveries across 13 provinces and Phnom Penh.",
        image: "/Image/bce/core_services.webp",
        imageAlt: "Concrete discharge on a BCE project site",
      },
      {
        year: "2025",
        title: "128 projects in one year",
        text: "128 projects completed and 1,564 clients served in a single year.",
        image: "/Image/bce/stats_fleet.webp",
        imageAlt: "BCE fleet and equipment on site",
      },
      {
        year: "2026",
        title: "Today",
        text: "Four batching plants, 41 mixer trucks, 8 pump trucks, 7 piling rigs and a team of 71, still building from Battambang.",
        image: "/Image/bce/hero_batching_plant.webp",
        imageAlt: "BCE batching plant at dusk",
      },
    ],
  },
  leadership: {
    label: "Leadership",
    title: "Meet the people behind every pour.",
    people: [
      {
        name: "Ms. Loeung Chan",
        role: "Chairwoman",
        image: "/Image/bce/chairwoman.webp",
        imageAlt: "Ms. Loeung Chan, Chairwoman of BCE",
        bio: [
          "Ms. Loeung Chan is Chairwoman of Battambang Construction and Engineering Co., Ltd. She has guided the company through its restructuring in 2015 and its incorporation as BCE in 2020, and still sets the standard the business is run to.",
          "Her direction is simple and does not change with the size of the project: quality controlled at every stage, safety on every site, and long-term partnerships with the clients, suppliers and crews who build Cambodia with us.",
          "Thirty years on, the company she chairs runs four batching plants, its own piling rigs and a fleet of 41 mixer trucks — and still answers the phone from Battambang.",
        ],
      },
      {
        name: "Mr. Sokha Vann",
        role: "Managing Director",
        image: "",
        imageAlt: "",
        bio: [
          "Mr. Sokha Vann runs BCE's day-to-day business, coordinating the batching plants, piling crews and civil works teams so every project is delivered on schedule and to specification.",
          "He works alongside the Chairwoman on company strategy, fleet investment and the long-term partnerships that keep BCE building across Cambodia.",
        ],
      },
      {
        name: "Ms. Sreyleak Chhun",
        role: "Finance & Administration Director",
        image: "",
        imageAlt: "",
        bio: [
          "Ms. Sreyleak Chhun leads finance, procurement and administration, keeping plant, fleet and project spending under one budget and one set of controls.",
          "Her team looks after payroll, supplier accounts and the paperwork behind every tender, so the site teams can concentrate on the work.",
        ],
      },
      {
        name: "Mr. Dara Pich",
        role: "Operations Director",
        image: "",
        imageAlt: "",
        bio: [
          "Mr. Dara Pich oversees production and site operations, from aggregate intake and batching to the mixers, pumps and piling rigs on the road.",
          "He sets the daily dispatch plan with the plant and keeps quality, safety and delivery on the same schedule.",
        ],
      },
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
        href: "/businesses",
        image: "/Image/bce/about-business-banner.webp",
        imageAlt: "BCE site team reviewing a reinforced concrete slab",
      },
      {
        label: "Tested at every stage",
        title: "Quality & HSE",
        href: "/quality",
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
