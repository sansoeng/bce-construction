// Core business detail pages (/?business=<slug>), reached from the homepage's "Our core business offering" panels,
// the footer and the header's business menu. Structure follows the Skanska service pages: a full-screen cover, an
// overview with links into the page, the reasons to choose us, the solutions we deliver, capacity figures and related
// project highlights, all built from the site's existing Olympic-style blocks (src/ServiceBlocks.tsx).
// Figures reuse facts stated across the site: 4 batching plants at 70 m³/hr, 41 mixer trucks, 8 pump trucks, 7 piling
// rigs, 15 engineers in a team of 71, building since 1995, 13 provinces and Phnom Penh, grades C15–C40.

export type BusinessValue = { title: string; text: string; icon: string };
export type BusinessSolution = { title: string; text: string; image: string; alt: string };
export type BusinessFigure = { value: string; label: string };

export type BusinessDetail = {
  slug: string;
  name: string;
  /** Short line under the hero label. */
  tagline: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  valuesKicker: string;
  valuesTitle: string;
  values: BusinessValue[];
  solutionsKicker: string;
  solutionsTitle: string;
  solutionsLead: string;
  solutions: BusinessSolution[];
  capacityKicker: string;
  capacityTitle: string;
  capacityCopy: string;
  figures: BusinessFigure[];
  /** Project slugs shown under "Project highlights". */
  projects: string[];
};

export const businessDetails: BusinessDetail[] = [
  {
    slug: "ready-mix-concrete",
    name: "Ready-Mix Concrete",
    tagline: "Supply and logistics",
    heroImage: "/Image/bce/photos/concrete-discharge.webp",
    heroAlt: "BCE mixer truck discharging ready-mix concrete on site",
    intro: "Quality-controlled concrete from our four batching plants, each producing 70 m³ an hour, delivered to site by our own fleet of 41 mixer trucks across 13 provinces and Phnom Penh.",
    valuesKicker: "Why BCE for ready-mix",
    valuesTitle: "A supply chain you can plan around",
    values: [
      {
        title: "Own plants, own trucks",
        icon: "plant",
        text: "Four batching plants and 41 mixer trucks, all ours, so production and delivery are planned around your programme rather than a supplier's.",
      },
      {
        title: "Designed and tested in-house",
        icon: "lab",
        text: "Every grade is trial-mixed and approved before supply, then slump-tested on delivery and sampled for strength in our own laboratory.",
      },
      {
        title: "Every batch recorded",
        icon: "record",
        text: "Batch weights, delivery tickets and test results are documented for each pour and handed over with the works.",
      },
      {
        title: "Dispatch that keeps up",
        icon: "truck",
        text: "Site pouring runs 24/7 on schedule, with deliveries sequenced to the placing crew's programme and the pour sequence.",
      },
    ],
    solutionsKicker: "Our solutions",
    solutionsTitle: "Concrete for every pour",
    solutionsLead: "From foundations and frames to floors and hardstands, concrete is batched to the approved mix design and delivered when the site is ready.",
    solutions: [
      {
        title: "Structural concrete, C15–C40",
        text: "Foundations, columns, beams and slabs, batched to the approved mix design and delivered to the pour sequence.",
        image: "/Image/bce/photos/bridge-pump.webp",
        alt: "BCE pump boom placing structural concrete into formwork",
      },
      {
        title: "Continuous and mass pours",
        text: "Raft foundations, warehouse floors and large slabs, planned across plants and trucks so the pour runs without interruption.",
        image: "/Image/bce/photos/mixer-pour.webp",
        alt: "A continuous concrete pour across a large slab, with mixer trucks and a pump on site",
      },
      {
        title: "Pumped delivery",
        text: "Our eight pump trucks place concrete where mixer chutes cannot reach, including upper floors and restricted sites.",
        image: "/Image/bce/photos/boom-pump.webp",
        alt: "BCE boom pump truck placing concrete on site",
      },
    ],
    capacityKicker: "Capacity and fleet",
    capacityTitle: "Production and delivery in one fleet",
    capacityCopy: "Concrete is produced at four batching plants and delivered by our own mixers, so capacity, quality and timing stay under one roof and one programme.",
    figures: [
      { value: "04", label: "Batching plants" },
      { value: "70 m³", label: "Per hour, each plant" },
      { value: "41", label: "Mixer trucks" },
      { value: "13+", label: "Provinces and Phnom Penh" },
    ],
    projects: ["siem-reap-commercial-ready-mix"],
  },
  {
    slug: "piling",
    name: "Piling",
    tagline: "Foundations",
    heroImage: "/Image/bce/photos/pile-reinforcement.webp",
    heroAlt: "Reinforcement and concrete placement for a BCE foundation",
    intro: "Reinforced concrete piles for bridges, roads and buildings, installed with our own rigs and crews and backed by concrete and laboratory quality control from the same team.",
    valuesKicker: "Why BCE for piling",
    valuesTitle: "Foundations built on control",
    values: [
      {
        title: "Our own rigs and crews",
        icon: "rig",
        text: "We mobilise our own piling rigs and installation crews, so the programme is set by our capacity, not a subcontractor's.",
      },
      {
        title: "Engineered from the drawings",
        icon: "blueprint",
        text: "Our engineers plan the piling sequence, reinforcement and concrete supply around the structural design, then supervise installation on site.",
      },
      {
        title: "Concrete from our plants",
        icon: "plant",
        text: "Piles are cast with concrete from our own batching plants, tested for slump and strength before it reaches the rig.",
      },
      {
        title: "Records with every pile",
        icon: "record",
        text: "Installation records, concrete results and test reports are compiled and handed over with the foundation.",
      },
    ],
    solutionsKicker: "Our solutions",
    solutionsTitle: "Piling solutions",
    solutionsLead: "We install foundations for almost any structure, combining proven methods with concrete, rigs and testing from our own resources.",
    solutions: [
      {
        title: "Bored cast-in-place piles",
        text: "Piles bored and cast on site with our own concrete, suited to deep foundations and high load capacity.",
        image: "/Image/bce/photos/piling-rig.webp",
        alt: "BCE bored piling rig and casing on a foundation site",
      },
      {
        title: "Pressed and driven RC piles",
        text: "Hydraulic static pressing and driven reinforced concrete piles for foundations where vibration and spoil must stay controlled.",
        image: "/Image/bce/photos/pile-reinforcement.webp",
        alt: "Reinforcement cage and concrete placement for an RC pile",
      },
      {
        title: "Bridge and infrastructure foundations",
        text: "Pile caps, abutments and culverts for roads and bridges, from mobilisation through load testing and as-built records.",
        image: "/Image/bce/photos/bridge-pump.webp",
        alt: "Concrete pumping for a bridge pier and its foundation",
      },
    ],
    capacityKicker: "Rigs and capability",
    capacityTitle: "Rigs, crews and records",
    capacityCopy: "Piling crews work with our own rigs, concrete and laboratory, so foundations are planned, installed and verified by one team.",
    figures: [
      { value: "07", label: "Hydraulic piling rigs" },
      { value: "15", label: "Engineers in our team" },
      { value: "C35–C40", label: "Pile concrete from our plants" },
      { value: "13+", label: "Provinces and Phnom Penh" },
    ],
    projects: ["kampong-thom-bridge-foundations", "phnom-penh-tower-foundations"],
  },
  {
    slug: "construction",
    name: "Construction",
    tagline: "Civil construction",
    heroImage: "/Image/bce/photos/road-crew.webp",
    heroAlt: "BCE construction crew placing concrete on a road project",
    intro: "Civil construction for infrastructure, industrial, commercial and residential projects, built with our own concrete, equipment and engineers from the first earthworks to handover.",
    valuesKicker: "Why BCE for construction",
    valuesTitle: "One team from ground to handover",
    values: [
      {
        title: "One point of responsibility",
        icon: "shield",
        text: "Concrete, foundations and construction come from one team, so interfaces between trades do not become delays.",
      },
      {
        title: "Own materials and fleet",
        icon: "truck",
        text: "Our plants, mixer and pump trucks and piling rigs are assigned from our own fleet, keeping programme and cost under control.",
      },
      {
        title: "Engineers on site",
        icon: "helmet",
        text: "A team of 15 engineers plans, supervises and records the work from setting out to handover.",
      },
      {
        title: "Built for the wet season",
        icon: "rain",
        text: "Programmes are sequenced around Cambodia's rainy season, with drainage and earthworks planned before the first rains.",
      },
    ],
    solutionsKicker: "Our solutions",
    solutionsTitle: "Construction services",
    solutionsLead: "We deliver the works that carry a project from prepared ground to a completed structure, using resources we own and maintain.",
    solutions: [
      {
        title: "Roads and infrastructure",
        text: "National and provincial roads, bridges, culverts and drainage, delivered with our own earthworks, concrete and paving crews.",
        image: "/Image/bce/photos/concrete-discharge.webp",
        alt: "BCE crew placing concrete for a provincial road base",
      },
      {
        title: "Industrial and logistics",
        text: "Factories, warehouses and depots, from site preparation and foundations to structural frames and floors.",
        image: "/Image/bce/photos/boom-pump.webp",
        alt: "Concrete pumping at an industrial plant and storage facility",
      },
      {
        title: "Commercial and residential",
        text: "Commercial buildings and residential developments, built with our own concrete, equipment and engineers.",
        image: "/Image/bce/photos/building-frame.webp",
        alt: "Completed multi-storey building delivered by BCE",
      },
    ],
    capacityKicker: "Team and capacity",
    capacityTitle: "Built with our own resources",
    capacityCopy: "From the first earthworks to the final handover, our construction teams draw on the same plants, fleet and engineers that supply our concrete and foundations.",
    figures: [
      { value: "1995", label: "Building in Cambodia since" },
      { value: "71", label: "People in our team" },
      { value: "15", label: "Engineers on staff" },
      { value: "13+", label: "Provinces and Phnom Penh" },
    ],
    projects: ["battambang-provincial-road"],
  },
  {
    slug: "concrete-slab-works",
    name: "Concrete Slab Works",
    tagline: "Placement and finishing",
    heroImage: "/video/hero_concrete_poster.webp",
    heroAlt: "Concrete placement and finishing by the BCE slab crew",
    intro: "Placement and finishing of concrete slabs, pumped by our eight pump trucks with ready-mix from our own plants and tested for slump and strength on every pour.",
    valuesKicker: "Why BCE for slab works",
    valuesTitle: "Placed, finished and checked",
    values: [
      {
        title: "Pumped by our own fleet",
        icon: "truck",
        text: "Eight pump trucks place concrete across the slab, keeping pours steady and reducing manual handling on site.",
      },
      {
        title: "Finishing that lasts",
        icon: "layers",
        text: "Power-float finishes, dry-shake hardeners and saw-cut joints are matched to how the floor will be used.",
      },
      {
        title: "Tested concrete, every delivery",
        icon: "lab",
        text: "Slump is checked on arrival and cubes are crushed at 7 and 28 days, with results recorded for each pour.",
      },
      {
        title: "Pours planned in bays",
        icon: "grid",
        text: "Large floors are divided into pour bays and sequenced with our batching plants so each day's work closes cleanly.",
      },
    ],
    solutionsKicker: "Our solutions",
    solutionsTitle: "Slab solutions",
    solutionsLead: "Slab crews work with ready-mix from our plants and pumps from our fleet, so placement, finishing and testing are coordinated on one programme.",
    solutions: [
      {
        title: "Ground-bearing floors",
        text: "Warehouse, factory and depot floors, placed in planned bays and power-floated for racking and forklift traffic.",
        image: "/Image/bce/photos/mixer-pour.webp",
        alt: "Ground-bearing floor slab placed with mixer trucks and a pump",
      },
      {
        title: "Suspended slabs",
        text: "Structural slabs for upper floors, pumped by our own fleet and finished to the engineer's specification.",
        image: "/Image/bce/photos/slab-pour.webp",
        alt: "Reinforced concrete placed into suspended slab formwork",
      },
      {
        title: "Yards and hardstands",
        text: "External slabs, yards and hardstands, detailed for drainage, joints and the loads they will carry.",
        image: "/Image/bce/photos/road-crew.webp",
        alt: "External concrete slab placed and power-floated",
      },
    ],
    capacityKicker: "Pumps and plants",
    capacityTitle: "Pumps, plants and crews",
    capacityCopy: "Our slab crews place and finish with ready-mix from our batching plants and pumps from our own fleet, tested as it arrives.",
    figures: [
      { value: "08", label: "Concrete pump trucks" },
      { value: "41", label: "Mixer trucks" },
      { value: "70 m³", label: "Per hour, each plant" },
      { value: "C25–C35", label: "Slab concrete from our plants" },
    ],
    projects: ["poipet-logistics-warehouse"],
  },
  {
    slug: "equipment-rental",
    name: "Truck & Equipment Rental",
    tagline: "Fleet hire",
    heroImage: "/Image/bce/photos/mixer-pour.webp",
    heroAlt: "BCE mixer truck and pump placing concrete on site",
    intro: "Mixer trucks, pump trucks and piling rigs for hire, maintained by our own team and ready to mobilise across Cambodia with the operators who know them best.",
    valuesKicker: "Why BCE for hire",
    valuesTitle: "Equipment that arrives ready",
    values: [
      {
        title: "Maintained in-house",
        icon: "wrench",
        text: "Every truck and rig is serviced by our own workshop team, so machines arrive on site ready to work.",
      },
      {
        title: "Operators included",
        icon: "helmet",
        text: "Experienced operators and drivers come with the equipment, familiar with the machine and the site.",
      },
      {
        title: "Mobilised across Cambodia",
        icon: "pin",
        text: "Equipment is dispatched from Battambang and mobilised to projects in 13 provinces and Phnom Penh.",
      },
      {
        title: "Backed by our plants",
        icon: "plant",
        text: "Hire can be combined with ready-mix supply and pumping from the same team, under one schedule.",
      },
    ],
    solutionsKicker: "Our solutions",
    solutionsTitle: "Hire solutions",
    solutionsLead: "Our rental fleet is the same equipment we use on our own works, maintained to the same standard and available with its operators.",
    solutions: [
      {
        title: "Mixer truck hire",
        text: "41 mixer trucks on daily call-off or project terms, with drivers and GPS dispatch from our plants.",
        image: "/Image/bce/photos/concrete-discharge.webp",
        alt: "BCE mixer truck discharging concrete on site",
      },
      {
        title: "Pump truck hire",
        text: "Eight concrete pump trucks with experienced operators for high-reach and restricted-access pours.",
        image: "/Image/bce/photos/boom-pump.webp",
        alt: "BCE boom pump truck mobilised for a pour",
      },
      {
        title: "Piling rig hire",
        text: "Piling rigs and crews available for foundation works, backed by our own maintenance team.",
        image: "/Image/bce/photos/piling-rig.webp",
        alt: "BCE piling rig and crew on a foundation site",
      },
    ],
    capacityKicker: "Fleet and coverage",
    capacityTitle: "Our fleet, ready to mobilise",
    capacityCopy: "Trucks, pumps and rigs are maintained by our own team and dispatched from Battambang, with operators available for every machine.",
    figures: [
      { value: "41", label: "Mixer trucks for hire" },
      { value: "08", label: "Pump trucks for hire" },
      { value: "07", label: "Piling rigs for hire" },
      { value: "13+", label: "Provinces and Phnom Penh" },
    ],
    projects: ["sihanoukville-fleet-hire"],
  },
];

export const findBusinessDetail = (slug: string) => businessDetails.find((b) => b.slug === slug);
export const businessDetailHref = (slug: string) => `/?business=${slug}`;
