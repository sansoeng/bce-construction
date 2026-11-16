import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { projectHref, projects } from "./projects";
import { SAMPLE_PORTFOLIO } from "./contentFlags";
import { useScrollParallax } from "./ServiceBlocks";

// Project list (/?projects), after pda.archi/en/projects: the statement set large over a full-width hairline, a
// Grid/List switch on the left and the standfirst on the right. The work below is either the staggered grid or a
// ruled list.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const year = (period: string) => (period.match(/\d{4}/g) ?? []).pop() ?? "";

type View = "grid" | "list";

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

  const listRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  // Photos wipe in as on the homepage grid, once 15% up the viewport and loaded (the statement hero pushes the first
  // row further down than on the homepage, so it needs the gentler margin to show on arrival); re-armed whenever the
  // view changes, since that remounts the cards.
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
  }, [view]);

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
          {projects.some((project) => project.sample ?? SAMPLE_PORTFOLIO) && (
            <p className="mt-4 max-w-[42rem] text-[13px] leading-[1.6] text-[#111]/45">
              Project records marked “Sample content” are illustrative drafts pending BCE approval. Client names,
              quantities and dates will be confirmed before publication.
            </p>
          )}
        </header>

        {/* Projects Grid or List */}
        <section ref={listRef} aria-label="Projects" data-reveal-ready className="kp !pt-0">
          <div key={view} className={`kp-grid${view === "list" ? " pl-list" : ""}`}>
            {projects.map((p) => (
              <a key={p.slug} href={projectHref(p.slug)} className="kp-item group">
                <div
                  className="kp-media rounded-[10px]"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                >
                  <img
                    className="rounded-[10px]"
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
      </div>

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
