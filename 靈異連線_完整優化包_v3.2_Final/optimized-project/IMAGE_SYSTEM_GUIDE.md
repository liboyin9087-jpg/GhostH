# 圖片系統使用指南

本指南說明如何使用剛創建的三個組件：ImageFilter（CSS濾鏡）、colorPalette（色彩配置）和 InteractiveImageGallery（互動式圖片查看器）。

---

## 📦 包含的組件

### 1. ImageFilter.tsx
CSS 濾鏡組件，提供四種視覺效果：
- `crt-green`: 綠色 CRT 監視器效果
- `hospital-cold`: 冷色調醫院廢墟效果
- `surveillance`: 監視攝影機效果
- `ritual-warm`: 儀式道具暖色調效果

### 2. colorPalette.ts
完整的色彩配置檔案，包含：
- 5 種主題色板（CRT、醫院、監視器、儀式、角色照明）
- 恐懼值色階（0-100）
- Tailwind CSS 擴展配置
- CSS 變數導出

### 3. InteractiveImageGallery.tsx
互動式圖片查看器，特色：
- 查看時間追蹤與恐懼值增加
- 全螢幕模式
- 監視器 UI（REC 指示器、時間戳記）
- 隨機故障效果

---

## 🚀 基礎使用範例

### 範例 1: 單張圖片套用濾鏡

```tsx
import ImageFilter from './components/ImageFilter';

function HospitalScene() {
  return (
    <ImageFilter filterType="hospital-cold" intensity={70}>
      <img src="/images/hospital-corridor.jpg" alt="廢棄走廊" />
    </ImageFilter>
  );
}
```

### 範例 2: 使用色彩配置

```tsx
import { crtGreenPalette, horrorGamePalette } from './styles/colorPalette';

function StatusIndicator({ fearLevel }: { fearLevel: number }) {
  // 根據恐懼值選擇顏色
  const getFearColor = () => {
    if (fearLevel >= 75) return horrorGamePalette.fearGradient[100];
    if (fearLevel >= 50) return horrorGamePalette.fearGradient[75];
    if (fearLevel >= 25) return horrorGamePalette.fearGradient[50];
    return horrorGamePalette.fearGradient[0];
  };

  return (
    <div style={{ 
      color: getFearColor(),
      textShadow: `0 0 10px ${getFearColor()}80`
    }}>
      恐懼值: {fearLevel}
    </div>
  );
}
```

### 範例 3: 完整圖片畫廊整合

```tsx
import React, { useState } from 'react';
import InteractiveImageGallery from './components/InteractiveImageGallery';

function EvidenceGallery() {
  const [fearLevel, setFearLevel] = useState(10);

  const evidenceImages = [
    {
      id: '01',
      src: '/images/hospital-corridor.jpg',
      title: '○樓走廊',
      location: '護理站',
      timestamp: 'DEC 13 1998 - 02:15:33 AM',
      description: '輪椅靜止在走廊中央。地上散落著泛黃的病歷。',
      filterType: 'hospital-cold' as const,
      fearIncrease: 5,
    },
    {
      id: '02',
      src: '/images/ritual-items.jpg',
      title: '祭改道具',
      location: '儀式室',
      timestamp: 'DEC 13 1998 - 02:47:19 AM',
      description: '符咒上的字跡已經模糊。紅線纏繞著生鏽的手術刀。',
      filterType: 'ritual-warm' as const,
      fearIncrease: 8,
    },
    {
      id: '03',
      src: '/images/morgue.jpg',
      title: '太平間',
      location: 'B2 地下室',
      timestamp: 'DEC 13 1998 - 03:21:45 AM',
      description: '福馬林標本室。天堂路逃生梯通往七層樓高的出口。',
      filterType: 'surveillance' as const,
      fearIncrease: 10,
    },
  ];

  const handleFearIncrease = (amount: number) => {
    setFearLevel(prev => Math.min(100, prev + amount));
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-3xl font-mono text-crt-green mb-8">
        證據檔案庫
      </h1>
      
      <InteractiveImageGallery
        images={evidenceImages}
        onFearIncrease={handleFearIncrease}
        currentFearLevel={fearLevel}
      />
    </div>
  );
}
```

---

## 🎨 Tailwind CSS 整合

在您的 `tailwind.config.js` 中加入色彩擴展：

```javascript
import { tailwindColorExtension } from './src/styles/colorPalette';

export default {
  theme: {
    extend: {
      colors: tailwindColorExtension,
    },
  },
};
```

然後就可以使用自訂顏色類別：

```tsx
<div className="bg-hospital-wall text-crt-green border-ritual-blood">
  醫院場景
</div>

<div className="text-fear-100 hover:text-fear-75">
  危險警告
</div>
```

---

## 🌐 全域 CSS 變數設定

在您的 `src/index.css` 或 `App.tsx` 中加入：

```css
@import url('./styles/colorPalette.css');

:root {
  /* CRT 監視器色調 */
  --crt-green-main: #00FF41;
  --crt-green-glow: #00FF4180;
  
  /* 醫院廢墟色調 */
  --hospital-main: #A8C5C0;
  --hospital-blood: #5C1A1A;
  
  /* 儀式道具色調 */
  --ritual-paper: #D4A574;
  --ritual-blood: #8B2500;
  
  /* 恐懼值色階（動態更新） */
  --current-fear-color: var(--fear-0);
}

/* 動態恐懼值顏色 */
[data-fear-level="low"] {
  --current-fear-color: var(--fear-25);
}

[data-fear-level="medium"] {
  --current-fear-color: var(--fear-50);
}

[data-fear-level="high"] {
  --current-fear-color: var(--fear-75);
}

[data-fear-level="critical"] {
  --current-fear-color: var(--fear-100);
}
```

在 React 組件中動態更新：

```tsx
useEffect(() => {
  const level = 
    fearLevel >= 75 ? 'critical' :
    fearLevel >= 50 ? 'high' :
    fearLevel >= 25 ? 'medium' : 'low';
    
  document.documentElement.setAttribute('data-fear-level', level);
}, [fearLevel]);
```

---

## 🔥 進階使用：動態濾鏡強度

根據恐懼值動態調整濾鏡強度：

```tsx
function DynamicSceneImage({ src, fearLevel }: { src: string; fearLevel: number }) {
  // 恐懼值越高，濾鏡效果越強
  const filterIntensity = 50 + (fearLevel / 2);
  
  return (
    <ImageFilter 
      filterType="surveillance" 
      intensity={filterIntensity}
    >
      <img src={src} alt="場景" />
    </ImageFilter>
  );
}
```

---

## 🎯 實際整合到募資頁面

### 場景 1: 英雄區塊背景

```tsx
import ImageFilter from './components/ImageFilter';

function HeroSection() {
  return (
    <ImageFilter filterType="crt-green" intensity={60}>
      <div className="relative h-screen flex items-center justify-center">
        <img 
          src="/images/hospital-entrance.jpg" 
          alt="杏林醫院入口"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold text-crt-green mb-4">
            靈異連線：蝕骨杏林
          </h1>
          <p className="text-xl text-hospital">
            當你接起錯誤的電話，就成為醫院詛咒的一部分
          </p>
        </div>
      </div>
    </ImageFilter>
  );
}
```

### 場景 2: 證據展示區

```tsx
function EvidenceSection() {
  const [fearLevel, setFearLevel] = useState(10);

  return (
    <section className="py-20 bg-black">
      <h2 className="text-4xl font-mono text-center mb-12" 
          style={{ color: horrorGamePalette.primary }}>
        解鎖的證據檔案
      </h2>
      
      <InteractiveImageGallery
        images={evidenceImages}
        onFearIncrease={(amt) => setFearLevel(prev => prev + amt)}
        currentFearLevel={fearLevel}
      />
      
      {fearLevel > 50 && (
        <div className="text-center mt-8 text-fear-75 animate-pulse">
          ⚠ 警告：本命燈開始不穩定...
        </div>
      )}
    </section>
  );
}
```

### 場景 3: 角色介紹（帶濾鏡）

```tsx
function CharacterIntro() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* 小雅 */}
      <ImageFilter filterType="hospital-cold" intensity={65}>
        <div className="relative overflow-hidden rounded-lg">
          <img src="/images/xiaoya.jpg" alt="小雅" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-6">
            <h3 className="text-2xl font-mono text-white mb-2">小雅</h3>
            <p className="text-sm text-stone-300">
              20歲女大生，直播主，因手機訊號異常而困在○樓...
            </p>
          </div>
        </div>
      </ImageFilter>
      
      {/* 靈界接口 */}
      <ImageFilter filterType="crt-green" intensity={80}>
        <div className="relative overflow-hidden rounded-lg">
          <img src="/images/interface.jpg" alt="靈界接口" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-6">
            <h3 className="text-2xl font-mono text-crt-green mb-2">靈界接口</h3>
            <p className="text-sm text-stone-300">
              醫院累積的怨念與業力，透過「靈異連線」與你溝通...
            </p>
          </div>
        </div>
      </ImageFilter>
    </div>
  );
}
```

---

## 📱 手機優化

所有組件已內建響應式設計，但您可以進一步優化：

```tsx
// 手機端關閉部分效果以提升效能
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

<ImageFilter 
  filterType="surveillance" 
  intensity={isMobile ? 50 : 70} // 手機降低強度
>
  {/* 內容 */}
</ImageFilter>
```

---

## ⚠️ 注意事項

1. **效能優化**：濾鏡效果會消耗 GPU 資源，建議：
   - 限制同時顯示的濾鏡數量
   - 在視窗外的元素暫停濾鏡效果
   - 手機端降低濾鏡強度

2. **圖片格式**：建議使用 WebP 格式以減少載入時間

3. **無障礙設計**：提供「關閉特效」選項

4. **瀏覽器相容性**：
   - 濾鏡效果支援所有現代瀏覽器
   - CSS Grid 在 IE11 需要 polyfill

---

## 🎉 完整範例：整合所有組件

```tsx
import React, { useState, useEffect } from 'react';
import ImageFilter from './components/ImageFilter';
import InteractiveImageGallery from './components/InteractiveImageGallery';
import { horrorGamePalette } from './styles/colorPalette';

function App() {
  const [fearLevel, setFearLevel] = useState(10);

  // 更新全域 CSS 變數
  useEffect(() => {
    document.documentElement.style.setProperty('--fear-level', `${fearLevel}`);
    
    const color = fearLevel >= 75 ? horrorGamePalette.fearGradient[100] :
                  fearLevel >= 50 ? horrorGamePalette.fearGradient[75] :
                  fearLevel >= 25 ? horrorGamePalette.fearGradient[50] :
                  horrorGamePalette.fearGradient[0];
    
    document.documentElement.style.setProperty('--current-fear-color', color);
  }, [fearLevel]);

  return (
    <div className="min-h-screen bg-black">
      {/* 英雄區塊 */}
      <ImageFilter filterType="crt-green" intensity={60}>
        <section className="h-screen flex items-center justify-center relative">
          <h1 className="text-6xl font-bold text-crt-green">
            靈異連線：蝕骨杏林
          </h1>
        </section>
      </ImageFilter>

      {/* 證據畫廊 */}
      <section className="py-20 px-8">
        <InteractiveImageGallery
          images={evidenceImages}
          onFearIncrease={(amt) => setFearLevel(prev => Math.min(100, prev + amt))}
          currentFearLevel={fearLevel}
        />
      </section>

      {/* 恐懼值指示器 */}
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 px-4 py-3 rounded-lg">
        <div className="text-sm font-mono mb-1" style={{ color: horrorGamePalette.text.medium }}>
          恐懼值
        </div>
        <div className="text-2xl font-bold" style={{ 
          color: `var(--current-fear-color)`,
          textShadow: `0 0 10px var(--current-fear-color)`
        }}>
          {fearLevel} / 100
        </div>
      </div>
    </div>
  );
}

export default App;
```

---

## 📚 更多資源

- ImageFilter 組件：`src/components/ImageFilter.tsx`
- 色彩配置：`src/styles/colorPalette.ts`
- 互動畫廊：`src/components/InteractiveImageGallery.tsx`
- 安裝指南：`INSTALLATION_GUIDE.md`

---

**版本**: v1.0  
**更新日期**: 2025-12-12  
**相容性**: React 18+, TypeScript 5+
