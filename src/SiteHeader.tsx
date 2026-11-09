import { useEffect, useRef, useState } from "react";
import { getLang, setLang } from "./i18n";

/**
 * Authentic Sharplink-style navigation (https://www.sharplink.com/):
 * - Fixed full-width header (pointer-events-none)
 * - Left: Floating brand logo (height: 34px, 3-layer isometric mark + "BCE., Ltd.")
 *   Always pure white as specified.
 * - Right: Desktop menu with individual floating buttons separated by exact 2px gaps:
 *   - Each button has height: 34px, rounded-[2px], rolling text twins on hover
 *   - Slower, organic, luxurious ease-in and ease-out transitions
 *   - Links: ABOUT, BUSINESSES ⌵, PROJECTS ⌵, QUALITY & LAB, COVERAGE, CONTACT
 *   - Language switch button (EN | ខ្មែរ)
 *   - Quotation primary button (Sharplink action button with text pill + attached arrow box)
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
        className={`transition-colors cursor-pointer ${lang === "en" ? "font-bold text-white" : "text-white/40 hover:text-white"}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <span className="text-white/30">|</span>
      <button
        type="button"
        className={`transition-colors cursor-pointer font-khmer ${lang === "km" ? "font-bold text-white" : "text-white/40 hover:text-white"}`}
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
              className={`size-2 stroke-current fill-none stroke-[1.5] transition-transform duration-300 ${
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
              className={`size-2 stroke-current fill-none stroke-[1.5] transition-transform duration-300 ${
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

/**
 * Sharplink-style compound action button:
 * - Text pill with rolling twin label
 * - Attached square arrow box with matching rolling twin arrow
 * - Same borderless dark translucent glass background
 * - Slower, organic, smooth easing in and out
 */
export function SharplinkButton({
  href,
  label,
  className = "",
  onClick,
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`sl-btn-compound group ${className}`}
    >
      <span className="sl-btn sl-btn-text">
        <span className="sl-btn-roll">
          <span>{label}</span>
          <span aria-hidden>{label}</span>
        </span>
      </span>
      <span className="sl-btn sl-btn-icon" aria-hidden>
        <span className="sl-btn-roll">
          <svg viewBox="0 0 16 16" className="size-3.5 stroke-current fill-none stroke-[1.8]" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
          <svg viewBox="0 0 16 16" className="size-3.5 stroke-current fill-none stroke-[1.8]" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
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
    }, 180);
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
      className={`sl-header ${
        isIn ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      <div className="sl-navbar">
        {/* Left: Floating Brand Logo - Always pure white with subtle shadow */}
        <a
          href={base || "/"}
          className="sl-logo group select-none text-white"
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
          <span className="text-[1.15rem] md:text-[1.25rem] font-bold tracking-tight font-sans text-white">
            BCE., Ltd.
          </span>
        </a>

        {/* Right: Desktop Sharplink Navigation Menu (Exact 2px gap between buttons) */}
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
              <div className="absolute top-[calc(100%+4px)] left-0 min-w-[220px] z-50">
                <div className="p-1.5 rounded-[3px] shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col gap-0.5 bg-[#161a20]/98 backdrop-blur-2xl border border-white/10 text-white">
                  {EXPERTISES_SUB.map(([title, href]) => (
                    <a
                      key={title}
                      href={linkHref(href)}
                      onClick={closeAll}
                      className="px-3 py-2 text-[11.5px] font-mono tracking-normal rounded-[2px] text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 flex items-center justify-between"
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
              <div className="absolute top-[calc(100%+4px)] left-0 min-w-[220px] z-50">
                <div className="p-1.5 rounded-[3px] shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col gap-0.5 bg-[#161a20]/98 backdrop-blur-2xl border border-white/10 text-white">
                  {PROJECTS_SUB.map(([title, href]) => (
                    <a
                      key={title}
                      href={linkHref(href)}
                      onClick={closeAll}
                      className="px-3 py-2 text-[11.5px] font-mono tracking-normal rounded-[2px] text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 flex items-center justify-between"
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

          {/* Language Switch Button (Exact same background) */}
          <div className="sl-btn !px-2.5">
            <LangSwitch />
          </div>

          {/* Authentic Sharplink Action Button ("Get a quote" with attached arrow box) */}
          <SharplinkButton
            href={linkHref("/?quote")}
            label="Get a quote"
            onClick={closeAll}
          />
        </nav>

        {/* Right: Mobile Navigation (< 1024px, 2px gap) */}
        <div className="lg:hidden flex items-center gap-[2px] pointer-events-auto">
          <div className="sl-btn !px-2.5">
            <LangSwitch />
          </div>
          <SharplinkButton
            href={linkHref("/?quote")}
            label="Quote"
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
