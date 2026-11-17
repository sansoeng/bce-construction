import ArrowButton from "./ArrowButton";
import { quality } from "./quality";

// Two homepage evidence bands, after "Why BCE" and before the closing quotation block:
//   · the quality process the Recommendation asks to show on the homepage (it currently only lives on /quality)
//   · the fleet, so capacity is visible without scrolling the Quality page.
// Both read src/quality.ts, so the numbers cannot drift from the Quality page. Labels reuse existing translations.

const LABEL = "font-mono text-[14px] uppercase leading-[1.6] tracking-[0.02em] text-[#FB290E]";

export function QualityBand() {
  const laboratory = quality.laboratory;
  const tests = laboratory.tests.slice(0, 4);
  return (
    <section
      id="quality-evidence"
      data-header-title="Quality assurance"
      aria-labelledby="home-quality-title"
      className="site-bleed site-pad border-t border-[#111]/10 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <p className={LABEL}>Quality assurance</p>
          <h2
            id="home-quality-title"
            className="mt-4 max-w-[14ch] text-[clamp(30px,3.4vw,48px)] font-medium leading-[1.04] tracking-[-.03em]"
          >
            Tested at every stage
          </h2>
          <p className="mt-5 max-w-[36ch] text-[15px] leading-[1.65] text-[#111]/55">{laboratory.copy}</p>
          <ArrowButton href="/quality#laboratory" label="Explore Quality & HSE" className="mt-7" />
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <div className="flex items-center justify-between border-b border-[#111]/12 pb-3">
            <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-[#111]/40">{laboratory.listLabel}</span>
          </div>
          <dl className="divide-y divide-[#111]/10">
            {tests.map((test) => (
              <div key={test.label} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <dt className="text-[16px] font-medium leading-snug">{test.label}</dt>
                <dd className="font-mono text-[13px] text-[#111]/55">{test.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 max-w-[46ch] text-[13px] leading-[1.6] text-[#111]/45">
            Every pour is checked at the plant and on site, with cube results recorded against the approved mix design.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FleetBand() {
  const fleet = quality.fleet;
  // The four figures a procurement reader looks for; fall back to the first four when the labels change.
  const wanted = ["Batching plants", "Mixer trucks", "Pump trucks", "Piling rigs"];
  const picked = wanted.map((label) => fleet.rows.find((row) => row.label === label)).filter(Boolean) as typeof fleet.rows;
  const rows = picked.length === 4 ? picked : fleet.rows.slice(0, 4);
  return (
    <section
      id="fleet-evidence"
      data-header-title="Equipment & fleet"
      aria-labelledby="home-fleet-title"
      className="site-bleed site-pad border-t border-[#111]/10 bg-[#F8F8F9] py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <p className={LABEL}>{fleet.kicker}</p>
          <h2
            id="home-fleet-title"
            className="mt-4 max-w-[14ch] text-[clamp(30px,3.4vw,48px)] font-medium leading-[1.04] tracking-[-.03em]"
          >
            {fleet.title}
          </h2>
          <p className="mt-5 max-w-[36ch] text-[15px] leading-[1.65] text-[#111]/55">{fleet.copy[0]}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ArrowButton href="/quality#equipment-fleet" label="Equipment & fleet" theme="outline" />
            <ArrowButton href={fleet.ctaHref} label={fleet.ctaLabel} />
          </div>
        </div>

          <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-7 md:col-start-6 md:grid-cols-4">
          {rows.map((row) => {
            // "04  /  70 m³/hr each" reads badly as a headline number: the count leads, the capacity becomes a note.
            const [head, ...rest] = row.value.split("/").map((part) => part.trim());
            return (
              <li key={row.label}>
                <span className="block text-[clamp(34px,4vw,56px)] font-medium leading-none tracking-[-.04em] tabular-nums">
                  {head}
                </span>
                <span className="mt-2 block text-[13px] leading-[1.5] text-[#111]/55">{row.label}</span>
                {rest.length > 0 && (
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.05em] text-[#111]/40">
                    {rest.join(" / ")}
                  </span>
                )}
              </li>
            );
          })}
          </ul>
      </div>
    </section>
  );
}
