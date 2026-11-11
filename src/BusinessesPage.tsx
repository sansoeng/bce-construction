import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { offerings, quoteHref, type Business } from "./company";
import { projectHref, projects } from "./projects";

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

export interface BusinessSection {
  slug: string;
  name: string;
  shortName: string;
  kicker: string;
  heroTitle: string;
  heroLead: string;
  image: string;
  accentColor: string;
  stats: { value: string; unit?: string; label: string; note: string }[];
  pillars: { title: string; text: string; icon: string }[];
  solutions: {
    title: string;
    description: string;
    points: string[];
  }[];
  specifications: { label: string; value: string }[];
  projectSlug: string;
  nextSlug: string;
  nextName: string;
}

export const BUSINESS_DETAILS: Record<string, BusinessSection> = {
  "ready-mix-concrete": {
    slug: "ready-mix-concrete",
    name: "Ready-Mix Concrete",
    shortName: "Ready-Mix",
    kicker: "From Plant to Pour · 30+ Years Heritage",
    heroTitle: "Ready-Mix Concrete Production & Supply",
    heroLead:
      "Quality-controlled concrete engineered from our 4 computerized Sicoma batching plants with a combined capacity of 280 m³/hour. Delivered across 14 Cambodian provinces by our fleet of 41 transit mixer trucks with real-time GPS telemetry and certified laboratory slump and strength testing.",
    image: "/Image/bce/hero_batching_plant.jpg",
    accentColor: "#293e8a",
    stats: [
      { value: "4", unit: "Plants", label: "Automated batching plants", note: "Located in Battambang hubs" },
      { value: "280", unit: "m³/hr", label: "Combined peak capacity", note: "70 m³/hr per individual plant" },
      { value: "41", unit: "Trucks", label: "Dedicated transit mixers", note: "Equipped with GPS telemetry" },
      { value: "14", unit: "Provinces", label: "Nationwide supply coverage", note: "Serving Northwest & Central" },
    ],
    pillars: [
      {
        title: "Computerized PLC Batching",
        text: "Automated batching control systems with digital load cells measuring aggregate, cement, water, and chemical admixtures down to exact water-cement ratio tolerances.",
        icon: "cpu",
      },
      {
        title: "In-House Laboratory QA",
        text: "Every delivery is slump-tested before discharge. Test cylinders are cast and cured for 7-day and 28-day compressive crushing on our DYE-2000 digital testing machine.",
        icon: "flask",
      },
      {
        title: "24/7 Mass Pour Logistics",
        text: "Experienced dispatch coordinators stage mixer trucks for continuous monolithic foundation pours without cold joints or structural pour interruptions.",
        icon: "truck",
      },
      {
        title: "Standards & Compliance",
        text: "Formulated strictly per ACI 211.1 and ASTM C94 guidelines, utilizing environmentally filtered silo systems to minimize dust and carbon emissions.",
        icon: "shield",
      },
    ],
    solutions: [
      {
        title: "Structural & High-Strength Formulations",
        description:
          "Custom mix designs from C15 (150 kg/cm²) up to C45 (450 kg/cm²) engineered for pile caps, columns, transfer beams, and post-tensioned slabs.",
        points: [
          "Adherence to ACI 211.1 mix design guidelines",
          "Compressive strengths from 150 to 450 kg/cm²",
          "Trial-mixed and approved before project commencement",
          "Verified cylinder breaking records for client handover",
        ],
      },
      {
        title: "Advanced Admixtures & Specialized Concretes",
        description:
          "Performance-enhancing chemical admixtures tailored for high-temperature tropical placement, long transit times, and waterproof basements.",
        points: [
          "Set-retarding admixtures for long hauling distances",
          "Superplasticizers for high slump self-compacting concrete",
          "Integral crystalline waterproofing for basements and water tanks",
          "Silica fume and low-heat formulations for massive raft pours",
        ],
      },
      {
        title: "Continuous Monolithic Mass Concrete Pours",
        description:
          "Turnkey staging and continuous delivery logistics capable of delivering 1,500+ m³ continuous foundation pours within strict thermal gradients.",
        points: [
          "24/7 night-pour dispatch scheduling",
          "Dedicated batching plant reservation for tier-1 projects",
          "Staged truck convoy routing with GPS monitoring",
          "On-site quality engineer assigned to every pour",
        ],
      },
      {
        title: "Aggregate Sieve Analysis & Sourcing Quality",
        description:
          "Continuous laboratory gradation checks on washed river sand and crushed basalt rock ensuring optimum packing density and pumpability.",
        points: [
          "ASTM C33 fine and coarse aggregate compliance",
          "Fineness modulus tracking for river sand",
          "Specific gravity, absorption, and abrasion testing",
          "Daily moisture compensation adjustments in batching software",
        ],
      },
    ],
    specifications: [
      { label: "Batching Plant Capacity", value: "4 plants × 70 m³/hour (280 m³/hr network)" },
      { label: "Mixer Technology", value: "Sicoma twin-shaft compulsory automated mixers" },
      { label: "Fleet Count", value: "41 transit mixer trucks (8 m³ to 10 m³ drum capacity)" },
      { label: "Concrete Grades", value: "C15, C20, C25, C30, C35, C40, C45" },
      { label: "Slump Range", value: "80 mm to 200 mm (slump retention up to 90 min)" },
      { label: "Laboratory Verification", value: "DYE-2000 digital compressive testing machine" },
    ],
    projectSlug: "siem-reap-commercial-ready-mix",
    nextSlug: "piling",
    nextName: "Piling & Foundations",
  },
  piling: {
    slug: "piling",
    name: "Piling",
    shortName: "Piling & Foundations",
    kicker: "Where Every Structure Begins · Geotechnical Certainty",
    heroTitle: "Piling & Deep Foundation Engineering",
    heroLead:
      "Heavy hydraulic piling and foundation solutions installed with our own fleet of 7 rigs, experienced operators, and backed by laboratory quality verification. Specializing in high-capacity rotary bored piles and driven precast foundations for bridges, high-rises, and industrial facilities across Cambodia.",
    image: "/Image/bce/project_page_28.jpg",
    accentColor: "#2a2927",
    stats: [
      { value: "7", unit: "Rigs", label: "Hydraulic piling fleet", note: "Rotary bored & impact rigs" },
      { value: "45m", unit: "Depth", label: "Max underground drilling", note: "Deep alluvial & rock sockets" },
      { value: "1,200", unit: "mm", label: "Bore diameter range", note: "300 mm to 1,200 mm diameters" },
      { value: "100%", unit: "Tested", label: "Load testing & logging", note: "ASTM static & dynamic tests" },
    ],
    pillars: [
      {
        title: "Geotechnical Ground Appraisal",
        text: "Careful appraisal of borehole strata, SPT N-values, and groundwater tables across Cambodia's diverse river basins to engineer the most cost-effective pile solution.",
        icon: "layers",
      },
      {
        title: "Integrated Self-Delivery",
        text: "Owning both the piling rigs and the concrete batching plants guarantees uninterrupted concrete delivery for cast-in-place bored piles with zero risk of cold joints.",
        icon: "truck",
      },
      {
        title: "Certified Integrity & Load Testing",
        text: "Static compressive load testing, dynamic pile analysis (PDA), and low-strain pile integrity testing (PIT) complying strictly with ASTM D5882 standards.",
        icon: "check-circle",
      },
      {
        title: "Low-Vibration Urban Deployment",
        text: "Hydraulic rotary auger methods engineered to minimize noise and ground vibration when drilling adjacent to existing structures and active roadways.",
        icon: "shield",
      },
    ],
    solutions: [
      {
        title: "Hydraulic Rotary Bored Cast-in-Place Piles",
        description:
          "Deep foundation piling for multi-storey towers, highway bridges, and heavy industrial facilities requiring superior end-bearing and skin friction.",
        points: [
          "Diameters from 600 mm up to 1,200 mm",
          "Drilling depths up to 45 meters into hard rock strata",
          "Temporary steel casing or polymer slurry stabilization",
          "C40 self-compacting tremie concrete placement",
        ],
      },
      {
        title: "Driven Precast Reinforced Concrete Piles",
        description:
          "Cost-effective, rapid foundation installation for large-footprint warehouses, logistics centers, and residential housing developments.",
        points: [
          "Square sections: 300×300 mm, 350×350 mm, 400×400 mm",
          "High-strength C35 precast piles manufactured with strict curing",
          "Hydraulic impact hammers with energy-monitored blow counts",
          "High daily installation productivity for fast programmes",
        ],
      },
      {
        title: "Retaining & Secant Piling Walls",
        description:
          "Interlocking secant and contiguous bored pile walls creating watertight earth-retaining barriers for deep basements and riverside infrastructure.",
        points: [
          "Hard/soft or hard/hard interlocking secant pile walls",
          "Deep basement perimeter shoring and groundwater cutoffs",
          "Allows safe top-down or bottom-up excavation",
          "Contiguous pile walls with shotcrete infill panels",
        ],
      },
      {
        title: "Static & Dynamic Foundation Load Testing",
        description:
          "Comprehensive verification of pile capacity through calibrated hydraulic jacks, load cells, dial gauges, and electronic integrity instrumentation.",
        points: [
          "ASTM D1143 static axial compressive load tests",
          "ASTM D4945 high-strain dynamic pile monitoring (PDA)",
          "ASTM D5882 sonic echo pile integrity testing (PIT)",
          "Certified engineering test reports submitted to project consultants",
        ],
      },
    ],
    specifications: [
      { label: "Piling Fleet Count", value: "7 hydraulic rotary and heavy impact piling rigs" },
      { label: "Drilling Diameters", value: "300 mm to 1,200 mm (rotary bored)" },
      { label: "Maximum Depth", value: "45 meters below working ground level" },
      { label: "Precast Piles", value: "Square 300×300 mm, 350×350 mm, 400×400 mm" },
      { label: "Testing Protocols", value: "Static load, PDA dynamic, sonic echo PIT" },
      { label: "Structural Concrete", value: "C35 to C45 high-slump tremie concrete" },
    ],
    projectSlug: "kampong-thom-bridge-foundations",
    nextSlug: "construction",
    nextName: "Civil Construction",
  },
  construction: {
    slug: "construction",
    name: "Construction",
    shortName: "Civil Construction",
    kicker: "Built End to End · Civil & Infrastructure",
    heroTitle: "Civil & Infrastructure Construction",
    heroLead:
      "Turnkey civil engineering and infrastructure delivery backed by our own concrete batching plants, heavy equipment fleet, and 15 site engineers. Delivering provincial highways, industrial parks, drainage networks, and commercial developments across Cambodia.",
    image: "/Image/bce/project_page_14.jpg",
    accentColor: "#6b635b",
    stats: [
      { value: "15", unit: "Engineers", label: "Site engineering leadership", note: "Civil & structural specialists" },
      { value: "30+", unit: "Years", label: "Proven delivery heritage", note: "Continuous operations since 1995" },
      { value: "100%", unit: "Direct", label: "Self-supplied materials", note: "Concrete & fleet under one roof" },
      { value: "Turnkey", unit: "Scope", label: "Full project execution", note: "From earthworks to handover" },
    ],
    pillars: [
      {
        title: "Single-Source Accountability",
        text: "Managing materials, concrete production, heavy equipment, and construction labor under one roof eliminates finger-pointing and keeps budgets transparent.",
        icon: "briefcase",
      },
      {
        title: "Experienced Site Engineering",
        text: "A permanent team of 15 certified civil engineers overseeing daily surveying, material testing, rebar inspections, and safety compliance.",
        icon: "users",
      },
      {
        title: "Heavy Civil Infrastructure",
        text: "Proven track record in provincial road reconstruction, reinforced box culverts, bridge construction, and flood mitigation channels.",
        icon: "compass",
      },
      {
        title: "Zero-Harm HSE Culture",
        text: "Comprehensive site safety briefings, mandatory PPE enforcement, perimeter security, and regular machinery safety audits.",
        icon: "shield",
      },
    ],
    solutions: [
      {
        title: "Provincial Road Rehabilitation & Paving",
        description:
          "Sub-base stabilization, macadam road bases, asphalt concrete wearing courses, and durable drainage shoulders for transportation corridors.",
        points: [
          "Heavy earthmoving and subgrade compaction",
          "Aggregate base course spreading and vibratory rolling",
          "Bituminous prime coat and asphalt concrete paving",
          "Road markings, guardrails, and traffic signage installation",
        ],
      },
      {
        title: "Industrial Warehouses & Logistics Hubs",
        description:
          "Structural steel portal frames, heavy civil foundations, high-tolerance concrete slabs, and perimeter loading infrastructure.",
        points: [
          "Sub-structure foundations and holding-down bolt grids",
          "Reinforced concrete perimeter ring beams and pedestals",
          "Heavy loading aprons and articulated truck docking bays",
          "Perimeter security walls and stormwater retention ponds",
        ],
      },
      {
        title: "Reinforced Concrete Box Culverts & Drainage",
        description:
          "Critical drainage infrastructure preventing seasonal flooding along major roads, agricultural zones, and municipal developments.",
        points: [
          "Precast and cast-in-place RC box culverts",
          "Reinforced headwalls, wingwalls, and energy dissipators",
          "Municipal stormwater drainage pipe networks",
          "Sediment traps and river discharge revetments",
        ],
      },
      {
        title: "Commercial & Institutional Buildings",
        description:
          "Multi-storey reinforced concrete framing, structural slabs, elevator cores, and architectural concrete works delivered to exacting tolerances.",
        points: [
          "Full structural framing from foundations to roof beams",
          "Integrated mechanical and electrical sleeves cast into slabs",
          "High-finish fair-faced architectural concrete surfaces",
          "Rigorous QA records handover for building certification",
        ],
      },
    ],
    specifications: [
      { label: "Engineering Staff", value: "15 licensed civil, structural, and QA engineers" },
      { label: "Fleet Mobilisation", value: "Excavators, motor graders, vibratory rollers, dump trucks" },
      { label: "Scope Range", value: "Earthworks, roads, bridges, factories, civil structures" },
      { label: "Material Sourcing", value: "Direct from BCE batching plants and testing lab" },
      { label: "Quality Standards", value: "MPWT standard specifications & ACI standards" },
      { label: "Safety Record", value: "Zero fatal incidents across 30+ operating years" },
    ],
    projectSlug: "battambang-provincial-road",
    nextSlug: "concrete-slab-works",
    nextName: "Concrete Slab Works",
  },
  "concrete-slab-works": {
    slug: "concrete-slab-works",
    name: "Concrete Slab Works",
    shortName: "Slab Works",
    kicker: "Placed and Finished · Precision Slabs",
    heroTitle: "Concrete Slab Placement & Finishing",
    heroLead:
      "High-tolerance floor slab pumping, laser screeding, and mechanical power floating delivered by our specialized crews and 8 concrete pump trucks. Supplying crack-resistant, heavy-duty floor surfaces for logistics warehouses, factories, and commercial structures.",
    image: "/Image/bce/core_services.jpg",
    accentColor: "#dcd9d3",
    stats: [
      { value: "8", unit: "Pumps", label: "Mobile boom & line pumps", note: "Up to 120 m³/hr capacity" },
      { value: "48m", unit: "Reach", label: "Max vertical boom reach", note: "Multi-storey & deep basement" },
      { value: "12,400", unit: "m²", label: "Single floor area record", note: "Continuous bay pour sequence" },
      { value: "Zero", unit: "Defects", label: "Monolithic joint delivery", note: "Controlled shrinkage cracking" },
    ],
    pillars: [
      {
        title: "High-Reach Boom Pumping Network",
        text: "Fleet of 8 pump trucks with reach curves from 28m to 48m, delivering concrete into restricted access basements, elevated decks, and wide floor footprints.",
        icon: "chevrons-up",
      },
      {
        title: "Floor Flatness & Levelness (FF/FL)",
        text: "Precision laser screeds and calibrated check rods ensuring flat, level surfaces compliant with modern high-bay racking and automated warehouse standards.",
        icon: "maximize",
      },
      {
        title: "Abrasion-Resistant Treatments",
        text: "Dry-shake metallic and quartz mineral hardeners burnished into the fresh concrete surface to provide extreme resistance to heavy forklift tire wear.",
        icon: "shield",
      },
      {
        title: "Joint Detailing & Crack Mitigation",
        text: "Carefully planned bay pour sequences with early-entry saw-cut relief joints preventing shrinkage cracking and maintaining clean joint edges.",
        icon: "grid",
      },
    ],
    solutions: [
      {
        title: "High-Tolerance Logistics Warehouse Floors",
        description:
          "Ground-bearing heavy-duty slabs engineered to resist concentrated rack leg point loads and continuous dynamic forklift traffic.",
        points: [
          "Laser-screeded placement ensuring high FF/FL values",
          "Heavy double-mesh reinforcement positioning",
          "Continuous planned day pours up to 1,500 m² per bay",
          "Clean saw-cut joints sealed with semi-rigid epoxy/polyurethane",
        ],
      },
      {
        title: "Elevated Deck & Suspended Structural Slabs",
        description:
          "Pumping structural concrete to upper floors of commercial buildings, residential towers, and multi-storey car parks.",
        points: [
          "High-pressure boom pumps reaching up to 48m height",
          "Trailer line pumps with pipeline extensions over 150m horizontally",
          "Lightweight vibration and consolidation to avoid rebar displacement",
          "Controlled curing to prevent plastic shrinkage cracking",
        ],
      },
      {
        title: "Power-Float & Burnished Finishes",
        description:
          "Mechanical finishing using walk-behind and ride-on power trowels to produce smooth, non-dusting, highly polished floor surfaces.",
        points: [
          "Dry-shake quartz or corundum mineral surface hardeners",
          "Multiple burnishing passes for maximum surface density",
          "Application of liquid chemical hardeners and dustproofers",
          "Easy-to-clean, oil-resistant industrial finish",
        ],
      },
      {
        title: "Outdoor Aprons & Heavy Hardstands",
        description:
          "Outdoor concrete pavements for container handling terminals, truck staging yards, and heavy equipment parking.",
        points: [
          "Air-entrained and high-durability C35 ready-mix concrete",
          "Brushed non-slip textured safety finishes",
          "Heavy dowelled expansion and construction joints",
          "Designed for extreme axle loads and tropical rainfall",
        ],
      },
    ],
    specifications: [
      { label: "Pump Fleet", value: "8 boom pump trucks (28m to 48m) + line pumps" },
      { label: "Pumping Capacity", value: "Up to 120 m³/hour per pump unit" },
      { label: "Finishing Gear", value: "Ride-on & walk-behind mechanical power trowels" },
      { label: "Slab Thickness Range", value: "150 mm to 350 mm heavy industrial" },
      { label: "Flatness Compliance", value: "ASTM E1155 Floor Flatness & Levelness" },
      { label: "Curing Systems", value: "Membrane curing compounds & wet burlap covers" },
    ],
    projectSlug: "poipet-logistics-warehouse",
    nextSlug: "equipment-rental",
    nextName: "Equipment Rental",
  },
  "equipment-rental": {
    slug: "equipment-rental",
    name: "Truck & Equipment Rental",
    shortName: "Equipment Rental",
    kicker: "Ready to Mobilise · Fleet Hire",
    heroTitle: "Heavy Equipment & Plant Fleet Rental",
    heroLead:
      "Hire modern transit mixer trucks, boom pump trucks, hydraulic piling rigs, and heavy construction plant across Cambodia. Maintained by our in-house mechanics and available with certified, experienced operators.",
    image: "/Image/bce/machinery_fleet.jpg",
    accentColor: "#8e5236",
    stats: [
      { value: "56+", unit: "Units", label: "Heavy fleet inventory", note: "Mixers, pumps, rigs & cranes" },
      { value: "41", unit: "Mixers", label: "Transit mixer trucks", note: "8 m³ to 10 m³ drum capacity" },
      { value: "8", unit: "Pumps", label: "Mobile boom & line pumps", note: "Vertical reach 28m to 48m" },
      { value: "24/7", unit: "Support", label: "Mobile repair mechanics", note: "Zero on-site pour downtime" },
    ],
    pillars: [
      {
        title: "Immediate Site Mobilisation",
        text: "With strategically positioned depots in Battambang and regional partners, our machines can be mobilized quickly to any project site in Cambodia.",
        icon: "navigation",
      },
      {
        title: "Certified Machine Operators Included",
        text: "Every leased unit can be paired with an experienced, safety-certified operator who knows the machine's full operational capabilities.",
        icon: "user-check",
      },
      {
        title: "In-House Fleet Maintenance",
        text: "BCE operates its own heavy repair shop with diagnostic equipment, genuine replacement parts, and scheduled preventive maintenance.",
        icon: "tool",
      },
      {
        title: "24/7 Mobile Service Units",
        text: "Dedicated field service trucks with hydraulic specialists deployed directly to sites to handle routine maintenance and prevent pour delays.",
        icon: "clock",
      },
    ],
    solutions: [
      {
        title: "Concrete Mixer Truck Fleet Rental",
        description:
          "Modern 8 m³ to 10 m³ transit mixer trucks hired out for major construction projects, remote batching setups, and regional pour campaigns.",
        points: [
          "Available on daily, weekly, or monthly project terms",
          "Equipped with GPS dispatch tracking and water washdown tanks",
          "Experienced drivers with defensive driving certifications",
          "Full maintenance and tire replacement included",
        ],
      },
      {
        title: "Boom & Line Pump Hire with Crews",
        description:
          "Concrete pump trucks from 28m to 48m boom lengths, plus high-pressure trailer line pumps for tunnels and high-rise structures.",
        points: [
          "Pumping specialists and pipeline setup crews provided",
          "Horizontal pipeline runs up to 200m for difficult access",
          "Pumping capacity up to 120 m³/hour per pump",
          "Emergency backup pumps staged for mission-critical pours",
        ],
      },
      {
        title: "Hydraulic Rotary & Impact Piling Rigs",
        description:
          "Specialized foundation drilling rigs and piling cranes for deep foundation sub-contracts and industrial ground preparation.",
        points: [
          "Rotary drill rigs capable of boring up to 1,200 mm diameter",
          "Impact piling hammers for driven precast concrete piles",
          "Experienced piling rig operators and drilling technicians",
          "Comprehensive mechanical rigging safety documentation",
        ],
      },
      {
        title: "Heavy Earthmoving & Civil Plant",
        description:
          "Excavators, vibratory soil compactors, asphalt paving machines, and heavy dump trucks available for road and civil development.",
        points: [
          "Heavy earthmoving and site grading machinery",
          "Soil compaction rollers with digital density telemetry",
          "Reliable diesel power generators and mobile fuel bowsers",
          "Flexible contract terms tailored to project milestones",
        ],
      },
    ],
    specifications: [
      { label: "Total Heavy Units", value: "56+ machines across 4 core equipment categories" },
      { label: "Mixer Fleet", value: "41 trucks (8 m³ to 10 m³ capacity, Sany / Zoomlion / Howo)" },
      { label: "Pump Fleet", value: "8 units (28m, 37m, 42m, 48m vertical reach)" },
      { label: "Piling Fleet", value: "7 hydraulic rotary and heavy impact rigs" },
      { label: "Mechanical Support", value: "24/7 mobile repair vans with certified mechanics" },
      { label: "Operator Availability", value: "Full-time certified operators with every unit" },
    ],
    projectSlug: "sihanoukville-fleet-hire",
    nextSlug: "ready-mix-concrete",
    nextName: "Ready-Mix Concrete",
  },
};

const ORDERED_SLUGS = [
  "ready-mix-concrete",
  "piling",
  "construction",
  "concrete-slab-works",
  "equipment-rental",
];

export default function BusinessesPage() {
  usePageSetup("Our Businesses | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);

  // Read initial slug from ?business=<slug> or #<slug>
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    if (typeof window === "undefined") return "ready-mix-concrete";
    const params = new URLSearchParams(window.location.search);
    const paramSlug = params.get("business") || params.get("service") || params.get("slug");
    if (paramSlug && BUSINESS_DETAILS[paramSlug]) return paramSlug;
    const hash = window.location.hash.replace("#", "");
    if (hash && BUSINESS_DETAILS[hash]) return hash;
    return "ready-mix-concrete";
  });

  // Listen to browser popstate for history navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const paramSlug = params.get("business") || params.get("service") || params.get("slug");
      if (paramSlug && BUSINESS_DETAILS[paramSlug]) {
        setActiveSlug(paramSlug);
      } else {
        const hash = window.location.hash.replace("#", "");
        if (hash && BUSINESS_DETAILS[hash]) setActiveSlug(hash);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const selectBusiness = (slug: string) => {
    setActiveSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("business", slug);
    url.hash = slug;
    window.history.pushState(null, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const current = BUSINESS_DETAILS[activeSlug] || BUSINESS_DETAILS["ready-mix-concrete"];

  const featuredProject = useMemo(() => {
    return projects.find((p) => p.slug === current.projectSlug);
  }, [current.projectSlug]);

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#191C1F]">

        {/* 1. Top Breadcrumb & Segmented Pill Switcher */}
        <div className="pt-28 sm:pt-32 md:pt-36 pb-6 bg-[#FAFAFA] border-b border-[rgba(0,0,0,0.06)]">
          <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-6 md:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#191C1F]/50 mb-5">
              <a href="/" className="hover:text-[#191C1F] transition-colors">Home</a>
              <span>/</span>
              <span>Our Businesses</span>
              <span>/</span>
              <span className="font-semibold text-[#191C1F]">{current.name}</span>
            </div>

            {/* Horizontal Segmented Switcher Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {ORDERED_SLUGS.map((slug) => {
                const b = BUSINESS_DETAILS[slug];
                const isActive = activeSlug === slug;
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => selectBusiness(slug)}
                    className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border-0 cursor-pointer ${
                      isActive
                        ? "bg-[#191C1F] text-white shadow-sm"
                        : "bg-[#F0F1F3] text-[#5A5D66] hover:bg-[#EAEBED] hover:text-[#191C1F]"
                    }`}
                  >
                    <span>{b.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Hero Section (Skanska Inspired Layout) */}
        <section className="pt-10 sm:pt-14 md:pt-16 pb-16 md:pb-24">
          <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column: Kicker, Title, Lead, CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start">
                {/* Kicker Badge */}
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F0F1F3] text-[#191C1F]/80 mb-4">
                  <span className="size-1.5 rounded-full bg-[#191C1F]"></span>
                  <span>{current.kicker}</span>
                </span>

                {/* H1 Headline */}
                <h1 className="text-[36px] sm:text-[46px] md:text-[54px] lg:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] text-[#191C1F] mb-5">
                  {current.heroTitle}
                </h1>

                {/* Hero Lead Paragraph */}
                <p className="text-[16px] sm:text-[17px] md:text-[18px] text-[#191C1F]/70 leading-[1.6] max-w-[640px] mb-8">
                  {current.heroLead}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <ArrowButton
                    href={quoteHref(current.slug)}
                    label="Request a quotation"
                    theme="black"
                    className="!self-auto"
                  />
                  <a
                    href="/?resources"
                    className="inline-flex items-center justify-center gap-2 px-6 h-[42px] rounded-full text-xs font-semibold bg-[#F0F1F3] hover:bg-[#EAEBED] text-[#191C1F] transition-colors border-0"
                  >
                    <span>Download data sheets</span>
                    <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 2v8M4 7l4 4 4-4M2 13h12" />
                    </svg>
                  </a>
                </div>

                {/* Direct Hotline Callout */}
                <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.08)] flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#191C1F]/60">
                  <span>Direct Site Dispatch Hotline:</span>
                  <a href="tel:012932700" className="font-semibold text-[#191C1F] hover:underline">
                    012 932 700
                  </a>
                  <span>·</span>
                  <a href="tel:017222205" className="font-semibold text-[#191C1F] hover:underline">
                    017 222 205
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Image with 18px Apple-smoothed Corners */}
              <div className="lg:col-span-5">
                <div
                  className="w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-[18px] bg-[#EAEBED] shadow-lg shadow-black/5"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                >
                  <img
                    src={current.image}
                    alt={current.heroTitle}
                    className="w-full h-full object-cover rounded-[18px]"
                    style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                    loading="eager"
                  />
                </div>
              </div>

            </div>

            {/* 4 Quantified Key Metrics Ribbon (Skanska Style) */}
            <div className="mt-12 sm:mt-16 pt-8 border-t border-[rgba(0,0,0,0.08)] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {current.stats.map((s, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-baseline gap-1 text-[36px] sm:text-[44px] lg:text-[48px] font-bold text-[#191C1F] tracking-[-0.03em] leading-none mb-1.5">
                    <span>{s.value}</span>
                    {s.unit && <span className="text-[18px] sm:text-[20px] font-semibold text-[#191C1F]/50">{s.unit}</span>}
                  </div>
                  <span className="text-sm font-semibold text-[#191C1F] leading-tight mb-0.5">
                    {s.label}
                  </span>
                  <span className="text-xs text-[#191C1F]/50">
                    {s.note}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 3. Value Proposition & Key Differentiators (4 Pillars) */}
        <section className="py-16 sm:py-20 md:py-24 bg-[#F8F9FA] border-y border-[rgba(0,0,0,0.04)]">
          <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-6 md:px-8">
            <div className="max-w-[700px] mb-12 sm:mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#191C1F]/50 mb-2 block">
                Why Choose BCE
              </span>
              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold tracking-[-0.025em] text-[#191C1F] leading-[1.15]">
                A reputation built on precision, capacity, and certified quality.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {current.pillars.map((p, idx) => (
                <div
                  key={idx}
                  className="box-24 p-6 sm:p-7 rounded-[24px] bg-white border-0 shadow-sm flex flex-col justify-between"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                >
                  <div>
                    <div className="size-10 rounded-[12px] bg-[#F0F1F3] text-[#191C1F] flex items-center justify-center font-bold text-sm mb-5">
                      0{idx + 1}
                    </div>
                    <h3 className="text-[18px] font-semibold text-[#191C1F] mb-2.5 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-[14px] text-[#191C1F]/65 leading-[1.55]">
                      {p.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Solutions & Engineering Capabilities Breakdown */}
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-6 md:px-8">
            <div className="max-w-[700px] mb-12 sm:mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#191C1F]/50 mb-2 block">
                Engineering Capabilities
              </span>
              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold tracking-[-0.025em] text-[#191C1F] leading-[1.15]">
                Specialized Solutions &amp; Technical Methodologies
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {current.solutions.map((sol, idx) => (
                <div
                  key={idx}
                  className="box-24 p-8 sm:p-9 rounded-[24px] bg-[#F8F9FA] border-0 flex flex-col justify-between"
                  style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                >
                  <div>
                    <span className="inline-block px-3 py-1 rounded-[8px] bg-[#EAEBED] text-xs font-semibold text-[#191C1F]/70 mb-4">
                      Methodology 0{idx + 1}
                    </span>
                    <h3 className="text-[22px] sm:text-[24px] font-semibold text-[#191C1F] tracking-[-0.015em] mb-3 leading-snug">
                      {sol.title}
                    </h3>
                    <p className="text-[15px] text-[#191C1F]/70 leading-[1.6] mb-6">
                      {sol.description}
                    </p>

                    <div className="pt-4 border-t border-[rgba(0,0,0,0.06)]">
                      <h4 className="text-xs font-bold uppercase tracking-[0.04em] text-[#191C1F]/50 mb-3">
                        Technical Highlights:
                      </h4>
                      <ul className="space-y-2.5 text-[14px] text-[#191C1F]/80">
                        {sol.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <svg viewBox="0 0 16 16" className="size-4 text-[#0075EB] shrink-0 mt-0.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3.5 8.5l3 3 6-6" />
                            </svg>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Fleet & Technical Specifications Table */}
        <section className="py-16 sm:py-20 bg-[#F4F4F5]">
          <div className="max-w-[1000px] w-full mx-auto px-5 sm:px-6 md:px-8">
            <div className="text-center max-w-[600px] mx-auto mb-10">
              <h2 className="text-[26px] sm:text-[32px] font-bold text-[#191C1F] tracking-[-0.02em] mb-2">
                Technical Specifications &amp; Fleet Inventory
              </h2>
              <p className="text-[15px] text-[#191C1F]/60">
                Operational ratings, equipment models, and verified engineering standards.
              </p>
            </div>

            <div
              className="box-24 rounded-[24px] bg-white overflow-hidden shadow-sm border-0 divide-y divide-[rgba(0,0,0,0.06)]"
              style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
            >
              {current.specifications.map((spec, sIdx) => (
                <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 gap-2">
                  <span className="text-sm font-semibold text-[#191C1F]/60 sm:w-1/3">
                    {spec.label}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#191C1F] sm:w-2/3 sm:text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Featured Case Study from BCE Portfolio */}
        {featuredProject && (
          <section className="py-16 sm:py-20 md:py-24 bg-white border-t border-[rgba(0,0,0,0.06)]">
            <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-6 md:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#191C1F]/50 mb-2 block">
                    Proven Track Record
                  </span>
                  <h2 className="text-[28px] sm:text-[36px] font-bold text-[#191C1F] tracking-[-0.025em]">
                    Featured Case Study
                  </h2>
                </div>
                <a
                  href="/?projects"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#191C1F] hover:text-[#0075EB] transition-colors"
                >
                  <span>View all 30 completed projects</span>
                  <span>→</span>
                </a>
              </div>

              {/* Case Study Card (Skanska Style) */}
              <div
                className="box-24 rounded-[24px] bg-[#F8F9FA] overflow-hidden border-0 grid grid-cols-1 lg:grid-cols-12 gap-0"
                style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
              >
                {/* Left: Project Image with 18px Apple-smoothed Corners */}
                <div className="lg:col-span-6 p-4 sm:p-6">
                  <div
                    className="w-full aspect-[16/11] overflow-hidden rounded-[18px] bg-[#EAEBED]"
                    style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                  >
                    <img
                      src={featuredProject.gallery[0].image}
                      alt={featuredProject.name}
                      className="w-full h-full object-cover rounded-[18px]"
                      style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                    />
                  </div>
                </div>

                {/* Right: Project Highlights & Scope */}
                <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#191C1F]/50 mb-2">
                      <span>{featuredProject.location}</span>
                      <span>·</span>
                      <span>{featuredProject.period}</span>
                    </div>

                    <h3 className="text-[24px] sm:text-[28px] font-bold text-[#191C1F] mb-3 leading-snug">
                      {featuredProject.name}
                    </h3>

                    <p className="text-[15px] text-[#191C1F]/70 leading-[1.6] mb-6">
                      {featuredProject.summary}
                    </p>

                    {/* Highlights Grid */}
                    {featuredProject.highlights && (
                      <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-[rgba(0,0,0,0.06)]">
                        {featuredProject.highlights.slice(0, 4).map((h, hIdx) => (
                          <div key={hIdx}>
                            <span className="block text-[24px] font-bold text-[#191C1F] leading-tight">
                              {h.value} {h.unit && <span className="text-sm font-semibold text-[#191C1F]/50">{h.unit}</span>}
                            </span>
                            <span className="text-xs text-[#191C1F]/60 font-medium">
                              {h.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[rgba(0,0,0,0.06)]">
                    <ArrowButton
                      href={projectHref(featuredProject.slug)}
                      label="View full project details"
                      theme="black"
                      className="!self-auto"
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 7. Direct Engineering Consultation & Dispatch Contacts */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[1000px] w-full mx-auto px-5 sm:px-6 md:px-8">
            <div
              className="box-24 p-8 sm:p-10 md:p-12 rounded-[24px] bg-[#191C1F] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
              style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
            >
              <div className="max-w-[540px]">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-white/50 mb-2 block">
                  Direct Preconstruction Consultation
                </span>
                <h3 className="text-[26px] sm:text-[32px] font-bold text-white mb-3 leading-tight">
                  Speak with our {current.shortName} Engineering Team
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-4">
                  Planning a commercial development, infrastructure project, or continuous pour? Our engineers provide mix design submittals, equipment deployment schedules, and competitive transparent tenders.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/60">
                  <span>Dispatch: <a href="tel:012932700" className="text-white font-medium hover:underline">012 932 700</a></span>
                  <span>·</span>
                  <span>Telegram: <a href="https://t.me/thendLP" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:underline">@thendLP</a></span>
                  <span>·</span>
                  <span>HQ: Battambang City</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto">
                <a
                  href={quoteHref(current.slug)}
                  className="inline-flex items-center justify-center gap-2 px-6 h-[46px] rounded-full text-xs font-semibold bg-white text-[#191C1F] hover:bg-white/90 transition-all shadow-sm"
                >
                  <span>Request a Quotation</span>
                  <span>→</span>
                </a>
                <a
                  href="https://t.me/thendLP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 h-[46px] rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                >
                  <span>Direct Telegram Chat</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Next Core Business Preview Navigation */}
        <section className="py-12 bg-[#FAFAFA] border-t border-[rgba(0,0,0,0.06)]">
          <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.08em] font-semibold text-[#191C1F]/40">
              Explore Next Capability
            </span>
            <button
              type="button"
              onClick={() => selectBusiness(current.nextSlug)}
              className="inline-flex items-center gap-3 text-base sm:text-lg font-bold text-[#191C1F] hover:text-[#0075EB] transition-colors border-0 bg-transparent cursor-pointer"
            >
              <span>{current.nextName}</span>
              <span className="size-8 rounded-full bg-[#191C1F] text-white flex items-center justify-center text-xs">
                →
              </span>
            </button>
          </div>
        </section>

        <QuoteCta href={quoteHref(current.slug)} />
        <Footer phones={phones} tel={tel} base="/" />
        <FluidCursor />
      </main>
    </>
  );
}
