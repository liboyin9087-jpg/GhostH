import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import IntroOverlay from '../src/components/IntroOverlay';
import SpectralPhoneBattery from '../src/components/SpectralPhoneBattery';
import CRTOverlay from '../src/components/CRTOverlay';
import { useSoulBinding } from '../src/hooks/useSoulBinding';
import { useSpectralBattery } from '../src/hooks/useSpectralBattery';

const SOUND_PATHS = {
  ambient: '/sounds/hospital_hum.mp3',
  burn: '/sounds/paper_burn.mp3',
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function GhostAppExample() {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const audioEnabled = audioUnlocked && soundOn;

  const { timeLeft, isCursed, currentMessage, glitchIntensity, isContractReady } = useSoulBinding({
    startTime: 333,
    audioEnabled,
  });

  const { interference } = useSpectralBattery({
    timeLeft,
    startTime: 333,
    isCursed,
  });

  const [playAmbient, { stop: stopAmbient }] = useSound(SOUND_PATHS.ambient, {
    volume: 0.18,
    loop: true,
    soundEnabled: audioEnabled,
  });

  useEffect(() => {
    if (!audioEnabled) {
      stopAmbient?.();
      return;
    }
    playAmbient();
    return () => stopAmbient?.();
  }, [audioEnabled, playAmbient, stopAmbient]);

  const [contractSigned, setContractSigned] = useState(false);
  const [playBurn] = useSound(SOUND_PATHS.burn, { volume: 0.7, soundEnabled: audioEnabled });

  const handleContractSign = () => {
    if (contractSigned) return;
    playBurn();
    setContractSigned(true);
    window.setTimeout(() => alert('契約已送達靈界（示範）'), 1500);
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black transition-colors duration-100 ${isCursed ? 'bg-red-900' : ''}`}>
      <IntroOverlay onStart={() => setAudioUnlocked(true)} />

      <CRTOverlay intensity={clamp01(glitchIntensity + interference)} />

      <SpectralPhoneBattery timeLeft={timeLeft} startTime={333} isCursed={isCursed} />

      <button
        className="absolute bottom-6 right-6 z-50 text-xs font-mono text-stone-400 border border-stone-700 px-3 py-2 bg-black/50 hover:bg-black"
        onClick={() => setSoundOn(v => !v)}
      >
        SOUND: {soundOn ? 'ON' : 'OFF'} {audioUnlocked ? '' : '(tap Start to unlock)'}
      </button>

      {isCursed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950">
          <h1 className="text-7xl md:text-9xl font-black text-black animate-ping">別走!</h1>
        </div>
      )}

      {currentMessage && (
        <div className="fixed top-1/3 w-full text-center z-40">
          <span className="inline-block bg-black/80 text-red-500 font-serif text-2xl md:text-3xl px-6 py-4 border-l-4 border-red-800 animate-text-shiver shadow-[0_0_20px_rgba(255,0,0,0.5)]">
            👁️ {currentMessage}
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-300 tracking-[0.2em] font-serif opacity-80">
            蝕骨杏林
          </h1>
          <p className="mt-4 text-gray-600 text-sm tracking-widest">
            {timeLeft > 0 ? '連線不穩定...請勿離開' : '通道已開啟'}
          </p>
        </div>

        <div className="absolute top-8 right-8 font-mono text-red-900 text-xs md:text-sm animate-pulse">
          TIME_REMAINING: {String(timeLeft).padStart(3, '0')}
        </div>

        <div className="relative group">
          {isContractReady ? (
            <button
              onClick={handleContractSign}
              disabled={contractSigned}
              className={`
                relative px-12 py-4 bg-red-900 text-red-100 font-serif text-2xl tracking-widest border border-red-700
                shadow-[0_0_50px_rgba(150,0,0,0.5)] hover:bg-red-800 transition-all duration-500
                ${contractSigned ? 'animate-burn cursor-default' : 'animate-pulse'}
              `}
            >
              {contractSigned ? '契約燃燒中...' : '🩸 簽下生死狀'}
            </button>
          ) : (
            <button disabled className="px-10 py-4 bg-gray-900 text-gray-700 font-serif text-xl border border-gray-800 cursor-not-allowed">
              等待儀式完成...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
