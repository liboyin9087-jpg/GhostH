import React from 'react';

interface ImageFilterProps {
  children: React.ReactNode;
  filterType?: 'crt-green' | 'hospital-cold' | 'surveillance' | 'ritual-warm';
  intensity?: number; // 0-100
  className?: string;
}

/**
 * 圖片濾鏡組件
 * 基於上傳的參考圖片視覺風格，提供四種濾鏡效果
 * 
 * 濾鏡類型：
 * - crt-green: 綠色 CRT 監視器效果（參考 IMG_4186.png）
 * - hospital-cold: 冷色調醫院廢墟效果（參考 IMG_4187.png）
 * - surveillance: 監視攝影機時間戳記效果（參考 IMG_4188.png）
 * - ritual-warm: 儀式道具暖色調效果（參考 IMG_4181.png）
 */
const ImageFilter: React.FC<ImageFilterProps> = ({ 
  children, 
  filterType = 'crt-green',
  intensity = 70,
  className = ''
}) => {
  const getFilterStyles = () => {
    const normalizedIntensity = intensity / 100;

    switch (filterType) {
      case 'crt-green':
        // 綠色監視器效果：綠色色調 + 掃描線 + 雜訊
        return {
          filter: `
            sepia(${50 * normalizedIntensity}%) 
            hue-rotate(80deg) 
            saturate(${150 * normalizedIntensity}%) 
            contrast(${120 * normalizedIntensity}%)
          `,
          background: `
            repeating-linear-gradient(
              0deg,
              rgba(0, 255, 0, ${0.03 * normalizedIntensity}) 0px,
              transparent 2px,
              transparent 4px,
              rgba(0, 255, 0, ${0.03 * normalizedIntensity}) 4px
            )
          `,
        };

      case 'hospital-cold':
        // 冷色調醫院效果：青綠色調 + 高對比 + 暗角
        return {
          filter: `
            brightness(${0.8 + (0.2 * (1 - normalizedIntensity))}) 
            contrast(${110 + (30 * normalizedIntensity)}%) 
            saturate(${60 + (40 * normalizedIntensity)}%) 
            hue-rotate(${-10 * normalizedIntensity}deg)
          `,
          boxShadow: `inset 0 0 ${100 * normalizedIntensity}px rgba(0, 0, 0, ${0.4 * normalizedIntensity})`,
        };

      case 'surveillance':
        // 監視攝影機效果：低飽和度 + 雜訊 + 時間錯置感
        return {
          filter: `
            grayscale(${30 * normalizedIntensity}%) 
            contrast(${90 + (20 * normalizedIntensity)}%) 
            brightness(${0.9 + (0.1 * (1 - normalizedIntensity))})
          `,
          background: `
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, ${0.02 * normalizedIntensity}) 0px,
              transparent 1px,
              transparent 2px
            )
          `,
        };

      case 'ritual-warm':
        // 儀式道具暖色調：金黃色調 + 高對比 + 血色
        return {
          filter: `
            sepia(${40 * normalizedIntensity}%) 
            hue-rotate(${-20 * normalizedIntensity}deg) 
            saturate(${120 + (30 * normalizedIntensity)}%) 
            contrast(${110 + (20 * normalizedIntensity)}%)
          `,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(139, 0, 0, 0.1) 100%)',
        };

      default:
        return {};
    }
  };

  const filterStyles = getFilterStyles();

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        ...filterStyles,
        transition: 'filter 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {children}
      
      {/* 掃描線覆蓋層（僅 CRT 和 Surveillance 濾鏡） */}
      {(filterType === 'crt-green' || filterType === 'surveillance') && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: filterStyles.background,
            mixBlendMode: 'overlay',
            opacity: intensity / 100,
          }}
        />
      )}

      {/* 雜訊動畫層 */}
      {filterType === 'crt-green' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10 animate-noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      )}

      {/* CSS 動畫定義 */}
      <style>{`
        @keyframes noise {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-noise {
          animation: noise 0.2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ImageFilter;
