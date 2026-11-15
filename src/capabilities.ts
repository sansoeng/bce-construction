/**
 * Technical capabilities content.
 *
 * Six panels on `/?capabilities`, each with a photo, a kicker, copy and a ruled
 * list of figures. Panels and their anchor ids are fixed (inbound links such as
 * `/?quality#raw-materials` and `/?capabilities#equipment-fleet` rely on them);
 * the bundled defaults render first, then Cloudflare D1 replaces them at
 * runtime through `contentStore`.
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

export type CapabilitiesContent = {
  cover: {
    label: string;
    title: string;
    image: string;
    imageAlt: string;
  };
  overview: {
    label: string;
    text: string;
  };
  qualityAssurance: CapabilityPanel;
  laboratory: CapabilityPanel;
  mixDesigns: CapabilityPanel;
  materials: CapabilityPanel & { ctaLabel: string; ctaHref: string };
  equipment: CapabilityPanel & { ctaLabel: string; ctaHref: string };
  engineering: CapabilityPanel;
};

export const DEFAULT_CAPABILITIES: CapabilitiesContent = {
  cover: {
    label: "Technical capabilities",
    title: "Engineered and tested in-house",
    image: "/Image/bce/hero_batching_plant.webp",
    imageAlt: "Aerial view of a BCE batching plant and aggregate yard",
  },
  overview: {
    label: "Overview",
    text: "Behind every BCE project is the capability to test, design and deliver concrete in-house: a quality process on every pour, our own laboratory, approved mix designs, certified materials, a fleet we own and maintain, and the engineers who bring it together.",
  },
  qualityAssurance: {
    kicker: "Tested at every stage",
    title: "Quality assurance",
    image: "/Image/bce/core_services.webp",
    imageAlt: "Engineers measuring a concrete wall",
    copy: [
      "Strict quality control at every stage, from the materials that arrive at our plants to the strength of the concrete on site. Every result is recorded for the project.",
    ],
    rows: [
      { label: "01  Material check", value: "Before production" },
      { label: "02  Production control", value: "Every batch weighed" },
      { label: "03  Fresh concrete test", value: "Slump on delivery" },
      { label: "04  Strength test", value: "Cured and crushed" },
      { label: "05  Quality verification", value: "Recorded per project" },
    ],
  },
  laboratory: {
    kicker: "Our own laboratory",
    title: "Laboratory",
    image: "/Image/bce/laboratory_qa.webp",
    imageAlt: "An engineer at work in the laboratory",
    copy: [
      "Our laboratory tests materials before they enter production and concrete after it leaves the plant, at the plant and on site.",
    ],
    rows: [
      { label: "Slump testing", value: "Every delivery" },
      { label: "Compressive strength", value: "7- and 28-day cubes" },
      { label: "Aggregate grading", value: "Sieve analysis" },
      { label: "Silt and moisture content", value: "Fine and coarse aggregate" },
      { label: "Trial mixes", value: "For every new design" },
    ],
  },
  mixDesigns: {
    kicker: "Designed for every pour",
    title: "Mix designs",
    image: "/Image/bce/cert_mix_design.webp",
    imageAlt: "An engineer measuring technical drawings",
    copy: [
      "Each grade is designed, trial-mixed and tested before supply, then submitted with its results for consultant approval. Special mixes are designed on request.",
    ],
    rows: [
      { label: "C15  /  15 MPa", value: "Blinding and mass fill" },
      { label: "C20  /  20 MPa", value: "Ground slabs and paths" },
      { label: "C25  /  25 MPa", value: "Floor slabs and footings" },
      { label: "C30  /  30 MPa", value: "Columns, beams, suspended slabs" },
      { label: "C35  /  35 MPa", value: "Foundations and piles" },
      { label: "C40  /  40 MPa", value: "Bridges and heavy structures" },
    ],
  },
  materials: {
    kicker: "Certified at source",
    title: "Materials & certificates",
    image: "/Image/bce/project_page_14.webp",
    imageAlt: "A loader filling a truck with aggregate",
    copy: [
      "Every material that goes into our concrete is certified at source and checked again before production. Certificates are available on request.",
    ],
    rows: [
      { label: "Cement", value: "Mill test certificate" },
      { label: "Fine aggregate", value: "Grading and silt content" },
      { label: "Coarse aggregate", value: "Grading and crushing value" },
      { label: "Admixtures", value: "Product compliance certificate" },
      { label: "Mixing water", value: "Water quality results" },
      { label: "Calibration", value: "Scales, meters, test machine" },
    ],
    ctaLabel: "Quality & HSE documents",
    ctaHref: "/?quality#raw-materials",
  },
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
export const capabilities: CapabilitiesContent = JSON.parse(JSON.stringify(DEFAULT_CAPABILITIES)) as CapabilitiesContent;

registerContentType("capabilities", (items) => {
  const first = items[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) return;
  Object.assign(capabilities, mergeDefaults(DEFAULT_CAPABILITIES, first));
});
