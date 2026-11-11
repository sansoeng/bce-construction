import { useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { LeadText, PageHeader, useScrollParallax } from "./ServiceBlocks";
import { unsplash } from "./company";

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

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
    revisionDate: "Annual 2025/2026",
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
    downloadUrl: "/assets/BCE_Corporate_Profile_2026.pdf",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Documents" },
  { id: "profile", label: "Company Profile" },
  { id: "technical", label: "Brochures & Technical Documents" },
  { id: "licenses", label: "Licenses & Certifications" },
];

export default function ResourcesPage() {
  usePageSetup("Resources & Downloads | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDocs = activeCategory === "all"
    ? DOCUMENTS
    : DOCUMENTS.filter((d) => d.category === activeCategory);

  return (
    <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      {/* Header after olympic.no's inner pages: label, title, banner, then introduction. */}
      <PageHeader
        label="Resources"
        title="Public documents and technical resources"
        image={unsplash("/Image/bce/cert_mix_design.jpg", 2400)}
        alt="BCE technical specifications and approved certifications"
      />

      <LeadText className="ol-lead--tight">
        Access official corporate publications, verified concrete mix design tables, technical equipment data sheets, and statutory quality certifications published by Battambang Construction and Engineering, Co., Ltd.
      </LeadText>

      {/* Category Filter Tabs */}
      <section className="px-5 py-8 md:py-12 border-t border-[rgba(17,17,17,0.08)]">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[rgba(17,17,17,0.08)]">
            <div>
              <p data-split="content" className="ol-label mb-1">Documentation Archive</p>
              <h2 data-split className="text-[26px] md:text-[34px] font-medium leading-[1.15] tracking-[-0.02em]">
                Download Official Documents
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter documents by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-[4px] transition-colors ${
                    activeCategory === cat.id
                      ? "bg-[#111] text-white"
                      : "bg-[#f4f4f5] text-[#111]/70 hover:bg-[#e4e4e7] hover:text-[#111]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Document Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <article
                key={doc.id}
                className="flex flex-col justify-between p-6 rounded-[4px] border border-[rgba(17,17,17,0.12)] bg-white hover:border-[#1f367e]/40 hover:shadow-sm transition-all"
              >
                <div>
                  {/* Category Pill & Language / Date Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 bg-[#f0f0f2] text-[#111]/70 rounded-[2px]">
                      {doc.categoryLabel}
                    </span>
                    <span className="text-[11px] font-mono text-[#111]/50">
                      {doc.revisionDate}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-medium text-[#111] leading-[1.3] mb-3">
                    {doc.title}
                  </h3>

                  <p className="text-xs md:text-sm text-[#111]/65 leading-[1.6] mb-6">
                    {doc.description}
                  </p>
                </div>

                {/* Footer Meta & Clearly Labelled Download Button */}
                <div className="pt-4 border-t border-[rgba(17,17,17,0.08)]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#111]/50 mb-4">
                    <span>{doc.language}</span>
                    <span>{doc.fileFormat} · {doc.fileSize}</span>
                  </div>

                  <a
                    href={doc.downloadUrl}
                    download
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#111] text-white hover:bg-[#1f367e] text-xs font-mono uppercase tracking-[0.08em] transition-colors"
                  >
                    <svg viewBox="0 0 12 14" className="size-3.5 fill-none stroke-current" aria-hidden>
                      <path d="M6 1v9M2 6l4 4 4-4M1 13h10" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Download {doc.fileFormat}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Technical Note regarding custom dossiers */}
          <div className="mt-12 p-6 rounded-[4px] bg-[#f8f8f9] border border-[rgba(17,17,17,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-[#111] mb-1">
                Need Project-Specific Submittals or Custom Mix Designs?
              </h4>
              <p className="text-xs text-[#111]/60 leading-[1.5]">
                Our quality control engineering team prepares certified compliance dossiers, sieve analyses, and mill test certificates for commercial and infrastructure tenders.
              </p>
            </div>
            <ArrowButton
              href="/?quote"
              label="Request Technical Submittal"
              theme="outline"
              className="!self-start md:!self-auto whitespace-nowrap"
            />
          </div>
        </div>
      </section>

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
