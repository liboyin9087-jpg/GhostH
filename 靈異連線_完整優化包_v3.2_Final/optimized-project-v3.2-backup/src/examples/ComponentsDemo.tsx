import React, { useState } from 'react';
import Button from '../components/Button';
import Tooltip from '../components/Tooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * ComponentsDemo - 高優先級組件展示頁面
 * 
 * 展示所有新增的高優先級 UI/UX 組件
 * 包含實際使用範例
 */

const ComponentsDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showFullSpinner, setShowFullSpinner] = useState(false);
  const { success, error, warning, info, ToastContainer } = useToast();

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    success('操作成功完成！');
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setConfirmLoading(false);
    setShowConfirm(false);
    success('已確認操作！');
  };

  const handleShowSpinner = () => {
    setShowFullSpinner(true);
    setTimeout(() => {
      setShowFullSpinner(false);
      info('載入完成！');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-bg-deepest text-text-high p-8">
      <ToastContainer />
      
      {showFullSpinner && <LoadingSpinner message="載入資料中..." />}
      
      <ConfirmDialog
        isOpen={showConfirm}
        title="確認操作"
        message="您確定要執行此操作嗎？這個操作無法撤銷。"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        variant="warning"
        loading={confirmLoading}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-horror-primary text-shadow-horror mb-4">
            高優先級組件展示
          </h1>
          <p className="text-xl text-text-medium">
            UI/UX 改進 - 即時可用的組件
          </p>
        </header>

        {/* Button 組件展示 */}
        <section className="mb-12 bg-bg-surface border-2 border-horror-primary rounded-lg p-6">
          <h2 className="text-2xl font-bold text-horror-primary mb-4">
            1. Button 組件 - 載入狀態反饋
          </h2>
          <p className="text-text-medium mb-6">
            改進的按鈕組件，提供載入狀態和禁用狀態的視覺反饋
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-horror-accent mb-2">樣式變體</h3>
              <div className="space-y-3">
                <Button variant="primary" onClick={() => info('Primary 按鈕')}>
                  Primary 按鈕
                </Button>
                <Button variant="secondary" onClick={() => info('Secondary 按鈕')}>
                  Secondary 按鈕
                </Button>
                <Button variant="danger" onClick={() => error('Danger 按鈕')}>
                  Danger 按鈕
                </Button>
                <Button variant="cursed" onClick={() => warning('Cursed 按鈕')}>
                  Cursed 按鈕
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-horror-accent mb-2">狀態展示</h3>
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  loading={loading} 
                  onClick={handleAsyncAction}
                >
                  點擊測試載入狀態
                </Button>
                <Button variant="secondary" disabled>
                  禁用狀態
                </Button>
                <Button variant="primary" fullWidth>
                  全寬按鈕
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tooltip 組件展示 */}
        <section className="mb-12 bg-bg-surface border-2 border-horror-primary rounded-lg p-6">
          <h2 className="text-2xl font-bold text-horror-primary mb-4">
            2. Tooltip 組件 - 工具提示
          </h2>
          <p className="text-text-medium mb-6">
            懸停時顯示說明文字，改善用戶理解
          </p>

          <div className="flex flex-wrap gap-8 justify-center py-8">
            <Tooltip text="這是頂部提示" position="top">
              <Button variant="secondary">上方提示</Button>
            </Tooltip>

            <Tooltip text="這是底部提示" position="bottom">
              <Button variant="secondary">下方提示</Button>
            </Tooltip>

            <Tooltip text="這是左側提示" position="left">
              <Button variant="secondary">左側提示</Button>
            </Tooltip>

            <Tooltip text="這是右側提示" position="right">
              <Button variant="secondary">右側提示</Button>
            </Tooltip>
          </div>
        </section>

        {/* ConfirmDialog 組件展示 */}
        <section className="mb-12 bg-bg-surface border-2 border-horror-primary rounded-lg p-6">
          <h2 className="text-2xl font-bold text-horror-primary mb-4">
            3. ConfirmDialog 組件 - 確認對話框
          </h2>
          <p className="text-text-medium mb-6">
            用於需要用戶確認的重要操作，防止誤操作
          </p>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              onClick={() => setShowConfirm(true)}
            >
              打開確認對話框
            </Button>
            <p className="text-sm text-text-low">
              點擊按鈕查看確認對話框效果
            </p>
          </div>
        </section>

        {/* Toast 組件展示 */}
        <section className="mb-12 bg-bg-surface border-2 border-horror-primary rounded-lg p-6">
          <h2 className="text-2xl font-bold text-horror-primary mb-4">
            4. Toast 通知 - 即時反饋
          </h2>
          <p className="text-text-medium mb-6">
            顯示操作成功/失敗等臨時訊息，自動消失
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="primary" onClick={() => success('操作成功！')}>
              Success
            </Button>
            <Button variant="danger" onClick={() => error('發生錯誤！')}>
              Error
            </Button>
            <Button variant="secondary" onClick={() => warning('警告訊息！')}>
              Warning
            </Button>
            <Button variant="secondary" onClick={() => info('資訊提示！')}>
              Info
            </Button>
          </div>
        </section>

        {/* LoadingSpinner 組件展示 */}
        <section className="mb-12 bg-bg-surface border-2 border-horror-primary rounded-lg p-6">
          <h2 className="text-2xl font-bold text-horror-primary mb-4">
            5. LoadingSpinner 組件 - 載入指示器
          </h2>
          <p className="text-text-medium mb-6">
            全螢幕載入指示器，提供視覺化反饋
          </p>

          <div className="space-y-3">
            <Button variant="primary" onClick={handleShowSpinner}>
              顯示全螢幕載入器（3秒）
            </Button>
            <p className="text-sm text-text-low">
              點擊按鈕查看全螢幕載入效果
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-text-low text-sm mt-12 pt-6 border-t border-horror-primary">
          <p>✨ 所有組件都已實作並可立即使用</p>
          <p className="mt-2">基於 WCAG 2.1 無障礙標準和現代 UX 最佳實踐</p>
        </footer>
      </div>
    </div>
  );
};

export default ComponentsDemo;
