import { useEffect, useRef, useState, type CSSProperties } from "react";
import ArrowButton from "./ArrowButton";
import { getLang, setLang } from "./i18n";
import { businessHref, offerings } from "./company";

/**
 * Navigation after lightshiprv.com: a floating, inset bar — hamburger and primary links at the left, the BCE mark
 * centred, the remaining links and the quote button at the right. Over a dark cover it is transparent with white type;
 * once the page scrolls it settles into a compact frosted pill. The hamburger opens the full-screen menu: great rows
 * that expand to their sub-pages (the Apple-style expandable navigation this replaces), image cards and the secondary
 * links. Everything else (lang switch, hotlines, quote) lives in the menu and the bar as before.
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

type Item = { label: string; href: string; desc?: string };
type SectionKey = "about" | "businesses" | "projects" | "quality" | "more";

const BUSINESS_DESCRIPTIONS: Record<string, string> = {
  "ready-mix-concrete": "Four plants, 41 mixer trucks, C15 to C40",
  piling: "Reinforced piles with our own rigs",
  construction: "Infrastructure, industrial and residential",
  "concrete-slab-works": "Pumped, placed and finished with 8 pumps",
  "equipment-rental": "Mixer trucks, pumps and piling rigs for hire",
};

const BUSINESS_ITEMS: Item[] = offerings.map((b) => ({
  label: b.name,
  href: businessHref(b.slug),
  desc: BUSINESS_DESCRIPTIONS[b.slug] ?? b.tagline,
}));

const PROJECT_ITEMS: Item[] = [
  { label: "All 30+ landmark projects", href: "/?projects", desc: "Bridge foundations, factories, towers and plants" },
  { label: "Industrial & Commercial", href: "/?projects#industrial", desc: "Garment factories, warehouses & logistics depots" },
  { label: "Infrastructure & Roads", href: "/?projects#infrastructure", desc: "National roads, bridges, culverts & irrigation" },
  { label: "Foundation Piling Works", href: "/?projects#piling", desc: "Hydraulic static pressing & driven RC piles" },
];

const MORE_ITEMS: Item[] = [
  { label: "Contact", href: "/?contact", desc: "Head office, hotlines and site directions" },
  { label: "Resources & Downloads", href: "/?resources", desc: "Company profile, certificates and tender documents" },
  { label: "Careers & Recruitment", href: "/?recruitment", desc: "Open roles on site, in the plant and in the lab" },
  { label: "Blog & Insights", href: "/?blog", desc: "Project notes, technical writing and company news" },
  { label: "Technical Capabilities", href: "/?capabilities", desc: "4 plants, 41 mixers, 8 pumps and our own piling rigs" },
];

type Panel = { label: string; href: string; blurb: string; items: Item[]; card: { title: string; text: string; href: string; image: string } };

const PANELS: Record<"businesses" | "projects" | "more", Panel> = {
  businesses: {
    label: "Our businesses",
    href: "/?businesses",
    blurb: "Concrete, piling, construction, slab works and fleet hire — delivered with our own plants, crews and laboratory.",
    items: BUSINESS_ITEMS,
    card: {
      title: "Integrated from plant to pour",
      text: "Four batching plants, 41 mixer trucks, 8 pumps and an accredited in-house laboratory.",
      href: "/?businesses",
      image: "/Image/bce/about-business-banner.webp",
    },
  },
  projects: {
    label: "Selected work",
    href: "/?projects",
    blurb: "Infrastructure, industrial and foundation works across 13 provinces and Phnom Penh.",
    items: PROJECT_ITEMS,
    card: {
      title: "30+ landmark projects",
      text: "Bridges, factories, warehouses, towers and residential developments since 1995.",
      href: "/?projects",
      image: "/Image/bce/core-business-construction.webp",
    },
  },
  more: {
    label: "The company",
    href: "/?contact",
    blurb: "The people, the paperwork and the ways to reach us.",
    items: MORE_ITEMS,
    card: {
      title: "Talk to our engineers",
      text: "Site, scope and schedule — we review it and come back with a clear, detailed quotation.",
      href: "/?contact",
      image: "/Image/bce/about-zoom-rebar-crew.webp",
    },
  },
};

const SECONDARY: Item[] = [
  { label: "About BCE", href: "/?about" },
  { label: "Quality & Lab", href: "/?quality" },
  { label: "Technical capabilities", href: "/?capabilities" },
  { label: "Resources & downloads", href: "/?resources" },
  { label: "Careers & recruitment", href: "/?recruitment" },
  { label: "Blog & insights", href: "/?blog" },
  { label: "Contact", href: "/?contact" },
];

const MENU_CARDS = [
  { title: "Our businesses", text: "Five core operations, one integrated company.", href: "/?businesses", image: "/Image/bce/about-business-banner.webp" },
  { title: "Projects", text: "Bridge foundations, factories and towers.", href: "/?projects", image: "/Image/bce/core-business-piling.webp" },
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

export default function SiteHeader({ phones, tel, base = "" }: SiteHeaderProps) {
  const [isIn, setIsIn] = useState(() => globalRevealed || !document.documentElement.classList.contains("is-loading"));
  const [scrolled, setScrolled] = useState(false);
  const [onCover, setOnCover] = useState(false);
  const [activePanel, setActivePanel] = useState<"businesses" | "projects" | "more" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);
  const closeTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleReveal = () => setIsIn(true);
    revealListeners.add(handleReveal);
    return () => {
      revealListeners.delete(handleReveal);
    };
  }, []);

  // The bar is transparent over a dark cover at the top of the page and frosts into its pill as soon as you scroll.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
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

  // Menu open: freeze the page and Lenis, close on Escape.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } | null }).__lenis;
    if (menuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setActivePanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openPanel = (key: "businesses" | "projects" | "more" | null) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    if (menuOpen) return;
    setActivePanel(key);
  };

  const leavePanel = () => {
    closeTimeout.current = window.setTimeout(() => setActivePanel(null), 220);
  };

  const closeAll = () => {
    setActivePanel(null);
    setMenuOpen(false);
    setOpenSection(null);
  };

  const linkHref = (path: string) => (path.startsWith("#") && base ? `${base}${path}` : path);

  const toggleMenu = () => {
    setMenuOpen((open) => {
      if (!open) setActivePanel(null);
      return !open;
    });
  };

  return (
    <>
      <header
        data-nav
        className={`ls-nav ${isIn ? "is-in" : ""} ${scrolled ? "is-scrolled" : ""} ${onCover ? "is-on-cover" : ""} ${
          activePanel ? "has-panel" : ""
        } ${menuOpen ? "is-menu-open" : ""}`}
        onMouseLeave={leavePanel}
      >
        <div className="ls-nav-bar">
          <div className="ls-nav-left">
            <button
              type="button"
              className={`ls-burger ${menuOpen ? "is-active" : ""}`}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <span />
              <span />
            </button>
            <nav className="ls-nav-links" aria-label="Primary">
              <a href={linkHref("/?about")} className="ls-link" onClick={closeAll}>About</a>
              <button
                type="button"
                className={`ls-link ls-link-panel ${activePanel === "businesses" ? "is-active" : ""}`}
                aria-expanded={activePanel === "businesses"}
                onMouseEnter={() => openPanel("businesses")}
                onClick={() => setActivePanel(activePanel === "businesses" ? null : "businesses")}
              >
                Businesses
              </button>
              <button
                type="button"
                className={`ls-link ls-link-panel ${activePanel === "projects" ? "is-active" : ""}`}
                aria-expanded={activePanel === "projects"}
                onMouseEnter={() => openPanel("projects")}
                onClick={() => setActivePanel(activePanel === "projects" ? null : "projects")}
              >
                Projects
              </button>
            </nav>
          </div>

          <a href={base || "/"} className="ls-logo" aria-label="BCE., Ltd. home">
            <Crest className="ls-logo-crest" />
            <span className="ls-logo-text">BCE</span>
          </a>

          <div className="ls-nav-right">
            <nav className="ls-nav-links ls-nav-links-right" aria-label="Secondary">
              <a href={linkHref("/?quality")} className="ls-link" onClick={closeAll}>Quality & Lab</a>
              <button
                type="button"
                className={`ls-link ls-link-panel ${activePanel === "more" ? "is-active" : ""}`}
                aria-expanded={activePanel === "more"}
                onMouseEnter={() => openPanel("more")}
                onClick={() => setActivePanel(activePanel === "more" ? null : "more")}
              >
                More
              </button>
            </nav>
            <span className="ls-nav-sep" aria-hidden />
            <LangSwitch />
            <ArrowButton href={linkHref("/?quote")} label="Get a quote" onClick={closeAll} className="ls-quote" />
          </div>
        </div>

        {/* Hover panels: the expandable navigation, kept from the previous header and widened with a lead card. */}
        <div className={`ls-mega ${activePanel ? "is-open" : ""}`}>
          {(Object.keys(PANELS) as (keyof typeof PANELS)[]).map((key) => (
            <div key={key} className={`ls-mega-panel ${activePanel === key ? "is-active" : ""}`}>
              <div className="ls-mega-links">
                <p className="ls-mega-label">{PANELS[key].label}</p>
                <p className="ls-mega-blurb">{PANELS[key].blurb}</p>
                <ul>
                  {PANELS[key].items.map((item) => (
                    <li key={item.label}>
                      <a href={linkHref(item.href)} onClick={closeAll} className="ls-mega-link">
                        <span className="ls-mega-link-label">{item.label}</span>
                        {item.desc ? <span className="ls-mega-link-desc">{item.desc}</span> : null}
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={linkHref(PANELS[key].href)} onClick={closeAll} className="ls-mega-all">
                  View all
                  <span aria-hidden>→</span>
                </a>
              </div>
              <a href={linkHref(PANELS[key].card.href)} onClick={closeAll} className="ls-mega-card">
                <img src={PANELS[key].card.image} alt="" loading="lazy" />
                <span className="ls-mega-card-body">
                  <span className="ls-mega-card-title">{PANELS[key].card.title}</span>
                  <span className="ls-mega-card-text">{PANELS[key].card.text}</span>
                </span>
              </a>
            </div>
          ))}
        </div>
      </header>

      <div className={`ls-scrim ${activePanel ? "is-active" : ""}`} onClick={() => setActivePanel(null)} aria-hidden />

      {/* Full-screen menu, after the Lightship takeover: great expandable rows on the left, cards and the secondary
          links on the right. */}
      <div className={`ls-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen} role="dialog" aria-modal="true" aria-label="Site navigation">
        <div className="ls-menu-inner">
          <div className="ls-menu-main">
            {(
              [
                { key: "about", label: "About", href: "/?about" },
                { key: "businesses", label: "Businesses", href: "/?businesses", items: BUSINESS_ITEMS },
                { key: "projects", label: "Projects", href: "/?projects", items: PROJECT_ITEMS },
                { key: "quality", label: "Quality & Lab", href: "/?quality" },
                { key: "more", label: "More", href: "/?contact", items: MORE_ITEMS },
              ] as { key: SectionKey; label: string; href: string; items?: Item[] }[]
            ).map((row, i) => {
              const isOpen = openSection === row.key;
              return (
                <div key={row.key} className={`ls-menu-row ${isOpen ? "is-open" : ""}`} style={{ "--i": i } as CSSProperties}>
                  {row.items ? (
                    <button
                      type="button"
                      className="ls-menu-row-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenSection(isOpen ? null : row.key)}
                    >
                      <span className="ls-menu-row-label">{row.label}</span>
                      <span className="ls-menu-row-toggle" aria-hidden />
                    </button>
                  ) : (
                    <a href={linkHref(row.href)} className="ls-menu-row-head" onClick={closeAll}>
                      <span className="ls-menu-row-label">{row.label}</span>
                      <span className="ls-menu-row-arrow" aria-hidden>→</span>
                    </a>
                  )}
                  {row.items ? (
                    <div className="ls-menu-row-panel">
                      <div className="ls-menu-row-panel-inner">
                        <ul className="ls-menu-sublinks">
                          {row.items.map((item) => (
                            <li key={item.label}>
                              <a href={linkHref(item.href)} onClick={closeAll}>
                                <span className="ls-menu-sublink-label">{item.label}</span>
                                {item.desc ? <span className="ls-menu-sublink-desc">{item.desc}</span> : null}
                              </a>
                            </li>
                          ))}
                        </ul>
                        <a href={linkHref(row.href)} className="ls-menu-row-all" onClick={closeAll}>
                          View all <span aria-hidden>→</span>
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <aside className="ls-menu-aside">
            <div className="ls-menu-cards">
              {MENU_CARDS.map((card) => (
                <a key={card.title} href={linkHref(card.href)} className="ls-menu-card" onClick={closeAll}>
                  <img src={card.image} alt="" loading="lazy" />
                  <span className="ls-menu-card-body">
                    <span className="ls-menu-card-title">{card.title}</span>
                    <span className="ls-menu-card-text">{card.text}</span>
                  </span>
                </a>
              ))}
            </div>

            <ul className="ls-menu-secondary">
              {SECONDARY.map((item) => (
                <li key={item.label}>
                  <a href={linkHref(item.href)} onClick={closeAll}>{item.label}</a>
                </li>
              ))}
            </ul>

            <div className="ls-menu-contact">
              <p className="ls-menu-contact-label">Direct batching hotlines</p>
              <div className="ls-menu-phones">
                {phones.slice(0, 2).map((p) => (
                  <a key={p} href={tel(p)}>{p}</a>
                ))}
              </div>
              <p className="ls-menu-address">
                Ang Village, Sangkat O’Char
                <br />
                Battambang City, Cambodia
              </p>
            </div>

            <div className="ls-menu-actions">
              <ArrowButton href={linkHref("/?quote")} label="Get a quote" onClick={closeAll} />
              <LangSwitch />
            </div>
          </aside>
        </div>

        <div className="ls-menu-foot">
          <span>Battambang Construction and Engineering, Co., Ltd.</span>
          <span>Building across Cambodia since 1995</span>
          <a href="/assets/BCE_Corporate_Profile_2026.pdf" onClick={closeAll}>Company profile (PDF)</a>
        </div>
      </div>
    </>
  );
}
