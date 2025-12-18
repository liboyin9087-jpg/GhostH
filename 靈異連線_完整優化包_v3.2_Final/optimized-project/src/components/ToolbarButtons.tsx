/**
 * 增強版工具列按鈕元件
 * Enhanced Toolbar Buttons for Spectral Link
 */

import React, { memo, useState, useCallback } from 'react'
import { useHaptics } from '../hooks/useHaptics'

// ===== 按鈕圖片路徑 =====
const BUTTON_IMAGES: Record<string, string> = {
  flashlight: '/images/ui/buttons/btn_flashlight.png',
  scan: '/images/ui/buttons/btn_scan.png',
  playback: '/images/ui/buttons/btn_playback.png',
  talisman: '/images/ui/buttons/btn_talisman.png',
}

// ===== 工具按鈕類型 =====
type ButtonVariant = 'default' | 'scan' | 'talisman' | 'danger' | 'move' | 'playback'

interface ToolButtonProps {
  icon: string
  label: string
  sublabel: string
  active?: boolean
  disabled?: boolean
  loading?: boolean
  variant?: ButtonVariant
  badge?: number
  /** 使用圖片替代 emoji，自動根據 variant 選擇 */
  useImage?: boolean
  onClick?: () => void
  onLongPress?: () => void
}

// ===== 增強版工具按鈕 =====
export const ToolButton = memo(function ToolButton({
  icon,
  label,
  sublabel,
  active = false,
  disabled = false,
  loading = false,
  variant = 'default',
  badge,
  useImage = false,
  onClick,
  onLongPress,
}: ToolButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)
  const haptics = useHaptics()
  const longPressTimer = React.useRef<number | null>(null)

  // 變體樣式配置
  const variants: Record<ButtonVariant, { borderActive: string; bgActive: string; glow: string }> = {
    default: {
      borderActive: 'rgba(16, 185, 129, 0.65)',
      bgActive: 'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
    scan: {
      borderActive: 'rgba(6, 182, 212, 0.65)',
      bgActive: 'linear-gradient(180deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
    playback: {
      borderActive: 'rgba(168, 85, 247, 0.65)',
      bgActive: 'linear-gradient(180deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
      glow: 'rgba(168, 85, 247, 0.3)',
    },
    talisman: {
      borderActive: 'rgba(245, 158, 11, 0.65)',
      bgActive: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
      glow: 'rgba(245, 158, 11, 0.3)',
    },
    danger: {
      borderActive: 'rgba(239, 68, 68, 0.65)',
      bgActive: 'linear-gradient(180deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
      glow: 'rgba(239, 68, 68, 0.3)',
    },
    move: {
      borderActive: 'rgba(168, 85, 247, 0.65)',
      bgActive: 'linear-gradient(180deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
      glow: 'rgba(168, 85, 247, 0.3)',
    },
  }

  const v = variants[variant]

  // 處理點擊
  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || loading) return
    
    // 波紋效果位置
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const x = 'clientX' in e ? e.clientX - rect.left : rect.width / 2
    const y = 'clientY' in e ? e.clientY - rect.top : rect.height / 2
    setRipple({ x, y })
    setTimeout(() => setRipple(null), 400)
    
    haptics.click()
    onClick?.()
  }, [disabled, loading, haptics, onClick])

  // 長按處理
  const handlePressStart = useCallback(() => {
    if (disabled || !onLongPress) return
    longPressTimer.current = window.setTimeout(() => {
      haptics.success()
      onLongPress()
    }, 600)
    setIsPressed(true)
  }, [disabled, onLongPress, haptics])

  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setIsPressed(false)
  }, [])

  return (
    <button
      onClick={handleClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      disabled={disabled}
      aria-pressed={active}
      aria-label={`${label} ${sublabel}`}
      className={`btn ${variant !== 'default' ? `btn--${variant}` : ''}`}
      style={{
        borderColor: active ? v.borderActive : undefined,
        background: active ? v.bgActive : undefined,
        boxShadow: active ? `0 0 0 1px ${v.glow}, 0 4px 20px ${v.glow}` : undefined,
        transform: isPressed ? 'scale(0.95)' : undefined,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {/* 波紋效果 */}
      {ripple && (
        <span
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 100,
            height: 100,
            marginLeft: -50,
            marginTop: -50,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${v.glow} 0%, transparent 70%)`,
            animation: 'ripple 0.4s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 圖標 */}
      <span 
        className="btn__icon"
        style={{
          animation: active && !loading ? 'breathe 2s ease-in-out infinite' : undefined,
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? '⏳' : useImage && BUTTON_IMAGES[variant] ? (
          <img 
            src={BUTTON_IMAGES[variant]} 
            alt={label}
            style={{ 
              width: 28, 
              height: 28, 
              objectFit: 'contain',
              filter: disabled ? 'grayscale(1)' : undefined,
            }}
            draggable={false}
          />
        ) : icon}
      </span>
      
      {/* 標籤 */}
      <span className="small" style={{ color: active ? '#fff' : 'rgba(212, 212, 216, 0.9)' }}>
        {label}
      </span>
      <span className="tiny" style={{ color: 'rgba(161, 161, 170, 0.7)' }}>
        {sublabel}
      </span>

      {/* 啟用指示燈 */}
      {active && (
        <span className="btn__indicator">
          <span />
        </span>
      )}

      {/* 徽章 */}
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5px',
            border: '2px solid #000',
            animation: 'heartbeat 1s ease-in-out infinite',
          }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {/* 載入中掃描線 */}
      {loading && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${v.glow}, transparent)`,
              animation: 'scanline-move 1.5s linear infinite',
            }}
          />
        </span>
      )}

      {/* 禁用遮罩 */}
      {disabled && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />
      )}
    </button>
  )
})

// ===== 工具列容器 =====
interface ToolbarProps {
  children: React.ReactNode
  className?: string
}

export const Toolbar = memo(function Toolbar({ children, className = '' }: ToolbarProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
      }}
    >
      {children}
    </div>
  )
})

// ===== 靈力進度條 =====
interface SpiritBarProps {
  value: number  // 0-100
  className?: string
}

export const SpiritBar = memo(function SpiritBar({ value, className = '' }: SpiritBarProps) {
  const isLow = value < 30
  const isDanger = value < 15

  return (
    <div className={className} style={{ padding: '0 6px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="tiny" style={{ color: 'rgba(168, 162, 158, 0.9)' }}>
          靈力 SPIRIT
        </span>
        <span 
          className="tiny" 
          style={{ 
            color: isDanger ? 'rgba(239, 68, 68, 0.9)' : isLow ? 'rgba(234, 179, 8, 0.9)' : 'rgba(231, 229, 228, 0.9)',
            animation: isDanger ? 'sensor-blink 0.5s ease-in-out infinite' : undefined,
          }}
        >
          {Math.round(value)}%
        </span>
      </div>
      <div className={`progress-bar ${isDanger ? 'progress-bar--danger' : 'progress-bar--spirit'}`}>
        <div 
          className="progress-bar__fill"
          style={{ 
            width: `${value}%`,
            background: isDanger 
              ? 'linear-gradient(90deg, rgba(185, 28, 28, 0.95), rgba(239, 68, 68, 0.95))'
              : 'linear-gradient(90deg, rgba(180, 83, 9, 0.95), rgba(245, 158, 11, 0.95))',
          }}
        />
      </div>
    </div>
  )
})
