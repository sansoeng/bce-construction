import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { LeadText, PageHeader, useScrollParallax } from "./ServiceBlocks";
import StickyValues, { type StickyItem } from "./StickyValues";
import { unsplash } from "./company";

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const HR_EMAIL = "bce.hr.1990@gmail.com";

const cultureItems: StickyItem[] = [
  {
    title: "Modern equipment and in-house laboratory",
    text: "Work alongside advanced computerized Sicoma batching plants, digital DYE-2000 compression testing machines, 41 mixer trucks and 8 pump trucks.",
    image: unsplash("/Image/bce/hero_batching_plant.jpg", 1600),
    alt: "BCE computerized batching plant and modern fleet",
  },
  {
    title: "Safety-first culture and complete protection",
    text: "Rigorous HSE protocols, certified PPE personal protective equipment, structured site safety briefings, and comprehensive accident insurance for all personnel.",
    image: unsplash("/Image/bce/hse_safety.jpg", 1600),
    alt: "BCE safety standards and protective equipment on site",
  },
  {
    title: "30+ years of operational stability and growth",
    text: "Established in 1995, BCE offers dependable long-term employment, engineering mentorship, clear career advancement pathways, and skills certification.",
    image: unsplash("/Image/bce/project_page_17.jpg", 1600),
    alt: "BCE construction engineering team collaborating on site",
  },
  {
    title: "Inclusive teamwork and competitive compensation",
    text: "Market-leading compensation, full overtime pay, performance pour dispatch incentives, and daily per diem allowances for provincial deployments.",
    image: unsplash("/Image/bce/chairwoman.jpg", 1600),
    alt: "BCE leadership and operational excellence",
  },
];

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  deadline: string;
  overview: string;
  duties: string[];
  qualifications: string[];
}

export const VACANCIES: Vacancy[] = [
  {
    id: "batching-plant-operator",
    title: "Concrete Batching Plant Operator",
    department: "Operations & Batching",
    location: "Battambang Central Plant",
    type: "Full-Time",
    deadline: "31 March 2026",
    overview:
      "Operate computerized concrete batching plants, oversee automated material weighing according to certified mix designs, and coordinate with mixer truck logistics for continuous large-scale pours.",
    duties: [
      "Operate PLC computerized batching control panels to produce ready-mix concrete per approved ACI 211.1 mix designs.",
      "Monitor aggregate bins, cement silos, water measurement, and admixture dosing systems for operational precision.",
      "Collaborate with quality control lab technicians to verify slump, moisture content, and temperature before truck departure.",
      "Perform daily pre-operational calibration, plant cleaning, and preventative maintenance logs.",
      "Maintain safe batching operations in accordance with BCE Health, Safety, and Environment (HSE) standards.",
    ],
    qualifications: [
      "Vocational diploma or Bachelor's degree in Electrical, Mechanical, or Civil Engineering.",
      "1+ years experience operating computerized concrete batching plants (Sicoma, Simem, or similar).",
      "Familiarity with concrete raw materials, chemical admixtures, and moisture adjustment calculations.",
      "Strong attention to detail, punctuality, and commitment to workplace safety.",
    ],
  },
  {
    id: "qa-materials-engineer",
    title: "Quality Assurance / Materials Testing Engineer",
    department: "Quality & Lab",
    location: "BCE In-House Laboratory, Battambang",
    type: "Full-Time",
    deadline: "31 March 2026",
    overview:
      "Perform physical testing of concrete aggregates, fresh concrete slump inspections, test cylinder casting, and DYE-2000 compressive strength evaluations in BCE's accredited in-house testing facility.",
    duties: [
      "Conduct daily quality control sampling and testing of aggregates, cement, and water per ASTM and ACI standards.",
      "Perform on-site slump tests, temperature checks, and casting of standard 150mm concrete test cylinders.",
      "Operate the DYE-2000 digital compressive testing machine to evaluate 7-day and 28-day breaking strength.",
      "Maintain formal laboratory test logs, calibration certifications, and generate client quality compliance reports.",
      "Review supplier mill test certificates for cement, reinforcement rebar, and chemical admixtures.",
    ],
    qualifications: [
      "Bachelor's degree in Civil Engineering, Materials Science, or Quality Engineering.",
      "Knowledge of ACI 211.1, ASTM C39, and Cambodian construction material standards.",
      "Experience working in a construction materials testing laboratory or ready-mix QA department.",
      "Proficiency in technical reporting, data logging, and quality compliance documentation.",
    ],
  },
  {
    id: "piling-rig-operator",
    title: "Hydraulic Piling Rig Operator & Field Technician",
    department: "Piling & Foundation",
    location: "Site Deployments across Cambodia",
    type: "Full-Time",
    deadline: "15 April 2026",
    overview:
      "Operate hydraulic static pile driving rigs and boring machinery on civil and industrial foundation projects across Cambodia with strict adherence to site safety blueprints.",
    duties: [
      "Operate hydraulic pile driving rigs for precast reinforced concrete piles and deep foundation bored piling.",
      "Ensure precise pile alignment, verticality inspection, and penetration resistance monitoring.",
      "Conduct daily equipment inspection, hydraulic pressure checks, lubrication, and safety maintenance.",
      "Coordinate with site engineers and survey teams to execute foundation layouts per engineering blueprints.",
      "Comply with site safety protocols including full PPE and exclusion zone management during rig operation.",
    ],
    qualifications: [
      "Certified heavy machinery / hydraulic rig operator license.",
      "3+ years experience operating hydraulic pile driving equipment or bored piling rigs in Cambodia.",
      "Strong understanding of soil resistance, pile driving safety, and site hazard prevention.",
      "Willingness to deploy to provincial project sites with full company accommodation and per diem.",
    ],
  },
  {
    id: "heavy-fleet-mechanic",
    title: "Heavy Fleet Maintenance Technician",
    department: "Fleet Logistics",
    location: "Battambang Central Workshop",
    type: "Full-Time",
    deadline: "15 April 2026",
    overview:
      "Maintain and service BCE's fleet of 41 mixer trucks and 8 concrete boom and line pumps to ensure peak operational reliability, rapid turnaround, and zero breakdown during active pours.",
    duties: [
      "Perform preventative maintenance, oil changes, brake inspections, and tire servicing across heavy truck fleet.",
      "Diagnose and repair hydraulic motors, pump gearboxes, rotating drum systems, and pneumatic valves.",
      "Support emergency site repairs during active concrete pours when necessary.",
      "Maintain spare parts inventory logs, workshop safety compliance, and fleet maintenance records.",
      "Ensure all trucks and pumping equipment meet strict road safety standards before site dispatch.",
    ],
    qualifications: [
      "Technical certificate or diploma in Heavy Vehicle Mechanics, Diesel Technology, or Hydraulic Systems.",
      "2+ years experience servicing commercial diesel trucks (Hino, Isuzu, Howo, or similar heavy chassis).",
      "Hands-on expertise with hydraulic pump systems, high-pressure hoses, and power take-off (PTO) units.",
      "Hardworking, disciplined, and capable of working in shifts during major pour schedules.",
    ],
  },
  {
    id: "site-civil-engineer",
    title: "Site Civil Engineer — Ready-Mix & Foundation Works",
    department: "Civil Construction",
    location: "Site Deployments across Cambodia",
    type: "Full-Time",
    deadline: "30 April 2026",
    overview:
      "Supervise continuous concrete pour execution, foundation piling works, and structural civil projects. Ensure compliance with engineering drawings, client specifications, and HSE protocols.",
    duties: [
      "Oversee on-site concrete casting, vibration, level finishing, and initial curing for structural foundations and industrial slabs.",
      "Inspect reinforcing steel placement, formwork stability, and pile head preparation prior to concrete pour approval.",
      "Coordinate with batching plant dispatch to maintain smooth truck delivery intervals and avoid cold joints.",
      "Conduct daily site toolbox talks and enforce occupational safety standards across all subcontractors and field crews.",
      "Prepare daily site progress reports, concrete volume reconciliation, and quality documentation.",
    ],
    qualifications: [
      "Bachelor's degree in Civil Engineering, Structural Engineering, or Building Technology.",
      "2+ years experience in structural construction, ready-mix concrete pouring, or foundation piling in Cambodia.",
      "Proficiency in AutoCAD, construction blueprint reading, and structural bar bending schedules.",
      "Strong leadership, problem-solving, and bilingual communication skills (Khmer / English).",
    ],
  },
];

const DEPARTMENTS = [
  "All teams",
  "Operations & Batching",
  "Quality & Lab",
  "Civil Construction",
  "Piling & Foundation",
  "Fleet Logistics",
];

const LOCATIONS = [
  "All Locations",
  "Battambang Central Plant",
  "BCE In-House Laboratory, Battambang",
  "Battambang Central Workshop",
  "Site Deployments across Cambodia",
];

// Revolut-style SVG Icons
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-[#72757E]" aria-hidden>
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
  </svg>
);

const ToolsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-[#72757E]" aria-hidden>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-[#72757E]" aria-hidden>
    <rect width="20" height="14" x="2" y="7" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-[#72757E]" aria-hidden>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

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

export default function RecruitmentPage() {
  usePageSetup("Careers & Recruitment | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  // Read initial job ID from URL query if present (e.g. ?recruitment&job=...)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("job");
  });

  const [activeTeam, setActiveTeam] = useState<string>("All teams");
  const [activeLocation, setActiveLocation] = useState<string>("All Locations");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Synchronize browser history / deep link
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedJobId(params.get("job"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Close location dropdown on click outside
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleSelectJob = (id: string) => {
    setSelectedJobId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("job", id);
    window.history.pushState(null, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setSelectedJobId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("job");
    window.history.pushState(null, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter positions
  const filteredVacancies = useMemo(() => {
    return VACANCIES.filter((v) => {
      const matchTeam = activeTeam === "All teams" || v.department === activeTeam;
      const matchLoc = activeLocation === "All Locations" || v.location === activeLocation;
      return matchTeam && matchLoc;
    });
  }, [activeTeam, activeLocation]);

  // Counts by team
  const teamCounts = useMemo(() => {
    const counts: Record<string, number> = { "All teams": VACANCIES.length };
    DEPARTMENTS.slice(1).forEach((dept) => {
      counts[dept] = VACANCIES.filter((v) => v.department === dept).length;
    });
    return counts;
  }, []);

  // Counts by location
  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Locations": VACANCIES.length };
    LOCATIONS.slice(1).forEach((loc) => {
      counts[loc] = VACANCIES.filter((v) => v.location === loc).length;
    });
    return counts;
  }, []);

  const mailtoFor = (title: string) => {
    const subject = encodeURIComponent(`Job Application - ${title}`);
    const body = encodeURIComponent(
      `Dear BCE Recruitment Team,\n\nI am writing to express my interest in the position of ${title} at Battambang Construction and Engineering, Co., Ltd. (BCE).\n\nPlease find my CV, relevant licenses, and academic certificates attached.\n\nFull Name: \nPhone Number: \nCurrent Location: \nAvailable Start Date: \n\nThank you for your consideration.\n`
    );
    return `mailto:${HR_EMAIL}?subject=${subject}&body=${body}`;
  };

  const currentJob = VACANCIES.find((v) => v.id === selectedJobId);

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#191C1F]">

      {/* =========================================================================
          VIEW A: DEDICATED JOB DETAILS PAGE (Revolut Style)
         ========================================================================= */}
      {selectedJobId && currentJob ? (
        <section className="min-h-screen pt-28 pb-24 px-5">
          <div className="max-w-[760px] mx-auto">
            {/* Back to all positions button */}
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#72757E] hover:text-[#191C1F] transition-colors mb-10 cursor-pointer"
            >
              <span>←</span>
              <span>All positions</span>
            </button>

            {/* Header: Title & Meta Tags */}
            <div className="text-left mb-10">
              <h1 className="text-[34px] md:text-[44px] font-bold leading-[1.12] tracking-[-0.02em] text-[#191C1F] mb-4">
                {currentJob.title}
              </h1>

              {/* Revolut Meta Lines */}
              <div className="space-y-2 text-sm text-[#5A5D66] mb-8">
                <div className="flex items-center gap-2">
                  <BuildingIcon />
                  <span>Plant: {currentJob.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BriefcaseIcon />
                  <span>
                    Department: {currentJob.department} · {currentJob.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon />
                  <span>Application Deadline: {currentJob.deadline}</span>
                </div>
              </div>

              {/* Primary Apply Pill Button */}
              <a
                href={mailtoFor(currentJob.title)}
                className="inline-flex items-center justify-center rounded-full bg-[#191C1F] text-white px-8 py-3.5 text-[15px] font-semibold hover:bg-black/85 transition-all shadow-sm"
              >
                Apply for this role
              </a>
            </div>

            <div className="h-px w-full bg-[#191C1F]/10 my-10" />

            {/* Section 1: About BCE */}
            <div className="mb-10">
              <h3 className="text-[22px] font-bold text-[#191C1F] mb-3">About BCE</h3>
              <p className="text-[15px] leading-[1.65] text-[#333]">
                Battambang Construction and Engineering, Co., Ltd. (BCE) is one of Western Cambodia's leading construction, concrete, and foundation engineering companies. Operating 4 batching plants, a fleet of 41 mixers, 8 concrete pumps, and an accredited in-house testing laboratory, our team of 71 professionals builds major national infrastructure, industrial complexes, and landmark civil projects across Cambodia.
              </p>
            </div>

            {/* Section 2: About the Role */}
            <div className="mb-10">
              <h3 className="text-[22px] font-bold text-[#191C1F] mb-3">About the role</h3>
              <p className="text-[15px] leading-[1.65] text-[#333]">
                {currentJob.overview}
              </p>
            </div>

            {/* Section 3: What you'll be doing */}
            <div className="mb-10">
              <h3 className="text-[22px] font-bold text-[#191C1F] mb-4">What you’ll be doing</h3>
              <ul className="space-y-3 text-[15px] leading-[1.65] text-[#333]">
                {currentJob.duties.map((duty, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="size-1.5 rounded-full bg-[#191C1F] mt-2.5 shrink-0" />
                    <span>{duty}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4: What you'll need */}
            <div className="mb-12">
              <h3 className="text-[22px] font-bold text-[#191C1F] mb-4">What you'll need</h3>
              <ul className="space-y-3 text-[15px] leading-[1.65] text-[#333]">
                {currentJob.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="size-1.5 rounded-full bg-[#191C1F] mt-2.5 shrink-0" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 5: Compensation & Benefits Cards (Revolut Style) */}
            <div className="mb-14 p-8 rounded-[16px] bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)]">
              <h3 className="text-[20px] font-bold text-[#191C1F] mb-6">
                Compensation &amp; Benefits
              </h3>
              <div className="grid sm:grid-cols-2 gap-6 text-sm text-[#333]">
                <div>
                  <h4 className="font-semibold text-[#191C1F] mb-1">Competitive Compensation</h4>
                  <p className="text-[#5A5D66] leading-[1.55]">
                    Market-leading base salary, full overtime compensation, and performance pour dispatch incentives.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#191C1F] mb-1">Safety &amp; Health Insurance</h4>
                  <p className="text-[#5A5D66] leading-[1.55]">
                    Certified personal protective equipment (PPE), rigorous HSE on-site training, and comprehensive accident insurance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#191C1F] mb-1">Accommodation &amp; Per Diem</h4>
                  <p className="text-[#5A5D66] leading-[1.55]">
                    Full company accommodation and generous daily per diem provided for all provincial site deployments.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#191C1F] mb-1">Ongoing Training</h4>
                  <p className="text-[#5A5D66] leading-[1.55]">
                    Direct hands-on technical training with Sicoma computerized batching systems and ASTM/ACI testing protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Apply Card */}
            <div className="p-8 rounded-[16px] bg-[#191C1F] text-white text-center">
              <h3 className="text-[24px] font-bold mb-2">Ready to build with BCE?</h3>
              <p className="text-white/70 text-sm max-w-[480px] mx-auto mb-6 leading-[1.6]">
                Submit your application directly via email with your CV, relevant licenses, and contact information attached.
              </p>
              <a
                href={mailtoFor(currentJob.title)}
                className="inline-flex items-center justify-center rounded-full bg-white text-[#191C1F] px-8 py-3.5 text-[15px] font-semibold hover:bg-white/90 transition-all shadow-sm"
              >
                Apply for this role
              </a>
              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/50 flex flex-wrap items-center justify-center gap-4">
                <span>Recruitment Inbox: <a href={`mailto:${HR_EMAIL}`} className="text-white hover:underline">{HR_EMAIL}</a></span>
                <span>·</span>
                <span>Hotline: <a href="tel:012932700" className="text-white hover:underline">012 932 700</a></span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* =========================================================================
            VIEW B: REVOLUT-STYLE CAREERS SEARCH & LISTING PAGE
           ========================================================================= */
        <>
          {/* Header after olympic.no's inner pages: label, title, banner, then introduction. */}
          <PageHeader
            label="Careers"
            title="Build your future with BCE"
            image={unsplash("/Image/bce/hse_safety.jpg", 2400)}
            alt="BCE engineering team and career opportunities"
          />

          <LeadText className="ol-lead--tight">
            Join a team of 71 dedicated engineers, heavy equipment specialists, and site professionals building Cambodia's infrastructure since 1995. We offer competitive compensation, technical training, and a safe, inclusive workplace.
          </LeadText>

          {/* Revolut Careers Search & Two-Column Listing Section */}
          <section className="px-5 md:px-8 py-16 md:py-20 border-t border-[rgba(17,17,17,0.08)]">
            <div className="mx-auto max-w-[1240px]">
              {/* Revolut Display Hero Headline */}
              <div className="mb-10">
                <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.025em] text-[#191C1F] leading-[1.12]">
                  We have {VACANCIES.length} open positions
                </h2>
                <p className="mt-2 text-base text-[#72757E]">
                  The future of infrastructure and ready-mix concrete in Cambodia. Be the one who builds it.
                </p>
              </div>

              {/* Location Filter Bar (Search removed) */}
              <div className="flex items-center gap-3 mb-10">
                {/* Location Filter Dropdown Pill */}
                <div ref={locationRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                    className="flex items-center justify-between gap-3 h-12 px-6 rounded-full bg-[#F3F4F6] hover:bg-[#EAEBED] transition-colors text-sm font-medium text-[#191C1F] cursor-pointer w-[220px]"
                  >
                    <span className="truncate">
                      {activeLocation === "All Locations" ? "Location" : activeLocation}
                    </span>
                    <ChevronDownIcon open={isLocationOpen} />
                  </button>

                  {/* Dropdown Floating Popover */}
                  {isLocationOpen && (
                    <div className="absolute top-14 left-0 z-30 w-[280px] p-2 bg-white rounded-[16px] shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] animate-in fade-in duration-150">
                      <div className="max-h-[260px] overflow-y-auto space-y-1">
                        {LOCATIONS.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              setActiveLocation(loc);
                              setIsLocationOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 text-xs rounded-[8px] transition-colors flex items-center justify-between cursor-pointer ${
                              activeLocation === loc
                                ? "bg-[#191C1F] text-white font-medium"
                                : "text-[#191C1F] hover:bg-[#F3F4F6]"
                            }`}
                          >
                            <span className="truncate">{loc}</span>
                            <span className={`text-[11px] font-mono ml-2 ${activeLocation === loc ? "text-white/70" : "text-[#72757E]"}`}>
                              {locationCounts[loc] || 0}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Revolut Two-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Sidebar: Filter by teams */}
                <aside className="md:col-span-4 lg:col-span-4 sticky top-24">
                  <h3 className="text-sm font-semibold text-[#191C1F] uppercase tracking-[0.04em] mb-4">
                    Filter by teams
                  </h3>
                  <div className="flex flex-row md:flex-col flex-wrap gap-1">
                    {DEPARTMENTS.map((dept) => {
                      const isSelected = activeTeam === dept;
                      const count = teamCounts[dept] || 0;
                      return (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => setActiveTeam(dept)}
                          className={`flex items-center justify-between text-left px-4 py-2.5 rounded-full text-sm transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#F3F4F6] text-[#191C1F] font-semibold"
                              : "text-[#5A5D66] hover:bg-[#F3F4F6]/60 hover:text-[#191C1F]"
                          }`}
                        >
                          <span>{dept}</span>
                          <span className={`text-xs font-mono ml-3 ${isSelected ? "text-[#191C1F]" : "text-[#72757E]"}`}>
                            · {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </aside>

                {/* Right Column: Roles Feed */}
                <div className="md:col-span-8 lg:col-span-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-[#191C1F]">
                      Featured roles
                    </h3>
                    <span className="text-xs text-[#72757E] font-mono">
                      {filteredVacancies.length} {filteredVacancies.length === 1 ? "position" : "positions"}
                    </span>
                  </div>

                  {filteredVacancies.length === 0 ? (
                    <div className="py-20 text-center rounded-[16px] bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)]">
                      <p className="text-[17px] font-medium text-[#191C1F]">
                        There are currently no open positions.
                      </p>
                      <p className="mt-2 text-sm text-[#72757E] max-w-[420px] mx-auto">
                        No roles matched your current filters. You may reset your search or send an open CV to{" "}
                        <a href={`mailto:${HR_EMAIL}?subject=General%20Application%20-%20BCE`} className="underline underline-offset-4 text-[#191C1F] font-medium">
                          {HR_EMAIL}
                        </a>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTeam("All teams");
                          setActiveLocation("All Locations");
                        }}
                        className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-[#191C1F] text-white text-xs font-medium cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {filteredVacancies.map((v) => (
                        <article
                          key={v.id}
                          onClick={() => handleSelectJob(v.id)}
                          className="group block p-6 rounded-[16px] bg-[#F8F9FA] hover:bg-[#F0F1F3] transition-all duration-200 cursor-pointer border border-[rgba(0,0,0,0.02)]"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h4 className="text-[20px] md:text-[22px] font-semibold text-[#191C1F] group-hover:text-black transition-colors mb-2 leading-snug">
                                {v.title}
                              </h4>
                              <div className="space-y-1.5 text-xs md:text-sm text-[#5A5D66]">
                                <div className="flex items-center gap-2">
                                  <BuildingIcon />
                                  <span>Plant: {v.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ToolsIcon />
                                  <span>
                                    {v.department} · {v.type} · Deadline: {v.deadline}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="self-end md:self-center shrink-0">
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#191C1F] opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>View</span>
                                <span>→</span>
                              </span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* How to Apply Section — Designed in the About Us Heritage / Split Message Style (Image 4) */}
          <section className="px-5 md:px-8 py-16 md:py-20 bg-white border-t border-[rgba(17,17,17,0.08)]">
            <div className="mx-auto max-w-[1240px]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Left Column: Quote with vertical bar & hung quotation mark (Image 4) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative pl-8 border-l border-[#111]">
                    <span className="absolute -top-3 left-4 text-3xl font-serif leading-none select-none text-[#111]" aria-hidden>
                      “
                    </span>
                    <blockquote className="text-[clamp(1.35rem,2vw,1.75rem)] font-normal leading-[1.38] text-[#111]">
                      <p className="indent-5">
                        We review applications on a rolling basis. All submissions are treated with strict confidentiality in accordance with candidate privacy guidelines.
                      </p>
                    </blockquote>
                    <p className="mt-8 text-sm md:text-base font-medium text-[#111]/70">
                      <span>Human Resources Department, BCE., Ltd.</span>
                    </p>
                    <div className="mt-6 pt-6 border-t border-[rgba(17,17,17,0.1)]">
                      <span className="block text-[11px] font-mono uppercase tracking-[0.08em] text-[#111]/50 mb-1">
                        Recruitment Inbox
                      </span>
                      <a
                        href={`mailto:${HR_EMAIL}`}
                        className="text-base font-semibold text-[#1f367e] hover:text-[#111] transition-colors break-all"
                      >
                        {HR_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Application Process & Steps (matching About Us Story & Milestone List) */}
                <div className="lg:col-span-7">
                  <p data-split="content" className="ol-label mb-2">Application Process</p>
                  <h2 data-split className="text-[28px] md:text-[38px] font-medium leading-[1.12] tracking-[-0.02em] text-[#111] mb-4">
                    How to Apply
                  </h2>
                  <p className="text-sm md:text-base leading-[1.6] text-[#111]/60 mb-8 max-w-[620px]">
                    Join BCE’s integrated operations delivering ready-mix concrete, piling, civil construction, and heavy machinery across Cambodia.
                  </p>

                  <ol className="divide-y divide-[rgba(17,17,17,0.1)] border-t border-b border-[rgba(17,17,17,0.1)]">
                    {/* Step 01 */}
                    <li className="py-7 grid grid-cols-[4rem_1fr] sm:grid-cols-[5.5rem_1fr] gap-4 sm:gap-6 items-baseline">
                      <span className="text-2xl sm:text-3xl font-mono font-medium text-[#111]">
                        01
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-[#111] mb-1.5">
                          Prepare Your CV &amp; Documents
                        </h3>
                        <p className="text-sm leading-[1.6] text-[#111]/70">
                          Please attach an updated CV (Curriculum Vitae), educational certificates, and copies of any relevant licenses (e.g. heavy equipment operator license or engineering certification).
                        </p>
                      </div>
                    </li>

                    {/* Step 02 */}
                    <li className="py-7 grid grid-cols-[4rem_1fr] sm:grid-cols-[5.5rem_1fr] gap-4 sm:gap-6 items-baseline">
                      <span className="text-2xl sm:text-3xl font-mono font-medium text-[#111]">
                        02
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-[#111] mb-1.5">
                          Include Required Contact Information
                        </h3>
                        <p className="text-sm leading-[1.6] text-[#111]/70">
                          In your email body, please explicitly include your full legal name, active telephone contact number, and your current residential location.
                        </p>
                      </div>
                    </li>

                    {/* Step 03 */}
                    <li className="py-7 grid grid-cols-[4rem_1fr] sm:grid-cols-[5.5rem_1fr] gap-4 sm:gap-6 items-baseline">
                      <span className="text-2xl sm:text-3xl font-mono font-medium text-[#111]">
                        03
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-[#111] mb-1.5">
                          Specify the Job Title in Subject Line
                        </h3>
                        <p className="text-sm leading-[1.6] text-[#111]/70">
                          Send your application to <span className="font-medium text-[#111]">{HR_EMAIL}</span> with the exact position title in the email subject (e.g. <em>Job Application - Concrete Batching Plant Operator</em>).
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Workplace Culture & Why Build Your Career at BCE — Styled like HSE section (Image 3) */}
          <StickyValues
            id="culture"
            label="BCE Workplace Culture"
            heading="Why Build Your Career at BCE: stability, modern fleet, safety and professional growth"
            items={cultureItems}
          />
        </>
      )}

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
    </>
  );
}
