import { useEffect, useRef, useState } from "react";
import { getLang, setLang } from "./i18n";

/**
 * Official Apple Global Navigation System (https://www.apple.com/):
 * - Fixed 44px top bar with dark frosted glass (rgba(22, 22, 23, 0.8) + saturate(180%) blur(20px))
 * - Bottom border: 1px solid rgba(255, 255, 255, 0.08)
 * - Centered 1024px max-width container with distributed links
 * - Clean Apple typography (12px, font-weight 400, letter-spacing -0.01em)
 * - Signature Apple focus dimming: non-hovered items dim to opacity 0.45
 * - Full-width Mega-Menu dropdowns for "Businesses" and "Projects" with 3-column layout
 * - Full-page backdrop scrim that dims the page content when mega menu is open
 * - Mobile (< 834px): 44px bar with 2-line morphing hamburger to 'X', full-screen frosted glass overlay,
 *   cascading staggered link animations, expandable accordions, and quick action hotlines
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

function AppleLogo({ href = "/" }: { href?: string }) {
  return (
    <a
      href={href}
      className="apple-logo select-none"
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

function LangSwitch() {
  const lang = getLang();
  return (
    <div className="apple-lang-switch select-none" data-no-translate>
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
  const [activeMega, setActiveMega] = useState<"businesses" | "projects" | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<"businesses" | "projects" | null>(null);
  const [isIn, setIsIn] = useState(() => globalRevealed || !document.documentElement.classList.contains("is-loading"));
  const headerRef = useRef<HTMLElement>(null);
  const closeTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleReveal = () => setIsIn(true);
    revealListeners.add(handleReveal);
    return () => {
      revealListeners.delete(handleReveal);
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
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
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

  const handleMouseEnterItem = (name: "businesses" | "projects" | null) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setActiveMega(name);
  };

  const handleMouseLeaveNav = () => {
    closeTimeout.current = window.setTimeout(() => {
      setActiveMega(null);
    }, 200);
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
      <header
        ref={headerRef}
        data-nav
        className={`apple-header ${isIn ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"} ${
          activeMega ? "has-mega-open" : ""
        } ${isMobileOpen ? "is-menu-open" : ""}`}
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="apple-nav-container">
          {/* Logo on Left */}
          <AppleLogo href={base || "/"} />

          {/* Desktop Navigation Links (Evenly distributed Apple style) */}
          <nav className="apple-desktop-bar" aria-label="Global">
            <ul className={`apple-nav-list ${activeMega ? "has-focus" : ""}`}>
              {/* About */}
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

              {/* Businesses (with Mega Menu) */}
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

              {/* Projects (with Mega Menu) */}
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

              {/* Quality & Lab */}
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

              {/* Contact */}
              <li
                className="apple-nav-item"
                onMouseEnter={() => handleMouseEnterItem(null)}
              >
                <a
                  href={linkHref("#contact")}
                  className="apple-nav-link"
                  onClick={closeAll}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Right Action Utilities (Desktop) */}
          <div className="apple-desktop-bar apple-nav-actions">
            <LangSwitch />
            <a
              href={linkHref("/?quote")}
              className="apple-btn-quote"
              onClick={closeAll}
            >
              Get a quote
            </a>
          </div>

          {/* Mobile Right Controls (< 834px) */}
          <div className="apple-mobile-bar">
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

        {/* ==========================================================================
            Apple Mega-Menu Dropdowns (Desktop)
           ========================================================================== */}
        <div
          className={`apple-mega-menu ${activeMega ? "is-open" : ""}`}
          onMouseEnter={() => {
            if (closeTimeout.current) clearTimeout(closeTimeout.current);
          }}
          onMouseLeave={handleMouseLeaveNav}
        >
          {/* Businesses Mega Menu Panel */}
          {activeMega === "businesses" && (
            <div className="apple-mega-inner animate-in fade-in duration-200">
              <div className="apple-mega-grid">
                {/* Column 1: Explore Businesses */}
                <div className="apple-mega-col">
                  <h3>Explore Businesses</h3>
                  <a href={linkHref("/?businesses#ready-mix-concrete")} onClick={closeAll} className="apple-mega-big-link">
                    Ready-Mix Concrete
                  </a>
                  <a href={linkHref("/?businesses#piling")} onClick={closeAll} className="apple-mega-big-link">
                    Foundation Piling
                  </a>
                  <a href={linkHref("/?businesses#construction")} onClick={closeAll} className="apple-mega-big-link">
                    Civil Construction
                  </a>
                  <a href={linkHref("/?businesses#concrete-slab-works")} onClick={closeAll} className="apple-mega-big-link">
                    Concrete Slab Works
                  </a>
                  <a href={linkHref("/?businesses#equipment-rental")} onClick={closeAll} className="apple-mega-big-link">
                    Heavy Equipment Rental
                  </a>
                </div>

                {/* Column 2: Fleet & Capabilities */}
                <div className="apple-mega-col">
                  <h3>Fleet & Capabilities</h3>
                  <a href={linkHref("/?businesses#batching-plants")} onClick={closeAll} className="apple-mega-sublink">
                    <span className="apple-mega-sublink-title">4 Batching Plants</span>
                    <span className="apple-mega-sublink-desc">480 m³/h combined production capacity</span>
                  </a>
                  <a href={linkHref("/?businesses#mixers")} onClick={closeAll} className="apple-mega-sublink">
                    <span className="apple-mega-sublink-title">41 Ready-Mix Mixers</span>
                    <span className="apple-mega-sublink-desc">Modern GPS-dispatched heavy transit fleet</span>
                  </a>
                  <a href={linkHref("/?businesses#pumps")} onClick={closeAll} className="apple-mega-sublink">
                    <span className="apple-mega-sublink-title">8 Boom & Line Pumps</span>
                    <span className="apple-mega-sublink-desc">Up to 47m vertical reach for high pours</span>
                  </a>
                  <a href={linkHref("/?businesses#piling-rigs")} onClick={closeAll} className="apple-mega-sublink">
                    <span className="apple-mega-sublink-title">7 Hydraulic Piling Rigs</span>
                    <span className="apple-mega-sublink-desc">Engineered for spun & square pile foundations</span>
                  </a>
                </div>

                {/* Column 3: Standards & Tools */}
                <div className="apple-mega-col">
                  <h3>Standards & Tools</h3>
                  <a href={linkHref("/?quote")} onClick={closeAll} className="apple-mega-card">
                    <div className="apple-mega-card-title">
                      <span>Concrete Volume Estimator</span>
                      <span className="text-[#2997ff]">›</span>
                    </div>
                    <div className="apple-mega-card-desc">
                      Calculate m³ volume, slab depth, and instant truckload dispatch for your site.
                    </div>
                  </a>

                  <div className="mt-4 flex flex-col gap-2">
                    <a href={linkHref("/?quality")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">DYE-2000 Quality Lab</span>
                      <span className="apple-mega-sublink-desc">Automated compression strength verification</span>
                    </a>
                    <a href="https://t.me/thendLP" target="_blank" rel="noopener noreferrer" className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">24/7 Site Dispatch Telegram</span>
                      <span className="apple-mega-sublink-desc">Direct line with our batching command (@thendLP)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Mega Menu Panel */}
          {activeMega === "projects" && (
            <div className="apple-mega-inner animate-in fade-in duration-200">
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

                {/* Column 2: Featured Contracts */}
                <div className="apple-mega-col">
                  <h3>Featured Contracts</h3>
                  <a href={linkHref("/?projects#borey-peng-huoth")} onClick={closeAll} className="apple-mega-sublink">
                    <span className="apple-mega-sublink-title">Borey Peng Huoth</span>
                    <span className="apple-mega-sublink-desc">Deep foundation piling & structural concrete</span>
                  </a>
                  <a href={linkHref("/?projects#aeon-mall")} onClick={closeAll} className="apple-mega-sublink">
                    <span className="apple-mega-sublink-title">Aeon Mall Sihanoukville</span>
                    <span className="apple-mega-sublink-desc">Heavy duty post-tensioned slab casting</span>
                  </a>
                  <a href={linkHref("/?projects#nr5")} onClick={closeAll} className="apple-mega-sublink">
                    <span className="apple-mega-sublink-title">National Road 5</span>
                    <span className="apple-mega-sublink-desc">Certified paving mix & high-volume pouring</span>
                  </a>
                  <a href={linkHref("/?projects#logistics-center")} onClick={closeAll} className="apple-mega-sublink">
                    <span className="apple-mega-sublink-title">Sihanoukville Logistics Hub</span>
                    <span className="apple-mega-sublink-desc">High-load industrial warehouse foundation</span>
                  </a>
                </div>

                {/* Column 3: Project Services */}
                <div className="apple-mega-col">
                  <h3>Project Services</h3>
                  <a href={linkHref("/?quote")} onClick={closeAll} className="apple-mega-card">
                    <div className="apple-mega-card-title">
                      <span>Request Site Inspection</span>
                      <span className="text-[#2997ff]">›</span>
                    </div>
                    <div className="apple-mega-card-desc">
                      Connect with our licensed structural engineers for on-site consultation and concrete testing.
                    </div>
                  </a>

                  <div className="mt-4 flex flex-col gap-2">
                    <a href={linkHref("#coverage")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">14 Provinces Coverage</span>
                      <span className="apple-mega-sublink-desc">Nationwide equipment mobilization</span>
                    </a>
                    <a href={linkHref("/?quality")} onClick={closeAll} className="apple-mega-sublink">
                      <span className="apple-mega-sublink-title">Quality Assurance Standards</span>
                      <span className="apple-mega-sublink-desc">ACI 211.1 and ASTM compliance</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

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
                <a href={linkHref("/?businesses#ready-mix-concrete")} onClick={closeAll} className="apple-mobile-sublink">
                  Ready-Mix Concrete
                  <span>›</span>
                </a>
                <a href={linkHref("/?businesses#piling")} onClick={closeAll} className="apple-mobile-sublink">
                  Foundation Piling
                  <span>›</span>
                </a>
                <a href={linkHref("/?businesses#construction")} onClick={closeAll} className="apple-mobile-sublink">
                  Civil Construction
                  <span>›</span>
                </a>
                <a href={linkHref("/?businesses#concrete-slab-works")} onClick={closeAll} className="apple-mobile-sublink">
                  Concrete Slab Works
                  <span>›</span>
                </a>
                <a href={linkHref("/?businesses#equipment-rental")} onClick={closeAll} className="apple-mobile-sublink">
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
                  All 30+ Projects
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
                  Foundation Piling Works
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

          {/* Contact */}
          <li className="apple-mobile-item">
            <a href={linkHref("#contact")} onClick={closeAll} className="apple-mobile-link">
              Contact
            </a>
          </li>
        </ul>

        {/* Mobile Action Footer */}
        <div className="apple-mobile-footer">
          <a
            href={linkHref("/?quote")}
            onClick={closeAll}
            className="apple-mobile-quote-btn"
          >
            Get a quote
          </a>

          <div className="flex flex-col gap-2 text-[12px] font-mono text-[#86868b] pt-2">
            <div className="flex justify-between items-center">
              <span>Hotline (Battambang HQ):</span>
              <a href={tel(phones[0])} className="text-[#f5f5f7] hover:underline">
                {phones[0]}
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span>Site Pouring Dispatch:</span>
              <a href={tel(phones[1])} className="text-[#f5f5f7] hover:underline">
                {phones[1]}
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span>Telegram Dispatch:</span>
              <a href="https://t.me/thendLP" target="_blank" rel="noopener noreferrer" className="text-[#2997ff] hover:underline">
                @thendLP
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
