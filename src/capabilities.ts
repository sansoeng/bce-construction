/**
 * Capacity content.
 *
 * The two panels the Quality, capability & HSE page (`/?quality`) reads from the
 * "Capacity" document: equipment & fleet, and engineering capability. They are
 * the parts of the retired Technical Capabilities page that had no counterpart
 * on the Quality page; its quality-assurance, laboratory, mix-design and
 * materials panels merged into `src/quality.ts`.
 *
 * The anchor ids stay in code because other pages link to them
 * (`/?quality#equipment-fleet`, `/?quality#engineering`). The bundled defaults
 * render first, then Cloudflare D1 replaces them at runtime through
 * `contentStore`.
 */

import { mergeDefaults, registerContentType } from "./contentStore";

export type CapabilityRow = { label: string; value: string };

export type CapabilityPanel = {
  kicker: string;
  title: string;
  image: string;
  imageAlt: string;
  copy: string[];
  rows: CapabilityRow[];
};

export type CapacityContent = {
  equipment: CapabilityPanel & { ctaLabel: string; ctaHref: string };
  engineering: CapabilityPanel;
};

export const DEFAULT_CAPACITY: CapacityContent = {
  equipment: {
    kicker: "Our own fleet",
    title: "Equipment & fleet",
    image: "/Image/bce/machinery_fleet.webp",
    imageAlt: "Concrete mixer trucks",
    copy: [
      "Our plants and fleet are owned, operated and maintained by our own team, so capacity is planned around your programme rather than a supplier's.",
    ],
    rows: [
      { label: "Batching plants", value: "04  /  70 m³/hr each" },
      { label: "Mixer trucks", value: "41" },
      { label: "Pump trucks", value: "08" },
      { label: "Piling rigs", value: "Own rigs and crews" },
    ],
    ctaLabel: "Hire our equipment",
    ctaHref: "/?quote&service=equipment-rental",
  },
  engineering: {
    kicker: "People behind every project",
    title: "Engineering capability",
    image: "/Image/bce/stats_fleet.webp",
    imageAlt: "An engineer inspecting reinforcement on site",
    copy: [
      "Our engineers plan, design and supervise every project, from mix design and piling programmes to site supervision and handover records.",
    ],
    rows: [
      { label: "Engineers", value: "15" },
      { label: "Team", value: "71" },
      { label: "Building since", value: "1995" },
      { label: "Coverage", value: "13 provinces + Phnom Penh" },
    ],
  },
};

/** Live content. Read these values during render; the object is replaced on bootstrap. */
export const capabilities: CapacityContent = JSON.parse(JSON.stringify(DEFAULT_CAPACITY)) as CapacityContent;

registerContentType("capabilities", (items) => {
  const first = items[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) return;
  Object.assign(capabilities, mergeDefaults(DEFAULT_CAPACITY, first));
});
