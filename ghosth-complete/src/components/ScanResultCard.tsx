/**
 * 掃描結果卡片元件
 * Scan Result Card Component
 */

import React, { memo, useEffect, useState } from "react";
import type { ScanResult } from "../game/useScanSystem";

interface ScanResultCardProps {
  result: ScanResult | null;
  isScanning?: boolean;
  onDismiss?: () => void;
  autoDismissDelay?: number;
}

// 方向中文對照
const DIR_LABELS: Record<string, string> = {
  N: "北", NE: "東北", E: "東", SE: "東南",
  S: "南", SW: "西南", W: "西", NW: "西北",
};

// 類型圖標
const TYPE_ICONS: Record<string, string> = {
  EMF_SPIKE: "⚡",
  COLD_SPOT: "❄️",
  WHISPER: "👂",
  FOOTSTEPS: "👣",
};

export const ScanResultCard = memo(function ScanResultCard({
  result,
  isScanning = false,
  onDismiss,
  autoDismissDelay = 8000,
}: ScanResultCardProps) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  // 顯示/隱藏動畫
  useEffect(() => {
    if (result) {
      setVisible(true);
      setFading(false);

      // 自動隱藏
      if (autoDismissDelay > 0) {
        const fadeTimer = setTimeout(() => setFading(true), autoDismissDelay - 300);
        const hideTimer = setTimeout(() => {
          setVisible(false);
          onDismiss?.();
        }, autoDismissDelay);

        return () => {
          clearTimeout(fadeTimer);
          clearTimeout(hideTimer);
        };
      }
    } else {
      setVisible(false);
    }
  }, [result, autoDismissDelay, onDismiss]);

  // 掃描中狀態
  if (isScanning) {
    return (
      <div className="absolute left-3 right-3 bottom-44 z-[85]">
        <div className="bg-cyan-950/60 border border-cyan-500/40 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-cyan-400/60 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-cyan-300">
                📡
              </div>
            </div>
            <div>
              <div className="text-cyan-200 font-bold tracking-wide">掃描中...</div>
              <div className="text-cyan-400/70 text-xs mt-0.5">偵測異常能量訊號</div>
            </div>
          </div>
          
          {/* 掃描進度條 */}
          <div className="mt-3 h-1 bg-cyan-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
              style={{ 
                width: "100%",
                animation: "scanProgress 1.5s ease-in-out infinite",
              }} 
            />
          </div>
        </div>
        
        <style>{`
          @keyframes scanProgress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  if (!result || !visible) return null;

  const confidencePercent = Math.round(result.confidence * 100);
  const dirLabel = DIR_LABELS[result.dir] || result.dir;
  const icon = TYPE_ICONS[result.type] || "❓";

  return (
    <div
      className={`absolute left-3 right-3 bottom-44 z-[85] transition-all duration-300 ${
        fading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="bg-cyan-950/70 border border-cyan-500/40 rounded-lg overflow-hidden backdrop-blur-sm">
        {/* 頂部標題列 */}
        <div className="px-3 py-2 bg-cyan-900/40 border-b border-cyan-600/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-400 animate-pulse">●</span>
            <span className="text-[10px] tracking-[0.2em] text-cyan-300/90 font-bold">
              ANOMALY DETECTED
            </span>
          </div>
          <button
            onClick={() => {
              setFading(true);
              setTimeout(() => {
                setVisible(false);
                onDismiss?.();
              }, 200);
            }}
            className="text-cyan-400/60 hover:text-cyan-300 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* 主要內容 */}
        <div className="p-3">
          <div className="flex items-start gap-3">
            {/* 類型圖標 */}
            <div className="w-12 h-12 rounded-lg bg-cyan-900/50 border border-cyan-600/30 flex items-center justify-center text-2xl">
              {icon}
            </div>

            {/* 資訊 */}
            <div className="flex-1 min-w-0">
              <div className="text-cyan-100 font-bold text-sm">
                {result.label}
              </div>
              <div className="text-cyan-300/80 text-xs mt-1">
                {result.type.replace("_", " ")}
              </div>
            </div>
          </div>

          {/* 數據列 */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <DataItem label="距離" value={`${result.distM}m`} />
            <DataItem label="方向" value={dirLabel} />
            <DataItem 
              label="可信度" 
              value={`${confidencePercent}%`}
              highlight={confidencePercent >= 80}
            />
          </div>

          {/* 可信度條 */}
          <div className="mt-3">
            <div className="h-1.5 bg-cyan-900/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  confidencePercent >= 80
                    ? "bg-gradient-to-r from-green-500 to-emerald-400"
                    : confidencePercent >= 60
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-400"
                    : "bg-gradient-to-r from-yellow-500 to-amber-400"
                }`}
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 數據項子元件
function DataItem({ 
  label, 
  value, 
  highlight = false 
}: { 
  label: string; 
  value: string; 
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="text-[9px] text-cyan-500/70 tracking-wider uppercase">
        {label}
      </div>
      <div className={`text-sm font-mono font-bold ${
        highlight ? "text-green-300" : "text-cyan-200"
      }`}>
        {value}
      </div>
    </div>
  );
}
