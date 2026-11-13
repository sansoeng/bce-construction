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
              <div className="rounded-[24px] overflow-hidden mb-10 bg-[#F0F1F3] aspect-[16/9]" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                <img
                  src={currentPost.image}
                  alt={currentPost.alt}
                  className="w-full h-full object-cover rounded-[24px]"
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
                        <div className="rounded-[24px] overflow-hidden aspect-[16/10] bg-[#F0F1F3] mb-3" style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}>
                          <img
                            src={post.image}
                            alt={post.alt}
                            className="w-full h-full object-cover rounded-[24px] group-hover:scale-105 transition-transform duration-300"
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
              VIEW B: REVOLUT-STYLE BLOG INDEX PAGE
              Exact specifications:
              - Centered H1: "Blog"
              - Centered Combobox Pills: "All topics" & "All years"
              - 6-Column Responsive Grid (Top 2 cards span 3 cols, next span 2 cols)
              - Card anatomy: rounded-[20px], bg-[#F8F8F8], 16:9 thumbnail, category tag, title, date
             ========================================================================= */
          <section className="w-full px-5 sm:px-6 md:px-8 pt-28 md:pt-36 pb-20">
            <div className="w-full max-w-[1000px] 2xl:max-w-[1432px] mx-auto">
              {/* Revolut Centered Header: H1 Blog */}
              <div className="text-center max-w-[700px] mx-auto mb-8">
                <h1 className="text-[34px] sm:text-[42px] md:text-[64px] font-semibold tracking-[-0.03em] text-[#191C1F] leading-tight">
                  Blog
                </h1>
                <p className="mt-3 text-base sm:text-lg text-[#737373] leading-relaxed">
                  Engineering insights, concrete batching innovations, and major infrastructure milestones from BCE across Cambodia.
                </p>
              </div>

              {/* Revolut Centered Pill Filters: "All topics" & "All years" */}
              <div className="flex items-center justify-center gap-3 mb-12 sm:mb-16">
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

              {/* Revolut Article Grid: 6-Column Grid Layout */}
              {filteredPosts.length === 0 ? (
                <div className="py-24 text-center rounded-[20px] bg-[#F8F8F8] border border-[rgba(0,0,0,0.04)]">
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
                  {filteredPosts.map((post, index) => {
                    // First 2 cards span 3 columns each (prominent featured row); remaining cards span 2 columns (3-per-row)
                    const isFeatured = index < 2;
                    const colSpanClass = isFeatured
                      ? "lg:col-span-3"
                      : "lg:col-span-2";

                    return (
                      <article
                        key={post.slug}
                        onClick={() => handleSelectPost(post.slug)}
                        className={`group flex flex-col p-6 rounded-[24px] bg-[#F8F8F8] hover:bg-[#F0F1F3] transition-all duration-300 cursor-pointer border border-[rgba(0,0,0,0.02)] ${colSpanClass}`}
                        style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                      >
                        {/* Thumbnail Image */}
                        <div
                          className={`w-full rounded-[24px] overflow-hidden bg-[#EAEBED] mb-4 relative ${
                            isFeatured ? "aspect-[16/10] md:aspect-[16/9]" : "aspect-[16/10]"
                          }`}
                          style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                        >
                          <img
                            src={post.image}
                            alt={post.alt}
                            className="w-full h-full object-cover rounded-[24px] group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                            style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as any}
                            loading="lazy"
                          />
                        </div>

                        {/* Category Tag */}
                        <div className="text-[13px] font-medium text-[#737373] mb-2 uppercase tracking-[0.04em]">
                          {post.category}
                        </div>

                        {/* Title */}
                        <h2
                          className={`font-semibold text-[#191C1F] group-hover:text-black transition-colors leading-[1.25] mb-2.5 ${
                            isFeatured
                              ? "text-[22px] md:text-[24px]"
                              : "text-[18px] md:text-[20px]"
                          }`}
                        >
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-sm text-[#5A5D66] leading-relaxed line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        {/* Card Footer: Date & Reading Time */}
                        <div className="mt-auto pt-3 border-t border-[rgba(0,0,0,0.05)] flex items-center justify-between text-xs text-[#8C8C8C]">
                          <span>{post.date}</span>
                          <span className="font-mono">{post.readTime}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
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
