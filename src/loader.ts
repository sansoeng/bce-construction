// Page-load loader, modelled on telhaclarke.com.au's Loader timeline:
// white panel fades -> wordmark letters roll in -> labels + 0-100% counter -> labels out,
// the page opens from the bottom and rises to full size over the wordmark while the cover shrinks into a
// centred frame -> the design holds until the first scroll, which opens the cover into the full banner.
import type Lenis from "lenis";
import { playSplit } from "./splitReveal";
import { revealHeader } from "./SiteHeader";

type Ease = (t: number) => number;
type Seg = [number, number, number, number, number, number, number, number];

const cubic = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

// Evaluates an SVG-style cubic path (GSAP CustomEase format) as an easing curve.
const pathEase = (segs: Seg[]): Ease => (x) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const s = segs.find((g) => x <= g[6]) ?? segs[segs.length - 1];
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (cubic(s[0], s[2], s[4], s[6], mid) < x) lo = mid;
    else hi = mid;
  }
  return cubic(s[1], s[3], s[5], s[7], (lo + hi) / 2);
};

const ease = {
  expoOut: ((t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))) as Ease,
  alpha: pathEase([[0, 0, 0.25, 0.46, 0.45, 0.9, 1, 1]]),
  fastInOut: pathEase([
    [0, 0, 0.094, 0.026, 0.124, 0.127, 0.157, 0.29],
    [0.157, 0.29, 0.197, 0.486, 0.254, 0.8, 0.348, 0.884],
    [0.348, 0.884, 0.42, 0.949, 0.374, 1, 1, 1],
  ]),
};

function tween(delay: number, duration: number, fn: Ease, update: (v: number) => void) {
  return new Promise<void>((resolve) => {
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      if (now >= start) {
        const p = Math.min((now - start) / (duration * 1000), 1);
        update(fn(p));
        if (p >= 1) return resolve();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const yPct = (el: HTMLElement, v: number) => (el.style.transform = `translate3d(0, ${v}%, 0)`);

export function runLoader(getLenis: () => Lenis | null) {
  const root = document.documentElement;
  const w = window as Window & { __bceLoaderStarted?: boolean };
  if (!root.classList.contains("is-loading") || w.__bceLoaderStarted) return;
  w.__bceLoaderStarted = true;

  const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s);
  const $$ = (s: string) => [...document.querySelectorAll<HTMLElement>(s)];
  const loader = $("[data-loader]");
  const panel = $("[data-loader-panel]");
  const logo = $("[data-loader-logo]");
  const overlay = $("[data-loader-overlay]");
  const counter = $("[data-loader-counter]");
  const main = $("main");
  if (!loader || !panel || !logo || !overlay || !counter || !main) return;

  const lettersTop = $$("[data-letters-top] > span");
  const lettersBottom = $$("[data-letters-bottom] > span");
  const titleLines = $$("[data-ll='title']");
  const locationLines = $$("[data-ll='location']");
  const statusLines = $$("[data-ll='status']");
  const heroSplits = $$("[data-split-manual]");
  const fly = $("[data-fly]");
  const media = $(".hero-media");

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  scrollTo(0, 0);
  getLenis()?.stop();
  // The page is offset below the wordmark, which gives the document a little scroll room; keep it pinned so an
  // anchor jump or stray scroll can never slide the page up over the wordmark while the loader holds.
  const pin = () => (scrollX || scrollY) && scrollTo(0, 0);
  addEventListener("scroll", pin);

  // Measure and animate only once the brand font is ready (capped), so line breaks and the wordmark never jump.
  const fontReady = Promise.all([
    document.fonts?.load('400 1em "Aeonik Pro"').catch(() => undefined),
    document.fonts?.load('500 1em "Aeonik Pro"').catch(() => undefined),
  ]);
  const play = () => {
    // Fit the wordmark to the full available width.
    const words = $$("[data-loader-word]");
    words.forEach((el) => (el.style.fontSize = "10vw"));
    const natural = words[0]?.offsetWidth || logo.clientWidth;
    words.forEach((el) => (el.style.fontSize = `${(10 * logo.clientWidth) / natural}vw`));

    const H = innerHeight;
    const W = innerWidth;
    const mobile = W < 768;
    const rem = parseFloat(getComputedStyle(root).fontSize) || 16;
    const side = (mobile ? 0.1 : 0.3) * W;
    const startTop = (mobile ? 1.1 : 1) * H;
    const logoTop = logo.getBoundingClientRect().top;

    // The page waits just under the wordmark, slightly scaled down, exactly like Telha's $app.
    const appScale = 1 - (4 * rem) / W;
    const appY = logo.offsetHeight;
    const setApp = (y: number, s: number) => (main.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`);
    const clip = (t: number, s: number) => (main.style.clipPath = `inset(${t}px ${s}px 0px ${s}px)`);
    const frame = (v: number) => {
      if (!fly || !media) return;
      fly.style.clipPath = `inset(${v * 0.25 * H}px ${v * 0.3 * W}px 0px)`;
      // Shrink toward the bottom edge so the image always fills the frame down to the viewport bottom.
    media.style.transformOrigin = "50% 100%";
    media.style.transform = `scale(${1 - v * 0.2})`;
    };
    setApp(appY, appScale);
    clip(startTop, side);
    // Desktop frames the cover on a white page, so hero copy / nav switch to their dark treatment.
    if (!mobile) root.classList.add("is-framed");

    lettersTop.forEach((el) => yPct(el, 120));
    lettersBottom.forEach((el) => yPct(el, 240));
    [...titleLines, ...locationLines, ...statusLines].forEach((el) => yPct(el, 100));

    // Phase A — intro
    const T0 = 0.25;
    tween(T0, 0.35, ease.alpha, (v) => (panel.style.opacity = String(1 - v))).then(() => (panel.style.visibility = "hidden"));
    const tA = T0 + 0.35 * 0.3;
    lettersTop.forEach((el, i) => tween(tA + i * 0.0475, 2, ease.expoOut, (v) => yPct(el, lerp(120, -120, v))));
    lettersBottom.forEach((el, i) => tween(tA + i * 0.0475, 2, ease.expoOut, (v) => yPct(el, lerp(240, 0, v))));
    const linesIn = (els: HTMLElement[], at: number) =>
      els.forEach((el, i) => tween(at + i * 0.075, 1.2, ease.expoOut, (v) => yPct(el, lerp(100, 0, v))));
    linesIn(titleLines, tA);
    linesIn(locationLines, tA + 0.1);
    linesIn(statusLines, tA + 0.2);
    tween(tA + 0.2, 3, ease.fastInOut, (v) => (counter.textContent = `${Math.round(v * 100)}%`));

    // Phase B — labels out; the page opens from the bottom and rises to full size over the wordmark,
    // while the cover settles into a centred frame and the header + hero title reveal.
    const tB = tA + 0.2 + 3 * (mobile ? 0.2 : 0.7);
    const linesOut = (els: HTMLElement[], at: number) =>
      els.forEach((el, i) => tween(at + i * 0.05, 1.2, ease.fastInOut, (v) => yPct(el, lerp(0, -100, v))));
    linesOut(titleLines, tB);
    linesOut(locationLines, tB + 0.1);
    linesOut(statusLines, tB + 0.2);

    const tLogo = tB + (mobile ? 0.2 + 1.2 * 0.25 : 0.1);
    const logoEnd = -logoTop - (mobile ? 0.06 : 0.12) * H;
    tween(tLogo, 1.7, ease.fastInOut, (v) => {
      logo.style.transform = `translate3d(0, ${lerp(0, logoEnd, v)}px, 0)`;
      clip(lerp(startTop, 0, v), lerp(side, 0, v));
      setApp(lerp(appY, 0, v), lerp(appScale, 1, v));
    });
    tween(tLogo + 0.6, 0.8, ease.alpha, (v) => (overlay.style.opacity = String(v * 0.9)));
    if (!mobile) tween(tLogo + 0.1, 1.2, ease.fastInOut, frame);

    const reveal = mobile ? tLogo + 1.7 * 0.3 : tLogo + 0.1 + 1.2 * 0.45;
    heroSplits.forEach((el) => setTimeout(() => playSplit(el), (reveal + Number(el.dataset.splitManual || 0)) * 1000));
    const tNav = reveal + 0.12;
    // The floating header runs its own Fluid-style intro (slide in, unfold) from here.
    setTimeout(revealHeader, tNav * 1000);
    const tBEnd = Math.max(tLogo + 1.7, tNav + 1.2);

    // In-page links (hero buttons, nav) can be clicked before the page is released: remember the target, open the
    // cover, then scroll there once the page is free.
    let pendingHash = "";
    let release: (() => void) | null = null;
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      pendingHash = a.hash;
      release?.();
    };
    addEventListener("click", onAnchor, true);

    const finish = () => {
      main.style.transform = "";
      main.style.clipPath = "";
      if (fly) fly.style.clipPath = "";
      if (media) {
        media.style.transform = "";
        media.style.transformOrigin = "";
      }
      root.classList.remove("is-loading", "is-framed", "is-hero-light");
      loader.hidden = true;
      removeEventListener("scroll", pin);
      removeEventListener("click", onAnchor, true);
      const lenis = getLenis();
      lenis?.resize();
      lenis?.start();
      const target = pendingHash ? document.querySelector<HTMLElement>(pendingHash) : null;
      if (target && lenis) {
        lenis.scrollTo(target);
      } else target?.scrollIntoView();
    };

    // Phase C — the page stays as designed with the framed cover until the visitor scrolls,
    // then the cover opens up into the full banner.
    const phaseC = () => {
      setTimeout(() => root.classList.add("is-hero-light"), 1200 * 0.28);
      tween(0, 1.2, ease.fastInOut, (v) => frame(1 - v)).then(finish);
    };

    setTimeout(() => {
      // Phones keep the cover full-bleed, so there is nothing to hold for.
      if (mobile) return finish();
      let done = false;
      const go = () => {
        if (done) return;
        done = true;
        removeEventListener("wheel", go);
        removeEventListener("touchmove", go);
        removeEventListener("keydown", go);
        phaseC();
      };
      release = go;
      if (pendingHash) return go();
      addEventListener("wheel", go, { passive: true });
      addEventListener("touchmove", go, { passive: true });
      addEventListener("keydown", go);
    }, tBEnd * 1000);
  };
  Promise.race([fontReady, new Promise((r) => setTimeout(r, 1500))]).then(play);
}
