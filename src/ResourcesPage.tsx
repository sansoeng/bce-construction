import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState, useMemo } from "react";
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

  // Copy-to-clipboard feedback on a document's icon action.
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
  }, []);

  const copyLink = async (doc: ResourceDocument) => {
    const url = new URL(doc.downloadUrl, location.href).href;
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      try {
        const field = document.createElement("textarea");
        field.value = url;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        ok = document.execCommand("copy");
        field.remove();
      } catch {
        ok = false;
      }
    }
    if (!ok) return;
    setCopiedId(doc.id);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopiedId((id) => (id === doc.id ? null : id)), 1800);
  };

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
        <section className="max-w-[1000px] w-full mx-auto px-5 sm:px-6 md:px-8 pt-[280px] pb-20 sm:pb-28">

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
                  <div
                    key={doc.id}
                    className="group relative isolate flex min-h-[300px] flex-col rounded-[16px]"
                  >
                    {/* Only the panel zooms; the copy inside stays put and crisp. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 rounded-[16px] bg-[#F8F9FA] transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
                      style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                    />

                    {/* Head: the document title above a hairline rule. */}
                    <div className="border-b border-[#191C1F]/10 px-6 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
                      <h3 className="max-w-[34rem] text-[18px] font-medium leading-[1.3] tracking-[-0.015em] text-[#191C1F] sm:text-[21px]">
                        {doc.title}
                      </h3>
                    </div>

                    {/* Foot: date and size on the left, icon actions on the right. */}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-5 sm:px-7">
                      <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#A5A7A8]">
                        <span>{doc.revisionDate}</span>
                        <span aria-hidden>•</span>
                        <span>{doc.fileSize}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void copyLink(doc)}
                          aria-label={copiedId === doc.id ? "Link copied" : "Copy link"}
                          title={copiedId === doc.id ? "Link copied" : "Copy link"}
                          className={`resource-action inline-flex size-10 items-center justify-center rounded-[8px] transition-colors ${
                            copiedId === doc.id
                              ? "bg-[#191C1F] text-white"
                              : "bg-[#D9DBDE] text-[#191C1F] hover:bg-[#191C1F] hover:text-white"
                          }`}
                        >
                          {copiedId === doc.id ? (
                            <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M3 8.5l3.2 3.2L13 5" />
                            </svg>
                          ) : (
                            <svg width="16" height="8" viewBox="0 0 15 8" fill="none" aria-hidden>
                              <path d="M5.5 3.51172L9.5 3.51172" stroke="currentColor" />
                              <path d="M11.5 0.5H13.5C14.0523 0.5 14.5 0.947715 14.5 1.5V5.52344C14.5 6.07572 14.0523 6.52344 13.5 6.52344H11.5" stroke="currentColor" />
                              <path d="M3.5 0.5H1.5C0.947715 0.5 0.5 0.947715 0.5 1.5V5.52344C0.5 6.07572 0.947715 6.52344 1.5 6.52344H3.5" stroke="currentColor" />
                            </svg>
                          )}
                        </button>

                        <a
                          href={doc.downloadUrl}
                          target="_blank"
                          rel="noopener"
                          aria-label="Preview"
                          title="Preview"
                          className="inline-flex size-10 items-center justify-center rounded-[8px] bg-[#D9DBDE] text-[#191C1F] transition-colors hover:bg-[#191C1F] hover:text-white"
                        >
                          <svg width="16" height="9" viewBox="0 0 14 8" fill="none" aria-hidden>
                            <path d="M5.01064 6.73084L0.890625 3.92585L5.01064 1.11985C5.6049 0.715166 6.29648 0.5 7.00296 0.5C7.70944 0.5 8.40102 0.715166 8.99528 1.11985L13.1153 3.92585L8.99528 6.73084C8.40102 7.13553 7.70944 7.35069 7.00296 7.35069C6.29648 7.35069 5.6049 7.13553 5.01064 6.73084Z" stroke="currentColor" strokeMiterlimit="10" />
                            <path d="M7.0023 5.23707C7.6853 5.23707 8.23898 4.65059 8.23898 3.92713C8.23898 3.20367 7.6853 2.61719 7.0023 2.61719C6.3193 2.61719 5.76562 3.20367 5.76562 3.92713C5.76562 4.65059 6.3193 5.23707 7.0023 5.23707Z" stroke="currentColor" strokeMiterlimit="10" />
                          </svg>
                        </a>

                        <a
                          href={doc.downloadUrl}
                          download
                          aria-label="Download"
                          title="Download"
                          className="inline-flex size-10 items-center justify-center rounded-[8px] bg-[#D9DBDE] text-[#191C1F] transition-colors hover:bg-[#191C1F] hover:text-white"
                        >
                          <svg width="10" height="12" viewBox="0 0 9 11" fill="none" aria-hidden>
                            <path d="M0 10H8.33333" stroke="currentColor" />
                            <path d="M4.16406 7.5L4.16406 0" stroke="currentColor" strokeMiterlimit="10" />
                            <path d="M0.828125 4.16797L4.23973 7.66848L7.64758 4.16797" stroke="currentColor" strokeMiterlimit="10" />
                          </svg>
                        </a>
                      </div>
                      <span className="sr-only" aria-live="polite">
                        {copiedId === doc.id ? "Link copied" : ""}
                      </span>
                    </div>
                  </div>
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
