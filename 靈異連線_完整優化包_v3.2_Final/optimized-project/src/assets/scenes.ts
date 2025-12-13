export type SceneKey =
  | 'corridor'
  | 'talisman'
  | 'survivor'
  | 'cctv'
  | 'morgue';

export type SceneAsset = {
  key: SceneKey;
  label: string;
  // public/ 路徑（不需要 import）
  webp: string;
  jpg: string;
};

export const SCENES: Record<SceneKey, SceneAsset> = {
  corridor: {
    key: 'corridor',
    label: '走廊',
    webp: '/images/scene01_corridor.webp',
    jpg: '/images/scene01_corridor.jpg',
  },
  talisman: {
    key: 'talisman',
    label: '符咒',
    webp: '/images/scene02_talisman.webp',
    jpg: '/images/scene02_talisman.jpg',
  },
  survivor: {
    key: 'survivor',
    label: '倖存者',
    webp: '/images/scene03_survivor.webp',
    jpg: '/images/scene03_survivor.jpg',
  },
  cctv: {
    key: 'cctv',
    label: '監視器',
    webp: '/images/scene04_cctv.webp',
    jpg: '/images/scene04_cctv.jpg',
  },
  morgue: {
    key: 'morgue',
    label: '解剖室',
    webp: '/images/scene05_morgue.webp',
    jpg: '/images/scene05_morgue.jpg',
  },
};
