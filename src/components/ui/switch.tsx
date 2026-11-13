"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch as SwitchPrimitive } from "radix-ui"

/** Base Switch — 48 × 28 track, 24 px thumb, black when on. */
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full outline-none",
        "h-7 w-12 bg-[var(--base-gray-300)] transition-colors",
        "data-[state=checked]:bg-[var(--base-black)]",
        "focus-visible:shadow-[0_0_0_3px_rgb(39_110_241_/_0.28)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[size=sm]:h-5 data-[size=sm]:w-[34px]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-6 translate-x-0.5 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0_/_0.2)]",
          "transition-transform data-[state=checked]:translate-x-[22px]",
          "group-data-[size=sm]/switch:size-4 group-data-[size=sm]/switch:translate-x-0.5 group-data-[size=sm]/switch:data-[state=checked]:translate-x-[16px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
