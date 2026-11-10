import React from "react";
import { MethodStepBounds } from "../../types/grinder.types";

interface TactileSliderProps {
  min: number;
  max: number;
  value: number;
  bounds: MethodStepBounds | null;
  minLabel: string;
  maxLabel: string;
  centerLabel?: string;
  onChange: (newStep: number) => void;
}

export function TactileSlider({
  min,
  max,
  value,
  bounds,
  minLabel,
  maxLabel,
  centerLabel,
  onChange,
}: TactileSliderProps) {
  return (
    <div className="pt-1">
      <div className="relative h-7 flex items-center">
        <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden relative">
          {bounds && max > 0 && (
            <div
              className="absolute top-0 bottom-0 bg-[var(--text-muted)] opacity-50"
              style={{
                left: `${(bounds.minStep / max) * 100}%`,
                width: `${((bounds.maxStep - bounds.minStep) / max) * 100}%`,
              }}
            />
          )}
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="tactile-slider absolute inset-0 w-full h-full"
        />
      </div>

      <div className="flex justify-between font-mono-tabular text-[10px] text-[var(--text-muted)] mt-1">
        <span>{minLabel}</span>
        {centerLabel && (
          <span className="text-[var(--text-secondary)]">{centerLabel}</span>
        )}
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
