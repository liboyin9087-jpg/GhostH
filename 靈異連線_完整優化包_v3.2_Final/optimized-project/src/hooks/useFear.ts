import { useState, useCallback, useEffect } from 'react';

/**
 * useFear - 集中化的恐懼值管理 Hook
 * 
 * 管理玩家的恐懼值，提供增加、減少和重置功能
 * 可設置最小值和最大值限制
 * 
 * 恐懼值影響：
 * - 視覺效果（FlashlightCursor 光圈大小）
 * - 音效強度
 * - 隨機事件觸發機率
 * - 劇情選項可用性
 * 
 * 使用方式：
 * const { fearLevel, increaseFear, decreaseFear, setFear, resetFear } = useFear();
 */

export interface UseFearOptions {
  initialFear?: number;
  minFear?: number;
  maxFear?: number;
  onFearChange?: (newFear: number) => void;
  onFearThreshold?: (threshold: number) => void; // 當跨越特定閾值時觸發
}

export interface UseFearReturn {
  fearLevel: number;
  increaseFear: (amount: number) => void;
  decreaseFear: (amount: number) => void;
  setFear: (value: number) => void;
  resetFear: () => void;
  isCriticalFear: boolean; // 恐懼值是否處於危險區（>80）
  fearPercentage: number; // 恐懼值百分比
}

/**
 * useFear Hook
 * 
 * @param options - 配置選項
 * @returns 恐懼值管理對象
 */
export const useFear = (options: UseFearOptions = {}): UseFearReturn => {
  const {
    initialFear = 0,
    minFear = 0,
    maxFear = 100,
    onFearChange,
    onFearThreshold
  } = options;

  const [fearLevel, setFearLevelState] = useState(initialFear);

  /**
   * 內部設置恐懼值，確保在範圍內
   */
  const setFearInternal = useCallback((value: number) => {
    const clampedValue = Math.max(minFear, Math.min(maxFear, value));
    
    // 檢查是否跨越閾值
    if (onFearThreshold) {
      const thresholds = [25, 50, 75, 90];
      thresholds.forEach(threshold => {
        if (
          (fearLevel < threshold && clampedValue >= threshold) ||
          (fearLevel >= threshold && clampedValue < threshold)
        ) {
          onFearThreshold(threshold);
        }
      });
    }

    setFearLevelState(clampedValue);

    // 觸發變化回調
    if (onFearChange && clampedValue !== fearLevel) {
      onFearChange(clampedValue);
    }
  }, [fearLevel, minFear, maxFear, onFearChange, onFearThreshold]);

  /**
   * 增加恐懼值
   * 
   * @param amount - 增加的數值
   */
  const increaseFear = useCallback((amount: number) => {
    setFearInternal(fearLevel + amount);
  }, [fearLevel, setFearInternal]);

  /**
   * 減少恐懼值
   * 
   * @param amount - 減少的數值
   */
  const decreaseFear = useCallback((amount: number) => {
    setFearInternal(fearLevel - amount);
  }, [fearLevel, setFearInternal]);

  /**
   * 直接設置恐懼值
   * 
   * @param value - 新的恐懼值
   */
  const setFear = useCallback((value: number) => {
    setFearInternal(value);
  }, [setFearInternal]);

  /**
   * 重置恐懼值到初始值
   */
  const resetFear = useCallback(() => {
    setFearInternal(initialFear);
  }, [initialFear, setFearInternal]);

  // 計算衍生狀態
  const isCriticalFear = fearLevel > 80;
  const fearPercentage = (fearLevel / maxFear) * 100;

  // 當恐懼值達到臨界值時，記錄日誌
  useEffect(() => {
    if (isCriticalFear) {
      console.warn('Critical fear level reached:', fearLevel);
    }
  }, [isCriticalFear, fearLevel]);

  return {
    fearLevel,
    increaseFear,
    decreaseFear,
    setFear,
    resetFear,
    isCriticalFear,
    fearPercentage
  };
};

export default useFear;
