// Project template for "Selected Project Experience" (BCE Website Development Recommendation, section 5). One shape
// fits piling, concrete supply, construction, slab works and fleet hire: the core facts and a captioned gallery are
// required; highlights, equipment, technical scope and outcome are optional and their blocks only render when present.
// No floor plans, renders or before/after sliders, since most BCE projects have none.
//
// SAMPLE CONTENT: every project below is illustrative (owners, figures, periods and captions included) and uses
// stand-in Unsplash photography. `sample: true` shows a "Sample content" tag on the page; replace each entry with real
// project records and delete the flag before launch.

export type Category = "Ready-Mix Concrete" | "Piling" | "Construction" | "Concrete Slab Works" | "Truck & Equipment Rental";

export type Project = {
  slug: string;
  name: string;
  owner: string;
  location: string;
  period: string;
  category: Category;
  /** One or two sentences introducing the project. */
  summary: string;
  scope: string[];
  gallery: { image: string; caption: string }[];
  highlights?: { value: string; unit?: string; label: string; note?: string }[];
  equipment?: { name: string; count?: number }[];
  technical?: { label: string; value: string }[];
  outcome?: string;
  sample?: boolean;
};

export const photo = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;
export const projectHref = (slug: string) => `/?project=${slug}`;

export const projects: Project[] = [
  {
    slug: "kampong-thom-bridge-foundations",
    name: "Bridge Foundation Piling",
    owner: "Provincial public works authority",
    location: "Stueng Saen, Kampong Thom",
    period: "Feb 2024 – Sep 2024",
    category: "Piling",
    summary: "Reinforced concrete piles for a two-span river bridge on a provincial road, installed and tested by our own rigs and crews.",
    scope: ["Supply of reinforced concrete piles", "Pile installation at abutments and pier", "Pile cap concrete from our batching plant", "Load testing and as-built records"],
    gallery: [
      { image: photo("photo-1713249245785-59c218919b99"), caption: "Piling rig positioned at the east abutment" },
      { image: photo("photo-1652900150494-90cb5cfa44d8"), caption: "Rotary rig drilling at the pier" },
      { image: photo("photo-1780396140909-ddb449d6f393"), caption: "Piles set out across the foundation area" },
      { image: photo("photo-1764552849226-ff00647a358d"), caption: "Completed piers above the waterline" },
    ],
    highlights: [
      { value: "64", label: "Piles installed", note: "Abutments and pier" },
      { value: "18", unit: "m", label: "Pile length", note: "Average per pile" },
      { value: "420", unit: "m³", label: "Concrete supplied", note: "Pile caps and deck" },
      { value: "7", unit: "mo", label: "Project period", note: "Feb – Sep 2024" },
    ],
    equipment: [{ name: "Piling rigs", count: 2 }, { name: "Mixer trucks", count: 4 }, { name: "Mobile crane", count: 1 }, { name: "Pump truck", count: 1 }],
    technical: [
      { label: "Pile type", value: "Precast RC square pile, 350 × 350 mm" },
      { label: "Concrete grade", value: "C35 piles, C30 pile caps" },
      { label: "Testing", value: "Static load test; cube strength at 7 and 28 days" },
    ],
    outcome: "Foundations were handed over ahead of the rainy season, so deck works could begin without delay.",
    sample: true,
  },
  {
    slug: "poipet-logistics-warehouse",
    name: "Logistics Warehouse Floor Slab",
    owner: "Private logistics developer",
    location: "Poipet, Banteay Meanchey",
    period: "Jun 2024 – Dec 2024",
    category: "Concrete Slab Works",
    summary: "A heavy-duty ground-bearing slab for a cross-border logistics warehouse, poured in planned bays and finished for racking and forklift traffic.",
    scope: ["Sub-base preparation and compaction", "Ready-mix supply from BTB plants", "Slab placement in planned pour bays", "Power-float finish and saw-cut joints"],
    gallery: [
      { image: photo("photo-1649587345666-0f4ad68aa723"), caption: "Warehouse frame rising over the prepared sub-base" },
      { image: photo("photo-1651195297119-afc97f14a40d"), caption: "Crews levelling a pour bay" },
      { image: photo("photo-1685464196387-854858ce0f4f"), caption: "Hand finishing along the slab edge" },
      { image: photo("photo-1662120399978-738d233edbec"), caption: "Roof structure above the completed floor" },
    ],
    highlights: [
      { value: "12,400", unit: "m²", label: "Slab area", note: "Single warehouse floor" },
      { value: "2,600", unit: "m³", label: "Concrete placed", note: "C30 ready-mix" },
      { value: "22", label: "Pour bays", note: "Day pours" },
      { value: "200", unit: "mm", label: "Slab thickness", note: "Mesh reinforced" },
    ],
    equipment: [{ name: "Pump trucks", count: 2 }, { name: "Mixer trucks", count: 8 }, { name: "Power trowels", count: 4 }, { name: "Vibratory roller", count: 1 }],
    technical: [
      { label: "Concrete", value: "C30, slump 100 ± 25 mm" },
      { label: "Finish", value: "Power-floated with dry-shake hardener" },
      { label: "Joints", value: "Saw-cut at 6 m centres, sealed" },
    ],
    outcome: "The floor was ready for racking installation two weeks ahead of the tenant's fit-out.",
    sample: true,
  },
  {
    slug: "siem-reap-commercial-ready-mix",
    name: "Commercial Complex Ready-Mix Supply",
    owner: "Private commercial developer",
    location: "Siem Reap City",
    period: "Jan 2023 – Mar 2024",
    category: "Ready-Mix Concrete",
    summary: "Continuous ready-mix supply for a four-storey commercial complex, scheduled around the contractor's pour programme.",
    scope: ["Mix designs for foundations, columns and slabs", "Scheduled delivery from plant to site", "Pumping for upper-floor slabs", "Slump and cube testing on every pour"],
    gallery: [
      { image: photo("photo-1784644579477-3fa2b0af8ac2"), caption: "Mixer truck discharging beside the excavation" },
      { image: photo("photo-1784644579514-4d62cf323571"), caption: "Deliveries staged around the site" },
      { image: photo("photo-1690719744562-249937b9c03a"), caption: "Mixer truck on arrival at the gate" },
      { image: photo("photo-1712711649566-16c7cfcf341c"), caption: "Columns and formwork ready for the next pour" },
    ],
    highlights: [
      { value: "6,800", unit: "m³", label: "Concrete supplied", note: "Over 15 months" },
      { value: "4", label: "Mix designs", note: "C25 to C35" },
      { value: "1,100", label: "Truck deliveries", note: "Scheduled call-offs" },
      { value: "100", unit: "%", label: "Pours tested", note: "Slump and cubes" },
    ],
    equipment: [{ name: "Mixer trucks", count: 10 }, { name: "Pump trucks", count: 2 }],
    technical: [
      { label: "Grades", value: "C25 slabs, C30 columns, C35 foundations" },
      { label: "Quality control", value: "Slump at discharge; 6 cubes per 50 m³" },
    ],
    sample: true,
  },
  {
    slug: "battambang-provincial-road",
    name: "Provincial Road Rehabilitation",
    owner: "Provincial administration",
    location: "Battambang Province",
    period: "Nov 2023 – May 2024",
    category: "Construction",
    summary: "Rehabilitation of a provincial road link, including sub-base works, drainage and a new asphalt wearing course.",
    scope: ["Earthworks and sub-base", "Culverts and roadside drainage", "Asphalt paving and compaction", "Road markings and handover"],
    gallery: [
      { image: photo("photo-1595734939818-f4e0d44957df"), caption: "Compaction of the new wearing course" },
      { image: photo("photo-1706922685061-e346647bde61"), caption: "Paver laying asphalt on the widened section" },
      { image: photo("photo-1693019108329-1889fb170f2e"), caption: "Finishing crews behind the paver" },
    ],
    highlights: [
      { value: "8.5", unit: "km", label: "Road length", note: "Single carriageway" },
      { value: "7", unit: "m", label: "Carriageway width", note: "Plus shoulders" },
      { value: "14", label: "Culverts installed", note: "Box and pipe" },
    ],
    outcome: "The upgraded link shortened the journey to the district market and keeps traffic moving through the wet season.",
    sample: true,
  },
  {
    slug: "phnom-penh-tower-foundations",
    name: "Mixed-Use Tower Foundations",
    owner: "Private developer",
    location: "Chamkar Mon, Phnom Penh",
    period: "Aug 2024 – Apr 2025",
    category: "Piling",
    summary: "Bored piles and a raft foundation for a mixed-use tower, with reinforcement, concrete and testing delivered by one team.",
    scope: ["Bored cast-in-place piles", "Reinforcement cages fabricated on site", "Continuous raft foundation pour", "Integrity and load testing"],
    gallery: [
      { image: photo("photo-1531834685032-c34bf0d84c77"), caption: "Reinforcement cages assembled for the core walls" },
      { image: photo("photo-1667207591431-0366faabde1a"), caption: "Steel fixers tying column starters" },
      { image: photo("photo-1635249578213-68b0aa67fdf7"), caption: "Reinforcement checked before the raft pour" },
      { image: photo("photo-1694521787162-5373b598945c"), caption: "Raft foundation after the continuous pour" },
    ],
    highlights: [
      { value: "120", label: "Bored piles", note: "800 and 1,000 mm" },
      { value: "32", unit: "m", label: "Pile depth", note: "Below cut-off" },
      { value: "1,850", unit: "m³", label: "Raft pour", note: "Single continuous pour" },
      { value: "9", unit: "mo", label: "Project period", note: "Aug 2024 – Apr 2025" },
    ],
    equipment: [{ name: "Piling rigs", count: 3 }, { name: "Crawler crane", count: 1 }, { name: "Mixer trucks", count: 12 }, { name: "Pump trucks", count: 2 }],
    technical: [
      { label: "Piles", value: "Bored cast-in-place, Ø 800 and 1,000 mm" },
      { label: "Concrete grade", value: "C40 raft, C35 piles" },
      { label: "Raft", value: "2.2 m thick, poured continuously over 26 hours" },
    ],
    outcome: "The raft was completed in a single pour with no cold joints, keeping the superstructure programme on track.",
    sample: true,
  },
  {
    slug: "sihanoukville-fleet-hire",
    name: "Pump & Mixer Fleet Hire",
    owner: "Main contractor, hotel development",
    location: "Preah Sihanouk",
    period: "Mar 2025 – Oct 2025",
    category: "Truck & Equipment Rental",
    summary: "Concrete pump and mixer trucks hired with operators to a main contractor for structural pours on a coastal hotel.",
    scope: ["Pump trucks with experienced operators", "Mixer trucks on daily call-off", "On-site maintenance and refuelling", "Daily equipment reports"],
    gallery: [
      { image: photo("photo-1779518084451-f9a3386015f9"), caption: "Boom pump set up at the street frontage" },
      { image: photo("photo-1777181693263-2a333f0f808d"), caption: "Operators preparing equipment for the day's pour" },
      { image: photo("photo-1504307651254-35680f356dfd"), caption: "Slab reinforcement awaiting the pump" },
    ],
    equipment: [{ name: "Pump trucks", count: 3 }, { name: "Mixer trucks", count: 6 }],
    sample: true,
  },
];

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
