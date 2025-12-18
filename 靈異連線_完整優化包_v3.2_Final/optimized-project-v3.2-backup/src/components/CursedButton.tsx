import React, { useState } from 'react';

interface CursedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * 詛咒按鈕組件
 * 懸停時文字改變，邊框抖動，將募資行為包裝成「簽訂契約」
 * 適用於所有 CTA 按鈕（立即贊助、查看更多等）
 */
const CursedButton: React.FC<CursedButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 懸停時顯示的替代文字
  const getHoveredText = () => {
    const originalText = typeof children === 'string' ? children : '';
    
    const transformations: Record<string, string> = {
      '立即贊助': '簽下契約',
      '查看更多': '深入深淵',
      '了解詳情': '見證真相',
      '開始體驗': '連線啟動',
      '加入我們': '成為一員',
    };

    return transformations[originalText] || '接受代價';
  };

  const baseStyles = `
    relative px-6 py-3 font-mono font-bold tracking-wider
    transition-all duration-200 cursor-pointer
    overflow-hidden group
  `;

  const variantStyles = variant === 'primary' 
    ? 'border-2 border-[#00FF41] bg-black text-[#00FF41] hover:border-[#FF3333] hover:text-[#FF3333]'
    : 'border border-stone-700 bg-stone-900 text-stone-300 hover:border-[#FF3333] hover:text-[#FF3333]';

  const shakeStyles = isHovered ? 'animate-button-shake' : '';

  return (
    <>
      <button
        className={`${baseStyles} ${variantStyles} ${shakeStyles} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* 正常文字 */}
        <span className={`block transition-opacity duration-200 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          {children}
        </span>
        
        {/* 懸停文字 */}
        <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {getHoveredText()}
        </span>

        {/* 發光效果 */}
        {isHovered && (
          <span className="absolute inset-0 bg-[#FF3333] opacity-10 blur-xl" />
        )}

        {/* 邊角故障效果 */}
        <span className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${isHovered ? 'border-[#FF3333]' : 'border-transparent'} transition-colors`} />
        <span className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${isHovered ? 'border-[#FF3333]' : 'border-transparent'} transition-colors`} />
      </button>

      {/* CSS 動畫定義 */}
      <style>{`
        @keyframes button-shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-2px) rotate(-0.5deg); }
          20% { transform: translateX(2px) rotate(0.5deg); }
          30% { transform: translateX(-2px) rotate(-0.5deg); }
          40% { transform: translateX(2px) rotate(0.5deg); }
          50% { transform: translateX(-1px) rotate(-0.3deg); }
          60% { transform: translateX(1px) rotate(0.3deg); }
          70% { transform: translateX(-1px) rotate(-0.3deg); }
          80% { transform: translateX(1px) rotate(0.3deg); }
          90% { transform: translateX(-0.5px); }
        }
        
        .animate-button-shake {
          animation: button-shake 0.3s infinite;
        }
      `}</style>
    </>
  );
};

export default CursedButton;
