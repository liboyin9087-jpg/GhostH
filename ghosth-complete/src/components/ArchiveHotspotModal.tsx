/**
 * 《靈異連線》標題檔案場景 - Hotspot 內容 Modal
 * Archive Hotspot Modal Component
 * 
 * 功能：
 * 1. 顯示 Hotspot 詳細內容
 * 2. 文字逐行顯示動畫
 * 3. VHS 風格視覺效果
 * 4. 恐怖氛圍音效觸發
 */

import React, { useState, useEffect, useCallback, memo, useRef } from 'react'
import type { HotspotRegion } from '../titleArchiveHotspots'

interface ArchiveHotspotModalProps {
  hotspot: HotspotRegion
  onClose: () => void
  reducedMotion?: boolean
}

export const ArchiveHotspotModal = memo(function ArchiveHotspotModal({
  hotspot,
  onClose,
  reducedMotion = false,
}: ArchiveHotspotModalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [isFullyLoaded, setIsFullyLoaded] = useState(false)
  const [staticFlicker, setStaticFlicker] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // 將內容分割成行
  const contentLines = hotspot.content.split('\n')
  
  // 逐行顯示動畫
  useEffect(() => {
    if (reducedMotion) {
      setDisplayedLines(contentLines)
      setIsFullyLoaded(true)
      return
    }
    
    setDisplayedLines([])
    setIsFullyLoaded(false)
    
    let lineIndex = 0
    const interval = setInterval(() => {
      if (lineIndex < contentLines.length) {
        setDisplayedLines(prev => [...prev, contentLines[lineIndex]])
        lineIndex++
        
        // 自動滾動到底部
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight
        }
      } else {
        clearInterval(interval)
        setIsFullyLoaded(true)
      }
    }, 50) // 每行 50ms
    
    return () => clearInterval(interval)
  }, [hotspot.id, contentLines, reducedMotion])
  
  // 隨機靜電閃爍效果（根據恐怖等級）
  useEffect(() => {
    if (reducedMotion || !hotspot.fearLevel) return
    
    const flickerChance = hotspot.fearLevel * 0.3 // 恐怖等級越高，閃爍越頻繁
    const interval = setInterval(() => {
      if (Math.random() < flickerChance) {
        setStaticFlicker(true)
        setTimeout(() => setStaticFlicker(false), 50 + Math.random() * 100)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [hotspot.fearLevel, reducedMotion])
  
  // 處理 ESC 關閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])
  
  // 計算恐怖等級顏色
  const getFearLevelColor = () => {
    const level = hotspot.fearLevel || 0
    if (level >= 0.7) return 'text-red-400 border-red-800/60'
    if (level >= 0.5) return 'text-orange-400 border-orange-800/60'
    if (level >= 0.3) return 'text-amber-400 border-amber-800/60'
    return 'text-stone-400 border-stone-700/60'
  }
  
  // 計算恐怖等級標籤
  const getFearLevelLabel = () => {
    const level = hotspot.fearLevel || 0
    if (level >= 0.7) return '極高風險'
    if (level >= 0.5) return '中高風險'
    if (level >= 0.3) return '低風險'
    return '安全'
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        style={{
          animation: 'modalBgFadeIn 0.3s ease-out',
        }}
      />
      
      {/* 靜電閃爍效果 */}
      {staticFlicker && (
        <div 
          className="absolute inset-0 z-[101] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.15,
          }}
        />
      )}
      
      {/* Modal 內容 */}
      <div 
        className={`
          relative z-[102] w-full max-w-lg max-h-[80vh] 
          bg-stone-950/95 border-2 rounded-lg overflow-hidden
          ${getFearLevelColor()}
        `}
        style={{
          animation: 'modalSlideIn 0.3s ease-out',
          boxShadow: `
            0 0 30px rgba(0, 0, 0, 0.8),
            inset 0 0 60px rgba(0, 0, 0, 0.5)
          `,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* VHS 掃描線覆蓋 */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 2px,
              rgba(0, 0, 0, 0.15) 2px,
              rgba(0, 0, 0, 0.15) 4px
            )`,
          }}
        />
        
        {/* 頂部標題欄 */}
        <div className="relative z-[2] flex items-center justify-between px-4 py-3 border-b border-stone-800/60 bg-stone-900/50">
          <div>
            <h2 
              id="modal-title"
              className="text-base font-bold text-stone-200 tracking-wide"
            >
              {hotspot.label}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-[10px] ${getFearLevelColor().split(' ')[0]}`}>
                [{getFearLevelLabel()}]
              </span>
              <span className="text-[10px] text-stone-500">
                {hotspot.interactionType === 'clue' ? '線索檔案' : '檢查紀錄'}
              </span>
            </div>
          </div>
          
          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded
                       bg-stone-800/60 border border-stone-700/40
                       text-stone-400 hover:text-red-400 hover:border-red-700/50
                       transition-all duration-200"
            aria-label="關閉"
          >
            X
          </button>
        </div>
        
        {/* 內容區域 */}
        <div 
          ref={contentRef}
          className="relative z-[2] p-4 max-h-[60vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(120, 113, 108, 0.4) transparent',
          }}
        >
          <div className="font-mono text-sm leading-relaxed text-stone-300/90 whitespace-pre-wrap">
            {displayedLines.map((line, index) => (
              <div 
                key={index}
                className="min-h-[1.5em]"
                style={{
                  animation: reducedMotion ? 'none' : 'lineAppear 0.1s ease-out',
                }}
              >
                {line || '\u00A0'}
              </div>
            ))}
            
            {/* 打字光標 */}
            {!isFullyLoaded && !reducedMotion && (
              <span className="inline-block w-2 h-4 bg-amber-400/70 animate-pulse ml-1" />
            )}
          </div>
        </div>
        
        {/* 底部狀態欄 */}
        <div className="relative z-[2] px-4 py-2 border-t border-stone-800/60 bg-stone-900/30">
          <div className="flex items-center justify-between text-[10px] text-stone-500">
            <span>
              {isFullyLoaded ? '▶ 載入完成' : '▶ 載入中...'}
            </span>
            <span>
              按 ESC 或點擊外部關閉
            </span>
          </div>
        </div>
        
        {/* 角落裝飾 */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-600/40" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-600/40" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-600/40" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-600/40" />
      </div>
      
      {/* 動畫樣式 */}
      <style>{`
        @keyframes modalBgFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes lineAppear {
          from { 
            opacity: 0;
            transform: translateX(-4px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
})

export default ArchiveHotspotModal
