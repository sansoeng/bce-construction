import { useEffect, useRef, useState } from "react";

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

export function ContentPreview({ type, data, lang, href }: PreviewProps) {
  const { viewport, page, fit } = useFit(DESIGN_WIDTH);
  const khmer = lang === "km";

  return (
    <div className="adm-preview">
      <div className="adm-preview-bar">
        <span className="adm-preview-label">Live preview</span>
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
          {type === "projects" ? <ProjectPreview data={data} /> : <GenericPreview type={type} data={data} />}
        </div>
      </div>
      <p className="adm-preview-note">
        Rendered from the values in this form. Save, then open the page to check the final type and spacing.
      </p>
    </div>
  );
}
