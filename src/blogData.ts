import { registerContentType } from "./contentStore";


/** Journal sections, after olympic.no/journal: the two broadcast categories, with the topic carried as a tag. */
export type JournalKind = "News" | "Insight";

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  /** Optional so older admin documents keep working; `journalKind` derives it from the topic when absent. */
  kind?: JournalKind;
  /** True while the article is an illustrative draft awaiting BCE technical review. */
  sample?: boolean;
  year: string;
  date: string;
  readTime: string;
  image: string;
  alt: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      callout?: string;
    }[];
    takeaways?: string[];
  };
  author: {
    name: string;
    role: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "aci-211-high-strength-mix-designs",
    sample: true,
    title: "High-Strength Mix Design for Heavy Industrial Pours in Battambang",
    category: "Concrete Technology",
    kind: "Insight",
    year: "2026",
    date: "15 April 2026",
    readTime: "5 min read",
    image: "/Image/bce/laboratory_qa.webp",
    alt: "BCE laboratory technician testing a concrete sample",
    excerpt:
      "A deep dive into how BCE engineers formulate compressive strengths from C20 to C40, balancing water-cement ratios and mineral admixtures for high-load industrial floors.",
    content: {
      intro:
        "Modern industrial facilities and heavy logistics warehouses demand concrete floors that resist extreme wheel point loads, chemical exposure, and thermal cracking. At Battambang Construction and Engineering (BCE), our mix formulation follows a documented proportioning method, customized for local sand, coarse aggregates, and ambient tropical curing conditions.",
      sections: [
        {
          heading: "Precision Water-Cement Ratios & Superplasticizer Integration",
          body: [
            "Achieving compressive strength exceeding 40 MPa without causing brittle shrinkage cracks requires meticulous control of the water-cementitious ratio (w/c ≤ 0.38). In our computerized batching plants, moisture probes continuously measure the surface water on coarse and fine aggregates in real-time, instantly adjusting the batched mixing water.",
            "Polycarboxylate ether (PCE) superplasticizers are automatically dosed to maintain a fluid slump of 160–180 mm for pumping without sacrificing the dense crystalline microstructure necessary for high early strength.",
          ],
          callout:
            "Moisture sensors in all 4 BCE batching plants calibrate aggregate moisture every 30 seconds to maintain exact design water-cement ratios.",
        },
        {
          heading: "Aggregate Gradation & Strength Verification",
          body: [
            "We utilize crushed basalt aggregate graded strictly between 10mm and 20mm with less than 1% clay loam content. Combined with river sand having a fineness modulus of 2.6 to 2.8, the resulting concrete matrix achieves minimum void space and optimal particle packing.",
            "Standard 150mm test cylinders cast from each dispatch batch are submerged in saturated lime water curing tanks and broken at 7 and 28 days using our digital compression testing machine to guarantee design compliance.",
          ],
        },
      ],
      takeaways: [
        "The approved design is checked for workability and strength before it is used on site.",
        "Computerized batching eliminates manual measurement variations across large continuous pours.",
        "Full third-party and in-house laboratory test certificates accompany every commercial dispatch.",
      ],
    },
    author: {
      name: "Eng. Sokhom Seng",
      role: "Lead Materials & Batching Engineer, BCE",
    },
  },
  {
    slug: "hydraulic-static-piling-soft-alluvial-soil",
    sample: true,
    title: "Precision Piling in Soft Alluvial Soil Formations",
    category: "Foundation Piling",
    kind: "Insight",
    year: "2026",
    date: "28 March 2026",
    readTime: "6 min read",
    image: "/Image/bce/about-zoom-piling-rig.webp",
    alt: "BCE piling rig working on a foundation site",
    excerpt:
      "How low-vibration piling methods reduce risk to adjacent structures in soft alluvial ground.",
    content: {
      intro:
        "Foundations built along the Sangkae River basin encounter deep alluvial silt layers with low shear resistance. Traditional diesel hammer pile driving generates ground shockwaves that threaten adjacent historical shophouses and residential buildings. BCE’s piling rigs provide a controlled, low-vibration solution suited to sites where ground movement must be limited.",
      sections: [
        {
          heading: "Vibration-Free Jacking Mechanics",
          body: [
            "The hydraulic static pressing machine grips precast reinforced concrete square piles (from 250x250mm to 400x400mm) using high-pressure clamping jaws. Dual main hydraulic cylinders apply continuous downward thrust, smoothly pushing the pile into the subsoil without dynamic percussion.",
            "Because the method develops pile capacity without heavy impact, it can be used where vibration and noise need to be controlled near existing structures.",
          ],
          callout:
            "Static pressing reduces noise levels below 65 dB and eliminates ground vibrations, enabling 24/7 urban operations without municipal disruption.",
        },
        {
          heading: "Real-Time Digital Load-Settlement Gauging",
          body: [
            "Every stroke of the hydraulic press is monitored via digital pressure transducers calibrated directly to ultimate pressing tonnage. Engineers log the exact terminal refusal load for every single pile, providing instant verification of foundation bearing capacity before casting the pile cap.",
          ],
        },
      ],
      takeaways: [
        "Zero shockwaves protect neighboring foundations and underground utility lines.",
        "Continuous digital load monitoring replaces uncertain hammer blow count estimates.",
        "Enables faster installation of multi-section welded driven piles up to 28 meters depth.",
      ],
    },
    author: {
      name: "Eng. Chanthy Rath",
      role: "Chief Geotechnical & Piling Engineer, BCE",
    },
  },
  {
    slug: "dye-2000-compressive-strength-testing",
    sample: true,
    title: "Compressive Testing: How BCE Validates 28-Day Strength Across 4 Batching Plants",
    category: "Quality & Lab",
    kind: "Insight",
    year: "2026",
    date: "12 March 2026",
    readTime: "4 min read",
    image: "/Image/bce/about-hse-banner.webp",
    alt: "Concrete cylinder under compression testing in the BCE laboratory",
    excerpt:
      "Inside BCE’s in-house testing laboratory: our systematic protocol for casting standard test cylinders, water tank curing, and digital breaking to documented test procedures.",
    content: {
      intro:
        "Consistent concrete quality cannot rely on visual inspection alone. BCE maintains a dedicated in-house testing laboratory in Battambang equipped with a digital compression testing machine. This facility guarantees that every cubic meter poured on our clients' sites satisfies structural engineering specifications.",
      sections: [
        {
          heading: "Sampling and test cylinder preparation",
          body: [
            "Sampling occurs directly at the discharge chute of mixer trucks on site or at the batching plant. Technicians cast standard 150mm x 300mm cylindrical specimens in three equal layers, tamping each layer with a standard tamping rod.",
            "Specimens are kept in moist ambient air for 24 hours before demolding, followed by complete immersion in temperature-controlled curing tanks at 23°C ± 2°C until test age.",
          ],
        },
        {
          heading: "Automated Digital Rupture Analysis",
          body: [
            "The testing machine applies a controlled compressive load until the cylinder fails. Microprocessor sensors record the peak fracture load, automatically calculating MPa strength and plotting failure curves to verify standard cone-and-split rupture patterns.",
          ],
          callout:
            "Formal test reports generated by our laboratory provide clients, consulting engineers, and financial auditors with verifiable compliance certificates.",
        },
      ],
      takeaways: [
        "In-house testing delivers preliminary 7-day strength results within hours of de-molding.",
        "Calibrated digital instrumentation removes manual reading error.",
        "Documented sampling, curing and strength testing.",
      ],
    },
    author: {
      name: "Vannak Meas",
      role: "Senior Laboratory Quality Inspector, BCE",
    },
  },
  {
    slug: "bce-fleet-expansion-41-mixers-8-pumps",
    sample: true,
    title: "Fleet Capability: 8 Pump Trucks and 41 Mixer Trucks Across Cambodia",
    category: "Fleet & Equipment",
    kind: "Insight",
    year: "2025",
    date: "18 November 2025",
    readTime: "4 min read",
    image: "/Image/bce/machinery_fleet.webp",
    alt: "BCE mixer trucks and pump trucks at a batching plant",
    excerpt:
      "How BCE plans production, dispatch and maintenance around one owned fleet of batching plants, mixer trucks and concrete pumps.",
    content: {
      intro:
        "A continuous pour depends on production and delivery being planned together. BCE runs its own batching plants, 41 mixer trucks and 8 pump trucks, so plant output, truck cycles and the placing programme are managed by one team rather than assembled from subcontractors.",
      sections: [
        {
          heading: "Planning the pour sequence",
          body: [
            "Deliveries are sequenced around the contractor's pour programme and the placing crew's position on site. The aim is a steady supply that keeps the pour moving without trucks waiting or cold joints forming.",
            "For larger pours, production is planned across plants and trucks in advance, with the site team confirming access, discharge points and the order in which each section will be placed.",
          ],
        },
        {
          heading: "Pump reach and site access",
          body: [
            "Boom and line pumps are selected for the placing point, site access and outrigger space. Pump requirements are confirmed during quotation so the right unit is mobilised rather than substituted on the day.",
            "Where a mixer cannot reach the pour, concrete is pumped through a planned pipeline route agreed with the site team before delivery begins.",
          ],
        },
        {
          heading: "Maintenance between pours",
          body: [
            "Mixer trucks and pumps are maintained by BCE's own team. Checks are carried out between pours, with planned servicing scheduled around the delivery programme so maintenance does not interrupt a committed pour.",
          ],
        },
      ],
      takeaways: [
        "41 mixer trucks and 8 pump trucks in BCE's own fleet.",
        "Production and delivery planned together from four batching plants.",
        "Pump type and site access confirmed at quotation.",
      ],
    },
    author: {
      name: "BCE Fleet & Dispatch Team",
      role: "Fleet operations, BCE",
    },
  },
  {
    slug: "hot-weather-concreting-ice-batching",
    sample: true,
    title: "Hot-Weather Concreting in Cambodia: Batching, Retarders and Curing",
    category: "Concrete Technology",
    kind: "Insight",
    year: "2025",
    date: "24 August 2025",
    readTime: "5 min read",
    image: "/Image/bce/hero_batching_plant.webp",
    alt: "BCE batching plant and aggregate yard",
    excerpt:
      "When temperatures exceed 36°C, hydration accelerates rapidly. Learn how BCE maintains fresh concrete temperatures below 32°C using flaked ice batching and extended set retarders.",
    content: {
      intro:
        "During Cambodia’s dry season, daytime ambient temperatures regularly rise above 35°C to 38°C. Without specialized thermal management, high temperatures accelerate cement hydration, increase water demand, reduce 28-day ultimate strength, and trigger rapid plastic shrinkage cracking.",
      sections: [
        {
          heading: "Chilled Water & Flaked Ice Substitution",
          body: [
            "At our central batching plants, mixing water is pre-chilled through industrial water chilling units. On critical heavy structural pours, up to 60% of the batching water is substituted with flaked ice directly in the twin-shaft mixer.",
            "Because the latent heat of fusion of melting ice absorbs 334 J/g of heat, the fresh concrete discharge temperature is kept within the specified limit on site arrival.",
          ],
        },
        {
          heading: "Extended Hydration Retarders",
          body: [
            "Water-reducing and retarding admixtures are dosed to extend setting time when a longer haul or a hot day requires it. This prevents flash setting during traffic transit and ensures complete consolidation around dense rebar cages.",
          ],
        },
      ],
      takeaways: [
        "Ice batching keeps fresh concrete under 32°C to prevent thermal micro-cracking.",
        "Set retarders provide working time for extensive slab finishing and laser screeding.",
        "Night pouring schedules deployed for large continuous industrial floor slabs.",
      ],
    },
    author: {
      name: "Eng. Sokhom Seng",
      role: "Lead Materials & Batching Engineer, BCE",
    },
  },
  {
    slug: "one-million-safe-man-hours-milestone",
    sample: true,
    title: "Safety-First Infrastructure: How BCE Approaches Man-Hours on Complex Sites",
    category: "Site Quality & HSE",
    kind: "Insight",
    year: "2025",
    date: "10 June 2025",
    readTime: "4 min read",
    image: "/Image/bce/hse_safety.webp",
    alt: "BCE site crew in protective equipment",
    excerpt:
      "How BCE's HSE management system works on site: shift briefings, equipment checks and clear responsibilities around every pour.",
    content: {
      intro:
        "Heavy construction puts crews around boom pump lines, rotating mixer drums, piling rigs and deep excavations. BCE's HSE management system is built around planning the work, briefing the crew and checking the equipment before each critical activity.",
      sections: [
        {
          heading: "Brief the shift, not just the job",
          body: [
            "Every shift starts with a briefing on the hazards specific to that site and pour: overhead lines, exclusion zones around rigs and pumps, access routes and the day's sequence. Responsibilities are named, not assumed.",
          ],
        },
        {
          heading: "Inspect before the pour",
          body: [
            "Pump lines, clamps, safety pins, rigging and piling rig ropes are checked before work starts. Equipment with a defect is taken out of service rather than worked around.",
          ],
        },
        {
          heading: "PPE and site rules",
          body: [
            "Helmets, steel-toed boots, high-visibility clothing and eye protection are required on BCE sites. Visitors and subcontractors follow the same rules as BCE crews.",
          ],
        },
      ],
      takeaways: [
        "Shift briefings cover the site, the pour and the day's hazards.",
        "Pumps, rigging and lifting equipment are inspected before critical work.",
        "PPE and site rules apply to BCE crews, subcontractors and visitors.",
      ],
    },
    author: {
      name: "BCE HSE Team",
      role: "Health, Safety & Environment",
    },
  },
  {
    slug: "30-years-of-bce-heritage-from-1995",
    sample: true,
    title: "The History of BCE: 30 Years from Hong Huot Ly in 1995",
    category: "Company News",
    kind: "News",
    year: "2024",
    date: "14 December 2024",
    readTime: "6 min read",
    image: "/Image/bce/about-hero-banner.webp",
    alt: "Aerial view of a BCE batching plant and aggregate yard",
    excerpt:
      "How a modest local aggregate trading business founded in 1995 transformed into Battambang Construction and Engineering Co., Ltd. (BCE).",
    content: {
      intro:
        "Three decades ago in 1995, Hong Huot Ly Co., Ltd. began operations supplying building materials and basic construction services to the recovering communities of Northwestern Cambodia. Through steady reinvestment in modern plant machinery and engineering talent, that enterprise evolved into Battambang Construction and Engineering Co., Ltd. (BCE).",
      sections: [
        {
          heading: "Building Cambodia's Resilient Foundations",
          body: [
            "Under the leadership of Chairwoman Ms. Loeung Chan, BCE modernized operations in 2015, introducing computerized batching technology to replace manual drum mixers.",
            "Today, BCE operates 4 central batching plants, 41 mixer trucks, 8 pump trucks, 7 hydraulic piling rigs, and an in-house materials testing laboratory serving 13 provinces and Phnom Penh.",
          ],
        },
        {
          heading: "A Heritage of Trust & Integrity",
          body: [
            "Over three decades, BCE has supplied concrete and construction services for residential, commercial, industrial and public projects across Cambodia.",
          ],
        },
      ],
      takeaways: [
        "Established in 1995 with over 30 years of uninterrupted operational excellence.",
        "Locally incorporated and managed in Cambodia.",
        "Committed to supporting Cambodia’s next generation of civil engineering infrastructure.",
      ],
    },
    author: {
      name: "BCE Corporate Heritage Team",
      role: "Corporate Communications, BCE",
    },
  },
  {
    slug: "concrete-slab-laser-screeding-superflat",
    sample: true,
    title: "Concrete Slab Laser Screeding: Delivering Ultra-Flat Superflat Flooring for Modern Warehouses",
    category: "Civil Construction",
    kind: "Insight",
    year: "2024",
    date: "08 September 2024",
    readTime: "5 min read",
    image: "/Image/bce/core-business-slab.webp",
    alt: "BCE crew placing and finishing a concrete slab",
    excerpt:
      "Automated laser screed technology achieves precise floor flatness (FF) and floor levelness (FL) numbers required for high-bay logistics racking and automated forklifts.",
    content: {
      intro:
        "Modern agricultural packaging centers, rice processing warehouses, and logistics hubs require ultra-flat concrete floors (FF > 45, FL > 35) to allow high-reach narrow-aisle forklifts to operate without mast tipping. BCE combines customized low-shrinkage ready-mix designs with automated laser screed finishing services.",
      sections: [
        {
          heading: "Laser-Guided Elevation Accuracy",
          body: [
            "Laser screeding uses continuous elevation signals from rotating laser transmitters set up on site, with automatic hydraulic adjustment of the screed to strike off concrete to a consistent level across the pour.",
            "Combined with steel fiber reinforcement or synthetic macro-fibers, the resulting industrial floor slabs eliminate saw-cut curling and provide decades of dust-free operational resilience.",
          ],
        },
        {
          heading: "Ride-On Power Trowel Polishing",
          body: [
            "Following laser screeding, dual-rotor ride-on power trowels perform pan floating and finish burnishing to consolidate the top 5mm wear layer, creating an impermeable, mirror-smooth concrete surface suitable for high-traffic industrial traffic.",
          ],
        },
      ],
      takeaways: [
        "Delivers high FF/FL numbers required for automated warehousing.",
        "Speeds up placement across large floor areas when the method is specified.",
        "Reduces construction joints and long-term floor maintenance costs.",
      ],
    },
    author: {
      name: "Eng. Sokhom Seng",
      role: "Lead Materials & Batching Engineer, BCE",
    },
  },
];

// Topics that read as company announcements rather than technical writing. Admin documents saved before the
// `kind` field existed still land in the right journal section.
const NEWS_TOPICS = new Set(["Company News", "Fleet & Equipment", "Site Quality & HSE"]);

export function journalKind(post: BlogPost): JournalKind {
  return post.kind ?? (NEWS_TOPICS.has(post.category) ? "News" : "Insight");
}

registerContentType("posts", (items) => {
  BLOG_POSTS.length = 0;
  BLOG_POSTS.push(...(items as BlogPost[]));
});
