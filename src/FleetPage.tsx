import { siteSettings } from "./siteSettings"
import { useRef } from "react"
import SiteHeader from "./SiteHeader"
import Footer from "./Footer"
import FluidCursor from "./FluidCursor"
import QuoteCta from "./QuoteCta"
import { useMediaReveal, usePageSetup } from "./usePageSetup"
import { LabelCopy, ParallaxHero, useScrollParallax } from "./ServiceBlocks"
import { LineIcon } from "./LineIcon"
import { quality } from "./quality"
import FleetFigures from "./FleetFigures"
import StickyValues from "./StickyValues"

// Equipment & fleet (/fleet), the standalone page the Recommendation's sitemap asks for: what BCE owns, how many, what
// each machine is for, and how to hire it. Every figure comes from quality.ts (the Quality page's own document) so the
// two pages cannot disagree. No rates and no per-machine availability are published — the quotation is per project.
//
// The page follows the same Olympic-style blocks as Quality & HSE and Coverage: the parallax cover, a labelled
// introduction with an on-page index, one ink band carrying the key figures in the project-highlights grid, the plant
// as a photo beside the corporate profile's numbered machine cards, and the closing quotation band.

const phones = siteSettings.contact.phones
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`
const pad = (n: number) => String(n).padStart(2, "0")

const TOPICS = [
  ["fleet-inventory", "What we own"],
  ["fleet-jobs", "Fleet by job"],
  ["fleet-maintenance", "Maintenance & operators"],
] as const

export default function FleetPage() {
  usePageSetup(
    "Fleet & Equipment Hire in Cambodia | BCE",
    "BCE's own plant and fleet: batching plants, mixer trucks, pump trucks and piling rigs, maintained in-house and mobilised from Battambang for hire across Cambodia.",
  )
  const rootRef = useRef<HTMLElement>(null)
  useMediaReveal(rootRef)
  useScrollParallax(rootRef)

  const fleet = quality.fleet
  const jobs = fleet.jobs

  return (
    <main
      ref={rootRef}
      className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]"
    >
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero
        label={fleet.kicker}
        headerTitle="Equipment & fleet"
        title={fleet.title}
        image={fleet.image}
        alt={fleet.imageAlt}
      />

      <div className="ol-page-body">
        <div className="fl-dark">
          {/* Fleet overview as the other inner pages, on the ink ground so it runs straight into the figures band. */}
          <LabelCopy
            label="Fleet overview"
            className="ol-head qx-intro fl-intro"
            after={
              <>
                <p className="fl-intro-note">{fleet.note}</p>
                <ul className="ol-topics" aria-label="On this page">
                  {TOPICS.map(([id, label], i) => (
                    <li key={id}>
                      <a href={`#${id}`}>
                        <span>{pad(i + 1)}</span>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            }
          >
            {fleet.copy[0]}
          </LabelCopy>

          {/* What we own, in numbers: the title and copy on the left, every count in the project-highlights grid on
              the right. The band is shared with Truck & Equipment Rental, so both read the same figures. */}
          <FleetFigures
            id="fleet-inventory"
            headingId="fl-figures"
            headerTitle="What we own"
            label={fleet.figuresLabel}
            title={fleet.figuresTitle}
          />
        </div>

        {/* Fleet by job, as the HSE commitment on Quality & HSE (src/StickyValues.tsx): the screen sticks, one kind of
            work at a time beside a photo column, each job's photo wiping up over the last as its title and key services
            rise in. The label carries only the tag, the job title and its key services — no standing introduction or
            per-job copy, so the checklist is the content of the card. The counts stay in the ink band above. */}
        <StickyValues
          id="fleet-jobs"
          label={fleet.jobsLabel}
          heading={fleet.jobsTitle}
          items={jobs.map((job) => ({
            title: job.title,
            image: job.image,
            alt: job.imageAlt,
            bullets: job.bullets,
            bulletsLabel: "Key services",
          }))}
        />

        {/* Maintenance, operators and mobilisation, using the business pages' value columns. */}
        <section
          id="fleet-maintenance"
          data-header-title={fleet.maintenanceTitle}
          aria-labelledby="fl-maintenance"
          className="ol-values fl-maintenance"
        >
          <div className="ol-values-head">
            <p data-split="content" className="ol-label">
              {fleet.maintenanceLabel}
            </p>
            <h2 id="fl-maintenance" data-split className="ol-values-title">
              {fleet.maintenanceTitle}
            </h2>
          </div>
          <ul className="ol-values-grid">
            {fleet.maintenance.map((item) => (
              <li key={item.title} data-reveal className="ol-value">
                <span className="ol-value-icon" aria-hidden>
                  <LineIcon name={item.icon} className="size-full" />
                </span>
                <h3 className="ol-value-title">{item.title}</h3>
                <p className="ol-value-text">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <QuoteCta href={fleet.ctaHref} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  )
}
