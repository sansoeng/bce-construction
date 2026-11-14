import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import { usePageSetup } from "./usePageSetup";
import { translate } from "./i18n";
import { VACANCIES, type Vacancy } from "./careersData";

// Careers after olympic.no/career-crew: a full-height media hero, a label-with-copy standfirst, a hairline-free board
// of open roles with an offshore/onshore-style switch, a split "life on site / life in the plant" divider, and a
// full-bleed "one team" media block. The job view follows their job page: oversized title, photo, share rail, metadata
// table, description and a paired Apply / Back-to-list footer. Typography stays BCE's Aeonik family throughout; the
// palette, scale and spacing follow the reference.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const HR_EMAIL = "bce.hr.1990@gmail.com";

const INK = "#1E2226";
const MUTED = "#A5A7A8";
const PAPER = "#F8F8F9";
const ACCENT = "#FF3C1E";

const GROUPS = ["All roles", "Battambang", "On site"] as const;
type Group = (typeof GROUPS)[number];

const groupOf = (v: Vacancy): Exclude<Group, "All roles"> =>
  v.location.toLowerCase().includes("site deployment") ? "On site" : "Battambang";

const DEPT_IMAGE: Record<string, string> = {
  "Operations & Batching": "/Image/bce/about-zoom-batching.webp",
  "Quality & Lab": "/Image/bce/about-hero-banner.webp",
  "Civil Construction": "/Image/bce/about-zoom-rebar-crew.webp",
  "Piling & Foundation": "/Image/bce/about-zoom-piling-rig.webp",
  "Fleet Logistics": "/Image/bce/about-zoom-boom-pumps.webp",
};

const jobImage = (v: Vacancy) => DEPT_IMAGE[v.department] ?? "/Image/bce/about-zoom-rebar-crew.webp";

const mailtoFor = (title: string) => {
  const subject = encodeURIComponent(`Job Application - ${title}`);
  const body = encodeURIComponent(
    `Dear BCE Recruitment Team,\n\nI am writing to express my interest in the position of ${title} at Battambang Construction and Engineering, Co., Ltd. (BCE).\n\nPlease find my CV, relevant licenses, and academic certificates attached.\n\nFull Name: \nPhone Number: \nCurrent Location: \nAvailable Start Date: \n\nThank you for your consideration.\n`,
  );
  return `mailto:${HR_EMAIL}?subject=${subject}&body=${body}`;
};

const openApplication = () =>
  `mailto:${HR_EMAIL}?subject=${encodeURIComponent("Open Application - BCE")}&body=${encodeURIComponent(
    "Dear BCE Recruitment Team,\n\nI would like to be considered for future opportunities at BCE.\n\nFull Name: \nPhone Number: \nPosition of interest: \nCurrent Location: \n\nPlease find my CV attached.\n",
  )}`;

const shareUrl = (network: "facebook" | "linkedin" | "telegram", url: string, title: string) => {
  const u = encodeURIComponent(url);
  if (network === "facebook") return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
  if (network === "linkedin") return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
  return `https://t.me/share/url?url=${u}&text=${encodeURIComponent(title)}`;
};

function Kicker({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={style}
      className={`block font-mono text-[10px] uppercase leading-[1.6] tracking-[0.02em] ${className}`}
    >
      {children}
    </span>
  );
}

function ScrollMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex size-8 items-center justify-center rounded-[3px] border border-white/40 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 9 11" fill="none" stroke="currentColor" strokeWidth="1" className="h-3 w-2.5">
        <path d="M4.36 10V0M.36 6l4.1 4.2L8.54 6" />
      </svg>
    </span>
  );
}

function ArrowRight({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M.9 5h11.6M8.2 1l4 4-4 4" />
    </svg>
  );
}

const ShareIcon = ({ network }: { network: "facebook" | "linkedin" | "telegram" }) => {
  if (network === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H16.4V5.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4V11H7.5v3H10v7h3.5z" />
      </svg>
    );
  }
  if (network === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6.5 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 5.9V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 3V21h-4V9z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M21.9 4.3 18.7 20c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.2 13.9l-4.8-1.5c-1-.3-1-1 .2-1.5L20.4 2.8c.9-.3 1.7.2 1.5 1.5z" />
    </svg>
  );
};

export default function RecruitmentPage() {
  usePageSetup("Careers & Recruitment | BCE., Ltd.");

  // Deep link: ?recruitment&job=<slug>
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("job");
  });

  const [group, setGroup] = useState<Group>("All roles");
  const boardRef = useRef<HTMLElement>(null);
  const shareHref = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    const handlePopState = () => {
      setSelectedJobId(new URLSearchParams(window.location.search).get("job"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const currentJob = useMemo(() => VACANCIES.find((v) => v.id === selectedJobId) ?? null, [selectedJobId]);

  useEffect(() => {
    document.title = currentJob ? `${currentJob.title} | BCE Careers` : translate("Careers & Recruitment | BCE., Ltd.");
  }, [currentJob]);

  const scrollTop = () => {
    const lenis = (
      window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }
    ).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectJob = (id: string) => {
    setSelectedJobId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("job", id);
    window.history.pushState(null, "", url.toString());
    scrollTop();
  };

  const backToList = () => {
    setSelectedJobId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("job");
    window.history.pushState(null, "", url.toString());
    scrollTop();
  };

  const filtered = useMemo(() => VACANCIES.filter((v) => group === "All roles" || groupOf(v) === group), [group]);

  const counts = useMemo(() => {
    const map: Record<Group, number> = { "All roles": VACANCIES.length, Battambang: 0, "On site": 0 };
    VACANCIES.forEach((v) => (map[groupOf(v)] += 1));
    return map;
  }, []);

  const exploreGroup = (next: Exclude<Group, "All roles">) => {
    setGroup(next);
    boardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main className="bg-white text-[#1E2226]">
        {currentJob ? (
          /* =====================================================================
              JOB VIEW
             ===================================================================== */
          <article className="w-full px-5 pb-0 pt-32 sm:px-6 md:px-10 md:pt-44">
            <div className="mx-auto w-full">
              <button
                type="button"
                onClick={backToList}
                className="group inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.02em] text-[#1E2226]/50 transition-colors hover:text-[#1E2226]"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>
                  ←
                </span>
                All positions
              </button>

              <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-12 md:gap-5">
                <div className="md:col-span-7">
                  <Kicker style={{ color: ACCENT }}>Become a builder</Kicker>
                  <h1 className="mt-5 max-w-[16ch] text-[clamp(36px,4.8vw,80px)] font-medium uppercase leading-[0.98] tracking-[-0.03em]">
                    {currentJob.title}
                  </h1>
                </div>

                <div className="flex flex-col justify-end gap-6 md:col-span-5 md:items-end">
                  <div className="md:text-right">
                    <Kicker style={{ color: MUTED }}>{currentJob.department}</Kicker>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.02em] text-[#1E2226]/45">
                      {groupOf(currentJob) === "On site" ? "On site across Cambodia" : "Battambang"}
                    </p>
                  </div>
                  <a
                    href={mailtoFor(currentJob.title)}
                    className="inline-flex h-11 items-center justify-center gap-3 rounded-[3px] bg-[#1E2226] px-7 font-mono text-[10px] uppercase tracking-[0.06em] text-white transition-colors hover:bg-black"
                  >
                    Apply
                    <ArrowRight />
                  </a>
                </div>
              </div>

              <div className="mt-10 aspect-[4/3] overflow-hidden bg-[#EDEEF0] md:mt-14 md:aspect-[16/7]">
                <img
                  src={jobImage(currentJob)}
                  alt={`${currentJob.department} at BCE`}
                  className="size-full object-cover"
                />
              </div>

              <section className="grid grid-cols-1 gap-6 border-b border-[#1E2226]/10 py-14 md:grid-cols-12 md:gap-5 md:py-20">
                <Kicker className="md:col-span-3" style={{ color: ACCENT }}>
                  We are BCE
                </Kicker>
                <div className="space-y-4 text-[15px] leading-[1.7] text-[#1E2226]/70 md:col-span-8 md:col-start-5 md:text-[16px]">
                  <p>
                    Battambang Construction and Engineering, Co., Ltd. (BCE) is one of Western Cambodia&rsquo;s leading
                    construction, concrete and foundation engineering companies. Operating 4 computerized batching
                    plants, 41 mixer trucks, 8 concrete pumps and an accredited in-house laboratory, our team of 71
                    professionals builds major national infrastructure, industrial complexes and landmark civil projects
                    across Cambodia.
                  </p>
                  <p>
                    We aim to be a preferred employer: health, safety and environment come first, competence is built on
                    real projects, and crews who stay with us grow with the company.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-8 py-14 md:grid-cols-12 md:gap-5 md:py-20">
                <div className="md:col-span-3">
                  <Kicker style={{ color: ACCENT }}>Share</Kicker>
                  <div className="mt-4 flex items-center gap-2">
                    {(["facebook", "linkedin", "telegram"] as const).map((network) => (
                      <a
                        key={network}
                        href={shareUrl(network, shareHref, currentJob.title)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Share on ${network}`}
                        className="flex size-8 items-center justify-center rounded-[3px] border border-[#1E2226]/15 text-[#1E2226]/60 transition-colors hover:border-[#1E2226] hover:text-[#1E2226] hover:opacity-100"
                      >
                        <ShareIcon network={network} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-8 md:col-start-5">
                  <h2 className="text-[28px] font-medium uppercase leading-[1.05] tracking-[-0.02em] md:text-[40px]">
                    {currentJob.title}
                  </h2>

                  <dl className="mt-10 border-t border-[#1E2226]/10">
                    {[
                      ["Department", currentJob.department],
                      ["Employment type", currentJob.type],
                      ["Workplace type", groupOf(currentJob) === "On site" ? "On site" : "Battambang"],
                      ["Application deadline", currentJob.deadline],
                    ].map(([label, value]) => (
                      <div key={label} className="border-b border-[#1E2226]/10 py-4">
                        <dt>
                          <Kicker style={{ color: ACCENT }}>{label}</Kicker>
                        </dt>
                        <dd className="mt-2 text-[14px] leading-snug text-[#1E2226]/80">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-10 space-y-4 text-[15px] leading-[1.75] text-[#1E2226]/70 md:text-[16px]">
                    <p>{currentJob.overview}</p>
                  </div>

                  <div className="mt-12">
                    <Kicker style={{ color: MUTED }}>About the role</Kicker>
                    <h3 className="mt-2 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                      What you&rsquo;ll be doing
                    </h3>
                    <ul className="mt-5 space-y-3 text-[14.5px] leading-[1.7] text-[#1E2226]/70">
                      {currentJob.duties.map((duty) => (
                        <li key={duty} className="flex gap-3">
                          <span className="mt-[9px] size-1 shrink-0 rounded-full bg-[#1E2226]/60" aria-hidden />
                          <span>{duty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-12">
                    <Kicker style={{ color: MUTED }}>Requirements</Kicker>
                    <h3 className="mt-2 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                      What you&rsquo;ll need
                    </h3>
                    <ul className="mt-5 space-y-3 text-[14.5px] leading-[1.7] text-[#1E2226]/70">
                      {currentJob.qualifications.map((qual) => (
                        <li key={qual} className="flex gap-3">
                          <span className="mt-[9px] size-1 shrink-0 rounded-full bg-[#1E2226]/60" aria-hidden />
                          <span>{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-12 bg-[#F8F8F9] p-6 md:p-8">
                    <Kicker style={{ color: ACCENT }}>Compensation &amp; benefits</Kicker>
                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                      {[
                        [
                          "Competitive compensation",
                          "Market-leading base salary, full overtime pay and performance pour-dispatch incentives.",
                        ],
                        [
                          "Safety and insurance",
                          "Certified PPE, HSE training on site and comprehensive accident insurance for every employee.",
                        ],
                        [
                          "Accommodation and per diem",
                          "Company accommodation and a daily per diem on all provincial site deployments.",
                        ],
                        [
                          "Hands-on training",
                          "Direct training on Sicoma computerized batching and ASTM / ACI laboratory protocols.",
                        ],
                      ].map(([title, text]) => (
                        <div key={title}>
                          <h4 className="text-[14px] font-medium leading-snug">{title}</h4>
                          <p className="mt-1 text-[13px] leading-[1.6] text-[#1E2226]/55">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 border-t border-[#1E2226]/10 pt-6">
                    <Kicker style={{ color: MUTED }}>Contact details</Kicker>
                    <div className="mt-3 space-y-1 text-[14px] text-[#1E2226]/70">
                      <p>
                        Email:{" "}
                        <a href={`mailto:${HR_EMAIL}`} className="underline underline-offset-4 hover:opacity-100">
                          {HR_EMAIL}
                        </a>
                      </p>
                      <p>
                        Hotline:{" "}
                        <a href={tel("012 932 700")} className="underline underline-offset-4 hover:opacity-100">
                          012 932 700
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <a
                      href={mailtoFor(currentJob.title)}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-[3px] bg-[#1E2226] px-6 font-mono text-[10px] uppercase tracking-[0.06em] text-white transition-colors hover:bg-black"
                    >
                      Apply
                      <ArrowRight />
                    </a>
                    <button
                      type="button"
                      data-slot="career-back"
                      onClick={backToList}
                      className="inline-flex h-12 items-center justify-center rounded-[3px] bg-[#EDEEF0] px-6 font-mono text-[10px] uppercase tracking-[0.06em] text-[#1E2226] transition-colors hover:bg-[#E3E4E6]"
                    >
                      Back to list
                    </button>
                  </div>
                </div>
              </section>

              <section className="-mx-5 flex flex-col items-center bg-[#F8F8F9] px-5 py-20 text-center sm:-mx-6 md:-mx-10 md:py-28">
                <Kicker style={{ color: ACCENT }}>Ready to build?</Kicker>
                <p className="mt-5 max-w-[720px] text-[24px] font-medium leading-[1.25] tracking-[-0.02em] text-[#1E2226]/55 md:text-[34px]">
                  Great crews build great projects. Join BCE and put thirty years of equipment, engineers and experience
                  behind your career.
                </p>
                <button
                  type="button"
                  data-slot="career-all"
                  onClick={backToList}
                  className="mt-8 inline-flex h-11 items-center gap-3 rounded-[3px] bg-[#1E2226] px-6 font-mono text-[10px] uppercase tracking-[0.06em] text-white transition-colors hover:bg-black"
                >
                  View all positions
                  <ArrowRight />
                </button>
              </section>
            </div>
          </article>
        ) : (
          /* =====================================================================
              CAREERS ARCHIVE
             ===================================================================== */
          <>
            {/* Full-height media hero */}
            <section className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden bg-[#1E2226] px-5 pb-7 pt-40 text-white sm:px-6 md:min-h-screen md:px-10 md:pb-9">
              <img
                src="/Image/bce/about-zoom-boom-pumps.webp"
                alt=""
                className="absolute inset-0 -z-20 size-full object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15,17,19,.55) 0%, rgba(15,17,19,.12) 45%, rgba(15,17,19,.78) 100%)",
                }}
              />

              <div className="w-full">
                <Kicker style={{ color: ACCENT }}>Career at BCE</Kicker>
                <h1
                  data-split
                  data-split-type="words"
                  className="mt-4 max-w-[18ch] text-[clamp(38px,4.4vw,76px)] font-medium uppercase leading-[1.02] tracking-[-0.03em] text-white"
                >
                  {translate("Build the country.")}
                  <br />
                  {translate("Build your career.")}
                </h1>
              </div>

              <div className="mt-12 flex items-end justify-between gap-6 text-white/60 md:mt-20">
                <ScrollMark />
                <Kicker className="text-white/55">Scroll to explore</Kicker>
              </div>
            </section>

            {/* Label with copy */}
            <section className="bg-[#F8F8F9] px-5 pb-2 pt-12 sm:px-6 md:px-10 md:pt-14">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                <Kicker className="md:col-span-3" style={{ color: ACCENT }}>
                  Open positions
                </Kicker>
                <p className="max-w-[560px] text-[18px] leading-[1.35] tracking-[-0.01em] text-[#1E2226]/70 md:col-span-5 md:col-start-8 md:text-[18px]">
                  Onshore or offshore — at BCE we move as one. Join a team shaped by Cambodia&rsquo;s hardest sites:
                  computerized batching plants, an accredited laboratory, hydraulic piling rigs and provincial pours,
                  backed by thirty years of stability and a safety-first culture.
                </p>
              </div>
            </section>

            {/* Board */}
            <section
              ref={boardRef}
              id="open-positions"
              className="scroll-mt-20 bg-[#F8F8F9] px-5 pb-16 pt-12 sm:px-6 md:px-10 md:pb-24 md:pt-16"
            >
              <div className="flex flex-col gap-6 border-b border-[#1E2226]/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
                <fieldset
                  className="inline-flex items-center rounded-[4px] bg-[#1E2226]/10 p-[3px]"
                  aria-label="Role groups"
                >
                  <legend className="sr-only">Role groups</legend>
                  {GROUPS.map((item) => {
                    const active = group === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        data-slot="career-switch"
                        aria-pressed={active}
                        onClick={() => setGroup(item)}
                        className={`inline-flex h-[30px] items-center gap-2 rounded-[3px] px-3 font-mono text-[10px] uppercase leading-none tracking-[0.02em] transition-colors ${
                          active ? "bg-[#1E2226] text-white" : "text-[#1E2226]/35 hover:text-[#1E2226]/70"
                        }`}
                      >
                        {item}
                        <span className={`text-[9px] ${active ? "text-white/45" : "text-[#1E2226]/30"}`}>
                          {counts[item]}
                        </span>
                      </button>
                    );
                  })}
                </fieldset>

                <p className="font-mono text-[10px] uppercase tracking-[0.02em] text-[#1E2226]/40">
                  {filtered.length} {translate(filtered.length === 1 ? "role" : "roles")} {translate("open now")}
                </p>
              </div>

              {/* Column labels */}
              <div className="mt-10 hidden items-center gap-5 pb-3 md:grid md:grid-cols-12">
                <Kicker className="md:col-span-5" style={{ color: INK }}>
                  Role
                </Kicker>
                <Kicker className="md:col-span-3" style={{ color: INK }}>
                  Department
                </Kicker>
                <Kicker className="md:col-span-2" style={{ color: INK }}>
                  Type
                </Kicker>
                <Kicker className="md:col-span-2" style={{ color: INK }}>
                  Deadline
                </Kicker>
              </div>

              {filtered.length === 0 ? (
                <div className="py-20">
                  <p className="text-[17px] font-medium">{translate("There are currently no open positions.")}</p>
                  <button
                    type="button"
                    data-slot="career-reset"
                    onClick={() => setGroup("All roles")}
                    className="mt-5 inline-flex h-10 items-center rounded-[3px] bg-[#1E2226] px-5 font-mono text-[10px] uppercase tracking-[0.02em] text-white"
                  >
                    Show all roles
                  </button>
                </div>
              ) : (
                <ul>
                  {filtered.map((v) => (
                    <li key={v.id}>
                      <a
                        href={`/?recruitment&job=${v.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          selectJob(v.id);
                        }}
                        className="group -mx-5 grid grid-cols-1 items-center gap-2 px-5 py-5 text-[#1E2226] transition-colors duration-300 hover:bg-[#1E2226] hover:text-white hover:opacity-100 md:-mx-10 md:grid-cols-12 md:gap-5 md:px-10 md:py-[22px]"
                      >
                        <h3 className="text-[15px] font-medium leading-snug tracking-[-0.005em] md:col-span-5">
                          {v.title}
                        </h3>
                        <span className="text-[13px] text-[#A5A7A8] transition-colors group-hover:text-white/60 md:col-span-3">
                          {v.department}
                        </span>
                        <span className="text-[13px] text-[#A5A7A8] transition-colors group-hover:text-white/60 md:col-span-2">
                          {v.type}
                        </span>
                        <span className="flex items-center justify-between gap-3 md:col-span-2">
                          <span className="text-[13px] text-[#A5A7A8] transition-colors group-hover:text-white/60">
                            {v.deadline}
                          </span>
                          <span className="flex size-[30px] items-center justify-center rounded-[3px] border border-[#1E2226]/10 text-[#1E2226]/50 transition-colors group-hover:border-white/20 group-hover:text-white md:translate-x-3">
                            <ArrowRight />
                          </span>
                        </span>
                        <span className="sr-only">
                          {v.location} — {v.type}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Life on site / life in the plant */}
            <section className="bg-[#F8F8F9] px-5 pb-16 sm:px-6 md:px-10 md:pb-20">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {[
                  {
                    key: "On site" as const,
                    label: "Life on site",
                    headline: "Site crews",
                    image: "/Image/bce/about-zoom-rebar-crew.webp",
                    alt: "BCE crews working across a reinforced concrete slab",
                    position: "center 60%",
                  },
                  {
                    key: "Battambang" as const,
                    label: "Life in the plant",
                    headline: "Battambang",
                    image: "/Image/bce/about-zoom-batching.webp",
                    alt: "BCE computerized batching plant",
                    position: "center",
                  },
                ].map((panel) => (
                  <a
                    key={panel.key}
                    href="#open-positions"
                    onClick={(event) => {
                      event.preventDefault();
                      exploreGroup(panel.key);
                    }}
                    className="group relative isolate flex aspect-[4/3] items-end overflow-hidden bg-[#1E2226] p-6 text-left text-white md:aspect-[700/896] md:p-10 hover:opacity-100"
                  >
                    <img
                      src={panel.image}
                      alt={panel.alt}
                      loading="lazy"
                      className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                      style={{ objectPosition: panel.position }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-10 transition-opacity duration-500 group-hover:opacity-80"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(15,17,19,.05) 0%, rgba(15,17,19,.15) 45%, rgba(15,17,19,.72) 100%)",
                      }}
                    />
                    <span className="w-full">
                      <Kicker className="text-white/70">{panel.label}</Kicker>
                      <span className="mt-3 block text-[clamp(34px,3.7vw,54px)] font-medium uppercase leading-[0.98] tracking-[-0.03em]">
                        {panel.headline}
                      </span>
                      <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.02em] text-white/85 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                        Explore
                        <ArrowRight className="size-3" />
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* One team / join us */}
            <section className="px-5 py-20 sm:px-6 md:px-10 md:py-28">
              <div className="flex flex-col items-center text-center">
                <Kicker style={{ color: ACCENT }}>One team</Kicker>
                <h2
                  data-split
                  data-split-type="words"
                  className="mt-4 max-w-[20ch] text-[clamp(34px,3.7vw,53px)] font-medium uppercase leading-[1.02] tracking-[-0.02em]"
                >
                  {translate("Building as one")}
                </h2>
                <p className="mt-6 max-w-[700px] text-[15px] leading-[1.65] text-[#1E2226]/55 md:text-[16px]">
                  Four batching plants, an accredited laboratory, hydraulic rigs and crews across fourteen provinces —
                  BCE is built by people who keep Cambodia pouring. Bring your trade, your licence or your degree, and
                  grow with a company that has been building since 1995.
                </p>
              </div>

              <div className="relative isolate mx-auto mt-12 flex aspect-[4/5] w-full max-w-[540px] flex-col items-center justify-center overflow-hidden bg-[#1E2226] px-8 text-center text-white md:mt-16">
                <img
                  src="/Image/bce/about-zoom-piling-rig.webp"
                  alt="BCE piling rig working on a foundation site"
                  loading="lazy"
                  className="absolute inset-0 -z-20 size-full object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(15,17,19,.35) 0%, rgba(15,17,19,.55) 50%, rgba(15,17,19,.85) 100%)",
                  }}
                />

                {/* Corner ticks, after the reference's frame decoration */}
                {[
                  "left-4 top-4 border-l border-t",
                  "right-4 top-4 border-r border-t",
                  "bottom-4 left-4 border-b border-l",
                  "bottom-4 right-4 border-b border-r",
                ].map((c) => (
                  <span key={c} aria-hidden className={`pointer-events-none absolute size-5 border-white/50 ${c}`} />
                ))}

                <Kicker className="text-white/55">We are BCE</Kicker>
                <a
                  href={openApplication()}
                  className="mt-6 inline-flex h-11 items-center justify-center gap-3 rounded-[3px] border border-white/30 px-7 font-mono text-[10px] uppercase tracking-[0.06em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#1E2226] hover:opacity-100"
                >
                  Join our crew
                  <ArrowRight />
                </a>
                <p className="mt-6 max-w-[340px] font-mono text-[10px] uppercase leading-[1.8] tracking-[0.02em] text-white/40">
                  Open application — send your CV to{" "}
                  <a
                    href={`mailto:${HR_EMAIL}`}
                    className="underline underline-offset-4 hover:text-white hover:opacity-100"
                  >
                    {HR_EMAIL}
                  </a>
                </p>
              </div>
            </section>
          </>
        )}

        <Footer phones={phones} tel={tel} base="/" />
        <FluidCursor />
      </main>
    </>
  );
}
