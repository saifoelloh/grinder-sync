import { FormattedStep, ScaleFormatType } from "../types/grinder.types";

export function formatGrinderStep(
  scaleType: ScaleFormatType,
  step: number
): FormattedStep {
  switch (scaleType) {
    case "3-Part (Rotation.Number.Tick)": {
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
    }

    case "Numbers and Clicks from Zero": {
      const num = Math.floor(step / 10);
      const click = step % 10;
      return {
        display: `${num}.${click}`,
        helper: `Angka ${num} · Klik ke-${click}`,
      };
    }

    case "Single Number (Half-step 0.5)": {
      const dial = step * 0.5;
      const isHalf = step % 2 !== 0;
      return {
        display: `${dial}`,
        helper: isHalf
          ? `Dial ${Math.floor(dial)} + Setengah Klik (.5)`
          : `Angka Dial ${dial} Tepat`,
      };
    }

    case "Decimal Clicks (0 - 16)": {
      const num = Math.floor(step / 3);
      const sub = step % 3;
      return {
        display: sub === 0 ? `${num}` : `${num}.${sub}`,
        helper: `Angka ${num} · Sub-klik ${sub} (dari 3)`,
      };
    }

    case "Clicks from Zero":
    default:
      return {
        display: `${step}`,
        helper: `${step} Klik penuh dari titik nol`,
      };
  }
}

export function parseGrinderSetting(
  scaleType: ScaleFormatType,
  rawStr: string
): number | null {
  const clean = rawStr.trim();
  if (!clean || clean === "N/A") return null;

  switch (scaleType) {
    case "3-Part (Rotation.Number.Tick)": {
      if (clean === "1") return 100;
      const parts = clean.split(".").map(Number);
      if (parts.length === 3) return parts[0] * 100 + parts[1] * 10 + parts[2];
      if (parts.length === 2) return parts[0] * 100 + parts[1] * 10;
      return null;
    }

    case "Numbers and Clicks from Zero": {
      const val = parseFloat(clean);
      return isNaN(val) ? null : Math.round(val * 10);
    }

    case "Single Number (Half-step 0.5)": {
      const val = parseFloat(clean);
      return isNaN(val) ? null : Math.round(val * 2);
    }

    case "Decimal Clicks (0 - 16)": {
      const [maj, min] = clean.split(".").map(Number);
      if (isNaN(maj)) return null;
      return maj * 3 + (min || 0);
    }

    case "Clicks from Zero":
    default: {
      const val = parseInt(clean, 10);
      return isNaN(val) ? null : val;
    }
  }
}
