import { siteSettings } from "./siteSettings";
import { useRef, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { useMediaReveal, usePageSetup } from "./usePageSetup";
import { LabelCopy, ParallaxHero, useScrollParallax } from "./ServiceBlocks";
import { LineIcon } from "./LineIcon";
import { quality } from "./quality";
import FleetFigures from "./FleetFigures";

// Equipment & fleet (/fleet), the standalone page the Recommendation's sitemap asks for: what BCE owns, how many, what
// each machine is for, and how to hire it. Every figure comes from quality.ts (the Quality page's own document) so the
// two pages cannot disagree. No rates and no per-machine availability are published — the quotation is per project.
//
// The page follows the same Olympic-style blocks as Quality & HSE and Coverage: the parallax cover, a labelled
// introduction with an on-page index, one ink band carrying the key figures in the project-highlights grid, the plant
// as a photo beside the corporate profile's numbered machine cards, and the hire/dispatch contact.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

const TOPICS = [
  ["fleet-inventory", "What we own"],
  ["fleet-jobs", "Fleet by job"],
  ["fleet-maintenance", "Maintenance & operators"],
  ["fleet-mobilisation", "Mobilisation & hire"],
] as const;

export default function FleetPage() {
  usePageSetup(
    "Equipment & fleet | BCE., Ltd.",
    "BCE's own plant and fleet: batching plants, mixer trucks, pump trucks and piling rigs, maintained in-house and mobilised from Battambang for hire across Cambodia.",
  );
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);

  const fleet = quality.fleet;
  const jobs = fleet.jobs;

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]">
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
            copy={fleet.figuresCopy}
          />
        </div>

        {/* Fleet by job, after the Corporate Profile's card layout: one large plant photo beside the four kinds of work
            the fleet supports. The counts stay in the ink band above; these cards explain what each group is for. */}
        <section id="fleet-jobs" data-header-title={fleet.jobsTitle} aria-labelledby="fl-jobs" className="ol-solutions">
          <div className="ol-solutions-head">
            <p data-split="content" className="ol-label">{fleet.jobsLabel}</p>
            <h2 id="fl-jobs" data-split className="ol-solutions-title">{fleet.jobsTitle}</h2>
            <p data-split="content" className="ol-solutions-lead">{fleet.jobsCopy}</p>
          </div>
          <ul className="fl-jobs">
            {jobs.map((job, index) => (
              <li key={job.title} data-reveal className={`fl-job-card${index % 2 ? " is-navy" : ""}`}>
                <div className="fl-job-top">
                  <span className="fl-job-num">{pad(index + 1)}</span>
                  <span className="fl-job-icon" aria-hidden>
                    <LineIcon name={job.icon} className="size-full" strokeWidth={1.3} />
                  </span>
                </div>
                <h3 className="fl-job-title">{job.title}</h3>
                <p className="fl-job-text">{job.text}</p>
                <div className="fl-job-media">
                  <img src={job.image} alt={job.imageAlt} loading="lazy" />
                </div>
                <div className="fl-job-services">
                  <p className="fl-job-services-head">Key services</p>
                  <ul>
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Maintenance, operators and mobilisation, using the business pages' value columns. */}
        <section id="fleet-maintenance" data-header-title={fleet.maintenanceTitle} aria-labelledby="fl-maintenance" className="ol-values">
          <div className="ol-values-head">
            <p data-split="content" className="ol-label">{fleet.maintenanceLabel}</p>
            <h2 id="fl-maintenance" data-split className="ol-values-title">{fleet.maintenanceTitle}</h2>
            <p data-split="content" className="max-w-[40rem] text-[16px] leading-[1.6] text-[#111]/55">{fleet.maintenanceCopy}</p>
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

        {/* Mobilisation and hire, using the Quality page's split block and numbered list. */}
        <section id="fleet-mobilisation" data-header-title={fleet.mobilisationTitle} aria-labelledby="fl-mobilisation" className="qh-section qx-split fl-section">
          <div className="qx-head">
            <p data-split="content" className="ol-label">{fleet.mobilisationLabel}</p>
            <h2 id="fl-mobilisation" data-split className="pd-h2">{fleet.mobilisationTitle}</h2>
            <div className="qx-copy mt-10 w-[520px] max-w-full">
              <p data-split="content">{fleet.mobilisationCopy}</p>
              <p data-split="content" className="text-[15px] text-[#111]/45">{fleet.mobilisationNote}</p>
            </div>
            <ArrowButton href={fleet.ctaHref} label={fleet.ctaLabel} className="mt-8" />
          </div>
          <div className="qx-body">
            <h3 data-split="content" className="qx-label">How it works</h3>
            <ol className="qx-list">
              {fleet.mobilisationSteps.map((step, index) => (
                <li key={step} data-reveal className="qx-step pd-rule" style={{ "--rd": `${index * 0.08}s` } as CSSProperties}>
                  <span data-split="content" className="qx-n">{pad(index + 1)}.</span>
                  <div>
                    <p data-split="content" className="qx-step-text">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      <QuoteCta href={fleet.ctaHref} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
