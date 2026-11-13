import { siteSettings } from "./siteSettings";
import { useRef, useState, useMemo } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

import { DOCUMENTS, type ResourceDocument } from "./resourcesData";
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

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const filteredDocs = useMemo(() => {
    return DOCUMENTS.filter((doc) => {
      const matchesCategory = activeCategory === "all" || doc.category === activeCategory;
      const matchesYear = activeYear === "all" || doc.year === activeYear;
      return matchesCategory && matchesYear;
    });
  }, [activeCategory, activeYear]);

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#191C1F]">

        {/* Revolut Reports Document Listing Section */}
        <section className="max-w-[1000px] w-full mx-auto px-5 sm:px-6 md:px-8 pt-28 sm:pt-32 md:pt-36 pb-20 sm:pb-28">

          {/* Centered Section Title */}
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-[34px] sm:text-[42px] md:text-[64px] font-semibold text-[#191C1F] tracking-[-0.03em] leading-[1.12]">
              Reports
            </h1>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* Left Column: Filter Controls (Stacked 24px Boxes) */}
            <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-3 sticky top-24 z-10">

              {/* Year Filter Box / Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsYearOpen(!isYearOpen);
                    setIsCategoryOpen(false);
                  }}
                  className="box-24 w-full flex items-center justify-between px-5 py-3.5 rounded-[24px] bg-[#F4F4F5] hover:bg-[#EBECEF] text-[#191C1F] text-[14px] font-medium transition-colors border-0"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
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
                  <div
                    className="box-24 absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-[24px] shadow-lg border-0 z-20 flex flex-col gap-1"
                    style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                  >
                    {YEARS.map((year) => (
                      <button
                        key={year.id}
                        type="button"
                        onClick={() => {
                          setActiveYear(year.id);
                          setIsYearOpen(false);
                        }}
                        className={`box-24 w-full text-left px-4 py-2.5 rounded-[20px] text-[13px] font-medium transition-colors flex items-center justify-between border-0 ${
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

              {/* Category Filter Box / Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsYearOpen(false);
                  }}
                  className="box-24 w-full flex items-center justify-between px-5 py-3.5 rounded-[24px] bg-[#F4F4F5] hover:bg-[#EBECEF] text-[#191C1F] text-[14px] font-medium transition-colors border-0"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
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
                  <div
                    className="box-24 absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-[24px] shadow-lg border-0 z-20 flex flex-col gap-1"
                    style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className={`box-24 w-full text-left px-4 py-2.5 rounded-[20px] text-[13px] font-medium transition-colors flex items-center justify-between border-0 ${
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

              {/* Active Filter Clear Tag */}
              {(activeCategory !== "all" || activeYear !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveYear("all");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-medium text-[#191C1F]/60 hover:text-[#191C1F] transition-colors border-0"
                >
                  <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="2">
                    <path d="M12 4L4 12M4 4l8 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Reset filters</span>
                </button>
              )}

            </div>

            {/* Right Column: Stacked Document Cards */}
            <div className="md:col-span-8 lg:col-span-8 flex flex-col gap-3.5 md:gap-4">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.downloadUrl}
                    download
                    className="box-24 group block p-6 sm:p-7 rounded-[24px] bg-[#F8F9FA] hover:bg-[#F0F1F3] border-0 transition-all duration-200"
                    style={{
                      WebkitCornerSmoothing: "60%",
                      cornerSmoothing: "60%",
                    } as any}
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
