import { useEffect, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { businessDetailHref, businessDetails, findBusinessDetail } from "./businessDetails";
import { offerings, quoteHref, unsplash } from "./company";
import { findProject, projectHref } from "./projects";
import { LabelCopy, ParallaxHero, useScrollParallax } from "./ServiceBlocks";

// One page per core business (/?business=<slug>), after Skanska's service pages: full-screen cover, overview with
// links into the page, the reasons to work with BCE, the solutions we deliver, capacity figures in the dark band and
// related project highlights. Everything is built from the site's existing Olympic-style blocks and tokens
// (ServiceBlocks.tsx, index.css) so the pages match Our Businesses and Technical Capabilities.

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");
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
  "kampong-thom-bridge-foundations": "/Image/bce/photos/piling-rig.jpg",
  "phnom-penh-tower-foundations": "/Image/bce/photos/building-frame.jpg",
  "poipet-logistics-warehouse": "/Image/bce/photos/slab-pour.jpg",
  "siem-reap-commercial-ready-mix": "/Image/bce/photos/concrete-discharge.jpg",
  "battambang-provincial-road": "/Image/bce/photos/road-crew.jpg",
  "sihanoukville-fleet-hire": "/Image/bce/photos/boom-pump.jpg",
};

export default function BusinessDetailPage({ slug }: { slug: string }) {
  const business = findBusinessDetail(slug);
  const rootRef = useRef<HTMLElement>(null);
  usePageSetup(business ? `${business.name} | BCE., Ltd.` : "Our businesses | BCE., Ltd.");
  useScrollParallax(rootRef);

  if (!business) return null;

  const related = business.projects.map(findProject).filter((p) => p !== undefined);
  const others = businessDetails.filter((b) => b.slug !== business.slug);

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip">
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
            {business.values.map((v, i) => (
              <li key={v.title} data-reveal className="ol-value">
                <span className="ol-value-index">{pad(i + 1)}</span>
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
              <a href="mailto:bcebtb999@gmail.com">bcebtb999@gmail.com</a>
              <a href="https://t.me/thendLP" target="_blank" rel="noreferrer">Telegram</a>
            </div>
          </div>
        </section>

        <section id="projects" data-header-title="Project highlights" aria-labelledby="biz-projects" className="ol-work">
          <div className="ol-work-head">
            <div className="ol-work-head-copy">
              <p data-split="content" className="ol-label">Project highlights</p>
              <h2 id="biz-projects" data-split className="ol-work-title">Selected work</h2>
            </div>
            <ArrowButton href="/?projects" label="All projects" theme="outline" />
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
            <ArrowButton href="/?businesses" label="All businesses" theme="outline" />
          </div>
          <div className="ol-others-grid">
            {others.map((b) => (
              <a key={b.slug} href={businessDetailHref(b.slug)} className="ol-other-tile">
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
            ))}
          </div>
        </section>
      </div>

      <QuoteCta href={quoteHref(business.slug)} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
