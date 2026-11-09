import { useLayoutEffect, useRef } from "react";

// Closing statement above the footer, after lenvalproperties.com's CTA: a square, full-bleed photograph with a slow
// parallax, white hairlines (one down the centre, one rising across the right half) that draw in on entry, and a
// headline, short paragraph and underlined "Request a quotation" link set in the right half. Type follows the site
// (Aeonik). Cement silos photographed by Grant Ritchie (Unsplash), graded in CSS with a navy multiply that deepens
// toward the top right so the sky matches the HSE section's blue; the silos rise from the bottom left and the open
// sky carries the copy. A stand-in until BCE supplies photography of its own batching plants.
const PHOTO = "https://images.unsplash.com/photo-1627052428109-576e839d100a?auto=format&fit=crop&w=2400&q=75";

export default function QuoteCta({ href }: { href: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const diagRef = useRef<SVGSVGElement>(null);
  const diagLineRef = useRef<SVGLineElement>(null);

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
        <img ref={imgRef} src={PHOTO} alt="" loading="lazy" />
      </div>
      <div className="qc-lines" aria-hidden>
        <span className="qc-line-v" />
        <svg ref={diagRef} className="qc-line-d" viewBox="0 0 100 100">
          <line ref={diagLineRef} x1="0" y1="100" x2="100" y2="0" pathLength={1} />
        </svg>
      </div>

      <div className="qc-content">
        <h2 id="quote-title" data-split className="qc-title">Planning a project? Request a quotation.</h2>
        <div className="qc-desc">
          <p data-split="content">
            Tell us your site, scope and schedule, whether it is ready-mix concrete, piling, construction, slab works
            or equipment rental. Our engineers will review it and come back with a clear, detailed quotation, supplied
            from our own plants and fleet across Cambodia.
          </p>
          <a data-reveal href={href} className="qc-btn offer-reveal">
            <span className="qc-btn-label"><span>Request a quotation</span><span aria-hidden>Request a quotation</span></span>
            <span className="qc-btn-dot" aria-hidden />
            <span className="qc-btn-line" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
