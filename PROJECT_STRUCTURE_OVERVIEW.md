# 專案結構總覽 / Project Structure Overview

## 📦 已解壓縮的專案結構

```
靈異連線_完整優化包_v3.2_Final/
│
├── 📄 README.md                              專案總覽
├── 📄 QUICKSTART.md                          快速開始指南（5分鐘）
├── 📄 INSTALLATION_GUIDE.md                  完整安裝指南
├── 📄 STRUCTURE.md                           目錄結構說明
├── 📄 VERSION.txt                            版本資訊 (v3.2 Final)
├── 📄 IMAGE_SYSTEM_GUIDE.md                  圖片系統指南
├── 📄 IMAGES_INTEGRATION.md                  圖片整合說明
├── 📄 UI_UX_完整優化建議.md                  UI/UX 優化建議
├── 📄 UI_UX_專業評估報告.md                  專業評估報告
├── 📄 完整內容清單.md                        完整內容清單
├── 📄 新增組件使用指南.md                    組件使用指南
├── 📄 故事大綱與敘事結構.md                  故事設計文檔
├── 📄 圖片系統實作總結.md                    圖片實作總結
├── 📄 能力範圍與交付清單.md                  能力範圍說明
├── 📄 PATCH_NOTES_v2.3.md                    v2.3 更新日誌
├── 📄 PATCH_NOTES_v3.1.md                    v3.1 更新日誌
│
└── 📁 optimized-project/                     ← 主要專案目錄
    │
    ├── 📄 package.json                       依賴管理
    ├── 📄 vite.config.ts                     Vite 建置配置
    ├── 📄 tsconfig.json                      TypeScript 配置
    ├── 📄 tsconfig.node.json                 Node TypeScript 配置
    ├── 📄 tailwind.config.js                 Tailwind CSS 配置
    ├── 📄 postcss.config.js                  PostCSS 配置
    ├── 📄 .env.example                       環境變數範例
    ├── 📄 .gitignore                         Git 忽略規則
    ├── 📄 .eslintrc.cjs                      ESLint 配置
    ├── 📄 .prettierrc                        Prettier 配置
    ├── 📄 index.html                         HTML 入口
    ├── 📄 EXAMPLE_LandingPage.tsx            募資頁面範例
    │
    ├── 📁 src/                               ← 原始碼目錄
    │   │
    │   ├── 📄 main.tsx                       應用程式入口
    │   ├── 📄 App.tsx                        主應用組件
    │   ├── 📄 index.css                      全域樣式
    │   │
    │   ├── 📁 components/                    React 組件 (11個)
    │   │   ├── 📄 CRTOverlay.tsx             CRT 雜訊濾鏡
    │   │   ├── 📄 FlashlightCursor.tsx       手電筒游標
    │   │   ├── 📄 FocusTrap.tsx              防逃跑機制
    │   │   ├── 📄 CursedButton.tsx           詛咒按鈕
    │   │   ├── 📄 CursedAlert.tsx            詛咒警告
    │   │   ├── 📄 HauntFlash.tsx             鬼魂閃爍效果
    │   │   ├── 📄 ImageFilter.tsx            圖片濾鏡
    │   │   ├── 📄 InteractiveImageGallery.tsx 互動圖片畫廊
    │   │   ├── 📄 IntroOverlay.tsx           開場覆蓋層
    │   │   ├── 📄 SpectralPhoneBattery.tsx   靈魂手機電量
    │   │   └── 📄 TalismanGenerator.tsx      符咒生成器
    │   │
    │   ├── 📁 hooks/                         自訂 Hooks (4個)
    │   │   ├── 📄 useSound.ts                音效管理系統
    │   │   ├── 📄 useSpectralBattery.ts      靈魂電量管理
    │   │   ├── 📄 useGyroParallax.ts         陀螺儀視差
    │   │   └── 📄 useSoulBinding.ts          靈魂契約倒數
    │   │
    │   ├── 📁 services/                      服務模組
    │   │   └── 📄 geminiService.ts           Gemini AI 服務
    │   │
    │   ├── 📁 styles/                        樣式配置
    │   │   └── 📄 colorPalette.ts            色彩配置系統
    │   │
    │   ├── 📁 assets/                        資產管理
    │   │   └── 📄 scenes.ts                  場景資料
    │   │
    │   └── 📁 examples/                      使用範例
    │       ├── 📄 GhostAppExample.tsx        完整功能展示
    │       └── 📄 INTEGRATION_EXAMPLE.md     整合範例說明
    │
    ├── 📁 public/                            靜態資源
    │   │
    │   ├── 📁 images/                        場景圖片 (10個)
    │   │   ├── 🖼️ scene01_corridor.jpg       走廊 (162KB)
    │   │   ├── 🖼️ scene01_corridor.webp      走廊 (80KB)
    │   │   ├── 🖼️ scene02_talisman.jpg       符咒 (247KB)
    │   │   ├── 🖼️ scene02_talisman.webp      符咒 (137KB)
    │   │   ├── 🖼️ scene03_survivor.jpg       倖存者 (183KB)
    │   │   ├── 🖼️ scene03_survivor.webp      倖存者 (111KB)
    │   │   ├── 🖼️ scene04_cctv.jpg           監視器 (327KB)
    │   │   ├── 🖼️ scene04_cctv.webp          監視器 (227KB)
    │   │   ├── 🖼️ scene05_morgue.jpg         太平間 (150KB)
    │   │   └── 🖼️ scene05_morgue.webp        太平間 (66KB)
    │   │
    │   └── 📁 sounds/                        音效目錄
    │       └── 📄 README.txt                 音效說明（目錄空白）
    │
    ├── 📁 original-project/                  原始專案備份
    │   └── 📦 靈異連線_蝕骨杏林---企劃檔案_已優化.zip
    │
    ├── 📁 examples/                          範例程式碼
    │   ├── 📄 GhostAppExample.tsx            完整範例
    │   └── 📄 INTEGRATION_EXAMPLE.md         整合說明
    │
    └── 📄 [其他文檔檔案...]                  額外的說明文檔
```

## 📊 檔案統計

### 程式碼檔案
- **TypeScript/TSX**: 20+ 個檔案
- **React 組件**: 11 個
- **自訂 Hooks**: 4 個
- **服務模組**: 1 個 (AI)
- **配置檔案**: 8 個

### 資源檔案
- **圖片**: 10 個 (5 組 JPG+WebP)
- **音效**: 0 個 (目錄存在，檔案待補)
- **文檔**: 15+ 個 Markdown 文件

### 總計
- **總檔案數**: 93 個
- **總大小**: 約 2.14 MB

## 🎮 核心功能模組

### 1. 視覺效果系統
```
CRTOverlay           → CRT 雜訊濾鏡（復古監視器）
FlashlightCursor     → 手電筒游標（探索黑暗）
HauntFlash           → 鬼魂閃爍效果
ImageFilter          → 圖片濾鏡系統
```

### 2. 遊戲機制系統
```
FocusTrap            → 防逃跑機制（Meta Horror）
CursedButton         → 詛咒按鈕效果
SpectralPhoneBattery → 靈魂手機電量
useSoulBinding       → 靈魂契約倒數計時
```

### 3. 台灣文化系統
```
TalismanGenerator    → 符咒生成器
geminiService        → AI 服務（三魂七魄、祭改）
```

### 4. 互動系統
```
useSound             → 音效管理（Web Audio API）
useGyroParallax      → 陀螺儀視差（手機）
InteractiveImageGallery → 互動圖片畫廊
```

## 🔧 技術棧

### 前端框架
- **React** 18.2.0
- **TypeScript** 5.2.2
- **Vite** 5.0.8

### UI/樣式
- **Tailwind CSS** 3.3.6
- **Lucide React** 0.263.1 (圖示庫)

### AI 整合
- **@google/generative-ai** 0.1.0 (Gemini)

### 音效
- **use-sound** 4.0.1
- Web Audio API (程序化音效)

### 開發工具
- **ESLint** 8.55.0
- **Prettier** 3.1.1
- **TypeScript ESLint** 6.14.0

## 📝 重要文檔

### 快速開始
1. `QUICKSTART.md` - 5分鐘快速啟動
2. `README.md` - 專案總覽

### 開發指南
3. `INSTALLATION_GUIDE.md` - 詳細安裝步驟
4. `新增組件使用指南.md` - 組件 API 文檔
5. `STRUCTURE.md` - 目錄結構說明

### 設計文檔
6. `故事大綱與敘事結構.md` - 30分鐘 Demo 腳本
7. `UI_UX_完整優化建議.md` - UI/UX 設計文檔
8. `UI_UX_專業評估報告.md` - 專業評估

### 技術文檔
9. `IMAGE_SYSTEM_GUIDE.md` - 圖片系統指南
10. `圖片系統實作總結.md` - 實作細節
11. `配置檔案說明.md` - 配置說明

## 🚀 啟動步驟

```bash
# 1. 進入專案目錄
cd 靈異連線_完整優化包_v3.2_Final/optimized-project

# 2. 安裝依賴
npm install

# 3. 設定環境變數（可選）
cp .env.example .env
# 編輯 .env 填入 VITE_GEMINI_API_KEY

# 4. 啟動開發伺服器
npm run dev

# 5. 瀏覽器開啟
# http://localhost:5173
```

## ⚠️ 注意事項

### 需要補充的項目
1. **音效檔案** - `public/sounds/` 目錄空白
   - 替代方案：使用 Web Audio API 程序化音效
   
2. **API Key** - 需要 Google Gemini API Key
   - 取得位置：https://makersuite.google.com/app/apikey

### 系統需求
- Node.js >= 18.0.0 ✅
- npm >= 9.0.0 ✅

## 🎯 特色亮點

### 台灣文化元素
- ✅ 三魂七魄概念
- ✅ 祭改儀式系統
- ✅ 本命燈機制
- ✅ 符咒與道教元素

### Meta Horror 體驗
- ✅ 防逃跑機制（打破第四面牆）
- ✅ 瀏覽器事件監控
- ✅ 懲罰系統

### 專業優化
- ✅ 圖片雙格式（JPG + WebP）
- ✅ TypeScript 嚴格類型
- ✅ ESLint + Prettier
- ✅ 響應式設計

---

**文檔版本**: v1.0  
**更新日期**: 2025-12-13  
**專案版本**: v3.2 Final (Images Integrated)
