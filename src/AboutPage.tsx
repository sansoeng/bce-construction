import { siteSettings } from "./siteSettings";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react"
import SiteHeader from "./SiteHeader"
import Footer from "./Footer"
import FluidCursor from "./FluidCursor"
import QuoteCta from "./QuoteCta"
import AboutZoom from "./AboutZoom"
import AboutValues from "./AboutValues"
import ArrowButton from "./ArrowButton"
import { useMediaReveal, usePageSetup } from "./usePageSetup"
import { LeadText, ParallaxHero, useScrollParallax } from "./ServiceBlocks"
import { translate } from "./i18n"
import { about } from "./about"

// About BCE, after the website brief ("10. About BCE"), kept short so it reads at a glance: the olympic.no-style
// header (title, banner, introduction), who we are (a TopTier-style zoom-out), the Chairwoman's message as a pull quote, vision, mission
// and core values (Telha Clarke's studio values/vision scroll sequence, src/AboutValues.tsx), our story (history and
// milestones), then two Explore tiles linking to Our businesses and Quality & HSE.
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

// The quote brightens word by word as it crosses the screen, after olympic.no's content-blocks quote: each word starts
// at 16% opacity and rises to full over its own slice of the scroll (a .16 window, stepping 1/79 of the range per
// word). The range runs from the quote's top 15% of a screen above the bottom of the viewport to a quarter screen past
// its top reaching the top of the viewport. --qp (0..1) is set here; the opacity maths lives in index.css.
function useWordReveal(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el?.style.setProperty("--qp", "1")
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const top = el.getBoundingClientRect().top
      const p = (innerHeight * 0.85 - top) / (innerHeight * 1.1)
      el.style.setProperty("--qp", Math.min(1, Math.max(0, p)).toFixed(4))
    }
    const request = () => (raf ||= requestAnimationFrame(update))
    update()
    addEventListener("scroll", request, { passive: true })
    addEventListener("resize", request)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener("scroll", request)
      removeEventListener("resize", request)
    }
  }, [ref])
}

const QUOTE =
  "For more than thirty years we have built on four pillars: quality, safety, reliability and partnership. They guide every pour, every pile and every project."

// Leadership, after dalco.ch/meet-dalco: the person named with their role, a portrait, and the statement they stand
// behind. Editable in the admin (About BCE → Leadership) so BCE can replace the portrait and the copy.
function Leadership() {
  const leader = about.leadership
  const initials = leader.name
    .replace(/^Ms\.?\s*/i, "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
  return (
    <section data-header-title="Leadership" aria-labelledby="ab-lead" className="ab-lead">
      <div className="ab-lead-head">
        <p data-split="content" className="ab-lead-label">
          {leader.label}
        </p>
        <h2 id="ab-lead" data-split className="ab-lead-title">
          {leader.title}
        </h2>
      </div>
      <div className="ab-lead-grid">
        <figure className="ab-lead-photo">
          {leader.image ? (
            <img src={leader.image} alt={leader.imageAlt} loading="lazy" />
          ) : (
            <span className="ab-lead-initials" aria-hidden>
              {initials}
            </span>
          )}
        </figure>
        <div className="ab-lead-copy">
          <p className="ab-lead-name">{leader.name}</p>
          <p className="ab-lead-role">{leader.role}</p>
          {leader.bio.map((paragraph) => (
            <p key={paragraph} className="ab-lead-bio">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

// Milestones, after dalco.ch/meet-dalco: a horizontal strip you can drag (or scroll, or tab through), each card a
// photo, a paragraph, a title and its year on a ruled axis. Data from about.story.milestones.
function Milestones() {
  const railRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth
      setProgress(max > 0 ? rail.scrollLeft / max : 0)
    }
    update()
    rail.addEventListener("scroll", update, { passive: true })
    addEventListener("resize", update)
    return () => {
      rail.removeEventListener("scroll", update)
      removeEventListener("resize", update)
    }
  }, [])

  // Drag to scroll: pointer capture, so a flick keeps moving like the reference page.
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current
    if (!rail || event.pointerType === "touch") return
    drag.current = { active: true, startX: event.clientX, startLeft: rail.scrollLeft, moved: false }
    rail.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current
    if (!rail || !drag.current.active) return
    const dx = event.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    rail.scrollLeft = drag.current.startLeft - dx
  }
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current
    if (rail?.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId)
    drag.current.active = false
  }
  const nudge = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.8, 720), behavior: "smooth" })
  }

  return (
    <section id="milestones" data-nav-dark data-header-title="Milestones" aria-labelledby="ab-miles" className="ab-miles">
      <div className="ab-miles-head">
        <div>
          <p data-split="content" className="ab-miles-label">
            Milestones
          </p>
          <h2 id="ab-miles" data-split className="ab-miles-title">
            Thirty years, built one pour at a time.
          </h2>
        </div>
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        tabIndex={0}
        role="region"
        aria-label="BCE milestones, horizontally scrollable"
      >
        {about.story.milestones.map((milestone, index) => (
          <article key={milestone.year} className="ab-miles-item" aria-labelledby={`ab-miles-${index}`}>
            <p className="ab-miles-text">{milestone.text}</p>
            <div className="ab-miles-media">
              <img src={milestone.image} alt={milestone.imageAlt} loading="lazy" draggable={false} />
            </div>
            <h3 id={`ab-miles-${index}`} className="ab-miles-item-title">
              {milestone.title}
            </h3>
            <p className="ab-miles-year">
              <span className="ab-miles-dot" aria-hidden />
              {milestone.year}
            </p>
            <span className="ab-miles-line" aria-hidden/>
          </article>
        ))}
      </div>
      <div className="ab-miles-progress" aria-hidden>
        <span style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
      </div>
    </section>
  )
}

// Chairwoman's message, after olympic.no/heritage's split content: the quote in the first four columns behind a
// hairline rule, its opening mark hung in the indent, with the attribution beneath; the message in grey paragraphs in
// columns 8 to 11, continuing into Our story (history and milestones).
function ChairwomanMessage() {
  const quoteRef = useRef<HTMLQuoteElement>(null)
  useWordReveal(quoteRef)
  const quoteText = translate(about.message.quote)
  const words = quoteText.split(" ")
  return (
    <section
      data-header-title="Chairwoman’s message"
      aria-labelledby="ab-message"
      className="ab-msg"
    >
      <h2 id="ab-message" className="sr-only">
        Chairwoman’s message
      </h2>
      <div className="ab-msg-quote">
        <span className="ab-msg-mark" aria-hidden>
          “
        </span>
        <blockquote ref={quoteRef} className="ab-msg-text" aria-label={quoteText}>
          <p aria-hidden>
            {words.map((w, i) => (
              <span key={i} className="ab-msg-word" style={{ "--wi": i } as CSSProperties}>
                {w}{" "}
              </span>
            ))}
          </p>
        </blockquote>
        <p className="ab-msg-by">
          <span data-split="content">{about.message.attribution}</span>
        </p>
      </div>
      <div className="ab-msg-body">
        {/* Our story: history and milestones, continuing the message. */}
        <div
          data-header-title="Our story"
          aria-labelledby="ab-story"
          role="group"
          className="ab-story"
        >
          <h3 id="ab-story" data-split className="ab-story-title">
            {about.story.title}
          </h3>
          <p data-split="content" className="mt-5">
            {about.story.text}
          </p>
        </div>
      </div>
      {/* Two staggered photos beneath the message and Our story: a tall portrait under the quote, set lower, and a
          wide photo under the story column reaching the right edge. Each wipes in and drifts in its frame. */}
      <div data-px="media" className="pp-media ab-msg-photo ab-msg-photo--tall">
        <div className="ol-px-media">
          <img src={unsplash("/Image/bce/about-portrait-1.webp", 1400)} alt="Tower crane rising over reinforced concrete formwork" loading="lazy" />
        </div>
      </div>
      <div data-px="media" className="pp-media ab-msg-photo ab-msg-photo--wide">
        <div className="ol-px-media">
          <img src={unsplash("/Image/bce/about-portrait-2.webp", 1600)} alt="Props and formwork supporting a new concrete slab" loading="lazy" />
        </div>
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

        {/* 1b. Leadership, after dalco.ch/meet-dalco. */}
        <Leadership />

        {/* 2. The Chairwoman's message, then the vision, mission and the four core values it names. */}
        <ChairwomanMessage />
        <AboutValues />

        {/* 2b. The milestones, as a horizontal draggable rail on the ink ground. */}
        <Milestones />

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
