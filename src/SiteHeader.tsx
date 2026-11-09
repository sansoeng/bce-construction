import { useEffect, useRef, useState } from "react";
import ArrowButton from "./ArrowButton";
import { getLang, setLang } from "./i18n";

// Floating header after fluid.glass, moved to the top: a compact blurred black bar (mark, current section title,
// burger). It slides in and unfolds once; opening the menu folds it to a square close button while the menu panel
// unfolds beneath it. State changes are CSS transitions in index.css (.fg-header / .fg-menu).
// Either side of it, level with the bar: the BCE Construction wordmark on the left and "Get a quote" on the right,
// reading white over dark sections (marked data-nav-dark) and black over light ones.

const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Phnom_Penh" });

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return <>{timeFormat.format(now).replace(":", " ").toUpperCase()}</>;
}

const LINKS = [
  ["About", "/?about"],
  ["Our businesses", "/?businesses"],
  ["Projects", "/?projects"],
  ["Quality & HSE", "/?quality"],
  ["Coverage", "#coverage"],
  ["Request a quote", "/?quote"],
  ["Contact", "#contact"],
];

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="fx-lang-icon">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

// EN / ខ្មែរ switch; its labels stay as they are in either language.
function LangSwitch({ className, tabIndex }: { className: string; tabIndex?: number }) {
  const lang = getLang();
  return (
    <div className={`fx-lang-pill ${className}`} role="group" aria-label="Language selection" data-no-translate>
      <GlobeIcon />
      <button
        type="button"
        className={`fx-lang-opt ${lang === "en" ? "is-active" : ""}`}
        aria-pressed={lang === "en"}
        tabIndex={tabIndex}
        onClick={() => setLang("en")}
        lang="en"
      >
        EN
      </button>
      <span className="fx-lang-div" aria-hidden>|</span>
      <button
        type="button"
        className={`fx-lang-opt fx-lang-km ${lang === "km" ? "is-active" : ""}`}
        aria-pressed={lang === "km"}
        tabIndex={tabIndex}
        onClick={() => setLang("km")}
        lang="km"
      >
        ខ្មែរ
      </button>
    </div>
  );
}

const revealListeners = new Set<() => void>();
let globalRevealed = false;

// Intro (Fluid's header:onEnter): slide in, unfold, then hand over to the faster menu transitions.
export function revealHeader() {
  globalRevealed = true;
  revealListeners.forEach((fn) => fn());
}

const P3_IN = "cubic-bezier(.32, 0, .67, 0)";
const P3_OUT = "cubic-bezier(.33, 1, .68, 1)";

// `base` prefixes the section links (e.g. "/" on a project page, so they lead back to the homepage sections).
export default function SiteHeader({ phones, tel, base = "" }: { phones: string[]; tel: (n: string) => string; base?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [dark, setDark] = useState(false);
  const [isIn, setIsIn] = useState(() => globalRevealed || !document.documentElement.classList.contains("is-loading"));
  const [isReady, setIsReady] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleReveal = () => {
      setIsIn(true);
      setTimeout(() => setIsReady(true), 2100);
    };
    revealListeners.add(handleReveal);

    if (isIn && !isReady) {
      const timer = setTimeout(() => setIsReady(true), 2100);
      return () => {
        clearTimeout(timer);
        revealListeners.delete(handleReveal);
      };
    }
    return () => {
      revealListeners.delete(handleReveal);
    };
  }, [isIn, isReady]);

  // The title follows the section in view; each change rolls the old one up and out, then the new one up from below.
  useEffect(() => {
    const el = rollRef.current;
    if (!el) return;
    let shown = el.textContent ?? "";
    let target = shown;
    let busy = false;
    let alive = true;
    const roll = () => {
      if (busy || !alive || target === shown) return;
      busy = true;
      const next = target;
      el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: 600, easing: P3_IN, fill: "forwards" })
        .finished.then(() => {
          el.textContent = shown = next;
          return el.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 600, easing: P3_OUT, fill: "forwards" }).finished;
        })
        .catch(() => undefined)
        .finally(() => {
          busy = false;
          roll();
        });
    };
    let ticking = false;
    const check = () => {
      ticking = false;
      const line = innerHeight * 0.4;
      let current: HTMLElement | null = null;
      document.querySelectorAll<HTMLElement>("[data-header-title]").forEach((s) => {
        if (s.getBoundingClientRect().top <= line) current = s;
      });
      const mid = (headerRef.current?.getBoundingClientRect().top ?? 40) + 25;
      setDark([...document.querySelectorAll<HTMLElement>("[data-nav-dark]")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      }));
      const section = current as HTMLElement | null;
      if (!section) return;
      setActive(section.id ? `#${section.id}` : "");
      target = section.dataset.headerTitle ?? "";
      roll();
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    check();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      alive = false;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!headerRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
    };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const close = () => setOpen(false);
  const tab = open ? 0 : -1;
  const sub: [string, string | null][] = [
    ["Battambang, KH", null],
    ["", null],
    [phones[0], tel(phones[0])],
    [phones[1], tel(phones[1])],
  ];

  const side = `fx-side${isIn ? " is-in" : ""}${dark ? " is-dark" : ""}`;
  return (
    <>
      <a href={base || "#"} className={`${side} fx-logo`} aria-label="BCE., Ltd., home">BCE., Ltd.</a>
      <div className={`${side} fx-quote`}>
        <LangSwitch className="fx-lang" />
        <ArrowButton href="/?quote" label="Get a quote" theme={dark ? "white" : "black"} className="fx-quote-btn" />
      </div>
      <header
        ref={headerRef}
        data-nav
        className={`fg-header${isIn ? " is-in" : ""}${isReady ? " is-ready" : ""}${open ? " is-menu" : ""}`}
      >
        <a href={base || "#"} className="fg-logo" aria-label={base ? "BCE., Ltd., home" : "BCE., Ltd., back to top"} onClick={close}>BCE</a>
        <div className="fg-title" aria-hidden onClick={() => setOpen(true)}>
          <span className="fg-title-move"><span ref={rollRef} className="fg-title-roll">Home</span></span>
        </div>
        <div className="fg-right-group">
          <LangSwitch className="fg-header-lang" tabIndex={tab} />
          <button type="button" className="fg-burger" aria-label="Menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 20 11" fill="none" aria-hidden>
              {[0.5, 5.5, 10.5].map((y, k) => <path key={y} d={`M0 ${y}H20`} stroke="currentColor" style={{ "--k": k } as React.CSSProperties} />)}
            </svg>
          </button>
        </div>
        <button type="button" className="fg-close" aria-label="Close menu" tabIndex={tab} onClick={close}>
          <svg viewBox="0 0 13 13" fill="none" aria-hidden>
            <path d="M0.353516 11.6673L11.6672 0.353589" stroke="currentColor" />
            <path d="M0.353516 0.353577L11.6672 11.6673" stroke="currentColor" />
          </svg>
        </button>
        <div className="fg-bg" />
      </header>

      <div ref={menuRef} id="site-menu" className={`fg-menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Main">
          <div className="fg-menu-header">
            <div className="fg-menu-title">Menu</div>
            <LangSwitch className="fg-lang" tabIndex={tab} />
          </div>
          <ul className="fg-main">
            {LINKS.map(([label, href], i) => (
              <li className={`fg-item${active === href ? " is-active" : ""}`} key={href}>
                <div className="fg-mask">
                  <a href={href.startsWith("/") ? href : base + href} className="fg-link" tabIndex={tab} onClick={close} style={{ "--i": i } as React.CSSProperties}>
                    <span className="fg-line">{label}</span>
                    <span className="fg-line" aria-hidden>{label}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <ul className="fg-sub">
            {sub.map(([label, href], k) => {
              const style = { "--i": LINKS.length + k } as React.CSSProperties;
              return (
                <li className="fg-mask" key={k}>
                  {href ? (
                    <a href={href} className="fg-sublink" tabIndex={tab} style={style}>{label}</a>
                  ) : (
                    <span className="fg-sublink" style={style}>{label || <LocalTime />}</span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="fg-menu-actions">
            <ArrowButton href="/?quote" label="Request a quote" theme="white" className="fg-menu-quote-btn" tabIndex={tab} onClick={close} />
            <ArrowButton href={tel(phones[0])} label={`Call ${phones[0]}`} className="fg-menu-btn" tabIndex={tab} />
          </div>
        </nav>
        <div className="fg-menu-bg" />
      </div>
    </>
  );
}
