import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { projectHref, projects, type Category } from "./projects";
import { useScrollParallax } from "./ServiceBlocks";

// Project list (/?projects), after pda.archi/en/projects: the statement set large over a full-width hairline, a
// Grid/List switch on the left and the standfirst on the right. The work below is either the staggered grid or a
// ruled list. Filters live in a black pill docked to the bottom of the listing (sticky, so it follows the scroll)
// which expands upwards into circular checkboxes for services and years — multi-select, OR within a group, AND
// between the two.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const year = (period: string) => (period.match(/\d{4}/g) ?? []).pop() ?? "";

const CATEGORIES: Category[] = [
  "Ready-Mix Concrete",
  "Piling",
  "Construction",
  "Concrete Slab Works",
  "Truck & Equipment Rental",
];

const YEARS = [...new Set(projects.map((p) => year(p.period)))].sort((a, b) => b.localeCompare(a));

type View = "grid" | "list";

const toggleValue = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const CheckIcon = () => (
  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1.7 5.2 4 7.5 8.4 2.7" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M7 9.33 3.29 5.62l.83-.83L7 7.68l2.89-2.89.83.83L7 9.33Z" fill="currentColor" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2.6 9.4 9.4 2.6M4.4 2.6h5v5" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden>
    <path d="M7 1.2v11.6M1.2 7h11.6" />
  </svg>
);

export default function ProjectsPage() {
  usePageSetup("Projects | BCE., Ltd.");

  const [view, setView] = useState<View>("grid");
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [activeYears, setActiveYears] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  // Close the filter panel on an outside click or Escape.
  useEffect(() => {
    if (!isFilterOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setIsFilterOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFilterOpen(false);
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterOpen]);

  const shown = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategories.length === 0 || activeCategories.includes(p.category);
      const matchYr = activeYears.length === 0 || activeYears.includes(year(p.period));
      return matchCat && matchYr;
    });
  }, [activeCategories, activeYears]);

  // Photos wipe in as on the homepage grid, once 15% up the viewport and loaded (the statement hero pushes the first
  // row further down than on the homepage, so it needs the gentler margin to show on arrival); re-armed whenever the
  // filters or the view change, since that remounts the cards.
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
      { rootMargin: "0px 0px -15% 0px" }
    );
    root.querySelectorAll<HTMLElement>(".kp-media:not(.is-revealed)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [activeCategories, activeYears, view]);

  const activeCount = activeCategories.length + activeYears.length;
  const pillLabel = activeCount === 1 ? (activeCategories[0] ?? activeYears[0]) : "Filters";
  const clearAll = () => {
    setActiveCategories([]);
    setActiveYears([]);
  };

  return (
    <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <div className="pl-shell">
        {/* Statement, hairline, Grid/List switch and standfirst */}
        <header data-header-title="Projects" className="pl-hero">
          <h1 data-split data-split-type="words" className="pl-hero-title">
            Building Cambodia from the ground up
          </h1>

          <hr className="pl-hero-rule" />

          <div className={`pl-view${view === "list" ? " is-list" : ""}`} role="group" aria-label="Layout">
            <span className="pl-view-dot" aria-hidden />
            <button
              type="button"
              className={`pl-view-btn${view === "grid" ? " is-active" : ""}`}
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
            <button
              type="button"
              className={`pl-view-btn${view === "list" ? " is-active" : ""}`}
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              List
            </button>
          </div>

          <p data-split className="pl-hero-copy">
            Selected projects across Cambodia, from bridge foundations and factory floors to mixed-use towers, each
            delivered with our own concrete, piling rigs, fleet and engineers.
          </p>
        </header>

        {/* Selected Projects Grid, List or Empty State */}
        {shown.length === 0 ? (
          <section className="pl-empty" aria-label="Projects">
            <p className="pl-empty-title">No projects found for the selected filter.</p>
            <button type="button" onClick={clearAll} className="pl-empty-reset">
              Reset filters
            </button>
          </section>
        ) : (
          <section ref={listRef} aria-label="Projects" data-reveal-ready className="kp !pt-0">
            <div
              key={`${view}-${activeCategories.join()}-${activeYears.join()}`}
              className={`kp-grid${view === "list" ? " pl-list" : ""}`}
            >
              {shown.map((p) => (
                <a key={p.slug} href={projectHref(p.slug)} className="kp-item group">
                  <div
                    className="kp-media rounded-[24px]"
                    style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                  >
                    <img
                      className="rounded-[24px]"
                      src={p.gallery[0].image}
                      alt={`${p.name}, ${p.location}`}
                      loading="lazy"
                      style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                    />
                    <span className="kp-plus" aria-hidden>
                      <PlusIcon />
                    </span>
                  </div>
                  <div className="kp-info">
                    <div className="kp-body">
                      <div className="kp-text">
                        <span className="kp-name">{p.name}</span>
                        <span className="kp-location">{p.location}</span>
                      </div>
                      <span className="kp-tag">{p.category}</span>
                    </div>
                    <span className="kp-meta">{year(p.period)}</span>
                  </div>
                  {view === "list" && (
                    <span className="kp-arrow" aria-hidden>
                      <ArrowIcon />
                    </span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Floating filter pill, docked to the bottom of the listing while it is in view */}
        <div className="pl-filters">
          <div ref={filterRef} className={`pl-filter${isFilterOpen ? " is-open" : ""}`}>
            <div
              id="pl-filter-panel"
              className="pl-filter-panel"
              aria-hidden={!isFilterOpen}
              inert={!isFilterOpen}
            >
              <div>
                <div className="pl-filter-body">
                  <fieldset className="pl-filter-group">
                    <legend className="pl-filter-label">Services</legend>
                    <ul>
                      {CATEGORIES.map((cat) => (
                        <li key={cat}>
                          <label className="pl-filter-opt">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={activeCategories.includes(cat)}
                              onChange={() => setActiveCategories(toggleValue(activeCategories, cat))}
                            />
                            <span className="pl-filter-box">
                              <CheckIcon />
                            </span>
                            <span className="pl-filter-name">{cat}</span>
                            <span className="pl-filter-n">{projects.filter((p) => p.category === cat).length}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>

                  <fieldset className="pl-filter-group">
                    <legend className="pl-filter-label">Year</legend>
                    <ul>
                      {YEARS.map((yr) => (
                        <li key={yr}>
                          <label className="pl-filter-opt">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={activeYears.includes(yr)}
                              onChange={() => setActiveYears(toggleValue(activeYears, yr))}
                            />
                            <span className="pl-filter-box">
                              <CheckIcon />
                            </span>
                            <span className="pl-filter-name">{yr}</span>
                            <span className="pl-filter-n">
                              {projects.filter((p) => year(p.period) === yr).length}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                </div>

                <div className="pl-filter-foot">
                  <span className="pl-filter-tally">
                    {shown.length} / {projects.length}
                  </span>
                  {activeCount > 0 && (
                    <button type="button" className="pl-filter-clear" onClick={clearAll}>
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="pl-filter-head"
              onClick={() => setIsFilterOpen((open) => !open)}
              aria-expanded={isFilterOpen}
              aria-controls="pl-filter-panel"
            >
              <span className="pl-filter-title">{pillLabel}</span>
              {activeCount > 1 && <span className="pl-filter-badge">{activeCount}</span>}
              <span className="pl-filter-chev">
                <ChevronIcon />
              </span>
            </button>
          </div>
        </div>
      </div>

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
