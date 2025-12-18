// 《靈異連線》場景事件腳本
import type { SceneId } from './scenes'

export interface SceneScript {
  danger: number           // 0-1，影響異常頻率與強度
  minAnomalyEvery: number  // 最小異常間隔（秒）
  maxAnomalyEvery: number  // 最大異常間隔（秒）
  objective: string        // 當前目標
  scanHint: string         // 掃描後顯示的提示
  exitHint: string         // 離場/下一步提示
  jumpscareChance: number  // 驚嚇事件機率 0-1
  ghostType: 'shadow' | 'figure' | 'face'  // 鬼影類型
}

export const SCENE_SCRIPTS: Record<SceneId, SceneScript> = {
  corridor_b1: {
    danger: 0.45,
    minAnomalyEvery: 10,
    maxAnomalyEvery: 22,
    objective: '追蹤輪椅血跡方向，找到護理長辦公室入口線索',
    scanHint: '⚠ 牆面殘留朱砂痕跡（封印失敗）— 符咒殘骸指向走廊盡頭',
    exitHint: '門禁磁條訊號：護理站方向 →',
    jumpscareChance: 0.15,
    ghostType: 'shadow',
  },
  nurse_station: {
    danger: 0.65,
    minAnomalyEvery: 8,
    maxAnomalyEvery: 18,
    objective: '找值班表與鑰匙盒，取得 B1 檔案室鑰匙',
    scanHint: '⚠ 紙張纖維干擾（像剛翻過）— 有人在找特定病歷',
    exitHint: '門縫低頻震動（往解剖室）↓',
    jumpscareChance: 0.25,
    ghostType: 'figure',
  },
  morgue: {
    danger: 0.85,
    minAnomalyEvery: 6,
    maxAnomalyEvery: 14,
    objective: '完成一次封印，帶走「倖存符」作為證據',
    scanHint: '⚠ 金屬反射出不應存在的輪廓 — 她就在這裡',
    exitHint: '封印後強制中斷連線（Demo End）',
    jumpscareChance: 0.4,
    ghostType: 'face',
  },
}

// 音效事件配置
export interface AudioEvent {
  id: string
  src: string
  volume: number
  loop: boolean
  fadeIn?: number
  fadeOut?: number
}

export const AUDIO_EVENTS: Record<string, AudioEvent> = {
  // 環境音
  amb_base: { id: 'amb_base', src: '/audio/amb_hospital_base.mp3', volume: 0.3, loop: true, fadeIn: 2000 },
  amb_corridor: { id: 'amb_corridor', src: '/audio/amb_corridor.mp3', volume: 0.25, loop: true, fadeIn: 1500 },
  amb_nurse: { id: 'amb_nurse', src: '/audio/amb_nurse.mp3', volume: 0.25, loop: true, fadeIn: 1500 },
  amb_morgue: { id: 'amb_morgue', src: '/audio/amb_morgue.mp3', volume: 0.35, loop: true, fadeIn: 1500 },
  
  // 循環音效
  loop_drip: { id: 'loop_drip', src: '/audio/loop_drip.mp3', volume: 0.15, loop: true },
  loop_fluorescent: { id: 'loop_fluorescent', src: '/audio/loop_fluorescent.mp3', volume: 0.12, loop: true },
  loop_fridge: { id: 'loop_fridge', src: '/audio/loop_fridge.mp3', volume: 0.2, loop: true },
  loop_heartbeat: { id: 'loop_heartbeat', src: '/audio/loop_heartbeat.mp3', volume: 0.4, loop: true },
  
  // UI 音效
  ui_click: { id: 'ui_click', src: '/audio/ui_click.mp3', volume: 0.5, loop: false },
  ui_drawer_open: { id: 'ui_drawer_open', src: '/audio/ui_drawer_open.mp3', volume: 0.4, loop: false },
  ui_drawer_close: { id: 'ui_drawer_close', src: '/audio/ui_drawer_close.mp3', volume: 0.35, loop: false },
  ui_scan_start: { id: 'ui_scan_start', src: '/audio/ui_scan_start.mp3', volume: 0.5, loop: false },
  ui_scan_complete: { id: 'ui_scan_complete', src: '/audio/ui_scan_complete.mp3', volume: 0.45, loop: false },
  
  // 護符音效
  talisman_activate: { id: 'talisman_activate', src: '/audio/talisman_activate.mp3', volume: 0.6, loop: false },
  talisman_burn: { id: 'talisman_burn', src: '/audio/talisman_burn.mp3', volume: 0.5, loop: false },
  talisman_seal: { id: 'talisman_seal', src: '/audio/talisman_seal.mp3', volume: 0.7, loop: false },
  
  // 靈異事件音效
  ghost_whisper: { id: 'ghost_whisper', src: '/audio/ghost_whisper.mp3', volume: 0.35, loop: false },
  ghost_breath: { id: 'ghost_breath', src: '/audio/ghost_breath.mp3', volume: 0.4, loop: false },
  ghost_scream: { id: 'ghost_scream', src: '/audio/ghost_scream.mp3', volume: 0.65, loop: false },
  static_burst: { id: 'static_burst', src: '/audio/static_burst.mp3', volume: 0.5, loop: false },
  wheelchair_roll: { id: 'wheelchair_roll', src: '/audio/wheelchair_roll.mp3', volume: 0.45, loop: false },
  door_creak: { id: 'door_creak', src: '/audio/door_creak.mp3', volume: 0.4, loop: false },
  footsteps_distant: { id: 'footsteps_distant', src: '/audio/footsteps_distant.mp3', volume: 0.3, loop: false },
  
  // VHS 效果音
  vhs_tracking: { id: 'vhs_tracking', src: '/audio/vhs_tracking.mp3', volume: 0.25, loop: false },
  vhs_glitch: { id: 'vhs_glitch', src: '/audio/vhs_glitch.mp3', volume: 0.35, loop: false },
  vhs_rewind: { id: 'vhs_rewind', src: '/audio/vhs_rewind.mp3', volume: 0.4, loop: false },
}
