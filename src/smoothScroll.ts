// Smooth scrolling after kononenkogroup.com: Lenis with a fixed-duration glide instead of a lerp. Their config uses
// duration Si(6, 2) = 0.947s and easing 1 - 2^(-Si(11, 6) t) = 1 - 2^(-11.18 t), a long expo-out that settles softly.
export const LENIS_OPTIONS = {
  duration: 0.947,
  easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -11.18 * t)),
  smoothWheel: true,
  anchors: true,
};
