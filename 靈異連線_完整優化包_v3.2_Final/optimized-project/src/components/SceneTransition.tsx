/**
 * 場景轉場效果系統 - Scene Transition Effects
 * Smooth transitions with blur, fade, and VHS effects
 */

import { memo } from 'react';

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

  const animationDuration = `${duration}ms`;

  return (
    <div className="scene-transition" style={{ animationDuration }}>
      {/* Base black overlay */}
      <div className="scene-transition__overlay" />

      {/* VHS static noise */}
      <div className="scene-transition__noise" />

      {/* Blur effect layer */}
      {type === 'blur' && <div className="scene-transition__blur" />}

      {/* Glitch effect */}
      {type === 'glitch' && (
        <>
          <div className="scene-transition__glitch scene-transition__glitch--1" />
          <div className="scene-transition__glitch scene-transition__glitch--2" />
        </>
      )}

      {/* Loading indicator */}
      <div className="scene-transition__loading">
        <div className="scene-transition__loading-text">▶ LOADING...</div>
        <div className="scene-transition__loading-bar">
          <div className="scene-transition__loading-bar-fill" />
        </div>
      </div>

      <style jsx>{`
        .scene-transition {
          position: absolute;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          overflow: hidden;
        }

        .scene-transition__overlay {
          position: absolute;
          inset: 0;
          background: #000;
          animation: fadeInOut ${animationDuration} cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scene-transition__noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0;
          animation: noiseFlash ${animationDuration} ease-in-out;
        }

        .scene-transition__blur {
          position: absolute;
          inset: 0;
          backdrop-filter: blur(0px);
          animation: blurTransition ${animationDuration} cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scene-transition__glitch {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 0, 0, 0.3) 50%, transparent 100%);
          opacity: 0;
          mix-blend-mode: screen;
        }

        .scene-transition__glitch--1 {
          animation: glitchSlide1 ${animationDuration} steps(8);
        }

        .scene-transition__glitch--2 {
          animation: glitchSlide2 ${animationDuration} steps(8);
          background: linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.3) 50%, transparent 100%);
        }

        .scene-transition__loading {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          animation: fadeInOut ${animationDuration} ease-in-out;
        }

        .scene-transition__loading-text {
          font-family: 'VT323', monospace;
          font-size: 14px;
          letter-spacing: 0.2em;
          color: rgba(150, 150, 150, 0.8);
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }

        .scene-transition__loading-bar {
          width: 200px;
          height: 4px;
          background: rgba(50, 50, 50, 0.8);
          border-radius: 2px;
          overflow: hidden;
        }

        .scene-transition__loading-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 2px;
          animation: loadingProgress ${animationDuration} ease-out;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes blurTransition {
          0% {
            backdrop-filter: blur(0px);
          }
          50% {
            backdrop-filter: blur(20px);
          }
          100% {
            backdrop-filter: blur(0px);
          }
        }

        @keyframes noiseFlash {
          0%,
          100% {
            opacity: 0;
          }
          30%,
          70% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes glitchSlide1 {
          0%,
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
          40%,
          60% {
            transform: translateX(0%);
            opacity: 0.7;
          }
        }

        @keyframes glitchSlide2 {
          0%,
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
          45%,
          55% {
            transform: translateX(0%);
            opacity: 0.7;
          }
        }

        @keyframes loadingProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scene-transition * {
            animation-duration: 0.001ms !important;
          }
          .scene-transition__blur {
            backdrop-filter: none !important;
          }
        }
      `}</style>
    </div>
  );
});

export default SceneTransition;
