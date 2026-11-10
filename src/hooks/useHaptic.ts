import { useCallback } from "react";

export function useHaptic() {
  const triggerHaptic = useCallback((duration = 8) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  }, []);

  return { triggerHaptic };
}
