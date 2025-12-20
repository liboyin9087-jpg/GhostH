# 《靈異連線》優化建議清單
# GhostH Complete - Optimization Recommendations

**版本**: v4.0  
**評估日期**: 2025-12-20  
**重點**: 效能、體驗、內容優化

---

## 🚀 效能優化建議

### 1. 圖片資源優化 ⭐ 高優先級
**現狀**: PNG 圖片較大 (800KB+)  
**建議**:
```bash
# 已提供 WebP 版本，建議在程式中優先使用
- 場景圖片: PNG → WebP (節省 ~95% 大小)
- 熱點圖片: PNG → WebP (節省 ~85% 大小)
- 實施響應式圖片加載
```

**實作方式**:
```tsx
<picture>
  <source srcset="/images/scenes/webp/scene01_corridor.webp" type="image/webp" />
  <img src="/images/scenes/scene01_corridor.png" alt="走廊" />
</picture>
```

**預期效果**: 頁面加載時間減少 60-70%

---

### 2. 程式碼分割 (Code Splitting) ⭐ 高優先級
**現狀**: 單一 Bundle (250KB)  
**建議**:
```tsx
// 延遲加載非關鍵組件
const TitleArchiveScreen = lazy(() => import('./components/TitleArchiveScreen'))
const ClueDrawer = lazy(() => import('./components/ClueDrawer'))
const SettingsMenu = lazy(() => import('./components/SettingsMenu'))
```

**預期效果**: 
- 初始加載減少 40-50KB
- 首次互動時間 (TTI) 改善 30%

---

### 3. 3D 效果效能優化 ⭐ 中優先級
**現狀**: 所有 3D 效果同時運行  
**建議**:
```tsx
// 根據裝置效能動態調整
const [performance] = useState(() => {
  const isMobile = /mobile/i.test(navigator.userAgent)
  const memory = (navigator as any).deviceMemory || 4
  return {
    particleCount: isMobile ? 20 : memory < 4 ? 30 : 60,
    enable3D: memory >= 2,
    enableParticles: memory >= 4
  }
})

<ParticleField 
  count={performance.particleCount}
  enabled={performance.enableParticles}
/>
```

**預期效果**: 低階裝置 FPS 提升 20-30%

---

### 4. 音效預加載與快取 ⭐ 中優先級
**現狀**: 音效按需加載  
**建議**:
```tsx
// 在標題畫面時預加載關鍵音效
useEffect(() => {
  const preloadAudio = [
    '/audio/ghost/ghost_scream.mp3',
    '/audio/ui/ui_click.mp3',
    '/audio/ambient/amb_corridor.mp3'
  ]
  
  preloadAudio.forEach(src => {
    const audio = new Audio(src)
    audio.preload = 'auto'
  })
}, [])
```

**預期效果**: 音效播放延遲減少 80%

---

### 5. Service Worker 快取策略 ⭐ 中優先級
**現狀**: 已註冊 SW 但未實作  
**建議**:
```javascript
// public/sw.js
const CACHE_VERSION = 'v4.0'
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/images/scenes/webp/',
  '/audio/ambient/'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => 
      cache.addAll(CACHE_ASSETS)
    )
  )
})
```

**預期效果**: 
- 離線可用
- 重複訪問加載時間減少 90%

---

## 🎨 使用者體驗優化

### 6. 載入畫面優化 ⭐ 高優先級
**現狀**: 無載入提示  
**建議**:
```tsx
// 添加骨架屏
const LoadingScreen = () => (
  <div className="animate-pulse bg-black">
    <div className="h-16 bg-stone-800/30 mb-4" />
    <div className="h-96 bg-stone-800/20" />
    <div className="h-32 bg-stone-800/30 mt-4" />
  </div>
)
```

**預期效果**: 感知加載時間減少 40%

---

### 7. 互動回饋增強 ⭐ 高優先級
**現狀**: 部分互動缺乏回饋  
**建議**:
```tsx
// 添加觸覺回饋 (已有 hook)
const { vibrate } = useHaptics()

const onHotspotClick = () => {
  vibrate([10, 20, 10]) // 短-中-短震動
  playSound('ui_click')
  // ... 原有邏輯
}

// 添加視覺回饋
const [isPressed, setIsPressed] = useState(false)
<button 
  onPointerDown={() => setIsPressed(true)}
  onPointerUp={() => setIsPressed(false)}
  className={`transform transition ${isPressed ? 'scale-95' : 'scale-100'}`}
>
```

**預期效果**: 互動感提升 50%

---

### 8. 教學系統改進 ⭐ 中優先級
**現狀**: 基礎教學已實作  
**建議**:
```tsx
// 互動式教學步驟
const tutorialSteps = [
  {
    target: '.toolbar',
    content: '點擊工具列使用不同工具',
    placement: 'top',
    highlight: true
  },
  {
    target: '.hotspot',
    content: '點擊發光區域探索線索',
    placement: 'bottom',
    highlight: true
  }
]

// 使用浮動提示引導
<Tooltip {...tutorialSteps[currentStep]} />
```

**預期效果**: 新手流失率減少 30%

---

### 9. 存檔系統增強 ⭐ 低優先級
**現狀**: 本地存檔已實作  
**建議**:
```tsx
// 添加雲端存檔支援
const saveToCloud = async (saveData) => {
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(saveData)
  })
}

// 多存檔槽
const SAVE_SLOTS = 3
localStorage.setItem(`save_slot_${slot}`, JSON.stringify(data))
```

**預期效果**: 多裝置遊玩體驗提升

---

## 📱 行動裝置優化

### 10. 觸控手勢優化 ⭐ 高優先級
**現狀**: 基礎觸控支援  
**建議**:
```tsx
// 添加手勢支援
import { useSwipeable } from 'react-swipeable'

const handlers = useSwipeable({
  onSwipedLeft: () => nextScene(),
  onSwipedRight: () => previousScene(),
  onSwipedUp: () => openDrawer(),
  preventScrollOnSwipe: true
})

<div {...handlers}>
```

**預期效果**: 行動裝置操作流暢度提升 40%

---

### 11. 螢幕尺寸適配 ⭐ 中優先級
**現狀**: 固定 max-w-md  
**建議**:
```tsx
// 響應式佈局
const useScreenSize = () => {
  const [size, setSize] = useState('mobile')
  
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      if (width >= 1024) setSize('desktop')
      else if (width >= 768) setSize('tablet')
      else setSize('mobile')
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  
  return size
}

// 根據螢幕大小調整 UI
className={`
  max-w-md
  md:max-w-2xl 
  lg:max-w-4xl
`}
```

**預期效果**: 大螢幕體驗提升 50%

---

### 12. PWA 功能完善 ⭐ 中優先級
**現狀**: 基礎 manifest.json  
**建議**:
```json
// public/manifest.json 增強
{
  "name": "靈異連線 - Spectral Link",
  "short_name": "GhostH",
  "description": "1990年代台灣廢棄醫院恐怖探索遊戲",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-1.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ]
}
```

**預期效果**: 
- App Store 曝光增加
- 安裝轉換率提升 25%

---

## 🎮 遊戲內容優化

### 13. 靈異事件多樣化 ⭐ 高優先級
**現狀**: 基礎事件類型  
**建議**:
```tsx
// 新增事件類型
type IncidentType = 
  | 'ghost'        // 現有
  | 'shadow'       // 新增：影子跟隨
  | 'possession'   // 新增：物品移動
  | 'temperature'  // 新增：溫度驟降
  | 'whisper'      // 新增：耳語增強
  | 'vision'       // 新增：幻覺閃現

// 每種類型對應不同視覺效果
const incidentEffects = {
  shadow: { particles: 'dark', intensity: 0.8 },
  possession: { objectAnimation: true },
  temperature: { colorGrade: 'cold', fog: true }
}
```

**預期效果**: 遊戲重玩價值提升 40%

---

### 14. 分支結局系統 ⭐ 中優先級
**現狀**: 單一結局  
**建議**:
```tsx
// 根據玩家選擇和發現的線索決定結局
interface EndingCondition {
  id: string
  title: string
  requirements: {
    cluesFound: string[]
    spiritPowerRemaining: number
    timeTaken: number
  }
  description: string
}

const endings: EndingCondition[] = [
  {
    id: 'true_ending',
    title: '真相大白',
    requirements: {
      cluesFound: ['all_major_clues'],
      spiritPowerRemaining: 50,
      timeTaken: 1800 // 30分鐘
    }
  },
  {
    id: 'escape_ending',
    title: '倉皇逃離',
    requirements: {
      cluesFound: ['minimal_clues'],
      spiritPowerRemaining: 0,
      timeTaken: 600 // 10分鐘
    }
  }
]
```

**預期效果**: 遊戲深度提升 60%

---

### 15. 動態難度調整 ⭐ 低優先級
**現狀**: 固定難度  
**建議**:
```tsx
// 根據玩家表現調整難度
const useDynamicDifficulty = () => {
  const [difficulty, setDifficulty] = useState(1.0)
  
  useEffect(() => {
    // 玩家死亡次數多 → 降低難度
    // 玩家表現好 → 提高難度
    const deathCount = parseInt(localStorage.getItem('death_count') || '0')
    const newDifficulty = Math.max(0.5, Math.min(1.5, 1 - deathCount * 0.1))
    setDifficulty(newDifficulty)
  }, [])
  
  return difficulty
}

// 應用到遊戲參數
spiritPowerDrain *= difficulty
ghostSpawnRate *= difficulty
```

**預期效果**: 玩家留存率提升 20%

---

## 🔧 技術優化

### 16. TypeScript 嚴格模式 ⭐ 中優先級
**現狀**: 部分類型為 any  
**建議**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

**預期效果**: 減少 runtime 錯誤 60%

---

### 17. 單元測試 ⭐ 低優先級
**現狀**: 無測試  
**建議**:
```bash
npm install -D vitest @testing-library/react @testing-library/user-event
```

```tsx
// src/hooks/__tests__/useFearSystem.test.ts
import { renderHook, act } from '@testing-library/react'
import { useFearSystem } from '../useFearSystem'

describe('useFearSystem', () => {
  it('should increase fear level over time', () => {
    const { result } = renderHook(() => useFearSystem(0.5))
    
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    expect(result.current.fearLevel).toBeGreaterThan(0)
  })
})
```

**預期效果**: 程式碼品質提升，減少 Bug

---

### 18. CI/CD 流程 ⭐ 低優先級
**現狀**: 手動建置部署  
**建議**:
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**預期效果**: 部署效率提升 80%

---

## 📊 優化優先級總表

| 優先級 | 優化項目 | 預期效果 | 實作難度 |
|-------|---------|---------|---------|
| 🔴 高 | 圖片資源優化 | 加載時間 -60% | 簡單 |
| 🔴 高 | 程式碼分割 | TTI -30% | 中等 |
| 🔴 高 | 載入畫面優化 | 感知加載 -40% | 簡單 |
| 🔴 高 | 互動回饋增強 | 互動感 +50% | 簡單 |
| 🔴 高 | 觸控手勢優化 | 操作流暢度 +40% | 中等 |
| 🔴 高 | 靈異事件多樣化 | 重玩價值 +40% | 中等 |
| 🟡 中 | 3D 效果效能優化 | FPS +20-30% | 中等 |
| 🟡 中 | 音效預加載 | 延遲 -80% | 簡單 |
| 🟡 中 | Service Worker | 重訪加載 -90% | 中等 |
| 🟡 中 | 教學系統改進 | 流失率 -30% | 中等 |
| 🟡 中 | 螢幕尺寸適配 | 大螢幕體驗 +50% | 簡單 |
| 🟡 中 | PWA 功能完善 | 安裝率 +25% | 簡單 |
| 🟡 中 | 分支結局系統 | 遊戲深度 +60% | 困難 |
| 🟡 中 | TypeScript 嚴格模式 | 錯誤 -60% | 中等 |
| 🟢 低 | 存檔系統增強 | 多裝置體驗 | 困難 |
| 🟢 低 | 動態難度調整 | 留存率 +20% | 中等 |
| 🟢 低 | 單元測試 | 程式碼品質 | 中等 |
| 🟢 低 | CI/CD 流程 | 部署效率 +80% | 簡單 |

---

## 🎯 建議實施順序

### 第一階段 (1-2 週)
1. 圖片資源優化 (WebP)
2. 載入畫面優化
3. 互動回饋增強
4. 觸控手勢優化

**預期成果**: 整體使用體驗提升 40%

### 第二階段 (2-3 週)
1. 程式碼分割
2. 3D 效果效能優化
3. 音效預加載
4. 教學系統改進

**預期成果**: 效能提升 30%，新手體驗改善

### 第三階段 (3-4 週)
1. Service Worker 實作
2. PWA 功能完善
3. 靈異事件多樣化
4. 螢幕尺寸適配

**預期成果**: 離線可用，內容豐富度提升

### 第四階段 (長期)
1. 分支結局系統
2. TypeScript 嚴格模式
3. 單元測試
4. CI/CD 流程

**預期成果**: 程式碼品質提升，可維護性增強

---

**報告產生時間**: 2025-12-20  
**評估者**: GitHub Copilot  
**下次檢視**: 建議 2 週後重新評估
