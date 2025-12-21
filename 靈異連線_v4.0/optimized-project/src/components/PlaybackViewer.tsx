/**
 * 監視器回放檢視器
 * Playback Viewer Component
 * 
 * 顯示 Found Footage 圖片與說明
 */

import React, { memo, useEffect, useState } from "react";
import type { PlaybackState } from "../game/usePlaybackSystem";

interface PlaybackViewerProps {
  state: PlaybackState;
  onClose: () => void;
}

export const PlaybackViewer = memo(function PlaybackViewer({
  state,
  onClose,
}: PlaybackViewerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  // 隨機 glitch 效果
  useEffect(() => {
    if (state.phase !== "showing") return;

    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 80 + Math.random() * 120);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [state.phase]);

  // 重置圖片載入狀態
  useEffect(() => {
    if (state.phase === "showing") {
      setImageLoaded(false);
    }
  }, [state.src, state.phase]);

  // 凍結效果
  if (state.phase === "freezing") {
    return (
      <div className="absolute inset-0 z-[95] bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📹</div>
          <div className="text-stone-300 text-sm tracking-[0.15em]">
            畫面凍結中...
          </div>
          <div className="mt-2 text-stone-500 text-xs">
            FRAME FROZEN
          </div>
        </div>
      </div>
    );
  }

  // 載入進度
  if (state.phase === "loading") {
    return (
      <div className="absolute inset-0 z-[95] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-stone-950/90 border border-stone-700/50 rounded-xl p-5">
            {/* 標題 */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] tracking-[0.2em] text-stone-400">
                PLAYBACK BUFFERING
              </span>
            </div>

            {/* 狀態文字 */}
            <div className="text-stone-200 text-sm mb-3">
              {state.caption}
            </div>

            {/* 進度條 */}
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-stone-500 to-stone-300 transition-all duration-200"
                style={{ width: `${state.progress}%` }}
              />
            </div>

            {/* 進度數字 */}
            <div className="mt-2 flex justify-between text-xs">
              <span className="text-stone-500">載入中</span>
              <span className="text-stone-400 font-mono">{state.progress}%</span>
            </div>

            {/* VHS 風格裝飾線 */}
            <div className="mt-4 opacity-30">
              <div className="h-px bg-gradient-to-r from-transparent via-stone-500 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 顯示結果
  if (state.phase === "showing") {
    return (
      <div className="absolute inset-0 z-[95] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-stone-950/95 border border-stone-600/50 rounded-xl overflow-hidden shadow-2xl">
            {/* 頂部狀態列 */}
            <div className="px-3 py-2 bg-stone-900/80 border-b border-stone-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] tracking-[0.15em] text-stone-400 font-mono">
                  PLAYBACK
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">
                {state.timestamp}
              </span>
            </div>

            {/* 圖片區域 */}
            <div className="relative aspect-square bg-black">
              {/* 載入指示器 */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-stone-600 border-t-stone-300 rounded-full animate-spin" />
                </div>
              )}

              {/* 主圖片 */}
              <img
                src={state.src}
                alt="Found footage"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-95" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                draggable={false}
              />

              {/* VHS 掃描線覆蓋 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    transparent 2px,
                    rgba(0,0,0,0.15) 2px,
                    rgba(0,0,0,0.15) 4px
                  )`,
                }}
              />

              {/* VHS 雜訊 */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  opacity: 0.08,
                }}
              />

              {/* Glitch 效果 */}
              {glitchActive && (
                <>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "rgba(255,0,0,0.05)",
                      transform: "translateX(-3px)",
                      mixBlendMode: "screen",
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "rgba(0,255,255,0.05)",
                      transform: "translateX(3px)",
                      mixBlendMode: "screen",
                    }}
                  />
                </>
              )}

              {/* 角落時間戳 */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-[10px] text-stone-300 font-mono">
                {state.timestamp}
              </div>

              {/* REC 指示 */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-red-400 font-bold tracking-wider">
                  REC
                </span>
              </div>
            </div>

            {/* 說明文字區域 */}
            <div className="p-4">
              <div className="text-stone-200 text-sm leading-relaxed">
                {state.caption}
              </div>

              {/* 關閉按鈕 */}
              <button
                onClick={onClose}
                className="mt-4 w-full py-2.5 rounded-lg bg-stone-800/80 hover:bg-stone-700/90 border border-stone-600/40 text-stone-200 text-sm tracking-wide transition-all"
              >
                關閉回放
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (state.phase === "error") {
    return (
      <div className="absolute inset-0 z-[95] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-red-400 text-sm mb-2">回放失敗</div>
          <div className="text-stone-500 text-xs mb-4">{state.error}</div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-stone-800/80 text-stone-300 text-sm"
          >
            關閉
          </button>
        </div>
      </div>
    );
  }

  return null;
});

// 獨立的載入進度條元件（可在其他地方使用）
export const PlaybackLoadingBar = memo(function PlaybackLoadingBar({
  progress,
  caption,
}: {
  progress: number;
  caption: string;
}) {
  return (
    <div className="absolute inset-x-3 bottom-44 z-[90]">
      <div className="bg-stone-950/80 border border-stone-600/40 rounded-lg p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[10px] tracking-[0.15em] text-stone-400">
            PLAYBACK BUFFERING
          </span>
        </div>
        <div className="text-stone-300 text-xs mb-2">{caption}</div>
        <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-stone-400 to-stone-200 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
});
