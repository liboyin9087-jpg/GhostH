import React from 'react';
import CRTOverlay from '../components/CRTOverlay';
import CursedAlert from '../components/CursedAlert';
import HauntFlash from '../components/HauntFlash';
import SpectralPhoneBattery from '../components/SpectralPhoneBattery';
import { useSpectralBattery } from '../hooks/useSpectralBattery';
import { useSoulBinding } from '../hooks/useSoulBinding';
import { SCENES } from '../assets/scenes';

export default function GhostAppExample() {
  const { timeLeft, isCursed, currentMessage, glitchIntensity, linkStatus } = useSoulBinding({ startTime: 333 });
  const { batteryPercent, interference } = useSpectralBattery({ timeLeft, startTime: 333, isCursed });

  const [flashKey, setFlashKey] = React.useState<keyof typeof SCENES>('cctv');
  const [flashActive, setFlashActive] = React.useState(false);

  // BREACH / CURSED：監視器快閃
  React.useEffect(() => {
    if (isCursed) { setFlashKey('cctv'); setFlashActive(true); return; }
    if (currentMessage) { setFlashKey('cctv'); setFlashActive(true); return; }
  }, [isCursed, currentMessage]);

  // 倒數 60 秒：走廊快閃一次
  const corridorFiredRef = React.useRef(false);
  React.useEffect(() => {
    if (corridorFiredRef.current) return;
    if (timeLeft === 60) { corridorFiredRef.current = true; setFlashKey('corridor'); setFlashActive(true); }
  }, [timeLeft]);

  const finalIntensity = Math.min(1, Math.max(0, glitchIntensity + interference));

  return (
    <div className="relative w-full min-h-[100svh] overflow-hidden bg-black">
      <HauntFlash scene={flashKey as any} active={flashActive} durationMs={flashKey === 'corridor' ? 1200 : 1800} mode="cctv" onDone={() => setFlashActive(false)} />
      <CRTOverlay intensity={finalIntensity} />
      <CursedAlert active={isCursed} />

      <div className="absolute top-8 right-8 z-40 font-mono text-xs md:text-sm text-right space-y-1">
        <div className="text-red-900 animate-pulse">
          TIME_REMAINING: {String(timeLeft).padStart(3, '0')}
        </div>
        <div className="tracking-widest text-stone-300">
          LINK_STATUS: {linkStatus}
        </div>
      </div>

      <div className="absolute top-8 left-8 z-40">
        <SpectralPhoneBattery percent={batteryPercent} />
      </div>

      {currentMessage && (
        <div className="fixed top-1/3 w-full text-center z-40">
          <span className="inline-block bg-black/80 text-red-500 font-serif text-3xl px-6 py-4 border-l-4 border-red-800 animate-text-shiver shadow-[0_0_20px_rgba(255,0,0,0.5)]">
            👁️ {currentMessage}
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] space-y-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-300 tracking-[0.2em] font-serif opacity-80">蝕骨杏林</h1>
          <p className="mt-4 text-gray-600 text-sm tracking-widest">{timeLeft > 0 ? "連線不穩定...請勿離開" : "通道已開啟"}</p>
        </div>

        <div className="relative">
          <button disabled className="px-10 py-4 bg-gray-900 text-gray-700 font-serif text-xl border border-gray-800 cursor-not-allowed">
            {timeLeft === 0 ? "🩸 簽下生死狀" : "等待儀式完成..."}
          </button>
          <div className="mt-3 text-[10px] text-gray-600 font-mono text-center">REQUIRES: TIME=000</div>
        </div>
      </div>
    </div>
  );
}
