/**
 * 3D 走廊過渡場景組件
 * 3D Corridor Transition Component
 * 
 * 用於連接 2D 場景的 3D 第一人稱走廊過渡
 */

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Environment } from '@react-three/drei'
import { EffectComposer, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

interface CorridorTransitionProps {
  fromScene: string
  toScene: string
  onComplete: () => void
  reducedMotion?: boolean
}

// 走廊內容組件
function CorridorContent({ onReachEnd }: { onReachEnd: () => void }) {
  const playerRef = useRef<THREE.Group>(null)
  const [moveForward, setMoveForward] = useState(false)
  const [moveBackward, setMoveBackward] = useState(false)
  const [moveLeft, setMoveLeft] = useState(false)
  const [moveRight, setMoveRight] = useState(false)
  const [position, setPosition] = useState<[number, number, number]>([0, 1.6, 0])
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())

  const { camera } = useThree()

  // 鍵盤控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMoveForward(true)
          break
        case 'KeyS':
        case 'ArrowDown':
          setMoveBackward(true)
          break
        case 'KeyA':
        case 'ArrowLeft':
          setMoveLeft(true)
          break
        case 'KeyD':
        case 'ArrowRight':
          setMoveRight(true)
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMoveForward(false)
          break
        case 'KeyS':
        case 'ArrowDown':
          setMoveBackward(false)
          break
        case 'KeyA':
        case 'ArrowLeft':
          setMoveLeft(false)
          break
        case 'KeyD':
        case 'ArrowRight':
          setMoveRight(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // 移動邏輯
  useFrame((state, delta) => {
    if (!playerRef.current) return

    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta

    direction.current.z = Number(moveForward) - Number(moveBackward)
    direction.current.x = Number(moveRight) - Number(moveLeft)
    direction.current.normalize()

    const speed = 3.0

    if (moveForward || moveBackward) {
      velocity.current.z -= direction.current.z * speed * delta
    }
    if (moveLeft || moveRight) {
      velocity.current.x -= direction.current.x * speed * delta
    }

    camera.position.x += velocity.current.x
    camera.position.z += velocity.current.z

    // 限制移動範圍（走廊寬度）
    camera.position.x = Math.max(-2, Math.min(2, camera.position.x))

    // 更新位置狀態
    setPosition([camera.position.x, camera.position.y, camera.position.z])

    // 檢查是否到達走廊盡頭
    if (camera.position.z < -20) {
      onReachEnd()
    }
  })

  return (
    <group ref={playerRef}>
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} receiveShadow>
        <planeGeometry args={[5, 25]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, -10]} receiveShadow>
        <planeGeometry args={[5, 25]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* 左牆 */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-2.5, 1.75, -10]} receiveShadow>
        <planeGeometry args={[25, 3.5]} />
        <meshStandardMaterial 
          color="#2a2520" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* 右牆 */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[2.5, 1.75, -10]} receiveShadow>
        <planeGeometry args={[25, 3.5]} />
        <meshStandardMaterial 
          color="#2a2520" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* 昏暗的燈光 */}
      {[0, -5, -10, -15, -20].map((z, i) => (
        <pointLight 
          key={i}
          position={[0, 3, z]} 
          intensity={0.3} 
          distance={8}
          color="#ff9966"
          castShadow
        />
      ))}

      {/* 遠處的門（目標） */}
      <mesh position={[0, 1.5, -22]}>
        <boxGeometry args={[1.8, 2.8, 0.2]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          emissive="#ff4444"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 環境裝飾 - 管道 */}
      {[-5, -10, -15].map((z, i) => (
        <mesh key={`pipe-${i}`} position={[2.2, 3, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// 主要走廊過渡組件
export function CorridorTransition({ 
  fromScene, 
  toScene, 
  onComplete,
  reducedMotion = false 
}: CorridorTransitionProps) {
  const [isReady, setIsReady] = useState(false)
  const [hasReachedEnd, setHasReachedEnd] = useState(false)

  useEffect(() => {
    // 延遲顯示，避免突兀
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (hasReachedEnd) {
      // 淡出後完成過渡
      const timer = setTimeout(onComplete, 800)
      return () => clearTimeout(timer)
    }
  }, [hasReachedEnd, onComplete])

  const handleReachEnd = () => {
    setHasReachedEnd(true)
  }

  if (!isReady) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'VT323, monospace',
        fontSize: '18px',
        letterSpacing: '0.2em'
      }}>
        <div>▶ LOADING CORRIDOR...</div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      opacity: hasReachedEnd ? 0 : 1,
      transition: 'opacity 0.8s ease-out'
    }}>
      {/* 使用說明 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: 'VT323, monospace',
        fontSize: '14px',
        letterSpacing: '0.15em',
        textAlign: 'center',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        <div>點擊畫面鎖定滑鼠 | WASD 移動</div>
        <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.6 }}>
          前往 {toScene}...
        </div>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 1.6, 0], fov: 75 }}
        gl={{ antialias: false }} // VHS 風格不需要抗鋸齒
      >
        {/* 基礎照明 */}
        <ambientLight intensity={0.05} />
        <fog attach="fog" args={['#000000', 1, 25]} />

        {/* 滑鼠控制 */}
        <PointerLockControls />

        {/* 走廊內容 */}
        <CorridorContent onReachEnd={handleReachEnd} />

        {/* VHS 後處理效果 */}
        {!reducedMotion && (
          <EffectComposer>
            <Noise 
              opacity={0.2}
              blendFunction={BlendFunction.OVERLAY}
            />
            <Vignette 
              offset={0.3} 
              darkness={0.6}
              blendFunction={BlendFunction.NORMAL}
            />
            <ChromaticAberration
              offset={[0.002, 0.002]}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}

export default CorridorTransition
