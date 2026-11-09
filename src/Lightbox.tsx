import { useCallback, useEffect, useRef, useState } from "react";

// Full-screen project gallery viewer, after kononenkogroup.com's work pages: clicking any project photo opens a dark
// stage that wipes up from the bottom. Counter and caption on top, the photo contained in the middle, thumbnails
// below. Click the left/right half (the glass cursor reads Prev/Next), use the arrow keys or swipe to move; Esc or
// Close wipes it away again. Page scroll is held while it is open.

type Item = { image: string; caption: string };
const pad = (n: number) => String(n).padStart(2, "0");
const CLOSE_MS = 700;

export default function Lightbox({ items, index, onIndex, onClose }: {
  items: Item[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const current = useRef(index ?? 0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  if (index !== null) current.current = index;
  const i = current.current;

  // Mount, then flip to shown on the next frame so the wipe-in runs; on close, wipe out and unmount after it.
  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), CLOSE_MS);
    returnFocus.current?.focus?.({ preventScroll: true });
    return () => clearTimeout(t);
  }, [open]);

  // Hold the page (Lenis and native scroll) while open.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } | null }).__lenis;
    lenis?.stop();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      lenis?.start();
      root.style.overflow = prev;
    };
  }, [open]);

  const go = useCallback((step: number) => {
    onIndex((current.current + step + items.length) % items.length);
  }, [items.length, onIndex]);

  const pick = (k: number) => {
    if (k !== i) onIndex(k);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[i] as HTMLElement | undefined;
    if (strip && thumb) strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: "smooth" });
  }, [i, shown]);

  // Swipe on touch screens.
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  if (!mounted) return null;

  return (
    <div
      className={`lb${shown ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Project gallery"
    >
      <div className="lb-top">
        <p className="lb-count" aria-live="polite"><span>{pad(i + 1)}</span> / {pad(items.length)}</p>
        <p className="lb-caption">{items[i].caption}</p>
        <button ref={closeRef} type="button" className="lb-close" onClick={onClose}>
          <span>Close</span>
          <span className="lb-close-x" aria-hidden>
            <svg viewBox="0 0 13 13" fill="none"><path d="M.35 11.67 11.67.35M.35.35l11.32 11.32" stroke="currentColor" /></svg>
          </span>
        </button>
      </div>

      <div className="lb-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {items.map((it, k) => (
          <img key={it.image} src={it.image} alt={k === i ? it.caption : ""} aria-hidden={k !== i} className={`lb-img${k === i ? " is-active" : ""}`} draggable={false} />
        ))}
        <button type="button" className="lb-zone lb-zone--prev" data-cursor="Prev" aria-label="Previous photo" onClick={() => go(-1)} />
        <button type="button" className="lb-zone lb-zone--next" data-cursor="Next" aria-label="Next photo" onClick={() => go(1)} />
      </div>

      <div className="lb-bottom">
        <p className="lb-caption lb-caption--mobile">{items[i].caption}</p>
        <div ref={thumbsRef} className="lb-thumbs">
          {items.map((it, k) => (
            <button key={it.image} type="button" className={`lb-thumb${k === i ? " is-active" : ""}`} aria-label={`Photo ${k + 1}: ${it.caption}`} aria-current={k === i} onClick={() => pick(k)}>
              <img src={it.image} alt="" loading="lazy" />
            </button>
          ))}
        </div>
        <div className="lb-arrows">
          <button type="button" className="lb-arrow" aria-label="Previous photo" onClick={() => go(-1)}>
            <svg viewBox="0 0 12 12" fill="none" aria-hidden><path d="M11 6H1m4-4L1 6l4 4" stroke="currentColor" strokeWidth="1.2" /></svg>
          </button>
          <button type="button" className="lb-arrow" aria-label="Next photo" onClick={() => go(1)}>
            <svg viewBox="0 0 12 12" fill="none" aria-hidden><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
