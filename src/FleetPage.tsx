import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { useMediaReveal, usePageSetup } from "./usePageSetup";
import { LabelCopy, ParallaxHero, useScrollParallax } from "./ServiceBlocks";
import { LineIcon } from "./LineIcon";
import { quality } from "./quality";

// Equipment & fleet (/fleet), the standalone page the Recommendation's sitemap asks for: what BCE owns, how many, what
// each machine is for, and how to hire it. Every figure comes from quality.ts (the Quality page's own document) so the
// two pages cannot disagree. No rates and no per-machine availability are published — both are quoted per project.
//
// The page follows the same Olympic-style blocks as Quality & HSE and Coverage: the parallax cover, a labelled
// introduction with an on-page index, the key figures on the ink ground, ruled inventory rows, machine cards, the
// maintenance points as value columns, and the hire steps as a numbered list. Only the machine grid (2 × 2 instead of
// the three-column solution grid) is a page-local rule; everything else is the shared `.ol-*`, `.qx-*` and `.pd-*` set.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

const TOPICS = [
  ["fleet-figures", "Fleet at a glance"],
  ["fleet-inventory", "Inventory"],
  ["fleet-machines", "Plant & machines"],
  ["fleet-support", "Maintenance & crew"],
  ["fleet-hire", "Hire"],
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

export default function FleetPage() {
  usePageSetup(
    "Equipment & fleet | BCE., Ltd.",
    "BCE's own plant and fleet: batching plants, mixer trucks, pump trucks and piling rigs, maintained in-house and mobilised from Battambang for hire across Cambodia.",
  );
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);

  const fleet = quality.fleet;
  const rows = fleet.rows;
  const fleetTotal = rows.reduce((total, row) => total + firstNumber(row.value), 0);
  const machines = fleet.machines;

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
        {/* Introduction as the other inner pages: the labelled statement, the dispatch note and the page index. */}
        <LabelCopy
          label="Fleet overview"
          className="ol-head qx-intro"
          after={
            <>
              <p className="mt-8 max-w-[560px] text-[16px] leading-[1.6] text-[#111]/55">{fleet.note}</p>
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

        {/* Key figures on the ink ground, as the business pages: the totals behind the inventory, counted up. */}
        <section id="fleet-figures" data-nav-dark data-header-title="Fleet at a glance" aria-labelledby="fl-figures" className="ol-capacity">
          <div className="ol-capacity-head">
            <p data-split="content" className="ol-label">{fleet.figuresLabel}</p>
            <h2 id="fl-figures" data-split className="ol-capacity-title">{fleet.figuresTitle}</h2>
            <p data-split="content" className="ol-capacity-copy">{fleet.figuresCopy}</p>
          </div>
          <ul className="ol-capacity-grid">
            <li data-reveal className="ol-figure">
              <CountUp value={String(fleetTotal)} />
              <span className="ol-figure-label">Machines in our own fleet</span>
            </li>
            <li data-reveal className="ol-figure">
              <CountUp value={machines[0]?.value ?? "00"} />
              <span className="ol-figure-label">Batching plants</span>
            </li>
            <li data-reveal className="ol-figure">
              <CountUp value={machines[1]?.value ?? "00"} />
              <span className="ol-figure-label">Mixer trucks</span>
            </li>
            <li data-reveal className="ol-figure">
              <CountUp value={machines[2]?.value ?? "00"} />
              <span className="ol-figure-label">Pump trucks</span>
            </li>
          </ul>
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

        {/* The inventory, exactly as the Quality page publishes it: the same ruled rows, read as a list. */}
        <section id="fleet-inventory" data-header-title={fleet.inventoryTitle} aria-labelledby="fl-inventory" className="qh-section qx-split fl-section">
          <div className="qx-head">
            <p data-split="content" className="ol-label">{fleet.inventoryLabel}</p>
            <h2 id="fl-inventory" data-split className="pd-h2">{fleet.inventoryTitle}</h2>
            <div className="qx-copy mt-10 w-[520px] max-w-full">
              <p data-split="content">{fleet.inventoryCopy}</p>
            </div>
            <ArrowButton href="/quality#documents" label="Company profile" theme="outline" className="mt-8" />
          </div>
          <div className="qx-body">
            <h3 data-split="content" className="qx-label">{fleet.inventoryListLabel}</h3>
            <ul className="ol-rows">
              {rows.map((row, index) => (
                <li key={row.label} data-reveal className="ol-row" style={{ "--k": index } as CSSProperties}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The machines themselves, with the count and what each one is for. */}
        <section id="fleet-machines" data-header-title={fleet.machinesTitle} aria-labelledby="fl-machines" className="ol-solutions">
          <div className="ol-solutions-head">
            <p data-split="content" className="ol-label">{fleet.machinesLabel}</p>
            <h2 id="fl-machines" data-split className="ol-solutions-title">{fleet.machinesTitle}</h2>
            <p data-split="content" className="ol-solutions-lead">{fleet.machinesCopy}</p>
          </div>
          <ul className="ol-solutions-grid fl-machines">
            {machines.map((machine) => (
              <li key={machine.title} data-reveal className="ol-solution">
                <div className="ol-solution-media">
                  <img src={machine.image} alt={machine.imageAlt} loading="lazy" />
                </div>
                <h3 className="ol-solution-title flex items-baseline justify-between gap-4">
                  <span>{machine.title}</span>
                  <span className="font-mono text-[22px] leading-none tabular-nums text-[#111]/70">{machine.value}</span>
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-[#111]/45">{machine.note}</p>
                <p className="ol-solution-text">{machine.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Maintenance, operators and mobilisation, as the business pages' value columns. */}
        <section id="fleet-support" data-header-title={fleet.supportTitle} aria-labelledby="fl-support" className="ol-values">
          <div className="ol-values-head">
            <p data-split="content" className="ol-label">{fleet.supportLabel}</p>
            <h2 id="fl-support" data-split className="ol-values-title">{fleet.supportTitle}</h2>
            <p data-split="content" className="max-w-[40rem] text-[16px] leading-[1.6] text-[#111]/55">{fleet.supportCopy}</p>
          </div>
          <ul className="ol-values-grid">
            {fleet.support.map((item) => (
              <li key={item.title} data-reveal className="ol-value">
                <span className="ol-value-icon" aria-hidden>
                  <LineIcon name={item.icon} className="size-full" />
                </span>
                <h3 className="ol-value-title">{item.title}</h3>
                <p className="ol-value-text">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* How hiring works, without rates: the steps on the right, the actions on the left. */}
        <section id="fleet-hire" data-header-title={fleet.hireTitle} aria-labelledby="fl-hire" className="qh-section qx-split fl-section">
          <div className="qx-head">
            <p data-split="content" className="ol-label">{fleet.hireLabel}</p>
            <h2 id="fl-hire" data-split className="pd-h2">{fleet.hireTitle}</h2>
            <div className="qx-copy mt-10 w-[520px] max-w-full">
              <p data-split="content">{fleet.hireCopy}</p>
              <p data-split="content" className="text-[15px] text-[#111]/45">{fleet.hireNote}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ArrowButton href={fleet.ctaHref} label={fleet.ctaLabel} />
              <ArrowButton href={tel(phones[0])} label={`Call ${phones[0]}`} theme="outline" />
            </div>
          </div>
          <div className="qx-body">
            <h3 data-split="content" className="qx-label">How hire works</h3>
            <ol className="qx-list">
              {fleet.hireSteps.map((step, index) => (
                <li key={step} data-reveal className="qx-step pd-rule" style={{ "--rd": `${index * 0.08}s` } as CSSProperties}>
                  <span data-split="content" className="qx-n">{pad(index + 1)}.</span>
                  <div>
                    <p data-split="content" className="qx-step-text">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      <QuoteCta href={fleet.ctaHref} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
