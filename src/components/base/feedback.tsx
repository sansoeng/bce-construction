import * as React from "react"
import { cn } from "@/lib/utils"

/** Base Empty state — artwork, title, text, actions. */
function EmptyState({
  className,
  icon,
  title,
  children,
  actions,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: React.ReactNode
  title: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div data-slot="empty-state" className={cn("base-empty", className)} {...props}>
      {icon && <div className="base-empty__artwork">{icon}</div>}
      <p className="base-empty__title">{title}</p>
      {children && <div className="base-empty__text">{children}</div>}
      {actions && <div className="base-empty__actions">{actions}</div>}
    </div>
  )
}

/** Base Snackbar — 12 px radius, #282828, 16 / 24 text. */
function Snackbar({
  className,
  icon,
  children,
  action,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div data-slot="snackbar" role="status" className={cn("base-snackbar", className)} {...props}>
      {icon && <span className="flex-none [&_svg]:size-5">{icon}</span>}
      <span className="min-w-0 flex-1">{children}</span>
      {action && <div className="base-snackbar__action">{action}</div>}
    </div>
  )
}

/** Base Spacer — fixed 4 px scale gap. */
function Spacer({ size = 16, className }: { size?: number; className?: string }) {
  return <div aria-hidden className={cn("base-spacer", className)} style={{ width: size, height: size }} />
}

export { EmptyState, Snackbar, Spacer }
