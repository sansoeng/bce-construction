import { useCallback, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { useMediaReveal, usePageSetup } from "./usePageSetup";
import { offerings, quoteHref, unsplash, type Business } from "./company";
import { projectHref } from "./projects";
import { CardSlider, DarkMedia, LabelCopy, OlButton, ParallaxHero, ReadMoreDialog, TextMedia, useScrollParallax, type DialogContent, type SlideItem } from "./ServiceBlocks";

// Our Businesses, after olympic.no/what-we-do-services: the parallax cover, "What we do", one full-screen text and
// media panel per business (alternating sides, "Read more" opens the detail sheet), Laboratory & Quality Assurance
// as the dark band, then Technical Capabilities as the looping card slider with "Explore more" to /?capabilities.
// The homepage's "+" buttons land on each business panel (/?businesses#<slug>).
// Photos: stand-ins from Unsplash (incl. Ray Donnelly, ThisisEngineering, uve sanchez, Toni Reed, Daniel Miksha).

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

// Read-more copy per business: label, one-line lead, description and the typical work.
const detail: Record<string, { kicker: string; lead: string; body: string[]; typical: string[] }> = {
  "ready-mix-concrete": {
    kicker: "From plant to pour",
    lead: "Quality-controlled concrete, produced and delivered by our own team.",
    body: [
      "Our four batching plants each produce 70 m³ an hour, and our own fleet of 41 mixer trucks delivers across 13 provinces and Phnom Penh.",
      "Every batch is weighed and mixed to an approved mix design, slump-tested on delivery and sampled for compressive strength in our laboratory, so the concrete placed on site is the concrete that was specified.",
    ],
    typical: ["Structural concrete, C15 to C40", "Blinding and mass concrete", "Pumped and direct-discharge pours", "Large continuous pours", "Laboratory-approved mix designs", "Delivery across 13 provinces + Phnom Penh"],
  },
  piling: {
    kicker: "Where every structure begins",
    lead: "Foundations installed with our own rigs, crews and concrete.",
    body: [
      "Reinforced concrete piles for bridges, roads, industrial, commercial and residential projects, installed by our own crews.",
      "Owning the rigs, the batching plants and the laboratory lets us plan piling programmes end to end, from mobilisation and installation to the testing records handed over with the works.",
    ],
    typical: ["Reinforced concrete piles", "Bridge and road foundations", "Industrial and commercial foundations", "Residential foundations", "Own piling rigs and crews", "Quality records for every pile"],
  },
  construction: {
    kicker: "Built end to end",
    lead: "Civil construction backed by our own materials, equipment and engineers.",
    body: [
      "From site preparation to structure, our engineers and site teams deliver infrastructure, industrial, commercial and residential projects.",
      "Concrete comes from our own plants and equipment from our own fleet, so programme, quality and cost stay under one roof.",
    ],
    typical: ["Roads and infrastructure", "Factories and warehouses", "Commercial buildings", "Residential developments", "Concrete structures and frames", "Site supervision by our engineers"],
  },
  "concrete-slab-works": {
    kicker: "Placed and finished",
    lead: "Slabs pumped, placed and finished to specification.",
    body: [
      "Our crews place and finish slabs with ready-mix from our plants, pumped by our own fleet of 8 pump trucks.",
      "Each delivery is tested for slump and sampled for strength, and every pour is recorded for the project.",
    ],
    typical: ["Ground-bearing floor slabs", "Suspended slabs", "Warehouse and factory floors", "Yards and hardstands", "Pumped placement with 8 pump trucks", "Slump and strength testing"],
  },
  "equipment-rental": {
    kicker: "Ready to mobilise",
    lead: "Our fleet, available for your project.",
    body: [
      "Mixer trucks, pump trucks and piling rigs, maintained by our own team and ready to mobilise across Cambodia.",
      "Experienced operators are available with every machine, so the equipment arrives with the people who know it best.",
    ],
    typical: ["Concrete mixer trucks", "Concrete pump trucks", "Piling rigs", "Experienced operators", "Maintained by our own team", "Mobilisation across Cambodia"],
  },
};

// Technical capabilities, one card per topic of the Technical Capabilities page.
const capabilities: SlideItem[] = [
  { title: "Quality assurance", text: "Five checks on every project, from raw material to verified strength.", image: unsplash("/Image/bce/core_services.jpg", 1400), alt: "Engineers measuring a concrete wall" },
  { title: "Laboratory", text: "Slump, compressive strength and material testing in our own laboratory.", image: unsplash("/Image/bce/laboratory_qa.jpg", 1400), alt: "Concrete test specimens" },
  { title: "Mix designs", text: "Grades C15 to C40, trial-mixed and documented for consultant approval.", image: unsplash("/Image/bce/cert_mix_design.jpg", 1400), alt: "An engineer measuring technical drawings" },
  { title: "Materials & certificates", text: "Cement, aggregates and admixtures certified at source and checked again.", image: unsplash("/Image/bce/project_page_14.jpg", 1400), alt: "A loader filling a truck with aggregate" },
  { title: "Equipment & fleet", text: "4 batching plants, 41 mixer trucks, 8 pump trucks and our own piling rigs.", image: unsplash("/Image/bce/machinery_fleet.jpg", 1400), alt: "Concrete mixer trucks" },
  { title: "Engineering capability", text: "15 engineers in a team of 71, planning and supervising every project.", image: unsplash("/Image/bce/stats_fleet.jpg", 1400), alt: "An engineer inspecting reinforcement on site" },
];

const SERVICE_PROJECTS: Record<string, { slug: string; name: string }> = {
  "ready-mix-concrete": {
    slug: "siem-reap-commercial-ready-mix",
    name: "Commercial Complex Ready-Mix Supply",
  },
  piling: {
    slug: "kampong-thom-bridge-foundations",
    name: "Bridge Foundation Piling",
  },
  construction: {
    slug: "battambang-provincial-road",
    name: "Provincial Road Rehabilitation",
  },
  "concrete-slab-works": {
    slug: "poipet-logistics-warehouse",
    name: "Logistics Warehouse Floor Slab",
  },
  "equipment-rental": {
    slug: "sihanoukville-fleet-hire",
    name: "Pump & Mixer Fleet Hire",
  },
};

const toDialog = (b: Business): DialogContent => {
  const d = detail[b.slug];
  const rel = SERVICE_PROJECTS[b.slug];
  return {
    kicker: d.kicker,
    title: b.name,
    image: b.image.replace("w=1200", "w=1400"),
    lead: d.lead,
    body: d.body,
    listLabel: "Typical work includes:",
    list: d.typical,
    quoteHref: quoteHref(b.slug),
    projectHref: rel ? projectHref(rel.slug) : undefined,
    projectLabel: rel?.name,
  };
};

export default function BusinessesPage() {
  usePageSetup("Our Businesses | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);

  // `shown` keeps the last business in the sheet while it slides out.
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<DialogContent | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const openDialog = (b: Business) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setShown(toDialog(b));
    setOpen(true);
  };
  const closeDialog = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero label="Our businesses" title="Building with expertise" image={unsplash("/Image/bce/hero_batching_plant.jpg", 2400)} />

      <div className="ol-page-body">
        <LabelCopy label="What we do">
          BCE supports projects across infrastructure, industry, commerce and housing. Whatever the project, our role stays the same: providing the concrete, foundations, equipment and expertise that help clients build, deliver and maintain lasting structures across Cambodia.
        </LabelCopy>

        <div className="ol-panels">
          {offerings.map((b, i) => (
            <TextMedia key={b.slug} id={b.slug} kicker={detail[b.slug].kicker} title={b.name} image={b.image.replace("w=1200", "w=1600")} alt={b.name} reverse={i % 2 === 1} copy={[b.intro]}>
              <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-4">
                <OlButton label="Read more" onClick={() => openDialog(b)} className="!self-auto" />
                <ArrowButton href={quoteHref(b.slug)} label="Request a quote" theme="outline" className="!self-auto" />
              </div>
            </TextMedia>
          ))}
        </div>

        <DarkMedia id="laboratory" kicker="Tested at every stage" title="Laboratory & quality assurance" image={unsplash("/Image/bce/laboratory_qa.jpg", 1800)} alt="An engineer at work in the laboratory"
          copy={[
            "Concrete is only as reliable as the testing behind it. Our own laboratory checks every material before production and every pour after it.",
            "With slump testing on delivery, compressive strength testing and documented mix designs, every structure we supply is built on verified results.",
          ]}>
          <OlButton label="Read more" href="/?quality#laboratory" dark className="ol-tm-button" />
        </DarkMedia>

        <section id="capabilities" data-header-title="Technical capabilities" aria-labelledby="ol-caps" className="ol-onboard">
          <div className="ol-onboard-header">
            <p data-split="content" className="ol-label">Plants, fleet, laboratory and people</p>
            <h2 id="ol-caps" data-split className="ol-onboard-heading">Technical capabilities</h2>
          </div>
          <CardSlider items={capabilities} label="Technical capabilities" />
          <div className="ol-onboard-more">
            <OlButton label="Explore more" href="/?capabilities" />
          </div>
        </section>
      </div>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
      <ReadMoreDialog content={shown} open={open} onClose={closeDialog} />
    </main>
  );
}
