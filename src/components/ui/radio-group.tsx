"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CircleIcon } from "lucide-react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

/** Base Radio — 24 × 24 circle, black dot when selected. */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-6 shrink-0 cursor-pointer rounded-full bg-white outline-none",
        "shadow-[inset_0_0_0_2px_var(--base-gray-400)] transition-[box-shadow,background-color]",
        "focus-visible:shadow-[0_0_0_3px_rgb(39_110_241_/_0.28)]",
        "data-[state=checked]:bg-[var(--base-black)] data-[state=checked]:shadow-none",
        "disabled:cursor-not-allowed disabled:bg-[var(--base-surface-disabled)] disabled:shadow-[inset_0_0_0_2px_var(--base-gray-200)]",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 fill-white text-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
