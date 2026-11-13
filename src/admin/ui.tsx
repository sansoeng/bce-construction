import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button as ShadButton } from "@/components/ui/button"
import { Badge as ShadBadge } from "@/components/ui/badge"
import { Card as ShadCard } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EmptyState as BaseEmptyState } from "@/components/base"
import { cn } from "@/lib/utils"

export const cx = cn
export { cn }

/* Base component library — re-exported so admin screens import from one place. */
export {
  Tag,
  NotificationBadge,
  Banner as BaseBanner,
  SystemBanner,
  MessageCard,
  EmptyState as BaseEmptyState,
  Snackbar,
  Spacer,
  Tile,
  ListItem,
  SectionHeading,
  ProgressBar,
  ProgressCircle,
  ProgressSteps,
  SegmentedControl,
  StarRating,
  Stepper,
  FileDrop,
  PaginationBar,
  PageControl,
  PasswordField,
  TimePicker,
  ButtonDock,
} from "@/components/base"

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "dark-ghost"
  size?: "xs" | "sm" | "md" | "lg" | "icon" | "icon-sm"
  loading?: boolean
}

const buttonVariants = {
  primary: "primary",
  secondary: "secondary",
  outline: "secondary",
  ghost: "tertiary",
  danger: "danger",
  "dark-ghost": "ghost",
} as const;

export function Button({ variant = "secondary", size = "md", className, ...props }: ButtonProps) {
  return (
    <ShadButton
      variant={buttonVariants[variant]}
      size={size === "md" ? "default" : size}
      className={cn(
        variant === "dark-ghost" && "text-white/80 hover:bg-white/10 hover:text-white",
        className,
      )}
      {...props}
    />
  )
}

export function Badge({
  children,
  tone = "slate",
  className,
}: {
  children: React.ReactNode;
  tone?: "slate" | "green" | "amber" | "red" | "blue";
  className?: string;
}) {
  const tones = {
    slate: "gray",
    green: "green",
    amber: "yellow",
    red: "red",
    blue: "blue",
  } as const;
  return (
    <ShadBadge color={tones[tone]} size="xs" className={className}>
      {children}
    </ShadBadge>
  )
}

export function Card({
  children,
  className,
  flush,
  dark,
}: {
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
  dark?: boolean;
}) {
  return (
    <ShadCard
      className={cn(
        "gap-0 py-0 text-card-foreground",
        dark && "bg-primary text-primary-foreground shadow-none",
        className,
      )}
    >
      {flush ? children : <div className="p-5">{children}</div>}
    </ShadCard>
  )
}

export function FieldShell({
  label,
  hint,
  required,
  wide,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-2", wide && "sm:col-span-2")}>
      <Label>
        {label} {required && <span className="text-[var(--base-negative)]">*</span>}
      </Label>
      <div>{children}</div>
      {hint && <p className="text-xs leading-5 text-[var(--base-content-tertiary)]">{hint}</p>}
    </div>
  )
}

export function TextInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input className={cn(className)} {...props} />
}

export function TextArea({ className, ...props }: React.ComponentProps<typeof Textarea>) {
  return <Textarea className={cn(className)} {...props} />
}

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

/** Keeps the existing <Select><option/></Select> API while rendering the Base Select. */
export function Select({ value, onChange, children, className, ...props }: SelectProps) {
  const options = React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child) || child.type !== "option") return [];
    const option = child.props as { value?: string | number; children?: React.ReactNode; disabled?: boolean };
    const optionValue = option.value !== undefined ? String(option.value) : String(option.children ?? "");
    return [{ value: optionValue, label: option.children, disabled: option.disabled }];
  });

  return (
    <ShadSelect
      value={value !== undefined && value !== null ? String(value) : undefined}
      onValueChange={(next) => onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>)}
      disabled={props.disabled}
      name={props.name}
      required={props.required}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadSelect>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  const id = React.useId();
  return (
    <div className="flex items-center gap-3">
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[var(--base-content-tertiary)]">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </span>
  )
}

export function Banner({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error" | "warning";
  children: React.ReactNode;
}) {
  const variants = {
    info: "info",
    success: "success",
    error: "destructive",
    warning: "warning",
  } as const;
  return (
    <Alert variant={variants[tone]} hierarchy="low" className="py-3">
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <BaseEmptyState title={title} className="rounded-[12px] bg-[var(--base-gray-50)]">
      {children}
    </BaseEmptyState>
  )
}

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className={cn("max-h-[90vh] overflow-y-auto bg-card", wide ? "sm:max-w-5xl" : "sm:max-w-2xl")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function Stat({
  label,
  value,
  hint,
  dark,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "green" | "amber" | "red";
  dark?: boolean;
}) {
  return (
    <Card className={cn("min-h-32", dark && "bg-primary text-primary-foreground shadow-none")}>
      <div className="flex h-full flex-col gap-2">
        <p className={cn("text-xs font-medium text-[var(--base-content-tertiary)]", dark && "text-white/60")}>
          {label}
        </p>
        <p className="mt-auto text-4xl font-bold leading-none tracking-[-0.03em] tabular-nums">{value}</p>
        {hint && <p className={cn("text-xs text-[var(--base-content-tertiary)]", dark && "text-white/60")}>{hint}</p>}
      </div>
    </Card>
  )
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Continue",
  destructive,
  onConfirm,
  onOpenChange,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={destructive ? "base-btn base-btn--danger" : "base-btn base-btn--primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-4 animate-pulse rounded-[8px] bg-[var(--base-gray-100)]", className)} />;
}


export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
