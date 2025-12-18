import React, { useEffect, useState, useRef } from 'react';
import { Eye, Activity } from 'lucide-react';

interface FocusTrapProps {
  onFearIncrease: (amount: number) => void;
}

/**
 * 防逃跑機制 (Focus Trap)
 * 當玩家切換分頁後再回來時，觸發驚嚇效果
 * 這是 Meta Horror 的核心設計，打破第四面牆
 */
const FocusTrap: React.FC<FocusTrapProps> = ({ onFearIncrease }) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasTriggeredOnce = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // 當使用者「切換回來」網頁 (visible) 且之前沒在看 (hidden)
      if (document.visibilityState === 'visible' && document.hidden === false) {
        // 只在用戶已經與頁面互動過後才觸發（避免首次載入就驚嚇）
        if (hasTriggeredOnce.current) {
          triggerScare();
        }
      }
    };

    // 記錄用戶已經與頁面互動
    const markInteracted = () => {
      hasTriggeredOnce.current = true;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', markInteracted, { once: true });
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', markInteracted);
    };
  }, []);

  const triggerScare = () => {
    // 1. 啟動視覺驚嚇
    setIsTriggered(true);
    
    // 2. 啟動聽覺驚嚇 (合成刺耳噪音)
    playScreech();

    // 3. 增加恐懼值
    onFearIncrease(10);

    // 4. 0.8秒後自動消失
    setTimeout(() => {
      setIsTriggered(false);
    }, 800);
  };

  const playScreech = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // 設定極不和諧的頻率 (類似指甲刮黑板)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

      // 音量控制 (瞬間大聲後消失)
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error("Audio blocked by browser policy", e);
    }
  };

  if (!isTriggered) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-red-950 flex flex-col items-center justify-center animate-pulse cursor-none">
      {/* 驚嚇文字 */}
      <div className="relative">
        <h1 className="text-6xl md:text-9xl font-black text-red-500 tracking-tighter scale-150 animate-bounce">
          別移開視線
        </h1>
        <h1 className="absolute top-1 left-1 text-6xl md:text-9xl font-black text-black tracking-tighter scale-150 opacity-50 blur-sm">
          別移開視線
        </h1>
      </div>
      
      <div className="mt-8 flex items-center gap-4 text-red-400 font-mono text-xl">
        <Eye className="animate-ping" />
        <span>I SEE YOU</span>
        <Activity className="animate-spin" />
      </div>

      {/* 隨機散落的背景文字 */}
      <div className="absolute top-10 left-10 text-red-900 font-black opacity-20 text-4xl rotate-12">
        逃不掉
      </div>
      <div className="absolute bottom-20 right-20 text-red-900 font-black opacity-20 text-5xl -rotate-6">
        我在看
      </div>
    </div>
  );
};

export default FocusTrap;
