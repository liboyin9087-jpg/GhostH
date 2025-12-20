import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';

// ===== 3D 粒子系統 =====
const ParticleField = memo(function ParticleField({ count = 30, type = 'dust', intensity = 0.5 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: type === 'spirits' ? 3 + Math.random() * 4 : 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.4 * intensity,
      speed: 10 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
  }, [count, type, intensity]);

  const getColor = () => {
    switch (type) {
      case 'spirits': return '140, 255, 200';
      case 'embers': return '255, 160, 50';
      default: return '180, 180, 180';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: `rgba(${getColor()}, ${p.opacity})`,
            boxShadow: type === 'spirits' ? `0 0 ${p.size * 2}px rgba(${getColor()}, ${p.opacity})` : 'none',
            animation: `particleFloat ${p.speed}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

// ===== VHS 效果覆蓋層 =====
const VHSOverlay = memo(function VHSOverlay({ phase, intensity }) {
  const [flicker, setFlicker] = useState(0);
  const [tracking, setTracking] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (phase === 'incident') {
        setFlicker(Math.random() < 0.3 ? 0.1 + Math.random() * 0.15 : 0);
        setTracking((Math.random() - 0.5) * 10);
      } else if (phase === 'warning') {
        setFlicker(Math.random() < 0.1 ? 0.05 : 0);
        setTracking((Math.random() - 0.5) * 4);
      } else {
        setFlicker(0);
        setTracking(0);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ transform: `translateX(${tracking}px)` }}>
      {/* 掃描線 */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,${0.15 + intensity * 0.1}) 1px, rgba(0,0,0,${0.15 + intensity * 0.1}) 2px)`,
        }}
      />
      
      {/* 移動掃描線 */}
      <div
        className="absolute left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: `scanMove ${phase === 'incident' ? 3 : 6}s linear infinite`,
        }}
      />
      
      {/* 色差效果 */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: `rgba(255, 0, 0, ${0.03 + intensity * 0.02})`,
          transform: `translateX(${2 + intensity * 2}px)`,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: `rgba(0, 255, 255, ${0.03 + intensity * 0.02})`,
          transform: `translateX(-${2 + intensity * 2}px)`,
        }}
      />
      
      {/* 暈影 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${0.4 + intensity * 0.3}) 100%)`,
        }}
      />
      
      {/* 綠色調 */}
      <div
        className="absolute inset-0"
        style={{
          mixBlendMode: 'color',
          background: `rgba(18, 60, 45, ${0.06 + intensity * 0.04})`,
        }}
      />
      
      {/* 閃爍 */}
      {flicker > 0 && (
        <div className="absolute inset-0" style={{ background: `rgba(255,255,255,${flicker})` }} />
      )}
      
      {/* RGB 邊條 */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 overflow-hidden">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(180deg, #f00 0px, #f00 3px, #0f0 3px, #0f0 6px, #00f 6px, #00f 9px)',
            opacity: 0.4 + intensity * 0.3,
            animation: 'rgbScroll 0.3s linear infinite',
          }}
        />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1.5 overflow-hidden">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(180deg, #0ff 0px, #0ff 3px, #ff0 3px, #ff0 6px, #f0f 6px, #f0f 9px)',
            opacity: 0.4 + intensity * 0.3,
            animation: 'rgbScroll 0.25s linear infinite reverse',
          }}
        />
      </div>
      
      {/* 危險邊框 */}
      {intensity > 0.6 && (
        <div
          className="absolute inset-0"
          style={{
            boxShadow: `inset 0 0 ${30 + (intensity - 0.6) * 80}px rgba(239, 68, 68, ${(intensity - 0.6) * 0.5})`,
            animation: 'warningPulse 1s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
});

// ===== 3D 熱點 =====
const Hotspot3D = memo(function Hotspot3D({ x, y, icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      className="absolute cursor-pointer transition-all duration-300"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) translateZ(${hovered ? 30 : 0}px) scale(${hovered ? 1.15 : 1})`,
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute -inset-4 rounded-full"
        style={{
          background: active
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)'
            : hovered
            ? 'radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'hotspotGlow 2s ease-in-out infinite',
        }}
      />
      <div
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(15,15,15,0.95) 100%)',
          border: active ? '2px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(120, 120, 120, 0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {icon}
      </div>
      {hovered && (
        <div
          className="absolute left-1/2 -bottom-8 -translate-x-1/2 whitespace-nowrap text-xs text-amber-200/80 bg-black/80 px-2 py-1 rounded border border-amber-900/30"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          {label}
        </div>
      )}
    </div>
  );
});

// ===== 主預覽組件 =====
export default function GhostH3DPreview() {
  const [phase, setPhase] = useState('stable');
  const [intensity, setIntensity] = useState(0.3);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [flashlight, setFlashlight] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 3D 視差追蹤
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPointer({ x: x * 100, y: y * 100 });
    setRotation({
      x: (y - 0.5) * -8,
      y: (x - 0.5) * 10,
    });
  }, []);

  // 模擬靈異事件
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1 && phase === 'stable') {
        setPhase('warning');
        setIntensity(0.5);
        setTimeout(() => {
          if (Math.random() < 0.4) {
            setPhase('incident');
            setIntensity(0.9);
            setTimeout(() => {
              setPhase('stable');
              setIntensity(0.3);
            }, 2000);
          } else {
            setPhase('stable');
            setIntensity(0.3);
          }
        }, 2500);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [phase]);

  // 時間戳
  const [timestamp, setTimestamp] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimestamp(`1987.12.13 ${now.toLocaleTimeString('en-US', { hour12: false })}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const hotspots = [
    { id: 1, x: 25, y: 55, icon: '🛞', label: '血跡輪椅' },
    { id: 2, x: 70, y: 40, icon: '🚪', label: '神秘門扉' },
    { id: 3, x: 50, y: 70, icon: '📄', label: '散落文件' },
    { id: 4, x: 80, y: 60, icon: '🪞', label: '破碎鏡子' },
  ];

  return (
    <div className="w-full h-screen bg-black overflow-hidden select-none" style={{ fontFamily: "'VT323', monospace" }}>
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}
        onMouseMove={handleMouseMove}
      >
        {/* 3D 場景容器 */}
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* 背景場景 */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #0a1612 0%, #1a2820 50%, #0d1510 100%)',
              filter: `saturate(${1 - intensity * 0.2}) contrast(${1 + intensity * 0.1})`,
            }}
          >
            {/* 模擬走廊 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute"
                style={{
                  width: '80%',
                  height: '60%',
                  background: 'linear-gradient(180deg, rgba(20,30,25,0.9) 0%, rgba(15,20,18,0.95) 100%)',
                  border: '1px solid rgba(60,80,70,0.3)',
                  transform: 'translateZ(-100px)',
                }}
              />
              <div
                className="absolute"
                style={{
                  width: '40%',
                  height: '80%',
                  background: 'linear-gradient(0deg, rgba(10,15,12,0.95) 0%, rgba(20,30,25,0.8) 100%)',
                  borderLeft: '1px solid rgba(40,60,50,0.4)',
                  borderRight: '1px solid rgba(40,60,50,0.4)',
                  transform: 'translateZ(-50px)',
                }}
              />
            </div>
          </div>

          {/* 粒子系統 */}
          <ParticleField
            count={phase === 'incident' ? 60 : phase === 'warning' ? 40 : 25}
            type={phase === 'incident' ? 'spirits' : 'dust'}
            intensity={intensity}
          />

          {/* 3D 熱點 */}
          {hotspots.map(h => (
            <Hotspot3D
              key={h.id}
              x={h.x}
              y={h.y}
              icon={h.icon}
              label={h.label}
              active={activeHotspot === h.id}
              onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
            />
          ))}

          {/* 手電筒效果 */}
          {flashlight && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(
                  ellipse 120px 160px at ${pointer.x}% ${pointer.y}%,
                  rgba(255, 248, 220, 0.15) 0%,
                  rgba(255, 248, 220, 0.05) 30%,
                  rgba(0, 0, 0, 0.97) 100%
                )`,
              }}
            />
          )}
        </div>

        {/* VHS 覆蓋層 */}
        <VHSOverlay phase={phase} intensity={intensity} />

        {/* 頂部 HUD */}
        <div className="absolute top-0 inset-x-0 z-50 px-3 py-2 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" style={{ animation: 'blink 2s infinite' }} />
              <span className="text-red-400 text-xs tracking-wider">REC</span>
            </div>
            <div className="text-center">
              <div className="text-stone-400/70 text-xs tracking-widest">CAM-B1-01</div>
              <div className="text-stone-500/50 text-xs">SPECTRAL LINK v4.0</div>
            </div>
            <div className={`text-xs ${phase === 'incident' ? 'text-red-400' : phase === 'warning' ? 'text-amber-400' : 'text-emerald-400/70'}`}>
              {phase === 'incident' ? '⚠ DANGER' : phase === 'warning' ? '⚡ ALERT' : '◉ STABLE'}
            </div>
          </div>
        </div>

        {/* 左側感測器 */}
        <div className="absolute top-14 left-2 z-50 flex flex-col gap-1.5">
          <div className="px-2 py-1.5 rounded-lg bg-stone-900/70 border border-stone-700/40 backdrop-blur">
            <div className="text-stone-500 text-xs tracking-wider">TEMP</div>
            <div className={`text-sm ${intensity > 0.6 ? 'text-cyan-300' : 'text-stone-300'}`}>
              {(18 - intensity * 8).toFixed(1)}°C
            </div>
          </div>
          <div className="px-2 py-1.5 rounded-lg bg-stone-900/70 border border-stone-700/40 backdrop-blur">
            <div className="text-stone-500 text-xs tracking-wider">EMF</div>
            <div className={`text-sm ${phase === 'incident' ? 'text-red-400' : phase === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {phase === 'incident' ? '4.8' : phase === 'warning' ? '2.3' : '0.7'} mG
            </div>
          </div>
          <div className="px-2 py-1.5 rounded-lg bg-stone-900/70 border border-stone-700/40 backdrop-blur">
            <div className="text-stone-500 text-xs tracking-wider">3D MODE</div>
            <div className="text-emerald-400 text-sm">ACTIVE</div>
          </div>
        </div>

        {/* 警告訊息 */}
        {phase !== 'stable' && (
          <div className="absolute top-14 left-24 right-4 z-50">
            <div className={`px-2 py-1.5 rounded-lg backdrop-blur ${
              phase === 'incident' 
                ? 'bg-red-950/60 border border-red-800/50' 
                : 'bg-amber-950/50 border border-amber-800/40'
            }`} style={{ animation: phase === 'incident' ? 'pulse 1s infinite' : 'none' }}>
              <div className={`text-center text-xs ${phase === 'incident' ? 'text-red-300' : 'text-amber-300/90'}`}>
                {phase === 'incident' ? '⚠ 高強度靈異反應！' : '⚡ 偵測到異常能量波動'}
              </div>
            </div>
          </div>
        )}

        {/* 底部工具列 */}
        <div className="absolute bottom-0 inset-x-0 z-50 px-2 py-2 bg-gradient-to-t from-black via-black/95 to-transparent">
          {/* 靈力條 */}
          <div className="mb-2 px-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-amber-400/70 text-xs tracking-wider">SPIRIT POWER</span>
              <span className="text-amber-300 text-xs">{Math.round(100 - intensity * 30)}%</span>
            </div>
            <div className="h-2 bg-stone-800/80 rounded-full overflow-hidden border border-stone-700/30">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${100 - intensity * 30}%`,
                  background: 'linear-gradient(90deg, rgba(180, 83, 9, 0.9), rgba(245, 158, 11, 0.95))',
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)',
                }}
              />
            </div>
          </div>

          {/* 工具按鈕 */}
          <div className="flex items-center justify-around gap-2">
            <button
              onClick={() => setFlashlight(!flashlight)}
              className={`flex-1 py-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all ${
                flashlight 
                  ? 'border-emerald-500/60 bg-emerald-900/20 shadow-lg shadow-emerald-500/20' 
                  : 'border-stone-700/50 bg-stone-900/70 hover:bg-stone-800/70'
              }`}
            >
              <span className={`text-xl ${flashlight ? 'animate-pulse' : ''}`}>🔦</span>
              <span className="text-white/80 text-xs">手電筒</span>
              <span className="text-stone-500 text-xs tracking-wider">LIGHT</span>
            </button>
            <button
              onClick={() => { setPhase('warning'); setIntensity(0.6); }}
              className="flex-1 py-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-stone-700/50 bg-stone-900/70 hover:bg-cyan-900/20 hover:border-cyan-700/50 transition-all"
            >
              <span className="text-xl">📡</span>
              <span className="text-white/80 text-xs">掃描</span>
              <span className="text-stone-500 text-xs tracking-wider">SCAN</span>
            </button>
            <button className="flex-1 py-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-stone-700/50 bg-stone-900/70 hover:bg-purple-900/20 hover:border-purple-700/50 transition-all">
              <span className="text-xl">📹</span>
              <span className="text-white/80 text-xs">回放</span>
              <span className="text-stone-500 text-xs tracking-wider">PLAYBACK</span>
            </button>
            <button
              onClick={() => { setPhase('stable'); setIntensity(0.2); }}
              className="flex-1 py-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-stone-700/50 bg-stone-900/70 hover:bg-amber-900/20 hover:border-amber-700/50 transition-all"
            >
              <span className="text-xl">🧿</span>
              <span className="text-white/80 text-xs">護符</span>
              <span className="text-stone-500 text-xs tracking-wider">SEAL</span>
            </button>
          </div>
        </div>

        {/* 時間戳 */}
        <div className="absolute bottom-32 right-2 z-50 text-right pointer-events-none">
          <div className="text-white/70 text-base tracking-wider">{timestamp}</div>
          <div className="text-white/30 text-xs">◆ SP-1998</div>
        </div>

        {/* VHS 標籤 */}
        <div className="absolute top-3 left-3 z-50 text-white/50 text-lg tracking-widest">
          ⬤ VHS
        </div>

        {/* 說明面板 */}
        <div className="absolute bottom-36 left-2 z-50 max-w-xs">
          <div className="px-3 py-2 rounded-lg bg-stone-900/80 border border-stone-700/40 backdrop-blur">
            <div className="text-emerald-400/90 text-xs mb-1">🎮 3D 效果預覽</div>
            <div className="text-stone-400 text-xs leading-relaxed">
              移動滑鼠體驗視差效果・點擊熱點互動・使用工具列控制
            </div>
          </div>
        </div>
      </div>

      {/* 動畫定義 */}
      <style>{`
        @keyframes particleFloat {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-10vh); opacity: 0; }
        }
        @keyframes scanMove {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes rgbScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(18px); }
        }
        @keyframes hotspotGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes warningPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.3; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
