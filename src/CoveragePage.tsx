import { siteSettings } from "./siteSettings";
import { useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup, useMediaReveal } from "./usePageSetup";
import { LabelCopy, OlButton, ParallaxHero, TextMedia, useScrollParallax } from "./ServiceBlocks";
import { homepage } from "./homepage";
import { khmProvinces } from "./cambodiaMap";
import { quoteHref } from "./company";
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

// Coverage (/?coverage), the homepage map's information as a page of its own: the same fourteen locations, the years
// behind them, the completed-project and equipment figures, and the same province highlights, set out so each one can
// be read rather than watched scroll past. The homepage keeps its pinned story (src/Coverage.tsx); this page reuses its
// data so the two can never disagree, and adds an explorable map, the four geographic zones, a province register and
// the fleet. Per-province project counts and machine allocations are deliberately absent: the Corporate Profile gives
// national totals only.
//
// Design follows the Olympic-style blocks used by Quality, capability & HSE and Our Businesses: cover, labelled
// introduction with an index, the figures on the ink ground, light bands separated by hairlines, the site's mono
// labels and TT Commons.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

// Province names → their slot in the shared Coverage data (covered first, head office at the top).
const itemIndex = Object.fromEntries(items.map((it, i) => [it.name, i]));

// The four zones, each with the places BCE has served. The Corporate Profile gives a national 2025 total but no
// per-province breakdown, so no provincial project figures are published here.
const zoneStats = regions.map((zone) => ({
  name: zone.name,
  places: zone.places.map((name) => ({ name })),
}));

// The page's own index, under the introduction.
const TOPICS = [
  ["figures", "Key figures"],
  ["map", "Coverage map"],
  ["zones", "Coverage by zone"],
  ["provinces", "Province register"],
  ["ready", "Mobilization ready"],
  ["fleet", "Equipment fleet"],
] as const;

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

// The map, in the shared 1000 × 924 province space so it scales with its frame. Every province can be chosen; the
// covered ones carry the brand fill, and a pin marks each place where BCE works (the head office larger, at the top).
function CoverageMap({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <div className="cv-map-frame">
      <svg viewBox="0 0 1000 924" className="cv-map" role="group" aria-label="Map of Cambodia showing where BCE works">
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
                role="button"
                tabIndex={0}
                aria-label={`Select province ${p.name}`}
                aria-pressed={index === active}
                onClick={() => index !== undefined && onSelect(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (index !== undefined) onSelect(index);
                  }
                }}
              >
                <title>{p.name}</title>
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

export default function CoveragePage() {
  usePageSetup("Coverage | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);

  // The chosen province, starting with the head office; the map, the chips and the register all drive it.
  const [active, setActive] = useState(0);

  const copy = homepage.coverage;
  const sel = items[active];
  const isHQ = sel.name === HQ;

  const showOnMap = (index: number) => {
    setActive(index);
    const target = document.getElementById("map");
    if (!target) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } | null }).__lenis;
    if (lenis) lenis.scrollTo(target, { offset: -90 });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero label={copy.story[0].label} title={copy.titleLines} image={copy.image} alt={copy.imageAlt} />

      <div className="ol-page-body">
        {/* Introduction: the cover headline in one sentence, then the page index. */}
        <LabelCopy
          label={copy.story[0].label}
          className="ol-head qx-intro"
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

        {/* 01 Key figures, after olympic.no's dark capacity band: the numbers behind the map — the locations, the
            years since 1995, the 2025 project total and the fleet, with the piling-rig note the count leaves out. */}
        <section id="figures" data-nav-dark data-header-title="Key figures" aria-labelledby="cv-figures" className="ol-capacity cv-figures">
          <div className="ol-capacity-head">
            <p data-split="content" className="ol-label">Key figures</p>
            <h2 id="cv-figures" data-split className="ol-capacity-title">{copy.story[0].lead}</h2>
            <p data-split="content" className="ol-capacity-copy">13 provinces + Phnom Penh, all served from one base.</p>
          </div>
          <ul className="ol-capacity-grid">
            <li data-reveal className="ol-figure">
              <span className="ol-figure-value">{provinceTotal + 1}</span>
              <span className="ol-figure-label">Locations covered</span>
            </li>
            <li data-reveal className="ol-figure">
              <span className="ol-figure-value">30<span>+</span></span>
              <span className="ol-figure-label">{copy.story[1].lead}</span>
            </li>
            <li data-reveal className="ol-figure">
              <span className="ol-figure-value">{totalProjects}</span>
              <span className="ol-figure-label">{copy.story[2].lead}</span>
            </li>
            <li data-reveal className="ol-figure">
              <span className="ol-figure-value">{fleetTotal}</span>
              <span className="ol-figure-label">{copy.story[3].lead}</span>
            </li>
          </ul>
          <p data-reveal className="cv-fleet-note">{copy.fleetNote}</p>
        </section>

        {/* 02 The map: the homepage's pinned story as one explorable still. Pick a province by its shape or its pin,
            then read the work delivered there and its distance from the Battambang base. */}
        <section id="map" data-header-title="Coverage map" aria-labelledby="cv-map" className="cv-band">
          <div className="cv-head">
            <p data-split="content" className="ol-label">Choose a location</p>
            <h2 id="cv-map" data-split className="cv-h2">Where we work</h2>
            <p data-split="content" className="cv-lead">Select a province to see the work delivered there and its distance from Battambang.</p>
          </div>

          <div className="cv-map-grid">
            <div className="cv-map-col">
              <CoverageMap active={active} onSelect={setActive} />

              <div className="cv-chips" role="group" aria-label="Provinces">
                {items.map((it, i) => (
                  <button
                    key={it.name}
                    type="button"
                    aria-pressed={i === active}
                    className={`cv-chip${it.isCovered ? "" : " is-ready"}${i === active ? " is-active" : ""}`}
                    onClick={() => setActive(i)}
                  >
                    {it.name}
                  </button>
                ))}
              </div>

              <p className="cv-credit">{copy.credit}</p>
            </div>

            <aside className="cv-card" aria-live="polite" aria-labelledby="cv-card-name">
              <div className="cv-card-top">
                <span className="ol-label">{isHQ ? "Head office" : sel.region}</span>
                {sel.badge && <span className="cv-badge">{sel.badge}</span>}
              </div>
              <h3 id="cv-card-name" className="cv-card-name">{sel.name}</h3>

              {sel.isCovered ? (
                <>
                  <p className="cv-figure cv-figure--word">Served</p>
                  <p className="cv-figure-label">Project experience since 1995</p>
                </>
              ) : (
                <>
                  <p className="cv-figure cv-figure--word">Ready</p>
                  <p className="cv-figure-label">Available for deployment</p>
                </>
              )}

              <p className="cv-card-highlight">{sel.highlight}</p>
              <p className="cv-card-scope">{sel.scope}</p>

              <dl className="cv-facts">
                <div>
                  <dt>From Battambang</dt>
                  <dd>~{sel.km} km</dd>
                </div>
                <div>
                  <dt>Region</dt>
                  <dd>{sel.region}</dd>
                </div>
              </dl>

              <div className="cv-card-equip">
                <p className="ol-label">{sel.equipment.length ? "Equipment based here" : "Mobilised from Battambang on request"}</p>
                {sel.equipment.length > 0 && (
                  <ul>
                    {sel.equipment.map(([count, label]) => (
                      <li key={label}><span>{pad(count)}</span>{label}</li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* 03 The four zones behind the province list, each with its places one tap from the map. */}
        <section id="zones" data-header-title="Coverage by zone" aria-labelledby="cv-zones" className="cv-band">
          <div className="cv-head">
            <p data-split="content" className="ol-label">Coverage by zone</p>
            <h2 id="cv-zones" data-split className="cv-h2">Delivered province by province, from Pailin to Stung Treng.</h2>
          </div>
          <ul className="cv-zones">
            {zoneStats.map((zone, i) => (
              <li key={zone.name} data-reveal className="cv-zone" style={{ "--k": i } as CSSProperties}>
                <div className="cv-zone-top">
                  <h3 className="cv-zone-name">{zone.name}</h3>
                  <p className="cv-zone-figure">{zone.places.length}</p>
                </div>
                <p className="cv-zone-label">Locations covered</p>
                <ul className="cv-zone-places">
                  {zone.places.map((place) => (
                    <li key={place.name}>
                      <button type="button" onClick={() => showOnMap(itemIndex[place.name])}>
                        {place.name}
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2.6 9.4 9.4 2.6M4.4 2.6h5v5" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* 04 Province register: one card per covered province, the map card's information set out in full. */}
        <section id="provinces" data-header-title="Province register" aria-labelledby="cv-provinces" className="cv-band">
          <div className="cv-head">
            <p data-split="content" className="ol-label">Province register</p>
            <h2 id="cv-provinces" data-split className="cv-h2">Provinces served</h2>
            <p data-split="content" className="cv-lead">Every location on the map, the work delivered there and the distance from our Battambang base.</p>
          </div>

          <ol className="cv-register">
            {coveredItems.map((it, i) => (
              <li key={it.name} data-reveal className="cv-reg" style={{ "--k": i % 2 } as CSSProperties}>
                <div className="cv-reg-head">
                  <span className="cv-reg-index">{pad(i + 1)}</span>
                  <h3 className="cv-reg-name">{it.name}</h3>
                  {it.name === HQ && <span className="cv-badge cv-badge--light">Head office</span>}
                </div>

                <div className="cv-reg-figures">
                  <p className="cv-reg-label">Served since 1995</p>
                </div>

                <p className="cv-reg-highlight">{it.highlight}</p>
                <p className="cv-reg-scope">{it.scope}</p>

                <dl className="cv-reg-meta">
                  <div><dt>Region</dt><dd>{it.region}</dd></div>
                  <div><dt>From Battambang</dt><dd>~{it.km} km</dd></div>
                </dl>

                {it.equipment.length > 0 && (
                  <ul className="cv-reg-equip">
                    {it.equipment.map(([count, label]) => (
                      <li key={label}><span>{pad(count)}</span>{label}</li>
                    ))}
                  </ul>
                )}

                <button type="button" className="cv-reg-link" onClick={() => showOnMap(itemIndex[it.name])}>
                  Show on map
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2.6 9.4 9.4 2.6M4.4 2.6h5v5" />
                  </svg>
                </button>
              </li>
            ))}
          </ol>
        </section>

        {/* 05 The rest of the country: provinces BCE can mobilise into, with the work it would take on. */}
        <section id="ready" data-header-title="Mobilization ready" aria-labelledby="cv-ready" className="cv-band cv-band--soft">
          <div className="cv-head">
            <p data-split="content" className="ol-label">Mobilization ready</p>
            <h2 id="cv-ready" data-split className="cv-h2">Available for deployment</h2>
            <p data-split="content" className="cv-lead">Beyond the fourteen locations we serve today, BCE mobilises its fleet into additional provinces on request.</p>
          </div>
          <ul className="cv-ready-list">
            {otherProvinces.map((it, i) => (
              <li key={it.name} data-reveal className="cv-ready" style={{ "--k": i % 2 } as CSSProperties}>
                <div className="cv-ready-top">
                  <h3 className="cv-ready-name">{it.name}</h3>
                  <span className="cv-badge cv-badge--light">{it.badge}</span>
                </div>
                <p className="cv-ready-highlight">{it.highlight}</p>
                <p className="cv-ready-scope">{it.scope}</p>
                <span className="cv-ready-km">~{it.km} km from Battambang</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 06 Equipment & fleet, the same inventory block as Quality & HSE, so the fleet behind the coverage reads
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
            <OlButton label="Equipment & fleet" href="/?quality#equipment-fleet" className="ol-tm-button" />
          </TextMedia>
        </div>

        {/* Closing note: where the numbers come from and where to take the conversation. */}
        <section className="cv-outro" aria-labelledby="cv-outro">
          <p data-split="content" className="ol-label">Coverage</p>
          <h2 id="cv-outro" data-split="content" className="cv-outro-title">Need us in a province not on this list?</h2>
          <p data-split="content" className="cv-outro-copy">Our plants, fleet and crews are based in Battambang and mobilise across Cambodia. Tell us your site and programme and we will confirm what we can bring.</p>
          <div className="cv-outro-actions">
            <ArrowButton href={quoteHref()} label="Request a quotation" />
            <ArrowButton href="/?contact" label="Contact us" theme="outline" />
          </div>
        </section>
      </div>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
