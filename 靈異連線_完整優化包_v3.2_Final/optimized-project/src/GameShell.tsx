/**
 * 《靈異連線》完整整合版主遊戲介面
 * Spectral Link - Fully Integrated Game Shell
 * 
 * 整合：HauntDirector、ScanSystem、PlaybackSystem、
 *      VHS 效果、感測器、線索系統、護符系統
 */

import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { PROPS, SCAN_TYPE_TO_MEDIA, CLUE_DEFAULT_MEDIA } from "./assets/props";
import { SCENES, type SceneId } from "./scenes";
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
import { SettingsMenu, useGameSettings, type GameSettings as SettingsType } from "./components/SettingsMenu";
import { SceneTransition } from "./components/SceneTransition";

// Hooks
import { useVHSTimestamp } from "./hooks/useVHSTimestamp";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useHaptics } from "./hooks/useHaptics";
import { useFearSystem } from "./hooks/useFearSystem";
import { useLocale } from "./i18n";

// Utils
import { saveGame, loadGame, hasSaveData, type GameSaveData } from "./utils/saveLoadManager";

type Mode = null | "flashlight" | "scan" | "playback" | "talisman";

// 輔助函數
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// 擴展線索類型
interface ExtendedClue extends Clue {
  mediaKey?: string;
}

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
    <div className="absolute left-3 right-3 top-28 z-[75] animate-fadeIn">
      <div className="bg-black/70 border border-stone-600/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="flex gap-3 p-3">
          {/* 左側圖片 */}
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-stone-600/40 bg-stone-900/50 flex-shrink-0">
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

          {/* 右側文字 */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="text-stone-200 font-bold text-sm truncate">
                {clue.title}
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-200 text-lg leading-none flex-shrink-0"
              >
                ×
              </button>
            </div>
            <div className="text-stone-400 text-xs mt-2 leading-relaxed line-clamp-3">
              {clue.description}
            </div>
            <div className="text-stone-500 text-[10px] mt-2 font-mono">
              記錄時間：{clue.time}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
});

// Расширенные типы для клю
interface ExtendedClue extends Clue {
  mediaKey?: string;
}

// ===== 主遊戲介面 =====
export default function GameShell() {
  const reducedMotion = usePrefersReducedMotion();
  const haptics = useHaptics();
  const timestamp = useVHSTimestamp();
  const { language, t, setLanguage } = useLocale();
  const { settings: userSettings, updateSettings: updateUserSettings, resetSettings } = useGameSettings();

  // ===== 場景狀態 =====
  const [sceneId, setSceneId] = useState<SceneId>("corridor_b1");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const script = SCENE_SCRIPTS[sceneId];

  // ===== 遊戲模式狀態 =====
  const [activeMode, setActiveMode] = useState<Mode>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTalisman, setShowTalisman] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
      title: "血跡輪椅",
      description: "走廊中央的輪椅沾滿血跡，輪子仍在緩緩轉動...",
      time: "03:15",
      isNew: true,
      mediaKey: "wheelchair",
    },
    {
      title: "護理長日誌",
      description: "「1998/12/13 02:00 - 她又出現在走廊盡頭了」",
      time: "02:58",
      isNew: true,
      mediaKey: "documents",
    },
    {
      title: "燒焦的符咒",
      description: "地上散落數張燒焦黃符，像封印失敗的痕跡。",
      time: "02:33",
      isNew: false,
      mediaKey: "talismanBurnt",
    },
    {
      title: "病患檔案",
      description: "林雅婷，23歲。死因：不明。備註：遺體消失。",
      time: "02:15",
      isNew: false,
      mediaKey: "patientFile",
    },
  ]);

  const [objective, setObjective] = useState("找到護理長辦公室的鑰匙，查明病患失蹤原因");

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

  // 新線索數量
  const newClueCount = useMemo(() => clues.filter((c) => c.isNew).length, [clues]);

  // 威脅等級（給 ThreatLevel 元件用）
  const threatLevelForUI = useMemo(() => {
    const p = director.pressure;
    if (p >= 75) return "critical" as const;
    if (p >= 50) return "high" as const;
    if (p >= 25) return "medium" as const;
    return "low" as const;
  }, [director.pressure]);

  // ===== 資源自然變化 =====
  useEffect(() => {
    const interval = setInterval(() => {
      // 訊號波動
      const signalDrift = (Math.random() - 0.5) * 8;
      const dangerPenalty = director.phase !== "stable" ? -2 : 0;
      setSignalStrength((s) => clamp(s + signalDrift + dangerPenalty, 10, 100));

      // 電量消耗
      const batteryDrain = activeMode === "scan" ? 0.12 : activeMode === "playback" ? 0.15 : 0.05;
      setBatteryLevel((b) => clamp(b - batteryDrain, 5, 100));

      // 靈力恢復
      const spiritRegen = director.phase === "stable" ? 0.5 : 0.2;
      setSpiritPower((s) => clamp(s + spiritRegen, 0, 100));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMode, director.phase]);

  // ===== 指針追蹤（手電筒模式）=====
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!sceneRef.current || activeMode !== "flashlight") return;
      const rect = sceneRef.current.getBoundingClientRect();
      setPointer({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [activeMode]
  );

  // ===== 場景切換 =====
  const gotoScene = useCallback(
    (id: SceneId) => {
      haptics.sceneChange();
      setIsTransitioning(true);
      setActiveMode(null);
      setSelectedClue(null);
      scan.clearResult();

      setTimeout(() => {
        setSceneId(id);
        setIsTransitioning(false);
      }, 700);
    },
    [haptics, scan]
  );

  const nextScene = useCallback(() => {
    const order: SceneId[] = ["corridor_b1", "nurse_station", "morgue"];
    const idx = order.indexOf(sceneId);
    gotoScene(order[(idx + 1) % order.length]);
  }, [sceneId, gotoScene]);

  // ===== 手電筒切換 =====
  const toggleFlashlight = useCallback(() => {
    haptics.click();
    setActiveMode((m) => (m === "flashlight" ? null : "flashlight"));
  }, [haptics]);

  // ===== 掃描功能 =====
  const onScan = useCallback(async () => {
    if (scan.isScanning) return;

    haptics.click();
    director.notify("scan");
    setActiveMode("scan");

    // 掃描消耗訊號
    setSignalStrength((s) => clamp(s - (8 + Math.random() * 6), 10, 100));

    const result = await scan.runScan();

    // 產生線索
    const clueData = generateClueFromScan(result);
    setClues((prev) => [
      {
        title: clueData.title,
        description: clueData.description,
        time: nowHHMM(),
        isNew: true,
        mediaKey: clueData.mediaKey,
      },
      ...prev,
    ]);

    // 根據結果更新目標
    if (result.type === "COLD_SPOT") {
      setObjective("沿著低溫區域尋找鑰匙痕跡");
    } else if (result.type === "WHISPER") {
      setObjective("追蹤低語訊號來源");
    }

    director.notify("clue_found");
  }, [scan, haptics, director]);

  // ===== 回放功能 =====
  const onPlayback = useCallback(async () => {
    if (playback.isActive) return;

    haptics.click();
    director.notify("playback");
    setActiveMode("playback");

    // 回放消耗電量和訊號
    setBatteryLevel((b) => clamp(b - (3 + Math.random() * 2), 5, 100));
    setSignalStrength((s) => clamp(s - (5 + Math.random() * 5), 10, 100));

    const footage = await playback.start();

    if (footage) {
      const clueData = generateClueFromPlayback(footage, playback.state.timestamp);
      setClues((prev) => [
        {
          title: clueData.title,
          description: clueData.description,
          time: nowHHMM(),
          isNew: true,
          mediaKey: clueData.mediaKey,
        },
        ...prev,
      ]);

      director.notify("clue_found");
    }
  }, [playback, haptics, director]);

  // ===== 護符功能 =====
  const onTalisman = useCallback(() => {
    if (spiritPower < 30) {
      haptics.error();
      return;
    }

    haptics.talismanActivate();
    director.notify("talisman");
    setSpiritPower((p) => p - 30);
    setShowTalisman(true);
    setActiveMode("talisman");
  }, [spiritPower, haptics, director]);

  const onTalismanComplete = useCallback(() => {
    haptics.talismanSeal();
    setShowTalisman(false);
    setActiveMode(null);

    // 護符效果：恢復訊號、降低恐懼
    setSignalStrength((s) => clamp(s + 20, 10, 100));
  }, [haptics]);

  // ===== 存檔/讀檔功能 =====
  const handleSave = useCallback(() => {
    const success = saveGame({
      sceneId,
      signalStrength,
      batteryLevel,
      spiritPower,
      clues: clues.map(c => ({
        title: c.title,
        description: c.description,
        time: c.time,
        isNew: c.isNew,
        mediaKey: c.mediaKey,
      })),
      objective,
      settings: {
        masterVolume: userSettings.masterVolume,
        musicVolume: userSettings.musicVolume,
        sfxVolume: userSettings.sfxVolume,
        musicEnabled: userSettings.musicEnabled,
        sfxEnabled: userSettings.sfxEnabled,
        vhsStrength: userSettings.vhsStrength,
        hapticsEnabled: userSettings.hapticsEnabled,
        fontScale: userSettings.fontScale,
      },
    });

    if (success) {
      console.log('Game saved successfully');
    }
  }, [sceneId, signalStrength, batteryLevel, spiritPower, clues, objective, userSettings]);

  const handleLoad = useCallback(() => {
    const saveData = loadGame();
    if (!saveData) {
      console.warn('No save data found');
      return;
    }

    // Restore game state
    setSceneId(saveData.sceneId);
    setSignalStrength(saveData.signalStrength);
    setBatteryLevel(saveData.batteryLevel);
    setSpiritPower(saveData.spiritPower);
    setClues(saveData.clues);
    setObjective(saveData.objective);

    // Restore settings if available
    if (saveData.settings) {
      updateUserSettings({
        masterVolume: saveData.settings.masterVolume,
        musicVolume: saveData.settings.musicVolume,
        sfxVolume: saveData.settings.sfxVolume,
        musicEnabled: saveData.settings.musicEnabled,
        sfxEnabled: saveData.settings.sfxEnabled,
        vhsStrength: saveData.settings.vhsStrength,
        hapticsEnabled: saveData.settings.hapticsEnabled,
        fontScale: saveData.settings.fontScale,
      });
    }

    console.log('Game loaded successfully');
  }, [updateUserSettings]);

  // ===== 設定選單處理 =====
  const handleSettingsClose = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  const handleResume = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  const handleQuit = useCallback(() => {
    if (confirm('確定要結束遊戲嗎？未儲存的進度將會遺失。')) {
      window.location.reload();
    }
  }, []);

  // ===== 抽屜開關 =====
  const toggleDrawer = useCallback(() => {
    haptics.click();
    director.notify("drawer_open");
    setDrawerOpen((o) => !o);
  }, [haptics, director]);

  // ===== 選擇線索 =====
  const onSelectClue = useCallback((clue: ExtendedClue) => {
    setSelectedClue(clue);
    // 標記為已讀
    setClues((prev) =>
      prev.map((c) => (c === clue ? { ...c, isNew: false } : c))
    );
  }, []);

  // ===== 模式標籤 =====
  const modeLabel = useMemo(() => {
    if (activeMode === "flashlight") return "FLASHLIGHT";
    if (activeMode === "scan") return "SCAN";
    if (activeMode === "playback") return "PLAYBACK";
    if (activeMode === "talisman") return "SEAL";
    return "EXPLORE";
  }, [activeMode]);

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
        <div className="absolute top-[70px] left-3 z-[70] flex flex-col gap-2">
          <TemperatureSensor temperature={fearState.temperature} />
          <EMFMeter level={fearState.emfLevel} />
          <ThreatLevel level={threatLevelForUI} />
        </div>

        {/* ===== 危險警告 ===== */}
        {director.phase !== "stable" && (
          <div className="absolute top-16 left-[110px] right-14 z-[70]">
            <div className="px-3 py-2 rounded-lg bg-red-950/60 border border-red-800/40 backdrop-blur-sm">
              <div className="text-[11px] text-red-300/90 text-center tracking-wide">
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
          className="absolute inset-0 pt-[90px] pb-[150px]"
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

          {/* 手電筒效果 */}
          {activeMode === "flashlight" && (
            <div
              className="absolute inset-0 pointer-events-none z-[46]"
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
            <div className="absolute inset-0 pointer-events-none z-[46]">
              <div className="absolute inset-0 bg-cyan-950/15" />
              {!reducedMotion && (
                <div
                  className="absolute inset-x-0 h-1"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.6), transparent)",
                    animation: "scanlineMove 2.5s linear infinite",
                  }}
                />
              )}
              <div className="absolute top-6 left-4 text-cyan-300 text-sm tracking-wide animate-pulse">
                ▶ SCANNING...
              </div>
            </div>
          )}

          {/* 場景位置標籤 */}
          <div className="absolute bottom-4 left-4 z-[35]">
            <div className="text-[10px] text-emerald-400/50 tracking-wider font-mono">
              LOC: {SCENES[sceneId].label}
            </div>
          </div>

          {/* 線索按鈕 */}
          <button
            onClick={toggleDrawer}
            className="absolute top-6 right-3 z-[70] w-14 h-14 rounded-xl bg-stone-900/70 border border-stone-700/50 flex flex-col items-center justify-center hover:bg-stone-800/80 transition-all"
            aria-label="開啟線索抽屜"
          >
            <span className="text-xl">📋</span>
            <span className="text-[8px] text-stone-400 mt-0.5">LOG</span>
            {newClueCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-black animate-pulse">
                {newClueCount}
              </span>
            )}
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
        <TalismanOverlay active={showTalisman} power={spiritPower} onComplete={onTalismanComplete} />

        {/* ===== 底部工具列 ===== */}
        <footer className="absolute bottom-0 inset-x-0 z-[70] px-3 py-3 bg-gradient-to-t from-black via-black/95 to-transparent">
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
        <div className="absolute bottom-[155px] right-3 z-[45] text-right pointer-events-none">
          <div className="text-white/70 text-lg font-mono tracking-wider">
            {timestamp}
          </div>
          <div className="text-white/30 text-[10px]">◆ SP-1998</div>
        </div>

        {/* ===== 場景轉場 ===== */}
        <SceneTransition active={isTransitioning} type="blur" duration={700} />

        {/* ===== 設定按鈕 ===== */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="absolute top-[180px] right-14 z-[70] w-10 h-10 rounded-lg bg-stone-900/50 border border-stone-700/40 flex items-center justify-center text-lg hover:bg-stone-800/60 transition-all"
          aria-label="設定"
        >
          ⚙️
        </button>

        {/* ===== 場景切換按鈕（開發用，可移除）===== */}
        <button
          onClick={nextScene}
          className="absolute top-[180px] right-3 z-[70] w-10 h-10 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center text-lg hover:bg-purple-800/60 transition-all"
          aria-label="下一場景"
        >
          🚪
        </button>

        {/* ===== 設定選單 ===== */}
        <SettingsMenu
          isOpen={settingsOpen}
          onClose={handleSettingsClose}
          settings={{
            masterVolume: userSettings.masterVolume,
            musicVolume: userSettings.musicVolume,
            sfxVolume: userSettings.sfxVolume,
            musicEnabled: userSettings.musicEnabled,
            sfxEnabled: userSettings.sfxEnabled,
            vhsStrength: userSettings.vhsStrength,
            hapticsEnabled: userSettings.hapticsEnabled,
            fontScale: userSettings.fontScale,
          }}
          onUpdateSettings={(partial) => {
            updateUserSettings(partial as Partial<typeof userSettings>);
          }}
          onResetSettings={resetSettings}
          onResume={handleResume}
          onQuit={handleQuit}
          onSave={handleSave}
          onLoad={handleLoad}
          hasSaveData={hasSaveData()}
          language={language}
          onLanguageChange={setLanguage}
        />
      </VHSOverlaySystem>
    </div>
  );
}
