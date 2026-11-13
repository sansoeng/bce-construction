import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

/** Base Password field — text field with reveal control. */
function PasswordField({
  className,
  value,
  onChange,
  placeholder = "Password",
  showStrength,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  showStrength?: boolean
}) {
  const [visible, setVisible] = React.useState(false)
  const text = typeof value === "string" ? value : ""
  const score = React.useMemo(() => {
    let s = 0
    if (text.length >= 8) s++
    if (/[A-Z]/.test(text) && /[a-z]/.test(text)) s++
    if (/\d/.test(text)) s++
    if (/[^A-Za-z0-9]/.test(text)) s++
    return s
  }, [text])

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="relative">
        <input
          {...props}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="base-input w-full pr-14"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-[6px] text-[var(--base-content-tertiary)] transition-colors hover:bg-white hover:text-[var(--base-content)]"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
      {showStrength && text.length > 0 && (
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < score
                  ? score <= 1
                    ? "bg-[var(--base-negative)]"
                    : score === 2
                      ? "bg-[var(--base-warning)]"
                      : "bg-[var(--base-positive)]"
                  : "bg-[var(--base-gray-200)]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"))

/** Base Time picker — hour / minute / period selects in one control. */
function TimePicker({
  className,
  value,
  onChange,
}: {
  className?: string
  value: string
  onChange: (value: string) => void
}) {
  const [hour, minute] = value.split(":")
  const h24 = Number.parseInt(hour ?? "9", 10)
  const period = h24 >= 12 ? "PM" : "AM"
  const h12 = String(h24 % 12 === 0 ? 12 : h24 % 12).padStart(2, "0")

  const commit = (nextHour: string, nextMinute: string, nextPeriod: string) => {
    let h = Number.parseInt(nextHour, 10) % 12
    if (nextPeriod === "PM") h += 12
    onChange(`${String(h).padStart(2, "0")}:${nextMinute}`)
  }

  const selectClass =
    "base-select h-12 min-w-[76px] px-3 pr-8 text-base"

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <select className={selectClass} value={h12} onChange={(e) => commit(e.target.value, minute ?? "00", period)} aria-label="Hour">
        {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="text-lg font-medium text-[var(--base-content-tertiary)]">:</span>
      <select className={selectClass} value={minute ?? "00"} onChange={(e) => commit(h12, e.target.value, period)} aria-label="Minute">
        {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className={cn(selectClass, "min-w-[84px]")} value={period} onChange={(e) => commit(h12, minute ?? "00", e.target.value)} aria-label="Period">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  )
}

/** Base Docked / Button dock — floating pill of actions. */
function ButtonDock({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-dock"
      className={cn(
        "inline-flex items-center gap-2 rounded-[9999px] bg-[var(--base-black)] p-2 text-white shadow-[0_16px_48px_rgb(0_0_0_/_0.22)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { PasswordField, TimePicker, ButtonDock }
