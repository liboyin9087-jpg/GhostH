/**
 * 多語言 Hook - Localization Hook
 * Provides access to localized strings
 */

import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { locales, type Language, type LocaleStrings } from './locales';

interface LocaleContextType {
  language: Language;
  t: LocaleStrings;
  setLanguage: (lang: Language) => void;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

/**
 * Get current language from localStorage or browser
 */
function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem('spectral_link_language');
    if (saved && (saved === 'zh-TW' || saved === 'en-US')) {
      return saved as Language;
    }
  } catch (e) {
    console.warn('Failed to load language preference:', e);
  }

  // Detect from browser
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) {
    return 'zh-TW';
  }
  return 'en-US';
}

/**
 * Locale Provider Component
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('spectral_link_language', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    t: locales[language],
    setLanguage,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/**
 * Hook to access localized strings
 */
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
