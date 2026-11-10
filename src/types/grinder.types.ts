export type BrewMethod =
  | "V60"
  | "Pour Over"
  | "Espresso"
  | "Aeropress"
  | "Filter Coffee Machine"
  | "Steep-and-release"
  | "Cupping"
  | "French Press"
  | "Moka Pot"
  | "Siphon"
  | "Cold Brew"
  | "Cold Drip"
  | "Turkish";

export type ScaleFormatType =
  | "3-Part (Rotation.Number.Tick)"
  | "Numbers and Clicks from Zero"
  | "Single Number (Half-step 0.5)"
  | "Decimal Clicks (0 - 16)"
  | "Clicks from Zero";

export interface GrinderDataRecord {
  id: string;
  brand: string;
  productName: string;
  url: string;
  minMicrons: number;
  maxMicrons: number;
  micronSpan: number;
  scaleType: ScaleFormatType;
  totalSteps: number;
  rawRangeText: string;
  brewMethods: Record<BrewMethod, string>;
}

export interface FormattedStep {
  display: string;
  helper: string;
}

export interface ConversionResult {
  status: "OK" | "TOO_FINE" | "TOO_COARSE";
  snappedStep: number;
  snappedMicrons: number;
}

export interface MethodStepBounds {
  minStep: number;
  maxStep: number;
  rawLabel: string;
}
