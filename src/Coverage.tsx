import { useEffect, useRef, useState } from "react";
import { khmProvinces } from "./cambodiaMap";
import "./coverage-map.css";

// Operational coverage, after aircenter.space/location ("Transport accessibility"): a pinned, full-screen dark map
// with a blurred locations panel. The map is drawn large and bleeds off every edge: each choice frames the head
// office and the chosen place (close-up scale for the west, a wider one beyond), gliding there over 1s ease-in-out.
// The previous route and card hide; 0.75s later the new dotted route draws itself from the head office (spring,
// 0.12 per frame), its marker lights up and a white distance card slides 10px into place. The next section then
// scrolls up over the pinned map.

type Pt = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };
type View = { s: number; tx: number; ty: number };

const HQ = "Battambang";
// "Provinces we have served", BCE Corporate Profile 2026 (13 provinces + Phnom Penh), by geographic zone.
export const regions = [
  { name: "Tonle Sap", places: ["Battambang", "Banteay Meanchey", "Siem Reap", "Pursat", "Kampong Chhnang", "Kampong Thom"] },
  { name: "Plateau & Mountain", places: ["Pailin", "Oddar Meanchey", "Preah Vihear", "Stung Treng"] },
  { name: "Plains", places: ["Phnom Penh", "Kandal"] },
  { name: "Coastal", places: ["Koh Kong", "Preah Sihanouk"] },
];
const regionOf = Object.fromEntries(regions.flatMap((r) => r.places.map((p) => [p, r.name])));
const covered = new Set(regions.flatMap((r) => r.places));
const provinceTotal = covered.size - 1; // Phnom Penh is the capital, not a province
const byName = Object.fromEntries(khmProvinces.map((p) => [p.name, p]));
const hq = byName[HQ];

// Completed project highlights and sector breakdown by province
const provinceDetails: Record<string, { projects?: number; suffix?: string; highlight: string; scope: string; badge?: string }> = {
  Battambang: {
    projects: 48,
    suffix: "+",
    highlight: "Head Office & Central Plants",
    scope: "Heavy civil works, batching plants & foundation piling",
  },
  "Banteay Meanchey": {
    projects: 18,
    suffix: "+",
    highlight: "Border Infrastructure & Logistics",
    scope: "Warehouse slabs, road access & ready-mix supply",
  },
  "Siem Reap": {
    projects: 26,
    suffix: "+",
    highlight: "Hospitality & Heritage Civil Works",
    scope: "Resort structures, foundation piling & concrete supply",
  },
  Pursat: {
    projects: 14,
    suffix: "+",
    highlight: "Irrigation & Civil Infrastructure",
    scope: "Waterway infrastructure & reinforced concrete slabs",
  },
  "Kampong Chhnang": {
    projects: 9,
    suffix: "+",
    highlight: "River Port & Industrial Facilities",
    scope: "Logistics facilities, port slabs & concrete delivery",
  },
  "Kampong Thom": {
    projects: 12,
    suffix: "+",
    highlight: "Highway & Foundation Works",
    scope: "National road expansion & bridge foundation piling",
  },
  Pailin: {
    projects: 10,
    suffix: "+",
    highlight: "Commercial & Site Development",
    scope: "Commercial complexes, earthworks & foundation piling",
  },
  "Oddar Meanchey": {
    projects: 8,
    suffix: "+",
    highlight: "Public & Border Infrastructure",
    scope: "Civic access roads, public facilities & concrete supply",
  },
  "Preah Vihear": {
    projects: 7,
    suffix: "+",
    highlight: "Regional Access Infrastructure",
    scope: "Connecting roadways, civil works & concrete foundations",
  },
  "Stung Treng": {
    projects: 6,
    suffix: "+",
    highlight: "Energy & River Crossing Works",
    scope: "Substation civil structures & bridge foundation piling",
  },
  "Phnom Penh": {
    projects: 36,
    suffix: "+",
    highlight: "Commercial High-Rise & Slabs",
    scope: "Tower foundations, post-tensioned slabs & piling rigs",
  },
  Kandal: {
    projects: 19,
    suffix: "+",
    highlight: "Industrial Parks & SEZ Facilities",
    scope: "Factory slabs, logistics parks & foundation piling",
  },
  "Koh Kong": {
    projects: 8,
    suffix: "+",
    highlight: "Coastal Resorts & Marine Works",
    scope: "Coastal access roads, resort slabs & marine foundations",
  },
  "Preah Sihanouk": {
    projects: 24,
    suffix: "+",
    highlight: "Deep-Sea Port & High-Rise Works",
    scope: "Port logistics facilities, heavy civil works & piling",
  },
  // Mobilization readiness for additional Cambodian provinces
  "Kampong Cham": {
    badge: "Mobilization Ready",
    highlight: "Agricultural & Highway Infrastructure",
    scope: "Available for expressway connectivity, civic works & fleet deployment",
  },
  "Kampong Speu": {
    badge: "Mobilization Ready",
    highlight: "Industrial Corridor & Factory Works",
    scope: "Expressway logistics access, manufacturing slabs & foundation works",
  },
  Kampot: {
    badge: "Mobilization Ready",
    highlight: "Coastal & Industrial Port Facilities",
    scope: "Port civil works, tourism infrastructure & concrete supply",
  },
  Kep: {
    badge: "Mobilization Ready",
    highlight: "Eco-Tourism & Municipal Works",
    scope: "Coastal roadway paving, resort civil works & site preparation",
  },
  Kratie: {
    badge: "Mobilization Ready",
    highlight: "River Crossing & Regional Access",
    scope: "Mekong bridge foundations, regional roadway works & concrete fleet",
  },
  Mondulkiri: {
    badge: "Mobilization Ready",
    highlight: "Highland & Eco-Tourism Infrastructure",
    scope: "Highland access routes, civic structures & specialized earthworks",
  },
  "Prey Veng": {
    badge: "Mobilization Ready",
    highlight: "Flood-Resilient Civil Works",
    scope: "Elevated road foundations, drainage civil works & concrete logistics",
  },
  Ratanakiri: {
    badge: "Mobilization Ready",
    highlight: "Northeastern Resource & Civil Works",
    scope: "Energy facility foundations, roadworks & equipment deployment",
  },
  "Svay Rieng": {
    badge: "Mobilization Ready",
    highlight: "Border SEZ & Industrial Parks",
    scope: "Manufacturing floors, high-capacity slabs & piling solutions",
  },
  Takeo: {
    badge: "Mobilization Ready",
    highlight: "Agricultural Logistics & Waterways",
    scope: "Irrigation canal structures, highway civil works & concrete supply",
  },
  "Tbong Khmum": {
    badge: "Mobilization Ready",
    highlight: "Eastern Provincial Hub Development",
    scope: "Civic center development, regional roadways & foundation piling",
  },
};

// Equipment based in each covered province, shown in the popup card. SAMPLE: the Corporate Profile gives fleet totals
// only (4 batching plants, 41 mixer trucks, 8 pump trucks, own piling rigs); replace with BCE's real allocation.
type Equip = [count: number, label: string];
const equipmentByProvince: Record<string, Equip[]> = {
  Battambang: [[2, "Batching plants"], [14, "Mixer trucks"], [3, "Pump trucks"], [2, "Piling rigs"]],
  "Banteay Meanchey": [[1, "Batching plant"], [6, "Mixer trucks"], [1, "Pump truck"]],
  "Siem Reap": [[1, "Batching plant"], [8, "Mixer trucks"], [2, "Pump trucks"]],
  "Phnom Penh": [[6, "Mixer trucks"], [2, "Pump trucks"], [1, "Piling rig"]],
  Pursat: [[3, "Mixer trucks"], [1, "Piling rig"]],
  Pailin: [[2, "Mixer trucks"], [1, "Pump truck"]],
  "Kampong Thom": [[3, "Mixer trucks"], [1, "Piling rig"]],
  "Kampong Chhnang": [[2, "Mixer trucks"], [1, "Pump truck"]],
  "Oddar Meanchey": [[2, "Mixer trucks"]],
  "Preah Vihear": [[2, "Mixer trucks"]],
  "Koh Kong": [[2, "Mixer trucks"], [1, "Piling rig"]],
  "Preah Sihanouk": [[3, "Mixer trucks"], [1, "Pump truck"], [1, "Piling rig"]],
  Kandal: [[3, "Mixer trucks"], [1, "Pump truck"]],
  "Stung Treng": [[2, "Mixer trucks"], [1, "Piling rig"]],
};

// Fleet totals from the Corporate Profile (the story's equipment step); BCE also runs its own piling rigs.
const FLEET: Equip[] = [[4, "Batching plants"], [41, "Mixer trucks"], [8, "Pump trucks"]];
const fleetTotal = FLEET.reduce((n, [c]) => n + c, 0);

const KM_PER_UNIT = 0.5753;
const NEAR_KM = 150;

const coveredItems = [...covered]
  .map((name) => {
    const p = byName[name];
    const km = Math.hypot(p.x - hq.x, p.y - hq.y) * KM_PER_UNIT;
    const details = provinceDetails[name] || {
      projects: 10,
      suffix: "+",
      highlight: "Civil Construction & Supply",
      scope: "Ready-mix supply & foundation works",
    };
    return {
      name,
      p,
      region: regionOf[name] || "Regional",
      km: Math.round(km / 5) * 5,
      plan: km <= NEAR_KM ? 0 : 1,
      isCovered: true,
      equipment: equipmentByProvince[name] ?? [],
      ...details,
    };
  })
  .sort((a, b) => {
    if (a.name === HQ) return -1;
    if (b.name === HQ) return 1;
    return a.km - b.km;
  });

const otherProvinces = khmProvinces
  .filter((p) => !covered.has(p.name))
  .map((p) => {
    const km = Math.hypot(p.x - hq.x, p.y - hq.y) * KM_PER_UNIT;
    const details = provinceDetails[p.name] || {
      badge: "Mobilization Ready",
      highlight: "Civil Construction & Supply",
      scope: "Available for equipment mobilization & concrete delivery on request",
    };
    return {
      name: p.name,
      p,
      region: "Nationwide",
      km: Math.round(km / 5) * 5,
      plan: 1,
      isCovered: false,
      equipment: [] as Equip[],
      ...details,
    };
  })
  .sort((a, b) => a.km - b.km);

const items = [...coveredItems, ...otherProvinces];
const totalProjects = coveredItems.reduce((n, i) => n + (i.projects ?? 0), 0);
const itemIndex = Object.fromEntries(items.map((it, idx) => [it.name, idx]));
// Labels that would collide with a neighbour's sit above their marker instead.
const labelTop = new Set(["Phnom Penh", "Oddar Meanchey"]);
// Places whose project number sits left of the pin, clear of the head office bubble.
const numLeft = new Set(["Pailin"]);

const pad = (b: Box, d: number): Box => ({ x: b.x - d, y: b.y - d, w: b.w + 2 * d, h: b.h + 2 * d });
const boundsOf = (pts: Pt[]): Box => {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
};
// Map scales: plan 0 frames the western places around the head office, plan 1 every place we cover; each is then
// enlarged (ZOOM) so the outlines run past the screen edges and only the covered provinces stay in focus.
const PLANS: Box[] = [pad(boundsOf(items.filter((i) => i.plan === 0).map((i) => i.p)), 40), pad(boundsOf(items.map((i) => i.p)), 20)];
const ZOOM = [1.32, 1.48];
const coveredBox = pad(boundsOf(coveredItems.map((i) => i.p)), 50);

// Graticule (the map's faint "streets"): whole degrees, from the projection's west / north edges (102.334°E, 14.690°N).
const LONS = [103, 104, 105, 106, 107].map((d) => ({ d, x: (d - 102.334) / 0.0052925 }));
const LATS = [14, 13, 12, 11].map((d) => ({ d, y: (14.6904 - d) / 0.005173 }));

const fit = (b: Box, r: Box): View => {
  const s = Math.min(r.w / b.w, r.h / b.h);
  return { s, tx: r.x + (r.w - b.w * s) / 2 - b.x * s, ty: r.y + (r.h - b.h * s) / 2 - b.y * s };
};
const lerpView = (a: View, b: View, t: number): View => ({ s: a.s + (b.s - a.s) * t, tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t });
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
// Popup card size, and its offset from the place: below the point, or above the active pill marker.
const CARD = { w: 340, h: 330, below: 18, above: 62 };

// Counts up from 0 whenever its popup opens.
function CountUp({ to, run, pad = 0 }: { to: number; run: boolean; pad?: number }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!run) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100);
      setN(Math.round(to * (1 - (1 - k) ** 4)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{String(n).padStart(pad, "0")}</>;
}

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>
);

export default function Coverage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<(i: number) => void>(() => undefined);
  const deselectRef = useRef<() => void>(() => undefined);
  const zoomInRef = useRef<() => void>(() => undefined);
  const zoomOutRef = useRef<() => void>(() => undefined);
  const resetViewRef = useRef<() => void>(() => undefined);
  const [shown, setShown] = useState<number | null>(null);
  // Scroll story: "count" lights the covered places one by one, "hq" zooms to the head office, "explore" hands
  // over the map. Any interaction with the map ("free") pauses the story until the visitor scrolls on.
  const [phase, setPhase] = useState<"intro" | "count" | "gap" | "hq" | "projects" | "equip" | "explore">("intro");
  const [count, setCount] = useState(1);
  const [free, setFree] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const $ = <T extends Element>(sel: string) => [...stage.querySelectorAll<T>(sel)];
    const mapG = stage.querySelector<SVGGElement>("[data-ac-map]");
    const gratLon = $<SVGLineElement>("[data-ac-lon]");
    const gratLat = $<SVGLineElement>("[data-ac-lat]");
    const markers = $<HTMLElement>("[data-ac-marker]");
    const tips = $<HTMLElement>("[data-ac-tip]");
    const hqEl = stage.querySelector<HTMLElement>("[data-ac-hq]");
    const mapSvg = stage.querySelector<SVGSVGElement>("[data-ac-svg]");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let area: Box = { x: 0, y: 0, w: 1, h: 1 };
    let scales = [1, 1];
    let view: View = { s: 1, tx: 0, ty: 0 };
    let zoom: { from: View; to: View; start: number; duration?: number; story?: boolean } | null = null;
    let inertia: { fromTx: number; fromTy: number; toTx: number; toTy: number; start: number; duration: number } | null = null;
    let cur = -1;
    let showTimer = 0;
    let isFree = false;
    let freeAt = 0;
    let prog = 0;
    // Story camera target: the map eases towards it (a short lag behind the scroll) for a cinematic move.
    let follow: View | null = null;
    let lastT = 0;

    const toScreen = (p: Pt, v = view) => ({ x: p.x * v.s + v.tx, y: p.y * v.s + v.ty });
    const measure = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      // Full screen and full width coordinate space across the entire viewport
      area = { x: 0, y: 0, w: W, h: H };
      scales = PLANS.map((b, k) => fit(b, area).s * ZOOM[k]);
      if (!zoom) view = isFree ? viewFor(Math.max(cur, 0)) : storyView(prog);
      follow = null;
    };

    // Centre on the midpoint of the head office and the place, then nudge so both sit cleanly inside the frame.
    const viewFor = (i: number): View => {
      const it = items[i];
      const desktop = W >= 768;
      // Never so close that the head office and the place cannot both fit (narrow phone screens).
      const dx = Math.abs(it.p.x - hq.x);
      const dy = Math.abs(it.p.y - hq.y);
      const s = Math.min(scales[it.plan], dx ? (area.w - 180) / dx : Infinity, dy ? (area.h - 140) / dy : Infinity);
      let tx = area.x + area.w / 2 - ((hq.x + it.p.x) / 2) * s;
      let ty = area.y + area.h / 2 - ((hq.y + it.p.y) / 2) * s;
      const keep: [Pt, number, number, number, number][] = [
        [it.p, 80, 110, desktop ? 420 : 60, desktop ? 90 : 150],
        [hq, 120, 100, desktop ? 360 : 30, desktop ? 70 : 130],
      ];
      keep.forEach(([q, l, t, r, b]) => {
        const sx = q.x * s + tx;
        const sy = q.y * s + ty;
        if (sx < area.x + l) tx += area.x + l - sx;
        else if (sx > area.x + area.w - r) tx -= sx - (area.x + area.w - r);
        if (sy < area.y + t) ty += area.y + t - sy;
        else if (sy > area.y + area.h - b) ty -= sy - (area.y + area.h - b);
      });
      return { s, tx, ty };
    };

    // Story cameras: the whole country (beside the headline on desktop, below it on phones), then the head office.
    const overview = (): View => {
      const desktop = W >= 768;
      const r = desktop ? { x: W * 0.4, y: 90, w: W * 0.56, h: H - 180 } : { x: 84, y: H * 0.42, w: W - 100, h: H * 0.46 };
      return fit({ x: 0, y: 0, w: 1000, h: 924 }, r);
    };
    const hqView = (): View => {
      const desktop = W >= 768;
      const s = scales[0] * (desktop ? 0.62 : 0.7);
      return { s, tx: (desktop ? W * 0.64 : W * 0.5) - hq.x * s, ty: (desktop ? H * 0.52 : H * 0.66) - hq.y * s };
    };
    // Every covered place, on the side opposite the headline (below it on phones).
    const allView = (): View => {
      const desktop = W >= 768;
      return fit(coveredBox, desktop ? { x: 40, y: 100, w: W * 0.5, h: H - 190 } : { x: 100, y: H * 0.46, w: W - 140, h: H * 0.4 });
    };
    const around = (v: View, k: number): View => ({ s: v.s * k, tx: W / 2 - (W / 2 - v.tx) * k, ty: H / 2 - (H / 2 - v.ty) * k });
    const seg = (q: number, a: number, b: number) => easeInOut(Math.min(1, Math.max(0, (q - a) / (b - a))));
    // The scroll story's camera: the map grows in behind the title, holds for the count, zooms to the head office,
    // then slides over to show every covered place with its completed projects.
    // Closing view: the covered places centred and drawn in closer, ready to be explored.
    const midView = (): View => {
      const desktop = W >= 768;
      return around(fit(coveredBox, desktop ? { x: W * 0.12, y: 130, w: W * 0.76, h: H - 250 } : { x: 16, y: H * 0.22, w: W - 32, h: H * 0.6 }), 1.05);
    };
    // Each text step holds its own camera; the map only moves in the gaps between steps, with no text on screen.
    const storyView = (q: number): View => {
      if (q < 0.3) return lerpView(around(overview(), 0.75), overview(), seg(q, 0.03, 0.12));
      if (q < 0.48) return lerpView(overview(), hqView(), seg(q, 0.3, 0.38));
      if (q < 0.8) return lerpView(hqView(), allView(), seg(q, 0.48, 0.55));
      return lerpView(allView(), midView(), seg(q, 0.8, 0.87));
    };
    const progress = () => {
      const wrap = wrapRef.current;
      if (!wrap) return 0;
      const r = wrap.getBoundingClientRect();
      // Why BCE slides up over the pinned map for its last screen (-mt-[100svh]), so the story ends one screen early.
      return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - 2 * innerHeight)));
    };
    const enterFree = () => {
      follow = null;
      freeAt = scrollY;
      if (isFree) return;
      isFree = true;
      setFree(true);
    };
    const exitFree = () => {
      isFree = false;
      setFree(false);
      cur = -1;
      clearTimeout(showTimer);
      setShown(null);
      inertia = null;
      zoom = { from: { ...view }, to: storyView(prog), start: performance.now(), duration: 700, story: true };
      start();
    };
    const story = () => {
      prog = progress();
      setCount(Math.min(14, Math.max(1, Math.ceil(((prog - 0.12) / 0.14) * 14))));
      setPhase(
        prog < 0.105 ? "intro" : prog < 0.3 ? "count" : prog < 0.38 ? "gap" : prog < 0.48 ? "hq" : prog < 0.55 ? "gap"
          : prog < 0.66 ? "projects" : prog < 0.69 ? "gap" : prog < 0.8 ? "equip" : prog < 0.87 ? "gap" : "explore",
      );
      // Intro: the title zooms towards the viewer and dissolves as the map fades in behind it.
      const t = Math.min(1, prog / 0.1);
      const intro = introRef.current;
      if (intro) {
        intro.style.transform = `scale(${1 + t ** 2.2 * 8})`;
        intro.style.opacity = String(1 - Math.min(1, Math.max(0, (t - 0.3) / 0.6)));
        intro.style.visibility = t >= 1 ? "hidden" : "";
      }
      const reveal = String(Math.min(1, Math.max(0, (prog - 0.03) / 0.07)));
      if (mapSvg) mapSvg.style.opacity = reveal;
      if (hqEl) hqEl.style.opacity = reveal;
      if (isFree) {
        if (Math.abs(scrollY - freeAt) > innerHeight * 0.35) exitFree();
        return;
      }
      if (zoom?.story) {
        zoom.to = storyView(prog);
        return;
      }
      if (zoom || inertia) return;
      if (reduce) {
        view = storyView(prog);
        frame(performance.now());
        return;
      }
      follow = storyView(prog);
      start();
    };

    // Card placement (Fluid tooltip "bottom-end" etc.): away from the head office, flipped if it would not fit.
    const place = (i: number) => {
      const tip = tips[i];
      if (!tip) return;
      const v = viewFor(i);
      const p = toScreen(items[i].p, v);
      const o = toScreen(hq, v);
      let align = i === 0 || p.x >= o.x ? "start" : "end";
      // Vertically, the card takes the side clear of the marker's own label (the head office has none).
      let side = i === 0 || labelTop.has(items[i].name) ? "bottom" : "top";
      const r = W - 20;
      if (align === "start" && p.x + CARD.w > r) align = "end";
      else if (align === "end" && p.x - CARD.w < 20) align = "start";
      if (side === "bottom" && p.y + CARD.below + CARD.h > H - 24) side = "top";
      else if (side === "top" && p.y - CARD.above - CARD.h < 110) side = "bottom";
      tip.dataset.side = side;
      tip.dataset.align = align;
    };

    const show = (i: number) => {
      place(i);
      setShown(i);
    };
    deselectRef.current = () => {
      cur = -1;
      clearTimeout(showTimer);
      setShown(null);
    };
    selectRef.current = (i: number) => {
      enterFree();
      if (i === cur) return;
      cur = i;
      setShown(null);
      clearTimeout(showTimer);
      inertia = null;
      const to = viewFor(i);
      const moves = Math.abs(to.s - view.s) > 0.001 || Math.hypot(to.tx - view.tx, to.ty - view.ty) > 2;
      if (moves && !reduce) {
        zoom = { from: view, to, start: performance.now(), duration: 750 };
        start();
        showTimer = window.setTimeout(() => show(i), 500);
      } else {
        view = to;
        start();
        frame(performance.now());
        show(i);
      }
    };

    const zoomBy = (factor: number) => {
      enterFree();
      const minS = scales[1] * 0.7;
      const maxS = scales[0] * 3.5;
      const nextS = Math.max(minS, Math.min(maxS, view.s * factor));
      const cx = (W / 2 - view.tx) / view.s;
      const cy = (H / 2 - view.ty) / view.s;
      let nextTx = W / 2 - cx * nextS;
      let nextTy = H / 2 - cy * nextS;
      const cw = 1000 * nextS;
      const ch = 924 * nextS;
      nextTx = Math.min(W - 150, Math.max(150 - cw, nextTx));
      nextTy = Math.min(H - 150, Math.max(150 - ch, nextTy));

      inertia = null;
      zoom = {
        from: { ...view },
        to: { s: nextS, tx: nextTx, ty: nextTy },
        start: performance.now(),
        duration: 350,
      };
      start();
    };

    const resetView = () => {
      enterFree();
      inertia = null;
      const to = viewFor(Math.max(cur, 0));
      zoom = {
        from: { ...view },
        to,
        start: performance.now(),
        duration: 700,
      };
      start();
    };

    zoomInRef.current = () => zoomBy(1.35);
    zoomOutRef.current = () => zoomBy(0.74);
    resetViewRef.current = resetView;

    // Drag to pan map with cursor hand
    let isDragging = false;
    let hasMoved = false;
    let dragStart = { x: 0, y: 0 };
    let startView = { ...view };
    let lastPos = { x: 0, y: 0 };
    let lastTime = 0;
    let velocity = { vx: 0, vy: 0 };

    const frame = (now: number) => {
      const dt = Math.min(now - lastT, 64);
      lastT = now;
      if (follow && !zoom && !inertia && !isDragging) {
        const k = 1 - Math.exp(-dt / 420);
        view = lerpView(view, follow, k);
        if (Math.abs(follow.s - view.s) / follow.s < 0.0004 && Math.abs(follow.tx - view.tx) < 0.3 && Math.abs(follow.ty - view.ty) < 0.3) {
          view = follow;
          follow = null;
        }
      }
      if (zoom) {
        const dur = zoom.duration || 1000;
        const t = Math.min((now - zoom.start) / dur, 1);
        view = lerpView(zoom.from, zoom.to, easeInOut(t));
        if (t >= 1) zoom = null;
      } else if (inertia) {
        const t = Math.min((now - inertia.start) / inertia.duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        view.tx = inertia.fromTx + (inertia.toTx - inertia.fromTx) * ease;
        view.ty = inertia.fromTy + (inertia.toTy - inertia.fromTy) * ease;
        if (cur >= 0) place(cur);
        if (t >= 1) inertia = null;
      }
      mapG?.setAttribute("transform", `translate(${view.tx} ${view.ty}) scale(${view.s})`);
      LONS.forEach(({ x }, k) => {
        const sx = (x * view.s + view.tx).toFixed(1);
        gratLon[k]?.setAttribute("x1", sx);
        gratLon[k]?.setAttribute("x2", sx);
      });
      LATS.forEach(({ y }, k) => {
        const sy = (y * view.s + view.ty).toFixed(1);
        gratLat[k]?.setAttribute("y1", sy);
        gratLat[k]?.setAttribute("y2", sy);
      });
      const o = toScreen(hq);
      if (hqEl) hqEl.style.transform = `translate3d(${o.x}px, ${o.y}px, 0)`;
      items.forEach((it, i) => {
        const p = toScreen(it.p);
        const tr = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
        if (markers[i]) markers[i].style.transform = tr;
        if (tips[i]) tips[i].style.transform = tr;
      });
      if (!zoom && !inertia && !isDragging && !follow) {
        stop();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    let raf = 0;
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    measure();
    frame(performance.now());
    stop();

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest(".ac-mcard, .ac-tip-card, .ac-zoom-controls")) return;

      isDragging = true;
      hasMoved = false;
      dragStart = { x: e.clientX, y: e.clientY };
      startView = { ...view };
      lastPos = { x: e.clientX, y: e.clientY };
      lastTime = performance.now();
      velocity = { vx: 0, vy: 0 };
      zoom = null;
      inertia = null;
      start();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (!hasMoved && Math.hypot(dx, dy) > 4) {
        hasMoved = true;
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {}
        stage.classList.add("is-dragging");
        enterFree();
      }
      if (hasMoved) {
        const now = performance.now();
        const dt = Math.max(now - lastTime, 8);
        velocity = {
          vx: (e.clientX - lastPos.x) / dt,
          vy: (e.clientY - lastPos.y) / dt,
        };
        lastPos = { x: e.clientX, y: e.clientY };
        lastTime = now;

        let nextTx = startView.tx + dx;
        let nextTy = startView.ty + dy;
        const cw = 1000 * view.s;
        const ch = 924 * view.s;
        nextTx = Math.min(W - 150, Math.max(150 - cw, nextTx));
        nextTy = Math.min(H - 150, Math.max(150 - ch, nextTy));

        view.tx = nextTx;
        view.ty = nextTy;
        if (cur >= 0) place(cur);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove("is-dragging");
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {}

      if (hasMoved) {
        const stopClick = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        stage.addEventListener("click", stopClick, { capture: true, once: true });

        const speed = Math.hypot(velocity.vx, velocity.vy);
        if (speed > 0.12 && performance.now() - lastTime < 80) {
          const maxSpeed = 2.0;
          const scale = Math.min(speed, maxSpeed) / speed;
          const vx = velocity.vx * scale * 220;
          const vy = velocity.vy * scale * 220;
          let targetTx = view.tx + vx;
          let targetTy = view.ty + vy;
          const cw = 1000 * view.s;
          const ch = 924 * view.s;
          targetTx = Math.min(W - 150, Math.max(150 - cw, targetTx));
          targetTy = Math.min(H - 150, Math.max(150 - ch, targetTy));

          inertia = {
            fromTx: view.tx,
            fromTy: view.ty,
            toTx: targetTx,
            toTy: targetTy,
            start: performance.now(),
            duration: 400,
          };
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        const minS = scales[1] * 0.7;
        const maxS = scales[0] * 3.5;
        const nextS = Math.max(minS, Math.min(maxS, view.s * factor));

        const rect = stage.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cx = (mx - view.tx) / view.s;
        const cy = (my - view.ty) / view.s;
        let nextTx = mx - cx * nextS;
        let nextTy = my - cy * nextS;

        const cw = 1000 * nextS;
        const ch = 924 * nextS;
        nextTx = Math.min(W - 150, Math.max(150 - cw, nextTx));
        nextTy = Math.min(H - 150, Math.max(150 - ch, nextTy));

        enterFree();
        zoom = null;
        inertia = null;
        view = { s: nextS, tx: nextTx, ty: nextTy };
        if (cur >= 0) place(cur);
        start();
      }
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("wheel", onWheel, { passive: false });

    // No card opens by itself: the story runs on scroll, and details wait for the visitor to pick a place.
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        stop();
        if (isFree) {
          isFree = false;
          setFree(false);
          deselectRef.current();
          zoom = null;
          inertia = null;
          view = storyView(progress());
        }
        return;
      }
      start();
    }, { threshold: [0, 0.6] });
    io.observe(stage);
    const ro = new ResizeObserver(() => {
      measure();
      if (isFree && cur >= 0) place(cur);
      story();
    });
    ro.observe(stage);
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        story();
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    story();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(showTimer);
      removeEventListener("scroll", onScroll);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Coming from Selected Projects, the white page fades to black as this section rises, so the two sections share
  // one background that darkens with the scroll (white at 95% of the viewport, black by 35%).
  useEffect(() => {
    const section = stageRef.current?.closest("section");
    const prev = document.getElementById("projects");
    if (!section || !prev) return;
    const rows = [...section.querySelectorAll<HTMLElement>("[data-ac-row]")];
    let ticking = false;
    const update = () => {
      ticking = false;
      const H = innerHeight;
      const p = Math.min(Math.max((H * 0.95 - section.getBoundingClientRect().top) / (H * 0.6), 0), 1);
      const v = Math.round(255 * (1 - p));
      const bg = `rgb(${v} ${v} ${v})`;
      section.style.backgroundColor = bg;
      prev.style.backgroundColor = bg;
      // The map's black edge fades only come in once the page is fully black (section top above 35%), so no seam shows.
      const top = section.getBoundingClientRect().top;
      section.style.setProperty("--ac-dark", Math.min(Math.max(1 - top / (H * 0.35), 0), 1).toFixed(3));
      // Scrolling title: the two lines slide in from opposite sides and meet in the centre as the map pins.
      const e = Math.min(Math.max(top / H, 0), 1);
      rows.forEach((r, k) => (r.style.transform = `translate3d(${(k ? -1 : 1) * e * 42}vw, 0, 0)`));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      section.style.backgroundColor = "";
      prev.style.backgroundColor = "";
      section.style.removeProperty("--ac-dark");
    };
  }, []);

  const choose = (i: number) => {
    selectRef.current(i);
  };
  const lit = (i: number) => i < 14 && (free || (phase !== "count" && phase !== "intro") || i < count);
  const showNums = free || phase === "projects" || phase === "explore";
  const sel = shown === null ? null : items[shown];

  const shownName = shown === null ? null : items[shown].name;

  return (
    <section id="coverage" data-nav-dark data-header-title="Coverage" aria-labelledby="coverage-title" className="ac relative bg-black text-white">
      <div ref={wrapRef} className="relative h-[880svh]">
        <div
          ref={stageRef}
          data-phase={free ? "free" : phase}
          onClick={() => {
            deselectRef.current();
          }}
          className="ac-stage sticky top-0 h-[100svh] overflow-hidden" role="img" aria-label={`Map of Cambodia showing completed projects across ${provinceTotal} provinces and Phnom Penh where BCE operates`}>
          <svg data-ac-svg className="absolute inset-0 h-full w-full" style={{ opacity: 0 }} aria-hidden>
            <g className="ac-grat">
              {LONS.map(({ d }) => <line key={d} data-ac-lon y1="0" y2="100%" />)}
              {LATS.map(({ d }) => <line key={d} data-ac-lat x1="0" x2="100%" />)}
            </g>
            <g data-ac-map>
              {khmProvinces.map((p) => {
                const idx = itemIndex[p.name];
                const it = idx !== undefined ? items[idx] : null;
                const isCovered = it?.isCovered ?? false;
                const isActive = shownName === p.name;
                return (
                  <path
                    key={p.name}
                    d={p.d}
                    vectorEffect="non-scaling-stroke"
                    data-name={p.name}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select province ${p.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (idx !== undefined) choose(idx);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (idx !== undefined) choose(idx);
                      }
                    }}
                    className={`ac-prov${isCovered && idx !== undefined && lit(idx) ? " is-covered" : ""}${isActive ? " is-active" : ""}`}
                  >
                    <title>{p.name}{it?.projects ? ` (${it.projects}+ projects completed)` : " (Mobilization ready)"}</title>
                  </path>
                );
              })}
            </g>
          </svg>
          {/* Edge blurs & dark gradient vignettes: top, bottom, left, right */}
          <div className="ac-edge-top" aria-hidden />
          <div className="ac-edge-bottom" aria-hidden />
          <div className="ac-edge-left" aria-hidden />
          <div className="ac-edge-right" aria-hidden />
          <div className="ac-vignette" aria-hidden />

          {/* The story told over the map itself, one big number at a time. */}
          {/* Last step: a short prompt; the details wait for a click on the map. */}
          <p className={`ac-hint${!free && phase === "explore" ? " is-on" : ""}`}><PinIcon />Click on a province to see more details</p>

          {/* Intro: the section title, slid together on the way in, then zoomed through to reveal the map. */}
          <div ref={introRef} className="ac-intro">
            <h2 id="coverage-title" className="ac-title ac-intro-title">
              <span data-ac-row className="block">Everywhere You Build,</span> <span data-ac-row className="block">We’ve Got You Covered.</span>
            </h2>
          </div>

          <div className="ac-story">
            <div className={`ac-story-step${!free && phase === "count" ? " is-on" : ""}`}>
              <p className="ac-story-eyebrow">Operational coverage</p>
              <p className="ac-story-num">{String(count).padStart(2, "0")}</p>
              <p className="ac-story-lead">Locations covered across Cambodia</p>
            </div>
            <div className={`ac-story-step${!free && phase === "hq" ? " is-on" : ""}`}>
              <p className="ac-story-eyebrow">Head office</p>
              <p className="ac-story-num"><CountUp to={items[0].projects ?? 0} run={!free && phase === "hq"} /><span>{items[0].suffix || "+"}</span></p>
              <p className="ac-story-lead">Projects completed from Battambang</p>
            </div>
            <div className={`ac-story-step ac-story-step--right${!free && phase === "projects" ? " is-on" : ""}`}>
              <p className="ac-story-eyebrow">Completed projects</p>
              <p className="ac-story-num"><CountUp to={totalProjects} run={!free && phase === "projects"} /><span>+</span></p>
              <p className="ac-story-lead">Projects completed in 2025 across Cambodia</p>
            </div>
            <div className={`ac-story-step ac-story-step--right${!free && phase === "equip" ? " is-on" : ""}`}>
              <p className="ac-story-eyebrow">Equipment fleet</p>
              <p className="ac-story-num"><CountUp to={fleetTotal} run={!free && phase === "equip"} /></p>
              <p className="ac-story-lead">Machines in our own fleet</p>
              <ul className="ac-story-fleet">
                {FLEET.map(([n, label]) => (
                  <li key={label}><span><CountUp to={n} run={!free && phase === "equip"} pad={2} /></span>{label}</li>
                ))}
              </ul>
              <p className="ac-story-note">Plus our own piling rigs.</p>
            </div>
          </div>

          {items.slice(0, 14).map((it, i) =>
            it.name === HQ ? (
              // The head office keeps its BCE bubble; this marker only carries its project number.
              <div
                key={it.name}
                data-ac-marker
                aria-hidden
                onClick={(e) => {
                  e.stopPropagation();
                  choose(i);
                }}
                style={{ cursor: "pointer", pointerEvents: "auto" }}
                className={`ac-marker ac-marker--hq${showNums && shown !== i ? " show-num" : ""}`}
              >
                <span className="ac-marker-num">{it.projects}{it.suffix || "+"}</span>
              </div>
            ) : (
              <div
                key={it.name}
                data-ac-marker
                aria-hidden
                onClick={(e) => {
                  e.stopPropagation();
                  choose(i);
                }}
                style={{ cursor: "pointer", pointerEvents: "auto" }}
                className={`ac-marker${labelTop.has(it.name) ? " is-top" : ""}${shown === i ? " is-active" : ""}${lit(i) ? "" : " is-off"}${showNums ? " show-num" : ""}${numLeft.has(it.name) ? " num-left" : ""}`}
              >
                {/* Resting: a dark BCE pin, its tip on the place. Active: a light pill naming the place. */}
                <svg className="ac-marker-pin" viewBox="0 0 34 40" fill="none">
                  <path d="M17 39.2 12.3 33A16 16 0 1 1 21.7 33Z" />
                  <text x="17" y="21.2" textAnchor="middle">BCE</text>
                </svg>
                <span className="ac-marker-label">{it.name}</span>
                <span className="ac-marker-pill"><PinIcon />{it.name}</span>
                {it.projects ? <span className="ac-marker-num" style={{ transitionDelay: showNums ? `${i * 45}ms` : "0ms" }}>{it.projects}{it.suffix || "+"}</span> : null}
              </div>
            ),
          )}

          {/* Head office: Aircenter's speech-bubble marker, its tail tip on Battambang. */}
          <div data-ac-hq aria-hidden className="ac-hq" onClick={(e) => { e.stopPropagation(); choose(0); }} style={{ cursor: "pointer", pointerEvents: "auto" }}>
            <svg viewBox="0 0 102 73" width="102" height="73" fill="none">
              <path fill="#000" stroke="#fff" d="M93 1H9c-2.2 0-3.4 0-4.2.4a4 4 0 0 0-1.8 1.8C1 4 1 5.2 1 7.4v47.2c0 2.2 0 3.4.4 4.2a4 4 0 0 0 1.8 1.8c.8.4 2 .4 4.2.4h83l10 10V7.4c0-2.2 0-3.4-.4-4.2a4 4 0 0 0-1.8-1.8C96.4 1 95.2 1 93 1Z" />
              <text x="11" y="31.5" className="ac-hq-text">BCE</text>
            </svg>
          </div>

          {items.map((it, i) => (
            <div key={it.name} data-ac-tip aria-hidden={shown !== i} className={`ac-tip${shown === i ? " is-visible" : ""}`}>
              <div className="ac-tip-anim">
                <span className="ac-tip-tri" />
                <div className="ac-tip-card" onClick={(e) => e.stopPropagation()}>
                  <div className="ac-tip-head">
                    <span>{it.name}</span>
                    {it.name === HQ && <span className="ac-tip-tag">Head office</span>}
                  </div>
                  <div>
                    {it.projects ? (
                      <p className="ac-tip-num"><CountUp to={it.projects} run={shown === i} /><span className="ac-tip-suffix">{it.suffix || "+"}</span></p>
                    ) : (
                      <p className="ac-tip-num ac-tip-num--word">Ready</p>
                    )}
                    <p className="ac-tip-label">{it.projects ? "Projects completed in 2025" : "Available for deployment"}</p>
                  </div>
                  {/* Equipment based in the province: the fleet that makes the coverage real. */}
                  <div className="ac-tip-equip">
                    <p className="ac-tip-equip-title">{it.equipment.length ? "Equipment based here" : "Mobilised from Battambang on request"}</p>
                    {it.equipment.length > 0 && (
                      <ul className="ac-tip-equip-list">
                        {it.equipment.map(([n, label]) => (
                          <li key={label}><span className="ac-tip-equip-num"><CountUp to={n} run={shown === i} pad={2} /></span><span className="ac-tip-equip-label">{label}</span></li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Phones: the chosen place's details in one card (the map cards are desktop only). */}
          <div className={`ac-mcard${sel ? " is-visible" : ""}`} onClick={(e) => e.stopPropagation()} aria-hidden={!sel}>
            {sel && (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[17px] font-medium">{sel.name}</span>
                  <span className="text-xs text-black/50">{sel.name === HQ ? "Head office" : sel.region}</span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <span className="block text-[3rem] font-medium leading-[.85] tracking-[-.04em]">
                      {sel.projects ? <><CountUp to={sel.projects} run />{sel.suffix || "+"}</> : "Ready"}
                    </span>
                    <span className="mt-2 block text-[13px] text-black/55">{sel.projects ? "Projects completed in 2025" : "Mobilization ready"}</span>
                  </div>
                  {sel.equipment.length > 0 && (
                    <ul className="ac-card-equip">
                      {sel.equipment.slice(0, 3).map(([n, label]) => <li key={label}><b>{n}</b> {label}</li>)}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="ac-drag-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V6a2 2 0 1 1 4 0v5.5m0-4V5a2 2 0 1 1 4 0v6.5m0-4.5a2 2 0 1 1 4 0V14a7 7 0 0 1-14 0v-4a2 2 0 0 1 4 0v1.5" />
            </svg>
            <span>Drag map to move</span>
          </div>

          <div className="ac-zoom-controls" role="group" aria-label="Map zoom controls">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => zoomInRef.current()}
              className="ac-zoom-btn"
              title="Zoom in"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => zoomOutRef.current()}
              className="ac-zoom-btn"
              title="Zoom out"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Reset map view"
              onClick={() => resetViewRef.current()}
              className="ac-zoom-btn"
              title="Reset view"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
              </svg>
            </button>
          </div>

          <p className="ac-credit">Boundaries © OpenStreetMap contributors · Completed projects across Cambodia</p>
        </div>
      </div>
    </section>
  );
}

