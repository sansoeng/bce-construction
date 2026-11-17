import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { quality } from "./quality";

// The "What we own, in numbers" band, lifted out of Equipment & fleet (/fleet) so Truck & Equipment Rental can show the
// same band from the same figures instead of its own four-number summary. Every count comes from quality.ts, so the two
// pages cannot disagree: quality.fleet.rows is the fleet inventory (plants, trucks, rigs, lifting plant), and the band
// reads the first number in each value, so Khmer numerals work too.
//
// Layout: the label, title and copy hold on the left while the bordered glance cells count up on the right, the same
// grid the project highlights and the homepage use.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";

function firstNumber(value: string) {
  const normalized = value.replace(/[០-៩]/g, (digit) => String(KHMER_DIGITS.indexOf(digit)));
  const match = normalized.match(/\d[\d.,]*/);
  if (!match) return 0;
  const number = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
}

// The project page's in-view trigger, kept local to the band.
function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// The key figures count up as the dark band scrolls in. Reduced motion shows the value.
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

// One glance cell: label and note at the top, the figure set large at the foot.
function Stat({
  label,
  note,
  value,
  index,
  unit,
  count = true,
}: {
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

export type FleetStat = { label: string; note: string; value: string; unit?: string; count?: boolean };

/** The owned fleet as the glance cells read it: total, plants, plant capacity, then every machine group. */
export function fleetStats(): FleetStat[] {
  const rows = quality.fleet.rows;
  const fleetTotal = rows.reduce((total, row) => total + firstNumber(row.value), 0);
  const rowCount = (index: number) => rows[index]?.value.split("/")[0].trim() || "00";
  const concreteCapacity = rows[0]?.note.match(/\d+/)?.[0] ?? "70";
  return [
    { label: "Machines in our own fleet", note: "Owned and maintained", value: String(fleetTotal) },
    ...(rows[0] ? [{ label: rows[0].label, note: rows[0].note, value: rowCount(0) }] : []),
    { label: "Concrete capacity", note: "Per batching plant", value: concreteCapacity, unit: "m³/hr", count: false },
    ...rows.slice(1).map((row, index) => ({ label: row.label, note: row.note, value: rowCount(index + 1) })),
  ];
}

export default function FleetFigures({
  id,
  headingId,
  headerTitle,
  label,
  title,
  copy,
  contactLabel = "Hire & dispatch",
}: {
  /** Section id, for the page's on-page index. */
  id: string;
  /** Heading id, for aria-labelledby. */
  headingId: string;
  /** Label the header shows for this band as it scrolls past. */
  headerTitle?: string;
  label: string;
  title: string;
  copy: string;
  contactLabel?: string;
}) {
  const [glanceRef, glanceIn] = useInView<HTMLDivElement>();
  const stats = fleetStats();

  return (
    <section
      id={id}
      data-nav-dark
      data-header-title={headerTitle}
      aria-labelledby={headingId}
      className="ol-capacity fl-figures-band"
    >
      <div className="glance-layout">
        <div className="glance-title-col">
          <div className="glance-title-sticky">
            <p data-split="content" className="ol-label">{label}</p>
            <h2 id={headingId} data-split className="ol-capacity-title">{title}</h2>
            <p data-split="content" className="ol-capacity-copy">{copy}</p>
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
        <p className="ol-label">{contactLabel}</p>
        <div className="ol-capacity-links">
          {phones.slice(0, 2).map((phone) => (
            <a key={phone} href={tel(phone)}>{phone}</a>
          ))}
          <a href={`mailto:${siteSettings.contact.email}`}>{siteSettings.contact.email}</a>
          <a href={`https://t.me/${siteSettings.contact.telegram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">Telegram</a>
        </div>
      </div>
    </section>
  );
}
