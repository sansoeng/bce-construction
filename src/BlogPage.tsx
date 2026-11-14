import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { translate } from "./i18n";
import { BLOG_POSTS, journalKind, type BlogPost, type JournalKind } from "./blogData";

// Journal archive after olympic.no/journal: a small mono standfirst, a two-line display title, the newest story as a
// full-width feature with its caption card tucked into the corner, one segmented News/Insight control beside a
// Categories panel, and square photographic tiles in a three-column grid. The reader below keeps the same paper
// layout: oversized title, full-bleed photograph, a narrow measure, then related tiles.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

const KINDS: ("All" | JournalKind)[] = ["All", "News", "Insight"];

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 10 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`size-2.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M1 1l4 4 4-4" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-2.5"
    >
      <path d="M1.7 5.2 4 7.5 8.4 2.7" />
    </svg>
  );
}

function ArrowUpRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M5.5 18.5 18.5 5.5M8.5 5.5h10v10" />
    </svg>
  );
}

function Meta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[10px] uppercase leading-[1.6] tracking-[0.1em] md:text-[11px] ${className}`}>
      {children}
    </span>
  );
}

function PostTile({ post, onSelect }: { post: BlogPost; onSelect: (slug: string) => void }) {
  return (
    <a
      href={`/?blog&post=${post.slug}`}
      onClick={(event) => {
        event.preventDefault();
        onSelect(post.slug);
      }}
      className="group block hover:opacity-100"
    >
      <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#F0F1F3]">
        <img
          src={post.image}
          alt={post.alt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
          style={
            {
              WebkitCornerSmoothing: "60%",
              cornerSmoothing: "60%",
            } as CSSProperties
          }
        />
        <ul className="absolute left-4 top-4 flex flex-wrap gap-2 md:left-5 md:top-5">
          <li className="rounded-[4px] border border-white/40 bg-black/15 px-2.5 py-1.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em] text-white backdrop-blur-[2px]">
            {journalKind(post)}
          </li>
        </ul>
      </div>

      <div className="pt-4 md:pt-5">
        <Meta className="text-[#A5A7A8]">{post.category}</Meta>
        <h3 className="mt-3 text-[18px] font-medium leading-[1.2] tracking-[-0.015em] text-[#191C1F] sm:text-[19px] lg:text-[clamp(19px,1.55vw,26px)] lg:leading-[1.19]">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
            {post.title}
          </span>
        </h3>
      </div>
    </a>
  );
}

export default function BlogPage() {
  usePageSetup("Blog & Engineering Insights | BCE., Ltd.");

  // Read post slug from URL query if present (e.g. ?blog&post=...)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("post");
  });

  const [kindFilter, setKindFilter] = useState<"All" | JournalKind>("All");
  const [topics, setTopics] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  const topicsList = useMemo(() => [...new Set(BLOG_POSTS.map((p) => p.category))], []);
  const yearsList = useMemo(() => [...new Set(BLOG_POSTS.map((p) => p.year))].sort((a, b) => b.localeCompare(a)), []);

  // Synchronize browser history / deep link
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get("post"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Close the categories panel on click outside or Escape
  useEffect(() => {
    if (!isPanelOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setIsPanelOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && setIsPanelOpen(false);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isPanelOpen]);

  const toTop = () => {
    const lenis = (
      window as unknown as {
        __lenis?: {
          scrollTo: (target: number, opts?: { immediate?: boolean }) => void;
        };
      }
    ).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectPost = (slug: string) => {
    setSelectedSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("post", slug);
    window.history.pushState(null, "", url.toString());
    toTop();
  };

  const handleBackToList = () => {
    setSelectedSlug(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("post");
    window.history.pushState(null, "", url.toString());
    toTop();
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      const matchKind = kindFilter === "All" || journalKind(p) === kindFilter;
      const matchTopic = topics.length === 0 || topics.includes(p.category);
      const matchYear = years.length === 0 || years.includes(p.year);
      return matchKind && matchTopic && matchYear;
    });
  }, [kindFilter, topics, years]);

  const currentPost = useMemo(() => {
    if (!selectedSlug) return null;
    return BLOG_POSTS.find((p) => p.slug === selectedSlug) || null;
  }, [selectedSlug]);

  const relatedPosts = useMemo(() => {
    if (!currentPost) return [];
    return BLOG_POSTS.filter((p) => p.slug !== currentPost.slug).slice(0, 3);
  }, [currentPost]);

  const featuredPost = filteredPosts[0] ?? null;
  const gridPosts = filteredPosts.slice(1);
  const panelFilterCount = topics.length + years.length;
  const filterCount = panelFilterCount + (kindFilter === "All" ? 0 : 1);

  const clearFilters = () => {
    setKindFilter("All");
    setTopics([]);
    setYears([]);
  };

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />

      <main className="min-h-screen bg-white">
        {currentPost ? (
          /* =========================================================================
              VIEW A: SINGLE JOURNAL STORY
             ========================================================================= */
          <article className="w-full px-5 pb-24 pt-32 sm:px-6 md:px-8 md:pt-44 xl:px-10">
            <div className="mx-auto w-full max-w-[1680px]">
              <button
                type="button"
                onClick={handleBackToList}
                className="group inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#191C1F]/50 transition-colors hover:text-[#191C1F] hover:opacity-100 md:text-[11px]"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>
                  ←
                </span>
                Back to journal
              </button>

              <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-12 md:gap-6">
                <div className="md:col-span-8">
                  <Meta className="text-[#191C1F]/50">
                    {journalKind(currentPost)} <span aria-hidden>•</span> {currentPost.category}
                  </Meta>
                  <h1
                    data-split
                    data-split-type="words"
                    className="mt-6 max-w-[19ch] text-[clamp(34px,4.6vw,78px)] font-medium leading-[1.04] tracking-[-0.035em] text-[#191C1F]"
                  >
                    {currentPost.title}
                  </h1>
                </div>

                <div className="flex flex-col justify-end gap-5 border-t border-black/[0.08] pt-5 md:col-span-4 md:border-t-0 md:pt-0">
                  <Meta className="text-[#191C1F]/50">
                    {currentPost.date} <span aria-hidden>•</span> {currentPost.readTime}
                  </Meta>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#191C1F] text-[13px] font-medium text-white">
                      {currentPost.author.name.charAt(0)}
                    </span>
                    <div>
                      <div className="text-[14px] font-medium leading-tight text-[#191C1F]">
                        {currentPost.author.name}
                      </div>
                      <div className="mt-0.5 text-[12px] leading-snug text-[#191C1F]/50">{currentPost.author.role}</div>
                    </div>
                  </div>
                </div>
              </div>

              <figure className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[6px] bg-[#F0F1F3] md:mt-14 md:aspect-[16/9]">
                <img
                  src={currentPost.image}
                  alt={currentPost.alt}
                  className="size-full object-cover"
                  style={
                    {
                      WebkitCornerSmoothing: "60%",
                      cornerSmoothing: "60%",
                    } as CSSProperties
                  }
                />
                <span className="absolute left-4 top-4 rounded-[4px] border border-white/40 bg-black/15 px-2.5 py-1.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em] text-white backdrop-blur-[2px] md:left-5 md:top-5">
                  {journalKind(currentPost)}
                </span>
                <span className="absolute right-4 top-4 rounded-[4px] border border-white/40 bg-black/15 px-2.5 py-1.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em] text-white backdrop-blur-[2px] md:right-5 md:top-5">
                  {currentPost.year}
                </span>
              </figure>

              <div className="mx-auto mt-12 w-full max-w-[700px] md:mt-16">
                <p className="text-[19px] leading-[1.55] tracking-[-0.01em] text-[#191C1F] md:text-[23px]">
                  {currentPost.content.intro}
                </p>

                <div className="mt-12 space-y-12 text-[15.5px] leading-[1.78] text-[#3A3D42] md:mt-16 md:text-[17px]">
                  {currentPost.content.sections?.map((sec, idx) => (
                    <section key={idx} className="space-y-5">
                      <h2 className="text-[24px] font-medium leading-[1.15] tracking-[-0.02em] text-[#191C1F] md:text-[31px]">
                        {sec.heading}
                      </h2>
                      {sec.body.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                      {sec.callout && (
                        <blockquote className="my-10 border-l border-[#191C1F]/20 pl-6 text-[20px] leading-[1.45] tracking-[-0.015em] text-[#5A5D66] md:text-[26px] md:leading-[1.4]">
                          {sec.callout}
                        </blockquote>
                      )}
                    </section>
                  ))}

                  {currentPost.content.takeaways && (
                    <div className="rounded-[8px] bg-[#F8F8F9] p-7 md:p-9">
                      <Meta className="text-[#191C1F]/45">Key takeaways</Meta>
                      <h3 className="mt-3 text-[19px] font-medium leading-snug tracking-[-0.01em] text-[#191C1F] md:text-[21px]">
                        Key Takeaways for Site Contractors &amp; Developers
                      </h3>
                      <ul className="mt-5 space-y-3.5">
                        {currentPost.content.takeaways.map((item, tIdx) => (
                          <li
                            key={tIdx}
                            className="flex items-start gap-3 text-[14.5px] leading-relaxed text-[#3A3D42] md:text-[15.5px]"
                          >
                            <span className="mt-[3px] shrink-0 text-[#191C1F]/70">
                              <Check />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Dispatch call to action */}
              <div className="mx-auto mt-16 flex w-full max-w-[1180px] flex-col gap-8 rounded-[8px] bg-[#191C1F] p-8 text-white md:mt-24 md:flex-row md:items-center md:justify-between md:p-14">
                <div className="max-w-[520px]">
                  <h3 className="text-[24px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[30px]">
                    Have a technical concrete inquiry?
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/60 md:text-[15px]">
                    Connect directly with BCE’s batching dispatch engineers to schedule test cylinders, mix design
                    approvals, or provincial delivery.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ArrowButton href="/?quote" label="Request a concrete quote" theme="white" />
                  <a
                    href="tel:012932700"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-white/10 hover:opacity-100"
                  >
                    Call Dispatch Hotline
                  </a>
                </div>
              </div>

              {/* Related stories */}
              {relatedPosts.length > 0 && (
                <div className="mt-20 border-t border-black/[0.08] pt-12 md:mt-28">
                  <Meta className="text-[#191C1F]/45">Related articles</Meta>
                  <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                    {relatedPosts.map((post) => (
                      <PostTile key={post.slug} post={post} onSelect={handleSelectPost} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        ) : (
          /* =========================================================================
              VIEW B: JOURNAL ARCHIVE
             ========================================================================= */
          <section className="w-full px-5 pb-24 pt-32 sm:px-6 md:px-8 md:pt-44 xl:px-12 lg:pt-[36vh]">
            <div className="mx-auto w-full max-w-[1680px]">
              <header>
                <Meta className="text-[#191C1F]/50">News &amp; insight</Meta>
                <h1
                  data-split
                  data-split-type="words"
                  className="mt-5 text-[clamp(42px,4.72vw,96px)] font-medium uppercase leading-[1.02] tracking-[-0.03em] text-[#191C1F] md:mt-7"
                >
                  <span className="block">{translate("Building with")}</span>{" "}
                  <span className="block">{translate("insight")}</span>
                </h1>
              </header>

              {/* Newest matching story, opened as a full-width feature */}
              {featuredPost && (
                <a
                  href={`/?blog&post=${featuredPost.slug}`}
                  onClick={(event) => {
                    event.preventDefault();
                    handleSelectPost(featuredPost.slug);
                  }}
                  className="group relative mt-10 block hover:opacity-100 md:mt-14"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#F0F1F3] md:aspect-[1372/991]">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.alt}
                      className="size-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                      style={
                        {
                          WebkitCornerSmoothing: "60%",
                          cornerSmoothing: "60%",
                        } as CSSProperties
                      }
                    />
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-6 bg-[#F8F8F9] p-6 lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:block lg:w-[31%] lg:min-w-[300px] lg:max-w-[440px] lg:rounded-[6px] lg:p-7">
                    <div>
                      <Meta className="text-[#191C1F]/45">
                        {journalKind(featuredPost)} <span aria-hidden>•</span> {featuredPost.category}
                      </Meta>
                      <h2 className="mt-3 text-[17px] font-medium leading-[1.25] tracking-[-0.015em] text-[#191C1F] md:text-[18px] lg:text-[21px]">
                        {featuredPost.title}
                      </h2>
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-[#191C1F]/[0.06] text-[#191C1F] transition-colors duration-300 group-hover:bg-[#191C1F] group-hover:text-white lg:mt-7 lg:size-11">
                      <ArrowUpRight />
                    </span>
                  </div>
                </a>
              )}

              {/* Segmented section control, categories panel and clear action */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 md:mt-24 lg:mt-32">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div
                    className="inline-flex items-center rounded-[6px] bg-[#191C1F]/10 p-[3px]"
                    role="group"
                    aria-label="Journal sections"
                  >
                    {KINDS.map((kind) => {
                      const active = kindFilter === kind;
                      return (
                        <button
                          key={kind}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setKindFilter(kind)}
                          className={`h-9 rounded-[4px] px-4 font-mono text-[10px] uppercase leading-none tracking-[0.08em] transition-colors duration-200 md:text-[11px] ${
                            active ? "bg-[#191C1F] text-white" : "text-[#191C1F]/60 hover:text-[#191C1F]"
                          }`}
                        >
                          {kind}
                        </button>
                      );
                    })}
                  </div>

                  <div ref={panelRef} className="relative w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsPanelOpen((open) => !open)}
                      aria-expanded={isPanelOpen}
                      aria-controls="journal-categories"
                      className={`flex h-9 items-center gap-2.5 rounded-[6px] px-3.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em] transition-colors duration-200 md:text-[11px] ${
                        isPanelOpen || panelFilterCount > 0
                          ? "bg-[#191C1F] text-white"
                          : "bg-[#191C1F]/[0.06] text-[#191C1F]/70 hover:text-[#191C1F]"
                      }`}
                    >
                      Categories
                      {panelFilterCount > 0 && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-white/20 text-[9px] leading-none">
                          {panelFilterCount}
                        </span>
                      )}
                      <Chevron open={isPanelOpen} />
                    </button>

                    {isPanelOpen && (
                      <div
                        id="journal-categories"
                        className="absolute left-0 top-[calc(100%+10px)] z-40 max-h-[min(70vh,540px)] w-[min(320px,calc(100vw-2.5rem))] overflow-y-auto rounded-[8px] border border-black/[0.06] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.14)]"
                      >
                        <Meta className="text-[#191C1F]/45">Select categories</Meta>

                        <fieldset className="mt-5">
                          <legend className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#191C1F]/35">
                            Topics
                          </legend>
                          <ul className="mt-2.5 space-y-0.5">
                            {topicsList.map((topic) => {
                              const checked = topics.includes(topic);
                              const count = BLOG_POSTS.filter((p) => p.category === topic).length;
                              return (
                                <li key={topic}>
                                  <label className="flex cursor-pointer items-center gap-3 py-2 text-[13px] leading-snug text-[#191C1F]">
                                    <input
                                      type="checkbox"
                                      className="peer sr-only"
                                      checked={checked}
                                      onChange={() => setTopics((list) => toggle(list, topic))}
                                    />
                                    <span className="grid size-[18px] shrink-0 place-items-center rounded-full border border-[#191C1F]/20 text-transparent transition-colors peer-checked:border-[#191C1F] peer-checked:bg-[#191C1F] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#191C1F]/40">
                                      <Check />
                                    </span>
                                    <span className="flex-1">{topic}</span>
                                    <span className="font-mono text-[10px] text-[#191C1F]/30">{count}</span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </fieldset>

                        <fieldset className="mt-5 border-t border-black/[0.06] pt-5">
                          <legend className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#191C1F]/35">
                            Year
                          </legend>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {yearsList.map((yr) => {
                              const checked = years.includes(yr);
                              return (
                                <label key={yr} className="cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={checked}
                                    onChange={() => setYears((list) => toggle(list, yr))}
                                  />
                                  <span
                                    className={`inline-flex h-8 items-center rounded-[4px] border px-3 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                                      checked
                                        ? "border-[#191C1F] bg-[#191C1F] text-white"
                                        : "border-[#191C1F]/15 text-[#191C1F]/60 hover:text-[#191C1F] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#191C1F]/40"
                                    }`}
                                  >
                                    {yr}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </fieldset>

                        <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4">
                          <Meta className="text-[#191C1F]/40">
                            {filteredPosts.length} / {BLOG_POSTS.length}
                          </Meta>
                          <button
                            type="button"
                            onClick={clearFilters}
                            disabled={filterCount === 0}
                            className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#191C1F] underline underline-offset-4 disabled:text-[#191C1F]/25 disabled:no-underline"
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={filterCount === 0}
                  className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-[#191C1F]/50 transition-colors hover:text-[#191C1F] disabled:text-[#191C1F]/25 sm:inline-flex md:text-[11px]"
                >
                  Clear filters
                </button>
              </div>

              {featuredPost === null ? (
                <div className="mt-16 border-t border-black/[0.08] pt-16 md:mt-20">
                  <p className="text-[20px] font-medium tracking-[-0.01em] text-[#191C1F] md:text-[24px]">
                    No articles found for the selected filter.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-[4px] bg-[#191C1F] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.08em] text-white"
                  >
                    Reset filters
                  </button>
                </div>
              ) : gridPosts.length > 0 ? (
                <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-[104px]">
                  {gridPosts.map((post) => (
                    <PostTile key={post.slug} post={post} onSelect={handleSelectPost} />
                  ))}
                </div>
              ) : null}
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
