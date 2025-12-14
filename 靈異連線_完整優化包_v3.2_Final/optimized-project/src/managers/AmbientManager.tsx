import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useAudioContext } from '../hooks/useAudioContext';

/**
 * AmbientManager - 環境氛圍管理器
 * 
 * 管理背景音效、隨機事件和動態氛圍效果
 * 根據恐懼值和時間動態調整環境
 * 
 * 功能：
 * - 循環播放背景環境音（醫院嗡嗡聲）
 * - 隨機觸發環境事件（腳步聲、門響等）
 * - 根據恐懼值調整音效強度
 * - 時間系統（越晚越恐怖）
 * 
 * 使用方式：
 * <AmbientManager fearLevel={fearLevel} isActive={isGameActive} />
 */

interface AmbientManagerProps {
  fearLevel: number; // 0-100
  isActive: boolean; // 是否啟用環境管理器
  onAmbientEvent?: (eventType: string) => void; // 環境事件回調
  children?: React.ReactNode;
}

interface AmbientEvent {
  type: 'footsteps' | 'door_creak' | 'whisper' | 'static' | 'wind';
  sound?: string;
  probability: number; // 基礎觸發機率
}

const ambientEvents: AmbientEvent[] = [
  { type: 'footsteps', probability: 0.1 },
  { type: 'door_creak', probability: 0.08 },
  { type: 'whisper', probability: 0.05 },
  { type: 'static', sound: '/sounds/static_noise.mp3', probability: 0.15 },
  { type: 'wind', probability: 0.12 }
];

export const AmbientManager: React.FC<AmbientManagerProps> = ({
  fearLevel,
  isActive,
  onAmbientEvent,
  children
}) => {
  const { playSound, isAudioEnabled } = useAudioContext();
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const eventTimerRef = useRef<number | null>(null);
  const ambientSoundRef = useRef<boolean>(false);

  /**
   * 開始播放環境音
   */
  const startAmbientSound = useCallback(async () => {
    if (!isAudioEnabled || ambientSoundRef.current) return;

    try {
      // 播放循環背景音（醫院嗡嗡聲）
      await playSound('/sounds/hospital_hum.mp3', {
        volume: 0.3,
        loop: true,
        fadeIn: 2000
      });
      
      ambientSoundRef.current = true;
      setIsAmbientPlaying(true);
      console.log('Ambient sound started');
    } catch (error) {
      console.error('Failed to start ambient sound:', error);
    }
  }, [isAudioEnabled, playSound]);

  /**
   * 觸發隨機環境事件
   */
  const triggerRandomEvent = useCallback(() => {
    if (!isActive || !isAudioEnabled) return;

    // 恐懼值越高，事件觸發機率越高
    const fearMultiplier = 1 + (fearLevel / 100) * 2; // 1x 到 3x

    ambientEvents.forEach(event => {
      const adjustedProbability = event.probability * fearMultiplier;
      
      if (Math.random() < adjustedProbability) {
        console.log(`Ambient event triggered: ${event.type}`);
        
        // 觸發事件回調
        if (onAmbientEvent) {
          onAmbientEvent(event.type);
        }

        // 播放音效（如果有指定）
        if (event.sound) {
          playSound(event.sound, {
            volume: 0.4 + (fearLevel / 100) * 0.3 // 音量隨恐懼值增加
          });
        }
      }
    });
  }, [fearLevel, isActive, isAudioEnabled, playSound, onAmbientEvent]);

  /**
   * 設置事件計時器
   */
  const setupEventTimer = useCallback(() => {
    if (eventTimerRef.current) {
      clearInterval(eventTimerRef.current);
    }

    if (!isActive) return;

    // 根據恐懼值調整事件間隔
    // 恐懼值越高，事件越頻繁
    const baseInterval = 15000; // 15秒
    const interval = Math.max(5000, baseInterval - (fearLevel * 100)); // 最短5秒

    eventTimerRef.current = window.setInterval(() => {
      triggerRandomEvent();
    }, interval);
  }, [isActive, fearLevel, triggerRandomEvent]);

  // 當啟用狀態改變時，管理環境音
  useEffect(() => {
    if (isActive && isAudioEnabled) {
      startAmbientSound();
      setupEventTimer();
    } else {
      if (eventTimerRef.current) {
        clearInterval(eventTimerRef.current);
      }
      ambientSoundRef.current = false;
      setIsAmbientPlaying(false);
    }

    return () => {
      if (eventTimerRef.current) {
        clearInterval(eventTimerRef.current);
      }
    };
  }, [isActive, isAudioEnabled, startAmbientSound, setupEventTimer]);

  // 當恐懼值改變時，調整事件頻率
  useEffect(() => {
    if (isActive) {
      setupEventTimer();
    }
  }, [fearLevel, isActive, setupEventTimer]);

  return (
    <>
      {children}
      {/* 可選：顯示環境狀態指示器 */}
      {isActive && isAmbientPlaying && (
        <div className="fixed bottom-4 left-4 z-10 opacity-50 hover:opacity-100 transition-opacity">
          <div className="bg-bg-deep border border-horror-primary rounded-full px-3 py-1 text-xs text-text-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-horror-primary rounded-full animate-pulse" />
            <span>環境音效運行中</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AmbientManager;
