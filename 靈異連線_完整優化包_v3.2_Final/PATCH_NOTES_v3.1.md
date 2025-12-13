# Patch Notes — v3.1 Final (Merged)

## 修正
- 修復 zip 內中文檔名亂碼（含原始備份 zip 檔名）。
- 修正/補齊文件命名一致性（UI/UX、故事大綱、內容清單、圖片系統總結等）。

## 合併與補齊
- 合併 v2.3 的「最完善 UI/UX 增強」到 v3.0：
  - `CursedAlert`（懲罰改為監控系統警示彈窗 + 降低紅光強度）
  - `CRTOverlay` 平滑逼近（呼吸感）
  - `IntroOverlay`（音效解鎖 / 儀式入口）
  - `SpectralPhoneBattery` + `useSpectralBattery`（低電量干擾輸出）
  - `useGyroParallax`（預設關閉）
  - `examples/GhostAppExample.tsx` + `INTEGRATION_EXAMPLE.md`（一份可直接驗收的接線示例）
- `useSoulBinding` 更新為穩定版（集中管理 interval/listener/timeout，避免重複計時與幽靈 timeout）。

## 目錄
- 根目錄提供「必讀文件」捷徑（同時保留 `optimized-project/` 內原始位置）。
