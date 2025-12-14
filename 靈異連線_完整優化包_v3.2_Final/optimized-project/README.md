# 靈異連線：蝕骨杏林 - 完整優化包 v3.2.0 ✨

這是一個完整的優化組件包，包含所有可直接使用的 UI/UX 改進、遊戲管理系統、AI 服務升級和音效系統。

> **🆕 v3.2 新增**: 恐懼值系統、音頻管理、驚嚇效果、環境管理器、完整示範程式和開發者文檔！

---

## 🚀 快速開始

### 查看完整示範

```bash
# 1. 安裝依賴
npm install

# 2. 運行開發服務器
npm run dev

# 3. 在 src/main.tsx 中使用示範
import FullDemo from './examples/FullDemo';
```

👉 **詳細指南**: 查看 `USAGE_GUIDE.md` 了解完整使用說明

---

## 📦 包含內容

### 🆕 v3.2 新增組件

#### 遊戲系統組件
- **FearMeter.tsx** - 恐懼值顯示（條形/圓形/最小化三種樣式）
- **ToastProvider.tsx** - Toast 通知系統（全局狀態管理）

#### 遊戲系統 Hooks
- **useAudioContext.ts** - Web Audio API 管理（音效播放、音量控制、淡入淡出）
- **useFear.ts** - 集中化恐懼值管理（閾值檢測、範圍控制）

#### 遊戲管理器
- **AmbientManager.tsx** - 環境氛圍管理（根據恐懼值動態調整）
- **JumpScareManager.ts** - 驚嚇效果管理（冷卻控制、強度等級）

#### 示範和文檔
- **FullDemo.tsx** - 完整功能示範程式（可直接運行）
- **USAGE_GUIDE.md** - 使用指南（快速開始、範例代碼）
- **DEVELOPER_GUIDE.md** - 開發者指南（API 參考、架構說明）
- **SRC_ASSETS_AND_AUDIO.md** - 音頻資源指南（音效規格、獲取方式）
- **IMPLEMENTATION_NOTE.md** - 實作說明（整合步驟、最佳實踐）
- **PROJECT_SUMMARY.md** - 專案總結（完整目錄結構）
- **CHANGELOG.md** - 變更日誌

### 視覺優化組件（現有）
- **CRTOverlay.tsx** - CRT 雜訊濾鏡系統
- **FlashlightCursor.tsx** - 手電筒游標效果（已整合恐懼值）
- **FocusTrap.tsx** - 防逃跑機制（Meta Horror）
- **CursedButton.tsx** - 詛咒按鈕效果
- **LoadingSpinner.tsx** - 載入指示器
- **ErrorBoundary.tsx** - 錯誤邊界
- **Button.tsx** - 帶載入/禁用狀態的按鈕
- **Tooltip.tsx** - 工具提示

### AI 服務優化（現有）
- **geminiService.ts** - 完整重寫，包含：
  - 恐懼值參數整合
  - 台灣民俗知識庫（三魂七魄、祭改、本命燈）
  - 結構化 JSON 輸出
  - 本地備援機制
  - 4個核心函數：generateGhostMessage、interpretRitual、analyzeClue、getFearLevelWarning

### 音效系統（現有）
- **useSound.ts** - 完整的 Web Audio API 音效管理
  - 訊息提示音、金屬摩擦聲、尖銳爆破音
  - 心跳聲、白噪音、環境底噪

---

## 📚 文檔索引

| 文檔 | 用途 | 適合對象 |
|------|------|----------|
| **README.md** | 專案概述 | 所有人 |
| **QUICKSTART.md** | 快速開始指南 | 新手 |
| **USAGE_GUIDE.md** 🆕 | 使用指南和範例 | 開發者 |
| **DEVELOPER_GUIDE.md** 🆕 | 開發者指南（API、架構） | 進階開發者 |
| **IMPLEMENTATION_NOTE.md** 🆕 | 詳細實作說明 | 開發者 |
| **SRC_ASSETS_AND_AUDIO.md** 🆕 | 音頻資源指南 | 所有人 |
| **PROJECT_SUMMARY.md** 🆕 | 專案完整總結 | 所有人 |
| **CHANGELOG.md** 🆕 | 版本變更日誌 | 開發者 |
| **INSTALLATION_GUIDE.md** | 安裝與整合指南 | 開發者 |

---

## ✨ v3.2 新功能亮點

### 🎮 完整的遊戲系統
- **恐懼值管理**: 集中化的狀態管理，支持閾值檢測
- **音效系統**: 完整的 Web Audio API 封裝，支持音量、循環、淡入淡出
- **驚嚇效果**: 冷卻控制、強度等級、視覺+音效整合
- **環境管理**: 根據恐懼值動態調整事件頻率

### 📱 改進的用戶體驗
- **Toast 通知**: 全局通知管理，支持 4 種類型
- **恐懼值顯示**: 3 種樣式可選（條形/圓形/最小化）
- **載入狀態**: 改進的載入反饋
- **錯誤處理**: ErrorBoundary 保護應用穩定性

### 🛠️ 開發者友好
- **完整示範**: FullDemo.tsx 可直接運行的完整範例
- **統一導出**: 通過 index.ts 簡化導入
- **類型安全**: 完整的 TypeScript 類型定義
- **詳細文檔**: 7 份全新文檔，涵蓋所有使用場景

---

## ✅ 優化項目完成狀態

所有組件都是完整的、可直接使用的 TypeScript/React 程式碼：

| 類別 | 項目 | 狀態 | 檔案位置 |
|------|------|------|----------|
| 🆕 遊戲系統 | 恐懼值顯示 | ✅ | components/FearMeter.tsx |
| 🆕 遊戲系統 | Toast 通知 | ✅ | components/ToastProvider.tsx |
| 🆕 遊戲系統 | 音頻管理 | ✅ | hooks/useAudioContext.ts |
| 🆕 遊戲系統 | 恐懼值管理 | ✅ | hooks/useFear.ts |
| 🆕 遊戲系統 | 環境管理 | ✅ | managers/AmbientManager.tsx |
| 🆕 遊戲系統 | 驚嚇管理 | ✅ | managers/JumpScareManager.ts |
| 🆕 示範 | 完整功能示範 | ✅ | examples/FullDemo.tsx |
| 視覺 | CRT 雜訊濾鏡 | ✅ | components/CRTOverlay.tsx |
| 視覺 | 手電筒游標 | ✅ | components/FlashlightCursor.tsx |
| 視覺 | 恐懼值 CSS 連動 | ✅ | INSTALLATION_GUIDE.md (CSS範例) |
| 互動 | 防逃跑機制 | ✅ | components/FocusTrap.tsx |
| 互動 | 詛咒按鈕 | ✅ | components/CursedButton.tsx |
| AI | Gemini 服務優化 | ✅ | services/geminiService.ts |
| 音效 | Web Audio 系統 | ✅ | hooks/useSound.ts |
| 手機 | 觸覺反饋程式碼 | ✅ | INSTALLATION_GUIDE.md (範例) |

---

## 🎯 快速使用範例

### 基本整合

```tsx
import { ErrorBoundary, ToastProvider, FearMeter, Button } from './components';
import { useFear, useAudioContext } from './hooks';
import { AmbientManager } from './managers';

function App() {
  const { fearLevel, increaseFear } = useFear();
  const { enableAudio } = useAudioContext();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AmbientManager fearLevel={fearLevel} isActive={true}>
          <FearMeter fearLevel={fearLevel} variant="bar" />
          <Button onClick={() => increaseFear(10)}>恐怖事件</Button>
        </AmbientManager>
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

### 查看完整示範

```tsx
// src/main.tsx
import FullDemo from './examples/FullDemo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FullDemo />
  </React.StrictMode>
);
```

---

## ⚠️ 重要提示

### 音頻文件
❗ **此包不包含二進制音頻文件**

您需要自行準備以下音頻文件並放置在 `public/sounds/` 目錄：
- `hospital_hum.mp3` - 醫院環境音（循環播放）
- `woman_scream.mp3` - 女性尖叫聲（驚嚇效果）
- `static_noise.mp3` - 靜電雜訊（隨機事件）
- `paper_burn.mp3` - 紙張燃燒聲（特殊效果）

👉 詳細說明請查看 `SRC_ASSETS_AND_AUDIO.md`

### 瀏覽器限制
現代瀏覽器要求音頻必須在用戶互動後才能播放。請確保在點擊/觸摸事件中調用 `enableAudio()`。

---

## 🚀 開發指令

```bash
# 安裝依賴
npm install

# 開發模式（熱重載）
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview

# 代碼檢查
npm run lint

# 代碼格式化
npm run format
```

---

## 🏗️ 項目結構

```
src/
├── components/        # UI 組件
│   ├── index.ts      🆕 組件導出索引
│   ├── FearMeter.tsx 🆕
│   ├── ToastProvider.tsx 🆕
│   └── ... (其他組件)
├── hooks/            # 自定義 Hooks
│   ├── index.ts      🆕 Hooks 導出索引
│   ├── useAudioContext.ts 🆕
│   ├── useFear.ts    🆕
│   └── ... (其他 hooks)
├── managers/         🆕 遊戲管理器
│   ├── index.ts      🆕
│   ├── AmbientManager.tsx 🆕
│   └── JumpScareManager.ts 🆕
├── examples/         # 示範程式
│   └── FullDemo.tsx  🆕
├── services/         # 服務層
└── App.tsx
```

---

## ⚠️ 需要您提供的項目

這些項目我無法生成，但我在相關文檔中提供了詳細指引：

| 類別 | 項目 | 解決方案 |
|------|------|----------|
| 音效 | 音頻文件 | 查看 SRC_ASSETS_AND_AUDIO.md 獲取資源 |
| 圖像 | 醫院廢墟照片 | 使用純 CSS 或佔位符 |
| 圖像 | 鬼魂/恐怖素材 | 使用文字與動畫效果 |
| 測試 | 手機實機測試 | 提供測試指引 |
| 部署 | Vercel/Netlify 部署 | 提供部署指引 |

---

## 🎓 學習資源

### 推薦閱讀順序
1. **README.md** (本文件) - 了解專案概況
2. **QUICKSTART.md** - 5分鐘快速開始
3. **USAGE_GUIDE.md** - 學習如何使用組件
4. **examples/FullDemo.tsx** - 查看完整範例
5. **DEVELOPER_GUIDE.md** - 深入了解 API 和架構

### API 文檔
所有組件和 Hooks 都有完整的 JSDoc 註釋和 TypeScript 類型定義。查看 `DEVELOPER_GUIDE.md` 獲取完整 API 參考。

---

## 🐛 故障排除

### 常見問題

**Q: 音效無法播放？**  
A: 確保在用戶互動後調用 `enableAudio()`。現代瀏覽器限制自動播放。

**Q: Toast 不顯示？**  
A: 確保 `<ToastProvider>` 在應用最外層，並正確使用 `useToast()` Hook。

**Q: TypeScript 錯誤？**  
A: 運行 `npm install` 安裝所有依賴，確保 React 類型已安裝。

**Q: 恐懼值沒有更新？**  
A: 檢查是否使用了 `useFear()` Hook 的返回值，而不是直接修改狀態。

更多問題請查看 `IMPLEMENTATION_NOTE.md` 的故障排除章節。

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

### 貢獻流程
1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📊 版本歷史

查看 `CHANGELOG.md` 了解詳細的版本變更記錄。

### 最近更新
- **v3.2.0** (2024-12-14) - 🆕 新增遊戲系統、完整示範和開發者文檔
- **v3.1.0** - 基礎 UI 組件和 Hooks
- **v2.0** - AI 服務和音效系統

---

## 📄 授權

MIT License

---

## 👥 團隊

**靈異連線開發團隊**

---

## 🔗 相關連結

- [React 文檔](https://react.dev/)
- [TypeScript 文檔](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 💡 技術支援

遇到問題？

1. 查看相關文檔（尤其是 `USAGE_GUIDE.md` 和 `DEVELOPER_GUIDE.md`）
2. 檢查 `IMPLEMENTATION_NOTE.md` 的故障排除章節
3. 查看 `examples/FullDemo.tsx` 的完整範例
4. 在 GitHub 提交 Issue

---

**版本**: 3.2.0  
**發布日期**: 2024-12-14  
**維護狀態**: ✅ 積極維護中

✨ 感謝使用靈異連線完整優化包！祝您開發順利！🎮👻

| 圖像 | 醫院廢墟照片 | 使用純 CSS 或佔位符 |
| 圖像 | 鬼魂/恐怖素材 | 使用文字與動畫效果 |
| 測試 | 手機實機測試 | 提供測試指引 |
| 部署 | Vercel/Netlify 部署 | 提供部署指引 |

---

## 🚀 快速開始（5 分鐘）

### 第一步：解壓縮
```bash
unzip 靈異連線_優化包_v2.0.zip
cd 靈異連線_優化包_v2.0
```

### 第二步：複製組件到您的專案
```bash
# 假設您的專案在 ~/my-project
cp -r optimized-project/src/components/* ~/my-project/src/components/
cp -r optimized-project/src/services/* ~/my-project/src/services/
cp -r optimized-project/src/hooks/* ~/my-project/src/hooks/
```

### 第三步：閱讀安裝指南
打開 `INSTALLATION_GUIDE.md`，按照步驟整合到 App.tsx

### 第四步：設定環境變數
在專案根目錄創建 `.env`：
```env
VITE_GEMINI_API_KEY=你的_API_金鑰
```

### 第五步：測試
```bash
cd ~/my-project
npm run dev
```

---

## 📁 檔案結構

```
靈異連線_優化包_v2.0/
├── README.md                          # 本文件
├── INSTALLATION_GUIDE.md              # 完整安裝指南
├── 故事大綱與敘事結構.md              # 敘事腳本
├── UI_UX_完整優化建議.md              # 技術文檔
│
├── optimized-project/                 # 優化程式碼
│   ├── src/
│   │   ├── components/
│   │   │   ├── CRTOverlay.tsx        # CRT 濾鏡
│   │   │   ├── FlashlightCursor.tsx  # 手電筒
│   │   │   ├── FocusTrap.tsx         # 防逃跑
│   │   │   └── CursedButton.tsx      # 詛咒按鈕
│   │   │
│   │   ├── services/
│   │   │   └── geminiService.ts      # AI 服務
│   │   │
│   │   └── hooks/
│   │       └── useSound.ts           # 音效系統
│   │
│   └── STRUCTURE.md                  # 目錄結構說明
│
└── original-project/                  # 您的原始專案
    └── 靈異連線_蝕骨杏林---企劃檔案_已優化.zip
```

---

## 🎯 實作優先級建議

### 立即實作（本週）- 視覺衝擊力最強
1. CRTOverlay（2小時）- 立即看到恐怖氛圍
2. FocusTrap（4小時）- Meta Horror 核心體驗
3. 恐懼值 CSS 連動（3小時）- 動態視覺反饋

**預期效果**：Demo 看起來像「被詛咒的監視器畫面」

### 第二階段（下週）- 完善互動體驗
1. geminiService 升級（2小時）- AI 對話更真實
2. useSound 整合（4小時）- 加入音效反饋
3. CursedButton 應用（2小時）- 按鈕變成「契約」

**預期效果**：完整的恐怖遊戲體驗循環

### 第三階段（後續）- 精緻化
1. FlashlightCursor 特定章節啟用
2. 手機觸覺反饋整合
3. 效能優化與測試

---

## 💡 使用範例

### 範例 1：基礎整合
```tsx
import CRTOverlay from './components/CRTOverlay';
import FocusTrap from './components/FocusTrap';

function App() {
  const [fearLevel, setFearLevel] = useState(10);
  
  return (
    <div>
      <FocusTrap onFearIncrease={(amt) => setFearLevel(prev => prev + amt)} />
      <CRTOverlay />
      {/* 您的內容 */}
    </div>
  );
}
```

### 範例 2：AI 對話整合
```tsx
import { generateGhostMessage } from './services/geminiService';

const SpectralPhone = ({ fearLevel }) => {
  const sendMessage = async () => {
    const message = await generateGhostMessage('團隊介紹', fearLevel);
    // 顯示 message
  };
};
```

### 範例 3：音效觸發
```tsx
import { useSound } from './hooks/useSound';

const RitualCanvas = () => {
  const { playExplosion } = useSound();
  
  const onRitualFail = () => {
    playExplosion();
    // 其他失敗處理
  };
};
```

---

## 📊 預期成果

完成這些優化後，您的專案將：

✅ **視覺氛圍**：從「閱讀網頁」變成「廢墟探索」  
✅ **恐怖感**：打破第四面牆，玩家感到「被監視」  
✅ **文化深度**：AI 對話融入台灣民俗知識  
✅ **互動回饋**：每個操作都有視覺/聽覺反饋  
✅ **專業度**：達到商業恐怖遊戲的品質標準

---

## 🆘 疑難排解

### 常見問題速查

**Q: 組件無法 import？**
```bash
# 檢查路徑是否正確
ls src/components/CRTOverlay.tsx
```

**Q: TypeScript 報錯？**
```bash
# 確保 types.ts 包含必要的類型定義
# 參考原始專案的 types.ts
```

**Q: 音效無法播放？**
```tsx
// 需要用戶互動後初始化
<button onClick={() => initAudioContext()}>
  啟用音效
</button>
```

**Q: 效能變慢？**
- 關閉 FlashlightCursor（較耗效能）
- 降低 CRT 濾鏡的透明度
- 減少音效觸發頻率

---

## 📞 支援資源

- **安裝指南**：`INSTALLATION_GUIDE.md` - 完整的分步說明
- **敘事設計**：`故事大綱與敘事結構.md` - 30分鐘 Demo 腳本
- **技術細節**：`UI_UX_完整優化建議.md` - 設計原理與實作方案

---

## 📜 版本資訊

**版本**：v2.0  
**發布日期**：2025-12-12  
**相容性**：
- React 18+
- TypeScript 5+
- Vite 5+
- Node.js 18+

---

## ⚖️ 授權與使用

這些組件是為《靈異連線：蝕骨杏林》專案特別設計的，您可以自由使用、修改和整合到您的募資專案中。

---

## 🎉 下一步

1. 閱讀 `INSTALLATION_GUIDE.md`
2. 複製組件到您的專案
3. 按照指南整合到 App.tsx
4. 測試每個功能
5. 部署並收集使用者反饋

祝您募資成功！這些優化將大幅提升 Demo 的專業度和沉浸感。

---

**製作者**: Claude (Anthropic)  
**專案**: 靈異連線：蝕骨杏林  
**目標**: 打造最具台灣文化特色的恐怖遊戲體驗
