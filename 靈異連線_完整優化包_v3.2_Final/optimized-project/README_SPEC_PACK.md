# Spectral Link — Spec Pack Integration

This repo now includes an **optional** spec pack under `src/specpack/` (objects, interactions, action runner, and an asset checker).

Quick import example:
```ts
import objects from "./specpack/data/objects.json";
import interactions from "./specpack/data/interactions.json";
```

See `PROMPTS_NANO_FINAL.md` for the final Nano prompts and `public/assets/objects/` for the target asset folders.

---

# GhostH SpecPack v1.0 (封版規格包)

這是一包「可直接丟進既有 React 專案」的封版補丁，包含：
- 17 物件 × 2 圖（cutout+found）之路徑/命名規格
- objects.json / interactions.json 範例（可直接套用）
- AssetChecker：自動檢查 34 張圖是否路徑正確
- InspectModal / PlaybackScreen / ScanOverlay：最小可用 UI
- executeAction：scan 有結果並套用 EMF/TEMP/FEAR

## 1) 圖檔路徑（放 public）
public/assets/objects/<object_folder>/
  <file>_cutout.png
  <file>_found.png

## 2) 先驗證素材
把 App.tsx 暫時切到工具：
```tsx
import AssetChecker from "./tools/AssetChecker";
export default function App(){ return <AssetChecker/>; }
```
看到「缺漏總數 = 0」即封版完成。

## 3) 再接回主 UI
用 executeAction(state, objectId, action) 觸發：
- inspect -> InspectModal
- playback -> PlaybackScreen
- scan -> ScanOverlay (並在 onApply 套用效果)

## 4) 重要命名修正
obj_05 必須叫：「停屍櫃抽屜把手」（避免家具抽屜誤解）
