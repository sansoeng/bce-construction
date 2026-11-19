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
    /** The jobs the fleet supports, not a second inventory. */
    jobsLabel: string;
    jobsTitle: string;
    jobsCopy: string;
    jobs: { title: string; text: string; icon: string; bullets: string[]; image: string; imageAlt: string }[];
    /** Workshop, operators and dispatch. */
    maintenanceLabel: string;
    maintenanceTitle: string;
    maintenance: { icon: string; title: string; text: string }[];
    rows: { label: string; value: string; note: string }[];
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
    copy: "Safety and quality here are routines, not posters: what we test to, what every crew wears, what we check each shift.",
    standards: [
      { method: "ASTM C143", use: "Slump on every delivery" },
      { method: "ASTM C31 / C39", use: "Specimens made, cured, crushed" },
      { method: "BS EN 206", use: "Specification and conformity" },
      { method: "ISO 9001", use: "Procedures and records" },
    ],
    ppe: [
      "Hard hat and high-vis, every site",
      "Boots, eye protection and gloves",
      "Harness for work at height",
      "Dust and hearing protection",
      "Life jackets over water",
    ],
    inspections: [
      "Pre-start checks, recorded daily",
      "Lifting gear and rigging, tagged",
      "Pump lines and outriggers, every setup",
      "Toolbox talks before each pour",
      "Incidents and near misses, closed out",
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
  // The fleet inventory from the Corporate Profile. `rows` feeds the key-figures grid; `jobs` turns the equipment page
  // into four kinds of work rather than a second inventory, and `maintenance`/`mobilisation` carry the workshop,
  // operators, dispatch and hire. Counts are machines, not staff.
  fleet: {
    kicker: "Our own fleet",
    title: "Equipment & fleet",
    image: "/Image/bce/about-zoom-boom-pumps.webp",
    imageAlt: "BCE pump trucks and mixer trucks placing concrete on site",
    copy: [
      "Our plants and fleet are owned, operated and maintained by our own team, so capacity is planned around your programme rather than a supplier's.",
    ],
    note: "Equipment is dispatched from Battambang and mobilised to projects across 13 provinces and Phnom Penh. Hire is quoted per project: machine, duration, site access and whether an operator is included.",
    figuresLabel: "What we own, in numbers.",
    figuresTitle: "Capacity you can plan around.",
    jobsLabel: "Fleet by job",
    jobsTitle: "One fleet, four ways to build.",
    jobsCopy:
      "The same owned fleet carries BCE's concrete, piling, lifting and site-support work. Counts are above; here is what each group is for.",
    jobs: [
      {
        title: "Concrete production & delivery",
        text: "Ready-mix from our own batching plants, tested before it leaves and delivered by our own mixer fleet.",
        icon: "plant",
        bullets: [
          "Ready-mix from our own batching plants",
          "Mixer trucks on a planned dispatch",
          "Laboratory-tested on every pour",
          "Delivery across 13 provinces + Phnom Penh",
        ],
        image: "/Image/bce/fleet/03-mixer.jpg",
        imageAlt: "BCE concrete mixer truck at the plant",
      },
      {
        title: "Concrete placing",
        text: "Boom pumps and operators place concrete where mixers cannot reach, working to the pour sequence.",
        icon: "pump",
        bullets: [
          "Boom pumps for high-reach pours",
          "Placement where mixers cannot reach",
          "Operators work to the pour sequence",
          "Pump lines checked at every setup",
        ],
        image: "/Image/bce/fleet/02-pump.jpg",
        imageAlt: "BCE pump truck with its boom folded",
      },
      {
        title: "Foundations",
        text: "Reinforced concrete piles installed and tested by our own rigs and crews, from platform to pile cap.",
        icon: "rig",
        bullets: [
          "Reinforced concrete piles",
          "Bridge, road and building foundations",
          "Own rigs and installation crews",
          "Pile records handed over",
        ],
        image: "/Image/bce/fleet/05-piling.jpg",
        imageAlt: "BCE piling rig working on a foundation site",
      },
      {
        title: "Lifting & site support",
        text: "Crane trucks, tower cranes, lifts and wheel loaders keep the site moving, with operators and inspection records.",
        icon: "crane",
        bullets: [
          "Crane trucks and tower cranes",
          "Wheel loaders for material handling",
          "Lifts for work at height",
          "Operators and inspection records",
        ],
        image: "/Image/bce/fleet/06-crane-truck.jpg",
        imageAlt: "Crane truck lifting on a BCE site",
      },
    ],
    maintenanceLabel: "Maintenance & operators",
    maintenanceTitle: "Ready when it reaches site.",
    maintenance: [
      {
        icon: "wrench",
        title: "Serviced in our workshop",
        text: "Trucks, pumps and rigs are maintained by our own team between projects, not sent to a third-party yard.",
      },
      {
        icon: "helmet",
        title: "Operators included",
        text: "Experienced drivers and operators come with the machine and work to your pour or piling sequence.",
      },
      {
        icon: "shield",
        title: "Checked before dispatch",
        text: "Pre-start checks, lifting gear and pump lines are inspected and recorded before the machine leaves.",
      },
      {
        icon: "pin",
        title: "Mobilised from Battambang",
        text: "Equipment is dispatched from our base to 13 provinces and Phnom Penh, with mobilisation quoted per project.",
      },
    ],
    rows: [
      { label: "Batching plants", value: "04  /  70 m³/hr each", note: "70 m³/hr each" },
      { label: "Mixer trucks", value: "41", note: "13 provinces + Phnom Penh" },
      { label: "Pump trucks", value: "08", note: "Placing and boom pumps" },
      { label: "Wheel loaders", value: "07", note: "Loading and material handling" },
      { label: "Piling rigs", value: "07", note: "Bore and hammer rigs" },
      { label: "Crane trucks", value: "06", note: "Lifting on site" },
      { label: "Tower cranes", value: "08", note: "High-rise construction" },
      { label: "Lifts", value: "05", note: "Work at height" },
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
