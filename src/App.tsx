import { useEffect, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { LENIS_OPTIONS } from "./smoothScroll";
import { initSplitReveal, playSplit } from "./splitReveal";
import { runLoader } from "./loader";
import Coverage from "./Coverage";
import WhyBCE from "./WhyBCE";
import Footer from "./Footer";
import QuoteCta from "./QuoteCta";
import Glance, { GlanceIcon, type IconKind } from "./Glance";
import { HeroVideo } from "./HeroSlides";
import SiteHeader from "./SiteHeader";
import ArrowButton from "./ArrowButton";
import FluidCursor from "./FluidCursor";
import { projectHref, projects } from "./projects";
import { commitments, offerings, businessHref } from "./company";

const A = "/assets";

// The scroll choreography in App is imperative DOM setup. A new value on every live update of this module makes it
// tear down and set up again, so edits never leave it driving elements React has since replaced.
const SETUP_ID = import.meta.hot ? Date.now() : 0;

// The loader outlives React StrictMode's effect re-runs, so it always talks to the current Lenis instance.
let activeLenis: Lenis | null = null;

const LOADER_LETTERS = [..."BCE., LTD."];

function Loader() {
  const letters = LOADER_LETTERS.map((c, i) => <span key={i} className="inline-block">{c === " " ? "\u00a0" : c}</span>);
  const line = (group: string, text: string, extra?: object) => (
    <span className="block overflow-hidden"><span data-ll={group} className="block" {...extra}>{text}</span></span>
  );
  return (
    <div data-loader aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-[1.05rem] leading-[1.2] text-white">
      <div className="absolute inset-0 flex items-center px-5">
        <div data-loader-logo className="w-full py-5">
          <div className="relative overflow-hidden leading-none">
            <div data-letters-top data-loader-word className="loader-word inline-block whitespace-nowrap">{letters}</div>
            <div data-letters-bottom data-loader-word className="loader-word absolute left-0 top-0 whitespace-nowrap">{letters}</div>
          </div>
        </div>
      </div>
      <div data-loader-overlay className="absolute inset-0 bg-black opacity-0" />
      <div className="absolute left-5 top-5">{line("title", "Construction company")}{line("title", "Infrastructure & building")}</div>
      <div className="absolute inset-x-5 bottom-5 grid grid-cols-2 gap-5 md:bottom-auto md:top-5 md:grid-cols-12">
        <div className="text-white/60 md:col-span-4 md:col-start-5">{line("location", "Battambang")}{line("location", "Cambodia")}</div>
        <div className="text-right md:col-span-4 md:col-start-9">{line("status", "Loading")}{line("status", "0%", { "data-loader-counter": "", style: { fontVariantNumeric: "tabular-nums" } })}</div>
      </div>
      <div data-loader-panel className="absolute inset-0 bg-white" />
    </div>
  );
}

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const year = (period: string) => (period.match(/\d{4}/g) ?? []).pop() ?? "";

const HERO_NEWS = [
  {
    badge: "Landmark Project",
    title: "BCE Completes High-Strength Foundation Piling for Borey Peng Huoth",
    excerpt: "Over 1,200 spun concrete piles driven with hydraulic precision rigs.",
    date: "2025–2026",
    href: "/?projects#piling",
  },
  {
    badge: "Fleet Dispatch",
    title: "41 Ready-Mix Mixers & 8 Boom Pumps Active Across 14 Provinces",
    excerpt: "24/7 site pouring dispatch maintaining 480 m³/h production capacity.",
    date: "Active Dispatch",
    href: "/?businesses#batching-plants",
  },
  {
    badge: "Quality Lab",
    title: "In-House Lab Certified with DYE-2000 Automated Compression Testing",
    excerpt: "Real-time slump cone verification and 28-day break tests compliant with ACI 211.1.",
    date: "Certified Standards",
    href: "/?quality",
  },
];

function HeroLatestNews() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_NEWS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const item = HERO_NEWS[current];

  return (
    <div
      className="hero-news-card group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono tracking-wider uppercase text-white/90">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Latest Update
          </span>
          <span className="text-[11px] font-mono text-white/40 uppercase">{item.date}</span>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="size-6 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm"
            aria-label="Previous update"
            onClick={() => setCurrent((prev) => (prev - 1 + HERO_NEWS.length) % HERO_NEWS.length)}
          >
            ‹
          </button>
          <span className="text-[10px] font-mono text-white/40">
            {current + 1}/{HERO_NEWS.length}
          </span>
          <button
            type="button"
            className="size-6 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm"
            aria-label="Next update"
            onClick={() => setCurrent((prev) => (prev + 1) % HERO_NEWS.length)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="pt-2.5">
        <span className="text-[10.5px] font-mono uppercase tracking-wider text-sky-400 font-medium">
          {item.badge}
        </span>
        <a
          href={item.href}
          className="block mt-1 text-[13.5px] md:text-[14.5px] font-medium text-white/95 leading-snug hover:text-sky-300 transition-colors line-clamp-2"
        >
          {item.title}
        </a>
        <p className="mt-1 text-[11.5px] text-white/60 line-clamp-2 leading-relaxed">
          {item.excerpt}
        </p>
        <a
          href={item.href}
          className="inline-flex items-center gap-1.5 mt-2.5 text-[11px] font-mono tracking-wide text-white/80 hover:text-white transition-colors uppercase"
        >
          <span>View story</span>
          <span className="text-sky-400">›</span>
        </a>
      </div>
    </div>
  );
}

function App() {
  const [showLoader] = useState(() => document.documentElement.classList.contains("is-loading"));

  useEffect(() => {
    const cleanupSplit = initSplitReveal();
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduceMotion ? null : new Lenis(LENIS_OPTIONS);
    activeLenis = lenis;
    (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;
    if (document.documentElement.classList.contains("is-loading")) {
      lenis?.stop();
      runLoader(() => activeLenis);
    }
    // Per-frame effects that must see the scroll position Lenis has just set, in the same frame.
    let kpTick: ((time: number) => void) | null = null;
    let rafId = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      kpTick?.(time);
      rafId = requestAnimationFrame(loop);
    };
    if (lenis) rafId = requestAnimationFrame(loop);

    // The banner stays pinned while the About panel slides over it; progress is 0 -> 1 across one viewport.
    // The banner photo shrinks from full-screen into the About image frame across the first viewport of scroll.
    const fly = document.querySelector<HTMLElement>("[data-fly]");
    const flyAbout = document.querySelector<HTMLElement>("[data-fly-about]");
    const heroImage = document.querySelector<HTMLElement>("[data-hero-image]");
    const spacer = document.querySelector<HTMLElement>("[data-hero-spacer]");
    const slot = document.querySelector<HTMLElement>("[data-about-slot]");
    const slotImage = slot?.querySelector<HTMLElement>("img");
    const heroCopy = document.querySelectorAll<HTMLElement>("[data-hero-copy]");
    const aboutIntro = document.querySelector<HTMLElement>("[data-about-intro]");
    const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

    // Core offering (after lpas.com): the section pins full screen while vertical scroll slides the panel track in from
    // the right edge, 1px for 1px. Arriving panels grow their photo to full height, and their copy reveals once in.
    const offers = document.querySelector<HTMLElement>("[data-offers]");
    const oSticky = document.querySelector<HTMLElement>("[data-offers-sticky]");
    const oTrack = document.querySelector<HTMLElement>("[data-offers-track]");
    const oHead = document.querySelector<HTMLElement>("[data-offers-head]");
    const oTitle = document.querySelector<HTMLElement>("#offers-title");
    const oPanels = [...document.querySelectorAll<HTMLElement>("[data-offer-panel]")];
    const oMedia = oPanels.map((p) => p.querySelector<HTMLElement>("[data-offer-media]"));
    const oImages = oPanels.map((p) => p.querySelector<HTMLElement>("[data-offers-image]"));
    let offersShift = 0;
    let oLefts: number[] = [];
    let oWidth = 0;
    // clientWidth leaves out a classic scrollbar, so the last panel ends flush with the visible edge.
    const viewW = () => document.documentElement.clientWidth || innerWidth;
    const sizeOffers = () => {
      if (!offers || !oTrack || !oSticky) return;
      offersShift = Math.max(oTrack.offsetWidth - viewW(), 0);
      oLefts = oPanels.map((p) => p.offsetLeft);
      oWidth = oPanels[0]?.offsetWidth || 0;
      offers.style.height = `${oSticky.offsetHeight + offersShift}px`;
    };
    const updateOffers = () => {
      if (!offers || !oTrack) return;
      const rect = offers.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const W = viewW();
      // The title is pinned below the split reveal's 85% trigger line, so it starts here once the section is well in.
      if (oTitle && rect.top < innerHeight * 0.4 && !oTitle.classList.contains("is-split-in") && !oTitle.dataset.timer) {
        oTitle.dataset.timer = "pending";
        playSplit(oTitle);
      }
      const x = offersShift * clamp(-rect.top / Math.max(offersShift, 1));
      oTrack.style.transform = `translate3d(${-x}px, 0, 0)`;
      // The opening screen recedes as the panels slide over it.
      if (oHead) oHead.style.opacity = String(1 - clamp((x - W * 0.3) / (W * 0.6)));
      oPanels.forEach((panel, i) => {
        const left = oLefts[i] - x;
        panel.classList.toggle("is-in", left < W * 0.62);
        if (reduceMotion || left > W || left + oWidth < 0) return;
        // Photo height grows from 78% to full as the panel travels in (full once wholly on screen); it also drifts against the track.
        const t = clamp((W - left) / Math.max(oWidth, 1));
        const media = oMedia[i];
        if (media) media.style.clipPath = `inset(0 0 ${(1 - t) * 22}% 0)`;
        const d = Math.min(Math.max((left + oWidth / 2) / W - 0.5, -0.6), 0.6);
        const img = oImages[i];
        if (img) img.style.transform = `translate3d(${d * -8}%, 0, 0)`;
      });
    };

    // Our commitment (after telhaclarke.com.au's Vision): a portrait frame grows out to full screen over a fixed photo,
    // carrying the rule row on its edges. Once full, the titles rise in; pinned scroll then steps through the items,
    // each change gliding the title track over on its own timing while the paragraph swaps line by line.
    const vision = document.querySelector<HTMLElement>("[data-vision]");
    const vTrack = document.querySelector<HTMLElement>("[data-vision-track]");
    const vTitles = [...document.querySelectorAll<HTMLElement>("[data-vision-title]")];
    const vTexts = [...document.querySelectorAll<HTMLElement>("[data-vision-text]")];
    const vNum = document.querySelector<HTMLElement>("[data-vision-num]");
    const vFrame = document.querySelector<HTMLElement>("[data-vision-frame]");
    const vShade = document.querySelector<HTMLElement>("[data-vision-shade]");
    const vCopy = document.querySelector<HTMLElement>("[data-vision-copy]");
    const vRule = document.querySelector<HTMLElement>("[data-vision-rule]");
    const vImgScroll = document.querySelector<HTMLElement>("[data-vision-image-scroll]");
    let vActive = -1;
    const placeVision = (active: number) => {
      if (!vTrack || !vTitles.length) return;
      const x = vTitles[active].offsetLeft - vTitles[0].offsetLeft;
      vTrack.style.transform = `translate3d(${-x}px, 0, 0)`;
    };
    const updateVision = () => {
      if (!vision || !vTrack || !vTitles.length) return;
      const H = innerHeight;
      const total = Math.max(vision.offsetHeight - H, 1);
      const rect = vision.getBoundingClientRect();
      // Opening: runs while the section rises into view and for the first `grow` px of pinned scroll.
      const grow = H * 0.6;
      const g = clamp((H - rect.top) / (H + grow));
      const e = g < 0.5 ? 2 * g * g : 1 - (-2 * g + 2) ** 2 / 2;
      // The frame's sides and top open out to the viewport; the photo itself stays put, so the frame uncovers it.
      const side = 34 * (1 - e);
      if (vFrame) {
        vFrame.style.clipPath = `inset(${22 * (1 - e)}% ${side}% 0 ${side}%)`;
        vFrame.style.setProperty("--vs", `${side}vw`);
      }
      if (vShade) vShade.style.opacity = String(0.35 + 0.1 * e);
      if (vRule) vRule.style.opacity = String(clamp((e - 0.45) / 0.2));
      // Titles and copy only come in once the frame fills the screen.
      const open = e > 0.97 && rect.bottom > H * 0.5;
      vCopy?.classList.toggle("is-on", open);
      const vp = clamp((-rect.top - grow) / Math.max(total - grow, 1));
      if (vImgScroll) {
        if (reduceMotion) {
          vImgScroll.style.transform = "";
        } else {
          // Smooth parallax scroll: image glides upward with scroll through the 5 commitment pillars
          const yPercent = -14 * vp;
          vImgScroll.style.transform = `translate3d(0, ${yPercent.toFixed(2)}%, 0)`;
        }
      }
      // Each item holds an equal share of the pinned scroll; crossing into the next one triggers the glide (CSS).
      const active = Math.min(Math.floor(vp * vTitles.length), vTitles.length - 1);
      if (active !== vActive) {
        vActive = active;
        placeVision(active);
        vTitles.forEach((el, k) => el.classList.toggle("is-active", k === active));
      }
      vTexts.forEach((el, k) => el.classList.toggle("is-active", open && k === active));
      if (vNum) vNum.textContent = `0${active + 1}`;
    };
    let ticking = false;
    const update = () => {
      ticking = false;
      updateVision();
      updateOffers();
      const H = spacer?.offsetHeight || innerHeight;
      const p = clamp(scrollY / H);
      const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
      if (fly && slot) {
        const r = slot.getBoundingClientRect();
        const targetTop = r.top + scrollY - H; // slot position once the panel has fully risen
        const flyW = innerWidth + (r.width - innerWidth) * e;
        const flyH = innerHeight + (r.height - innerHeight) * e;
        fly.style.left = `${r.left * e}px`;
        fly.style.top = `${targetTop * e}px`;
        fly.style.width = `${flyW}px`;
        fly.style.height = `${flyH}px`;
        fly.style.visibility = p >= 1 ? "hidden" : "visible";
        // The About intro sits under the shrinking photo, so its lines only rise once the photo has cleared it.
        if (aboutIntro && !aboutIntro.classList.contains("is-split-in") && !aboutIntro.dataset.timer) {
          const ir = aboutIntro.getBoundingClientRect();
          const clear = p >= 1 || r.left * e + flyW <= ir.left - 16 || targetTop * e + flyH <= ir.top - 16;
          if (clear && ir.top < innerHeight * 0.9) {
            aboutIntro.dataset.timer = "pending";
            playSplit(aboutIntro);
          }
        }
      }
      if (slotImage) slotImage.style.opacity = p >= 1 ? "1" : "0";
      if (flyAbout) flyAbout.style.opacity = String(clamp((p - 0.6) / 0.4));
      if (heroImage) heroImage.style.transform = `scale(${1.08 - 0.08 * e})`;
      heroCopy.forEach((el) => {
        const o = clamp(1 - p * 2.5);
        el.style.opacity = String(o);
        // Visible copy falls back to its own CSS, so layers inside the cover (the scrim) stay click-through.
        el.style.pointerEvents = o > 0.1 ? "" : "none";
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    // After landing, the image stays pinned (CSS sticky) until its bottom meets the heading's first line.
    const track = document.querySelector<HTMLElement>("[data-about-track]");
    const title = document.querySelector<HTMLElement>("[data-about-title]");
    const sizeTrack = () => {
      sizeOffers();
      if (vActive >= 0) placeVision(vActive);
      if (!track || !title) return;
      const lineHeight = parseFloat(getComputedStyle(title).lineHeight) || 0;
      track.style.height = innerWidth >= 768 ? `${title.offsetTop + lineHeight}px` : "";
      onScroll();
    };
    sizeTrack();
    document.fonts?.ready.then(sizeTrack);
    addEventListener("resize", sizeTrack);
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    // Arriving at a #section from another page (no loader): jump there once the pinned sections have their heights.
    const hashTarget = location.hash.length > 1 && !document.documentElement.classList.contains("is-loading")
      ? document.querySelector<HTMLElement>(location.hash) : null;
    if (hashTarget) requestAnimationFrame(() => (lenis ? lenis.scrollTo(hashTarget, { immediate: true, force: true }) : hashTarget.scrollIntoView()));

    // Selected Projects (after fluid.glass's product collection): every box scrolls at its own rate, some a touch
    // faster than the page and some slower, so the grid drifts apart and settles as it passes. Each box sits exactly
    // at its layout position when centred in the viewport; Lenis supplies the ease-in/out. Runs in the Lenis frame;
    // layout is only measured on resize.
    const kpSection = document.querySelector<HTMLElement>("#projects");
    const kpItems = [...document.querySelectorAll<HTMLElement>(".kp-item")];
    let kpNear = false;
    const kpObserver = new IntersectionObserver(([entry]) => (kpNear = entry.isIntersecting), { rootMargin: "50% 0px" });
    if (kpSection) kpObserver.observe(kpSection);
    let kpResize: ResizeObserver | null = null;
    if (lenis && kpItems.length) {
      // Extra speed relative to the page, per position in the six-box pattern (+ faster, - slower). Side-by-side boxes
      // differ the most; boxes stacked in shared columns (2/4, 4/5, 5/6) differ by <= 0.08 so their gaps hold.
      const SPEEDS = [-0.04, 0.12, -0.1, 0.04, 0.12, 0.04];
      const shown = kpItems.map(() => "");
      let centres: number[] = [];
      let limits: number[] = [];
      let strength = 1;
      const measure = () => {
        kpItems.forEach((el, i) => (el.style.transform = shown[i] = ""));
        const rects = kpItems.map((el) => el.getBoundingClientRect());
        centres = rects.map((r) => r.top + scrollY + r.height / 2);
        // Past this distance from the viewport centre a box is off-screen, so its drift stops growing.
        limits = rects.map((r) => 1.25 * (innerHeight + r.height) / 2);
        strength = innerWidth < 768 ? 0.25 : 1; // single column with tight gaps on phones: keep the drift small
      };
      measure();
      kpResize = new ResizeObserver(measure);
      kpResize.observe(document.body);
      kpTick = () => {
        const mid = lenis.scroll + innerHeight / 2;
        kpItems.forEach((el, i) => {
          const d = Math.max(-limits[i], Math.min(limits[i], centres[i] - mid));
          const off = kpNear ? d * SPEEDS[i % SPEEDS.length] * strength : 0;
          const value = Math.abs(off) < 0.1 ? "" : `translate3d(0, ${off.toFixed(1)}px, 0)`;
          if (value !== shown[i]) el.style.transform = shown[i] = value;
        });
      };
    }

    // Selected Projects image reveal (after eladiodieste.com): once a box is 40% up the viewport and its photo has
    // loaded, the image wipes down from the top while settling from a slight zoom. Boxes that enter together stagger.
    kpSection?.setAttribute("data-reveal-ready", "");
    const kpRevealObserver = new IntersectionObserver((entries) => {
      let batch = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const media = entry.target as HTMLElement;
        kpRevealObserver.unobserve(media);
        const img = media.querySelector("img");
        const i = batch++;
        const reveal = () => {
          media.style.setProperty("--i", String(i));
          media.classList.add("is-revealed");
        };
        if (!img || img.complete) reveal();
        else {
          img.addEventListener("load", reveal, { once: true });
          img.addEventListener("error", reveal, { once: true });
        }
      });
    }, { rootMargin: "0px 0px -40% 0px" });
    document.querySelectorAll<HTMLElement>(".kp-media:not(.is-revealed)").forEach((m) => kpRevealObserver.observe(m));
    return () => {
      observer.disconnect();
      cleanupSplit();
      cancelAnimationFrame(rafId);
      kpTick = null;
      kpObserver.disconnect();
      kpRevealObserver.disconnect();
      kpResize?.disconnect();
      kpItems.forEach((el) => (el.style.transform = ""));
      if (vImgScroll) vImgScroll.style.transform = "";
      lenis?.destroy();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      removeEventListener("resize", sizeTrack);
    };
  }, [SETUP_ID]);

  return (
    <>
    {showLoader && <Loader />}
    <FluidCursor />
    <main className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} />

      {/* Fixed banner frame; JS morphs its rect from the viewport into the About image slot. */}
      <div data-fly className="pointer-events-none fixed left-0 top-0 z-20 h-[100svh] w-full overflow-hidden bg-black will-change-[top,left,width,height]">
        <div className="hero-media absolute inset-0">
          <HeroVideo />
          <img data-fly-about className="absolute inset-0 h-full w-full object-cover opacity-0" src={`${A}/6ae3a.png`} alt="" />
        </div>
        <div data-hero-copy className="hero-scrim absolute inset-0" />
      </div>
      {/* Hero Banner Bottom Section: Left has Wolverine Worldwide Latest News, Right has Title */}
      <div
        data-hero-copy
        className="hero-copy-wrap fixed bottom-8 left-5 right-5 z-30 pointer-events-none md:bottom-10 md:left-8 md:right-8"
      >
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 pointer-events-auto">
          {/* Left: Latest News widget (wolverineworldwide.com) */}
          <div className="w-full md:max-w-[420px]">
            <HeroLatestNews />
          </div>

          {/* Right: Slogan Title */}
          <div className="w-full md:max-w-[560px] text-left md:text-right">
            <h1 data-split data-split-manual="0" className="hero-title font-medium text-[clamp(2.2rem,4.5vw,4.2rem)] leading-[1.04] tracking-[-.025em] text-white">
              <span className="block">Building on Strength.</span>{" "}
              <span className="block">Delivering with Trust.</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="relative">
      <div data-hero-spacer data-nav-dark data-header-title="Home" className="hero h-[100svh] min-h-[600px]" aria-hidden />

      <section id="about" data-header-title="About" className="about-panel relative z-10 rounded-t-[4px] bg-white px-5 pb-24 pt-6">
        <div className="relative">
        <div data-about-track className="pointer-events-none absolute left-0 top-0 z-[1] w-full max-w-[15.5rem]">
          <div data-about-slot className="about-image sticky top-6 aspect-[5/6] w-full overflow-hidden rounded-[4px]"><img className="h-full w-full object-cover opacity-0 rounded-[4px]" src={`${A}/6ae3a.png`} alt="BCE architectural detail" /></div>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-[5/6] w-full max-w-[15.5rem]" aria-hidden />
          <div className="flex flex-col justify-between gap-12 md:min-h-[18.5rem]">
            <p data-split="content" data-split-hold data-about-intro className="max-w-[440px] text-[1.1rem] font-medium leading-[22px]">BCE is a Battambang-based engineering and construction company, building across Cambodia since 1995 with modern equipment and a skilled team.</p>
            <div>
              <ArrowButton href="/?about" label="See more about us" theme="black" />
            </div>
          </div>
        </div>
        <h2 data-split data-about-title className="about-title mt-40 font-medium text-[74px] leading-[1.08] tracking-[-.025em]">
          <span className="inline-block md:pl-[max(25%,17.5rem)]">
            We supply ready-mix concrete
            <span className="sw"><span className="sw-i"><a href="/?businesses#ready-mix-concrete" className="about-core-badge" aria-label="Ready-Mix Concrete" title="Ready-Mix Concrete"><GlanceIcon kind="plants" clipIdPrefix="ab-plant" /></a></span></span>,
          </span>{" "}
          foundation piling
          <span className="sw"><span className="sw-i"><a href="/?businesses#piling" className="about-core-badge" aria-label="Foundation Piling" title="Foundation Piling"><GlanceIcon kind="piling" clipIdPrefix="ab-piling" /></a></span></span>,{" "}
          civil construction
          <span className="sw"><span className="sw-i"><a href="/?businesses#construction" className="about-core-badge" aria-label="Civil Construction" title="Civil Construction"><GlanceIcon kind="projects" clipIdPrefix="ab-crane" /></a></span></span>,{" "}
          slab works
          <span className="sw"><span className="sw-i"><a href="/?businesses#concrete-slab-works" className="about-core-badge" aria-label="Concrete Slab Works" title="Concrete Slab Works"><GlanceIcon kind="pump" clipIdPrefix="ab-pump" /></a></span></span>,{" "}
          and equipment rental
          <span className="sw"><span className="sw-i"><a href="/?businesses#equipment-rental" className="about-core-badge" aria-label="Equipment Rental" title="Equipment Rental"><GlanceIcon kind="mixer" clipIdPrefix="ab-mixer" /></a></span></span>{" "}
          across Cambodia.
        </h2>
        </div>
      </section>
      </div>

      {/* After lpas.com: a full-screen opening holds while the five full-height panels slide in over it from the right. */}
      <section id="expertise" data-offers data-header-title="Core business" aria-labelledby="offers-title" className="relative h-[400vh] bg-white">
        <div data-offers-sticky className="sticky top-0 h-[100svh] overflow-hidden">
          <div data-offers-head className="absolute inset-0 text-[#111]">
            <div className="absolute inset-x-5 top-[44%] grid grid-cols-2 items-start gap-5 text-[.95rem] md:grid-cols-12">
              <p data-split="content" className="text-black/45 md:col-span-3">Core business</p>
              <p data-split="content" className="hidden max-w-[24rem] text-[1.05rem] leading-[1.4] md:col-span-4 md:col-start-5 md:block">Concrete supply, piling, construction, slab works and equipment rental under one roof.</p>
              <span className="flex items-center gap-3 justify-self-end text-black/45 md:col-span-3 md:col-start-10">Scroll to explore<span aria-hidden className="grid size-7 place-items-center rounded-[4px] border border-black/25 text-[#111]">→</span></span>
            </div>
            {/* The split reveal rewrites this heading's words in place, so the key makes React remount it (rather than patch
                the rewritten DOM) whenever its line breaks change during live editing. */}
            <h2 key="our-core/business-offering" id="offers-title" data-split data-split-hold className="absolute bottom-5 left-5 max-w-[min(70rem,90vw)] font-medium text-[clamp(2.75rem,6.2vw,6.5rem)] leading-[1.02] tracking-[-.03em]"><span className="block">Our core</span> <span className="block">business offering</span></h2>
          </div>
          <div data-offers-track className="absolute inset-y-0 left-0 flex w-max pl-[100vw] will-change-transform">
            {offerings.map(({ slug, name, image, bg, fg, details }) => (
              <article data-offer-panel className="offer-panel flex h-full w-[86vw] flex-none flex-col overflow-hidden rounded-[4px] md:w-[44vw]" style={{ background: bg, color: fg }} key={name}>
                <div data-offer-media className="relative h-[48%] flex-none overflow-hidden rounded-[4px] md:h-[50%]">
                  <div className="offer-zoom absolute inset-0">
                    <img data-offers-image className="absolute inset-y-0 left-[-8%] h-full w-[116%] max-w-none object-cover rounded-[4px]" src={image} alt="" decoding="async" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-8 p-6 md:p-8 lg:p-10">
                  <div className="flex items-start justify-between gap-6">
                    <ul className="offer-details grid max-w-[30rem] flex-1 grid-cols-2 gap-x-4 gap-y-1 text-[.85rem] leading-[1.3] md:gap-x-6 md:text-[.95rem]">
                      {details.map((d, k) => <li className="offer-detail py-2.5" style={{ "--k": k } as React.CSSProperties} key={d}>{d}</li>)}
                    </ul>
                    <a href={businessHref(slug)} aria-label={`${name}: learn more`} className="offer-plus grid size-11 flex-none place-items-center rounded-[4px]"><span aria-hidden>+</span></a>
                  </div>
                  <div className="mt-auto pt-6">
                    <h3 className="offer-title font-medium text-[clamp(2.1rem,3.4vw,3.75rem)] leading-[1.04] tracking-[-.025em]">{name}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Glance />

      <section data-vision data-nav-dark data-header-title="HSE & Operational Commitments" aria-label="HSE & Operational Commitments" className="relative h-[560vh] bg-white text-white">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div data-vision-frame className="absolute inset-0 overflow-hidden bg-[#111]">
          <div data-vision-image-scroll className="vision-img-scroll">
            <img src={`${A}/slider-3@xxxl.webp`} alt="BCE HSE and operational commitments" />
          </div>
          <div data-vision-shade className="absolute inset-0 bg-black opacity-0" />

          {/* The rule row rides on the opening frame's edges (--vs), so it sits inside the frame as it grows. */}
          <div data-vision-rule className="absolute top-[43%] flex items-center gap-4 text-[.95rem] opacity-0" style={{ left: "calc(var(--vs, 0vw) + 1.25rem)", right: "calc(var(--vs, 0vw) + 1.25rem)" }}>
            <span data-vision-num className="w-6 text-white/60">01</span>
            <span className="h-px flex-1 bg-white/25" />
            <span>HSE &amp; Operational Commitments</span>
          </div>

          <div data-vision-copy className="vision-copy absolute inset-0">
          <div className="absolute inset-x-0 top-[23%]">
            <div data-vision-track className="vision-track relative flex w-max gap-[12.5vw] whitespace-nowrap pl-5 text-[clamp(2.2rem,3.5vw,3.85rem)] leading-[1.08] tracking-[-.025em] will-change-transform md:pl-[17.7vw]">
              {commitments.map(([lines], t) => (
                <h2 data-vision-title className={`vision-title font-medium${t === 0 ? " is-active" : ""}`} style={{ "--t": t } as React.CSSProperties} key={lines.join(" ")}>
                  {lines.map((line, l) => (
                    <span className="vt-mask block" key={l}>
                      <span className="vt-line block">{line}</span>
                    </span>
                  ))}
                </h2>
              ))}
            </div>
          </div>

          <div className="absolute left-5 right-5 top-[53%] md:left-[58.6%] md:right-auto md:w-[min(24vw,22rem)]">
            <div className="relative min-h-[5.5rem]">
              {commitments.map(([lines, text], i) => (
                <p data-vision-text data-split="content" data-split-toggle className={`vision-text text-[.95rem] leading-[1.35] ${i === 0 ? "relative" : "absolute inset-x-0 top-0"}`} key={lines.join(" ")}>{text}</p>
              ))}
            </div>
            <div className="mt-8 pt-2">
              <ArrowButton href="/?quality" label="Explore Quality & HSE" theme="outline-white" />
            </div>
          </div>
          </div>
          </div>
        </div>
      </section>

      {/* Kononenko-style staggered work grid: 15 columns, per-item offsets */}
      <section id="projects" data-header-title="Projects" className="kp">
        <h2 data-split className="kp-title font-medium">Selected<br /><span data-km="ជ្រើសរើស">Projects</span><sup className="kp-count">({String(projects.length).padStart(2, "0")})</sup></h2>
        <div className="kp-grid">
          {projects.map((p) => (
            <a href={projectHref(p.slug)} className="kp-item group" key={p.slug}>
              <div className="kp-media rounded-[4px]">
                <img className="rounded-[4px]" src={p.gallery[0].image} alt={`${p.name}, ${p.location}`} loading="lazy" />
              </div>
              <div className="kp-info">
                <span>{p.name}<span className="kp-detail">, {p.location}</span></span>
                <span className="kp-detail">{p.category} · {year(p.period)}</span>
              </div>
            </a>
          ))}
        </div>
        <div className="kp-more"><ArrowButton href="/?projects" label="See all projects" /></div>
      </section>

      <Coverage />

      <WhyBCE />

      <QuoteCta href="/?quote" />

      <Footer phones={phones} tel={tel} />
    </main>
    </>
  );
}

export default App;
