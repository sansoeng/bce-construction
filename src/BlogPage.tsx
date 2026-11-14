import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { translate } from "./i18n";
import { BLOG_POSTS, journalKind, type BlogPost, type JournalKind } from "./blogData";

// Journal archive after olympic.no/journal: a small mono standfirst, a two-line display title, one segmented
// News/Insight control, then every story as a square photographic tile in a three-column grid. The reader below keeps
// the same paper layout: oversized title, full-bleed photograph, a narrow measure, then related tiles.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

const KINDS: ("All" | JournalKind)[] = ["All", "News", "Insight"];

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

  // Synchronize browser history / deep link
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get("post"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
    return BLOG_POSTS.filter((p) => kindFilter === "All" || journalKind(p) === kindFilter);
  }, [kindFilter]);

  const currentPost = useMemo(() => {
    if (!selectedSlug) return null;
    return BLOG_POSTS.find((p) => p.slug === selectedSlug) || null;
  }, [selectedSlug]);

  const relatedPosts = useMemo(() => {
    if (!currentPost) return [];
    return BLOG_POSTS.filter((p) => p.slug !== currentPost.slug).slice(0, 3);
  }, [currentPost]);

  const clearFilters = () => {
    setKindFilter("All");
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
          <section className="w-full px-5 pb-24 pt-32 sm:px-6 md:px-8 md:pt-44 xl:px-12 lg:pt-[24vh]">
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

              {/* All stories, listed as square photographic tiles */}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 md:mt-14">
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

                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={kindFilter === "All"}
                  className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-[#191C1F]/50 transition-colors hover:text-[#191C1F] disabled:text-[#191C1F]/25 sm:inline-flex md:text-[11px]"
                >
                  Clear filters
                </button>
              </div>

              {filteredPosts.length === 0 ? (
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
              ) : (
                <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-[104px]">
                  {filteredPosts.map((post) => (
                    <PostTile key={post.slug} post={post} onSelect={handleSelectPost} />
                  ))}
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
