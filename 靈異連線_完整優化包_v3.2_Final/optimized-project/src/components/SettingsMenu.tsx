/**
 * 《靈異連線》設定選單
 * Settings Menu - Enhanced Version with Audio Controls, Save/Load, and Language Support
 */

import React, { useState, useEffect, useCallback, memo } from 'react';

export interface GameSettings {
  masterVolume: number;      // 0-100
  musicVolume: number;       // 0-100
  sfxVolume: number;         // 0-100
  musicEnabled: boolean;
  sfxEnabled: boolean;
  vhsStrength: 'low' | 'med' | 'high';
  hapticsEnabled: boolean;
  fontScale: 'small' | 'default' | 'large';
}

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 70,
  musicVolume: 70,
  sfxVolume: 80,
  musicEnabled: true,
  sfxEnabled: true,
  vhsStrength: 'med',
  hapticsEnabled: true,
  fontScale: 'default',
};

// 從 localStorage 讀取設定
export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem('spectral_link_settings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

// 儲存設定到 localStorage
export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem('spectral_link_settings', JSON.stringify(settings));
    // 更新 document attributes for CSS
    document.documentElement.dataset.fontScale = settings.fontScale;
    document.documentElement.dataset.vhsStrength = settings.vhsStrength;
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

// Hook 提供設定存取
export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  useEffect(() => {
    // 初始化 CSS 變數
    document.documentElement.dataset.fontScale = settings.fontScale;
    document.documentElement.dataset.vhsStrength = settings.vhsStrength;
  }, []);

  const updateSettings = useCallback((partial: Partial<GameSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, updateSettings, resetSettings };
}

// ===== UI 元件 =====

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  showValue?: boolean;
}

const Slider = memo(function Slider({ 
  value, onChange, min = 0, max = 100, label, showValue = true 
}: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[var(--ui-text-secondary)] text-sm">{label}</span>
        {showValue && (
          <span className="text-[var(--ui-text-primary)] text-sm font-mono">{value}%</span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--ui-emerald) 0%, var(--ui-emerald) ${value}%, var(--ui-border) ${value}%, var(--ui-border) 100%)`,
        }}
      />
    </div>
  );
});

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

const Toggle = memo(function Toggle({ value, onChange, label }: ToggleProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[var(--ui-text-secondary)] text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          value ? 'bg-[var(--ui-emerald)]' : 'bg-[var(--ui-border)]'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            value ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
});

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  label: string;
}

function SegmentedControl<T extends string>({ 
  value, onChange, options, label 
}: SegmentedControlProps<T>) {
  return (
    <div className="space-y-2">
      <span className="text-[var(--ui-text-secondary)] text-sm block">{label}</span>
      <div className="flex gap-1 p-1 rounded-lg bg-[var(--ui-bg)]">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
              value === opt.value
                ? 'bg-[var(--ui-emerald-soft)] text-[var(--ui-emerald)] border border-[var(--ui-emerald)]'
                : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text-secondary)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== 設定選單主元件 =====

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (partial: Partial<GameSettings>) => void;
  onResetSettings: () => void;
  onResume?: () => void;
  onQuit?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  hasSaveData?: boolean;
  language?: 'zh-TW' | 'en-US';
  onLanguageChange?: (lang: 'zh-TW' | 'en-US') => void;
}

export const SettingsMenu = memo(function SettingsMenu({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  onResume,
  onQuit,
  onSave,
  onLoad,
  hasSaveData = false,
  language = 'zh-TW',
  onLanguageChange,
}: SettingsMenuProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'pause'>('pause');
  const [saveMessage, setSaveMessage] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="relative w-[90%] max-w-sm bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ui-border-soft)]">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('pause')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTab === 'pause'
                  ? 'bg-[var(--ui-emerald-soft)] text-[var(--ui-emerald)]'
                  : 'text-[var(--ui-text-muted)]'
              }`}
            >
              暫停
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[var(--ui-emerald-soft)] text-[var(--ui-emerald)]'
                  : 'text-[var(--ui-text-muted)]'
              }`}
            >
              設定
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--ui-bg-soft)] text-[var(--ui-text-muted)] text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'pause' ? (
            <PauseContent 
              onResume={onResume} 
              onQuit={onQuit}
              onSave={() => {
                if (onSave) {
                  onSave();
                  setSaveMessage('✓ 遊戲已儲存');
                  setTimeout(() => setSaveMessage(''), 2000);
                }
              }}
              onLoad={() => {
                if (onLoad) {
                  onLoad();
                  setSaveMessage('✓ 遊戲已讀取');
                  setTimeout(() => setSaveMessage(''), 2000);
                }
              }}
              hasSaveData={hasSaveData}
              saveMessage={saveMessage}
            />
          ) : (
            <SettingsContent
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onResetSettings={onResetSettings}
              language={language}
              onLanguageChange={onLanguageChange}
            />
          )}
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

// 暫停選單內容
const PauseContent = memo(function PauseContent({
  onResume,
  onQuit,
  onSave,
  onLoad,
  hasSaveData,
  saveMessage,
}: {
  onResume?: () => void;
  onQuit?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  hasSaveData?: boolean;
  saveMessage?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="text-center py-4">
        <div className="text-4xl mb-2">⏸️</div>
        <div className="text-[var(--ui-text-primary)] text-lg font-bold tracking-wider">
          遊戲暫停
        </div>
        <div className="text-[var(--ui-text-muted)] text-xs mt-1">
          GAME PAUSED
        </div>
      </div>

      {saveMessage && (
        <div className="text-center py-2 text-[var(--ui-emerald)] text-sm animate-fadeIn">
          {saveMessage}
        </div>
      )}

      <button
        onClick={onResume}
        className="w-full py-3 rounded-xl bg-[var(--ui-emerald-soft)] border border-[var(--ui-emerald)] text-[var(--ui-emerald)] font-medium tracking-wide transition-all hover:bg-[var(--ui-emerald)] hover:text-black"
      >
        ▶ 繼續遊戲
      </button>

      {onSave && (
        <button
          onClick={onSave}
          className="w-full py-3 rounded-xl bg-[var(--ui-bg-soft)] border border-[var(--ui-border)] text-[var(--ui-text-secondary)] font-medium tracking-wide transition-all hover:border-[var(--ui-emerald)] hover:text-[var(--ui-emerald)]"
        >
          💾 儲存遊戲
        </button>
      )}

      {onLoad && (
        <button
          onClick={onLoad}
          disabled={!hasSaveData}
          className="w-full py-3 rounded-xl bg-[var(--ui-bg-soft)] border border-[var(--ui-border)] text-[var(--ui-text-secondary)] font-medium tracking-wide transition-all hover:border-[var(--ui-cyan)] hover:text-[var(--ui-cyan)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--ui-border)] disabled:hover:text-[var(--ui-text-secondary)]"
        >
          📂 讀取遊戲
        </button>
      )}

      <button
        onClick={onQuit}
        className="w-full py-3 rounded-xl bg-[var(--ui-bg-soft)] border border-[var(--ui-border)] text-[var(--ui-text-secondary)] font-medium tracking-wide transition-all hover:border-[var(--ui-red)] hover:text-[var(--ui-red)]"
      >
        ✕ 結束遊戲
      </button>
    </div>
  );
});

// 設定內容
const SettingsContent = memo(function SettingsContent({
  settings,
  onUpdateSettings,
  onResetSettings,
  language,
  onLanguageChange,
}: {
  settings: GameSettings;
  onUpdateSettings: (partial: Partial<GameSettings>) => void;
  onResetSettings: () => void;
  language?: 'zh-TW' | 'en-US';
  onLanguageChange?: (lang: 'zh-TW' | 'en-US') => void;
}) {
  return (
    <div className="space-y-6">
      {/* 主音量 */}
      <Slider
        label="主音量 Master Volume"
        value={settings.masterVolume}
        onChange={(v) => onUpdateSettings({ masterVolume: v })}
      />

      {/* 背景音樂 */}
      <div className="space-y-2">
        <Toggle
          label="背景音樂 Background Music"
          value={settings.musicEnabled}
          onChange={(v) => onUpdateSettings({ musicEnabled: v })}
        />
        {settings.musicEnabled && (
          <Slider
            label="音樂音量 Music Volume"
            value={settings.musicVolume}
            onChange={(v) => onUpdateSettings({ musicVolume: v })}
            showValue={true}
          />
        )}
      </div>

      {/* 音效 */}
      <div className="space-y-2">
        <Toggle
          label="音效 Sound Effects"
          value={settings.sfxEnabled}
          onChange={(v) => onUpdateSettings({ sfxEnabled: v })}
        />
        {settings.sfxEnabled && (
          <Slider
            label="音效音量 SFX Volume"
            value={settings.sfxVolume}
            onChange={(v) => onUpdateSettings({ sfxVolume: v })}
            showValue={true}
          />
        )}
      </div>

      {/* VHS 強度 */}
      <SegmentedControl
        label="VHS 效果強度"
        value={settings.vhsStrength}
        onChange={(v) => onUpdateSettings({ vhsStrength: v })}
        options={[
          { value: 'low', label: '低 LOW' },
          { value: 'med', label: '中 MED' },
          { value: 'high', label: '高 HIGH' },
        ]}
      />

      {/* 觸覺回饋 */}
      <Toggle
        label="觸覺回饋 Haptics"
        value={settings.hapticsEnabled}
        onChange={(v) => onUpdateSettings({ hapticsEnabled: v })}
      />

      {/* 字體大小 */}
      <SegmentedControl
        label="字體大小 Font Scale"
        value={settings.fontScale}
        onChange={(v) => onUpdateSettings({ fontScale: v })}
        options={[
          { value: 'small', label: '小' },
          { value: 'default', label: '預設' },
          { value: 'large', label: '大' },
        ]}
      />

      {/* 語言切換 */}
      {onLanguageChange && (
        <SegmentedControl
          label="語言 Language"
          value={language || 'zh-TW'}
          onChange={onLanguageChange}
          options={[
            { value: 'zh-TW', label: '繁體中文' },
            { value: 'en-US', label: 'English' },
          ]}
        />
      )}

      {/* 重置 */}
      <button
        onClick={onResetSettings}
        className="w-full py-2 rounded-lg border border-[var(--ui-border-soft)] text-[var(--ui-text-muted)] text-sm hover:border-[var(--ui-amber)] hover:text-[var(--ui-amber)] transition-colors"
      >
        ↻ 重置為預設值
      </button>

      {/* 版本資訊 */}
      <div className="text-center text-[var(--ui-text-muted)] text-[10px] pt-2">
        SPECTRAL LINK v1.0.0 DEMO
      </div>
    </div>
  );
});

export default SettingsMenu;
