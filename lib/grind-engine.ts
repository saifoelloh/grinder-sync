export type BrewMethod =
  | "V60"
  | "Espresso"
  | "Pour Over"
  | "Aeropress"
  | "Filter Coffee Machine"
  | "French Press"
  | "Cupping"
  | "Steep-and-release"
  | "Moka Pot"
  | "Siphon"
  | "Cold Brew"
  | "Cold Drip"
  | "Turkish";

export interface GrinderSpec {
  id: string;
  brand: string;
  productName: string;
  minMicrons: number;
  maxMicrons: number;
  micronSpan: number;
  scaleType: string;
  /** Jumlah total step mekanis dari titik 0 hingga maksimum */
  totalSteps: number;
  /** Fungsi untuk mengubah step integer (0..totalSteps) menjadi teks layar & panduan baca */
  formatStep: (step: number) => { display: string; helper: string };
  /** Fungsi untuk mengubah string dari JSON (misal "0.5.3" atau "1.8") menjadi step integer */
  parseSettingString: (str: string) => number | null;
  brewMethods: Record<BrewMethod, string>;
}

export const GRINDERS_DATASET: GrinderSpec[] = [
  {
    id: "1zpresso-k-ultra",
    brand: "1Zpresso",
    productName: "K-Ultra",
    minMicrons: 0,
    maxMicrons: 760,
    micronSpan: 760,
    scaleType: "3-Part (Rotation.Number.Tick)",
    totalSteps: 100, // 0.0.0 s/d 1.0.0 (100 klik; 7.6 μm/klik)
    formatStep: (step) => {
      if (step >= 100) {
        return { display: "1.0.0", helper: "Rotasi 1 · Angka 0 · Klik 0" };
      }
      const rot = Math.floor(step / 100);
      const rem = step % 100;
      const num = Math.floor(rem / 10);
      const tick = rem % 10;
      return {
        display: `${rot}.${num}.${tick}`,
        helper: `Rotasi ${rot} · Angka ${num} · Klik ${tick}`,
      };
    },
    parseSettingString: (str) => {
      const clean = str.trim();
      if (clean === "N/A") return null;
      if (clean === "1") return 100;
      const parts = clean.split(".").map(Number);
      if (parts.length === 3) return parts[0] * 100 + parts[1] * 10 + parts[2];
      if (parts.length === 2) return parts[0] * 100 + parts[1] * 10;
      return null;
    },
    brewMethods: {
      Turkish: "0.0.6 – 0.2.8",
      Espresso: "0.2.4 – 0.5",
      V60: "0.5.3 – 0.9.2",
      Aeropress: "0.4.3 – 1",
      "Moka Pot": "0.4.8 – 0.8.6",
      "Pour Over": "0.5.4 – 1",
      Siphon: "0.5 – 1",
      "Filter Coffee Machine": "0.4 – 1",
      "French Press": "0.9.1 – 1",
      Cupping: "0.6.1 – 1",
      "Cold Brew": "1",
      "Cold Drip": "1",
      "Steep-and-release": "0.6 – 1",
    },
  },
  {
    id: "1zpresso-zp6-special",
    brand: "1Zpresso",
    productName: "ZP6 Special",
    minMicrons: 240,
    maxMicrons: 1050,
    micronSpan: 810,
    scaleType: "Numbers and Clicks from Zero",
    totalSteps: 90, // 0.0 s/d 9.0 (90 klik; 9.0 μm/klik)
    formatStep: (step) => {
      const num = Math.floor(step / 10);
      const click = step % 10;
      return {
        display: `${num}.${click}`,
        helper: `Angka ${num} · Klik ke-${click}`,
      };
    },
    parseSettingString: (str) => {
      const clean = str.trim();
      if (clean === "N/A") return null;
      const val = parseFloat(clean);
      return isNaN(val) ? null : Math.round(val * 10);
    },
    brewMethods: {
      Turkish: "N/A",
      Espresso: "0.0 – 1.5",
      V60: "1.8 – 5.1",
      Aeropress: "0.9 – 8.0",
      "Moka Pot": "1.4 – 4.6",
      "Pour Over": "1.9 – 7.6",
      Siphon: "1.5 – 6.2",
      "Filter Coffee Machine": "0.7 – 7.3",
      "French Press": "5.0 – 9.0",
      Cupping: "2.5 – 6.7",
      "Cold Brew": "6.3 – 9.0",
      "Cold Drip": "6.5 – 9.0",
      "Steep-and-release": "2.4 – 6.5",
    },
  },
  {
    id: "timemore-sculptor-078",
    brand: "Timemore",
    productName: "Sculptor 078",
    minMicrons: 370,
    maxMicrons: 1270,
    micronSpan: 900,
    scaleType: "Single Number (Half-step 0.5)",
    totalSteps: 36, // Dial 0 s/d 18 dengan step 0.5 (25 μm/step)
    formatStep: (step) => {
      const dial = step * 0.5;
      const isHalf = step % 2 !== 0;
      return {
        display: dial.toString(),
        helper: isHalf
          ? `Dial ${Math.floor(dial)} + Setengah Klik (.5)`
          : `Angka Dial ${dial} Tepat`,
      };
    },
    parseSettingString: (str) => {
      const clean = str.trim();
      if (clean === "N/A") return null;
      const val = parseFloat(clean);
      return isNaN(val) ? null : Math.round(val * 2);
    },
    brewMethods: {
      Turkish: "N/A",
      Espresso: "0",
      V60: "1 – 6.5",
      Aeropress: "0 – 11.5",
      "Moka Pot": "0 – 5.5",
      "Pour Over": "1 – 11",
      Siphon: "0.5 – 8.5",
      "Filter Coffee Machine": "0 – 10.5",
      "French Press": "6.5 – 18",
      Cupping: "2 – 9.5",
      "Cold Brew": "9 – 18",
      "Cold Drip": "9 – 18",
      "Steep-and-release": "2 – 9",
    },
  },
  {
    id: "timemore-c5-pro",
    brand: "Timemore",
    productName: "C5 Pro",
    minMicrons: 0,
    maxMicrons: 950,
    micronSpan: 950,
    scaleType: "Decimal Clicks (0 - 16)",
    totalSteps: 48, // 0 s/d 16 dengan 3 sub-klik per angka (.0, .1, .2)
    formatStep: (step) => {
      const num = Math.floor(step / 3);
      const sub = step % 3;
      const display = sub === 0 ? `${num}` : `${num}.${sub}`;
      return {
        display,
        helper: `Angka ${num} · Sub-klik ${sub} (dari 3)`,
      };
    },
    parseSettingString: (str) => {
      const clean = str.trim();
      if (clean === "N/A") return null;
      const [maj, min] = clean.split(".").map(Number);
      if (isNaN(maj)) return null;
      return maj * 3 + (min || 0);
    },
    brewMethods: {
      Turkish: "1 – 3.2",
      Espresso: "3.1 – 6.1",
      V60: "7 – 11.2",
      Aeropress: "5.2 – 16",
      "Moka Pot": "6.1 – 11",
      "Pour Over": "7 – 15.1",
      Siphon: "6.1 – 13.1",
      "Filter Coffee Machine": "5.1 – 15",
      "French Press": "11.2 – 16",
      Cupping: "8 – 14",
      "Cold Brew": "13.2 – 16",
      "Cold Drip": "14 – 16",
      "Steep-and-release": "7.2 – 13.2",
    },
  },
  {
    id: "comandante-c40-mk4",
    brand: "Comandante",
    productName: "C40 MK4",
    minMicrons: 0,
    maxMicrons: 1090,
    micronSpan: 1090,
    scaleType: "Clicks from Zero",
    totalSteps: 40, // 0 s/d 40 klik (27.25 μm/klik)
    formatStep: (step) => ({
      display: `${step}`,
      helper: `${step} Klik penuh dari titik nol`,
    }),
    parseSettingString: (str) => {
      const clean = str.trim();
      if (clean === "N/A") return null;
      const val = parseInt(clean, 10);
      return isNaN(val) ? null : val;
    },
    brewMethods: {
      Turkish: "2 – 8",
      Espresso: "7 – 13",
      V60: "15 – 25",
      Aeropress: "12 – 35",
      "Moka Pot": "14 – 24",
      "Pour Over": "16 – 34",
      Siphon: "14 – 29",
      "Filter Coffee Machine": "12 – 33",
      "French Press": "26 – 40",
      Cupping: "17 – 31",
      "Cold Brew": "30 – 40",
      "Cold Drip": "31 – 40",
      "Steep-and-release": "17 – 30",
    },
  },
];

/** Hitung perubahan mikron per 1 step mekanis */
export function getMicronsPerStep(grinder: GrinderSpec): number {
  return +(grinder.micronSpan / grinder.totalSteps).toFixed(2);
}

/** Konversi step mekanis ke ukuran mikron (μm) */
export function stepToMicrons(grinder: GrinderSpec, step: number): number {
  const ratio = step / grinder.totalSteps;
  return Math.round(grinder.minMicrons + ratio * grinder.micronSpan);
}

/** Konversi ukuran mikron (μm) ke step mekanis terdekat pada grinder tujuan */
export function micronsToTargetStep(
  grinder: GrinderSpec,
  microns: number
): {
  status: "OK" | "TOO_FINE" | "TOO_COARSE";
  snappedStep: number;
  snappedMicrons: number;
} {
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

/** Ekstrak batas step minimum & maksimum untuk metode seduh tertentu */
export function getMethodStepBounds(
  grinder: GrinderSpec,
  method: BrewMethod
): { minStep: number; maxStep: number; rawLabel: string } | null {
  const rawLabel = grinder.brewMethods[method];
  if (!rawLabel || rawLabel === "N/A") return null;

  const parts = rawLabel.split(/[–-]/).map((s) => s.trim());
  if (parts.length === 1) {
    const step = grinder.parseSettingString(parts[0]);
    return step !== null ? { minStep: step, maxStep: step, rawLabel } : null;
  }

  const minStep = grinder.parseSettingString(parts[0]);
  const maxStep = grinder.parseSettingString(parts[1]);
  if (minStep === null || maxStep === null) return null;

  return { minStep, maxStep, rawLabel };
}