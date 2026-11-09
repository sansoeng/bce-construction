import { useLayoutEffect, useRef } from "react";
import { getLang, translate } from "./i18n";

// "Who we are" as a scroll-driven zoom-out, after toptier.relats.com's intro: a sticky screen inside a 400vh section
// (200vh below 1100px) holds a brick grid of full-screen photos (two above, three across the middle, two below). The
// middle photo fills the screen; as you scroll the grid scales from 1 to .51 (linear), every photo clips in to
// inset(10px round 10px) (expo.out), and in the last stretch the grid and copy drift up 25vh (expo.in) into the exit.
// Over the same scroll two statements fade in character by character, then out again (their 0-2 in, 2-4 out, 4-6
// in, 6-8 out timeline). Khmer fades by word, since splitting Khmer clusters into separate spans breaks their shaping.
// Photos are stand-ins from the project gallery (Unsplash) until BCE supplies its own.
const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=70`;

type Tile = { pos: string; id: string; alt: string };
const ROWS: { row: string; tiles: Tile[] }[] = [
  { row: "top", tiles: [
    { pos: "midleft", id: "photo-1784644579477-3fa2b0af8ac2", alt: "Mixer truck discharging beside the excavation" },
    { pos: "midright", id: "photo-1531834685032-c34bf0d84c77", alt: "Reinforcement cages assembled for the core walls" },
  ] },
  { row: "center", tiles: [
    { pos: "left", id: "photo-1706922685061-e346647bde61", alt: "Paver laying asphalt on the widened section" },
    { pos: "center", id: "photo-1652900150494-90cb5cfa44d8", alt: "Rotary rig drilling at the pier" },
    { pos: "right", id: "photo-1527410651988-c2f385ccd3f7", alt: "Mixer trucks lined up" },
  ] },
  { row: "bottom", tiles: [
    { pos: "midleft", id: "photo-1685464196387-854858ce0f4f", alt: "Hand finishing along the slab edge" },
    { pos: "midright", id: "photo-1649587345666-0f4ad68aa723", alt: "Warehouse frame rising over the prepared sub-base" },
  ] },
];

const TITLES = [
  "Engineering and construction, from Battambang across Cambodia since 1995",
  "Concrete, piling, construction and fleet, all under one roof",
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
const expoIn = (t: number) => (t <= 0 ? 0 : 2 ** (10 * t - 10));

type WordSegmenter = { segment(text: string): Iterable<{ segment: string; isWordLike?: boolean }> };
const SegmenterCtor = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: "word" }) => WordSegmenter }).Segmenter;

// English: words (kept whole when wrapping) made of character spans. Khmer: one span per dictionary word.
function Statement({ text, index }: { text: string; index: number }) {
  const khmer = getLang() === "km";
  if (khmer) {
    const words = SegmenterCtor ? [...new SegmenterCtor("km", { granularity: "word" }).segment(text)].map((s) => s.segment) : text.split(/(\s+)/);
    return (
      <p className={`abz-title abz-title-${index}`} aria-hidden>
        {words.map((w, i) => (/^\s+$/.test(w) ? w : <span key={i} className="abz-char">{w}</span>))}
      </p>
    );
  }
  return (
    <p className={`abz-title abz-title-${index}`} aria-hidden>
      {text.split(/(\s+)/).map((w, i) =>
        /^\s+$/.test(w) ? " " : (
          <span key={i} className="abz-word">
            {[...w].map((c, k) => <span key={k} className="abz-char">{c}</span>)}
          </span>
        ),
      )}
    </p>
  );
}

export default function AboutZoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const titles = TITLES.map(translate);

  useLayoutEffect(() => {
    const section = sectionRef.current, rows = rowsRef.current, center = centerRef.current;
    if (!section || !rows || !center) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("is-static");
      return;
    }
    const tiles = [...rows.querySelectorAll<HTMLElement>(".abz-tile")];
    const charSets = [...center.querySelectorAll<HTMLElement>(".abz-title")].map((t) => [...t.querySelectorAll<HTMLElement>(".abz-char")]);

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = section.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - innerHeight));
      const lift = -25 * expoIn(p);
      rows.style.transform = `translate3d(0, ${lift.toFixed(3)}vh, 0) scale(${(1 - 0.49 * p).toFixed(4)})`;
      center.style.transform = `translate3d(0, ${lift.toFixed(3)}vh, 0)`;
      const inset = (10 * expoOut(p)).toFixed(2);
      tiles.forEach((t) => (t.style.clipPath = `inset(${inset}px round ${inset}px)`));
      // Each statement: characters fade in one after another over 2 units, then out over the next 2.
      const T = p * 4 * charSets.length;
      charSets.forEach((chars, i) => {
        const n = chars.length;
        chars.forEach((c, k) => {
          const start = 4 * i + k / n;
          c.style.opacity = String(Math.max(0.0001, clamp01(T - start) - clamp01(T - start - 2)));
        });
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
    };
  }, []);

  return (
    <section ref={sectionRef} data-nav-dark data-header-title="Who we are" aria-labelledby="ab-who" className="abz mt-24 md:mt-40">
      <h2 id="ab-who" className="sr-only">Who we are</h2>
      <p className="sr-only">{titles.join(". ")}</p>
      <div className="abz-sticky">
        <div ref={rowsRef} className="abz-rows">
          {ROWS.map(({ row, tiles }) => (
            <div key={row} className={`abz-row abz-row-${row}`}>
              {tiles.map((t) => (
                <div key={t.id} className={`abz-tile abz-${t.pos}`}>
                  <img src={photo(t.id)} alt="" loading={t.pos === "center" ? "eager" : "lazy"} decoding="async" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div ref={centerRef} className="abz-copy">
          {titles.map((t, i) => <Statement key={i} text={t} index={i} />)}
        </div>
      </div>
    </section>
  );
}
