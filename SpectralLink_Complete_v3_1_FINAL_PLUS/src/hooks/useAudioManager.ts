import { useCallback, useEffect, useRef, useState } from 'react'
import { AUDIO_EVENTS, type AudioEvent } from '../scenesEvents'

interface AudioInstance {
  audio: HTMLAudioElement
  config: AudioEvent
}

/**
 * 音效管理系統 Hook
 * 負責管理環境音、UI 音效、靈異事件音效的播放與淡入淡出
 */
export function useAudioManager() {
  const instancesRef = useRef<Map<string, AudioInstance>>(new Map())
  const [muted, setMuted] = useState(false)
  const [masterVolume, setMasterVolume] = useState(0.7)

  // 預載音效
  const preload = useCallback((eventIds: string[]) => {
    eventIds.forEach(id => {
      const config = AUDIO_EVENTS[id]
      if (!config || instancesRef.current.has(id)) return

      const audio = new Audio(config.src)
      audio.preload = 'auto'
      audio.loop = config.loop
      audio.volume = 0

      instancesRef.current.set(id, { audio, config })
    })
  }, [])

  // 播放音效
  const play = useCallback((eventId: string, options?: { volume?: number; fadeIn?: number }) => {
    const config = AUDIO_EVENTS[eventId]
    if (!config) {
      console.warn(`[Audio] Unknown event: ${eventId}`)
      return
    }

    let instance = instancesRef.current.get(eventId)
    
    if (!instance) {
      const audio = new Audio(config.src)
      audio.loop = config.loop
      instance = { audio, config }
      instancesRef.current.set(eventId, instance)
    }

    const { audio } = instance
    const targetVolume = (options?.volume ?? config.volume) * masterVolume * (muted ? 0 : 1)
    const fadeIn = options?.fadeIn ?? config.fadeIn ?? 0

    if (fadeIn > 0) {
      audio.volume = 0
      audio.play().catch(() => {})
      
      const startTime = performance.now()
      const fade = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / fadeIn, 1)
        audio.volume = targetVolume * progress
        if (progress < 1) requestAnimationFrame(fade)
      }
      requestAnimationFrame(fade)
    } else {
      audio.volume = targetVolume
      audio.play().catch(() => {})
    }
  }, [masterVolume, muted])

  // 停止音效
  const stop = useCallback((eventId: string, options?: { fadeOut?: number }) => {
    const instance = instancesRef.current.get(eventId)
    if (!instance) return

    const { audio, config } = instance
    const fadeOut = options?.fadeOut ?? config.fadeOut ?? 0

    if (fadeOut > 0) {
      const startVolume = audio.volume
      const startTime = performance.now()
      
      const fade = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / fadeOut, 1)
        audio.volume = startVolume * (1 - progress)
        
        if (progress < 1) {
          requestAnimationFrame(fade)
        } else {
          audio.pause()
          audio.currentTime = 0
        }
      }
      requestAnimationFrame(fade)
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  // 停止所有音效
  const stopAll = useCallback((fadeOut = 500) => {
    instancesRef.current.forEach((_, id) => {
      stop(id, { fadeOut })
    })
  }, [stop])

  // 播放一次性音效（不追蹤實例）
  const playOnce = useCallback((eventId: string) => {
    const config = AUDIO_EVENTS[eventId]
    if (!config) return

    const audio = new Audio(config.src)
    audio.volume = config.volume * masterVolume * (muted ? 0 : 1)
    audio.play().catch(() => {})
  }, [masterVolume, muted])

  // 清理
  useEffect(() => {
    return () => {
      instancesRef.current.forEach(({ audio }) => {
        audio.pause()
        audio.src = ''
      })
      instancesRef.current.clear()
    }
  }, [])

  // 更新所有音量
  useEffect(() => {
    instancesRef.current.forEach(({ audio, config }) => {
      if (!audio.paused) {
        audio.volume = config.volume * masterVolume * (muted ? 0 : 1)
      }
    })
  }, [masterVolume, muted])

  return {
    preload,
    play,
    stop,
    stopAll,
    playOnce,
    muted,
    setMuted,
    masterVolume,
    setMasterVolume,
  }
}

/**
 * 簡易音效播放（用於 UI 互動）
 */
export function playUISound(soundId: 'click' | 'drawer_open' | 'drawer_close' | 'scan_start' | 'scan_complete' | 'notification') {
  const config = AUDIO_EVENTS[`ui_${soundId}`]
  if (!config) return

  const audio = new Audio(config.src)
  audio.volume = config.volume * 0.7
  audio.play().catch(() => {})
}
