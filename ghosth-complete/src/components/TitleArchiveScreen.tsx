/**
 * 《靈異連線》標題檔案場景組件
 * Title Archive Screen Component
 * 
 * 功能：
 * 1. 顯示仁心醫院封鎖檔案
 * 2. 6個互動熱點區域
 * 3. 漸進式內容解鎖
 * 4. VHS 視覺效果增強
 * 5. 長時間停留懲罰機制
 * 6. 場景進入時序動畫
 */

import React, { useState, useEffect, useCallback, memo, useRef } from 'react'
import { TITLE_ARCHIVE_HOTSPOTS, INITIAL_UNLOCKED_HOTSPOTS, type HotspotRegion } from '../titleArchiveHotspots'
import { ArchiveHotspotModal } from './ArchiveHotspotModal'

interface TitleArchiveScreenProps {
  onEnterGame: () => void
  reducedMotion?: boolean
}

// 場景進入時序階段
type LoadingPhase = 'black' | 'fadeIn' | 'scanlines' | 'hotspots' | 'ready'

export const TitleArchiveScreen = memo(function TitleArchiveScreen({
  onEnterGame,
  reducedMotion = false,
}: TitleArchiveScreenProps) {
  // 狀態管理
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotRegion | null>(null)
  const [unlockedHotspots, setUnlockedHotspots] = useState<Set<string>>(new Set(INITIAL_UNLOCKED_HOTSPOTS))
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('black')
  const [idleTime, setIdleTime] = useState(0)
  const [staticIntensity, setStaticIntensity] = useState(0)
  const [humVolume, setHumVolume] = useState(0)
  const [showHiddenHotspot, setShowHiddenHotspot] = useState(false)
  
  // Refs
  const idleTimerRef = useRef<number | null>(null)
  const staticIntervalRef = useRef<number | null>(null)
  
  // 場景進入時序動畫
  useEffect(() => {
    if (reducedMotion) {
      setLoadingPhase('ready')
      setHumVolume(0.15)
      return
    }
    
    // 時間點 0s: 黑屏 + 低頻 hum 音開始淡入
    const timeline = [
      { delay: 0, action: () => setLoadingPhase('black') },
      { delay: 500, action: () => setHumVolume(0.05) },
      { delay: 1000, action: () => { setLoadingPhase('fadeIn'); setHumVolume(0.1) } },
      { delay: 2000, action: () => { setLoadingPhase('scanlines'); setHumVolume(0.15) } },
      { delay: 3000, action: () => setStaticIntensity(0.15) },
      { delay: 3500, action: () => setStaticIntensity(0) },
      { delay: 4000, action: () => setLoadingPhase('hotspots') },
      { delay: 5500, action: () => setLoadingPhase('ready') },
    ]
    
    const timers = timeline.map(({ delay, action }) => 
      window.setTimeout(action, delay)
    )
    
    return () => timers.forEach(clearTimeout)
  }, [reducedMotion])
  
  // 長時間停留懲罰機制
  useEffect(() => {
    const resetIdleTimer = () => {
      setIdleTime(0)
    }
    
    // 監聽用戶活動
    window.addEventListener('mousemove', resetIdleTimer)
    window.addEventListener('click', resetIdleTimer)
    window.addEventListener('touchstart', resetIdleTimer)
    
    // 每秒增加閒置時間
    idleTimerRef.current = window.setInterval(() => {
      setIdleTime(prev => prev + 1)
    }, 1000)
    
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer)
      window.removeEventListener('click', resetIdleTimer)
      window.removeEventListener('touchstart', resetIdleTimer)
      if (idleTimerRef.current) clearInterval(idleTimerRef.current)
    }
  }, [])
  
  // 根據閒置時間調整效果強度
  useEffect(() => {
    if (idleTime < 30) return
    
    // 30-60秒：輕微增強
    // 60秒以上：明顯增強
    const baseIntensity = idleTime > 60 ? 0.25 : 0.1
    const staticFrequency = idleTime > 60 ? 3000 : 8000
    
    staticIntervalRef.current = window.setInterval(() => {
      if (Math.random() < 0.3) {
        setStaticIntensity(baseIntensity + Math.random() * 0.15)
        setTimeout(() => setStaticIntensity(0), 200 + Math.random() * 300)
      }
    }, staticFrequency)
    
    return () => {
      if (staticIntervalRef.current) clearInterval(staticIntervalRef.current)
    }
  }, [idleTime])
  
  // 處理 Hotspot 點擊
  const handleHotspotClick = useCallback((hotspot: HotspotRegion) => {
    if (!unlockedHotspots.has(hotspot.id)) return
    
    // 進入遊戲的特殊處理
    if (hotspot.interactionType === 'entry') {
      onEnterGame()
      return
    }
    
    setSelectedHotspot(hotspot)
    
    // 解鎖下一個 Hotspot
    const nextToUnlock = TITLE_ARCHIVE_HOTSPOTS.find(h => h.unlockAfter === hotspot.id)
    if (nextToUnlock) {
      setTimeout(() => {
        setUnlockedHotspots(prev => new Set([...prev, nextToUnlock.id]))
        // 如果解鎖的是隱藏區域，顯示它
        if (nextToUnlock.isHidden) {
          setShowHiddenHotspot(true)
        }
      }, 3000) // 3秒後解鎖
    }
  }, [unlockedHotspots, onEnterGame])
  
  // 關閉 Modal
  const handleCloseModal = useCallback(() => {
    setSelectedHotspot(null)
  }, [])
  
  // 計算效果參數
  const idlePenalty = Math.min(1, idleTime / 120) // 0-1，最多2分鐘
  const scanlineSpeed = 8 - idlePenalty * 4 // 8s -> 4s
  const humVolumeActual = humVolume + idlePenalty * 0.1 // 增加低頻音量
  
  // 計算載入動畫樣式
  const getOpacity = () => {
    switch (loadingPhase) {
      case 'black': return 0
      case 'fadeIn': return 0.5
      default: return 1
    }
  }
  
  const getHotspotsVisible = () => {
    return loadingPhase === 'hotspots' || loadingPhase === 'ready'
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* ===== 背景圖片 ===== */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: getOpacity() }}
      >
        <img
          src="/images/scenes/scene00_title.png"
          alt="仁心精神病院 - 封鎖檔案"
          className="w-full h-full object-cover"
          draggable={false}
          style={{
            filter: `
              saturate(${1 - idlePenalty * 0.2})
              contrast(${1 + idlePenalty * 0.1})
              brightness(${1 - idlePenalty * 0.1})
            `,
          }}
        />
      </div>
      
      {/* ===== VHS 掃描線效果（增強版） ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[20] pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 1px,
            rgba(0, 0, 0, ${0.25 + idlePenalty * 0.15}) 1px,
            rgba(0, 0, 0, ${0.25 + idlePenalty * 0.15}) 2px
          )`,
          animation: reducedMotion ? 'none' : `vhs_scanlines ${scanlineSpeed}s linear infinite`,
        }}
      />
      
      {/* ===== 移動掃描線 ===== */}
      {!reducedMotion && loadingPhase !== 'black' && (
        <div
          aria-hidden
          className="absolute left-0 right-0 h-[2px] z-[22] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, ${0.08 + idlePenalty * 0.07}), 
              transparent
            )`,
            animation: `scanlineMove ${scanlineSpeed}s linear infinite`,
          }}
        />
      )}
      
      {/* ===== 色差效果 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[18] pointer-events-none mix-blend-screen"
        style={{
          background: 'transparent',
          boxShadow: `
            inset ${2 + idlePenalty * 2}px 0 0 rgba(255, 0, 0, ${0.08 + idlePenalty * 0.05}),
            inset ${-2 - idlePenalty * 2}px 0 0 rgba(0, 255, 255, ${0.08 + idlePenalty * 0.05})
          `,
        }}
      />
      
      {/* ===== 綠色 VHS 色調 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[15] pointer-events-none"
        style={{
          mixBlendMode: 'color',
          background: `rgba(18, 60, 45, ${0.08 + idlePenalty * 0.04})`,
        }}
      />
      
      {/* ===== 靜電干擾效果 ===== */}
      {staticIntensity > 0 && (
        <div
          aria-hidden
          className="absolute inset-0 z-[25] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: staticIntensity,
            animation: 'noiseShift 0.05s steps(8) infinite',
          }}
        />
      )}
      
      {/* ===== 暈影效果 ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[12] pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(0, 0, 0, ${0.4 + idlePenalty * 0.2}) 60%,
            rgba(0, 0, 0, ${0.7 + idlePenalty * 0.2}) 100%
          )`,
        }}
      />
      
      {/* ===== Hotspot 互動區域 ===== */}
      {getHotspotsVisible() && TITLE_ARCHIVE_HOTSPOTS.map((hotspot, index) => {
        const isUnlocked = unlockedHotspots.has(hotspot.id)
        const isHidden = hotspot.isHidden && !showHiddenHotspot
        const isEntry = hotspot.interactionType === 'entry'
        
        if (isHidden) return null
        
        return (
          <div
            key={hotspot.id}
            className={`
              absolute z-[30] transition-all duration-300
              ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
            `}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`,
              opacity: loadingPhase === 'hotspots' 
                ? Math.min(1, (index + 1) * 0.2)
                : isUnlocked ? 1 : 0.3,
              animationDelay: `${index * 100}ms`,
            }}
            onClick={() => handleHotspotClick(hotspot)}
            role="button"
            aria-label={isUnlocked ? hotspot.label : `未解鎖: ${hotspot.label}`}
            tabIndex={isUnlocked ? 0 : -1}
          >
            {/* Hotspot 邊框 */}
            <div 
              className={`
                absolute inset-0 border-2 rounded-sm
                transition-all duration-200
                ${isUnlocked 
                  ? isEntry
                    ? 'border-red-600/60 hover:border-red-500 hover:bg-red-900/20 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                    : 'border-amber-700/40 hover:border-red-700/70 hover:bg-red-900/15 hover:shadow-[0_0_15px_rgba(139,0,0,0.3)]'
                  : 'border-stone-700/20'
                }
              `}
              style={{
                animation: isUnlocked && !reducedMotion 
                  ? `hotspot_pulse ${2 + index * 0.3}s ease-in-out infinite`
                  : 'none',
              }}
            />
            
            {/* 進入按鈕特殊樣式 */}
            {isEntry && isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-red-400/80 text-sm tracking-wider animate-pulse">
                  [ 點擊進入調查 ]
                </div>
              </div>
            )}
            
            {/* Hotspot 標籤 */}
            {isUnlocked && !isEntry && (
              <div 
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap
                           text-[10px] text-amber-200/60 bg-black/60 px-2 py-0.5 rounded
                           opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {hotspot.label}
              </div>
            )}
          </div>
        )
      })}
      
      {/* ===== 系統提示文字 ===== */}
      {loadingPhase === 'ready' && (
        <div 
          className="absolute bottom-4 left-4 z-[40] animate-fadeIn"
          style={{ animationDelay: '500ms' }}
        >
          <div className="text-[10px] text-emerald-400/50 tracking-wider font-mono">
            ARCHIVE SYSTEM v1.987
          </div>
          <div className="text-[9px] text-stone-500/60 mt-1">
            點擊檔案區域查看詳情 | 按順序解鎖更多資訊
          </div>
        </div>
      )}
      
      {/* ===== 閒置警告 ===== */}
      {idleTime > 45 && (
        <div 
          className="absolute top-4 right-4 z-[40] animate-pulse"
        >
          <div className="text-[10px] text-red-400/70 tracking-wider">
            [!] 訊號不穩定...
          </div>
        </div>
      )}
      
      {/* ===== VHS 時間戳 ===== */}
      <div className="absolute bottom-4 right-4 z-[40] text-right pointer-events-none">
        <div className="text-white/50 text-sm font-mono tracking-wider">
          1987.12.13 23:59
        </div>
        <div className="text-white/30 text-[9px]">
          ARCHIVE-001 | REC
        </div>
      </div>
      
      {/* ===== 內容 Modal ===== */}
      {selectedHotspot && (
        <ArchiveHotspotModal
          hotspot={selectedHotspot}
          onClose={handleCloseModal}
          reducedMotion={reducedMotion}
        />
      )}
      
      {/* ===== 動畫樣式 ===== */}
      <style>{`
        @keyframes vhs_scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        
        @keyframes scanlineMove {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        
        @keyframes noiseShift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1.5%, 1.5%); }
          50% { transform: translate(1.5%, -1%); }
          75% { transform: translate(-1%, 1%); }
        }
        
        @keyframes hotspot_pulse {
          0%, 100% { 
            opacity: 0.7;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.01);
          }
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(8px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
})

export default TitleArchiveScreen
