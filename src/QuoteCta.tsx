import { useLayoutEffect, useRef } from "react";
import { homepage } from "./homepage";

// Closing statement above the footer, after lenvalproperties.com's CTA: a square, full-bleed photograph with a slow
// parallax, white hairlines (one down the centre, one rising across the right half) that draw in on entry, and a
// headline, short paragraph and underlined "Request a quotation" link set in the right half. Type follows the site
// (Aeonik). The photo, headline and copy are editable in the admin console.

export default function QuoteCta({ href }: { href?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const diagRef = useRef<SVGSVGElement>(null);
  const diagLineRef = useRef<SVGLineElement>(null);
  const { image: photo, title, text, ctaLabel, ctaHref } = homepage.quote;
  const target = href ?? ctaHref;

  // Keep the diagonal's viewBox in real pixels so the 1px hairline stays crisp at any aspect ratio.
  useLayoutEffect(() => {
    const svg = diagRef.current, line = diagLineRef.current;
    if (!svg || !line) return;
    const fit = () => {
      const { width: w, height: h } = svg.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      line.setAttribute("y1", String(h));
      line.setAttribute("x2", String(w));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current, img = imgRef.current;
    if (!section || !img) return;
    const lines = new IntersectionObserver(([e]) => e.isIntersecting && (section.classList.add("is-in"), lines.disconnect()), { threshold: 0.2 });
    lines.observe(section);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => lines.disconnect();

    // Parallax: the photo is 125% tall and slides from -20% to 0 while the section crosses the viewport.
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      img.style.transform = `translate3d(0, ${(-20 * (1 - p)).toFixed(2)}%, 0)`;
    };
    const request = () => (frame ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      lines.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
      img.style.transform = "";
    };
  }, []);

  return (
    <section ref={sectionRef} id="quote" data-nav-dark data-header-title="Request a quotation" aria-labelledby="quote-title" className="qc">
      <div className="qc-bg" aria-hidden>
        <img ref={imgRef} src={photo} alt="" loading="lazy" />
      </div>
      <div className="qc-lines" aria-hidden>
        <span className="qc-line-v" />
        <svg ref={diagRef} className="qc-line-d" viewBox="0 0 100 100">
          <line ref={diagLineRef} x1="0" y1="100" x2="100" y2="0" pathLength={1} />
        </svg>
      </div>

      <div className="qc-content">
        <h2 id="quote-title" data-split className="qc-title">{title}</h2>
        <div className="qc-desc">
          <p data-split="content">{text}</p>
          <a data-reveal href={target} className="qc-btn offer-reveal">
            <span className="qc-btn-label"><span>{ctaLabel}</span><span aria-hidden>{ctaLabel}</span></span>
            <span className="qc-btn-dot" aria-hidden />
            <span className="qc-btn-line" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
