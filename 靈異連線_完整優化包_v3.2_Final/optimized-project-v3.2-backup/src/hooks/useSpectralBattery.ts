import { useEffect, useMemo, useRef, useState } from "react";

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

/**
 * Spectral "phone" battery
 * - Drains with timeLeft proportion
 * - Extra penalty each time curse triggers
 * - Exposes interference (0..~0.32) to add into CRT intensity
 */
export function useSpectralBattery(params: {
  timeLeft: number;
  startTime: number;
  isCursed: boolean;
}) {
  const { timeLeft, startTime, isCursed } = params;

  const [cursePenalty, setCursePenalty] = useState(0);
  const prevCursed = useRef(isCursed);

  useEffect(() => {
    if (!prevCursed.current && isCursed) {
      setCursePenalty((p) => clamp(p + 12, 0, 60));
    }
    prevCursed.current = isCursed;
  }, [isCursed]);

  const percent = useMemo(() => {
    const base = startTime > 0 ? (timeLeft / startTime) * 100 : 0;
    return clamp(Math.round(base - cursePenalty));
  }, [timeLeft, startTime, cursePenalty]);

  const isLow = percent <= 20;
  const isCritical = percent <= 8;

  const interference = useMemo(() => {
    if (percent > 40) return 0.0;
    if (percent > 20) return 0.08;
    if (percent > 8) return 0.18;
    return 0.32;
  }, [percent]);

  return { percent, isLow, isCritical, interference };
}