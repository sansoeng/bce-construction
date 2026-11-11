import { useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { LeadText, PageHeader, useScrollParallax } from "./ServiceBlocks";
import { unsplash } from "./company";

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const HR_EMAIL = "bce.hr.1990@gmail.com";

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
    overview: "Operate computerized concrete batching plants, oversee automated material weighing according to certified mix designs, and coordinate with mixer truck logistics.",
    duties: [
      "Operate PLC computerized batching control panels to produce ready-mix concrete per approved ACI 211.1 mix designs.",
      "Monitor aggregate bins, cement silos, water measurement, and admixture dosing systems for accuracy.",
      "Collaborate with quality control lab technicians to verify slump, moisture content, and temperature before truck departure.",
      "Perform daily pre-operational calibration, plant cleaning, and preventative maintenance logs.",
    ],
    qualifications: [
      "Vocational diploma or Bachelor's degree in Electrical, Mechanical, or Civil Engineering.",
      "1+ years experience operating computerized concrete batching plants (Sicoma, Simem, or similar).",
      "Familiarity with concrete raw materials, admixtures, and moisture adjustment calculations.",
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
    overview: "Perform physical testing of concrete aggregates, fresh concrete slump inspections, test cylinder casting, and DYE-2000 compressive strength evaluations.",
    duties: [
      "Conduct daily quality control sampling and testing of aggregates, cement, and water per ASTM and ACI standards.",
      "Perform on-site slump tests, temperature checks, and casting of standard 150mm concrete test cylinders.",
      "Operate the DYE-2000 digital compressive testing machine to evaluate 7-day and 28-day breaking strength.",
      "Maintain formal laboratory test logs, calibration certifications, and generate client quality compliance reports.",
    ],
    qualifications: [
      "Bachelor's degree in Civil Engineering, Materials Science, or Quality Engineering.",
      "Knowledge of ACI 211.1, ASTM C39, and Cambodian construction material standards.",
      "Experience working in a construction materials testing laboratory or ready-mix QA department.",
      "Proficiency in technical reporting and quality documentation.",
    ],
  },
  {
    id: "piling-rig-operator",
    title: "Hydraulic Piling Rig Operator & Field Technician",
    department: "Piling & Foundation",
    location: "Site Deployments across Cambodia",
    type: "Full-Time",
    deadline: "15 April 2026",
    overview: "Operate hydraulic pile driving rigs and boring machinery on civil and industrial foundation projects with strict adherence to site safety.",
    duties: [
      "Operate hydraulic pile driving rigs for precast reinforced concrete piles and bored piling operations.",
      "Ensure precise pile alignment, verticality inspection, and penetration resistance monitoring.",
      "Conduct daily equipment inspection, hydraulic pressure checks, lubrication, and safety maintenance.",
      "Coordinate with site engineers and survey teams to execute foundation layouts per engineering blueprints.",
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
    overview: "Maintain and service BCE's fleet of 41 mixer trucks and 8 concrete boom and line pumps to ensure peak operational reliability and safety.",
    duties: [
      "Perform preventative maintenance, oil changes, brake inspections, and tire servicing across heavy truck fleet.",
      "Diagnose and repair hydraulic motors, pump gearboxes, rotating drum systems, and pneumatic valves.",
      "Support emergency site repairs during active concrete pours when necessary.",
      "Maintain spare parts inventory logs and workshop safety compliance.",
    ],
    qualifications: [
      "Technical certificate or diploma in Heavy Vehicle Mechanics, Diesel Technology, or Hydraulic Systems.",
      "2+ years experience servicing commercial diesel trucks (Hino, Isuzu, Howo, or similar heavy chassis).",
      "Hands-on expertise with hydraulic pump systems, high-pressure hoses, and power take-off (PTO) units.",
      "Hardworking, disciplined, and capable of working in shifts during major pour schedules.",
    ],
  },
];

const DEPARTMENTS = ["All", "Operations & Batching", "Quality & Lab", "Piling & Foundation", "Fleet Logistics"];

export default function RecruitmentPage() {
  usePageSetup("Careers & Recruitment | BCE., Ltd.");
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  const [activeDept, setActiveDept] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>("batching-plant-operator");
  const [vacancies] = useState<Vacancy[]>(VACANCIES);

  const filteredVacancies = activeDept === "All"
    ? vacancies
    : vacancies.filter((v) => v.department === activeDept);

  const mailtoFor = (title: string) => {
    const subject = encodeURIComponent(`Job Application - ${title}`);
    const body = encodeURIComponent(
      `Dear BCE Recruitment Team,\n\nI am writing to express my interest in the position of ${title} at Battambang Construction and Engineering, Co., Ltd. (BCE).\n\nPlease find my CV and qualifications attached.\n\nFull Name: \nPhone Number: \nCurrent Location: \nAvailable Start Date: \n\nThank you for your consideration.\n`
    );
    return `mailto:${HR_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <main ref={rootRef} className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

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

      {/* Vacancies Section (Current Openings at the Top per PDF recommendation) */}
      <section className="px-5 py-12 md:py-16 border-t border-[rgba(17,17,17,0.08)]">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p data-split="content" className="ol-label mb-2">Current Openings</p>
              <h2 data-split className="text-[28px] md:text-[38px] font-medium leading-[1.12] tracking-[-0.02em]">
                Explore Career Opportunities
              </h2>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter positions by department">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  role="tab"
                  aria-selected={activeDept === dept}
                  onClick={() => setActiveDept(dept)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-[4px] transition-colors ${
                    activeDept === dept
                      ? "bg-[#111] text-white"
                      : "bg-[#f4f4f5] text-[#111]/70 hover:bg-[#e4e4e7] hover:text-[#111]"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Vacancies List or Empty State */}
          {filteredVacancies.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-[rgba(17,17,17,0.15)] rounded-[4px] bg-[#fafafa]">
              <p className="text-[17px] font-medium text-[#111]">
                There are currently no open positions.
              </p>
              <p className="mt-2 text-sm text-[#111]/60 max-w-[420px] mx-auto">
                We periodically post openings for plant operators, engineers, and technicians. You may send an open CV to{" "}
                <a href={`mailto:${HR_EMAIL}?subject=General%20Application%20-%20BCE`} className="underline underline-offset-4 text-[#111] font-medium">
                  {HR_EMAIL}
                </a>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVacancies.map((v, i) => {
                const isExpanded = expandedId === v.id;
                return (
                  <article
                    key={v.id}
                    className="border border-[rgba(17,17,17,0.12)] rounded-[4px] bg-white transition-all overflow-hidden"
                  >
                    {/* Header Row / Summary */}
                    <div
                      className="p-6 cursor-pointer select-none hover:bg-[#fafafa] transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : v.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5 mb-2">
                            <span className="text-[11px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 bg-[#f0f0f2] text-[#111]/70 rounded-[2px]">
                              {v.department}
                            </span>
                            <span className="text-[11px] font-mono text-[#111]/50">
                              Deadline: {v.deadline}
                            </span>
                          </div>
                          <h3 className="text-[20px] md:text-[23px] font-medium text-[#111]">
                            {v.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#111]/60">
                            <span className="flex items-center gap-1.5">
                              <svg viewBox="0 0 12 12" className="size-3.5 fill-none stroke-current" aria-hidden>
                                <circle cx="6" cy="5" r="3" strokeWidth="1.2" />
                                <path d="M6 8v3M4 11h4" strokeWidth="1.2" />
                              </svg>
                              {v.location}
                            </span>
                            <span>·</span>
                            <span>{v.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-start md:self-center">
                          <button
                            type="button"
                            className="text-xs font-mono uppercase tracking-[0.06em] text-[#1f367e] hover:text-[#111] flex items-center gap-1.5 transition-colors"
                            aria-expanded={isExpanded}
                          >
                            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                            <span className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                              ↓
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Job Duties & Qualifications */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-[rgba(17,17,17,0.08)] bg-[#fcfcfc] animate-in fade-in duration-200">
                        <p className="text-sm leading-[1.6] text-[#111]/80 mb-6">
                          {v.overview}
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                          {/* Duties */}
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-[0.08em] text-[#111]/50 mb-3">
                              Main Duties &amp; Responsibilities
                            </h4>
                            <ul className="space-y-2 text-xs md:text-sm leading-[1.55] text-[#111]/85">
                              {v.duties.map((d, di) => (
                                <li key={di} className="flex items-start gap-2.5">
                                  <span className="text-[#1f367e] font-bold mt-0.5">•</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Qualifications */}
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-[0.08em] text-[#111]/50 mb-3">
                              Required Qualifications &amp; Skills
                            </h4>
                            <ul className="space-y-2 text-xs md:text-sm leading-[1.55] text-[#111]/85">
                              {v.qualifications.map((q, qi) => (
                                <li key={qi} className="flex items-start gap-2.5">
                                  <span className="text-[#1f367e] font-bold mt-0.5">•</span>
                                  <span>{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Apply Now CTA */}
                        <div className="pt-4 border-t border-[rgba(17,17,17,0.08)] flex flex-wrap items-center justify-between gap-4">
                          <div className="text-xs text-[#111]/60">
                            Apply directly via email with your CV and contact info attached.
                          </div>
                          <ArrowButton
                            href={mailtoFor(v.title)}
                            label={`Apply for ${v.title}`}
                            theme="black"
                          />
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How to Apply Section (Specified in PDF recommendation) */}
      <section className="px-5 py-16 md:py-24 bg-[#f8f8f9] border-t border-[rgba(17,17,17,0.08)]">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-5">
              <p data-split="content" className="ol-label mb-2">Application Process</p>
              <h2 data-split className="text-[28px] md:text-[38px] font-medium leading-[1.12] tracking-[-0.02em] text-[#111]">
                How to Apply
              </h2>
              <p className="mt-4 text-sm md:text-base leading-[1.6] text-[#111]/70">
                We review applications on a rolling basis. All submissions are treated with strict confidentiality in accordance with candidate privacy guidelines.
              </p>

              <div className="mt-8 p-5 rounded-[4px] bg-white border border-[rgba(17,17,17,0.08)]">
                <span className="block text-[11px] font-mono uppercase tracking-[0.08em] text-[#111]/50 mb-1">
                  Recruitment Inbox
                </span>
                <a
                  href={`mailto:${HR_EMAIL}`}
                  className="text-base font-medium text-[#1f367e] hover:text-[#111] transition-colors break-all"
                >
                  {HR_EMAIL}
                </a>
                <p className="text-xs text-[#111]/55 mt-2 leading-[1.5]">
                  Our recruitment inbox automatically issues an acknowledgement receipt upon email arrival.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 space-y-6">
              {/* Step 1 */}
              <div className="p-6 rounded-[4px] bg-white border border-[rgba(17,17,17,0.08)]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid size-6 place-items-center rounded-full bg-[#111] text-white text-xs font-mono">1</span>
                  <h3 className="font-medium text-base text-[#111]">Prepare Your CV &amp; Documents</h3>
                </div>
                <p className="text-sm leading-[1.6] text-[#111]/70 pl-9">
                  Please attach an updated CV (Curriculum Vitae), educational certificates, and copies of any relevant licenses (e.g. heavy equipment operator license or engineering certification).
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-[4px] bg-white border border-[rgba(17,17,17,0.08)]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid size-6 place-items-center rounded-full bg-[#111] text-white text-xs font-mono">2</span>
                  <h3 className="font-medium text-base text-[#111]">Include Required Contact Information</h3>
                </div>
                <p className="text-sm leading-[1.6] text-[#111]/70 pl-9">
                  In your email body, please explicitly include your full legal name, active telephone contact number, and your current residential location.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-[4px] bg-white border border-[rgba(17,17,17,0.08)]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid size-6 place-items-center rounded-full bg-[#111] text-white text-xs font-mono">3</span>
                  <h3 className="font-medium text-base text-[#111]">Specify the Job Title in Subject Line</h3>
                </div>
                <p className="text-sm leading-[1.6] text-[#111]/70 pl-9">
                  Send your application to <span className="font-medium text-[#111]">{HR_EMAIL}</span> with the exact position title in the email subject (e.g. <em>Job Application - Concrete Batching Plant Operator</em>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work at BCE */}
      <section className="px-5 py-16 md:py-20 border-t border-[rgba(17,17,17,0.08)]">
        <div className="mx-auto max-w-[1240px]">
          <p data-split="content" className="ol-label mb-2">BCE Workplace Culture</p>
          <h2 data-split className="text-[28px] md:text-[38px] font-medium leading-[1.12] tracking-[-0.02em] mb-12">
            Why Build Your Career at BCE
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-[4px] border border-[rgba(17,17,17,0.08)] bg-[#fafafa]">
              <span className="text-[11px] font-mono text-[#1f367e] uppercase tracking-[0.08em] block mb-2">01 / Fleet &amp; Facilities</span>
              <h3 className="text-lg font-medium text-[#111] mb-2">Modern Equipment &amp; In-House Lab</h3>
              <p className="text-sm text-[#111]/70 leading-[1.6]">
                Work alongside advanced computerized batching plants, digital DYE-2000 compression testing machines, and 41 modern mixer trucks.
              </p>
            </div>

            <div className="p-6 rounded-[4px] border border-[rgba(17,17,17,0.08)] bg-[#fafafa]">
              <span className="text-[11px] font-mono text-[#1f367e] uppercase tracking-[0.08em] block mb-2">02 / Safety &amp; Wellbeing</span>
              <h3 className="text-lg font-medium text-[#111] mb-2">Safety-First Culture</h3>
              <p className="text-sm text-[#111]/70 leading-[1.6]">
                Rigorous HSE protocols, full personal protective equipment (PPE), site safety briefings, and accident insurance coverage for all field personnel.
              </p>
            </div>

            <div className="p-6 rounded-[4px] border border-[rgba(17,17,17,0.08)] bg-[#fafafa]">
              <span className="text-[11px] font-mono text-[#1f367e] uppercase tracking-[0.08em] block mb-2">03 / Heritage &amp; Growth</span>
              <h3 className="text-lg font-medium text-[#111] mb-2">30+ Years of Stability</h3>
              <p className="text-sm text-[#111]/70 leading-[1.6]">
                Founded in 1995, BCE offers dependable long-term employment, career advancement pathways, and ongoing engineering skill development.
              </p>
            </div>
          </div>
        </div>
      </section>

      <QuoteCta href="/?quote" />
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
