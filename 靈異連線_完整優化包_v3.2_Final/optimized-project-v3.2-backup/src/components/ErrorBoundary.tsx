import React, { Component, ReactNode } from 'react';

/**
 * ErrorBoundary - 錯誤邊界組件
 * 
 * 捕捉 React 組件樹中的錯誤，防止整個應用崩潰
 * 提供友善的錯誤訊息和恢復選項
 * 
 * 使用方式：
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 更新狀態使下次渲染顯示備用 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 記錄錯誤到錯誤報告服務
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      errorInfo
    });

    // 呼叫自訂錯誤處理器
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供自訂 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 預設錯誤 UI
      return (
        <div className="min-h-screen bg-bg-deepest flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-bg-surface border-2 border-horror-secondary rounded p-6 text-center">
              <div className="text-6xl mb-4" role="img" aria-label="錯誤">
                ⚠️
              </div>
              
              <h1 className="text-3xl text-horror-secondary mb-4 font-bold">
                發生錯誤
              </h1>
              
              <p className="text-text-medium mb-4">
                抱歉，應用程式遇到了意外的問題。
              </p>
              
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-text-low text-sm cursor-pointer hover:text-text-medium mb-2">
                    技術詳情
                  </summary>
                  <div className="bg-bg-deepest border border-horror-primary rounded p-3 font-mono text-xs text-horror-primary overflow-auto max-h-40">
                    <p className="mb-2">
                      <strong>錯誤訊息：</strong>
                      <br />
                      {this.state.error.message}
                    </p>
                    {this.state.errorInfo && (
                      <p>
                        <strong>堆疊追蹤：</strong>
                        <br />
                        <pre className="whitespace-pre-wrap text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </p>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-horror-primary text-black font-bold rounded hover:bg-horror-primary/80 transition-colors"
                >
                  嘗試恢復
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className="flex-1 px-4 py-2 border-2 border-horror-primary text-horror-primary rounded hover:bg-horror-primary hover:text-black transition-colors"
                >
                  重新載入
                </button>
              </div>
              
              <p className="text-text-low text-xs mt-4">
                如果問題持續發生，請聯繫技術支援。
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
