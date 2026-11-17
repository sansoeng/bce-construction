import type { ReactNode } from "react";

/**
 * Line icons for the site's value columns, drawn in the manner of dalco.ch/meet-dalco's company values: a single
 * hairline stroke on a 49-unit grid, round caps and joins, no fills, and the mark set large in the brand orange above
 * the title. The names are the `icon` values stored on each business value (src/businessDetails.ts) and offered by the
 * admin picker (src/admin/adminSchemas.ts), so content and drawing stay in step.
 */
export type LineIconName =
  | "plant"
  | "lab"
  | "record"
  | "truck"
  | "rig"
  | "blueprint"
  | "shield"
  | "helmet"
  | "rain"
  | "layers"
  | "grid"
  | "wrench"
  | "pin"
  | "pump"
  | "loader"
  | "crane"
  | "tower"
  | "lift";

const shapes: Record<LineIconName, ReactNode> = {
  // Batching plant: mixing hall beside a silo.
  plant: (
    <>
      <path d="M6 41V25h16v16" />
      <path d="M28 41V18c0-4.4 2.7-7 6-7s6 2.6 6 7v23" />
      <path d="M28 25h12" />
      <path d="M6 41h36" />
      <path d="M11 31h6M11 36h6" />
    </>
  ),
  // Laboratory: conical flask, the sample line across the body.
  lab: (
    <>
      <path d="M22 8v9.5L13.8 34a4 4 0 0 0 3.5 6.4h14.4a4 4 0 0 0 3.5-6.4L27 17.5V8" />
      <path d="M19 8h11" />
      <path d="M17.2 30h14.6" />
    </>
  ),
  // Records: a sheet with a folded corner and three entries.
  record: (
    <>
      <path d="M14 7h13l8 8v27H14z" />
      <path d="M27 7v8h8" />
      <path d="M20 25h12M20 31h12M20 37h7" />
    </>
  ),
  // Mixer truck: body, cab and two wheels.
  truck: (
    <>
      <path d="M7 32V15h20v17" />
      <path d="M27 21h6.5L41 29v3h-6" />
      <circle cx="14" cy="36" r="3.6" />
      <circle cx="33" cy="36" r="3.6" />
      <path d="M7 32h3M18 32h9" />
    </>
  ),
  // Piling rig: hammer driving a pile into the ground.
  rig: (
    <>
      <path d="M16 6.5h17v6H16z" />
      <path d="M24.5 12.5v6" />
      <path d="M18.5 18.5h12" />
      <path d="M24.5 18.5V41" />
      <path d="M7 34h13M29 34h13" />
    </>
  ),
  // Engineering: dividers set on the drawing.
  blueprint: (
    <>
      <circle cx="24.5" cy="11" r="3" />
      <path d="M22.3 13.6 11 39.5M26.7 13.6 38 39.5" />
      <path d="M16.8 27h15.4" />
    </>
  ),
  // Responsibility: shield with a check.
  shield: (
    <>
      <path d="M24.5 7.5c3.8 3.3 8.3 5.2 12.5 5.7v9.3c0 8.7-5.3 15-12.5 18.5C17.3 37.5 12 31.2 12 22.5v-9.3c4.2-.5 8.7-2.4 12.5-5.7z" />
      <path d="M19 23.5l4 4 8-8.5" />
    </>
  ),
  // Safety: hard hat.
  helmet: (
    <>
      <path d="M11.5 32a13 13 0 0 1 26 0" />
      <path d="M8 32h33v4.5H8z" />
      <path d="M24.5 19.5V32" />
    </>
  ),
  // Wet season: cloud and three drops.
  rain: (
    <>
      <path d="M14.5 29.5a6.5 6.5 0 0 1 .9-12.9 8.8 8.8 0 0 1 16.7 2.2 5.6 5.6 0 0 1 .9 10.7z" />
      <path d="M18.5 34l-2 6M25.5 34l-2 6M32.5 34l-2 6" />
    </>
  ),
  // Concrete layers: three stacked slabs.
  layers: (
    <>
      <path d="M24.5 7.5 41 16l-16.5 8.5L8 16z" />
      <path d="M8 24.5l16.5 8.5L41 24.5" />
      <path d="M8 33l16.5 8.5L41 33" />
    </>
  ),
  // Formwork: a ruled panel.
  grid: (
    <>
      <rect x="8.5" y="8.5" width="32" height="32" rx="2.5" />
      <path d="M8.5 24.5h32M24.5 8.5v32" />
    </>
  ),
  // Workshop: open-end spanner.
  wrench: (
    <path d="M30.5 8a9.5 9.5 0 0 0-8.6 13.5L9.6 33.8a3.9 3.9 0 1 0 5.6 5.5l12.3-12.3A9.5 9.5 0 0 0 41 18.5l-7.2 2.6-3.4-3.4z" />
  ),
  // Location: map pin.
  pin: (
    <>
      <path d="M24.5 41.5S12 29 12 21a12.5 12.5 0 0 1 25 0c0 8-12.5 20.5-12.5 20.5z" />
      <circle cx="24.5" cy="21" r="4.5" />
    </>
  ),
  // Pump truck: chassis with the placing boom folded over the cab.
  pump: (
    <>
      <path d="M5 32V23h16v9" />
      <path d="M21 27h7l5 5" />
      <path d="M26 23 40 9" />
      <path d="M40 9v6" />
      <circle cx="12" cy="35" r="3.2" />
      <circle cx="29" cy="35" r="3.2" />
    </>
  ),
  // Wheel loader: cab, front arm and bucket.
  loader: (
    <>
      <path d="M6 34V22h13v12" />
      <path d="M19 26h13l6-6" />
      <path d="M38 20v9h5v7h-5" />
      <circle cx="12" cy="36" r="3.4" />
      <circle cx="30" cy="36" r="3.4" />
    </>
  ),
  // Crane truck: truck bed, telescopic boom and hook.
  crane: (
    <>
      <path d="M4 34V26h20v8" />
      <path d="M24 30h6" />
      <path d="M30 28 42 12" />
      <path d="M42 12v8" />
      <path d="M39 20h6" />
      <circle cx="11" cy="36" r="3.2" />
      <circle cx="28" cy="36" r="3.2" />
    </>
  ),
  // Tower crane: mast, jib and suspended load.
  tower: (
    <>
      <path d="M20 41V10h4v31" />
      <path d="M8 12h32" />
      <path d="M22 12V7h6v5" />
      <path d="M35 12v7" />
      <path d="M32 19h6" />
    </>
  ),
  // Scissor lift: crossed legs, platform and rail.
  lift: (
    <>
      <path d="M9 41h31" />
      <path d="M13 41l9-8M32 41l-9-8" />
      <path d="M14 33h21v-5H14z" />
      <path d="M16 28v-4h17v4" />
    </>
  ),
};

// Anything stored under a name this set does not know falls back to a tick in a ring rather than an empty box.
const fallback = (
  <>
    <circle cx="24.5" cy="24.5" r="15.5" />
    <path d="M18.5 25l4.5 4.5 8-9" />
  </>
);

export function LineIcon({
  name,
  className = "size-11",
  strokeWidth = 1.5,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 49 49"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {shapes[name as LineIconName] ?? fallback}
    </svg>
  );
}
