import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import ArrowButton from "./ArrowButton"
import { getLang, setLang } from "./i18n"

/**
 * Navigation after dalco.ch: one floating, inset glass bar. The BCE lockup sits at the left, the five tabs are
 * centred (About, Business, Projects, Quality & Lab, More) and the language switch plus the quote button close the
 * right. Tabs that have children open a panel under the bar — hovering, focusing or tapping a tab expands it, a
 * second click follows the tab's own link, and the panel closes on Escape, on a click outside, or on a link. Panels
 * come in three shapes borrowed from DALCO: a narrow icon list, a full-width card array and a full-width column grid.
 *
 * On phones the tabs collapse into a burger that opens a full-height sheet with the same items as accordions, so the
 * expand navigation survives without hover. Over the first 800px of scroll the surface narrows and slides up, as the
 * reference's header does.
 */

const revealListeners = new Set<() => void>()
let globalRevealed = false

export function revealHeader() {
  globalRevealed = true
  revealListeners.forEach((fn) => fn())
}

// Backwards compatibility export if needed
export function SharplinkButton() {
  return null
}

// Their scroll clip easing: cubic-bezier(.15, .61, 0, 1).
const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
  return (x: number) => {
    let t = x
    for (let i = 0; i < 6; i++) {
      const dx = sampleX(t) - x
      if (Math.abs(dx) < 1e-4) break
      const d = (3 * ax * t + 2 * bx) * t + cx
      if (Math.abs(d) < 1e-6) break
      t -= dx / d
    }
    return sampleY(t)
  }
}
const easeScroll = cubicBezier(0.15, 0.61, 0, 1)
const SCROLL_DISTANCE = 800
/** The tab list is only shown from this width up; below it the burger and sheet take over. */
const NAV_MIN = 1000

/* ---------------------------------------------------------------------------------------------------------- */
/* Icons: 24px, 1.5px strokes, drawn to sit at the same weight as the Aeonik labels.                           */
/* ---------------------------------------------------------------------------------------------------------- */

type IconName = "story" | "book" | "plant" | "map" | "layers" | "grid" | "lab" | "core" | "gauge" | "shield" | "grades" | "file" | "box" | "people" | "pen" | "mail"

const ICONS: Record<IconName, ReactNode> = {
  story: (
    <>
      <path d="M4 20V8.4L12 3l8 5.4V20" />
      <path d="M4 20h16" />
      <path d="M9.5 20v-5.5h5V20" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v4H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </>
  ),
  plant: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V9l5-3 5 3v12" />
      <path d="M15 21V12h4v9" />
      <path d="M8.5 13h3M8.5 17h3" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6.5v14L9 18l6 2.5 6-2.5v-14L15 6.5 9 4z" />
      <path d="M9 4v14M15 6.5v14" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3z" />
      <path d="m3 16.5 9 4.5 9-4.5" />
      <path d="m3 12 9 4.5 9-4.5" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </>
  ),
  lab: (
    <>
      <path d="M9.5 3h5" />
      <path d="M10.5 3v5.4L6 17.6A2.7 2.7 0 0 0 8.4 21h7.2A2.7 2.7 0 0 0 18 17.6l-4.5-9.2V3" />
      <path d="M7.4 15.5h9.2" />
    </>
  ),
  core: (
    <>
      <ellipse cx="12" cy="6" rx="6" ry="2.6" />
      <path d="M6 6v12c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6V6" />
      <path d="M6 12c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m12 14 4.2-4.2" />
      <circle cx="12" cy="16" r="1.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.4 2.9 7.3 7 9 4.1-1.7 7-4.6 7-9V6l-7-3z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </>
  ),
  grades: (
    <>
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3z" />
      <path d="m4 12 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h7l5 5v13H6z" />
      <path d="M13 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  box: (
    <>
      <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5z" />
      <path d="M3 8.5 12 13l9-4.5M12 13v7" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5.6 6-5.6s6 2.3 6 5.6" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6.1M17.6 14.8c2 .6 3.4 2.4 3.4 5.2" />
    </>
  ),
  pen: (
    <>
      <path d="M16.5 3.5 20 7l-9.5 9.5L5 18l1.5-5.5L16.5 3.5z" />
      <path d="m14.5 5.5 4 4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 5.6L20 7" />
    </>
  ),
}

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="ls-panel-icon"
    >
      {ICONS[name]}
    </svg>
  )
}

/* ---------------------------------------------------------------------------------------------------------- */
/* Navigation model                                                                                            */
/* ---------------------------------------------------------------------------------------------------------- */

type Link = {
  label: string
  href: string
  desc?: string
  icon?: IconName
  image?: string
  alt?: string
}

type ListPanel = {
  kind: "list"
  wide?: boolean
  items: Link[]
  foot?: Link
}

type CardsPanel = {
  kind: "cards"
  items: Link[]
  foot?: Link
}

type Panel = ListPanel | CardsPanel

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
      kind: "list",
      wide: true,
      items: [
        {
          label: "About BCE",
          href: "/?about",
          icon: "story",
          desc: "Heritage, leadership and the team since 1995.",
        },
        {
          label: "Our story",
          href: "/?about#ab-story",
          icon: "book",
          desc: "Hong Huot Ly in 1995, restructured in 2015, BCE in 2020.",
        },
        {
          label: "Technical capabilities",
          href: "/?capabilities",
          icon: "plant",
          desc: "Four batching plants, 41 mixers, 8 pumps, 7 piling rigs.",
        },
        {
          label: "Coverage",
          href: "/#coverage",
          icon: "map",
          desc: "14 provinces and Phnom Penh, dispatched from Battambang.",
        },
      ],
    },
  },
  {
    id: "business",
    label: "Business",
    href: "/?businesses",
    panel: {
      kind: "cards",
      items: [
        {
          label: "Ready-Mix Concrete",
          href: "/?business=ready-mix-concrete",
          desc: "Four plants, 41 mixers, grades C15–C40.",
          image: "/Image/bce/photos/concrete-discharge.webp",
          alt: "BCE mixer truck discharging ready-mix concrete on site",
        },
        {
          label: "Piling",
          href: "/?business=piling",
          desc: "Own hydraulic rigs, tested pile records.",
          image: "/Image/bce/photos/pile-reinforcement.webp",
          alt: "Pile reinforcement cage being lowered by a BCE piling crew",
        },
        {
          label: "Construction",
          href: "/?business=construction",
          desc: "Roads, bridges, drainage and civil works.",
          image: "/Image/bce/photos/road-crew.webp",
          alt: "BCE road crew placing and compacting pavement",
        },
        {
          label: "Concrete Slab Works",
          href: "/?business=concrete-slab-works",
          desc: "Placement, levelling and finishing crews.",
          image: "/Image/bce/photos/slab-pour.webp",
          alt: "BCE crew finishing a poured concrete slab",
        },
        {
          label: "Truck & Equipment Rental",
          href: "/?business=equipment-rental",
          desc: "Mixers, pumps and rigs with operators.",
          image: "/Image/bce/photos/mixer-pour.webp",
          alt: "BCE mixer truck and pump at a site pour",
        },
      ],
      foot: { label: "All businesses", href: "/?businesses" },
    },
  },
  {
    id: "projects",
    label: "Projects",
    href: "/?projects",
    panel: {
      kind: "list",
      wide: true,
      items: [
        {
          label: "Bridge Foundation Piling",
          href: "/?project=kampong-thom-bridge-foundations",
          icon: "grid",
          desc: "Stueng Saen, Kampong Thom",
        },
        {
          label: "Logistics Warehouse Floor Slab",
          href: "/?project=poipet-logistics-warehouse",
          icon: "grid",
          desc: "Poipet, Banteay Meanchey",
        },
        {
          label: "Commercial Complex Ready-Mix Supply",
          href: "/?project=siem-reap-commercial-ready-mix",
          icon: "grid",
          desc: "Siem Reap City",
        },
        {
          label: "Provincial Road Rehabilitation",
          href: "/?project=battambang-provincial-road",
          icon: "grid",
          desc: "Battambang Province",
        },
        {
          label: "Mixed-Use Tower Foundations",
          href: "/?project=phnom-penh-tower-foundations",
          icon: "grid",
          desc: "Chamkar Mon, Phnom Penh",
        },
        {
          label: "Pump & Mixer Fleet Hire",
          href: "/?project=sihanoukville-fleet-hire",
          icon: "grid",
          desc: "Preah Sihanouk",
        },
      ],
      foot: { label: "All projects", href: "/?projects" },
    },
  },
  {
    id: "quality",
    label: "Quality & Lab",
    href: "/?quality",
    panel: {
      kind: "list",
      wide: true,
      items: [
        {
          label: "In-house laboratory",
          href: "/?quality#laboratory",
          icon: "lab",
          desc: "DYE-2000 compression testing on every mix.",
        },
        {
          label: "Raw materials",
          href: "/?quality#raw-materials",
          icon: "core",
          desc: "Aggregate, cement and water tested before batching.",
        },
        {
          label: "Calibration",
          href: "/?quality#calibration",
          icon: "gauge",
          desc: "Instruments calibrated and certified every year.",
        },
        {
          label: "Health, safety & environment",
          href: "/?quality#hse",
          icon: "shield",
          desc: "HSE procedure on site, on every pour.",
        },
        {
          label: "Concrete grades",
          href: "/?quality#grades",
          icon: "grades",
          desc: "C15 to C40, trial-mixed and approved in house.",
        },
        {
          label: "Quality documents",
          href: "/?quality#documents",
          icon: "file",
          desc: "Certificates, mix designs and method statements.",
        },
      ],
    },
  },
  {
    id: "more",
    label: "More",
    href: "/?resources",
    panel: {
      kind: "list",
      items: [
        {
          label: "Resources",
          href: "/?resources",
          icon: "box",
          desc: "Company profile, mix designs & technical certifications",
        },
        {
          label: "Careers",
          href: "/?recruitment",
          icon: "people",
          desc: "Open roles across plants, sites and the laboratory.",
        },
        {
          label: "Blog",
          href: "/?blog",
          icon: "pen",
          desc: "Technical notes and insight from our engineers.",
        },
        {
          label: "Contact",
          href: "/?contact",
          icon: "mail",
          desc: "Head office, hotlines and Telegram.",
        },
      ],
    },
  },
]

function PanelBody({
  panel,
  onNavigate,
}: {
  panel: Panel
  onNavigate: () => void
}) {
  if (panel.kind === "cards") {
    return (
      <>
        <ul className="ls-cards">
          {panel.items.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="ls-card" onClick={onNavigate}>
                <span className="ls-card-media">
                  <img
                    src={item.image}
                    alt={item.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="ls-card-title">{item.label}</span>
                <span className="ls-card-desc">{item.desc}</span>
              </a>
            </li>
          ))}
        </ul>
        {panel.foot && (
          <div className="ls-panel-foot">
            <a
              href={panel.foot.href}
              className="ls-panel-more"
              onClick={onNavigate}
            >
              {panel.foot.label}
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden
              >
                <path d="M2.5 9.5 9.5 2.5M4.6 2.5h4.9v4.9" />
              </svg>
            </a>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <ul className={`ls-list${panel.wide ? " is-wide" : ""}`}>
        {panel.items.map((item) => (
          <li key={item.label}>
            <a href={item.href} className="ls-list-link" onClick={onNavigate}>
              {item.icon && <Icon name={item.icon} />}
              <span className="ls-list-text">
                <span className="ls-list-title">{item.label}</span>
                {item.desc && <span className="ls-list-desc">{item.desc}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {panel.foot && (
        <div className="ls-panel-foot">
          <a
            href={panel.foot.href}
            className="ls-panel-more"
            onClick={onNavigate}
          >
            {panel.foot.label}
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden
            >
              <path d="M2.5 9.5 9.5 2.5M4.6 2.5h4.9v4.9" />
            </svg>
          </a>
        </div>
      )}
    </>
  )
}

function Crest({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function LangSwitch() {
  const lang = getLang()
  return (
    <div className="ls-lang" data-no-translate>
      <button
        type="button"
        className={`ls-lang-btn ${lang === "en" ? "is-current" : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <span className="ls-lang-divider">/</span>
      <button
        type="button"
        className={`ls-lang-btn font-khmer ${
          lang === "km" ? "is-current" : ""
        }`}
        aria-pressed={lang === "km"}
        onClick={() => setLang("km")}
      >
        ខ្មែរ
      </button>
    </div>
  )
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="m3 4.8 3 3 3-3" />
    </svg>
  )
}

interface SiteHeaderProps {
  phones?: string[]
  tel?: (n: string) => string
  base?: string
}

export default function SiteHeader({ base = "" }: SiteHeaderProps) {
  const [isIn, setIsIn] = useState(
    () =>
      globalRevealed ||
      !document.documentElement.classList.contains("is-loading"),
  )
  const [scrolled, setScrolled] = useState(false)
  const [onCover, setOnCover] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [panelX, setPanelX] = useState<number | null>(null)
  const [canHover, setCanHover] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleReveal = () => setIsIn(true)
    revealListeners.add(handleReveal)
    return () => {
      revealListeners.delete(handleReveal)
    }
  }, [])

  // Hover only widens menus on real pointers; touch and narrow screens use the burger sheet.
  useEffect(() => {
    const mq = matchMedia(
      `(hover: hover) and (pointer: fine) and (min-width: ${NAV_MIN}px)`,
    )
    const sync = () => setCanHover(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // One scroll pass writes the eased progress (--ls-p, 0..1 over 800px) the surface and mark read from CSS.
  useEffect(() => {
    let raf = 0
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const update = () => {
      raf = 0
      const y = window.scrollY
      const p = reduce
        ? 0
        : easeScroll(Math.min(1, Math.max(0, y / SCROLL_DISTANCE)))
      navRef.current?.style.setProperty("--ls-p", p.toFixed(4))
      setScrolled(y > 24)
      const cover = document.querySelector<HTMLElement>("[data-nav-dark]")
      const rect = cover?.getBoundingClientRect()
      setOnCover(y < 24 && !!rect && rect.top <= 8 && rect.bottom > 96)
    }
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener("scroll", request, { passive: true })
    addEventListener("resize", request)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener("scroll", request)
      removeEventListener("resize", request)
    }
  }, [])

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    setOpen(null)
  }, [])

  const show = useCallback((id: string, trigger?: HTMLElement | null) => {
    window.clearTimeout(closeTimer.current)
    setOpen(id)
    const inner = innerRef.current
    if (inner && trigger) {
      const rect = trigger.getBoundingClientRect()
      const box = inner.getBoundingClientRect()
      setPanelX(rect.left + rect.width / 2 - box.left)
    }
  }, [])

  // A short grace period lets the pointer cross the 10px gap between tab and panel.
  const hide = useCallback((delay = 160) => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(null), delay)
  }, [])

  // Escape closes the panel or the phone sheet and hands focus back to the bar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (sheet) {
        setSheet(false)
        navRef.current?.querySelector<HTMLElement>(".ls-burger")?.focus()
        return
      }
      if (open) {
        const id = open
        close()
        navRef.current
          ?.querySelector<HTMLElement>(`[data-tab="${id}"]`)
          ?.focus()
      }
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [open, sheet, close])

  // A click anywhere outside the bar and its panels closes the open menu.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (
        target &&
        (navRef.current?.contains(target) || layerRef.current?.contains(target))
      )
        return
      close()
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open, close])

  // The phone sheet owns the screen: stop the page (and Lenis) underneath it.
  useEffect(() => {
    if (!sheet) return
    const root = document.documentElement
    const lenis = (window as unknown as {
      __lenis?: {
        stop: () => void
        start: () => void
      } | null
    }).__lenis
    root.classList.add("ls-lock")
    lenis?.stop()
    return () => {
      root.classList.remove("ls-lock")
      lenis?.start()
    }
  }, [sheet])

  // Crossing the tablet/desktop breakpoint resets whichever menu was open.
  useEffect(() => {
    const onResize = () => {
      if (innerWidth >= NAV_MIN) setSheet(false)
      else close()
    }
    addEventListener("resize", onResize)
    return () => removeEventListener("resize", onResize)
  }, [close])

  const linkHref = (path: string) =>
    path.startsWith("#") && base ? `${base}${path}` : path
  const solid = open !== null

  return (
    <header
      ref={navRef}
      data-nav
      className={`ls-nav ${isIn ? "is-in" : ""} ${
        scrolled ? "is-scrolled" : ""
      } ${onCover ? "is-on-cover" : ""} ${solid ? "is-solid" : ""} ${
        sheet ? "is-sheet-open" : ""
      }`}
    >
      <div className="ls-nav-surface">
        <div className="ls-nav-bar">
          {/* Lockup at the left, as DALCO's wordmark: crest, wordmark, and the full company name underneath. */}
          <a
            href={base || "/"}
            className="ls-logo"
            aria-label="BCE., Ltd. — home"
          >
            <Crest className="ls-logo-crest" />
            <span className="ls-logo-word">
              <span className="ls-logo-text">BCE</span>
              <span className="ls-logo-sub">
                Battambang Construction &amp; Engineering
              </span>
            </span>
          </a>

          <div className="ls-nav-center">
            <nav className="ls-nav-links" aria-label="Primary">
              {NAV.map((item) => {
                const isOpen = open === item.id
                return (
                  <div
                    key={item.id}
                    className={`ls-nav-item${isOpen ? " is-active" : ""}`}
                    onMouseEnter={(e) =>
                      canHover &&
                      show(
                        item.id,
                        e.currentTarget.querySelector<HTMLElement>(".ls-link"),
                      )
                    }
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
                          close()
                          return // second click (or a plain link) follows the tab
                        }
                        e.preventDefault()
                        show(item.id, e.currentTarget)
                      }}
                    >
                      <span className="ls-link-label">{item.label}</span>
                      <Chevron className="ls-link-chev" />
                    </a>
                  </div>
                )
              })}
            </nav>
          </div>

          <div className="ls-nav-right">
            <LangSwitch />
            <span className="ls-nav-sep" aria-hidden />
            <ArrowButton
              href={linkHref("/?quote")}
              label="Get a quote"
              className="ls-quote"
            />
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

      {/* Panels sit outside the clipped surface so their corners and shadows are not cut off. */}
      <div
        ref={layerRef}
        className={`ls-panels${open ? " is-open" : ""}`}
        style={
          {
            "--ls-panel-x": panelX === null ? "50%" : `${panelX}px`,
          } as CSSProperties
        }
      >
        <div className="ls-panels-inner" ref={innerRef}>
          {NAV.map((item) => (
            <div
              key={item.id}
              id={`ls-panel-${item.id}`}
              className={`ls-panel ls-panel--${item.panel.kind}${
                item.panel.kind === "list" && item.panel.wide ? " is-wide" : ""
              }${open === item.id ? " is-open" : ""}`}
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
              onMouseLeave={() => canHover && hide(120)}
              aria-hidden={open !== item.id}
            >
              <PanelBody panel={item.panel} onNavigate={close} />
            </div>
          ))}
        </div>
      </div>

      {/* Phones and tablets: the same tabs as accordions behind the burger. */}
      <div
        className={`ls-sheet${sheet ? " is-open" : ""}`}
        id="ls-sheet"
        aria-hidden={!sheet}
      >
        <div className="ls-sheet-inner">
          {NAV.map((item) => {
            const expanded = openGroup === item.id
            return (
              <div
                key={item.id}
                className={`ls-sheet-item${expanded ? " is-open" : ""}`}
              >
                <div className="ls-sheet-head">
                  <a
                    href={linkHref(item.href)}
                    className="ls-sheet-link"
                    onClick={() => setSheet(false)}
                  >
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
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M8 2.5v11M2.5 8h11" />
                    </svg>
                  </button>
                </div>
                <div
                  className="ls-sheet-sub"
                  id={`ls-sheet-${item.id}`}
                  hidden={!expanded}
                >
                  {item.panel.items.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="ls-sheet-sublink"
                      onClick={() => setSheet(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="ls-sheet-foot">
            <ArrowButton
              href={linkHref("/?quote")}
              label="Get a quote"
              className="ls-sheet-quote"
              onClick={() => setSheet(false)}
            />
            <LangSwitch />
          </div>
        </div>
      </div>
    </header>
  )
}
