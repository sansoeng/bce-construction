import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { businessDetailHref, businessDetails, findBusinessDetail, type BusinessDetail } from "./businessDetails";
import { offerings, quoteHref, unsplash } from "./company";
import { findProject, projectHref } from "./projects";
import { LabelCopy, ParallaxHero, useScrollParallax } from "./ServiceBlocks";
import { LineIcon } from "./LineIcon";
import FleetFigures from "./FleetFigures";

// One page per core business (/business/<slug>), after Skanska's service pages: full-screen cover, overview with
// links into the page, the reasons to work with BCE, the solutions we deliver, capacity figures in the dark band and
// related project highlights. Everything is built from the site's existing Olympic-style blocks and tokens
// (ServiceBlocks.tsx, index.css) so the pages match Our Businesses and Technical Capabilities.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const year = (period: string) => (period.match(/\d{4}/g) ?? []).pop() ?? "";

// Capacity figures count up as the dark band scrolls in. Only values that begin with a number animate ("04", "70 m³",
// "13+", "1995"); letter grades ("C35–C40") stay put. Leading zeros and any unit suffix are preserved while counting.
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\d[\d.,]*)(.*)$/);
    if (!el || !m) {
      setText(value);
      return;
    }
    const [, raw, suffix] = m;
    const target = Number(raw.replace(/,/g, ""));
    if (!Number.isFinite(target)) {
      setText(value);
      return;
    }
    const zeros = raw.length > 1 && raw.startsWith("0") ? raw.length : 0;
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const format = (n: number) => {
      let out = decimals ? n.toFixed(decimals) : String(Math.round(n));
      if (zeros) out = out.padStart(zeros, "0");
      return out + suffix;
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(value);
      return;
    }

    setText(format(0));
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started) return;
          started = true;
          io.disconnect();
          const t0 = performance.now();
          const duration = 1500;
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = 1 - (1 - p) ** 3;
            setText(p < 1 ? format(target * eased) : value);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="ol-figure-value" aria-label={value}>
      {text}
    </span>
  );
}

// The project records store corporate-profile pages as gallery images; these are photo crops of the same works for
// the highlight cards.
const projectPhoto: Record<string, string> = {
  "kampong-thom-bridge-foundations": "/Image/bce/photos/piling-rig.webp",
  "phnom-penh-tower-foundations": "/Image/bce/photos/building-frame.webp",
  "poipet-logistics-warehouse": "/Image/bce/photos/slab-pour.webp",
  "siem-reap-commercial-ready-mix": "/Image/bce/photos/concrete-discharge.webp",
  "battambang-provincial-road": "/Image/bce/photos/road-crew.webp",
  "sihanoukville-fleet-hire": "/Image/bce/photos/boom-pump.webp",
};

/**
 * The remaining businesses, as a horizontal rail: one compact row of tiles that scrolls left and right (trackpad,
 * touch, arrow keys or the buttons) instead of a 2 × 2 wall of oversized tiles.
 */
function OtherBusinessesRail({ items }: { items: BusinessDetail[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false, scrollable: false });

  const measure = () => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setEdges({ start: rail.scrollLeft <= 4, end: rail.scrollLeft >= max - 4, scrollable: max > 4 });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    measure();
    const onScroll = () => measure();
    rail.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [items.length]);

  const step = (direction: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const tile = rail.querySelector<HTMLElement>(".ol-other-tile");
    const gap = parseFloat(getComputedStyle(rail).columnGap || "24") || 24;
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    rail.scrollBy({ left: direction * ((tile?.offsetWidth ?? 320) + gap), behavior });
  };

  return (
    <>
      <ul
        ref={railRef}
        className="ol-others-grid"
        aria-label="Other businesses"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        {items.map((b) => (
          <li key={b.slug}>
            <a href={businessDetailHref(b.slug)} className="ol-other-tile">
              <img className="no-radius" src={offerings.find((o) => o.slug === b.slug)?.image ?? b.heroImage} alt="" loading="lazy" />
              <div className="ol-other-content">
                <p className="ol-other-label">{b.tagline}</p>
                <h3 className="ol-other-name">{b.name}</h3>
                <span className="fg-btn is-white ol-other-btn" aria-hidden>
                  <svg viewBox="0 0 14 11" fill="none" className="fg-btn-arrow">
                    <path d="M0.600006 0V6H13.1" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="9.18887" y="2.2251" width="5.56065" height="5.56065" transform="rotate(45 9.18887 2.2251)" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <span className="fg-btn-label">
                    <span className="fg-btn-line">Explore</span>
                    <span className="fg-btn-line">Explore</span>
                  </span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {edges.scrollable && (
        <div className="ol-others-nav">
          <p className="ol-others-hint" aria-hidden>Scroll sideways for more</p>
          <div className="ol-others-buttons">
            <button type="button" className="ol-rail-btn" onClick={() => step(-1)} disabled={edges.start} aria-label="Previous businesses">
              ←
            </button>
            <button type="button" className="ol-rail-btn" onClick={() => step(1)} disabled={edges.end} aria-label="Next businesses">
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}


export default function BusinessDetailPage({ slug }: { slug: string }) {
  const business = findBusinessDetail(slug);
  const rootRef = useRef<HTMLElement>(null);
  usePageSetup(business ? `${business.name} | BCE., Ltd.` : "Our businesses | BCE., Ltd.");
  useScrollParallax(rootRef);

  if (!business) return null;

  const related = business.projects.map(findProject).filter((p) => p !== undefined);
  const others = businessDetails.filter((b) => b.slug !== business.slug);

  return (
    <main ref={rootRef} className="ol-page ol-biz relative z-[1] overflow-x-clip">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero label="Core business" headerTitle={business.name} title={business.name} image={unsplash(business.heroImage, 2400)} alt={business.heroAlt} />

      <div className="ol-page-body">
        <LabelCopy label={business.tagline}>
          {business.intro}
        </LabelCopy>

        <section id="values" data-header-title={business.valuesTitle} aria-labelledby="biz-values" className="ol-values">
          <div className="ol-values-head">
            <p data-split="content" className="ol-label">{business.valuesKicker}</p>
            <h2 id="biz-values" data-split className="ol-values-title">{business.valuesTitle}</h2>
          </div>
          <ul className="ol-values-grid">
            {business.values.map((v) => (
              <li key={v.title} data-reveal className="ol-value">
                <span className="ol-value-icon" aria-hidden>
                  <LineIcon name={v.icon} className="size-full" />
                </span>
                <h3 className="ol-value-title">{v.title}</h3>
                <p className="ol-value-text">{v.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="solutions" data-header-title={business.solutionsTitle} aria-labelledby="biz-solutions" className="ol-solutions">
          <div className="ol-solutions-head">
            <p data-split="content" className="ol-label">{business.solutionsKicker}</p>
            <h2 id="biz-solutions" data-split className="ol-solutions-title">{business.solutionsTitle}</h2>
            <p data-split="content" className="ol-solutions-lead">{business.solutionsLead}</p>
          </div>
          <ul className="ol-solutions-grid">
            {business.solutions.map((s) => (
              <li key={s.title} data-reveal className="ol-solution">
                <div className="ol-solution-media"><img src={s.image} alt={s.alt} loading="lazy" /></div>
                <h3 className="ol-solution-title">{s.title}</h3>
                <p className="ol-solution-text">{s.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Fleet hire shows the Equipment & fleet page's own figures band (shared component): the title holds on the
            left while every owned machine counts up on the right. Other businesses keep the four-figure summary. */}
        {business.slug === "equipment-rental" ? (
          <FleetFigures
            id="capacity"
            headingId="biz-capacity"
            headerTitle={business.capacityTitle}
            label={business.capacityKicker}
            title={business.capacityTitle}
            copy={business.capacityCopy}
            contactLabel="Talk to our team"
          />
        ) : (
          <section id="capacity" data-nav-dark data-header-title={business.capacityTitle} aria-labelledby="biz-capacity" className="ol-capacity">
            <div className="ol-capacity-head">
              <p data-split="content" className="ol-label">{business.capacityKicker}</p>
              <h2 id="biz-capacity" data-split className="ol-capacity-title">{business.capacityTitle}</h2>
              <p data-split="content" className="ol-capacity-copy">{business.capacityCopy}</p>
            </div>
            <ul className="ol-capacity-grid">
              {business.figures.map((f) => (
                <li key={f.label} data-reveal className="ol-figure">
                  <CountUp value={f.value} />
                  <span className="ol-figure-label">{f.label}</span>
                </li>
              ))}
            </ul>
            <div className="ol-capacity-contact">
              <p className="ol-label">Talk to our team</p>
              <div className="ol-capacity-links">
                {phones.slice(0, 2).map((p) => <a key={p} href={tel(p)}>{p}</a>)}
                <a href={`mailto:${siteSettings.contact.email}`}>{siteSettings.contact.email}</a>
                <a href={`https://t.me/${siteSettings.contact.telegram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">Telegram</a>
              </div>
            </div>
          </section>
        )}

        {/* What to send us, after the calibration block on Quality & HSE: the uppercase section heading and grey
            copy on the twelve-column split, then a full-width rule opening the brief label and its ruled rows. */}
        <section id="prepare" data-header-title="What to send us" aria-labelledby="biz-prepare" className="qh-section biz-prepare">
          <div className="qx-split">
            <div className="qx-head">
              <h2 id="biz-prepare" data-split className="pd-h2">
                What to send us
              </h2>
            </div>
            <div className="qx-body">
              <div className="qx-copy w-[520px] max-w-full">
                <p data-split="content">The more of this we have, the faster and firmer your quotation.</p>
              </div>
              <ArrowButton href={quoteHref(business.slug)} label="Request a quotation" className="mt-8" />
            </div>
          </div>
          {business.prepare?.length ? (
            <div data-reveal className="qx-areas pd-rule">
              <h3 data-split="content" className="qx-label qx-areas-label">Before we quote</h3>
              <ol className="qx-areas-list">
                {business.prepare.map((item, index) => (
                  <li key={item} data-reveal className={`qx-area${index ? " pd-rule" : ""}`} style={{ "--rd": `${index * 0.08}s` } as CSSProperties}>
                    <span data-split="content" className="qx-label">{String(index + 1).padStart(2, "0")}</span>
                    <span data-split="content" className="qx-cell-text">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>

        <section id="projects" data-header-title="Project highlights" aria-labelledby="biz-projects" className="ol-work">
          <div className="ol-work-head">
            <div className="ol-work-head-copy">
              <p data-split="content" className="ol-label">Project highlights</p>
              <h2 id="biz-projects" data-split className="ol-work-title">Selected work</h2>
            </div>
            <ArrowButton href="/projects" label="All projects" theme="outline" />
          </div>
          <div className="ol-work-grid">
            {related.map((p) => (
              <a key={p.slug} href={projectHref(p.slug)} className="ol-work-card">
                <div className="ol-work-media"><img src={projectPhoto[p.slug] ?? p.gallery[0].image} alt={`${p.name}, ${p.location}`} loading="lazy" /></div>
                <div className="ol-work-info">
                  <span className="ol-work-name">{p.name}</span>
                  <span className="ol-work-location">{p.location}</span>
                  <span className="ol-work-meta">{p.category} · {year(p.period)}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="ol-others" aria-labelledby="biz-others">
          <div className="ol-others-head">
            <p id="biz-others" data-split="content" className="ol-label">Other businesses</p>
            <ArrowButton href="/businesses" label="All businesses" theme="outline" />
          </div>
          <OtherBusinessesRail items={others} />
        </section>
      </div>

      <QuoteCta href={quoteHref(business.slug)} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
