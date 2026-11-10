import React from "react";

interface MicronBridgeProps {
  microns: number;
  onSwap: () => void;
}

export function MicronBridge({ microns, onSwap }: MicronBridgeProps) {
  return (
    <div className="flex items-center justify-center gap-3 my-1 shrink-0">
      <div className="h-[1px] flex-1 bg-[var(--border-subtle)]" />
      <div className="px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono-tabular text-xs font-semibold">
        ~ {microns} μm
      </div>
      <button
        type="button"
        onClick={onSwap}
        className="h-8 px-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-medium flex items-center gap-1 active:scale-95 transition cursor-pointer"
        title="Tukar Grinder Referensi dan Target"
      >
        <span>Swap</span>
        <span>⇅</span>
      </button>
      <div className="h-[1px] flex-1 bg-[var(--border-subtle)]" />
    </div>
  );
}
