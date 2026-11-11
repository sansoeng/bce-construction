import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { projectHref, projects, type Category } from "./projects";
import { useScrollParallax } from "./ServiceBlocks";

// Project list: Centered header with title & subtext, Revolut/Blog-style pill dropdown filters
// ("All categories" and "All years"), and Kononenko-style staggered project grid.

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const year = (period: string) => (period.match(/\d{4}/g) ?? []).pop() ?? "";

const CATEGORIES: ("All categories" | Category)[] = [
  "All categories",
  "Ready-Mix Concrete",
  "Piling",
  "Construction",
  "Concrete Slab Works",
  "Truck & Equipment Rental",
];

const YEARS = ["All years", "2025", "2024", "2023"];

const ChevronDownIcon = ({ open }: { open?: boolean }) => (
  <svg
    viewBox="0 0 10 6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`size-2.5 transition-transform duration-200 text-[#191C1F] ${open ? "rotate-180" : ""}`}
    aria-hidden
  >
    <path d="M1 1l4 4 4-4" />
  </svg>
);

export default function ProjectsPage() {
  usePageSetup("Projects | BCE., Ltd.");

  const [activeCategory, setActiveCategory] = useState<string>("All categories");
  const [activeYear, setActiveYear] = useState<string>("All years");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  // Close dropdowns on click outside
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) {
        setIsYearOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const shown = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategory === "All categories" || p.category === activeCategory;
      const matchYr = activeYear === "All years" || year(p.period) === activeYear;
      return matchCat && matchYr;
    });
  }, [activeCategory, activeYear]);

  // Photos wipe in as on the homepage grid, once 40% up the viewport and loaded; re-armed whenever the filter
  // changes, since that remounts the cards.
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        let batch = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          const img = el.querySelector("img");
          const i = batch++;
          const reveal = () => {
            el.style.setProperty("--i", String(i));
            el.classList.add("is-revealed");
          };
          if (!img || img.complete) reveal();
          else {
            img.addEventListener("load", reveal, { once: true });
            img.addEventListener("error", reveal, { once: true });
          }
        });
      },
      { rootMargin: "0px 0px -40% 0px" }
    );
    root.querySelectorAll<HTMLElement>(".kp-media:not(.is-revealed)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [activeCategory, activeYear]);

  return (
    <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      {/* Clean Centered Header: Title & Subtext (Banner removed) */}
      <header data-header-title="Projects" className="w-full max-w-[1000px] mx-auto text-center pt-28 sm:pt-32 md:pt-36 px-5 mb-8">
        <h1 className="text-[34px] sm:text-[42px] md:text-[64px] font-semibold tracking-[-0.03em] text-[#191C1F] leading-tight">
          All projects
        </h1>
        <p className="mt-3 text-[16px] sm:text-[17px] md:text-[18px] text-[#737373] leading-relaxed max-w-[640px] mx-auto">
          Selected projects across Cambodia, from bridge foundations and factory floors to mixed-use towers, each delivered with our own concrete, piling rigs, fleet and engineers.
        </p>
      </header>

      {/* Revolut/Blog-style Centered Pill Filters: "All categories" & "All years" */}
      <div className="flex items-center justify-center gap-3 mb-10 sm:mb-14 px-5">
        {/* Category Filter Pill */}
        <div ref={categoryRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsYearOpen(false);
            }}
            className="flex items-center gap-3 h-12 px-6 rounded-full bg-[#F3F4F5] hover:bg-[#EAEBED] transition-colors text-[15px] font-medium text-[#191C1F] cursor-pointer"
            aria-expanded={isCategoryOpen}
          >
            <span>{activeCategory}</span>
            <ChevronDownIcon open={isCategoryOpen} />
          </button>

          {/* Category Dropdown Popover */}
          {isCategoryOpen && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 w-[260px] p-2 bg-white rounded-[16px] shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] animate-in fade-in duration-150">
              <div className="max-h-[300px] overflow-y-auto space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs rounded-full transition-colors flex items-center justify-between cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#191C1F] text-white font-medium"
                        : "text-[#191C1F] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {cat !== "All categories" && (
                      <span className={`text-[11px] ml-2 ${activeCategory === cat ? "text-white/80" : "text-[#737373]"}`}>
                        {projects.filter((p) => p.category === cat).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Year Filter Pill */}
        <div ref={yearRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsYearOpen(!isYearOpen);
              setIsCategoryOpen(false);
            }}
            className="flex items-center gap-3 h-12 px-6 rounded-full bg-[#F3F4F5] hover:bg-[#EAEBED] transition-colors text-[15px] font-medium text-[#191C1F] cursor-pointer"
            aria-expanded={isYearOpen}
          >
            <span>{activeYear}</span>
            <ChevronDownIcon open={isYearOpen} />
          </button>

          {/* Year Dropdown Popover */}
          {isYearOpen && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 w-[180px] p-2 bg-white rounded-[16px] shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] animate-in fade-in duration-150">
              <div className="space-y-1">
                {YEARS.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setActiveYear(yr);
                      setIsYearOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs rounded-full transition-colors flex items-center justify-between cursor-pointer ${
                      activeYear === yr
                        ? "bg-[#191C1F] text-white font-medium"
                        : "text-[#191C1F] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <span>{yr}</span>
                    {yr !== "All years" && (
                      <span className={`text-[11px] ml-2 ${activeYear === yr ? "text-white/80" : "text-[#737373]"}`}>
                        {projects.filter((p) => year(p.period) === yr).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Projects Grid or Empty State */}
      {shown.length === 0 ? (
        <div className="w-full max-w-[1000px] mx-auto px-5 pb-24">
          <div className="py-24 text-center rounded-[20px] bg-[#F8F8F8] border border-[rgba(0,0,0,0.04)]">
            <p className="text-[18px] font-medium text-[#191C1F]">
              No projects found for the selected filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All categories");
                setActiveYear("All years");
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#191C1F] text-white text-[14px] font-medium hover:bg-black transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        </div>
      ) : (
        <section ref={listRef} aria-label="Projects" data-reveal-ready className="kp pl-kp !pt-0">
          <div key={`${activeCategory}-${activeYear}`} className="kp-grid">
            {shown.map((p) => (
              <a key={p.slug} href={projectHref(p.slug)} className="kp-item group">
                <div
                  className="kp-media rounded-[18px]"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                >
                  <img
                    className="rounded-[18px]"
                    src={p.gallery[0].image}
                    alt={`${p.name}, ${p.location}`}
                    loading="lazy"
                    style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                  />
                </div>
                <div className="kp-info">
                  <div className="kp-text">
                    <span className="kp-name">{p.name}</span>
                    <span className="kp-location">{p.location}</span>
                  </div>
                  <span className="kp-meta">
                    {p.category} · {year(p.period)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
