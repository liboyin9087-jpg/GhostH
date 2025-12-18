# GhostH 封版規格包 v1.0

## 0) 封版條件
- 17 物件 × 2 圖（cutout + found）= 34 張
- AssetChecker：缺漏總數 = 0
- UI：inspect / playback / scan 可觸發且 scan 套用 EMF/TEMP/FEAR

## 1) 圖檔路徑（固定）
public/assets/objects/<object_folder>/
  <filename>_cutout.png
  <filename>_found.png

## 2) 圖檔規格（固定）
A. Cutout：1:1 PNG alpha，單一物件，無環境，無可讀文字  
B. Found：1:1 場景，手電筒光束，綠偏色 + vignette + VHS scanlines，無 HUD/時碼/字幕

共用 Negative（每張貼最後）：
Negative: readable text, misspelled words, logos, watermark, UI overlay, timestamp text, subtitles, cartoon, illustration, CGI, 3D render, concept art, isometric view, perfect symmetry, overly clean studio look

## 3) 物件表（固定）
1 obj_01_wheelchair｜輪椅｜inspect, scan  
2 obj_02_flashlight｜手電筒｜equip(+inspect)  
3 obj_03_vhs｜VHS 錄影帶｜inspect, collect, playback  
4 obj_04_cam_battery｜錄影帶電池｜inspect, collect, use  
5 obj_05_morgue_handle｜停屍櫃抽屜把手｜inspect, scan  
6 obj_06_evidence_box｜金屬證物盒｜inspect, open  
7 obj_07_emergency_button｜緊急按鈕盒｜inspect, press  
8 obj_08_audio_reel｜錄音帶鐵捲｜inspect, collect, playback  
9 obj_09_burnt_docs｜燒毀文件｜inspect, collect  
10 obj_10_ash_pile｜灰燼｜inspect, scan  
11 obj_11_cctv｜CCTV 攝影機｜inspect, scan  
12 obj_12_old_key｜老舊鑰匙｜inspect, collect, use  
13 obj_13_wristband｜病患手環｜inspect, collect  
14 obj_14_photo｜破損相片｜inspect, collect  
15 obj_15_mirror｜鏡子碎片｜inspect, scan  
16 obj_16_medical_tool｜醫療工具｜inspect, collect  
17 obj_17_blood_stain｜地面血跡痕跡物｜inspect, scan

---

## React 專案匯入（直接可用的路徑與 import 範例）

### 1) 放檔案的位置（建議）
- CUTOUT：`public/assets/objects/cutout/obj_XX_name.png`
- FOUND：`public/assets/objects/found/obj_XX_name.jpg`
  - 若同物件需要多張 FOUND（例如文件），用：`obj_09_burnt_docs_01.jpg`, `obj_09_burnt_docs_02.jpg`

### 2) 代碼中的引用（單一來源）
檔案：`src/assets/objectManifest.ts`

```ts
import { getObjectMedia } from "./assets/objectManifest";

const media = getObjectMedia("obj_09_burnt_docs");
// media?.cutout -> PNG alpha
// media?.found  -> array of FOUND images
```

### 3) 在 UI 裡顯示（範例）
```tsx
import React from "react";
import { getObjectMedia } from "../assets/objectManifest";

export function ObjectThumb({ id }: { id: string }) {
  const media = getObjectMedia(id);
  if (!media) return null;
  return <img src={media.cutout} alt={id} style={{ width: 96, height: 96 }} />;
}
```
