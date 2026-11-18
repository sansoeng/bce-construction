import { useLayoutEffect, useRef } from "react";
import ArrowButton from "./ArrowButton";
import { quality } from "./quality";

// Equipment & fleet on the homepage, after olympic.no's "FLEET FOCUS" (fullscreen-media) section: a centred mono label
// and headline, then a sticky screen holding one photographic panel. As the panel enters, its frame opens from a
// centred half-width window to the full page width (their clip-path inset 25% → 0) while the photo itself pulls back
// from 1.16 to 1, so the shot zooms out rather than sliding.
//
// Olympic drives this with a CSS view timeline; scroll timelines are not in every browser yet, so the same curve is
// written on one rAF per scroll, like AboutZoom and useScrollParallax. Type, colours and the CTA stay BCE's: the
// homepage's heading scale, .ol-label and ArrowButton. Only the layout and the zoom-out come from Olympic.

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function FleetBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const fleet = quality.fleet;

  useLayoutEffect(() => {
    const section = sectionRef.current, frame = frameRef.current;
    if (!section || !frame) return;
    const panel = frame.querySelector<HTMLElement>(".flb-panel");
    const photo = frame.querySelector<HTMLImageElement>(".flb-media img");
    const copy = frame.querySelector<HTMLElement>(".flb-copy");
    if (!panel || !photo || !copy) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("is-static");
      return;
    }

    let frameId = 0;
    // The panel opens out of a rounded window into a square full-bleed screen; follow the shared corner token.
    const radius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--radius")) || 8;
    const update = () => {
      frameId = 0;
      const viewport = innerHeight || 1;
      const rect = frame.getBoundingClientRect();
      // 0 when the panel's frame touches the bottom of the screen, 1 once its top reaches the top of the screen.
      const p = clamp01((viewport - rect.top) / viewport);
      const e = easeInOut(p);
      // Olympic's inset: a centred half-width window that opens to the full screen.
      const inset = (24 * (1 - e)).toFixed(2);
      panel.style.clipPath = `inset(0 ${inset}% 0 ${inset}% round ${(radius * (1 - e)).toFixed(2)}px)`;
      // The photo starts tighter in the frame and pulls back as it opens: the zoom-out.
      photo.style.transform = `scale(${(1.16 - 0.16 * e).toFixed(4)})`;
      // The copy arrives once the panel is mostly open, so it never reads through a narrow slice.
      const copyIn = easeInOut(clamp01((p - 0.45) / 0.35));
      copy.style.opacity = copyIn.toFixed(3);
      copy.style.transform = `translate3d(0, ${(16 * (1 - copyIn)).toFixed(2)}px, 0)`;
    };
    const request = () => (frameId ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frameId);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="fleet-evidence"
      data-header-title="Equipment & fleet"
      aria-labelledby="home-fleet-title"
      className="flb"
    >
      <div className="site-pad">
        <div className="flb-intro">
          <p className="ol-label">{fleet.kicker}</p>
          <h2 id="home-fleet-title" className="flb-title">
            {fleet.title}
          </h2>
        </div>
      </div>

      <div className="flb-spacer">
        <div ref={frameRef} className="flb-frame">
          <div className="flb-panel">
            <div className="flb-media">
              <img data-no-parallax src={fleet.image} alt={fleet.imageAlt} loading="lazy" decoding="async" />
              <span className="flb-scrim" aria-hidden />
            </div>
            <div className="flb-copy">
              <p className="flb-text">{fleet.copy[0]}</p>
              <div className="flb-actions">
                <ArrowButton href="/fleet" label="Explore the fleet" theme="white" />
                <ArrowButton href={fleet.ctaHref} label={fleet.ctaLabel} theme="outline-white" />
              </div>
            </div>
            <span className="flb-corner flb-corner-tl" aria-hidden />
            <span className="flb-corner flb-corner-tr" aria-hidden />
            <span className="flb-corner flb-corner-bl" aria-hidden />
            <span className="flb-corner flb-corner-br" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
