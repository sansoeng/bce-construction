import { useEffect, useRef, useState } from "react";

// Floating glass hover button cursor modelled after fluid.glass:
// Smoothly tracks the mouse cursor via lerp and reveals when hovering over interactive cards (projects & core offerings).
export default function FluidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("View");
  const targetPos = useRef([-200, -200]);
  const currentPos = useRef([-200, -200]);

  useEffect(() => {
    // Only activate on pointer-fine desktop devices (matching fluid.glass)
    const isTouch = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) return;

    let rafId = 0;
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

    const onMouseMove = (e: MouseEvent) => {
      targetPos.current = [e.clientX, e.clientY];
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectCard = target.closest<HTMLElement>("a.kp-item");
      // Any element can name its own label, e.g. data-cursor="View" on gallery photos, "Prev"/"Next" in the viewer.
      const custom = target.closest<HTMLElement>("[data-cursor]");

      if (custom || projectCard) {
        setLabel(custom?.dataset.cursor ?? "View");
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const onMouseLeaveDoc = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setVisible(false);
      }
    };

    const loop = () => {
      const c = currentPos.current;
      const t = targetPos.current;
      c[0] = lerp(c[0], t[0], 0.15);
      c[1] = lerp(c[1], t[1], 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${c[0].toFixed(1)}px, ${c[1].toFixed(1)}px, 0)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeaveDoc);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.documentElement.removeEventListener("mouseleave", onMouseLeaveDoc);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`fg-cursor ${visible ? "is-visible" : ""}`}
    >
      <div className="fg-cursor-label">{label}</div>
    </div>
  );
}
