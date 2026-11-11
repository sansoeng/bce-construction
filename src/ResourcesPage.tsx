import { useRef, useState, useMemo } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";

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

const CATEGORIES = [
  { id: "all", label: "All categories" },
  { id: "profile", label: "Company Profile" },
  { id: "technical", label: "Brochures & Technical Documents" },
  { id: "licenses", label: "Licenses & Certifications" },
];

const YEARS = [
  { id: "all", label: "All years" },
  { id: "2026", label: "2026" },
  { id: "2025", label: "2025" },
  { id: "2020", label: "2020" },
];

export default function ResourcesPage() {
  usePageSetup("Resources & Downloads | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeYear, setActiveYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const filteredDocs = useMemo(() => {
    return DOCUMENTS.filter((doc) => {
      const matchesCategory = activeCategory === "all" || doc.category === activeCategory;
      const matchesYear = activeYear === "all" || doc.year === activeYear;
      const matchesSearch =
        searchQuery.trim() === "" ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [activeCategory, activeYear, searchQuery]);

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#191C1F]">

        {/* 1. Revolut-Styled Hero Section with 3D Banner Illustration */}
        <section className="relative pt-28 sm:pt-36 md:pt-40 pb-12 sm:pb-16 md:pb-20 overflow-hidden bg-white border-b border-[rgba(0,0,0,0.06)]">
          <div className="max-w-[1000px] 2xl:max-w-[1432px] mx-auto px-5 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">

              {/* Left Column: Eyebrow, H1, Subtitle */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <span className="text-[13px] sm:text-[14px] md:text-[15px] font-medium text-[#191C1F]/60 tracking-[-0.01em] mb-2 sm:mb-3">
                  Corporate Publications
                </span>
                <h1 className="text-[38px] sm:text-[50px] md:text-[62px] font-bold text-[#191C1F] tracking-[-0.03em] leading-[1.06] mb-4 sm:mb-5">
                  Reports and results
                </h1>
                <p className="text-[16px] sm:text-[17px] md:text-[18px] text-[#191C1F]/70 leading-[1.55] max-w-[540px]">
                  Dive into all of BCE's official documentation, verified concrete mix design tables, technical specifications, and statutory quality certifications.
                </p>
              </div>

              {/* Right Column: 3D Illustration resting on concrete block */}
              <div className="md:col-span-5 flex justify-center md:justify-end items-end">
                <div className="relative w-full max-w-[420px] md:max-w-[460px]">
                  <img
                    src="/Image/bce/reports_results_banner.png"
                    alt="BCE Corporate Reports and Results Documentation"
                    className="w-full h-auto object-contain drop-shadow-sm select-none"
                    loading="eager"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. Revolut-Styled Black Highlight Banner (2026 Overview) */}
        <section className="max-w-[1000px] 2xl:max-w-[1432px] mx-auto px-5 sm:px-6 md:px-8 py-8 sm:py-10">
          <div className="rounded-[20px] md:rounded-[24px] bg-[#000000] text-white p-8 sm:p-12 md:p-16 text-center flex flex-col items-center justify-center">
            <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold tracking-[-0.02em] leading-[1.12] mb-3 sm:mb-4">
              2026 overview
            </h2>
            <p className="text-[15px] sm:text-[17px] md:text-[18px] text-white/70 max-w-[620px] leading-[1.6] mb-6 sm:mb-8">
              Three decades of certified concrete production, automated batching plants, and expanding civil infrastructure across 14 Cambodian provinces.
            </p>
            <a
              href="/assets/BCE_Corporate_Profile_2026.pdf"
              download
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white text-black font-medium text-[15px] hover:bg-white/90 active:scale-[0.98] transition-all"
            >
              Read the 2026 profile
            </a>
          </div>
        </section>

        {/* 3. Revolut Reports Document Listing Section */}
        <section className="max-w-[1000px] 2xl:max-w-[1432px] mx-auto px-5 sm:px-6 md:px-8 pt-8 pb-20 sm:pb-28">

          {/* Centered Section Title */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-[32px] sm:text-[42px] md:text-[48px] font-bold text-[#191C1F] tracking-[-0.03em] leading-[1.12] mb-2 sm:mb-3">
              Reports
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#191C1F]/65 max-w-[500px] mx-auto">
              Read our historical reports for a closer look.
            </p>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

            {/* Left Column: Filter Controls (Stacked Pills & Search) */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-3 sticky top-24 z-10">

              {/* Year Filter Pill / Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsYearOpen(!isYearOpen);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] bg-[#F4F4F5] hover:bg-[#EBECEF] text-[#191C1F] text-[14px] font-medium transition-colors"
                  aria-expanded={isYearOpen}
                >
                  <span>{YEARS.find((y) => y.id === activeYear)?.label || "All years"}</span>
                  <svg
                    viewBox="0 0 16 16"
                    className={`size-4 text-[#191C1F]/60 transition-transform ${isYearOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>

                {isYearOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-white rounded-[14px] shadow-lg border border-[rgba(0,0,0,0.08)] z-20 flex flex-col gap-1">
                    {YEARS.map((year) => (
                      <button
                        key={year.id}
                        type="button"
                        onClick={() => {
                          setActiveYear(year.id);
                          setIsYearOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors flex items-center justify-between ${
                          activeYear === year.id
                            ? "bg-[#191C1F] text-white"
                            : "text-[#191C1F]/80 hover:bg-[#F4F4F5]"
                        }`}
                      >
                        <span>{year.label}</span>
                        {activeYear === year.id && (
                          <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="2">
                            <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter Pill / Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsYearOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] bg-[#F4F4F5] hover:bg-[#EBECEF] text-[#191C1F] text-[14px] font-medium transition-colors"
                  aria-expanded={isCategoryOpen}
                >
                  <span className="truncate">{CATEGORIES.find((c) => c.id === activeCategory)?.label || "All categories"}</span>
                  <svg
                    viewBox="0 0 16 16"
                    className={`size-4 shrink-0 ml-2 text-[#191C1F]/60 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-white rounded-[14px] shadow-lg border border-[rgba(0,0,0,0.08)] z-20 flex flex-col gap-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors flex items-center justify-between ${
                          activeCategory === cat.id
                            ? "bg-[#191C1F] text-white"
                            : "text-[#191C1F]/80 hover:bg-[#F4F4F5]"
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                        {activeCategory === cat.id && (
                          <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 ml-2 fill-none stroke-current" strokeWidth="2">
                            <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Filter Input */}
              <div className="relative mt-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-[#F4F4F5] hover:bg-[#EBECEF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#191C1F]/20 text-[14px] text-[#191C1F] placeholder-[#191C1F]/45 transition-colors"
                />
                <svg
                  viewBox="0 0 20 20"
                  className="size-4 text-[#191C1F]/45 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="9" r="6" />
                  <path d="M13.5 13.5L18 18" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#191C1F]/50 hover:text-[#191C1F]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Active Filter Clear Tag */}
              {(activeCategory !== "all" || activeYear !== "all" || searchQuery !== "") && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveYear("all");
                    setSearchQuery("");
                  }}
                  className="text-xs text-[#0075EB] hover:underline self-start pt-1 font-medium"
                >
                  Reset filters
                </button>
              )}

            </div>

            {/* Right Column: Stacked Document Cards */}
            <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-3.5 md:gap-4">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.downloadUrl}
                    download
                    className="group block p-6 sm:p-7 rounded-[18px] md:rounded-[20px] bg-[#F8F9FA] hover:bg-[#F0F1F3] border border-[rgba(0,0,0,0.02)] hover:border-[rgba(0,0,0,0.06)] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Document info */}
                      <div className="flex-1 min-w-0">
                        {/* Eyebrow: Year · Revision · Category */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[12px] font-medium text-[#191C1F]/50 tracking-[-0.01em]">
                            {doc.year} · {doc.revisionDate}
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[#EAEBED] text-[#191C1F]/70">
                            {doc.categoryLabel}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[18px] sm:text-[20px] md:text-[21px] font-medium text-[#191C1F] group-hover:text-[#0075EB] tracking-[-0.015em] leading-[1.3] transition-colors mb-2">
                          {doc.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[13px] sm:text-[14px] text-[#191C1F]/65 leading-[1.55] max-w-[680px] mb-4">
                          {doc.description}
                        </p>

                        {/* Bottom Row: Download Link & File Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-[13px] pt-1">
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#0075EB] group-hover:underline">
                            <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M8 2v8M4 7l4 4 4-4M2 13h12" />
                            </svg>
                            <span>Download</span>
                          </span>

                          <span className="text-[#191C1F]/30">·</span>

                          <span className="text-[#191C1F]/50 font-mono text-[12px]">
                            {doc.fileFormat} · {doc.fileSize}
                          </span>

                          <span className="text-[#191C1F]/30">·</span>

                          <span className="text-[#191C1F]/50 text-[12px]">
                            {doc.language}
                          </span>
                        </div>
                      </div>

                      {/* Right Chevron Indicator */}
                      <div className="shrink-0 pt-1 text-[#191C1F]/40 group-hover:text-[#191C1F] group-hover:translate-x-1 transition-all">
                        <svg viewBox="0 0 20 20" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 4l6 6-6 6" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="py-16 text-center rounded-[20px] bg-[#F8F9FA] border border-[rgba(0,0,0,0.02)]">
                  <p className="text-[16px] text-[#191C1F]/60 mb-3">
                    No documents found matching your criteria
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("all");
                      setActiveYear("all");
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#191C1F] text-white text-xs font-medium hover:bg-black transition-colors"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

          </div>

        </section>

        <QuoteCta href="/?quote" />
        <Footer phones={phones} tel={tel} base="/" />
        <FluidCursor />
      </main>
    </>
  );
}
