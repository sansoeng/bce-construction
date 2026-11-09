import { useEffect, useRef, useState } from "react";
import ArrowButton from "./ArrowButton";
import { getLang, setLang } from "./i18n";

/**
 * Sharplink-inspired top navigation bar (https://www.sharplink.com/):
 * - Left: Floating brand logo with isometric 3-layer icon + "BCE., Ltd."
 *   Automatically contrasts white over dark sections and black over light sections.
 * - Right: Segmented dark translucent pill bar containing:
 *   - Navigation links (About, Businesses ⌵, Projects ⌵, Quality & Lab, Coverage, Contact)
 *   - Bilingual language switch (EN | ខ្មែរ)
 *   - Signature primary ArrowButton ("Get a quote")
 * - Mobile: Compact floating pill with language switch, Quote button, and hamburger drawer.
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
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10 text-[11px] font-mono text-white/80 select-none ${className}`} data-no-translate>
      <GlobeIcon />
      <button
        type="button"
        className={`transition-colors cursor-pointer ${lang === "en" ? "text-white font-bold" : "text-white/40 hover:text-white"}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <span className="text-white/20">|</span>
      <button
        type="button"
        className={`transition-colors cursor-pointer font-khmer ${lang === "km" ? "text-white font-bold" : "text-white/40 hover:text-white"}`}
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
      const mid = (headerRef.current?.getBoundingClientRect().top ?? 20) + 20;
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
      className={`fixed top-3 sm:top-4 md:top-5 inset-x-3 sm:inset-x-5 md:inset-x-8 max-w-7xl mx-auto z-50 pointer-events-none transition-all duration-700 ease-out ${
        isIn ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Left: Brand Logo with 3-layer isometric mark (inspired by Sharplink) */}
        <a
          href={base || "/"}
          className={`pointer-events-auto flex items-center gap-2.5 transition-colors duration-300 group select-none py-1.5 ${
            dark ? "text-white" : "text-[#111]"
          }`}
          aria-label="BCE., Ltd. home"
          onClick={closeAll}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0 stroke-current fill-none stroke-[1.8] transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
            aria-hidden
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-[1.2rem] md:text-[1.3rem] font-bold tracking-tight font-sans drop-shadow-sm">
            BCE., Ltd.
          </span>
        </a>

        {/* Right: Desktop Segmented Dark Nav Bar (Sharplink Style) */}
        <div className="hidden lg:flex pointer-events-auto items-center divide-x divide-white/10 rounded-[6px] bg-[#141416]/90 backdrop-blur-2xl border border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.5)] p-1">
          <nav className="flex items-center">
            <a
              href={linkHref("/?about")}
              className="px-3.5 py-1.5 text-[11px] xl:text-[11.5px] font-mono tracking-[0.08em] uppercase font-medium text-white/75 hover:text-white transition-colors"
            >
              About
            </a>

            {/* Businesses Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("businesses")}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href={linkHref("/?businesses")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] xl:text-[11.5px] font-mono tracking-[0.08em] uppercase font-medium text-white/75 hover:text-white transition-colors"
              >
                <span>Businesses</span>
                <svg
                  viewBox="0 0 10 6"
                  className={`size-2 stroke-current fill-none stroke-[1.5] transition-transform duration-200 ${
                    openDropdown === "businesses" ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </a>

              {openDropdown === "businesses" && (
                <div className="absolute top-full left-0 pt-2 w-60">
                  <div className="rounded-[6px] bg-[#141416]/98 backdrop-blur-2xl border border-white/12 shadow-2xl p-1.5 flex flex-col gap-0.5">
                    {EXPERTISES_SUB.map(([title, href]) => (
                      <a
                        key={title}
                        href={linkHref(href)}
                        onClick={closeAll}
                        className="px-3 py-2 text-[11px] font-mono tracking-normal text-white/75 hover:text-white hover:bg-white/10 rounded-[4px] transition-colors flex items-center justify-between"
                      >
                        <span>{title}</span>
                        <span className="text-white/30 text-[10px]">→</span>
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
              <a
                href={linkHref("/?projects")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] xl:text-[11.5px] font-mono tracking-[0.08em] uppercase font-medium text-white/75 hover:text-white transition-colors"
              >
                <span>Projects</span>
                <svg
                  viewBox="0 0 10 6"
                  className={`size-2 stroke-current fill-none stroke-[1.5] transition-transform duration-200 ${
                    openDropdown === "projects" ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </a>

              {openDropdown === "projects" && (
                <div className="absolute top-full left-0 pt-2 w-60">
                  <div className="rounded-[6px] bg-[#141416]/98 backdrop-blur-2xl border border-white/12 shadow-2xl p-1.5 flex flex-col gap-0.5">
                    {PROJECTS_SUB.map(([title, href]) => (
                      <a
                        key={title}
                        href={linkHref(href)}
                        onClick={closeAll}
                        className="px-3 py-2 text-[11px] font-mono tracking-normal text-white/75 hover:text-white hover:bg-white/10 rounded-[4px] transition-colors flex items-center justify-between"
                      >
                        <span>{title}</span>
                        <span className="text-white/30 text-[10px]">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href={linkHref("/?quality")}
              className="px-3.5 py-1.5 text-[11px] xl:text-[11.5px] font-mono tracking-[0.08em] uppercase font-medium text-white/75 hover:text-white transition-colors"
            >
              Quality & Lab
            </a>

            <a
              href={linkHref("#coverage")}
              className="px-3.5 py-1.5 text-[11px] xl:text-[11.5px] font-mono tracking-[0.08em] uppercase font-medium text-white/75 hover:text-white transition-colors"
            >
              Coverage
            </a>

            <a
              href={linkHref("#contact")}
              className="px-3.5 py-1.5 text-[11px] xl:text-[11.5px] font-mono tracking-[0.08em] uppercase font-medium text-white/75 hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Language Switch */}
          <div className="px-2.5 py-1 flex items-center">
            <LangSwitch className="!bg-transparent !border-0 !p-0 !text-[11px]" />
          </div>

          {/* Quotation Primary Button */}
          <div className="pl-1.5 flex items-center">
            <ArrowButton
              href={linkHref("/?quote")}
              label="Get a quote"
              theme="white"
              className="!h-[34px] !px-3.5 !py-0 !text-[11px] !border-none !rounded-[4px] shadow-sm"
              onClick={closeAll}
            />
          </div>
        </div>

        {/* Right: Mobile Compact Pill (< 1024px) */}
        <div className="lg:hidden pointer-events-auto flex items-center gap-2 rounded-[6px] bg-[#141416]/90 backdrop-blur-2xl border border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.5)] px-2.5 py-1.5">
          <LangSwitch className="!bg-transparent !border-0 !p-0 !text-[11px]" />
          <span className="h-4 w-px bg-white/15" aria-hidden />
          <ArrowButton
            href={linkHref("/?quote")}
            label="Quote"
            theme="white"
            className="!h-[30px] !px-2.5 !py-0 !text-[10px] !border-none !rounded-[4px]"
            onClick={closeAll}
          />
          <button
            type="button"
            className="grid size-8 place-items-center rounded-[4px] bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
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
        <div className="pointer-events-auto lg:hidden mt-2 p-5 rounded-[6px] bg-[#141416]/98 backdrop-blur-2xl border border-white/12 shadow-[0_16px_50px_rgba(0,0,0,0.7)] flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-white/50">Menu Navigation</span>
            <LangSwitch />
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
