import React, { useEffect, useMemo, useState } from 'react';
import type { SceneKey } from '../assets/scenes';
import { SCENES } from '../assets/scenes';

type Props = {
  scene: SceneKey;
  active: boolean;
  /** 自動消失時間（ms） */
  durationMs?: number;
  /** 額外 UI：REC / CAM 等字樣 */
  mode?: 'cctv' | 'photo';
  /** 透明度（0~1） */
  opacity?: number;
  /** 事件標籤（右下角小字） */
  tag?: string;
  onDone?: () => void;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const timestampText = () => {
  const d = new Date();
  const pad = (x: number) => String(x).padStart(2, '0');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const mon = months[d.getMonth()];
  return `${mon} ${pad(d.getDate())} ${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function HauntFlash({
  scene,
  active,
  durationMs = 1800,
  mode = 'cctv',
  opacity = 0.92,
  tag,
  onDone,
}: Props) {
  const asset = SCENES[scene];

  const [visible, setVisible] = useState(false);
  const [ts, setTs] = useState(() => timestampText());

  // 讓「事件觸發」更像錄影：每次 active 都刷新 timestamp
  useEffect(() => {
    if (!active) return;
    setTs(timestampText());
  }, [active]);

  useEffect(() => {
    let t: number | undefined;
    let done: number | undefined;

    if (active) {
      setVisible(true);
      // 快閃：稍微延遲後淡出
      done = window.setTimeout(() => {
        setVisible(false);
        t = window.setTimeout(() => onDone?.(), 220);
      }, durationMs);
    } else {
      setVisible(false);
    }

    return () => {
      if (t) window.clearTimeout(t);
      if (done) window.clearTimeout(done);
    };
  }, [active, durationMs, onDone]);

  // 微弱掃描線 + 雜訊點
  const overlayStyle = useMemo(() => ({
    opacity: clamp01(opacity),
    transition: 'opacity 180ms ease-out, transform 180ms ease-out',
    transform: visible ? 'scale(1.0)' : 'scale(1.01)',
    filter: mode === 'cctv' ? 'contrast(1.05) saturate(0.95)' : 'contrast(1.02)',
  }), [visible, opacity, mode]);

  if (!active && !visible) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      <div className="absolute inset-0 bg-black" style={{ opacity: visible ? 0.35 : 0.0, transition: 'opacity 180ms ease-out' }} />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[92%] max-w-4xl">
          {/* 圖片本體（picture：webp + jpg fallback） */}
          <div className="relative overflow-hidden border border-stone-800 shadow-[0_0_40px_rgba(0,0,0,0.7)]" style={overlayStyle}>
            <picture>
              <source srcSet={asset.webp} type="image/webp" />
              <img
                src={asset.jpg}
                alt={asset.label}
                className="block w-full h-auto"
                loading="eager"
                decoding="async"
              />
            </picture>

            {/* scanlines */}
            <div
              className="absolute inset-0 mix-blend-overlay"
              style={{
                backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)',
                opacity: mode === 'cctv' ? 0.35 : 0.18,
              }}
            />

            {/* noise specks */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, rgba(0,0,0,0) 1px)',
                backgroundSize: '3px 3px',
                opacity: mode === 'cctv' ? 0.18 : 0.10,
              }}
            />

            {/* HUD */}
            {mode === 'cctv' && (
              <>
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,0,0,0.5)]" />
                  <span className="font-mono text-xs tracking-widest text-stone-100 opacity-90">REC</span>
                </div>

                <div className="absolute bottom-3 left-3 font-mono text-xs tracking-widest text-stone-100 opacity-90">
                  {ts}
                </div>

                <div className="absolute bottom-3 right-3 font-mono text-xs tracking-widest text-stone-100 opacity-90">
                  {tag ?? 'CAM 04 - ISOLATION'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
