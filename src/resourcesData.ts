// Downloadable documents shown on the Resources page (/resources).
//
// Only documents BCE actually holds in a web-ready file are listed with a download link. Everything else is
// "available on request": the card sends the visitor to Contact instead of pretending a file exists. Replace an
// `onRequest` entry with a real URL once BCE supplies the approved PDF.

import { registerContentType } from "./contentStore";

export interface ResourceDocument {
  id: string;
  title: string;
  category: "profile" | "technical" | "licenses";
  categoryLabel: string;
  description: string;
  fileFormat: string;
  fileSize: string;
  language: string;
  revisionDate: string;
  year: string;
  downloadUrl: string;
  /** No public file yet: the card asks the visitor to request a copy. */
  onRequest?: boolean;
}

const PROFILE_URL = "/assets/BCE_Corporate_Profile_2026_web.pdf";

export const DOCUMENTS: ResourceDocument[] = [
  // 1. Company Profile — the only document with a public file today.
  {
    id: "bce-corporate-profile",
    title: "BCE Corporate Profile 2026",
    category: "profile",
    categoryLabel: "Company Profile",
    description:
      "BCE's official 55-page corporate profile: Chairwoman's message, company statistics, milestones, core business areas, fleet, operational coverage, laboratory and quality control, HSE, project experience, clients and partners, and the licence and certificate annex.",
    fileFormat: "PDF",
    fileSize: "8.4 MB",
    language: "English",
    revisionDate: "2026 edition",
    year: "2026",
    downloadUrl: PROFILE_URL,
  },

  // 2. Brochures & Technical Documents — held by BCE, supplied on request.
  {
    id: "concrete-mix-specs",
    title: "Approved concrete mix designs",
    category: "technical",
    categoryLabel: "Brochures & Technical Documents",
    description:
      "The approved mix designs behind the concrete grades BCE supplies, from C15 to C40, including the design for a specific project. Copies are supplied with the quotation or on request.",
    fileFormat: "PDF",
    fileSize: "",
    language: "English",
    revisionDate: "Available on request",
    year: "2026",
    downloadUrl: "",
    onRequest: true,
  },
  {
    id: "piling-rigs-catalog",
    title: "Piling rig capability sheet",
    category: "technical",
    categoryLabel: "Brochures & Technical Documents",
    description:
      "The pile sizes, installation methods and site requirements for BCE's own piling rigs. Issued on request for tender and method-statement reviews.",
    fileFormat: "PDF",
    fileSize: "",
    language: "English",
    revisionDate: "Available on request",
    year: "2026",
    downloadUrl: "",
    onRequest: true,
  },
  {
    id: "concrete-pump-reach",
    title: "Concrete pump deployment information",
    category: "technical",
    categoryLabel: "Brochures & Technical Documents",
    description:
      "Boom and line pump reach, site footprint and pipeline requirements for the pump trucks in BCE's fleet. Issued on request to help plan a pour.",
    fileFormat: "PDF",
    fileSize: "",
    language: "English",
    revisionDate: "Available on request",
    year: "2026",
    downloadUrl: "",
    onRequest: true,
  },
  {
    id: "aggregate-sieve-analysis",
    title: "Aggregate and material test reports",
    category: "technical",
    categoryLabel: "Brochures & Technical Documents",
    description:
      "Sieve analysis and material test reports for the fine and coarse aggregates used in BCE concrete, produced by the in-house laboratory. Available on request.",
    fileFormat: "PDF",
    fileSize: "",
    language: "English",
    revisionDate: "Available on request",
    year: "2026",
    downloadUrl: "",
    onRequest: true,
  },

  // 3. Licenses & Certifications — copies released for tender and procurement reviews.
  {
    id: "ministry-registration",
    title: "Business registration & contractor classification",
    category: "licenses",
    categoryLabel: "Licenses & Certifications",
    description:
      "Business registration, tax registration and construction contractor classification documents. Copies are released to tender and procurement teams on request.",
    fileFormat: "PDF",
    fileSize: "",
    language: "Khmer",
    revisionDate: "2020 incorporation",
    year: "2020",
    downloadUrl: "",
    onRequest: true,
  },
  {
    id: "laboratory-calibration",
    title: "Laboratory & equipment calibration certificates",
    category: "licenses",
    categoryLabel: "Licenses & Certifications",
    description:
      "Calibration certificates for the batching scales, compression testing machine and laboratory equipment used in production and quality control. Copies are available on request.",
    fileFormat: "PDF",
    fileSize: "",
    language: "English / Khmer",
    revisionDate: "Available on request",
    year: "2026",
    downloadUrl: "",
    onRequest: true,
  },
  {
    id: "hse-policy",
    title: "Health, Safety & Environment (HSE) policy",
    category: "licenses",
    categoryLabel: "Licenses & Certifications",
    description:
      "BCE's health, safety and environment policy, covering PPE, site inspections, safe pumping procedures and environmental responsibilities. Copies are available on request.",
    fileFormat: "PDF",
    fileSize: "",
    language: "English / Khmer",
    revisionDate: "Available on request",
    year: "2026",
    downloadUrl: "",
    onRequest: true,
  },
];

const LEGACY_PROFILE_URL = "/assets/BCE_Corporate_Profile_2026.pdf";

registerContentType("resources", (items) => {
  // D1 can still hold the original rows, where every card pointed at the company profile and carried invented
  // sizes/revisions. Upgrade those rows as they load so only the profile offers a file and the rest ask for a copy.
  const docs = (items as ResourceDocument[]).map((doc) => {
    const legacy = doc.downloadUrl === LEGACY_PROFILE_URL;
    if (doc.id === "bce-corporate-profile" && (legacy || !doc.downloadUrl)) {
      return {
        ...doc,
        downloadUrl: PROFILE_URL,
        fileSize: "8.4 MB",
        language: "English",
        revisionDate: "2026 edition",
        onRequest: false,
      };
    }
    if (legacy || !doc.downloadUrl) {
      return { ...doc, downloadUrl: "", onRequest: true, fileSize: "", revisionDate: "Available on request" };
    }
    return doc;
  });
  DOCUMENTS.length = 0;
  DOCUMENTS.push(...docs);
});
