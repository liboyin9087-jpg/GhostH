/**
 * 場景轉場效果系統 - Scene Transition Effects
 * Smooth transitions with blur, fade, and VHS effects
 */

import React, { memo } from 'react';

export interface TransitionProps {
  active: boolean;
  type?: 'fade' | 'blur' | 'static' | 'glitch';
  duration?: number;
}

/**
 * Enhanced Scene Transition with multiple effects
 */
export const SceneTransition = memo(function SceneTransition({
  active,
  type = 'blur',
  duration = 700,
}: TransitionProps) {
  if (!active) return null;

  return (
    <div 
      className="absolute inset-0 z-[100] pointer-events-none overflow-hidden"
      style={{
        animation: `fadeInOut ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {/* Base black overlay */}
      <div 
        className="absolute inset-0 bg-black"
        style={{
          animation: `fadeInOut ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />

      {/* VHS static noise */}
      <div
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: `noiseFlash ${duration}ms ease-in-out`,
        }}
      />

      {/* Blur effect layer */}
      {type === 'blur' && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(0px)',
            animation: `blurTransition ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      )}

      {/* Loading indicator */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4"
        style={{
          animation: `fadeInOut ${duration}ms ease-in-out`,
        }}
      >
        <div className="text-stone-400 text-sm tracking-[0.2em] font-mono horror-glow">
          ▶ LOADING...
        </div>
        <div className="w-[200px] h-1 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
            style={{
              animation: `loadingProgress ${duration}ms ease-out`,
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default SceneTransition;
