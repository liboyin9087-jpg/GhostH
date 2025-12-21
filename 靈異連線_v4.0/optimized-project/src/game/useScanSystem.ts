/**
 * 掃描系統
 * Scan System for Spectral Link
 * 
 * 處理玩家掃描操作：
 * - 產生隨機異常結果
 * - 回傳中文標籤
 * - 對應 Found Footage 圖片 Key
 */

import { useMemo, useState, useCallback } from "react";
import { SCAN_TYPE_TO_MEDIA, SCAN_TYPE_LABELS } from "../assets/props";

export type ScanResultType = "EMF_SPIKE" | "COLD_SPOT" | "WHISPER" | "FOOTSTEPS";
export type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export interface ScanResult {
  id: string;
  type: ScanResultType;
  distM: number;          // 距離（公尺）
  dir: Direction;         // 方向
  confidence: number;     // 可信度 0~1
  createdAt: number;      // 建立時間戳
  mediaKey: string;       // 對應的 Found Footage Key
  label: string;          // 中文標籤
}

const DIRECTIONS: Direction[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const SCAN_TYPES: ScanResultType[] = ["EMF_SPIKE", "COLD_SPOT", "WHISPER", "FOOTSTEPS"];

// 方向中文對照
const DIR_LABELS: Record<Direction, string> = {
  N: "北",
  NE: "東北",
  E: "東",
  SE: "東南",
  S: "南",
  SW: "西南",
  W: "西",
  NW: "西北",
};

export interface ScanSystemReturn {
  lastResult: ScanResult | null;
  resultHistory: ScanResult[];
  isScanning: boolean;
  runScan: () => Promise<ScanResult>;
  clearResult: () => void;
  getDirectionLabel: (dir: Direction) => string;
}

export function useScanSystem(): ScanSystemReturn {
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [resultHistory, setResultHistory] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const runScan = useCallback(async (): Promise<ScanResult> => {
    setIsScanning(true);

    // 模擬掃描延遲（增加緊張感）
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const type = SCAN_TYPES[Math.floor(Math.random() * SCAN_TYPES.length)];
    
    const result: ScanResult = {
      id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      distM: Number((1.5 + Math.random() * 8.5).toFixed(1)),
      dir: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
      confidence: Number((0.55 + Math.random() * 0.40).toFixed(2)),
      createdAt: Date.now(),
      mediaKey: SCAN_TYPE_TO_MEDIA[type] || "emfSpike",
      label: SCAN_TYPE_LABELS[type] || "未知異常",
    };

    setLastResult(result);
    setResultHistory((prev) => [result, ...prev].slice(0, 20)); // 保留最近 20 筆
    setIsScanning(false);

    return result;
  }, []);

  const clearResult = useCallback(() => {
    setLastResult(null);
  }, []);

  const getDirectionLabel = useCallback((dir: Direction): string => {
    return DIR_LABELS[dir] || dir;
  }, []);

  return {
    lastResult,
    resultHistory,
    isScanning,
    runScan,
    clearResult,
    getDirectionLabel,
  };
}

// 輔助函數：根據掃描結果產生線索描述
export function generateClueFromScan(result: ScanResult): {
  title: string;
  description: string;
  mediaKey: string;
} {
  const dirLabel = DIR_LABELS[result.dir];
  const confidencePercent = Math.round(result.confidence * 100);

  const descriptions: Record<ScanResultType, string[]> = {
    EMF_SPIKE: [
      `偵測到強烈電磁波動，${dirLabel}方約 ${result.distM}m 處有異常能量源。`,
      `電磁場指數異常飆升！${dirLabel}方向 ${result.distM}m，可能有靈體活動。`,
      `警告：EMF 讀數超標，${dirLabel}方 ${result.distM}m 處偵測到不明能量反應。`,
    ],
    COLD_SPOT: [
      `溫度驟降！${dirLabel}方 ${result.distM}m 處出現異常低溫區域。`,
      `偵測到冷點：${dirLabel}方向約 ${result.distM}m，溫差達 12°C。`,
      `環境溫度異常，${dirLabel}方 ${result.distM}m 處疑似靈體經過痕跡。`,
    ],
    WHISPER: [
      `捕捉到微弱語音訊號，來源：${dirLabel}方約 ${result.distM}m。`,
      `低頻音波偵測！${dirLabel}方向 ${result.distM}m，疑似人聲耳語。`,
      `警告：偵測到非人類語音，${dirLabel}方 ${result.distM}m，內容無法辨識。`,
    ],
    FOOTSTEPS: [
      `偵測到腳步聲迴音，${dirLabel}方約 ${result.distM}m 處。`,
      `振動感測器觸發！${dirLabel}方向 ${result.distM}m，有移動痕跡。`,
      `警告：偵測到不明步伐，${dirLabel}方 ${result.distM}m，但視野內無人影。`,
    ],
  };

  const options = descriptions[result.type];
  const description = options[Math.floor(Math.random() * options.length)];

  return {
    title: `掃描結果：${result.label}`,
    description: `${description}（可信度 ${confidencePercent}%）`,
    mediaKey: result.mediaKey,
  };
}
