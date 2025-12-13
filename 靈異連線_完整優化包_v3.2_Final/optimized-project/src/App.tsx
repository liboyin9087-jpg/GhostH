import { useState } from 'react'

/**
 * 靈異連線：蝕骨杏林 - 應用程式入口
 * 
 * 這是一個簡單的引導頁面。
 * 請參考 README.md 和 INSTALLATION_GUIDE.md 開始整合使用。
 * 
 * UI/UX 改進：
 * - 添加鍵盤導航支援
 * - 改善無障礙標籤
 * - 優化按鈕互動反饋
 */

function App() {
  const [showInfo, setShowInfo] = useState(true)

  return (
    <div className="min-h-screen bg-bg-deepest text-text-high flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* 標題 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-horror-primary text-shadow-horror">
            靈異連線：蝕骨杏林
          </h1>
          <p className="text-xl text-text-medium" role="doc-subtitle">
            完整優化包 v3.2 Final (Images Integrated)
          </p>
        </header>

        {showInfo && (
          <section 
            className="bg-bg-surface border-2 border-horror-primary rounded p-6 mb-8 shadow-horror-glow"
            aria-labelledby="quick-start-title"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 id="quick-start-title" className="text-2xl font-bold text-horror-primary">
                🎮 快速開始
              </h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-text-medium hover:text-horror-primary transition-colors focus:outline-none focus:ring-2 focus:ring-horror-primary rounded"
                aria-label="關閉快速開始資訊"
                title="關閉"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-text-high">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-horror-primary">
                  📖 閱讀文檔
                </h3>
                <p className="mb-2">
                  請參考以下文檔開始使用：
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm font-mono bg-bg-deep p-3 rounded">
                  <li>README.md - 專案總覽</li>
                  <li>QUICKSTART.md - 快速開始指南</li>
                  <li>INSTALLATION_GUIDE.md - 詳細安裝步驟</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-horror-primary">
                  🚀 開始使用
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>複製 src/components 和 src/hooks 到你的專案</li>
                  <li>參考 INSTALLATION_GUIDE.md 進行整合</li>
                  <li>設定環境變數（參考 .env.example）</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-horror-primary">
                  📦 包含內容
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1">組件（11個）</p>
                    <ul className="list-disc list-inside text-xs space-y-1">
                      <li>CRTOverlay</li>
                      <li>CursedButton</li>
                      <li>TalismanGenerator</li>
                      <li>HauntFlash</li>
                      <li>更多...</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Hooks（4個）</p>
                    <ul className="list-disc list-inside text-xs space-y-1">
                      <li>useSoulBinding</li>
                      <li>useSound</li>
                      <li>useSpectralBattery</li>
                      <li>useGyroParallax</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-bg-deepest border border-horror-secondary p-3 rounded" role="note">
                <p className="text-sm text-horror-secondary font-semibold mb-1">
                  ⚠️ 重要提示
                </p>
                <p className="text-xs text-text-medium">
                  本檔案（App.tsx）僅作為引導頁面。實際專案請替換為你的應用程式邏輯。
                  新增的 LoadingSpinner 和 ErrorBoundary 組件可提升用戶體驗。
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 快速連結 */}
        <nav aria-label="主要文檔導航">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="./README.md"
              className="bg-bg-surface border border-horror-primary p-4 rounded text-center hover:bg-bg-deep hover:border-horror-secondary transition-all focus:outline-none focus:ring-2 focus:ring-horror-primary"
              aria-label="閱讀專案 README 文檔"
            >
              <div className="text-2xl mb-2" aria-hidden="true">📖</div>
              <div className="font-semibold">README</div>
              <div className="text-xs text-text-medium mt-1">專案總覽</div>
            </a>

            <a
              href="./QUICKSTART.md"
              className="bg-bg-surface border border-horror-primary p-4 rounded text-center hover:bg-bg-deep hover:border-horror-secondary transition-all focus:outline-none focus:ring-2 focus:ring-horror-primary"
              aria-label="閱讀快速開始指南"
            >
              <div className="text-2xl mb-2" aria-hidden="true">⚡</div>
              <div className="font-semibold">快速開始</div>
              <div className="text-xs text-text-medium mt-1">5 分鐘啟動</div>
            </a>

            <a
              href="./INSTALLATION_GUIDE.md"
              className="bg-bg-surface border border-horror-primary p-4 rounded text-center hover:bg-bg-deep hover:border-horror-secondary transition-all focus:outline-none focus:ring-2 focus:ring-horror-primary"
              aria-label="閱讀安裝指南"
            >
              <div className="text-2xl mb-2" aria-hidden="true">🛠️</div>
              <div className="font-semibold">安裝指南</div>
              <div className="text-xs text-text-medium mt-1">詳細步驟</div>
            </a>
          </div>
        </nav>

        {/* 版本資訊 */}
        <footer className="mt-12 text-center text-xs text-text-low">
          <p>靈異連線：蝕骨杏林 - 完整優化包</p>
          <p className="mt-1">v3.2 Final (Images Integrated)</p>
          <p className="mt-2 font-mono">台灣首款 Meta Horror 恐怖遊戲</p>
          <p className="mt-3 text-horror-primary">
            ✨ UI/UX 已優化 - 包含載入指示器與錯誤處理
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
