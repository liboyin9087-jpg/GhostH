import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * CRTOverlay
 * - Smoothly eases intensity (no sudden jumps)
 * - Uses SVG turbulence; intensity tweaks opacity & baseFrequency
 * - Avoids rAF leaks by maintaining one animation loop with proper cleanup
 */

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function CRTOverlay({ intensity }: { intensity: number }) {
  const target = clamp01(intensity);
  const [display, setDisplay] = useState<number>(target);

  const rafRef = useRef<number | null>(null);
  const targetRef = useRef<number>(target);
  targetRef.current = target;

  useEffect(() => {
    let mounted = true;

    const tick = () => {
      if (!mounted) return;

      setDisplay(prev => {
        // critically damped-ish easing
        const next = prev + (targetRef.current - prev) * 0.10;
        return Math.abs(next - targetRef.current) < 0.002 ? targetRef.current : next;
      });

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      mounted = false;
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const svgDataUri = useMemo(() => {
    // baseFrequency: higher => noisier; keep within sane range
    const baseFreq = 0.65 + display * 0.55; // ~0.65..1.2
    const svg = `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>
    `;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [display]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 mix-blend-overlay"
      style={{
        backgroundImage: svgDataUri,
        opacity: Math.min(0.9, 0.18 + display * 0.62),
        transition: "opacity 180ms ease-out",
      }}
    />
  );
}