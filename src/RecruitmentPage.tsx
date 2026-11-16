import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import { usePageSetup } from "./usePageSetup";
import { translate } from "./i18n";
import { VACANCIES, type Vacancy } from "./careersData";
import StickyValues, { type StickyItem } from "./StickyValues";
import { ParallaxHero, useScrollParallax } from "./ServiceBlocks";
import ArrowButton from "./ArrowButton";
import { unsplash } from "./company";

// Careers after olympic.no/career-crew: the shared ParallaxHero cover (a full-height photo whose title drifts on
// scroll, as Our Businesses), a label-with-copy standfirst, a hairline-free board of open roles with an
// offshore/onshore-style switch, a split "life on site / life in the plant" divider, and a full-bleed "one team" media
// block. The job view follows their job page: oversized title, photo, share rail, metadata table, description and a
// paired Apply / Back-to-list footer. Typography stays BCE's TT Commons family throughout; the palette, scale and
// spacing follow the reference.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const HR_EMAIL = "bce.hr.1990@gmail.com";

const cultureItems: StickyItem[] = [
  {
    title: "Modern equipment and in-house laboratory",
    text: "Work alongside advanced computerized Sicoma batching plants, digital DYE-2000 compression testing machines, 41 mixer trucks and 8 pump trucks.",
    image: unsplash("/Image/bce/about-zoom-batching.webp", 1800),
    alt: "BCE computerized batching plant and modern fleet",
  },
  {
    title: "Safety-first culture and complete protection",
    text: "Rigorous HSE protocols, certified PPE personal protective equipment, structured site safety briefings, and comprehensive accident insurance for all personnel.",
    image: unsplash("/Image/bce/about-zoom-rebar-crew.webp", 1800),
    alt: "BCE crews working safely across a reinforced slab",
  },
  {
    title: "30+ years of operational stability and growth",
    text: "Established in 1995, BCE offers dependable long-term employment, engineering mentorship, clear career advancement pathways, and skills certification.",
    image: unsplash("/Image/bce/about-zoom-piling-rig.webp", 1800),
    alt: "BCE hydraulic piling rig on a foundation site",
  },
  {
    title: "Inclusive teamwork and competitive compensation",
    text: "Market-leading compensation, full overtime pay, performance pour dispatch incentives, and daily per diem allowances for provincial deployments.",
    image: unsplash("/Image/bce/about-zoom-boom-pumps.webp", 1800),
    alt: "BCE boom pumps and crews on a suspended slab pour",
  },
];

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
      className={`block font-mono text-[16px] uppercase leading-[1.6] tracking-[0.02em] ${className}`}
    >
      {children}
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
  const rootRef = useRef<HTMLElement>(null);
  useScrollParallax(rootRef);

  // Deep link: ?recruitment&job=<slug>
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("job");
  });

  const [group, setGroup] = useState<Group>("All roles");
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

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main ref={rootRef} className="bg-white text-[#1E2226]">
        {currentJob ? (
          /* =====================================================================
              JOB VIEW
             ===================================================================== */
          <article className="site-pad w-full pb-0 pt-32 md:pt-44">
            <div className="mx-auto w-full">
              <button
                type="button"
                onClick={backToList}
                className="group inline-flex items-center gap-2.5 font-mono text-[14px] uppercase tracking-[0.02em] text-[#1E2226]/50 transition-colors hover:text-[#1E2226]"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>
                  ←
                </span>
                All positions
              </button>

              <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-12 md:gap-5">
                <div className="md:col-span-7">
                  <Kicker style={{ color: ACCENT }}>Become a builder</Kicker>
                  <h1 className="mt-5 max-w-[16ch] text-[clamp(36px,4.8vw,64px)] font-medium uppercase leading-[0.98] tracking-[-0.03em]">
                    {currentJob.title}
                  </h1>
                </div>

                <div className="flex flex-col justify-end gap-6 md:col-span-5 md:items-end">
                  <div className="md:text-right">
                    <Kicker style={{ color: MUTED }}>{currentJob.department}</Kicker>
                    <p className="mt-2 font-mono text-[14px] uppercase tracking-[0.02em] text-[#1E2226]/45">
                      {groupOf(currentJob) === "On site" ? "On site across Cambodia" : "Battambang"}
                    </p>
                  </div>
                  <ArrowButton href={mailtoFor(currentJob.title)} label="Apply" />
                </div>
              </div>

              <div className="mt-10 aspect-[4/3] overflow-hidden bg-[#EDEEF0] md:mt-14 md:aspect-[16/7]">
                <img
                  src={jobImage(currentJob)}
                  alt={`${currentJob.department} at BCE`}
                  className="size-full object-cover"
                />
              </div>

              <section aria-label="We are BCE" className="grid grid-cols-1 gap-6 border-b border-[#1E2226]/10 py-14 md:grid-cols-12 md:gap-6 md:py-20">
                <Kicker className="md:col-span-4" style={{ color: ACCENT }}>
                  We are BCE
                </Kicker>
                <div className="max-w-[560px] space-y-4 text-[18px] leading-[1.5] tracking-[-0.01em] text-[#1E2226]/70 md:col-span-5 md:col-start-8">
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

              <section className="grid grid-cols-1 gap-8 py-14 md:grid-cols-12 md:gap-6 md:py-20">
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

                <div className="max-w-[560px] md:col-span-5 md:col-start-8">
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
                        <dd className="mt-2 text-[16px] leading-snug text-[#1E2226]/80">{value}</dd>
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
                          <h4 className="text-[16px] font-medium leading-snug">{title}</h4>
                          <p className="mt-1 text-[16px] leading-[1.6] text-[#1E2226]/55">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 border-t border-[#1E2226]/10 pt-6">
                    <Kicker style={{ color: MUTED }}>Contact details</Kicker>
                    <div className="mt-3 space-y-1 text-[16px] text-[#1E2226]/70">
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

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <ArrowButton href={mailtoFor(currentJob.title)} label="Apply" />
                    <ArrowButton label="Back to list" theme="white" onClick={backToList} />
                  </div>
                </div>
              </section>

              <section className="site-bleed site-pad flex flex-col items-center bg-[#F8F8F9] py-20 text-center md:py-28">
                <Kicker style={{ color: ACCENT }}>Ready to build?</Kicker>
                <p className="mt-5 max-w-[720px] text-[24px] font-medium leading-[1.25] tracking-[-0.02em] text-[#1E2226]/55 md:text-[34px]">
                  Great crews build great projects. Join BCE and put thirty years of equipment, engineers and experience
                  behind your career.
                </p>
                <ArrowButton className="mt-8" label="View all positions" onClick={backToList} />
              </section>
            </div>
          </article>
        ) : (
          /* =====================================================================
              CAREERS ARCHIVE
             ===================================================================== */
          <>
            {/* Full-height media cover, the same cover as Our Businesses: the photo drifts as the page scrolls. */}
            <ParallaxHero
              label={translate("Careers & recruitment")}
              title={[translate("Build the country."), translate("Build your career.")]}
              image="/Image/bce/about-zoom-boom-pumps.webp"
              alt="BCE boom pumps and crews on a suspended slab pour"
            />

            {/* Label with copy */}
            <section className="site-pad bg-[#F8F8F9] pb-2 pt-12 md:pt-14">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                <span
                  className="block font-mono text-[16px] uppercase leading-[1.6] tracking-[0.02em] md:col-span-3"
                  style={{ color: ACCENT }}
                >
                  Open positions
                </span>
                <p
                  data-split
                  className="max-w-[560px] text-[18px] leading-[1.5] tracking-[-0.01em] text-[#1E2226]/70 md:col-span-5 md:col-start-8"
                >
                  Onshore or offshore — at BCE we move as one. Join a team shaped by Cambodia&rsquo;s hardest sites:
                  computerized batching plants, an accredited laboratory, hydraulic piling rigs and provincial pours,
                  backed by thirty years of stability and a safety-first culture.
                </p>
              </div>
            </section>

            {/* Board */}
            <section
              id="open-positions"
              className="site-pad scroll-mt-20 bg-[#F8F8F9] pb-16 pt-12 md:pb-24 md:pt-16"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center md:gap-5">
                <fieldset
                  className="inline-flex w-fit items-center rounded-[4px] bg-[#1E2226]/10 p-[3px] md:col-span-5"
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
                        className={`inline-flex h-[30px] items-center rounded-[3px] px-3 font-mono text-[14px] uppercase leading-none tracking-[0.02em] transition-colors ${
                          active ? "bg-[#1E2226] text-white" : "text-[#1E2226]/35 hover:text-[#1E2226]/70"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </fieldset>

                <Kicker className="hidden md:col-span-4 md:block" style={{ color: INK }}>
                  Department
                </Kicker>
                <Kicker className="hidden md:col-span-2 md:block" style={{ color: INK }}>
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
                    className="mt-5 inline-flex h-10 items-center rounded-[3px] bg-[#1E2226] px-5 font-mono text-[14px] uppercase tracking-[0.02em] text-white"
                  >
                    Show all roles
                  </button>
                </div>
              ) : (
                <ul data-reveal className="reveal mt-4 border-t border-[#1E2226]/10">
                  {filtered.map((v) => (
                    <li key={v.id}>
                      <a
                        href={`/?recruitment&job=${v.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          selectJob(v.id);
                        }}
                        className="career-row site-bleed site-pad group relative isolate grid grid-cols-1 items-center gap-2 border-b border-[#1E2226]/10 py-5 text-[#1E2226] transition-colors hover:opacity-100 md:grid-cols-12 md:gap-5 md:py-[27px]"
                      >
                        <span className="career-row-wipe" aria-hidden />
                        <h3 className="text-[16px] font-normal leading-snug tracking-[-0.005em] transition-colors duration-500 group-hover:text-[#F8F8F9] md:col-span-5">
                          {v.title}
                        </h3>
                        <span className="text-[13px] text-[#A5A7A8] md:col-span-4">{v.department}</span>
                        <span className="flex items-center justify-between gap-3 md:col-span-2">
                          <span className="text-[13px] text-[#A5A7A8]">{v.deadline}</span>
                          <ArrowRight className="size-4 shrink-0 text-[#1E2226] transition-colors duration-500 group-hover:text-[#F8F8F9]" />
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

            <StickyValues
              id="culture"
              label="BCE Workplace Culture"
              heading="Why Build Your Career at BCE: stability, modern fleet, safety and professional growth"
              items={cultureItems}
            />
          </>
        )}

        <Footer phones={phones} tel={tel} base="/" />
        <FluidCursor />
      </main>
    </>
  );
}
