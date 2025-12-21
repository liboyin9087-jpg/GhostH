# 《靈異連線》GhostH UI Demo

台灣風格恐怖遊戲介面原型，結合 VHS 監視器美學與道教法器元素。

## 專案概述

《靈異連線》是一款以 1990 年代台灣廢棄醫院為背景的恐怖遊戲介面原型。玩家透過類似 VHS 監視器的畫面，探索杏林醫院的詭異事件，使用手電筒、掃描器與道教護符等工具，揭開塵封的靈異檔案。

## 快速啟動

```bash
npm install
npm run dev
```

## 專案結構

```
src/
├── components/
│   ├── CameraHUD.tsx          # 攝影機 HUD
│   ├── ClueDrawer.tsx         # 線索抽屜面板
│   ├── TalismanOverlay.tsx    # 護符封印動畫
│   └── VHSOverlaySystem.tsx   # VHS 視覺效果系統
├── hooks/
│   ├── useVHSTimestamp.ts     # VHS 時間戳
│   ├── usePrefersReducedMotion.ts # 無障礙動畫偏好
│   └── useAudioManager.ts     # 音效管理系統
├── scenes.ts                  # 場景定義
├── scenesEvents.ts            # 場景事件腳本
├── GameShell.tsx              # 主遊戲框架
└── styles.css                 # 全域樣式
```

## 三場景事件腳本

| 場景 | 危險值 | 異常頻率 | 目標 |
|-----|-------|---------|-----|
| B1 走廊 | 0.45 | 10-22秒 | 追蹤輪椅血跡 |
| 護理站 | 0.65 | 8-18秒 | 找值班表與鑰匙盒 |
| 太平間 | 0.85 | 6-14秒 | 完成封印 |

## 核心功能

遊戲提供四種工具：手電筒用於探索黑暗區域，掃描器偵測靈異能量場，移動按鈕切換場景，護符用於消耗靈力進行封印。

視覺效果包含 VHS 掃描線與 RGB 邊條、隨機畫面閃爍與色差偏移、雜訊紋理與暈影效果，以及依危險等級隨機出現的鬼影。

## 資源檔案

詳細的圖片與音效資源清單、AI 生成提示詞請參閱 **ASSETS.md**。

## 技術規格

本專案使用 React 18 搭配 TypeScript，以 Vite 作為建置工具，樣式採用純 CSS 無框架依賴，字型使用 VT323（VHS 風格）與 Noto Sans TC（中文）。
