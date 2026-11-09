import { useEffect, useRef, useState } from "react";
import { getLang, setLang } from "./i18n";

/**
 * Modern expanded corporate navigation bar:
 * Inspired by Montarville / modern architectural engineering studios.
 * Single floating dark glass navbar containing:
 * - Left: "bce." logo with signature red accent dot
 * - Center: Horizontal desktop links (About, Expertises ⌵, Projects ⌵, Quality & HSE, Coverage, Contact)
 * - Right: Bilingual language switcher (EN | ខ្មែរ) + "Get a quote ↗" button with square arrow box + mobile hamburger
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
      className={`fixed top-3 sm:top-4 md:top-5 inset-x-3 sm:inset-x-5 md:inset-x-8 max-w-7xl mx-auto z-50 transition-all duration-700 ease-out ${
        isIn ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex items-center justify-between h-[54px] md:h-[58px] px-4 md:px-6 rounded-[6px] bg-[#141416]/90 backdrop-blur-2xl border border-white/12 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {/* Left: Brand Logo with signature dot */}
        <a
          href={base || "/"}
          className="flex items-center text-[1.25rem] md:text-[1.35rem] font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
          aria-label="BCE., Ltd. home"
          onClick={closeAll}
        >
          <span>bce</span>
          <span className="text-[#e11d48] text-[1.6rem] leading-none ml-0.5">.</span>
        </a>

        {/* Center: Desktop Navigation Links (Expanded) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[12px] xl:text-[12.5px] font-mono tracking-[0.08em] font-medium uppercase text-white/75">
          <a
            href={linkHref("/?about")}
            className="hover:text-white transition-colors py-2"
          >
            About
          </a>

          {/* Expertises Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("expertises")}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href={linkHref("/?businesses")}
              className="flex items-center gap-1.5 hover:text-white transition-colors py-2"
              onClick={(e) => {
                if (window.innerWidth >= 1024 && !openDropdown) {
                  // Allow click to toggle dropdown or navigate
                }
              }}
            >
              <span>Expertises</span>
              <svg
                viewBox="0 0 10 6"
                className={`size-2.5 stroke-current fill-none stroke-[1.5] transition-transform duration-200 ${
                  openDropdown === "expertises" ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <path d="M1 1l4 4 4-4" />
              </svg>
            </a>

            {openDropdown === "expertises" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-64">
                <div className="rounded-[6px] bg-[#141416]/95 backdrop-blur-2xl border border-white/12 shadow-2xl p-2 flex flex-col gap-1">
                  {EXPERTISES_SUB.map(([title, href]) => (
                    <a
                      key={title}
                      href={linkHref(href)}
                      onClick={closeAll}
                      className="px-3 py-2 text-[12px] font-mono tracking-normal text-white/75 hover:text-white hover:bg-white/10 rounded-[4px] transition-colors flex items-center justify-between"
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
              className="flex items-center gap-1.5 hover:text-white transition-colors py-2"
            >
              <span>Projects</span>
              <svg
                viewBox="0 0 10 6"
                className={`size-2.5 stroke-current fill-none stroke-[1.5] transition-transform duration-200 ${
                  openDropdown === "projects" ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <path d="M1 1l4 4 4-4" />
              </svg>
            </a>

            {openDropdown === "projects" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-64">
                <div className="rounded-[6px] bg-[#141416]/95 backdrop-blur-2xl border border-white/12 shadow-2xl p-2 flex flex-col gap-1">
                  {PROJECTS_SUB.map(([title, href]) => (
                    <a
                      key={title}
                      href={linkHref(href)}
                      onClick={closeAll}
                      className="px-3 py-2 text-[12px] font-mono tracking-normal text-white/75 hover:text-white hover:bg-white/10 rounded-[4px] transition-colors flex items-center justify-between"
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
            className="hover:text-white transition-colors py-2"
          >
            Quality & Lab
          </a>

          <a
            href={linkHref("#coverage")}
            className="hover:text-white transition-colors py-2"
          >
            Coverage
          </a>

          <a
            href={linkHref("#contact")}
            className="hover:text-white transition-colors py-2"
          >
            Contact
          </a>
        </nav>

        {/* Right: Language Toggle, CTA Button, Mobile Burger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch className="hidden sm:inline-flex" />

          {/* Action Button: Styled like Montarville's "NOUS JOINDRE ↘" */}
          <a
            href={linkHref("/?quote")}
            onClick={closeAll}
            className="group inline-flex items-center gap-2.5 rounded-[4px] bg-white/10 hover:bg-white text-white hover:text-black px-3 sm:px-3.5 py-1.5 transition-all duration-300 text-[11px] sm:text-[12px] font-mono tracking-[0.08em] font-medium uppercase border border-white/15 shadow-sm"
          >
            <span className="hidden xs:inline">Get a quote</span>
            <span className="xs:hidden">Quote</span>
            <span className="grid size-5 sm:size-6 place-items-center rounded-[3px] bg-white/15 group-hover:bg-black/10 transition-colors text-[#e11d48] group-hover:text-black">
              <svg
                viewBox="0 0 10 10"
                className="size-2.5 sm:size-3 stroke-current fill-none stroke-[1.8] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              >
                <path d="M2 8L8 2M2 2h6v6" />
              </svg>
            </span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden grid size-9 place-items-center rounded-[4px] bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg viewBox="0 0 14 14" className="size-4 stroke-current fill-none stroke-[1.8]" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            ) : (
              <svg viewBox="0 0 18 12" className="size-4 stroke-current fill-none stroke-[1.8]" aria-hidden>
                <path d="M0 1h18M0 6h18M0 11h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Drawer */}
      {open && (
        <div className="lg:hidden mt-2 p-5 rounded-[6px] bg-[#141416]/98 backdrop-blur-2xl border border-white/12 shadow-[0_16px_50px_rgba(0,0,0,0.7)] flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
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
