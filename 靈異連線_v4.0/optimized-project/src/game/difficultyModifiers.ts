/**
 * 難度修正器
 * Difficulty Modifiers for Story Pacing
 * 
 * 根據難度設定調整遊戲參數，影響恐怖節奏與故事體驗
 */

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface DifficultyModifiers {
  pressureMultiplier: number;    // 壓力值累積倍率
  safeZoneMultiplier: number;    // 安全區持續時間倍率
  jumpscareMultiplier: number;   // 驚嚇事件機率倍率
  anomalyFrequency: number;      // 異常事件頻率倍率 (越小越頻繁)
  talismanEffectiveness: number; // 護符效果倍率
  recoveryRate: number;          // 壓力恢復速度倍率
}

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyModifiers> = {
  easy: {
    pressureMultiplier: 0.7,      // 壓力累積較慢
    safeZoneMultiplier: 1.5,      // 安全區延長 50%
    jumpscareMultiplier: 0.6,     // 驚嚇機率降低 40%
    anomalyFrequency: 1.3,        // 異常頻率降低 23%
    talismanEffectiveness: 1.4,   // 護符效果增強 40%
    recoveryRate: 1.3,            // 壓力恢復快 30%
  },
  normal: {
    pressureMultiplier: 1.0,
    safeZoneMultiplier: 1.0,
    jumpscareMultiplier: 1.0,
    anomalyFrequency: 1.0,
    talismanEffectiveness: 1.0,
    recoveryRate: 1.0,
  },
  hard: {
    pressureMultiplier: 1.3,      // 壓力累積快 30%
    safeZoneMultiplier: 0.6,      // 安全區縮短 40%
    jumpscareMultiplier: 1.4,     // 驚嚇機率增加 40%
    anomalyFrequency: 0.75,       // 異常頻率增加 25%
    talismanEffectiveness: 0.8,   // 護符效果減弱 20%
    recoveryRate: 0.7,            // 壓力恢復慢 30%
  },
};

/**
 * 獲取難度修正器
 */
export function getDifficultyModifiers(difficulty: Difficulty): DifficultyModifiers {
  return DIFFICULTY_SETTINGS[difficulty];
}

/**
 * 應用難度修正到壓力值變化
 */
export function applyDifficultyToPressure(
  baseDelta: number,
  difficulty: Difficulty
): number {
  const modifiers = getDifficultyModifiers(difficulty);
  
  // 正值（增加壓力）套用壓力倍率
  // 負值（減少壓力）套用恢復倍率
  if (baseDelta > 0) {
    return baseDelta * modifiers.pressureMultiplier;
  } else {
    return baseDelta * modifiers.recoveryRate;
  }
}

/**
 * 應用難度修正到安全區時間
 */
export function applySafeZoneDuration(
  baseDuration: number,
  difficulty: Difficulty
): number {
  const modifiers = getDifficultyModifiers(difficulty);
  return Math.floor(baseDuration * modifiers.safeZoneMultiplier);
}

/**
 * 應用難度修正到驚嚇機率
 */
export function applyJumpscareChance(
  baseChance: number,
  difficulty: Difficulty
): number {
  const modifiers = getDifficultyModifiers(difficulty);
  return Math.min(1, baseChance * modifiers.jumpscareMultiplier);
}

/**
 * 應用難度修正到異常頻率間隔
 */
export function applyAnomalyInterval(
  baseInterval: number,
  difficulty: Difficulty
): number {
  const modifiers = getDifficultyModifiers(difficulty);
  return Math.floor(baseInterval * modifiers.anomalyFrequency);
}

/**
 * 應用難度修正到護符效果
 */
export function applyTalismanEffect(
  baseEffect: number,
  difficulty: Difficulty
): number {
  const modifiers = getDifficultyModifiers(difficulty);
  return Math.floor(baseEffect * modifiers.talismanEffectiveness);
}

/**
 * 獲取難度描述文字
 */
export function getDifficultyDescription(difficulty: Difficulty): string {
  const descriptions = {
    easy: '適合初次體驗的玩家。更長的安全期，較低的壓力累積，讓你能更從容地探索醫院的秘密。',
    normal: '標準的恐怖體驗。平衡的節奏與壓力，體驗完整的故事張力。',
    hard: '為尋求極限恐懼的玩家準備。高壓力、頻繁的異常事件，考驗你的勇氣與反應。',
  };
  return descriptions[difficulty];
}
