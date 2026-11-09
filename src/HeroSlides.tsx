import { useEffect, useRef } from "react";

// Rotating banner shots kept as historical reference / fallback
export const heroSlides = [
  { label: "Batching plant", id: "/Image/bce/hero_batching_plant.jpg", position: "50% 40%" },
  { label: "Mixer trucks", id: "/Image/bce/machinery_fleet.jpg", position: "50% 55%" },
  { label: "Concrete pumping", id: "/Image/bce/project_page_16.jpg", position: "50% 62%" },
  { label: "Piling", id: "/Image/bce/project_page_20.jpg", position: "50% 45%" },
  { label: "Slab works", id: "/Image/bce/project_page_24.jpg", position: "50% 50%" },
];

/**
 * Looping hero video highlight:
 * Replaces the multi-slide image carousel with a continuous, cinematic construction highlight reel.
 * Features:
 * - Autoplay, loop, muted, playsInline for universal mobile/desktop compatibility.
 * - Local high-resolution construction aerial highlight (/video/hero_highlight.mp4).
 * - Instant fallback poster (/Image/bce/hero_batching_plant.jpg) to avoid blank frame.
 * - Resource-saving pause on scroll down and tab change.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

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
  }, []);

  return (
    <div data-hero-image className="absolute inset-0 h-full w-full overflow-hidden will-change-transform">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/Image/bce/hero_batching_plant.jpg"
        className="h-full w-full object-cover"
      >
        <source src="/video/hero_highlight.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export const HeroMedia = HeroVideo;

/** Slider indicator component: returns null as the slider has been replaced by the highlight video */
export function HeroIndicator(_props: { className?: string }) {
  return null;
}
