import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import ArrowButton from "./ArrowButton";
import { getLang, setLang } from "./i18n";

/**
 * Navigation after dalco.ch: one floating, inset glass bar. The BCE lockup sits at the left, the five tabs are
 * centred (About, Business, Projects, Quality & Lab, More) and the language switch plus the quote button close the
 * right. Tabs with children open the reference's own dropdown: a 78% white glass sheet, 32px blur, a half-pixel
 * hairline, a 10px corner, fading in as it drops 10px over 350ms. Panels come in the three shapes DALCO uses — the
 * narrow list (About, Projects, More), the media panel (Business: a 309×279 photo that cross-fades as you move down
 * the titles) and the three-column group panel (Quality & Lab) — with titles only, no descriptions and no arrows.
 *
 * On phones the tabs collapse into a burger that opens a full-height sheet with the same items as accordions, so the
 * expand navigation survives without hover. Over the first 800px of scroll the surface narrows and slides up, as the
 * reference's header does.
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
/** The tab list is only shown from this width up; below it the burger and sheet take over. */
const NAV_MIN = 1000;

/* ---------------------------------------------------------------------------------------------------------- */
/* Navigation model: titles only, in the reference's three dropdown shapes.                                   */
/* ---------------------------------------------------------------------------------------------------------- */

type Link = {
  label: string
  href: string
  image?: string
}

type Column = {
  title: string
  href: string
  links: Link[]
}

type Panel =
  | {
      kind: "default"
      items: Link[]
    }
  | {
      kind: "mega"
      items: Link[]
    }
  | {
      kind: "columns"
      groups: Column[]
    }

type NavItem = {
  id: string
  label: string
  href: string
  panel: Panel
}

const NAV: NavItem[] = [
  {
    id: "about",
    label: "About",
    href: "/?about",
    panel: {
      kind: "default",
      items: [
        { label: "About BCE", href: "/?about" },
        { label: "Our story", href: "/?about#ab-story" },
        { label: "Technical capabilities", href: "/?capabilities" },
        { label: "Coverage", href: "/#coverage" },
      ],
    },
  },
  {
    id: "business",
    label: "Business",
    href: "/?businesses",
    panel: {
      kind: "mega",
      items: [
        { label: "Ready-Mix Concrete", href: "/?business=ready-mix-concrete", image: "/Image/bce/photos/concrete-discharge.webp" },
        { label: "Piling", href: "/?business=piling", image: "/Image/bce/photos/pile-reinforcement.webp" },
        { label: "Construction", href: "/?business=construction", image: "/Image/bce/photos/road-crew.webp" },
        { label: "Concrete Slab Works", href: "/?business=concrete-slab-works", image: "/Image/bce/photos/slab-pour.webp" },
        { label: "Truck & Equipment Rental", href: "/?business=equipment-rental", image: "/Image/bce/photos/mixer-pour.webp" },
        { label: "All businesses", href: "/?businesses", image: "/Image/bce/hero_batching_plant.webp" },
      ],
    },
  },
  {
    id: "projects",
    label: "Projects",
    href: "/?projects",
    panel: {
      kind: "default",
      items: [
        { label: "All projects", href: "/?projects" },
        { label: "Bridge Foundation Piling", href: "/?project=kampong-thom-bridge-foundations" },
        { label: "Logistics Warehouse Floor Slab", href: "/?project=poipet-logistics-warehouse" },
        { label: "Commercial Complex Ready-Mix Supply", href: "/?project=siem-reap-commercial-ready-mix" },
        { label: "Provincial Road Rehabilitation", href: "/?project=battambang-provincial-road" },
        { label: "Mixed-Use Tower Foundations", href: "/?project=phnom-penh-tower-foundations" },
      ],
    },
  },
  {
    id: "quality",
    label: "Quality & Lab",
    href: "/?quality",
    panel: {
      kind: "columns",
      groups: [
        {
          title: "Laboratory",
          href: "/?quality#laboratory",
          links: [
            { label: "In-house laboratory", href: "/?quality#laboratory" },
            { label: "Raw materials", href: "/?quality#raw-materials" },
            { label: "Calibration", href: "/?quality#calibration" },
          ],
        },
        {
          title: "Assurance",
          href: "/?quality#grades",
          links: [
            { label: "Concrete grades", href: "/?quality#grades" },
            { label: "Health, safety & environment", href: "/?quality#hse" },
          ],
        },
        {
          title: "Documents",
          href: "/?quality#documents",
          links: [
            { label: "Quality documents", href: "/?quality#documents" },
            { label: "Certificates & method statements", href: "/?resources" },
            { label: "All resources", href: "/?resources" },
          ],
        },
      ],
    },
  },
  {
    id: "more",
    label: "More",
    href: "/?resources",
    panel: {
      kind: "default",
      items: [
        { label: "Resources", href: "/?resources" },
        { label: "Careers", href: "/?recruitment" },
        { label: "Blog", href: "/?blog" },
        { label: "Contact", href: "/?contact" },
      ],
    },
  },
];

const panelLinks = (panel: Panel): Link[] =>
  panel.kind === "columns" ? panel.groups.flatMap((group) => group.links) : panel.items;

function PanelBody({
  panel,
  mediaIndex,
  onMedia,
  onNavigate,
}: {
  panel: Panel;
  mediaIndex: number;
  onMedia: (index: number) => void;
  onNavigate: () => void;
}) {
  if (panel.kind === "mega") {
    return (
      <div className="ls-panel-inner ls-mega">
        <div className="ls-mega-media" aria-hidden>
          {panel.items.map((item, i) =>
            item.image ? (
              <img
                key={item.label}
                src={item.image}
                alt=""
                loading="lazy"
                decoding="async"
                className={i === mediaIndex ? "is-active" : ""}
              />
            ) : null,
          )}
        </div>
        <ul className="ls-mega-list">
          {panel.items.map((item, i) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="ls-mega-link"
                onClick={onNavigate}
                onMouseEnter={() => onMedia(i)}
                onFocus={() => onMedia(i)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (panel.kind === "columns") {
    return (
      <div className="ls-panel-inner ls-columns">
        {panel.groups.map((group) => (
          <div key={group.title} className="ls-col">
            <a href={group.href} className="ls-col-title" onClick={onNavigate}>
              {group.title}
            </a>
            <ul className="ls-col-list">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="ls-col-link" onClick={onNavigate}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ls-panel-inner ls-drop">
      <ul className="ls-drop-list">
        {panel.items.map((item) => (
          <li key={item.label}>
            <a href={item.href} className="ls-drop-link" onClick={onNavigate}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
  phones?: string[];
  tel?: (n: string) => string;
  base?: string;
}

export default function SiteHeader({ base = "" }: SiteHeaderProps) {
  const [isIn, setIsIn] = useState(() => globalRevealed || !document.documentElement.classList.contains("is-loading"));
  const [scrolled, setScrolled] = useState(false);
  const [onCover, setOnCover] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [panelX, setPanelX] = useState<number | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [canHover, setCanHover] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleReveal = () => setIsIn(true);
    revealListeners.add(handleReveal);
    return () => {
      revealListeners.delete(handleReveal);
    };
  }, []);

  // Hover only widens menus on real pointers; touch and narrow screens use the burger sheet.
  useEffect(() => {
    const mq = matchMedia(`(hover: hover) and (pointer: fine) and (min-width: ${NAV_MIN}px)`);
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
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

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setOpen(null);
  }, []);

  const show = useCallback((id: string, trigger?: HTMLElement | null) => {
    window.clearTimeout(closeTimer.current);
    setOpen(id);
    setMediaIndex(0);
    const inner = innerRef.current;
    if (inner && trigger) {
      const rect = trigger.getBoundingClientRect();
      const box = inner.getBoundingClientRect();
      setPanelX(rect.left + rect.width / 2 - box.left);
    }
  }, []);

  // A short grace period lets the pointer cross the 10px gap between tab and panel.
  const hide = useCallback((delay = 160) => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), delay);
  }, []);

  // Escape closes the panel or the phone sheet and hands focus back to the bar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (sheet) {
        setSheet(false);
        navRef.current?.querySelector<HTMLElement>(".ls-burger")?.focus();
        return;
      }
      if (open) {
        const id = open;
        close();
        navRef.current?.querySelector<HTMLElement>(`[data-tab="${id}"]`)?.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, sheet, close]);

  // A click anywhere outside the bar and its panels closes the open menu.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (target && (navRef.current?.contains(target) || layerRef.current?.contains(target))) return;
      close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  // The phone sheet owns the screen: stop the page (and Lenis) underneath it.
  useEffect(() => {
    if (!sheet) return;
    const root = document.documentElement;
    const lenis = (window as unknown as {
      __lenis?: {
        stop: () => void
        start: () => void
      } | null
    }).__lenis;
    root.classList.add("ls-lock");
    lenis?.stop();
    return () => {
      root.classList.remove("ls-lock");
      lenis?.start();
    };
  }, [sheet]);

  // Crossing the tablet/desktop breakpoint resets whichever menu was open.
  useEffect(() => {
    const onResize = () => {
      if (innerWidth >= NAV_MIN) setSheet(false);
      else close();
    };
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, [close]);

  const linkHref = (path: string) => (path.startsWith("#") && base ? `${base}${path}` : path);
  const solid = open !== null;

  return (
    <header
      ref={navRef}
      data-nav
      className={`ls-nav ${isIn ? "is-in" : ""} ${scrolled ? "is-scrolled" : ""} ${onCover ? "is-on-cover" : ""} ${
        solid ? "is-solid" : ""
      } ${sheet ? "is-sheet-open" : ""}`}
    >
      <div className="ls-nav-surface">
        <div className="ls-nav-bar">
          {/* Lockup at the left, as DALCO's wordmark: crest, wordmark, and the full company name underneath. */}
          <a href={base || "/"} className="ls-logo" aria-label="BCE., Ltd. — home">
            <Crest className="ls-logo-crest" />
            <span className="ls-logo-word">
              <span className="ls-logo-text">BCE</span>
              <span className="ls-logo-sub">Battambang Construction &amp; Engineering</span>
            </span>
          </a>

          <div className="ls-nav-center">
            <nav className="ls-nav-links" aria-label="Primary">
              {NAV.map((item) => {
                const isOpen = open === item.id;
                return (
                  <div
                    key={item.id}
                    className={`ls-nav-item${isOpen ? " is-active" : ""}`}
                    onMouseEnter={(e) => canHover && show(item.id, e.currentTarget.querySelector<HTMLElement>(".ls-link"))}
                    onMouseLeave={() => canHover && hide()}
                  >
                    <a
                      href={linkHref(item.href)}
                      className="ls-link"
                      data-tab={item.id}
                      aria-expanded={isOpen}
                      aria-controls={`ls-panel-${item.id}`}
                      onFocus={(e) => show(item.id, e.currentTarget)}
                      onClick={(e) => {
                        if (!canHover || isOpen) {
                          close();
                          return; // second click (or a plain link) follows the tab
                        }
                        e.preventDefault();
                        show(item.id, e.currentTarget);
                      }}
                    >
                      {item.label}
                    </a>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="ls-nav-right">
            <LangSwitch />
            <span className="ls-nav-sep" aria-hidden />
            <ArrowButton href={linkHref("/?quote")} label="Get a quote" className="ls-quote" />
            <button
              type="button"
              className="ls-burger"
              aria-label={sheet ? "Close menu" : "Open menu"}
              aria-expanded={sheet}
              aria-controls="ls-sheet"
              onClick={() => setSheet((v) => !v)}
            >
              <span aria-hidden />
              <span aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Panels sit outside the clipped surface so their corners are not cut off. */}
      <div
        ref={layerRef}
        className={`ls-panels${open ? " is-open" : ""}`}
        style={{ "--ls-panel-x": panelX === null ? "50%" : `${panelX}px` } as CSSProperties}
      >
        <div className="ls-panels-inner" ref={innerRef}>
          {NAV.map((item) => (
            <div
              key={item.id}
              id={`ls-panel-${item.id}`}
              className={`ls-panel ls-panel--${item.panel.kind}${open === item.id ? " is-open" : ""}`}
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
              onMouseLeave={() => canHover && hide(120)}
              aria-hidden={open !== item.id}
            >
              <PanelBody panel={item.panel} mediaIndex={mediaIndex} onMedia={setMediaIndex} onNavigate={close} />
            </div>
          ))}
        </div>
      </div>

      {/* Phones and tablets: the same tabs as accordions behind the burger. */}
      <div className={`ls-sheet${sheet ? " is-open" : ""}`} id="ls-sheet" aria-hidden={!sheet}>
        <div className="ls-sheet-inner">
          {NAV.map((item) => {
            const expanded = openGroup === item.id;
            return (
              <div key={item.id} className={`ls-sheet-item${expanded ? " is-open" : ""}`}>
                <div className="ls-sheet-head">
                  <a href={linkHref(item.href)} className="ls-sheet-link" onClick={() => setSheet(false)}>
                    {item.label}
                  </a>
                  <button
                    type="button"
                    className="ls-sheet-toggle"
                    aria-label={`${expanded ? "Hide" : "Show"} ${item.label}`}
                    aria-expanded={expanded}
                    aria-controls={`ls-sheet-${item.id}`}
                    onClick={() => setOpenGroup(expanded ? null : item.id)}
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden>
                      <path d="M8 2.5v11M2.5 8h11" />
                    </svg>
                  </button>
                </div>
                <div className="ls-sheet-sub" id={`ls-sheet-${item.id}`} hidden={!expanded}>
                  {item.panel.kind === "columns"
                    ? item.panel.groups.map((group) => (
                        <div key={group.title} className="ls-sheet-group">
                          <span className="ls-sheet-group-title">{group.title}</span>
                          {group.links.map((link) => (
                            <a key={link.label} href={link.href} className="ls-sheet-sublink" onClick={() => setSheet(false)}>
                              {link.label}
                            </a>
                          ))}
                        </div>
                      ))
                    : panelLinks(item.panel).map((link) => (
                        <a key={link.label} href={link.href} className="ls-sheet-sublink" onClick={() => setSheet(false)}>
                          {link.label}
                        </a>
                      ))}
                </div>
              </div>
            );
          })}

          <div className="ls-sheet-foot">
            <ArrowButton href={linkHref("/?quote")} label="Get a quote" className="ls-sheet-quote" onClick={() => setSheet(false)} />
            <LangSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
