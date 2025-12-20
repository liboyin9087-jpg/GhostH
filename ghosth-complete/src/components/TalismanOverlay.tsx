import React, { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function TalismanOverlay({ active, power, onComplete }: { active: boolean; power: number; onComplete?: () => void }) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<'idle'|'activating'|'sealing'|'complete'>('idle')
  const [glow, setGlow] = useState(0)

  useEffect(() => {
    if (!active) { setPhase('idle'); setGlow(0); return }
    setPhase('activating')
    let alive = true
    const id = window.setInterval(() => {
      setGlow((p) => {
        const next = Math.min(1, p + 0.12)
        if (next >= 1 && alive) {
          window.clearInterval(id)
          setPhase('sealing')
          window.setTimeout(() => { setPhase('complete'); onComplete?.() }, 1400)
        }
        return next
      })
    }, 90)
    return () => { alive = false; window.clearInterval(id) }
  }, [active, onComplete])

  if (!active && phase === 'idle') return null

  return (
    <div className="absolute inset-0" style={{ zIndex: 80, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
      <div className="absolute inset-0" style={{ background:'#000', opacity: glow*0.7, transition:'opacity 500ms' }} />
      <div style={{
        position:'relative',
        transform:`scale(${0.85+glow*0.45}) rotate(${(glow*5).toFixed(2)}deg)`,
        filter:`drop-shadow(0 0 ${20+glow*40}px rgba(245,158,11, ${0.25+glow*0.55}))`,
        transition:'transform 260ms'
      }}>
        <svg width="170" height="235" viewBox="0 0 170 235">
          <defs>
            <radialGradient id="paper" cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#f0d3a5" />
              <stop offset="60%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#7b4a22" />
            </radialGradient>
            <radialGradient id="blood" cx="30%" cy="80%" r="30%">
              <stop offset="0%" stopColor="#4a1515" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <path d="M18 10 Q25 6 35 12 L55 7 Q85 10 105 7 L135 12 Q150 10 155 18
            L162 45 Q158 85 162 125 L155 170 Q160 200 148 223 L125 228
            Q85 235 55 228 L25 223 Q12 210 10 190 L7 150 Q10 110 7 70
            L12 30 Q10 18 18 10 Z" fill="url(#paper)" />
          <ellipse cx="38" cy="190" rx="26" ry="18" fill="url(#blood)" />
        </svg>

        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:18, fontFamily:"'Noto Sans TC', serif" }}>
          <div style={{ fontSize: 11, letterSpacing: '.35em', color: 'rgba(120,53,15,.95)', marginBottom: 8 }}>符法顯天</div>
          <div style={{
            fontSize: 44, fontWeight: 900, color: 'rgba(153,27,27,.95)',
            textShadow: phase === 'sealing' ? '0 0 18px rgba(220,38,38,.75)' : 'none',
            animation: !reduced && phase === 'sealing' ? 'talismanPulse 500ms ease-in-out infinite' : undefined,
            marginBottom: 6,
          }}>鎮</div>
          <div style={{ width: 2, height: 44, background: 'rgba(153,27,27,.95)', marginBottom: 8 }} />
          <div style={{ display: 'grid', gap: 4, color: 'rgba(153,27,27,.95)', fontWeight: 800 }}>
            <div style={{ fontSize: 20, textAlign: 'center' }}>煞</div>
            <div style={{ fontSize: 20, textAlign: 'center' }}>伏</div>
            <div style={{ fontSize: 20, textAlign: 'center' }}>魔</div>
          </div>
        </div>
      </div>

      {!reduced && phase === 'sealing' && (
        <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} aria-hidden style={{
              position:'absolute', width:6, height:6, borderRadius:999, background:'rgba(245,158,11,.9)',
              left:`${20+Math.random()*60}%`, top:`${35+Math.random()*35}%`,
              animation:`float-up ${0.9+Math.random()*0.9}s ease-out infinite`,
              animationDelay:`${Math.random()*0.6}s`
            }} />
          ))}
        </div>
      )}

      <div className="absolute bottom-20 left-0 right-0" style={{ textAlign: 'center' }}>
        <div style={{ color: 'rgba(245,158,11,.9)', fontSize: 16, letterSpacing: '.22em' }}>
          {phase === 'activating' && '▶ 啟動封印程序…'}
          {phase === 'sealing' && `◆ 鎮煞伏魔 ◆ 封印進行中（SP:${Math.round(power)}）`}
          {phase === 'complete' && '✓ 封印完成'}
        </div>
      </div>
    </div>
  )
}
