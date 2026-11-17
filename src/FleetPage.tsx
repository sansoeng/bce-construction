import { siteSettings } from "./siteSettings";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { useScrollParallax, ParallaxHero } from "./ServiceBlocks";
import { quality } from "./quality";

// Equipment & fleet (/fleet), the standalone page the Recommendation's sitemap asks for: what BCE owns, how many, what
// each machine is for, and how to hire it. Every figure comes from quality.ts (the Quality page's own document) so the
// two pages cannot disagree. No rates and no per-machine availability are published — both are quoted per project.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

const MACHINES = [
  {
    title: "Batching plants",
    value: "4",
    note: "70 m³/hr each",
    text: "Computerized batching with calibrated weigh scales for cement, aggregate, water and admixture, checked before every pour.",
    image: "/Image/bce/about-zoom-batching.webp",
    alt: "Aggregate stockpiles and batching plant at the BCE yard",
  },
  {
    title: "Mixer trucks",
    value: "41",
    note: "Delivering across 13 provinces + Phnom Penh",
    text: "Owned and maintained by BCE crews, dispatched from Battambang on a planned schedule rather than a broker's availability.",
    image: "/Image/bce/machinery_fleet.webp",
    alt: "BCE mixer trucks lined up at the plant",
  },
  {
    title: "Pump trucks",
    value: "8",
    note: "Boom reach up to 48 m",
    text: "Placing concrete where the mixer cannot reach, with operators who work to the pour sequence.",
    image: "/Image/bce/about-zoom-boom-pumps.webp",
    alt: "Boom pump placing concrete on a BCE site",
  },
  {
    title: "Piling rigs",
    value: "7",
    note: "Bore and hammer rigs",
    text: "Reinforced concrete piles installed and tested by our own rigs and crews, from the platform to the pile cap.",
    image: "/Image/bce/about-zoom-piling-rig.webp",
    alt: "BCE piling rig working on site",
  },
];

export default function FleetPage() {
  usePageSetup("Equipment & fleet | BCE., Ltd.");

  const rows = quality.fleet.rows;

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]">
        <ParallaxHero
          label={quality.fleet.kicker}
          title={quality.fleet.title}
          image={quality.fleet.image}
          alt={quality.fleet.imageAlt}
        />

        <div className="ol-page-body">
          <section aria-labelledby="fleet-intro" className="site-pad pb-16 pt-4 md:pb-24">
            <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-12">
              <h1 id="fleet-intro" className="sr-only">
                Equipment &amp; fleet
              </h1>
              <p data-split="content" className="text-[clamp(1.25rem,1.9vw,1.8rem)] font-medium leading-[1.35] tracking-[-.02em] md:col-span-7">
                {quality.fleet.copy[0]}
              </p>
              <div className="flex flex-col gap-5 md:col-span-4 md:col-start-9">
                <p className="text-[15px] leading-[1.65] text-[#111]/55">
                  Equipment is dispatched from Battambang and mobilised to projects across 13 provinces and Phnom Penh.
                  Hire is quoted per project: machine, duration, site access and operator included or not.
                </p>
                <div className="flex flex-wrap gap-3">
                  <ArrowButton href="/quote?service=equipment-rental" label="Hire our equipment" />
                  <ArrowButton href="/quality#equipment-fleet" label="Quality & HSE" theme="outline" />
                </div>
              </div>
            </div>
          </section>

          {/* The inventory, exactly as the Quality page publishes it. */}
          <section aria-labelledby="fleet-inventory" className="site-pad border-t border-[#111]/10 py-16 md:py-24">
            <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="ol-label">Inventory</p>
                <h2 id="fleet-inventory" data-split className="mt-4 max-w-[16ch] text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-.03em]">
                  What we own, in numbers.
                </h2>
                <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.6] text-[#111]/55">
                  Counts are from BCE's own fleet records. The laboratory's testing equipment is listed on the Quality
                  page, not here.
                </p>
              </div>
              <dl className="divide-y divide-[#111]/10 md:col-span-7 md:col-start-6">
                {rows.map((row) => (
                  <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
                    <dt className="text-[16px] font-medium leading-snug">{row.label}</dt>
                    <dd className="font-mono text-[13px] text-[#111]/55">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* The machines themselves, with what each one is for. */}
          <section aria-labelledby="fleet-machines" className="site-pad border-t border-[#111]/10 py-16 md:py-24">
            <div className="mx-auto max-w-[1200px]">
              <h2 id="fleet-machines" data-split className="max-w-[20ch] text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-.03em]">
                Plant and machines, maintained in-house.
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {MACHINES.map((machine) => (
                  <article key={machine.title} className="flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden bg-[#EDEDED]">
                      <img src={machine.image} alt={machine.alt} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-5 flex items-baseline justify-between gap-4">
                      <h3 className="text-[19px] font-medium leading-snug">{machine.title}</h3>
                      <span className="font-mono text-[22px] leading-none tabular-nums">{machine.value}</span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-[#111]/45">{machine.note}</p>
                    <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.6] text-[#111]/60">{machine.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* How hiring works, without rates. */}
          <section aria-labelledby="fleet-hire" className="site-pad border-t border-[#111]/10 bg-[#F8F8F9] py-16 md:py-24">
            <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="ol-label">Hire</p>
                <h2 id="fleet-hire" data-split className="mt-4 max-w-[14ch] text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-.03em]">
                  Mobilised to your site.
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <ol className="divide-y divide-[#111]/10">
                  {[
                    "Tell us the machine, the duration and the site location.",
                    "We confirm availability, mobilisation from Battambang and the delivery date.",
                    "Operator, fuel and maintenance are agreed up front, in writing.",
                    "The machine arrives with our own crew and is supported by our workshop.",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-5 py-4">
                      <span className="font-mono text-[12px] leading-[1.9] text-[#111]/35">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-[16px] leading-[1.55] text-[#111]/75">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ArrowButton href="/quote?service=equipment-rental" label="Request equipment" />
                  <ArrowButton href={tel(phones[0])} label={`Call ${phones[0]}`} theme="outline" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <QuoteCta href="/quote?service=equipment-rental" />
      </main>
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </>
  );
}
