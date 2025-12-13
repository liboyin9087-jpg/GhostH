# Integration Example

這個資料夾提供「最小可運作」的整合示例，讓你把優化包元件插進既有 React + Tailwind 專案時有一個對照。

## 你需要準備
- React 18+ / TypeScript
- Tailwind CSS（若沒有也可以改成一般 CSS）
- 依賴：
  - lucide-react
  - use-sound

## public/sounds
把音檔放在：
- public/sounds/hospital_hum.mp3
- public/sounds/woman_scream.mp3
- public/sounds/static_noise.mp3
- public/sounds/paper_burn.mp3

沒有音檔也不會報錯，但就不會出聲。

## 範例入口
- `GhostAppExample.tsx`：示範如何把 IntroOverlay、SoulBinding、電量 HUD、CRT 疊加整合在一起
