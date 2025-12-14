# 靈異連線 - UX/UI 優化包使用指南

## 快速開始

### 1. 查看完整示範

最快的方式是直接運行完整示範：

```tsx
// 在 src/main.tsx 中
import FullDemo from './examples/FullDemo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FullDemo />
  </React.StrictMode>,
);
```

### 2. 在現有專案中整合

#### 步驟 1: 包裹應用程式

```tsx
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider maxToasts={5}>
        <YourApp />
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

#### 步驟 2: 使用組件

```tsx
import { FearMeter, Button, Tooltip } from './components';
import { useFear } from './hooks';

function GameUI() {
  const { fearLevel, increaseFear, decreaseFear } = useFear();

  return (
    <div>
      <FearMeter fearLevel={fearLevel} variant="bar" />
      
      <Tooltip text="增加恐懼值">
        <Button onClick={() => increaseFear(10)} variant="danger">
          恐怖事件
        </Button>
      </Tooltip>
    </div>
  );
}
```

## 組件清單

### 新增的 UX/UI 組件

| 組件 | 用途 | 檔案位置 |
|------|------|----------|
| `FearMeter` | 恐懼值顯示（條形/圓形/最小化） | `src/components/FearMeter.tsx` |
| `ToastProvider` | Toast 通知系統 Provider | `src/components/ToastProvider.tsx` |
| `useAudioContext` | 音頻上下文管理 Hook | `src/hooks/useAudioContext.ts` |
| `useFear` | 恐懼值管理 Hook | `src/hooks/useFear.ts` |
| `AmbientManager` | 環境氛圍管理器 | `src/managers/AmbientManager.tsx` |
| `useJumpScareManager` | 驚嚇效果管理 Hook | `src/managers/JumpScareManager.ts` |

### 現有組件（已優化）

- `LoadingSpinner` - 載入指示器
- `ErrorBoundary` - 錯誤邊界
- `Button` - 帶載入/禁用狀態的按鈕
- `Tooltip` - 工具提示
- `Toast` - 通知提示
- `FlashlightCursor` - 手電筒游標效果

## 使用範例

### 1. 基本整合

```tsx
import { useState } from 'react';
import { ErrorBoundary, ToastProvider, useToast, Button, FearMeter } from './components';
import { useFear, useAudioContext } from './hooks';
import { AmbientManager } from './managers';

function Game() {
  const { fearLevel, increaseFear } = useFear();
  const { enableAudio, isAudioEnabled } = useAudioContext();
  const { success } = useToast();

  return (
    <AmbientManager fearLevel={fearLevel} isActive={true}>
      <div>
        <FearMeter fearLevel={fearLevel} />
        <Button onClick={() => {
          increaseFear(10);
          success('恐懼值增加了！');
        }}>
          恐怖事件
        </Button>
      </div>
    </AmbientManager>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Game />
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

### 2. 使用驚嚇效果

```tsx
import { useJumpScareManager } from './managers';
import { useFear } from './hooks';

function ScaryScene() {
  const { fearLevel } = useFear();
  const { triggerJumpScare, canTriggerJumpScare } = useJumpScareManager(fearLevel);

  return (
    <button 
      onClick={() => triggerJumpScare({ intensity: 'high' })}
      disabled={!canTriggerJumpScare}
    >
      觸發驚嚇
    </button>
  );
}
```

### 3. 音頻控制

```tsx
import { useAudioContext } from './hooks';

function AudioControl() {
  const { enableAudio, playSound, isAudioEnabled } = useAudioContext();

  return (
    <div>
      <button onClick={enableAudio}>
        {isAudioEnabled ? '音效已啟用' : '啟用音效'}
      </button>
      
      <button onClick={() => playSound('/sounds/hospital_hum.mp3', { 
        loop: true, 
        volume: 0.5 
      })}>
        播放背景音
      </button>
    </div>
  );
}
```

### 4. 完整的 Toast 使用

```tsx
import { useToast } from './components/ToastProvider';

function Actions() {
  const { success, error, warning, info } = useToast();

  return (
    <div>
      <button onClick={() => success('成功訊息')}>成功</button>
      <button onClick={() => error('錯誤訊息')}>錯誤</button>
      <button onClick={() => warning('警告訊息')}>警告</button>
      <button onClick={() => info('資訊訊息')}>資訊</button>
    </div>
  );
}
```

## 目錄結構

```
src/
├── components/          # UI 組件
│   ├── index.ts        # 組件導出索引 ✨ NEW
│   ├── FearMeter.tsx   # 恐懼值顯示 ✨ NEW
│   ├── ToastProvider.tsx # Toast Provider ✨ NEW
│   ├── Button.tsx
│   ├── LoadingSpinner.tsx
│   ├── Tooltip.tsx
│   ├── ErrorBoundary.tsx
│   ├── FlashlightCursor.tsx
│   └── ... (其他組件)
│
├── hooks/              # 自定義 Hooks
│   ├── index.ts        # Hooks 導出索引 ✨ NEW
│   ├── useAudioContext.ts # 音頻管理 ✨ NEW
│   ├── useFear.ts      # 恐懼值管理 ✨ NEW
│   └── ... (其他 hooks)
│
├── managers/           # 遊戲管理器 ✨ NEW
│   ├── index.ts        # 管理器導出索引 ✨ NEW
│   ├── AmbientManager.tsx # 環境管理 ✨ NEW
│   └── JumpScareManager.ts # 驚嚇管理 ✨ NEW
│
├── examples/           # 使用範例
│   └── FullDemo.tsx    # 完整示範 ✨ NEW
│
├── App.tsx
└── main.tsx
```

## 音頻資源設置

請參閱 `SRC_ASSETS_AND_AUDIO.md` 以了解：

- 必需的音頻文件清單
- 文件放置位置 (`public/sounds/`)
- 音頻規格建議
- 如何獲取音頻資源

**重要**: 此包不包含二進制音頻文件，您需要自行準備音效檔案。

## TypeScript 支援

所有組件和 Hooks 都有完整的 TypeScript 類型定義：

```tsx
import type { UseFearReturn, JumpScareOptions } from './hooks';
import type { ToastType } from './components';

// 類型安全的使用
const fearHook: UseFearReturn = useFear();
const jumpScareOptions: JumpScareOptions = {
  intensity: 'high',
  duration: 2000
};
```

## 最佳實踐

### 1. 音頻初始化

始終在用戶互動後啟用音頻：

```tsx
const handleUserClick = async () => {
  await enableAudio(); // 必須在用戶互動中調用
  // 然後可以播放音效
};
```

### 2. 恐懼值管理

使用 `useFear` Hook 集中管理恐懼值：

```tsx
const { fearLevel, increaseFear } = useFear({
  onFearThreshold: (threshold) => {
    if (threshold >= 75) {
      // 觸發特殊事件
    }
  }
});
```

### 3. 錯誤處理

始終使用 `ErrorBoundary` 包裹應用：

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('App error:', error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>
```

### 4. 性能優化

- 限制同時播放的音效數量
- 使用 `canTriggerJumpScare` 檢查驚嚇冷卻
- Toast 最多顯示 5 個

## 故障排除

### 音頻無法播放

1. 確保在用戶互動後調用 `enableAudio()`
2. 檢查音頻文件是否存在於 `public/sounds/`
3. 查看瀏覽器控制台的錯誤訊息

### Toast 不顯示

1. 確保 `<ToastProvider>` 在應用最外層
2. 檢查 z-index 設置

### TypeScript 錯誤

1. 確保已安裝所有依賴：`npm install`
2. 檢查 `tsconfig.json` 配置

## 相關文檔

- `IMPLEMENTATION_NOTE.md` - 詳細的實作說明
- `SRC_ASSETS_AND_AUDIO.md` - 音頻資源指南
- `INSTALLATION_GUIDE.md` - 安裝指南
- `QUICKSTART.md` - 快速開始

## 授權

MIT License

---

**版本**: 3.2.0  
**最後更新**: 2024-12-14  
**維護者**: GhostH 開發團隊
