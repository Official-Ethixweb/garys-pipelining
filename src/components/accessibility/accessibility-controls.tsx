"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown, Minus, Plus, RotateCcw } from "lucide-react";

export function A11ySection({ title, children, columns = 1 }: { title: string; children: React.ReactNode; columns?: 1 | 3 }) {
  return (
    <section className="border-t border-border pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</h3>
      <div className={`mt-3 grid gap-2 ${columns === 3 ? "grid-cols-3" : ""}`}>{children}</div>
    </section>
  );
}

export function A11yToggleBox({
  icon: Icon,
  label,
  tooltip,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      title={tooltip}
      onClick={() => onChange(!checked)}
      className={`a11y-focus-ring flex flex-col items-center justify-center gap-1.5 rounded-xl border px-1.5 py-3 text-center transition-colors duration-200 ${
        checked ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors duration-200 ${
          checked ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="line-clamp-2 text-[11px] font-medium leading-tight text-ink">{label}</span>
    </button>
  );
}

export function A11yToggle({
  icon: Icon,
  label,
  tooltip,
  shortcut,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  shortcut?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      title={tooltip}
      onClick={() => onChange(!checked)}
      className={`a11y-focus-ring group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200 ${
        checked ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors duration-200 ${
          checked ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">{label}</span>
        {shortcut && <span className="block text-[11px] text-muted-foreground">{shortcut}</span>}
      </span>
      <span
        aria-hidden
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-border-strong"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function A11yStepper({
  icon: Icon,
  label,
  tooltip,
  valueLabel,
  onIncrease,
  onDecrease,
  onReset,
  canIncrease = true,
  canDecrease = true,
}: {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  valueLabel: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
  canIncrease?: boolean;
  canDecrease?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5" title={tooltip}>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-elevated text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{label}</span>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{valueLabel}</span>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={!canDecrease}
          onClick={onDecrease}
          className="a11y-focus-ring inline-flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs font-semibold text-ink transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Reset ${label.toLowerCase()}`}
          onClick={onReset}
          className="a11y-focus-ring inline-flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={!canIncrease}
          onClick={onIncrease}
          className="a11y-focus-ring inline-flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs font-semibold text-ink transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function A11ySlider({
  icon: Icon,
  label,
  tooltip,
  min,
  max,
  step,
  value,
  displayValue,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
  value: number;
  displayValue: string;
  onChange: (next: number) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5" title={tooltip}>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-elevated text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <label className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{label}</label>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{displayValue}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="a11y-focus-ring mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border-strong accent-[var(--color-primary)]"
      />
    </div>
  );
}

export function A11yButtonGroup<T extends string>({
  icon: Icon,
  label,
  tooltip,
  options,
  value,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  options: { value: T; label: string; icon: LucideIcon }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5" title={tooltip}>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-elevated text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{label}</span>
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={value === opt.value}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => onChange(opt.value)}
            className={`a11y-focus-ring inline-flex items-center justify-center rounded-lg border py-1.5 transition-colors ${
              value === opt.value ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:border-border-strong"
            }`}
          >
            <opt.icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function A11ySelect({
  icon: Icon,
  label,
  tooltip,
  value,
  options,
  onChange,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5" title={tooltip}>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-elevated text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <label className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{label}</label>
      </div>
      <div className="relative mt-2.5">
        <select
          aria-label={label}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="a11y-focus-ring w-full appearance-none rounded-lg border border-border bg-surface-elevated py-1.5 pl-2.5 pr-8 text-xs font-medium text-ink disabled:opacity-50"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
