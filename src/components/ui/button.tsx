import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * Base (Uber) Button — Rect / Pill × Small / Medium / Large ×
 * Primary / Secondary / Tertiary / Negative · Enabled / Pressed / Disabled / Loading
 */
const buttonVariants = cva(
  [
    "base-btn",
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none",
    "transition-[background-color,box-shadow,transform] disabled:pointer-events-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "base-btn--primary",
        primary: "base-btn--primary",
        secondary: "base-btn--secondary",
        outline: "base-btn--secondary",
        destructive: "base-btn--danger",
        danger: "base-btn--danger",
        accent: "base-btn--accent",
        ghost: "base-btn--tertiary",
        tertiary: "base-btn--tertiary",
        link: "base-btn--link",
      },
      size: {
        default: "base-btn--md",
        xs: "base-btn--sm",
        sm: "base-btn--sm",
        md: "base-btn--md",
        lg: "base-btn--lg",
        pill: "base-btn--md base-btn--pill",
        icon: "base-btn--icon",
        "icon-xs": "base-btn--icon base-btn--sm",
        "icon-sm": "base-btn--icon base-btn--sm",
        "icon-lg": "base-btn--icon base-btn--lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
