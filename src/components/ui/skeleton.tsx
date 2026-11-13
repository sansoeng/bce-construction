import { cn } from "@/lib/utils"

/** Base skeleton — grey 100 pulse, 8 px radius. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-[8px] bg-[var(--base-gray-100)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
