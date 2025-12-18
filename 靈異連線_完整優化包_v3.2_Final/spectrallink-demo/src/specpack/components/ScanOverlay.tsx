import React, { useEffect, useState } from "react";
import type { ScanResult } from "../types/state";

export function ScanOverlay({
  open,
  result,
  onClose,
  onApply,
}: {
  open: boolean;
  result: ScanResult | null;
  onClose: () => void;
  onApply: (r: ScanResult) => void;
}) {
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");

  useEffect(() => {
    if (!open || !result) return;
    setPhase("scanning");

    const t1 = setTimeout(() => setPhase("done"), 1200);
    const t2 = setTimeout(() => onApply(result), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open, result, onApply]);

  useEffect(() => {
    if (!open) setPhase("idle");
  }, [open]);

  const marker = result?.marker;

  if (!open || !result) return null;

  const markerColor =
    marker?.kind === "danger"
      ? "border-red-400/70 bg-red-500/10"
      : marker?.kind === "cold"
      ? "border-sky-400/70 bg-sky-500/10"
      : "border-cyan-400/70 bg-cyan-500/10";

  return (
    <div className="fixed inset-0 z-[1100]">
      <style>{`
        @keyframes scanSweep { 0%{transform:translateY(-10%)} 100%{transform:translateY(110%)} }
        @keyframes pulseRing { 0%,100%{transform:scale(0.95); opacity:0.6} 50%{transform:scale(1.05); opacity:0.95} }
      `}</style>

      <button className="absolute inset-0 bg-black/70" onClick={onClose} aria-label="close" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-cyan-950/15" />
        <div
          className="absolute inset-x-0 h-1 opacity-70"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.7), transparent)",
            animation: "scanSweep 1.6s linear infinite",
          }}
        />
        <div className="absolute inset-10 border border-white/10" />
      </div>

      {marker && (
        <div
          className={`absolute rounded-full border-2 border-dashed ${markerColor} pointer-events-none`}
          style={{
            left: `${marker.xPct - marker.rPct}%`,
            top: `${marker.yPct - marker.rPct}%`,
            width: `${marker.rPct * 2}%`,
            height: `${marker.rPct * 2}%`,
            animation: phase === "scanning" ? "pulseRing 0.9s ease-in-out infinite" : "none",
          }}
        />
      )}

      <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[min(92vw,520px)]">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/95 overflow-hidden shadow-2xl">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-xs tracking-[0.25em] text-cyan-300/70">SCAN</div>
              <div className="text-lg font-bold text-zinc-100 truncate">{result.title}</div>
              <div className="text-xs text-zinc-500 truncate">{result.objectId}</div>
            </div>
            <div className="text-xs text-zinc-500">{phase === "scanning" ? "SCANNING..." : "RESULT"}</div>
          </div>

          <div className="p-4 space-y-3">
            <div className="text-sm text-zinc-200 leading-relaxed">{result.summary}</div>

            <div className="grid grid-cols-3 gap-2">
              <StatChip label="EMF" value={result.emfDelta ?? 0} unit="" />
              <StatChip label="TEMP" value={result.tempDelta ?? 0} unit="°C" />
              <StatChip label="FEAR" value={result.fearDelta ?? 0} unit="" />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-900 pointer-events-auto"
                onClick={onClose}
              >
                關閉
              </button>
            </div>

            <div className="text-[11px] text-zinc-500">
              規格：圖檔內禁止 HUD/時碼；掃描 UI 屬於遊戲介面層。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value, unit }: { label: string; value: number; unit: string }) {
  const sign = value > 0 ? "+" : "";
  return (
    <div className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2">
      <div className="text-[10px] tracking-[0.2em] text-zinc-500">{label}</div>
      <div className="text-lg font-bold text-zinc-100">
        {sign}
        {value}
        {unit}
      </div>
    </div>
  );
}
