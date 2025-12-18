# 靈異連線：蝕骨杏林 - 優化組件安裝指南

## 📦 檔案清單與說明

本優化包包含以下可直接使用的組件和服務：

### 核心視覺效果組件
- `src/components/CRTOverlay.tsx` - CRT 雜訊濾鏡系統（掃描線、閃爍、暗角）
- `src/components/FlashlightCursor.tsx` - 手電筒游標效果（限制視野）
- `src/components/FocusTrap.tsx` - 防逃跑機制（切換分頁驚嚇）
- `src/components/CursedButton.tsx` - 詛咒按鈕（懸停變異效果）

### 核心服務
- `src/services/geminiService.ts` - 優化的 AI 服務（加入恐懼值參數、台灣民俗知識庫、結構化輸出）

### 工具與 Hooks
- `src/hooks/useSound.ts` - 音效管理系統（Web Audio API 程序化音效）

---

## 🚀 快速安裝（3 步驟）

### 步驟 1: 備份原始檔案

```bash
# 在專案根目錄執行
cp -r src src_backup_$(date +%Y%m%d)
```

### 步驟 2: 複製優化檔案

將本優化包中的所有檔案複製到對應位置：

```bash
# 組件
cp optimized-project/src/components/*.tsx your-project/src/components/

# 服務
cp optimized-project/src/services/geminiService.ts your-project/src/services/

# Hooks
cp optimized-project/src/hooks/*.ts your-project/src/hooks/
```

### 步驟 3: 整合到 App.tsx

在您的 `src/App.tsx` 中加入以下內容：

```tsx
import React, { useState, useEffect } from 'react';

// 新增的優化組件
import CRTOverlay from './components/CRTOverlay';
import FlashlightCursor from './components/FlashlightCursor';
import FocusTrap from './components/FocusTrap';

// 原有組件（保留）
import SpectralPhone from './components/SpectralPhone';
import RitualCanvas from './components/RitualCanvas';
import FearMeter from './components/FearMeter';
// ... 其他 import

const App: React.FC = () => {
  const [fearLevel, setFearLevel] = useState(10);
  const [debuffs, setDebuffs] = useState<PlayerDebuff[]>([]);
  const [currentSection, setCurrentSection] = useState('英雄區塊');

  // 恐懼值增加處理器
  const handleFearIncrease = (amount: number) => {
    setFearLevel(prev => Math.min(100, prev + amount));
  };

  // 恐懼值連動 CSS 變數（全域視覺效果）
  useEffect(() => {
    document.documentElement.style.setProperty('--fear-level', `${fearLevel}`);
  }, [fearLevel]);

  return (
    <div className="min-h-screen bg-black text-stone-300 relative overflow-x-hidden">
      
      {/* ========================================
          第一優先級：視覺氛圍層（最高 z-index）
          ======================================== */}
      
      {/* 防逃跑機制 - z-[100] */}
      <FocusTrap onFearIncrease={handleFearIncrease} />

      {/* CRT 雜訊濾鏡 - z-[99] */}
      <CRTOverlay />

      {/* 手電筒效果 - z-[40] (可選，某些章節啟用) */}
      <FlashlightCursor 
        fearLevel={fearLevel} 
        enabled={currentSection === '玩法與系統'} // 只在特定章節啟用
      />

      {/* ========================================
          原有內容層
          ======================================== */}
      
      {/* 背景 */}
      <div className="fixed inset-0 z-0 opacity-20">
        {/* 您原有的背景設計 */}
      </div>

      {/* 主要內容 */}
      <main className="relative z-10">
        {/* 您原有的所有內容區塊 */}
        
        {/* SpectralPhone（已優化，記得傳入 fearLevel） */}
        <SpectralPhone 
          currentSection={currentSection}
          onFearIncrease={handleFearIncrease}
          onAddDebuff={addDebuff}
          fearLevel={fearLevel} // 新增參數
        />

        {/* FearMeter */}
        <FearMeter fearLevel={fearLevel} debuffs={debuffs} />
        
        {/* 其他組件... */}
      </main>
    </div>
  );
};

export default App;
```

---

## 🎨 全域 CSS 恐懼值連動（可選但推薦）

在您的 `src/index.css` 或 `src/styles/global.css` 中加入：

```css
:root {
  --fear-level: 10;
  --fear-intensity: calc(var(--fear-level) / 100);
}

/* 文字顏色根據恐懼值變紅 */
body {
  color: rgb(
    calc(200 + 55 * var(--fear-intensity)),
    calc(200 - 150 * var(--fear-intensity)),
    calc(200 - 150 * var(--fear-intensity))
  );
  transition: color 1s ease;
}

/* 背景雜訊強度增加 */
.crt-scanlines {
  opacity: calc(0.2 + 0.3 * var(--fear-intensity));
}

/* 邊框抖動 */
.section-border {
  animation: fear-shake calc(1s - 0.8s * var(--fear-intensity)) infinite;
}

@keyframes fear-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
```

---

## 🔧 geminiService.ts 特別說明

### 環境變數設定

新的 `geminiService.ts` 需要 Gemini API 金鑰。請在專案根目錄創建 `.env` 檔案：

```env
VITE_GEMINI_API_KEY=你的_API_金鑰
```

### 取得 API 金鑰

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 點擊「Create API Key」
3. 複製金鑰並貼到 `.env` 檔案

### API 使用方式升級

原本的用法：
```tsx
const message = await generateGhostMessage(currentSection);
```

優化後的用法（加入恐懼值參數）：
```tsx
const message = await generateGhostMessage(currentSection, fearLevel);
```

新增的功能：
```tsx
// 證據分析
const analysis = await analyzeClue(clueContent, fearLevel);

// 恐懼警告
const warning = await getFearLevelWarning(fearLevel);
```

---

## 🎵 音效系統使用方式

### 基礎設定

```tsx
import { useSound } from './hooks/useSound';

const MyComponent = () => {
  const { 
    initAudioContext,
    playMessageBeep, 
    playMetalScreech,
    playExplosion,
    playHeartbeat,
    startAmbientDrone
  } = useSound();

  // 首次互動時初始化（瀏覽器安全政策要求）
  const handleFirstClick = () => {
    initAudioContext();
    // 啟動環境底噪
    const stopDrone = startAmbientDrone();
    
    // 儲存停止函數以便之後使用
    // ...
  };

  return (
    <button onClick={handleFirstClick}>
      開始體驗（啟用音效）
    </button>
  );
};
```

### 音效觸發時機建議

```tsx
// 訊息提示
<SpectralPhone 
  onMessageReceived={() => playMessageBeep()}
/>

// 恐懼值達 70+
useEffect(() => {
  if (fearLevel >= 70) {
    playMetalScreech();
  }
}, [fearLevel]);

// 儀式失敗
<RitualCanvas 
  onRitualFail={() => {
    playExplosion();
    handleFearIncrease(20);
  }}
/>

// 心跳（每秒觸發）
useEffect(() => {
  if (fearLevel > 50) {
    const interval = setInterval(playHeartbeat, 1000);
    return () => clearInterval(interval);
  }
}, [fearLevel]);
```

---

## 📱 手機優化功能

### 觸覺反饋（Haptic Feedback）

在關鍵時刻加入震動反饋：

```tsx
// 儀式失敗
const onRitualFail = () => {
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 100]); // 急促短震
  }
  playExplosion();
};

// 鬼來電
const triggerIncomingCall = () => {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 400]); // 強烈長震
  }
};

// 心跳
const playHeartbeat = () => {
  if (navigator.vibrate) {
    navigator.vibrate([50, 500, 50, 500]); // 雙跳節奏
  }
};
```

### 響應式設計

新組件已內建響應式支援，但您可能需要調整現有組件：

```css
/* 手機端 SpectralPhone 全螢幕 */
@media (max-width: 768px) {
  .spectral-phone {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
```

---

## ⚠️ 注意事項與疑難排解

### 常見問題

**Q: CRT 濾鏡看不到效果？**
A: 檢查 z-index 是否被其他元素覆蓋。確保 CRTOverlay 的 z-index 為 99。

**Q: 音效無法播放？**
A: 瀏覽器需要用戶互動後才能播放音效。請在首頁加入「點擊開始」按鈕來初始化 AudioContext。

**Q: 手電筒效果太暗/太亮？**
A: 調整 FlashlightCursor 組件中的 `radius` 計算公式和 `rgba` 透明度值。

**Q: API 回應太慢？**
A: 考慮使用 `gemini-2.5-flash` 模型（更快但品質略降），或增加本地 FALLBACK_MESSAGES 的數量。

**Q: 恐懼值連動 CSS 不生效？**
A: 確認 `useEffect` 中的 CSS 變數設定有執行，並檢查瀏覽器是否支援 CSS `calc()` 函數。

### 效能優化建議

1. **手電筒效果**：避免在低階設備上啟用，或提供「關閉特效」選項
2. **音效系統**：預載入常用音效，避免首次播放延遲
3. **CRT 濾鏡**：使用 `will-change: transform` 提示瀏覽器優化

### 瀏覽器相容性

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| CRT 濾鏡 | ✅ | ✅ | ✅ | ✅ |
| 手電筒 | ✅ | ✅ | ✅ | ✅ |
| 防逃跑 | ✅ | ✅ | ✅ | ✅ |
| Web Audio | ✅ | ✅ | ⚠️ 需互動 | ✅ |
| Vibration | ✅ Android | ❌ | ❌ iOS | ✅ Android |

---

## 📊 優先級建議實作順序

### 第一週（立即可見效果）
1. ✅ CRTOverlay（2小時）
2. ✅ FocusTrap（4小時）
3. ✅ 恐懼值 CSS 連動（3小時）
4. ✅ geminiService 升級（2小時）

**預期成果**：視覺氛圍大幅提升，AI 對話更具文化深度

### 第二週（核心玩法強化）
1. ✅ useSound Hook（4小時）
2. ✅ 音效整合到關鍵事件（2小時）
3. ✅ FlashlightCursor（3小時，特定章節啟用）
4. ✅ CursedButton（2小時）

**預期成果**：互動回饋完整，恐怖氛圍達到最佳狀態

### 第三週（精緻化）
1. 手機觸覺反饋整合
2. 響應式設計微調
3. 效能優化與壓力測試
4. 使用者測試與數據收集

---

## 🧪 測試檢查清單

安裝完成後，請依序測試以下項目：

- [ ] 頁面載入後可看到 CRT 掃描線和暗角
- [ ] 切換分頁後回來會觸發「別移開視線」驚嚇
- [ ] 恐懼值從 10 增加到 100 時，文字顏色逐漸變紅
- [ ] 點擊「啟用音效」後，訊息提示會有聲音
- [ ] 手電筒效果（如果啟用）隨滑鼠移動
- [ ] 懸停 CursedButton 時文字改變且邊框抖動
- [ ] SpectralPhone 根據 fearLevel 調整對話風格
- [ ] 手機上測試震動反饋（Android Chrome）

---

## 📞 支援與協助

如果在安裝過程中遇到問題，請檢查：

1. **Node.js 版本**：建議 18.x 或以上
2. **套件版本**：確保 `@google/genai`、`lucide-react`、`react` 等套件版本相容
3. **TypeScript 錯誤**：執行 `npm run build` 檢查編譯錯誤
4. **瀏覽器控制台**：查看是否有 JavaScript 錯誤訊息

---

## 🎉 完成後的預期效果

完成所有優化後，您的專案將具備：

✅ 沉浸式的「數位廢墟」視覺氛圍  
✅ 打破第四面牆的 Meta Horror 體驗  
✅ 動態的恐懼值視覺回饋系統  
✅ 基於台灣民俗的 AI 對話生成  
✅ 完整的音效反饋循環  
✅ 手機端觸覺體驗  

這些優化將顯著提升 Demo 的專業度和恐怖感，為募資成功奠定堅實基礎。

---

**版本**: v2.0  
**更新日期**: 2025-12-12  
**相容性**: React 18+, TypeScript 5+, Vite 5+
