import * as React from "react"
import { cn } from "@/lib/utils"
import { Progress as ProgressPrimitive } from "radix-ui"

/** Base Progress bar — 8 px track (4 / 12 variants), black fill. */
function Progress({
  className,
  value,
  size = "md",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  size?: "sm" | "md" | "lg"
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-size={size}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-[9999px] bg-[var(--base-gray-200)]",
        "data-[size=sm]:h-1 data-[size=lg]:h-3",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-[9999px] bg-[var(--base-black)] transition-transform duration-300"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
