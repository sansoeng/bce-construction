import { useLayoutEffect, useRef, useState } from "react";
import ArrowButton from "./ArrowButton";
import { businessHref, offerings, quoteHref } from "./company";
import { siteSettings } from "./siteSettings";

// Footer after olympic.no's: navigation columns with grey headings (accordions on phones), a ruled row with the
// enquiry block and head office with contact and social channels, then a ruled legal row. As the footer scrolls into
// view its content settles from 25% above into place while a dark veil clears (their view-timeline "parallax-footer"
// and "disappear"). Set in the site's Aeonik, with the homepage's ArrowButtons.

type Link = [string, string];
const columns: [string, Link[]][] = [
  ["Company", [["Home", "#"], ["About BCE", "/?about"], ["Projects", "/?projects"], ["Blog & Insights", "/?blog"], ["Coverage", "#coverage"], ["Resources & Downloads", "/?resources"]]],
  ["Our businesses", offerings.map((b) => [b.name, businessHref(b.slug)] as Link)],
  ["Capabilities", [["Technical capabilities", "/?capabilities"], ["Quality & HSE", "/?quality"], ["Laboratory", "/?quality#laboratory"], ["Equipment & fleet", "/?capabilities#equipment-fleet"]]],
  ["Work with us", [["Request a quote", "/?quote"], ["Careers & Recruitment", "/?recruitment"], ["Hire our equipment", quoteHref("equipment-rental")], ["Get directions", "MAPS"]]],
];
const MAPS = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("O'Char, Battambang, Cambodia");

const toTop = (e: React.MouseEvent) => {
  e.preventDefault();
  const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } | null }).__lenis;
  if (lenis) lenis.scrollTo(0, { force: true });
  else scrollTo({ top: 0, behavior: "smooth" });
};

const PhoneIcon = ({ className = "size-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = ({ className = "size-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const TelegramIcon = ({ className = "size-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.693c.46 0 .663-.211.921-.46l2.211-2.15 4.6 3.4c.847.468 1.458.226 1.67-.783l3.015-14.2c.31-1.24-.473-1.8-1.27-.927z" />
  </svg>
);

const FacebookIcon = ({ className = "size-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function Footer({ phones, tel, base = "" }: { phones: string[]; tel: (n: string) => string; base?: string }) {
  const footerRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const addressLines = siteSettings.contact.address.split(",").map((line) => line.trim()).filter(Boolean);
  const telegram = siteSettings.contact.telegram.replace(/^@/, "");
  const email = siteSettings.contact.email;
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
              <ArrowButton href={tel(phones[0])} label="Call for a Quotation" theme="outline-white" />
            </div>
          </div>

          <div className="ft-office">
            <h3 className="ft-label">Battambang · Head office</h3>
            <address className="ft-text not-italic">
              {addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <a
                href={MAPS}
                target="_blank"
                rel="noopener"
                className="ft-ul ft-dir inline-block mt-3 text-white/90 hover:text-white"
              >
                <span>Get directions</span>
              </a>
            </address>

            <div className="ft-text">
              <span className="block text-[11px] font-mono uppercase tracking-[0.08em] text-white/50 mb-1.5">
                Sales & Quotations Hotlines
              </span>
              <div className="flex flex-col gap-1 w-full">
                {phones.map((n) => (
                  <a
                    key={n}
                    href={tel(n)}
                    className="ft-ul inline-block text-white/90 hover:text-white"
                  >
                    <span>{n}</span>
                  </a>
                ))}
              </div>

              {/* Social Media & Direct Contact */}
              <div className="mt-4 pt-3.5 border-t border-white/10 w-full">
                <span className="block text-[11px] font-mono uppercase tracking-[0.08em] text-white/50 mb-2">
                  Social & Direct Contact
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://t.me/${telegram}`}
                    target="_blank"
                    rel="noopener"
                    aria-label="Telegram"
                    title={`Telegram: ${telegram}`}
                    className="flex items-center justify-center size-8 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-[#229ED9] hover:border-[#229ED9] hover:text-white transition-all duration-200"
                  >
                    <TelegramIcon className="size-4" />
                  </a>
                  <a
                    href={tel(phones[0])}
                    aria-label="Call Hotline"
                    title={`Call Hotline: ${phones[0]}`}
                    className="flex items-center justify-center size-8 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-200"
                  >
                    <PhoneIcon className="size-3.5" />
                  </a>
                  <a
                    href={`mailto:${email}`}
                    aria-label="Email BCE"
                    title={`Email: ${email}`}
                    className="flex items-center justify-center size-8 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-[#EA4335] hover:border-[#EA4335] hover:text-white transition-all duration-200"
                  >
                    <MailIcon className="size-3.5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener"
                    aria-label="Facebook"
                    title="Facebook"
                    className="flex items-center justify-center size-8 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-200"
                  >
                    <FacebookIcon className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <a href={href("#")} onClick={!base ? toTop : undefined} className="ft-logo">{siteSettings.site.shortName}., Ltd.</a>
          <a href={MAPS} target="_blank" rel="noopener" className="ft-b2">Get directions</a>
          <a href="#" onClick={toTop} className="ft-b3">Back to top</a>
          <span className="ft-b4">All rights reserved</span>
          <small className="ft-copy">© {new Date().getFullYear()} {siteSettings.site.nameEn}</small>
        </div>
      </div>
    </footer>
  );
}