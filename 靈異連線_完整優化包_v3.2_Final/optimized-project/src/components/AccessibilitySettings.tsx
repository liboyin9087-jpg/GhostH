import React, { useState, useEffect } from 'react';

/**
 * AccessibilitySettings - 無障礙設定組件
 * 
 * 提供用戶自訂的無障礙選項：
 * - 字體大小調整
 * - 減少動畫
 * - 高對比度模式
 * 
 * 設定會儲存在 localStorage
 */

export interface AccessibilityOptions {
  fontSize: 'normal' | 'large' | 'xlarge';
  reduceMotion: boolean;
  highContrast: boolean;
}

interface AccessibilitySettingsProps {
  onSettingsChange?: (settings: AccessibilityOptions) => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  onSettingsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityOptions>({
    fontSize: 'normal',
    reduceMotion: false,
    highContrast: false
  });

  // 從 localStorage 載入設定
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applySettings(parsed);
      } catch (e) {
        console.error('Failed to parse accessibility settings:', e);
      }
    }

    // 檢查系統的減少動畫偏好
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      updateSetting('reduceMotion', true);
    }
  }, []);

  // 應用設定到 DOM
  const applySettings = (newSettings: AccessibilityOptions) => {
    const root = document.documentElement;

    // 字體大小
    const fontSizeMap = {
      normal: '16px',
      large: '18px',
      xlarge: '20px'
    };
    root.style.fontSize = fontSizeMap[newSettings.fontSize];

    // 減少動畫
    if (newSettings.reduceMotion) {
      root.style.setProperty('--animation-speed', '0.01ms');
    } else {
      root.style.removeProperty('--animation-speed');
    }

    // 高對比度
    if (newSettings.highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }

    onSettingsChange?.(newSettings);
  };

  // 更新單一設定
  const updateSetting = <K extends keyof AccessibilityOptions>(
    key: K,
    value: AccessibilityOptions[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  // 重置設定
  const resetSettings = () => {
    const defaultSettings: AccessibilityOptions = {
      fontSize: 'normal',
      reduceMotion: false,
      highContrast: false
    };
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
    applySettings(defaultSettings);
  };

  return (
    <>
      {/* 設定按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-bg-surface border-2 border-horror-primary text-horror-primary p-3 rounded-full hover:bg-horror-primary hover:text-black transition-all shadow-horror-glow focus:outline-none focus:ring-2 focus:ring-horror-primary focus:ring-offset-2"
        aria-label="開啟無障礙設定"
        title="無障礙設定"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m5.2-13.2 4.3-4.3m-9.5 9.5-4.3 4.3m13.2.7 4.3 4.3m-9.5-9.5-4.3-4.3" />
        </svg>
      </button>

      {/* 設定面板 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-bg-deepest/90 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-bg-surface border-2 border-horror-primary rounded-lg p-6 max-w-md w-full shadow-horror-glow"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-title"
          >
            {/* 標題 */}
            <div className="flex justify-between items-center mb-6">
              <h2 id="accessibility-title" className="text-2xl font-bold text-horror-primary">
                ♿ 無障礙設定
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-medium hover:text-horror-primary transition-colors focus:outline-none focus:ring-2 focus:ring-horror-primary rounded"
                aria-label="關閉設定面板"
              >
                ✕
              </button>
            </div>

            {/* 字體大小 */}
            <div className="mb-6">
              <label className="block text-text-high font-semibold mb-3">
                字體大小
              </label>
              <div className="flex gap-2">
                {(['normal', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting('fontSize', size)}
                    className={`flex-1 py-2 px-3 rounded border-2 transition-all focus:outline-none focus:ring-2 focus:ring-horror-primary ${
                      settings.fontSize === size
                        ? 'bg-horror-primary text-black border-horror-primary'
                        : 'bg-transparent text-text-high border-stone-700 hover:border-horror-primary'
                    }`}
                    aria-pressed={settings.fontSize === size}
                  >
                    {size === 'normal' && '正常'}
                    {size === 'large' && '大'}
                    {size === 'xlarge' && '超大'}
                  </button>
                ))}
              </div>
            </div>

            {/* 減少動畫 */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-text-high font-semibold group-hover:text-horror-primary transition-colors">
                  減少動畫效果
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.reduceMotion}
                  onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-horror-primary focus:ring-offset-2 ${
                    settings.reduceMotion ? 'bg-horror-primary' : 'bg-stone-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <p className="text-xs text-text-low mt-1">
                適合對動畫敏感的使用者
              </p>
            </div>

            {/* 高對比度 */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-text-high font-semibold group-hover:text-horror-primary transition-colors">
                  高對比度模式
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.highContrast}
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-horror-primary focus:ring-offset-2 ${
                    settings.highContrast ? 'bg-horror-primary' : 'bg-stone-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <p className="text-xs text-text-low mt-1">
                提高文字與背景的對比度
              </p>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-3 pt-4 border-t border-stone-700">
              <button
                onClick={resetSettings}
                className="flex-1 py-2 px-4 border-2 border-horror-secondary text-horror-secondary rounded hover:bg-horror-secondary hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-horror-secondary"
              >
                重置
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 px-4 bg-horror-primary text-black font-bold rounded hover:bg-horror-primary/80 transition-all focus:outline-none focus:ring-2 focus:ring-horror-primary"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 高對比度樣式 */}
      <style>{`
        [data-high-contrast="true"] {
          --tw-text-opacity: 1;
          filter: contrast(1.2);
        }
        
        [data-high-contrast="true"] .text-text-medium {
          color: rgba(229, 229, 229, var(--tw-text-opacity));
        }
        
        [data-high-contrast="true"] .text-text-low {
          color: rgba(212, 212, 212, var(--tw-text-opacity));
        }
      `}</style>
    </>
  );
};

export default AccessibilitySettings;
