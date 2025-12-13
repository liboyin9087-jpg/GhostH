# 優化包檔案結構說明

## 完整目錄樹

```
靈異連線_優化包_v2.0/
│
├── README.md                                    # 優化包總覽與快速開始指南
├── INSTALLATION_GUIDE.md                        # 完整的安裝與整合教學（必讀）
├── 故事大綱與敘事結構.md                        # 30分鐘 Demo 完整腳本設計
├── UI_UX_完整優化建議.md                        # 技術實作細節與設計理念
│
├── optimized-project/                           # 所有優化程式碼（可直接複製使用）
│   │
│   ├── src/
│   │   │
│   │   ├── components/                          # React 組件
│   │   │   ├── CRTOverlay.tsx                  # CRT 雜訊濾鏡（視覺氛圍）
│   │   │   ├── FlashlightCursor.tsx            # 手電筒游標效果（限制視野）
│   │   │   ├── FocusTrap.tsx                   # 防逃跑機制（Meta Horror）
│   │   │   └── CursedButton.tsx                # 詛咒按鈕（互動效果）
│   │   │
│   │   ├── services/                            # 核心服務
│   │   │   └── geminiService.ts                # 優化的 AI 服務（整合恐懼值與民俗知識）
│   │   │
│   │   └── hooks/                               # 自訂 Hooks
│   │       └── useSound.ts                     # 音效管理系統（Web Audio API）
│   │
│   └── README.md                                # src 目錄說明
│
└── original-project/                            # 原始專案備份
    └── 靈異連線_蝕骨杏林---企劃檔案_已優化.zip  # 您上傳的原始專案檔案
```

---

## 檔案用途快速索引

### 📚 文檔類（必讀）

| 檔案名稱 | 用途 | 優先級 | 閱讀時間 |
|---------|------|--------|----------|
| README.md | 優化包總覽，快速了解包含內容 | 🔥🔥🔥 | 5 分鐘 |
| INSTALLATION_GUIDE.md | 分步安裝教學，整合範例 | 🔥🔥🔥 | 15 分鐘 |
| 故事大綱與敘事結構.md | Demo 敘事設計，角色設定，時間軸 | 🔥🔥 | 20 分鐘 |
| UI_UX_完整優化建議.md | 設計理念，技術細節，進階優化 | 🔥 | 30 分鐘 |

### 💻 程式碼類（可直接使用）

| 檔案路徑 | 功能描述 | 實作難度 | 預期效果 |
|---------|---------|---------|---------|
| components/CRTOverlay.tsx | 老舊監視器視覺效果 | ⭐ 簡單 | 立即提升恐怖氛圍 |
| components/FocusTrap.tsx | 切換分頁驚嚇 | ⭐⭐ 中等 | 打破第四面牆 |
| components/FlashlightCursor.tsx | 限制視野的手電筒 | ⭐⭐ 中等 | 探索感與壓迫感 |
| components/CursedButton.tsx | 按鈕懸停變異 | ⭐ 簡單 | 強化品牌一致性 |
| services/geminiService.ts | AI 對話生成服務 | ⭐⭐⭐ 困難 | 文化深度提升 |
| hooks/useSound.ts | 音效管理系統 | ⭐⭐ 中等 | 完整聽覺反饋 |

---

## 使用流程建議

### 步驟 1：閱讀文檔（30 分鐘）
1. 先閱讀 `README.md` 了解整體內容
2. 詳細閱讀 `INSTALLATION_GUIDE.md` 的「快速安裝」章節
3. 瀏覽 `故事大綱與敘事結構.md` 了解設計理念

### 步驟 2：備份原始專案（5 分鐘）
```bash
cp -r your-project your-project-backup-$(date +%Y%m%d)
```

### 步驟 3：複製組件（10 分鐘）
```bash
# 假設您的專案在 ~/my-project
cd ~/my-project

# 複製組件
cp path/to/optimized-project/src/components/*.tsx src/components/

# 複製服務
cp path/to/optimized-project/src/services/geminiService.ts src/services/

# 複製 hooks
cp path/to/optimized-project/src/hooks/*.ts src/hooks/
```

### 步驟 4：整合到 App.tsx（30 分鐘）
按照 `INSTALLATION_GUIDE.md` 的指示修改 App.tsx

### 步驟 5：測試（15 分鐘）
```bash
npm run dev
```
逐一檢查每個功能是否正常運作

---

## 重要注意事項

### ✅ 這些組件是完整且可用的
- 所有 TypeScript 組件都已包含完整的類型定義
- 所有功能都已經過邏輯驗證
- 所有 CSS 動畫都已嵌入組件中
- 不需要額外下載任何外部資源

### ⚠️ 需要您設定的項目
1. **環境變數**：在專案根目錄創建 `.env` 並加入 `VITE_GEMINI_API_KEY`
2. **套件相依性**：確保已安裝 `@google/genai` 和 `lucide-react`
3. **類型定義**：確保 `src/types.ts` 包含必要的介面（參考原始專案）

### 📦 原始專案位置
您的原始專案備份在：`original-project/靈異連線_蝕骨杏林---企劃檔案_已優化.zip`

如果整合過程中出現問題，可隨時解壓縮原始專案重新開始。

---

## 各組件間的相依關係

```
App.tsx (主應用)
    ├─── CRTOverlay (獨立，無相依)
    ├─── FocusTrap (需要 onFearIncrease 回調)
    ├─── FlashlightCursor (需要 fearLevel prop)
    ├─── CursedButton (獨立，可替換任何 button)
    │
    ├─── SpectralPhone (原有組件)
    │       └─── geminiService.generateGhostMessage (需要 fearLevel)
    │
    ├─── RitualCanvas (原有組件)
    │       ├─── geminiService.interpretRitual
    │       └─── useSound.playExplosion
    │
    └─── FearMeter (原有組件)
            └─── 監聽 fearLevel 變化
```

### 整合順序建議
1. 先整合獨立組件（CRTOverlay）
2. 再整合需要回調的組件（FocusTrap）
3. 接著整合需要 props 的組件（FlashlightCursor）
4. 最後升級服務層（geminiService）

---

## 疑難排解

### 問題：找不到模組
**症狀**：`Cannot find module './components/CRTOverlay'`

**解決方案**：
```bash
# 檢查檔案是否正確複製
ls -la src/components/CRTOverlay.tsx

# 檢查 tsconfig.json 的路徑設定
cat tsconfig.json | grep "baseUrl"
```

### 問題：TypeScript 類型錯誤
**症狀**：`Property 'onFearIncrease' does not exist on type...`

**解決方案**：
確保 `src/types.ts` 包含所有必要的類型定義。參考 INSTALLATION_GUIDE.md 中的範例。

### 問題：音效無法播放
**症狀**：點擊按鈕沒有聲音

**解決方案**：
瀏覽器需要用戶互動後才能播放音效。在首頁加入「啟用音效」按鈕：
```tsx
<button onClick={() => initAudioContext()}>
  點擊啟用音效
</button>
```

---

## 額外資源

### 相關檔案對照表

| 我提供的檔案 | 對應您原始專案的檔案 | 關係 |
|------------|-------------------|------|
| geminiService.ts | services/geminiService.ts | 完整替換 |
| CRTOverlay.tsx | (新增) | 新組件 |
| FocusTrap.tsx | (新增) | 新組件 |
| FlashlightCursor.tsx | (新增) | 新組件 |
| CursedButton.tsx | (新增) | 可選替換原有按鈕 |
| useSound.ts | (新增) | 新 Hook |

### 測試檢查清單

完成整合後，請依序確認：

- [ ] 頁面載入時能看到 CRT 掃描線
- [ ] 切換分頁再回來會觸發驚嚇效果
- [ ] 恐懼值增加時文字顏色逐漸變紅
- [ ] 滑鼠懸停按鈕時文字會改變
- [ ] SpectralPhone 的對話根據恐懼值變化
- [ ] 點擊啟用音效後可以聽到聲音
- [ ] 手電筒效果（如啟用）跟隨滑鼠
- [ ] 所有原有功能正常運作

---

## 版本與更新

**當前版本**：v2.0  
**發布日期**：2025-12-12  

如需更新或有問題，請參考：
- 技術問題：查閱 `INSTALLATION_GUIDE.md` 的疑難排解章節
- 設計問題：參考 `UI_UX_完整優化建議.md`
- 敘事問題：參考 `故事大綱與敘事結構.md`

---

祝您整合順利！這些優化將顯著提升您的 Demo 品質。
