import { useEffect, useRef, useState, type CSSProperties } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { LENIS_OPTIONS } from "./smoothScroll";
import { initSplitReveal } from "./splitReveal";
import { translate } from "./i18n";
import SiteHeader from "./SiteHeader";
import QuoteCta from "./QuoteCta";
import Footer from "./Footer";
import Lightbox from "./Lightbox";
import FluidCursor from "./FluidCursor";
import { findProject, projectHref, projects, type Project } from "./projects";

// Project details (Selected Project Experience), in the homepage's language: the floating header, line-by-line title
// reveals, hairline-ruled fact rows, the "at a glance" figure grid for highlights, the Selected Projects staggered grid
// for the gallery, then the closing quotation section and footer. Optional blocks render only when a project has them.

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      io.disconnect();
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// Counts a figure up from zero with the homepage's "at a glance" timing (1.6s expo-out), keeping its format:
// thousands separators, decimals and leading zeros ("02"). Runs when `run` turns true, or on scrolling into view.
const COUNT_MS = 1600;
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export function CountUp({ value, run, delay = 0 }: { value: string; run?: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = parseFloat(value.replace(/,/g, "")) || 0;
  const decimals = (value.split(".")[1] ?? "").length;
  const width = /^0\d/.test(value) ? value.length : 0;
  const format = (n: number) => {
    const text = n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: value.includes(",") });
    return width ? text.padStart(width, "0") : text;
  };
  const [shown, setShown] = useState(() => format(0));
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (run !== undefined || !ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { rootMargin: "0px 0px -15% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [run]);
  const go = run ?? seen;
  useEffect(() => {
    if (!go) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(format(target));
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / COUNT_MS, 0), 1);
      setShown(format(target * expoOut(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go]);
  return <span ref={ref} aria-label={value}>{shown}</span>;
}

// A hairline-ruled label/value row: the rule draws in from the left, then label and value rise line by line.
function Row({ label, children, i = 0 }: { label: string; children: React.ReactNode; i?: number }) {
  return (
    <div data-reveal className="pd-row pd-rule" style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
      <dt data-split="content" className="pd-row-label">{label}</dt>
      <dd className="pd-row-value">{children}</dd>
    </div>
  );
}

function Highlights({ items }: { items: NonNullable<Project["highlights"]> }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <section data-header-title="Highlights" aria-labelledby="pd-highlights" className="px-5 pt-24 md:pt-40">
      <div className="glance-layout">
        <div className="glance-title-col">
          <div className="glance-title-sticky">
            <h2 id="pd-highlights" data-split className="pd-h2">Project highlights</h2>
          </div>
        </div>
        <div ref={ref} className={`glance ${inView ? "is-in" : ""}`}>
          <dl className="glance-grid">
            {items.map((h, i) => (
              <div key={h.label} className="glance-cell" style={{ "--i": i } as CSSProperties}>
                <dt className="glance-label">
                  <span className="glance-label-title">{h.label}</span>
                  {h.note && <span className="glance-label-note">{h.note}</span>}
                </dt>
                <dd className="glance-num">
                  <span><CountUp value={h.value} run={inView} delay={250 + i * 70} />{h.unit && <span className="pd-unit">{h.unit}</span>}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section data-header-title="Projects" className="flex min-h-[100svh] flex-col justify-end gap-8 px-5 pb-16">
      <p className="text-[.95rem] text-black/45">Project not found</p>
      <h1 className="pd-title">This project is not available.</h1>
      <a href="/?projects" className="pd-back self-start">All projects</a>
    </section>
  );
}

export default function ProjectPage({ slug }: { slug: string }) {
  const project = findProject(slug);
  const index = project ? projects.indexOf(project) : -1;
  const next = projects[(index + 1) % projects.length];
  const galleryRef = useRef<HTMLElement>(null);
  const [viewing, setViewing] = useState<number | null>(null);

  useEffect(() => {
    document.title = translate(project ? `${project.name} | BCE Construction` : "Project not found | BCE Construction");
    const cleanupSplit = initSplitReveal();
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => observer.observe(el));

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduceMotion ? null : new Lenis(LENIS_OPTIONS);
    (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    if (lenis) raf = requestAnimationFrame(loop);

    // Gallery reveal, as on the homepage grid: each photo wipes down once it is 40% up the viewport and loaded.
    const gallery = galleryRef.current;
    gallery?.setAttribute("data-reveal-ready", "");
    const media = new IntersectionObserver((entries) => {
      let batch = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        media.unobserve(el);
        const img = el.querySelector("img");
        const i = batch++;
        const reveal = () => {
          el.style.setProperty("--i", String(i));
          el.classList.add("is-revealed");
        };
        if (!img || img.complete) reveal();
        else {
          img.addEventListener("load", reveal, { once: true });
          img.addEventListener("error", reveal, { once: true });
        }
      });
    }, { rootMargin: "0px 0px -40% 0px" });
    gallery?.querySelectorAll<HTMLElement>(".kp-media").forEach((m) => media.observe(m));

    return () => {
      cleanupSplit();
      observer.disconnect();
      media.disconnect();
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [project]);

  if (!project) {
    return (
      <main className="relative z-[1] overflow-x-clip bg-white text-[#111]">
        <SiteHeader phones={phones} tel={tel} base="/" />
        <NotFound />
        <Footer phones={phones} tel={tel} base="/" />
      </main>
    );
  }

  const [hero, ...rest] = project.gallery;
  const hasDetails = !!(project.equipment?.length || project.technical?.length);

  return (
    <main className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <article>
        {/* Opening: back link, category and index on the 12-column rule, then the name as the page title. */}
        <header data-header-title="Project" className="px-5 pt-28 md:pt-36">
          <h1 key={project.slug} data-split data-split-type="words" className="pd-title mt-20 max-w-[72rem] md:mt-36">{project.name}</h1>
          <p className="mt-6 flex items-center gap-3 text-[.95rem] text-black/45">
            <span data-split="content">{project.category}</span>
            {project.sample && <span className="pd-tag pd-fade">Sample content</span>}
          </p>
        </header>

        <figure className="mt-10 px-5 md:mt-16">
          <button type="button" className="pd-hero pd-zoom" data-cursor="View" aria-label={`View photo: ${hero.caption}`} onClick={() => setViewing(0)}>
            <img src={hero.image} alt={hero.caption} fetchPriority="high" />
          </button>
          <figcaption className="pd-caption"><span data-split="content">{hero.caption}</span><span data-split="content">{project.location}</span></figcaption>
        </figure>

        {/* Project details: a numbered label on the left; the summary and the ruled fact rows fill the right half. */}
        <section data-header-title="Overview" aria-labelledby="pd-overview" className="px-5 pt-24 md:pt-40">
          <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-5">
            <h2 id="pd-overview" data-split className="pd-h2 md:col-span-6">Project details</h2>
            <div className="w-full md:col-span-6 md:col-start-7 md:w-[780px] md:max-w-full">
              <p data-split className="pd-statement">{project.summary}</p>
              <dl className="pd-rows mt-12 md:mt-16">
                <Row label="Project owner" i={0}><span data-split="content" className="block">{project.owner}</span></Row>
                <Row label="Location" i={1}><span data-split="content" className="block">{project.location}</span></Row>
                <Row label="Project period" i={2}><span data-split="content" className="block">{project.period}</span></Row>
                <Row label="Category" i={3}><span data-split="content" className="block">{project.category}</span></Row>
                <Row label="Scope of work" i={4}>
                  <ul className="pd-scope md:w-[340px] md:max-w-full">{project.scope.map((s) => <li key={s} data-split="content">{s}</li>)}</ul>
                </Row>
              </dl>
            </div>
          </div>
        </section>

        {project.highlights?.length ? <Highlights items={project.highlights} /> : null}

        {/* Gallery: the Selected Projects grid, captions beneath each frame. */}
        {rest.length > 0 && (
          <section ref={galleryRef} data-header-title="Gallery" aria-labelledby="pd-gallery" className="kp pd-gallery">
            <h2 id="pd-gallery" data-split className="kp-title pd-h2">Project<br />gallery<sup className="kp-count">({pad(project.gallery.length)})</sup></h2>
            <div className="kp-grid">
              {rest.map((g, i) => (
                <figure className="kp-item" key={g.image}>
                  <button type="button" className="kp-media pd-zoom" data-cursor="View" aria-label={`View photo: ${g.caption}`} onClick={() => setViewing(i + 1)}>
                    <img src={g.image} alt={g.caption} loading="lazy" />
                  </button>
                  <figcaption className="kp-info"><span data-split="content">{g.caption}</span><span data-split="content" className="kp-detail">{pad(i + 2)}</span></figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Optional: equipment deployed, then technical scope, each titled on the left with its list in the right half. */}
        {hasDetails && (
          <section data-header-title="Details" className="px-5 pt-8 md:pt-16">
            {project.equipment?.length ? (
              <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-5">
                <h2 data-split className="pd-h2 md:col-span-6">Equipment deployed</h2>
                <ul className="pd-list w-full md:col-span-6 md:col-start-7 md:w-[780px] md:max-w-full">
                  {project.equipment.map((e, i) => (
                    <li key={e.name} data-reveal className="pd-list-row pd-equip pd-rule" style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
                      <span data-split="content">{e.name}</span>
                      {e.count != null && <span className="pd-count"><CountUp value={pad(e.count)} delay={200 + i * 90} /></span>}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.technical?.length ? (
              <div className={`grid gap-y-8 md:grid-cols-12 md:gap-x-5${project.equipment?.length ? " mt-24 md:mt-40" : ""}`}>
                <h2 data-split className="pd-h2 md:col-span-6">Technical scope</h2>
                <dl className="pd-list w-full md:col-span-6 md:col-start-7 md:w-[780px] md:max-w-full">
                  {project.technical.map((t, i) => (
                    <div key={t.label} data-reveal className="pd-list-row pd-list-row--kv pd-rule" style={{ "--rd": `${i * 0.08}s` } as CSSProperties}>
                      <dt data-split="content" className="text-black/45">{t.label}</dt>
                      <dd data-split="content" className="text-right">{t.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </section>
        )}

        {project.outcome && (
          <section data-header-title="Outcome" aria-labelledby="pd-outcome" className="px-5 pt-24 md:pt-40">
            <h2 id="pd-outcome" data-split="content" className="text-[.95rem] text-black/45">Project outcome</h2>
            <p data-split className="pd-outcome mt-8 md:mt-10">{project.outcome}</p>
          </section>
        )}

        {/* Next project: a large ruled link with the next cover. */}
        <section data-header-title="Next project" className="px-5 pb-24 pt-24 md:pb-36 md:pt-40">
          <a href={projectHref(next.slug)} className="pd-next group">
            <span className="pd-next-meta">
              <span data-split="content" className="text-black/45">Next project</span>
              <span data-split="content" className="text-black/45">{next.category}</span>
            </span>
            <span className="pd-next-body !flex-row md:!items-center">
              <span data-split className="pd-next-name md:!w-[860px] md:!max-w-full md:!text-[64px]">{next.name}</span>
              <span className="pd-next-media"><img src={next.gallery[0].image} alt="" loading="lazy" /></span>
            </span>
          </a>
        </section>
      </article>

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <Lightbox items={project.gallery} index={viewing} onIndex={setViewing} onClose={() => setViewing(null)} />
      <FluidCursor />
    </main>
  );
}
