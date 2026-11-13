import type { Category } from "./projects";

// Shared company content: the five business areas, the HSE commitments and the fleet, used by the homepage,
// Our Businesses, Quality & HSE and Request a Quote. Facts are from the BCE Corporate Profile 2026.

// Stand-in Unsplash photos until BCE supplies its own;
// credits: Ray Donnelly, Vladyslav Melnyk, Josue Isai Ramos Figueroa, Mélyna Côté, Vong Vathanak.
import { registerContentType } from "./contentStore";

export const unsplash = (id: string, w = 1200) =>
  id.startsWith("/") ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

export type Business = {
  slug: string;
  name: Category;
  tagline: string;
  /** One-sentence introduction on Our Businesses. */
  intro: string;
  image: string;
  bg: string;
  fg: string;
  details: string[];
};

// BCE's five business areas (Corporate Profile 2026, p. 07). Details reuse figures stated elsewhere on the site.
export const offerings: Business[] = [
  { slug: "ready-mix-concrete", name: "Ready-Mix Concrete", tagline: "Supply and logistics", image: "/Image/bce/core-business-ready-mix.webp", bg: "#293e8a", fg: "#fff",
    intro: "Quality-controlled concrete from our four batching plants, each producing 70 m³ an hour, delivered to site by our own fleet of 41 mixer trucks.",
    details: ["4 batching plants", "70 m³/hr per plant", "41 mixer trucks", "Slump and strength testing"] },
  { slug: "piling", name: "Piling", tagline: "Foundations", image: "/Image/bce/core-business-piling.webp", bg: "#2a2927", fg: "#fff",
    intro: "Reinforced concrete piles for infrastructure and buildings, installed with our own piling rigs and backed by laboratory quality control.",
    details: ["Reinforced concrete piles", "Our own piling rigs", "Infrastructure and buildings", "Laboratory quality control"] },
  { slug: "construction", name: "Construction", tagline: "Civil construction", image: "/Image/bce/core-business-construction.webp", bg: "#6b635b", fg: "#fff",
    intro: "Civil construction for infrastructure, industrial, commercial and residential projects, built with our own concrete, equipment and engineers.",
    details: ["Infrastructure", "Industrial", "Commercial", "Residential"] },
  { slug: "concrete-slab-works", name: "Concrete Slab Works", tagline: "Placement and finishing", image: "/Image/bce/core-business-slab.webp", bg: "#dcd9d3", fg: "#111",
    intro: "Placement and finishing of concrete slabs, pumped by our 8 pump trucks with ready-mix from our own plants, tested for slump and strength.",
    details: ["8 pump trucks", "Ready-mix from our plants", "Slump and strength testing", "Delivered on spec"] },
  { slug: "equipment-rental", name: "Truck & Equipment Rental", tagline: "Fleet hire", image: "/Image/bce/core-business-equipment.webp", bg: "#8e5236", fg: "#fff",
    intro: "Mixer trucks, pump trucks and piling rigs for hire, maintained by our own team and ready to mobilise across Cambodia.",
    details: ["Mixer trucks", "Pump trucks", "Piling rigs", "Maintained and ready"] },
];

export const businessHref = (slug: string) => `/?business=${slug}`;
export const quoteHref = (slug?: string) => (slug ? `/?quote&service=${slug}` : "/?quote");

// BCE's HSE & Operational Commitments (5 pillars)
export const commitments: [[string, string], string][] = [
  [["Protecting", "people"], "We protect our people, our partners and the communities around every project we undertake."],
  [["Working", "safely"], "Safe operations and a well-maintained fleet, run by a skilled and experienced team."],
  [["Respecting", "the environment"], "We build today while protecting resources for future generations, through environmental responsibility and resource efficiency."],
  [["Delivering", "quality"], "Built to last. From certified batching to precision placement, laboratory quality control ensures every structure remains strong, durable and enduring."],
  [["Building", "trust"], "Stronger together. We grow alongside our clients, partners and suppliers through long-term relationships built on trust, respect and mutual success."],
];

registerContentType("offerings", (items) => {
  offerings.length = 0;
  offerings.push(...(items as Business[]));
});
