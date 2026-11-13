import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}

/** Base Pagination — numbered pages with overflow, Previous / Next. */
function PaginationBar({
  className,
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  labels = { previous: "Previous", next: "Next" },
}: {
  className?: string
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  siblingCount?: number
  labels?: { previous: string; next: string }
}) {
  if (pageCount <= 1) return null

  const totalSlots = siblingCount * 2 + 5
  let pages: (number | "ellipsis-start" | "ellipsis-end")[]

  if (pageCount <= totalSlots) {
    pages = range(1, pageCount)
  } else {
    const left = Math.max(2, page - siblingCount)
    const right = Math.min(pageCount - 1, page + siblingCount)
    pages = [1]
    if (left > 2) pages.push("ellipsis-start")
    pages.push(...range(left, right))
    if (right < pageCount - 1) pages.push("ellipsis-end")
    pages.push(pageCount)
  }

  return (
    <nav aria-label="pagination" className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        className="base-page-btn gap-1 px-3"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">{labels.previous}</span>
      </button>

      <div className="base-pagination">
        {pages.map((entry) =>
          typeof entry === "number" ? (
            <button
              key={entry}
              type="button"
              className="base-page-btn tabular-nums"
              aria-current={entry === page ? "page" : undefined}
              onClick={() => onPageChange(entry)}
            >
              {entry}
            </button>
          ) : (
            <span key={entry} className="base-page-btn base-page-btn--ellipsis" aria-hidden>
              <MoreHorizontal className="size-4" />
            </span>
          )
        )}
      </div>

      <button
        type="button"
        className="base-page-btn gap-1 px-3"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
      >
        <span className="hidden sm:inline">{labels.next}</span>
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}

/** Base Page control — dot indicators for carousels / galleries. */
function PageControl({
  className,
  count,
  index,
  onChange,
  labels,
}: {
  className?: string
  count: number
  index: number
  onChange?: (index: number) => void
  labels?: string[]
}) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)} role="tablist">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={labels?.[i] ?? `Page ${i + 1}`}
          onClick={() => onChange?.(i)}
          className={cn(
            "h-2 rounded-full transition-all",
            i === index ? "w-6 bg-[var(--base-black)]" : "w-2 bg-[var(--base-gray-300)] hover:bg-[var(--base-gray-400)]"
          )}
        />
      ))}
    </div>
  )
}

export { PaginationBar, PageControl }
