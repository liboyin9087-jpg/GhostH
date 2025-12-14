import { useRef, useCallback } from 'react';

/**
 * 音效管理 Hook
 * 使用 Web Audio API 生成程序化音效
 * 不需要外部音效檔案，立即可用
 */
export const useSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 初始化 AudioContext（需要用戶互動後才能啟動）
  const initAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // 1. 訊息提示音（刺耳的「嗶」聲）
  const playMessageBeep = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = 1200; // 高頻
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio playback blocked", e);
    }
  }, [initAudioContext]);

  // 2. 金屬摩擦聲（恐懼值達 70+ 時）
  const playMetalScreech = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);

      filter.type = 'highpass';
      filter.frequency.value = 500;

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio playback blocked", e);
    }
  }, [initAudioContext]);

  // 3. 尖銳爆破音（儀式失敗時）
  const playExplosion = useCallback(() => {
    try {
      const ctx = initAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio playback blocked", e);
    }
  }, [initAudioContext]);

  // 4. 心跳聲（環境音）
  const playHeartbeat = useCallback(() => {
    try {
      const ctx = initAudioContext();
      
      // 雙跳節奏
      const playBeat = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.value = 60; // 極低頻

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

        osc.start(time);
        osc.stop(time + 0.1);
      };

      const now = ctx.currentTime;
      playBeat(now);
      playBeat(now + 0.15);
    } catch (e) {
      console.warn("Audio playback blocked", e);
    }
  }, [initAudioContext]);

  // 5. 白噪音（斷線時）
  const playWhiteNoise = useCallback((duration: number = 1) => {
    try {
      const ctx = initAudioContext();
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // 生成白噪音
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      const gain = ctx.createGain();

      source.buffer = buffer;
      source.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      source.start();
      source.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback blocked", e);
    }
  }, [initAudioContext]);

  // 6. 環境底噪（持續播放）
  const startAmbientDrone = useCallback(() => {
    try {
      const ctx = initAudioContext();
      
      // 低頻嗡嗡聲
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = 40; // 極低頻，會產生壓迫感

      gain.gain.value = 0.05; // 很低的音量

      osc.start();
      
      // 返回停止函數
      return () => {
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        osc.stop(ctx.currentTime + 1);
      };
    } catch (e) {
      console.warn("Audio playback blocked", e);
      return () => {};
    }
  }, [initAudioContext]);

  return {
    initAudioContext,
    playMessageBeep,
    playMetalScreech,
    playExplosion,
    playHeartbeat,
    playWhiteNoise,
    startAmbientDrone,
  };
};
