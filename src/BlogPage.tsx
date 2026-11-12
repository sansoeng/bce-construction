import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { unsplash } from "./company";

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
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
    year: "2026",
    date: "15 April 2026",
    readTime: "5 min read",
    image: unsplash("/Image/bce/hero_batching_plant.webp", 1600),
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
    year: "2026",
    date: "28 March 2026",
    readTime: "6 min read",
    image: unsplash("/Image/bce/project_page_17.webp", 1600),
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
    year: "2026",
    date: "12 March 2026",
    readTime: "4 min read",
    image: unsplash("/Image/bce/laboratory_qa.webp", 1600),
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
    year: "2025",
    date: "18 November 2025",
    readTime: "4 min read",
    image: unsplash("/Image/bce/machinery_fleet.webp", 1600),
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
    year: "2025",
    date: "24 August 2025",
    readTime: "5 min read",
    image: unsplash("/Image/bce/project_page_14.webp", 1600),
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
    year: "2025",
    date: "10 June 2025",
    readTime: "4 min read",
    image: unsplash("/Image/bce/hse_safety.webp", 1600),
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
    year: "2024",
    date: "14 December 2024",
    readTime: "6 min read",
    image: unsplash("/Image/bce/chairwoman.webp", 1600),
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
    year: "2024",
    date: "08 September 2024",
    readTime: "5 min read",
    image: unsplash("/Image/bce/project_page_16.webp", 1600),
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

const TOPICS = [
  "All topics",
  "Concrete Technology",
  "Foundation Piling",
  "Quality & Lab",
  "Fleet & Equipment",
  "Site Quality & HSE",
  "Company News",
  "Civil Construction",
];

const YEARS = ["All years", "2026", "2025", "2024"];

const ChevronDownIcon = ({ open }: { open?: boolean }) => (
  <svg
    viewBox="0 0 10 6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`size-2.5 transition-transform duration-200 text-[#191C1F] ${open ? "rotate-180" : ""}`}
    aria-hidden
  >
    <path d="M1 1l4 4 4-4" />
  </svg>
);

export default function BlogPage() {
  usePageSetup("Blog & Engineering Insights | BCE., Ltd.");

  // Read post slug from URL query if present (e.g. ?blog&post=...)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("post");
  });

  const [activeTopic, setActiveTopic] = useState<string>("All topics");
  const [activeYear, setActiveYear] = useState<string>("All years");
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const topicRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Synchronize browser history / deep link
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get("post"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (topicRef.current && !topicRef.current.contains(e.target as Node)) {
        setIsTopicOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) {
        setIsYearOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleSelectPost = (slug: string) => {
    setSelectedSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("post", slug);
    window.history.pushState(null, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setSelectedSlug(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("post");
    window.history.pushState(null, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      const matchTopic = activeTopic === "All topics" || p.category === activeTopic;
      const matchYear = activeYear === "All years" || p.year === activeYear;
      return matchTopic && matchYear;
    });
  }, [activeTopic, activeYear]);

  const currentPost = useMemo(() => {
    if (!selectedSlug) return null;
    return BLOG_POSTS.find((p) => p.slug === selectedSlug) || null;
  }, [selectedSlug]);

  const relatedPosts = useMemo(() => {
    if (!currentPost) return [];
    return BLOG_POSTS.filter((p) => p.slug !== currentPost.slug).slice(0, 3);
  }, [currentPost]);

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />

      <main className="min-h-screen bg-white">
        {currentPost ? (
          /* =========================================================================
              VIEW A: SINGLE BLOG POST READER VIEW
             ========================================================================= */
          <article className="w-full px-5 sm:px-6 md:px-8 pt-28 md:pt-36 pb-20">
            <div className="w-full max-w-[840px] mx-auto">
              {/* Back to Blog Button */}
              <button
                type="button"
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#737373] hover:text-[#191C1F] transition-colors mb-8 cursor-pointer"
              >
                <span>←</span>
                <span>Back to Blog</span>
              </button>

              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-[#737373] mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#F3F4F6] text-[#191C1F] font-semibold text-xs">
                  {currentPost.category}
                </span>
                <span>·</span>
                <span>{currentPost.date}</span>
                <span>·</span>
                <span>{currentPost.readTime}</span>
              </div>

              {/* Title */}
              <h1 className="text-[32px] sm:text-[42px] md:text-[64px] font-semibold tracking-[-0.03em] text-[#191C1F] leading-[1.14] mb-6">
                {currentPost.title}
              </h1>

              {/* Author Row */}
              <div className="flex items-center gap-3.5 py-4 border-y border-[rgba(0,0,0,0.06)] mb-8">
                <div className="size-11 rounded-full bg-[#191C1F] text-white flex items-center justify-center font-bold text-sm">
                  {currentPost.author.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#191C1F]">
                    {currentPost.author.name}
                  </div>
                  <div className="text-xs text-[#737373]">
                    {currentPost.author.role}
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="rounded-[24px] overflow-hidden mb-10 bg-[#F0F1F3] aspect-[16/9]" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                <img
                  src={currentPost.image}
                  alt={currentPost.alt}
                  className="w-full h-full object-cover rounded-[24px]"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                />
              </div>

              {/* Article Lead Introduction */}
              <p className="text-lg md:text-[21px] text-[#191C1F] leading-relaxed font-normal mb-8">
                {currentPost.content.intro}
              </p>

              {/* Article Content Sections */}
              <div className="space-y-10 text-[16px] md:text-[17px] leading-[1.75] text-[#333333]">
                {currentPost.content.sections?.map((sec, idx) => (
                  <section key={idx} className="space-y-4">
                    <h2 className="text-[24px] md:text-[28px] font-bold tracking-tight text-[#191C1F] pt-2">
                      {sec.heading}
                    </h2>
                    {sec.body.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                    {sec.callout && (
                      <aside className="my-6 p-6 rounded-[16px] bg-[#F8F9FA] border-l-4 border-[#191C1F] text-[16px] text-[#191C1F] font-medium leading-relaxed">
                        “{sec.callout}”
                      </aside>
                    )}
                  </section>
                ))}

                {/* Key Takeaways */}
                {currentPost.content.takeaways && (
                  <div className="mt-12 p-8 rounded-[20px] bg-[#F8F9FA] border border-[rgba(0,0,0,0.06)]">
                    <h3 className="text-lg font-bold text-[#191C1F] mb-4">
                      Key Takeaways for Site Contractors &amp; Developers
                    </h3>
                    <ul className="space-y-3">
                      {currentPost.content.takeaways.map((item, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-3 text-sm md:text-[15px] text-[#555]">
                          <span className="text-[#191C1F] font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Consultation / Dispatch Call to Action */}
              <div className="mt-16 p-8 rounded-[20px] bg-[#191C1F] text-white text-center">
                <h3 className="text-[24px] font-bold mb-2">Have a technical concrete inquiry?</h3>
                <p className="text-white/70 text-sm max-w-[480px] mx-auto mb-6 leading-relaxed">
                  Connect directly with BCE’s batching dispatch engineers to schedule test cylinders, mix design approvals, or provincial delivery.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <ArrowButton
                    href="/?quote"
                    label="Request a concrete quote"
                    theme="white"
                  />
                  <a
                    href="tel:012932700"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Call Dispatch Hotline
                  </a>
                </div>
              </div>

              {/* Related / Next Articles */}
              {relatedPosts.length > 0 && (
                <div className="mt-20 pt-12 border-t border-[rgba(0,0,0,0.08)]">
                  <h3 className="text-[24px] font-bold text-[#191C1F] mb-8">
                    Related Articles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((post) => (
                      <div
                        key={post.slug}
                        onClick={() => handleSelectPost(post.slug)}
                        className="group cursor-pointer"
                      >
                        <div className="rounded-[24px] overflow-hidden aspect-[16/10] bg-[#F0F1F3] mb-3" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                          <img
                            src={post.image}
                            alt={post.alt}
                            className="w-full h-full object-cover rounded-[24px] group-hover:scale-105 transition-transform duration-300"
                            style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                          />
                        </div>
                        <div className="text-xs font-medium text-[#737373] mb-1">
                          {post.category}
                        </div>
                        <h4 className="text-[16px] font-semibold text-[#191C1F] group-hover:text-black leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        ) : (
          /* =========================================================================
              VIEW B: REVOLUT-STYLE BLOG INDEX PAGE
              Exact specifications:
              - Centered H1: "Blog"
              - Centered Combobox Pills: "All topics" & "All years"
              - 6-Column Responsive Grid (Top 2 cards span 3 cols, next span 2 cols)
              - Card anatomy: rounded-[20px], bg-[#F8F8F8], 16:9 thumbnail, category tag, title, date
             ========================================================================= */
          <section className="w-full px-5 sm:px-6 md:px-8 pt-28 md:pt-36 pb-20">
            <div className="w-full max-w-[1000px] 2xl:max-w-[1432px] mx-auto">
              {/* Revolut Centered Header: H1 Blog */}
              <div className="text-center max-w-[700px] mx-auto mb-8">
                <h1 className="text-[34px] sm:text-[42px] md:text-[64px] font-semibold tracking-[-0.03em] text-[#191C1F] leading-tight">
                  Blog
                </h1>
                <p className="mt-3 text-base sm:text-lg text-[#737373] leading-relaxed">
                  Engineering insights, concrete batching innovations, and major infrastructure milestones from BCE across Cambodia.
                </p>
              </div>

              {/* Revolut Centered Pill Filters: "All topics" & "All years" */}
              <div className="flex items-center justify-center gap-3 mb-12 sm:mb-16">
                {/* Topic Filter Pill */}
                <div ref={topicRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTopicOpen(!isTopicOpen);
                      setIsYearOpen(false);
                    }}
                    className="flex items-center gap-3 h-12 px-6 rounded-full bg-[#F3F4F5] hover:bg-[#EAEBED] transition-colors text-[15px] font-medium text-[#191C1F] cursor-pointer"
                  >
                    <span>{activeTopic}</span>
                    <ChevronDownIcon open={isTopicOpen} />
                  </button>

                  {/* Topic Dropdown Popover */}
                  {isTopicOpen && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 w-[240px] p-2 bg-white rounded-[16px] shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] animate-in fade-in duration-150">
                      <div className="max-h-[300px] overflow-y-auto space-y-1">
                        {TOPICS.map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => {
                              setActiveTopic(topic);
                              setIsTopicOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs rounded-full transition-colors flex items-center justify-between cursor-pointer ${
                              activeTopic === topic
                                ? "bg-[#191C1F] text-white font-medium"
                                : "text-[#191C1F] hover:bg-[#F3F4F6]"
                            }`}
                          >
                            <span className="truncate">{topic}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Year Filter Pill */}
                <div ref={yearRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsYearOpen(!isYearOpen);
                      setIsTopicOpen(false);
                    }}
                    className="flex items-center gap-3 h-12 px-6 rounded-full bg-[#F3F4F5] hover:bg-[#EAEBED] transition-colors text-[15px] font-medium text-[#191C1F] cursor-pointer"
                  >
                    <span>{activeYear}</span>
                    <ChevronDownIcon open={isYearOpen} />
                  </button>

                  {/* Year Dropdown Popover */}
                  {isYearOpen && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 w-[180px] p-2 bg-white rounded-[16px] shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] animate-in fade-in duration-150">
                      <div className="space-y-1">
                        {YEARS.map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => {
                              setActiveYear(yr);
                              setIsYearOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs rounded-full transition-colors flex items-center justify-between cursor-pointer ${
                              activeYear === yr
                                ? "bg-[#191C1F] text-white font-medium"
                                : "text-[#191C1F] hover:bg-[#F3F4F6]"
                            }`}
                          >
                            <span>{yr}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Revolut Article Grid: 6-Column Grid Layout */}
              {filteredPosts.length === 0 ? (
                <div className="py-24 text-center rounded-[20px] bg-[#F8F8F8] border border-[rgba(0,0,0,0.04)]">
                  <p className="text-[18px] font-medium text-[#191C1F]">
                    No articles found for the selected filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTopic("All topics");
                      setActiveYear("All years");
                    }}
                    className="mt-4 px-5 py-2.5 rounded-full bg-[#191C1F] text-white text-xs font-medium cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
                  {filteredPosts.map((post, index) => {
                    // First 2 cards span 3 columns each (prominent featured row); remaining cards span 2 columns (3-per-row)
                    const isFeatured = index < 2;
                    const colSpanClass = isFeatured
                      ? "lg:col-span-3"
                      : "lg:col-span-2";

                    return (
                      <article
                        key={post.slug}
                        onClick={() => handleSelectPost(post.slug)}
                        className={`group flex flex-col p-6 rounded-[24px] bg-[#F8F8F8] hover:bg-[#F0F1F3] transition-all duration-300 cursor-pointer border border-[rgba(0,0,0,0.02)] ${colSpanClass}`}
                        style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                      >
                        {/* Thumbnail Image */}
                        <div
                          className={`w-full rounded-[24px] overflow-hidden bg-[#EAEBED] mb-4 relative ${
                            isFeatured ? "aspect-[16/10] md:aspect-[16/9]" : "aspect-[16/10]"
                          }`}
                          style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                        >
                          <img
                            src={post.image}
                            alt={post.alt}
                            className="w-full h-full object-cover rounded-[24px] group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                            style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                            loading="lazy"
                          />
                        </div>

                        {/* Category Tag */}
                        <div className="text-[13px] font-medium text-[#737373] mb-2 uppercase tracking-[0.04em]">
                          {post.category}
                        </div>

                        {/* Title */}
                        <h2
                          className={`font-semibold text-[#191C1F] group-hover:text-black transition-colors leading-[1.25] mb-2.5 ${
                            isFeatured
                              ? "text-[22px] md:text-[24px]"
                              : "text-[18px] md:text-[20px]"
                          }`}
                        >
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-sm text-[#5A5D66] leading-relaxed line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        {/* Card Footer: Date & Reading Time */}
                        <div className="mt-auto pt-3 border-t border-[rgba(0,0,0,0.05)] flex items-center justify-between text-xs text-[#8C8C8C]">
                          <span>{post.date}</span>
                          <span className="font-mono">{post.readTime}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        <QuoteCta href="/?quote" />
        <Footer phones={phones} tel={tel} base="/" />
        <FluidCursor />
      </main>
    </>
  );
}
