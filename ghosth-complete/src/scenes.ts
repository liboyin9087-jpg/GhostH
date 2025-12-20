// 《靈異連線》場景定義 - 擴展版本，包含標題場景
export type SceneId = 'title_archive' | 'corridor_b1' | 'nurse_station' | 'morgue'

export interface SceneConfig {
  id: SceneId
  src: string
  label: string
  cameraId: string
  bgAudio?: string
  ambientLoop?: string
  isTitle?: boolean  // 是否為標題/檔案場景
}

export const SCENES: Record<SceneId, SceneConfig> = {
  title_archive: {
    id: 'title_archive',
    src: '/images/scenes/scene00_title.png',
    label: '仁心精神病院 - 1987年12月13日 封鎖檔案',
    cameraId: 'ARCHIVE-001',
    isTitle: true,
  },
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

// 遊戲場景順序（不含標題場景）
export const SCENE_ORDER: SceneId[] = ['corridor_b1', 'nurse_station', 'morgue']

// 完整場景順序（含標題場景）
export const FULL_SCENE_ORDER: SceneId[] = ['title_archive', 'corridor_b1', 'nurse_station', 'morgue']
