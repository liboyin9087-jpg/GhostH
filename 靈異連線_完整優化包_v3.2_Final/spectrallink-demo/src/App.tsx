/**
 * 《靈異連線》主應用元件
 * Spectral Link - Main App Component
 */

import React, { useEffect, useState, useMemo, createContext, useContext } from "react";
import GameShell from "./GameShell";

// ===== 遊戲設定 Context =====
interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  hapticEnabled: boolean;
  reducedMotion: boolean;
  vhsIntensity: number;
}

const defaultSettings: GameSettings = {
  masterVolume: 70,
  sfxVolume: 80,
  hapticEnabled: true,
  reducedMotion: false,
  vhsIntensity: 75,
};

const GameSettingsContext = createContext<{
  settings: GameSettings;
  updateSettings: (partial: Partial<GameSettings>) => void;
} | null>(null);

export function useGameSettings() {
  const ctx = useContext(GameSettingsContext);
  if (!ctx) throw new Error("useGameSettings must be used within App");
  return ctx;
}

// ===== 錯誤邊界 =====
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-mono">
          <div className="text-5xl mb-6">⚠️</div>
          <div className="text-red-400 text-xl tracking-widest mb-2">系統異常</div>
          <div className="text-stone-500 text-sm mb-6">SYSTEM ERROR DETECTED</div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 tracking-wider hover:bg-red-800/40 transition-all"
          >
            ▶ 重新載入
          </button>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-6 p-4 bg-stone-900/50 rounded-lg text-xs text-stone-400 max-w-md overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// ===== FPS 計數器 =====
function FPSCounter() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const countFrames = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      animationId = requestAnimationFrame(countFrames);
    };

    animationId = requestAnimationFrame(countFrames);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className="fixed top-2 right-2 px-2 py-1 rounded text-xs font-mono z-[9999] pointer-events-none"
      style={{
        background: "rgba(0,0,0,0.7)",
        color: fps >= 30 ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)",
      }}
    >
      {fps} FPS
    </div>
  );
}

// ===== 主應用 =====
export default function App() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem("spectral_link_settings");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [showFPS] = useState(false); // 設為 true 可顯示 FPS

  // 儲存設定
  useEffect(() => {
    try {
      localStorage.setItem("spectral_link_settings", JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // 監聽系統減少動態偏好
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      setSettings((prev) => ({ ...prev, reducedMotion: e.matches }));
    };
    if (mq.matches) {
      setSettings((prev) => ({ ...prev, reducedMotion: true }));
    }
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 防止拉動刷新
  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => document.removeEventListener("touchmove", prevent);
  }, []);

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings: (partial: Partial<GameSettings>) => {
        setSettings((prev) => ({ ...prev, ...partial }));
      },
    }),
    [settings]
  );

  return (
    <ErrorBoundary>
      <GameSettingsContext.Provider value={contextValue}>
        <div
          className="min-h-screen bg-black flex items-center justify-center overflow-hidden"
          style={{ minHeight: "100dvh" }}
        >
          <GameShell />
          {showFPS && <FPSCounter />}
        </div>
      </GameSettingsContext.Provider>
    </ErrorBoundary>
  );
}
