import objectsRaw from "../data/objects.json";
import interactionsRaw from "../data/interactions.json";
import type { GameObject, Rule } from "../types/game";

export const OBJECTS = objectsRaw as GameObject[];
export const RULES = interactionsRaw as Record<string, Rule[]>;

export const OBJECT_BY_ID = new Map<string, GameObject>(
  OBJECTS.map((o) => [o.id, o])
);
