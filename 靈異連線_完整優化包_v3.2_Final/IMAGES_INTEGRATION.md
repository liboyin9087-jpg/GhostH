# 圖片整合說明（v3.2）

本版本已將你提供的 5 張照片壓縮後整合進專案，並採用 **WebP 優先 + JPG fallback** 的載入策略（兼顧效能與相容性）。

## 檔案位置
- `optimized-project/public/images/`
  - `scene01_corridor.(webp|jpg)`
  - `scene02_talisman.(webp|jpg)`
  - `scene03_survivor.(webp|jpg)`
  - `scene04_cctv.(webp|jpg)`
  - `scene05_morgue.(webp|jpg)`

## 程式整合
- `optimized-project/src/assets/scenes.ts`：集中管理圖片路徑與 key
- `optimized-project/src/components/HauntFlash.tsx`：事件觸發「監視器快閃」UI（REC / CAM）
- `optimized-project/src/examples/GhostAppExample.tsx`：已示範：
  - `BREACH` 或 `CURSED` → 快閃 `scene04_cctv`
  - `timeLeft === 60` → 快閃 `scene01_corridor`（僅一次）

## 建議的使用原則（效能優先）
- 首屏不放大圖當背景；改用「事件觸發快閃」或「解鎖後圖庫」。
- 圖片顯示採 `<picture>`：WebP 主力、JPG 相容。
