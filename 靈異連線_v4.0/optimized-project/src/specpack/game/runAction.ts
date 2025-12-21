import { OBJECT_BY_ID, RULES } from "./db";
import type { AssetKind, ObjectAction, UIRule } from "../types/game";

export type RunResult =
  | { type: "inspect"; objectId: string; kind: AssetKind }
  | { type: "playback"; objectId: string; kind: AssetKind }
  | { type: "scan"; objectId: string }
  | { type: "toast"; message: string }
  | { type: "noop" };

function pickUI(ui?: UIRule): RunResult | null {
  if (!ui) return null;

  if (ui.open === "inspect_modal") {
    return { type: "inspect", objectId: "", kind: ui.asset ?? "cutout" };
  }
  if (ui.open === "playback_screen") {
    return { type: "playback", objectId: "", kind: ui.asset ?? "found" };
  }
  if (ui.overlay === "scan_overlay") {
    return { type: "scan", objectId: "" };
  }
  if (ui.toast) {
    return { type: "toast", message: ui.toast };
  }
  return null;
}

export function runAction(objectId: string, action: ObjectAction): RunResult {
  const obj = OBJECT_BY_ID.get(objectId);
  if (!obj) return { type: "noop" };

  const rules = RULES[objectId] ?? [];
  const rule = rules.find((r) => r.action === action);
  if (!rule) return { type: "noop" };

  const ui = pickUI(rule.ui);
  if (!ui) return { type: "noop" };

  if (ui.type === "inspect" || ui.type === "playback" || ui.type === "scan") {
    return { ...ui, objectId } as RunResult;
  }
  return ui;
}
