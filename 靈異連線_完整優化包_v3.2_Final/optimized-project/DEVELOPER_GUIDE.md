# 開發者指南

## 專案結構

### 核心架構

```
靈異連線_完整優化包_v3.2_Final/
└── optimized-project/
    ├── src/
    │   ├── components/     # UI 組件層
    │   ├── hooks/          # 業務邏輯層
    │   ├── managers/       # 遊戲管理層
    │   ├── services/       # 服務層
    │   ├── examples/       # 示範程式
    │   └── styles/         # 樣式檔案
    ├── public/
    │   ├── sounds/         # 音頻資源
    │   └── images/         # 圖片資源
    └── docs/               # 文檔
```

### 設計模式

#### 1. 關注點分離 (Separation of Concerns)

- **Components**: 純 UI 呈現，最小化業務邏輯
- **Hooks**: 封裝可復用的狀態邏輯
- **Managers**: 處理複雜的遊戲系統（音效、事件等）

#### 2. 組合模式 (Composition Pattern)

```tsx
<ErrorBoundary>
  <ToastProvider>
    <AmbientManager fearLevel={fearLevel} isActive={true}>
      <Game />
    </AmbientManager>
  </ToastProvider>
</ErrorBoundary>
```

#### 3. Hooks 模式

所有狀態管理都通過自定義 Hooks 實現：

```tsx
// 單一職責
const { fearLevel, increaseFear } = useFear();
const { enableAudio, playSound } = useAudioContext();
const { triggerJumpScare } = useJumpScareManager(fearLevel);
```

## API 參考

### FearMeter

恐懼值顯示組件，支持三種樣式。

```tsx
interface FearMeterProps {
  fearLevel: number;          // 0-100
  maxFear?: number;           // 預設 100
  showLabel?: boolean;        // 預設 true
  variant?: 'bar' | 'circle' | 'minimal';  // 預設 'bar'
}
```

**範例**:

```tsx
<FearMeter fearLevel={75} variant="circle" showLabel={true} />
```

### useFear

集中化的恐懼值管理 Hook。

```tsx
interface UseFearOptions {
  initialFear?: number;       // 預設 0
  minFear?: number;           // 預設 0
  maxFear?: number;           // 預設 100
  onFearChange?: (newFear: number) => void;
  onFearThreshold?: (threshold: number) => void;  // 跨越 25/50/75/90 時觸發
}

interface UseFearReturn {
  fearLevel: number;
  increaseFear: (amount: number) => void;
  decreaseFear: (amount: number) => void;
  setFear: (value: number) => void;
  resetFear: () => void;
  isCriticalFear: boolean;    // > 80
  fearPercentage: number;     // 百分比
}
```

**範例**:

```tsx
const { fearLevel, increaseFear, isCriticalFear } = useFear({
  initialFear: 0,
  onFearThreshold: (threshold) => {
    console.log(`Crossed threshold: ${threshold}`);
  }
});
```

### useAudioContext

Web Audio API 管理 Hook。

```tsx
interface AudioContextState {
  audioContext: AudioContext | null;
  isAudioEnabled: boolean;
  isAudioSupported: boolean;
  enableAudio: () => Promise<boolean>;
  playSound: (audioPath: string, options?: PlaySoundOptions) => Promise<void>;
  stopAllSounds: () => void;
}

interface PlaySoundOptions {
  volume?: number;      // 0-1，預設 1
  loop?: boolean;       // 預設 false
  fadeIn?: number;      // 淡入時間（毫秒），預設 0
}
```

**範例**:

```tsx
const { enableAudio, playSound, isAudioEnabled } = useAudioContext();

// 必須在用戶互動中啟用
await enableAudio();

// 播放音效
await playSound('/sounds/hospital_hum.mp3', {
  volume: 0.5,
  loop: true,
  fadeIn: 2000
});
```

### AmbientManager

環境氛圍管理器組件。

```tsx
interface AmbientManagerProps {
  fearLevel: number;           // 0-100
  isActive: boolean;           // 是否啟用
  onAmbientEvent?: (eventType: string) => void;
  children?: React.ReactNode;
}
```

**工作原理**:
- 根據恐懼值調整事件頻率
- 恐懼值越高，事件越頻繁
- 自動播放循環背景音
- 隨機觸發環境事件（腳步聲、靜電等）

**範例**:

```tsx
<AmbientManager
  fearLevel={fearLevel}
  isActive={isGameStarted}
  onAmbientEvent={(eventType) => {
    console.log('Event:', eventType);
    if (eventType === 'static') {
      increaseFear(5);
    }
  }}
>
  <GameContent />
</AmbientManager>
```

### useJumpScareManager

驚嚇效果管理 Hook。

```tsx
interface UseJumpScareManagerOptions {
  minCooldown?: number;        // 最小冷卻時間（毫秒），預設 30000
  maxPerSession?: number;      // 每次最多觸發次數，預設 10
  fearThreshold?: number;      // 最小恐懼值要求，預設 30
}

interface UseJumpScareManagerReturn {
  triggerJumpScare: (options?: JumpScareOptions) => Promise<boolean>;
  canTriggerJumpScare: boolean;
  jumpScareCount: number;
  lastJumpScareTime: number | null;
  resetCooldown: () => void;
}

interface JumpScareOptions {
  intensity?: 'low' | 'medium' | 'high';  // 預設 'medium'
  duration?: number;                       // 持續時間（毫秒），預設 2000
  sound?: string;                          // 音效路徑
  visualEffect?: boolean;                  // 是否包含視覺效果，預設 true
  onComplete?: () => void;                 // 完成回調
}
```

**範例**:

```tsx
const { triggerJumpScare, canTriggerJumpScare, jumpScareCount } = 
  useJumpScareManager(fearLevel, {
    minCooldown: 15000,   // 15秒冷卻
    maxPerSession: 5,     // 最多5次
    fearThreshold: 20     // 需要20點恐懼值
  });

// 觸發驚嚇
if (canTriggerJumpScare) {
  await triggerJumpScare({
    intensity: 'high',
    duration: 2000,
    visualEffect: true,
    onComplete: () => {
      console.log('Jump scare completed');
    }
  });
}
```

### ToastProvider & useToast

Toast 通知系統。

```tsx
// Provider
interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;  // 最多同時顯示幾個，預設 5
}

// Hook
interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

type ToastType = 'success' | 'error' | 'warning' | 'info';
```

**範例**:

```tsx
// 在 App 最外層
<ToastProvider maxToasts={5}>
  <App />
</ToastProvider>

// 在任何子組件中使用
function MyComponent() {
  const { success, error, warning, info } = useToast();
  
  return (
    <button onClick={() => success('操作成功！')}>
      執行操作
    </button>
  );
}
```

## 樣式系統

### Tailwind 自定義顏色

專案使用自定義的恐怖主題顏色：

```js
// tailwind.config.js
colors: {
  'horror-primary': '#...',    // 主色調
  'horror-secondary': '#...',  // 次要色（紅色系）
  'horror-accent': '#...',     // 強調色
  'bg-deepest': '#...',        // 最深背景
  'bg-deep': '#...',           // 深色背景
  'bg-surface': '#...',        // 表面背景
  'text-high': '#...',         // 高對比文字
  'text-medium': '#...',       // 中對比文字
  'text-low': '#...'           // 低對比文字
}
```

### 自定義動畫

```css
/* 閃爍效果 */
@keyframes pulse { ... }

/* 震動效果 */
@keyframes shake { ... }

/* 滑入效果 */
@keyframes slide-up { ... }
```

## 測試指南

### 單元測試建議

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useFear } from './useFear';

test('should increase fear level', () => {
  const { result } = renderHook(() => useFear());
  
  act(() => {
    result.current.increaseFear(10);
  });
  
  expect(result.current.fearLevel).toBe(10);
});
```

### 整合測試建議

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastProvider';

test('should show toast notification', () => {
  function TestComponent() {
    const { success } = useToast();
    return <button onClick={() => success('Test')}>Show Toast</button>;
  }
  
  render(
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  );
  
  fireEvent.click(screen.getByText('Show Toast'));
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## 性能優化建議

### 1. 音頻預加載

```tsx
useEffect(() => {
  if (isAudioEnabled) {
    // 預加載常用音效
    preloadSounds([
      '/sounds/hospital_hum.mp3',
      '/sounds/woman_scream.mp3'
    ]);
  }
}, [isAudioEnabled]);
```

### 2. 使用 React.memo

```tsx
export const FearMeter = React.memo<FearMeterProps>(({ fearLevel, variant }) => {
  // ...
});
```

### 3. 防抖和節流

```tsx
import { debounce } from 'lodash';

const handleFearChange = debounce((newFear) => {
  // 處理恐懼值變化
}, 300);
```

## 擴展指南

### 添加新的音效

1. 將音效文件放入 `public/sounds/`
2. 在 `SRC_ASSETS_AND_AUDIO.md` 中記錄
3. 使用 `playSound` 播放

```tsx
await playSound('/sounds/my-new-sound.mp3', { volume: 0.7 });
```

### 創建新的管理器

```tsx
// src/managers/MyManager.tsx
export const MyManager: React.FC<Props> = ({ children }) => {
  // 管理邏輯
  
  return <>{children}</>;
};
```

### 添加新的 Hook

```tsx
// src/hooks/useMyHook.ts
export const useMyHook = (options?: MyHookOptions) => {
  const [state, setState] = useState();
  
  // Hook 邏輯
  
  return { state, actions };
};
```

## 常見問題

### Q: 為什麼音效無法自動播放？

A: 現代瀏覽器限制自動播放音頻。必須在用戶互動（點擊、觸摸等）後調用 `enableAudio()`。

### Q: 如何自定義恐懼值範圍？

A: 使用 `useFear` 的 `minFear` 和 `maxFear` 選項。

### Q: Toast 可以顯示自定義內容嗎？

A: 目前僅支持文字訊息。如需自定義，可以擴展 `Toast` 組件。

### Q: 如何調整驚嚇效果強度？

A: 使用 `triggerJumpScare` 的 `intensity` 選項（'low', 'medium', 'high'）。

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

MIT License - 詳見 LICENSE 文件

---

**維護者**: GhostH 開發團隊  
**最後更新**: 2024-12-14
