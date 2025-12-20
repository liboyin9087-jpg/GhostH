/**
 * 感測器元件
 * Sensor Components for Spectral Link
 * 
 * 溫度感測器、EMF 感測器、威脅等級指示器
 */

import React, { useEffect, useState, memo } from 'react'

// ===== 溫度感測器 =====
interface TemperatureSensorProps {
  temperature: number
  className?: string
}

export const TemperatureSensor = memo(function TemperatureSensor({ 
  temperature, 
  className = '' 
}: TemperatureSensorProps) {
  const [displayTemp, setDisplayTemp] = useState(temperature)
  
  // 數字跳動效果
  useEffect(() => {
    const noise = (Math.random() - 0.5) * 0.3
    setDisplayTemp(temperature + noise)
  }, [temperature])

  const isAbnormal = temperature < 15
  const isDangerous = temperature < 8
  
  const getColor = () => {
    if (isDangerous) return 'rgba(6, 182, 212, 1)'
    if (isAbnormal) return 'rgba(34, 211, 238, 0.9)'
    return 'rgba(74, 222, 128, 0.8)'
  }

  return (
    <div className={`sensor-panel ${isDangerous ? 'sensor-panel--danger' : ''} ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="tiny" style={{ color: 'rgba(161, 161, 170, 0.8)' }}>TEMP</div>
          <div 
            className="text-lg font-mono"
            style={{ 
              color: getColor(),
              textShadow: isDangerous ? '0 0 10px rgba(6, 182, 212, 0.5)' : 'none',
            }}
          >
            {displayTemp.toFixed(1)}°C
          </div>
        </div>
        
        {/* 溫度圖示 */}
        <div className="relative">
          <svg width="24" height="40" viewBox="0 0 24 40">
            {/* 溫度計外框 */}
            <rect x="8" y="2" width="8" height="28" rx="4" fill="none" stroke="rgba(100,100,100,0.4)" strokeWidth="1.5"/>
            <circle cx="12" cy="34" r="5" fill="none" stroke="rgba(100,100,100,0.4)" strokeWidth="1.5"/>
            
            {/* 溫度填充 */}
            <rect 
              x="10" 
              y={30 - (temperature / 25) * 24} 
              width="4" 
              height={(temperature / 25) * 24 + 4}
              rx="2"
              fill={getColor()}
              style={{
                transition: 'all 0.5s ease',
                filter: isDangerous ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))' : 'none',
              }}
            />
            <circle cx="12" cy="34" r="3.5" fill={getColor()}/>
          </svg>
          
          {isDangerous && (
            <div 
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400"
              style={{ animation: 'pulse-ring 1s ease-out infinite' }}
            />
          )}
        </div>
      </div>
      
      {/* 異常警告 */}
      {isAbnormal && (
        <div 
          className="mt-1 text-xs"
          style={{ 
            color: isDangerous ? 'rgba(6, 182, 212, 0.9)' : 'rgba(234, 179, 8, 0.8)',
            animation: isDangerous ? 'sensor-blink 1s ease-in-out infinite' : 'none',
          }}
        >
          {isDangerous ? '⚠ 極度異常' : '⚡ 溫度下降'}
        </div>
      )}
    </div>
  )
})

// ===== EMF 感測器 =====
interface EMFMeterProps {
  level: number  // 1-5
  className?: string
}

export const EMFMeter = memo(function EMFMeter({ 
  level, 
  className = '' 
}: EMFMeterProps) {
  const roundedLevel = Math.round(Math.min(5, Math.max(1, level)))
  
  const colors = [
    'rgba(34, 197, 94, 0.9)',   // 1 - 綠色
    'rgba(132, 204, 22, 0.9)',  // 2 - 黃綠
    'rgba(234, 179, 8, 0.9)',   // 3 - 黃色
    'rgba(249, 115, 22, 0.9)',  // 4 - 橙色
    'rgba(239, 68, 68, 0.9)',   // 5 - 紅色
  ]
  
  const isDangerous = roundedLevel >= 4

  return (
    <div className={`sensor-panel ${isDangerous ? 'sensor-panel--danger' : ''} ${className}`}>
      <div className="tiny mb-1.5" style={{ color: 'rgba(161, 161, 170, 0.8)' }}>
        EMF
      </div>
      
      <div className="flex items-end gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="transition-all duration-150"
            style={{
              width: 8,
              height: 8 + i * 4,
              borderRadius: 2,
              backgroundColor: i <= roundedLevel ? colors[i - 1] : 'rgba(63, 63, 70, 0.6)',
              boxShadow: i <= roundedLevel ? `0 0 8px ${colors[i - 1]}50` : 'none',
              animation: i === roundedLevel && isDangerous ? 'heartbeat 0.5s ease-in-out infinite' : 'none',
            }}
          />
        ))}
      </div>
      
      <div 
        className="mt-1.5 text-xs font-mono"
        style={{ color: colors[roundedLevel - 1] }}
      >
        LV.{roundedLevel}
      </div>
      
      {isDangerous && (
        <div 
          className="mt-1 text-xs"
          style={{ 
            color: 'rgba(239, 68, 68, 0.9)',
            animation: 'sensor-blink 0.8s ease-in-out infinite',
          }}
        >
          ⚠ 高能量
        </div>
      )}
    </div>
  )
})

// ===== 威脅等級指示器 =====
interface ThreatLevelProps {
  level: 'low' | 'medium' | 'high' | 'critical'
  className?: string
}

export const ThreatLevel = memo(function ThreatLevel({ 
  level, 
  className = '' 
}: ThreatLevelProps) {
  const config = {
    low: { label: '安全', color: 'rgba(34, 197, 94, 0.9)', icon: '◇' },
    medium: { label: '警戒', color: 'rgba(234, 179, 8, 0.9)', icon: '◆' },
    high: { label: '危險', color: 'rgba(249, 115, 22, 0.9)', icon: '⬥' },
    critical: { label: '極危', color: 'rgba(239, 68, 68, 0.9)', icon: '⬥' },
  }
  
  const { label, color, icon } = config[level]
  const isCritical = level === 'critical'

  return (
    <div 
      className={`sensor-panel ${isCritical ? 'sensor-panel--danger' : ''} ${className}`}
      style={{
        borderColor: `${color}40`,
        background: `linear-gradient(135deg, ${color}15 0%, rgba(10,10,10,0.9) 100%)`,
      }}
    >
      <div className="tiny mb-1" style={{ color: 'rgba(161, 161, 170, 0.8)' }}>
        THREAT
      </div>
      
      <div className="flex items-center gap-2">
        <span 
          style={{ 
            color,
            fontSize: 18,
            animation: isCritical ? 'heartbeat 0.6s ease-in-out infinite' : 'none',
            filter: isCritical ? `drop-shadow(0 0 6px ${color})` : 'none',
          }}
        >
          {icon}
        </span>
        <span 
          className="text-sm font-bold text-chinese"
          style={{ color }}
        >
          {label}
        </span>
      </div>
    </div>
  )
})

// ===== 訊號強度指示器 =====
interface SignalMeterProps {
  strength: number  // 0-100
  className?: string
}

export const SignalMeter = memo(function SignalMeter({ 
  strength, 
  className = '' 
}: SignalMeterProps) {
  const bars = 5
  const filledBars = Math.ceil((strength / 100) * bars)
  
  const getColor = () => {
    if (strength > 60) return 'rgba(34, 197, 94, 0.9)'
    if (strength > 30) return 'rgba(234, 179, 8, 0.9)'
    return 'rgba(239, 68, 68, 0.9)'
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="tiny" style={{ color: 'rgba(161, 161, 170, 0.7)' }}>
        SIGNAL
      </span>
      <div className="flex items-end gap-0.5 h-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="transition-all duration-200"
            style={{
              width: 4,
              height: `${30 + i * 14}%`,
              borderRadius: 1,
              backgroundColor: i <= filledBars ? getColor() : 'rgba(63, 63, 70, 0.5)',
              boxShadow: i <= filledBars && strength < 30 ? `0 0 4px ${getColor()}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
})

// ===== 電池指示器 =====
interface BatteryIndicatorProps {
  level: number  // 0-100
  className?: string
}

export const BatteryIndicator = memo(function BatteryIndicator({ 
  level, 
  className = '' 
}: BatteryIndicatorProps) {
  const isLow = level < 20
  
  const getColor = () => {
    if (level > 50) return 'rgba(34, 197, 94, 0.9)'
    if (level > 20) return 'rgba(234, 179, 8, 0.9)'
    return 'rgba(239, 68, 68, 0.9)'
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div 
        className="relative"
        style={{
          width: 28,
          height: 14,
          border: `1.5px solid ${isLow ? getColor() : 'rgba(150, 150, 150, 0.5)'}`,
          borderRadius: 3,
          padding: 2,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${level}%`,
            backgroundColor: getColor(),
            borderRadius: 1,
            transition: 'width 0.3s ease',
            animation: isLow ? 'heartbeat 1s ease-in-out infinite' : 'none',
          }}
        />
        {/* 電池頭 */}
        <div
          style={{
            position: 'absolute',
            right: -4,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: 6,
            backgroundColor: 'rgba(150, 150, 150, 0.5)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>
      {isLow && (
        <span className="text-xs" style={{ color: getColor() }}>!</span>
      )}
    </div>
  )
})
