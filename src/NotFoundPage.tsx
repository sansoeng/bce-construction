import { useEffect } from "react";
import ArrowButton from "./ArrowButton";
import { applyPageSeo } from "./seo";
import { translate } from "./i18n";
import "./notfound.css";

// 404 (/anything unmatched, and missing files that fall through the Pages rewrite). The layout is the maintenance
// page's: the BCE lockup at the top, the two-gear mark, a centred uppercase title and one muted paragraph. Unlike the
// maintenance page it keeps the site's escape routes — home, the portfolio and contact — so a stale link is not a
// dead end.

export default function NotFoundPage() {
  useEffect(() => {
    applyPageSeo("Page Not Found | BCE Construction");
    // A 404 must never be indexed, even when a crawler follows an old address.
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, follow";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <div className="nf">
      <header className="nf-header">
        <a href="/" aria-label="BCE., Ltd. — home">
          <img className="nf-logo" src="/assets/bce-logo-lockup-ink.svg" alt="BCE., Ltd." width={74} height={44} />
        </a>
      </header>

      <main className="nf-main">
        <div className="nf-mark" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(28 28) scale(6)">
              <g className="nf-spin">
                <path className="nf-gear nf-gear--big" vectorEffect="non-scaling-stroke" d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.24-.24-.42-.49-.42h-3.84c-.24 0-.45.18-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.42.49.42h3.84c.24 0 .45-.18.49-.42l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </g>
            </g>
            <g transform="translate(128.2 128.2) scale(2.4)">
              <g className="nf-spin nf-spin--small">
                <path className="nf-gear nf-gear--small" vectorEffect="non-scaling-stroke" d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.24-.24-.42-.49-.42h-3.84c-.24 0-.45.18-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.42.49.42h3.84c.24 0 .45-.18.49-.42l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </g>
            </g>
          </svg>
        </div>

        <p className="nf-kicker">{translate("Error 404")}</p>
        <h1 className="nf-title">{translate("This page isn’t here.")}</h1>
        <p className="nf-copy">
          {translate("The address may be old or mistyped. Start from the home page, or call")}{" "}
          <a href="tel:+85512932700">012 932 700</a>.
        </p>

        <div className="nf-actions">
          <ArrowButton href="/" label={translate("Home")} />
          <ArrowButton href="/projects" label={translate("Projects")} theme="outline" />
          <ArrowButton href="/businesses" label={translate("Our businesses")} theme="outline" />
          <ArrowButton href="/quality" label={translate("Quality & HSE")} theme="outline" />
          <ArrowButton href="/resources" label={translate("Resources")} theme="outline" />
          <ArrowButton href="/contact" label={translate("Contact us")} theme="outline" />
        </div>
      </main>
    </div>
  );
}
