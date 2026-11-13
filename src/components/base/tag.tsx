import * as React from "react"
import { cn } from "@/lib/utils"

export type TagColor = "gray" | "blue" | "green" | "yellow" | "orange" | "red" | "purple" | "brown"

export type TagProps = React.ComponentProps<"span"> & {
  color?: TagColor
  hierarchy?: "primary" | "secondary"
  size?: "xs" | "sm" | "md" | "lg"
  selected?: boolean
  pill?: boolean
  icon?: React.ReactNode
}

/**
 * Base Tag — Display / Selection × Primary / Secondary × 8 colours ×
 * XSmall / Small / Medium / Large.
 */
function Tag({
  className,
  color = "gray",
  hierarchy = "secondary",
  size = "md",
  selected,
  pill,
  icon,
  children,
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tag"
      data-color={color}
      data-hierarchy={hierarchy}
      data-selected={selected ? "true" : undefined}
      className={cn(
        "base-tag",
        size === "xs" && "base-tag--xs",
        size === "sm" && "base-tag--sm",
        size === "lg" && "base-tag--lg",
        pill && "base-tag--pill",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  )
}

/** Base Notification badge — count or dot, 20 px pill. */
function NotificationBadge({
  className,
  count,
  dot,
  ...props
}: React.ComponentProps<"span"> & { count?: number | string; dot?: boolean }) {
  if (dot) {
    return (
      <span
        data-slot="notification-badge"
        className={cn("base-notification-badge base-notification-badge--dot", className)}
        {...props}
      />
    )
  }
  if (count === undefined || count === 0) return null
  return (
    <span data-slot="notification-badge" className={cn("base-notification-badge", className)} {...props}>
      {typeof count === "number" && count > 99 ? "99+" : count}
    </span>
  )
}

export { Tag, NotificationBadge }
