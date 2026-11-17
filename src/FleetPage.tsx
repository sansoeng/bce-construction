import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { useMediaReveal, usePageSetup } from "./usePageSetup";
import { LabelCopy, ParallaxHero, useScrollParallax } from "./ServiceBlocks";
import { LineIcon } from "./LineIcon";
import { quality } from "./quality";

// Equipment & fleet (/fleet), the standalone page the Recommendation's sitemap asks for: what BCE owns, how many, what
// each machine is for, and how to hire it. Every figure comes from quality.ts (the Quality page's own document) so the
// two pages cannot disagree. No rates and no per-machine availability are published — the quotation is per project.
//
// The page follows the same Olympic-style blocks as Quality & HSE and Coverage: the parallax cover, a labelled
// introduction with an on-page index, one ink band carrying the key figures in the project-highlights grid, the plant
// as a photo beside the corporate profile's numbered machine cards, and the hire/dispatch contact.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

const TOPICS = [
  ["fleet-inventory", "What we own"],
  ["fleet-machines", "Plant & machines"],
] as const;

const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";

// Fleet counts arrive as content ("04  /  70 m³/hr each"), and Khmer content can use Khmer numerals. Read the first
// number either way, so the headline total survives a language switch.
function firstNumber(value: string) {
  const normalized = value.replace(/[០-៩]/g, (digit) => String(KHMER_DIGITS.indexOf(digit)));
  const match = normalized.match(/\d[\d.,]*/);
  if (!match) return 0;
  const number = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
}

// The key figures use the same "at a glance" grid as the project highlights: the title holds on the left while the
// bordered cells count up on the right. This is the project page's in-view trigger, kept local to the fleet page.
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

// The key figures count up as the dark band scrolls in, as on the business pages. Reduced motion shows the value.
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const target = firstNumber(value);
    if (!el || !target) {
      setText(value);
      return;
    }
    const zeros = value.length > 1 && value.startsWith("0") ? value.length : 0;
    const format = (n: number) => {
      let out = String(Math.round(n));
      if (zeros) out = out.padStart(zeros, "0");
      return out;
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

// One glance cell, the same markup as the project highlights and the homepage: label and note at the top, the figure
// set large at the foot. Counts animate; the concrete capacity is a fixed figure with its unit.
function Stat({ label, note, value, index, unit, count = true }: {
  label: string;
  note: string;
  value: string;
  index: number;
  unit?: string;
  count?: boolean;
}) {
  return (
    <div className="glance-cell" style={{ "--i": index } as CSSProperties}>
      <dt className="glance-label">
        <span className="glance-label-title">{label}</span>
        <span className="glance-label-note">{note}</span>
      </dt>
      <dd className="glance-num">
        <span>
          {count ? <CountUp value={value} /> : value}
          {unit ? <span className="pd-unit">{unit}</span> : null}
        </span>
      </dd>
    </div>
  );
}

export default function FleetPage() {
  usePageSetup(
    "Equipment & fleet | BCE., Ltd.",
    "BCE's own plant and fleet: batching plants, mixer trucks, pump trucks and piling rigs, maintained in-house and mobilised from Battambang for hire across Cambodia.",
  );
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);
  const [glanceRef, glanceIn] = useInView<HTMLDivElement>();

  const fleet = quality.fleet;
  const rows = fleet.rows;
  const fleetTotal = rows.reduce((total, row) => total + firstNumber(row.value), 0);
  const rowCount = (index: number) => rows[index]?.value.split("/")[0].trim() || "00";
  const machines = fleet.machines;
  const concreteCapacity = rows[0]?.note.match(/\d+/)?.[0] ?? "70";
  const stats: { label: string; note: string; value: string; unit?: string; count?: boolean }[] = [
    { label: "Machines in our own fleet", note: "Owned and maintained", value: String(fleetTotal) },
    ...(rows[0] ? [{ label: rows[0].label, note: rows[0].note, value: rowCount(0) }] : []),
    { label: "Concrete capacity", note: "Per batching plant", value: concreteCapacity, unit: "m³/hr", count: false },
    ...rows.slice(1).map((row, index) => ({ label: row.label, note: row.note, value: rowCount(index + 1) })),
  ];

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero
        label={fleet.kicker}
        headerTitle="Equipment & fleet"
        title={fleet.title}
        image={fleet.image}
        alt={fleet.imageAlt}
      />

      <div className="ol-page-body">
        <div className="fl-dark">
          {/* Fleet overview as the other inner pages, on the ink ground so it runs straight into the figures band. */}
          <LabelCopy
            label="Fleet overview"
            className="ol-head qx-intro fl-intro"
            after={
              <>
                <p className="fl-intro-note">{fleet.note}</p>
                <ul className="ol-topics" aria-label="On this page">
                  {TOPICS.map(([id, label], i) => (
                    <li key={id}>
                      <a href={`#${id}`}>
                        <span>{pad(i + 1)}</span>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            }
          >
            {fleet.copy[0]}
          </LabelCopy>

          {/* What we own, in numbers: the title and copy on the left, every count in the project-highlights grid on
              the right. One ink ground for both this band and the introduction above. */}
          <section id="fleet-inventory" data-nav-dark data-header-title="What we own" aria-labelledby="fl-figures" className="ol-capacity fl-figures-band">
            <div className="glance-layout">
              <div className="glance-title-col">
                <div className="glance-title-sticky">
                  <p data-split="content" className="ol-label">{fleet.figuresLabel}</p>
                  <h2 id="fl-figures" data-split className="ol-capacity-title">{fleet.figuresTitle}</h2>
                  <p data-split="content" className="ol-capacity-copy">{fleet.figuresCopy}</p>
                </div>
              </div>
              <div ref={glanceRef} className={`glance ${glanceIn ? "is-in" : ""}`}>
                <dl className="glance-grid fl-glance-grid">
                  {stats.map((stat, index) => (
                    <Stat key={stat.label} {...stat} index={index} />
                  ))}
                </dl>
              </div>
            </div>

            <div className="ol-capacity-contact">
              <p className="ol-label">Hire &amp; dispatch</p>
              <div className="ol-capacity-links">
                {phones.slice(0, 2).map((phone) => (
                  <a key={phone} href={tel(phone)}>{phone}</a>
                ))}
                <a href={`mailto:${siteSettings.contact.email}`}>{siteSettings.contact.email}</a>
                <a href={`https://t.me/${siteSettings.contact.telegram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">Telegram</a>
              </div>
            </div>
          </section>
        </div>

        {/* Plant & machines, after the Corporate Profile's equipment page: one large plant photo beside the nine
            numbered machine cards — badge, line mark, name, thumbnail and the points that matter on site. */}
        <section id="fleet-machines" data-header-title={fleet.machinesTitle} aria-labelledby="fl-machines" className="ol-solutions">
          <div className="ol-solutions-head">
            <p data-split="content" className="ol-label">{fleet.machinesLabel}</p>
            <h2 id="fl-machines" data-split className="ol-solutions-title">{fleet.machinesTitle}</h2>
            <p data-split="content" className="ol-solutions-lead">{fleet.machinesCopy}</p>
          </div>
          <div className="fl-plant">
            <div className="fl-plant-media">
              <img src={fleet.plantImage} alt={fleet.plantImageAlt} loading="lazy" />
            </div>
            <ul className="fl-plant-grid">
              {machines.map((machine, index) => {
                const body = (
                  <>
                    <div className="fl-machine-top">
                      <span className={`fl-machine-num${index % 2 ? " is-navy" : ""}`}>{pad(index + 1)}</span>
                      <span className="fl-machine-icon" aria-hidden>
                        <LineIcon name={machine.icon} className="size-full" strokeWidth={1.3} />
                      </span>
                    </div>
                    <h3 className="fl-machine-name">{machine.title}</h3>
                    <div className="fl-machine-body">
                      <img src={machine.image} alt={machine.imageAlt} loading="lazy" />
                      <ul className="fl-machine-list">
                        {machine.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
                return (
                  <li key={machine.title} data-reveal className="fl-machine-card">
                    {machine.href ? (
                      <a href={machine.href} className="fl-machine-inner">{body}</a>
                    ) : (
                      <div className="fl-machine-inner">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      <QuoteCta href={fleet.ctaHref} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
