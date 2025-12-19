/**
 * 《靈異連線》應用程式入口
 * Spectral Link - Main Entry Point
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

// ===== 錯誤邊界元件 =====
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('應用程式錯誤:', error, errorInfo)
    // 這裡可以加入錯誤追蹤服務（如 Sentry）
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            fontFamily: "'VT323', monospace",
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 20,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            ⚠
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(239, 68, 68, 0.9)',
              letterSpacing: '0.2em',
              marginBottom: 12,
            }}
          >
            系統異常
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'rgba(150, 150, 150, 0.8)',
              letterSpacing: '0.1em',
              marginBottom: 30,
              textAlign: 'center',
            }}
          >
            SYSTEM ERROR DETECTED
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 32px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: 8,
              color: 'rgba(252, 165, 165, 0.9)',
              fontSize: 14,
              letterSpacing: '0.15em',
              cursor: 'pointer',
              fontFamily: "'VT323', monospace",
            }}
          >
            ▶ 重新載入
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre
              style={{
                marginTop: 30,
                padding: 16,
                background: 'rgba(30, 30, 30, 0.8)',
                borderRadius: 8,
                fontSize: 11,
                color: 'rgba(200, 200, 200, 0.7)',
                maxWidth: '90%',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// ===== 渲染應用程式 =====
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('找不到根元素 #root')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

// ===== 開發模式熱更新 =====
if (import.meta.hot) {
  import.meta.hot.accept()
}

// ===== 效能監控（開發模式）=====
if (process.env.NODE_ENV === 'development') {
  // 監控長任務
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('⚠ 長任務偵測:', entry.duration.toFixed(2) + 'ms', entry)
        }
      }
    })
    observer.observe({ entryTypes: ['longtask'] })
  }
}

// ===== Service Worker 註冊（生產模式）=====
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service Worker 註冊失敗:', error)
    })
  })
}
