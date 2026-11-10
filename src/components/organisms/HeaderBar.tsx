import React from "react";

interface HeaderBarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function HeaderBar({ darkMode, onToggleDarkMode }: HeaderBarProps) {
  return (
    <header className="flex items-center justify-between h-10 shrink-0">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
        <span className="font-mono-tabular text-xs font-bold tracking-[0.18em] uppercase">
          GrindSync
        </span>
      </div>
      <button
        type="button"
        onClick={onToggleDarkMode}
        className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] font-medium text-[var(--text-secondary)] active:scale-95 transition cursor-pointer"
      >
        {darkMode ? "◐ Dark OLED" : "◑ Paper Lab"}
      </button>
    </header>
  );
}
