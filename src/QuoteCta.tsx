import { Fragment, useLayoutEffect, useRef, type CSSProperties } from "react";
import ArrowButton from "./ArrowButton";
import { homepage } from "./homepage";
import { translate } from "./i18n";

// Closing statement above the footer, after olympic.no/investor's "fullwidth copy": a calm off-white band, a mono
// kicker, one centred paragraph whose words fade in as the band crosses the viewport, and the two actions. The
// statement is the editable quote title plus its paragraph, split into words for the scroll progress. Unlike the old
// photo band, it starts on paper and lets the type do the work.

export default function QuoteCta({ href }: { href?: string }) {
  const copyRef = useRef<HTMLParagraphElement>(null);
  const { title, text, ctaLabel, ctaHref } = homepage.quote;
  const target = href ?? ctaHref;

  // Translate the full sentences before splitting: the site's Khmer pass matches whole phrases, not single words.
  const statement = `${translate(title)} ${translate(text)}`.trim();
  const words = statement.split(/\s+/).filter(Boolean);

  useLayoutEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }

    // 0 when the paragraph's top reaches the viewport bottom, 1 once its bottom has passed the top.
    // One rect read and one custom property per scroll event is cheap; avoiding rAF also keeps it working in
    // background/throttled tabs.
    const update = () => {
      const r = el.getBoundingClientRect();
      const raw = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      // Keep the opening sentence readable the moment the band enters, rather than a fully faint paragraph.
      const visible = r.top < innerHeight && r.bottom > 0;
      el.style.setProperty("--p", (visible ? Math.max(raw, 0.12) : raw).toFixed(4));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [statement]);

  return (
    <section id="quote" data-header-title="Request a quotation" aria-labelledby="quote-title" className="qc">
      <div className="qc-inner">
        <p className="qc-label">{translate("Start a project")}</p>
        <p
          ref={copyRef}
          id="quote-title"
          className="qc-copy"
          style={{ "--split-count": Math.max(words.length, 2) } as CSSProperties}
        >
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span className="qc-word" style={{ "--i": i } as CSSProperties}>{word}</span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </p>
        <div className="qc-actions">
          <ArrowButton href="/?contact" label={translate("Contact us")} theme="outline" />
          <ArrowButton href={target} label={translate(ctaLabel)} theme="black" />
        </div>
      </div>
    </section>
  );
}
