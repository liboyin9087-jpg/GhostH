export type ThreatLevel = "low" | "medium" | "high" | "critical";

export interface ClueLogItem {
  id: string;
  title: string;
  description: string;
  time: string; // "03:15"
  isNew: boolean;
  objectId?: string;
}

export interface GameState {
  fear: number;      // 0..100
  signal: number;    // 0..100
  battery: number;   // 0..100
  temperature: number; // °C
  emf: number;       // 1..5
  objective: string;
  inventory: Record<string, number>;
  clues: ClueLogItem[];
  mode: null | "flashlight" | "scan" | "playback" | "talisman";
  threat: ThreatLevel;
}

export interface ScanResult {
  objectId: string;
  title: string;
  summary: string;
  emfDelta?: number;
  tempDelta?: number;
  fearDelta?: number;
  marker?: { xPct: number; yPct: number; rPct: number; kind: "emf" | "cold" | "danger" };
}
