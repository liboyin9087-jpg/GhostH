/**
 * 增強版 VHS 效果系統（Phase-Aware）
 * Enhanced VHS Overlay System for Spectral Link
 * 
 * 根據 HauntDirector 的 phase 和 intensity 調整效果強度
 */

import React, { ReactNode, memo, useEffect, useState, useMemo } from "react";
import type { HauntPhase, IncidentType } from "../game/useHauntDirector";

interface VHSOverlaySystemProps {
  children: ReactNode;
  phase: HauntPhase;
  intensity01: number;      // 0~1
  incidentType?: IncidentType;
  reducedMotion?: boolean;
}

export const VHSOverlaySystem = memo(function VHSOverlaySystem({
  children,
  phase,
  intensity01,
  incidentType = "ghost",
  reducedMotion = false,
}: VHSOverlaySystemProps) {
  const [trackingOffset, setTrackingOffset] = useState(0);
  const [flickerOpacity, setFlickerOpacity] = useState(0);

  // 動態計算效果參數
  const effects = useMemo(() => {
    const i = Math.min(1, Math.max(0, intensity01));
    
    return {
      // 雜訊透明度：基礎 3% + 強度加成（最高 15%）
      noiseOpacity: 0.03 + i * 0.12,
      // 掃描線透明度
      scanlineOpacity: 0.12 + i * 0.18,
      // 暈影強度
      vignetteDark: 0.30 + i * 0.50,
      // RGB 邊條速度
      rgbSpeed: phase === "incident" ? 0.15 : phase === "warning" ? 0.25 : 0.4,
      // RGB 邊條透明度
      rgbOpacity: 0.25 + i * 0.45,
      // 追蹤線數量
      trackingLineCount: phase === "incident" ? 10 : phase === "warning" ? 6 : 3,
      // 色彩濾鏡
      colorFilter: `contrast(${1 + i * 0.2}) brightness(${1 - i * 0.08}) saturate(${1 - i * 0.15})`,
      // 綠色調強度
      greenTint: 0.06 + i * 0.08,
    };
  }, [intensity01, phase]);

  // 追蹤線偏移（不穩定時抖動）
  useEffect(() => {
    if (reducedMotion || phase === "stable") {
      setTrackingOffset(0);
      return;
    }

    const interval = setInterval(() => {
      const maxOffset = phase === "incident" ? 12 : 6;
      setTrackingOffset((Math.random() - 0.5) * maxOffset);
    }, phase === "incident" ? 50 : 100);

    return () => clearInterval(interval);
  }, [phase, reducedMotion]);

  // 隨機閃爍效果
  useEffect(() => {
    if (reducedMotion) return;

    const flicker = () => {
      const chance = phase === "incident" ? 0.4 : phase === "warning" ? 0.15 : 0.05;
      
      if (Math.random() < chance) {
        setFlickerOpacity(0.05 + Math.random() * 0.15);
        setTimeout(() => setFlickerOpacity(0), 30 + Math.random() * 80);
      }
    };

    const interval = setInterval(flicker, phase === "incident" ? 200 : 800);
    return () => clearInterval(interval);
  }, [phase, reducedMotion]);

  const isIncident = phase === "incident";
  const isWarning = phase === "warning";

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* ===== 主內容 ===== */}
      <div
        className="relative z-10 w-full h-full"
        style={{
          filter: effects.colorFilter,
          transform: isIncident ? `translateX(${trackingOffset}px)` : undefined,
          transition: isIncident ? "none" : "transform 0.1s ease-out",
        }}
      >
        {children}
      </div>

      {/* ===== 左側 RGB 邊條 ===== */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[6px] z-[80] pointer-events-none overflow-hidden"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(
              180deg,
              #ff0000 0px, #ff0000 3px,
              #00ff00 3px, #00ff00 6px,
              #0000ff 6px, #0000ff 9px,
              #ff00ff 9px, #ff00ff 12px,
              #00ffff 12px, #00ffff 15px,
              #ffff00 15px, #ffff00 18px
            )`,
            opacity: effects.rgbOpacity,
            animation: reducedMotion ? "none" : `rgbScroll ${effects.rgbSpeed}s linear infinite`,
          }}
        />
      </div>

      {/* ===== 右側 RGB 邊條 ===== */}
      <div
        aria-hidden
        className="absolute right-0 top-0 bottom-0 w-[6px] z-[80] pointer-events-none overflow-hidden"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(
              180deg,
              #00ffff 0px, #00ffff 3px,
              #ffff00 3px, #ffff00 6px,
              #ff00ff 6px, #ff00ff 9px,
              #0000ff 9px, #0000ff 12px,
              #00ff00 12px, #00ff00 15px,
              #ff0000 15px, #ff0000 18px
            )`,
            opacity: effects.rgbOpacity,
            animation: reducedMotion ? "none" : `rgbScroll ${effects.rgbSpeed * 0.9}s linear infinite reverse`,
          }}
        />
      </div>

      {/* ===== 頂部/底部黑邊 ===== */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-2 bg-black z-[75] pointer-events-none" />
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-2 bg-black z-[75] pointer-events-none" />

      {/* ===== 水平掃描線 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[70] pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0,0,0,${effects.scanlineOpacity}) 2px,
            rgba(0,0,0,${effects.scanlineOpacity}) 4px
          )`,
          mixBlendMode: "multiply",
        }}
      />

      {/* ===== 移動掃描線 ===== */}
      {!reducedMotion && (
        <div
          aria-hidden
          className="absolute left-0 right-0 h-[3px] z-[72] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            animation: `scanlineMove ${isIncident ? 3 : isWarning ? 5 : 8}s linear infinite`,
          }}
        />
      )}

      {/* ===== 水平追蹤干擾線 ===== */}
      {!reducedMotion && (isWarning || isIncident) && (
        <div aria-hidden className="absolute inset-0 z-[73] pointer-events-none overflow-hidden">
          {Array.from({ length: effects.trackingLineCount }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${8 + (i / effects.trackingLineCount) * 84}%`,
                left: 0,
                right: 0,
                height: 1,
                background: `rgba(255,255,255,${isIncident ? 0.18 : 0.10})`,
                animation: `trackingX ${0.25 + i * 0.1}s ease-in-out infinite`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ===== 雜訊紋理 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[65] pointer-events-none"
        style={{
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: effects.noiseOpacity,
          animation: reducedMotion ? "none" : `noiseShift ${isIncident ? 0.08 : 0.15}s steps(6) infinite`,
        }}
      />

      {/* ===== 暈影效果 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[60] pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 15%,
            rgba(0,0,0,${effects.vignetteDark * 0.5}) 55%,
            rgba(0,0,0,${effects.vignetteDark}) 100%
          )`,
        }}
      />

      {/* ===== 綠色調色彩校正 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[55] pointer-events-none"
        style={{
          mixBlendMode: "color",
          background: `rgba(18, 60, 45, ${effects.greenTint})`,
        }}
      />

      {/* ===== 閃爍效果 ===== */}
      {flickerOpacity > 0 && (
        <div
          aria-hidden
          className="absolute inset-0 z-[85] pointer-events-none"
          style={{ background: `rgba(255,255,255,${flickerOpacity})` }}
        />
      )}

      {/* ===== Incident 事件效果 ===== */}
      {isIncident && incidentType === "ghost" && (
        <div
          aria-hidden
          className="absolute inset-0 z-[86] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.08) 0%, transparent 55%)",
            animation: "ghostPulse 0.4s ease-out",
          }}
        />
      )}

      {isIncident && incidentType === "blackout" && (
        <div
          aria-hidden
          className="absolute inset-0 z-[88] bg-black pointer-events-none"
          style={{ animation: "blackoutFlash 0.5s ease-out" }}
        />
      )}

      {isIncident && incidentType === "chromatic" && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 z-[86] pointer-events-none"
            style={{
              background: "rgba(255,0,0,0.06)",
              transform: "translateX(-4px)",
              mixBlendMode: "screen",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 z-[86] pointer-events-none"
            style={{
              background: "rgba(0,255,255,0.06)",
              transform: "translateX(4px)",
              mixBlendMode: "screen",
            }}
          />
        </>
      )}

      {isIncident && incidentType === "static" && (
        <div
          aria-hidden
          className="absolute inset-0 z-[87] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.35,
            animation: "noiseShift 0.05s steps(8) infinite",
          }}
        />
      )}

      {isIncident && incidentType === "tracking" && (
        <div
          aria-hidden
          className="absolute inset-0 z-[87] pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent 0%,
              transparent 48%,
              rgba(255,255,255,0.1) 48%,
              rgba(255,255,255,0.1) 52%,
              transparent 52%,
              transparent 100%
            )`,
            animation: "trackingRoll 0.3s steps(4) infinite",
          }}
        />
      )}

      {/* ===== 危險警告邊框（高強度時） ===== */}
      {intensity01 > 0.7 && (
        <div
          aria-hidden
          className="absolute inset-0 z-[50] pointer-events-none"
          style={{
            boxShadow: `inset 0 0 ${30 + (intensity01 - 0.7) * 100}px rgba(239, 68, 68, ${(intensity01 - 0.7) * 0.5})`,
            animation: "warningPulse 1.2s ease-in-out infinite",
          }}
        />
      )}

      {/* ===== VHS 角標 ===== */}
      <div
        aria-hidden
        className="absolute top-3 left-3 z-[90] pointer-events-none"
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: 18,
          letterSpacing: "0.2em",
          fontFamily: "'VT323', monospace",
          textShadow: "2px 2px 0 rgba(0,0,0,0.8)",
        }}
      >
        VHS
      </div>

      {/* ===== 動畫定義 ===== */}
      <style>{`
        @keyframes rgbScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(18px); }
        }
        @keyframes scanlineMove {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes noiseShift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1.5%, 1.5%); }
          50% { transform: translate(1.5%, -1%); }
          75% { transform: translate(-1%, 1%); }
        }
        @keyframes trackingX {
          0% { transform: translateX(-15%); opacity: 0; }
          50% { transform: translateX(15%); opacity: 1; }
          100% { transform: translateX(-15%); opacity: 0; }
        }
        @keyframes warningPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes ghostPulse {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.02); }
        }
        @keyframes blackoutFlash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes trackingRoll {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
});
