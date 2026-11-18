import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import ArrowButton from "./ArrowButton";
import type { HeroSlide } from "./homepage";

/**
 * Home banner, after olympic.no.
 *
 * A full-screen stack of messages rather than one fixed film: each panel carries its own photo or film, its own mono
 * label and one display line. The next panel rises from the bottom edge while the one leaving climbs out, the media
 * inside each counter-moves a little so the two layers slide against each other, and the rail at the foot of the
 * banner shows a 01–04 index, a hairline and the panel's label, with the live one filling in the brand orange as it
 * holds. A panel with a film advances when the film ends (as on the reference); a still panel holds for
 * IMAGE_HOLD_MS. The rail is clickable, and the deck holds while it is scrolled away or the tab is hidden.
 *
 * What stays BCE: the floating header (untouched), the fly-into-the-About-frame scroll morph owned by App, and the
 * latest-news card, which rides above the rail instead of replacing the reference's empty right side.
 */

const IMAGE_HOLD_MS = 6500;
const TRANSITION_MS = 1400;

export function HeroBanner({ slides, aside }: { slides: HeroSlide[]; aside?: ReactNode }) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  // The panel that just left is parked back below the frame without a transition, ready to rise again.
  const [parked, setParked] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);
  // The first copy waits for the loader to hand the page over, so its rise reads as part of the intro.
  const [ready, setReady] = useState(
    () => typeof document === "undefined" || !document.documentElement.classList.contains("is-loading"),
  );
  const [reduced] = useState(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef(0);
  const startRef = useRef(0);
  const leaveTimer = useRef<number | undefined>(undefined);
  const durations = useRef<number[]>(slides.map(() => IMAGE_HOLD_MS));

  const go = useCallback(
    (index: number) => {
      const next = ((index % slides.length) + slides.length) % slides.length;
      if (next === activeRef.current) return;
      startRef.current = performance.now();
      const previous = activeRef.current;
      setLeaving(previous);
      setParked(null);
      activeRef.current = next;
      setActive(next);
      setCycle((value) => value + 1);
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => {
        setLeaving(null);
        setParked(previous);
      }, TRANSITION_MS);
    },
    [slides.length],
  );

  // The copy of the panel that just left should not keep a full track behind it.
  useEffect(() => {
    fills.current.forEach((fill, index) => {
      if (index === active || !fill) return;
      fill.style.transform = "scaleX(0)";
    });
  }, [active]);

  // Hand-over from the loader: html keeps `is-loading` until the page is released. The timer is insurance only — a
  // loader that never releases must not leave the banner's copy hidden in its start position.
  useEffect(() => {
    if (ready) return;
    const html = document.documentElement;
    const check = () => {
      if (!html.classList.contains("is-loading")) setReady(true);
    };
    const observer = new MutationObserver(check);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    const timer = window.setTimeout(() => setReady(true), 9000);
    check();
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [ready]);

  // Only the live film plays; the others are rewound so they restart from their first frame.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && ready) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Autoplay refused (low power mode, data saver): the poster stays and the timer still advances.
        });
      } else {
        video.pause();
        if (video.currentTime) video.currentTime = 0;
      }
    });
  }, [active, ready]);

  // One frame loop drives the rail: it reads no layout, writes one transform, and measures the hold on the wall clock
  // (a throttled background tab slows rAF down, but the deck still changes on time). While the page is scrolled away
  // the start is pushed forward, so a panel never expires unseen.
  useEffect(() => {
    if (reduced || !ready || slides.length < 2) return;
    let frame = 0;
    const step = (now: number) => {
      frame = requestAnimationFrame(step);
      if (document.hidden || scrollY > innerHeight * 1.2) {
        startRef.current = now;
        return;
      }
      const hold = durations.current[activeRef.current] ?? IMAGE_HOLD_MS;
      const progress = (now - startRef.current) / hold;
      const fill = fills.current[activeRef.current];
      if (fill) fill.style.transform = `scaleX(${Math.min(progress, 1).toFixed(4)})`;
      if (progress >= 1) go(activeRef.current + 1);
    };
    frame = requestAnimationFrame(step);
    startRef.current = performance.now();
    return () => cancelAnimationFrame(frame);
  }, [go, ready, reduced, slides.length]);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  return (
    <div className="hb" data-ready={ready ? "true" : "false"}>
      <div className="hero-media hb-media">
        <div data-hero-image className="hb-frame">
          {slides.map((slide, index) => {
            const live = index === active;
            return (
              <div
                key={`${slide.label}-${index}`}
                className={`hb-slide${live ? " is-active" : ""}${index === leaving ? " is-leaving" : ""}${
                  index === parked ? " is-parked" : ""
                }`}
                aria-hidden={!live}
              >
                {slide.video ? (
                  <video
                    ref={(node) => {
                      videoRefs.current[index] = node;
                    }}
                    className="hb-img no-radius"
                    src={slide.video}
                    poster={slide.poster || slide.image}
                    style={{ objectPosition: slide.position }}
                    muted
                    loop
                    playsInline
                    preload={index === 0 ? "auto" : "none"}
                    tabIndex={-1}
                    data-no-parallax
                    onLoadedMetadata={(event) => {
                      const video = event.currentTarget;
                      if (Number.isFinite(video.duration) && video.duration > 1) {
                        durations.current[index] = video.duration * 1000;
                      }
                    }}
                  />
                ) : (
                  <img
                    className="hb-img no-radius"
                    src={slide.image}
                    alt={slide.alt}
                    style={{ objectPosition: slide.position }}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    data-no-parallax
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* The reference's scrim: it darkens the lower half, where the copy and the rail sit. */}
      <div data-hero-copy className="hb-scrim" aria-hidden />

      <div data-hero-copy className="hb-ui">
        {slides.map((slide, index) => {
          const live = index === active;
          // The live panel's headline is the page's h1; the stacked ones are inert duplicates for the transition.
          const Title = live ? "h1" : "div";
          let wordIndex = 0;
          return (
            <div className={`hb-copy${live ? " is-live" : ""}`} key={`${slide.label}-${index}`} aria-hidden={!live}>
              <div className="hb-copy-inner" key={live ? `${index}-${cycle}` : `${index}-idle`}>
                <span className="hb-label" aria-hidden="true">
                  {[...(slide.label ?? "")].map((char, charIndex) => (
                    <span className="hb-char" style={{ "--i": charIndex } as React.CSSProperties} key={charIndex}>
                      {char === " " ? "\u00a0" : char}
                    </span>
                  ))}
                </span>

                <Title className="hb-title hero-title">
                  {(slide.titleLines ?? []).map((line, lineIndex) => (
                    <span className="hb-line" key={lineIndex}>
                      {line
                        .split(/\s+/)
                        .filter(Boolean)
                        .map((word) => {
                          const delay = wordIndex++;
                          return (
                            <Fragment key={`${word}-${delay}`}>
                              <span className="hb-word">
                                <span className="hb-word-i" style={{ "--d": delay } as React.CSSProperties}>
                                  {word}
                                </span>
                              </span>{" "}
                            </Fragment>
                          );
                        })}
                    </span>
                  ))}
                </Title>

                <div className="hb-cta-wrap">
                  <ArrowButton href={slide.ctaHref} label={slide.ctaLabel} theme="white" tabIndex={live ? undefined : -1} />
                </div>
              </div>
            </div>
          );
        })}

        {aside ? <div className="hb-aside">{aside}</div> : null}

        <div className="hb-rail" role="group" aria-label="Homepage banner">
          {slides.map((slide, index) => {
            const live = index === active;
            return (
              <button
                type="button"
                key={`${slide.label}-${index}`}
                className={`hb-rail-item${live ? " is-active" : ""}`}
                aria-label={`Show slide ${String(index + 1).padStart(2, "0")}. ${slide.label}`}
                aria-current={live ? "true" : undefined}
                onClick={() => {
                  if (index === active) {
                    // A second press on the live tab restarts its hold rather than doing nothing.
                    startRef.current = performance.now();
                    const fill = fills.current[index];
                    if (fill) fill.style.transform = "scaleX(0)";
                    return;
                  }
                  go(index);
                }}
              >
                <span className="hb-rail-index">{String(index + 1).padStart(2, "0")}.</span>
                <span className="hb-rail-track" aria-hidden="true">
                  <span
                    className="hb-rail-fill"
                    ref={(node) => {
                      fills.current[index] = node;
                    }}
                  />
                </span>
                <span className="hb-rail-label">{slide.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
