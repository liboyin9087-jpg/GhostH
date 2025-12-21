import { useEffect, useState } from 'react'

/**
 * 偵測使用者是否偏好減少動態效果
 * 用於無障礙設計，讓對閃爍敏感的使用者可以停用動畫
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    
    // 兼容舊版瀏覽器
    if (mq.addEventListener) {
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      // @ts-ignore - 舊版 Safari 支援
      mq.addListener(handler)
      // @ts-ignore
      return () => mq.removeListener(handler)
    }
  }, [])

  return reduced
}
