import { siteSettings } from "./siteSettings";
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import SiteHeader from "./SiteHeader"
import Footer from "./Footer"
import FluidCursor from "./FluidCursor"
import QuoteCta from "./QuoteCta"
import AboutZoom from "./AboutZoom"
import AboutValues from "./AboutValues"
import ArrowButton from "./ArrowButton"
import { useMediaReveal, usePageSetup } from "./usePageSetup"
import { LeadText, ParallaxHero, useScrollParallax } from "./ServiceBlocks"
import { about } from "./about"

// About BCE, after the website brief ("10. About BCE"): the olympic.no-style header (title, banner, introduction), who
// we are (a TopTier-style zoom-out), leadership and the milestones rail after dalco.ch/meet-dalco, vision, mission and
// core values (Telha Clarke's studio values/vision scroll sequence, src/AboutValues.tsx), then two Explore tiles.
// Facts are from the BCE Corporate Profile 2026 as already used across the site; blocks the profile does not yet supply
// in full are tagged "Sample content" on the page until BCE provides the final copy.
// It speaks the site's language: line-by-line title reveals, hairline rows drawing in, and photos wiping in from the
// top once they are well into view.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`
// Stand-in Unsplash photo fallback
const unsplash = (id: string, w = 1600) =>
  id.startsWith("/") ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

// Milestones, the message and the Explore tiles all come from `src/about.ts`, which the admin edits through D1.

function SampleTag({ dark }: { dark?: boolean }) {
  return (
    <span className={`pd-tag${dark ? " ab-tag-dark" : ""}`}>
      Sample content
    </span>
  )
}

// Explore more, as olympic.no's media link tiles: two photos side by side, each with a label, title and Explore button.
// Read from `about.explore.tiles` inside the component so admin edits show on the next bootstrap.

const QUOTE =
  "For more than thirty years we have built on four pillars: quality, safety, reliability and partnership. They guide every pour, every pile and every project."

// Leadership, after dalco.ch/meet-dalco: a label, the statement beside a ruled list of people, each row expanding
// to a portrait and their statement. Type, colour and spacing come from BCE's own system.
function Leadership() {
  const leader = about.leadership
  const [open, setOpen] = useState(true)
  return (
    <section data-header-title="Leadership" aria-labelledby="ab-lead" className="ab-lead">
      <p className="ol-label">{leader.label}</p>
      <div className="ab-lead-inner">
        <div className="ab-lead-aside">
          <h2 id="ab-lead">{leader.title}</h2>
        </div>
        <div className="ab-lead-list">
          <div className={`ab-lead-item${open ? " is-open" : ""}`}>
            <button type="button" className="ab-lead-head" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              <span className="ab-lead-name">{leader.name}</span>
              <span className="ab-lead-role">{leader.role}</span>
              <span className="ab-lead-toggle" aria-hidden />
            </button>
            <div className="ab-lead-panel">
              <div className="ab-lead-panel-inner">
                <figure className="ab-lead-figure">
                  {leader.image ? (
                    <img src={leader.image} alt={leader.imageAlt} />
                  ) : (
                    <span className="ab-lead-initials" aria-hidden>
                      {leader.name.replace(/^Ms\.?\s*/i, "").split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    </span>
                  )}
                </figure>
                <div className="ab-lead-text">
                  {leader.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Milestones, after dalco.ch/meet-dalco: a horizontal strip with an axis through it, cards alternating above and
// below the year, grayscale photos, drag or arrows to move. Type and colour follow BCE's system.
//
// Scroll is read with requestAnimationFrame and written straight to the progress bar's ref: no React state changes on
// scroll, so dragging and scrolling never re-render the eight cards. `data-lenis-prevent` hands wheel events to the
// rail instead of the page's smooth scroller, and snap is only applied when the pointer is not dragging.
function Milestones() {
  const railRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false, frame: 0 })

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let frame = 0
    const paint = () => {
      frame = 0
      const max = rail.scrollWidth - rail.clientWidth
      const progress = max > 0 ? rail.scrollLeft / max : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${0.12 + progress * 0.88})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    paint()
    rail.addEventListener("scroll", onScroll, { passive: true })
    addEventListener("resize", onScroll)
    return () => {
      rail.removeEventListener("scroll", onScroll)
      removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(drag.current.frame)
    }
  }, [])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current
    if (!rail || event.pointerType === "touch" || event.button !== 0) return
    drag.current = { active: true, startX: event.clientX, startLeft: rail.scrollLeft, moved: false, frame: 0 }
    rail.classList.add("is-dragging")
    try {
      rail.setPointerCapture(event.pointerId)
    } catch {
      /* synthetic or stale pointer: dragging still works through the element itself */
    }
  }
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current
    if (!rail || !drag.current.active) return
    const dx = event.clientX - drag.current.startX
    if (Math.abs(dx) > 3) drag.current.moved = true
    // Written straight to scrollLeft: the position must follow the pointer even if frames are throttled, and no React
    // state changes here, so the eight cards are never re-rendered during a drag.
    rail.scrollLeft = drag.current.startLeft - dx
  }
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current
    if (!rail) return
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId)
    drag.current.active = false
    rail.classList.remove("is-dragging")
  }
  const nudge = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.8, 720), behavior: "smooth" })
  }

  return (
    <section id="milestones" data-nav-dark data-header-title="Milestones" aria-labelledby="ab-miles" className="ab-miles">
      <div className="ab-miles-head">
        <p id="ab-miles" className="ol-label">
          Milestones
        </p>
        <div className="ab-miles-controls">
          <span className="ab-miles-drag" aria-hidden>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M3 8h10M5 5 2 8l3 3M11 5l3 3-3 3" />
            </svg>
            Drag
          </span>
          <button type="button" className="ab-miles-btn" onClick={() => nudge(-1)} aria-label="Previous milestones">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M10 3 5 8l5 5" />
            </svg>
          </button>
          <button type="button" className="ab-miles-btn" onClick={() => nudge(1)} aria-label="Next milestones">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="m6 3 5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="ab-miles-rail"
        data-lenis-prevent
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        tabIndex={0}
        role="region"
        aria-label="BCE milestones, horizontally scrollable"
      >
        {about.story.milestones.map((milestone, index) => (
          <article
            key={milestone.year}
            className={`ab-miles-item${index % 2 === 0 ? " is-top" : ""}`}
            aria-labelledby={`ab-miles-${index}`}
          >
            <div className="ab-miles-card">
              <p className="ab-miles-text">{milestone.text}</p>
              <div className="ab-miles-media">
                <img src={milestone.image} alt={milestone.imageAlt} loading="lazy" decoding="async" draggable={false} />
              </div>
              <h3 id={`ab-miles-${index}`} className="ab-miles-title">
                {milestone.title}
              </h3>
            </div>
            <div className="ab-miles-axis">
              <span className="ab-miles-dot" aria-hidden />
              <span className="ab-miles-year">{milestone.year}</span>
              <span className="ab-miles-line" aria-hidden />
            </div>
          </article>
        ))}
      </div>
      <div className="ab-miles-progress" aria-hidden>
        <span ref={progressRef} />
      </div>
    </section>
  )
}

export default function AboutPage() {
  usePageSetup("About BCE | BCE., Ltd.")
  const rootRef = useRef<HTMLElement>(null)
  useMediaReveal(rootRef)
  useScrollParallax(rootRef)

  return (
    <main
      ref={rootRef}
      className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]"
    >
      <SiteHeader phones={phones} tel={tel} base="/" />

      {/* Cover as Our Businesses and the business pages: the label and title set low over a full-screen banner,
          which drifts as the page scrolls and the introduction rises over it. */}
      <ParallaxHero
        label={about.cover.label}
        title={about.cover.title}
        image={unsplash(about.cover.image)}
        alt={about.cover.imageAlt}
      />

      <div className="ol-page-body">
        <LeadText
          after={
            <div className="mt-12 md:mt-14 flex flex-wrap items-center gap-4">
              <ArrowButton
                href={about.intro.primaryHref}
                label={about.intro.primaryLabel}
                theme="black"
              />
              <ArrowButton
                href={about.intro.secondaryHref}
                label={about.intro.secondaryLabel}
                theme="outline"
              />
            </div>
          }
        >
          {about.intro.text}
        </LeadText>

        {/* 1. Who we are, as a scroll-driven zoom-out. */}
        <AboutZoom />

        {/* 1b. Leadership, then the milestones directly beneath it, both after dalco.ch/meet-dalco. */}
        <Leadership />
        <Milestones />

        {/* 2. Vision, mission and the four core values. */}
        <AboutValues />

        {/* 4. Explore more: two media link tiles (olympic.no), the photos drifting in their frames as they cross the screen. */}
        <section
          data-header-title="Explore"
          aria-labelledby="ab-more"
          className="ab-tiles"
        >
          <h2 id="ab-more" className="sr-only">
            {about.explore.label}
          </h2>
          {about.explore.tiles.map((t) => (
            <div key={t.title} data-px="media" className="ab-tile">
              <div className="ab-tile-media ol-px-media">
                <img className="no-radius" src={t.image.startsWith("/") ? t.image : unsplash(t.image, 1800)} alt={t.imageAlt} loading="lazy" />
              </div>
              <div className="ab-tile-content">
                <p data-split="content" className="ab-tile-label">
                  {t.label}
                </p>
                <h3 data-split className="ab-tile-title">
                  {t.title}
                </h3>
                <ArrowButton
                  href={t.href}
                  label="Explore"
                  theme="white"
                  className="ab-tile-btn"
                />
              </div>
            </div>
          ))}
        </section>
      </div>

      <QuoteCta href="/quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  )
}
