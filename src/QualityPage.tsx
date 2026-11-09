import { useRef, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { useMediaReveal, usePageSetup } from "./usePageSetup";
import { LabelCopy, PageHeader, useScrollParallax } from "./ServiceBlocks";
import StickyValues, { type StickyItem } from "./StickyValues";
import { commitments, quoteHref, unsplash } from "./company";

// Quality & HSE: for contractors, consultants and tender reviewers. The laboratory and its five-step process, raw
// material and calibration certificates, the HSE commitment (a sticky sequence, as About's core values), mix design
// documents, and BCE's licences and certifications. Same language as the rest of the site:
// line reveals, hairlines drawing in and photo wipes.
// Document lists are sample content until BCE confirms them and publishes the files.
// Photos: stand-ins from Unsplash (ThisisEngineering, uve sanchez, Anton Savinov, Mélyna Côté, Mufid Majnun, Caleb Minear, Ronnakorn Triraganon) until BCE supplies its own.

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

// The quality process recommended in the brief (section 3, "Quality Assurance").
const steps: [string, string][] = [
  ["Material check", "Every material checked before production."],
  ["Batching", "Weighed and mixed to the approved design."],
  ["Slump test", "Tested on delivery, before placing."],
  ["Strength test", "Samples cured and tested in our lab."],
  ["Verification", "Results checked and recorded."],
];

// [material, what the certificate covers]
const rawMaterials: [string, string][] = [
  ["Cement", "Mill test certificate"],
  ["Sand", "Grading and silt tests"],
  ["Coarse aggregate", "Grading and crushing value"],
  ["Admixtures", "Compliance certificate"],
  ["Water", "Water quality tests"],
  ["Steel", "Mill certificates"],
];

// [equipment, what is calibrated]
const calibrations: [string, string][] = [
  ["Batching plant weigh scales", "Cement, aggregate, water and admixture scales"],
  ["Compression testing machine", "Load calibration for cube and cylinder testing"],
  ["Admixture dispensers", "Dosing accuracy"],
  ["Water meters", "Flow accuracy at the batching plants"],
  ["Laboratory equipment", "Balances, slump cones and cube moulds"],
];

// [grade, strength, typical use]
const grades: [string, string, string][] = [
  ["C15", "15 MPa", "Blinding and mass fill"],
  ["C20", "20 MPa", "Ground slabs and paths"],
  ["C25", "25 MPa", "Floor slabs and footings"],
  ["C30", "30 MPa", "Columns, beams and suspended slabs"],
  ["C35", "35 MPa", "Foundations and piles"],
  ["C40", "40 MPa", "Bridges and heavy structures"],
];

const mixDocs = ["Mix design submittal", "Trial mix results", "Material proportions per m³", "7- and 28-day strength records"];

// HSE commitments (company.ts) with authentic BCE site photography
const hsePhotos: [string, string][] = [
  ["/Image/bce/hse_safety.jpg", "BCE safety standards and protective equipment on site"],
  ["/Image/bce/core_services.jpg", "A site worker in an orange hard hat supervising pour"],
  ["/Image/bce/project_page_16.jpg", "Environmental protection and clean site practices"],
  ["/Image/bce/cert_mix_design.jpg", "A calibrated pressure gauge and quality testing"],
  ["/Image/bce/project_page_17.jpg", "Construction engineering team collaborating on site"],
];
const hseItems: StickyItem[] = commitments.map(([lines, text], i) => ({
  title: lines.join(" "),
  text,
  image: unsplash(hsePhotos[i % hsePhotos.length][0], 1600),
  alt: hsePhotos[i % hsePhotos.length][1],
}));

const licences: [string, string][] = [
  ["Business licence & registration", "Ministry of Commerce"],
  ["Construction licence", "Ministry of Land Management, Urban Planning and Construction"],
  ["Tax registration (VAT) certificate", "General Department of Taxation"],
  ["Company profile", "BCE Corporate Profile 2026"],
];

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
  usePageSetup("Quality & HSE | BCE Construction");
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);

  return (
    <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      {/* Header after olympic.no/sustainability-quality-safety-management-systems: title, banner, introduction. */}
      <PageHeader label="Quality & HSE" title="Tested at every stage, built safely" image={unsplash("/Image/bce/laboratory_qa.jpg", 2400)} alt="BCE quality control laboratory" />
      {/* Introduction as Our businesses' "What we do": a grey label on the left, the statement on the right. */}
      <LabelCopy label="Our approach" className="ol-head qx-intro">
        Our operations are supported by strict quality control and a clear HSE commitment, from certified materials and calibrated equipment to documented mix designs and laboratory-verified results on every project.
      </LabelCopy>

      {/* 01 Laboratory & quality assurance, after olympic.no/sustainability-safety-and-wellbeing's text block: the
          title, grey copy and the five-step process as a numbered, ruled list on the left; a photo on the right that
          holds in place while the list scrolls past. */}
      <section id="laboratory" data-header-title="Laboratory & quality assurance" aria-labelledby="qs-lab" className="qh-section qx-split">
        <div className="qx-lab-content">
          <div className="qx-lead">
            <h2 id="qs-lab" data-split className="pd-h2">Laboratory &amp; quality assurance</h2>
            <div className="qx-copy mt-10 w-[520px] max-w-full">
              <p data-split="content">Strict quality control at every stage, with slump, strength and material testing at the plant and on site. Our own laboratory checks the materials that go into our concrete, the concrete as it leaves the plant and the strength it reaches once cured.</p>
            </div>
          </div>
          <h3 data-split="content" className="qx-label qx-list-label">Our quality process</h3>
          <ol className="qx-list">
            {steps.map(([title, text], i) => (
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
          <div className="ol-px-media"><img src={unsplash("/Image/bce/cert_mix_design.jpg", 1400)} alt="Concrete test specimens side by side" loading="lazy" /></div>
        </div>
      </section>

      {/* 02 Raw material certificates, after olympic.no/sustainability-quality-safety-management-systems: a portrait
          photo on the left that holds in place, as 01's, while the materials (a two-column grid of ruled cells) scroll past on the right. */}
      <section id="raw-materials" data-header-title="Raw material certificates" aria-labelledby="qs-raw" className="qh-section qx-split qx-split--media">
        <div className="qx-body">
          <div className="qx-lead">
            <h2 id="qs-raw" data-split className="pd-h2">Raw material certificates</h2>
            <div className="qx-copy mt-10 w-[520px] max-w-full">
              <p data-split="content">Every material is certified at source and checked again before production, with certificates on file for each batch.</p>
            </div>
          </div>
          <h3 data-split="content" className="qx-label qx-list-label">Certified materials</h3>
          <ul className="qx-cells">
            {rawMaterials.map(([m, c], i) => (
              <li key={m} data-reveal className="qx-cell pd-rule" style={{ "--rd": `${(i % 2) * 0.08 + Math.floor(i / 2) * 0.1}s` } as CSSProperties}>
                <span data-split="content" className="qx-label">{m}</span>
                <span data-split="content" className="qx-cell-text">{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div data-px="media" className="pp-media qx-photo">
          <div className="ol-px-media"><img src={unsplash("/Image/bce/project_page_14.jpg", 1200)} alt="Concrete specimens and raw materials" loading="lazy" /></div>
        </div>
      </section>

      {/* 03 Calibration certificates, after olympic.no/sustainability-eco-efficient-operations: title left, copy right,
          then a full-width rule opening the equipment list, its label on the left and the ruled items on the right. */}
      <section id="calibration" data-header-title="Calibration certificates" aria-labelledby="qs-cal" className="qh-section">
        <div className="qx-split">
          <div className="qx-head">
            <h2 id="qs-cal" data-split className="pd-h2">Calibration certificates</h2>
          </div>
          <div className="qx-body qx-copy w-[520px] max-w-full">
            <p data-split="content">The scales, meters and testing machines behind every result are calibrated on schedule, with certificates on file.</p>
          </div>
        </div>
        <div data-reveal className="qx-areas pd-rule">
          <h3 data-split="content" className="qx-label qx-areas-label">Calibrated equipment</h3>
          <ul className="qx-areas-list">
            {calibrations.map(([e, w], i) => (
              <li key={e} data-reveal className={`qx-area${i ? " pd-rule" : ""}`} style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
                <span data-split="content" className="qx-label">{e}</span>
                <span data-split="content" className="qx-cell-text">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 HSE commitment, as the core values on About: one commitment at a time beside a sticky photo column. */}
      <StickyValues id="hse" label="HSE commitment" heading="HSE commitment: protecting people, working safely, respecting the environment" items={hseItems} />

      {/* 05 Mix design documents: the grades as tiles, then the documents supplied with each design. */}
      <section id="mix-design" data-header-title="Mix design documents" aria-labelledby="qs-mix" className="qh-section px-5 pt-24 md:pt-40">
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-5">
          <div className="md:col-span-6"><DocHead id="qs-mix" title="Mix design documents" text="Each grade is designed, trial-mixed and tested before supply, and submitted for consultant approval." /></div>
          <div className="md:col-span-5 md:col-start-8 md:self-end">
            <h3 data-split="content" className="text-[.95rem] text-black/45">Supplied with every mix design</h3>
            <ul className="pd-list mt-4">
              {mixDocs.map((d, i) => (
                <li key={d} data-reveal className="pd-list-row pd-rule" style={{ "--rd": `${i * 0.06}s` } as CSSProperties}>
                  <span data-split="content">{d}</span>
                  <span data-split="content" className="text-black/45">{pad(i + 1)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="qh-grades mt-14 md:mt-20" aria-label="Concrete grades">
          {grades.map(([g, mpa, use], i) => (
            <li key={g} data-reveal className="qh-grade" style={{ "--k": i } as CSSProperties}>
              <span className="text-[.9rem] text-black/45">{mpa}</span>
              <span className="qh-grade-name">{g}</span>
              <span className="qh-grade-use text-[.95rem] leading-[1.35] text-black/60">{use}</span>
            </li>
          ))}
        </ul>
        <p data-split="content" className="mt-5 text-[.875rem] text-black/40">Characteristic cube strength at 28 days. Other grades and special mixes designed on request.</p>
      </section>

      {/* 06 Licences & certifications */}
      <section id="licences" data-header-title="Licences & certifications" aria-labelledby="qs-lic" className="qh-section px-5 pb-24 pt-24 md:pb-40 md:pt-40">
        <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-5">
          <div className="md:col-span-6">
            <h2 id="qs-lic" data-split className="pd-h2">Licences &amp; certifications</h2>
          </div>
          <div className="w-full md:col-span-6 md:col-start-7">
            <p data-split className="pd-statement">Registration, licences and our company profile for procurement teams and tender reviewers, available on request.</p>
            <ul className="pd-list mt-12 md:mt-16">
              {licences.map(([d, issuer], i) => (
                <li key={d} data-reveal className="pd-list-row qh-row pd-rule" style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
                  <span data-split="content" className="font-medium">{d}</span>
                  <span data-split="content" className="text-black/55">{issuer}</span>
                  <span data-split="content" className="qh-status">On request</span>
                </li>
              ))}
            </ul>
            <ArrowButton href="#contact" label="Request documents" className="mt-10" />
          </div>
        </div>
      </section>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
