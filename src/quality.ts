/**
 * Quality, capability & HSE content.
 *
 * Every headline, paragraph, certificate row, concrete grade, fleet figure and
 * photo on `/quality` lives here. The bundled defaults render first; Cloudflare
 * D1 then replaces them at runtime through `contentStore`, so the admin console
 * edits the live page without a deploy.
 *
 * The retired Technical Capabilities page merged into this one, so its quality
 * process, laboratory tests and material certificates are not duplicated: the
 * laboratory's test list lives under `laboratory.tests`.
 *
 * The HSE commitments are held here rather than read from `company.ts`, so the
 * Quality page can be edited without changing the homepage's copy of the same
 * five commitments.
 */

import { mergeDefaults, registerContentType } from "./contentStore";

export type QualityContent = {
  cover: {
    label: string;
    title: string;
    image: string;
    imageAlt: string;
  };
  intro: {
    label: string;
    text: string;
  };
  laboratory: {
    title: string;
    copy: string;
    listLabel: string;
    steps: { title: string; text: string }[];
    /** What the laboratory tests, as labelled figures under the process. */
    tests: { label: string; value: string }[];
    image: string;
    imageAlt: string;
  };
  materials: {
    title: string;
    copy: string;
    listLabel: string;
    items: { name: string; certificate: string }[];
    image: string;
    imageAlt: string;
  };
  calibration: {
    title: string;
    copy: string;
    listLabel: string;
    items: { equipment: string; scope: string }[];
  };
  hse: {
    label: string;
    heading: string;
    items: { lines: string[]; text: string; image: string; imageAlt: string }[];
  };
  hsePractice: {
    label: string;
    title: string;
    copy: string;
    standards: { method: string; use: string }[];
    ppe: string[];
    inspections: string[];
  };
  engineering: {
    kicker: string;
    title: string;
    image: string;
    imageAlt: string;
    copy: string[];
    rows: { label: string; value: string }[];
  };
  fleet: {
    kicker: string;
    title: string;
    image: string;
    imageAlt: string;
    copy: string[];
    /** Dispatch note set under the introduction (where the fleet is mobilised from). */
    note: string;
    /** The dark key-figures band. */
    figuresLabel: string;
    figuresTitle: string;
    figuresCopy: string;
    /** The full inventory as published by the Corporate Profile. */
    inventoryLabel: string;
    inventoryTitle: string;
    inventoryCopy: string;
    inventoryListLabel: string;
    /** The large photo beside the machine cards. */
    plantImage: string;
    plantImageAlt: string;
    /** The machines themselves, one card each. */
    machinesLabel: string;
    machinesTitle: string;
    machinesCopy: string;
    machines: { title: string; icon: string; bullets: string[]; image: string; imageAlt: string; href?: string }[];
    rows: { label: string; value: string }[];
    ctaLabel: string;
    ctaHref: string;
  };
  documents: {
    label: string;
    title: string;
    text: string;
    items: {
      title: string;
      subtitle: string;
      status: string;
      date: string;
      size: string;
      file: string;
    }[];
    gradesText: string;
    grades: { grade: string; strength: string; use: string }[];
    note: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

export const DEFAULT_QUALITY: QualityContent = {
  cover: {
    label: "Quality, capability & HSE",
    title: "Tested at every stage, built safely",
    image: "/Image/bce/photos/road-crew.webp",
    imageAlt: "BCE site crew in protective equipment placing and finishing concrete",
  },
  intro: {
    label: "Our approach",
    text: "Behind every BCE project is the capability to test, design and deliver concrete in-house: a quality process on every pour, our own laboratory, approved mix designs, certified materials, a fleet we own and maintain, and the engineers who bring it together.",
  },
  laboratory: {
    title: "Laboratory & quality assurance",
    copy: "Strict quality control at every stage, with slump, strength and material testing at the plant and on site. Our own laboratory checks the materials that go into our concrete, the concrete as it leaves the plant and the strength it reaches once cured.",
    listLabel: "Our quality process",
    steps: [
      { title: "Material check", text: "Every material checked before production." },
      { title: "Batching", text: "Weighed and mixed to the approved design." },
      { title: "Slump test", text: "Tested on delivery, before placing." },
      { title: "Strength test", text: "Samples cured and tested in our lab." },
      { title: "Verification", text: "Results checked and recorded." },
    ],
    tests: [
      { label: "Slump testing", value: "Every delivery" },
      { label: "Compressive strength", value: "7- and 28-day cubes" },
      { label: "Aggregate grading", value: "Sieve analysis" },
      { label: "Silt and moisture content", value: "Fine and coarse aggregate" },
      { label: "Trial mixes", value: "For every new design" },
    ],
    image: "/Image/bce/cert_mix_design.webp",
    imageAlt: "Concrete test specimens side by side",
  },
  materials: {
    title: "Raw material certificates",
    copy: "Every material is certified at source and checked again before production, with certificates on file for each batch.",
    listLabel: "Certified materials",
    items: [
      { name: "Cement", certificate: "Mill test certificate" },
      { name: "Sand", certificate: "Grading and silt tests" },
      { name: "Coarse aggregate", certificate: "Grading and crushing value" },
      { name: "Admixtures", certificate: "Compliance certificate" },
      { name: "Water", certificate: "Water quality tests" },
      { name: "Steel", certificate: "Mill certificates" },
    ],
    image: "/Image/bce/project_page_14.webp",
    imageAlt: "Concrete specimens and raw materials",
  },
  calibration: {
    title: "Calibration certificates",
    copy: "The scales, meters and testing machines behind every result are calibrated on schedule, with certificates on file.",
    listLabel: "Calibrated equipment",
    items: [
      { equipment: "Batching plant weigh scales", scope: "Cement, aggregate, water and admixture scales" },
      { equipment: "Compression testing machine", scope: "Load calibration for cube and cylinder testing" },
      { equipment: "Admixture dispensers", scope: "Dosing accuracy" },
      { equipment: "Water meters", scope: "Flow accuracy at the batching plants" },
      { equipment: "Laboratory equipment", scope: "Balances, slump cones and cube moulds" },
    ],
  },
  hse: {
    label: "HSE commitment",
    heading: "HSE commitment: protecting people, working safely, respecting the environment",
    items: [
      {
        lines: ["Protecting", "people"],
        text: "We protect our people, our partners and the communities around every project we undertake.",
        image: "/Image/bce/hse_safety.webp",
        imageAlt: "BCE safety standards and protective equipment on site",
      },
      {
        lines: ["Working", "safely"],
        text: "Safe operations and a well-maintained fleet, run by a skilled and experienced team.",
        image: "/Image/bce/core_services.webp",
        imageAlt: "A site worker in an orange hard hat supervising pour",
      },
      {
        lines: ["Respecting", "the environment"],
        text: "We build today while protecting resources for future generations, through environmental responsibility and resource efficiency.",
        image: "/Image/bce/project_page_16.webp",
        imageAlt: "Environmental protection and clean site practices",
      },
      {
        lines: ["Delivering", "quality"],
        text: "Built to last. From certified batching to precision placement, laboratory quality control ensures every structure remains strong, durable and enduring.",
        image: "/Image/bce/cert_mix_design.webp",
        imageAlt: "A calibrated pressure gauge and quality testing",
      },
      {
        lines: ["Building", "trust"],
        text: "Stronger together. We grow alongside our clients, partners and suppliers through long-term relationships built on trust, respect and mutual success.",
        image: "/Image/bce/project_page_17.webp",
        imageAlt: "Construction engineering team collaborating on site",
      },
    ],
  },
  hsePractice: {
    label: "HSE in practice",
    title: "Standards, PPE and inspections",
    copy: "Safety and quality on a BCE site are routines, not posters: the methods our laboratory tests to, the equipment every crew wears, and the checks that run before and during every shift.",
    standards: [
      { method: "ASTM C143", use: "Slump of hydraulic-cement concrete, tested on delivery" },
      { method: "ASTM C31 / C39", use: "Making, curing and compressive testing of specimens" },
      { method: "ACI 211.1", use: "Proportioning normal, heavyweight and mass concrete" },
      { method: "BS EN 206", use: "Specification, performance, production and conformity" },
      { method: "BS EN 12390", use: "Testing hardened concrete" },
      { method: "ISO 9001 principles", use: "Documented procedures, records and corrective action" },
    ],
    ppe: [
      "Hard hat and high-visibility vest on every site, without exception",
      "Safety boots, eye protection and gloves for handling and placing",
      "Fall protection and harnesses for work at height and on rigs",
      "Hearing and dust protection around batching, cutting and coring",
      "Life jackets and edge control for works over water",
    ],
    inspections: [
      "Daily pre-start checks on plant, mixers, pumps and rigs, recorded before work begins",
      "Lifting gear, rigging and scaffolding inspected and tagged on schedule",
      "Pump lines, booms and outriggers checked at every setup",
      "Toolbox talks before each pour and each shift change",
      "Incidents and near misses reported, investigated and closed out",
    ],
  },
  engineering: {
    kicker: "People behind every project",
    title: "Engineering capability",
    image: "/Image/bce/stats_fleet.webp",
    imageAlt: "An engineer inspecting reinforcement on site",
    copy: [
      "Our engineers plan, design and supervise every project, from mix design and piling programmes to site supervision and handover records.",
    ],
    rows: [
      { label: "Engineers", value: "15" },
      { label: "Team", value: "71" },
      { label: "Building since", value: "1995" },
      { label: "Coverage", value: "13 provinces + Phnom Penh" },
    ],
  },
  // The fleet inventory from the Corporate Profile. `rows` feeds the Quality & HSE panel and the ink inventory band;
  // `machines` follows the Corporate Profile's equipment page, with the laboratory equipment as a card that links back
  // to the Quality page. Counts are machines, not staff.
  fleet: {
    kicker: "Our own fleet",
    title: "Equipment & fleet",
    image: "/Image/bce/about-zoom-boom-pumps.webp",
    imageAlt: "BCE pump trucks and mixer trucks placing concrete on site",
    copy: [
      "Our plants and fleet are owned, operated and maintained by our own team, so capacity is planned around your programme rather than a supplier's.",
    ],
    note: "Equipment is dispatched from Battambang and mobilised to projects across 13 provinces and Phnom Penh. Hire is quoted per project: machine, duration, site access and whether an operator is included.",
    figuresLabel: "Fleet at a glance",
    figuresTitle: "Capacity you can plan around.",
    figuresCopy:
      "Plants, trucks and rigs are ours, serviced by our own workshop and dispatched from one base. These are machines in service, not a broker's availability list.",
    inventoryLabel: "Inventory",
    inventoryTitle: "What we own, in numbers.",
    inventoryCopy:
      "Counts are from BCE's own fleet records. Laboratory equipment is shown with the plant below; its testing programme lives on the Quality page.",
    inventoryListLabel: "Machines in service",
    plantImage: "/Image/bce/about-zoom-batching.webp",
    plantImageAlt: "Aerial view of BCE's batching plant, silos and aggregate yard",
    machinesLabel: "Plant & machines",
    machinesTitle: "Plant and machines, maintained in-house.",
    machinesCopy:
      "Every machine below is part of the fleet we use on our own works, maintained to the same standard and available with its operators.",
    machines: [
      {
        title: "Batching plant",
        icon: "plant",
        bullets: [
          "4 batching plants",
          "Capacity: 70 m³/hr per plant",
          "Advanced computerized control system",
          "Consistent, high-quality concrete",
        ],
        image: "/Image/bce/fleet/01-batching.jpg",
        imageAlt: "BCE batching plant loading a mixer truck",
      },
      {
        title: "Pump trucks",
        icon: "pump",
        bullets: [
          "8 trucks",
          "Efficient concrete placing",
          "Boom sizes for every project",
          "Well-maintained and reliable",
        ],
        image: "/Image/bce/fleet/02-pump.jpg",
        imageAlt: "BCE pump truck with its boom folded",
      },
      {
        title: "Concrete mixer trucks",
        icon: "truck",
        bullets: [
          "41 trucks",
          "7–10 m³ capacity",
          "Timely delivery",
          "GPS tracking for dispatch",
        ],
        image: "/Image/bce/fleet/03-mixer.jpg",
        imageAlt: "BCE concrete mixer trucks lined up at the plant",
      },
      {
        title: "Wheel loaders",
        icon: "loader",
        bullets: [
          "7 units",
          "Multiple bucket capacities",
          "High productivity",
          "Ideal for loading and material handling",
          "Operator-friendly",
        ],
        image: "/Image/bce/fleet/04-loader.jpg",
        imageAlt: "Wheel loader working at a BCE batching plant",
      },
      {
        title: "Piling rigs",
        icon: "rig",
        bullets: [
          "7 units",
          "Hydraulic piling rigs",
          "Strong and stable performance",
          "For varied soil conditions",
          "Efficient piling operations",
        ],
        image: "/Image/bce/fleet/05-piling.jpg",
        imageAlt: "BCE piling rig working on a foundation site",
      },
      {
        title: "Crane trucks",
        icon: "crane",
        bullets: [
          "6 trucks",
          "Various lifting capacities",
          "Telescopic boom",
          "Safe, efficient lifting",
          "Skilled operators",
        ],
        image: "/Image/bce/fleet/06-crane-truck.jpg",
        imageAlt: "Crane truck lifting on a BCE site",
      },
      {
        title: "Tower cranes",
        icon: "tower",
        bullets: [
          "8 units",
          "High lifting capacity",
          "Wide working radius",
          "Stable and reliable",
          "Ideal for high-rise construction",
        ],
        image: "/Image/bce/fleet/07-tower-crane.jpg",
        imageAlt: "Tower cranes on a BCE high-rise project",
      },
      {
        title: "Laboratory equipment",
        icon: "lab",
        bullets: [
          "Concrete testing machines",
          "Compression, slump and strength tests",
          "Calibrated and certified",
          "Quality standards verified",
        ],
        image: "/Image/bce/fleet/08-lab.jpg",
        imageAlt: "BCE laboratory technician testing concrete",
        href: "/quality#laboratory",
      },
      {
        title: "Lifts",
        icon: "lift",
        bullets: [
          "5 units",
          "Safe elevation for work at height",
          "Ideal for construction works",
          "Regular inspection and maintenance",
        ],
        image: "/Image/bce/fleet/09-lift.jpg",
        imageAlt: "Lift equipment on a BCE construction site",
      },
    ],
    rows: [
      { label: "Batching plants", value: "04  /  70 m³/hr each" },
      { label: "Mixer trucks", value: "41" },
      { label: "Pump trucks", value: "08" },
      { label: "Wheel loaders", value: "07" },
      { label: "Piling rigs", value: "07" },
      { label: "Crane trucks", value: "06" },
      { label: "Tower cranes", value: "08" },
      { label: "Lifts", value: "05" },
    ],
    ctaLabel: "Hire our equipment",
    ctaHref: "/quote?service=equipment-rental",
  },
  documents: {
    label: "Quality documents",
    title: "Mix designs & certification",
    text: "The mix designs behind every grade, and the licences, certificates and company profile that procurement and tender teams ask for.",
    items: [
      {
        title: "Company profile",
        subtitle: "BCE Corporate Profile 2026",
        status: "",
        date: "2026",
        size: "8.4 MB",
        file: "/assets/BCE_Corporate_Profile_2026_web.pdf",
      },
      {
        title: "Mix design documents",
        subtitle: "Supplied with every mix design",
        status: "On request",
        date: "",
        size: "",
        file: "",
      },
      {
        title: "Business licence & registration",
        subtitle: "Ministry of Commerce",
        status: "On request",
        date: "",
        size: "",
        file: "",
      },
      {
        title: "Construction licence",
        subtitle: "Ministry of Land Management, Urban Planning and Construction",
        status: "On request",
        date: "",
        size: "",
        file: "",
      },
      {
        title: "Tax registration (VAT) certificate",
        subtitle: "General Department of Taxation",
        status: "On request",
        date: "",
        size: "",
        file: "",
      },
    ],
    gradesText: "From blinding and mass fill to bridges and heavy structures, every grade is designed, trial-mixed and tested in our own laboratory before it reaches site.",
    grades: [
      { grade: "C15", strength: "15 MPa", use: "Blinding and mass fill" },
      { grade: "C20", strength: "20 MPa", use: "Ground slabs and paths" },
      { grade: "C25", strength: "25 MPa", use: "Floor slabs and footings" },
      { grade: "C30", strength: "30 MPa", use: "Columns, beams and suspended slabs" },
      { grade: "C35", strength: "35 MPa", use: "Foundations and piles" },
      { grade: "C40", strength: "40 MPa", use: "Bridges and heavy structures" },
    ],
    note: "Characteristic cube strength at 28 days. Other grades and special mixes designed on request.",
    ctaLabel: "Request documents",
    ctaHref: "#contact",
  },
};

/** Live content. Read these values during render; the object is replaced on bootstrap. */
export const quality: QualityContent = JSON.parse(JSON.stringify(DEFAULT_QUALITY)) as QualityContent;

registerContentType("quality", (items) => {
  const first = items[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) return;
  const merged = mergeDefaults(DEFAULT_QUALITY, first);
  for (const item of merged.documents.items) {
    if (item.file === "/assets/BCE_Corporate_Profile_2026.pdf") {
      item.file = "/assets/BCE_Corporate_Profile_2026_web.pdf";
      item.size = "8.4 MB";
    }
  }
  Object.assign(quality, merged);
});
