import { FeatureBand } from "./FeatureBand";
import { quality } from "./quality";

// Equipment & fleet on the homepage, the first user of the shared FeatureBand (src/FeatureBand.tsx): the centred label
// and headline, then the sticky photographic panel that opens from a half-width window to the full screen while its
// photo zooms out. The band's copy, photo and two CTAs come from `quality.fleet`.
export function FleetBand() {
  const fleet = quality.fleet;

  return (
    <FeatureBand
      id="fleet-evidence"
      headerTitle="Equipment & fleet"
      kicker={fleet.kicker}
      title={fleet.title}
      image={fleet.image}
      imageAlt={fleet.imageAlt}
      copy={fleet.copy[0]}
      actions={[
        { href: "/fleet", label: "Explore the fleet", theme: "white" },
        { href: fleet.ctaHref, label: fleet.ctaLabel, theme: "outline-white" },
      ]}
    />
  );
}
