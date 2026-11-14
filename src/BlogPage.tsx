import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

import { BLOG_POSTS, type BlogPost } from "./blogData";

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

  // The archive mirrors olympic.no/journal: the newest matching story opens the page as a large feature, the rest
  // follow in a three-column tile grid.
  const featuredPost = filteredPosts[0] ?? null;
  const gridPosts = filteredPosts.slice(1);

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
              <div className="rounded-[10px] overflow-hidden mb-10 bg-[#F0F1F3] aspect-[16/9]" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                <img
                  src={currentPost.image}
                  alt={currentPost.alt}
                  className="w-full h-full object-cover rounded-[10px]"
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
                        <div className="rounded-[10px] overflow-hidden aspect-[16/10] bg-[#F0F1F3] mb-3" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                          <img
                            src={post.image}
                            alt={post.alt}
                            className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform duration-300"
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
              VIEW B: JOURNAL-STYLE ARCHIVE (after olympic.no/journal)
             ========================================================================= */
          <section className="w-full px-5 sm:px-6 md:px-8 pt-28 md:pt-36 pb-20">
            <div className="w-full max-w-[1000px] 2xl:max-w-[1432px] mx-auto">
              {/* Label, statement and standfirst */}
              <div className="max-w-[900px]">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#191C1F]/45">
                  News &amp; insight
                </p>
                <h1 className="mt-5 text-[clamp(44px,8vw,104px)] font-medium leading-[0.96] tracking-[-0.045em] text-[#191C1F]">
                  Blog
                </h1>
                <p className="mt-6 max-w-[560px] text-[15px] sm:text-[17px] leading-[1.55] text-[#191C1F]/60">
                  Engineering insights, concrete batching innovations, and major infrastructure milestones from BCE across Cambodia.
                </p>
              </div>

              {/* Featured story: the newest matching article opens the page. */}
              {featuredPost && (
                <a
                  href={`/?blog&post=${featuredPost.slug}`}
                  onClick={(event) => {
                    event.preventDefault();
                    handleSelectPost(featuredPost.slug);
                  }}
                  className="group relative mt-10 block md:mt-14"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-[#F0F1F3] md:aspect-[21/9]" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.alt}
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                      style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                    />
                    <span className="absolute left-5 top-5 inline-flex items-center rounded-[6px] border border-white/40 bg-black/20 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-white backdrop-blur-sm">
                      {featuredPost.category}
                    </span>
                  </div>
                  <div className="mt-5 md:mt-0">
                    <div className="md:absolute md:bottom-6 md:right-6 md:max-w-[460px] md:rounded-[20px] md:bg-white md:p-6" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#191C1F]/45">
                        {featuredPost.date} · {featuredPost.readTime}
                      </p>
                      <h2 className="mt-2 max-w-[28ch] text-[22px] font-medium leading-[1.2] tracking-[-0.02em] text-[#191C1F] md:text-[26px]">
                        {featuredPost.title}
                      </h2>
                      <span className="mt-4 inline-flex size-11 items-center justify-center rounded-full bg-[#191C1F] text-white transition-transform duration-300 group-hover:translate-x-1">
                        <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M3.5 12.5 12.5 3.5M5.5 3.5h7v7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              )}

              {/* Count + pill filters */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 md:mt-16">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#191C1F]/45">
                  <span>{filteredPosts.length}</span> <span>{filteredPosts.length === 1 ? "article" : "articles"}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3">
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

              </div>

              {filteredPosts.length === 0 ? (
                <div className="mt-16 py-24 text-center rounded-[20px] bg-[#F8F8F8] border border-[rgba(0,0,0,0.04)]">
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
              ) : gridPosts.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post) => (
                    <a
                      key={post.slug}
                      href={`/?blog&post=${post.slug}`}
                      onClick={(event) => {
                        event.preventDefault();
                        handleSelectPost(post.slug);
                      }}
                      className="group flex flex-col"
                    >
                      <div
                        className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-[#F0F1F3]"
                        style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                      >
                        <img
                          src={post.image}
                          alt={post.alt}
                          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                          style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                          loading="lazy"
                        />
                        <span className="absolute left-4 top-4 inline-flex items-center rounded-[6px] border border-white/40 bg-black/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-[#191C1F]/45">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="mt-2 text-[20px] font-medium leading-[1.22] tracking-[-0.02em] text-[#191C1F] group-hover:underline group-hover:underline-offset-4 sm:text-[22px]">
                        {post.title}
                      </h3>
                    </a>
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
