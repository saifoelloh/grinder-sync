import React from "react";
import { GrinderDataRecord } from "../../types/grinder.types";

interface GrinderPickerSheetProps {
  mode: "source" | "target" | null;
  grinders: GrinderDataRecord[];
  activeGrinderId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectGrinder: (grinder: GrinderDataRecord) => void;
  onClose: () => void;
}

export function GrinderPickerSheet({
  mode,
  grinders,
  activeGrinderId,
  searchQuery,
  onSearchChange,
  onSelectGrinder,
  onClose,
}: GrinderPickerSheetProps) {
  if (!mode) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] rounded-t-2xl p-5 flex flex-col gap-3 max-h-[75dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Pilih{" "}
            {mode === "target" ? "Grinder Gue (Target)" : "Grinder Referensi"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[var(--text-secondary)] px-2 py-1 cursor-pointer"
          >
            Tutup ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari brand atau tipe (misal: ZP6, 078, C40)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoFocus
          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm focus:outline-none"
        />

        <div className="overflow-y-auto divide-y divide-[var(--border-subtle)]">
          {grinders.map((g) => {
            const isSelected = g.id === activeGrinderId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelectGrinder(g)}
                className="w-full py-3 px-2 flex items-center justify-between text-left hover:bg-[var(--bg-elevated)] transition rounded-lg cursor-pointer"
              >
                <div>
                  <div className="text-sm font-semibold">
                    {g.brand} {g.productName}
                  </div>
                  <div className="font-mono-tabular text-[11px] text-[var(--text-secondary)]">
                    {g.minMicrons}–{g.maxMicrons} μm · {g.scaleType}
                  </div>
                </div>
                {isSelected && (
                  <span className="font-mono-tabular text-xs font-bold px-2 py-0.5 rounded bg-[var(--accent-primary)] text-[var(--accent-fg)]">
                    Aktif
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
