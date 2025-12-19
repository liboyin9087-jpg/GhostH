/**
 * 存檔管理系統 - Save/Load Manager
 * Handles game state persistence using LocalStorage
 */

import type { SceneId } from '../scenes';

export interface GameSaveData {
  version: string;
  timestamp: number;
  
  // Game State
  sceneId: SceneId;
  signalStrength: number;
  batteryLevel: number;
  spiritPower: number;
  
  // Progress
  clues: Array<{
    title: string;
    description: string;
    time: string;
    isNew: boolean;
    mediaKey?: string;
  }>;
  
  objective: string;
  
  // Settings (for consistency)
  settings?: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    musicEnabled: boolean;
    sfxEnabled: boolean;
    vhsStrength: 'low' | 'med' | 'high';
    hapticsEnabled: boolean;
    fontScale: 'small' | 'default' | 'large';
  };
}

const SAVE_KEY = 'spectral_link_save';
const CURRENT_VERSION = '1.0.0';

/**
 * Save game state to LocalStorage
 */
export function saveGame(data: Omit<GameSaveData, 'version' | 'timestamp'>): boolean {
  try {
    const saveData: GameSaveData = {
      ...data,
      version: CURRENT_VERSION,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
}

/**
 * Load game state from LocalStorage
 */
export function loadGame(): GameSaveData | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) {
      return null;
    }
    
    const data = JSON.parse(saved) as GameSaveData;
    
    // Validate version
    if (data.version !== CURRENT_VERSION) {
      console.warn('Save version mismatch, attempting to migrate...');
      // Could add migration logic here if needed
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

/**
 * Check if save data exists
 */
export function hasSaveData(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Delete save data
 */
export function deleteSaveData(): boolean {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to delete save data:', error);
    return false;
  }
}

/**
 * Get save metadata (timestamp, version) without loading full data
 */
export function getSaveMetadata(): { timestamp: number; version: string } | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) {
      return null;
    }
    
    const data = JSON.parse(saved) as GameSaveData;
    return {
      timestamp: data.timestamp,
      version: data.version,
    };
  } catch {
    return null;
  }
}

/**
 * Format timestamp for display
 */
export function formatSaveTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return '剛剛';
  if (diffMins < 60) return `${diffMins} 分鐘前`;
  if (diffHours < 24) return `${diffHours} 小時前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
