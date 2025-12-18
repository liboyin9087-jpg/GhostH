# GhostH - 靈異連線：蝕骨杏林

## 📦 專案狀態

✅ **v4.0 Complete Edition - 已完成升級**

這個儲存庫包含《靈異連線：蝕骨杏林》(Ghost Connection: Corroded Hospital) v4.0 Complete Edition，這是一個完整的互動式恐怖遊戲原型，取代了之前的 v3.2 組件庫版本。

## 🆕 v4.0 新內容

相較於 v3.2 組件庫，v4.0 Complete Edition 提供：
- 🎮 **完整遊戲框架** - 可玩的互動式原型
- 🎵 **30+ 專業音效** - 環境音、鬼魂、UI、VHS 等完整音效庫
- 🖼️ **遊戲場景資源** - 3 個場景背景 + 9 個互動熱點
- 🎯 **遊戲系統** - 掃描器、回放系統、驚嚇導演、成就追蹤
- 📹 **VHS 視覺效果** - 掃描線、色差、雜訊、追蹤失真
- 🛠️ **開發工具** - Spec Pack 工具與驗證腳本

## 📁 專案結構

```
靈異連線_完整優化包_v3.2_Final/
└── optimized-project/          ← v4.0 Complete Edition 主專案
    ├── src/                    遊戲原始碼
    │   ├── components/         11 個遊戲 UI 組件
    │   │   ├── CameraHUD.tsx         攝影機 HUD
    │   │   ├── VHSOverlaySystem.tsx  VHS 視覺系統
    │   │   ├── TalismanOverlay.tsx   護符封印動畫
    │   │   ├── AchievementSystem.tsx 成就系統
    │   │   ├── ClueDrawer.tsx        線索抽屜
    │   │   ├── PlaybackViewer.tsx    回放檢視器
    │   │   └── ... (更多組件)
    │   ├── game/               遊戲系統 Hooks
    │   │   ├── useHauntDirector.ts   驚嚇導演
    │   │   ├── usePlaybackSystem.ts  回放系統
    │   │   └── useScanSystem.ts      掃描系統
    │   ├── specpack/           Spec Pack 工具與數據
    │   │   ├── components/     Spec 組件
    │   │   ├── data/           遊戲數據 (JSON)
    │   │   ├── game/           遊戲邏輯引擎
    │   │   └── types/          類型定義
    │   ├── hooks/              自訂 Hooks
    │   │   ├── useAudioManager.ts    音效管理
    │   │   ├── useHaptics.ts         觸覺回饋
    │   │   ├── useFearSystem.ts      恐懼系統
    │   │   └── ... (更多 Hooks)
    │   ├── assets/             資源定義與配置
    │   ├── GameShell.tsx       遊戲主框架
    │   ├── GameShellOptimized.tsx  優化版框架
    │   ├── scenes.ts           場景定義
    │   └── scenesEvents.ts     場景事件腳本
    ├── public/                 公開資源
    │   ├── audio/              完整音效庫 (30+ 個 MP3)
    │   │   ├── ambient/        環境音效
    │   │   ├── ghost/          鬼魂音效
    │   │   ├── ui/             UI 音效
    │   │   ├── vhs/            VHS 效果音
    │   │   ├── talisman/       符咒音效
    │   │   └── loops/          循環音效
    │   ├── images/             遊戲圖片
    │   │   ├── scenes/         場景背景 (3 個)
    │   │   ├── hotspots/       互動熱點 (9 個)
    │   │   └── ui/             UI 按鈕與圖示
    │   └── assets/             遊戲物件資源
    ├── _ghosth_addons/         開發工具與文檔
    │   ├── scripts/            驗證與打包腳本
    │   ├── planning_docs/      專案規劃文檔
    │   └── uploaded_images/    額外圖片資源
    ├── ASSETS.md               資源清單與 AI 提示詞
    ├── COMPLETE_GUIDE.md       完整開發指南
    ├── README.md               專案說明
    └── [配置檔案...]          package.json, vite.config.ts 等

└── optimized-project-v3.2-backup/  ← 舊版 v3.2 組件庫備份
    (保留作為參考，可選擇性刪除)
```

## 📊 專案概覽

**類型**: React + TypeScript + Vite 互動式恐怖遊戲  
**版本**: v4.0 Complete Edition  
**用途**: 台灣文化特色恐怖遊戲完整原型

### v4.0 核心特色

- ✅ **完整遊戲框架** - GameShell 與場景系統
- ✅ **三個可探索場景** - B1 走廊、護理站、太平間
- ✅ **互動式物件系統** - 9 個熱點、掃描與檢查功能
- ✅ **完整音效庫** - 30+ 個專業音效檔案（環境音、鬼魂、UI、VHS）
- ✅ **VHS 視覺效果** - 掃描線、色差、雜訊、鬼影
- ✅ **遊戲機制** - 手電筒、掃描器、回放系統、護符封印
- ✅ **成就系統** - 追蹤玩家進度與發現
- ✅ **Spec Pack 整合** - 物件數據與互動腳本
- ✅ **觸覺回饋系統** - 行動裝置震動支援
- ✅ **恐懼系統** - 動態難度調整與驚嚇導演

## 🎯 台灣文化特色

- **三魂七魄** - 台灣道教靈魂觀念
- **祭改儀式** - 傳統驅邪儀式
- **本命燈** - 延壽祈福文化
- **符咒系統** - 道教符咒元素
- **1990 年代氛圍** - 台灣廢棄醫院場景
- **VHS 錄影帶美學** - 懷舊監視器風格

## 🏃 快速開始

```bash
# 1. 進入專案目錄
cd 靈異連線_完整優化包_v3.2_Final/optimized-project

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 瀏覽器會開啟互動式遊戲 http://localhost:5173
```

### 遊戲操作

- 🔦 **手電筒** - 探索黑暗區域
- 📡 **掃描器** - 偵測靈異能量場
- 📹 **回放系統** - 查看監視器記錄
- 🎴 **護符** - 封印靈異現象
- 📋 **線索抽屜** - 查看收集的證據
- ⚙️ **設定選單** - 調整音量、效果等

**遊戲特色**：
- 三個可探索場景（B1 走廊、護理站、太平間）
- 動態音效與視覺效果
- VHS 錄影帶風格視覺效果
- 成就系統與進度追蹤

詳細步驟請參考：[optimized-project/QUICKSTART.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/QUICKSTART.md)

## 📖 文檔

### 專案文檔
- **[README.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/README.md)** - 遊戲說明與場景介紹
- **[COMPLETE_GUIDE.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/COMPLETE_GUIDE.md)** - 完整開發指南
- **[ASSETS.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/ASSETS.md)** - 資源清單與 AI 提示詞
- **[PROMPTS_NANO_FINAL.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/PROMPTS_NANO_FINAL.md)** - AI 提示詞集
- **[README_ASSETS.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/README_ASSETS.md)** - 資源使用說明
- **[README_SPEC_PACK.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/README_SPEC_PACK.md)** - Spec Pack 工具說明

### 儲存庫文檔
- **[QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md)** - 快速導覽指南
- **[INTEGRATION_REPORT.md](./INTEGRATION_REPORT.md)** - v4 整合報告

## ⚠️ 注意事項

1. **音效資源** - 包含 30+ 個完整音效檔案（MP3 格式）
2. **圖片資源** - 3 個場景背景 + 9 個互動熱點 + UI 按鈕
3. **遊戲資料** - 物件與互動數據存於 `src/specpack/data/`
4. **開發工具** - `_ghosth_addons/scripts/` 包含驗證與打包腳本
5. **瀏覽器支援** - 建議使用 Chrome/Edge（最佳音效支援）
6. **系統需求** - Node.js >= 18.0.0, npm >= 9.0.0

## 🔄 從 v3.2 升級

如果你之前使用 v3.2 組件庫版本：
- v3.2 備份已保留在 `optimized-project-v3.2-backup/` 目錄
- v4.0 提供完整的遊戲體驗，取代了組件庫架構
- v3.2 的 AI 整合功能已移除（可從備份中參考）

## 🔒 品質保證

✅ **程式碼品質**: 專業級 TypeScript  
✅ **TypeScript 編譯**: 無錯誤通過  
✅ **專案建置**: 成功（206 KB, gzip: 65 KB）  
✅ **完整資源**: 30+ 音效檔案、12+ 圖片資源  
✅ **遊戲原型**: 可運行的互動式完整體驗

## 🎮 v4.0 遊戲特色

- **沉浸式場景** - 1990 年代台灣廢棄醫院氛圍
- **動態音效** - 環境音、鬼魂音效、UI 反饋完整整合
- **VHS 美學** - 掃描線、色差、雜訊、追蹤失真效果
- **互動系統** - 檢查物件、掃描能量場、回放靈異現象
- **進度追蹤** - 成就系統、線索收集、故事解鎖
- **台灣元素** - 道教護符、民俗驅邪、本土恐怖氛圍
- **觸覺回饋** - 行動裝置震動支援
- **驚嚇導演** - 動態難度調整系統

## 📦 資源統計

- **場景數量**: 3 個（B1 走廊、護理站、太平間）
- **音效檔案**: 30+ 個 MP3（約 3.5 MB）
- **圖片檔案**: 12+ 個 PNG（約 4 MB）
- **互動熱點**: 9 個可檢查物件
- **成就系統**: 多個可解鎖成就
- **原始碼**: 50+ 個 TypeScript/TSX 檔案

---

**最後更新**: 2025-12-18  
**版本**: v4.0 Complete Edition  
**狀態**: ✅ SpectralLink Demo 已完全取代 v3.2，可立即使用