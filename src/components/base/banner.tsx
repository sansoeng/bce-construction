import * as React from "react"
import { cn } from "@/lib/utils"

export type BannerStyle = "accent" | "positive" | "warning" | "negative"

/**
 * Base Banner — High / Low hierarchy × Simple layout ×
 * Accent / Positive / Warning / Negative.
 */
function Banner({
  className,
  style = "accent",
  hierarchy = "high",
  icon,
  title,
  children,
  actions,
  ...props
}: React.ComponentProps<"div"> & {
  style?: BannerStyle
  hierarchy?: "high" | "low"
  icon?: React.ReactNode
  title?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div
      data-slot="banner"
      data-style={style}
      data-hierarchy={hierarchy}
      role="status"
      className={cn("base-banner", className)}
      {...props}
    >
      {icon && <div className="base-banner__artwork">{icon}</div>}
      <div className="base-banner__body">
        {title && <p className="base-banner__title">{title}</p>}
        {children && <div className="base-banner__text">{children}</div>}
        {actions && <div className="base-banner__actions">{actions}</div>}
      </div>
    </div>
  )
}

/** Base System banner — 48 px, full-width, single line. */
function SystemBanner({
  className,
  style = "accent",
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> & { style?: BannerStyle; icon?: React.ReactNode }) {
  return (
    <div
      data-slot="system-banner"
      data-style={style}
      role="status"
      className={cn("base-system-banner", className)}
      {...props}
    >
      {icon && <span className="[&_svg]:size-5">{icon}</span>}
      <span>{children}</span>
    </div>
  )
}

/** Base Message card — inline message with a leading icon. */
function MessageCard({
  className,
  icon,
  title,
  children,
  action,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: React.ReactNode
  title?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div data-slot="message-card" className={cn("base-message-card", className)} {...props}>
      {icon && <span className="base-message-card__icon">{icon}</span>}
      <div className="base-message-card__body">
        {title && <p className="base-message-card__title">{title}</p>}
        {children && <div className="base-message-card__text">{children}</div>}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  )
}

export { Banner, SystemBanner, MessageCard }
