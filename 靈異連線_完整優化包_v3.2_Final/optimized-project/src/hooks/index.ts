/**
 * Hooks 導出索引
 * 
 * 方便統一導入所有自定義 Hooks
 */

// 音頻相關
export { useAudioContext } from './useAudioContext';
export type { AudioContextState } from './useAudioContext';

// 遊戲狀態管理
export { useFear } from './useFear';
export type { UseFearOptions, UseFearReturn } from './useFear';

// 現有 Hooks
export { useGyroParallax } from './useGyroParallax';
export { useSoulBinding } from './useSoulBinding';
export { useSpectralBattery } from './useSpectralBattery';
