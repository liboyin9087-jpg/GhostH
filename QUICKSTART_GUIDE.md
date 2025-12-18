# 靈異連線 v4.0 - 快速導覽

這個儲存庫包含《靈異連線：蝕骨杏林》v4.0 Complete Edition - 一個完整的互動式恐怖遊戲原型。

## 🎯 專案說明

**v4.0 Complete Edition** 是一個完整可玩的恐怖遊戲原型，提供：
- 🎮 三個可探索場景（B1 走廊、護理站、太平間）
- 🎵 30+ 個專業音效檔案
- 🖼️ 完整的場景與互動圖片
- 🔦 多種遊戲工具與機制
- 👻 動態驚嚇系統
- 🏆 成就追蹤系統

## 🚀 5 分鐘快速開始

```bash
# 1. 進入專案目錄
cd 靈異連線_完整優化包_v3.2_Final/optimized-project

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 在瀏覽器中開啟遊戲（通常是 http://localhost:5173）
```

## 🎮 遊戲操作指南

### 工具列按鈕
- **🔦 手電筒** - 點擊啟用/停用手電筒照明
- **📡 掃描器** - 掃描當前場景尋找靈異能量
- **📹 回放** - 查看監視器回放記錄
- **🎴 護符** - 使用道教護符封印靈異現象

### 互動方式
- **點擊熱點** - 點擊場景中高亮的物件進行檢查
- **線索抽屜** - 點擊右側按鈕查看收集的線索
- **設定選單** - 調整音量、視覺效果等設定
- **場景切換** - 使用箭頭按鈕在不同場景間移動

### 遊戲目標
1. 探索三個場景
2. 收集線索與證據
3. 使用工具發現靈異現象
4. 解開醫院的秘密

## 📚 詳細文檔

專案內包含完整文檔：
- **[README.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/README.md)** - 遊戲說明
- **[COMPLETE_GUIDE.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/COMPLETE_GUIDE.md)** - 開發指南
- **[ASSETS.md](./靈異連線_完整優化包_v3.2_Final/optimized-project/ASSETS.md)** - 資源清單

## 🎮 場景介紹

### 場景 1：B1 走廊
- **危險度**: 中等 (0.45)
- **特點**: 輪椅血跡、昏暗走廊
- **目標**: 追蹤血跡來源

### 場景 2：護理站
- **危險度**: 高 (0.65)
- **特點**: 值班表、鑰匙盒
- **目標**: 找到進入太平間的鑰匙

### 場景 3：太平間
- **危險度**: 極高 (0.85)
- **特點**: 停屍櫃、解剖台
- **目標**: 完成最終封印

## 🛠️ 開發者資源

### 專案結構
```
src/
├── components/     遊戲 UI 組件
├── game/          遊戲系統 Hooks
├── specpack/      Spec Pack 工具
├── assets/        資源定義
└── hooks/         自訂 Hooks
```

### 主要資源
- **音效庫**: `public/audio/` - 分類完整的音效資源
- **圖片資源**: `public/images/` - 場景、熱點、UI
- **遊戲數據**: `src/specpack/data/` - JSON 格式的物件與互動數據
- **開發工具**: `_ghosth_addons/scripts/` - 驗證與打包腳本

### 建置與部署
```bash
# 建置生產版本
npm run build

# 預覽建置結果
npm run preview

# TypeScript 檢查
npm run lint
```

## 🔄 版本說明

### v4.0 Complete Edition
- ✅ 完整遊戲框架與場景
- ✅ 30+ 個專業音效
- ✅ 完整的 VHS 視覺效果
- ✅ 成就與進度追蹤系統

### 從 v3.2 升級
如果你之前使用 v3.2 組件庫：
- v3.2 已備份至 `optimized-project-v3.2-backup/`
- v4.0 提供完整遊戲體驗，不再是單純組件庫
- v3.2 的 AI 功能已移除（可從備份參考）

## 📦 技術棧

- **框架**: React 18 + TypeScript
- **建置工具**: Vite 5
- **樣式**: 純 CSS（無外部框架依賴）
- **字型**: VT323 (VHS 風格) + Noto Sans TC (中文)
- **音效**: Web Audio API + MP3 檔案

## ⚠️ 系統需求

- Node.js >= 18.0.0
- npm >= 9.0.0
- 現代瀏覽器（建議 Chrome/Edge）

## 🤝 支援

如有問題，請查閱：
1. [專案 README](./README.md)
2. [完整指南](./靈異連線_完整優化包_v3.2_Final/optimized-project/COMPLETE_GUIDE.md)
3. [資源文檔](./靈異連線_完整優化包_v3.2_Final/optimized-project/ASSETS.md)

---

**版本**: v4.0 Complete Edition  
**最後更新**: 2025-12-18  
**狀態**: ✅ 可立即使用
