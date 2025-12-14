# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.0] - 2024-12-14

### Added

#### 新增組件
- **FearMeter.tsx**: 恐懼值顯示組件，支持三種樣式（條形、圓形、最小化）
- **ToastProvider.tsx**: Toast 通知系統，使用 Context API 實現全局通知管理

#### 新增 Hooks
- **useAudioContext.ts**: Web Audio API 管理 Hook
  - 處理瀏覽器自動播放限制
  - 支持音量控制、循環播放、淡入淡出效果
  - 提供音效預加載和管理功能
- **useFear.ts**: 集中化恐懼值管理 Hook
  - 恐懼值增減控制
  - 閾值檢測和回調
  - 臨界狀態判斷

#### 新增管理器
- **AmbientManager.tsx**: 環境氛圍管理器
  - 根據恐懼值動態調整環境事件頻率
  - 自動播放循環背景音
  - 隨機環境事件觸發（腳步聲、靜電、耳語等）
- **JumpScareManager.ts**: 驚嚇效果管理 Hook
  - 驚嚇冷卻時間管理
  - 視覺和音效整合
  - 強度等級控制（低/中/高）
  - 每會話最大觸發次數限制

#### 新增文檔
- **SRC_ASSETS_AND_AUDIO.md**: 音頻資源完整指南
  - 必需音頻文件清單和規格
  - 音頻獲取方式和建議
  - 測試和故障排除
- **IMPLEMENTATION_NOTE.md**: 詳細實作說明
  - 完整的整合步驟
  - 各組件使用範例
  - API 參考和最佳實踐
- **USAGE_GUIDE.md**: 使用指南
  - 快速開始教程
  - 組件使用範例
  - 常見問題解答
- **DEVELOPER_GUIDE.md**: 開發者指南
  - 專案架構說明
  - API 詳細參考
  - 擴展和貢獻指南
- **PROJECT_SUMMARY.md**: 專案完整總結
- **CHANGELOG.md**: 變更日誌（本文件）

#### 新增輔助文件
- **src/components/index.ts**: 組件統一導出索引
- **src/hooks/index.ts**: Hooks 統一導出索引
- **src/managers/index.ts**: 管理器統一導出索引
- **src/examples/FullDemo.tsx**: 完整功能示範程式

### Changed

#### 架構改進
- 引入管理器層（Managers），分離複雜的遊戲系統邏輯
- 統一導出方式，簡化導入語法
- 改進 TypeScript 類型定義

#### 文檔改進
- 擴展所有組件的 JSDoc 註釋
- 添加完整的使用範例
- 改進錯誤訊息和日誌輸出

### Fixed

- 修復音頻上下文在某些瀏覽器中的初始化問題
- 改進 Toast 通知的 z-index 層級
- 修復恐懼值在邊界情況下的計算錯誤

### Security

- 確保所有音頻文件路徑驗證
- 添加輸入範圍檢查
- 改進錯誤邊界處理

### Performance

- 優化音頻源管理，避免內存洩漏
- 實現事件防抖，減少不必要的重渲染
- 改進驚嚇效果的動畫性能

### Developer Experience

- 添加完整的 TypeScript 類型支援
- 提供詳細的 API 文檔
- 創建可運行的完整示範

---

## [3.1.0] - Previous Release

### Added
- 基礎 UI 組件（Button, LoadingSpinner, Tooltip 等）
- 基礎 Hooks（useGyroParallax, useSoulBinding 等）
- Tailwind CSS 自定義主題
- ESLint 和 Prettier 配置

### Changed
- 項目結構優化
- 樣式系統統一

---

## 版本說明

### 版本號格式

版本號遵循語義化版本規範：`主版本號.次版本號.修訂號`

- **主版本號（Major）**: 不兼容的 API 變更
- **次版本號（Minor）**: 向後兼容的功能新增
- **修訂號（Patch）**: 向後兼容的問題修正

### 變更類型

- **Added**: 新增功能
- **Changed**: 既有功能的變更
- **Deprecated**: 即將移除的功能
- **Removed**: 已移除的功能
- **Fixed**: 錯誤修正
- **Security**: 安全性修正
- **Performance**: 性能改進
- **Developer Experience**: 開發體驗改進

---

## 未來規劃

### [3.3.0] - Planned

#### 計劃新增
- [ ] 多語言支援（i18n）
- [ ] 本地存儲持久化（LocalStorage）
- [ ] 更多音效預設
- [ ] 自定義主題系統
- [ ] 性能監控面板

#### 計劃改進
- [ ] 音頻預加載優化
- [ ] 更多驚嚇效果變體
- [ ] 可配置的環境事件
- [ ] 更詳細的文檔和教程

#### 計劃修復
- [ ] 已知的小型 UI 問題
- [ ] 改進移動端支持

---

## 貢獻指南

發現 Bug 或有建議？歡迎：
1. 提交 Issue 描述問題
2. Fork 專案並創建功能分支
3. 提交 Pull Request

---

## 授權

MIT License

---

**維護者**: 靈異連線開發團隊  
**聯繫方式**: 請通過 GitHub Issues

---

**註**: 此專案不包含二進制音頻文件。請參閱 `SRC_ASSETS_AND_AUDIO.md` 了解如何準備音頻資源。
