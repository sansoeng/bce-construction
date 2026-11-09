import { useEffect, type RefObject } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { initSplitReveal } from "./splitReveal";
import { LENIS_OPTIONS } from "./smoothScroll";
import { translate } from "./i18n";

// Shared setup for the inner pages: line-by-line text reveals, [data-reveal] fade-ups, and Kononenko-style smooth
// scrolling (exposed on window.__lenis for the footer's back-to-top and the page transition).
export function usePageSetup(title: string) {
  useEffect(() => {
    document.title = translate(title);
    const cleanupSplit = initSplitReveal();
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => observer.observe(el));
    const lenis = matchMedia("(prefers-reduced-motion: reduce)").matches ? null : new Lenis(LENIS_OPTIONS);
    (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    if (lenis) raf = requestAnimationFrame(loop);
    // Arriving at a #section from another page: jump there once the page has laid out.
    const target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    if (target) requestAnimationFrame(() => (lenis ? lenis.scrollTo(target, { immediate: true, force: true, offset: -90 }) : target.scrollIntoView()));
    return () => {
      cleanupSplit();
      observer.disconnect();
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [title]);
}

// Photos (.pp-media) wipe in from the top as on the homepage grid, once 30% up the viewport and loaded; photos
// arriving together stagger.
export function useMediaReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => {
      let batch = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
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
    }, { rootMargin: "0px 0px -30% 0px" });
    root.querySelectorAll<HTMLElement>(".pp-media").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}
