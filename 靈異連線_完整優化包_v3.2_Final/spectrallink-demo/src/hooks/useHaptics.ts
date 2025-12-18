/**
 * 觸覺回饋 Hook
 * Haptic Feedback System for Spectral Link
 * 
 * 提供行動裝置震動回饋
 */

import { useCallback, useRef } from 'react'

interface HapticPatterns {
  tap: () => void           // 輕觸
  click: () => void         // 點擊
  success: () => void       // 成功
  warning: () => void       // 警告
  error: () => void         // 錯誤
  scare: () => void         // 驚嚇
  heartbeat: () => void     // 心跳
  ghostNear: () => void     // 鬼魂接近
  talismanActivate: () => void  // 護符啟動
  talismanSeal: () => void     // 護符封印
  sceneChange: () => void      // 場景切換
}

export function useHaptics(): HapticPatterns {
  const lastVibration = useRef<number>(0)
  const minInterval = 50 // 最小震動間隔（毫秒）

  // 基礎震動函數
  const vibrate = useCallback((pattern: number | number[]) => {
    const now = Date.now()
    if (now - lastVibration.current < minInterval) return
    
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
        lastVibration.current = now
      } catch (e) {
        // 震動 API 不可用
      }
    }
  }, [])

  // 停止震動
  const stop = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(0)
    }
  }, [])

  return {
    // 輕觸 - 非常短促的震動
    tap: useCallback(() => vibrate(8), [vibrate]),
    
    // 點擊 - 標準按鈕點擊
    click: useCallback(() => vibrate(15), [vibrate]),
    
    // 成功 - 兩次短震動
    success: useCallback(() => vibrate([20, 60, 20]), [vibrate]),
    
    // 警告 - 中等強度，間隔重複
    warning: useCallback(() => vibrate([40, 40, 40, 40, 80]), [vibrate]),
    
    // 錯誤 - 強烈單次震動
    error: useCallback(() => vibrate(100), [vibrate]),
    
    // 驚嚇 - Jump Scare 用，強烈漸強
    scare: useCallback(() => vibrate([50, 30, 100, 30, 150, 30, 200]), [vibrate]),
    
    // 心跳 - 模擬心臟跳動 lub-dub
    heartbeat: useCallback(() => vibrate([60, 80, 50, 400]), [vibrate]),
    
    // 鬼魂接近 - 不規則震動模式
    ghostNear: useCallback(() => vibrate([20, 50, 40, 100, 20, 200, 60, 80, 30]), [vibrate]),
    
    // 護符啟動 - 漸強的能量感
    talismanActivate: useCallback(() => vibrate([30, 50, 50, 50, 80, 50, 120]), [vibrate]),
    
    // 護符封印 - 強烈的釋放感
    talismanSeal: useCallback(() => vibrate([100, 30, 150, 30, 200, 100, 50]), [vibrate]),
    
    // 場景切換 - 短促過渡感
    sceneChange: useCallback(() => vibrate([30, 80, 50]), [vibrate]),
  }
}

// 檢測裝置是否支援震動
export function supportsVibration(): boolean {
  return 'vibrate' in navigator
}

// 心跳循環（用於高恐懼狀態）
export function useHeartbeatLoop(enabled: boolean, bpm: number = 80) {
  const intervalRef = useRef<number | null>(null)
  const haptics = useHaptics()

  const start = useCallback(() => {
    if (intervalRef.current) return
    
    const interval = (60 / bpm) * 1000 // 根據 BPM 計算間隔
    intervalRef.current = window.setInterval(() => {
      haptics.heartbeat()
    }, interval)
  }, [bpm, haptics])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 根據 enabled 狀態自動控制
  if (enabled && !intervalRef.current) {
    start()
  } else if (!enabled && intervalRef.current) {
    stop()
  }

  return { start, stop }
}
