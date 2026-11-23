import { useEffect, useRef, useState } from "react";
import "./filter.css";

// The filter bar shared by the project archive and the Resources library: mono pill triggers that drop a grey panel
// of chips, the chosen values echoed as removable tags, and one clear action at the far right. The pages keep their
// own selection state; this owns the open panel, its measured height and the dismissal rules.

export type FilterOption = { value: string; label: string; count?: number };
export type FilterFacet = { key: string; label: string; options: FilterOption[] };
export type FilterSelection = Record<string, string[]>;

type BarProps = {
  facets: FilterFacet[];
  selection: FilterSelection;
  onToggle: (key: string, value: string) => void;
  onClearFacet: (key: string) => void;
  onClearAll: () => void;
  label?: string;
  /** `bar` sits the facets on the right of a hairline row; `column` stacks them full width for a sidebar. */
  layout?: "bar" | "column";
};

const countSelected = (facets: FilterFacet[], selection: FilterSelection) =>
  facets.reduce((total, facet) => total + (selection[facet.key]?.length ?? 0), 0);

export function FilterBar({
  facets,
  selection,
  onToggle,
  onClearFacet,
  onClearAll,
  label = "Filter",
  layout = "bar",
}: BarProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  // The panel animates on max-height, exactly as olympic.no's accordion filters: the open panel's content height is
  // measured when it opens, so the 0.88s cubic-bezier(.77,0,.18,1) sweep runs to the right length.
  const [panelHeight, setPanelHeight] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const panels = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleFacet = (key: string) => {
    if (openKey === key) {
      setOpenKey(null);
      return;
    }
    const panel = panels.current[key];
    setPanelHeight(panel ? panel.scrollHeight : 0);
    setOpenKey(key);
  };

  // One facet open at a time, closed by a click anywhere else or by Escape.
  useEffect(() => {
    if (!openKey) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenKey(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenKey(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openKey]);

  // Keep the open panel's max-height in step with its content when the labels reflow.
  useEffect(() => {
    if (!openKey) return;
    const remeasure = () => {
      const panel = panels.current[openKey];
      if (panel) setPanelHeight(panel.scrollHeight);
    };
    addEventListener("resize", remeasure);
    return () => removeEventListener("resize", remeasure);
  }, [openKey]);

  return (
    <div className={`fx-bar${layout === "column" ? " fx-bar--column" : ""}`} role="group" aria-label={label} ref={rootRef}>
      <div className="fx-facets">
        {facets.map((facet) => {
          const chosen = selection[facet.key] ?? [];
          const isOpen = openKey === facet.key;
          return (
            <div className={`fx-facet${isOpen ? " is-open" : ""}`} key={facet.key}>
              <button
                type="button"
                className="fx-trigger fx-wipe"
                aria-expanded={isOpen}
                aria-controls={`fx-facet-${facet.key}`}
                onClick={() => toggleFacet(facet.key)}
              >
                <span>{facet.label}</span>
                {chosen.length > 0 && <span className="fx-trigger__count">{chosen.length}</span>}
                <svg className="fx-trigger__chev" width="7" height="4" viewBox="0 0 7 4" aria-hidden="true">
                  <path d="M3.5 4 0 0h7L3.5 4Z" fill="currentColor" />
                </svg>
              </button>

              <div
                id={`fx-facet-${facet.key}`}
                ref={(el) => {
                  panels.current[facet.key] = el;
                }}
                className={`fx-dropdown fx-panel${isOpen ? " is-open" : ""}`}
                role="group"
                aria-label={facet.label}
                style={{ maxHeight: isOpen ? panelHeight : 0 }}
              >
                <p className="fx-dropdown__title">{facet.label}</p>

                <div className="fx-dropdown__chips">
                  <button
                    type="button"
                    className="fx-chip fx-wipe"
                    aria-pressed={chosen.length === 0}
                    onClick={() => onClearFacet(facet.key)}
                  >
                    All
                  </button>

                  {facet.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="fx-chip fx-wipe"
                      aria-pressed={chosen.includes(option.value)}
                      onClick={() => onToggle(facet.key, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="fx-clear"
          onClick={onClearAll}
          disabled={countSelected(facets, selection) === 0}
          aria-label="Clear filters"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}

type MetaProps = {
  facets: FilterFacet[];
  selection: FilterSelection;
  /** Omit on pages that show their own per-section count. */
  count?: string;
  onToggle: (key: string, value: string) => void;
};

/** The result count, then the chosen values as removable tags, set in the left band above the results. */
export function FilterMeta({ facets, selection, count, onToggle }: MetaProps) {
  const active = facets.flatMap((facet) =>
    (selection[facet.key] ?? []).map((value) => ({
      facet,
      value,
      label: facet.options.find((option) => option.value === value)?.label ?? value,
    }))
  );

  return (
    <div className="fx-meta">
      {count ? <span className="fx-count">{count}</span> : null}

      {active.length > 0 && (
        <div className="fx-tags">
          {active.map(({ facet, value, label }) => (
            <button
              key={`${facet.key}:${value}`}
              type="button"
              className="fx-tag"
              onClick={() => onToggle(facet.key, value)}
              aria-label={`Remove ${label} filter`}
            >
              <span>{label}</span>
              <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                <path d="M1 1l6 6M7 1 1 7" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
