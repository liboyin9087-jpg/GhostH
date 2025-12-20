import { OBJECT_BY_ID, RULES } from "./db";
import type { ObjectAction, Rule } from "../types/game";
import type { GameState, ScanResult } from "../types/state";
import { applyEffects, addClue } from "./state";

function defaultScanResult(objectId: string): Omit<ScanResult, "objectId" | "title"> {
  switch (objectId) {
    case "obj_05_morgue_handle":
      return {
        summary: "金屬表面凝結水珠；局部低溫。",
        emfDelta: 0,
        tempDelta: -3,
        fearDelta: +4,
        marker: { xPct: 62, yPct: 48, rPct: 14, kind: "cold" },
      };
    case "obj_10_ash_pile":
      return {
        summary: "灰燼附近偵測到短暫能量波動；可能與焚燒行為相關。",
        emfDelta: +2,
        tempDelta: -1,
        fearDelta: +7,
        marker: { xPct: 50, yPct: 64, rPct: 18, kind: "emf" },
      };
    case "obj_17_blood_stain":
      return {
        summary: "血跡邊緣呈現不規則拖曳方向；疑似移動痕跡。",
        emfDelta: +1,
        tempDelta: 0,
        fearDelta: +6,
        marker: { xPct: 46, yPct: 72, rPct: 20, kind: "danger" },
      };
    case "obj_11_cctv":
      return {
        summary: "掃描到訊號干擾源；建議查看回放或切換觀測角度。",
        emfDelta: +1,
        tempDelta: 0,
        fearDelta: +3,
        marker: { xPct: 70, yPct: 30, rPct: 14, kind: "emf" },
      };
    case "obj_15_mirror":
      return {
        summary: "反射區域出現短暫影像不一致；可能存在瞬時干擾。",
        emfDelta: +2,
        tempDelta: 0,
        fearDelta: +8,
        marker: { xPct: 55, yPct: 45, rPct: 16, kind: "danger" },
      };
    default:
      return {
        summary: "未偵測到穩定異常；仍建議記錄並持續觀測。",
        emfDelta: 0,
        tempDelta: 0,
        fearDelta: +1,
        marker: { xPct: 52, yPct: 54, rPct: 12, kind: "emf" },
      };
  }
}

export type UIEvent =
  | { type: "inspect"; objectId: string; asset: "cutout" | "found" }
  | { type: "playback"; objectId: string; asset: "found" | "cutout" }
  | { type: "scan"; objectId: string; result: ScanResult }
  | { type: "toast"; message: string }
  | { type: "noop" };

function findRule(objectId: string, action: ObjectAction): Rule | null {
  const rules = RULES[objectId] ?? [];
  return rules.find((r) => r.action === action) ?? null;
}

export function executeAction(
  state: GameState,
  objectId: string,
  action: ObjectAction
): { next: GameState; ui: UIEvent } {
  const obj = OBJECT_BY_ID.get(objectId);
  if (!obj) return { next: state, ui: { type: "noop" } };

  const rule = findRule(objectId, action);
  if (!rule) return { next: state, ui: { type: "noop" } };

  if (rule.ui?.open === "inspect_modal") {
    return { next: state, ui: { type: "inspect", objectId, asset: rule.ui.asset ?? "cutout" } };
  }
  if (rule.ui?.open === "playback_screen") {
    return { next: state, ui: { type: "playback", objectId, asset: rule.ui.asset ?? "found" } };
  }

  if (rule.ui?.overlay === "scan_overlay" || action === "scan") {
    const base = defaultScanResult(objectId);
    const result: ScanResult = {
      objectId,
      title: obj.name,
      summary: base.summary,
      emfDelta: base.emfDelta,
      tempDelta: base.tempDelta,
      fearDelta: base.fearDelta,
      marker: base.marker,
    };
    return { next: state, ui: { type: "scan", objectId, result } };
  }

  let next = applyEffects(state, rule.effects);

  if (rule.log?.addClue) {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    next = addClue(next, {
      title: rule.log.titleOverride ?? obj.name,
      description: "已記錄到線索紀錄。",
      time: t,
      isNew: true,
      objectId,
    });
  }

  if (rule.ui?.toast) return { next, ui: { type: "toast", message: rule.ui.toast } };

  return { next, ui: { type: "noop" } };
}
