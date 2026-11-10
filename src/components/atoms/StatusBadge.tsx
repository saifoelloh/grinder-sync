import React from "react";

interface StatusBadgeProps {
  variant: "solid" | "outline" | "dashed";
  children: React.ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const baseClass = "px-2.5 py-0.5 rounded-full text-[11px] font-medium";

  if (variant === "solid") {
    return (
      <span
        className={`${baseClass} bg-[var(--accent-primary)] text-[var(--accent-fg)]`}
      >
        {children}
      </span>
    );
  }

  if (variant === "dashed") {
    return (
      <span
        className={`${baseClass} border border-dashed border-[var(--text-muted)] text-[var(--text-muted)]`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`${baseClass} border border-[var(--border-subtle)] text-[var(--text-secondary)]`}
    >
      {children}
    </span>
  );
}
