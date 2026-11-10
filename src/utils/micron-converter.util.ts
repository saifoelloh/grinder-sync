import {
  BrewMethod,
  ConversionResult,
  GrinderDataRecord,
  MethodStepBounds,
} from "../types/grinder.types";
import { parseGrinderSetting } from "./scale-formatter.util";

export function getMicronsPerStep(grinder: GrinderDataRecord): number {
  return +(grinder.micronSpan / grinder.totalSteps).toFixed(2);
}

export function stepToMicrons(
  grinder: GrinderDataRecord,
  step: number
): number {
  const ratio = step / grinder.totalSteps;
  return Math.round(grinder.minMicrons + ratio * grinder.micronSpan);
}

export function micronsToTargetStep(
  grinder: GrinderDataRecord,
  microns: number
): ConversionResult {
  if (microns < grinder.minMicrons) {
    return {
      status: "TOO_FINE",
      snappedStep: 0,
      snappedMicrons: grinder.minMicrons,
    };
  }
  if (microns > grinder.maxMicrons) {
    return {
      status: "TOO_COARSE",
      snappedStep: grinder.totalSteps,
      snappedMicrons: grinder.maxMicrons,
    };
  }

  const rawStep =
    ((microns - grinder.minMicrons) / grinder.micronSpan) * grinder.totalSteps;
  const snappedStep = Math.min(
    grinder.totalSteps,
    Math.max(0, Math.round(rawStep))
  );

  return {
    status: "OK",
    snappedStep,
    snappedMicrons: stepToMicrons(grinder, snappedStep),
  };
}

export function getMethodStepBounds(
  grinder: GrinderDataRecord,
  method: BrewMethod
): MethodStepBounds | null {
  const rawLabel = grinder.brewMethods[method];
  if (!rawLabel || rawLabel === "N/A") return null;

  const parts = rawLabel.split(/[–-]/).map((s) => s.trim());
  if (parts.length === 1) {
    const step = parseGrinderSetting(grinder.scaleType, parts[0]);
    return step !== null ? { minStep: step, maxStep: step, rawLabel } : null;
  }

  const minStep = parseGrinderSetting(grinder.scaleType, parts[0]);
  const maxStep = parseGrinderSetting(grinder.scaleType, parts[1]);
  if (minStep === null || maxStep === null) return null;

  return { minStep, maxStep, rawLabel };
}
