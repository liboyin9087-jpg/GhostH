import { useCallback, useRef, useEffect } from 'react';
import { useAudioContext } from '../hooks/useAudioContext';

/**
 * JumpScareManager - 驚嚇效果管理器
 * 
 * 管理遊戲中的驚嚇事件
 * 包括視覺效果、音效和觸發時機控制
 * 
 * 功能：
 * - 觸發驚嚇事件（尖叫聲、閃爍效果）
 * - 冷卻時間管理（避免過度驚嚇）
 * - 驚嚇強度等級
 * - 隨機驚嚇觸發
 * 
 * 使用方式：
 * const { triggerJumpScare, canTriggerJumpScare } = useJumpScareManager();
 */

export interface JumpScareOptions {
  intensity?: 'low' | 'medium' | 'high';
  duration?: number; // 持續時間（毫秒）
  sound?: string; // 音效文件路徑
  visualEffect?: boolean; // 是否包含視覺效果
  onComplete?: () => void; // 完成回調
}

export interface UseJumpScareManagerOptions {
  minCooldown?: number; // 最小冷卻時間（毫秒）
  maxPerSession?: number; // 每個會話最多觸發次數
  fearThreshold?: number; // 觸發所需的最小恐懼值
}

export interface UseJumpScareManagerReturn {
  triggerJumpScare: (options?: JumpScareOptions) => Promise<boolean>;
  canTriggerJumpScare: boolean;
  jumpScareCount: number;
  lastJumpScareTime: number | null;
  resetCooldown: () => void;
}

/**
 * useJumpScareManager Hook
 * 
 * @param options - 配置選項
 * @returns 驚嚇管理對象
 */
export const useJumpScareManager = (
  fearLevel: number = 0,
  options: UseJumpScareManagerOptions = {}
): UseJumpScareManagerReturn => {
  const {
    minCooldown = 30000, // 30秒冷卻
    maxPerSession = 10,
    fearThreshold = 30
  } = options;

  const { playSound, isAudioEnabled } = useAudioContext();
  
  const jumpScareCountRef = useRef(0);
  const lastJumpScareTimeRef = useRef<number | null>(null);
  const isJumpScareActiveRef = useRef(false);

  /**
   * 檢查是否可以觸發驚嚇
   */
  const canTriggerJumpScare = useCallback((): boolean => {
    // 檢查是否正在執行驚嚇
    if (isJumpScareActiveRef.current) {
      return false;
    }

    // 檢查恐懼值是否足夠
    if (fearLevel < fearThreshold) {
      return false;
    }

    // 檢查是否超過最大次數
    if (jumpScareCountRef.current >= maxPerSession) {
      console.log('Jump scare limit reached for this session');
      return false;
    }

    // 檢查冷卻時間
    if (lastJumpScareTimeRef.current) {
      const timeSinceLastScare = Date.now() - lastJumpScareTimeRef.current;
      if (timeSinceLastScare < minCooldown) {
        console.log(`Jump scare on cooldown: ${Math.ceil((minCooldown - timeSinceLastScare) / 1000)}s remaining`);
        return false;
      }
    }

    return true;
  }, [fearLevel, fearThreshold, minCooldown, maxPerSession]);

  /**
   * 觸發驚嚇效果
   * 
   * @param options - 驚嚇選項
   * @returns 是否成功觸發
   */
  const triggerJumpScare = useCallback(async (
    options: JumpScareOptions = {}
  ): Promise<boolean> => {
    // 檢查是否可以觸發
    if (!canTriggerJumpScare()) {
      console.log('Cannot trigger jump scare at this time');
      return false;
    }

    const {
      intensity = 'medium',
      duration = 2000,
      sound = '/sounds/woman_scream.mp3',
      visualEffect = true,
      onComplete
    } = options;

    try {
      // 標記為正在執行
      isJumpScareActiveRef.current = true;
      jumpScareCountRef.current += 1;
      lastJumpScareTimeRef.current = Date.now();

      console.log(`Triggering jump scare - Intensity: ${intensity}, Count: ${jumpScareCountRef.current}`);

      // 播放音效
      if (isAudioEnabled && sound) {
        const volumeMap = {
          low: 0.4,
          medium: 0.7,
          high: 1.0
        };

        await playSound(sound, {
          volume: volumeMap[intensity]
        });
      }

      // 視覺效果（閃爍和震動）
      if (visualEffect) {
        // 創建閃爍覆蓋層
        const flashOverlay = document.createElement('div');
        flashOverlay.style.cssText = `
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: white;
          animation: jumpScareFlash ${duration}ms ease-out;
          pointer-events: none;
        `;

        // 添加動畫
        if (!document.querySelector('#jumpScareStyles')) {
          const style = document.createElement('style');
          style.id = 'jumpScareStyles';
          style.textContent = `
            @keyframes jumpScareFlash {
              0% { opacity: 1; }
              20% { opacity: 0.8; }
              40% { opacity: 1; }
              60% { opacity: 0.6; }
              80% { opacity: 0.3; }
              100% { opacity: 0; }
            }
            @keyframes jumpScareShake {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              10% { transform: translate(-5px, -5px) rotate(-1deg); }
              20% { transform: translate(5px, 5px) rotate(1deg); }
              30% { transform: translate(-5px, 5px) rotate(-1deg); }
              40% { transform: translate(5px, -5px) rotate(1deg); }
              50% { transform: translate(-5px, -5px) rotate(-1deg); }
              60% { transform: translate(5px, 5px) rotate(1deg); }
              70% { transform: translate(-5px, 5px) rotate(-1deg); }
              80% { transform: translate(5px, -5px) rotate(1deg); }
              90% { transform: translate(-5px, -5px) rotate(-1deg); }
            }
          `;
          document.head.appendChild(style);
        }

        document.body.appendChild(flashOverlay);

        // 震動效果
        const shakeIntensityMap = {
          low: '0.3s',
          medium: '0.5s',
          high: '0.8s'
        };

        document.body.style.animation = `jumpScareShake ${shakeIntensityMap[intensity]} ease-out`;

        // 清理效果
        setTimeout(() => {
          flashOverlay.remove();
          document.body.style.animation = '';
          isJumpScareActiveRef.current = false;

          if (onComplete) {
            onComplete();
          }
        }, duration);
      } else {
        // 如果沒有視覺效果，直接結束
        setTimeout(() => {
          isJumpScareActiveRef.current = false;
          if (onComplete) {
            onComplete();
          }
        }, duration);
      }

      return true;
    } catch (error) {
      console.error('Failed to trigger jump scare:', error);
      isJumpScareActiveRef.current = false;
      return false;
    }
  }, [canTriggerJumpScare, isAudioEnabled, playSound]);

  /**
   * 重置冷卻時間（用於測試或特殊情況）
   */
  const resetCooldown = useCallback(() => {
    lastJumpScareTimeRef.current = null;
    isJumpScareActiveRef.current = false;
    console.log('Jump scare cooldown reset');
  }, []);

  // 清理效果
  useEffect(() => {
    return () => {
      // 清理可能殘留的動畫樣式
      if (document.body.style.animation) {
        document.body.style.animation = '';
      }
    };
  }, []);

  return {
    triggerJumpScare,
    canTriggerJumpScare: canTriggerJumpScare(),
    jumpScareCount: jumpScareCountRef.current,
    lastJumpScareTime: lastJumpScareTimeRef.current,
    resetCooldown
  };
};

export default useJumpScareManager;
