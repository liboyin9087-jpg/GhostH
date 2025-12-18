# SpectralLink — 道具圖資匯入（路徑 / 命名 / 規格）

## 1) 你要放哪裡？（React / Vite 專案）

建議把所有圖資統一放在：

- `public/assets/objects/cutout/`  → **CUTOUT PNG alpha**
- `public/assets/objects/found/`   → **FOUND JPG**

原因：Vite 的 `public/` 會以「原樣路徑」被打包，引用最穩。

---

## 2) 命名規則（固定、不要再變）

每個物件 **兩張**：

- CUTOUT：`obj_XX_<name>.png`
- FOUND： `obj_XX_<name>_found.jpg`

> 若某物件需要「多一張」FOUND（例如文件要不同構圖），就用：
- `obj_09_burnt_docs_found_01.jpg`
- `obj_09_burnt_docs_found_02.jpg`

### 17 個核心物件（obj_01 ~ obj_17）
1. `obj_01_wheelchair`
2. `obj_02_flashlight`
3. `obj_03_vhs`
4. `obj_04_cam_battery`
5. `obj_05_morgue_handle`
6. `obj_06_evidence_box`
7. `obj_07_emergency_button`
8. `obj_08_audio_reel`
9. `obj_09_burnt_docs` (FOUND 可 2 張)
10. `obj_10_ash_pile`
11. `obj_11_cctv`
12. `obj_12_old_key`
13. `obj_13_wristband`
14. `obj_14_photo`
15. `obj_15_mirror`
16. `obj_16_medical_tool`
17. `obj_17_blood_stain`

---

## 3) 檔案規格（一次到位）

### A. Product Shot / CUTOUT
- 比例：**1:1**
- 檔案：**PNG**（必須 Alpha 透明）
- 解析度：**1024×1024**（建議）
- 構圖：物件佔畫面 75%～90%，保留陰影空間
- 禁止：可讀文字、Logo、水印、UI、時間碼

### B. Found Footage / FOUND
- 比例：**1:1**
- 檔案：**JPG**（quality 80–90）
- 解析度：**1024×1024**（建議）
- 風格：手電筒光、vignette、VHS scanlines、輕微手震、偏綠但不要過綠
- 禁止：HUD / timecode / UI 字樣

---

## 4) 程式怎麼引用？（最小可用範例）

### 建議新增：`src/assets/objects.ts`

```ts
export const OBJECT_MEDIA = {
  obj_01_wheelchair: {
    cutout: '/assets/objects/cutout/obj_01_wheelchair.png',
    found:  '/assets/objects/found/obj_01_wheelchair_found.jpg',
  },
  // ...依序補齊
} as const
```

在 React 內使用：

```tsx
import { OBJECT_MEDIA } from './assets/objects'

<img src={OBJECT_MEDIA.obj_01_wheelchair.cutout} alt="wheelchair" />
```

---

## 5) 用 SpecPack 的資料（可選）

本專案已額外放入：
- `src/specpack/data/objects.json`
- `src/specpack/data/interactions.json`
- `src/specpack/tools/AssetChecker.tsx`

你可以把它們當作「資產與互動的單一真相來源」，再逐步把 `src/game/*` 的系統接過去。
