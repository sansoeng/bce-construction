import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Base Banner / Alert — 12 px radius, 16 px padding,
 * Accent / Positive / Warning / Negative × High / Low.
 */
const alertVariants = cva(
  "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 rounded-[12px] px-4 py-3 text-sm [&>svg]:size-5 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-[var(--base-accent)] text-white",
        info: "bg-[var(--base-accent)] text-white",
        success: "bg-[var(--base-positive)] text-white",
        warning: "bg-[var(--base-warning)] text-[var(--base-black)]",
        destructive: "bg-[var(--base-negative)] text-white",
      },
      hierarchy: {
        high: "",
        low: "",
      },
    },
    compoundVariants: [
      { variant: "info", hierarchy: "low", className: "bg-[var(--base-blue-50)] text-[var(--base-blue-700)]" },
      { variant: "success", hierarchy: "low", className: "bg-[var(--base-green-50)] text-[var(--base-green-700)]" },
      { variant: "warning", hierarchy: "low", className: "bg-[var(--base-yellow-50)] text-[var(--base-yellow-700)]" },
      { variant: "destructive", hierarchy: "low", className: "bg-[var(--base-red-50)] text-[var(--base-red-700)]" },
    ],
    defaultVariants: {
      variant: "default",
      hierarchy: "high",
    },
  }
)

function Alert({
  className,
  variant,
  hierarchy,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, hierarchy }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 min-h-5 text-base font-medium leading-5", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 grid justify-items-start gap-1 text-base leading-6 opacity-95 [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
