import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * Base Tag (Badge) — Display / Selection × Primary / Secondary ×
 * Gray / Blue / Green / Yellow / Orange / Red / Purple / Brown × 4 sizes.
 */
const badgeVariants = cva(
  "base-tag inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap outline-none transition-[background-color,color,box-shadow] focus-visible:outline-none [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "",
        secondary: "",
        outline: "!bg-transparent shadow-[inset_0_0_0_1px_var(--base-border-strong)]",
        destructive: "",
        ghost: "!bg-transparent",
        link: "!bg-transparent !px-0 text-[var(--base-accent)] underline-offset-4 hover:underline",
      },
      color: {
        gray: "",
        blue: "",
        green: "",
        yellow: "",
        orange: "",
        red: "",
        purple: "",
        brown: "",
      },
      size: {
        xs: "base-tag--xs",
        sm: "base-tag--sm",
        default: "base-tag--sm",
        md: "",
        lg: "base-tag--lg",
      },
      hierarchy: {
        secondary: "",
        primary: "",
      },
    },
    compoundVariants: [
      { variant: "destructive", color: "gray", className: "!bg-[var(--base-red-50)] !text-[var(--base-red-600)]" },
    ],
    defaultVariants: {
      variant: "default",
      color: "gray",
      size: "default",
      hierarchy: "secondary",
    },
  }
)

function Badge({
  className,
  variant = "default",
  color = "gray",
  size = "default",
  hierarchy = "secondary",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; color?: "gray" | "blue" | "green" | "yellow" | "orange" | "red" | "purple" | "brown" }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-color={variant === "destructive" ? "red" : color}
      data-hierarchy={hierarchy}
      data-size={size}
      className={cn(badgeVariants({ variant, size, hierarchy }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
