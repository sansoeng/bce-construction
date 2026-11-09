import { useEffect, useSyncExternalStore } from "react";

// Rotating banner shots, in the order the work happens. Stand-in Unsplash photography until BCE supplies its own
// video or photos (the Corporate Profile PDF's images are too small for full-screen use). Credits:
// Nuril Ahsan, Troy Mortier, Jalal Ajmal, SLNC, Acton Crawford.
export const heroSlides = [
  { label: "Batching plant", id: "photo-1644939968795-c096f438ee75", position: "50% 40%" },
  { label: "Mixer trucks", id: "photo-1690719744562-249937b9c03a", position: "50% 55%" },
  { label: "Concrete pumping", id: "photo-1710585761854-57ff6839395c", position: "50% 62%" },
  { label: "Piling", id: "photo-1713249245785-59c218919b99", position: "50% 45%" },
  { label: "Slab works", id: "photo-1651195297119-afc97f14a40d", position: "50% 50%" },
];

const DURATION = 6000;
const n = heroSlides.length;
const url = (id: string, w: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

// Shared between the banner (inside the morphing cover) and the indicator, without re-rendering App.
// The first shot holds longer on a fresh load so it is not swapped mid-loader.
let state = {
  index: 0,
  prev: -1,
  dur: document.documentElement.classList.contains("is-loading") ? DURATION + 3500 : DURATION,
};
const subs = new Set<() => void>();
const show = (i: number) => {
  const index = (i + n) % n;
  if (index === state.index) return;
  state = { index, prev: state.index, dur: DURATION };
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => void subs.delete(f);
};
const useSlide = () => useSyncExternalStore(subscribe, () => state);

export function HeroMedia() {
  const { index, prev, dur } = useSlide();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    // Hold the current shot while the tab is hidden or the banner has been scrolled away.
    const tick = () => {
      if (document.hidden || scrollY > innerHeight) id = window.setTimeout(tick, 1000);
      else show(index + 1);
    };
    id = window.setTimeout(tick, dur);
    return () => clearTimeout(id);
  }, [index, dur]);

  return (
    <div data-hero-image className="absolute inset-0 will-change-transform">
      {heroSlides.map((s, i) => (
        <div key={s.id} className={`hero-slide${i === index ? " is-active" : i === prev ? " is-prev" : ""}`}>
          <img
            src={url(s.id, 1920)}
            srcSet={[800, 1280, 1920, 2560].map((w) => `${url(s.id, w)} ${w}w`).join(", ")}
            sizes="100vw"
            alt=""
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
            style={{ objectPosition: s.position }}
          />
        </div>
      ))}
    </div>
  );
}

export function HeroIndicator({ className = "" }: { className?: string }) {
  const { index, dur } = useSlide();
  return (
    <div data-hero-copy className={`hero-ind ${className}`}>
      <div data-split-manual="0.45" className="hero-reveal flex items-center gap-4">
        <span className="w-6 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <div className="flex items-center gap-1.5">
          {heroSlides.map((s, i) => (
            <button key={s.id} type="button" className="hero-seg" aria-label={`Show ${s.label}`} aria-current={i === index} onClick={() => show(i)}>
              <span
                key={i === index ? `on-${index}` : "off"}
                className={`hero-seg-fill${i === index ? " is-on" : ""}`}
                style={i === index ? { animationDuration: `${dur}ms` } : undefined}
              />
            </button>
          ))}
        </div>
        <span className="hero-ind-label hidden overflow-hidden md:block">
          <span key={index} className="block">{heroSlides[index].label}</span>
        </span>
      </div>
    </div>
  );
}
