import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { siteSettings } from "./siteSettings";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { LabelCopy, ParallaxHero } from "./ServiceBlocks";
import { FilterBar, FilterMeta, type FilterFacet, type FilterSelection } from "./FilterBar";
import { partners } from "./partners";
import { quoteHref } from "./company";
import { translate } from "./i18n";
import "./projects.css";

// Clients, partners and key suppliers (/partners), on the same page system as Projects, Quality and Coverage: the
// photographic cover, the labelled introduction, then the shared filter bar and the partner-logo register.
//
// The register comes from src/partners.ts, transcribed from the BCE Corporate Profile 2026 (pages 34–35). The
// homepage section shows only the featured logos from the same document; this page carries every name. No new
// layout: the cover is ParallaxHero, the introduction is LabelCopy, the filter is FilterBar/FilterMeta, and the
// register reuses the homepage's two-column glance layout — each group's sticky title on the left, its logos on the
// right — so the title always names the section in view. The orange eyebrow (`tag`) and the per-section count sit with
// the title; the total count is deliberately absent.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

const emptySelection = (): FilterSelection => ({ group: [] });

/** Keep the chosen groups in the address, as the project archive does, so a shared link keeps the filter. */
const selectionFromUrl = (): FilterSelection => {
  const params = new URLSearchParams(location.search);
  const wanted = params.getAll("group");
  if (!wanted.length) return emptySelection();
  return { group: partners.groups.map((group) => group.id).filter((id) => wanted.includes(id)) };
};

export default function PartnersPage() {
  usePageSetup(
    "Clients, Partners & Key Suppliers | BCE",
    "The organisations BCE works with across Cambodia: government institutions, contractors, developers, corporate clients and key materials suppliers.",
  );

  const [selection, setSelection] = useState<FilterSelection>(selectionFromUrl);

  const facets: FilterFacet[] = [
    {
      key: "group",
      label: translate("Group"),
      options: partners.groups.map((group) => ({
        value: group.id,
        label: translate(group.shortLabel),
        count: group.items.length,
      })),
    },
  ];

  const visibleGroups = useMemo(() => {
    const chosen = selection.group ?? [];
    return partners.groups
      .filter((group) => chosen.length === 0 || chosen.includes(group.id))
      .map((group) => ({ ...group, items: group.items }));
  }, [selection]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.delete("group");
    (selection.group ?? []).forEach((value) => params.append("group", value));
    const query = params.toString();
    history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
  }, [selection]);

  const toggleValue = (key: string, value: string) =>
    setSelection((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));

  const clearFacet = (key: string) => setSelection((current) => ({ ...current, [key]: [] }));
  const clearAll = () => setSelection(emptySelection());

  return (
    <main className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <ParallaxHero
        label={translate(partners.kicker)}
        title={partners.titleLines}
        image="/Image/bce/about-business-banner.webp"
        alt="BCE engineers, contractors and partners on a completed concrete slab"
        headerTitle={translate(partners.kicker)}
      />

      <div className="ol-page-body">
        <LabelCopy label={translate("Introduction")} className="ol-head qx-intro">
          {translate(partners.intro)}
        </LabelCopy>

        <div className="pl-shell pb-24 md:pb-32">
          <FilterBar
            facets={facets}
            selection={selection}
            onToggle={toggleValue}
            onClearFacet={clearFacet}
            onClearAll={clearAll}
            label={translate("Filter clients & partners")}
          />

          <div className="fx-meta-row">
            <FilterMeta facets={facets} selection={selection} onToggle={toggleValue} />
          </div>

          {visibleGroups.map((group, groupIndex) => (
            <section
              key={group.id}
              className={`glance-layout${groupIndex ? " mt-20 md:mt-28" : ""}`}
              aria-labelledby={`pt-group-${group.id}`}
            >
              <div className="glance-title-col">
                <div className="glance-title-sticky">
                  <p className="ol-label mb-3">{translate(group.tag)}</p>
                  <h2
                    id={`pt-group-${group.id}`}
                    className="glance-title text-[clamp(2.4rem,3.6vw,4.2rem)] font-medium leading-[1.08] tracking-[-.025em]"
                  >
                    {translate(group.label)}
                  </h2>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.06em] text-[#111]/35">
                    {group.items.length} {translate(group.items.length === 1 ? "partner" : "partners")}
                  </p>
                </div>
              </div>

              <div className="glance is-in">
                <ul className="glance-grid glance-logos">
                  {group.items.map((item, index) => (
                    <li
                      key={item.name}
                      className="glance-cell glance-logo"
                      style={
                        {
                          "--i": index,
                          "--r": Math.floor(index / 2),
                          "--c": index % 2,
                        } as CSSProperties
                      }
                    >
                      <span className="glance-logo-mask">
                        <span className="glance-logo-inner">
                          {item.logo ? (
                            <img src={item.logo} alt={`${item.name} logo`} loading="lazy" decoding="async" />
                          ) : (
                            <span className="glance-wordmark">{item.name}</span>
                          )}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}

          <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-[#111]/10 pt-8">
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-[#111]/55">{translate(partners.registerNote)}</p>
            <ArrowButton
              href="/assets/BCE_Corporate_Profile_2026_web.pdf"
              label={translate("Download the Corporate Profile")}
              theme="outline"
            />
          </div>
          <p className="mt-6 max-w-[80ch] font-mono text-[10px] leading-relaxed tracking-[0.03em] text-[#111]/40">
            {translate(partners.footnote)}
          </p>
        </div>
      </div>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
