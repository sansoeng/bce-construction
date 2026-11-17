import { siteSettings } from "./siteSettings";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import { usePageSetup } from "./usePageSetup";
import { translate } from "./i18n";
import { BLOG_POSTS, journalKind, type BlogPost, type JournalKind } from "./blogData";
import { SAMPLE_JOURNAL } from "./contentFlags";
import { transitionView } from "./pageTransition";

// Journal archive after olympic.no/journal: a small mono standfirst, a two-line display title, one segmented
// News/Insight control, then every story as a square photographic tile in a three-column grid. The reader below keeps
// the same paper layout: oversized title, full-bleed photograph, a narrow measure, then related tiles.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;

const KINDS: ("All" | JournalKind)[] = ["All", "News", "Insight"];

function Meta({ children, className = "", accent = false }: { children: ReactNode; className?: string; accent?: boolean }) {
  return (
    <span
      className={`font-mono uppercase leading-[1.6] tracking-[0.1em] ${
        accent ? "text-[14px] text-[#FB290E]" : "text-[14px]"
      } ${className}`}
    >
      {children}
    </span>
  );
}

function PostTile({ post, onSelect }: { post: BlogPost; onSelect: (slug: string) => void }) {
  return (
    <a
      href={`/blog?post=${post.slug}`}
      onClick={(event) => {
        event.preventDefault();
        onSelect(post.slug);
      }}
      className="group block hover:opacity-100"
    >
      <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#EDEDED]">
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
          <li className="rounded-[4px] border border-white/40 bg-black/15 px-2.5 py-1.5 font-mono text-[14px] uppercase leading-none tracking-[0.08em] text-white backdrop-blur-[2px]">
            {journalKind(post)}
          </li>
          {(post.sample ?? SAMPLE_JOURNAL) && (
            <li className="rounded-[4px] border border-white/40 bg-[#FB290E]/80 px-2.5 py-1.5 font-mono text-[14px] uppercase leading-none tracking-[0.08em] text-white backdrop-blur-[2px]">
              Sample
            </li>
          )}
        </ul>
      </div>

      <div className="pt-4 md:pt-5">
        <Meta className="text-[#FB290E]">{post.category}</Meta>
        <h3 className="mt-3 text-[18px] font-medium leading-[1.2] tracking-[-0.015em] text-[#111] sm:text-[19px] lg:text-[clamp(19px,1.55vw,26px)] lg:leading-[1.19]">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
            {post.title}
          </span>
        </h3>
      </div>
    </a>
  );
}

function ShareIcon({ network }: { network: "linkedin" | "facebook" | "telegram" }) {
  if (network === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6.5 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 5.9V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 3V21h-4V9z" />
      </svg>
    );
  }
  if (network === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H16.4V5.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4V11H7.5v3H10v7h3.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M21.9 4.3 18.7 20c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.2 13.9l-4.8-1.5c-1-.3-1-1 .2-1.5L20.4 2.8c.9-.3 1.7.2 1.5 1.5z" />
    </svg>
  );
}

export default function BlogPage() {
  usePageSetup("Blog & Engineering Insights | BCE., Ltd.");

  // Read the post slug from the URL (e.g. /blog?post=...)
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
    transitionView(() => {
      setSelectedSlug(slug);
      const url = new URL(window.location.href);
      url.searchParams.set("post", slug);
      window.history.pushState(null, "", url.toString());
      toTop();
    });
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

  const currentIndex = currentPost ? BLOG_POSTS.findIndex((p) => p.slug === currentPost.slug) : 0;
  const prevPost = BLOG_POSTS[(currentIndex - 1 + BLOG_POSTS.length) % BLOG_POSTS.length];
  const nextPost = BLOG_POSTS[(currentIndex + 1) % BLOG_POSTS.length];

  const shareHref = typeof window !== "undefined" ? window.location.href : "";
  const shareLinks = [
    {
      key: "linkedin" as const,
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareHref)}`,
    },
    {
      key: "facebook" as const,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareHref)}`,
    },
    {
      key: "telegram" as const,
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(shareHref)}&text=${encodeURIComponent(currentPost?.title ?? "")}`,
    },
  ];

  const clearFilters = () => {
    setKindFilter("All");
  };

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />

      <main className="min-h-screen bg-white">
        {currentPost ? (
          /* =========================================================================
              VIEW A: SINGLE JOURNAL STORY (after olympic.no/journal/<story>)
             ========================================================================= */
          <article className="w-full">
            <section className="site-pad pb-0 pt-32 md:pt-56 lg:pt-[340px]">
              <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center">
                <Meta accent>News &amp; insight</Meta>
                <h1
                  data-split
                  data-split-type="words"
                  className="mt-6 max-w-[670px] text-center text-[clamp(26px,2.31vw,44px)] font-medium uppercase leading-[1.1] tracking-[-0.01em] text-[#111]"
                >
                  {currentPost.title}
                </h1>

                {(currentPost.sample ?? SAMPLE_JOURNAL) && (
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#FB290E]/25 bg-[#FB290E]/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#FB290E]">
                    Illustrative draft — pending BCE review
                  </p>
                )}

                <div className="mt-8 flex w-full items-center justify-between gap-4 font-mono text-[14px] uppercase leading-[1.6] tracking-[0.02em] text-[#737373]">
                  <span>{currentPost.category}</span>
                  <span className="text-right">
                    Scroll to read <span aria-hidden>•</span> {currentPost.readTime}
                  </span>
                </div>

                <div className="mt-8 flex w-full items-center justify-between md:mt-10">
                  <a
                    href={`/blog?post=${prevPost.slug}`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleSelectPost(prevPost.slug);
                    }}
                    className="inline-flex h-[31px] items-center gap-2 rounded-[8px] border border-[#111]/15 px-3 font-mono text-[14px] uppercase tracking-[0.02em] text-[#111] transition-colors hover:bg-[#111] hover:text-white hover:opacity-100"
                  >
                    <span aria-hidden>←</span> Prev
                  </a>
                  <a
                    href={`/blog?post=${nextPost.slug}`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleSelectPost(nextPost.slug);
                    }}
                    className="inline-flex h-[31px] items-center gap-2 rounded-[8px] border border-[#111]/15 px-3 font-mono text-[14px] uppercase tracking-[0.02em] text-[#111] transition-colors hover:bg-[#111] hover:text-white hover:opacity-100"
                  >
                    Next <span aria-hidden>→</span>
                  </a>
                </div>
              </div>

              <figure className="mx-auto mt-14 aspect-[4/3] w-full max-w-[1400px] overflow-hidden bg-[#EDEDED] md:mt-16 md:aspect-[1400/1013]">
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
              </figure>
            </section>

            <section className="site-pad mt-20 md:mt-[140px]">
              <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-10 md:grid-cols-12 md:gap-5">
                <aside className="order-2 md:order-1 md:col-span-4">
                  <Meta className="text-[#111]">Share</Meta>
                  <ul className="mt-4 flex items-center gap-2">
                    {shareLinks.map(({ key, label, href }) => (
                      <li key={key}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Share on ${label}`}
                          className="flex size-[31px] items-center justify-center rounded-[8px] border border-[#111]/15 text-[#111]/65 transition-colors hover:border-[#111] hover:text-[#111] hover:opacity-100"
                        >
                          <ShareIcon network={key} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>

                <div className="order-1 md:order-2 md:col-span-5 md:col-start-7">
                  <p className="text-[17.5px] leading-[1.5] tracking-[-0.01em] text-[#111]">
                    {currentPost.content.intro}
                  </p>

                  <div className="mt-11 space-y-[50px]">
                    {currentPost.content.sections?.map((sec, idx) => (
                      <section key={idx}>
                        <h2 className="text-[21px] font-medium leading-[1.35] tracking-[-0.01em] text-[#111]">
                          {sec.heading}
                        </h2>
                        <div className="mt-6 space-y-[27px] text-[15.5px] leading-[1.7] text-[#737373]">
                          {sec.body.map((paragraph, pIdx) => (
                            <p key={pIdx}>{paragraph}</p>
                          ))}
                        </div>
                        {sec.callout && (
                          <blockquote className="relative mt-[50px] border-l border-[#111]/20 pl-6 text-[clamp(20px,1.74vw,25px)] leading-[1.25] tracking-[-0.01em] text-[#111]">
                            <span
                              aria-hidden
                              className="absolute left-5 -top-4 font-serif text-[44px] leading-none text-[#111]/25"
                            >
                              &ldquo;
                            </span>
                            {sec.callout}
                          </blockquote>
                        )}
                      </section>
                    ))}

                    {currentPost.content.takeaways && (
                      <section className="border-t border-[#111]/10 pt-8">
                        <h2 className="text-[21px] font-medium leading-[1.35] tracking-[-0.01em] text-[#111]">
                          Key takeaways
                        </h2>
                        <ul className="mt-5 space-y-3 text-[15px] leading-[1.65] text-[#737373]">
                          {currentPost.content.takeaways.map((item, tIdx) => (
                            <li key={tIdx} className="flex gap-3">
                              <span className="mt-[9px] size-1 shrink-0 rounded-full bg-[#111]/50" aria-hidden />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Explore more */}
            {relatedPosts.length > 0 && (
              <section className="site-pad mt-20 bg-[#F8F8F9] py-16 md:mt-[140px] md:py-20">
                <div className="mx-auto w-full max-w-[1360px]">
                  <Meta accent>News &amp; insight</Meta>
                  <h2
                    data-split
                    data-split-type="words"
                    className="mt-5 max-w-[670px] text-[clamp(26px,2.31vw,44px)] font-medium uppercase leading-[1.1] tracking-[-0.01em] text-[#111]"
                  >
                    {translate("Explore more of latest news & insights")}
                  </h2>
                  <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
                    {relatedPosts.map((post) => (
                      <PostTile key={post.slug} post={post} onSelect={handleSelectPost} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </article>
        ) : (
          /* =========================================================================
              VIEW B: JOURNAL ARCHIVE
             ========================================================================= */
          <section className="site-shell pb-24 pt-32 md:pt-44 lg:pt-[24vh]">
            <div className="w-full">
              <header>
                <Meta accent>News &amp; insight</Meta>
                <h1
                  data-split
                  data-split-type="words"
                  className="mt-5 text-[clamp(42px,4.72vw,64px)] font-medium uppercase leading-[1.02] tracking-[-0.03em] text-[#111] md:mt-7"
                >
                  <span className="block">{translate("Building with")}</span>{" "}
                  <span className="block">{translate("insight")}</span>
                </h1>
                {BLOG_POSTS.some((post) => post.sample ?? SAMPLE_JOURNAL) && (
                  <p className="mt-6 max-w-[44rem] text-[14px] leading-[1.6] text-[#111]/50">
                    The Journal is an editorial preview. Articles marked “Sample content” are illustrative drafts awaiting
                    BCE technical review.
                  </p>
                )}
              </header>

              {/* All stories, listed as square photographic tiles */}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 md:mt-14">
                <div
                  className="inline-flex items-center rounded-[6px] bg-[#111]/10 p-[3px]"
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
                        className={`h-9 rounded-[4px] px-4 font-mono text-[14px] uppercase leading-none tracking-[0.08em] transition-colors duration-200 ${
                          active ? "bg-[#111] text-white" : "text-[#111]/60 hover:text-[#111]"
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
                  className="hidden font-mono text-[14px] uppercase tracking-[0.1em] text-[#111]/50 transition-colors hover:text-[#111] disabled:text-[#111]/25 sm:inline-flex"
                >
                  Clear filters
                </button>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="mt-16 border-t border-black/[0.08] pt-16 md:mt-20">
                  <p className="text-[20px] font-medium tracking-[-0.01em] text-[#111] md:text-[24px]">
                    No articles found for the selected filter.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-[4px] bg-[#111] px-5 py-3 font-mono text-[14px] uppercase tracking-[0.08em] text-white"
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

        {currentPost ? null : <QuoteCta href="/quote" />}
        <Footer phones={phones} tel={tel} base="/" />
        <FluidCursor />
      </main>
    </>
  );
}
