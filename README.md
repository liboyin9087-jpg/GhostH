# GhostH - 靈異連線：蝕骨杏林

## 📦 專案狀態

✅ **已完成解壓縮與清理**

這個儲存庫包含《靈異連線：蝕骨杏林》(Ghost Connection: Corroded Hospital) 完整優化包 v3.2 Final。

## 📁 專案結構

```
靈異連線_完整優化包_v3.2_Final/
└── optimized-project/          ← React + TypeScript 主要專案
    ├── src/                    原始碼
    │   ├── components/         11 個 React 組件
    │   ├── hooks/              4 個自訂 Hooks
    │   ├── services/           AI 服務 (Gemini)
    │   ├── styles/             樣式配置
    │   └── assets/             資產管理
    ├── public/
    │   ├── images/             10 個場景圖片 (JPG + WebP)
    │   └── sounds/             音效目錄
    ├── README.md               專案說明
    ├── QUICKSTART.md           快速開始指南
    ├── INSTALLATION_GUIDE.md   安裝指南
    └── [配置檔案...]          package.json, vite.config.ts 等
```

## 📊 專案概覽

**類型**: React + TypeScript + Vite 恐怖遊戲  
**版本**: v3.2 Final (Images Integrated)  
**用途**: 台灣文化特色恐怖遊戲募資專案

### 核心內容
- ✅ **11 個 React 組件** - CRT 濾鏡、手電筒游標、防逃跑機制、符咒生成器等
- ✅ **4 個自訂 Hooks** - 音效系統、電量管理、陀螺儀視差、靈魂契約
- ✅ **AI 整合** - Google Gemini 服務，融入台灣民俗知識
- ✅ **10 個場景圖片** - 雙格式優化 (JPG + WebP)
- ✅ **專業配置** - TypeScript + ESLint + Prettier

## 🎯 台灣文化特色

- **三魂七魄** - 台灣道教靈魂觀念
- **祭改儀式** - 傳統驅邪儀式
- **本命燈** - 延壽祈福文化
- **符咒系統** - 道教符咒元素

## 🏃 快速開始

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

詳細步驟請參考：[optimized-project/QUICKSTART.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/QUICKSTART.md)

## 📖 文檔

專案內包含三個主要文檔：
- **[README.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/README.md)** - 專案總覽與功能說明
- **[QUICKSTART.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/QUICKSTART.md)** - 5 分鐘快速啟動
- **[INSTALLATION_GUIDE.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/INSTALLATION_GUIDE.md)** - 詳細安裝與整合指南

## ⚠️ 注意事項

1. **音效檔案** - 使用 Web Audio API 程序化音效（可自行添加音檔）
2. **API Key** - AI 功能需要 [Google Gemini API Key](https://makersuite.google.com/app/apikey)
3. **系統需求** - Node.js >= 18.0.0, npm >= 9.0.0

## 🔒 品質保證

✅ **程式碼品質**: 專業級 TypeScript  
✅ **安全性掃描**: CodeQL - 0 個警報  
✅ **配置完整**: ESLint + Prettier + 環境變數範例

---

**最後更新**: 2025-12-13  
**狀態**: ✅ 已完成解壓縮與清理，可立即使用