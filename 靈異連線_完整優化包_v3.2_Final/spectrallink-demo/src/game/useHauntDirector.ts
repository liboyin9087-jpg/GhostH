/**
 * 恐怖節奏導演系統
 * Haunt Director - Three-Phase State Machine
 * 
 * 控制遊戲恐怖節奏：Stable → Warning → Incident
 * 根據玩家行為（掃描、回放、護符、閒置）調整壓力值，
 * 壓力值決定是否觸發靈異事件。
 */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

export type HauntPhase = "stable" | "warning" | "incident";
export type IncidentType = "ghost" | "blackout" | "chromatic" | "static" | "tracking";
export type ThreatLabel = "LOW" | "MED" | "HIGH" | "CRITICAL";
export type EventName = "scan" | "playback" | "talisman" | "drawer_open" | "idle" | "ghost_near" | "clue_found";

export interface DirectorState {
  phase: HauntPhase;
  intensity01: number;        // 0~1：VHS 效果強度
  incidentType: IncidentType; // 當前事件類型
  threatLabel: ThreatLabel;   // UI 威脅等級顯示
  pressure: number;           // 當前壓力值 (debug 用)
}

export interface HauntDirectorOptions {
  fearLevel: number;        // 0-100
  signalStrength: number;   // 0-100
  spiritPower: number;      // 0-100
  batteryLevel?: number;    // 0-100
}

// 事件對壓力的影響值
const PRESSURE_DELTAS: Record<EventName, number> = {
  scan: 12,
  playback: 18,
  drawer_open: 6,
  talisman: -32,
  idle: -5,
  ghost_near: 25,
  clue_found: 8,
};

// 事件類型權重（用於隨機選擇）
const INCIDENT_WEIGHTS = {
  stable: { ghost: 0.4, chromatic: 0.25, static: 0.2, tracking: 0.15, blackout: 0 },
  warning: { ghost: 0.35, chromatic: 0.25, static: 0.15, tracking: 0.15, blackout: 0.1 },
  critical: { ghost: 0.25, chromatic: 0.2, static: 0.15, tracking: 0.15, blackout: 0.25 },
};

export function useHauntDirector(opts: HauntDirectorOptions) {
  const { fearLevel, signalStrength, spiritPower, batteryLevel = 100 } = opts;

  const [phase, setPhase] = useState<HauntPhase>("stable");
  const [incidentType, setIncidentType] = useState<IncidentType>("ghost");

  // 壓力值：0~100，越高越容易觸發 incident
  const pressureRef = useRef(0);
  const lastActionRef = useRef(Date.now());
  const phaseRef = useRef<HauntPhase>(phase);
  
  // 同步 phase 到 ref（避免 closure 問題）
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // 調整壓力值
  const bumpPressure = useCallback((delta: number) => {
    pressureRef.current = Math.max(0, Math.min(100, pressureRef.current + delta));
  }, []);

  // 選擇事件類型（加權隨機）
  const pickIncidentType = useCallback((): IncidentType => {
    const p = pressureRef.current;
    const weights = p >= 70 
      ? INCIDENT_WEIGHTS.critical 
      : p >= 40 
        ? INCIDENT_WEIGHTS.warning 
        : INCIDENT_WEIGHTS.stable;
    
    const entries = Object.entries(weights) as [IncidentType, number][];
    const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (const [type, weight] of entries) {
      random -= weight;
      if (random <= 0) return type;
    }
    
    return "ghost"; // fallback
  }, []);

  // 玩家行為通知
  const notify = useCallback((event: EventName) => {
    lastActionRef.current = Date.now();
    const delta = PRESSURE_DELTAS[event] ?? 0;
    bumpPressure(delta);
    
    // 特殊處理：使用護符時立即回到 stable
    if (event === "talisman" && phaseRef.current !== "stable") {
      setPhase("stable");
    }
  }, [bumpPressure]);

  // 威脅等級標籤
  const threatLabel = useMemo<ThreatLabel>(() => {
    const p = pressureRef.current;
    if (p >= 80) return "CRITICAL";
    if (p >= 55) return "HIGH";
    if (p >= 30) return "MED";
    return "LOW";
  }, [phase]); // 依賴 phase 變化來重算

  // VHS 效果強度
  const intensity01 = useMemo(() => {
    // 基礎強度由 phase 決定
    const baseByPhase = {
      stable: 0.15,
      warning: 0.40,
      incident: 0.85,
    };
    const base = baseByPhase[phase];

    // 恐懼加成（最多 +0.30）
    const fearBoost = Math.min(0.30, (fearLevel / 100) * 0.30);
    
    // 壓力加成（最多 +0.25）
    const pressureBoost = Math.min(0.25, (pressureRef.current / 100) * 0.25);
    
    // 低訊號加成（最多 +0.15）
    const signalPenalty = signalStrength < 30 
      ? (30 - signalStrength) / 30 * 0.15 
      : 0;
    
    // 低電量加成（最多 +0.10）
    const batteryPenalty = batteryLevel < 20 
      ? (20 - batteryLevel) / 20 * 0.10 
      : 0;

    return Math.min(1, base + fearBoost + pressureBoost + signalPenalty + batteryPenalty);
  }, [phase, fearLevel, signalStrength, batteryLevel]);

  // 核心節奏：每秒執行導演決策
  useEffect(() => {
    const tick = setInterval(() => {
      const now = Date.now();
      const idleMs = now - lastActionRef.current;

      // 閒置會降壓（避免玩家被動挨打）
      if (idleMs > 10000) {
        bumpPressure(-3);
      }

      // 系統資源狀態影響壓力
      if (signalStrength < 25) bumpPressure(2);
      if (spiritPower < 20) bumpPressure(2);
      if (batteryLevel < 15) bumpPressure(1);

      const p = pressureRef.current;
      const currentPhase = phaseRef.current;

      // Phase 轉換規則
      if (currentPhase === "stable") {
        // 穩定 → 警告：壓力超過 30
        if (p > 30) {
          setPhase("warning");
        }
      } else if (currentPhase === "warning") {
        // 警告 → 事件：隨機觸發（壓力越高機率越大）
        const triggerChance = Math.min(0.30, p / 250);
        if (Math.random() < triggerChance) {
          setIncidentType(pickIncidentType());
          setPhase("incident");
        } 
        // 警告 → 穩定：壓力降到 20 以下
        else if (p < 20) {
          setPhase("stable");
        }
      }
      // incident 由另一個 effect 處理自動結束
    }, 1000);

    return () => clearInterval(tick);
  }, [signalStrength, spiritPower, batteryLevel, bumpPressure, pickIncidentType]);

  // Incident 自動結束（短而精：0.3~1.2 秒）
  useEffect(() => {
    if (phase !== "incident") return;

    const duration = 300 + Math.random() * 900;
    const timer = setTimeout(() => {
      // 事件後降壓，避免連續觸發
      bumpPressure(-15);
      setPhase("warning");
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, bumpPressure]);

  // 自然壓力衰減（每 5 秒少量降壓）
  useEffect(() => {
    const decay = setInterval(() => {
      if (phaseRef.current === "stable") {
        bumpPressure(-2);
      }
    }, 5000);

    return () => clearInterval(decay);
  }, [bumpPressure]);

  return {
    phase,
    intensity01,
    incidentType,
    threatLabel,
    notify,
    // Debug / UI 可顯示
    get pressure() {
      return pressureRef.current;
    },
  };
}
