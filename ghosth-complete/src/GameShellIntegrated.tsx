/**
 * 《靈異連線》整合版遊戲主殼
 * Spectral Link - Integrated Game Shell v4.0
 * 
 * 整合功能：
 * 1. 完整 3D 效果系統
 * 2. 增強 VHS 視覺效果
 * 3. 視差場景圖層
 * 4. 3D 粒子系統
 * 5. 優化的互動熱點
 * 6. 場景深度效果
 */

import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from "react"

// 3D 效果系統
import { 
  Scene3DContainer, 
  ParallaxLayer, 
  ParticleField, 
  Flashlight3D,
  DepthOfField,
  SceneTransition3D,
  Hotspot3D 
} from "./effects/Scene3DEffects"
import { VHSEnhanced, useVHSEffect } from "./effects/VHSEnhanced"

// 類型定義
type Mode = null | "flashlight" | "scan" | "playback" | "talisman"
type SceneId = "corridor_b1" | "nurse_station" | "morgue" | "title_archive"
type HauntPhase = "stable" | "warning" | "incident"

interface Hotspot {
  id: string
  x: number
  y: number
  z?: number
  icon: string
  label: string
  description: string
  sceneLink?: SceneId
  requiresFlashlight?: boolean
}

interface Clue {
  id: string
  title: string
  description: string
  timestamp: number
}

// ===== 場景配置 =====
const SCENES: Record<SceneId, { src: string; label: string; cameraId: string; ambient: string }> = {
  title_archive: {
    src: "/images/scenes/scene00_title.png",
    label: "仁心醫院封鎖檔案",
    cameraId: "ARCH-001",
    ambient: "amb_hospital_base",
  },
  corridor_b1: {
    src: "/images/scenes/scene01_corridor.png",
    label: "B1 走廊",
    cameraId: "CAM-B1-01",
    ambient: "amb_corridor",
  },
  nurse_station: {
    src: "/images/scenes/scene02_nurse_station.png",
    label: "護理站",
    cameraId: "CAM-B1-02",
    ambient: "amb_nurse",
  },
  morgue: {
    src: "/images/scenes/scene05_morgue.png",
    label: "太平間",
    cameraId: "CAM-B2-01",
    ambient: "amb_morgue",
  },
}

const SCENE_ORDER: SceneId[] = ["corridor_b1", "nurse_station", "morgue"]

// ===== 場景熱點 =====
const SCENE_HOTSPOTS: Record<SceneId, Hotspot[]> = {
  title_archive: [],
  corridor_b1: [
    { id: "wheelchair", x: 30, y: 55, z: 20, icon: "🛞", label: "血跡輪椅", description: "輪椅沾滿血跡" },
    { id: "door_nurse", x: 75, y: 40, z: 10, icon: "🚪", label: "護理站入口", description: "通往護理站", sceneLink: "nurse_station" },
    { id: "documents", x: 55, y: 70, z: 5, icon: "📄", label: "散落的文件", description: "地上的病歷", requiresFlashlight: true },
    { id: "mirror", x: 20, y: 45, z: 15, icon: "🪞", label: "破碎的鏡子", description: "倒影異常" },
  ],
  nurse_station: [
    { id: "phone", x: 40, y: 50, z: 10, icon: "📞", label: "老式電話", description: "偶爾會響" },
    { id: "diary", x: 65, y: 55, z: 20, icon: "📔", label: "護理長日誌", description: "1998年12月" },
    { id: "door_corridor", x: 10, y: 50, z: 5, icon: "🚪", label: "返回走廊", description: "B1走廊", sceneLink: "corridor_b1" },
    { id: "door_morgue", x: 85, y: 50, z: 5, icon: "🚪", label: "太平間入口", description: "地下太平間", sceneLink: "morgue" },
  ],
  morgue: [
    { id: "freezer", x: 35, y: 50, z: 15, icon: "🧊", label: "冰櫃 #7", description: "微開的抽屜" },
    { id: "table", x: 60, y: 55, z: 10, icon: "🛏️", label: "解剖台", description: "有刮痕", requiresFlashlight: true },
    { id: "locker", x: 80, y: 45, z: 20, icon: "🗄️", label: "置物櫃", description: "護士服" },
    { id: "door_back", x: 15, y: 50, z: 5, icon: "🚪", label: "返回護理站", description: "護理站", sceneLink: "nurse_station" },
  ],
}

// ===== 主遊戲組件 =====
const GameShellIntegrated = memo(function GameShellIntegrated() {
  // ===== 狀態管理 =====
  const [sceneId, setSceneId] = useState<SceneId>("corridor_b1")
  const [activeMode, setActiveMode] = useState<Mode>(null)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward')
  const [clues, setClues] = useState<Clue[]>([])
  const [spiritPower, setSpiritPower] = useState(100)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [fearLevel, setFearLevel] = useState(0)
  const [phase, setPhase] = useState<HauntPhase>("stable")
  const [intensity, setIntensity] = useState(0.2)
  const [isScanning, setIsScanning] = useState(false)
  const [showTalisman, setShowTalisman] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  
  // Refs
  const sceneRef = useRef<HTMLDivElement>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // VHS 效果配置
  const vhsConfig = useVHSEffect(phase, intensity)

  // 當前場景熱點
  const currentHotspots = useMemo(() => SCENE_HOTSPOTS[sceneId] || [], [sceneId])

  // ===== 時間戳 =====
  const [timestamp, setTimestamp] = useState("1987.12.13 23:59:47")
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date()
      const dateStr = "1987.12.13"
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false })
      setTimestamp(`${dateStr} ${timeStr}`)
    }
    updateTimestamp()
    const interval = setInterval(updateTimestamp, 1000)
    return () => clearInterval(interval)
  }, [])

  // ===== 恐懼系統模擬 =====
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current
      
      // 長時間無活動增加恐懼
      if (timeSinceActivity > 15000) {
        setFearLevel(prev => Math.min(100, prev + 1))
        setIntensity(prev => Math.min(1, prev + 0.02))
      }
      
      // 隨機事件
      if (Math.random() < 0.05 && phase === 'stable') {
        setPhase('warning')
        setIntensity(0.5)
        setTimeout(() => {
          if (Math.random() < 0.3) {
            setPhase('incident')
            setIntensity(0.9)
            setTimeout(() => {
              setPhase('stable')
              setIntensity(0.2)
            }, 2000)
          } else {
            setPhase('stable')
            setIntensity(0.2)
          }
        }, 3000)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [phase])

  // ===== 指針追蹤 =====
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!sceneRef.current) return
    lastActivityRef.current = Date.now()
    
    const rect = sceneRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPointer({ x, y })
  }, [])

  // ===== 場景切換 =====
  const gotoScene = useCallback((targetId: SceneId) => {
    if (targetId === sceneId || isTransitioning) return
    
    const currentIndex = SCENE_ORDER.indexOf(sceneId)
    const targetIndex = SCENE_ORDER.indexOf(targetId)
    setTransitionDirection(targetIndex > currentIndex ? 'forward' : 'backward')
    
    setIsTransitioning(true)
    
    setTimeout(() => {
      setSceneId(targetId)
      setTimeout(() => setIsTransitioning(false), 400)
    }, 400)
  }, [sceneId, isTransitioning])

  const nextScene = useCallback(() => {
    const idx = SCENE_ORDER.indexOf(sceneId)
    const next = SCENE_ORDER[(idx + 1) % SCENE_ORDER.length]
    gotoScene(next)
  }, [sceneId, gotoScene])

  // ===== 工具切換 =====
  const toggleFlashlight = useCallback(() => {
    setActiveMode(prev => prev === 'flashlight' ? null : 'flashlight')
    lastActivityRef.current = Date.now()
  }, [])

  const onScan = useCallback(() => {
    if (isScanning || spiritPower < 10) return
    
    setActiveMode('scan')
    setIsScanning(true)
    setSpiritPower(prev => Math.max(0, prev - 10))
    
    setTimeout(() => {
      setIsScanning(false)
      setActiveMode(null)
      // 模擬掃描結果
      const newClue: Clue = {
        id: `clue-${Date.now()}`,
        title: "異常能量波動",
        description: "偵測到微弱的靈異能量殘留...",
        timestamp: Date.now(),
      }
      setClues(prev => [...prev, newClue])
    }, 3000)
  }, [isScanning, spiritPower])

  const onTalisman = useCallback(() => {
    if (spiritPower < 30) return
    
    setShowTalisman(true)
    setActiveMode('talisman')
    setSpiritPower(prev => Math.max(0, prev - 30))
    
    // 護符效果：清除恐懼
    setTimeout(() => {
      setFearLevel(0)
      setPhase('stable')
      setIntensity(0.1)
      setShowTalisman(false)
      setActiveMode(null)
    }, 3000)
  }, [spiritPower])

  // ===== 熱點互動 =====
  const onHotspotClick = useCallback((hotspot: Hotspot) => {
    lastActivityRef.current = Date.now()
    
    if (hotspot.requiresFlashlight && activeMode !== 'flashlight') {
      // 需要手電筒
      return
    }
    
    if (hotspot.sceneLink) {
      gotoScene(hotspot.sceneLink)
    } else {
      setSelectedHotspot(hotspot)
    }
  }, [activeMode, gotoScene])

  // ===== 渲染 =====
  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      <VHSEnhanced
        phase={phase}
        intensity01={intensity}
        reducedMotion={false}
        enable3D={true}
        glitchLevel={vhsConfig.glitchLevel}
        colorGrade={vhsConfig.colorGrade}
      >
        <Scene3DContainer intensity={0.4} mouseParallax={true} gyroEnabled={true}>
          {/* ===== 頂部 HUD ===== */}
          <header className="absolute top-0 inset-x-0 z-[80] px-3 py-2 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
                <span className="text-red-400 text-xs font-mono tracking-wider">REC</span>
              </div>
              
              <div className="text-center">
                <div className="text-[10px] text-stone-400/70 tracking-widest">{SCENES[sceneId].cameraId}</div>
                <div className="text-[8px] text-stone-500/50">SPECTRAL LINK v1.0</div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-[10px] text-amber-400/70 font-mono">
                  🔋 {batteryLevel}%
                </div>
                <div className={`text-[10px] font-mono ${phase === 'incident' ? 'text-red-400 animate-pulse' : phase === 'warning' ? 'text-amber-400' : 'text-emerald-400/70'}`}>
                  {phase === 'incident' ? '⚠ DANGER' : phase === 'warning' ? '⚡ ALERT' : '◉ STABLE'}
                </div>
              </div>
            </div>
          </header>

          {/* ===== 感測器面板 ===== */}
          <div className="absolute top-14 left-2 z-[70] flex flex-col gap-1.5">
            <div className="px-2 py-1.5 rounded-lg bg-stone-900/70 border border-stone-700/40 backdrop-blur-sm">
              <div className="text-[8px] text-stone-500 tracking-wider">TEMP</div>
              <div className={`text-sm font-mono ${fearLevel > 50 ? 'text-cyan-300' : 'text-stone-300'}`}>
                {(18 - fearLevel * 0.15).toFixed(1)}°C
              </div>
            </div>
            
            <div className="px-2 py-1.5 rounded-lg bg-stone-900/70 border border-stone-700/40 backdrop-blur-sm">
              <div className="text-[8px] text-stone-500 tracking-wider">EMF</div>
              <div className={`text-sm font-mono ${phase === 'incident' ? 'text-red-400' : phase === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {phase === 'incident' ? '4.8' : phase === 'warning' ? '2.3' : '0.7'} mG
              </div>
            </div>
            
            <div className="px-2 py-1.5 rounded-lg bg-stone-900/70 border border-stone-700/40 backdrop-blur-sm">
              <div className="text-[8px] text-stone-500 tracking-wider">FEAR</div>
              <div className="w-12 h-1.5 bg-stone-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${fearLevel}%`,
                    background: fearLevel > 70 ? '#ef4444' : fearLevel > 40 ? '#f59e0b' : '#22c55e',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ===== 危險警告 ===== */}
          {phase !== 'stable' && (
            <div className="absolute top-14 left-[85px] right-12 z-[70]">
              <div className={`px-2 py-1.5 rounded-lg backdrop-blur-sm ${
                phase === 'incident' 
                  ? 'bg-red-950/60 border border-red-800/50 animate-pulse' 
                  : 'bg-amber-950/50 border border-amber-800/40'
              }`}>
                <div className={`text-[10px] text-center tracking-wide ${
                  phase === 'incident' ? 'text-red-300' : 'text-amber-300/90'
                }`}>
                  {phase === 'incident' 
                    ? '⚠ 高強度靈異反應！立即使用護符！' 
                    : '⚡ 偵測到異常能量波動'
                  }
                </div>
              </div>
            </div>
          )}

          {/* ===== 主場景區域 ===== */}
          <main
            ref={sceneRef}
            onPointerMove={onPointerMove}
            className="absolute inset-0 pt-[85px] pb-[140px]"
            style={{ touchAction: 'none' }}
          >
            <SceneTransition3D 
              active={isTransitioning} 
              direction={transitionDirection}
              duration={400}
            >
              <DepthOfField focusPoint={pointer} blurAmount={2} enabled={activeMode === 'flashlight'}>
                {/* 背景層 - 遠景 */}
                <ParallaxLayer depth={-30} className="z-[1]">
                  <div className="absolute inset-0 bg-black/40" />
                </ParallaxLayer>

                {/* 主場景圖 */}
                <ParallaxLayer depth={0} className="z-[10]">
                  <img
                    src={SCENES[sceneId].src}
                    alt={SCENES[sceneId].label}
                    draggable={false}
                    className="w-full h-full object-cover"
                    style={{
                      opacity: 0.92,
                      filter: `saturate(${1 - fearLevel * 0.005})`,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `rgba(0, 0, 0, ${0.3 + fearLevel * 0.004})`,
                    }}
                  />
                </ParallaxLayer>

                {/* 前景氛圍層 */}
                <ParallaxLayer depth={30} className="z-[12]">
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,0.4) 0%, transparent 60%)',
                    }}
                  />
                </ParallaxLayer>

                {/* 3D 粒子場 */}
                <ParticleField 
                  count={phase === 'incident' ? 80 : phase === 'warning' ? 50 : 30}
                  type={phase === 'incident' ? 'spirits' : 'dust'}
                  intensity={intensity}
                />

                {/* 3D 熱點 */}
                {currentHotspots.map((hotspot) => (
                  <Hotspot3D
                    key={hotspot.id}
                    x={hotspot.x}
                    y={hotspot.y}
                    z={hotspot.z}
                    icon={hotspot.icon}
                    label={hotspot.label}
                    active={selectedHotspot?.id === hotspot.id}
                    unlocked={!hotspot.requiresFlashlight || activeMode === 'flashlight'}
                    onClick={() => onHotspotClick(hotspot)}
                  />
                ))}

                {/* 3D 手電筒效果 */}
                <Flashlight3D
                  x={pointer.x}
                  y={pointer.y}
                  active={activeMode === 'flashlight'}
                  intensity={1}
                />

                {/* 掃描效果 */}
                {activeMode === 'scan' && (
                  <div className="absolute inset-0 pointer-events-none z-[44]">
                    <div className="absolute inset-0 bg-cyan-950/15" />
                    <div
                      className="absolute inset-x-0 h-1"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.7), transparent)',
                        animation: 'scanline-move 2s linear infinite',
                      }}
                    />
                    <div className="absolute top-4 left-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-cyan-300 text-sm tracking-wider">SCANNING...</span>
                    </div>
                    <div className="absolute bottom-4 right-4 text-cyan-400/60 text-[10px] font-mono">
                      {isScanning ? 'PROCESSING...' : 'READY'}
                    </div>
                  </div>
                )}
              </DepthOfField>
            </SceneTransition3D>

            {/* 場景位置標籤 */}
            <div className="absolute bottom-3 left-3 z-[35]">
              <div className="text-[9px] text-emerald-400/50 tracking-wider font-mono">
                LOC: {SCENES[sceneId].label}
              </div>
            </div>

            {/* 線索按鈕 */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="absolute top-4 right-2 z-[70] w-12 h-12 rounded-xl bg-stone-900/70 border border-stone-700/50 flex flex-col items-center justify-center hover:bg-stone-800/80 transition-all active:scale-95"
            >
              <span className="text-lg">📋</span>
              <span className="text-[7px] text-stone-400">LOG</span>
              {clues.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-black animate-pulse">
                  {clues.length}
                </span>
              )}
            </button>

            {/* 場景切換 */}
            <button
              onClick={nextScene}
              className="absolute top-[120px] right-2 z-[70] w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center text-sm hover:bg-purple-800/60 transition-all active:scale-95"
            >
              🚪
            </button>
          </main>

          {/* ===== 護符效果覆蓋 ===== */}
          {showTalisman && (
            <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center">
              <div 
                className="w-64 h-64 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
                  animation: 'talisman-pulse 1s ease-out infinite',
                  boxShadow: '0 0 60px rgba(245, 158, 11, 0.5)',
                }}
              />
              <div className="absolute text-6xl animate-bounce">🧿</div>
              <div className="absolute bottom-1/3 text-amber-300/80 text-sm tracking-widest animate-pulse">
                封印中...
              </div>
            </div>
          )}

          {/* ===== 底部工具列 ===== */}
          <footer className="absolute bottom-0 inset-x-0 z-[80] px-2 py-2 bg-gradient-to-t from-black via-black/95 to-transparent">
            {/* 靈力條 */}
            <div className="mb-2 px-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] text-amber-400/70 tracking-wider">SPIRIT POWER</span>
                <span className="text-[10px] text-amber-300 font-mono">{spiritPower}%</span>
              </div>
              <div className="h-2 bg-stone-800/80 rounded-full overflow-hidden border border-stone-700/30">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${spiritPower}%`,
                    background: spiritPower > 30 
                      ? 'linear-gradient(90deg, rgba(180, 83, 9, 0.9), rgba(245, 158, 11, 0.95))' 
                      : 'linear-gradient(90deg, rgba(185, 28, 28, 0.9), rgba(239, 68, 68, 0.95))',
                    boxShadow: spiritPower > 30 
                      ? '0 0 10px rgba(245, 158, 11, 0.4)' 
                      : '0 0 10px rgba(239, 68, 68, 0.4)',
                  }}
                />
              </div>
            </div>

            {/* 工具按鈕 */}
            <div className="flex items-center justify-around gap-2">
              <ToolBtn
                icon="🔦"
                label="手電筒"
                sublabel="LIGHT"
                active={activeMode === 'flashlight'}
                onClick={toggleFlashlight}
              />
              <ToolBtn
                icon="📡"
                label="掃描"
                sublabel="SCAN"
                active={activeMode === 'scan'}
                loading={isScanning}
                disabled={spiritPower < 10}
                onClick={onScan}
                variant="cyan"
              />
              <ToolBtn
                icon="📹"
                label="回放"
                sublabel="PLAYBACK"
                onClick={() => {}}
                variant="purple"
              />
              <ToolBtn
                icon="🧿"
                label="護符"
                sublabel="SEAL"
                active={activeMode === 'talisman'}
                disabled={spiritPower < 30}
                onClick={onTalisman}
                variant="amber"
              />
            </div>
          </footer>

          {/* ===== VHS 時間戳 ===== */}
          <div className="absolute bottom-[145px] right-2 z-[75] text-right pointer-events-none">
            <div className="text-white/70 text-base font-mono tracking-wider">{timestamp}</div>
            <div className="text-white/30 text-[9px]">◆ SP-1998</div>
          </div>
        </Scene3DContainer>
      </VHSEnhanced>

      {/* ===== 熱點詳情彈窗 ===== */}
      {selectedHotspot && (
        <div 
          className="absolute inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedHotspot(null)}
        >
          <div 
            className="max-w-sm mx-4 p-4 rounded-xl bg-stone-900/95 border border-stone-700/50"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'modal-in 0.2s ease-out' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{selectedHotspot.icon}</span>
              <div>
                <h3 className="text-lg text-white/90">{selectedHotspot.label}</h3>
                <p className="text-sm text-stone-400">{selectedHotspot.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="w-full py-2 rounded-lg bg-stone-800 border border-stone-700/50 text-stone-300 text-sm hover:bg-stone-700 transition-colors"
            >
              關閉
            </button>
          </div>
        </div>
      )}

      {/* ===== 線索抽屜 ===== */}
      {drawerOpen && (
        <div 
          className="absolute inset-0 z-[200] flex items-end bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        >
          <div 
            className="w-full max-h-[60vh] rounded-t-2xl bg-stone-900/98 border-t border-stone-700/50 overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'drawer-in 0.3s ease-out' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
              <h2 className="text-white/90 font-medium">調查紀錄 ({clues.length})</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>
            <div className="p-4 max-h-[45vh] overflow-y-auto">
              {clues.length === 0 ? (
                <div className="text-center text-stone-500 py-8">
                  尚未發現任何線索<br/>
                  <span className="text-[11px]">使用掃描功能探索環境</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {clues.map(clue => (
                    <div key={clue.id} className="p-3 rounded-lg bg-stone-800/60 border border-stone-700/30">
                      <div className="text-sm text-amber-300/90">{clue.title}</div>
                      <div className="text-xs text-stone-400 mt-1">{clue.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== 動畫樣式 ===== */}
      <style>{`
        @keyframes scanline-move {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        
        @keyframes talisman-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes drawer-in {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
})

// ===== 工具按鈕組件 =====
interface ToolBtnProps {
  icon: string
  label: string
  sublabel: string
  active?: boolean
  loading?: boolean
  disabled?: boolean
  variant?: 'default' | 'cyan' | 'purple' | 'amber'
  onClick: () => void
}

const ToolBtn = memo(function ToolBtn({
  icon,
  label,
  sublabel,
  active = false,
  loading = false,
  disabled = false,
  variant = 'default',
  onClick,
}: ToolBtnProps) {
  const variantStyles = {
    default: {
      border: active ? 'border-emerald-500/60' : 'border-stone-700/50',
      bg: active ? 'bg-emerald-900/20' : 'bg-stone-900/70',
      glow: active ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none',
    },
    cyan: {
      border: active ? 'border-cyan-500/60' : 'border-stone-700/50',
      bg: active ? 'bg-cyan-900/20' : 'bg-stone-900/70',
      glow: active ? '0 0 15px rgba(6, 182, 212, 0.3)' : 'none',
    },
    purple: {
      border: 'border-purple-700/50',
      bg: 'bg-stone-900/70',
      glow: 'none',
    },
    amber: {
      border: active ? 'border-amber-500/60' : 'border-stone-700/50',
      bg: active ? 'bg-amber-900/20' : 'bg-stone-900/70',
      glow: active ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none',
    },
  }

  const style = variantStyles[variant]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex-1 py-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5
        border transition-all duration-200 active:scale-95
        ${style.border} ${style.bg}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-stone-800/70'}
      `}
      style={{ boxShadow: style.glow }}
    >
      <span className={`text-xl ${loading ? 'animate-pulse' : active ? 'animate-bounce' : ''}`}>
        {icon}
      </span>
      <span className="text-[10px] text-white/80">{label}</span>
      <span className="text-[7px] text-stone-500 tracking-wider">{sublabel}</span>
    </button>
  )
})

export default GameShellIntegrated
