/**
 * 監視器回放系統
 * Playback System for Spectral Link
 * 
 * 處理 CCTV 回放功能：
 * - 凍結畫面效果
 * - 進度條載入
 * - Found Footage 顯示
 * - 自動產生線索
 */

import { useState, useCallback, useRef } from "react";
import { PROPS } from "../assets/props";

export type PlaybackPhase = "idle" | "freezing" | "loading" | "showing" | "error";

export interface PlaybackState {
  phase: PlaybackPhase;
  progress: number;       // 載入進度 0~100
  src: string;            // 當前顯示的圖片路徑
  caption: string;        // 圖片說明文字
  timestamp: string;      // 回放時間戳
  error?: string;         // 錯誤訊息
}

export interface FootageItem {
  src: string;
  caption: string;
  clueTitle?: string;     // 對應線索標題
  mediaKey?: string;      // Props key
}

export interface PlaybackSystemOptions {
  footagePool: FootageItem[];
  freezeDuration?: number;    // 凍結時間（毫秒）
  loadingDuration?: number;   // 載入時間（毫秒）
}

export interface PlaybackSystemReturn {
  state: PlaybackState;
  start: () => Promise<FootageItem | null>;
  close: () => void;
  isActive: boolean;
}

// 預設回放素材池
export const DEFAULT_FOOTAGE_POOL: FootageItem[] = [
  {
    src: PROPS.foundFootage.documents,
    caption: "回放 02:33:15 - 桌面文件被翻動，但現場無人。紙張自動散落後靜止。",
    clueTitle: "文件異動記錄",
    mediaKey: "documents",
  },
  {
    src: PROPS.foundFootage.metalBox,
    caption: "回放 02:45:22 - 鐵盒縫隙內出現短暫反光。開啟瞬間，畫面嚴重干擾。",
    clueTitle: "鐵盒異常記錄",
    mediaKey: "metalBox",
  },
  {
    src: PROPS.foundFootage.mirrorShard,
    caption: "回放 03:12:08 - 鏡片倒影與實際視角不同步。倒影中似有人影晃動。",
    clueTitle: "鏡面異象",
    mediaKey: "mirrorShard",
  },
  {
    src: PROPS.foundFootage.wheelchair,
    caption: "回放 03:28:41 - 輪椅無人推動下自行移動約 2 公尺後停止。",
    clueTitle: "輪椅自動記錄",
    mediaKey: "wheelchair",
  },
  {
    src: PROPS.foundFootage.corridorGhost,
    caption: "回放 03:33:33 - 走廊盡頭出現白色人影，持續 0.8 秒後消失。",
    clueTitle: "走廊白影",
    mediaKey: "corridorGhost",
  },
  {
    src: PROPS.foundFootage.talismanBurnt,
    caption: "回放 02:58:17 - 符咒自燃。燃燒過程中，周圍溫度驟降 8°C。",
    clueTitle: "符咒自燃記錄",
    mediaKey: "talismanBurnt",
  },
  {
    src: PROPS.foundFootage.flashlight,
    caption: "回放 03:05:44 - 手電筒自動開啟並照向角落。該角落掃描顯示 EMF 異常。",
    clueTitle: "手電筒異動",
    mediaKey: "flashlight",
  },
  {
    src: PROPS.foundFootage.nurseStation,
    caption: "回放 02:22:09 - 護理站電話鈴聲響起，但線路早已斷線 20 年。",
    clueTitle: "幽靈來電",
    mediaKey: "nurseStation",
  },
  {
    src: PROPS.foundFootage.morgue,
    caption: "回放 03:41:55 - 太平間冰櫃門自動開啟。內部空無一物，但有新鮮水漬。",
    clueTitle: "冰櫃開啟記錄",
    mediaKey: "morgue",
  },
  {
    src: PROPS.foundFootage.patientFile,
    caption: "回放 02:15:33 - 病患檔案自動翻頁至「林雅婷」。備註欄位墨水滲出。",
    clueTitle: "檔案異動",
    mediaKey: "patientFile",
  },
];

// 產生 VHS 風格時間戳
function generateVHSTimestamp(): string {
  const now = new Date();
  const baseYear = 1998;
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(2 + Math.floor(Math.random() * 3)).padStart(2, "0"); // 02-04
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  const second = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  
  return `${baseYear}/${month}/${day} ${hour}:${minute}:${second}`;
}

export function usePlaybackSystem(
  opts: PlaybackSystemOptions = { footagePool: DEFAULT_FOOTAGE_POOL }
): PlaybackSystemReturn {
  const { 
    footagePool = DEFAULT_FOOTAGE_POOL, 
    freezeDuration = 600, 
    loadingDuration = 2200 
  } = opts;

  const [state, setState] = useState<PlaybackState>({
    phase: "idle",
    progress: 0,
    src: "",
    caption: "",
    timestamp: "",
  });

  const abortRef = useRef(false);
  const usedIndices = useRef<Set<number>>(new Set());

  // 選擇未使用過的素材（避免連續重複）
  const pickFootage = useCallback((): FootageItem => {
    if (usedIndices.current.size >= footagePool.length) {
      usedIndices.current.clear(); // 全部用過就重置
    }

    let index: number;
    do {
      index = Math.floor(Math.random() * footagePool.length);
    } while (usedIndices.current.has(index) && usedIndices.current.size < footagePool.length);

    usedIndices.current.add(index);
    return footagePool[index];
  }, [footagePool]);

  const start = useCallback(async (): Promise<FootageItem | null> => {
    if (state.phase !== "idle") return null;
    
    abortRef.current = false;

    try {
      // Phase 1: 凍結畫面
      setState({
        phase: "freezing",
        progress: 0,
        src: "",
        caption: "畫面凍結中...",
        timestamp: "",
      });

      await new Promise((r) => setTimeout(r, freezeDuration));
      if (abortRef.current) throw new Error("aborted");

      // Phase 2: 載入進度
      const loadingSteps = 12;
      const stepDuration = loadingDuration / loadingSteps;

      for (let i = 0; i <= loadingSteps; i++) {
        if (abortRef.current) throw new Error("aborted");
        
        const progress = Math.min(100, Math.round((i / loadingSteps) * 100));
        setState((prev) => ({
          ...prev,
          phase: "loading",
          progress,
          caption: progress < 50 ? "讀取監視器記錄..." : "解碼影像數據...",
        }));

        await new Promise((r) => setTimeout(r, stepDuration));
      }

      if (abortRef.current) throw new Error("aborted");

      // Phase 3: 顯示結果
      const pick = pickFootage();
      const timestamp = generateVHSTimestamp();

      setState({
        phase: "showing",
        progress: 100,
        src: pick.src,
        caption: pick.caption,
        timestamp,
      });

      return pick;
    } catch (err) {
      if ((err as Error).message === "aborted") {
        setState({
          phase: "idle",
          progress: 0,
          src: "",
          caption: "",
          timestamp: "",
        });
        return null;
      }
      
      setState({
        phase: "error",
        progress: 0,
        src: "",
        caption: "",
        timestamp: "",
        error: "回放失敗：訊號中斷",
      });
      return null;
    }
  }, [state.phase, freezeDuration, loadingDuration, pickFootage]);

  const close = useCallback(() => {
    abortRef.current = true;
    setState({
      phase: "idle",
      progress: 0,
      src: "",
      caption: "",
      timestamp: "",
    });
  }, []);

  return {
    state,
    start,
    close,
    isActive: state.phase !== "idle",
  };
}

// 輔助函數：從回放結果產生線索
export function generateClueFromPlayback(footage: FootageItem, timestamp: string): {
  title: string;
  description: string;
  mediaKey: string;
} {
  return {
    title: footage.clueTitle || "回放異常記錄",
    description: `${footage.caption}\n\n記錄時間：${timestamp}`,
    mediaKey: footage.mediaKey || "documents",
  };
}
