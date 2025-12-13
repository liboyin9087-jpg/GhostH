# 靈異連線：蝕骨杏林 - 完整優化包 v2.0

這是一個完整的優化組件包，包含所有可直接使用的 UI/UX 改進、AI 服務升級和音效系統。

---

## 📦 包含內容

### 1. 視覺優化組件（全部可用）
- **CRTOverlay.tsx** - CRT 雜訊濾鏡系統
- **FlashlightCursor.tsx** - 手電筒游標效果
- **FocusTrap.tsx** - 防逃跑機制（Meta Horror）
- **CursedButton.tsx** - 詛咒按鈕效果

### 2. AI 服務優化（全部可用）
- **geminiService.ts** - 完整重寫，包含：
  - 恐懼值參數整合
  - 台灣民俗知識庫（三魂七魄、祭改、本命燈）
  - 結構化 JSON 輸出
  - 本地備援機制
  - 4個核心函數：generateGhostMessage、interpretRitual、analyzeClue、getFearLevelWarning

### 3. 音效系統（全部可用）
- **useSound.ts** - 完整的 Web Audio API 音效管理
  - 訊息提示音
  - 金屬摩擦聲
  - 尖銳爆破音
  - 心跳聲
  - 白噪音
  - 環境底噪

### 4. 文檔
- **INSTALLATION_GUIDE.md** - 完整的安裝與整合指南（11KB）
- **故事大綱與敘事結構.md** - 30分鐘 Demo 完整腳本（14KB）
- **UI_UX_完整優化建議.md** - 技術實作細節（21KB）

### 5. 原始專案檔案
- **靈異連線_蝕骨杏林---企劃檔案_已優化.zip** - 您的原始專案

---

## ✅ 我能做到的優化項目（已完成）

所有這些組件都是完整的、可直接使用的 TypeScript/React 程式碼：

| 類別 | 項目 | 狀態 | 檔案位置 |
|------|------|------|----------|
| 視覺 | CRT 雜訊濾鏡 | ✅ | components/CRTOverlay.tsx |
| 視覺 | 手電筒游標 | ✅ | components/FlashlightCursor.tsx |
| 視覺 | 恐懼值 CSS 連動 | ✅ | INSTALLATION_GUIDE.md (CSS範例) |
| 互動 | 防逃跑機制 | ✅ | components/FocusTrap.tsx |
| 互動 | 詛咒按鈕 | ✅ | components/CursedButton.tsx |
| AI | Gemini 服務優化 | ✅ | services/geminiService.ts |
| 音效 | Web Audio 系統 | ✅ | hooks/useSound.ts |
| 手機 | 觸覺反饋程式碼 | ✅ | INSTALLATION_GUIDE.md (範例) |

---

## ⚠️ 需要您提供的項目

這些項目我無法生成，但我在安裝指南中提供了替代方案：

| 類別 | 項目 | 替代方案 |
|------|------|----------|
| 音效 | 高品質錄製音檔 | Web Audio API 程序化生成 |
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
