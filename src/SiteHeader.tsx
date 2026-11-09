import { useEffect, useRef, useState } from "react";
import ArrowButton from "./ArrowButton";
import { getLang, setLang } from "./i18n";

/**
 * Authentic Sharplink-style navigation (https://www.sharplink.com/):
 * - Fixed full-width header (pointer-events-none)
 * - Left: Floating brand logo (height: 34px, 3-layer isometric mark + "BCE., Ltd.")
 *   Dynamically adapts contrast (white on dark sections, black on light sections)
 * - Right: Desktop menu with individual floating buttons separated by exact 2px gaps:
 *   - Each button has height: 34px, rounded-[2px], rolling text twins on hover
 *   - Links: ABOUT, BUSINESSES ⌵, PROJECTS ⌵, QUALITY & LAB, COVERAGE, CONTACT
 *   - Language switch button (EN | ខ្មែរ)
 *   - Quotation primary button (BCE signature ArrowButton with rotating diamond arrow)
 * - Mobile: Compact 34px buttons (Language, Quote, Hamburger drawer toggle)
 */

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="fx-lang-icon shrink-0">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

function LangSwitch({ className = "" }: { className?: string }) {
  const lang = getLang();
  return (
    <div className={`inline-flex items-center gap-1.5 text-[11px] font-mono select-none ${className}`} data-no-translate>
      <GlobeIcon />
      <button
        type="button"
        className={`transition-colors cursor-pointer ${lang === "en" ? "font-bold text-current" : "opacity-40 hover:opacity-100"}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <span className="opacity-30">|</span>
      <button
        type="button"
        className={`transition-colors cursor-pointer font-khmer ${lang === "km" ? "font-bold text-current" : "opacity-40 hover:opacity-100"}`}
        aria-pressed={lang === "km"}
        onClick={() => setLang("km")}
      >
        ខ្មែរ
      </button>
    </div>
  );
}

const revealListeners = new Set<() => void>();
let globalRevealed = false;

export function revealHeader() {
  globalRevealed = true;
  revealListeners.forEach((fn) => fn());
}

const EXPERTISES_SUB = [
  ["Ready-Mix Concrete", "/?businesses#ready-mix-concrete"],
  ["Foundation Piling", "/?businesses#piling"],
  ["Civil Construction", "/?businesses#construction"],
  ["Concrete Slab Works", "/?businesses#concrete-slab-works"],
  ["Equipment Rental", "/?businesses#equipment-rental"],
];

const PROJECTS_SUB = [
  ["All Projects", "/?projects"],
  ["Industrial & Commercial", "/?projects#industrial"],
  ["Infrastructure & Roads", "/?projects#infrastructure"],
  ["Foundation Piling", "/?projects#piling"],
];

function NavButton({
  href,
  label,
  hasDropdown,
  isOpen,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  label: string;
  hasDropdown?: boolean;
  isOpen?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <a
      href={href}
      className="sl-btn"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="sl-btn-roll">
        <span className="flex items-center gap-1.5">
          <span>{label}</span>
          {hasDropdown && (
            <svg
              viewBox="0 0 10 6"
              className={`size-2 stroke-current fill-none stroke-[1.5] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden
            >
              <path d="M1 1l4 4 4-4" />
            </svg>
          )}
        </span>
        <span className="flex items-center gap-1.5" aria-hidden>
          <span>{label}</span>
          {hasDropdown && (
            <svg
              viewBox="0 0 10 6"
              className={`size-2 stroke-current fill-none stroke-[1.5] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden
            >
              <path d="M1 1l4 4 4-4" />
            </svg>
          )}
        </span>
      </span>
    </a>
  );
}

export default function SiteHeader({
  phones,
  tel,
  base = "",
}: {
  phones: string[];
  tel: (n: string) => string;
  base?: string;
}) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dark, setDark] = useState(true);
  const [isIn, setIsIn] = useState(() => globalRevealed || !document.documentElement.classList.contains("is-loading"));
  const headerRef = useRef<HTMLElement>(null);
  const dropdownTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleReveal = () => setIsIn(true);
    revealListeners.add(handleReveal);
    return () => {
      revealListeners.delete(handleReveal);
    };
  }, []);

  // Contrast detection: whether the section currently under the header is dark or light
  useEffect(() => {
    let ticking = false;
    const checkDark = () => {
      ticking = false;
      const mid = (headerRef.current?.getBoundingClientRect().top ?? 16) + 18;
      const isDark = [...document.querySelectorAll<HTMLElement>("[data-nav-dark]")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      setDark(isDark);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkDark);
      }
    };
    checkDark();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", checkDark);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", checkDark);
    };
  }, []);

  // Close menus on Escape or outside click
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenDropdown(null);
      }
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!headerRef.current?.contains(target)) {
        setOpen(false);
        setOpenDropdown(null);
      }
    };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
    };
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const closeAll = () => {
    setOpen(false);
    setOpenDropdown(null);
  };

  const linkHref = (path: string) => {
    if (path.startsWith("#")) return base ? `${base}${path}` : path;
    return path;
  };

  return (
    <header
      ref={headerRef}
      data-nav
      className={`sl-header ${dark ? "theme-dark" : "theme-light"} ${
        isIn ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      <div className="sl-navbar">
        {/* Left: Floating Brand Logo (Sharplink 3-layer mark + BCE., Ltd.) */}
        <a
          href={base || "/"}
          className="sl-logo group select-none"
          aria-label="BCE., Ltd. home"
          onClick={closeAll}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0 stroke-current fill-none stroke-[1.8] transition-transform duration-300 group-hover:scale-105"
            aria-hidden
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-[1.15rem] md:text-[1.25rem] font-bold tracking-tight font-sans">
            BCE., Ltd.
          </span>
        </a>

        {/* Right: Desktop Sharplink Navigation Menu (2px gap between buttons) */}
        <nav className="hidden lg:flex sl-menu" aria-label="Main navigation">
          <NavButton
            href={linkHref("/?about")}
            label="About"
          />

          {/* Businesses Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("businesses")}
            onMouseLeave={handleMouseLeave}
          >
            <NavButton
              href={linkHref("/?businesses")}
              label="Businesses"
              hasDropdown
              isOpen={openDropdown === "businesses"}
            />

            {openDropdown === "businesses" && (
              <div className="absolute top-[calc(100%+3px)] left-0 min-w-[220px] z-50">
                <div className={`p-1.5 rounded-[3px] shadow-2xl flex flex-col gap-0.5 ${
                  dark
                    ? "bg-[#181b20]/95 backdrop-blur-2xl border border-white/12 text-white"
                    : "bg-white/95 backdrop-blur-2xl border border-black/10 text-black shadow-lg"
                }`}>
                  {EXPERTISES_SUB.map(([title, href]) => (
                    <a
                      key={title}
                      href={linkHref(href)}
                      onClick={closeAll}
                      className={`px-3 py-2 text-[11.5px] font-mono tracking-normal rounded-[2px] transition-colors flex items-center justify-between ${
                        dark
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-black/80 hover:text-black hover:bg-black/5"
                      }`}
                    >
                      <span>{title}</span>
                      <span className="opacity-40 text-[10px]">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("projects")}
            onMouseLeave={handleMouseLeave}
          >
            <NavButton
              href={linkHref("/?projects")}
              label="Projects"
              hasDropdown
              isOpen={openDropdown === "projects"}
            />

            {openDropdown === "projects" && (
              <div className="absolute top-[calc(100%+3px)] left-0 min-w-[220px] z-50">
                <div className={`p-1.5 rounded-[3px] shadow-2xl flex flex-col gap-0.5 ${
                  dark
                    ? "bg-[#181b20]/95 backdrop-blur-2xl border border-white/12 text-white"
                    : "bg-white/95 backdrop-blur-2xl border border-black/10 text-black shadow-lg"
                }`}>
                  {PROJECTS_SUB.map(([title, href]) => (
                    <a
                      key={title}
                      href={linkHref(href)}
                      onClick={closeAll}
                      className={`px-3 py-2 text-[11.5px] font-mono tracking-normal rounded-[2px] transition-colors flex items-center justify-between ${
                        dark
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-black/80 hover:text-black hover:bg-black/5"
                      }`}
                    >
                      <span>{title}</span>
                      <span className="opacity-40 text-[10px]">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavButton
            href={linkHref("/?quality")}
            label="Quality & Lab"
          />

          <NavButton
            href={linkHref("#coverage")}
            label="Coverage"
          />

          <NavButton
            href={linkHref("#contact")}
            label="Contact"
          />

          {/* Language Switch Button */}
          <div className="sl-btn !px-2.5">
            <LangSwitch />
          </div>

          {/* Signature Primary ArrowButton ("Get a quote") */}
          <ArrowButton
            href={linkHref("/?quote")}
            label="Get a quote"
            theme={dark ? "white" : "black"}
            className="!h-[34px] !px-4 !py-0 !text-[12px] !rounded-[2px] !border-none shadow-sm"
            onClick={closeAll}
          />
        </nav>

        {/* Right: Mobile Navigation (< 1024px, 2px gap) */}
        <div className="lg:hidden flex items-center gap-[2px] pointer-events-auto">
          <div className="sl-btn !px-2.5">
            <LangSwitch />
          </div>
          <ArrowButton
            href={linkHref("/?quote")}
            label="Quote"
            theme={dark ? "white" : "black"}
            className="!h-[34px] !px-3 !py-0 !text-[11px] !rounded-[2px] !border-none"
            onClick={closeAll}
          />
          <button
            type="button"
            className="sl-btn !w-[34px] !px-0 justify-center"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg viewBox="0 0 14 14" className="size-3.5 stroke-current fill-none stroke-[1.8]" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            ) : (
              <svg viewBox="0 0 18 12" className="size-3.5 stroke-current fill-none stroke-[1.8]" aria-hidden>
                <path d="M0 1h18M0 6h18M0 11h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Drawer */}
      {open && (
        <div className="pointer-events-auto lg:hidden mt-2 p-5 rounded-[4px] bg-[#14171c]/98 backdrop-blur-2xl border border-white/12 shadow-[0_16px_50px_rgba(0,0,0,0.7)] flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-white/50">Menu Navigation</span>
            <LangSwitch className="text-white" />
          </div>

          <nav className="flex flex-col gap-2 font-mono text-[13px] uppercase tracking-[0.06em]">
            <a
              href={linkHref("/?about")}
              onClick={closeAll}
              className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              About BCE
            </a>
            <div className="flex flex-col gap-1 pl-3 border-l border-white/10 my-1">
              <span className="px-3 py-1 text-[11px] text-white/40 font-mono uppercase">Core Expertises</span>
              {EXPERTISES_SUB.map(([title, href]) => (
                <a
                  key={title}
                  href={linkHref(href)}
                  onClick={closeAll}
                  className="px-3 py-1.5 text-[12px] text-white/70 hover:text-white transition-colors"
                >
                  {title}
                </a>
              ))}
            </div>
            <a
              href={linkHref("/?projects")}
              onClick={closeAll}
              className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              Projects
            </a>
            <a
              href={linkHref("/?quality")}
              onClick={closeAll}
              className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              Quality & Lab
            </a>
            <a
              href={linkHref("#coverage")}
              onClick={closeAll}
              className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              Coverage
            </a>
            <a
              href={linkHref("#contact")}
              onClick={closeAll}
              className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 text-[12px] font-mono text-white/60">
            <div className="flex justify-between items-center">
              <span>Hotline (Battambang HQ):</span>
              <a href={tel(phones[0])} className="text-white hover:underline">{phones[0]}</a>
            </div>
            <div className="flex justify-between items-center">
              <span>Site Pouring Dispatch:</span>
              <a href={tel(phones[1])} className="text-white hover:underline">{phones[1]}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
