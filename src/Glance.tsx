import { useEffect, useRef, useState, type CSSProperties } from "react";

// Six figures from the BCE Corporate Profile 2026, "Corporate Statistics" (p. 06): 3 rows of 2 highlights.
type IconKind = "years" | "projects" | "clients" | "plants" | "mixer" | "provinces";
const stats: { value: number; label: string; note: string; icon: IconKind; suffix?: string }[] = [
  // Row 1
  { value: 30, suffix: "+", label: "Years of experience", note: "Established 1995", icon: "years" },
  { value: 4, label: "Batching plants", note: "70 m³/hr each", icon: "plants" },
  // Row 2
  { value: 128, label: "Projects completed", note: "In 2025", icon: "projects" },
  { value: 1564, label: "Clients served", note: "In 2025", icon: "clients" },
  // Row 3
  { value: 41, label: "Mixer trucks", note: "Plus 8 pump trucks", icon: "mixer" },
  { value: 14, label: "Provinces served", note: "13 provinces + Phnom Penh", icon: "provinces" },
];

// Clients & partners, from the Corporate Profile 2026 client and supplier lists (pp. 33-35). Each `logo` is a generic
// placeholder mark until BCE supplies the real files: replace the path with "/assets/partners/<file>.svg".
const partners: { name: string; logo?: string }[] = [
  { name: "Obayashi", logo: "/assets/partners/placeholder-1.svg" },
  { name: "Hanshin E&C", logo: "/assets/partners/placeholder-2.svg" },
  { name: "Thang Long JSC", logo: "/assets/partners/placeholder-3.svg" },
  { name: "SUMEC", logo: "/assets/partners/placeholder-4.svg" },
  { name: "SchneiTec", logo: "/assets/partners/placeholder-5.svg" },
  { name: "Build Bright University", logo: "/assets/partners/placeholder-6.svg" },
  { name: "Chip Mong Group", logo: "/assets/partners/placeholder-7.svg" },
  { name: "Sika Cambodia", logo: "/assets/partners/placeholder-8.svg" },
];

// Line icons on a 48-unit grid, one stroke weight throughout. Strokes marked `draw` trace themselves in when the grid
// reveals; the brand-blue part of each then keeps a small loop going (sand, hook, nod, drip, drum, pin).
const ACCENT = "#293e8a";
const draw = { pathLength: 1, className: "gd" } as const;

function GlanceIcon({ kind }: { kind: IconKind }) {
  const shapes: Record<IconKind, React.ReactNode> = {
    years: (
      <>
        <path {...draw} d="M14 7h20M14 41h20" />
        <path {...draw} d="M16 7c0 9 5 12 8 17-3 5-8 8-8 17M32 7c0 9-5 12-8 17 3 5 8 8 8 17" />
        <g className="gi-acc" fill={ACCENT} stroke="none">
          <path d="M19.5 12h9c-1 2.6-2.6 4.4-4.5 6-1.9-1.6-3.5-3.4-4.5-6z" />
          <path d="M19 41c1-4 3-6 5-6s4 2 5 6z" />
        </g>
        <path className="gi-acc gi-sand" d="M24 23v12" stroke={ACCENT} strokeDasharray="1.5 2.5" />
      </>
    ),
    projects: (
      <>
        <path {...draw} d="M13 42V12M18 42V12M13 17l5 5-5 5 5 5-5 5" />
        <path {...draw} d="M6 12h36M15.5 5 6 12M15.5 5 42 12M15.5 5v7M6 12v4h5v-4M8 42h16" />
        <g className="gi-acc" stroke={ACCENT}>
          <path className="gi-cable" d="M35 12v12" vectorEffect="non-scaling-stroke" />
          <path className="gi-hook" d="M33 24h4v3h-4zM35 27v2.5a2 2 0 1 1-2 2" />
        </g>
      </>
    ),
    clients: (
      <>
        <g stroke={ACCENT}>
          <circle {...draw} className="gd gi-nod gi-nod-b" cx="31" cy="15" r="5" />
          <path {...draw} d="M27 25.6c1.2-.4 2.6-.6 4-.6 5 0 9 4 9 11" />
        </g>
        <path {...draw} d="M8 41c0-7.5 5-13 11-13s11 5.5 11 13" fill="#fff" />
        <circle {...draw} className="gd gi-nod" cx="19" cy="18" r="6" fill="#fff" />
      </>
    ),
    plants: (
      <>
        <path {...draw} d="M15 5h18v20l-5 6h-8l-5-6zM15 11h18M15 25h18" />
        <path {...draw} d="M15 25v17M33 25v17M9 42h30" />
        <circle className="gi-acc gi-drop" cx="24" cy="34.5" r="1.75" fill={ACCENT} stroke="none" />
      </>
    ),
    mixer: (
      <>
        <clipPath id="gi-drum"><ellipse cx="18" cy="21" rx="12" ry="6.8" transform="rotate(-14 18 21)" /></clipPath>
        <ellipse {...draw} cx="18" cy="21" rx="13" ry="7.5" transform="rotate(-14 18 21)" />
        <g className="gi-acc" clipPath="url(#gi-drum)">
          <path className="gi-spin" d="M-2 12c2.5 4.5 2.5 13 0 18M4 12c2.5 4.5 2.5 13 0 18M10 12c2.5 4.5 2.5 13 0 18M16 12c2.5 4.5 2.5 13 0 18M22 12c2.5 4.5 2.5 13 0 18M28 12c2.5 4.5 2.5 13 0 18" stroke={ACCENT} />
        </g>
        <path {...draw} d="M10 33v-4.5M26 33v-5.5M4 33h40M33 33V21h6l5 7v5M35.5 23.5h3l2.5 3.5h-5.5z" />
        <circle {...draw} cx="11" cy="37" r="3.5" />
        <circle {...draw} cx="20" cy="37" r="3.5" />
        <circle {...draw} cx="38" cy="37" r="3.5" />
      </>
    ),
    provinces: (
      <>
        <ellipse className="gi-acc gi-ripple" cx="24" cy="41" rx="9" ry="2.6" stroke={ACCENT} />
        <g className="gi-bob">
          <path {...draw} d="M24 40s-11-11.5-11-20a11 11 0 0 1 22 0c0 8.5-11 20-11 20z" fill="#fff" />
          <circle {...draw} cx="24" cy="20" r="4" stroke={ACCENT} />
        </g>
      </>
    ),
  };
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="gi size-10 flex-none md:size-12" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {shapes[kind]}
    </svg>
  );
}

const COUNT_MS = 1600;
const STAGGER_MS = 70;
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Reveals once when the element scrolls a fifth of the way into view.
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

// Trusted partners & clients: a second title + ruled grid pair in the "BCE at a glance" layout, two logos per row
// (four rows), with the same hairlines drawing in and wordmarks rising in turn.
function Partners() {
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  return (
    <div className="glance-layout glance-partners">
      <div className="glance-title-col">
        <div className="glance-title-sticky">
          <h2 data-split className="text-[clamp(2.4rem,3.6vw,4.2rem)] font-medium leading-[1.08] tracking-[-.025em]">
            Trusted partners &amp; clients
          </h2>
        </div>
      </div>
      <div ref={ref} className={`glance ${inView ? "is-in" : ""}`}>
        <ul className="glance-grid glance-logos">
          {partners.map((p, i) => (
            <li key={p.name} className="glance-cell glance-logo" style={{ "--i": i, "--r": Math.floor(i / 2), "--c": i % 2 } as CSSProperties}>
              <span className="glance-logo-mask">
                <span className="glance-logo-inner">
                  {p.logo ? <img src={p.logo} alt={`${p.name} logo`} decoding="async" /> : <span className="glance-wordmark">{p.name}</span>}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Glance() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // One clock drives every counter; each figure starts a little after the one before it.
  useEffect(() => {
    if (!inView) return;
    const end = COUNT_MS + STAGGER_MS * stats.length;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setElapsed(end);
    let raf = 0;
    const start = performance.now() + 250;
    const tick = (now: number) => {
      const e = Math.max(now - start, 0);
      setElapsed(e);
      if (e < end) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <section aria-labelledby="glance-title" data-header-title="At a glance" className="bg-white px-6 py-20 text-[#111] md:py-28 lg:py-32">
      <div className="glance-layout">
        <div className="glance-title-col">
          <div className="glance-title-sticky">
            <h2 id="glance-title" data-split className="text-[clamp(2.4rem,3.6vw,4.2rem)] font-medium leading-[1.08] tracking-[-.025em]">
              BCE at a glance
            </h2>
          </div>
        </div>
        {/* Likova-style figure grid: 3 rows x 2 highlights per row */}
        <div ref={ref} className={`glance ${inView ? "is-in" : ""}`}>
          <dl className="glance-grid">
            {stats.map((s, i) => {
              const n = Math.round(s.value * expoOut(Math.min(Math.max((elapsed - i * STAGGER_MS) / COUNT_MS, 0), 1)));
              return (
                <div
                  key={s.label}
                  className="glance-cell"
                  style={{ "--i": i } as CSSProperties}
                >
                  <dt className="flex items-start justify-between gap-3 md:gap-4">
                    <span className="glance-label">
                      <span className="glance-label-title">{s.label}</span>
                      <span className="glance-label-note">{s.note}</span>
                    </span>
                    <GlanceIcon kind={s.icon} />
                  </dt>
                  <dd className="glance-num">
                    <span>
                      {n.toLocaleString("en-US")}
                      {s.suffix}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
      <Partners />
    </section>
  );
}
