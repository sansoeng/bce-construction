// Photographs drift against the page as their frames cross the viewport, after olympic.no's image parallax: the photo
// sits slightly larger than its frame and runs from −5% to +5% of the frame's height between the frame entering the
// bottom of the screen and leaving the top. The page therefore moves past the photo rather than with it.
//
// Olympic drives this with a CSS view timeline (`animation-timeline: --parallax-animation`, `entry 0% → cover 100%`).
// Scroll-driven animations are not available in every browser yet, so the drift is written here on one rAF pass while
// the page scrolls. Only the compositor-only `translate` and `scale` properties are touched, which leaves every
// existing `transform` animation (hover zooms, cover drifts, photo wipes) working exactly as before, and no layout is
// read back except the photo's own rect.
//
// Every photo on the site is picked up automatically: an <img> that paints with `object-fit: cover`, is large enough
// to read as a photograph, and sits inside a clipping frame (so the 12% overscan cannot spill). Anything marked
// `data-no-parallax`, the admin console, the loader, the lightbox and the floating navigation are left alone.

const SCALE = 1.12; // 6% of overscan on each side, so a ±5% drift never shows an edge
const DRIFT = 5; // % of the frame's height, each way
const MIN_WIDTH = 280;
const MIN_HEIGHT = 140;
const SKIP = "[data-no-parallax], [data-loader], .lb, .ls-nav, .fg-header, .bce-admin";

type Item = { el: HTMLImageElement; drift: number };

/** The photo's clipping frame: the nearest ancestor that crops it, so the 12% overscan cannot spill. */
const frameOf = (img: HTMLImageElement): HTMLElement | null => {
  let frame = img.parentElement;
  for (let depth = 0; depth < 3 && frame; depth++, frame = frame.parentElement) {
    const style = getComputedStyle(frame);
    if (style.overflow !== "visible" || style.overflowX !== "visible" || style.overflowY !== "visible") return frame;
  }
  return null;
};

const qualifies = (img: HTMLImageElement): boolean => {
  if (img.closest(SKIP)) return false;
  const style = getComputedStyle(img);
  if (style.objectFit !== "cover" || style.display === "none" || style.visibility === "hidden") return false;
  const frame = frameOf(img);
  if (!frame) return false;
  // The frame's own size decides: a photo that is not laid out yet (a stacked, cross-fading layer, say) still belongs
  // to the drift, while a small tile or an icon does not.
  const rect = frame.getBoundingClientRect();
  return rect.width >= MIN_WIDTH && rect.height >= MIN_HEIGHT;
};

/** Start the drift. Returns a teardown for the caller (the app keeps it for the lifetime of the page). */
export function initImageParallax(): () => void {
  if (typeof window === "undefined") return () => {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) return () => {};

  let items: Item[] = [];
  let pending = 0;

  const update = () => {
    const viewport = window.innerHeight || 1;
    for (const item of items) {
      const rect = item.el.getBoundingClientRect();
      if (rect.height === 0) continue;
      // Only the photos on screen (with a screen's worth of slack) are worth the maths.
      if (rect.bottom < -viewport * 0.5 || rect.top > viewport * 1.5) continue;
      // 0 when the frame starts entering at the bottom, 1 once it has left at the top.
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      const drift = Math.round((progress - 0.5) * 2 * DRIFT * 100) / 100;
      if (drift === item.drift) continue;
      item.drift = drift;
      item.el.style.translate = `0 ${drift}%`;
    }
  };

  // Scroll events are already frame-aligned in every browser, and reading ~20 rects per event is cheaper than keeping
  // a second rAF loop alive next to Lenis's.
  const request = () => update();

  const collect = () => {
    pending = 0;
    items = [];
    for (const el of document.querySelectorAll<HTMLImageElement>("main img")) {
      if (!qualifies(el)) continue;
      el.style.scale = String(SCALE);
      el.style.willChange = "translate";
      items.push({ el, drift: Number.NaN });
    }
    update();
  };

  // A timer rather than rAF: collection must also happen in a throttled or background tab, where rAF is paused.
  const scheduleCollect = () => {
    if (!pending) pending = window.setTimeout(collect, 60);
  };

  // Pages mount, remount on route changes and receive live content after bootstrap: recollect whenever the tree moves
  // or a photo arrives and changes its frame's height.
  const mo = new MutationObserver(scheduleCollect);
  mo.observe(document.body, { childList: true, subtree: true });

  const onResize = () => scheduleCollect();
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", request, { passive: true });
  document.addEventListener("load", scheduleCollect, true);
  reduced.addEventListener("change", scheduleCollect);

  collect();

  return () => {
    mo.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", request);
    document.removeEventListener("load", scheduleCollect, true);
    reduced.removeEventListener("change", scheduleCollect);
    window.clearTimeout(pending);
    for (const item of items) {
      item.el.style.removeProperty("translate");
      item.el.style.removeProperty("scale");
      item.el.style.removeProperty("will-change");
    }
    items = [];
  };
}
