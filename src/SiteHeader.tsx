import { useEffect, useRef, useState } from "react";
import ArrowButton from "./ArrowButton";
import { getLang, setLang } from "./i18n";

/**
 * Official Apple Global Navigation System (https://www.apple.com/):
 * - Fixed 44px top bar with light frosted glass (rgba(245, 245, 247, 0.8) + saturate(180%) blur(44px))
 * - Perfectly centered navigation items in middle of container
 * - Unboxed BCE primary button for "Get a quote"
 * - Auto-hides on scroll, replaced by floating secondary capsule navigation containing the full primary nav
 * - Mega-menu dropdowns for Businesses and Projects
 * - Full bilingual support (EN / KH)
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

function AppleLogo({ href = "/", dark = false }: { href?: string; dark?: boolean }) {
  return (
    <a
      href={href}
      className={`apple-logo select-none ${dark ? "is-dark" : ""}`}
      aria-label="BCE., Ltd. home"
    >
      <svg
        viewBox="0 0 24 24"
        className="apple-logo-icon stroke-current fill-none stroke-[1.8] transition-transform duration-300"
        aria-hidden
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <span className="apple-logo-text">BCE</span>
    </a>
  );
}

function LangSwitch({ dark = false }: { dark?: boolean }) {
  const lang = getLang();
  return (
    <div className={`apple-lang-switch select-none ${dark ? "is-dark" : ""}`} data-no-translate>
      <button
        type="button"
        className={`apple-lang-btn ${lang === "en" ? "is-current" : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <span className="apple-lang-divider">/</span>
      <button
        type="button"
        className={`apple-lang-btn font-khmer ${lang === "km" ? "is-current" : ""}`}
        aria-pressed={lang === "km"}
        onClick={() => setLang("km")}
      >
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<"businesses" | "projects" | "more" | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<"businesses" | "projects" | "more" | null>(null);
  const [showSubnav, setShowSubnav] = useState(false);
  const [isIn, setIsIn] = useState(() => globalRevealed || !document.documentElement.classList.contains("is-loading"));
  const [panelHeights, setPanelHeights] = useState<{ businesses: number; projects: number; more: number }>({
    businesses: 280,
    projects: 240,
    more: 240,
  });
  const headerRef = useRef<HTMLElement>(null);
  const closeTimeout = useRef<number | null>(null);
  const businessesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      setPanelHeights({
        businesses: businessesRef.current?.offsetHeight || 280,
        projects: projectsRef.current?.offsetHeight || 240,
        more: moreRef.current?.offsetHeight || 240,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const handleReveal = () => setIsIn(true);
    revealListeners.add(handleReveal);
    return () => {
      revealListeners.delete(handleReveal);
    };
  }, []);

  // Listen to window scroll: hide primary header and reveal floating capsule navigation
  useEffect(() => {
    const handleScroll = () => {
      setShowSubnav(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Handle ESC and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMega(null);
        setIsMobileOpen(false);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".apple-header") &&
        !target.closest(".apple-floating-nav")
      ) {
        setActiveMega(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const handleMouseEnterItem = (name: "businesses" | "projects" | "more" | null) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setActiveMega(name);
  };

  const handleMouseLeaveNav = () => {
    closeTimeout.current = window.setTimeout(() => {
      setActiveMega(null);
    }, 220);
  };

  const closeAll = () => {
    setActiveMega(null);
    setIsMobileOpen(false);
  };

  const linkHref = (path: string) => {
    if (path.startsWith("#")) return base ? `${base}${path}` : path;
    return path;
  };

  return (
    <>
      {/* ==========================================================================
          Primary Apple Global Header (Top of page, hides when scrolling down)
         ========================================================================== */}
      <header
        ref={headerRef}
        data-nav
        className={`apple-header ${isIn ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"} ${
          showSubnav ? "is-scrolled-out" : ""
        } ${activeMega ? "has-mega-open" : ""} ${isMobileOpen ? "is-menu-open" : ""}`}
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="apple-nav-content">
          {/* Desktop Navigation List: ALL content in ONE single list, exactly like apple.com */}
          <ul className={`apple-nav-list ${activeMega ? "has-focus" : ""}`}>
            {/* 1. BCE Logo */}
            <li className="apple-nav-item apple-nav-item-logo">
              <AppleLogo href={base || "/"} />
            </li>

            {/* 2. About */}
            <li
              className="apple-nav-item"
              onMouseEnter={() => handleMouseEnterItem(null)}
            >
              <a
                href={linkHref("/?about")}
                className="apple-nav-link"
                onClick={closeAll}
              >
                About
              </a>
            </li>

            {/* 3. Businesses (with Mega Menu) */}
            <li
              className={`apple-nav-item ${activeMega === "businesses" ? "is-active" : ""}`}
              onMouseEnter={() => handleMouseEnterItem("businesses")}
            >
              <a
                href={linkHref("/?businesses")}
                className="apple-nav-link"
                onClick={closeAll}
              >
                Businesses
              </a>
            </li>

            {/* 4. Projects (with Mega Menu) */}
            <li
              className={`apple-nav-item ${activeMega === "projects" ? "is-active" : ""}`}
              onMouseEnter={() => handleMouseEnterItem("projects")}
            >
              <a
                href={linkHref("/?projects")}
                className="apple-nav-link"
                onClick={closeAll}
              >
                Projects
              </a>
            </li>

            {/* 5. Quality & Lab */}
            <li
              className="apple-nav-item"
              onMouseEnter={() => handleMouseEnterItem(null)}
            >
              <a
                href={linkHref("/?quality")}
                className="apple-nav-link"
                onClick={closeAll}
              >
                Quality & Lab
              </a>
            </li>

            {/* 6. More (with Mega Menu) */}
            <li
              className={`apple-nav-item ${activeMega === "more" ? "is-active" : ""}`}
              onMouseEnter={() => handleMouseEnterItem("more")}
            >
              <button
                type="button"
                className="apple-nav-link flex items-center gap-1 cursor-pointer bg-transparent border-0 font-inherit"
                onClick={() => setActiveMega(activeMega === "more" ? null : "more")}
              >
                <span>More</span>
                <svg
                  viewBox="0 0 10 6"
                  className={`size-2 stroke-current fill-none stroke-[1.8] transition-transform duration-200 ${
                    activeMega === "more" ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>
            </li>

            {/* 7. Language Switch */}
            <li className="apple-nav-item apple-nav-item-lang">
              <LangSwitch />
            </li>

            {/* 8. Get a quote (Unboxed Primary Button) */}
            <li className="apple-nav-item apple-nav-item-quote">
              <ArrowButton
                href={linkHref("/?quote")}
                label="Get a quote"
                theme="raw"
                className="text-[#1d1d1f] hover:text-black"
                onClick={closeAll}
              />
            </li>
          </ul>

          {/* Mobile Right Controls (< 834px) */}
          <div className="apple-mobile-bar">
            <AppleLogo href={base || "/"} />
            <div className="flex items-center gap-3">
              <LangSwitch />
              <button
                type="button"
                className={`apple-hamburger ${isMobileOpen ? "is-active" : ""}`}
                aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={isMobileOpen}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                <span className="apple-hamburger-line apple-hamburger-top" />
                <span className="apple-hamburger-line apple-hamburger-bottom" />
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================================================
            Apple Mega-Menu Dropdowns (Desktop - Top Header)
            Exact Apple.com Curtain Expand, Dynamic Height & Crossfade Mechanics
           ========================================================================== */}
        <div
          className={`apple-mega-menu ${activeMega && !showSubnav ? "is-open" : ""}`}
          style={{
            height: !showSubnav && activeMega ? panelHeights[activeMega] : 0,
          }}
          onMouseEnter={() => {
            if (closeTimeout.current) clearTimeout(closeTimeout.current);
          }}
          onMouseLeave={handleMouseLeaveNav}
        >
          <div className="apple-mega-wrapper">
            {/* Businesses Mega Menu Panel */}
            <div
              ref={businessesRef}
              className={`apple-mega-panel ${activeMega === "businesses" ? "is-active" : ""}`}
            >
              <div className="apple-mega-inner">
                <div className="apple-mega-grid">
                  {/* Column 1: Explore Businesses */}
                  <div className="apple-mega-col">
                    <h3>Explore Businesses</h3>
                    <a href={linkHref("/?businesses")} onClick={closeAll} className="apple-mega-big-link">
                      Explore all core businesses
                    </a>
                    <a href={linkHref("/?business=ready-mix-concrete")} onClick={closeAll} className="apple-mega-big-link">
                      Ready-Mix Concrete
                    </a>
                    <a href={linkHref("/?business=piling")} onClick={closeAll} className="apple-mega-big-link">
                      Foundation Piling
                    </a>
                    <a href={linkHref("/?business=construction")} onClick={closeAll} className="apple-mega-big-link">
                      Civil Construction
                    </a>
                    <a href={linkHref("/?business=concrete-slab-works")} onClick={closeAll} className="apple-mega-big-link">
                      Concrete Slab Works
                    </a>
                    <a href={linkHref("/?business=equipment-rental")} onClick={closeAll} className="apple-mega-big-link">
                      Heavy Equipment Rental
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Mega Menu Panel */}
            <div
              ref={projectsRef}
              className={`apple-mega-panel ${activeMega === "projects" ? "is-active" : ""}`}
            >
              <div className="apple-mega-inner">
                <div className="apple-mega-grid">
                  {/* Column 1: Explore Projects */}
                  <div className="apple-mega-col">
                    <h3>Explore Projects</h3>
                    <a href={linkHref("/?projects")} onClick={closeAll} className="apple-mega-big-link">
                      All 30+ Landmark Projects
                    </a>
                    <a href={linkHref("/?projects#industrial")} onClick={closeAll} className="apple-mega-big-link">
                      Industrial & Commercial
                    </a>
                    <a href={linkHref("/?projects#infrastructure")} onClick={closeAll} className="apple-mega-big-link">
                      Infrastructure & Roads
                    </a>
                    <a href={linkHref("/?projects#piling")} onClick={closeAll} className="apple-mega-big-link">
                      Foundation Piling Works
                    </a>
                  </div>

                  {/* Column 2: Landmark Sectors */}
                  <div className="apple-mega-col">
                    <h3>Landmark Sectors</h3>
                    <a href={linkHref("/?projects#industrial")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">Industrial & Commercial</span>
                      <span className="apple-mega-sublink-desc">Garment factories, warehouses & logistics depots</span>
                    </a>
                    <a href={linkHref("/?projects#infrastructure")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">Infrastructure & Roads</span>
                      <span className="apple-mega-sublink-desc">National roads, bridges, culverts & irrigation</span>
                    </a>
                    <a href={linkHref("/?projects#piling")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">Foundation Piling Works</span>
                      <span className="apple-mega-sublink-desc">Hydraulic static pressing & driven RC piles</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* More Mega Menu Panel */}
            <div
              ref={moreRef}
              className={`apple-mega-panel ${activeMega === "more" ? "is-active" : ""}`}
            >
              <div className="apple-mega-inner">
                <div className="apple-mega-grid">
                  {/* Column 1: Explore Pages */}
                  <div className="apple-mega-col">
                    <h3>Explore</h3>
                    <a href={linkHref("/?contact")} onClick={closeAll} className="apple-mega-big-link">
                      Contact
                    </a>
                    <a href={linkHref("/?resources")} onClick={closeAll} className="apple-mega-big-link">
                      Resources
                    </a>
                    <a href={linkHref("/?recruitment")} onClick={closeAll} className="apple-mega-big-link">
                      Recruitment
                    </a>
                    <a href={linkHref("/?blog")} onClick={closeAll} className="apple-mega-big-link">
                      Blog
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================================================
          Secondary Floating Capsule Navigation on Scroll (Apple iPhone style)
          Contains full primary navigation content: Logo, Centered Links, LangSwitch, unboxed quote CTA
         ========================================================================== */}
      <div
        className={`apple-floating-nav ${
          showSubnav && !isMobileOpen ? "is-visible" : ""
        }`}
        aria-label="Floating global navigation"
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="apple-floating-inner">
          {/* Unified Navigation List centered inside floating capsule */}
          <ul className={`apple-floating-list ${activeMega ? "has-focus" : ""}`}>
            <li className="apple-floating-item apple-floating-item-logo">
              <AppleLogo href={base || "/"} />
            </li>
            <li className="apple-floating-item" onMouseEnter={() => handleMouseEnterItem(null)}>
              <a href={linkHref("/?about")} className="apple-floating-link" onClick={closeAll}>
                About
              </a>
            </li>
            <li
              className={`apple-floating-item ${activeMega === "businesses" ? "is-active" : ""}`}
              onMouseEnter={() => handleMouseEnterItem("businesses")}
            >
              <a href={linkHref("/?businesses")} className="apple-floating-link" onClick={closeAll}>
                Businesses
              </a>
            </li>
            <li
              className={`apple-floating-item ${activeMega === "projects" ? "is-active" : ""}`}
              onMouseEnter={() => handleMouseEnterItem("projects")}
            >
              <a href={linkHref("/?projects")} className="apple-floating-link" onClick={closeAll}>
                Projects
              </a>
            </li>
            <li className="apple-floating-item" onMouseEnter={() => handleMouseEnterItem(null)}>
              <a href={linkHref("/?quality")} className="apple-floating-link" onClick={closeAll}>
                Quality & Lab
              </a>
            </li>
            <li
              className={`apple-floating-item ${activeMega === "more" ? "is-active" : ""}`}
              onMouseEnter={() => handleMouseEnterItem("more")}
            >
              <button
                type="button"
                className="apple-floating-link flex items-center gap-1 cursor-pointer bg-transparent border-0 font-inherit"
                onClick={() => setActiveMega(activeMega === "more" ? null : "more")}
              >
                <span>More</span>
                <svg
                  viewBox="0 0 10 6"
                  className={`size-2 stroke-current fill-none stroke-[1.8] transition-transform duration-200 ${
                    activeMega === "more" ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>
            </li>
            <li className="apple-floating-item apple-floating-item-lang">
              <LangSwitch />
            </li>
            <li className="apple-floating-item apple-floating-item-quote">
              <ArrowButton
                href={linkHref("/?quote")}
                label="Get a quote"
                theme="raw"
                className="text-[#1d1d1f] hover:text-black"
                onClick={closeAll}
              />
            </li>
          </ul>

          {/* Mobile Right Controls (< 834px) */}
          <div className="apple-floating-mobile-bar">
            <AppleLogo href={base || "/"} />
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="apple-floating-mobile-quote">
                <ArrowButton
                  href={linkHref("/?quote")}
                  label="Get a quote"
                  theme="raw"
                  className="text-[#1d1d1f] hover:text-black"
                  onClick={closeAll}
                />
              </div>
              <LangSwitch />
              <button
                type="button"
                className={`apple-hamburger ${isMobileOpen ? "is-active" : ""}`}
                aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={isMobileOpen}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                <span className="apple-hamburger-line apple-hamburger-top" />
                <span className="apple-hamburger-line apple-hamburger-bottom" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Mega-Menu Dropdown */}
        {activeMega && showSubnav && (
          <div
            className="apple-floating-dropdown"
            onMouseEnter={() => {
              if (closeTimeout.current) clearTimeout(closeTimeout.current);
            }}
            onMouseLeave={handleMouseLeaveNav}
          >
            <div className="apple-mega-wrapper">
              {/* Businesses Mega Menu Panel */}
              <div className={`apple-mega-panel ${activeMega === "businesses" ? "is-active" : ""}`}>
                <div className="apple-mega-grid">
                  {/* Column 1: Explore Businesses */}
                  <div className="apple-mega-col">
                    <h3>Explore Businesses</h3>
                    <a href={linkHref("/?businesses")} onClick={closeAll} className="apple-mega-big-link">
                      Explore all core businesses
                    </a>
                    <a href={linkHref("/?business=ready-mix-concrete")} onClick={closeAll} className="apple-mega-big-link">
                      Ready-Mix Concrete
                    </a>
                    <a href={linkHref("/?business=piling")} onClick={closeAll} className="apple-mega-big-link">
                      Foundation Piling
                    </a>
                    <a href={linkHref("/?business=construction")} onClick={closeAll} className="apple-mega-big-link">
                      Civil Construction
                    </a>
                    <a href={linkHref("/?business=concrete-slab-works")} onClick={closeAll} className="apple-mega-big-link">
                      Concrete Slab Works
                    </a>
                    <a href={linkHref("/?business=equipment-rental")} onClick={closeAll} className="apple-mega-big-link">
                      Heavy Equipment Rental
                    </a>
                  </div>
                </div>
              </div>

              {/* Projects Mega Menu Panel */}
              <div className={`apple-mega-panel ${activeMega === "projects" ? "is-active" : ""}`}>
                <div className="apple-mega-grid">
                  {/* Column 1: Explore Projects */}
                  <div className="apple-mega-col">
                    <h3>Explore Projects</h3>
                    <a href={linkHref("/?projects")} onClick={closeAll} className="apple-mega-big-link">
                      All 30+ Landmark Projects
                    </a>
                    <a href={linkHref("/?projects#industrial")} onClick={closeAll} className="apple-mega-big-link">
                      Industrial & Commercial
                    </a>
                    <a href={linkHref("/?projects#infrastructure")} onClick={closeAll} className="apple-mega-big-link">
                      Infrastructure & Roads
                    </a>
                    <a href={linkHref("/?projects#piling")} onClick={closeAll} className="apple-mega-big-link">
                      Foundation Piling Works
                    </a>
                  </div>

                  {/* Column 2: Landmark Sectors */}
                  <div className="apple-mega-col">
                    <h3>Landmark Sectors</h3>
                    <a href={linkHref("/?projects#industrial")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">Industrial & Commercial</span>
                      <span className="apple-mega-sublink-desc">Garment factories, warehouses & logistics depots</span>
                    </a>
                    <a href={linkHref("/?projects#infrastructure")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">Infrastructure & Roads</span>
                      <span className="apple-mega-sublink-desc">National roads, bridges, culverts & irrigation</span>
                    </a>
                    <a href={linkHref("/?projects#piling")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">Foundation Piling Works</span>
                      <span className="apple-mega-sublink-desc">Hydraulic static pressing & driven RC piles</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* More Mega Menu Panel */}
            <div className={`apple-mega-panel ${activeMega === "more" ? "is-active" : ""}`}>
              <div className="apple-mega-grid">
                {/* Column 1: Explore Pages */}
                <div className="apple-mega-col">
                  <h3>Explore</h3>
                  <a href={linkHref("/?contact")} onClick={closeAll} className="apple-mega-big-link">
                    Contact
                  </a>
                  <a href={linkHref("/?resources")} onClick={closeAll} className="apple-mega-big-link">
                    Resources
                  </a>
                  <a href={linkHref("/?recruitment")} onClick={closeAll} className="apple-mega-big-link">
                    Recruitment
                  </a>
                  <a href={linkHref("/?blog")} onClick={closeAll} className="apple-mega-big-link">
                    Blog
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-Page Backdrop Scrim (Dims page when mega menu is open) */}
      <div
        className={`apple-scrim ${activeMega ? "is-active" : ""}`}
        onClick={() => setActiveMega(null)}
        aria-hidden
      />

      {/* ==========================================================================
          Apple Mobile Fullscreen Menu Overlay (< 834px)
         ========================================================================== */}
      <nav
        className={`apple-mobile-overlay ${isMobileOpen ? "is-open" : ""}`}
        aria-hidden={!isMobileOpen}
      >
        <ul className="apple-mobile-list">
          {/* About */}
          <li className="apple-mobile-item">
            <a href={linkHref("/?about")} onClick={closeAll} className="apple-mobile-link">
              About
            </a>
          </li>

          {/* Businesses (Accordion) */}
          <li className="apple-mobile-item">
            <button
              type="button"
              className="apple-mobile-link w-full text-left"
              onClick={() =>
                setMobileAccordion(mobileAccordion === "businesses" ? null : "businesses")
              }
            >
              <span>Businesses</span>
              <svg
                viewBox="0 0 10 6"
                className={`size-3 stroke-current fill-none stroke-[1.8] transition-transform duration-300 ${
                  mobileAccordion === "businesses" ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>
            {mobileAccordion === "businesses" && (
              <div className="apple-mobile-accordion animate-in fade-in slide-in-from-top-1 duration-200">
                <a href={linkHref("/?businesses")} onClick={closeAll} className="apple-mobile-sublink">
                  Explore all core businesses
                  <span>›</span>
                </a>
                <a href={linkHref("/?business=ready-mix-concrete")} onClick={closeAll} className="apple-mobile-sublink">
                  Ready-Mix Concrete
                  <span>›</span>
                </a>
                <a href={linkHref("/?business=piling")} onClick={closeAll} className="apple-mobile-sublink">
                  Foundation Piling
                  <span>›</span>
                </a>
                <a href={linkHref("/?business=construction")} onClick={closeAll} className="apple-mobile-sublink">
                  Civil Construction
                  <span>›</span>
                </a>
                <a href={linkHref("/?business=concrete-slab-works")} onClick={closeAll} className="apple-mobile-sublink">
                  Concrete Slab Works
                  <span>›</span>
                </a>
                <a href={linkHref("/?business=equipment-rental")} onClick={closeAll} className="apple-mobile-sublink">
                  Heavy Equipment Rental
                  <span>›</span>
                </a>
              </div>
            )}
          </li>

          {/* Projects (Accordion) */}
          <li className="apple-mobile-item">
            <button
              type="button"
              className="apple-mobile-link w-full text-left"
              onClick={() =>
                setMobileAccordion(mobileAccordion === "projects" ? null : "projects")
              }
            >
              <span>Projects</span>
              <svg
                viewBox="0 0 10 6"
                className={`size-3 stroke-current fill-none stroke-[1.8] transition-transform duration-300 ${
                  mobileAccordion === "projects" ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>
            {mobileAccordion === "projects" && (
              <div className="apple-mobile-accordion animate-in fade-in slide-in-from-top-1 duration-200">
                <a href={linkHref("/?projects")} onClick={closeAll} className="apple-mobile-sublink">
                  All 30+ Landmark Projects
                  <span>›</span>
                </a>
                <a href={linkHref("/?projects#industrial")} onClick={closeAll} className="apple-mobile-sublink">
                  Industrial & Commercial
                  <span>›</span>
                </a>
                <a href={linkHref("/?projects#infrastructure")} onClick={closeAll} className="apple-mobile-sublink">
                  Infrastructure & Roads
                  <span>›</span>
                </a>
                <a href={linkHref("/?projects#piling")} onClick={closeAll} className="apple-mobile-sublink">
                  Foundation Piling
                  <span>›</span>
                </a>
              </div>
            )}
          </li>

          {/* Quality & Lab */}
          <li className="apple-mobile-item">
            <a href={linkHref("/?quality")} onClick={closeAll} className="apple-mobile-link">
              Quality & Lab
            </a>
          </li>

          {/* More (Accordion: Contact, Resources, Recruitment) */}
          <li className="apple-mobile-item">
            <button
              type="button"
              className="apple-mobile-link w-full text-left"
              onClick={() =>
                setMobileAccordion(mobileAccordion === "more" ? null : "more")
              }
            >
              <span>More</span>
              <svg
                viewBox="0 0 10 6"
                className={`size-3 stroke-current fill-none stroke-[1.8] transition-transform duration-300 ${
                  mobileAccordion === "more" ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>
            {mobileAccordion === "more" && (
              <div className="apple-mobile-accordion animate-in fade-in slide-in-from-top-1 duration-200">
                <a href={linkHref("/?contact")} onClick={closeAll} className="apple-mobile-sublink">
                  Contact
                  <span>›</span>
                </a>
                <a href={linkHref("/?resources")} onClick={closeAll} className="apple-mobile-sublink">
                  Resources
                  <span>›</span>
                </a>
                <a href={linkHref("/?recruitment")} onClick={closeAll} className="apple-mobile-sublink">
                  Recruitment
                  <span>›</span>
                </a>
                <a href={linkHref("/?blog")} onClick={closeAll} className="apple-mobile-sublink">
                  Blog
                  <span>›</span>
                </a>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Quick Actions Footer */}
        <div className="apple-mobile-footer">
          <ArrowButton
            href={linkHref("/?quote")}
            label="Get a quote"
            theme="raw"
            className="text-[#1d1d1f] hover:text-black"
            onClick={closeAll}
          />
          <div className="apple-mobile-hotlines">
            <span className="text-[11px] font-mono uppercase tracking-wider text-black/40">
              Direct Batching Hotlines
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {phones.slice(0, 2).map((p) => (
                <a
                  key={p}
                  href={tel(p)}
                  className="text-xs font-mono text-black/70 hover:text-black transition-colors"
                >
                  {p}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
