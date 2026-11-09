import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import ArrowButton from "./ArrowButton";

// Building blocks after olympic.no/what-we-do-services (design by KIND), shared by Our Businesses and Technical
// Capabilities. Measurements follow their stylesheet (12 columns, 24px gutter, 48px margin; 20px under 1024px):
// - ParallaxHero: full-screen photo with the label and title set low. As the hero leaves the viewport its content
//   drifts down by 40vh and the photo by a further 40vh (their view-timeline "exit" parallax), so the copy scrolls at
//   60% speed and the photo at 20%, and the next section rises over it.
// - LabelCopy: mono label on the left, copy from column 8.
// - TextMedia: text in columns 1-5 (or 8-11 reversed) with the copy pinned low, and a portrait photo in columns 8-12
//   (or 1-5) that slides from -15% to 0 while the panel crosses the viewport ("entry 0%" to "cover 100%").
// - DarkMedia: the full-bleed dark band with the photo flush to the page edge.
// - OlButton: the homepage's ArrowButton.
// Type, colours, buttons and text reveals follow the homepage (Aeonik 500, sentence-case titles, grey labels, line
// reveals via data-split); only the layouts and scroll effects come from Olympic.
// - CardSlider: their looping "onboard" slider: centred cards with the previous card fully visible, images that
//   drift against the motion, a progress line and arrow buttons.
// - PageHeader + LeadText: the inner-page header of olympic.no/sustainability-quality-safety-management-systems: mono
//   label and uppercase title, then a full-bleed banner (1728:1147) whose photo slides from -15% to 0 as it crosses the
//   viewport, then the page introduction in large type across nine columns.
// The scroll effects are driven by useScrollParallax (one rAF per scroll) so they run in every browser with Lenis.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function useScrollParallax(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...root.querySelectorAll<HTMLElement>("[data-px]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = el.dataset.px === "hero"
          ? (vh - r.bottom) / Math.max(1, Math.min(r.height, vh))
          : (vh - r.top) / (vh + r.height);
        el.style.setProperty("--p", clamp(p).toFixed(4));
      });
    };
    const request = () => (raf ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, [rootRef]);
}

export function ParallaxHero({ label, title, image, alt = "" }: { label: string; title: string; image: string; alt?: string }) {
  return (
    <header data-px="hero" data-nav-dark data-header-title={label} className="ol-hero">
      <div className="ol-hero-c">
        <div className="ol-hero-bg">
          <div className="ol-hero-media"><img src={image} alt={alt} fetchPriority="high" /></div>
        </div>
        <div className="ol-hero-wrap">
          <p data-split="content" className="ol-hero-label">{label}</p>
          <h1 data-split className="ol-hero-title">{title}</h1>
        </div>
      </div>
    </header>
  );
}

export function LabelCopy({ label, children, after, className = "" }: { label: string; children: string; after?: ReactNode; className?: string }) {
  return (
    <section aria-label={label} className={`ol-lwc ${className}`}>
      <h2 data-split="content" className="ol-label ol-lwc-label">{label}</h2>
      <div className="ol-lwc-content">
        <p data-split className="ol-lwc-copy">{children}</p>
        {after}
      </div>
    </section>
  );
}

export function PageHeader({ label, title, image, alt }: { label: string; title: string; image: string; alt: string }) {
  return (
    <header data-header-title={label} className="ol-head ol-hl">
      <div className="ol-hl-wrap">
        <p data-split="content" className="ol-label">{label}</p>
        <h1 data-split className="ol-hl-title">{title}</h1>
      </div>
      <div data-px="media" data-nav-dark className="ol-hl-media">
        <div className="ol-px-media"><img src={image} alt={alt} fetchPriority="high" /></div>
      </div>
    </header>
  );
}

export function LeadText({ children, after, className = "" }: { children: string; after?: ReactNode; className?: string }) {
  return (
    <section aria-label="Introduction" className={`ol-head ol-lead ${className}`}>
      <div className="ol-lead-content">
        <p data-split className="ol-lead-copy">{children}</p>
        {after}
      </div>
    </section>
  );
}

// Buttons use the homepage's ArrowButton (black on light sections, translucent white on dark ones); icon-only
// buttons (the slider arrows) are small black squares in the same style.
export function OlButton({ label, href, onClick, dark = false, className = "", icon }: {
  label: string;
  href?: string;
  onClick?: () => void;
  dark?: boolean;
  className?: string;
  icon?: ReactNode;
}) {
  if (!icon) return <ArrowButton href={href} label={label} onClick={onClick} theme={dark ? "white" : "black"} className={`ol-arrow-btn ${className}`} />;
  return <button type="button" onClick={onClick} className={`ol-nav-btn ${className}`} aria-label={label}>{icon}</button>;
}

type PanelProps = {
  id?: string;
  kicker: string;
  title: string;
  image: string;
  alt: string;
  reverse?: boolean;
  /** Copy paragraphs, pinned to the bottom of the text column. */
  copy: string[];
  /** Anything after the copy: a button, a ruled list. */
  children?: ReactNode;
  className?: string;
};

export function TextMedia({ id, kicker, title, image, alt, reverse = false, copy, children, className = "" }: PanelProps) {
  const hid = id ? `${id}-title` : undefined;
  return (
    <section id={id} data-header-title={title} aria-labelledby={hid} className={`ol-tm ${reverse ? "ol-tm--reverse" : ""} ${className}`}>
      <div data-px="media" className="ol-tm-grid">
        <div className="ol-tm-content">
          <p data-split="content" className="ol-label ol-tm-label">{kicker}</p>
          <h2 id={hid} data-split className="ol-tm-title">{title}</h2>
          <div className="ol-tm-copy">{copy.map((c) => <p key={c} data-split="content">{c}</p>)}</div>
          {children}
        </div>
        <div className="ol-tm-media">
          <div className="ol-px-media"><img src={image} alt={alt} loading="lazy" /></div>
        </div>
      </div>
    </section>
  );
}

export function DarkMedia({ id, kicker, title, image, alt, reverse = true, copy, children, className = "" }: PanelProps) {
  const hid = id ? `${id}-title` : undefined;
  return (
    <section id={id} data-nav-dark data-header-title={title} aria-labelledby={hid} className={`ol-dk ${reverse ? "ol-dk--reverse" : ""} ${className}`}>
      <div data-px="media" className="ol-dk-wrap">
        <div className="ol-dk-content">
          <p data-split="content" className="ol-label ol-dk-label">{kicker}</p>
          <h2 id={hid} data-split className="ol-tm-title ol-dk-title">{title}</h2>
          <div className="ol-dk-copy">{copy.map((c) => <p key={c} data-split="content">{c}</p>)}</div>
          {children}
        </div>
        <div className="ol-dk-media">
          <div className="ol-px-media"><img src={image} alt={alt} loading="lazy" /></div>
        </div>
      </div>
    </section>
  );
}

const Arrow = ({ dir }: { dir: 1 | -1 }) => (
  <svg viewBox="0 0 12 10" width="12" height="10" fill="none" aria-hidden style={{ transform: dir < 0 ? "scaleX(-1)" : undefined }}>
    <path d="M0 5h11M7 1l4 4-4 4" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export type SlideItem = { title: string; text: string; image: string; alt: string };

// Slide metrics from their breakpoints: two cards between 162px bleeds on desktop, 312.5px cards on tablets, one
// card less three margins on phones. Desktop and tablet offset the centre by one card so the previous card shows.
function metrics(w: number) {
  if (w >= 1024) { const gap = 24, sw = (w - 3 * gap - 2 * 162) / 2; return { gap, sw, pad: sw + gap }; }
  if (w >= 768) { const gap = 20, sw = 312.5; return { gap, sw, pad: sw + gap }; }
  const gap = 16, sw = w - 3 * (w <= 519 ? 16 : 20);
  return { gap, sw, pad: 0 };
}

export function CardSlider({ items, label }: { items: SlideItem[]; label: string }) {
  const n = items.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1440);
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const prevRel = useRef<number[]>([]);
  const start = useRef<{ x: number; id: number } | null>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((step: number) => setActive((a) => (((a + step) % n) + n) % n), [n]);
  const { gap, sw, pad } = metrics(width);
  const unit = sw + gap;
  const half = Math.floor(n / 2);
  const activeLeft = pad + (width - pad) / 2 - sw / 2;
  const rels = items.map((_, k) => ((((k - active) % n) + n + half) % n) - half);
  useEffect(() => { prevRel.current = rels; });

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    start.current = { x: e.clientX, id: e.pointerId };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    if (!dragging && Math.abs(dx) > 6) {
      setDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (dragging || Math.abs(dx) > 6) setDrag(dx);
  };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    if (Math.abs(drag) > 25) go(-Math.sign(drag) * Math.max(1, Math.round(Math.abs(drag) / unit)));
    setDrag(0);
    setDragging(false);
  };

  return (
    <div className="ol-slider" role="region" aria-roledescription="carousel" aria-label={label}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1); }}>
      <div ref={rootRef} className={`ol-slider-track ${dragging ? "is-dragging" : ""}`}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onLostPointerCapture={onUp}>
        {items.map((it, k) => {
          const rel = rels[k];
          const jump = prevRel.current.length === n && Math.abs(rel - prevRel.current[k]) > 1;
          const x = activeLeft + rel * unit + drag;
          const progress = (x + sw / 2 - width / 2) / unit;
          const style = {
            width: sw,
            transform: `translate3d(${x}px, 0, 0)`,
            "--sp": clamp(progress, -1.5, 1.5).toFixed(4),
            "--dur": dragging || jump ? "0ms" : "900ms",
          } as CSSProperties;
          return (
            <article key={it.title} className="ol-slide" style={style} aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={Math.abs(rel) > 1}>
              <div className="ol-slide-media"><img src={it.image} alt={it.alt} loading="lazy" draggable={false} /></div>
              <div className="ol-slide-content">
                <h3 className="ol-slide-title">{it.title}</h3>
                <p className="ol-slide-text">{it.text}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="ol-slider-pagination" aria-hidden>
        <span style={{ transform: `scaleX(${(active + 1) / n})` }} />
      </div>
      <div className="ol-slider-nav">
        <OlButton label="Previous" onClick={() => go(-1)} icon={<Arrow dir={-1} />} />
        <OlButton label="Next" onClick={() => go(1)} icon={<Arrow dir={1} />} />
      </div>
    </div>
  );
}

export type DialogContent = {
  kicker: string;
  title: string;
  image: string;
  lead: string;
  body: string[];
  listLabel: string;
  list: string[];
  quoteHref?: string;
  projectHref?: string;
  projectLabel?: string;
};

// Their read-more dialog: a 684px sheet sliding in from the right over a blurred, dimmed page, photo on top, then
// label and title, then a short headline beside the description. Escape, the backdrop or the close square dismiss it.
export function ReadMoreDialog({ content, open, onClose }: { content: DialogContent | null; open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } | null }).__lenis;
    lenis?.stop();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    sheetRef.current?.scrollTo(0, 0);
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      lenis?.start();
      html.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div className={`ol-dialog ${open ? "is-open" : ""}`} inert={!open} aria-hidden={!open}>
      <div className="ol-dialog-backdrop" onClick={onClose} />
      <div className="ol-dialog-container">
        <button ref={closeRef} type="button" onClick={onClose} className="ol-dialog-close" aria-label="Close">
          <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" /></svg>
        </button>
        <div ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="ol-dialog-title" className="ol-dialog-sheet" data-lenis-prevent>
          {content && (
            <div key={content.title} className="ol-dialog-inner">
              <div className="ol-dialog-media"><img src={content.image} alt="" /></div>
              <div className="ol-dialog-header">
                <span className="ol-label">{content.kicker}</span>
                <h2 id="ol-dialog-title" className="ol-dialog-title">{content.title}</h2>
              </div>
              <div className="ol-dialog-block">
                <p className="ol-dialog-headline">{content.lead}</p>
                <div className="ol-dialog-desc">
                  {content.body.map((b) => <p key={b}>{b}</p>)}
                  <p>{content.listLabel}</p>
                  <ul>{content.list.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </div>
              {(content.quoteHref || content.projectHref) && (
                <div className="ol-dialog-actions flex flex-wrap items-center gap-4 border-t border-[rgb(17_17_17_/_0.1)] px-[25px] py-8 max-md:px-4 max-md:py-6">
                  {content.quoteHref && (
                    <ArrowButton href={content.quoteHref} label="Request a quote" theme="black" onClick={onClose} />
                  )}
                  {content.projectHref && (
                    <ArrowButton href={content.projectHref} label={content.projectLabel ? `View ${content.projectLabel}` : "View related project"} theme="outline" onClick={onClose} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
