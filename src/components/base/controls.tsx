import * as React from "react"
import { Minus, Plus, Star, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

/** Base Segmented control — 4 px inset track, white active segment. */
function SegmentedControl({
  className,
  options,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  options: { value: string; label: React.ReactNode }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div data-slot="segmented" role="group" className={cn("base-segmented", className)} {...props}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className="base-segmented__item"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** Base Star rating — 20 px stars, read-only or interactive. */
function StarRating({
  className,
  value = 0,
  max = 5,
  onChange,
  size = 20,
}: {
  className?: string
  value?: number
  max?: number
  onChange?: (value: number) => void
  size?: number
}) {
  return (
    <div className={cn("base-stars", className)} role={onChange ? "radiogroup" : "img"} aria-label={`${value} of ${max} stars`}>
      {Array.from({ length: max }, (_, index) => {
        const filled = index < value
        return (
          <button
            key={index}
            type="button"
            disabled={!onChange}
            aria-label={`${index + 1} star${index === 0 ? "" : "s"}`}
            aria-pressed={filled}
            onClick={() => onChange?.(index + 1)}
            className={cn("transition-transform", onChange && "hover:scale-110", filled ? "text-[var(--base-yellow-400)]" : "base-stars__empty")}
            style={{ width: size, height: size }}
          >
            <Star className="size-full" fill={filled ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
        )
      })}
    </div>
  )
}

/** Base Stepper field — − value + control. */
function Stepper({
  className,
  value,
  min = 0,
  max = 99,
  step = 1,
  onChange,
  suffix,
}: {
  className?: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  suffix?: string
}) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next))
  return (
    <div
      data-slot="stepper"
      className={cn(
        "inline-flex h-12 items-center gap-1 rounded-[8px] bg-[var(--base-surface)] px-1",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - step))}
        className="grid size-10 place-items-center rounded-[6px] transition-colors hover:bg-white disabled:text-[var(--base-content-disabled)] disabled:hover:bg-transparent"
      >
        <Minus className="size-5" />
      </button>
      <span className="min-w-10 text-center text-base font-medium tabular-nums">
        {value}
        {suffix ? <span className="ml-1 text-[var(--base-content-tertiary)]">{suffix}</span> : null}
      </span>
      <button
        type="button"
        aria-label="Increase"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + step))}
        className="grid size-10 place-items-center rounded-[6px] transition-colors hover:bg-white disabled:text-[var(--base-content-disabled)] disabled:hover:bg-transparent"
      >
        <Plus className="size-5" />
      </button>
    </div>
  )
}

/** Base File drop — dashed 2 px target with hover / complete states. */
function FileDrop({
  className,
  title = "Drag and drop or browse",
  description = "PNG, JPG, WebP or SVG up to 10 MB",
  state = "default",
  onFiles,
  accept,
  multiple,
  icon,
}: {
  className?: string
  title?: React.ReactNode
  description?: React.ReactNode
  state?: "default" | "hover" | "complete"
  onFiles?: (files: FileList) => void
  accept?: string
  multiple?: boolean
  icon?: React.ReactNode
}) {
  const id = React.useId()
  return (
    <label
      htmlFor={id}
      data-slot="file-drop"
      data-state={state}
      className={cn("base-file-drop", className)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        if (event.dataTransfer.files.length) onFiles?.(event.dataTransfer.files)
      }}
    >
      <span className="text-[var(--base-content-tertiary)] [&_svg]:size-6">{icon ?? <Upload />}</span>
      <span className="base-file-drop__title">{title}</span>
      <span className="base-file-drop__text">{description}</span>
      <input
        id={id}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={(event) => event.target.files && onFiles?.(event.target.files)}
      />
    </label>
  )
}

export { SegmentedControl, StarRating, Stepper, FileDrop }
