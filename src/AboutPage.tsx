import {
  useLayoutEffect,
  useRef,
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

// About BCE, after the website brief ("10. About BCE"), kept short so it reads at a glance: the olympic.no-style
// header (title, banner, introduction), who we are (a TopTier-style zoom-out), the Chairwoman's message as a pull quote, vision, mission
// and core values (Telha Clarke's studio values/vision scroll sequence, src/AboutValues.tsx), our story (history and
// milestones), then two Explore tiles linking to Our businesses and Quality & HSE.
// Facts are from the BCE Corporate Profile 2026 as already used across the site; blocks the profile does not yet supply
// in full are tagged "Sample content" on the page until BCE provides the final copy.
// It speaks the site's language: line-by-line title reveals, hairline rows drawing in, and photos wiping in from the
// top once they are well into view.

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"]
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`
// Stand-in Unsplash photo fallback
const unsplash = (id: string, w = 1600) =>
  id.startsWith("/") ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

// Milestones the profile states. Add BCE's own dated milestones here as they are confirmed.
const milestones: [string, string][] = [
  [
    "1995",
    "BCE is established in Battambang as an engineering and construction company.",
  ],
  ["2025", "128 projects completed and 1,564 clients served in a single year."],
  [
    "2026",
    "Operating across 13 provinces and Phnom Penh with 4 batching plants, 41 mixer trucks and 8 pump trucks.",
  ],
]

function SampleTag({ dark }: { dark?: boolean }) {
  return (
    <span className={`pd-tag${dark ? " ab-tag-dark" : ""}`}>
      Sample content
    </span>
  )
}

// Explore more, as olympic.no's media link tiles: two photos side by side, each with a label, title and Explore button.
const more: { label: string; title: string; href: string; image: string; alt: string }[] = [
  { label: "What we do", title: "Our businesses", href: "/?businesses", image: "/Image/bce/about-business-banner.webp", alt: "BCE site team reviewing a reinforced concrete slab" },
  { label: "Tested at every stage", title: "Quality & HSE", href: "/?quality", image: "/Image/bce/about-hse-banner.webp", alt: "Concrete cylinder under compression testing in the BCE laboratory" },
]

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

// Chairwoman's message, after olympic.no/heritage's split content: the quote in the first four columns behind a
// hairline rule, its opening mark hung in the indent, with the attribution beneath; the message in grey paragraphs in
// columns 8 to 11, continuing into Our story (history and milestones).
function ChairwomanMessage() {
  const quoteRef = useRef<HTMLQuoteElement>(null)
  useWordReveal(quoteRef)
  const quoteText = translate(QUOTE)
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
          <span data-split="content">Chairwoman, BCE., Ltd.</span>
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
            Our story
          </h3>
          <p data-split="content" className="mt-5">
            Founded in Battambang in 1995, BCE has grown into an integrated
            operation, delivering concrete, piling, construction, slab works and
            equipment rental with its own plants and fleet.
          </p>
          <ol className="pd-list mt-10">
            {milestones.map(([year, text], i) => (
              <li
                key={year}
                data-reveal
                className="ab-milestone pd-rule"
                style={{ "--rd": `${i * 0.1}s` } as CSSProperties}
              >
                <span data-split="content" className="pd-count">
                  {year}
                </span>
                <span data-split="content" className="ab-milestone-text">
                  {text}
                </span>
              </li>
            ))}
          </ol>
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
        label="Who we are"
        title="About BCE"
        image="/Image/bce/about-hero-banner.webp"
        alt="Aerial view of a BCE batching plant and aggregate yard"
      />

      <div className="ol-page-body">
        <LeadText
          after={
            <div className="mt-12 md:mt-14 flex flex-wrap items-center gap-4">
              <ArrowButton
                href="/assets/BCE_Corporate_Profile_2026.pdf"
                label="Download Company Profile (PDF)"
                theme="black"
              />
              <ArrowButton
                href="/?resources"
                label="View all resources"
                theme="outline"
              />
            </div>
          }
        >
          Battambang Construction and Engineering, Co., Ltd. (BCE) is a Battambang-based construction, concrete, piling and engineering company, supplying ready-mix concrete, reinforced concrete piling and civil construction to projects across Cambodia with its own plants, fleet and a team of 71.
        </LeadText>

        {/* 1. Who we are, as a scroll-driven zoom-out. */}
        <AboutZoom />

        {/* 2. The Chairwoman's message, then the vision, mission and the four core values it names. */}
        <ChairwomanMessage />
        <AboutValues />

        {/* 4. Explore more: two media link tiles (olympic.no), the photos drifting in their frames as they cross the screen. */}
        <section
          data-header-title="Explore"
          aria-labelledby="ab-more"
          className="ab-tiles"
        >
          <h2 id="ab-more" className="sr-only">
            Explore more
          </h2>
          {more.map((t) => (
            <div key={t.title} data-px="media" className="ab-tile">
              <div className="ab-tile-media ol-px-media">
                <img className="no-radius" src={t.image.startsWith("/") ? t.image : unsplash(t.image, 1800)} alt={t.alt} loading="lazy" />
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

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  )
}
