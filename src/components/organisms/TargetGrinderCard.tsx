import React from "react";
import {
  BrewMethod,
  ConversionResult,
  FormattedStep,
  GrinderDataRecord,
  MethodStepBounds,
} from "../../types/grinder.types";
import { getMicronsPerStep } from "../../utils/micron-converter.util";
import { formatGrinderStep } from "../../utils/scale-formatter.util";
import { StatusBadge } from "../atoms/StatusBadge";

interface TargetGrinderCardProps {
  grinder: GrinderDataRecord;
  formattedStep: FormattedStep;
  conversionResult: ConversionResult;
  selectedMethod: BrewMethod;
  methodBounds: MethodStepBounds | null;
  isInSweetSpot: boolean;
  onOpenPicker: () => void;
}

export function TargetGrinderCard({
  grinder,
  formattedStep,
  conversionResult,
  selectedMethod,
  methodBounds,
  isInSweetSpot,
  onOpenPicker,
}: TargetGrinderCardProps) {
  const minDial = formatGrinderStep(grinder.scaleType, 0).display;
  const maxDial = formatGrinderStep(
    grinder.scaleType,
    grinder.totalSteps
  ).display;

  return (
    <section className="flex-1 flex flex-col justify-between rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 my-2 relative overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            Target · Grinder Gue
          </p>
          <button
            type="button"
            onClick={onOpenPicker}
            className="mt-0.5 text-left group flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-base font-semibold tracking-tight group-hover:underline">
              {grinder.brand} {grinder.productName}
            </span>
            <span className="text-xs text-[var(--text-muted)]">▾</span>
          </button>
          <p className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
            Range: {grinder.minMicrons}–{grinder.maxMicrons} μm · ±
            {getMicronsPerStep(grinder)} μm/klik
          </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono-tabular border border-[var(--border-subtle)] text-[var(--text-secondary)]">
          Pinned
        </span>
      </div>

      {conversionResult.status === "OK" ? (
        <div className="my-auto py-2 text-center">
          <div className="font-mono-tabular text-7xl font-bold tracking-tighter leading-none">
            {formattedStep.display}
          </div>
          <p className="mt-2 text-xs font-medium text-[var(--text-secondary)]">
            {formattedStep.helper}
          </p>
        </div>
      ) : (
          <div className="my-auto py-4 px-3 rounded-xl border border-dashed border-[var(--text-muted)] bg-out-of-range text-center">
            <p className="font-mono-tabular text-xl font-bold tracking-tight uppercase">
              Out of Range
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {conversionResult.status === "TOO_FINE"
                ? `Di bawah batas halus ${grinder.productName} (Min: ${grinder.minMicrons} μm pada dial ${minDial})`
                : `Di atas batas kasar ${grinder.productName} (Max: ${grinder.maxMicrons} μm pada dial ${maxDial})`}
            </p>
          </div>
        )}

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs">
        <span className="text-[var(--text-secondary)]">
          Acuan {selectedMethod}:{" "}
          <strong className="font-mono-tabular text-[var(--text-primary)]">
            {methodBounds ? methodBounds.rawLabel : "N/A"}
          </strong>
        </span>

        {!methodBounds ? (
          <StatusBadge variant="dashed">✕ Metode N/A</StatusBadge>
        ) : isInSweetSpot ? (
            <StatusBadge variant="solid">
              ● Masuk Zona {selectedMethod}
            </StatusBadge>
          ) : (
              <StatusBadge variant="outline">
                ○ Di Luar Zona {selectedMethod}
              </StatusBadge>
            )}
      </div>
    </section>
  );
}
