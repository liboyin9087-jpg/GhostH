import type { GameState, ThreatLevel, ClueLogItem } from "../types/state";
import type { EffectRule } from "../types/game";

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function threatFromFear(fear: number): ThreatLevel {
  if (fear >= 85) return "critical";
  if (fear >= 65) return "high";
  if (fear >= 35) return "medium";
  return "low";
}

export const initialState: GameState = {
  fear: 18,
  signal: 72,
  battery: 85,
  temperature: 18.5,
  emf: 1,
  objective: "找到護理長辦公室的鑰匙",
  inventory: {},
  clues: [],
  mode: null,
  threat: "low",
};

export function addInventory(state: GameState, id: string, qty = 1): GameState {
  const next = { ...state.inventory };
  next[id] = (next[id] ?? 0) + qty;
  return { ...state, inventory: next };
}

export function consumeInventory(state: GameState, id: string, qty = 1): GameState {
  const next = { ...state.inventory };
  next[id] = Math.max(0, (next[id] ?? 0) - qty);
  if (next[id] === 0) delete next[id];
  return { ...state, inventory: next };
}

export function addClue(state: GameState, clue: Omit<ClueLogItem, "id">): GameState {
  const id = `clue_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return { ...state, clues: [{ ...clue, id }, ...state.clues] };
}

export function applyEffects(state: GameState, effects: EffectRule[] | undefined): GameState {
  if (!effects?.length) return state;
  let s = { ...state };

  for (const e of effects) {
    if (e.type === "fear" && typeof e.delta === "number") s.fear = clamp(s.fear + e.delta, 0, 100);
    if (e.type === "signal" && typeof e.delta === "number") s.signal = clamp(s.signal + e.delta, 0, 100);
    if (e.type === "temp" && typeof e.delta === "number") s.temperature = clamp(s.temperature + e.delta, -10, 40);
    if (e.type === "emf" && typeof e.delta === "number") s.emf = clamp(s.emf + e.delta, 1, 5);

    if (e.type === "inventory_add" && e.id) s = addInventory(s, e.id, e.delta ?? 1);
    if (e.type === "inventory_consume" && e.id) s = consumeInventory(s, e.id, e.delta ?? 1);

    if (e.type === "set_mode" && e.id) s.mode = e.id as any;
  }

  s.threat = threatFromFear(s.fear);
  return s;
}
