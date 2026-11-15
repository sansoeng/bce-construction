/**
 * Quality & HSE content.
 *
 * Every headline, paragraph, certificate row and photo on `/?quality` lives
 * here. The bundled defaults render first; Cloudflare D1 then replaces them at
 * runtime through `contentStore`, so the admin console edits the live page
 * without a deploy.
 *
 * The HSE commitments are held here rather than read from `company.ts`, so the
 * Quality page can be edited without changing the homepage's copy of the same
 * five commitments.
 */

import { mergeDefaults, registerContentType } from "./contentStore";

export type QualityContent = {
  cover: {
    label: string;
    title: string;
    image: string;
    imageAlt: string;
  };
  intro: {
    label: string;
    text: string;
  };
  laboratory: {
    title: string;
    copy: string;
    listLabel: string;
    steps: { title: string; text: string }[];
    image: string;
    imageAlt: string;
  };
  materials: {
    title: string;
    copy: string;
    listLabel: string;
    items: { name: string; certificate: string }[];
    image: string;
    imageAlt: string;
  };
  calibration: {
    title: string;
    copy: string;
    listLabel: string;
    items: { equipment: string; scope: string }[];
  };
  hse: {
    label: string;
    heading: string;
    items: { lines: string[]; text: string; image: string; imageAlt: string }[];
  };
  mix: {
    title: string;
    text: string;
    docsLabel: string;
    docs: string[];
    grades: { grade: string; strength: string; use: string }[];
    note: string;
  };
  licences: {
    title: string;
    text: string;
    statusLabel: string;
    rows: { document: string; issuer: string }[];
    ctaLabel: string;
    ctaHref: string;
  };
};

export const DEFAULT_QUALITY: QualityContent = {
  cover: {
    label: "Quality & HSE",
    title: "Tested at every stage, built safely",
    image: "/Image/bce/photos/road-crew.webp",
    imageAlt: "BCE site crew in protective equipment placing and finishing concrete",
  },
  intro: {
    label: "Our approach",
    text: "Our operations are supported by strict quality control and a clear HSE commitment, from certified materials and calibrated equipment to documented mix designs and laboratory-verified results on every project.",
  },
  laboratory: {
    title: "Laboratory & quality assurance",
    copy: "Strict quality control at every stage, with slump, strength and material testing at the plant and on site. Our own laboratory checks the materials that go into our concrete, the concrete as it leaves the plant and the strength it reaches once cured.",
    listLabel: "Our quality process",
    steps: [
      { title: "Material check", text: "Every material checked before production." },
      { title: "Batching", text: "Weighed and mixed to the approved design." },
      { title: "Slump test", text: "Tested on delivery, before placing." },
      { title: "Strength test", text: "Samples cured and tested in our lab." },
      { title: "Verification", text: "Results checked and recorded." },
    ],
    image: "/Image/bce/cert_mix_design.webp",
    imageAlt: "Concrete test specimens side by side",
  },
  materials: {
    title: "Raw material certificates",
    copy: "Every material is certified at source and checked again before production, with certificates on file for each batch.",
    listLabel: "Certified materials",
    items: [
      { name: "Cement", certificate: "Mill test certificate" },
      { name: "Sand", certificate: "Grading and silt tests" },
      { name: "Coarse aggregate", certificate: "Grading and crushing value" },
      { name: "Admixtures", certificate: "Compliance certificate" },
      { name: "Water", certificate: "Water quality tests" },
      { name: "Steel", certificate: "Mill certificates" },
    ],
    image: "/Image/bce/project_page_14.webp",
    imageAlt: "Concrete specimens and raw materials",
  },
  calibration: {
    title: "Calibration certificates",
    copy: "The scales, meters and testing machines behind every result are calibrated on schedule, with certificates on file.",
    listLabel: "Calibrated equipment",
    items: [
      { equipment: "Batching plant weigh scales", scope: "Cement, aggregate, water and admixture scales" },
      { equipment: "Compression testing machine", scope: "Load calibration for cube and cylinder testing" },
      { equipment: "Admixture dispensers", scope: "Dosing accuracy" },
      { equipment: "Water meters", scope: "Flow accuracy at the batching plants" },
      { equipment: "Laboratory equipment", scope: "Balances, slump cones and cube moulds" },
    ],
  },
  hse: {
    label: "HSE commitment",
    heading: "HSE commitment: protecting people, working safely, respecting the environment",
    items: [
      {
        lines: ["Protecting", "people"],
        text: "We protect our people, our partners and the communities around every project we undertake.",
        image: "/Image/bce/hse_safety.webp",
        imageAlt: "BCE safety standards and protective equipment on site",
      },
      {
        lines: ["Working", "safely"],
        text: "Safe operations and a well-maintained fleet, run by a skilled and experienced team.",
        image: "/Image/bce/core_services.webp",
        imageAlt: "A site worker in an orange hard hat supervising pour",
      },
      {
        lines: ["Respecting", "the environment"],
        text: "We build today while protecting resources for future generations, through environmental responsibility and resource efficiency.",
        image: "/Image/bce/project_page_16.webp",
        imageAlt: "Environmental protection and clean site practices",
      },
      {
        lines: ["Delivering", "quality"],
        text: "Built to last. From certified batching to precision placement, laboratory quality control ensures every structure remains strong, durable and enduring.",
        image: "/Image/bce/cert_mix_design.webp",
        imageAlt: "A calibrated pressure gauge and quality testing",
      },
      {
        lines: ["Building", "trust"],
        text: "Stronger together. We grow alongside our clients, partners and suppliers through long-term relationships built on trust, respect and mutual success.",
        image: "/Image/bce/project_page_17.webp",
        imageAlt: "Construction engineering team collaborating on site",
      },
    ],
  },
  mix: {
    title: "Mix design documents",
    text: "Each grade is designed, trial-mixed and tested before supply, and submitted for consultant approval.",
    docsLabel: "Supplied with every mix design",
    docs: ["Mix design submittal", "Trial mix results", "Material proportions per m³", "7- and 28-day strength records"],
    grades: [
      { grade: "C15", strength: "15 MPa", use: "Blinding and mass fill" },
      { grade: "C20", strength: "20 MPa", use: "Ground slabs and paths" },
      { grade: "C25", strength: "25 MPa", use: "Floor slabs and footings" },
      { grade: "C30", strength: "30 MPa", use: "Columns, beams and suspended slabs" },
      { grade: "C35", strength: "35 MPa", use: "Foundations and piles" },
      { grade: "C40", strength: "40 MPa", use: "Bridges and heavy structures" },
    ],
    note: "Characteristic cube strength at 28 days. Other grades and special mixes designed on request.",
  },
  licences: {
    title: "Licences & certifications",
    text: "Registration, licences and our company profile for procurement teams and tender reviewers, available on request.",
    statusLabel: "On request",
    rows: [
      { document: "Business licence & registration", issuer: "Ministry of Commerce" },
      { document: "Construction licence", issuer: "Ministry of Land Management, Urban Planning and Construction" },
      { document: "Tax registration (VAT) certificate", issuer: "General Department of Taxation" },
      { document: "Company profile", issuer: "BCE Corporate Profile 2026" },
    ],
    ctaLabel: "Request documents",
    ctaHref: "#contact",
  },
};

/** Live content. Read these values during render; the object is replaced on bootstrap. */
export const quality: QualityContent = JSON.parse(JSON.stringify(DEFAULT_QUALITY)) as QualityContent;

registerContentType("quality", (items) => {
  const first = items[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) return;
  Object.assign(quality, mergeDefaults(DEFAULT_QUALITY, first));
});
