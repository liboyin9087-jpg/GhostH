/**
 * 《靈異連線》資源清單
 * Spectral Link - Props Asset Manifest
 * 
 * 所有道具、場景、Found Footage 圖片的路徑對照表
 */

export type PropsManifest = {
  items: Record<string, string>;
  foundFootage: Record<string, string>;
  scenes: Record<string, string>;
};

export const PROPS: PropsManifest = {
  // 道具物品（透明 PNG，用於 UI 顯示）
  items: {
    vhsTape: "/assets/props/items/vhs_tape.png",
    filmReel: "/assets/props/items/film_reel.png",
    ashPile: "/assets/props/items/ash_pile.png",
    mirrorShard: "/assets/props/items/mirror_shard.png",
    flashlight: "/assets/props/items/flashlight.png",
    documents: "/assets/props/items/documents.png",
    metalBox: "/assets/props/items/metal_box.png",
    wheelchair: "/assets/props/items/wheelchair.png",
    talisman: "/assets/props/items/talisman.png",
    patientFile: "/assets/props/items/patient_file.png",
  },

  // Found Footage（監視器回放畫面，JPG）
  foundFootage: {
    // 物品相關
    vhsTape: "/assets/props/found_footage/vhs_tape_ff.jpg",
    filmReel: "/assets/props/found_footage/film_reel_ff.jpg",
    ashPile: "/assets/props/found_footage/ash_pile_ff.jpg",
    mirrorShard: "/assets/props/found_footage/mirror_shard_ff.jpg",
    flashlight: "/assets/props/found_footage/flashlight_ff.jpg",
    documents: "/assets/props/found_footage/documents_ff.jpg",
    metalBox: "/assets/props/found_footage/metal_box_ff.jpg",
    wheelchair: "/assets/props/found_footage/wheelchair_ff.jpg",
    talismanBurnt: "/assets/props/found_footage/talisman_burnt_ff.jpg",
    patientFile: "/assets/props/found_footage/patient_file_ff.jpg",
    
    // 場景相關
    corridorGhost: "/assets/props/found_footage/corridor_ghost_ff.jpg",
    nurseStation: "/assets/props/found_footage/nurse_station_ff.jpg",
    morgue: "/assets/props/found_footage/morgue_ff.jpg",
    operatingRoom: "/assets/props/found_footage/operating_room_ff.jpg",
    xrayRoom: "/assets/props/found_footage/xray_room_ff.jpg",
    
    // 掃描結果相關
    emfSpike: "/assets/props/found_footage/emf_spike_ff.jpg",
    coldSpot: "/assets/props/found_footage/cold_spot_ff.jpg",
    whisper: "/assets/props/found_footage/whisper_ff.jpg",
    footsteps: "/assets/props/found_footage/footsteps_ff.jpg",
  },

  // 場景背景圖
  scenes: {
    corridorB1: "/images/scenes/scene01_corridor.png",
    nurseStation: "/images/scenes/scene02_nurse_station.png",
    morgue: "/images/scenes/scene05_morgue.png",
    xrayRoom: "/images/scenes/scene03_xray_room.png",
    operatingRoom: "/images/scenes/scene04_operating_room.png",
  },
};

// 掃描類型對應圖片 Key
export const SCAN_TYPE_TO_MEDIA: Record<string, keyof typeof PROPS.foundFootage> = {
  EMF_SPIKE: "emfSpike",
  COLD_SPOT: "coldSpot",
  WHISPER: "whisper",
  FOOTSTEPS: "footsteps",
};

// 掃描類型中文標籤
export const SCAN_TYPE_LABELS: Record<string, string> = {
  EMF_SPIKE: "EMF 異常飆升",
  COLD_SPOT: "低溫區域",
  WHISPER: "低語訊號",
  FOOTSTEPS: "腳步回音",
};

// 線索預設對應圖片
export const CLUE_DEFAULT_MEDIA: Record<string, keyof typeof PROPS.foundFootage> = {
  "血跡輪椅": "wheelchair",
  "護理長日誌": "documents",
  "燒焦的符咒": "talismanBurnt",
  "病患檔案": "patientFile",
  "值班表": "documents",
  "鑰匙盒": "metalBox",
  "冰櫃紀錄": "morgue",
  "鋼台刮痕": "morgue",
};
