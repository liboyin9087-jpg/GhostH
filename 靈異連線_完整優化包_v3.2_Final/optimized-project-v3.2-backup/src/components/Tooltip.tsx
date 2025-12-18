import React, { ReactNode } from 'react';

/**
 * Tooltip - 工具提示組件
 * 
 * 在懸停時顯示說明文字
 * 改善用戶對界面元素的理解
 * 
 * @param children - 觸發 tooltip 的元素
 * @param text - 顯示的提示文字
 * @param position - tooltip 位置 (top, bottom, left, right)
 */

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  text,
  position = 'top'
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block group">
      {children}
      <div 
        className={`absolute ${positionClasses[position]} z-50 px-3 py-1 
                    bg-bg-deep border border-horror-primary 
                    text-xs text-text-high rounded 
                    opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200
                    whitespace-nowrap pointer-events-none
                    shadow-horror-glow`}
        role="tooltip"
      >
        {text}
        {/* Arrow */}
        <div className={`absolute ${
          position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-bg-deep border-t-4 border-x-transparent border-x-4 border-b-0' :
          position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-bg-deep border-b-4 border-x-transparent border-x-4 border-t-0' :
          position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-bg-deep border-l-4 border-y-transparent border-y-4 border-r-0' :
          'right-full top-1/2 -translate-y-1/2 border-r-bg-deep border-r-4 border-y-transparent border-y-4 border-l-0'
        }`} />
      </div>
    </div>
  );
};

export default Tooltip;
