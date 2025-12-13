import React, { useState, useEffect, useRef } from 'react';
import ImageFilter from './ImageFilter';
import { surveillancePalette } from '../styles/colorPalette';

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  location: string;
  timestamp: string;
  description: string;
  filterType?: 'crt-green' | 'hospital-cold' | 'surveillance' | 'ritual-warm';
  fearIncrease: number; // 查看此圖片增加的恐懼值
}

interface InteractiveImageGalleryProps {
  images: GalleryImage[];
  onFearIncrease: (amount: number) => void;
  currentFearLevel: number;
}

/**
 * 互動式圖片查看器
 * 特色：
 * - 查看圖片越久，恐懼值增加越多
 * - 支援全螢幕模式
 * - CRT 監視器效果
 * - 時間戳記顯示
 * - 隨機故障效果
 */
const InteractiveImageGallery: React.FC<InteractiveImageGalleryProps> = ({
  images,
  onFearIncrease,
  currentFearLevel,
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [viewDuration, setViewDuration] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  
  const viewTimerRef = useRef<number | null>(null);
  const glitchTimerRef = useRef<number | null>(null);

  // 更新時間戳記（模擬監視器實時顯示）
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      const formatted = now.toISOString()
        .replace('T', ' - ')
        .replace(/\.\d{3}Z$/, ' AM')
        .toUpperCase();
      setCurrentTimestamp(formatted);
    };

    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  // 監控圖片查看時間並增加恐懼值
  useEffect(() => {
    if (selectedImage) {
      setViewDuration(0);
      
      // 每秒增加查看時間
      viewTimerRef.current = window.setInterval(() => {
        setViewDuration(prev => {
          const newDuration = prev + 1;
          
          // 每 3 秒增加恐懼值
          if (newDuration % 3 === 0) {
            onFearIncrease(selectedImage.fearIncrease);
          }
          
          // 查看超過 10 秒，開始隨機故障
          if (newDuration > 10 && Math.random() > 0.7) {
            triggerGlitch();
          }
          
          return newDuration;
        });
      }, 1000);
    } else {
      if (viewTimerRef.current) {
        clearInterval(viewTimerRef.current);
      }
      setViewDuration(0);
    }

    return () => {
      if (viewTimerRef.current) {
        clearInterval(viewTimerRef.current);
      }
    };
  }, [selectedImage, onFearIncrease]);

  // 觸發故障效果
  const triggerGlitch = () => {
    setIsGlitching(true);
    
    if (glitchTimerRef.current) {
      clearTimeout(glitchTimerRef.current);
    }
    
    glitchTimerRef.current = window.setTimeout(() => {
      setIsGlitching(false);
    }, 200);
  };

  // 關閉圖片查看器
  const closeViewer = () => {
    setSelectedImage(null);
    setViewDuration(0);
  };

  // 鍵盤快捷鍵
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeViewer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  return (
    <div className="w-full">
      {/* 圖片網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-stone-800 hover:border-crt-green transition-all duration-300"
            onClick={() => setSelectedImage(image)}
          >
            {/* 圖片預覽 */}
            <ImageFilter 
              filterType={image.filterType || 'hospital-cold'}
              intensity={50}
            >
              <div className="aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </ImageFilter>

            {/* 資訊覆蓋層 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-mono text-sm mb-1">{image.title}</h3>
              <p className="text-stone-400 font-mono text-xs">{image.location}</p>
              <p className="text-stone-500 font-mono text-xs mt-2">{image.timestamp}</p>
            </div>

            {/* 恐懼值警告 */}
            {image.fearIncrease > 5 && (
              <div className="absolute top-2 right-2 bg-red-900 bg-opacity-80 text-red-300 px-2 py-1 rounded text-xs font-mono">
                ⚠ +{image.fearIncrease} FEAR
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 全螢幕圖片查看器 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          onClick={closeViewer}
        >
          {/* 關閉提示 */}
          <div className="absolute top-4 right-4 text-white font-mono text-sm bg-black bg-opacity-60 px-3 py-2 rounded z-10">
            按 ESC 或點擊任意處關閉
          </div>

          {/* 監視器 UI */}
          <div className="w-full h-full relative" onClick={(e) => e.stopPropagation()}>
            {/* REC 錄製指示器 */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10 font-mono text-sm">
              <div 
                className="w-3 h-3 rounded-full bg-red-600 animate-pulse"
                style={{ boxShadow: `0 0 10px ${surveillancePalette.timestamp.rec}` }}
              />
              <span style={{ color: surveillancePalette.timestamp.text }}>REC</span>
            </div>

            {/* 時間戳記 */}
            <div 
              className="absolute bottom-4 left-4 font-mono text-sm z-10"
              style={{ 
                color: surveillancePalette.timestamp.text,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {currentTimestamp}
            </div>

            {/* 查看時間與恐懼值警告 */}
            <div 
              className="absolute bottom-4 right-4 font-mono text-sm z-10 bg-black bg-opacity-60 px-3 py-2 rounded"
              style={{ color: surveillancePalette.timestamp.text }}
            >
              <div>查看時間: {viewDuration}s</div>
              <div className="text-red-400 mt-1">
                恐懼值: {currentFearLevel}/100
              </div>
              {viewDuration > 10 && (
                <div className="text-yellow-400 text-xs mt-1 animate-pulse">
                  ⚠ 訊號不穩定
                </div>
              )}
            </div>

            {/* 攝影機編號 */}
            <div 
              className="absolute top-4 right-4 font-mono text-sm z-10"
              style={{ 
                color: surveillancePalette.timestamp.text,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              CAM {selectedImage.id.padStart(2, '0')} - {selectedImage.location.toUpperCase()}
            </div>

            {/* 圖片內容（帶濾鏡） */}
            <ImageFilter 
              filterType={selectedImage.filterType || 'surveillance'}
              intensity={70 + (currentFearLevel / 5)} // 恐懼值越高，濾鏡越強
              className="w-full h-full"
            >
              <div 
                className={`w-full h-full flex items-center justify-center ${isGlitching ? 'animate-glitch' : ''}`}
                onClick={closeViewer}
              >
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    filter: isGlitching ? 'contrast(200%) hue-rotate(90deg)' : 'none',
                  }}
                />
              </div>
            </ImageFilter>

            {/* 圖片描述（底部覆蓋） */}
            <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-10">
              <h2 
                className="text-2xl font-mono mb-2"
                style={{ color: surveillancePalette.timestamp.text }}
              >
                {selectedImage.title}
              </h2>
              <p 
                className="text-sm font-mono opacity-80"
                style={{ color: surveillancePalette.timestamp.text }}
              >
                {selectedImage.description}
              </p>
            </div>

            {/* 故障效果覆蓋層 */}
            {isGlitching && (
              <div className="absolute inset-0 bg-white opacity-20 pointer-events-none z-20" />
            )}
          </div>

          {/* CSS 動畫 */}
          <style>{`
            @keyframes glitch {
              0% { transform: translate(0); }
              20% { transform: translate(-2px, 2px); }
              40% { transform: translate(-2px, -2px); }
              60% { transform: translate(2px, 2px); }
              80% { transform: translate(2px, -2px); }
              100% { transform: translate(0); }
            }
            .animate-glitch {
              animation: glitch 0.2s infinite;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default InteractiveImageGallery;
