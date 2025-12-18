import React, { useEffect } from 'react';

/**
 * Toast - 通知提示組件
 * 
 * 用於顯示操作成功/失敗等臨時訊息
 * 自動消失，不打斷用戶操作
 * 
 * @param message - 顯示的訊息
 * @param type - 通知類型 (success, error, warning, info)
 * @param duration - 顯示時長（毫秒）
 * @param onClose - 關閉回調函數
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-900/90',
      borderColor: 'border-green-500',
      textColor: 'text-green-100',
      iconColor: 'text-green-400'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-900/90',
      borderColor: 'border-horror-secondary',
      textColor: 'text-red-100',
      iconColor: 'text-horror-secondary'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-900/90',
      borderColor: 'border-horror-accent',
      textColor: 'text-yellow-100',
      iconColor: 'text-horror-accent'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-900/90',
      borderColor: 'border-horror-primary',
      textColor: 'text-blue-100',
      iconColor: 'text-horror-primary'
    }
  };

  const style = typeStyles[type];

  return (
    <div 
      className={`${style.bgColor} ${style.textColor} border-2 ${style.borderColor} 
                  rounded-lg p-4 shadow-lg 
                  flex items-center gap-3 min-w-[300px] max-w-md
                  animate-slide-up`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={`text-2xl flex-shrink-0 ${style.iconColor}`}>
        {style.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-text-medium hover:text-text-high transition-colors flex-shrink-0"
        aria-label="關閉通知"
      >
        ✕
      </button>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div 
      className="fixed top-4 right-4 z-[9999] space-y-3"
      aria-label="通知區域"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

// Toast Hook for easy usage
export const useToast = () => {
  const [toasts, setToasts] = React.useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string) => addToast(message, 'success');
  const error = (message: string) => addToast(message, 'error');
  const warning = (message: string) => addToast(message, 'warning');
  const info = (message: string) => addToast(message, 'info');

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    ToastContainer: () => <ToastContainer toasts={toasts} onRemove={removeToast} />
  };
};

export default Toast;
