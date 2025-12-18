# GhostH - 靈異連線：蝕骨杏林

## 📦 專案狀態

✅ **已完成解壓縮與整合** - v4 Complete Edition

這個儲存庫包含《靈異連線：蝕骨杏林》(Ghost Connection: Corroded Hospital) 完整內容，包含組件庫與互動式遊戲演示。

## 📁 專案結構

```
靈異連線_完整優化包_v3.2_Final/
├── optimized-project/          ← React + TypeScript 組件庫
│   ├── src/                    原始碼
│   │   ├── components/         11 個 React 組件
│   │   ├── hooks/              4 個自訂 Hooks
│   │   ├── services/           AI 服務 (Gemini)
│   │   ├── styles/             樣式配置
│   │   └── assets/             資產管理
│   ├── public/
│   │   ├── images/             10 個場景圖片 (JPG + WebP)
│   │   └── sounds/             音效目錄
│   ├── README.md               專案說明
│   ├── QUICKSTART.md           快速開始指南
│   ├── INSTALLATION_GUIDE.md   安裝指南
│   └── [配置檔案...]          package.json, vite.config.ts 等
│
└── spectrallink-demo/          ← 互動式遊戲演示 (NEW!)
    ├── src/                    遊戲邏輯與組件
    │   ├── components/         遊戲 UI 組件 (HUD, 護符, VHS 效果等)
    │   ├── game/               遊戲系統 (掃描, 回放, 驚嚇導演)
    │   ├── specpack/           Spec Pack 工具與數據
    │   ├── assets/             物件與道具定義
    │   └── hooks/              遊戲相關 Hooks
    ├── public/
    │   ├── audio/              完整音效庫 (30+ 個音效)
    │   │   ├── ghost/          鬼魂音效
    │   │   ├── ambient/        環境音效
    │   │   ├── ui/             UI 音效
    │   │   ├── vhs/            VHS 效果音
    │   │   ├── talisman/       符咒音效
    │   │   └── loops/          循環音效
    │   ├── images/             遊戲圖片資源
    │   │   ├── scenes/         場景背景 (3 個場景)
    │   │   ├── hotspots/       互動熱點 (9 個物件)
    │   │   └── ui/             UI 按鈕與圖示
    │   └── assets/objects/     遊戲物件資源
    ├── _ghosth_addons/         開發工具與文檔
    │   ├── planning_docs/      專案規劃文檔
    │   ├── scripts/            驗證與打包腳本
    │   └── uploaded_images/    上傳的圖片資源
    ├── ASSETS.md               資源清單
    ├── COMPLETE_GUIDE.md       完整指南
    ├── README.md               演示說明
    └── [配置檔案...]          package.json, vite.config.ts 等
```

## 📊 專案概覽

**類型**: React + TypeScript + Vite 恐怖遊戲  
**版本**: v4 Complete Edition (SpectralLink Demo Integrated)  
**用途**: 台灣文化特色恐怖遊戲募資專案

### 雙專案架構

#### 1️⃣ Optimized Project - 組件庫
- ✅ **11 個 React 組件** - CRT 濾鏡、手電筒游標、防逃跑機制、符咒生成器等
- ✅ **4 個自訂 Hooks** - 音效系統、電量管理、陀螺儀視差、靈魂契約
- ✅ **AI 整合** - Google Gemini 服務，融入台灣民俗知識
- ✅ **10 個場景圖片** - 雙格式優化 (JPG + WebP)
- ✅ **專業配置** - TypeScript + ESLint + Prettier

#### 2️⃣ SpectralLink Demo - 互動式遊戲原型 🆕
- ✅ **完整遊戲框架** - GameShell 與場景系統
- ✅ **VHS 視覺效果** - 掃描線、色差、雜訊、鬼影
- ✅ **三個可探索場景** - B1 走廊、護理站、太平間
- ✅ **互動式物件系統** - 9 個熱點、掃描與檢查功能
- ✅ **完整音效庫** - 30+ 個音效檔案 (環境音、鬼魂、UI、VHS)
- ✅ **遊戲機制** - 手電筒、掃描器、回放系統、護符封印
- ✅ **成就系統** - 追蹤玩家進度與發現
- ✅ **Spec Pack 整合** - 物件數據與互動腳本

## 🎯 台灣文化特色

- **三魂七魄** - 台灣道教靈魂觀念
- **祭改儀式** - 傳統驅邪儀式
- **本命燈** - 延壽祈福文化
- **符咒系統** - 道教符咒元素

## 🏃 快速開始

### 啟動組件庫 (Optimized Project)

```bash
# 1. 進入專案目錄
cd 靈異連線_完整優化包_v3.2_Final/optimized-project

# 2. 安裝依賴
npm install

# 3. 設定環境變數（可選 - AI 功能需要）
cp .env.example .env
# 編輯 .env 並填入你的 VITE_GEMINI_API_KEY

# 4. 啟動開發伺服器
npm run dev

# 5. 瀏覽器會自動開啟 http://localhost:5173
```

### 啟動遊戲演示 (SpectralLink Demo) 🆕

```bash
# 1. 進入演示專案目錄
cd 靈異連線_完整優化包_v3.2_Final/spectrallink-demo

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 瀏覽器會開啟互動式遊戲演示
```

**遊戲演示特色**：
- 🎮 三個可探索場景（B1 走廊、護理站、太平間）
- 🔦 互動式工具（手電筒、掃描器、護符）
- 👻 動態鬼影與音效系統
- 📹 VHS 錄影帶風格視覺效果
- 🏆 成就系統與進度追蹤

詳細步驟請參考：[optimized-project/QUICKSTART.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/QUICKSTART.md)

## 📖 文檔

### Optimized Project (組件庫)
- **[README.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/README.md)** - 專案總覽與功能說明
- **[QUICKSTART.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/QUICKSTART.md)** - 5 分鐘快速啟動
- **[INSTALLATION_GUIDE.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/INSTALLATION_GUIDE.md)** - 詳細安裝與整合指南

### SpectralLink Demo (遊戲演示) 🆕
- **[README.md](./靈異連線_完整優化包_v3.2_Final/spectrallink-demo/README.md)** - 遊戲演示說明
- **[COMPLETE_GUIDE.md](./靈異連線_完整優化包_v3.2_Final/spectrallink-demo/COMPLETE_GUIDE.md)** - 完整開發指南
- **[ASSETS.md](./靈異連線_完整優化包_v3.2_Final/spectrallink-demo/ASSETS.md)** - 資源清單與說明
- **[PROMPTS_NANO_FINAL.md](./靈異連線_完整優化包_v3.2_Final/spectrallink-demo/PROMPTS_NANO_FINAL.md)** - AI 提示詞集
- **[README_ASSETS.md](./靈異連線_完整優化包_v3.2_Final/spectrallink-demo/README_ASSETS.md)** - 資源使用說明

## ⚠️ 注意事項

### Optimized Project
1. **音效檔案** - 使用 Web Audio API 程序化音效（可自行添加音檔）
2. **API Key** - AI 功能需要 [Google Gemini API Key](https://makersuite.google.com/app/apikey)
3. **系統需求** - Node.js >= 18.0.0, npm >= 9.0.0

### SpectralLink Demo 🆕
1. **音效資源** - 包含 30+ 個完整音效檔案（MP3 格式）
2. **圖片資源** - 3 個場景背景 + 9 個互動熱點 + UI 按鈕
3. **遊戲資料** - 物件與互動數據存於 `src/specpack/data/`
4. **開發工具** - `_ghosth_addons/scripts/` 包含驗證與打包腳本
5. **瀏覽器支援** - 建議使用 Chrome/Edge（最佳音效支援）

## 🔒 品質保證

✅ **程式碼品質**: 專業級 TypeScript  
✅ **安全性掃描**: CodeQL - 0 個警報  
✅ **配置完整**: ESLint + Prettier + 環境變數範例  
✅ **完整資源**: 30+ 音效檔案、12+ 圖片資源  
✅ **遊戲演示**: 可運行的互動式原型

## 🎮 遊戲演示亮點

SpectralLink Demo 提供完整的遊戲體驗原型：

- **沉浸式場景** - 1990 年代台灣廢棄醫院氛圍
- **動態音效** - 環境音、鬼魂音效、UI 反饋完整整合
- **VHS 美學** - 掃描線、色差、雜訊、追蹤失真效果
- **互動系統** - 檢查物件、掃描能量場、回放靈異現象
- **進度追蹤** - 成就系統、線索收集、故事解鎖
- **台灣元素** - 道教護符、民俗驅邪、本土恐怖氛圍

---

**最後更新**: 2025-12-18  
**狀態**: ✅ v4 Complete - 已整合 SpectralLink Demo，可立即使用