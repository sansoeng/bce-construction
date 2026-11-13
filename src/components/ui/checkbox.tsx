import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

/** Base Check — 24 × 24, 4 px radius, black fill when selected. */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer grid size-6 shrink-0 cursor-pointer place-content-center rounded-[4px] bg-white",
        "shadow-[inset_0_0_0_2px_var(--base-gray-400)] transition-[background-color,box-shadow,color] outline-none",
        "text-transparent",
        "focus-visible:shadow-[0_0_0_3px_rgb(39_110_241_/_0.28)]",
        "data-[state=checked]:bg-[var(--base-black)] data-[state=checked]:text-white data-[state=checked]:shadow-none",
        "data-[state=indeterminate]:bg-[var(--base-black)] data-[state=indeterminate]:text-white data-[state=indeterminate]:shadow-none",
        "disabled:cursor-not-allowed disabled:bg-[var(--base-surface-disabled)] disabled:shadow-[inset_0_0_0_2px_var(--base-gray-200)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        {props.checked === "indeterminate" ? (
          <MinusIcon className="size-4" strokeWidth={3} />
        ) : (
          <CheckIcon className="size-4" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
