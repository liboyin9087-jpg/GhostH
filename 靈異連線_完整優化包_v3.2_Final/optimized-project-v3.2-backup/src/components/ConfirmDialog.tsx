import React from 'react';
import Button from './Button';

/**
 * ConfirmDialog - 確認對話框組件
 * 
 * 用於需要用戶確認的重要操作
 * 防止誤操作，提升用戶體驗
 * 
 * @param isOpen - 是否顯示對話框
 * @param title - 對話框標題
 * @param message - 對話框訊息
 * @param confirmText - 確認按鈕文字
 * @param cancelText - 取消按鈕文字
 * @param onConfirm - 確認回調函數
 * @param onCancel - 取消回調函數
 * @param variant - 對話框類型 (info, warning, danger)
 */

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'info' | 'warning' | 'danger';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = '確認',
  cancelText = '取消',
  onConfirm,
  onCancel,
  variant = 'info',
  loading = false
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    info: {
      icon: 'ℹ️',
      borderColor: 'border-horror-primary',
      titleColor: 'text-horror-primary'
    },
    warning: {
      icon: '⚠️',
      borderColor: 'border-horror-accent',
      titleColor: 'text-horror-accent'
    },
    danger: {
      icon: '🚨',
      borderColor: 'border-horror-secondary',
      titleColor: 'text-horror-secondary'
    }
  };

  const style = variantStyles[variant];

  // 防止點擊對話框內容時關閉
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  // ESC 鍵關閉
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 防止背景滾動
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading, onCancel]);

  return (
    <div 
      className="fixed inset-0 z-modal bg-bg-deepest/90 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div className={`bg-bg-surface border-2 ${style.borderColor} rounded-lg p-6 max-w-md w-full shadow-horror-glow animate-slide-up`}>
        {/* Icon and Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="text-3xl flex-shrink-0" role="img" aria-label={variant}>
            {style.icon}
          </div>
          <div className="flex-1">
            <h2 
              id="dialog-title"
              className={`text-xl font-bold ${style.titleColor} mb-2`}
            >
              {title}
            </h2>
            <p 
              id="dialog-message"
              className="text-text-medium text-sm"
            >
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onCancel}
            variant="secondary"
            fullWidth
            disabled={loading}
            aria-label={cancelText}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant={variant === 'danger' ? 'danger' : 'primary'}
            fullWidth
            loading={loading}
            aria-label={confirmText}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
