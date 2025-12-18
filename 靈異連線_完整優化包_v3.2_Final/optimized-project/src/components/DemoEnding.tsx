/**
 * 《靈異連線》結局畫面
 * Demo Ending Screen
 */

import React, { memo, useEffect, useState } from 'react';

interface EndingConditions {
  sealCount: number;
  clueCount: number;
  morgueVisited: boolean;
}

interface DemoEndingProps {
  isOpen: boolean;
  conditions: EndingConditions;
  onClose: () => void;
  onRestart: () => void;
}

export const DemoEnding = memo(function DemoEnding({
  isOpen,
  conditions,
  onClose,
  onRestart,
}: DemoEndingProps) {
  const [phase, setPhase] = useState<'fade' | 'title' | 'text' | 'summary' | 'buttons'>('fade');

  useEffect(() => {
    if (!isOpen) {
      setPhase('fade');
      return;
    }

    const timers = [
      setTimeout(() => setPhase('title'), 1500),
      setTimeout(() => setPhase('text'), 3500),
      setTimeout(() => setPhase('summary'), 7000),
      setTimeout(() => setPhase('buttons'), 9000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center">
      {/* VHS 效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.06,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* 內容 */}
      <div className="relative z-10 text-center px-8 max-w-md">
        {/* 標題 */}
        <div className={`transition-all duration-1000 ${
          phase !== 'fade' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="text-4xl mb-4">👻</div>
          <h1 className="text-2xl font-bold text-[var(--ui-text-primary)] tracking-[0.2em] mb-2">
            結局：她離開了
          </h1>
          <div className="text-[var(--ui-text-muted)] text-sm tracking-[0.15em]">
            ENDING: SHE LEFT
          </div>
        </div>

        {/* 結局文字 */}
        <div className={`mt-8 transition-all duration-1000 delay-500 ${
          ['text', 'summary', 'buttons'].includes(phase) ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-[var(--ui-text-secondary)] leading-relaxed text-sm">
            你封印了訊號。
          </p>
          <p className="text-[var(--ui-text-secondary)] leading-relaxed text-sm mt-2">
            空氣再次開始流動。
          </p>
          <p className="text-[var(--ui-text-secondary)] leading-relaxed text-sm mt-2">
            但回放從未停止。
          </p>
          <p className="text-[var(--ui-amber)] leading-relaxed text-sm mt-4 font-mono">
            時間永遠停在 03:33:33。
          </p>
        </div>

        {/* 條件摘要 */}
        <div className={`mt-8 transition-all duration-1000 ${
          ['summary', 'buttons'].includes(phase) ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="inline-block text-left bg-[var(--ui-bg-soft)] border border-[var(--ui-border-soft)] rounded-xl p-4">
            <div className="text-[10px] text-[var(--ui-text-muted)] tracking-[0.15em] mb-3">
              DEMO COMPLETION
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className={conditions.sealCount >= 3 ? 'text-[var(--ui-emerald)]' : 'text-[var(--ui-red)]'}>
                  {conditions.sealCount >= 3 ? '✓' : '✗'}
                </span>
                <span className="text-[var(--ui-text-secondary)]">
                  封印次數 ≥ 3 ({conditions.sealCount}/3)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={conditions.clueCount >= 7 ? 'text-[var(--ui-emerald)]' : 'text-[var(--ui-red)]'}>
                  {conditions.clueCount >= 7 ? '✓' : '✗'}
                </span>
                <span className="text-[var(--ui-text-secondary)]">
                  線索收集 ≥ 7 ({conditions.clueCount}/7)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={conditions.morgueVisited ? 'text-[var(--ui-emerald)]' : 'text-[var(--ui-red)]'}>
                  {conditions.morgueVisited ? '✓' : '✗'}
                </span>
                <span className="text-[var(--ui-text-secondary)]">
                  已探索太平間
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 按鈕 */}
        <div className={`mt-8 space-y-3 transition-all duration-1000 ${
          phase === 'buttons' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-[var(--ui-emerald-soft)] border border-[var(--ui-emerald)] text-[var(--ui-emerald)] font-medium tracking-wide transition-all hover:bg-[var(--ui-emerald)] hover:text-black"
          >
            ↻ 重新開始
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[var(--ui-bg-soft)] border border-[var(--ui-border)] text-[var(--ui-text-secondary)] font-medium tracking-wide transition-all hover:border-[var(--ui-text-secondary)]"
          >
            關閉
          </button>
        </div>

        {/* Demo 標記 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--ui-text-muted)] text-[10px] tracking-[0.2em]">
          DEMO COMPLETE — THANK YOU FOR PLAYING
        </div>
      </div>
    </div>
  );
});

// 檢查是否達成結局條件
export function checkEndingConditions(conditions: EndingConditions): boolean {
  return (
    conditions.sealCount >= 3 &&
    conditions.clueCount >= 7 &&
    conditions.morgueVisited
  );
}

export default DemoEnding;
