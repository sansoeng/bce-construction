// Downloadable documents shown on the Resources page (/?resources).

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
}

export const DOCUMENTS: ResourceDocument[] = [
  // 1. Company Profile
  {
    id: "bce-corporate-profile",
    title: "BCE Corporate Profile 2026",
    category: "profile",
    categoryLabel: "Company Profile",
    description: "Official corporate publication covering 30+ years of operational heritage, Chairwoman's statement, computerized batching plants, fleet inventory, 14-province coverage, and completed project portfolio.",
    fileFormat: "PDF",
    fileSize: "3.5 MB",
    language: "Bilingual (EN / KM)",
    revisionDate: "Jan 2026 · Rev 4.2",
    year: "2026",
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },

  // 2. Brochures & Technical Documents
  {
    id: "concrete-mix-specs",
    title: "Concrete Mix Design Guide & Standard Formulations",
    category: "technical",
    categoryLabel: "Brochures & Technical Documents",
    description: "Standard mix designs for concrete grades 150 kg/cm² to 450 kg/cm² adhering to ACI 211.1 guidelines, water-cement ratios, slump specifications, aggregate grading, and high-performance admixture standards.",
    fileFormat: "PDF",
    fileSize: "1.8 MB",
    language: "Bilingual (EN / KM)",
    revisionDate: "Dec 2025 · Rev 2.1",
    year: "2025",
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },
  {
    id: "piling-rigs-catalog",
    title: "Hydraulic Piling Fleet Technical Specifications",
    category: "technical",
    categoryLabel: "Brochures & Technical Documents",
    description: "Engineering data sheets for 7 hydraulic piling rigs: bore diameters from 300 mm to 1,200 mm, maximum drilling depths, hydraulic impact hammer ratings, and driven precast pile load tables.",
    fileFormat: "PDF",
    fileSize: "2.2 MB",
    language: "English",
    revisionDate: "Nov 2025 · Rev 1.4",
    year: "2025",
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },
  {
    id: "concrete-pump-reach",
    title: "Concrete Boom & Line Pump Deployment Matrix",
    category: "technical",
    categoryLabel: "Brochures & Technical Documents",
    description: "Operating ranges, vertical reach curves (28m to 48m boom lengths), maximum horizontal pumping distances, pipeline pressure ratings, and required outrigger site footprints.",
    fileFormat: "PDF",
    fileSize: "1.5 MB",
    language: "English",
    revisionDate: "Oct 2025 · Rev 1.2",
    year: "2025",
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },
  {
    id: "aggregate-sieve-analysis",
    title: "ASTM C33 Fine & Coarse Aggregate Sieve Analysis",
    category: "technical",
    categoryLabel: "Brochures & Technical Documents",
    description: "In-house quality laboratory gradation curves, fineness modulus reports for washed sand, and crushed basalt rock sizing ensuring high compressive density and pumpability.",
    fileFormat: "PDF",
    fileSize: "1.3 MB",
    language: "Bilingual (EN / KM)",
    revisionDate: "Jan 2026 · Rev 1.1",
    year: "2026",
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },

  // 3. Licenses & Certifications
  {
    id: "ministry-registration",
    title: "Commercial Registration & Contractor Classification",
    category: "licenses",
    categoryLabel: "Licenses & Certifications",
    description: "Official legal entity registration certificate from the Ministry of Commerce and construction contractor classification credentials under the Ministry of Land Management, Urban Planning and Construction.",
    fileFormat: "PDF",
    fileSize: "1.1 MB",
    language: "Khmer",
    revisionDate: "2020 Incorporation",
    year: "2020",
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },
  {
    id: "laboratory-calibration",
    title: "In-House Quality Laboratory Calibration & Testing Standards",
    category: "licenses",
    categoryLabel: "Licenses & Certifications",
    description: "Annual calibration certification of the DYE-2000 digital compressive testing machine, digital curing tank temperature controls, and verified compliance with ASTM C39 compressive testing procedures.",
    fileFormat: "PDF",
    fileSize: "950 KB",
    language: "Bilingual (EN / KM)",
    revisionDate: "Dec 2025 · Annual",
    year: "2025",
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },
  {
    id: "hse-policy",
    title: "Occupational Health, Safety & Environment (HSE) Policy",
    category: "licenses",
    categoryLabel: "Licenses & Certifications",
    description: "Statutory health and safety guidelines for ready-mix dispatch, high-pressure concrete boom operations, deep piling works, and mandatory personal protective equipment (PPE) protocols.",
    fileFormat: "PDF",
    fileSize: "1.4 MB",
    language: "Bilingual (EN / KM)",
    revisionDate: "Jan 2026 · Rev 3.0",
    year: "2026",
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },
];

registerContentType("resources", (items) => {
  DOCUMENTS.length = 0;
  DOCUMENTS.push(...(items as ResourceDocument[]));
});
