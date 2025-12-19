/**
 * 場景過渡管理 Hook
 * Scene Transition Manager
 * 
 * 管理 2D 場景之間的 3D 走廊過渡
 */

import { useState, useCallback } from 'react'
import type { SceneId } from '../scenes'

export type TransitionState = 'idle' | 'transitioning' | 'complete'

export interface TransitionConfig {
  enabled: boolean // 是否啟用 3D 過渡
  fromScene: SceneId | null
  toScene: SceneId | null
  state: TransitionState
}

export function useSceneTransition() {
  const [transition, setTransition] = useState<TransitionConfig>({
    enabled: false,
    fromScene: null,
    toScene: null,
    state: 'idle'
  })

  /**
   * 開始場景過渡
   */
  const startTransition = useCallback((from: SceneId, to: SceneId, use3D: boolean = true) => {
    setTransition({
      enabled: use3D,
      fromScene: from,
      toScene: to,
      state: 'transitioning'
    })
  }, [])

  /**
   * 完成過渡
   */
  const completeTransition = useCallback(() => {
    setTransition(prev => ({
      ...prev,
      state: 'complete'
    }))
  }, [])

  /**
   * 重置過渡狀態
   */
  const resetTransition = useCallback(() => {
    setTransition({
      enabled: false,
      fromScene: null,
      toScene: null,
      state: 'idle'
    })
  }, [])

  /**
   * 檢查是否應該顯示 3D 過渡
   */
  const shouldShow3DTransition = useCallback(() => {
    return transition.enabled && 
           transition.state === 'transitioning' &&
           transition.fromScene !== null &&
           transition.toScene !== null
  }, [transition])

  return {
    transition,
    startTransition,
    completeTransition,
    resetTransition,
    shouldShow3DTransition,
    isTransitioning: transition.state === 'transitioning'
  }
}

/**
 * 判斷兩個場景之間是否應該使用 3D 過渡
 */
export function shouldUse3DTransition(from: SceneId, to: SceneId): boolean {
  // 標題場景不使用 3D 過渡
  if (from === 'title_archive' || to === 'title_archive') {
    return false
  }

  // 其他場景之間都使用 3D 過渡
  return true
}

/**
 * 獲取場景之間的過渡描述
 */
export function getTransitionDescription(from: SceneId, to: SceneId): string {
  const descriptions: Record<string, string> = {
    'corridor_b1->nurse_station': '前往護理站',
    'nurse_station->morgue': '前往太平間',
    'morgue->corridor_b1': '返回走廊',
    'nurse_station->corridor_b1': '返回走廊',
    'corridor_b1->morgue': '前往太平間',
    'morgue->nurse_station': '前往護理站'
  }

  const key = `${from}->${to}`
  return descriptions[key] || `前往 ${to}`
}
