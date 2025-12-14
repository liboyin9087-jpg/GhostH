import React, { ButtonHTMLAttributes } from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Button - 改進的按鈕組件
 * 
 * 提供載入狀態和禁用狀態的視覺反饋
 * 改善用戶體驗，讓操作更清晰
 * 
 * @param loading - 是否顯示載入狀態
 * @param disabled - 是否禁用按鈕
 * @param variant - 按鈕樣式變體
 * @param children - 按鈕內容
 * @param onClick - 點擊事件處理器
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'cursed';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'px-4 py-2 font-bold rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-horror-primary text-black border-2 border-horror-primary hover:bg-transparent hover:text-horror-primary focus:ring-horror-primary shadow-horror-glow',
    secondary: 'bg-transparent text-horror-primary border-2 border-horror-primary hover:bg-horror-primary hover:text-black focus:ring-horror-primary',
    danger: 'bg-horror-secondary text-white border-2 border-horror-secondary hover:bg-transparent hover:text-horror-secondary focus:ring-horror-secondary shadow-horror-red',
    cursed: 'bg-horror-secondary text-white font-serif border-4 border-double border-horror-red shadow-horror-red hover:animate-shake focus:ring-horror-secondary'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" fullScreen={false} />
          <span>處理中...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
