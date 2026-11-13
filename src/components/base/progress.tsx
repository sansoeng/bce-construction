import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

/** Base Progress bar — Small / Medium / Large × with or without label. */
function ProgressBar({
  className,
  value = 0,
  size = "md",
  label,
  showValue,
  ...props
}: React.ComponentProps<"div"> & {
  value?: number
  size?: "sm" | "md" | "lg"
  label?: React.ReactNode
  showValue?: boolean
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      data-slot="progress"
      data-size={size}
      className={cn(
        "base-progress",
        size === "sm" && "base-progress--sm",
        size === "lg" && "base-progress--lg",
        className
      )}
      {...props}
    >
      {(label || showValue) && (
        <div className="base-progress__meta">
          <span>{label}</span>
          {showValue && <span className="tabular-nums">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        className="base-progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="base-progress__bar" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}

/** Base Progress circle — determinate ring with a centred value. */
function ProgressCircle({
  className,
  value = 0,
  size = 56,
  stroke = 6,
  showValue = true,
}: {
  className?: string
  value?: number
  size?: number
  stroke?: number
  showValue?: boolean
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference
  return (
    <div className={cn("base-progress-circle", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden>
        <circle className="base-progress-circle__track" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} />
        <circle
          className="base-progress-circle__bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showValue && <span className="base-progress-circle__value">{Math.round(clamped)}%</span>}
    </div>
  )
}

export type ProgressStep = { title: string; description?: React.ReactNode }

/** Base Progress steps — vertical list with active / complete states. */
function ProgressSteps({
  className,
  steps,
  current = 0,
}: {
  className?: string
  steps: ProgressStep[]
  current?: number
}) {
  return (
    <ol className={cn("base-steps", className)}>
      {steps.map((step, index) => {
        const state = index < current ? "complete" : index === current ? "active" : "upcoming"
        return (
          <li key={step.title} className="base-step" data-state={state}>
            <div className="base-step__rail">
              <span className="base-step__dot">{state === "complete" ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}</span>
              {index < steps.length - 1 && <span className="base-step__line" />}
            </div>
            <div className="base-step__body">
              <p className="base-step__title">{step.title}</p>
              {step.description && <div className="base-step__text">{step.description}</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { ProgressBar, ProgressCircle, ProgressSteps }
