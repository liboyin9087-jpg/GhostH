/**
 * 多語言支援 - Localization System
 * Spectral Link - Multi-language Support
 */

export type Language = 'zh-TW' | 'en-US';

export interface LocaleStrings {
  // Game Title
  gameTitle: string;
  gameSubtitle: string;

  // Main Menu
  continueGame: string;
  newGame: string;
  settings: string;
  quit: string;

  // Settings
  settingsTitle: string;
  pause: string;
  pauseTitle: string;
  gamePaused: string;
  resume: string;
  quitGame: string;
  resetToDefault: string;

  // Audio Settings
  masterVolume: string;
  musicVolume: string;
  sfxVolume: string;
  backgroundMusic: string;
  soundEffects: string;

  // Display Settings
  vhsEffect: string;
  vhsLow: string;
  vhsMed: string;
  vhsHigh: string;
  fontSize: string;
  fontSmall: string;
  fontDefault: string;
  fontLarge: string;

  // Gameplay Settings
  haptics: string;
  language: string;

  // Game UI
  battery: string;
  signal: string;
  spirit: string;
  threatLevel: string;
  objective: string;
  clues: string;
  newClue: string;

  // Threat Levels
  threatLow: string;
  threatMedium: string;
  threatHigh: string;
  threatCritical: string;

  // Tools
  flashlight: string;
  scan: string;
  playback: string;
  talisman: string;

  // Actions
  loading: string;
  saving: string;
  saveGame: string;
  loadGame: string;
  saveSuccess: string;
  loadSuccess: string;
  noSaveData: string;

  // Warnings
  lowBattery: string;
  lowSignal: string;
  dangerWarning: string;

  // Version
  version: string;
}

export const locales: Record<Language, LocaleStrings> = {
  'zh-TW': {
    // Game Title
    gameTitle: '靈異連線',
    gameSubtitle: 'SPECTRAL LINK',

    // Main Menu
    continueGame: '繼續遊戲',
    newGame: '新遊戲',
    settings: '設定',
    quit: '離開',

    // Settings
    settingsTitle: '設定',
    pause: '暫停',
    pauseTitle: '遊戲暫停',
    gamePaused: 'GAME PAUSED',
    resume: '▶ 繼續遊戲',
    quitGame: '✕ 結束遊戲',
    resetToDefault: '↻ 重置為預設值',

    // Audio Settings
    masterVolume: '主音量 Master Volume',
    musicVolume: '背景音樂 Music',
    sfxVolume: '音效 Sound Effects',
    backgroundMusic: '背景音樂',
    soundEffects: '音效',

    // Display Settings
    vhsEffect: 'VHS 效果強度',
    vhsLow: '低 LOW',
    vhsMed: '中 MED',
    vhsHigh: '高 HIGH',
    fontSize: '字體大小 Font Scale',
    fontSmall: '小',
    fontDefault: '預設',
    fontLarge: '大',

    // Gameplay Settings
    haptics: '觸覺回饋 Haptics',
    language: '語言 Language',

    // Game UI
    battery: '電量',
    signal: '訊號',
    spirit: '靈力',
    threatLevel: '威脅等級',
    objective: '目標',
    clues: '線索',
    newClue: '新線索',

    // Threat Levels
    threatLow: '低度',
    threatMedium: '中度',
    threatHigh: '高度',
    threatCritical: '極危',

    // Tools
    flashlight: '手電筒',
    scan: '掃描',
    playback: '回放',
    talisman: '護符',

    // Actions
    loading: '▶ LOADING...',
    saving: '▶ SAVING...',
    saveGame: '💾 儲存遊戲',
    loadGame: '📂 讀取遊戲',
    saveSuccess: '✓ 遊戲已儲存',
    loadSuccess: '✓ 遊戲已讀取',
    noSaveData: '⚠ 無存檔資料',

    // Warnings
    lowBattery: '⚠ 電量不足',
    lowSignal: '⚠ 訊號微弱',
    dangerWarning: '⚠ 危險',

    // Version
    version: 'SPECTRAL LINK v1.0.0 DEMO',
  },

  'en-US': {
    // Game Title
    gameTitle: 'Spectral Link',
    gameSubtitle: '靈異連線',

    // Main Menu
    continueGame: 'Continue',
    newGame: 'New Game',
    settings: 'Settings',
    quit: 'Quit',

    // Settings
    settingsTitle: 'Settings',
    pause: 'Pause',
    pauseTitle: 'Game Paused',
    gamePaused: '遊戲暫停',
    resume: '▶ Resume Game',
    quitGame: '✕ Quit Game',
    resetToDefault: '↻ Reset to Default',

    // Audio Settings
    masterVolume: 'Master Volume 主音量',
    musicVolume: 'Music 背景音樂',
    sfxVolume: 'Sound Effects 音效',
    backgroundMusic: 'Background Music',
    soundEffects: 'Sound Effects',

    // Display Settings
    vhsEffect: 'VHS Effect Intensity',
    vhsLow: 'LOW 低',
    vhsMed: 'MED 中',
    vhsHigh: 'HIGH 高',
    fontSize: 'Font Scale 字體大小',
    fontSmall: 'Small',
    fontDefault: 'Default',
    fontLarge: 'Large',

    // Gameplay Settings
    haptics: 'Haptics 觸覺回饋',
    language: 'Language 語言',

    // Game UI
    battery: '電量',
    signal: '訊號',
    spirit: '靈力',
    threatLevel: 'Threat Level',
    objective: 'Objective',
    clues: 'Clues',
    newClue: 'New',

    // Threat Levels
    threatLow: 'Low',
    threatMedium: 'Medium',
    threatHigh: 'High',
    threatCritical: 'Critical',

    // Tools
    flashlight: 'Flashlight',
    scan: 'Scan',
    playback: 'Playback',
    talisman: 'Talisman',

    // Actions
    loading: '▶ LOADING...',
    saving: '▶ SAVING...',
    saveGame: '💾 Save Game',
    loadGame: '📂 Load Game',
    saveSuccess: '✓ Game Saved',
    loadSuccess: '✓ Game Loaded',
    noSaveData: '⚠ No Save Data',

    // Warnings
    lowBattery: '⚠ Low Battery',
    lowSignal: '⚠ Weak Signal',
    dangerWarning: '⚠ Danger',

    // Version
    version: 'SPECTRAL LINK v1.0.0 DEMO',
  },
};
