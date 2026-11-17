import { useEffect, useRef, useState } from "react";

// Rotating banner shots kept as historical reference / fallback
export const heroSlides = [
  { label: "Batching plant", id: "/Image/bce/hero_batching_plant.webp", position: "50% 40%" },
  { label: "Mixer trucks", id: "/Image/bce/machinery_fleet.webp", position: "50% 55%" },
  { label: "Concrete pumping", id: "/Image/bce/project_page_16.webp", position: "50% 62%" },
  { label: "Piling", id: "/Image/bce/project_page_20.webp", position: "50% 45%" },
  { label: "Slab works", id: "/Image/bce/project_page_24.webp", position: "50% 50%" },
];

/**
 * Looping hero video highlight:
 * Replaces the multi-slide image carousel with a continuous, cinematic construction highlight reel.
 * Features:
 * - Autoplay, loop, muted, playsInline for universal mobile/desktop compatibility.
 * - Local high-resolution construction aerial highlight (/video/hero_highlight.mp4).
 * - Instant fallback poster (/Image/bce/hero_batching_plant.webp) to avoid blank frame.
 * - Resource-saving pause on scroll down and tab change.
 */
export function HeroVideo({
  video = "/video/hero_highlight.mp4",
  poster = "/Image/bce/hero_batching_plant.webp",
}: {
  video?: string;
  poster?: string;
} = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // The reel is 3.7 MB: on Save-Data or a 2G/3G connection, and under reduced-motion, the still poster is served
  // instead of downloading and decoding it. Checked once, before the <video> exists, so nothing is fetched.
  const [allowVideo] = useState(() => {
    try {
      const connection = (navigator as unknown as {
        connection?: { saveData?: boolean; effectiveType?: string };
      }).connection;
      if (connection?.saveData) return false;
      if (/(^|-)2g$/.test(connection?.effectiveType ?? "")) return false;
      return !matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or low-power mode; poster remains visible
      });
    }

    const handleVisibility = () => {
      if (document.hidden) {
        if (!video.paused) video.pause();
      } else if (window.scrollY <= window.innerHeight) {
        if (video.paused) video.play().catch(() => {});
      }
    };

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        if (!video.paused) video.pause();
      } else if (!document.hidden) {
        if (video.paused) video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [allowVideo]);

  return (
    <div data-hero-image className="absolute inset-0 h-full w-full overflow-hidden will-change-transform">
      {allowVideo ? (
        <video
          ref={videoRef}
          key={`${video}|${poster}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="h-full w-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <img src={poster} alt="" className="h-full w-full object-cover" />
      )}
    </div>
  );
}

export const HeroMedia = HeroVideo;

/** Slider indicator component: returns null as the slider has been replaced by the highlight video */
export function HeroIndicator(_props: { className?: string }) {
  return null;
}
