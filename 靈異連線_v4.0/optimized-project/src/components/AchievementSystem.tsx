/**
 * 《靈異連線》成就系統
 * Achievement System - Demo Version
 */

import React, { useState, useEffect, useCallback, createContext, useContext, memo } from 'react';

// ===== 成就定義 =====

export interface Achievement {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  condition: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_playback',
    title: '初次回放',
    titleEn: 'First Playback',
    description: '首次使用回放功能查看監視器錄影',
    icon: '📹',
    condition: 'playback_count >= 1',
  },
  {
    id: 'first_seal',
    title: '封印成功',
    titleEn: 'First Seal',
    description: '首次成功使用護符封印靈異反應',
    icon: '🧿',
    condition: 'seal_count >= 1',
  },
  {
    id: 'threat_critical',
    title: '危險邊緣',
    titleEn: 'Threat Critical',
    description: '威脅等級達到 CRITICAL',
    icon: '⚠️',
    condition: 'threat_critical_reached',
  },
  {
    id: 'evidence_collector',
    title: '證據收集者',
    titleEn: 'Evidence Collector',
    description: '收集 5 條以上的線索',
    icon: '📋',
    condition: 'clue_count >= 5',
  },
  {
    id: 'see_her',
    title: '她離開了',
    titleEn: 'See Her',
    description: '完成遊戲，見證結局',
    icon: '👻',
    condition: 'ending_reached',
  },
];

// ===== 成就進度狀態 =====

export interface AchievementProgress {
  unlockedIds: string[];
  stats: {
    playback_count: number;
    seal_count: number;
    clue_count: number;
    threat_critical_reached: boolean;
    ending_reached: boolean;
  };
}

const DEFAULT_PROGRESS: AchievementProgress = {
  unlockedIds: [],
  stats: {
    playback_count: 0,
    seal_count: 0,
    clue_count: 0,
    threat_critical_reached: false,
    ending_reached: false,
  },
};

// ===== localStorage 操作 =====

function loadProgress(): AchievementProgress {
  try {
    const saved = localStorage.getItem('spectral_link_achievements');
    if (saved) {
      return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load achievements:', e);
  }
  return DEFAULT_PROGRESS;
}

function saveProgress(progress: AchievementProgress): void {
  try {
    localStorage.setItem('spectral_link_achievements', JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save achievements:', e);
  }
}

// ===== Context =====

interface AchievementContextValue {
  progress: AchievementProgress;
  unlocked: Achievement[];
  locked: Achievement[];
  checkAndUnlock: (statKey: keyof AchievementProgress['stats'], value?: number | boolean) => Achievement | null;
  incrementStat: (statKey: 'playback_count' | 'seal_count' | 'clue_count') => Achievement | null;
  setStatFlag: (statKey: 'threat_critical_reached' | 'ending_reached') => Achievement | null;
  resetAchievements: () => void;
}

const AchievementContext = createContext<AchievementContextValue | null>(null);

export function useAchievements() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider');
  return ctx;
}

// ===== Provider =====

interface AchievementProviderProps {
  children: React.ReactNode;
  onUnlock?: (achievement: Achievement) => void;
}

export function AchievementProvider({ children, onUnlock }: AchievementProviderProps) {
  const [progress, setProgress] = useState<AchievementProgress>(loadProgress);

  const unlocked = ACHIEVEMENTS.filter(a => progress.unlockedIds.includes(a.id));
  const locked = ACHIEVEMENTS.filter(a => !progress.unlockedIds.includes(a.id));

  // 檢查並解鎖成就
  const checkAndUnlock = useCallback((statKey: keyof AchievementProgress['stats'], value?: number | boolean): Achievement | null => {
    const stats = { ...progress.stats };
    if (value !== undefined) {
      (stats as any)[statKey] = value;
    }

    // 檢查每個未解鎖的成就
    for (const achievement of locked) {
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_playback':
          shouldUnlock = stats.playback_count >= 1;
          break;
        case 'first_seal':
          shouldUnlock = stats.seal_count >= 1;
          break;
        case 'threat_critical':
          shouldUnlock = stats.threat_critical_reached;
          break;
        case 'evidence_collector':
          shouldUnlock = stats.clue_count >= 5;
          break;
        case 'see_her':
          shouldUnlock = stats.ending_reached;
          break;
      }

      if (shouldUnlock && !progress.unlockedIds.includes(achievement.id)) {
        const newProgress = {
          ...progress,
          unlockedIds: [...progress.unlockedIds, achievement.id],
          stats,
        };
        setProgress(newProgress);
        saveProgress(newProgress);
        onUnlock?.(achievement);
        return achievement;
      }
    }

    return null;
  }, [progress, locked, onUnlock]);

  // 增加數值統計
  const incrementStat = useCallback((statKey: 'playback_count' | 'seal_count' | 'clue_count'): Achievement | null => {
    const newValue = progress.stats[statKey] + 1;
    const newProgress = {
      ...progress,
      stats: { ...progress.stats, [statKey]: newValue },
    };
    setProgress(newProgress);
    saveProgress(newProgress);
    return checkAndUnlock(statKey, newValue);
  }, [progress, checkAndUnlock]);

  // 設定布林標記
  const setStatFlag = useCallback((statKey: 'threat_critical_reached' | 'ending_reached'): Achievement | null => {
    if (progress.stats[statKey]) return null; // 已經設定過
    
    const newProgress = {
      ...progress,
      stats: { ...progress.stats, [statKey]: true },
    };
    setProgress(newProgress);
    saveProgress(newProgress);
    return checkAndUnlock(statKey, true);
  }, [progress, checkAndUnlock]);

  // 重置成就
  const resetAchievements = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
  }, []);

  return (
    <AchievementContext.Provider
      value={{
        progress,
        unlocked,
        locked,
        checkAndUnlock,
        incrementStat,
        setStatFlag,
        resetAchievements,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

// ===== Toast 通知元件 =====

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast = memo(function AchievementToast({
  achievement,
  onDismiss,
}: AchievementToastProps) {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] animate-achievementIn">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--ui-bg)] border border-[var(--ui-amber)] shadow-lg shadow-[var(--ui-amber-soft)]">
        <div className="text-3xl">{achievement.icon}</div>
        <div>
          <div className="text-[10px] text-[var(--ui-amber)] tracking-[0.15em] font-bold">
            🏆 成就解鎖
          </div>
          <div className="text-[var(--ui-text-primary)] font-bold">
            {achievement.title}
          </div>
          <div className="text-[var(--ui-text-muted)] text-xs">
            {achievement.description}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes achievementIn {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -10px); }
        }
        .animate-achievementIn {
          animation: achievementIn 3.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
});

// ===== 成就列表元件 =====

interface AchievementListProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementList = memo(function AchievementList({
  isOpen,
  onClose,
}: AchievementListProps) {
  const { unlocked, locked } = useAchievements();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-[90%] max-w-sm bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ui-border-soft)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="text-[var(--ui-text-primary)] font-bold">成就</span>
            <span className="text-[var(--ui-text-muted)] text-sm">
              {unlocked.length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--ui-bg-soft)] text-[var(--ui-text-muted)] text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlocked.includes(achievement);
            return (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-[var(--ui-amber-soft)] border-[var(--ui-amber)]'
                    : 'bg-[var(--ui-bg-soft)] border-[var(--ui-border-soft)] opacity-50'
                }`}
              >
                <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm ${
                    isUnlocked ? 'text-[var(--ui-text-primary)]' : 'text-[var(--ui-text-muted)]'
                  }`}>
                    {achievement.title}
                  </div>
                  <div className="text-[var(--ui-text-muted)] text-xs truncate">
                    {isUnlocked ? achievement.description : '???'}
                  </div>
                </div>
                {isUnlocked && (
                  <div className="text-[var(--ui-amber)] text-lg">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
});

export default AchievementProvider;
