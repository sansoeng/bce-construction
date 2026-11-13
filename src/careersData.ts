// Open vacancies shown on the Careers page (/?recruitment).

import { registerContentType } from "./contentStore";

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

registerContentType("vacancies", (items) => {
  VACANCIES.length = 0;
  VACANCIES.push(...(items as Vacancy[]));
});
