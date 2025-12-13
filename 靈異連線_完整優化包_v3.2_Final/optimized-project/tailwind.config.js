/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 整合 colorPalette.ts 的顏色系統
      colors: {
        // 主要色彩
        'horror-primary': '#00FF41', // 綠色監視器光
        'horror-secondary': '#FF0000', // 危險紅色
        'horror-accent': '#FFD700', // 符咒金色
        
        // 背景色階
        'bg-deepest': '#0A0A0A',
        'bg-deep': '#1A1A1A',
        'bg-base': '#2A2A2A',
        'bg-surface': '#3A3A3A',
        
        // 文字色階
        'text-highest': '#FFFFFF',
        'text-high': '#E0E0E0',
        'text-medium': '#A0A0A0',
        'text-low': '#707070',
        'text-lowest': '#505050',
        
        // 恐懼值色階（0-100）
        'fear-0': '#00FF41',   // 安全：綠色
        'fear-25': '#FFD700',  // 警覺：金色
        'fear-50': '#FFA500',  // 緊張：橙色
        'fear-75': '#FF4500',  // 恐慌：深橙
        'fear-100': '#FF0000', // 極度恐懼：紅色
        
        // 杏林醫院主題色
        'hospital-green': '#00FF41',
        'hospital-red': '#8B0000',
        'hospital-cold': '#B0C4DE',
        
        // 符咒色系
        'talisman-yellow': '#E6C683',
        'talisman-red': '#8B0000',
        'talisman-black': '#000000',
      },

      // 字體家族
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'serif': ['serif'],
        'horror': ['Creepster', 'cursive'],
      },

      // 動畫
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-red': 'pulse-red 1.5s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'glitch': 'glitch 0.5s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },

      // 關鍵影格
      keyframes: {
        'pulse-red': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3, backgroundColor: 'rgba(255, 0, 0, 0.2)' },
        },
        'flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fadeOut': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        'slideUp': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
      },

      // 陰影效果
      boxShadow: {
        'horror-glow': '0 0 20px rgba(0, 255, 65, 0.5)',
        'horror-red': '0 0 30px rgba(255, 0, 0, 0.6)',
        'horror-gold': '0 0 25px rgba(255, 215, 0, 0.4)',
        'crt': '0 0 50px rgba(0, 255, 65, 0.3)',
      },

      // 邊框圓角
      borderRadius: {
        'horror': '2px',
      },

      // 背景圖案
      backgroundImage: {
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')",
        'scanlines': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
      },

      // 背景尺寸
      backgroundSize: {
        'scanlines': '100% 3px',
      },

      // 層級
      zIndex: {
        'modal': 100,
        'overlay': 99,
        'crt': 98,
        'flash': 97,
      },
    },
  },
  plugins: [
    // 可以加入自定義插件
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-horror': {
          textShadow: '0 0 10px rgba(0, 255, 65, 0.8)',
        },
        '.text-shadow-red': {
          textShadow: '0 0 10px rgba(255, 0, 0, 0.8)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
