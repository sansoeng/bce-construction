"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  )
}

/** Base Tabs — underline track, 3 px black indicator, 16 / 20 medium labels. */
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-start gap-1 text-[var(--base-content-secondary)] group-data-[orientation=horizontal]/tabs:h-12 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "rounded-[8px] bg-[var(--base-surface)] p-1",
        line: "border-b border-[var(--base-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-2 px-4 text-base font-medium whitespace-nowrap transition-colors outline-none",
        "text-[var(--base-content-secondary)] hover:text-[var(--base-content)]",
        "focus-visible:shadow-[0_0_0_3px_rgb(39_110_241_/_0.28)]",
        "disabled:pointer-events-none disabled:text-[var(--base-content-disabled)]",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        // boxed variant
        "group-data-[variant=default]/tabs-list:h-10 group-data-[variant=default]/tabs-list:rounded-[6px]",
        "group-data-[variant=default]/tabs-list:data-[state=active]:bg-white group-data-[variant=default]/tabs-list:data-[state=active]:text-[var(--base-content)] group-data-[variant=default]/tabs-list:data-[state=active]:shadow-[0_1px_2px_rgb(0_0_0_/_0.08)]",
        // line variant
        "group-data-[variant=line]/tabs-list:h-12 group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:hover:bg-[var(--base-gray-50)]",
        "group-data-[variant=line]/tabs-list:data-[state=active]:text-[var(--base-content)]",
        "after:absolute after:bg-[var(--base-black)] after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-0 group-data-[orientation=horizontal]/tabs:after:h-[3px] group-data-[orientation=horizontal]/tabs:after:rounded-t-[3px] group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-px group-data-[orientation=vertical]/tabs:after:w-[3px]",
        "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
