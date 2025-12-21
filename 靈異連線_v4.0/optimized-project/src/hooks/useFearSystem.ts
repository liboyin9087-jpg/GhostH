/**
 * 動態恐懼系統 Hook
 * Dynamic Fear System for Spectral Link
 * 
 * 根據遊戲狀態動態調整恐怖氛圍
 */

import { useEffect, useMemo, useState } from 'react'

interface FearFactors {
  signalStrength: number    // 0-100
  spiritPower: number       // 0-100
  systemStatus: 'stable' | 'unstable'
  currentScene?: string
  timePlayed?: number       // 遊玩時間（秒）
  ghostNearby?: boolean
  lowBattery?: boolean
}

interface FearState {
  fearLevel: number           // 0-100 恐懼等級
  vhsIntensity: number        // VHS 效果強度
  heartbeatBPM: number        // 心跳速率
  vignetteStrength: number    // 暈影強度
  noiseOpacity: number        // 雜訊透明度
  colorDesaturation: number   // 去飽和程度
  screenShakeIntensity: number // 畫面抖動強度
  temperature: number         // 環境溫度
  emfLevel: number           // EMF 等級 1-5
}

export function useFearSystem(factors: FearFactors): FearState {
  const [temperature, setTemperature] = useState(22)
  const [emfLevel, setEmfLevel] = useState(1)
  const [accumulatedFear, setAccumulatedFear] = useState(0)

  // 計算基礎恐懼等級
  const baseFear = useMemo(() => {
    let fear = 0
    
    // 訊號弱 = 更恐怖（佔 30%）
    fear += (100 - factors.signalStrength) * 0.3
    
    // 靈力低 = 更恐怖（佔 25%）
    fear += (100 - factors.spiritPower) * 0.25
    
    // 系統不穩定（佔 25%）
    if (factors.systemStatus === 'unstable') {
      fear += 25
    }
    
    // 鬼魂接近（佔 15%）
    if (factors.ghostNearby) {
      fear += 15
    }
    
    // 低電量（佔 5%）
    if (factors.lowBattery) {
      fear += 5
    }

    return Math.min(100, Math.max(0, fear))
  }, [factors])

  // 累積恐懼效果（長時間遊玩會增加）
  useEffect(() => {
    const interval = setInterval(() => {
      setAccumulatedFear(prev => {
        const increment = baseFear > 50 ? 0.5 : 0.1
        return Math.min(20, prev + increment) // 最多累積 20 點
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [baseFear])

  // 溫度模擬
  useEffect(() => {
    const targetTemp = 22 - (baseFear / 100) * 18 // 最低降到 4 度
    const interval = setInterval(() => {
      setTemperature(prev => {
        const diff = targetTemp - prev
        const noise = (Math.random() - 0.5) * 0.5
        return prev + diff * 0.08 + noise
      })
    }, 300)

    return () => clearInterval(interval)
  }, [baseFear])

  // EMF 模擬
  useEffect(() => {
    const interval = setInterval(() => {
      const baseEMF = factors.systemStatus === 'unstable' ? 3 : 1
      const fearBonus = (baseFear / 100) * 2
      const noise = (Math.random() - 0.5) * 1.5
      setEmfLevel(Math.min(5, Math.max(1, baseEMF + fearBonus + noise)))
    }, 200)

    return () => clearInterval(interval)
  }, [baseFear, factors.systemStatus])

  // 計算最終恐懼狀態
  const fearState = useMemo((): FearState => {
    const totalFear = Math.min(100, baseFear + accumulatedFear)
    const fearRatio = totalFear / 100

    return {
      fearLevel: totalFear,
      vhsIntensity: 0.3 + fearRatio * 0.7,
      heartbeatBPM: 60 + totalFear * 0.8,
      vignetteStrength: 0.25 + fearRatio * 0.45,
      noiseOpacity: 0.04 + fearRatio * 0.12,
      colorDesaturation: fearRatio * 0.3,
      screenShakeIntensity: totalFear > 70 ? (totalFear - 70) / 30 : 0,
      temperature,
      emfLevel: Math.round(emfLevel),
    }
  }, [baseFear, accumulatedFear, temperature, emfLevel])

  return fearState
}

// 恐懼等級描述
export function getFearDescription(level: number): string {
  if (level < 20) return '平靜'
  if (level < 40) return '警戒'
  if (level < 60) return '緊張'
  if (level < 80) return '恐懼'
  return '極度危險'
}

// 恐懼顏色
export function getFearColor(level: number): string {
  if (level < 30) return 'rgba(34, 197, 94, 0.9)'   // 綠色
  if (level < 50) return 'rgba(234, 179, 8, 0.9)'   // 黃色
  if (level < 70) return 'rgba(249, 115, 22, 0.9)'  // 橙色
  return 'rgba(239, 68, 68, 0.9)'                   // 紅色
}
