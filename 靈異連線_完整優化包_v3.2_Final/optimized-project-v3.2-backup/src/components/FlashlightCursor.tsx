import React, { useEffect, useRef } from 'react';

interface FlashlightCursorProps {
  fearLevel: number; // 0-100
  enabled?: boolean; // 是否啟用（某些章節可能不需要）
}

/**
 * 手電筒游標效果
 * 在畫面上蓋一層黑色遮罩，只有游標周圍是透明的
 * 恐懼值越高，光圈越小，視野越受限
 */
const FlashlightCursor: React.FC<FlashlightCursorProps> = ({ 
  fearLevel, 
  enabled = true 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (overlayRef.current) {
        // 直接更新 CSS 變數，避免 React 重渲染
        overlayRef.current.style.setProperty('--x', `${e.clientX}px`);
        overlayRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) return null;

  // 恐懼值越高，光圈越小
  // fearLevel 0 = 250px (舒適), 100 = 100px (極度壓迫)
  const radius = Math.max(100, 250 - (fearLevel * 1.5));

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[40] pointer-events-none transition-opacity duration-700"
      style={{
        '--x': '50vw',
        '--y': '50vh',
        background: `radial-gradient(
          circle ${radius}px at var(--x) var(--y), 
          transparent 0%, 
          rgba(0, 0, 0, 0.4) 20%,
          rgba(0, 0, 0, 0.95) 50%
        )`,
      } as React.CSSProperties}
    />
  );
};

export default FlashlightCursor;
