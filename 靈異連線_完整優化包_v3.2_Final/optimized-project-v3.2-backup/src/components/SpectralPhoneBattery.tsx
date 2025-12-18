import React from "react";
import { Battery, BatteryLow, Signal, Zap } from "lucide-react";
import { useSpectralBattery } from "../hooks/useSpectralBattery";

export default function SpectralPhoneBattery(props: {
  timeLeft: number;
  startTime: number;
  isCursed: boolean;
}) {
  const { percent, isLow, isCritical } = useSpectralBattery(props);

  return (
    <div className="fixed top-6 left-6 z-40 select-none">
      <div
        className={[
          "flex items-center gap-3 rounded border px-3 py-2 bg-black/70",
          "border-stone-800 shadow-[0_0_18px_rgba(0,255,65,0.12)]",
          isLow ? "animate-pulse" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          {isCritical ? (
            <BatteryLow className="text-red-500" size={18} />
          ) : (
            <Battery className="text-stone-300" size={18} />
          )}
          <span className="font-mono text-xs text-stone-300">
            BAT:{" "}
            <span
              className={
                isCritical ? "text-red-500" : isLow ? "text-yellow-400" : "text-emerald-400"
              }
            >
              {String(percent).padStart(3, "0")}%
            </span>
          </span>
        </div>

        <div className="h-2 w-24 rounded bg-stone-800 overflow-hidden">
          <div
            className={[
              "h-full transition-all",
              isCritical ? "bg-red-600" : isLow ? "bg-yellow-400" : "bg-emerald-400",
            ].join(" ")}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-stone-400">
          <Signal size={16} className={isLow ? "opacity-50" : ""} />
          <Zap size={16} className={isCritical ? "text-red-500 animate-pulse" : ""} />
        </div>
      </div>

      {isCritical && (
        <div className="mt-2 font-mono text-[10px] text-red-500 bg-black/60 border border-red-900 px-2 py-1 inline-block">
          LOW POWER… SIGNAL DISTORTION ↑
        </div>
      )}
    </div>
  );
}