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
  provinceTotal,
  regions,
  totalProjects,
} from "./Coverage";

// Coverage (/coverage), the homepage map's information as a page of its own: the same fourteen locations, the years
// behind them, the completed-project and equipment figures, and the same province highlights, set out so each one can
// be read rather than watched scroll past. The homepage keeps its pinned story (src/Coverage.tsx); this page reuses its
// data so the two can never disagree. The map and the province card are one full-screen band: the map is the page, and
// a province's details arrive only when it is chosen, so the whole list of places is never on screen at once.
// Per-province project counts and machine allocations are deliberately absent: the Corporate Profile gives national
// totals only.
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

// One zone name for every province, served or ready, so the panel can place a selected place in its region.
const provinceZone: Record<string, string> = {
  ...Object.fromEntries(regions.flatMap((r) => r.places.map((p) => [p, r.name]))),
  ...READY_ZONE,
};

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

// The map, in the shared province coordinate space, padded so the country never touches the frame edge. It is drawn as
// a paper map rather than a dark plate: every province keeps a light fill so the country reads as one landmass, the
// served ones take the ink, and the selected one takes a brand outline. A white pin marks each location where BCE
// works, the head office larger, red and labelled. Each province is a button, so the map is also the keyboard path.
function CoverageMap({ active, onSelect }: { active: number | null; onSelect: (index: number) => void }) {
  return (
    <svg
      viewBox="-20 -20 1040 964"
      className="cv-map"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label={`Map of Cambodia showing operational coverage in ${provinceTotal} provinces and Phnom Penh, with mobilization-ready provinces marked`}
    >
      {/* One silhouette pass under the fills gives the country a single edge where land meets paper. */}
      <g className="cv-silhouette" aria-hidden>
        {khmProvinces.map((p) => <path key={p.name} d={p.d} />)}
      </g>

      <g>
        {khmProvinces.map((p) => {
          const index = itemIndex[p.name];
          const covered = index !== undefined && items[index].isCovered;
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
        const isHQ = it.name === HQ;
        return (
          <g
            key={it.name}
            className={`cv-pin${index === active ? " is-active" : ""}${isHQ ? " is-hq" : ""}`}
            aria-hidden
            onClick={() => onSelect(index)}
          >
            <circle cx={it.p.x} cy={it.p.y} r={isHQ ? 11 : 6} />
            {isHQ && <text x={it.p.x + 20} y={it.p.y + 4}>HQ</text>}
          </g>
        );
      })}

      <g className="cv-scale" aria-hidden>
        <line x1="26" y1="912" x2="200" y2="912" />
        <line x1="26" y1="906" x2="26" y2="918" />
        <line x1="200" y1="906" x2="200" y2="918" />
        <text x="26" y="899">100 km</text>
      </g>
    </svg>
  );
}

export default function CoveragePage() {
  usePageSetup("Coverage: 13 Provinces + Phnom Penh | BCE");
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);
  const [glanceRef, glanceIn] = useInView<HTMLDivElement>();

  // Nothing is open until a province is chosen: the map carries the page, the panel answers one tap at a time.
  // The head office is chosen from the start, so the left column always carries a place.
  const [active, setActive] = useState(0);

  const copy = homepage.coverage;
  const sel = items[active];
  const isHQ = sel.name === HQ;

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

        {/* 02 Coverage by zone: the title and the chosen province hold the left column, the map fills the right. The
            head office is chosen from the start; a click changes the place, nothing else on the page. */}
        <section id="coverage" data-header-title="Coverage by zone" aria-labelledby="cv-coverage" className="cv-map-band">
          <div className="cv-map-stage">
            <div className="cv-map-side">
              <div className="cv-map-head">
                <p data-split="content" className="ol-label">Coverage by zone</p>
                <h2 id="cv-coverage" data-split className="cv-map-title">Delivered province by province.</h2>
              </div>

              <aside className="cv-info" aria-live="polite">
                <div className="cv-info-inner">
                  <p className="cv-info-meta">
                    <span className={`cv-selected-status${sel.isCovered ? "" : " is-ready"}`}>
                      {sel.isCovered ? (isHQ ? "Head office" : "Served") : "Mobilization ready"}
                    </span>
                  </p>
                  <p className="cv-info-zone">{provinceZone[sel.name]}</p>
                  <p className="cv-info-distance">{`~${sel.km} km from Battambang`}</p>
                  <p className="cv-info-name">{sel.name}</p>
                  <p className="cv-info-highlight">{sel.highlight}</p>
                  <p className="cv-info-scope">{sel.scope}</p>
                </div>
              </aside>

              <div className="cv-map-tools">
                <ul className="cv-legend">
                  <li><span className="cv-key cv-key--covered" aria-hidden />{copy.story[0].label}</li>
                  <li><span className="cv-key cv-key--ready" aria-hidden />Mobilization ready</li>
                  <li><span className="cv-key cv-key--hq" aria-hidden />Head office</li>
                </ul>
                <p className="cv-credit">{copy.credit}</p>
              </div>
            </div>

            <div className="cv-map-main">
              <div className="cv-map-canvas">
                <CoverageMap active={active} onSelect={setActive} />
              </div>
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
