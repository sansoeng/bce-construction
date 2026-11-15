import { siteSettings } from "./siteSettings";
import { useRef, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { quoteHref, unsplash } from "./company";
import { DarkMedia, LabelCopy, OlButton, ParallaxHero, TextMedia, useScrollParallax } from "./ServiceBlocks";
import { capabilities, type CapabilityRow } from "./capabilities";

// Technical Capabilities (/?capabilities), reached from "Explore more" on Our Businesses. Same Olympic-style blocks:
// the parallax cover, an overview with links to each topic, then one full-screen panel per topic (Equipment & Fleet
// as the dark band), each with a ruled list of the detail.
// Copy, figures and photos come from `src/capabilities.ts`, which the admin edits through D1. The anchor ids stay in
// code because other pages link to them (e.g. /?quality#raw-materials).

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

// Anchor ids, in the order the panels appear.
const TOPICS = [
  ["quality-assurance", "qualityAssurance"],
  ["laboratory", "laboratory"],
  ["mix-designs", "mixDesigns"],
  ["materials-certificates", "materials"],
  ["equipment-fleet", "equipment"],
  ["engineering", "engineering"],
] as const;

function Rows({ rows, dark = false }: { rows: CapabilityRow[]; dark?: boolean }) {
  return (
    <ul className={`ol-rows ${dark ? "ol-rows--dk" : ""}`}>
      {rows.map((row, i) => (
        <li key={row.label} data-reveal className="ol-row" style={{ "--k": i } as CSSProperties}>
          <span>{row.label}</span>
          <span>{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CapabilitiesPage() {
  usePageSetup("Technical Capabilities | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  const { qualityAssurance, laboratory, mixDesigns, materials, equipment, engineering } = capabilities;

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero
        label={capabilities.cover.label}
        title={capabilities.cover.title}
        image={unsplash(capabilities.cover.image, 2400)}
        alt={capabilities.cover.imageAlt}
      />

      <div className="ol-page-body">
        <LabelCopy label={capabilities.overview.label} after={
          <ul className="ol-topics" aria-label="On this page">
            {TOPICS.map(([id, key], i) => (
              <li key={id}><a href={`#${id}`}><span>{pad(i + 1)}</span>{capabilities[key].title}</a></li>
            ))}
          </ul>
        }>
          {capabilities.overview.text}
        </LabelCopy>

        <div className="ol-panels">
          <TextMedia id="quality-assurance" kicker={qualityAssurance.kicker} title={qualityAssurance.title} image={unsplash(qualityAssurance.image, 1600)} alt={qualityAssurance.imageAlt}
            copy={qualityAssurance.copy}>
            <Rows rows={qualityAssurance.rows} />
          </TextMedia>

          <TextMedia id="laboratory" reverse kicker={laboratory.kicker} title={laboratory.title} image={unsplash(laboratory.image, 1600)} alt={laboratory.imageAlt}
            copy={laboratory.copy}>
            <Rows rows={laboratory.rows} />
          </TextMedia>

          <TextMedia id="mix-designs" kicker={mixDesigns.kicker} title={mixDesigns.title} image={unsplash(mixDesigns.image, 1600)} alt={mixDesigns.imageAlt}
            copy={mixDesigns.copy}>
            <Rows rows={mixDesigns.rows} />
          </TextMedia>

          <TextMedia id="materials-certificates" reverse kicker={materials.kicker} title={materials.title} image={unsplash(materials.image, 1600)} alt={materials.imageAlt}
            copy={materials.copy}>
            <Rows rows={materials.rows} />
            <OlButton label={materials.ctaLabel} href={materials.ctaHref} className="ol-tm-button" />
          </TextMedia>
        </div>

        <DarkMedia id="equipment-fleet" kicker={equipment.kicker} title={equipment.title} image={unsplash(equipment.image, 1800)} alt={equipment.imageAlt}
          copy={equipment.copy}>
          <Rows dark rows={equipment.rows} />
          <OlButton label={equipment.ctaLabel} href={equipment.ctaHref} dark className="ol-tm-button" />
        </DarkMedia>

        <div className="ol-panels ol-panels--after-dark">
          <TextMedia id="engineering" kicker={engineering.kicker} title={engineering.title} image={unsplash(engineering.image, 1600)} alt={engineering.imageAlt}
            copy={engineering.copy}>
            <Rows rows={engineering.rows} />
          </TextMedia>
        </div>
      </div>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
