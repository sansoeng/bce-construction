import { registerContentType } from "./contentStore";

// TEMPORARY IMAGERY — the journal redesign is matched to olympic.no/journal, so these are the reference site's
// photographs (copied to public/Image/journal) used to prove the layout. Swap each `image` back to a BCE photograph
// (public/Image/bce/…) before launch; nothing else in the page needs to change.
const REFERENCE = (file: string) => `/Image/journal/${file}.webp`;

const REFERENCE_IMAGES = {
  feature: REFERENCE("feature"),
  heritage: REFERENCE("heritage"),
  brand: REFERENCE("brand"),
  built: REFERENCE("built"),
  sustainable: REFERENCE("sustainable"),
  operations: REFERENCE("operations"),
  vessel: REFERENCE("vessel"),
  nextGeneration: REFERENCE("next-generation"),
};

/** Journal sections, after olympic.no/journal: the two broadcast categories, with the topic carried as a tag. */
export type JournalKind = "News" | "Insight";

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  /** Optional so older admin documents keep working; `journalKind` derives it from the topic when absent. */
  kind?: JournalKind;
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
    title: "ACI 211.1 High-Strength Mix Design for Heavy Industrial Pours in Battambang",
    category: "Concrete Technology",
    kind: "Insight",
    year: "2026",
    date: "15 April 2026",
    readTime: "5 min read",
    image: REFERENCE_IMAGES.feature,
    alt: "Computerized concrete batching plant and ready-mix production",
    excerpt:
      "A deep dive into how BCE engineers formulate compressive strengths from 20 to 50 MPa, balancing water-cement ratios and mineral admixtures for high-load industrial floors.",
    content: {
      intro:
        "Modern industrial facilities and heavy logistics warehouses demand concrete floors that resist extreme wheel point loads, chemical exposure, and thermal cracking. At Battambang Construction and Engineering (BCE), our mix formulation follows rigorous American Concrete Institute (ACI 211.1) proportioning standards, customized for local sand, coarse aggregates, and ambient tropical curing conditions.",
      sections: [
        {
          heading: "Precision Water-Cement Ratios & Superplasticizer Integration",
          body: [
            "Achieving compressive strength exceeding 40 MPa without causing brittle shrinkage cracks requires meticulous control of the water-cementitious ratio (w/c ≤ 0.38). In our computerized Sicoma batching plants, moisture probes continuously measure the surface water on coarse and fine aggregates in real-time, instantly adjusting the batched mixing water.",
            "Polycarboxylate ether (PCE) superplasticizers are automatically dosed to maintain a fluid slump of 160–180 mm for pumping without sacrificing the dense crystalline microstructure necessary for high early strength.",
          ],
          callout:
            "Moisture sensors in all 4 BCE batching plants calibrate aggregate moisture every 30 seconds to maintain exact design water-cement ratios.",
        },
        {
          heading: "Aggregate Gradation & Strength Verification",
          body: [
            "We utilize crushed basalt aggregate graded strictly between 10mm and 20mm with less than 1% clay loam content. Combined with river sand having a fineness modulus of 2.6 to 2.8, the resulting concrete matrix achieves minimum void space and optimal particle packing.",
            "Standard 150mm test cylinders cast from each dispatch batch are submerged in saturated lime water curing tanks and broken at 7 and 28 days using our digital DYE-2000 compression testing machine to guarantee design compliance.",
          ],
        },
      ],
      takeaways: [
        "Strict adherence to ACI 211.1 ensures predictable slump and compressive strength up to 50 MPa.",
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
    title: "Precision Piling: Hydraulic Static Pressing in Soft Alluvial Soil Formations",
    category: "Foundation Piling",
    kind: "Insight",
    year: "2026",
    date: "28 March 2026",
    readTime: "6 min read",
    image: REFERENCE_IMAGES.heritage,
    alt: "Hydraulic static pile press rig on commercial construction site",
    excerpt:
      "Why hydraulic static pile pressing eliminates vibration hazards for adjacent urban structures while achieving 120-tonne bearing capacities in Battambang river basin clays.",
    content: {
      intro:
        "Foundations built along the Sangkae River basin encounter deep alluvial silt layers with low shear resistance. Traditional diesel hammer pile driving generates ground shockwaves that threaten adjacent historical shophouses and residential buildings. BCE’s fleet of 7 hydraulic static pile pressing rigs provides a quiet, vibration-free solution capable of pressing up to 600 tonnes of static load.",
      sections: [
        {
          heading: "Vibration-Free Jacking Mechanics",
          body: [
            "The hydraulic static pressing machine grips precast reinforced concrete square piles (from 250x250mm to 400x400mm) using high-pressure clamping jaws. Dual main hydraulic cylinders apply continuous downward thrust, smoothly pushing the pile into the subsoil without dynamic percussion.",
            "Because there is zero impact force, structural pile head damage is eliminated, and nearby buildings suffer zero settlement or micro-fissuring even when working within 1.5 meters of boundary lines.",
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
    title: "DYE-2000 Compressive Testing: How BCE Validates 28-Day Strength Across 4 Batching Plants",
    category: "Quality & Lab",
    kind: "Insight",
    year: "2026",
    date: "12 March 2026",
    readTime: "4 min read",
    image: REFERENCE_IMAGES.brand,
    alt: "BCE in-house testing laboratory with DYE-2000 compression machine",
    excerpt:
      "Inside BCE’s accredited testing laboratory: our systematic protocol for casting standard test cylinders, water tank curing, and digital breaking to ASTM C39 standards.",
    content: {
      intro:
        "Consistent concrete quality cannot rely on visual inspection alone. BCE maintains an accredited, dedicated in-house testing laboratory in Battambang equipped with the DYE-2000 digital electro-hydraulic compressive testing machine. This facility guarantees that every cubic meter poured on our clients' sites satisfies structural engineering specifications.",
      sections: [
        {
          heading: "Sampling & Test Cylinder Preparation to ASTM C39",
          body: [
            "Sampling occurs directly at the discharge chute of mixer trucks on site or at the batching plant. Technicians cast standard 150mm x 300mm cylindrical specimens in three equal layers, tamping each layer 25 times with a certified hemispherical steel rod.",
            "Specimens are kept in moist ambient air for 24 hours before demolding, followed by complete immersion in temperature-controlled curing tanks at 23°C ± 2°C until test age.",
          ],
        },
        {
          heading: "Automated Digital Rupture Analysis",
          body: [
            "The DYE-2000 machine applies a continuous, shock-free compressive load at an exact rate of 0.25 MPa per second until the cylinder fails. Microprocessor sensors record the peak fracture load, automatically calculating MPa strength and plotting failure curves to verify standard cone-and-split rupture patterns.",
          ],
          callout:
            "Formal test reports generated by our laboratory provide clients, consulting engineers, and financial auditors with verifiable compliance certificates.",
        },
      ],
      takeaways: [
        "In-house testing delivers preliminary 7-day strength results within hours of de-molding.",
        "Calibrated digital instrumentation removes manual reading error.",
        "Strict adherence to ASTM C39 and Cambodian Ministry of Land Management standards.",
      ],
    },
    author: {
      name: "Vannak Meas",
      role: "Senior Laboratory Quality Inspector, BCE",
    },
  },
  {
    slug: "bce-fleet-expansion-41-mixers-8-pumps",
    title: "BCE Fleet Expansion: 8 Boom Pumps and 41 Mixer Trucks Mobilized for Highway 5 & Provincial Upgrades",
    category: "Fleet & Equipment",
    kind: "News",
    year: "2025",
    date: "18 November 2025",
    readTime: "4 min read",
    image: REFERENCE_IMAGES.built,
    alt: "Fleet of BCE concrete mixer trucks and boom pump trucks lined up",
    excerpt:
      "How strategic fleet investments allow BCE to supply over 1,500 cubic meters of ready-mix concrete in single continuous shifts for major arterial roads and bridge decks.",
    content: {
      intro:
        "Major infrastructure construction, including regional bridge piers, culvert overpasses, and National Highway 5 expansion zones, requires continuous pour logistics that cannot afford transit delays or pump downtime. In 2025, BCE expanded its dedicated mobile fleet to 41 heavy mixer trucks and 8 hydraulic boom and line pumps.",
      sections: [
        {
          heading: "Long-Reach Boom Flexibility & Fast Cycle Times",
          body: [
            "Our boom pump fleet includes long-reach 37m, 42m, and 52m boom configurations, allowing concrete discharge over difficult terrain, deep excavations, and multi-story structural decks without manual pipeline repositioning.",
            "Each mixer truck is outfitted with GPS tracking and computerized dispatch telematics, enabling our central batching dispatchers to sequence truck arrivals within 10-minute intervals to avoid cold joints.",
          ],
        },
        {
          heading: "Central Maintenance Workshops",
          body: [
            "Operating a 41-truck ready-mix fleet requires preventative mechanical upkeep. Our central mechanical workshop in Battambang conducts daily drum wash-outs, hydraulic line pressure checks, and tire integrity inspections before any morning dispatch.",
          ],
        },
      ],
      takeaways: [
        "Capacity to support 1,500+ m³ continuous monolithic foundation pours.",
        "GPS dispatch minimizes transit time and prevents concrete slump loss in traffic.",
        "Redundant pump backups on standby for all critical structural pours.",
      ],
    },
    author: {
      name: "Dara Som",
      role: "Fleet Logistics & Dispatch Director, BCE",
    },
  },
  {
    slug: "hot-weather-concreting-ice-batching",
    title: "Overcoming High-Ambient Heat in Cambodian Pouring: Ice Batching and Retarder Dosage Protocols",
    category: "Concrete Technology",
    kind: "Insight",
    year: "2025",
    date: "24 August 2025",
    readTime: "5 min read",
    image: REFERENCE_IMAGES.sustainable,
    alt: "Concrete pouring during daytime in Cambodian hot weather conditions",
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
            "Because the latent heat of fusion of melting ice absorbs 334 J/g of heat, the fresh concrete discharge temperature is consistently kept below 30°C to 32°C upon site arrival.",
          ],
        },
        {
          heading: "Extended Hydration Retarders",
          body: [
            "ASTM C494 Type D water-reducing and retarding admixtures are dosed to extend initial set times from the typical 90 minutes to 3.5 hours. This prevents flash setting during traffic transit and ensures complete consolidation around dense rebar cages.",
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
    title: "Safety-First Infrastructure: Achieving 1,000,000 Safe Man-Hours on Commercial Substructures",
    category: "Site Quality & HSE",
    kind: "News",
    year: "2025",
    date: "10 June 2025",
    readTime: "4 min read",
    image: REFERENCE_IMAGES.operations,
    alt: "BCE construction team conducting safety briefing with full personal protective equipment",
    excerpt:
      "A look into BCE’s Health, Safety, and Environment (HSE) management system: daily toolbox meetings, certified rigging protocols, and zero Lost Time Injuries.",
    content: {
      intro:
        "Heavy construction sites involve overhead boom pump lines, rotating mixer drums, high-tonnage static piling rigs, and deep trenching. In 2025, BCE celebrated reaching 1,000,000 consecutive safe work hours without a Lost Time Injury (LTI) across all operational plants and customer project sites.",
      sections: [
        {
          heading: "Mandatory Daily Toolbox Briefings",
          body: [
            "Every shift begins with an on-site safety briefing reviewing site-specific pinch hazards, electrical line clearances for crane and boom operations, and pedestrian-vehicle exclusion zones.",
            "All personnel are provided certified European standard PPE: high-impact helmets, steel-toed boots, high-visibility reflective vests, and eye protection.",
          ],
        },
        {
          heading: "Rigorous Equipment Inspection Protocols",
          body: [
            "Hydraulic pump lines, clamps, safety whip-checks, and piling rig wire ropes undergo daily pre-pour checklist sign-offs by certified safety officers. Any equipment showing minor wear is immediately removed from service for workshop refurbishment.",
          ],
        },
      ],
      takeaways: [
        "1,000,000 safe man-hours without Lost Time Injury.",
        "Comprehensive accident and medical insurance provided for all 71 BCE personnel.",
        "Structured emergency response plans on every active client pouring site.",
      ],
    },
    author: {
      name: "Ms. Loeung Chan",
      role: "Chairwoman, Battambang Construction & Engineering",
    },
  },
  {
    slug: "30-years-of-bce-heritage-from-1995",
    title: "The History of BCE: 30 Years from Hong Huot Ly in 1995 to Western Cambodia’s Concrete Leader",
    category: "Company News",
    kind: "News",
    year: "2024",
    date: "14 December 2024",
    readTime: "6 min read",
    image: REFERENCE_IMAGES.vessel,
    alt: "Ms. Loeung Chan Chairwoman of Battambang Construction and Engineering",
    excerpt:
      "How a modest local aggregate trading business founded in 1995 transformed into Battambang's foremost integrated ready-mix concrete and civil engineering powerhouse.",
    content: {
      intro:
        "Three decades ago in 1995, Hong Huot Ly Co., Ltd. began operations supplying building materials and basic construction services to the recovering communities of Northwestern Cambodia. Through steady reinvestment in modern plant machinery and engineering talent, that enterprise evolved into Battambang Construction and Engineering Co., Ltd. (BCE).",
      sections: [
        {
          heading: "Building Cambodia's Resilient Foundations",
          body: [
            "Under the leadership of Chairwoman Ms. Loeung Chan, BCE modernized operations in 2015, introducing computerized European batching technology to replace manual drum mixers in the region.",
            "Today, BCE operates 4 central batching plants, 41 mixer trucks, 8 pump trucks, 7 hydraulic piling rigs, and an accredited materials testing laboratory serving 14 provinces across Western Cambodia.",
          ],
        },
        {
          heading: "A Heritage of Trust & Integrity",
          body: [
            "Over 30 years, BCE has supplied concrete for more than 30 landmark commercial, public, and industrial projects — including Highway 5 culvert sections, educational campuses, high-capacity rice milling silos, and prominent retail centers.",
          ],
        },
      ],
      takeaways: [
        "Established in 1995 with over 30 years of uninterrupted operational excellence.",
        "100% locally incorporated Cambodian corporate leadership.",
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
    title: "Concrete Slab Laser Screeding: Delivering Ultra-Flat Superflat Flooring for Modern Warehouses",
    category: "Civil Construction",
    kind: "Insight",
    year: "2024",
    date: "08 September 2024",
    readTime: "5 min read",
    image: REFERENCE_IMAGES.nextGeneration,
    alt: "Concrete slab finishing and laser leveling on industrial warehouse project",
    excerpt:
      "Automated laser screed technology achieves precise floor flatness (FF) and floor levelness (FL) numbers required for high-bay logistics racking and automated forklifts.",
    content: {
      intro:
        "Modern agricultural packaging centers, rice processing warehouses, and logistics hubs require ultra-flat concrete floors (FF > 45, FL > 35) to allow high-reach narrow-aisle forklifts to operate without mast tipping. BCE combines customized low-shrinkage ready-mix designs with automated laser screed finishing services.",
      sections: [
        {
          heading: "Laser-Guided Elevation Accuracy",
          body: [
            "Our automated laser screeds receive continuous elevation signals from 360-degree rotating laser transmitters set up on site, making automatic hydraulic adjustments at 10 times per second to strike off concrete to within ±3mm tolerance across 3,000 square meter daily placements.",
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
        "Significantly speeds up placement rates up to 3,000 m² per day.",
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
