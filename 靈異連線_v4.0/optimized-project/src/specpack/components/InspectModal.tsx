import React, { useEffect } from "react";
import type { AssetKind, GameObject } from "../types/game";

export function InspectModal({
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
  const label = kind === "cutout" ? "CUTOUT" : "FOUND";

  return (
    <div className="fixed inset-0 z-[999]">
      <button
        aria-label="close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 top-10 mx-auto w-[min(92vw,520px)]">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/95 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="min-w-0">
              <div className="text-xs tracking-[0.25em] text-zinc-500">{label}</div>
              <div className="text-lg font-bold text-zinc-100 truncate">{obj.name}</div>
              <div className="text-[11px] text-zinc-500 truncate">{obj.id}</div>
            </div>

            <button
              className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-900"
              onClick={onClose}
            >
              關閉
            </button>
          </div>

          <div className="p-4">
            <div className="rounded-lg border border-zinc-800 bg-black overflow-hidden">
              <img src={src} alt={obj.name} className="w-full h-auto block" draggable={false} />
            </div>

            <div className="mt-3 text-xs text-zinc-500">
              來源：<span className="break-all">{src}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
