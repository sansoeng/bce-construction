import * as React from "react"
import { cn } from "@/lib/utils"

/** Base Tile — 12 px radius, hairline, optional media. */
function Tile({
  className,
  media,
  title,
  children,
  meta,
  footer,
  interactive,
  dark,
  ...props
}: React.ComponentProps<"div"> & {
  media?: React.ReactNode
  title?: React.ReactNode
  meta?: React.ReactNode
  footer?: React.ReactNode
  interactive?: boolean
  dark?: boolean
}) {
  return (
    <div
      data-slot="tile"
      className={cn(
        "base-tile",
        interactive && "cursor-pointer transition-shadow hover:shadow-[0_4px_16px_rgb(0_0_0_/_0.12)]",
        dark && "base-tile--dark",
        className
      )}
      {...props}
    >
      {media && <div className="base-tile__media">{media}</div>}
      {title && <p className="base-tile__title">{title}</p>}
      {children && <div className="base-tile__text">{children}</div>}
      {meta && <div className="base-tile__meta">{meta}</div>}
      {footer && <div className="mt-1 flex items-center gap-2">{footer}</div>}
    </div>
  )
}

/** Base List item — 72 px min height, 16 px padding, optional artwork + control. */
function ListItem({
  className,
  artwork,
  title,
  description,
  control,
  ...props
}: React.ComponentProps<"div"> & {
  artwork?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  control?: React.ReactNode
}) {
  return (
    <div data-slot="list-item" className={cn("base-list-item", className)} {...props}>
      {artwork && <div className="base-list-item__artwork">{artwork}</div>}
      <div className="base-list-item__body">
        {title && <p className="base-list-item__title">{title}</p>}
        {description && <div className="base-list-item__text">{description}</div>}
      </div>
      {control && <div className="base-list-item__control">{control}</div>}
    </div>
  )
}

/** Base Section heading — title + description with a trailing action. */
function SectionHeading({
  className,
  title,
  description,
  action,
  ...props
}: React.ComponentProps<"div"> & {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div data-slot="section-heading" className={cn("base-section-heading", className)} {...props}>
      <div className="base-section-heading__body">
        <p className="base-section-heading__title">{title}</p>
        {description && <p className="base-section-heading__text">{description}</p>}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  )
}

export { Tile, ListItem, SectionHeading }
