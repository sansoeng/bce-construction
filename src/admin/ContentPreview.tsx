import { useEffect, useRef, useState, type ReactNode } from "react";

// A scaled-down render of the public page, built from the form's current values. It deliberately mirrors the live
// layout (title, cover, ruled facts, highlights, gallery, equipment and outcome) with its own admin-scoped styles, so
// editors can see the section on the site without leaving the console or saving first.

const DESIGN_WIDTH = 1080;

const text = (value: unknown) => (typeof value === "string" ? value : "");
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

type PreviewProps = {
  type: string;
  data: Record<string, unknown>;
  lang: "en" | "km";
  href: string;
  /** The editor tab currently open (tabbed content types such as the homepage). */
  section?: string;
  sectionLabel?: string;
};

/** Scale the fixed-width page canvas to the panel, keeping the preview's height in the flow. */
function useFit(designWidth: number) {
  const viewport = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });

  useEffect(() => {
    const outer = viewport.current;
    const inner = page.current;
    if (!outer || !inner) return;
    const measure = () => {
      const scale = outer.clientWidth ? Math.min(1, outer.clientWidth / designWidth) : 1;
      setFit({ scale, height: inner.offsetHeight * scale });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    measure();
    return () => observer.disconnect();
  }, [designWidth]);

  return { viewport, page, fit };
}

function ProjectPreview({ data }: { data: Record<string, unknown> }) {
  const gallery = list(data.gallery).map(record);
  const [hero, ...rest] = gallery;
  const highlights = list(data.highlights).map(record);
  const equipment = list(data.equipment).map(record);
  const technical = list(data.technical).map(record);
  const scope = list(data.scope).map(text).filter(Boolean);
  const facts = [
    ["Project owner", text(data.owner)],
    ["Location", text(data.location)],
    ["Project period", text(data.period)],
    ["Category", text(data.category)],
  ].filter(([, value]) => value);

  return (
    <>
      <header className="adm-prev-head">
        <h1>{text(data.name) || "Untitled project"}</h1>
        <p>
          {text(data.category)}
          {data.sample ? <span className="adm-prev-tag">Sample content</span> : null}
        </p>
      </header>

      {hero && text(hero.image) ? (
        <figure className="adm-prev-hero">
          <img src={text(hero.image)} alt={text(hero.caption)} />
          <figcaption>
            <span>{text(hero.caption)}</span>
            <span>{text(data.location)}</span>
          </figcaption>
        </figure>
      ) : null}

      <section className="adm-prev-section">
        <h2>Project details</h2>
        <div className="adm-prev-body">
          {text(data.summary) ? <p className="adm-prev-statement">{text(data.summary)}</p> : null}
          <dl className="adm-prev-rows">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            {scope.length > 0 && (
              <div>
                <dt>Scope of work</dt>
                <dd>
                  <ul className="adm-prev-scope">
                    {scope.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="adm-prev-section">
          <h2>Project highlights</h2>
          <div className="adm-prev-glance">
            {highlights.map((item, index) => (
              <div key={index} className="adm-prev-glance-cell">
                <span className="adm-prev-glance-value">
                  {text(item.value)}{item.unit ? <em>{text(item.unit)}</em> : null}
                </span>
                <span className="adm-prev-glance-label">{text(item.label)}</span>
                {text(item.note) ? <span className="adm-prev-glance-note">{text(item.note)}</span> : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {rest.some((item) => text(item.image)) && (
        <section className="adm-prev-section">
          <h2>Project gallery <sup>({String(gallery.length).padStart(2, "0")})</sup></h2>
          <div className="adm-prev-gallery">
            {rest.map((item, index) =>
              text(item.image) ? (
                <figure key={index}>
                  <img src={text(item.image)} alt={text(item.caption)} />
                  <figcaption>
                    <span>{text(item.caption)}</span>
                    <span>{String(index + 2).padStart(2, "0")}</span>
                  </figcaption>
                </figure>
              ) : null,
            )}
          </div>
        </section>
      )}

      {(equipment.length > 0 || technical.length > 0) && (
        <section className="adm-prev-section adm-prev-section--stack">
          {equipment.length > 0 && (
            <div className="adm-prev-list-block">
              <h2>Equipment deployed</h2>
              <ul className="adm-prev-list">
                {equipment.map((item, index) => (
                  <li key={index}>
                    <span>{text(item.name)}</span>
                    {item.count !== undefined && item.count !== null && item.count !== "" ? (
                      <span className="adm-prev-count">{String(item.count).padStart(2, "0")}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {technical.length > 0 && (
            <div className="adm-prev-list-block">
              <h2>Technical scope</h2>
              <dl className="adm-prev-list adm-prev-list--kv">
                {technical.map((item, index) => (
                  <div key={index}>
                    <dt>{text(item.label)}</dt>
                    <dd>{text(item.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>
      )}

      {text(data.outcome) ? (
        <section className="adm-prev-section adm-prev-outcome">
          <h2>Project outcome</h2>
          <p>{text(data.outcome)}</p>
        </section>
      ) : null}
    </>
  );
}

function GenericPreview({ type, data }: { type: string; data: Record<string, unknown> }) {
  const title = text(data.name) || text(data.title) || text(data.label) || "Untitled";
  const eyebrow = text(data.category) || text(data.categoryLabel) || text(data.department) || text(data.tagline);
  const image = text(data.image) || text(data.heroImage);
  const lead =
    text(data.summary) || text(data.excerpt) || text(data.overview) || text(data.description) || text(data.intro);
  const facts: [string, string][] = [];
  const addFacts = (pairs: [string, string][]) => {
    for (const [label, key] of pairs) if (text(data[key])) facts.push([label, text(data[key])]);
  };

  if (type === "posts") addFacts([["Published", "date"], ["Read time", "readTime"], ["Year", "year"]]);
  if (type === "vacancies") addFacts([["Location", "location"], ["Type", "type"], ["Deadline", "deadline"]]);
  if (type === "resources") {
    addFacts([["Category", "categoryLabel"], ["Format", "fileFormat"], ["Size", "fileSize"], ["Language", "language"], ["Revision", "revisionDate"]]);
  }
  if (type === "offerings") addFacts([["Tagline", "tagline"]]);

  /** Opening text under a ruled label, as the site's section heads. */
  const blocks: { title: string; items: string[] }[] = [];
  const plain: Record<string, [string, string][]> = {
    vacancies: [["duties", "Duties"], ["qualifications", "Qualifications"]],
    offerings: [["details", "Key facts"]],
  };
  for (const [key, heading] of plain[type] ?? []) {
    const items = list(data[key]).map(text).filter(Boolean);
    if (items.length) blocks.push({ title: heading, items });
  }

  const valueCards = type === "businesses" ? list(data.values).map(record) : [];
  const solutions = type === "businesses" ? list(data.solutions).map(record) : [];
  const figures = type === "businesses" ? list(data.figures).map(record) : [];
  const author = record(data.author);

  return (
    <>
      <header className="adm-prev-head">
        <h1>{title}</h1>
        {eyebrow ? <p>{eyebrow}</p> : null}
      </header>
      {image ? (
        <figure className="adm-prev-hero">
          <img src={image} alt={text(data.alt) || text(data.heroAlt)} />
        </figure>
      ) : null}

      {(lead || facts.length > 0) && (
        <section className="adm-prev-section">
          <h2>{type === "posts" ? "Article" : type === "resources" ? "Document" : "Overview"}</h2>
          <div className="adm-prev-body">
            {lead ? <p className="adm-prev-statement">{lead}</p> : null}
            {facts.length > 0 && (
              <dl className="adm-prev-rows">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
                {text(author.name) ? (
                  <div>
                    <dt>Author</dt>
                    <dd>{text(author.name)}{text(author.role) ? ` · ${text(author.role)}` : ""}</dd>
                  </div>
                ) : null}
              </dl>
            )}
          </div>
        </section>
      )}

      {blocks.map((block) => (
        <section key={block.title} className="adm-prev-section">
          <h2>{block.title}</h2>
          <ul className="adm-prev-list">
            {block.items.map((item, index) => <li key={index}><span>{item}</span></li>)}
          </ul>
        </section>
      ))}

      {valueCards.length > 0 && (
        <section className="adm-prev-section">
          <h2>Why BCE</h2>
          <div className="adm-prev-cards">
            {valueCards.map((item, index) => (
              <div key={index}>
                <strong>{text(item.title)}</strong>
                <span>{text(item.text)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {solutions.length > 0 && (
        <section className="adm-prev-section">
          <h2>Solutions</h2>
          <div className="adm-prev-cards">
            {solutions.map((item, index) => (
              <div key={index}>
                {text(item.image) ? <img src={text(item.image)} alt={text(item.alt)} /> : null}
                <strong>{text(item.title)}</strong>
                <span>{text(item.text)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {figures.length > 0 && (
        <section className="adm-prev-section">
          <h2>Capacity</h2>
          <div className="adm-prev-glance">
            {figures.map((item, index) => (
              <div key={index} className="adm-prev-glance-cell">
                <span className="adm-prev-glance-value">{text(item.value)}</span>
                <span className="adm-prev-glance-label">{text(item.label)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {type === "pages" && Object.keys(record(data.data)).length > 0 && (
        <section className="adm-prev-section">
          <h2>Page data</h2>
          <p className="adm-prev-statement">Structured JSON content is rendered by the custom page template.</p>
        </section>
      )}
    </>
  );
}

type HomepagePreviewProps = {
  data: Record<string, unknown>;
  /** The editor tab currently open, e.g. "glance". Omit to show every section. */
  section?: string;
};

const linesOf = (value: unknown) => list(value).map(text).filter(Boolean);

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="adm-prev-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/**
 * A focused preview of the homepage. When the editor is tabbed, only the matching section is rendered, so the
 * preview mirrors the card the editor is working in; with no section it shows the whole page, top to bottom.
 */
function HomepagePreview({ data, section }: HomepagePreviewProps) {
  const show = (id: string) => !section || section === id;

  const hero = record(data.hero);
  const loader = record(data.loader);
  const about = record(data.about);
  const expertise = record(data.expertise);
  const glance = record(data.glance);
  const commitments = record(data.commitments);
  const projects = record(data.projects);
  const coverage = record(data.coverage);
  const why = record(data.why);
  const quote = record(data.quote);
  const footer = record(data.footer);

  const segments = list(about.titleSegments).map(record);
  const stats = list(glance.stats).map(record);
  const partnerGroups = list(glance.groups).map(record);
  const commitmentsList = list(commitments.items).map(record);
  const story = list(coverage.story).map(record);
  const beliefs = list(why.beliefs).map(record);
  const footerColumns = list(footer.columns).map(record);

  return (
    <>
      {show("hero") ? (
        <>
          <header className="adm-prev-head">
            <h1>{linesOf(hero.titleLines).join(" ") || "Homepage"}</h1>
            {text(hero.newsKicker) ? <p>{text(hero.newsKicker)}</p> : null}
          </header>
          {text(hero.poster) ? (
            <figure className="adm-prev-hero">
              <img src={text(hero.poster)} alt={text(hero.imageAlt)} />
              <figcaption>
                <span>Hero banner</span>
                <span>{text(hero.video)}</span>
              </figcaption>
            </figure>
          ) : null}
          <PreviewSection title="Latest news card">
            <div className="adm-prev-cards">
              <div>
                {text(hero.newsImage) ? <img src={text(hero.newsImage)} alt={text(hero.newsAlt)} /> : null}
                <strong>{text(hero.newsTitle)}</strong>
                <span>{text(hero.newsHref)}</span>
              </div>
            </div>
          </PreviewSection>
        </>
      ) : null}

      {show("loader") ? (
        <>
          <header className="adm-prev-head">
            <h1>{text(loader.word) || "Loading screen"}</h1>
            <p>Shown while the home page loads</p>
          </header>
          <PreviewSection title="Loading screen">
            <div className="rounded-[12px] bg-[#111] p-8 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/50">
                {linesOf(loader.titleLines).join(" · ")}
              </p>
              <p className="mt-8 text-4xl font-medium tracking-[-.03em]">{text(loader.word)}</p>
              <div className="mt-8 flex justify-between gap-6 font-mono text-[11px] uppercase tracking-[.12em] text-white/55">
                <span>{linesOf(loader.locationLines).join(" · ")}</span>
                <span>{linesOf(loader.statusLines).join(" · ")}</span>
              </div>
            </div>
          </PreviewSection>
        </>
      ) : null}

      {show("about") ? (
        <>
          <header className="adm-prev-head">
            <h1>About BCE</h1>
            <p>{[text(about.ctaLabel), text(about.ctaHref)].filter(Boolean).join(" · ")}</p>
          </header>
          {text(about.image) ? (
            <figure className="adm-prev-hero">
              <img src={text(about.image)} alt={text(about.imageAlt)} />
            </figure>
          ) : null}
          <PreviewSection title="Introduction">
            <p className="adm-prev-statement">{text(about.intro)}</p>
            {segments.length > 0 ? (
              <p className="adm-prev-statement">
                {segments.map((segment) => text(segment.text)).filter(Boolean).join(", ")}
                {text(about.titleClosing) ? ` ${text(about.titleClosing)}` : ""}
              </p>
            ) : null}
            <dl className="adm-prev-rows">
              <div>
                <dt>Button</dt>
                <dd>{[text(about.ctaLabel), text(about.ctaHref)].filter(Boolean).join(" · ")}</dd>
              </div>
            </dl>
          </PreviewSection>
        </>
      ) : null}

      {show("expertise") ? (
        <>
          <header className="adm-prev-head">
            <h1>{linesOf(expertise.titleLines).join(" ") || "Core business intro"}</h1>
            <p>{text(expertise.kicker)}</p>
          </header>
          <PreviewSection title="Opening copy">
            <p className="adm-prev-statement">{text(expertise.lead)}</p>
            <dl className="adm-prev-rows">
              <div>
                <dt>Scroll label</dt>
                <dd>{text(expertise.scrollLabel)}</dd>
              </div>
            </dl>
          </PreviewSection>
        </>
      ) : null}

      {show("glance") ? (
        <>
          <header className="adm-prev-head">
            <h1>{text(glance.title) || "BCE at a glance"}</h1>
            <p>{text(glance.partnersTitle)}</p>
          </header>
          <PreviewSection title="Figures">
            <div className="adm-prev-glance">
              {stats.map((item, index) => (
                <div key={index} className="adm-prev-glance-cell">
                  <span className="adm-prev-glance-value">{String(item.value ?? "")}{text(item.suffix)}</span>
                  <span className="adm-prev-glance-label">{text(item.label)}</span>
                  {text(item.note) ? <span className="adm-prev-glance-note">{text(item.note)}</span> : null}
                </div>
              ))}
            </div>
          </PreviewSection>
          <PreviewSection title={text(glance.partnersTitle) || "Partner groups"}>
            {partnerGroups.map((group, index) => (
              <div key={index} className="mt-5 first:mt-0">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[.12em] text-[rgb(17_17_17_/_0.45)]">
                  {text(group.label)} · {list(group.items).length}
                </p>
                <ul className="adm-prev-list">
                  {list(group.items).map(record).map((partner, partnerIndex) => (
                    <li key={partnerIndex}><span>{text(partner.name)}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </PreviewSection>
        </>
      ) : null}

      {show("commitments") ? (
        <>
          <header className="adm-prev-head">
            <h1>{text(commitments.label) || "Commitments"}</h1>
            <p>{text(commitments.imageAlt)}</p>
          </header>
          {text(commitments.image) ? (
            <figure className="adm-prev-hero">
              <img src={text(commitments.image)} alt={text(commitments.imageAlt)} />
            </figure>
          ) : null}
          <PreviewSection title="Statements">
            <div className="adm-prev-cards">
              {commitmentsList.map((item, index) => (
                <div key={index}>
                  <strong>{linesOf(item.lines).join(" ")}</strong>
                  <span>{text(item.text)}</span>
                </div>
              ))}
            </div>
            <p className="adm-prev-statement mt-5">{[text(commitments.ctaLabel), text(commitments.ctaHref)].filter(Boolean).join(" · ")}</p>
          </PreviewSection>
        </>
      ) : null}

      {show("projects") ? (
        <>
          <header className="adm-prev-head">
            <h1>{linesOf(projects.titleLines).join(" ") || "Selected projects"}</h1>
            <p>{[text(projects.ctaLabel), text(projects.ctaHref)].filter(Boolean).join(" · ")}</p>
          </header>
          <PreviewSection title="Portfolio">
            <p className="adm-prev-statement">
              The project cards come from Projects. This section controls the heading and the button that leads to the
              full portfolio.
            </p>
          </PreviewSection>
        </>
      ) : null}

      {show("coverage") ? (
        <>
          <header className="adm-prev-head">
            <h1>{linesOf(coverage.titleLines).join(" ") || "Coverage"}</h1>
            <p>{text(coverage.hint)}</p>
          </header>
          <PreviewSection title="Story over the map">
            <dl className="adm-prev-rows">
              {story.map((entry, index) => (
                <div key={index}>
                  <dt>{text(entry.label)}</dt>
                  <dd>{text(entry.lead)}</dd>
                </div>
              ))}
            </dl>
            {text(coverage.fleetNote) ? <p className="adm-prev-statement mt-4">{text(coverage.fleetNote)}</p> : null}
            {text(coverage.credit) ? <p className="adm-prev-statement mt-2">{text(coverage.credit)}</p> : null}
          </PreviewSection>
        </>
      ) : null}

      {show("why") ? (
        <>
          <header className="adm-prev-head">
            <h1>{text(why.eyebrow) || "Why choose BCE"}</h1>
            <p>Three oversized words, each with its tag</p>
          </header>
          <PreviewSection title="Beliefs">
            <div className="adm-prev-cards">
              {beliefs.map((belief, index) => (
                <div key={index}>
                  <strong>{text(belief.word)}</strong>
                  <span>{text(belief.tag)}</span>
                </div>
              ))}
            </div>
          </PreviewSection>
        </>
      ) : null}

      {show("quote") ? (
        <>
          <header className="adm-prev-head">
            <h1>{text(quote.title) || "Request a quotation"}</h1>
            <p>{[text(quote.ctaLabel), text(quote.ctaHref)].filter(Boolean).join(" · ")}</p>
          </header>
          {text(quote.image) ? (
            <figure className="adm-prev-hero">
              <img src={text(quote.image)} alt="" />
            </figure>
          ) : null}
          <PreviewSection title="Closing panel">
            <p className="adm-prev-statement">{text(quote.text)}</p>
          </PreviewSection>
        </>
      ) : null}

      {show("footer") ? (
        <>
          <header className="adm-prev-head">
            <h1>{text(footer.enquiryTitle) || "Footer"}</h1>
            <p>{text(footer.officeTitle)}</p>
          </header>
          <PreviewSection title="Navigation">
            <dl className="adm-prev-rows">
              {footerColumns.map((column, index) => (
                <div key={index}>
                  <dt>{text(column.title)}</dt>
                  <dd>
                    {list(column.links).map(record).map((link, linkIndex) => (
                      <span key={linkIndex} className="block">{text(link.label)}</span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </PreviewSection>
          <PreviewSection title="Contact block">
            <p className="adm-prev-statement">{text(footer.enquiryText)}</p>
            <dl className="adm-prev-rows">
              <div>
                <dt>Buttons</dt>
                <dd>{[text(footer.primaryLabel), text(footer.callLabel)].filter(Boolean).join(" · ")}</dd>
              </div>
              <div>
                <dt>Labels</dt>
                <dd>
                  {[
                    text(footer.hotlinesLabel),
                    text(footer.socialLabel),
                    text(footer.directionsLabel),
                    text(footer.backToTopLabel),
                    text(footer.rightsLabel),
                  ].filter(Boolean).join(" · ")}
                </dd>
              </div>
            </dl>
          </PreviewSection>
        </>
      ) : null}
    </>
  );
}

export function ContentPreview({ type, data, lang, href, section, sectionLabel }: PreviewProps) {
  const { viewport, page, fit } = useFit(DESIGN_WIDTH);
  const khmer = lang === "km";

  return (
    <div className="adm-preview">
      <div className="adm-preview-bar">
        <span className="adm-preview-label">Live preview</span>
        {sectionLabel ? <span className="adm-preview-section">{sectionLabel}</span> : null}
        <span className="adm-preview-lang">{khmer ? "ខ្មែរ" : "English"}</span>
        <a className="adm-preview-open" href={href} target="_blank" rel="noopener noreferrer">Open ↗</a>
      </div>
      <div className="adm-preview-viewport" ref={viewport} style={{ height: fit.height || undefined }}>
        <div
          className="adm-preview-page"
          ref={page}
          data-lang={lang}
          style={{ width: DESIGN_WIDTH, transform: `scale(${fit.scale})` }}
        >
          {type === "homepage" ? (
            <HomepagePreview data={data} section={section} />
          ) : type === "projects" ? (
            <ProjectPreview data={data} />
          ) : (
            <GenericPreview type={type} data={data} />
          )}
        </div>
      </div>
      <p className="adm-preview-note">
        {khmer
          ? "Khmer preview: fields left empty fall back to English, exactly as the live site does."
          : "Rendered from the values in this form. Save, then open the page to check the final type and spacing."}
      </p>
    </div>
  );
}
