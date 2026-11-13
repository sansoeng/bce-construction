import { siteSettings } from "./siteSettings";
import { useRef, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { quoteHref, unsplash } from "./company";
import { DarkMedia, LabelCopy, OlButton, ParallaxHero, TextMedia, useScrollParallax } from "./ServiceBlocks";

// Technical Capabilities (/?capabilities), reached from "Explore more" on Our Businesses. Same Olympic-style blocks:
// the parallax cover, an overview with links to each topic, then one full-screen panel per topic (Equipment & Fleet
// as the dark band), each with a ruled list of the detail. Grades, materials and test lists are sample content until
// BCE confirms them. Photos: stand-ins from Unsplash.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

const topics: [string, string][] = [
  ["quality-assurance", "Quality assurance"],
  ["laboratory", "Laboratory"],
  ["mix-designs", "Mix designs"],
  ["materials-certificates", "Materials & certificates"],
  ["equipment-fleet", "Equipment & fleet"],
  ["engineering", "Engineering capability"],
];

function Rows({ rows, dark = false }: { rows: [string, string][]; dark?: boolean }) {
  return (
    <ul className={`ol-rows ${dark ? "ol-rows--dk" : ""}`}>
      {rows.map(([a, b], i) => (
        <li key={a} data-reveal className="ol-row" style={{ "--k": i } as CSSProperties}>
          <span>{a}</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CapabilitiesPage() {
  usePageSetup("Technical Capabilities | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero label="Technical capabilities" title="Engineered and tested in-house" image={unsplash("/Image/bce/hero_batching_plant.webp", 2400)} />

      <div className="ol-page-body">
        <LabelCopy label="Overview" after={
          <ul className="ol-topics" aria-label="On this page">
            {topics.map(([id, label], i) => (
              <li key={id}><a href={`#${id}`}><span>{pad(i + 1)}</span>{label}</a></li>
            ))}
          </ul>
        }>
          Behind every BCE project is the capability to test, design and deliver concrete in-house: a quality process on every pour, our own laboratory, approved mix designs, certified materials, a fleet we own and maintain, and the engineers who bring it together.
        </LabelCopy>

        <div className="ol-panels">
          <TextMedia id="quality-assurance" kicker="Tested at every stage" title="Quality assurance" image={unsplash("/Image/bce/core_services.webp", 1600)} alt="Engineers measuring a concrete wall"
            copy={["Strict quality control at every stage, from the materials that arrive at our plants to the strength of the concrete on site. Every result is recorded for the project."]}>
            <Rows rows={[
              ["01  Material check", "Before production"],
              ["02  Production control", "Every batch weighed"],
              ["03  Fresh concrete test", "Slump on delivery"],
              ["04  Strength test", "Cured and crushed"],
              ["05  Quality verification", "Recorded per project"],
            ]} />
          </TextMedia>

          <TextMedia id="laboratory" reverse kicker="Our own laboratory" title="Laboratory" image={unsplash("/Image/bce/laboratory_qa.webp", 1600)} alt="An engineer at work in the laboratory"
            copy={["Our laboratory tests materials before they enter production and concrete after it leaves the plant, at the plant and on site."]}>
            <Rows rows={[
              ["Slump testing", "Every delivery"],
              ["Compressive strength", "7- and 28-day cubes"],
              ["Aggregate grading", "Sieve analysis"],
              ["Silt and moisture content", "Fine and coarse aggregate"],
              ["Trial mixes", "For every new design"],
            ]} />
          </TextMedia>

          <TextMedia id="mix-designs" kicker="Designed for every pour" title="Mix designs" image={unsplash("/Image/bce/cert_mix_design.webp", 1600)} alt="An engineer measuring technical drawings"
            copy={["Each grade is designed, trial-mixed and tested before supply, then submitted with its results for consultant approval. Special mixes are designed on request."]}>
            <Rows rows={[
              ["C15  /  15 MPa", "Blinding and mass fill"],
              ["C20  /  20 MPa", "Ground slabs and paths"],
              ["C25  /  25 MPa", "Floor slabs and footings"],
              ["C30  /  30 MPa", "Columns, beams, suspended slabs"],
              ["C35  /  35 MPa", "Foundations and piles"],
              ["C40  /  40 MPa", "Bridges and heavy structures"],
            ]} />
          </TextMedia>

          <TextMedia id="materials-certificates" reverse kicker="Certified at source" title="Materials & certificates" image={unsplash("/Image/bce/project_page_14.webp", 1600)} alt="A loader filling a truck with aggregate"
            copy={["Every material that goes into our concrete is certified at source and checked again before production. Certificates are available on request."]}>
            <Rows rows={[
              ["Cement", "Mill test certificate"],
              ["Fine aggregate", "Grading and silt content"],
              ["Coarse aggregate", "Grading and crushing value"],
              ["Admixtures", "Product compliance certificate"],
              ["Mixing water", "Water quality results"],
              ["Calibration", "Scales, meters, test machine"],
            ]} />
            <OlButton label="Quality & HSE documents" href="/?quality#raw-materials" className="ol-tm-button" />
          </TextMedia>
        </div>

        <DarkMedia id="equipment-fleet" kicker="Our own fleet" title="Equipment & fleet" image={unsplash("/Image/bce/machinery_fleet.webp", 1800)} alt="Concrete mixer trucks"
          copy={["Our plants and fleet are owned, operated and maintained by our own team, so capacity is planned around your programme rather than a supplier's."]}>
          <Rows dark rows={[
            ["Batching plants", "04  /  70 m³/hr each"],
            ["Mixer trucks", "41"],
            ["Pump trucks", "08"],
            ["Piling rigs", "Own rigs and crews"],
          ]} />
          <OlButton label="Hire our equipment" href={quoteHref("equipment-rental")} dark className="ol-tm-button" />
        </DarkMedia>

        <div className="ol-panels ol-panels--after-dark">
          <TextMedia id="engineering" kicker="People behind every project" title="Engineering capability" image={unsplash("/Image/bce/stats_fleet.webp", 1600)} alt="An engineer inspecting reinforcement on site"
            copy={["Our engineers plan, design and supervise every project, from mix design and piling programmes to site supervision and handover records."]}>
            <Rows rows={[
              ["Engineers", "15"],
              ["Team", "71"],
              ["Building since", "1995"],
              ["Coverage", "13 provinces + Phnom Penh"],
            ]} />
          </TextMedia>
        </div>
      </div>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
