# 🎭 恐怖氛圍強化方案

## 📋 目錄
- [視覺效果強化](#視覺效果強化)
- [音效系統增強](#音效系統增強)
- [互動體驗優化](#互動體驗優化)
- [心理恐懼機制](#心理恐懼機制)
- [實作建議](#實作建議)

---

## 視覺效果強化

### 1. 動態陰影系統 🌑

**概念**: 創造不可預測的陰影移動，增加不安感

```tsx
// ShadowCreeper.tsx - 爬行的陰影效果
import { useEffect, useState } from 'react';

export const ShadowCreeper = ({ intensity = 0.5 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }, 3000 + Math.random() * 4000); // 不規律間隔
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="fixed pointer-events-none z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, transparent 70%)',
        opacity: intensity,
        filter: 'blur(30px)',
        transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};
```

### 2. 畫面扭曲效果 🌀

**概念**: 在關鍵時刻產生視覺扭曲，模擬精神不穩定

```tsx
// DistortionEffect.tsx - 視覺扭曲效果
export const DistortionEffect = ({ active, intensity = 0.5 }) => {
  if (!active) return null;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        animation: 'distort 0.5s ease-in-out infinite',
        mixBlendMode: 'overlay'
      }}
    />
  );
};

// 在 CSS 中加入：
/*
@keyframes distort {
  0%, 100% { 
    filter: none; 
    transform: scale(1);
  }
  25% { 
    filter: hue-rotate(5deg) blur(0.5px);
    transform: scale(1.002);
  }
  50% { 
    filter: hue-rotate(-5deg) blur(1px);
    transform: scale(0.998);
  }
  75% { 
    filter: hue-rotate(3deg) blur(0.5px);
    transform: scale(1.001);
  }
}
*/
```

### 3. 血跡效果 🩸

**概念**: 在特定事件後，螢幕邊緣出現血跡蔓延效果

```tsx
// BloodStain.tsx - 血跡效果
export const BloodStain = ({ triggered }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (triggered) {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }
  }, [triggered]);
  
  if (!visible) return null;
  
  return (
    <>
      {/* 上方血滴 */}
      <div 
        className="fixed top-0 left-1/4 w-24 h-32 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(139, 0, 0, 0.8) 0%, transparent 70%)',
          filter: 'blur(2px)',
          animation: 'drip 3s ease-out forwards'
        }}
      />
      
      {/* 側邊血跡 */}
      <div 
        className="fixed right-0 top-1/3 w-40 h-64 pointer-events-none z-40"
        style={{
          background: 'linear-gradient(to left, rgba(139, 0, 0, 0.6) 0%, transparent 60%)',
          filter: 'blur(3px)',
          animation: 'slideIn 2s ease-out forwards'
        }}
      />
    </>
  );
};

// CSS animations:
/*
@keyframes drip {
  0% { 
    transform: translateY(-100%); 
    opacity: 0;
  }
  30% { 
    opacity: 1;
  }
  100% { 
    transform: translateY(0); 
    opacity: 0.7;
  }
}

@keyframes slideIn {
  0% { 
    transform: translateX(100%); 
    opacity: 0;
  }
  50% { 
    opacity: 1;
  }
  100% { 
    transform: translateX(0); 
    opacity: 0.6;
  }
}
*/
```

### 4. 鬼影閃現 👻

**概念**: 隨機時間在螢幕某處短暫出現半透明人影

```tsx
// GhostFlicker.tsx - 鬼影閃現效果
const ghostPositions = [
  { x: '10%', y: '20%' },
  { x: '85%', y: '60%' },
  { x: '50%', y: '80%' },
  { x: '30%', y: '50%' }
];

export const GhostFlicker = ({ fearLevel }) => {
  const [ghost, setGhost] = useState(null);
  
  useEffect(() => {
    // 恐懼值越高，出現越頻繁
    const baseInterval = 30000; // 30 秒
    const interval = baseInterval / (1 + fearLevel);
    
    const timer = setInterval(() => {
      const position = ghostPositions[Math.floor(Math.random() * ghostPositions.length)];
      setGhost(position);
      
      // 短暫顯示後消失
      setTimeout(() => setGhost(null), 300 + Math.random() * 500);
    }, interval);
    
    return () => clearInterval(timer);
  }, [fearLevel]);
  
  if (!ghost) return null;
  
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: ghost.x,
        top: ghost.y,
        width: '100px',
        height: '200px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
        filter: 'blur(8px)',
        animation: 'ghostFlicker 0.3s ease-in-out',
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'screen'
      }}
    />
  );
};

// CSS:
/*
@keyframes ghostFlicker {
  0%, 100% { opacity: 0; }
  20%, 80% { opacity: 0.8; }
  50% { opacity: 0.3; }
}
*/
```

---

## 音效系統增強

### 5. 環境音效分層 🔊

**概念**: 多層次環境音效，根據恐懼值動態調整

```tsx
// useEnhancedAudio.ts
import { useEffect, useRef, useState } from 'react';

export const useEnhancedAudio = (fearLevel: number) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const layersRef = useRef<{
    ambient: AudioBufferSourceNode | null;
    heartbeat: AudioBufferSourceNode | null;
    whisper: AudioBufferSourceNode | null;
    static: AudioBufferSourceNode | null;
  }>({
    ambient: null,
    heartbeat: null,
    whisper: null,
    static: null
  });
  
  useEffect(() => {
    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    
    // 基礎環境音（持續）
    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.3;
    ambientGain.connect(ctx.destination);
    
    // 心跳（恐懼值高時加快）
    const heartbeatGain = ctx.createGain();
    heartbeatGain.gain.value = fearLevel * 0.5;
    heartbeatGain.connect(ctx.destination);
    
    // 低語（恐懼值中等時出現）
    const whisperGain = ctx.createGain();
    whisperGain.gain.value = fearLevel > 0.4 ? 0.2 : 0;
    whisperGain.connect(ctx.destination);
    
    // 白噪音（恐懼值極高時）
    const staticGain = ctx.createGain();
    staticGain.gain.value = fearLevel > 0.8 ? 0.15 : 0;
    staticGain.connect(ctx.destination);
    
    return () => {
      ctx.close();
    };
  }, [fearLevel]);
  
  const playJumpScare = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    // 突然的尖銳聲音
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.frequency.value = 880; // A5 音符
    gain.gain.value = 0.7;
    
    oscillator.start(ctx.currentTime);
    
    // 快速衰減
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    oscillator.stop(ctx.currentTime + 0.3);
  };
  
  const playSubtleCreak = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    // 微妙的嘎吱聲
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 200 + Math.random() * 100;
    gain.gain.value = 0.1;
    
    oscillator.start(ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    oscillator.stop(ctx.currentTime + 1);
  };
  
  return {
    playJumpScare,
    playSubtleCreak
  };
};
```

### 6. 3D 定位音效 🎧

**概念**: 使用 Web Audio API 的 Panner 創造空間音效

```tsx
// use3DAudio.ts
export const use3DAudio = () => {
  const playPositionalSound = (x: number, y: number, z: number) => {
    const ctx = new AudioContext();
    const panner = ctx.createPanner();
    
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;
    
    panner.setPosition(x, y, z);
    panner.connect(ctx.destination);
    
    // 創造聲音...
    const oscillator = ctx.createOscillator();
    oscillator.connect(panner);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  };
  
  return { playPositionalSound };
};
```

---

## 互動體驗優化

### 7. 游標跟隨恐懼效果 🖱️

**概念**: 游標移動時產生殘影，模擬不安定感

```tsx
// CursorTrail.tsx
export const CursorTrail = ({ fearLevel }) => {
  const [trail, setTrail] = useState<Array<{x: number, y: number, id: number}>>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };
      
      setTrail(prev => [...prev.slice(-10), newPoint]);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <>
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: point.x,
            top: point.y,
            width: '10px',
            height: '10px',
            background: `rgba(255, 0, 0, ${(index / trail.length) * fearLevel * 0.5})`,
            borderRadius: '50%',
            filter: 'blur(4px)',
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.5s ease-out'
          }}
        />
      ))}
    </>
  );
};
```

### 8. 隨機干擾事件 ⚡

**概念**: 不定期產生輕微的"故障"效果，打破玩家的安全感

```tsx
// useRandomGlitch.ts
export const useRandomGlitch = (enabled: boolean) => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    if (!enabled) return;
    
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 100 + Math.random() * 300);
    };
    
    // 隨機觸發（平均 20-60 秒一次）
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 40000;
      return setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };
    
    const timer = scheduleNext();
    return () => clearTimeout(timer);
  }, [enabled]);
  
  return isGlitching;
};

// 使用範例：
export const GlitchOverlay = () => {
  const isGlitching = useRandomGlitch(true);
  
  if (!isGlitching) return null;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background: `linear-gradient(${Math.random() * 360}deg, 
          rgba(255,0,0,0.2) 0%, 
          rgba(0,255,0,0.2) 50%, 
          rgba(0,0,255,0.2) 100%)`,
        mixBlendMode: 'overlay',
        animation: 'glitch 0.1s infinite'
      }}
    />
  );
};

// CSS:
/*
@keyframes glitch {
  0%, 100% { 
    transform: translate(0); 
    opacity: 0.5;
  }
  33% { 
    transform: translate(-2px, 2px); 
    opacity: 0.8;
  }
  66% { 
    transform: translate(2px, -2px); 
    opacity: 0.3;
  }
}
*/
```

---

## 心理恐懼機制

### 9. 倒數計時壓力 ⏱️

**概念**: 顯示不斷減少的時間，但有時會突然"跳動"

```tsx
// CountdownTimer.tsx
export const CountdownTimer = ({ initialSeconds, onExpire }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        // 偶爾時間會"跳躍"（心理壓力）
        if (Math.random() < 0.05) {
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 200);
          return Math.max(0, prev - Math.floor(Math.random() * 5));
        }
        
        const next = prev - 1;
        if (next <= 0) {
          onExpire?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [onExpire]);
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return (
    <div 
      className={`font-mono text-4xl ${seconds < 30 ? 'text-horror-secondary animate-pulse' : 'text-horror-primary'}`}
      style={{
        filter: isGlitching ? 'blur(2px) hue-rotate(180deg)' : 'none',
        transition: 'all 0.1s'
      }}
    >
      {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
};
```

### 10. 視線追蹤效果 👁️

**概念**: 某些元素"注視"著游標，增加被監視感

```tsx
// WatchingEyes.tsx
export const WatchingEyes = ({ x, y, size = 40 }) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // 計算瞳孔位置
  const angle = Math.atan2(cursorPos.y - y, cursorPos.x - x);
  const distance = Math.min(size * 0.3, 8);
  const pupilX = Math.cos(angle) * distance;
  const pupilY = Math.sin(angle) * distance;
  
  return (
    <div
      className="fixed pointer-events-none z-40"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* 眼白 */}
      <div
        className="relative rounded-full bg-white"
        style={{
          width: size,
          height: size,
          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }}
      >
        {/* 瞳孔 */}
        <div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.4,
            height: size * 0.4,
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* 高光 */}
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: size * 0.1,
              height: size * 0.1,
              left: '30%',
              top: '30%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// 使用多個眼睛：
export const WatchingEyesCluster = () => {
  const eyePositions = [
    { x: 100, y: 100 },
    { x: window.innerWidth - 100, y: 150 },
    { x: 200, y: window.innerHeight - 100 },
    { x: window.innerWidth - 150, y: window.innerHeight - 150 }
  ];
  
  return (
    <>
      {eyePositions.map((pos, i) => (
        <WatchingEyes key={i} {...pos} size={30 + Math.random() * 20} />
      ))}
    </>
  );
};
```

---

## 實作建議

### 優先級順序

#### 高優先級（立即實作）
1. **音效系統增強** - 最有效的恐怖氛圍營造
2. **鬼影閃現** - 實作簡單，效果顯著
3. **隨機干擾事件** - 增加不確定性

#### 中優先級（短期實作）
4. **動態陰影系統** - 視覺層次豐富
5. **游標跟隨效果** - 互動性強
6. **倒數計時壓力** - 心理壓力營造

#### 低優先級（長期優化）
7. **血跡效果** - 需要美術資源
8. **視線追蹤** - 技術複雜度較高
9. **畫面扭曲** - 可能影響可讀性

### 效能考量

```tsx
// 使用 React.memo 優化重渲染
export const HorrorEffects = React.memo(({ fearLevel }) => {
  // 只在 fearLevel 改變時重新渲染
  return (
    <>
      <CRTOverlay intensity={fearLevel} />
      <ShadowCreeper intensity={fearLevel * 0.5} />
      <GhostFlicker fearLevel={fearLevel} />
    </>
  );
});

// 使用 requestAnimationFrame 控制動畫頻率
const useThrottledAnimation = (callback: () => void, fps = 30) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  useEffect(() => {
    let lastTime = 0;
    const interval = 1000 / fps;
    
    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        callbackRef.current();
        lastTime = time;
      }
      requestAnimationFrame(animate);
    };
    
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [fps]);
};
```

### 漸進式增強

```tsx
// 檢測使用者偏好，尊重 prefers-reduced-motion
export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return reducedMotion;
};

// 使用範例：
export const HorrorGame = () => {
  const reducedMotion = useReducedMotion();
  
  return (
    <>
      <CRTOverlay intensity={reducedMotion ? 0.2 : 0.7} />
      {!reducedMotion && <GhostFlicker fearLevel={0.5} />}
    </>
  );
};
```

### 測試建議

```tsx
// 提供開發者模式，快速測試所有效果
export const HorrorTestPanel = () => {
  const [fearLevel, setFearLevel] = useState(0.5);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 p-4 rounded z-[9999]">
      <h3 className="text-white mb-2">Horror Effects Test Panel</h3>
      
      <label className="text-white block mb-2">
        Fear Level: {fearLevel.toFixed(2)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={fearLevel}
          onChange={(e) => setFearLevel(parseFloat(e.target.value))}
          className="w-full"
        />
      </label>
      
      <div className="space-y-2">
        <button className="btn-horror block w-full">Trigger Jump Scare</button>
        <button className="btn-horror block w-full">Spawn Ghost</button>
        <button className="btn-horror block w-full">Play Creepy Sound</button>
        <button className="btn-horror block w-full">Trigger Glitch</button>
      </div>
    </div>
  );
};
```

---

## 整合範例

完整的恐怖氛圍系統整合：

```tsx
// HorrorAtmosphereSystem.tsx
import { useState, useEffect } from 'react';

export const HorrorAtmosphereSystem = () => {
  const [fearLevel, setFearLevel] = useState(0);
  const reducedMotion = useReducedMotion();
  const isGlitching = useRandomGlitch(fearLevel > 0.3);
  const { playSubtleCreak, playJumpScare } = useEnhancedAudio(fearLevel);
  
  // 恐懼值隨時間慢慢增加
  useEffect(() => {
    const interval = setInterval(() => {
      setFearLevel(prev => Math.min(1, prev + 0.01));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      {/* 基礎視覺效果 */}
      <CRTOverlay intensity={fearLevel * 0.7} />
      
      {/* 動態恐怖效果 */}
      {!reducedMotion && (
        <>
          <ShadowCreeper intensity={fearLevel * 0.5} />
          <GhostFlicker fearLevel={fearLevel} />
          <CursorTrail fearLevel={fearLevel} />
        </>
      )}
      
      {/* 干擾效果 */}
      {isGlitching && <GlitchOverlay />}
      
      {/* 環境監視效果 */}
      {fearLevel > 0.6 && <WatchingEyesCluster />}
      
      {/* 開發者測試面板 */}
      <HorrorTestPanel />
    </>
  );
};
```

---

**最後更新**: 2025-12-14  
**版本**: 1.0  
**狀態**: ✅ 可立即實作
