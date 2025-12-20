/**
 * 《靈異連線》增強版 VHS 效果系統
 * Spectral Link - Enhanced VHS System with 3D Integration
 * 
 * 優化功能：
 * 1. 3D 透視整合
 * 2. GPU 加速渲染
 * 3. 動態效果響應
 * 4. 色差/掃描線/雜訊層次優化
 * 5. 事件驅動效果爆發
 * 6. 記憶體優化
 */

import React, { ReactNode, memo, useEffect, useState, useMemo, useCallback, useRef } from "react"
import type { HauntPhase, IncidentType } from "../game/useHauntDirector"

// ===== 類型定義 =====
interface VHSEnhancedProps {
  children: ReactNode
  phase: HauntPhase
  intensity01: number
  incidentType?: IncidentType
  reducedMotion?: boolean
  enable3D?: boolean
  enableParticles?: boolean
  glitchLevel?: 'none' | 'subtle' | 'moderate' | 'intense'
  colorGrade?: 'neutral' | 'green' | 'warm' | 'cold'
}

interface GlitchState {
  chromatic: number
  noise: number
  tracking: number
  flicker: number
  distortion: number
}

// ===== 效果預設 =====
const GLITCH_PRESETS: Record<string, Partial<GlitchState>> = {
  none: { chromatic: 0, noise: 0, tracking: 0, flicker: 0, distortion: 0 },
  subtle: { chromatic: 1, noise: 0.03, tracking: 0, flicker: 0.02, distortion: 0 },
  moderate: { chromatic: 2, noise: 0.06, tracking: 0.3, flicker: 0.05, distortion: 0.02 },
  intense: { chromatic: 4, noise: 0.12, tracking: 0.7, flicker: 0.1, distortion: 0.05 },
}

const COLOR_GRADES = {
  neutral: { hue: 0, sat: 1, tint: 'rgba(0,0,0,0)' },
  green: { hue: -10, sat: 0.85, tint: 'rgba(18, 60, 45, 0.08)' },
  warm: { hue: 15, sat: 1.1, tint: 'rgba(60, 40, 20, 0.06)' },
  cold: { hue: -20, sat: 0.9, tint: 'rgba(20, 40, 60, 0.08)' },
}

// ===== 主組件 =====
export const VHSEnhanced = memo(function VHSEnhanced({
  children,
  phase,
  intensity01,
  incidentType = "ghost",
  reducedMotion = false,
  enable3D = true,
  enableParticles = true,
  glitchLevel = 'subtle',
  colorGrade = 'green',
}: VHSEnhancedProps) {
  // 狀態管理
  const [glitchState, setGlitchState] = useState<GlitchState>({
    chromatic: 0,
    noise: 0,
    tracking: 0,
    flicker: 0,
    distortion: 0,
  })
  const [randomSeed, setRandomSeed] = useState(0)
  const frameRef = useRef<number>(0)
  const lastUpdateRef = useRef<number>(0)

  // 計算效果參數
  const effects = useMemo(() => {
    const i = Math.min(1, Math.max(0, intensity01))
    const preset = GLITCH_PRESETS[glitchLevel] || GLITCH_PRESETS.subtle
    const grade = COLOR_GRADES[colorGrade] || COLOR_GRADES.green
    
    return {
      // 色差效果
      chromaticOffset: (preset.chromatic || 0) + i * 2,
      chromaticOpacity: 0.04 + i * 0.04,
      
      // 掃描線
      scanlineOpacity: 0.12 + i * 0.15,
      scanlineGap: phase === 'incident' ? 2 : 3,
      scanlineSpeed: phase === 'incident' ? 3 : phase === 'warning' ? 5 : 8,
      
      // 雜訊
      noiseOpacity: (preset.noise || 0.03) + i * 0.08,
      noiseSpeed: phase === 'incident' ? 0.05 : 0.12,
      
      // 暈影
      vignetteIntensity: 0.35 + i * 0.35,
      
      // RGB 邊條
      rgbOpacity: 0.3 + i * 0.4,
      rgbSpeed: phase === 'incident' ? 0.15 : phase === 'warning' ? 0.25 : 0.4,
      
      // 色彩校正
      colorFilter: `
        contrast(${1 + i * 0.15}) 
        brightness(${1 - i * 0.06}) 
        saturate(${grade.sat - i * 0.1})
        hue-rotate(${grade.hue}deg)
      `,
      colorTint: grade.tint,
      
      // 追蹤線數量
      trackingLines: phase === 'incident' ? 12 : phase === 'warning' ? 6 : 2,
      
      // 閃爍
      flickerChance: phase === 'incident' ? 0.35 : phase === 'warning' ? 0.12 : 0.03,
    }
  }, [intensity01, phase, glitchLevel, colorGrade])

  // 動態效果更新（使用 RAF 優化）
  useEffect(() => {
    if (reducedMotion) return

    const updateEffects = (timestamp: number) => {
      // 限制更新頻率（約 30fps）
      if (timestamp - lastUpdateRef.current < 33) {
        frameRef.current = requestAnimationFrame(updateEffects)
        return
      }
      lastUpdateRef.current = timestamp

      const preset = GLITCH_PRESETS[glitchLevel] || GLITCH_PRESETS.subtle
      const phaseMultiplier = phase === 'incident' ? 2 : phase === 'warning' ? 1.3 : 1

      setGlitchState({
        chromatic: (preset.chromatic || 0) * phaseMultiplier + (Math.random() - 0.5) * 0.5,
        noise: (preset.noise || 0) * phaseMultiplier,
        tracking: phase !== 'stable' ? (Math.random() - 0.5) * 8 * phaseMultiplier : 0,
        flicker: Math.random() < effects.flickerChance ? 0.1 + Math.random() * 0.15 : 0,
        distortion: phase === 'incident' ? (Math.random() - 0.5) * 3 : 0,
      })

      setRandomSeed(Math.random())
      frameRef.current = requestAnimationFrame(updateEffects)
    }

    frameRef.current = requestAnimationFrame(updateEffects)
    return () => cancelAnimationFrame(frameRef.current)
  }, [reducedMotion, phase, glitchLevel, effects.flickerChance])

  // 3D 容器樣式
  const containerStyle = useMemo(() => ({
    perspective: enable3D ? '1200px' : 'none',
    perspectiveOrigin: '50% 50%',
  }), [enable3D])

  // 主內容樣式
  const contentStyle = useMemo(() => ({
    filter: effects.colorFilter,
    transform: phase !== 'stable' 
      ? `translateX(${glitchState.tracking}px) skewX(${glitchState.distortion}deg)` 
      : 'none',
    transition: phase === 'incident' ? 'none' : 'transform 0.1s ease-out',
    transformStyle: enable3D ? 'preserve-3d' as const : 'flat' as const,
  }), [effects.colorFilter, phase, glitchState, enable3D])

  return (
    <div className="relative w-full h-full overflow-hidden bg-black" style={containerStyle}>
      {/* ===== 主內容層 ===== */}
      <div className="relative z-10 w-full h-full" style={contentStyle}>
        {children}
      </div>

      {/* ===== 色差效果層 ===== */}
      {!reducedMotion && effects.chromaticOffset > 0 && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 z-[82] pointer-events-none"
            style={{
              background: `rgba(255, 0, 0, ${effects.chromaticOpacity})`,
              transform: `translateX(${effects.chromaticOffset + glitchState.chromatic}px)`,
              mixBlendMode: 'screen',
              willChange: 'transform',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 z-[82] pointer-events-none"
            style={{
              background: `rgba(0, 255, 255, ${effects.chromaticOpacity})`,
              transform: `translateX(-${effects.chromaticOffset + glitchState.chromatic}px)`,
              mixBlendMode: 'screen',
              willChange: 'transform',
            }}
          />
        </>
      )}

      {/* ===== RGB 邊條（左） ===== */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[6px] z-[80] pointer-events-none overflow-hidden"
      >
        <div
          style={{
            position: 'absolute',
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
            animation: reducedMotion ? 'none' : `vhs-rgb-scroll ${effects.rgbSpeed}s linear infinite`,
            willChange: 'transform',
          }}
        />
      </div>

      {/* ===== RGB 邊條（右） ===== */}
      <div
        aria-hidden
        className="absolute right-0 top-0 bottom-0 w-[6px] z-[80] pointer-events-none overflow-hidden"
      >
        <div
          style={{
            position: 'absolute',
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
            animation: reducedMotion ? 'none' : `vhs-rgb-scroll ${effects.rgbSpeed * 0.9}s linear infinite reverse`,
            willChange: 'transform',
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
            transparent ${effects.scanlineGap / 2}px,
            rgba(0, 0, 0, ${effects.scanlineOpacity}) ${effects.scanlineGap / 2}px,
            rgba(0, 0, 0, ${effects.scanlineOpacity}) ${effects.scanlineGap}px
          )`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* ===== 移動掃描線 ===== */}
      {!reducedMotion && (
        <div
          aria-hidden
          className="absolute left-0 right-0 h-[3px] z-[72] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            animation: `vhs-scanline-move ${effects.scanlineSpeed}s linear infinite`,
            willChange: 'transform',
          }}
        />
      )}

      {/* ===== 追蹤干擾線 ===== */}
      {!reducedMotion && phase !== 'stable' && (
        <div aria-hidden className="absolute inset-0 z-[73] pointer-events-none overflow-hidden">
          {Array.from({ length: effects.trackingLines }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${8 + (i / effects.trackingLines) * 84}%`,
                left: 0,
                right: 0,
                height: 1,
                background: `rgba(255, 255, 255, ${phase === 'incident' ? 0.15 : 0.08})`,
                animation: `vhs-tracking-x ${0.2 + i * 0.08}s ease-in-out infinite`,
                animationDelay: `${i * 0.04}s`,
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>
      )}

      {/* ===== 雜訊層 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[65] pointer-events-none"
        style={{
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${Math.floor(randomSeed * 100)}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: effects.noiseOpacity + glitchState.noise,
          animation: reducedMotion ? 'none' : `vhs-noise-shift ${effects.noiseSpeed}s steps(6) infinite`,
          willChange: 'transform',
        }}
      />

      {/* ===== 暈影效果 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[60] pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(0, 0, 0, ${effects.vignetteIntensity * 0.4}) 55%,
            rgba(0, 0, 0, ${effects.vignetteIntensity}) 100%
          )`,
        }}
      />

      {/* ===== 色彩校正層 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[55] pointer-events-none"
        style={{
          mixBlendMode: 'color',
          background: effects.colorTint,
        }}
      />

      {/* ===== 閃爍效果 ===== */}
      {glitchState.flicker > 0 && (
        <div
          aria-hidden
          className="absolute inset-0 z-[85] pointer-events-none"
          style={{ 
            background: `rgba(255, 255, 255, ${glitchState.flicker})`,
            willChange: 'opacity',
          }}
        />
      )}

      {/* ===== 事件效果：鬼影 ===== */}
      {phase === 'incident' && incidentType === 'ghost' && (
        <div
          aria-hidden
          className="absolute inset-0 z-[86] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(200, 255, 230, 0.08) 0%, transparent 50%)',
            animation: 'vhs-ghost-pulse 0.4s ease-out',
          }}
        />
      )}

      {/* ===== 事件效果：停電 ===== */}
      {phase === 'incident' && incidentType === 'blackout' && (
        <div
          aria-hidden
          className="absolute inset-0 z-[88] bg-black pointer-events-none"
          style={{ animation: 'vhs-blackout 0.5s ease-out' }}
        />
      )}

      {/* ===== 事件效果：色差爆發 ===== */}
      {phase === 'incident' && incidentType === 'chromatic' && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 z-[86] pointer-events-none"
            style={{
              background: 'rgba(255, 0, 0, 0.1)',
              transform: 'translateX(-8px)',
              mixBlendMode: 'screen',
              animation: 'vhs-chromatic-burst 0.3s ease-out',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 z-[86] pointer-events-none"
            style={{
              background: 'rgba(0, 255, 255, 0.1)',
              transform: 'translateX(8px)',
              mixBlendMode: 'screen',
              animation: 'vhs-chromatic-burst 0.3s ease-out',
            }}
          />
        </>
      )}

      {/* ===== 事件效果：靜電 ===== */}
      {phase === 'incident' && incidentType === 'static' && (
        <div
          aria-hidden
          className="absolute inset-0 z-[87] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.35,
            animation: 'vhs-noise-shift 0.04s steps(10) infinite',
          }}
        />
      )}

      {/* ===== 高強度警告邊框 ===== */}
      {intensity01 > 0.65 && (
        <div
          aria-hidden
          className="absolute inset-0 z-[50] pointer-events-none"
          style={{
            boxShadow: `inset 0 0 ${25 + (intensity01 - 0.65) * 80}px rgba(239, 68, 68, ${(intensity01 - 0.65) * 0.6})`,
            animation: reducedMotion ? 'none' : 'vhs-warning-pulse 1s ease-in-out infinite',
          }}
        />
      )}

      {/* ===== VHS 標籤 ===== */}
      <div
        aria-hidden
        className="absolute top-3 left-3 z-[90] pointer-events-none"
        style={{
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: 16,
          letterSpacing: '0.15em',
          fontFamily: "'VT323', monospace",
          textShadow: '2px 2px 0 rgba(0, 0, 0, 0.7)',
        }}
      >
        ⬤ VHS
      </div>

      {/* ===== 動畫定義 ===== */}
      <style>{`
        @keyframes vhs-rgb-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(18px); }
        }
        
        @keyframes vhs-scanline-move {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        
        @keyframes vhs-noise-shift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1.5%, 1.5%); }
          50% { transform: translate(1.5%, -1%); }
          75% { transform: translate(-1%, 1%); }
        }
        
        @keyframes vhs-tracking-x {
          0% { transform: translateX(-12%); opacity: 0; }
          50% { transform: translateX(12%); opacity: 1; }
          100% { transform: translateX(-12%); opacity: 0; }
        }
        
        @keyframes vhs-warning-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes vhs-ghost-pulse {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.03); }
        }
        
        @keyframes vhs-blackout {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes vhs-chromatic-burst {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
})

// ===== 簡化版 VHS Hook =====
export function useVHSEffect(phase: HauntPhase, intensity: number) {
  const [config, setConfig] = useState({
    glitchLevel: 'subtle' as const,
    colorGrade: 'green' as const,
  })

  useEffect(() => {
    // 根據 phase 自動調整效果
    if (phase === 'incident') {
      setConfig({ glitchLevel: 'intense', colorGrade: 'cold' })
    } else if (phase === 'warning') {
      setConfig({ glitchLevel: 'moderate', colorGrade: 'green' })
    } else {
      setConfig({ glitchLevel: 'subtle', colorGrade: 'green' })
    }
  }, [phase])

  return config
}

export default VHSEnhanced
