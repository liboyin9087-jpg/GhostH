# 3D 效果系統整合說明

## 新增檔案

### src/effects/Scene3DEffects.tsx
7 個 3D 效果組件：
1. **Scene3DContainer** - 3D 場景容器（滑鼠視差 + 陀螺儀）
2. **ParallaxLayer** - 多層視差系統（depth -100 到 +100）
3. **ParticleField** - 3D 粒子系統（dust/spirits/embers/fog）
4. **Flashlight3D** - 多層 3D 手電筒效果
5. **DepthOfField** - 動態景深模糊
6. **SceneTransition3D** - 4 方向 3D 場景轉場
7. **Hotspot3D** - 互動 3D 熱點

### src/effects/VHSEnhanced.tsx
強化版 VHS 效果系統：
- GPU 加速多層效果
- 動態參數（基於 intensity）
- 4 種 Glitch 預設
- 4 種色彩濾鏡
- 5 種事件效果

### src/GameShellIntegrated.tsx
整合版遊戲外殼，已內建：
- 完整 3D 效果
- 強化版 VHS
- 恐懼系統
- 工具系統

## 使用方式

### 基本 3D 場景
```tsx
import { Scene3DContainer, ParallaxLayer, ParticleField } from './effects/Scene3DEffects';

<Scene3DContainer intensity={0.5} mouseParallax={true}>
  <ParallaxLayer depth={-30}>
    <img src="/bg.jpg" />
  </ParallaxLayer>
  <ParallaxLayer depth={30}>
    <ParticleField type="spirits" count={50} />
  </ParallaxLayer>
</Scene3DContainer>
```

### VHS 效果
```tsx
import VHSEnhanced from './effects/VHSEnhanced';

<VHSEnhanced
  phase="warning"
  intensity01={0.6}
  glitchLevel="moderate"
  colorGrade="green"
>
  <YourContent />
</VHSEnhanced>
```

## 效能優化
- memo() 防止不必要的重繪
- useMemo() 快取計算
- RAF 節流 (~30fps)
- GPU 硬體加速
- 支援 prefers-reduced-motion
