import React from "react";
import { BREW_METHODS } from "../../constants/grinders.data";
import { BrewMethod } from "../../types/grinder.types";

interface BrewMethodSelectorProps {
  selectedMethod: BrewMethod;
  onSelect: (method: BrewMethod) => void;
}

export function BrewMethodSelector({
  selectedMethod,
  onSelect,
}: BrewMethodSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          Filter Metode Seduh
        </span>
        <span className="font-mono-tabular text-[10px] text-[var(--text-muted)]">
          Geser →
        </span>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {BREW_METHODS.map((method) => {
          const active = selectedMethod === method;
          return (
            <button
              key={method}
              type="button"
              onClick={() => onSelect(method)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition shrink-0 cursor-pointer ${
                active
                  ? "bg-[var(--accent-primary)] text-[var(--accent-fg)]"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
              }`}
            >
              {active ? `● ${method}` : method}
            </button>
          );
        })}
      </div>
    </div>
  );
}
