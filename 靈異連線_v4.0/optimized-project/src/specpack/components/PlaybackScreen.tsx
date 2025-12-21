import React, { useEffect } from "react";
import type { AssetKind, GameObject } from "../types/game";

export function PlaybackScreen({
  open,
  obj,
  kind,
  onClose,
}: {
  open: boolean;
  obj: GameObject | null;
  kind: AssetKind;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !obj) return null;

  const src = kind === "cutout" ? obj.assets.cutout : obj.assets.found;

  return (
    <div className="fixed inset-0 z-[1000] bg-black">
      <style>{`
        @keyframes scanlineMove { 0%{transform:translateY(-10%)} 100%{transform:translateY(110%)} }
        @keyframes noiseShift { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-1%,1%)} 50%{transform:translate(1%,-1%)} 75%{transform:translate(-1%,-1%)} }
      `}</style>

      <div className="absolute top-0 inset-x-0 z-20 p-3 flex items-center justify-between">
        <div className="text-zinc-200">
          <div className="text-xs tracking-[0.25em] text-zinc-500">PLAYBACK</div>
          <div className="font-bold">{obj.name}</div>
        </div>
        <button
          className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-900"
          onClick={onClose}
        >
          返回
        </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative w-[min(92vw,720px)] aspect-square border border-zinc-800 rounded-xl overflow-hidden bg-black">
          <img src={src} alt={obj.name} className="absolute inset-0 w-full h-full object-cover" />

          <div
            className="absolute inset-0 pointer-events-none opacity-60 mix-blend-overlay"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
            }}
          />
          <div
            className="absolute inset-x-0 h-[3px] opacity-20 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.5), transparent)",
              animation: "scanlineMove 7s linear infinite",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{
              opacity: 0.08,
              backgroundImage:
                `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              animation: "noiseShift 0.2s steps(6) infinite",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.9) 100%)",
            }}
          />

          <div className="absolute inset-3 border border-white/10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
