/**
 * 《靈異連線》音效播放系統
 * Audio playback system for GhostH - Spectral Link
 */

import { useCallback, useEffect, useRef } from 'react'

interface AudioOptions {
  volume?: number
  loop?: boolean
  fadeIn?: number
  fadeOut?: number
}

interface AudioPaths {
  // 環境音
  ambient: {
    hospital_base: string
    corridor: string
    nurse: string
    morgue: string
  }
  // 循環音
  loops: {
    drip: string
    fluorescent: string
    fridge: string
    heartbeat: string
  }
  // UI 音效
  ui: {
    click: string
    drawer_open: string
    drawer_close: string
    scan_start: string
    scan_complete: string
    notification: string
  }
  // 護符音效
  talisman: {
    activate: string
    burn: string
    seal: string
  }
  // 靈異事件音效
  ghost: {
    whisper: string
    breath: string
    scream: string
    static: string
    wheelchair: string
    door: string
    footsteps: string
  }
  // VHS 效果音
  vhs: {
    tracking: string
    glitch: string
    rewind: string
  }
}

const AUDIO_PATHS: AudioPaths = {
  ambient: {
    hospital_base: '/audio/ambient/amb_hospital_base.mp3',
    corridor: '/audio/ambient/amb_corridor.mp3',
    nurse: '/audio/ambient/amb_nurse.mp3',
    morgue: '/audio/ambient/amb_morgue.mp3',
  },
  loops: {
    drip: '/audio/loops/loop_drip.mp3',
    fluorescent: '/audio/loops/loop_fluorescent.mp3',
    fridge: '/audio/loops/loop_fridge.mp3',
    heartbeat: '/audio/loops/loop_heartbeat.mp3',
  },
  ui: {
    click: '/audio/ui/ui_click.mp3',
    drawer_open: '/audio/ui/ui_drawer_open.mp3',
    drawer_close: '/audio/ui/ui_drawer_close.mp3',
    scan_start: '/audio/ui/ui_scan_start.mp3',
    scan_complete: '/audio/ui/ui_scan_complete.mp3',
    notification: '/audio/ui/ui_notification.mp3',
  },
  talisman: {
    activate: '/audio/talisman/talisman_activate.mp3',
    burn: '/audio/talisman/talisman_burn.mp3',
    seal: '/audio/talisman/talisman_seal.mp3',
  },
  ghost: {
    whisper: '/audio/ghost/ghost_whisper.mp3',
    breath: '/audio/ghost/ghost_breath.mp3',
    scream: '/audio/ghost/ghost_scream.mp3',
    static: '/audio/ghost/static_burst.mp3',
    wheelchair: '/audio/ghost/wheelchair_roll.mp3',
    door: '/audio/ghost/door_creak.mp3',
    footsteps: '/audio/ghost/footsteps_distant.mp3',
  },
  vhs: {
    tracking: '/audio/vhs/vhs_tracking.mp3',
    glitch: '/audio/vhs/vhs_glitch.mp3',
    rewind: '/audio/vhs/vhs_rewind.mp3',
  },
}

export function useAudio() {
  // 音效緩存
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map())
  // 當前環境音
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  // 當前循環音
  const loopRef = useRef<HTMLAudioElement | null>(null)
  // 是否靜音
  const mutedRef = useRef(false)
  // 主音量
  const masterVolumeRef = useRef(0.7)

  /**
   * 播放單次音效
   */
  const play = useCallback((src: string, options: AudioOptions = {}): HTMLAudioElement | null => {
    if (mutedRef.current) return null

    const { volume = 0.5, loop = false, fadeIn = 0 } = options
    const actualVolume = volume * masterVolumeRef.current

    let audio = audioCache.current.get(src)
    
    if (!audio) {
      audio = new Audio(src)
      audio.preload = 'auto'
      audioCache.current.set(src, audio)
    }

    // 如果正在播放，克隆一個新的實例
    if (!audio.paused && !loop) {
      const clone = audio.cloneNode() as HTMLAudioElement
      clone.volume = fadeIn > 0 ? 0 : actualVolume
      clone.play().catch(console.warn)
      
      if (fadeIn > 0) {
        fadeAudioIn(clone, actualVolume, fadeIn)
      }
      return clone
    }

    audio.volume = fadeIn > 0 ? 0 : actualVolume
    audio.loop = loop
    audio.currentTime = 0
    audio.play().catch(console.warn)

    if (fadeIn > 0) {
      fadeAudioIn(audio, actualVolume, fadeIn)
    }

    return audio
  }, [])

  /**
   * 淡入效果
   */
  const fadeAudioIn = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const steps = duration / 50
    const volumeStep = targetVolume / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        audio.volume = targetVolume
        clearInterval(interval)
      } else {
        audio.volume = Math.min(volumeStep * currentStep, targetVolume)
      }
    }, 50)
  }

  /**
   * 淡出效果
   */
  const fadeAudioOut = (audio: HTMLAudioElement, duration: number, onComplete?: () => void) => {
    const startVolume = audio.volume
    const steps = duration / 50
    const volumeStep = startVolume / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        audio.volume = 0
        audio.pause()
        clearInterval(interval)
        onComplete?.()
      } else {
        audio.volume = Math.max(startVolume - volumeStep * currentStep, 0)
      }
    }, 50)
  }

  /**
   * 播放環境音（自動循環，切換場景時淡入淡出）
   */
  const playAmbient = useCallback((sceneType: keyof typeof AUDIO_PATHS.ambient, volume = 0.3) => {
    const src = AUDIO_PATHS.ambient[sceneType]
    if (!src) return

    // 淡出當前環境音
    if (ambientRef.current) {
      fadeAudioOut(ambientRef.current, 800)
    }

    // 延遲後播放新環境音
    setTimeout(() => {
      ambientRef.current = play(src, { volume, loop: true, fadeIn: 1200 })
    }, 400)
  }, [play])

  /**
   * 停止環境音
   */
  const stopAmbient = useCallback((fadeOutDuration = 1000) => {
    if (ambientRef.current) {
      fadeAudioOut(ambientRef.current, fadeOutDuration, () => {
        ambientRef.current = null
      })
    }
  }, [])

  /**
   * 播放循環音效（如水滴聲、日光燈聲等）
   */
  const playLoop = useCallback((loopType: keyof typeof AUDIO_PATHS.loops, volume = 0.2) => {
    const src = AUDIO_PATHS.loops[loopType]
    if (!src) return

    if (loopRef.current) {
      fadeAudioOut(loopRef.current, 500)
    }

    setTimeout(() => {
      loopRef.current = play(src, { volume, loop: true, fadeIn: 800 })
    }, 250)
  }, [play])

  /**
   * 停止循環音效
   */
  const stopLoop = useCallback(() => {
    if (loopRef.current) {
      fadeAudioOut(loopRef.current, 500, () => {
        loopRef.current = null
      })
    }
  }, [])

  /**
   * 播放 UI 音效
   */
  const playUI = useCallback((type: keyof typeof AUDIO_PATHS.ui) => {
    const src = AUDIO_PATHS.ui[type]
    if (src) {
      play(src, { volume: 0.4 })
    }
  }, [play])

  /**
   * 播放護符音效
   */
  const playTalisman = useCallback((type: keyof typeof AUDIO_PATHS.talisman) => {
    const src = AUDIO_PATHS.talisman[type]
    if (src) {
      play(src, { volume: 0.7 })
    }
  }, [play])

  /**
   * 播放靈異事件音效
   */
  const playGhost = useCallback((type: keyof typeof AUDIO_PATHS.ghost) => {
    const src = AUDIO_PATHS.ghost[type]
    if (src) {
      // 靈異音效通常需要較大音量以增加驚嚇效果
      const volume = type === 'scream' ? 0.8 : 0.6
      play(src, { volume })
    }
  }, [play])

  /**
   * 播放 VHS 效果音
   */
  const playVHS = useCallback((type: keyof typeof AUDIO_PATHS.vhs) => {
    const src = AUDIO_PATHS.vhs[type]
    if (src) {
      play(src, { volume: 0.35 })
    }
  }, [play])

  /**
   * 設定主音量
   */
  const setMasterVolume = useCallback((volume: number) => {
    masterVolumeRef.current = Math.max(0, Math.min(1, volume))
    // 更新當前播放中的音效音量
    if (ambientRef.current) {
      ambientRef.current.volume = 0.3 * masterVolumeRef.current
    }
    if (loopRef.current) {
      loopRef.current.volume = 0.2 * masterVolumeRef.current
    }
  }, [])

  /**
   * 切換靜音
   */
  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current
    if (mutedRef.current) {
      if (ambientRef.current) ambientRef.current.volume = 0
      if (loopRef.current) loopRef.current.volume = 0
    } else {
      if (ambientRef.current) ambientRef.current.volume = 0.3 * masterVolumeRef.current
      if (loopRef.current) loopRef.current.volume = 0.2 * masterVolumeRef.current
    }
    return mutedRef.current
  }, [])

  /**
   * 預載入音效
   */
  const preload = useCallback((paths: string[]) => {
    paths.forEach(src => {
      if (!audioCache.current.has(src)) {
        const audio = new Audio()
        audio.preload = 'auto'
        audio.src = src
        audioCache.current.set(src, audio)
      }
    })
  }, [])

  /**
   * 預載入所有 UI 和常用音效
   */
  const preloadCommon = useCallback(() => {
    const commonPaths = [
      ...Object.values(AUDIO_PATHS.ui),
      ...Object.values(AUDIO_PATHS.talisman),
      AUDIO_PATHS.ghost.static,
      AUDIO_PATHS.vhs.glitch,
    ]
    preload(commonPaths)
  }, [preload])

  /**
   * 清理所有音效資源
   */
  useEffect(() => {
    return () => {
      // 停止所有音效
      if (ambientRef.current) {
        ambientRef.current.pause()
        ambientRef.current = null
      }
      if (loopRef.current) {
        loopRef.current.pause()
        loopRef.current = null
      }
      // 清理緩存
      audioCache.current.forEach(audio => {
        audio.pause()
        audio.src = ''
      })
      audioCache.current.clear()
    }
  }, [])

  return {
    // 通用播放
    play,
    // 環境音控制
    playAmbient,
    stopAmbient,
    // 循環音控制
    playLoop,
    stopLoop,
    // 分類播放
    playUI,
    playTalisman,
    playGhost,
    playVHS,
    // 音量控制
    setMasterVolume,
    toggleMute,
    // 預載入
    preload,
    preloadCommon,
    // 音效路徑（供外部使用）
    AUDIO_PATHS,
  }
}

export type { AudioOptions, AudioPaths }
