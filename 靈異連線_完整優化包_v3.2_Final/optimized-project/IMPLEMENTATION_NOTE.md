# 實作說明文件

## 概述

本文件提供將新增的 UX/UI 組件、Hooks 和管理器整合到 GhostH 專案的詳細說明。

## 新增的檔案清單

### 組件（Components）

```
src/components/
├── FearMeter.tsx          - 恐懼值顯示組件
└── ToastProvider.tsx      - Toast 通知系統 Provider
```

### Hooks

```
src/hooks/
├── useAudioContext.ts     - 音頻上下文管理
└── useFear.ts            - 集中化恐懼值管理
```

### 管理器（Managers）

```
src/managers/
├── AmbientManager.tsx     - 環境氛圍管理器
└── JumpScareManager.ts    - 驚嚇效果管理器
```

### 文檔

```
靈異連線_完整優化包_v3.2_Final/optimized-project/
├── SRC_ASSETS_AND_AUDIO.md     - 音頻資源指南
└── IMPLEMENTATION_NOTE.md       - 本文件
```

## 快速開始

### 1. 包裹應用程式

首先，需要在應用程式的最外層包裹必要的 Provider：

```tsx
// src/App.tsx 或 src/main.tsx
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider maxToasts={5}>
        {/* 您的應用內容 */}
        <YourAppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
```

### 2. 初始化音頻上下文

⚠️ **重要**：由於瀏覽器的自動播放限制，音頻上下文必須在用戶互動後才能啟用。

```tsx
import { useAudioContext } from './hooks/useAudioContext';

function GameStart() {
  const { enableAudio, isAudioEnabled } = useAudioContext();

  const handleStartGame = async () => {
    // 首次啟動時啟用音頻
    if (!isAudioEnabled) {
      const success = await enableAudio();
      if (success) {
        console.log('Audio enabled');
      } else {
        console.warn('Failed to enable audio');
      }
    }
    
    // 開始遊戲邏輯...
  };

  return (
    <button onClick={handleStartGame}>
      開始遊戲 {!isAudioEnabled && '（將啟用音效）'}
    </button>
  );
}
```

## 組件使用指南

### FearMeter - 恐懼值顯示

```tsx
import { FearMeter } from './components/FearMeter';
import { useFear } from './hooks/useFear';

function GameUI() {
  const { fearLevel } = useFear({ initialFear: 0 });

  return (
    <div className="game-ui">
      {/* 條形樣式 */}
      <FearMeter 
        fearLevel={fearLevel} 
        variant="bar" 
        showLabel={true}
      />
      
      {/* 圓形樣式 */}
      <FearMeter 
        fearLevel={fearLevel} 
        variant="circle" 
        showLabel={true}
      />
      
      {/* 最小化樣式 */}
      <FearMeter 
        fearLevel={fearLevel} 
        variant="minimal" 
        showLabel={false}
      />
    </div>
  );
}
```

### ToastProvider - 通知系統

```tsx
import { useToast } from './components/ToastProvider';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleAction = async () => {
    try {
      // 執行操作...
      success('操作成功！');
    } catch (err) {
      error('操作失敗，請重試。');
    }
  };

  return (
    <button onClick={handleAction}>執行操作</button>
  );
}
```

## Hooks 使用指南

### useFear - 恐懼值管理

```tsx
import { useFear } from './hooks/useFear';

function GameLogic() {
  const { 
    fearLevel, 
    increaseFear, 
    decreaseFear, 
    setFear,
    resetFear,
    isCriticalFear,
    fearPercentage
  } = useFear({
    initialFear: 0,
    minFear: 0,
    maxFear: 100,
    onFearChange: (newFear) => {
      console.log('Fear changed to:', newFear);
    },
    onFearThreshold: (threshold) => {
      console.log('Crossed threshold:', threshold);
    }
  });

  const handleScaryEvent = () => {
    increaseFear(10); // 增加 10 點恐懼值
  };

  const handleCalmEvent = () => {
    decreaseFear(5); // 減少 5 點恐懼值
  };

  return (
    <div>
      <p>當前恐懼值：{fearLevel}</p>
      {isCriticalFear && <p className="text-red-500">極度恐懼！</p>}
      <button onClick={handleScaryEvent}>觸發恐怖事件</button>
      <button onClick={handleCalmEvent}>冷靜下來</button>
      <button onClick={resetFear}>重置恐懼值</button>
    </div>
  );
}
```

### useAudioContext - 音頻管理

```tsx
import { useAudioContext } from './hooks/useAudioContext';

function AudioControls() {
  const { 
    audioContext,
    isAudioEnabled, 
    isAudioSupported,
    enableAudio, 
    playSound,
    stopAllSounds
  } = useAudioContext();

  const handlePlayAmbient = async () => {
    await enableAudio(); // 確保音頻已啟用
    
    await playSound('/sounds/hospital_hum.mp3', {
      volume: 0.5,
      loop: true,
      fadeIn: 2000 // 2秒淡入
    });
  };

  const handlePlayJumpScare = async () => {
    await playSound('/sounds/woman_scream.mp3', {
      volume: 1.0
    });
  };

  return (
    <div>
      {!isAudioSupported && <p>您的瀏覽器不支援音頻</p>}
      <button onClick={enableAudio} disabled={isAudioEnabled}>
        {isAudioEnabled ? '音頻已啟用' : '啟用音頻'}
      </button>
      <button onClick={handlePlayAmbient}>播放環境音</button>
      <button onClick={handlePlayJumpScare}>播放驚嚇音效</button>
      <button onClick={stopAllSounds}>停止所有音效</button>
    </div>
  );
}
```

## 管理器使用指南

### AmbientManager - 環境管理

```tsx
import { useState } from 'react';
import AmbientManager from './managers/AmbientManager';
import { useFear } from './hooks/useFear';

function Game() {
  const { fearLevel } = useFear();
  const [isGameActive, setIsGameActive] = useState(false);

  const handleAmbientEvent = (eventType: string) => {
    console.log('Ambient event:', eventType);
    // 可以在這裡添加視覺效果或其他反應
  };

  return (
    <AmbientManager
      fearLevel={fearLevel}
      isActive={isGameActive}
      onAmbientEvent={handleAmbientEvent}
    >
      <div>
        <button onClick={() => setIsGameActive(!isGameActive)}>
          {isGameActive ? '暫停' : '開始'} 環境音效
        </button>
        {/* 遊戲內容 */}
      </div>
    </AmbientManager>
  );
}
```

### useJumpScareManager - 驚嚇管理

```tsx
import { useJumpScareManager } from './managers/JumpScareManager';
import { useFear } from './hooks/useFear';

function ScaryScene() {
  const { fearLevel } = useFear();
  const { 
    triggerJumpScare, 
    canTriggerJumpScare,
    jumpScareCount 
  } = useJumpScareManager(fearLevel, {
    minCooldown: 30000,      // 30秒冷卻
    maxPerSession: 10,       // 每次最多10次
    fearThreshold: 30        // 需要至少30點恐懼值
  });

  const handleTriggerScare = async () => {
    const success = await triggerJumpScare({
      intensity: 'high',
      duration: 2000,
      sound: '/sounds/woman_scream.mp3',
      visualEffect: true,
      onComplete: () => {
        console.log('Jump scare completed');
      }
    });

    if (success) {
      console.log('Jump scare triggered!');
    } else {
      console.log('Could not trigger jump scare');
    }
  };

  return (
    <div>
      <button 
        onClick={handleTriggerScare}
        disabled={!canTriggerJumpScare}
      >
        觸發驚嚇 ({jumpScareCount}/10)
      </button>
      {!canTriggerJumpScare && (
        <p className="text-sm text-gray-500">
          驚嚇冷卻中或條件不足...
        </p>
      )}
    </div>
  );
}
```

## 完整整合範例

這裡提供一個完整的整合範例：

```tsx
// src/App.tsx
import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider, useToast } from './components/ToastProvider';
import { FearMeter } from './components/FearMeter';
import { Button } from './components/Button';
import { useFear } from './hooks/useFear';
import { useAudioContext } from './hooks/useAudioContext';
import { useJumpScareManager } from './managers/JumpScareManager';
import AmbientManager from './managers/AmbientManager';
import FlashlightCursor from './components/FlashlightCursor';

function GameContent() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { success, error } = useToast();
  const { enableAudio, isAudioEnabled } = useAudioContext();
  
  const { 
    fearLevel, 
    increaseFear, 
    decreaseFear, 
    isCriticalFear 
  } = useFear({
    initialFear: 0,
    onFearThreshold: (threshold) => {
      if (threshold === 50) {
        success('恐懼值達到 50%！');
      } else if (threshold === 75) {
        error('恐懼值超過 75%！小心！');
      }
    }
  });

  const { triggerJumpScare, canTriggerJumpScare } = useJumpScareManager(
    fearLevel,
    { fearThreshold: 30 }
  );

  const handleStartGame = async () => {
    // 啟用音頻
    const audioEnabled = await enableAudio();
    if (audioEnabled) {
      success('遊戲開始！音效已啟用');
      setIsGameStarted(true);
    } else {
      error('無法啟用音效，但遊戲仍可繼續');
      setIsGameStarted(true);
    }
  };

  const handleScaryEvent = async () => {
    increaseFear(15);
    if (canTriggerJumpScare && Math.random() > 0.7) {
      await triggerJumpScare({ intensity: 'medium' });
    }
  };

  return (
    <AmbientManager
      fearLevel={fearLevel}
      isActive={isGameStarted}
      onAmbientEvent={(eventType) => {
        console.log('Ambient event:', eventType);
      }}
    >
      <FlashlightCursor fearLevel={fearLevel} enabled={isGameStarted} />
      
      <div className="min-h-screen bg-bg-deepest text-text-high p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-horror-primary">
            靈異連線
          </h1>

          {/* 恐懼值顯示 */}
          <div className="mb-8">
            <FearMeter 
              fearLevel={fearLevel} 
              variant="bar" 
              showLabel={true}
            />
          </div>

          {/* 遊戲控制 */}
          {!isGameStarted ? (
            <Button 
              onClick={handleStartGame}
              variant="primary"
              fullWidth
            >
              開始遊戲
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={handleScaryEvent}
                  variant="danger"
                >
                  觸發恐怖事件
                </Button>
                <Button 
                  onClick={() => decreaseFear(10)}
                  variant="secondary"
                >
                  冷靜下來
                </Button>
              </div>

              {isCriticalFear && (
                <div className="bg-horror-secondary/20 border-2 border-horror-secondary rounded p-4 animate-pulse">
                  <p className="text-horror-secondary font-bold">
                    ⚠️ 極度恐懼！您可能會遇到更多超自然現象...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AmbientManager>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider maxToasts={5}>
        <GameContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
```

## 音頻資源設置

請參閱 `SRC_ASSETS_AND_AUDIO.md` 文件以了解：

- 需要的音頻文件清單
- 文件放置位置
- 音頻規格建議
- 獲取音頻資源的方式

## 樣式和主題

所有組件使用專案現有的 Tailwind CSS 類別，包括：

- `bg-bg-deepest`, `bg-bg-deep`, `bg-bg-surface` - 背景色
- `text-text-high`, `text-text-medium`, `text-text-low` - 文字色
- `border-horror-primary`, `border-horror-secondary` - 邊框色
- `shadow-horror-glow`, `shadow-horror-red` - 陰影效果

確保您的 `tailwind.config.js` 包含這些自定義顏色。

## 注意事項

### 音頻自動播放限制

⚠️ 現代瀏覽器（Chrome, Firefox, Safari）限制自動播放音頻：

- **必須在用戶互動後啟用**：點擊、觸摸等
- 首次播放前調用 `enableAudio()`
- 為用戶提供明確的「啟用音效」按鈕

### 性能優化

- **限制同時播放的音效數量**：避免音頻重疊過多
- **使用音頻池**：重用 AudioBufferSourceNode
- **預加載常用音效**：減少延遲

### 無障礙性

所有組件都包含適當的 ARIA 屬性：

- `role="meter"` - FearMeter
- `role="alert"` - Toast
- `aria-live="polite"` - 動態內容通知

## 故障排除

### 音頻無法播放

1. 檢查文件是否存在於 `public/sounds/` 目錄
2. 確保在用戶互動後調用 `enableAudio()`
3. 檢查瀏覽器控制台的錯誤訊息
4. 驗證音頻文件格式（建議使用 MP3）

### Toast 不顯示

1. 確保 `<ToastProvider>` 包裹在應用最外層
2. 檢查是否正確使用 `useToast()` hook
3. 驗證 z-index 設置（Toast 使用 `z-[9999]`）

### 恐懼值沒有更新

1. 確保使用 `useFear()` hook 的返回值
2. 檢查 `onFearChange` 回調是否正確設置
3. 驗證恐懼值範圍（預設 0-100）

## 進一步開發

### 擴展功能建議

1. **音效預加載器**：實作音效預加載以減少延遲
2. **音量控制**：添加全局音量設置
3. **恐懼值持久化**：將恐懼值保存到 localStorage
4. **多語言支援**：為通知訊息添加國際化

### 自定義主題

可以通過 Tailwind 配置自定義主題顏色：

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'horror-primary': '#your-color',
        'horror-secondary': '#your-color',
        // ...
      }
    }
  }
}
```

## 參考資源

- [React 文檔](https://react.dev/)
- [TypeScript 文檔](https://www.typescriptlang.org/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Tailwind CSS](https://tailwindcss.com/)

## 支援和回饋

如有問題或建議，請：

1. 查看 `SRC_ASSETS_AND_AUDIO.md` 音頻相關問題
2. 檢查專案的 GitHub Issues
3. 聯繫開發團隊

---

**版本**：1.0.0  
**最後更新**：2024-12-14  
**維護者**：GhostH 開發團隊
