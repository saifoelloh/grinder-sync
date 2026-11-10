import { useState, useMemo, useCallback } from "react";
import { GRINDERS_DATA } from "../constants/grinders.data";
import { BrewMethod, GrinderDataRecord } from "../types/grinder.types";
import {
  getMethodStepBounds,
  micronsToTargetStep,
  stepToMicrons,
} from "../utils/micron-converter.util";
import { formatGrinderStep } from "../utils/scale-formatter.util";
import { useHaptic } from "./useHaptic";

export function useGrindSync() {
  const { triggerHaptic } = useHaptic();

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [sourceGrinder, setSourceGrinder] = useState<GrinderDataRecord>(
    GRINDERS_DATA[4] // Default: Comandante C40 MK4
  );
  const [targetGrinder, setTargetGrinder] = useState<GrinderDataRecord>(
    GRINDERS_DATA[1] // Default: 1Zpresso ZP6 Special
  );
  const [sourceStep, setSourceStep] = useState<number>(20);
  const [selectedMethod, setSelectedMethod] = useState<BrewMethod>("V60");
  const [pickerMode, setPickerMode] = useState<"source" | "target" | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeMicrons = useMemo(
    () => stepToMicrons(sourceGrinder, sourceStep),
    [sourceGrinder, sourceStep]
  );

  const targetResult = useMemo(
    () => micronsToTargetStep(targetGrinder, activeMicrons),
    [targetGrinder, activeMicrons]
  );

  const sourceFormatted = useMemo(
    () => formatGrinderStep(sourceGrinder.scaleType, sourceStep),
    [sourceGrinder.scaleType, sourceStep]
  );

  const targetFormatted = useMemo(
    () => formatGrinderStep(targetGrinder.scaleType, targetResult.snappedStep),
    [targetGrinder.scaleType, targetResult.snappedStep]
  );

  const sourceBounds = useMemo(
    () => getMethodStepBounds(sourceGrinder, selectedMethod),
    [sourceGrinder, selectedMethod]
  );

  const targetBounds = useMemo(
    () => getMethodStepBounds(targetGrinder, selectedMethod),
    [targetGrinder, selectedMethod]
  );

  const isTargetInSweetSpot = useMemo(() => {
    if (!targetBounds || targetResult.status !== "OK") return false;
    return (
      targetResult.snappedStep >= targetBounds.minStep &&
      targetResult.snappedStep <= targetBounds.maxStep
    );
  }, [targetBounds, targetResult]);

  const filteredGrinders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return GRINDERS_DATA;
    return GRINDERS_DATA.filter(
      (g) =>
        g.brand.toLowerCase().includes(q) ||
        g.productName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const stepByDelta = useCallback(
    (delta: number) => {
      triggerHaptic();
      setSourceStep((prev) =>
        Math.min(sourceGrinder.totalSteps, Math.max(0, prev + delta))
      );
    },
    [sourceGrinder.totalSteps, triggerHaptic]
  );

  const updateSourceStep = useCallback(
    (newStep: number) => {
      triggerHaptic();
      setSourceStep(newStep);
    },
    [triggerHaptic]
  );

  const swapGrinders = useCallback(() => {
    triggerHaptic();
    const prevSource = sourceGrinder;
    const prevTarget = targetGrinder;
    const newStep = targetResult.snappedStep;
    setSourceGrinder(prevTarget);
    setTargetGrinder(prevSource);
    setSourceStep(newStep);
  }, [sourceGrinder, targetGrinder, targetResult.snappedStep, triggerHaptic]);

  const selectGrinderFromSheet = useCallback(
    (grinder: GrinderDataRecord) => {
      triggerHaptic();
      if (pickerMode === "target") {
        setTargetGrinder(grinder);
      } else if (pickerMode === "source") {
        const mapped = micronsToTargetStep(grinder, activeMicrons);
        setSourceGrinder(grinder);
        setSourceStep(mapped.snappedStep);
      }
      setPickerMode(null);
    },
    [pickerMode, activeMicrons, triggerHaptic]
  );

  const changeBrewMethod = useCallback(
    (method: BrewMethod) => {
      triggerHaptic();
      setSelectedMethod(method);
    },
    [triggerHaptic]
  );

  return {
    darkMode,
    setDarkMode,
    sourceGrinder,
    targetGrinder,
    sourceStep,
    selectedMethod,
    pickerMode,
    setPickerMode,
    searchQuery,
    setSearchQuery,
    activeMicrons,
    targetResult,
    sourceFormatted,
    targetFormatted,
    sourceBounds,
    targetBounds,
    isTargetInSweetSpot,
    filteredGrinders,
    stepByDelta,
    updateSourceStep,
    swapGrinders,
    selectGrinderFromSheet,
    changeBrewMethod,
  };
}
