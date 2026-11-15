import { siteSettings } from "./siteSettings";
import { useRef, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { useMediaReveal, usePageSetup } from "./usePageSetup";
import { LabelCopy, ParallaxHero, useScrollParallax } from "./ServiceBlocks";
import StickyValues, { type StickyItem } from "./StickyValues";
import { quoteHref, unsplash } from "./company";
import { quality } from "./quality";

// Quality & HSE: for contractors, consultants and tender reviewers. The laboratory and its five-step process, raw
// material and calibration certificates, the HSE commitment (a sticky sequence, as About's core values), mix design
// documents, and BCE's licences and certifications. Same language as the rest of the site:
// line reveals, hairlines drawing in and photo wipes.
// Every string and photo comes from `src/quality.ts`, which the admin console edits through D1.
// Document lists are sample content until BCE confirms them and publishes the files.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");


// Section heading block shared by the document sections: title and statement.
function DocHead({ id, title, text }: { id: string; title: string; text: string }) {
  return (
    <div>
      <h2 id={id} data-split className="pd-h2">{title}</h2>
      <p data-split className="pd-statement mt-8 max-w-[34rem]">{text}</p>
    </div>
  );
}

export default function QualityPage() {
  usePageSetup("Quality & HSE | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);

  // Built during render so edits made in the admin replace the defaults on the next bootstrap.
  const hseItems: StickyItem[] = quality.hse.items.map(({ lines, text, image, imageAlt }) => ({
    title: lines.join(" "),
    text,
    image: unsplash(image, 1600),
    alt: imageAlt,
  }));

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      {/* Cover as the business pages: the label and title set low over a full-screen banner, then the introduction
          rises over it as the page scrolls. */}
      <ParallaxHero label={quality.cover.label} title={quality.cover.title} image={unsplash(quality.cover.image, 2400)} alt={quality.cover.imageAlt} />

      <div className="ol-page-body">
        {/* Introduction as Our businesses' "What we do": a grey label on the left, the statement on the right. */}
        <LabelCopy label={quality.intro.label} className="ol-head qx-intro">
          {quality.intro.text}
        </LabelCopy>

        {/* 01 Laboratory & quality assurance, after olympic.no/sustainability-safety-and-wellbeing's text block: the
            title, grey copy and the five-step process as a numbered, ruled list on the left; a photo on the right that
            holds in place while the list scrolls past. */}
        <section id="laboratory" data-header-title={quality.laboratory.title} aria-labelledby="qs-lab" className="qh-section qx-split">
          <div className="qx-lab-content">
            <div className="qx-lead">
              <h2 id="qs-lab" data-split className="pd-h2">{quality.laboratory.title}</h2>
              <div className="qx-copy mt-10 w-[520px] max-w-full">
                <p data-split="content">{quality.laboratory.copy}</p>
              </div>
            </div>
            <h3 data-split="content" className="qx-label qx-list-label">{quality.laboratory.listLabel}</h3>
            <ol className="qx-list">
              {quality.laboratory.steps.map(({ title, text }, i) => (
                <li key={title} data-reveal className="qx-step pd-rule" style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
                  <span data-split="content" className="qx-n">{pad(i + 1)}.</span>
                  <div>
                    <p data-split="content" className="qx-step-title">{title}</p>
                    <p data-split="content" className="qx-step-text">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div data-px="media" className="pp-media qx-photo qx-lab-photo">
            <div className="ol-px-media"><img src={unsplash(quality.laboratory.image, 1400)} alt={quality.laboratory.imageAlt} loading="lazy" /></div>
          </div>
        </section>

        {/* 02 Raw material certificates, after olympic.no/sustainability-quality-safety-management-systems: a portrait
            photo on the left that holds in place, as 01's, while the materials (a two-column grid of ruled cells) scroll past on the right. */}
        <section id="raw-materials" data-header-title={quality.materials.title} aria-labelledby="qs-raw" className="qh-section qx-split qx-split--media">
          <div className="qx-body">
            <div className="qx-lead">
              <h2 id="qs-raw" data-split className="pd-h2">{quality.materials.title}</h2>
              <div className="qx-copy mt-10 w-[520px] max-w-full">
                <p data-split="content">{quality.materials.copy}</p>
              </div>
            </div>
            <h3 data-split="content" className="qx-label qx-list-label">{quality.materials.listLabel}</h3>
            <ul className="qx-cells">
              {quality.materials.items.map(({ name, certificate }, i) => (
                <li key={name} data-reveal className="qx-cell pd-rule" style={{ "--rd": `${(i % 2) * 0.08 + Math.floor(i / 2) * 0.1}s` } as CSSProperties}>
                  <span data-split="content" className="qx-label">{name}</span>
                  <span data-split="content" className="qx-cell-text">{certificate}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-px="media" className="pp-media qx-photo">
            <div className="ol-px-media"><img src={unsplash(quality.materials.image, 1200)} alt={quality.materials.imageAlt} loading="lazy" /></div>
          </div>
        </section>

        {/* 03 Calibration certificates, after olympic.no/sustainability-eco-efficient-operations: title left, copy right,
            then a full-width rule opening the equipment list, its label on the left and the ruled items on the right. */}
        <section id="calibration" data-header-title={quality.calibration.title} aria-labelledby="qs-cal" className="qh-section">
          <div className="qx-split">
            <div className="qx-head">
              <h2 id="qs-cal" data-split className="pd-h2">{quality.calibration.title}</h2>
            </div>
            <div className="qx-body qx-copy w-[520px] max-w-full">
              <p data-split="content">{quality.calibration.copy}</p>
            </div>
          </div>
          <div data-reveal className="qx-areas pd-rule">
            <h3 data-split="content" className="qx-label qx-areas-label">{quality.calibration.listLabel}</h3>
            <ul className="qx-areas-list">
              {quality.calibration.items.map(({ equipment, scope }, i) => (
                <li key={equipment} data-reveal className={`qx-area${i ? " pd-rule" : ""}`} style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
                  <span data-split="content" className="qx-label">{equipment}</span>
                  <span data-split="content" className="qx-cell-text">{scope}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 04 HSE commitment, as the core values on About: one commitment at a time beside a sticky photo column. */}
        <StickyValues id="hse" label={quality.hse.label} heading={quality.hse.heading} items={hseItems} />

        {/* 05 Mix design documents: the grades as tiles, then the documents supplied with each design. */}
        <section id="mix-design" data-header-title={quality.mix.title} aria-labelledby="qs-mix" className="qh-section px-5 pt-24 md:pt-40">
          <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-5">
            <div className="md:col-span-6"><DocHead id="qs-mix" title={quality.mix.title} text={quality.mix.text} /></div>
            <div className="md:col-span-5 md:col-start-8 md:self-end">
              <h3 data-split="content" className="text-[.95rem] text-black/45">{quality.mix.docsLabel}</h3>
              <ul className="pd-list mt-4">
                {quality.mix.docs.map((doc, i) => (
                  <li key={doc} data-reveal className="pd-list-row pd-rule" style={{ "--rd": `${i * 0.06}s` } as CSSProperties}>
                    <span data-split="content">{doc}</span>
                    <span data-split="content" className="text-black/45">{pad(i + 1)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="qh-grades mt-14 md:mt-20" aria-label="Concrete grades">
            {quality.mix.grades.map(({ grade, strength, use }, i) => (
              <li key={grade} data-reveal className="qh-grade" style={{ "--k": i } as CSSProperties}>
                <span className="text-[.9rem] text-black/45">{strength}</span>
                <span className="qh-grade-name">{grade}</span>
                <span className="qh-grade-use text-[.95rem] leading-[1.35] text-black/60">{use}</span>
              </li>
            ))}
          </ul>
          <p data-split="content" className="mt-5 text-[.875rem] text-black/40">{quality.mix.note}</p>
        </section>

        {/* 06 Licences & certifications */}
        <section id="licences" data-header-title={quality.licences.title} aria-labelledby="qs-lic" className="qh-section px-5 pb-24 pt-24 md:pb-40 md:pt-40">
          <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-5">
            <div className="md:col-span-6">
              <h2 id="qs-lic" data-split className="pd-h2">{quality.licences.title}</h2>
            </div>
            <div className="w-full md:col-span-6 md:col-start-7">
              <p data-split className="pd-statement">{quality.licences.text}</p>
              <ul className="pd-list mt-12 md:mt-16">
                {quality.licences.rows.map(({ document, issuer }, i) => (
                  <li key={document} data-reveal className="pd-list-row qh-row pd-rule" style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
                    <span data-split="content" className="font-medium">{document}</span>
                    <span data-split="content" className="text-black/55">{issuer}</span>
                    <span data-split="content" className="qh-status">{quality.licences.statusLabel}</span>
                  </li>
                ))}
              </ul>
              <ArrowButton href={quality.licences.ctaHref} label={quality.licences.ctaLabel} className="mt-10" />
            </div>
          </div>
        </section>
      </div>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
