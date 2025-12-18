// 《靈異連線》場景定義
export type SceneId = 'corridor_b1' | 'nurse_station' | 'morgue'

export interface SceneConfig {
  id: SceneId
  src: string
  label: string
  cameraId: string
  bgAudio?: string
  ambientLoop?: string
}

export const SCENES: Record<SceneId, SceneConfig> = {
  corridor_b1: {
    id: 'corridor_b1',
    src: '/images/scenes/scene01_corridor.png',
    label: '杏林醫院 B1F - 舊病房走廊',
    cameraId: 'CAM-B1-01',
    bgAudio: '/audio/ambient/amb_corridor.mp3',
    ambientLoop: '/audio/loops/loop_drip.mp3',
  },
  nurse_station: {
    id: 'nurse_station',
    src: '/images/scenes/scene02_nurse_station.png',
    label: '杏林醫院 1F - 護理站',
    cameraId: 'CAM-1F-NS',
    bgAudio: '/audio/ambient/amb_nurse.mp3',
    ambientLoop: '/audio/loops/loop_fluorescent.mp3',
  },
  morgue: {
    id: 'morgue',
    src: '/images/scenes/scene05_morgue.png',
    label: '杏林醫院 B2F - 太平間',
    cameraId: 'CAM-B2-MG',
    bgAudio: '/audio/ambient/amb_morgue.mp3',
    ambientLoop: '/audio/loops/loop_fridge.mp3',
  },
}

export const SCENE_ORDER: SceneId[] = ['corridor_b1', 'nurse_station', 'morgue']
