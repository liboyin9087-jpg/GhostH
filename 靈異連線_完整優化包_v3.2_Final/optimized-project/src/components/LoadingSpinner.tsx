import React from 'react';

/**
 * LoadingSpinner - 載入指示器組件
 * 
 * 提供視覺化的載入反饋，改善用戶體驗
 * 
 * @param message - 顯示的載入訊息
 * @param fullScreen - 是否全螢幕顯示
 * @param size - 載入圖示大小 (sm, md, lg)
 */

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "載入中...",
  fullScreen = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-4'
  };

  if (!fullScreen) {
    // Inline spinner for buttons
    return (
      <div 
        className={`${sizeClasses[size]} border-current border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      />
    );
  }

  // Full screen spinner
  const containerClass = "fixed inset-0 z-modal bg-bg-deepest/90 flex items-center justify-center";

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className="text-center">
        <div 
          className={`${sizeClasses[size]} border-horror-primary border-t-transparent rounded-full animate-spin mx-auto mb-4`}
          aria-hidden="true"
        ></div>
        {message && <p className="text-text-medium animate-pulse">{message}</p>}
        <span className="sr-only">載入中，請稍候...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
