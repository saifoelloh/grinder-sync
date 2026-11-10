import React from "react";
import {
  BrewMethod,
  FormattedStep,
  GrinderDataRecord,
  MethodStepBounds,
} from "../../types/grinder.types";
import { formatGrinderStep } from "../../utils/scale-formatter.util";
import { StepperButton } from "../atoms/StepperButton";
import { TactileSlider } from "../atoms/TactileSlider";
import { BrewMethodSelector } from "../molecules/BrewMethodSelector";

interface SourceGrinderCardProps {
  grinder: GrinderDataRecord;
  step: number;
  formattedStep: FormattedStep;
  selectedMethod: BrewMethod;
  methodBounds: MethodStepBounds | null;
  onSelectMethod: (method: BrewMethod) => void;
  onStepByDelta: (delta: number) => void;
  onChangeStep: (newStep: number) => void;
  onOpenPicker: () => void;
}

export function SourceGrinderCard({
  grinder,
  step,
  formattedStep,
  selectedMethod,
  methodBounds,
  onSelectMethod,
  onStepByDelta,
  onChangeStep,
  onOpenPicker,
}: SourceGrinderCardProps) {
  const minDial = formatGrinderStep(grinder.scaleType, 0).display;
  const maxDial = formatGrinderStep(
    grinder.scaleType,
    grinder.totalSteps
  ).display;

  return (
    <section className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 sm:p-5 mt-2 shrink-0 flex flex-col gap-4">
      <BrewMethodSelector
        selectedMethod={selectedMethod}
        onSelect={onSelectMethod}
      />

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            Dari Grinder Referensi
          </p>
          <button
            type="button"
            onClick={onOpenPicker}
            className="mt-0.5 text-left flex items-center gap-1.5 group cursor-pointer"
          >
            <span className="text-sm font-semibold group-hover:underline">
              {grinder.brand} {grinder.productName}
            </span>
            <span className="text-xs text-[var(--text-muted)]">▾</span>
          </button>
        </div>
        <div className="text-right font-mono-tabular text-[11px] text-[var(--text-secondary)]">
          <div>Zona {selectedMethod}:</div>
          <div className="font-semibold text-[var(--text-primary)]">
            {methodBounds ? methodBounds.rawLabel : "N/A"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <StepperButton
          label="−"
          ariaLabel="Kurangi 1 klik"
          disabled={step <= 0}
          onClick={() => onStepByDelta(-1)}
        />

        <div className="text-center flex-1">
          <div className="font-mono-tabular text-3xl font-bold tracking-tight">
            {formattedStep.display}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] truncate">
            {formattedStep.helper}
          </div>
        </div>

        <StepperButton
          label="+"
          ariaLabel="Tambah 1 klik"
          disabled={step >= grinder.totalSteps}
          onClick={() => onStepByDelta(1)}
        />
      </div>

      <TactileSlider
        min={0}
        max={grinder.totalSteps}
        value={step}
        bounds={methodBounds}
        minLabel={`${minDial} (${grinder.minMicrons}μm)`}
        maxLabel={`${maxDial} (${grinder.maxMicrons}μm)`}
        centerLabel={
          methodBounds ? `[${selectedMethod}: ${methodBounds.rawLabel}]` : undefined
        }
        onChange={onChangeStep}
      />
    </section>
  );
}
