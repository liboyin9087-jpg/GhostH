# 靈異連線:蝕骨杏林 - UI/UX 完整優化建議

## 🎯 優化目標

將網頁從「閱讀體驗」轉化為「恐怖遊戲體驗」,確保每個互動細節都服務於沉浸感和恐懼感的營造。

---

## 📱 核心 UI/UX 問題診斷

### 目前狀態評估

基於專案檔案分析,目前已實作:
✅ SpectralPhone (靈異電話) - 基礎互動系統
✅ RitualCanvas (儀式畫布) - 核心玩法機制
✅ FearMeter - 恐懼值視覺化
✅ ClueJournal - 證據收集系統
✅ GeminiService - AI 對話生成

需要優化的面向:
⚠️ 視覺恐怖氛圍不足
⚠️ 互動回饋感較弱
⚠️ 手機端體驗未優化
⚠️ 聲音設計缺失
⚠️ 恐懼值與 UI 的連動不夠明顯

---

## 🎨 視覺優化方案

### 1️⃣ 全域視覺氛圍強化

#### A. CRT 雜訊濾鏡系統(已實作但需整合)

**目的**: 讓整個網頁看起來像「被詛咒的監視器畫面」

**實作方案**:
```tsx
// 新增組件: src/components/CRTOverlay.tsx

const CRTOverlay: React.FC = () => {
  return (
    <>
      {/* 1. 掃描線層 */}
      <div className="crt-scanlines" />
      
      {/* 2. 映像管閃爍 */}
      <div className="crt-flicker" />
      
      {/* 3. 邊角暗角 */}
      <div className="crt-vignette" />
      
      <style>{`
        .crt-scanlines {
          position: fixed;
          inset: 0;
          z-index: 99;
          pointer-events: none;
          opacity: 0.2;
          background: 
            linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%),
            linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06));
          background-size: 100% 3px, 3px 100%;
        }
        
        .crt-flicker {
          position: fixed;
          inset: 0;
          z-index: 99;
          pointer-events: none;
          background: white;
          opacity: 0.02;
          animation: flicker 0.15s infinite;
          mix-blend-mode: overlay;
        }
        
        .crt-vignette {
          position: fixed;
          inset: 0;
          z-index: 99;
          pointer-events: none;
          background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%);
          box-shadow: inset 0 0 50px rgba(0,0,0,0.7);
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.05; }
        }
      `}</style>
    </>
  );
};
```

**預期效果**:
- 畫面帶有細微的橫向掃描線(像舊 CRT 螢幕)
- 亮度微幅抖動,模擬電壓不穩
- 四個角落自然變暗,聚焦中央內容

**優先級**: 🔥🔥🔥 高(視覺衝擊力強,實作成本低)

---

#### B. 手電筒游標效果

**目的**: 限制視野,強迫玩家只能看到游標周圍的內容

**實作方案**:
```tsx
// 新增組件: src/components/FlashlightCursor.tsx

const FlashlightCursor: React.FC<{ fearLevel: number }> = ({ fearLevel }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (overlayRef.current) {
        overlayRef.current.style.setProperty('--x', `${e.clientX}px`);
        overlayRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // 恐懼值越高,光圈越小
  const radius = 250 - (fearLevel * 1.5); // 100 恐懼值 = 100px 光圈
  
  return (
    <div 
      ref={overlayRef}
      className="flashlight-overlay"
      style={{
        '--x': '50vw',
        '--y': '50vh',
        background: `radial-gradient(
          circle ${radius}px at var(--x) var(--y),
          transparent 0%,
          rgba(0,0,0,0.95) 50%
        )`
      } as React.CSSProperties}
    />
  );
};
```

**進階設計**:
- 當 `fearLevel < 30`: 光圈 250px(舒適閱讀)
- 當 `fearLevel 30-70`: 光圈逐漸縮小到 150px
- 當 `fearLevel > 70`: 光圈 100px(極度壓迫)

**優先級**: 🔥🔥 中高(沉浸感強,但可能影響閱讀)

**建議**: 在特定章節啟用(例如「玩法展示」區),而非全域

---

#### C. 恐懼值視覺連動系統(強化 FearMeter)

**目前問題**: FearMeter 只顯示數值,缺乏視覺衝擊

**優化方案**: 將恐懼值直接影響全域 CSS

```tsx
// 在 App.tsx 中加入動態 CSS 變數

useEffect(() => {
  document.documentElement.style.setProperty('--fear-level', `${fearLevel}`);
}, [fearLevel]);

// 在 global CSS 中使用
:root {
  --fear-level: 10;
  --fear-intensity: calc(var(--fear-level) / 100);
}

/* 全域文字顏色根據恐懼值變紅 */
body {
  color: rgb(
    calc(200 + 55 * var(--fear-intensity)),
    calc(200 - 150 * var(--fear-intensity)),
    calc(200 - 150 * var(--fear-intensity))
  );
}

/* 背景雜訊強度增加 */
.crt-scanlines {
  opacity: calc(0.2 + 0.3 * var(--fear-intensity));
}

/* 邊框開始抖動 */
.section-border {
  animation: shake calc(1s - 0.8s * var(--fear-intensity)) infinite;
}
```

**效果**:
- 恐懼值 10: 文字淡綠色,背景寧靜
- 恐懼值 50: 文字淡黃色,雜訊增加
- 恐懼值 100: 文字血紅色,畫面劇烈抖動

**優先級**: 🔥🔥🔥 高(強化恐懼感的最直接方式)

---

### 2️⃣ 文字排版與可讀性優化

#### A. 字體系統改進

**目前問題**: 使用系統預設字體,缺乏恐怖美學

**建議字體方案**:

```css
/* 主要內容 - 易讀性優先 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&display=swap');

/* 標題與 UI - 恐怖氛圍 */
@import url('https://fonts.cdnfonts.com/css/huiwen-mincho');

body {
  font-family: 'Noto Serif TC', serif; /* 主要內容 */
}

h1, h2, h3, .ui-text {
  font-family: '匯文明朝體', 'Noto Serif TC', serif; /* 標題 */
  letter-spacing: 0.05em;
}

.glitch-text {
  font-family: '瀞 Glitch 明朝', monospace; /* 故障文字 */
}
```

**優先級**: 🔥 中(視覺質感提升明顯)

---

#### B. 文字呼吸效果(Breathing Text)

**目的**: 讓關鍵詞彙產生「活著」的感覺

```css
.keyword-death {
  animation: text-breathe 3s ease-in-out infinite;
  color: #FF3333;
}

@keyframes text-breathe {
  0%, 100% { 
    opacity: 0.8;
    text-shadow: 0 0 5px rgba(255,51,51,0.3);
  }
  50% { 
    opacity: 1;
    text-shadow: 0 0 15px rgba(255,51,51,0.8);
  }
}
```

**應用位置**:
- 「死」、「逃」、「代價」等關鍵字
- ClueJournal 中的證據標題

**優先級**: 🔥 低(錦上添花)

---

## 🖱️ 互動體驗優化

### 3️⃣ 防逃跑機制(Focus Trap)

**目的**: 當玩家因害怕切換分頁時,給予「懲罰」

**實作方案**:
```tsx
// 新增組件: src/components/FocusTrap.tsx

const FocusTrap: React.FC<{ onFearIncrease: (amount: number) => void }> = ({ onFearIncrease }) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        triggerScare();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  const triggerScare = () => {
    setIsTriggered(true);
    playScreech(); // Web Audio API 合成尖叫聲
    onFearIncrease(10);
    
    setTimeout(() => setIsTriggered(false), 800);
  };
  
  const playScreech = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio blocked by browser", e);
    }
  };
  
  if (!isTriggered) return null;
  
  return (
    <div className="fixed inset-0 z-[100] bg-red-950 flex items-center justify-center animate-pulse">
      <h1 className="text-9xl font-black text-red-500 tracking-tighter scale-150 animate-bounce">
        別移開視線
      </h1>
    </div>
  );
};
```

**觸發時機**:
1. 玩家切換到其他分頁
2. 回到網頁時瞬間觸發

**效果**:
- 螢幕變紅
- 巨大文字「別移開視線」
- 刺耳的電子雜訊
- 恐懼值 +10

**優先級**: 🔥🔥🔥 高(Meta Horror 的核心,破壞第四面牆)

---

### 4️⃣ 按鈕互動優化

#### A. 「詛咒按鈕」效果

**目前問題**: 募資按鈕太「正常」,與恐怖氛圍脫節

**優化方案**:
```tsx
const CursedButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      className="cursed-button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span className={isHovered ? 'hidden' : 'block'}>{children}</span>
      <span className={isHovered ? 'block' : 'hidden'}>簽下契約</span>
      
      <style>{`
        .cursed-button {
          position: relative;
          border: 2px solid #00FF41;
          background: black;
          color: #00FF41;
          padding: 1rem 2rem;
          font-family: monospace;
          transition: all 0.2s;
        }
        
        .cursed-button:hover {
          border-color: #FF3333;
          color: #FF3333;
          box-shadow: 0 0 20px rgba(255,51,51,0.5);
          animation: shake 0.1s infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </button>
  );
};
```

**效果**:
- 懸停前: 「立即贊助」
- 懸停後: 「簽下契約」+ 紅色邊框抖動

**優先級**: 🔥🔥 中(增強品牌一致性)

---

### 5️⃣ SpectralPhone 優化方案

**目前狀態**: 基礎互動已實作,但缺乏緊迫感

**建議優化**:

#### A. 電量倒數視覺化
```tsx
// 在 SpectralPhone.tsx 中加入

const [battery, setBattery] = useState(87);

useEffect(() => {
  const drain = setInterval(() => {
    setBattery(prev => {
      const newValue = Math.max(0, prev - (fearLevel > 50 ? 2 : 1));
      
      // 電量低於 20% 時觸發警告
      if (newValue < 20 && newValue % 5 === 0) {
        triggerLowBatteryWarning();
      }
      
      return newValue;
    });
  }, 10000); // 每 10 秒掉電
  
  return () => clearInterval(drain);
}, [fearLevel]);

// 低電量警告
const triggerLowBatteryWarning = () => {
  addMessage('電量不足...連線可能中斷...', 'system');
  onFearIncrease(5);
};
```

**視覺呈現**:
```tsx
<div className={`battery-indicator ${battery < 20 ? 'critical' : ''}`}>
  <Battery size={14} />
  <span>{battery}%</span>
  
  {battery < 20 && (
    <span className="animate-pulse text-red-500 text-xs ml-1">
      [危險]
    </span>
  )}
</div>
```

**優先級**: 🔥🔥 中高(增加時間壓力)

---

#### B. 來電顫動效果(手機專用)

```tsx
const triggerIncomingCall = () => {
  setIsIncomingCall(true);
  
  // 手機震動 API
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 400]);
  }
  
  // 播放鈴聲(Web Audio 合成)
  playPhoneRing();
};
```

**優先級**: 🔥 中(手機體驗提升)

---

### 6️⃣ RitualCanvas 優化方案

**目前狀態**: 基礎畫布已實作

**建議優化**:

#### A. 恐懼值手抖效果增強

```tsx
// 在 RitualCanvas.tsx 中

const getJitter = (sanityLevel: number) => {
  if (sanity > 70) return { x: 0, y: 0 };
  
  const intensity = (100 - sanity) * 0.2;
  
  // 加入隨機的「劇烈抖動」
  if (Math.random() > 0.9) {
    return {
      x: (Math.random() - 0.5) * intensity * 3,
      y: (Math.random() - 0.5) * intensity * 3
    };
  }
  
  return {
    x: (Math.random() - 0.5) * intensity,
    y: (Math.random() - 0.5) * intensity
  };
};
```

**效果**: Sanity 低時,游標會不定期「大幅偏移」,讓玩家更難畫準

---

#### B. 儀式失敗視覺反饋

```tsx
const onRitualFail = () => {
  // 1. 畫布瞬間變紅
  setCanvasFlash('red');
  
  // 2. 符文自動扭曲變形
  distortRitualLines();
  
  // 3. 播放金屬摩擦聲
  playMetalScreech();
  
  // 4. 全域恐懼值提升
  onFearIncrease(20);
  
  // 5. 增加 SHAKY_HANDS debuff
  onAddDebuff('SHAKY_HANDS', 15000);
};
```

**優先級**: 🔥🔥🔥 高(核心玩法回饋)

---

## 📱 手機端專屬優化

### 7️⃣ 響應式設計改進

**目前問題**: 某些組件在手機上可能過小或重疊

**解決方案**:
```css
/* 手機端 SpectralPhone 全螢幕化 */
@media (max-width: 768px) {
  .spectral-phone {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  
  /* RitualCanvas 觸控優化 */
  .ritual-canvas {
    width: 100vw;
    height: 80vh;
    touch-action: none; /* 防止意外滾動 */
  }
}
```

---

### 8️⃣ 觸覺反饋(Haptic Feedback)

**實作方案**:
```tsx
// 在關鍵時刻觸發震動

// 心跳聲
const playHeartbeat = () => {
  if (navigator.vibrate) {
    navigator.vibrate([50, 500, 50, 500]); // 雙跳節奏
  }
};

// 鬼來電
const triggerIncomingCall = () => {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 400]); // 強烈震動
  }
};

// 儀式失敗
const onRitualFail = () => {
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 100]); // 急促短震
  }
};
```

**優先級**: 🔥 中(手機沉浸感提升)

---

### 9️⃣ 陀螺儀視差效果

**目的**: 讓背景圖片隨手機傾斜而移動

```tsx
const BackgroundParallax: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta && e.gamma) {
        setTilt({
          x: e.gamma / 10, // -9 到 9 度
          y: e.beta / 10
        });
      }
    };
    
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);
  
  return (
    <div 
      className="parallax-bg"
      style={{
        transform: `translate(${tilt.x}px, ${tilt.y}px)`
      }}
    />
  );
};
```

**優先級**: 🔥 低(實驗性功能)

---

## 🔊 聲音設計方案

### 🔟 環境音效系統

**目前問題**: 完全靜音,缺乏氛圍

**解決方案**: 使用 Web Audio API 合成音效

#### A. 環境底噪

```tsx
const AmbientSoundController: React.FC = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const startAmbient = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    
    // 1. 低頻嗡嗡聲
    const bass = ctx.createOscillator();
    bass.type = 'sine';
    bass.frequency.value = 40; // 40 Hz 極低頻
    
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.1;
    
    bass.connect(bassGain);
    bassGain.connect(ctx.destination);
    bass.start();
    
    // 2. 隨機的「拖行聲」
    setInterval(() => {
      if (Math.random() > 0.7) {
        playDraggingSound(ctx);
      }
    }, 30000); // 每 30 秒隨機觸發
  };
  
  return <button onClick={startAmbient}>啟用音效</button>;
};
```

---

#### B. 關鍵音效觸發點

| 事件 | 音效類型 | 實作方式 |
|------|----------|----------|
| 訊息提示 | 刺耳的「嗶」聲 | Oscillator(1200Hz, 0.1s) |
| 恐懼值 70+ | 金屬摩擦聲 | 白噪音 + 濾波器 |
| 儀式失敗 | 尖銳爆破音 | Sawtooth(800Hz → 100Hz) |
| 斷線瞬間 | 白噪音 → 寂靜 | NoiseBuffer 1s |

**優先級**: 🔥🔥 中高(大幅提升沉浸感)

**注意事項**: 
- 需要用戶互動才能播放(瀏覽器安全政策)
- 建議在首頁加入「點擊開始體驗」按鈕

---

## 📊 資訊架構優化

### 1️⃣1️⃣ 證據系統 UI 改進

**目前問題**: ClueJournal 可能被忽略

**優化方案**:

#### A. 新證據提示動畫
```tsx
// 當新證據解鎖時

const [hasNewClue, setHasNewClue] = useState(false);

const onClueUnlocked = () => {
  setHasNewClue(true);
  
  // 觸發浮動通知
  showNotification('新證據已解鎖');
  
  // 播放音效
  playUnlockSound();
  
  // 恐懼值微升
  onFearIncrease(3);
};

// 浮動按鈕帶紅點提示
<button className="relative">
  <BookOpen />
  {hasNewClue && (
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
  )}
</button>
```

---

#### B. 證據關聯圖譜

**概念**: 當玩家收集 3+ 個證據後,顯示一個「關係網」

```
樓層導覽圖 ←→ 停業公文
     ↓
  燒焦符咒 ←→ 監視器截圖
```

**優先級**: 🔥 低(複雜度較高,但敘事價值大)

---

## 🎯 核心體驗流程優化

### 1️⃣2️⃣ 首次載入體驗(First-Time UX)

**目前問題**: 玩家不知道如何開始

**解決方案**: 新增「引導覆蓋層」

```tsx
const FirstTimeOverlay: React.FC = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: '歡迎連線',
      text: '這不是一個普通的網頁。這是一個活著的連線。',
      action: '繼續'
    },
    {
      title: '規則',
      text: '當手機響起時,你必須接通。當有人求救時,你必須回應。',
      action: '我明白了'
    },
    {
      title: '警告',
      text: '別讓她的本命燈熄滅。',
      action: '開始連線'
    }
  ];
  
  return (
    <div className="tutorial-overlay">
      {/* 教學內容 */}
    </div>
  );
};
```

**優先級**: 🔥🔥 中高(降低學習曲線)

---

### 1️⃣3️⃣ 卷軸錨定與章節切換

**優化方案**: 加入平滑過渡與音效反饋

```tsx
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  
  // 播放「訊號切換」音效
  playSignalSwitch();
  
  // 平滑滾動 + 視覺特效
  element?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  
  // 切換時觸發 CRT 故障效果
  triggerGlitch();
};
```

---

## 🚀 優先級總結與實作順序

### 第一階段:立即可實作(本週)

1. **CRT 雜訊濾鏡** (2 小時)
2. **恐懼值視覺連動** (3 小時)
3. **防逃跑機制** (4 小時)
4. **SpectralPhone 電量倒數** (2 小時)

**預期成果**: 視覺氛圍與互動張力顯著提升

---

### 第二階段:核心玩法強化(下週)

1. **RitualCanvas 失敗反饋** (4 小時)
2. **手電筒游標效果** (3 小時)
3. **環境音效系統** (6 小時)
4. **按鈕詛咒效果** (2 小時)

**預期成果**: 核心互動循環完整且有回饋

---

### 第三階段:精緻化(後續)

1. **字體系統升級** (2 小時)
2. **證據系統 UI** (4 小時)
3. **首次載入引導** (3 小時)
4. **手機觸覺反饋** (2 小時)

---

## 📝 特別注意事項

### A. 效能考量

- **CRT 濾鏡**: 使用 `will-change: transform` 優化
- **手電筒游標**: 避免使用 React State,直接操作 CSS 變數
- **音效**: 預載入並複用 AudioContext

### B. 瀏覽器相容性

- **Vibration API**: 僅 Android Chrome 支援
- **DeviceOrientation**: 需 HTTPS 環境
- **Web Audio**: iOS Safari 需要用戶互動後才能播放

### C. 無障礙設計

- 提供「關閉特效」選項給動態敏感用戶
- 確保鍵盤導航可用
- 音效提供視覺替代(例如閃爍)

---

## 🎬 結語

這份優化建議的核心理念是:

**「每個 UI 元素都是敘事的一部分。」**

不是單純的「好看」或「好用」,而是「讓人感到不安」、「讓人想逃但又好奇」。透過視覺、聲音、互動的三位一體設計,我們要創造的不是網頁,而是一個**「會呼吸的詛咒」**。

---

**建議下一步**: 先實作「CRT濾鏡 + 防逃跑機制 + 恐懼值連動」這三個高投資報酬率的功能,立即測試使用者反應,再決定後續優化方向。
