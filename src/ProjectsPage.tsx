import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { projectHref, projects, type Project } from "./projects";
import { FilterBar, FilterMeta, type FilterFacet, type FilterSelection } from "./FilterBar";
import { useScrollParallax } from "./ServiceBlocks";
import "./projects.css";

// Project list (/projects), rebuilt on olympic.no's fleet archive: a full-bleed hero banner, then a hairline filter bar
// whose accordion facets drop a grey panel of chips with their wipe hover, the chosen values pinned in the left band,
// and the portfolio grouped by year with the year set flush left in the accent colour and the tiles in the right-hand
// eight columns. BCE's own type and palette throughout: sans for project names, the mono face for every control, label
// and figure.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

// Khmer copy sets periods in Khmer numerals ("កុម្ភៈ ២០២៤ – កញ្ញា ២០២៤"), so normalise before reading the year out.
const digitize = (value: string) => value.replace(/[០-៩]/g, (digit) => String("០១២៣៤៥៦៧៨៩".indexOf(digit)));
const yearOf = (period: string) => (digitize(period).match(/\d{4}/g) ?? []).pop() ?? "";
const provinceOf = (location: string) => location.split(",").pop()?.trim() || location;

// ASCII slugs for English values. Khmer values have no ASCII to slug, so they keep their own text (the address
// encodes it) and a shared link still resolves inside that language.
const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || value;

type FacetKey = "category" | "year" | "location";

// Three facets, the same shape as olympic.no's vessel archive (type, crane capacity, accommodation): the portfolio's
// own category, the completion year taken from `period`, and the province taken from `location`. A new category, year
// or province therefore appears here without touching this file.
const FACETS: { key: FacetKey; label: string; value: (project: Project) => string }[] = [
  { key: "category", label: "Category", value: (p) => p.category },
  { key: "year", label: "Year", value: (p) => yearOf(p.period) },
  { key: "location", label: "Location", value: (p) => provinceOf(p.location) },
];

const FACET_KEYS = FACETS.map((facet) => facet.key);
const alphabetically = (a: string, b: string) => a.localeCompare(b);
const newestFirst = (a: string, b: string) => Number(b) - Number(a);

// Options and per-option totals are read from the portfolio on every render, so a category, year or province that
// arrives with the live content bridge appears immediately instead of being frozen at module load.
const facetOptions = (): FilterFacet[] =>
  FACETS.map((facet) => {
    const values = Array.from(new Set(projects.map(facet.value))).filter(Boolean);
    values.sort(facet.key === "year" ? newestFirst : alphabetically);
    return {
      key: facet.key,
      label: facet.label,
      options: values.map((value) => ({
        value,
        label: value,
        count: projects.filter((p) => facet.value(p) === value).length,
      })),
    };
  });

const emptySelection = (): FilterSelection => ({ category: [], year: [], location: [] });

// The facets live in the URL, one repeated parameter per value, so a shared link keeps them and the content bridge's
// remount (which lands moments after first paint) reads them back instead of resetting to the full portfolio.
const selectionFromUrl = (facets: FilterFacet[]): FilterSelection => {
  const params = new URLSearchParams(location.search);
  const next = emptySelection();
  facets.forEach((facet) => {
    const wanted = params.getAll(facet.key);
    if (!wanted.length) return;
    next[facet.key] = facet.options.map((option) => option.value).filter((value) => wanted.includes(slugify(value)));
  });
  return next;
};

export default function ProjectsPage() {
  usePageSetup("Projects | BCE., Ltd.");

  const facets = facetOptions();
  const [selection, setSelection] = useState<FilterSelection>(() => selectionFromUrl(facets));

  const visible = useMemo(() => {
    const matches = (project: Project) =>
      FACETS.every((facet) => {
        const chosen = selection[facet.key];
        return chosen.length === 0 || chosen.includes(facet.value(project));
      });
    return projects.filter(matches).sort((a, b) => Number(yearOf(b.period)) - Number(yearOf(a.period)));
  }, [selection]);

  // Grouped by completion year, newest first, exactly as the fleet archive groups vessels by delivery year.
  const groups = useMemo(() => {
    const byYear = new Map<string, Project[]>();
    visible.forEach((project) => {
      const year = yearOf(project.period) || "—";
      const list = byYear.get(year);
      if (list) list.push(project);
      else byYear.set(year, [project]);
    });
    return Array.from(byYear.entries());
  }, [visible]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    FACET_KEYS.forEach((key) => {
      params.delete(key);
      selection[key].forEach((value) => params.append(key, slugify(value)));
    });
    // Drop the "=" on valueless flags so a legacy address stays "?projects&category=piling".
    const query = params.toString().replace(/=(?=&|$)/g, "");
    history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
  }, [selection]);

  const toggleValue = (key: string, value: string) =>
    setSelection((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));

  const clearFacet = (key: string) => setSelection((current) => ({ ...current, [key]: [] }));
  const clearAll = () => setSelection(emptySelection());

  const listRef = useRef<HTMLElement>(null);
  // The cover drifts on the same one-rAF scroll pass as every other inner-page banner: the frame starts 40vh low and
  // rises as the hero leaves, so the statement travels at ~60% of the page and the photo at ~20%.
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  // Photos wipe in as the archive scrolls, once 15% up the viewport and loaded; re-armed whenever the filter changes,
  // since that remounts the tiles.
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
    root.querySelectorAll<HTMLElement>(".pl-tile__media:not(.is-revealed)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selection]);

  return (
    <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      {/* Hero banner: the full-bleed photograph with the statement over it, drifting with the scroll exactly as the
          other page covers do. */}
      <section className="pl-banner" data-px="hero" data-header-title="Projects">
        <div className="pl-banner__frame">
          <div className="pl-banner__media">
            <img src="/Image/bce/about-hero-banner.webp" alt="" fetchPriority="high" decoding="async" />
          </div>

          <div className="pl-banner__body">
            <span className="pl-banner__label">Projects</span>
            <h1 data-split data-split-type="words" className="pl-banner__title">
              Building Cambodia from the ground up
            </h1>
          </div>
        </div>
      </section>

      <div className="pl-shell">
        <FilterBar
          facets={facets}
          selection={selection}
          onToggle={toggleValue}
          onClearFacet={clearFacet}
          onClearAll={clearAll}
          label="Filter projects"
        />

        <div className="fx-meta-row">
          <FilterMeta
            facets={facets}
            selection={selection}
            count={`${visible.length} ${visible.length === 1 ? "project" : "projects"}`}
            onToggle={toggleValue}
          />
        </div>

        <section ref={listRef} className="pl-list" aria-label="Projects" data-reveal-ready>
          {visible.length === 0 && (
            <div className="pl-empty">
              <p>No projects match these filters.</p>
              <button type="button" className="pl-empty__clear" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}

          {groups.map(([year, list]) => (
            <div className="pl-group" key={year}>
              <span className="pl-group__year">{year}</span>

              <div className="pl-group__grid">
                {list.map((project) => (
                  <a
                    key={project.slug}
                    href={projectHref(project.slug)}
                    className="pl-tile"
                    data-cursor-icon="arrow"
                  >
                    <div className="pl-tile__media">
                      <img src={project.gallery[0].image} alt={`${project.name}, ${project.location}`} loading="lazy" />
                      <span className="pl-tile__cat">{project.category}</span>
                    </div>

                    <div className="pl-tile__body">
                      <h2 className="pl-tile__name">{project.name}</h2>
                      <p className="pl-tile__meta">
                        {project.location}
                        <span aria-hidden="true"> · </span>
                        {yearOf(project.period)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <QuoteCta href="/quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
