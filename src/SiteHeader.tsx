import { useEffect, useRef, useState } from "react";
import ArrowButton from "./ArrowButton";
import { getLang, setLang } from "./i18n";

/**
 * Navigation after lightshiprv.com: one floating, inset bar. The main links sit at the left, the BCE mark in the
 * centre, and Resources, Careers, Blog, Contact, the language switch and the quote button at the right. Every link
 * goes straight to its page — there is no hamburger or secondary menu. Over the first 800px of scroll the surface
 * narrows and slides up, and the mark scales down, as the reference's header does.
 */

const revealListeners = new Set<() => void>();
let globalRevealed = false;

export function revealHeader() {
  globalRevealed = true;
  revealListeners.forEach((fn) => fn());
}

// Backwards compatibility export if needed
export function SharplinkButton() {
  return null;
}

// Their scroll clip easing: cubic-bezier(.15, .61, 0, 1).
const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-4) break;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    return sampleY(t);
  };
};
const easeScroll = cubicBezier(0.15, 0.61, 0, 1);
const SCROLL_DISTANCE = 800;

type Item = { label: string; href: string };

const UTILITY_ITEMS: Item[] = [
  { label: "Resources", href: "/?resources" },
  { label: "Careers", href: "/?recruitment" },
  { label: "Blog", href: "/?blog" },
  { label: "Contact", href: "/?contact" },
];

function Crest({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function LangSwitch() {
  const lang = getLang();
  return (
    <div className="ls-lang" data-no-translate>
      <button type="button" className={`ls-lang-btn ${lang === "en" ? "is-current" : ""}`} aria-pressed={lang === "en"} onClick={() => setLang("en")}>
        EN
      </button>
      <span className="ls-lang-divider">/</span>
      <button type="button" className={`ls-lang-btn font-khmer ${lang === "km" ? "is-current" : ""}`} aria-pressed={lang === "km"} onClick={() => setLang("km")}>
        ខ្មែរ
      </button>
    </div>
  );
}

interface SiteHeaderProps {
  phones: string[];
  tel: (n: string) => string;
  base?: string;
}

export default function SiteHeader({ base = "" }: SiteHeaderProps) {
  const [isIn, setIsIn] = useState(() => globalRevealed || !document.documentElement.classList.contains("is-loading"));
  const [scrolled, setScrolled] = useState(false);
  const [onCover, setOnCover] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleReveal = () => setIsIn(true);
    revealListeners.add(handleReveal);
    return () => {
      revealListeners.delete(handleReveal);
    };
  }, []);

  // One scroll pass writes the eased progress (--ls-p, 0..1 over 800px) the surface and mark read from CSS.
  useEffect(() => {
    let raf = 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const p = reduce ? 0 : easeScroll(Math.min(1, Math.max(0, y / SCROLL_DISTANCE)));
      navRef.current?.style.setProperty("--ls-p", p.toFixed(4));
      setScrolled(y > 24);
      const cover = document.querySelector<HTMLElement>("[data-nav-dark]");
      const rect = cover?.getBoundingClientRect();
      setOnCover(y < 24 && !!rect && rect.top <= 8 && rect.bottom > 96);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);

  const linkHref = (path: string) => (path.startsWith("#") && base ? `${base}${path}` : path);

  return (
    <header
      ref={navRef}
      data-nav
      className={`ls-nav ${isIn ? "is-in" : ""} ${scrolled ? "is-scrolled" : ""} ${onCover ? "is-on-cover" : ""}`}
    >
      <div className="ls-nav-surface">
        <div className="ls-nav-bar">
          <div className="ls-nav-left">
            <nav className="ls-nav-links" aria-label="Primary">
              <a href={linkHref("/?about")} className="ls-link">About</a>
              <a href={linkHref("/?businesses")} className="ls-link">Businesses</a>
              <a href={linkHref("/?projects")} className="ls-link">Projects</a>
              <a href={linkHref("/?quality")} className="ls-link">Quality &amp; Lab</a>
            </nav>
          </div>

          <a href={base || "/"} className="ls-logo" aria-label="BCE., Ltd. home">
            <Crest className="ls-logo-crest" />
            <span className="ls-logo-text">BCE</span>
          </a>

          <div className="ls-nav-right">
            <nav className="ls-nav-links ls-nav-links-right" aria-label="Secondary">
              {UTILITY_ITEMS.map((item) => (
                <a key={item.label} href={linkHref(item.href)} className="ls-link">
                  {item.label}
                </a>
              ))}
            </nav>
            <span className="ls-nav-sep" aria-hidden />
            <LangSwitch />
            <ArrowButton href={linkHref("/?quote")} label="Get a quote" className="ls-quote" />
          </div>
        </div>
      </div>
    </header>
  );
}
