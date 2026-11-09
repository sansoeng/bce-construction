// Masked text reveal after kononenkogroup.com's splittext + linereveal directives (GSAP SplitText): every title and
// paragraph is split into lines inside masks, and each line rises from yPercent 101 over Si() = 1.109s on their
// cubic-bezier(.17, .84, .44, 1), one line after another every Si(1) = 0.1s. Opening titles marked
// data-split-type="words" rise word by word instead (their hero titles). Text entering together (e.g. a title and its
// paragraph) start together. Like their ScrollTrigger, each element plays the moment its top passes 85% of the
// viewport (their "top bottom-=15%"), or as soon as it enters on phones (their mobile "top bottom"): no added delay and
// no queueing behind the text above it, so every line is already moving as it comes into view.
const DURATION = 1.109;
const stagger = (_el: HTMLElement) => 0.1;
const lineCount = (el: HTMLElement) => Number(el.dataset.splitLines ?? 1);

const KHMER = /[\u1780-\u17FF]/;
type WordSegmenter = { segment(text: string): Iterable<{ segment: string }> };
const SegmenterCtor = (Intl as unknown as { Segmenter?: new (locale: string, opts: { granularity: "word" }) => WordSegmenter }).Segmenter;
const khmerWords: WordSegmenter | null = SegmenterCtor ? new SegmenterCtor("km", { granularity: "word" }) : null;

function wrapWords(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  textNodes.forEach((node) => {
    const parts = (node.textContent ?? "").split(/(\s+)/);
    const frag = document.createDocumentFragment();
    const addWord = (text: string) => {
      const mask = document.createElement("span");
      mask.className = "sw";
      const inner = document.createElement("span");
      inner.className = "sw-i";
      inner.textContent = text;
      mask.append(inner);
      frag.append(mask);
    };
    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.append(part);
        return;
      }
      // Khmer writes words without spaces: split such runs into words (the browser's Khmer dictionary) with a
      // zero-width break between them, or a whole clause would become one block that wraps over the line above.
      if (KHMER.test(part) && khmerWords) {
        [...khmerWords.segment(part)].forEach(({ segment }, k) => {
          if (k) frag.append("\u200B");
          addWord(segment);
        });
        return;
      }
      addWord(part);
    });
    node.replaceWith(frag);
  });
}

// Words on the same visual line share a delay, so the effect reads as whole lines rising; word-type titles step
// through their words instead.
function assignLineDelays(root: HTMLElement) {
  if (root.dataset.splitType === "words") {
    const words = root.querySelectorAll<HTMLElement>(".sw");
    words.forEach((word, i) => word.style.setProperty("--d", `${i * stagger(root)}s`));
    root.dataset.splitLines = String(Math.max(words.length, 1));
    return;
  }
  let lineTop: number | null = null;
  let line = -1;
  const each = stagger(root);
  root.querySelectorAll<HTMLElement>(".sw").forEach((word) => {
    const top = word.getBoundingClientRect().top;
    if (lineTop === null || Math.abs(top - lineTop) > 4) {
      line += 1;
      lineTop = top;
    }
    word.style.setProperty("--d", `${line * each}s`);
  });
  root.dataset.splitLines = String(line + 1);
}

// Starts the reveal; once every line has landed the masks are released so nothing stays clipped.
export function playSplit(el: HTMLElement, base = 0) {
  if (el.classList.contains("is-split-in")) return;
  el.style.setProperty("--base", `${base}s`);
  el.classList.add("is-split-in");
  setTimeout(() => el.classList.add("is-split-done"), (base + DURATION + (lineCount(el) - 1) * stagger(el)) * 1000 + 100);
}

export function initSplitReveal() {
  const targets = [...document.querySelectorAll<HTMLElement>("[data-split]")].filter((el) => !el.dataset.splitReady);
  targets.forEach((el) => {
    el.dataset.splitReady = "true";
    el.setAttribute("aria-label", el.textContent?.replace(/\s+/g, " ").trim() ?? "");
    wrapWords(el);
    el.classList.add("split");
  });

  const all = [...document.querySelectorAll<HTMLElement>("[data-split]")];
  const relayout = () => all.forEach(assignLineDelays);
  relayout();
  document.fonts?.ready.then(relayout);
  addEventListener("resize", relayout);

  const onEnter = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    const loading = document.documentElement.classList.contains("is-loading");
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement;
      // Hero copy is choreographed by the loader instead.
      if (!entry.isIntersecting || ("splitManual" in el.dataset && loading)) return;
      playSplit(el);
      observer.unobserve(el);
    });
  };

  const rootMargin = matchMedia("(max-width: 767.98px)").matches ? "0px" : "0px 0px -15% 0px";
  const observer = new IntersectionObserver((entries) => onEnter(entries, observer), { rootMargin });
  // data-split-toggle (Expertise copy) and data-split-hold (About intro, revealed once the banner photo has
  // cleared it) are started by App's own scroll logic instead.
  all.filter((el) => !("splitToggle" in el.dataset) && !("splitHold" in el.dataset)).forEach((el) => observer.observe(el));

  return () => {
    observer.disconnect();
    removeEventListener("resize", relayout);
  };
}
