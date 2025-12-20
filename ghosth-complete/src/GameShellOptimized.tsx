/**
 * 《靈異連線》完整優化版主遊戲介面
 * Spectral Link - Fully Optimized Game Shell v2.0
 * 
 * 新增功能：
 * 1. 音效系統完整整合
 * 2. 場景切換與轉場效果
 * 3. 互動熱點系統
 * 4. 存檔/讀檔系統
 * 5. 新手引導
 * 6. UI/UX 優化
 * 7. 標題檔案場景整合
 */

import React, { useCallback, useEffect, useMemo, useRef, useState, memo, createContext, useContext } from "react";
import { PROPS, SCAN_TYPE_TO_MEDIA, CLUE_DEFAULT_MEDIA } from "./assets/props";
import { SCENES, SCENE_ORDER, type SceneId } from "./scenes";
import { SCENE_SCRIPTS } from "./scenesEvents";

// Game Systems
import { useHauntDirector, type HauntPhase } from "./game/useHauntDirector";
import { useScanSystem, generateClueFromScan } from "./game/useScanSystem";
import { usePlaybackSystem, generateClueFromPlayback, DEFAULT_FOOTAGE_POOL } from "./game/usePlaybackSystem";

// Components
import { VHSOverlaySystem } from "./components/VHSOverlaySystem";
import { CameraHUD } from "./components/CameraHUD";
import { ClueDrawer, type Clue } from "./components/ClueDrawer";
import { TalismanOverlay } from "./components/TalismanOverlay";
import { ScanResultCard } from "./components/ScanResultCard";
import { PlaybackViewer } from "./components/PlaybackViewer";
import { TemperatureSensor, EMFMeter, ThreatLevel } from "./components/Sensors";
import { ToolButton, Toolbar, SpiritBar } from "./components/ToolbarButtons";
import { TitleArchiveScreen } from "./components/TitleArchiveScreen";

// Hooks
import { useVHSTimestamp } from "./hooks/useVHSTimestamp";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useHaptics } from "./hooks/useHaptics";
import { useFearSystem } from "./hooks/useFearSystem";
import { useAudio } from "./hooks/useAudio";

type Mode = null | "flashlight" | "scan" | "playback" | "talisman";

// ===== 類型定義 =====
interface ExtendedClue extends Clue {
  mediaKey?: string;
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  icon: string;
  label: string;
  description: string;
  clue?: {
    title: string;
    description: string;
    mediaKey?: string;
  };
  sceneLink?: SceneId;
  requiresFlashlight?: boolean;
}

interface GameSaveData {
  version: string;
  savedAt: number;
  sceneId: SceneId;
  clues: ExtendedClue[];
  spiritPower: number;
  batteryLevel: number;
  signalStrength: number;
  objective: string;
  visitedScenes: SceneId[];
  tutorialComplete: boolean;
}

// ===== 場景熱點定義 =====
const SCENE_HOTSPOTS: Record<SceneId, Hotspot[]> = {
  corridor_b1: [
    {
      id: "wheelchair",
      x: 30, y: 55,
      icon: "🛞",
      label: "血跡輪椅",
      description: "走廊中央的輪椅沾滿血跡，輪子仍在緩緩轉動...",
      clue: { title: "血跡輪椅", description: "輪椅上的血跡已乾涸，但輪子卻還在微微轉動，彷彿剛有人坐過。", mediaKey: "wheelchair" },
    },
    {
      id: "door_nurse",
      x: 75, y: 40,
      icon: "🚪",
      label: "護理站入口",
      description: "通往護理站的門，門把上有深深的抓痕。",
      sceneLink: "nurse_station",
    },
    {
      id: "documents",
      x: 55, y: 70,
      icon: "📄",
      label: "散落的文件",
      description: "地上散落的病歷文件，上面的名字都被黑墨塗掉了。",
      clue: { title: "塗黑的病歷", description: "所有病患的名字都被故意塗掉，只剩下「B1-07」這個床號清晰可見。", mediaKey: "documents" },
      requiresFlashlight: true,
    },
    {
      id: "mirror",
      x: 20, y: 45,
      icon: "🪞",
      label: "破碎的鏡子",
      description: "牆上的鏡子碎裂成蜘蛛網狀，倒影似乎與現實不同步...",
      clue: { title: "異常鏡像", description: "鏡中的倒影會延遲0.5秒才跟上動作，有時甚至會獨自移動。", mediaKey: "mirrorShard" },
    },
  ],
  nurse_station: [
    {
      id: "phone",
      x: 40, y: 50,
      icon: "📞",
      label: "老式電話",
      description: "電話線早已斷線，但偶爾會響起鈴聲...",
      clue: { title: "幽靈來電", description: "電話線明明已經斷了，但每到凌晨三點，就會響起三聲鈴聲。" },
    },
    {
      id: "diary",
      x: 65, y: 55,
      icon: "📔",
      label: "護理長日誌",
      description: "1998年12月的日誌，最後一頁寫著「她又出現了」",
      clue: { title: "護理長日誌", description: "「1998/12/13 02:00 - 她又出現在走廊盡頭了。這次，她朝我微笑。」", mediaKey: "documents" },
    },
    {
      id: "monitor",
      x: 25, y: 60,
      icon: "🖥️",
      label: "病患監視器",
      description: "螢幕上顯示著早已關閉的病房影像。",
      requiresFlashlight: true,
    },
    {
      id: "door_corridor",
      x: 10, y: 50,
      icon: "🚪",
      label: "返回走廊",
      description: "通往B1走廊的門。",
      sceneLink: "corridor_b1",
    },
    {
      id: "door_morgue",
      x: 85, y: 50,
      icon: "🚪",
      label: "太平間入口",
      description: "通往地下太平間的樓梯入口，冷風從門縫竄出。",
      sceneLink: "morgue",
    },
  ],
  morgue: [
    {
      id: "freezer",
      x: 35, y: 50,
      icon: "🧊",
      label: "冰櫃 #7",
      description: "其中一個抽屜微微打開，裡面空無一物但有新鮮的水漬。",
      clue: { title: "空的冰櫃", description: "冰櫃 #7 的名牌寫著「林雅婷」，但裡面是空的，只有一灘還沒乾的水。", mediaKey: "morgue" },
    },
    {
      id: "table",
      x: 60, y: 55,
      icon: "🛏️",
      label: "解剖台",
      description: "不鏽鋼台面上有細微的刮痕，像是指甲造成的。",
      clue: { title: "解剖台刮痕", description: "刮痕從台面中央延伸到邊緣，深度和間距都像是人的指甲。" },
      requiresFlashlight: true,
    },
    {
      id: "locker",
      x: 80, y: 45,
      icon: "🗄️",
      label: "置物櫃",
      description: "櫃門半開，裡面有一件沾血的護士服。",
      clue: { title: "沾血護士服", description: "護士服的名牌寫著「王美玲」，胸口有一個燒焦的洞。", mediaKey: "talismanBurnt" },
    },
    {
      id: "door_back",
      x: 15, y: 50,
      icon: "🚪",
      label: "返回護理站",
      description: "通往護理站的樓梯。",
      sceneLink: "nurse_station",
    },
  ],
};

// ===== 存檔系統 Context =====
const SaveContext = createContext<{
  save: (data: Partial<GameSaveData>) => void;
  load: () => GameSaveData | null;
  clear: () => void;
  hasSave: boolean;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
} | null>(null);

function useSaveSystem() {
  const ctx = useContext(SaveContext);
  if (!ctx) throw new Error("useSaveSystem must be used within SaveProvider");
  return ctx;
}

function SaveProvider({ children }: { children: React.ReactNode }) {
  const [hasSave, setHasSave] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("spectral_link_save");
    setHasSave(!!saved);
  }, []);

  const save = useCallback((data: Partial<GameSaveData>) => {
    const saveData: GameSaveData = {
      version: "2.0",
      savedAt: Date.now(),
      sceneId: "corridor_b1",
      clues: [],
      spiritPower: 100,
      batteryLevel: 85,
      signalStrength: 72,
      objective: "找到護理長辦公室的鑰匙",
      visitedScenes: ["corridor_b1"],
      tutorialComplete: false,
      ...data,
    };
    localStorage.setItem("spectral_link_save", JSON.stringify(saveData));
    setHasSave(true);
  }, []);

  const load = useCallback((): GameSaveData | null => {
    try {
      const saved = localStorage.getItem("spectral_link_save");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem("spectral_link_save");
    setHasSave(false);
  }, []);

  return (
    <SaveContext.Provider value={{ save, load, clear, hasSave, autoSaveEnabled, setAutoSaveEnabled }}>
      {children}
    </SaveContext.Provider>
  );
}

// ===== 互動熱點元件 =====
const InteractiveHotspot = memo(function InteractiveHotspot({
  hotspot,
  onInteract,
  isFlashlightMode,
  isVisible,
}: {
  hotspot: Hotspot;
  onInteract: (hotspot: Hotspot) => void;
  isFlashlightMode: boolean;
  isVisible: boolean;
}) {
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 需要手電筒但未開啟時隱藏
  if (hotspot.requiresFlashlight && !isFlashlightMode) {
    return null;
  }

  const pulseOpacity = 0.3 + Math.sin(pulsePhase * 0.1) * 0.3;
  const isSceneLink = !!hotspot.sceneLink;

  return (
    <button
      onClick={() => onInteract(hotspot)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className="absolute z-[45] group touch-manipulation"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: "translate(-50%, -50%)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      aria-label={hotspot.label}
    >
      {/* 發光點 */}
      <div
        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
          isHovered
            ? isSceneLink
              ? "border-purple-400 bg-purple-400/30 scale-125"
              : "border-amber-400 bg-amber-400/30 scale-125"
            : isSceneLink
            ? "border-purple-400/50 bg-purple-400/10"
            : "border-white/40 bg-white/10"
        }`}
        style={{ opacity: isFlashlightMode ? 0.95 : pulseOpacity }}
      >
        <span className="text-sm">{hotspot.icon}</span>
        {isHovered && (
          <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-20" />
        )}
      </div>

      {/* 提示標籤 */}
      {isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 whitespace-nowrap animate-fadeIn z-50">
          <div
            className={`px-2 py-1.5 rounded-lg text-[10px] font-medium shadow-lg ${
              isSceneLink
                ? "bg-purple-950/90 border border-purple-500/50 text-purple-200"
                : "bg-black/90 border border-stone-600/50 text-stone-200"
            }`}
          >
            {isSceneLink ? "🚪 " : ""}
            {hotspot.label}
          </div>
        </div>
      )}
    </button>
  );
});

// ===== 熱點檢視彈窗 =====
const HotspotModal = memo(function HotspotModal({
  hotspot,
  onClose,
  onAddClue,
  onNavigate,
}: {
  hotspot: Hotspot | null;
  onClose: () => void;
  onAddClue: (clue: ExtendedClue) => void;
  onNavigate: (sceneId: SceneId) => void;
}) {
  if (!hotspot) return null;

  const imageSrc = hotspot.clue?.mediaKey
    ? PROPS.foundFootage[hotspot.clue.mediaKey as keyof typeof PROPS.foundFootage]
    : null;

  const handleAddClue = () => {
    if (hotspot.clue) {
      onAddClue({
        title: hotspot.clue.title,
        description: hotspot.clue.description,
        time: new Date().toLocaleTimeString().slice(0, 5),
        isNew: true,
        mediaKey: hotspot.clue.mediaKey,
      });
    }
    onClose();
  };

  const handleNavigate = () => {
    if (hotspot.sceneLink) {
      onNavigate(hotspot.sceneLink);
    }
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[95] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-stone-950/95 border border-stone-600/50 rounded-xl overflow-hidden">
        {/* 標題 */}
        <div className="px-4 py-3 bg-stone-900/80 border-b border-stone-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{hotspot.icon}</span>
            <span className="text-stone-200 font-bold">{hotspot.label}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-800/60 hover:bg-stone-700/80 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors"
          >
            ×
          </button>
        </div>

        {/* 圖片區域 */}
        <div className="relative aspect-video bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={hotspot.label}
              className="w-full h-full object-cover opacity-90"
              draggable={false}
            />
          ) : (
            <div className="text-6xl opacity-40">{hotspot.icon}</div>
          )}
          {/* VHS 掃描線效果 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            }}
          />
        </div>

        {/* 說明 */}
        <div className="p-4">
          <p className="text-stone-300 text-sm leading-relaxed">{hotspot.description}</p>

          <div className="mt-4 flex flex-col gap-2">
            {hotspot.clue && (
              <button
                onClick={handleAddClue}
                className="w-full py-2.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/50 border border-amber-700/40 text-amber-200 text-sm transition-all flex items-center justify-center gap-2"
              >
                📋 記錄為線索
              </button>
            )}

            {hotspot.sceneLink && (
              <button
                onClick={handleNavigate}
                className="w-full py-2.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/40 text-purple-200 text-sm transition-all flex items-center justify-center gap-2"
              >
                🚪 前往 {SCENES[hotspot.sceneLink].label.split(" - ")[1]}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-stone-800/60 hover:bg-stone-700/70 border border-stone-600/40 text-stone-300 text-sm transition-all"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ===== 新手引導元件 =====
const TutorialOverlay = memo(function TutorialOverlay({
  step,
  onNext,
  onSkip,
}: {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  const tutorials = [
    {
      icon: "🔦",
      title: "手電筒",
      desc: "點擊開啟手電筒照亮黑暗區域，發現隱藏的互動點。部分線索只有在手電筒模式下才會顯現。",
    },
    {
      icon: "📡",
      title: "掃描",
      desc: "使用掃描功能偵測異常能量訊號，找出靈異活動的方向與距離。掃描結果會自動記錄為線索。",
    },
    {
      icon: "📹",
      title: "回放",
      desc: "查看監視器錄影，發現過去發生的詭異事件。回放畫面會消耗較多電量。",
    },
    {
      icon: "🧿",
      title: "護符",
      desc: "消耗靈力進行封印，降低威脅等級並恢復訊號強度。當威脅過高時務必使用護符保護自己。",
    },
  ];

  if (step < 0 || step >= tutorials.length) return null;
  const current = tutorials[step];

  return (
    <div className="absolute inset-0 z-[98] bg-black/75 flex items-end justify-center pb-36 animate-fadeIn">
      <div className="w-[90%] max-w-sm bg-stone-950/95 border border-stone-600/50 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-stone-800/80 border border-stone-600/40 flex items-center justify-center text-2xl">
            {current.icon}
          </div>
          <div>
            <div className="text-[10px] text-stone-500 tracking-wider">教學 {step + 1}/{tutorials.length}</div>
            <div className="text-stone-200 font-bold">{current.title}</div>
          </div>
        </div>

        <p className="text-stone-400 text-sm leading-relaxed mb-4">{current.desc}</p>

        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 rounded-lg bg-stone-800/60 border border-stone-600/40 text-stone-400 text-sm hover:bg-stone-700/60 transition-colors"
          >
            跳過教學
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-2.5 rounded-lg bg-emerald-900/50 border border-emerald-600/40 text-emerald-200 text-sm hover:bg-emerald-800/60 transition-colors"
          >
            {step < tutorials.length - 1 ? "下一步" : "開始探索"}
          </button>
        </div>

        {/* 進度指示 */}
        <div className="flex justify-center gap-1.5 mt-4">
          {tutorials.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? "bg-emerald-400" : i < step ? "bg-emerald-600" : "bg-stone-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// ===== 自動存檔提示 =====
const AutoSaveIndicator = memo(function AutoSaveIndicator({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute top-[60px] left-1/2 -translate-x-1/2 z-[90] animate-fadeIn">
      <div className="px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-[10px] flex items-center gap-2 shadow-lg">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        自動存檔中...
      </div>
    </div>
  );
});

// ===== 場景轉場效果 =====
const SceneTransition = memo(function SceneTransition({
  active,
  targetScene,
}: {
  active: boolean;
  targetScene?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setProgress((p) => Math.min(100, p + 15));
    }, 100);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          animation: "noiseShift 0.1s steps(8) infinite",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="text-3xl animate-pulse">📼</div>
        <div className="text-stone-400 text-sm tracking-[0.2em] font-mono">▶ LOADING...</div>
        {targetScene && (
          <div className="text-stone-500 text-xs">{targetScene}</div>
        )}
        <div className="w-32 h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-stone-500 to-stone-300 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
});

// ===== 線索詳情檢視 =====
const ClueDetailView = memo(function ClueDetailView({
  clue,
  onClose,
}: {
  clue: ExtendedClue | null;
  onClose: () => void;
}) {
  if (!clue) return null;

  const imageSrc = clue.mediaKey
    ? PROPS.foundFootage[clue.mediaKey as keyof typeof PROPS.foundFootage]
    : null;

  return (
    <div className="absolute left-3 right-3 top-24 z-[75] animate-fadeIn">
      <div className="bg-black/80 border border-stone-600/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="flex gap-3 p-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-stone-600/40 bg-stone-900/50 flex-shrink-0">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={clue.title}
                className="w-full h-full object-cover opacity-90"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs">
                NO IMAGE
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="text-stone-200 font-bold text-sm truncate">{clue.title}</div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-200 text-lg leading-none flex-shrink-0"
              >
                ×
              </button>
            </div>
            <div className="text-stone-400 text-xs mt-1.5 leading-relaxed line-clamp-3">
              {clue.description}
            </div>
            <div className="text-stone-500 text-[10px] mt-1.5 font-mono">記錄時間：{clue.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ===== 主遊戲介面 =====
function GameShellInner() {
  const reducedMotion = usePrefersReducedMotion();
  const haptics = useHaptics();
  const timestamp = useVHSTimestamp();
  const audio = useAudio();
  const saveSystem = useSaveSystem();

  // ===== 場景狀態 =====
  const [sceneId, setSceneId] = useState<SceneId>("title_archive");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visitedScenes, setVisitedScenes] = useState<SceneId[]>(["title_archive"]);
  const [hasEnteredGame, setHasEnteredGame] = useState(false); // 是否已進入遊戲主場景

  // ===== 遊戲模式狀態 =====
  const [activeMode, setActiveMode] = useState<Mode>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTalisman, setShowTalisman] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  // ===== 資源數值 =====
  const [signalStrength, setSignalStrength] = useState(72);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [spiritPower, setSpiritPower] = useState(100);

  // ===== 互動狀態 =====
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [selectedClue, setSelectedClue] = useState<ExtendedClue | null>(null);

  // ===== 線索系統 =====
  const [clues, setClues] = useState<ExtendedClue[]>([
    {
      title: "任務開始",
      description: "收到匿名舉報，杏林醫院 B1 病房走廊有異常靈異活動。",
      time: "03:00",
      isNew: true,
    },
  ]);

  const [objective, setObjective] = useState("探索杏林醫院，找出靈異事件的真相");

  // ===== 教學/存檔狀態 =====
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  const sceneRef = useRef<HTMLDivElement | null>(null);

  // ===== 恐懼系統 =====
  const fearState = useFearSystem({
    signalStrength,
    spiritPower,
    systemStatus: "stable",
    lowBattery: batteryLevel < 20,
  });

  // ===== 恐怖導演系統 =====
  const director = useHauntDirector({
    fearLevel: fearState.fearLevel,
    signalStrength,
    spiritPower,
    batteryLevel,
  });

  // ===== 掃描系統 =====
  const scan = useScanSystem();

  // ===== 回放系統 =====
  const playback = usePlaybackSystem({
    footagePool: DEFAULT_FOOTAGE_POOL,
  });

  // ===== 初始化 =====
  useEffect(() => {
    // 檢查是否需要教學
    const tutorialDone = localStorage.getItem("spectral_link_tutorial_done");
    if (!tutorialDone) {
      setTutorialStep(0);
    }

    // 載入存檔
    const savedData = saveSystem.load();
    if (savedData) {
      setSceneId(savedData.sceneId);
      setClues(savedData.clues);
      setSpiritPower(savedData.spiritPower);
      setBatteryLevel(savedData.batteryLevel);
      setSignalStrength(savedData.signalStrength);
      setObjective(savedData.objective);
      setVisitedScenes(savedData.visitedScenes || ["corridor_b1"]);
    }

    // 預載入音效
    audio.preloadCommon();

    // 播放環境音
    audio.playAmbient("corridor");
    audio.playLoop("drip");
  }, []);

  // ===== 自動存檔 =====
  useEffect(() => {
    if (!saveSystem.autoSaveEnabled) return;

    const saveInterval = setInterval(() => {
      saveSystem.save({
        sceneId,
        clues,
        spiritPower,
        batteryLevel,
        signalStrength,
        objective,
        visitedScenes,
        tutorialComplete: tutorialStep < 0,
      });
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 1500);
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [sceneId, clues, spiritPower, batteryLevel, signalStrength, objective, visitedScenes, tutorialStep, saveSystem]);

  // ===== 資源自然變化 =====
  useEffect(() => {
    const interval = setInterval(() => {
      // 訊號波動
      setSignalStrength((s) => {
        const delta = (Math.random() - 0.5) * 8;
        const danger = director.phase !== "stable" ? -2 : 0;
        return Math.max(10, Math.min(100, s + delta + danger));
      });

      // 電量消耗
      setBatteryLevel((b) => {
        const drain =
          activeMode === "scan" ? 0.12 : activeMode === "playback" ? 0.15 : 0.05;
        return Math.max(5, b - drain);
      });

      // 靈力恢復
      setSpiritPower((s) => {
        const regen = director.phase === "stable" ? 0.5 : 0.2;
        return Math.min(100, s + regen);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMode, director.phase]);

  // ===== 導演 Incident 音效 =====
  useEffect(() => {
    if (director.phase === "incident") {
      haptics.warning?.();
      audio.playVHS("glitch");

      if (director.incidentType === "ghost") {
        audio.playGhost("whisper");
      } else if (director.incidentType === "static") {
        audio.playGhost("static");
      }
    }
  }, [director.phase, director.incidentType, haptics, audio]);

  // 新線索數量
  const newClueCount = useMemo(() => clues.filter((c) => c.isNew).length, [clues]);

  // 威脅等級
  const threatLevelForUI = useMemo(() => {
    const p = director.pressure;
    if (p >= 75) return "critical" as const;
    if (p >= 50) return "high" as const;
    if (p >= 25) return "medium" as const;
    return "low" as const;
  }, [director.pressure]);

  // 當前場景熱點
  const currentHotspots = SCENE_HOTSPOTS[sceneId] || [];

  // ===== 場景切換 =====
  const gotoScene = useCallback(
    (targetId: SceneId) => {
      if (targetId === sceneId || isTransitioning) return;

      haptics.click?.();
      audio.playUI("click");
      audio.playVHS("tracking");

      setIsTransitioning(true);
      setActiveMode(null);
      setSelectedHotspot(null);
      setSelectedClue(null);

      setTimeout(() => {
        setSceneId(targetId);
        setVisitedScenes((prev) =>
          prev.includes(targetId) ? prev : [...prev, targetId]
        );

        // 切換環境音
        const sceneAudioMap: Record<SceneId, "corridor" | "nurse" | "morgue"> = {
          corridor_b1: "corridor",
          nurse_station: "nurse",
          morgue: "morgue",
        };
        const loopMap: Record<SceneId, "drip" | "fluorescent" | "fridge"> = {
          corridor_b1: "drip",
          nurse_station: "fluorescent",
          morgue: "fridge",
        };

        audio.playAmbient(sceneAudioMap[targetId]);
        audio.playLoop(loopMap[targetId]);

        setIsTransitioning(false);
      }, 800);
    },
    [sceneId, isTransitioning, haptics, audio]
  );

  const nextScene = useCallback(() => {
    const idx = SCENE_ORDER.indexOf(sceneId);
    gotoScene(SCENE_ORDER[(idx + 1) % SCENE_ORDER.length]);
  }, [sceneId, gotoScene]);

  // ===== 指標追蹤 =====
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!sceneRef.current || activeMode !== "flashlight") return;
      const rect = sceneRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPointer({ x, y });
    },
    [activeMode]
  );

  // ===== 手電筒切換 =====
  const toggleFlashlight = useCallback(() => {
    haptics.click?.();
    audio.playUI("click");
    setActiveMode((m) => (m === "flashlight" ? null : "flashlight"));
  }, [haptics, audio]);

  // ===== 掃描 =====
  const onScan = useCallback(async () => {
    if (scan.isScanning) return;

    haptics.scan?.();
    audio.playUI("scan_start");
    director.notify("scan");
    setActiveMode("scan");
    setSignalStrength((s) => Math.max(10, s - 10));

    await scan.runScan();

    audio.playUI("scan_complete");

    if (scan.lastResult) {
      const clueData = generateClueFromScan(scan.lastResult);
      setClues((prev) => [
        {
          ...clueData,
          time: new Date().toLocaleTimeString().slice(0, 5),
          isNew: true,
          mediaKey: SCAN_TYPE_TO_MEDIA[scan.lastResult!.type],
        },
        ...prev,
      ]);
      director.notify("clue_found");

      // 播放對應音效
      if (scan.lastResult.type === "WHISPER") {
        audio.playGhost("whisper");
      } else if (scan.lastResult.type === "FOOTSTEPS") {
        audio.playGhost("footsteps");
      }
    }
  }, [scan, haptics, audio, director]);

  // ===== 回放 =====
  const onPlayback = useCallback(async () => {
    if (playback.isActive) return;

    haptics.click?.();
    audio.playUI("click");
    audio.playVHS("rewind");
    director.notify("playback");
    setActiveMode("playback");
    setBatteryLevel((b) => Math.max(5, b - 3));
    setSignalStrength((s) => Math.max(10, s - 8));

    await playback.start();

    audio.playGhost("static");

    if (playback.state.phase === "showing") {
      const timestamp = new Date().toLocaleTimeString().slice(0, 5);
      const clueData = generateClueFromPlayback(
        { 
          src: playback.state.src, 
          caption: playback.state.caption 
        },
        playback.state.timestamp
      );
      setClues((prev) => [
        {
          ...clueData,
          time: timestamp,
          isNew: true,
        },
        ...prev,
      ]);
      director.notify("clue_found");
    }
  }, [playback, haptics, audio, director]);

  // ===== 護符 =====
  const onTalisman = useCallback(() => {
    if (spiritPower < 30) {
      haptics.error?.();
      return;
    }

    haptics.talismanActivate?.();
    audio.playTalisman("activate");
    director.notify("talisman");
    setSpiritPower((p) => p - 30);
    setShowTalisman(true);
    setActiveMode("talisman");
  }, [spiritPower, haptics, audio, director]);

  const onTalismanComplete = useCallback(() => {
    audio.playTalisman("seal");
    haptics.talismanSeal?.();
    setShowTalisman(false);
    setActiveMode(null);
    setSignalStrength((s) => Math.min(100, s + 20));
  }, [audio, haptics]);

  // ===== 熱點互動 =====
  const onHotspotInteract = useCallback(
    (hotspot: Hotspot) => {
      haptics.click?.();
      audio.playUI("click");
      director.notify("hotspot");
      setSelectedHotspot(hotspot);
    },
    [haptics, audio, director]
  );

  // ===== 新增線索 =====
  const addClue = useCallback(
    (clue: ExtendedClue) => {
      audio.playUI("notification");
      setClues((prev) => [clue, ...prev]);
      director.notify("clue_found");
    },
    [audio, director]
  );

  // ===== 抽屜切換 =====
  const toggleDrawer = useCallback(() => {
    haptics.click?.();
    audio.playUI(drawerOpen ? "drawer_close" : "drawer_open");
    director.notify("drawer_open");
    setDrawerOpen((o) => !o);
  }, [haptics, audio, director, drawerOpen]);

  // ===== 選擇線索 =====
  const onSelectClue = useCallback((clue: ExtendedClue) => {
    setSelectedClue(clue);
    setClues((prev) => prev.map((c) => (c === clue ? { ...c, isNew: false } : c)));
  }, []);

  // ===== 教學控制 =====
  const handleTutorialNext = useCallback(() => {
    if (tutorialStep >= 3) {
      localStorage.setItem("spectral_link_tutorial_done", "true");
      setTutorialStep(-1);
    } else {
      setTutorialStep((s) => s + 1);
    }
  }, [tutorialStep]);

  const handleTutorialSkip = useCallback(() => {
    localStorage.setItem("spectral_link_tutorial_done", "true");
    setTutorialStep(-1);
  }, []);

  // ===== 模式標籤 =====
  const modeLabel = useMemo(() => {
    if (activeMode === "flashlight") return "FLASHLIGHT";
    if (activeMode === "scan") return "SCAN";
    if (activeMode === "playback") return "PLAYBACK";
    if (activeMode === "talisman") return "SEAL";
    return "EXPLORE";
  }, [activeMode]);

  // ===== 從標題場景進入遊戲 =====
  const handleEnterGameFromTitle = useCallback(() => {
    setHasEnteredGame(true);
    setIsTransitioning(true);
    
    // 轉場動畫後切換到走廊場景
    setTimeout(() => {
      setSceneId("corridor_b1");
      setVisitedScenes(prev => [...prev, "corridor_b1"]);
      setIsTransitioning(false);
      
      // 開始教學（如果尚未完成）
      const tutorialDone = localStorage.getItem("spectral_link_tutorial_done");
      if (!tutorialDone) {
        setTutorialStep(0);
      }
    }, 1500);
  }, []);

  // ===== 如果是標題場景，渲染標題場景組件 =====
  if (sceneId === "title_archive" && !hasEnteredGame) {
    return (
      <div
        className="relative w-full max-w-md mx-auto h-screen bg-black overflow-hidden select-none"
        style={{ touchAction: "manipulation" }}
      >
        <TitleArchiveScreen
          onEnterGame={handleEnterGameFromTitle}
          reducedMotion={reducedMotion}
        />
        
        {/* 轉場效果 */}
        {isTransitioning && (
          <div 
            className="absolute inset-0 z-[200] bg-black"
            style={{
              animation: "fadeIn 1.5s ease-out forwards",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-emerald-400/70 text-sm tracking-widest animate-pulse">
                ▶ 連接中...
              </div>
            </div>
          </div>
        )}
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-md mx-auto h-screen bg-black overflow-hidden select-none"
      style={{ touchAction: "manipulation" }}
    >
      <VHSOverlaySystem
        phase={director.phase}
        intensity01={director.intensity01}
        incidentType={director.incidentType}
        reducedMotion={reducedMotion}
      >
        {/* ===== 相機 HUD ===== */}
        <CameraHUD
          signalStrength={signalStrength}
          batteryLevel={batteryLevel}
          isoValue={3200}
          status={director.phase === "stable" ? "stable" : "unstable"}
          cameraId={SCENES[sceneId].cameraId}
        />

        {/* ===== 感測器面板 ===== */}
        <div className="absolute top-[60px] left-2 z-[70] flex flex-col gap-1.5">
          <TemperatureSensor temperature={fearState.temperature} />
          <EMFMeter level={fearState.emfLevel} />
          <ThreatLevel level={threatLevelForUI} />
        </div>

        {/* ===== 危險警告 ===== */}
        {director.phase !== "stable" && (
          <div className="absolute top-14 left-[95px] right-12 z-[70]">
            <div className="px-2 py-1.5 rounded-lg bg-red-950/60 border border-red-800/40 backdrop-blur-sm">
              <div className="text-[10px] text-red-300/90 text-center tracking-wide">
                ⚠ 偵測到靈異反應 · 建議使用護符封印
              </div>
            </div>
          </div>
        )}

        {/* ===== 主場景區域 ===== */}
        <main
          ref={sceneRef}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerMove}
          className="absolute inset-0 pt-[85px] pb-[135px]"
          style={{ touchAction: "none" }}
        >
          {/* 場景背景 */}
          <div className="absolute inset-0">
            <img
              src={SCENES[sceneId].src}
              alt={SCENES[sceneId].label}
              draggable={false}
              className="w-full h-full object-cover"
              style={{
                opacity: 0.92,
                filter: `saturate(${1 - fearState.colorDesaturation})`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `rgba(0, 0, 0, ${0.35 + fearState.fearLevel * 0.003})`,
              }}
            />
          </div>

          {/* 互動熱點 */}
          {currentHotspots.map((hotspot) => (
            <InteractiveHotspot
              key={hotspot.id}
              hotspot={hotspot}
              onInteract={onHotspotInteract}
              isFlashlightMode={activeMode === "flashlight"}
              isVisible={!isTransitioning}
            />
          ))}

          {/* 手電筒效果 */}
          {activeMode === "flashlight" && (
            <div
              className="absolute inset-0 pointer-events-none z-[44]"
              style={{
                background: `radial-gradient(
                  ellipse 130px 170px at ${pointer.x}% ${pointer.y}%,
                  rgba(255, 248, 220, 0.14) 0%,
                  rgba(255, 248, 220, 0.05) 30%,
                  rgba(0, 0, 0, 0.97) 100%
                )`,
              }}
            />
          )}

          {/* 掃描效果 */}
          {activeMode === "scan" && (
            <div className="absolute inset-0 pointer-events-none z-[44]">
              <div className="absolute inset-0 bg-cyan-950/15" />
              {!reducedMotion && (
                <div
                  className="absolute inset-x-0 h-1"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.6), transparent)",
                    animation: "scanlineMove 2.5s linear infinite",
                  }}
                />
              )}
              <div className="absolute top-4 left-3 text-cyan-300 text-sm tracking-wide animate-pulse">
                ▶ SCANNING...
              </div>
            </div>
          )}

          {/* 場景位置標籤 */}
          <div className="absolute bottom-3 left-3 z-[35]">
            <div className="text-[9px] text-emerald-400/50 tracking-wider font-mono">
              LOC: {SCENES[sceneId].label}
            </div>
          </div>

          {/* 線索按鈕 */}
          <button
            onClick={toggleDrawer}
            className="absolute top-4 right-2 z-[70] w-12 h-12 rounded-xl bg-stone-900/70 border border-stone-700/50 flex flex-col items-center justify-center hover:bg-stone-800/80 transition-all"
            aria-label="開啟線索抽屜"
          >
            <span className="text-lg">📋</span>
            <span className="text-[7px] text-stone-400">LOG</span>
            {newClueCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-black animate-pulse">
                {newClueCount}
              </span>
            )}
          </button>

          {/* 場景切換按鈕 */}
          <button
            onClick={nextScene}
            className="absolute top-[130px] right-2 z-[70] w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center text-sm hover:bg-purple-800/60 transition-all"
            aria-label="下一場景"
          >
            🚪
          </button>
        </main>

        {/* ===== 掃描結果卡片 ===== */}
        <ScanResultCard
          result={scan.lastResult}
          isScanning={scan.isScanning}
          onDismiss={scan.clearResult}
          autoDismissDelay={10000}
        />

        {/* ===== 回放檢視器 ===== */}
        <PlaybackViewer state={playback.state} onClose={playback.close} />

        {/* ===== 熱點彈窗 ===== */}
        <HotspotModal
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
          onAddClue={addClue}
          onNavigate={gotoScene}
        />

        {/* ===== 線索詳情 ===== */}
        <ClueDetailView clue={selectedClue} onClose={() => setSelectedClue(null)} />

        {/* ===== 線索抽屜 ===== */}
        <ClueDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          objective={objective}
          threatLabel={director.threatLabel}
          clues={clues}
          onSelect={onSelectClue}
        />

        {/* ===== 護符效果 ===== */}
        <TalismanOverlay
          active={showTalisman}
          power={spiritPower}
          onComplete={onTalismanComplete}
        />

        {/* ===== 底部工具列 ===== */}
        <footer className="absolute bottom-0 inset-x-0 z-[70] px-2 py-2 bg-gradient-to-t from-black via-black/95 to-transparent">
          <SpiritBar value={spiritPower} />

          <Toolbar>
            <ToolButton
              icon="🔦"
              label="手電筒"
              sublabel="LIGHT"
              active={activeMode === "flashlight"}
              onClick={toggleFlashlight}
            />
            <ToolButton
              icon="📡"
              label="掃描"
              sublabel="SCAN"
              variant="scan"
              active={activeMode === "scan"}
              loading={scan.isScanning}
              onClick={onScan}
            />
            <ToolButton
              icon="📹"
              label="回放"
              sublabel="PLAYBACK"
              variant="move"
              active={activeMode === "playback"}
              loading={playback.isActive && playback.state.phase !== "showing"}
              onClick={onPlayback}
            />
            <ToolButton
              icon="🧿"
              label="護符"
              sublabel="SEAL"
              variant="talisman"
              active={activeMode === "talisman"}
              disabled={spiritPower < 30}
              onClick={onTalisman}
            />
          </Toolbar>
        </footer>

        {/* ===== VHS 時間戳 ===== */}
        <div className="absolute bottom-[140px] right-2 z-[45] text-right pointer-events-none">
          <div className="text-white/70 text-base font-mono tracking-wider">{timestamp}</div>
          <div className="text-white/30 text-[9px]">◆ SP-1998</div>
        </div>

        {/* ===== 場景轉場 ===== */}
        <SceneTransition
          active={isTransitioning}
          targetScene={SCENES[SCENE_ORDER[(SCENE_ORDER.indexOf(sceneId) + 1) % SCENE_ORDER.length]]?.label}
        />

        {/* ===== 新手引導 ===== */}
        <TutorialOverlay
          step={tutorialStep}
          onNext={handleTutorialNext}
          onSkip={handleTutorialSkip}
        />

        {/* ===== 自動存檔提示 ===== */}
        <AutoSaveIndicator show={showSaveIndicator} />
      </VHSOverlaySystem>

      {/* 全局動畫樣式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        
        @keyframes noiseShift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(1.5%, -1%); }
        }
        
        @keyframes scanlineMove {
          0% { top: -5%; }
          100% { top: 105%; }
        }
      `}</style>
    </div>
  );
}

// ===== 導出包裝元件 =====
export default function GameShellOptimized() {
  return (
    <SaveProvider>
      <GameShellInner />
    </SaveProvider>
  );
}
