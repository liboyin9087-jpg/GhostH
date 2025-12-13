/**
 * 色彩配置檔案
 * 基於上傳的參考圖片（IMG_4181-4188）提取的主色調
 * 用於整個專案的視覺一致性
 */

// ====================================================================
// 1. CRT 監視器色調（IMG_4186.png）
// ====================================================================
export const crtGreenPalette = {
  primary: {
    main: '#00FF41',        // 螢光綠（CRT 主色）
    dark: '#00CC33',        // 深螢光綠
    light: '#33FF66',       // 淺螢光綠
    glow: '#00FF4180',      // 發光效果（半透明）
  },
  background: {
    base: '#0A1612',        // 極深綠黑
    overlay: '#1A2820',     // 深綠灰
    scanline: '#00FF4108',  // 掃描線（極淡）
  },
  text: {
    primary: '#00FF41',     // 主要文字
    secondary: '#80FF99',   // 次要文字
    dim: '#4D8060',         // 暗淡文字
  },
  effects: {
    noise: '#00FF4120',     // 雜訊效果
    flicker: '#FFFFFF10',   // 閃爍效果
  },
} as const;

// ====================================================================
// 2. 醫院廢墟色調（IMG_4187.png, IMG_4188.png）
// ====================================================================
export const hospitalColdPalette = {
  primary: {
    main: '#A8C5C0',        // 冷青綠（剝落牆壁）
    dark: '#6B8A85',        // 深青灰
    light: '#D4E5E3',       // 淺青白
    rust: '#8B6F47',        // 鏽蝕棕（金屬銹蝕）
  },
  background: {
    base: '#1C1E1A',        // 極深灰綠
    wall: '#3A4B47',        // 醫院牆壁色
    floor: '#4A5450',       // 地板色（污漬）
    shadow: '#0D0F0C',      // 陰影黑
  },
  accent: {
    blood: '#5C1A1A',       // 血跡暗紅
    mold: '#2D3A2F',        // 黴菌綠黑
    dust: '#9FA8A3',        // 灰塵灰白
  },
  text: {
    primary: '#C8D5D0',     // 主要文字（淡青白）
    secondary: '#8FA59F',   // 次要文字（青灰）
    faded: '#5A6A65',       // 褪色文字
  },
} as const;

// ====================================================================
// 3. 監視攝影機色調（IMG_4186.png 時間戳記區域）
// ====================================================================
export const surveillancePalette = {
  timestamp: {
    text: '#E8E8E8',        // 時間戳記白
    background: '#00000080', // 時間戳記背景（半透明黑）
    rec: '#FF3333',         // REC 錄製紅點
  },
  video: {
    base: '#1A261C',        // 影像底色
    highlight: '#C8D4CC',   // 亮部
    shadow: '#0A120C',      // 暗部
    grain: '#88998D20',     // 顆粒感
  },
  overlay: {
    scanline: '#FFFFFF05',  // 掃描線
    vignette: '#00000060',  // 暗角
    glitch: '#00FF4140',    // 故障綠
  },
} as const;

// ====================================================================
// 4. 儀式道具色調（IMG_4181.png）
// ====================================================================
export const ritualWarmPalette = {
  talisman: {
    paper: '#D4A574',       // 符紙黃
    text: '#8B2500',        // 符文紅（朱砂）
    aged: '#B8935A',        // 陳舊黃
    bloodStain: '#4A1010',  // 血漬暗紅
  },
  thread: {
    red: '#C41E3A',         // 紅線
    dark: '#8B1A2B',        // 深紅線
    glow: '#FF4D6A40',      // 紅光效果
  },
  blade: {
    steel: '#8B9DAF',       // 刀身鋼灰
    rust: '#8B5A3C',        // 生鏽棕
    edge: '#B8C5D4',        // 刀刃亮部
  },
  background: {
    base: '#1A1612',        // 深黑背景
    wood: '#3D2F24',        // 木質底色
  },
} as const;

// ====================================================================
// 5. 角色照明色調（IMG_4183.png）
// ====================================================================
export const characterLightingPalette = {
  flashlight: {
    core: '#FFD699',        // 手電筒核心光
    halo: '#FFA04D',        // 光暈橙
    dim: '#CC8844',         // 暗淡光
  },
  skin: {
    lit: '#F5C99A',         // 受光膚色
    shadow: '#8B6F4F',      // 陰影膚色
    sweat: '#FFE6CC',       // 汗水反光
  },
  environment: {
    darkness: '#0A0D0C',    // 極暗背景
    ambient: '#1F2622',     // 環境光（極微弱）
    corridor: '#243028',    // 走廊深色
  },
} as const;

// ====================================================================
// 6. 整合色彩系統（供全域使用）
// ====================================================================
export const horrorGamePalette = {
  // 主色調（預設使用 CRT 綠）
  primary: crtGreenPalette.primary.main,
  secondary: hospitalColdPalette.primary.main,
  
  // 恐懼值色階（從安全到危險）
  fearGradient: {
    0: '#00FF41',    // 安全：螢光綠
    25: '#80FF99',   // 低度：淺綠
    50: '#FFA04D',   // 中度：橙色
    75: '#FF6B4D',   // 高度：橘紅
    100: '#FF3333',  // 極度：鮮紅
  },
  
  // 功能性顏色
  semantic: {
    success: '#00FF41',      // 成功：CRT 綠
    warning: '#FFA04D',      // 警告：橙色
    danger: '#C41E3A',       // 危險：符咒紅
    info: '#A8C5C0',         // 資訊：冷青綠
  },
  
  // 背景層次
  backgrounds: {
    deepest: '#0A0D0C',      // 最深層（幾乎全黑）
    deep: '#1A1E1A',         // 深層
    mid: '#2D3A2F',          // 中層
    surface: '#3A4B47',      // 表層
  },
  
  // 文字對比
  text: {
    highest: '#FFFFFF',      // 最高對比（純白）
    high: '#E8E8E8',         // 高對比
    medium: '#C8D5D0',       // 中對比
    low: '#8FA59F',          // 低對比
    lowest: '#5A6A65',       // 最低對比
  },
  
  // 特效顏色
  effects: {
    glow: '#00FF4180',       // 發光效果
    shadow: '#00000080',     // 陰影
    bloodSplatter: '#5C1A1A', // 血跡
    ghostly: '#A8C5C080',    // 鬼魅效果（半透明）
  },
} as const;

// ====================================================================
// 7. Tailwind CSS 擴展配置
// ====================================================================
export const tailwindColorExtension = {
  'crt-green': {
    DEFAULT: crtGreenPalette.primary.main,
    dark: crtGreenPalette.primary.dark,
    light: crtGreenPalette.primary.light,
  },
  'hospital': {
    DEFAULT: hospitalColdPalette.primary.main,
    dark: hospitalColdPalette.primary.dark,
    wall: hospitalColdPalette.background.wall,
  },
  'ritual': {
    paper: ritualWarmPalette.talisman.paper,
    blood: ritualWarmPalette.talisman.text,
    thread: ritualWarmPalette.thread.red,
  },
  'fear': {
    0: horrorGamePalette.fearGradient[0],
    25: horrorGamePalette.fearGradient[25],
    50: horrorGamePalette.fearGradient[50],
    75: horrorGamePalette.fearGradient[75],
    100: horrorGamePalette.fearGradient[100],
  },
};

// ====================================================================
// 8. CSS 變數導出（用於動態主題切換）
// ====================================================================
export const cssVariables = `
  /* CRT 監視器色調 */
  --crt-green-main: ${crtGreenPalette.primary.main};
  --crt-green-glow: ${crtGreenPalette.primary.glow};
  --crt-bg-base: ${crtGreenPalette.background.base};
  
  /* 醫院廢墟色調 */
  --hospital-main: ${hospitalColdPalette.primary.main};
  --hospital-wall: ${hospitalColdPalette.background.wall};
  --hospital-blood: ${hospitalColdPalette.accent.blood};
  
  /* 儀式道具色調 */
  --ritual-paper: ${ritualWarmPalette.talisman.paper};
  --ritual-blood: ${ritualWarmPalette.talisman.text};
  --ritual-thread: ${ritualWarmPalette.thread.red};
  
  /* 恐懼值色階 */
  --fear-0: ${horrorGamePalette.fearGradient[0]};
  --fear-25: ${horrorGamePalette.fearGradient[25]};
  --fear-50: ${horrorGamePalette.fearGradient[50]};
  --fear-75: ${horrorGamePalette.fearGradient[75]};
  --fear-100: ${horrorGamePalette.fearGradient[100]};
  
  /* 背景層次 */
  --bg-deepest: ${horrorGamePalette.backgrounds.deepest};
  --bg-deep: ${horrorGamePalette.backgrounds.deep};
  --bg-mid: ${horrorGamePalette.backgrounds.mid};
  --bg-surface: ${horrorGamePalette.backgrounds.surface};
`;

// ====================================================================
// 9. 使用範例
// ====================================================================
/**
 * 在 React 組件中使用：
 * 
 * import { crtGreenPalette, horrorGamePalette } from '@/styles/colorPalette';
 * 
 * // 直接使用
 * <div style={{ color: crtGreenPalette.primary.main }}>文字</div>
 * 
 * // 動態恐懼值顏色
 * const fearColor = horrorGamePalette.fearGradient[fearLevel >= 75 ? 100 : fearLevel >= 50 ? 75 : fearLevel >= 25 ? 50 : 0];
 * 
 * // Tailwind 類別（需先在 tailwind.config.js 中擴展）
 * <div className="text-crt-green bg-hospital-wall">內容</div>
 */
