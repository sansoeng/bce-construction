import { useLayoutEffect, useRef } from "react";

// Why Choose BCE, after fluid.glass/about: "The beliefs that shape us" (three oversized words at staggered offsets,
// each with a small mono tag). Content distilled from "Our integrated advantage", Corporate Profile 2026, p. 07.
const beliefs = [
  ["Quality", "Tested at every stage"],
  ["Capacity", "Our own plants and fleet"],
  ["Trust", "Partners for the long term"],
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const power3InOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Eyebrow({ children, id }: { children: string; id?: string }) {
  return <h2 id={id} data-split="content" className="wb-eyebrow">{children}</h2>;
}

export default function WhyBCE() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const masks = [...container.querySelectorAll<HTMLElement>(".wb-mask")];
    const tags = [...container.querySelectorAll<HTMLElement>(".wb-tag")];

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const mobile = innerWidth < 768;
      const vh = innerHeight;
      const r = container.getBoundingClientRect();
      // Scrubbed from the container's top meeting the viewport bottom to its bottom doing so (centre on phones).
      const p = clamp01((vh - r.top) / Math.max(1, r.height - (mobile ? vh / 2 : 0)));
      // fluid.glass timeline (0.6 long): words rise 150% -> 0 over 0.5 each, staggered 0.05; tags fade in over 0.1
      // from 0.4 (0.3 on phones), staggered 0.05.
      const t = p * 0.6;
      masks.forEach((el, k) => {
        const e = power3InOut(clamp01((t - k * 0.05) / 0.5));
        el.style.transform = `translate3d(0, ${(150 * (1 - e)).toFixed(2)}%, 0)`;
      });
      tags.forEach((el, k) => {
        const o = power3InOut(clamp01((t - (mobile ? 0.3 : 0.4) - k * 0.05) / 0.1));
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o > 0 ? "visible" : "hidden";
      });
    };
    const request = () => (frame ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
      [...masks, ...tags].forEach((el) => el.removeAttribute("style"));
    };
  }, []);

  return (
    <section data-header-title="Why BCE" aria-labelledby="why-title" className="wb relative z-[2] -mt-[100svh]">
      <div className="wb-head"><Eyebrow id="why-title">Why choose BCE</Eyebrow></div>
      <div ref={containerRef} className="wb-container">
        {beliefs.map(([word, tag]) => (
          <div className="wb-block" key={word}>
            <div className="wb-heading"><div className="wb-mask">{word}</div></div>
            <div className="wb-tag">{tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
