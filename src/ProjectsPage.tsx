import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { projectHref, projects } from "./projects";
import { useScrollParallax } from "./ServiceBlocks";
import "./projects.css";

// Project list (/projects): the statement set large with the standfirst on the right, then the category filter
// directly above the staggered grid.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const year = (period: string) => (period.match(/\d{4}/g) ?? []).pop() ?? "";

// Category filter, from the portfolio itself so a new project category appears without touching this list.
const ALL = "All projects";
const CATEGORIES = [ALL, ...Array.from(new Set(projects.map((p) => p.category)))];
const categorySlug = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const initialCategory = () => {
  const wanted = new URLSearchParams(location.search).get("category");
  return CATEGORIES.find((c) => categorySlug(c) === wanted) ?? ALL;
};

export default function ProjectsPage() {
  usePageSetup("Projects | BCE., Ltd.");

  const [category, setCategory] = useState<string>(initialCategory);
  const visible = category === ALL ? projects : projects.filter((p) => p.category === category);

  // The filter lives in the URL: a shared link keeps it, and the content bridge's remount (which happens moments after
  // first paint) no longer resets it to All.
  const selectCategory = (next: string) => {
    setCategory(next);
    const params = new URLSearchParams(location.search);
    if (next === ALL) params.delete("category");
    else params.set("category", categorySlug(next));
    // Drop the "=" on valueless flags so the address stays "?projects&category=piling".
    const query = params.toString().replace(/=(?=&|$)/g, "");
    history.replaceState(null, "", `${location.pathname}?${query}`);
  };

  const listRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  // Photos wipe in as on the homepage grid, once 15% up the viewport and loaded (the statement hero pushes the first
  // row further down than on the homepage, so it needs the gentler margin to show on arrival); re-armed whenever the
  // filter changes, since that remounts the cards.
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
  }, [category]);

  return (
    <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <div className="pl-shell">
        {/* Statement and standfirst */}
        <header data-header-title="Projects" className="pl-hero">
          <h1 data-split data-split-type="words" className="pl-hero-title">
            Building Cambodia from the ground up
          </h1>

          <p data-split className="pl-hero-copy">
            Selected projects across Cambodia, from bridge foundations and factory floors to mixed-use towers, each
            delivered with our own concrete, piling rigs, fleet and engineers.
          </p>
        </header>

        {/* Category filter, sitting directly above the work it filters */}
        <div className="pl-filterbar" role="group" aria-label="Filter projects by category">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={`pl-chip${category === item ? " is-active" : ""}`}
              aria-pressed={category === item}
              onClick={() => selectCategory(item)}
            >
              {item}
              <span className="pl-chip-count">
                {item === ALL ? projects.length : projects.filter((p) => p.category === item).length}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <section ref={listRef} aria-label="Projects" data-reveal-ready className="kp !pt-0">
          <div key={category} className="kp-grid">
            {visible.map((p) => (
              <a key={p.slug} href={projectHref(p.slug)} className="kp-item group">
                <div
                  className="kp-media rounded-[10px]"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                >
                  <img
                    className="no-radius rounded-[10px]"
                    src={p.gallery[0].image}
                    alt={`${p.name}, ${p.location}`}
                    loading="lazy"
                    style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                  />
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
              </a>
            ))}
          </div>
        </section>
      </div>

      <QuoteCta href="/quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
