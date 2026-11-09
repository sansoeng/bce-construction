import { useLayoutEffect, useRef, useState } from "react";
import ArrowButton from "./ArrowButton";
import { businessHref, offerings, quoteHref } from "./company";

// Footer after olympic.no's: navigation columns with grey headings (accordions on phones), a ruled row with the
// enquiry block, both offices and an animated back-to-top square, then a ruled legal row. As the footer scrolls into
// view its content settles from 25% above into place while a dark veil clears (their view-timeline "parallax-footer"
// and "disappear"). Set in the site's Aeonik, with the homepage's ArrowButtons.

type Link = [string, string];
const columns: [string, Link[]][] = [
  ["Company", [["Home", "#"], ["About BCE", "/?about"], ["Projects", "/?projects"], ["Coverage", "#coverage"]]],
  ["Our businesses", offerings.map((b) => [b.name, businessHref(b.slug)] as Link)],
  ["Capabilities", [["Technical capabilities", "/?capabilities"], ["Quality & HSE", "/?quality"], ["Laboratory", "/?quality#laboratory"], ["Equipment & fleet", "/?capabilities#equipment-fleet"]]],
  ["Work with us", [["Request a quote", "/?quote"], ["Hire our equipment", quoteHref("equipment-rental")], ["Get directions", "MAPS"]]],
];
const ADDRESS = ["Ang Village, Sangkat O’Char", "Battambang City", "Battambang Province, Cambodia"];
const MAPS = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("O'Char, Battambang, Cambodia");

const toTop = (e: React.MouseEvent) => {
  e.preventDefault();
  const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } | null }).__lenis;
  if (lenis) lenis.scrollTo(0, { force: true });
  else scrollTo({ top: 0, behavior: "smooth" });
};

const ArrowUp = () => (
  <svg viewBox="0 0 10 12" width="10" height="12" fill="none" aria-hidden><path d="M5 11.5V1M1 4.8 5 .8l4 4" stroke="currentColor" strokeWidth="1.1" /></svg>
);

export default function Footer({ phones, tel, base = "" }: { phones: string[]; tel: (n: string) => string; base?: string }) {
  const footerRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const href = (h: string) => (h === "MAPS" ? MAPS : h.startsWith("/") ? h : base ? (h === "#" ? base : base + h) : h);

  // Their timeline, measured from the footer: the content slides from -25% to 0 between the footer's top entering the
  // viewport and the footer being fully in view; the veil (40% dark) clears over the same stretch, starting 40% in.
  useLayoutEffect(() => {
    const footer = footerRef.current, wrap = wrapRef.current, veil = veilRef.current;
    if (!footer || !wrap || !veil) return;
    const still = matchMedia("(prefers-reduced-motion: reduce), (max-width: 519px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (still.matches) { wrap.style.transform = ""; veil.style.opacity = "0"; return; }
      const r = footer.getBoundingClientRect();
      const span = Math.max(1, Math.min(r.height, innerHeight));
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / span));
      const q = Math.min(1, Math.max(0, (innerHeight - r.top - innerHeight * 0.4) / Math.max(1, span - innerHeight * 0.4)));
      wrap.style.transform = `translate3d(0, ${(-25 * (1 - p)).toFixed(2)}%, 0)`;
      veil.style.opacity = (1 - q).toFixed(3);
    };
    const request = () => (frame ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);

  return (
    <footer ref={footerRef} id="contact" data-nav-dark data-header-title="Contact" className="ft">
      <div ref={veilRef} className="ft-veil" aria-hidden />
      <div ref={wrapRef} className="ft-wrap">
        <nav aria-label="Footer" className="ft-nav">
          {columns.map(([title, links], i) => (
            <div key={title} className={`ft-col ${open === i ? "is-open" : ""}`}>
              <button type="button" className="ft-label ft-trigger" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                <span>{title}</span>
                <span className="ft-plus" aria-hidden />
              </button>
              <ul className="ft-links">
                {links.map(([label, h]) => (
                  <li key={label}>
                    <a href={href(h)} onClick={!base && h === "#" ? toTop : undefined} {...(h === "MAPS" ? { target: "_blank", rel: "noopener" } : {})}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="ft-container">
          <div className="ft-enquiry">
            <h3 className="ft-label">Talk to us about your project</h3>
            <p className="ft-text">Tell us your site, scope and schedule. Our engineers will review it and come back with a clear, detailed quotation, supplied from our own plants and fleet.</p>
            <div className="ft-ctas">
              <ArrowButton href="/?quote" label="Request a quote" theme="white" />
              <ArrowButton href={tel(phones[0])} label="Call for a Quotation" theme="white" />
            </div>
          </div>

          <div className="ft-office">
            <h3 className="ft-label">Battambang · Head office</h3>
            <address className="ft-text not-italic">{ADDRESS.map((l) => <span key={l} className="block">{l}</span>)}</address>
            <div className="ft-text">
              <span className="block text-[11px] font-mono uppercase tracking-[0.08em] text-white/50 mb-1">Sales & Quotations Hotlines</span>
              {phones.map((n) => <a key={n} href={tel(n)} className="ft-ul">{n}</a>)}
              <a href="mailto:bcebtb999@gmail.com" className="ft-ul text-white/80 hover:text-white mt-2">bcebtb999@gmail.com</a>
              <a href="https://t.me/thendLP" target="_blank" rel="noopener" className="ft-ul text-white/80 hover:text-white mt-1">Telegram: @thendLP</a>
              <a href={MAPS} target="_blank" rel="noopener" className="ft-ul ft-dir">Get directions</a>
              <div className="mt-4 pt-3 border-t border-white/10 w-full">
                <span className="block text-[11px] font-mono uppercase tracking-[0.08em] text-white/50 mb-1">Careers & Recruitment</span>
                <a href="mailto:bce.hr.1990@gmail.com?subject=Job%20Application%20-%20BCE" className="ft-ul text-white/80 hover:text-white">bce.hr.1990@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="ft-top">
            <button type="button" onClick={toTop} className="ft-top-btn" aria-label="Back to top">
              <span className="ft-top-arrows"><ArrowUp /><ArrowUp /></span>
            </button>
          </div>
        </div>

        <div className="ft-bottom">
          <a href={href("#")} onClick={!base ? toTop : undefined} className="ft-logo">BCE., Ltd.</a>
          <a href={MAPS} target="_blank" rel="noopener" className="ft-b2">Get directions</a>
          <a href="#" onClick={toTop} className="ft-b3">Back to top</a>
          <span className="ft-b4">All rights reserved</span>
          <small className="ft-copy">© 2026 Battambang Construction and Engineering, Co., Ltd.</small>
        </div>
      </div>
    </footer>
  );
}
