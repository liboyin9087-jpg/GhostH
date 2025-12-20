/**
 * 《靈異連線》3D 效果系統
 * Spectral Link - Advanced 3D Effects System
 * 
 * 功能：
 * 1. CSS 3D 透視場景
 * 2. 視差滾動效果
 * 3. 3D 粒子系統（靈異塵埃）
 * 4. 深度層疊效果
 * 5. 3D 手電筒光暈
 * 6. 場景景深模糊
 */

import React, { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react'

// ===== 類型定義 =====
interface Particle {
  id: number
  x: number
  y: number
  z: number
  size: number
  opacity: number
  speed: number
  drift: number
  delay: number
}

interface Scene3DContainerProps {
  children: React.ReactNode
  intensity?: number  // 0-1
  gyroEnabled?: boolean
  mouseParallax?: boolean
  perspective?: number
  reducedMotion?: boolean
}

interface ParallaxLayerProps {
  children: React.ReactNode
  depth: number  // -100 to 100, negative = foreground
  className?: string
}

interface ParticleFieldProps {
  count?: number
  type?: 'dust' | 'spirits' | 'embers' | 'fog'
  intensity?: number
  color?: string
  reducedMotion?: boolean
}

interface Flashlight3DProps {
  x: number
  y: number
  active: boolean
  intensity?: number
  color?: string
}

interface DepthOfFieldProps {
  children: React.ReactNode
  focusPoint?: { x: number; y: number }
  blurAmount?: number
  enabled?: boolean
}

// ===== 3D 場景容器 =====
export const Scene3DContainer = memo(function Scene3DContainer({
  children,
  intensity = 0.5,
  gyroEnabled = true,
  mouseParallax = true,
  perspective = 1000,
  reducedMotion = false,
}: Scene3DContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  // 陀螺儀效果
  useEffect(() => {
    if (!gyroEnabled || reducedMotion) return

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e
      if (beta === null || gamma === null) return
      
      const rotateX = Math.max(-15, Math.min(15, beta - 45)) * intensity * 0.3
      const rotateY = Math.max(-15, Math.min(15, gamma)) * intensity * 0.3
      
      setTransform({ rotateX, rotateY })
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [gyroEnabled, intensity, reducedMotion])

  // 滑鼠視差效果
  useEffect(() => {
    if (!mouseParallax || reducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      
      setMousePos({ x, y })
      
      const rotateY = (x - 0.5) * 10 * intensity
      const rotateX = (y - 0.5) * -8 * intensity
      
      setTransform({ rotateX, rotateY })
    }

    const container = containerRef.current
    container?.addEventListener('mousemove', handleMouseMove)
    return () => container?.removeEventListener('mousemove', handleMouseMove)
  }, [mouseParallax, intensity, reducedMotion])

  const containerStyle = useMemo(() => ({
    perspective: `${perspective}px`,
    perspectiveOrigin: '50% 50%',
  }), [perspective])

  const innerStyle = useMemo(() => ({
    transform: reducedMotion 
      ? 'none' 
      : `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.15s ease-out',
  }), [transform, reducedMotion])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={containerStyle}>
      <div className="relative w-full h-full" style={innerStyle}>
        {children}
      </div>
      
      {/* 3D 深度指示器（調試用，可移除） */}
      {/* <div className="absolute top-2 left-2 z-[200] text-[8px] text-white/30 font-mono">
        3D: X{transform.rotateX.toFixed(1)}° Y{transform.rotateY.toFixed(1)}°
      </div> */}
    </div>
  )
})

// ===== 視差圖層 =====
export const ParallaxLayer = memo(function ParallaxLayer({
  children,
  depth,
  className = '',
}: ParallaxLayerProps) {
  const scale = 1 + depth * 0.002
  const translateZ = depth * 2
  
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{
        transform: `translateZ(${translateZ}px) scale(${scale})`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
})

// ===== 3D 粒子系統 =====
export const ParticleField = memo(function ParticleField({
  count = 50,
  type = 'dust',
  intensity = 0.5,
  color,
  reducedMotion = false,
}: ParticleFieldProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i): Particle => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 200 - 100,
      size: type === 'spirits' 
        ? 2 + Math.random() * 4
        : type === 'embers'
        ? 1 + Math.random() * 2
        : 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.4 * intensity,
      speed: 10 + Math.random() * 30,
      drift: Math.random() * 10 - 5,
      delay: Math.random() * 10,
    }))
  }, [count, type, intensity])

  const getParticleStyle = useCallback((p: Particle) => {
    const baseColor = color || (
      type === 'spirits' ? '140, 255, 200' :
      type === 'embers' ? '255, 160, 50' :
      type === 'fog' ? '200, 200, 200' :
      '180, 180, 180'
    )

    const glowSize = type === 'spirits' ? p.size * 3 : type === 'embers' ? p.size * 2 : 0

    return {
      position: 'absolute' as const,
      left: `${p.x}%`,
      top: `${p.y}%`,
      width: `${p.size}px`,
      height: `${p.size}px`,
      borderRadius: '50%',
      background: type === 'fog'
        ? `radial-gradient(circle, rgba(${baseColor}, ${p.opacity}) 0%, transparent 70%)`
        : `rgba(${baseColor}, ${p.opacity})`,
      boxShadow: glowSize > 0 
        ? `0 0 ${glowSize}px rgba(${baseColor}, ${p.opacity * 0.7})` 
        : 'none',
      transform: `translateZ(${p.z}px)`,
      animation: reducedMotion 
        ? 'none' 
        : `particle-float-${type} ${p.speed}s linear ${p.delay}s infinite`,
      willChange: 'transform, opacity',
    }
  }, [type, color, reducedMotion])

  if (reducedMotion || count === 0) return null

  return (
    <div 
      className="absolute inset-0 z-[15] pointer-events-none overflow-hidden"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {particles.map(p => (
        <div key={p.id} style={getParticleStyle(p)} />
      ))}
      
      <style>{`
        @keyframes particle-float-dust {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
        }
        
        @keyframes particle-float-spirits {
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1); 
            opacity: 0.2;
          }
          25% { 
            transform: translateY(-15px) translateX(10px) scale(1.1); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-5px) translateX(-8px) scale(0.9); 
            opacity: 0.8;
          }
          75% { 
            transform: translateY(-20px) translateX(5px) scale(1.05); 
            opacity: 0.4;
          }
        }
        
        @keyframes particle-float-embers {
          0% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 1;
          }
          100% { 
            transform: translateY(-100vh) rotate(720deg); 
            opacity: 0;
          }
        }
        
        @keyframes particle-float-fog {
          0%, 100% { 
            transform: translateX(0) scale(1); 
            opacity: 0.3;
          }
          50% { 
            transform: translateX(30px) scale(1.2); 
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
})

// ===== 3D 手電筒效果 =====
export const Flashlight3D = memo(function Flashlight3D({
  x,
  y,
  active,
  intensity = 1,
  color = '255, 248, 220',
}: Flashlight3DProps) {
  if (!active) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-[44]">
      {/* 主光暈 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 140px 180px at ${x}% ${y}%,
            rgba(${color}, ${0.18 * intensity}) 0%,
            rgba(${color}, ${0.08 * intensity}) 25%,
            rgba(${color}, ${0.02 * intensity}) 50%,
            rgba(0, 0, 0, 0.98) 100%
          )`,
        }}
      />
      
      {/* 光束邊緣高光 */}
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '250px',
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(${color}, ${0.03 * intensity}) 70%,
            transparent 100%
          )`,
          filter: 'blur(10px)',
        }}
      />
      
      {/* 3D 深度光圈 */}
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%) rotateX(60deg)',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          boxShadow: `
            0 0 40px rgba(${color}, ${0.1 * intensity}),
            0 0 80px rgba(${color}, ${0.05 * intensity})
          `,
        }}
      />
      
      {/* 灰塵粒子在光束中 */}
      <ParticleField 
        count={15}
        type="dust"
        intensity={intensity * 0.3}
        color={color}
      />
    </div>
  )
})

// ===== 景深效果 =====
export const DepthOfField = memo(function DepthOfField({
  children,
  focusPoint = { x: 50, y: 50 },
  blurAmount = 4,
  enabled = true,
}: DepthOfFieldProps) {
  if (!enabled) return <>{children}</>

  return (
    <div className="relative w-full h-full">
      {children}
      
      {/* 景深模糊遮罩 */}
      <div 
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: `radial-gradient(
            ellipse 60% 60% at ${focusPoint.x}% ${focusPoint.y}%,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.1) 100%
          )`,
          backdropFilter: `blur(${blurAmount * 0.5}px)`,
          WebkitBackdropFilter: `blur(${blurAmount * 0.5}px)`,
          mask: `radial-gradient(
            ellipse 80% 80% at ${focusPoint.x}% ${focusPoint.y}%,
            transparent 30%,
            black 100%
          )`,
          WebkitMask: `radial-gradient(
            ellipse 80% 80% at ${focusPoint.x}% ${focusPoint.y}%,
            transparent 30%,
            black 100%
          )`,
        }}
      />
    </div>
  )
})

// ===== 3D 場景切換動畫 =====
interface SceneTransition3DProps {
  active: boolean
  direction?: 'forward' | 'backward' | 'left' | 'right'
  duration?: number
  children: React.ReactNode
}

export const SceneTransition3D = memo(function SceneTransition3D({
  active,
  direction = 'forward',
  duration = 800,
  children,
}: SceneTransition3DProps) {
  const transforms = {
    forward: 'translateZ(-500px) rotateX(15deg)',
    backward: 'translateZ(200px) rotateX(-10deg)',
    left: 'translateX(-100%) rotateY(30deg)',
    right: 'translateX(100%) rotateY(-30deg)',
  }

  return (
    <div 
      className="relative w-full h-full"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        className="w-full h-full transition-all"
        style={{
          transform: active ? transforms[direction] : 'translateZ(0)',
          opacity: active ? 0 : 1,
          filter: active ? 'blur(8px)' : 'blur(0)',
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  )
})

// ===== 3D 熱點效果 =====
interface Hotspot3DProps {
  x: number
  y: number
  z?: number
  icon: string
  label: string
  active?: boolean
  unlocked?: boolean
  onClick: () => void
  reducedMotion?: boolean
}

export const Hotspot3D = memo(function Hotspot3D({
  x,
  y,
  z = 0,
  icon,
  label,
  active = false,
  unlocked = true,
  onClick,
  reducedMotion = false,
}: Hotspot3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        absolute z-[45] transition-all duration-300
        ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
      `}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `
          translate(-50%, -50%) 
          translateZ(${z + (isHovered ? 30 : 0)}px)
          scale(${isHovered ? 1.15 : 1})
        `,
        transformStyle: 'preserve-3d',
      }}
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-label={label}
      tabIndex={unlocked ? 0 : -1}
    >
      {/* 3D 光暈底座 */}
      <div 
        className="absolute -inset-4 rounded-full"
        style={{
          background: active
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)'
            : isHovered
            ? 'radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          transform: 'translateZ(-10px)',
          animation: reducedMotion ? 'none' : 'hotspot3d-glow 2s ease-in-out infinite',
        }}
      />
      
      {/* 主圖標 */}
      <div 
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(15, 15, 15, 0.95) 100%)',
          border: active 
            ? '2px solid rgba(16, 185, 129, 0.6)' 
            : '1px solid rgba(120, 120, 120, 0.3)',
          boxShadow: `
            0 4px 20px rgba(0, 0, 0, 0.5),
            ${active ? '0 0 20px rgba(16, 185, 129, 0.3)' : ''}
          `,
          transform: 'translateZ(10px)',
        }}
      >
        {icon}
      </div>
      
      {/* 懸浮標籤 */}
      {isHovered && unlocked && (
        <div 
          className="absolute left-1/2 -bottom-8 -translate-x-1/2 whitespace-nowrap
                     text-[10px] text-amber-200/80 bg-black/80 px-2 py-1 rounded
                     border border-amber-900/30"
          style={{
            transform: 'translateZ(20px)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {label}
        </div>
      )}
      
      <style>{`
        @keyframes hotspot3d-glow {
          0%, 100% { 
            opacity: 0.5; 
            transform: translateZ(-10px) scale(1);
          }
          50% { 
            opacity: 1; 
            transform: translateZ(-10px) scale(1.1);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) translateZ(20px); }
          to { opacity: 1; transform: translateY(0) translateZ(20px); }
        }
      `}</style>
    </div>
  )
})

// ===== 導出所有效果 =====
export const Effects3D = {
  Scene3DContainer,
  ParallaxLayer,
  ParticleField,
  Flashlight3D,
  DepthOfField,
  SceneTransition3D,
  Hotspot3D,
}

export default Effects3D
