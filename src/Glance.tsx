import { useEffect, useRef, useState, type CSSProperties } from "react";
import { homepage } from "./homepage";

// Figures for the "BCE at a glance" grid. The defaults live in src/homepage.ts and the admin console can edit
// every value, suffix, label, note and icon.
export type IconKind = "years" | "projects" | "clients" | "plants" | "mixer" | "provinces" | "pump" | "piling";


// Line icons on a 48-unit grid, one stroke weight throughout. Strokes marked `draw` trace themselves in when the grid
// reveals; the brand-blue part of each then keeps a small loop going (sand, hook, nod, drip, drum, pin).
const ACCENT = "#293e8a";
const draw = { pathLength: 1, className: "gd" } as const;

export function GlanceIcon({
  kind,
  className = "size-10 flex-none md:size-12",
  accentColor = ACCENT,
  clipIdPrefix = "gi",
  strokeWidth = 1.5,
}: {
  kind: IconKind;
  className?: string;
  accentColor?: string;
  clipIdPrefix?: string;
  strokeWidth?: number;
}) {
  const accent = accentColor;
  const drumId = `${clipIdPrefix}-drum-${kind}`;
  const shapes: Record<IconKind, React.ReactNode> = {
    years: (
      <>
        <path {...draw} d="M14 7h20M14 41h20" />
        <path {...draw} d="M16 7c0 9 5 12 8 17-3 5-8 8-8 17M32 7c0 9-5 12-8 17 3 5 8 8 8 17" />
        <g className="gi-acc" fill={accent} stroke="none">
          <path d="M19.5 12h9c-1 2.6-2.6 4.4-4.5 6-1.9-1.6-3.5-3.4-4.5-6z" />
          <path d="M19 41c1-4 3-6 5-6s4 2 5 6z" />
        </g>
        <path className="gi-acc gi-sand" d="M24 23v12" stroke={accent} strokeDasharray="1.5 2.5" />
      </>
    ),
    projects: (
      <>
        <path {...draw} d="M13 42V12M18 42V12M13 17l5 5-5 5 5 5-5 5" />
        <path {...draw} d="M6 12h36M15.5 5 6 12M15.5 5 42 12M15.5 5v7M6 12v4h5v-4M8 42h16" />
        <g className="gi-acc" stroke={accent}>
          <path className="gi-cable" d="M35 12v12" strokeWidth={strokeWidth} />
          <path className="gi-hook" d="M33 24h4v3h-4zM35 27v2.5a2 2 0 1 1-2 2" />
        </g>
      </>
    ),
    clients: (
      <>
        <g stroke={accent}>
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
        <circle className="gi-acc gi-drop" cx="24" cy="34.5" r="1.75" fill={accent} stroke="none" />
      </>
    ),
    mixer: (
      <>
        <clipPath id={drumId}><ellipse cx="18" cy="21" rx="12" ry="6.8" transform="rotate(-14 18 21)" /></clipPath>
        <ellipse {...draw} cx="18" cy="21" rx="13" ry="7.5" transform="rotate(-14 18 21)" />
        <g className="gi-acc" clipPath={`url(#${drumId})`}>
          <path className="gi-spin" d="M-2 12c2.5 4.5 2.5 13 0 18M4 12c2.5 4.5 2.5 13 0 18M10 12c2.5 4.5 2.5 13 0 18M16 12c2.5 4.5 2.5 13 0 18M22 12c2.5 4.5 2.5 13 0 18M28 12c2.5 4.5 2.5 13 0 18" stroke={accent} />
        </g>
        <path {...draw} d="M10 33v-4.5M26 33v-5.5M4 33h40M33 33V21h6l5 7v5M35.5 23.5h3l2.5 3.5h-5.5z" />
        <circle {...draw} cx="11" cy="37" r="3.5" />
        <circle {...draw} cx="20" cy="37" r="3.5" />
        <circle {...draw} cx="38" cy="37" r="3.5" />
      </>
    ),
    provinces: (
      <>
        <ellipse className="gi-acc gi-ripple" cx="24" cy="41" rx="9" ry="2.6" stroke={accent} />
        <g className="gi-bob">
          <path {...draw} d="M24 40s-11-11.5-11-20a11 11 0 0 1 22 0c0 8.5-11 20-11 20z" fill="#fff" />
          <circle {...draw} cx="24" cy="20" r="4" stroke={accent} />
        </g>
      </>
    ),
    pump: (
      <>
        <path {...draw} d="M6 34h36M10 34v-5h16v5M26 34v-9h8l6 4v5" />
        <circle {...draw} cx="13" cy="38" r="3.5" />
        <circle {...draw} cx="22" cy="38" r="3.5" />
        <circle {...draw} cx="36" cy="38" r="3.5" />
        <g stroke={accent} className="gi-acc gi-pump">
          <path {...draw} d="M14 25l7-14 8 5 7-10" />
          <circle cx="36" cy="6" r="1.5" fill={accent} />
        </g>
      </>
    ),
    piling: (
      <>
        <path {...draw} d="M12 42h24M16 42V10l8-4 8 4v32" />
        <path {...draw} d="M18 19h12M18 29h12M18 39h12" />
        <g stroke={accent} fill={accent} className="gi-acc gi-pile">
          <rect x="22" y="14" width="4" height="8" rx="0.5" />
          <path d="M24 22v20" stroke={accent} strokeWidth={strokeWidth} />
        </g>
      </>
    ),
  };
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={`gi ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
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

// Trusted partners & clients: a second title + ruled grid pair in the "BCE at a glance" layout. The first group
// spans the full grid; the next two sit side by side, as Clients / Suppliers / Technical Partners did originally.
const padCount = (n: number) => `(${String(n).padStart(2, "0")})`;

function PartnerLogo({ partner }: { partner: { name: string; logo?: string } }) {
  return (
    <span className="glance-logo-mask">
      <span className="glance-logo-inner">
        {partner.logo ? (
          <img src={partner.logo} alt={`${partner.name} logo`} decoding="async" />
        ) : (
          <span className="glance-wordmark">{partner.name}</span>
        )}
      </span>
    </span>
  );
}

function Partners() {
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  const { partnersTitle, groups } = homepage.glance;
  const primary = groups[0];
  const secondary = groups.slice(1, 3);
  const extra = groups.slice(3);

  return (
    <div className="glance-layout glance-partners">
      <div className="glance-title-col">
        <div className="glance-title-sticky">
          <h2 data-split className="text-[clamp(2.4rem,3.6vw,4.2rem)] font-medium leading-[1.08] tracking-[-.025em]">
            {partnersTitle}
          </h2>
        </div>
      </div>
      <div ref={ref} className={`glance ${inView ? "is-in" : ""}`}>
        {primary && (
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-black/50">
                {primary.label}
              </span>
              <span className="font-mono text-[11px] text-black/35">{padCount(primary.items.length)}</span>
            </div>
            <ul className="glance-grid glance-logos">
              {primary.items.map((p, i) => (
                <li key={`${p.name}-${i}`} className="glance-cell glance-logo" style={{ "--i": i, "--r": Math.floor(i / 2), "--c": i % 2 } as CSSProperties}>
                  <PartnerLogo partner={p} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {secondary.length > 0 && (
          <div className="mt-12 md:mt-16 grid grid-cols-2 gap-x-8">
            {secondary.map((group, gi) => (
              <div key={`${group.label}-${gi}`}>
                <div className="border-b border-black/10 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-black/50">
                      {group.label}
                    </span>
                    <span className="font-mono text-[11px] text-black/35">{padCount(group.items.length)}</span>
                  </div>
                </div>
                <ul className="glance-logos grid grid-cols-1">
                  {group.items.map((p, i) => (
                    <li key={`${p.name}-${i}`} className="glance-cell glance-logo" style={{ "--i": (primary?.items.length ?? 0) + gi * 2 + i, "--r": 3, "--c": gi } as CSSProperties}>
                      <PartnerLogo partner={p} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {extra.map((group, gi) => (
          <div key={`${group.label}-${gi}`} className="mt-12 md:mt-16">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-black/50">
                {group.label}
              </span>
              <span className="font-mono text-[11px] text-black/35">{padCount(group.items.length)}</span>
            </div>
            <ul className="glance-grid glance-logos">
              {group.items.map((p, i) => (
                <li key={`${p.name}-${i}`} className="glance-cell glance-logo" style={{ "--i": i, "--r": Math.floor(i / 2), "--c": i % 2 } as CSSProperties}>
                  <PartnerLogo partner={p} />
                </li>
              ))}
            </ul>
          </div>
        ))}
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
    const end = COUNT_MS + STAGGER_MS * homepage.glance.stats.length;
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

  const { title, stats } = homepage.glance;

  return (
    <section aria-labelledby="glance-title" data-header-title="At a glance" className="bg-white px-6 py-20 text-[#111] md:py-28 lg:py-32">
      <div className="glance-layout">
        <div className="glance-title-col">
          <div className="glance-title-sticky">
            <h2 id="glance-title" data-split className="text-[clamp(2.4rem,3.6vw,4.2rem)] font-medium leading-[1.08] tracking-[-.025em]">
              {title}
            </h2>
          </div>
        </div>
        {/* Likova-style figure grid: 3 rows x 2 highlights per row */}
        <div ref={ref} className={`glance ${inView ? "is-in" : ""}`}>
          <dl className="glance-grid">
            {stats.map((s, i) => {
              const n = Math.round(Number(s.value || 0) * expoOut(Math.min(Math.max((elapsed - i * STAGGER_MS) / COUNT_MS, 0), 1)));
              return (
                <div
                  key={`${s.label}-${i}`}
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
