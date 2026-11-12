import { flushSync } from "react-dom";

// Page transitions after telhaclarke.com.au (their Taxi.js GlobalTransition), as in-app navigation: links between our
// pages swap the React page without a reload, so nothing has to download or boot up between the two halves.
//
// Leave: the header and fixed layers fade out, a black overlay fades to 0.9 ("alpha" ease, 0.6s) and the old page sinks
// 2rem while scaling down by 4rem across the viewport width, from the top of the screen.
// Enter: the new page rises from 110vh while a window opens from inset(30% 40% 0) to full screen, over 1.35s on Telha's
// "gl.fastInOut" curve. Only transforms animate (the page, plus three dark panels drawing the window), so the motion
// stays on the compositor and stays smooth while the new page is still setting itself up.
// Phones get Telha's mobile version: a quick white fade out and back in. Back/forward buttons transition the same way.

type Listener = () => void;
const listeners = new Set<Listener>();
/** The page shell re-renders on route changes; returns an unsubscribe function. */
export const onRouteChange = (fn: Listener) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

type LenisLike = { stop: () => void; start: () => void } | null | undefined;
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const routeKey = () => location.pathname + location.search;
// rAF is paused when the window is hidden or covered, so waiting on frames must never be what blocks navigation:
// race each wait against a timer.
const frames = (n: number) => new Promise<void>((resolve) => {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    resolve();
  };
  let left = n;
  const step = () => (left-- <= 0 ? finish() : requestAnimationFrame(step));
  requestAnimationFrame(step);
  setTimeout(finish, 150 + n * 150);
});
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let current = routeKey();
let busy = false;

// Swap to the new page: update the URL, start it at the top (a #section is handled by the page itself), render now.
function swap(href: string, push: boolean) {
  if (push) history.pushState(null, "", href);
  current = routeKey();
  const html = document.documentElement;
  const app = document.getElementById("root");
  html.classList.remove("pt-leave", "pt-leave-shrink", "pt-leave-mobile");
  app?.style.removeProperty("transform-origin");
  app?.style.removeProperty("--pt-s");
  window.scrollTo(0, 0);
  flushSync(() => listeners.forEach((fn) => fn()));
}

async function runNavigate(href: string, push: boolean) {
  const html = document.documentElement;
  const app = document.getElementById("root");
  lenis()?.stop();

  if (reduced()) {
    swap(href, push);
    return;
  }

  const mobile = innerWidth < 768;
  const curtain = document.createElement("div");
  curtain.className = `pt-curtain${mobile ? " pt-curtain--fade" : ""}`;
  document.body.append(curtain);
  html.classList.add(mobile ? "pt-leave-mobile" : "pt-leave");
  await frames(2);
  curtain.classList.add("is-on");

  if (mobile) {
    await wait(320);
    swap(href, push);
    await frames(2);
    curtain.classList.remove("is-on");
    await wait(400);
    curtain.remove();
    return;
  }

  // Fixed layers would jump once the page is transformed, so they fade first; then the page sinks and shrinks.
  if (app) {
    const rem = parseFloat(getComputedStyle(html).fontSize) || 16;
    app.style.transformOrigin = `50% ${scrollY}px`;
    app.style.setProperty("--pt-s", String(1 - (4 * rem) / innerWidth));
  }
  await wait(250);
  html.classList.add("pt-leave-shrink");
  await wait(450);

  // Under the curtain: hide the page shell, swap, then let the new page lay itself out before it rises.
  html.classList.add("pt-enter");
  swap(href, push);
  curtain.remove();
  await frames(2);
  await wait(60);
  if (scrollY > 0) html.classList.add("pt-enter-scrolled");
  lenis()?.stop();
  const mask = document.createElement("div");
  mask.className = "pt-mask";
  mask.innerHTML = '<i class="pt-mask-t"></i><i class="pt-mask-l"></i><i class="pt-mask-r"></i>';
  document.body.append(mask);
  html.classList.add("pt-run");
  await wait(1420);
  html.classList.remove("pt-enter", "pt-run", "pt-enter-scrolled");
  mask.remove();
  html.classList.add("pt-settle");
  lenis()?.start();
  dispatchEvent(new Event("scroll")); // let scroll-driven UI (header title, pinned sections) catch up
  setTimeout(() => html.classList.remove("pt-settle"), 600);
}

// Every navigation goes through here: the cleanup runs even if the transition was interrupted (a hidden window pauses
// rAF, a page unloads mid-flight), so a stuck curtain can never leave the site unclickable.
async function navigate(href: string, push: boolean) {
  if (busy) return;
  busy = true;
  const target = new URL(href, location.href);
  const targetKey = target.pathname + target.search;
  // Safety net: if the animated swap has not landed (interrupted transition, stalled browser), load the page for real.
  const guard = setTimeout(() => {
    if (routeKey() !== targetKey) location.assign(target.href);
  }, 4000);
  try {
    await runNavigate(href, push);
  } finally {
    clearTimeout(guard);
    busy = false;
    document.querySelectorAll(".pt-curtain, .pt-mask").forEach((el) => el.remove());
    document.documentElement.classList.remove(
      "pt-leave",
      "pt-leave-shrink",
      "pt-leave-mobile",
      "pt-enter",
      "pt-run",
      "pt-enter-scrolled",
      "pt-settle",
    );
    lenis()?.start();
    if (routeKey() !== targetKey) location.assign(target.href);
  }
}

/** Swap pages with no transition of its own, leaving a hint for the next page to play its own entrance (fluid.glass's
 *  project-to-project hand-off reads it as "project"). */
export function navigateInstant(href: string, mode: string | null = null) {
  if (busy) return;
  (window as unknown as { __ptMode?: string | null }).__ptMode = mode;
  lenis()?.stop();
  swap(href, true);
}

function onClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || "noTransition" in a.dataset) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return; // tel:, mailto:, other sites
  if (url.pathname + url.search === current) return; // same page: in-page anchors
  e.preventDefault();
  navigate(url.href, true);
}

function onPopState() {
  if (routeKey() === current) return; // only the #hash changed
  navigate(location.href, false);
}

export function initPageTransitions() {
  const w = window as unknown as { __bcePT?: boolean };
  if (w.__bcePT) return;
  w.__bcePT = true;
  history.scrollRestoration = "manual";
  document.addEventListener("click", onClick);
  addEventListener("popstate", onPopState);
  // A previous session (or a transition cut short) may have left overlays behind: start clean.
  document.querySelectorAll(".pt-curtain, .pt-mask").forEach((el) => el.remove());
  document.documentElement.classList.remove(
    "pt-leave",
    "pt-leave-shrink",
    "pt-leave-mobile",
    "pt-enter",
    "pt-run",
    "pt-enter-scrolled",
    "pt-settle",
  );
  busy = false;
}
