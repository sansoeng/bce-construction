import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { useScrollParallax } from "./ServiceBlocks";
import StickyValues, { type StickyItem } from "./StickyValues";
import { unsplash } from "./company";

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const HR_EMAIL = "bce.hr.1990@gmail.com";

const cultureItems: StickyItem[] = [
  {
    title: "Modern equipment and in-house laboratory",
    text: "Work alongside advanced computerized Sicoma batching plants, digital DYE-2000 compression testing machines, 41 mixer trucks and 8 pump trucks.",
    image: unsplash("/Image/bce/hero_batching_plant.webp", 1600),
    alt: "BCE computerized batching plant and modern fleet",
  },
  {
    title: "Safety-first culture and complete protection",
    text: "Rigorous HSE protocols, certified PPE personal protective equipment, structured site safety briefings, and comprehensive accident insurance for all personnel.",
    image: unsplash("/Image/bce/hse_safety.webp", 1600),
    alt: "BCE safety standards and protective equipment on site",
  },
  {
    title: "30+ years of operational stability and growth",
    text: "Established in 1995, BCE offers dependable long-term employment, engineering mentorship, clear career advancement pathways, and skills certification.",
    image: unsplash("/Image/bce/project_page_17.webp", 1600),
    alt: "BCE construction engineering team collaborating on site",
  },
  {
    title: "Inclusive teamwork and competitive compensation",
    text: "Market-leading compensation, full overtime pay, performance pour dispatch incentives, and daily per diem allowances for provincial deployments.",
    image: unsplash("/Image/bce/chairwoman.webp", 1600),
    alt: "BCE leadership and operational excellence",
  },
];

import { VACANCIES, type Vacancy } from "./careersData";
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

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4 shrink-0"
    aria-hidden
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
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
  const [searchQuery, setSearchQuery] = useState("");
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
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.overview.toLowerCase().includes(q);
      return matchTeam && matchLoc && matchSearch;
    });
  }, [activeTeam, activeLocation, searchQuery]);

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
        <section className="min-h-screen pt-[280px] pb-24 px-5">
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
              <h1 className="text-[34px] md:text-[64px] font-semibold leading-[1.12] tracking-[-0.02em] text-[#191C1F] mb-4">
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
                className="inline-flex items-center justify-center rounded-full bg-[#191C1F] text-white px-8 py-3.5 text-[15px] font-medium hover:bg-black/85 transition-all shadow-sm"
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
                className="inline-flex items-center justify-center rounded-full bg-white text-[#191C1F] px-8 py-3.5 text-[15px] font-medium hover:bg-white/90 transition-all shadow-sm"
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
            VIEW B: CAREERS ARCHIVE (after olympic.no/career-crew)
           ========================================================================= */
        <>
          {/* Full-bleed hero: label, statement and the direct route to the board. */}
          <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-[#191C1F] px-5 pb-12 pt-36 text-white sm:px-6 md:min-h-[82svh] md:px-8 md:pb-16">
            <img
              src={unsplash("/Image/bce/hero_batching_plant.webp", 2200)}
              alt=""
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />
            <div className="w-full max-w-[1000px] 2xl:max-w-[1432px] mx-auto">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/65">Career at BCE</p>
              <h1 className="mt-5 max-w-[16ch] text-[clamp(40px,7.4vw,96px)] font-medium leading-[0.98] tracking-[-0.045em]">
                Build the country. Build your career.
              </h1>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <ArrowButton href="#open-positions" label="See open positions" theme="white" />
                <span className="text-[13px] text-white/60">
                  <span className="font-mono">{VACANCIES.length}</span> roles open now
                </span>
              </div>
            </div>
          </section>

          {/* Label-with-copy: the standfirst sets the tone before the board. */}
          <section id="open-positions" className="scroll-mt-24 px-5 pt-20 sm:px-6 md:px-8 md:pt-28">
            <div className="w-full max-w-[1000px] 2xl:max-w-[1432px] mx-auto grid gap-6 md:grid-cols-12 md:gap-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#191C1F]/45 md:col-span-3">
                Open positions
              </p>
              <p className="max-w-[820px] text-[21px] font-medium leading-[1.3] tracking-[-0.02em] text-[#191C1F] sm:text-[25px] md:col-span-9 md:text-[30px]">
                From computerized batching plants and the in-house laboratory to piling rigs and provincial sites, BCE teams build Cambodia&rsquo;s infrastructure. Join a crew with 30 years of stability, modern equipment and a safety-first culture.
              </p>
            </div>
          </section>

          {/* The board: department pills, location/search, then ruled rows with a dark hover fill. */}
          <section className="px-5 pb-16 pt-14 sm:px-6 md:px-8 md:pb-24 md:pt-20">
            <div className="w-full max-w-[1000px] 2xl:max-w-[1432px] mx-auto">
              <div className="flex flex-col gap-5 border-b border-[#191C1F]/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((dept) => {
                    const isSelected = activeTeam === dept;
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => setActiveTeam(dept)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-[12.5px] font-medium transition-colors ${
                          isSelected
                            ? "bg-[#191C1F] text-white"
                            : "bg-[#F1F2F3] text-[#191C1F] hover:bg-[#E7E8EA]"
                        }`}
                      >
                        <span>{dept}</span>
                        <span className={`font-mono text-[10.5px] ${isSelected ? "text-white/60" : "text-[#191C1F]/40"}`}>
                          {teamCounts[dept] ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Location dropdown */}
                  <div ref={locationRef} className="relative sm:w-[225px]">
                    <button
                      type="button"
                      onClick={() => setIsLocationOpen(!isLocationOpen)}
                      className="flex h-11 w-full items-center justify-between gap-3 rounded-full bg-[#F1F2F3] px-5 text-[13px] font-medium text-[#191C1F] transition-colors hover:bg-[#E7E8EA] cursor-pointer"
                    >
                      <span className="truncate">
                        {activeLocation === "All Locations" ? "All locations" : activeLocation}
                      </span>
                      <ChevronDownIcon open={isLocationOpen} />
                    </button>

                    {isLocationOpen && (
                      <div className="absolute left-0 top-12 z-30 w-[260px] rounded-[16px] border border-[rgba(0,0,0,0.06)] bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.12)] animate-in fade-in duration-150">
                        <div className="max-h-[260px] overflow-y-auto space-y-1">
                          {LOCATIONS.map((loc) => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => {
                                setActiveLocation(loc);
                                setIsLocationOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs rounded-full transition-colors flex items-center justify-between cursor-pointer ${
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

                  {/* Search */}
                  <div className="relative sm:w-[250px]">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${VACANCIES.length} positions`}
                      className="h-11 w-full rounded-full bg-[#F1F2F3] pl-5 pr-11 text-[13px] text-[#191C1F] placeholder-[#72757E] transition-colors hover:bg-[#E7E8EA] focus:bg-white focus:outline-none"
                    />
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#72757E]">
                      <SearchIcon />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column labels on the 12-column rule. */}
              <div className="hidden grid-cols-12 items-center gap-5 border-b border-[#191C1F]/10 py-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#191C1F]/40 md:grid">
                <span className="col-span-5">Role</span>
                <span className="col-span-3">Department</span>
                <span className="col-span-2">Type</span>
                <span className="col-span-2 text-right">Deadline</span>
              </div>

              {filteredVacancies.length === 0 ? (
                <div className="py-20 text-center">
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
                      setSearchQuery("");
                    }}
                    className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-[#191C1F] text-white text-xs font-medium cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div>
                  {filteredVacancies.map((v) => (
                    <a
                      key={v.id}
                      href={`/?recruitment&job=${v.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        handleSelectJob(v.id);
                      }}
                      className="group -mx-4 grid grid-cols-1 items-center gap-2 border-b border-[#191C1F]/10 px-4 py-5 transition-colors duration-300 hover:bg-[#191C1F] hover:text-white md:grid-cols-12 md:gap-5 md:py-6"
                    >
                      <div className="md:col-span-5">
                        <h3 className="text-[20px] font-medium leading-[1.2] tracking-[-0.02em] md:text-[23px]">
                          {v.title}
                        </h3>
                        <p className="mt-1 text-[13px] text-[#191C1F]/45 transition-colors group-hover:text-white/60 md:hidden">
                          {v.department} · {v.type} · {v.deadline}
                        </p>
                      </div>

                      <span className="hidden text-[14px] text-[#5A5D66] transition-colors group-hover:text-white/70 md:col-span-3 md:block">
                        {v.department}
                      </span>

                      <span className="hidden text-[14px] text-[#5A5D66] transition-colors group-hover:text-white/70 md:col-span-2 md:block">
                        {v.type}
                      </span>

                      <span className="hidden items-center justify-end gap-2 md:col-span-2 md:flex">
                        <span className="text-[13px] text-[#5A5D66] transition-colors group-hover:text-white/70">
                          {v.deadline}
                        </span>
                        <svg viewBox="0 0 12 12" className="size-3.5 fill-none stroke-current text-[#191C1F]/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2.6 9.4 9.4 2.6M4.4 2.6h5v5" />
                        </svg>
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Workplace Culture & Why Build Your Career at BCE — Styled like HSE section */}
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
