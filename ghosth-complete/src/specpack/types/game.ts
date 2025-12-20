export type ObjectAction =
  | "inspect"
  | "scan"
  | "collect"
  | "use"
  | "open"
  | "press"
  | "equip"
  | "playback";

export type AssetKind = "cutout" | "found";

export interface GameObject {
  id: string;
  name: string;
  type: string;
  interaction: ObjectAction[];
  assets: {
    cutout: string; // public URL
    found: string;  // public URL
  };
  meta?: Record<string, any>;
}

export interface UIRule {
  open?: "inspect_modal" | "playback_screen";
  asset?: AssetKind;
  overlay?: "scan_overlay";
  toast?: string;
  anomalyMarker?: boolean;
}

export interface EffectRule {
  type:
    | "fear"
    | "emf"
    | "temp"
    | "signal"
    | "inventory_add"
    | "inventory_consume"
    | "unlock"
    | "set_mode"
    | "spawn"
    | "event";
  delta?: number;
  id?: string;
}

export interface Rule {
  action: ObjectAction;
  ui?: UIRule;
  effects?: EffectRule[];
  requires?: Array<{ type: "has_item"; id: string }>;
  cooldownSec?: number;
  objective?: { set?: string };
  log?: { addClue?: boolean; titleOverride?: string };
  chanceEvents?: Array<{ event: string; chance: number }>;
}
