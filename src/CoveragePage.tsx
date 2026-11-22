import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup, useMediaReveal } from "./usePageSetup";
import { LabelCopy, OlButton, ParallaxHero, TextMedia, useScrollParallax } from "./ServiceBlocks";
import { homepage } from "./homepage";
import { khmProvinces } from "./cambodiaMap";
import { quoteHref } from "./company";
import { translate } from "./i18n";
import {
  FLEET,
  HQ,
  coveredItems,
  fleetTotal,
  items,
  otherProvinces,
  provinceTotal,
  regions,
  totalProjects,
} from "./Coverage";

// Coverage (/coverage), the homepage map's information as a page of its own: the same fourteen locations, the years
// behind them, the completed-project and equipment figures, and the same province highlights, set out so each one can
// be read rather than watched scroll past. The homepage keeps its pinned story (src/Coverage.tsx); this page reuses its
// data so the two can never disagree. The map and the four zones are one band: the map is the figure, the zone rows are
// the index, and a single readout answers a tap from a shape, a pin or a name. Per-province project counts and machine
// allocations are deliberately absent: the Corporate Profile gives national totals only.
//
// Design follows the Olympic-style blocks used by Quality, capability & HSE and Our Businesses: cover, labelled
// introduction with an index, the figures on the ink ground, light bands separated by hairlines, the site's mono
// labels and TT Commons.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

// Province names → their slot in the shared Coverage data (covered first, head office at the top).
const itemIndex = Object.fromEntries(items.map((it, i) => [it.name, i]));

// Every province outside the covered set is still reachable, so the four zones carry all 25: the fourteen served
// today, then the provinces BCE mobilises into on request. The Corporate Profile gives a national 2025 total but no
// per-province breakdown, so no provincial project figures are published here.
const READY_ZONE: Record<string, string> = {
  "Kampong Cham": "Plains",
  "Kampong Speu": "Plains",
  "Prey Veng": "Plains",
  "Svay Rieng": "Plains",
  Takeo: "Plains",
  "Tbong Khmum": "Plains",
  Kampot: "Coastal",
  Kep: "Coastal",
  Kratie: "Plateau & Mountain",
  Mondulkiri: "Plateau & Mountain",
  Ratanakiri: "Plateau & Mountain",
};

const zoneRows = regions.map((zone) => ({
  name: zone.name,
  covered: zone.places,
  ready: otherProvinces.filter((p) => READY_ZONE[p.name] === zone.name).map((p) => p.name),
}));

// The page's own index, under the introduction: the map and the zones are one section now, so the page has three bands.
const TOPICS = [
  ["figures", "Key figures"],
  ["coverage", "Coverage by zone"],
  ["fleet", "Equipment fleet"],
] as const;

// The key figures use the project-highlights "at a glance" grid: the title holds on the left while the bordered cells
// animate in on the right. Same trigger as the project and fleet pages.
function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      io.disconnect();
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function Rows({ rows }: { rows: [number, string][] }) {
  return (
    <ul className="ol-rows">
      {rows.map(([count, label], i) => (
        <li key={label} data-reveal className="ol-row" style={{ "--k": i } as CSSProperties}>
          <span>{label}</span>
          <span>{pad(count)}</span>
        </li>
      ))}
    </ul>
  );
}

// The map, in the shared 1000 × 924 province space so it scales with its frame. Every province can be chosen with a
// pointer; the covered ones carry the brand fill, and a pin marks each place where BCE works (the head office larger,
// at the top). It is one image to assistive tech: the zone rows below are the keyboard path, so the map never adds 25
// tab stops to the page.
function CoverageMap({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <div className="cv-map-frame">
      <svg
        viewBox="0 0 1000 924"
        className="cv-map"
        role="img"
        aria-label="Map of Cambodia showing where BCE works"
      >
        <g>
          {khmProvinces.map((p) => {
            const index = itemIndex[p.name];
            const item = index === undefined ? undefined : items[index];
            const covered = item?.isCovered ?? false;
            return (
              <path
                key={p.name}
                d={p.d}
                className={`cv-prov${covered ? " is-covered" : ""}${index === active ? " is-active" : ""}`}
                onClick={() => index !== undefined && onSelect(index)}
              >
                <title>{translate(p.name)}</title>
              </path>
            );
          })}
        </g>
        {coveredItems.map((it) => {
          const index = itemIndex[it.name];
          const isActive = index === active;
          const isHQ = it.name === HQ;
          return (
            <g
              key={it.name}
              className={`cv-pin${isActive ? " is-active" : ""}${isHQ ? " is-hq" : ""}`}
              aria-hidden
              onClick={() => onSelect(index)}
            >
              <circle cx={it.p.x} cy={it.p.y} r={isHQ ? 13 : 9} />
              <text x={it.p.x} y={it.p.y + 3} textAnchor="middle">{isHQ ? "HQ" : ""}</text>
            </g>
          );
        })}
      </svg>

      <ul className="cv-legend">
        <li><span className="cv-key cv-key--covered" aria-hidden />{homepage.coverage.story[0].label}</li>
        <li><span className="cv-key" aria-hidden />Mobilization ready</li>
      </ul>
    </div>
  );
}

// A place in a zone row. It selects the same province as the shapes and pins on the map, so the rows stay quiet text
// instead of becoming another wall of chips. Each name is its own inline unit, so a long one never breaks mid-word.
function Place({ name, active, onSelect }: { name: string; active: boolean; onSelect: () => void }) {
  return (
    <span className="cv-unit">
      <button type="button" className={`cv-place${active ? " is-active" : ""}`} aria-pressed={active} onClick={onSelect}>
        {name}
      </button>
    </span>
  );
}

export default function CoveragePage() {
  usePageSetup("Coverage | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);
  const [glanceRef, glanceIn] = useInView<HTMLDivElement>();

  // The chosen province, starting with the head office; the map shapes, the pins and the zone rows all drive it.
  const [active, setActive] = useState(0);
  const readoutRef = useRef<HTMLDivElement>(null);

  const copy = homepage.coverage;
  const sel = items[active];
  const isHQ = sel.name === HQ;

  // A tap on a name or a shape brings the readout back into view when the scroll has carried it off-screen; when it
  // is already visible, nothing moves.
  const select = (index: number, reveal = false) => {
    setActive(index);
    const el = readoutRef.current;
    if (!reveal || !el) return;
    const { top, bottom } = el.getBoundingClientRect();
    if (top >= 96 && bottom <= window.innerHeight) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } | null }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -110, force: true });
    else el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero label={copy.story[0].label} title={copy.titleLines} image={copy.image} alt={copy.imageAlt} />

      <div className="ol-page-body">
        <div className="cv-dark">
          {/* Introduction: the cover headline in one sentence, then the page index on the ink ground. */}
          <LabelCopy
            label={copy.story[0].label}
            className="ol-head qx-intro cv-intro"
            after={
              <ul className="ol-topics" aria-label="On this page">
                {TOPICS.map(([id, label], i) => (
                  <li key={id}><a href={`#${id}`}><span>{pad(i + 1)}</span>{label}</a></li>
                ))}
              </ul>
            }
          >
            {copy.intro}
          </LabelCopy>

          {/* 01 Key figures in the project-highlights "at a glance" layout: the title on the left, four bordered cells
              on the right — the locations, the years since 1995, the 2025 project total and the fleet. */}
          <section id="figures" data-nav-dark data-header-title="Key figures" aria-labelledby="cv-figures" className="ol-capacity cv-figures">
            <div className="glance-layout">
              <div className="glance-title-col">
                <div className="glance-title-sticky">
                  <p data-split="content" className="ol-label">Key figures</p>
                  <h2 id="cv-figures" data-split className="ol-capacity-title">{copy.story[0].lead}</h2>
                </div>
              </div>
              <div ref={glanceRef} className={`glance ${glanceIn ? "is-in" : ""}`}>
                <dl className="glance-grid">
                  <div className="glance-cell" style={{ "--i": 0 } as CSSProperties}>
                    <dt className="glance-label">
                      <span className="glance-label-title">Locations covered</span>
                      <span className="glance-label-note">13 provinces + Phnom Penh</span>
                    </dt>
                    <dd className="glance-num"><span>{provinceTotal + 1}</span></dd>
                  </div>
                  <div className="glance-cell" style={{ "--i": 1 } as CSSProperties}>
                    <dt className="glance-label">
                      <span className="glance-label-title">{copy.story[1].label}</span>
                      <span className="glance-label-note">{copy.story[1].lead}</span>
                    </dt>
                    <dd className="glance-num"><span>30+</span></dd>
                  </div>
                  <div className="glance-cell" style={{ "--i": 2 } as CSSProperties}>
                    <dt className="glance-label">
                      <span className="glance-label-title">{copy.story[2].label}</span>
                      <span className="glance-label-note">{copy.story[2].lead}</span>
                    </dt>
                    <dd className="glance-num"><span>{totalProjects}</span></dd>
                  </div>
                  <div className="glance-cell" style={{ "--i": 3 } as CSSProperties}>
                    <dt className="glance-label">
                      <span className="glance-label-title">{copy.story[3].lead}</span>
                      <span className="glance-label-note">{copy.fleetNote}</span>
                    </dt>
                    <dd className="glance-num"><span>{fleetTotal}</span></dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>

        {/* 02 Coverage by zone: the whole question in one band. The map holds the left, the four zones carry every
            place BCE reaches, and one readout under the map answers a tap from a shape, a pin or a name. */}
        <section id="coverage" data-header-title="Coverage by zone" aria-labelledby="cv-coverage" className="cv-band cv-coverage">
          <div className="cv-head">
            <p data-split="content" className="ol-label">Coverage by zone</p>
            <h2 id="cv-coverage" data-split className="cv-h2">Delivered province by province, from Pailin to Stung Treng.</h2>
            <p data-split="content" className="cv-lead">Select a province to see the work delivered there and its distance from Battambang.</p>
          </div>

          <div className="cv-cov">
            <div className="cv-cov-map">
              <CoverageMap active={active} onSelect={(i) => select(i, true)} />
              <p className="cv-credit">{copy.credit}</p>
            </div>

            <div className="cv-cov-side">
              <div ref={readoutRef} className="cv-selected" aria-live="polite">
                <p className="cv-selected-meta">
                  <span className={`cv-selected-status${sel.isCovered ? "" : " is-ready"}`}>
                    {sel.isCovered ? (isHQ ? "Head office" : "Served") : "Mobilization ready"}
                  </span>
                  <span className="cv-selected-km">{`~${sel.km} km from Battambang`}</span>
                </p>
                <p className="cv-selected-name">{sel.name}</p>
                <p className="cv-selected-highlight">{sel.highlight}</p>
                <p className="cv-selected-scope">{sel.scope}</p>
              </div>

              <ol className="cv-zones">
                {zoneRows.map((zone, i) => (
                  <li key={zone.name} data-reveal className="cv-zone" style={{ "--k": i } as CSSProperties}>
                    <div className="cv-zone-head">
                      <h3 className="cv-zone-name">{zone.name}</h3>
                      <span className="cv-zone-count" aria-hidden>{pad(zone.covered.length)}</span>
                    </div>
                    <p className="cv-zone-places">
                      {zone.covered.map((name) => (
                        <Place key={name} name={name} active={sel.name === name} onSelect={() => select(itemIndex[name], true)} />
                      ))}
                    </p>
                    {zone.ready.length > 0 && (
                      <p className="cv-zone-places cv-zone-places--ready">
                        <span className="cv-zone-tag">Mobilization ready</span>
                        {zone.ready.map((name) => (
                          <Place key={name} name={name} active={sel.name === name} onSelect={() => select(itemIndex[name], true)} />
                        ))}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              <p data-split="content" className="cv-note">Our plants, fleet and crews are based in Battambang and mobilise across Cambodia. Tell us your site and programme and we will confirm what we can bring.</p>
            </div>
          </div>
        </section>

        {/* 03 Equipment & fleet, the same inventory block as Quality & HSE, so the fleet behind the coverage reads
            on this page too. */}
        <div className="ol-panels">
          <TextMedia
            id="fleet"
            kicker={copy.story[3].label}
            title={copy.story[3].lead}
            image="/Image/bce/about-zoom-boom-pumps.webp"
            alt="BCE pump trucks and mixer trucks placing concrete on site"
            copy={[copy.fleetNote]}
            reverse
          >
            <Rows rows={FLEET} />
            <OlButton label="Equipment & fleet" href="/fleet" className="ol-tm-button" />
          </TextMedia>
        </div>
      </div>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
