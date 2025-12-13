import { useState } from 'react'

/**
 * 靈異連線：蝕骨杏林 - 應用程式入口
 * 
 * 這是一個簡單的引導頁面。
 * 實際的整合範例請參考：src/examples/GhostAppExample.tsx
 * 或者根目錄的 EXAMPLE_LandingPage.tsx
 */

function App() {
  const [showInfo, setShowInfo] = useState(true)

  return (
    <div className="min-h-screen bg-bg-deepest text-text-high flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* 標題 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-horror-primary text-shadow-horror">
            靈異連線：蝕骨杏林
          </h1>
          <p className="text-xl text-text-medium">
            完整優化包 v3.2 Final (Images Integrated)
          </p>
        </div>

        {showInfo && (
          <div className="bg-bg-surface border-2 border-horror-primary rounded p-6 mb-8 shadow-horror-glow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-horror-primary">🎮 快速開始</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-text-medium hover:text-horror-primary transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-text-high">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-horror-primary">
                  📖 查看完整範例
                </h3>
                <p className="mb-2">
                  完整的整合範例位於：
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm font-mono bg-bg-deep p-3 rounded">
                  <li>src/examples/GhostAppExample.tsx</li>
                  <li>EXAMPLE_LandingPage.tsx (根目錄)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-horror-primary">
                  🚀 開始使用
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>複製 src/components 和 src/hooks 到你的專案</li>
                  <li>參考範例檔案進行整合</li>
                  <li>閱讀 README.md 和 INSTALLATION_GUIDE.md</li>
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

              <div className="bg-bg-deepest border border-horror-secondary p-3 rounded">
                <p className="text-sm text-horror-secondary font-semibold mb-1">
                  ⚠️ 重要提示
                </p>
                <p className="text-xs text-text-medium">
                  本檔案（App.tsx）僅作為引導頁面。實際專案請替換為你的應用程式邏輯，
                  或直接使用 GhostAppExample.tsx 作為起點。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 快速連結 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="./README.md"
            className="bg-bg-surface border border-horror-primary p-4 rounded text-center hover:bg-bg-deep transition-colors"
          >
            <div className="text-2xl mb-2">📖</div>
            <div className="font-semibold">README</div>
            <div className="text-xs text-text-medium mt-1">專案總覽</div>
          </a>

          <a
            href="./INSTALLATION_GUIDE.md"
            className="bg-bg-surface border border-horror-primary p-4 rounded text-center hover:bg-bg-deep transition-colors"
          >
            <div className="text-2xl mb-2">🛠️</div>
            <div className="font-semibold">安裝指南</div>
            <div className="text-xs text-text-medium mt-1">詳細步驟</div>
          </a>

          <a
            href="./examples/INTEGRATION_EXAMPLE.md"
            className="bg-bg-surface border border-horror-primary p-4 rounded text-center hover:bg-bg-deep transition-colors"
          >
            <div className="text-2xl mb-2">💡</div>
            <div className="font-semibold">整合範例</div>
            <div className="text-xs text-text-medium mt-1">實作參考</div>
          </a>
        </div>

        {/* 版本資訊 */}
        <div className="mt-12 text-center text-xs text-text-low">
          <p>靈異連線：蝕骨杏林 - 完整優化包</p>
          <p className="mt-1">v3.2 Final (Images Integrated)</p>
          <p className="mt-2 font-mono">台灣首款 Meta Horror 恐怖遊戲</p>
        </div>
      </div>
    </div>
  )
}

export default App
