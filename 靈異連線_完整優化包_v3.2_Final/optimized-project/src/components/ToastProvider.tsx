import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, ToastType } from './Toast';

/**
 * ToastProvider - Toast 通知系統的 Context Provider
 * 
 * 提供全局的 toast 通知管理
 * 讓任何組件都能輕鬆顯示通知訊息
 * 
 * 使用方式：
 * 1. 在 App 最外層包裹 <ToastProvider>
 * 2. 在任何子組件中使用 useToast() hook
 * 
 * 範例：
 * const { success, error } = useToast();
 * success("操作成功！");
 * error("發生錯誤！");
 */

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number; // 最多同時顯示幾個 toast
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children,
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }];
      // 限制最多顯示的 toast 數量
      if (newToasts.length > maxToasts) {
        return newToasts.slice(-maxToasts);
      }
      return newToasts;
    });
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string) => {
    addToast(message, 'success');
  }, [addToast]);

  const error = useCallback((message: string) => {
    addToast(message, 'error');
  }, [addToast]);

  const warning = useCallback((message: string) => {
    addToast(message, 'warning');
  }, [addToast]);

  const info = useCallback((message: string) => {
    addToast(message, 'info');
  }, [addToast]);

  const value: ToastContextValue = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * useToast - Toast 通知 Hook
 * 
 * 必須在 ToastProvider 內部使用
 * 
 * @returns Toast 管理函數
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastProvider;
