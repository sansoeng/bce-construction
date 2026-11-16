import { siteSettings } from "./siteSettings";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { useMediaReveal, usePageSetup } from "./usePageSetup";
import { LabelCopy, OlButton, ParallaxHero, TextMedia, useScrollParallax } from "./ServiceBlocks";
import StickyValues, { type StickyItem } from "./StickyValues";
import { quoteHref, unsplash } from "./company";
import { quality } from "./quality";

// Quality, capability & HSE (/?quality), for contractors, consultants and tender reviewers. One page, one narrative:
// how the concrete is tested (laboratory and the five-step process), what is designed (concrete grades), what goes in
// (raw material and calibration certificates), the HSE commitment, the plant and fleet, who runs it (engineering), and
// the documents procurement asks for.
//
// The former Technical Capabilities page (/?capabilities) is merged in: its quality-assurance, laboratory and
// materials panels repeated this page's process, testing list and certificate rows, so only the engineering and fleet
// panels survived. Old links still resolve — /?capabilities rewrites to this page and its superseded anchors map to the
// surviving sections (see LEGACY_ANCHORS).
//
// Copy and photos come from `src/quality.ts`, which the admin console edits through D1.
// Document lists are sample content until BCE confirms them and publishes the files.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

// Anchor ids, in the order the sections appear. The list doubles as the on-page index under the introduction.
const TOPICS = [
  ["laboratory", "laboratory"],
  ["grades", "grades"],
  ["raw-materials", "materials"],
  ["calibration", "calibration"],
  ["hse", "hse"],
  ["equipment-fleet", "equipment"],
  ["engineering", "engineering"],
  ["documents", "documents"],
] as const;

// Anchors the retired Technical Capabilities page used, and where that content now lives.
const LEGACY_ANCHORS: Record<string, string> = {
  "quality-assurance": "laboratory",
  "mix-designs": "grades",
  "materials-certificates": "raw-materials",
};

function Rows({ rows, dark = false }: { rows: { label: string; value: string }[]; dark?: boolean }) {
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

export default function QualityPage({ fromCapabilities = false }: { fromCapabilities?: boolean }) {
  // /?capabilities rewrites to this page before usePageSetup reads the hash, so old inbound links (and the anchor
  // that content moved to) still land on the right section. Guarded so React's double-run in development cannot
  // rewrite the already canonical URL.
  useEffect(() => {
    if (!fromCapabilities) return;
    const params = new URLSearchParams(location.search);
    if (!params.has("capabilities")) return;
    params.delete("capabilities");
    const query = params.toString();
    const raw = decodeURIComponent(location.hash.slice(1));
    const anchor = LEGACY_ANCHORS[raw] || raw;
    history.replaceState(history.state, "", `/?quality${query ? `&${query}` : ""}${anchor ? `#${anchor}` : ""}`);
  }, [fromCapabilities]);

  usePageSetup("Quality, Capability & HSE | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useMediaReveal(rootRef);
  useScrollParallax(rootRef);

  // Copy-link feedback on the document cards (the same action as on the Resources page).
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const copyFile = async (file: string) => {
    try {
      await navigator.clipboard.writeText(`${location.origin}${file}`);
      setCopiedFile(file);
      window.setTimeout(() => setCopiedFile(null), 1600);
    } catch {
      /* Clipboard unavailable (insecure context): the preview and download links still work. */
    }
  };

  // Built during render so edits made in the admin replace the defaults on the next bootstrap.
  const hseItems: StickyItem[] = quality.hse.items.map(({ lines, text, image, imageAlt }) => ({
    title: lines.join(" "),
    text,
    image: unsplash(image, 1600),
    alt: imageAlt,
  }));

  const { engineering, fleet } = quality;

  // Topic labels for the on-page index, read from the content the sections render.
  const topicLabel: Record<(typeof TOPICS)[number][1], string> = {
    laboratory: quality.laboratory.title,
    grades: "Concrete grades",
    materials: quality.materials.title,
    calibration: quality.calibration.title,
    engineering: engineering.title,
    equipment: fleet.title,
    hse: quality.hse.label,
    documents: quality.documents.title,
  };

  return (
    <main ref={rootRef} className="ol-page relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      {/* Cover as the business pages: the label and title set low over a full-screen banner, then the introduction
          rises over it as the page scrolls. */}
      <ParallaxHero label={quality.cover.label} title={quality.cover.title} image={unsplash(quality.cover.image, 2400)} alt={quality.cover.imageAlt} />

      <div className="ol-page-body">
        {/* Introduction, with the index that replaces the retired capabilities page's topic list. */}
        <LabelCopy
          label={quality.intro.label}
          className="ol-head qx-intro"
          after={
            <ul className="ol-topics" aria-label="On this page">
              {TOPICS.map(([id, key], i) => (
                <li key={id}><a href={`#${id}`}><span>{pad(i + 1)}</span>{topicLabel[key]}</a></li>
              ))}
            </ul>
          }
        >
          {quality.intro.text}
        </LabelCopy>

        {/* 01 Laboratory & quality assurance, after olympic.no/sustainability-safety-and-wellbeing's text block: the
            title, grey copy and the five-step process as a numbered, ruled list on the left; a photo on the right that
            holds in place while the list scrolls past. The tests the laboratory runs follow the process, so the former
            capabilities page's laboratory panel is not repeated. */}
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
            <h3 data-split="content" className="qx-label qx-list-label">What we test</h3>
            <ul className="qx-cells">
              {quality.laboratory.tests.map(({ label, value }, i) => (
                <li key={label} data-reveal className="qx-cell pd-rule" style={{ "--rd": `${(i % 2) * 0.08 + Math.floor(i / 2) * 0.1}s` } as CSSProperties}>
                  <span data-split="content" className="qx-label">{label}</span>
                  <span data-split="content" className="qx-cell-text">{value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-px="media" className="pp-media qx-photo qx-lab-photo">
            <div className="ol-px-media"><img src={unsplash(quality.laboratory.image, 1400)} alt={quality.laboratory.imageAlt} loading="lazy" /></div>
          </div>
        </section>

        {/* 02 Concrete grades, after olympic.no/navigating-with-responsibility: the statement on the left, then the
            grades as a ruled two-column grid — the code drawn as an outlined orange mark, the strength and the typical
            use set beside it. This is the merged page's mix-design section; the grades are no longer listed twice. */}
        <section id="grades" data-header-title="Concrete grades" aria-labelledby="qs-grades" className="qg site-pad">
          <h2 id="qs-grades" className="qg-label">Concrete grades</h2>
          <p data-split className="qg-statement">{quality.documents.gradesText}</p>

          <ul className="qg-grid">
            {quality.documents.grades.map(({ grade, strength, use }) => (
              <li key={grade} className="qg-cell">
                <span className="qg-mark" aria-hidden>{grade}</span>
                <div className="qg-body">
                  <p className="qg-strength">{strength}</p>
                  <p data-split="content" className="qg-use">{use}</p>
                </div>
              </li>
            ))}
          </ul>

          <p data-split="content" className="qg-note">{quality.documents.note}</p>
        </section>

        {/* 03 Raw material certificates, after olympic.no/sustainability-quality-safety-management-systems: a portrait
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

        {/* 04 Calibration certificates, after olympic.no/sustainability-eco-efficient-operations: title left, copy right,
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
              {quality.calibration.items.map(({ equipment: item, scope }, i) => (
                <li key={item} data-reveal className={`qx-area${i ? " pd-rule" : ""}`} style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
                  <span data-split="content" className="qx-label">{item}</span>
                  <span data-split="content" className="qx-cell-text">{scope}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 05 HSE commitment, as the core values on About: one commitment at a time beside a sticky photo column. It
            keeps its own ink ground, which gives the certificates above a deliberate break. */}
        <StickyValues id="hse" label={quality.hse.label} heading={quality.hse.heading} items={hseItems} dark />

        {/* 06 Equipment & fleet: the full inventory from the Corporate Profile (laboratory equipment excepted, as it
            belongs to the laboratory section), on the page's light ground. */}
        <div className="ol-panels">
          <TextMedia id="equipment-fleet" kicker={fleet.kicker} title={fleet.title} image={unsplash(fleet.image, 1600)} alt={fleet.imageAlt}
            copy={fleet.copy}>
            <Rows rows={fleet.rows} />
            <OlButton label={fleet.ctaLabel} href={fleet.ctaHref} className="ol-tm-button" />
          </TextMedia>
        </div>

        {/* 07 Engineering capability: the people and figures behind the mix designs, with the coverage figure linking
            to the map on the homepage rather than repeating it here. */}
        <div className="ol-panels">
          <TextMedia id="engineering" kicker={engineering.kicker} title={engineering.title} image={unsplash(engineering.image, 1600)} alt={engineering.imageAlt}
            copy={engineering.copy}>
            <Rows rows={engineering.rows} />
            <OlButton label="Coverage" href="/#coverage" className="ol-tm-button" />
          </TextMedia>
        </div>

        {/* 08 Documents: mix designs, licences and certificates merged into one set of cards, after
            olympic.no/investor — a light band, the mono eyebrow and uppercase title, then near-black document cards
            with a hairline head, a date or status foot and their actions. */}
        <section id="documents" data-header-title={quality.documents.title} aria-labelledby="qs-documents" className="qd site-pad">
          <div className="qd-head">
            <span className="qd-label">{quality.documents.label}</span>
            <h2 id="qs-documents" data-split className="qd-title">{quality.documents.title}</h2>
            <p data-split className="qd-copy">{quality.documents.text}</p>
          </div>

          <ul className="qd-grid">
            {quality.documents.items.map((item, i) => (
              <li key={item.title} data-reveal className="qd-card" style={{ "--k": i } as CSSProperties}>
                <div className="qd-card-head">
                  <h3 data-split="content" className="qd-card-title">{item.title}</h3>
                  {item.subtitle && <p data-split="content" className="qd-card-sub">{item.subtitle}</p>}
                </div>

                <div className="qd-card-foot">
                  <span className="qd-meta">
                    {item.file ? [item.date, item.size].filter(Boolean).join(" · ") : item.status}
                  </span>

                  <span className="qd-actions">
                    {item.file ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void copyFile(item.file)}
                          aria-label={copiedFile === item.file ? "Link copied" : "Copy link"}
                          title={copiedFile === item.file ? "Link copied" : "Copy link"}
                          className="qd-act"
                        >
                          {copiedFile === item.file ? (
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M3 8.5l3.2 3.2L13 5" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 15 8" fill="none" aria-hidden>
                              <path d="M5.5 3.51172L9.5 3.51172" stroke="currentColor" />
                              <path d="M11.5 0.5H13.5C14.0523 0.5 14.5 0.947715 14.5 1.5V5.52344C14.5 6.07572 14.0523 6.52344 13.5 6.52344H11.5" stroke="currentColor" />
                              <path d="M3.5 0.5H1.5C0.947715 0.5 0.5 0.947715 0.5 1.5V5.52344C0.5 6.07572 0.947715 6.52344 1.5 6.52344H3.5" stroke="currentColor" />
                            </svg>
                          )}
                        </button>
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noopener"
                          aria-label="Preview"
                          title="Preview"
                          className="qd-act"
                        >
                          <svg viewBox="0 0 14 8" fill="none" aria-hidden>
                            <path d="M5.01064 6.73084L0.890625 3.92585L5.01064 1.11985C5.6049 0.715166 6.29648 0.5 7.00296 0.5C7.70944 0.5 8.40102 0.715166 8.99528 1.11985L13.1153 3.92585L8.99528 6.73084C8.40102 7.13553 7.70944 7.35069 7.00296 7.35069C6.29648 7.35069 5.6049 7.13553 5.01064 6.73084Z" stroke="currentColor" strokeMiterlimit="10" />
                            <path d="M7.0023 5.23707C7.6853 5.23707 8.23898 4.65059 8.23898 3.92713C8.23898 3.20367 7.6853 2.61719 7.0023 2.61719C6.3193 2.61719 5.76562 3.20367 5.76562 3.92713C5.76562 4.65059 6.3193 5.23707 7.0023 5.23707Z" stroke="currentColor" strokeMiterlimit="10" />
                          </svg>
                        </a>
                        <a
                          href={item.file}
                          download
                          aria-label="Download"
                          title="Download"
                          className="qd-act"
                        >
                          <svg viewBox="0 0 9 11" fill="none" aria-hidden>
                            <path d="M0 10H8.33333" stroke="currentColor" />
                            <path d="M4.16406 7.5L4.16406 0" stroke="currentColor" strokeMiterlimit="10" />
                            <path d="M0.828125 4.16797L4.23973 7.66848L7.64758 4.16797" stroke="currentColor" strokeMiterlimit="10" />
                          </svg>
                        </a>
                      </>
                    ) : (
                      <a
                        href={quality.documents.ctaHref}
                        aria-label={quality.documents.ctaLabel}
                        title={quality.documents.ctaLabel}
                        className="qd-act"
                      >
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2.6 9.4 9.4 2.6M4.4 2.6h5v5" />
                        </svg>
                      </a>
                    )}
                  </span>
                  <span className="sr-only" aria-live="polite">{copiedFile === item.file ? "Link copied" : ""}</span>
                </div>
              </li>
            ))}
          </ul>

        </section>
      </div>

      <QuoteCta href={quoteHref()} />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
