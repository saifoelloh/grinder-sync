import React from "react";

interface StepperButtonProps {
  label: string;
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
}

export function StepperButton({
  label,
  ariaLabel,
  disabled,
  onClick,
}: StepperButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="h-12 w-14 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono-tabular text-xl font-bold flex items-center justify-center active:scale-95 disabled:opacity-30 transition cursor-pointer"
    >
      {label}
    </button>
  );
}
