import { useEffect, useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { projectHref, projects, type Category } from "./projects";
import { unsplash } from "./company";
import { LeadText, PageHeader, useScrollParallax } from "./ServiceBlocks";

// Project list: the olympic.no-style header (title, banner, introduction), then the categories set inline as filters
// ("/ Piling (02)"); the projects are shown in the homepage's Selected Projects layout (Kononenko-style
// staggered grid, photos wiping in, captions beneath), so the two read as one design.

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");
const year = (period: string) => (period.match(/\d{4}/g) ?? []).pop() ?? "";
const CATEGORIES: Category[] = ["Ready-Mix Concrete", "Piling", "Construction", "Concrete Slab Works", "Truck & Equipment Rental"];
type Filter = Category | "all";
export default function ProjectsPage() {
  usePageSetup("Projects | BCE., Ltd.");
  const [filter, setFilter] = useState<Filter>("all");
  const listRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);
  const count = (c: Filter) => (c === "all" ? projects.length : projects.filter((p) => p.category === c).length);
  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const terms: Filter[] = ["all", ...CATEGORIES.filter((c) => count(c) > 0)];

  // Photos wipe in as on the homepage grid, once 40% up the viewport and loaded; re-armed whenever the filter
  // changes, since that remounts the cards.
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => {
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
    }, { rootMargin: "0px 0px -40% 0px" });
    root.querySelectorAll<HTMLElement>(".kp-media:not(.is-revealed)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filter]);

  const pick = (c: Filter) => {
    setFilter(c);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } | null }).__lenis;
    const target = listRef.current;
    if (target && target.getBoundingClientRect().top < 0) lenis?.scrollTo(target, { offset: -160 });
  };

  return (
    <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      {/* Header after olympic.no's inner pages: title, full-bleed banner, then the introduction. */}
      <PageHeader label="Projects" title="All projects" image={unsplash("/Image/bce/core_services.jpg", 2400)} alt="BCE project sites and construction works" />
      <LeadText className="ol-lead--tight">
        Selected projects across Cambodia, from bridge foundations and factory floors to mixed-use towers, each delivered with our own concrete, piling rigs, fleet and engineers.
      </LeadText>

      {/* Category filters ("/ Piling (02)") over the grid. */}
      <section data-header-title="Projects" aria-label="Filter projects" className="pl-filter px-5">
        <ul className="pl-terms" aria-label="Filter projects by category">
          {terms.map((c, i) => (
            <li key={c} className="pl-term-w" style={{ "--i": i } as CSSProperties}>
              <button type="button" className={`pl-term${filter === c ? " is-active" : ""}`} aria-pressed={filter === c} onClick={() => pick(c)}>
                <span className="pl-term-slash" aria-hidden>/</span>
                <span className="pl-term-name">{c === "all" ? "All projects" : c}</span>
                <sup>({pad(count(c))})</sup>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* The homepage's Selected Projects grid. */}
      <section ref={listRef} aria-label="Projects" data-reveal-ready className="kp pl-kp">
        <div key={filter} className="kp-grid">
          {shown.map((p) => (
            <a key={p.slug} href={projectHref(p.slug)} className="kp-item group">
              <div className="kp-media rounded-[24px]" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                <img className="rounded-[24px]" src={p.gallery[0].image} alt={`${p.name}, ${p.location}`} loading="lazy" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any} />
              </div>
              <div className="kp-info">
                <span>{p.name}<span className="kp-detail">, {p.location}</span></span>
                <span className="kp-detail">{p.category} · {year(p.period)}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
