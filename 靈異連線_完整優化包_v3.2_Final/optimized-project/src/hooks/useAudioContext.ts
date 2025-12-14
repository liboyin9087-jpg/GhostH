import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useAudioContext - Web Audio API 輔助 Hook
 * 
 * 提供音頻上下文管理，確保音頻在瀏覽器中正確初始化和播放
 * 處理自動播放限制，需要用戶互動才能啟用音頻
 * 
 * ⚠️ 注意：此 Hook 不包含任何二進制音頻文件
 * 音頻文件應放置在 public/sounds/ 目錄下
 * 
 * 使用方式：
 * const { audioContext, isAudioEnabled, enableAudio, playSound } = useAudioContext();
 * 
 * // 在用戶互動後啟用音頻
 * <button onClick={enableAudio}>啟用音效</button>
 */

export interface AudioContextState {
  audioContext: AudioContext | null;
  isAudioEnabled: boolean;
  isAudioSupported: boolean;
  enableAudio: () => Promise<boolean>;
  playSound: (audioPath: string, options?: PlaySoundOptions) => Promise<void>;
  stopAllSounds: () => void;
}

interface PlaySoundOptions {
  volume?: number; // 0-1
  loop?: boolean;
  fadeIn?: number; // 淡入時間（毫秒）
}

/**
 * useAudioContext Hook
 * 
 * @returns AudioContext 管理對象
 */
export const useAudioContext = (): AudioContextState => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isAudioSupported, setIsAudioSupported] = useState(true);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  useEffect(() => {
    // 檢查瀏覽器是否支援 Web Audio API
    if (typeof window !== 'undefined' && !('AudioContext' in window || 'webkitAudioContext' in window)) {
      console.warn('Web Audio API is not supported in this browser');
      setIsAudioSupported(false);
    }

    return () => {
      // 清理：關閉音頻上下文
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  /**
   * 啟用音頻上下文
   * 必須在用戶互動（如點擊）後調用
   */
  const enableAudio = useCallback(async (): Promise<boolean> => {
    if (!isAudioSupported) {
      console.warn('Audio is not supported');
      return false;
    }

    try {
      // 創建或恢復音頻上下文
      if (!audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        setAudioContext(ctx);
        setIsAudioEnabled(true);
        console.log('AudioContext created and enabled');
        return true;
      } else if (audioContext.state === 'suspended') {
        await audioContext.resume();
        setIsAudioEnabled(true);
        console.log('AudioContext resumed');
        return true;
      }

      return true;
    } catch (error) {
      console.error('Failed to enable audio:', error);
      setIsAudioEnabled(false);
      return false;
    }
  }, [audioContext, isAudioSupported]);

  /**
   * 播放音效
   * 
   * @param audioPath - 音頻文件路徑（相對於 public/ 目錄）
   * @param options - 播放選項
   * 
   * 範例：
   * playSound('/sounds/hospital_hum.mp3', { volume: 0.5, loop: true });
   */
  const playSound = useCallback(async (
    audioPath: string,
    options: PlaySoundOptions = {}
  ): Promise<void> => {
    if (!audioContext || !isAudioEnabled) {
      console.warn('AudioContext is not enabled. Please call enableAudio() first.');
      return;
    }

    const { volume = 1, loop = false, fadeIn = 0 } = options;

    try {
      // 加載音頻文件
      const response = await fetch(audioPath);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 創建音源和增益節點
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();

      source.buffer = audioBuffer;
      source.loop = loop;

      // 設置音量（可選淡入效果）
      if (fadeIn > 0) {
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + fadeIn / 1000);
      } else {
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      }

      // 連接音頻節點
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 播放
      source.start(0);

      // 追蹤活動音源
      activeSourcesRef.current.push(source);

      // 清理已結束的音源
      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
      };

      console.log(`Playing sound: ${audioPath}`);
    } catch (error) {
      console.error(`Failed to play sound: ${audioPath}`, error);
    }
  }, [audioContext, isAudioEnabled]);

  /**
   * 停止所有正在播放的音效
   */
  const stopAllSounds = useCallback(() => {
    activeSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (error) {
        // 忽略已停止的音源
      }
    });
    activeSourcesRef.current = [];
    console.log('All sounds stopped');
  }, []);

  return {
    audioContext,
    isAudioEnabled,
    isAudioSupported,
    enableAudio,
    playSound,
    stopAllSounds
  };
};

export default useAudioContext;
