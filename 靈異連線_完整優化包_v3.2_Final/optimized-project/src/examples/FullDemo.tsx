import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ToastProvider, useToast } from '../components/ToastProvider';
import { Button } from '../components/Button';
import { FearMeter } from '../components/FearMeter';
import { FlashlightCursor } from '../components/FlashlightCursor';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Tooltip } from '../components/Tooltip';
import { useFear } from '../hooks/useFear';
import { useAudioContext } from '../hooks/useAudioContext';
import { useJumpScareManager } from '../managers/JumpScareManager';
import { AmbientManager } from '../managers/AmbientManager';

/**
 * 完整的遊戲示範
 * 
 * 展示如何整合所有 UX/UI 組件、Hooks 和管理器
 * 這是一個可運行的完整範例
 */

// 主遊戲組件（包含所有功能）
function GameDemo() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);
  const { success, error, warning, info } = useToast();
  
  // 音頻管理
  const { 
    enableAudio, 
    isAudioEnabled, 
    isAudioSupported,
    playSound 
  } = useAudioContext();
  
  // 恐懼值管理
  const { 
    fearLevel, 
    increaseFear, 
    decreaseFear, 
    setFear,
    resetFear,
    isCriticalFear 
  } = useFear({
    initialFear: 0,
    onFearChange: (newFear) => {
      console.log('Fear level changed to:', newFear);
    },
    onFearThreshold: (threshold) => {
      if (threshold === 50) {
        warning(`恐懼值達到 ${threshold}%！`);
      } else if (threshold === 75) {
        error(`危險！恐懼值 ${threshold}%`);
      }
    }
  });

  // 驚嚇管理
  const { 
    triggerJumpScare, 
    canTriggerJumpScare,
    jumpScareCount 
  } = useJumpScareManager(fearLevel, {
    minCooldown: 15000,  // 15秒冷卻
    maxPerSession: 5,    // 最多5次
    fearThreshold: 20    // 需要20點恐懼值
  });

  // 開始遊戲
  const handleStartGame = async () => {
    setIsLoading(true);
    
    try {
      // 啟用音頻
      if (!isAudioEnabled && isAudioSupported) {
        const audioEnabled = await enableAudio();
        if (audioEnabled) {
          success('音效已啟用！');
        } else {
          warning('無法啟用音效，遊戲仍可繼續');
        }
      }
      
      // 模擬載入
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsGameStarted(true);
      setFlashlightEnabled(true);
      success('遊戲開始！');
      info('使用按鈕來改變恐懼值...');
      
    } catch (err) {
      error('啟動遊戲時發生錯誤');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 恐怖事件
  const handleScaryEvent = async () => {
    increaseFear(15);
    
    // 有機率觸發驚嚇
    if (canTriggerJumpScare && Math.random() > 0.6) {
      const success = await triggerJumpScare({
        intensity: fearLevel > 70 ? 'high' : 'medium',
        duration: 2000,
        visualEffect: true
      });
      
      if (success) {
        setTimeout(() => {
          warning('你被嚇到了！');
        }, 2500);
      }
    }
    
    // 播放音效
    if (isAudioEnabled) {
      playSound('/sounds/static_noise.mp3', { volume: 0.3 });
    }
  };

  // 冷靜事件
  const handleCalmEvent = () => {
    decreaseFear(10);
    success('你冷靜了一些...');
  };

  // 重置遊戲
  const handleReset = () => {
    resetFear();
    setIsGameStarted(false);
    setFlashlightEnabled(false);
    info('遊戲已重置');
  };

  // 環境事件回調
  const handleAmbientEvent = (eventType: string) => {
    console.log('環境事件:', eventType);
    // 可以在這裡添加視覺效果或增加恐懼值
    if (eventType === 'static') {
      increaseFear(2);
    }
  };

  return (
    <AmbientManager
      fearLevel={fearLevel}
      isActive={isGameStarted}
      onAmbientEvent={handleAmbientEvent}
    >
      {/* 手電筒效果 */}
      <FlashlightCursor fearLevel={fearLevel} enabled={flashlightEnabled} />
      
      <div className="min-h-screen bg-bg-deepest text-text-high p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* 標題 */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-horror-primary">
              靈異連線：完整示範
            </h1>
            <p className="text-lg text-text-medium">
              UX/UI 組件整合展示
            </p>
          </header>

          {/* 載入中 */}
          {isLoading && (
            <LoadingSpinner message="正在啟動遊戲..." fullScreen={true} />
          )}

          {!isGameStarted ? (
            /* 開始畫面 */
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="bg-bg-surface border-2 border-horror-primary rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold text-horror-primary mb-4">
                  準備開始
                </h2>
                <p className="text-text-medium mb-6">
                  這個示範展示了所有新增的 UX/UI 組件：
                </p>
                <ul className="text-text-medium space-y-2 mb-6 list-disc list-inside">
                  <li>恐懼值系統</li>
                  <li>音效管理</li>
                  <li>驚嚇效果</li>
                  <li>環境音效</li>
                  <li>手電筒視野</li>
                  <li>Toast 通知</li>
                </ul>
                
                {!isAudioSupported && (
                  <div className="bg-yellow-900/20 border border-horror-accent rounded p-3 mb-4">
                    <p className="text-horror-accent text-sm">
                      ⚠️ 您的瀏覽器不支援音效
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={handleStartGame}
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                >
                  開始體驗
                </Button>
              </div>
            </div>
          ) : (
            /* 遊戲畫面 */
            <div className="space-y-6">
              {/* 恐懼值顯示 */}
              <div className="bg-bg-surface border-2 border-horror-primary rounded-lg p-6">
                <h2 className="text-xl font-bold text-horror-primary mb-4">
                  恐懼值監控
                </h2>
                
                {/* 三種不同樣式的恐懼值顯示 */}
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-text-medium mb-2">條形樣式：</p>
                    <FearMeter 
                      fearLevel={fearLevel} 
                      variant="bar" 
                      showLabel={true}
                    />
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-sm text-text-medium mb-2">圓形樣式：</p>
                      <FearMeter 
                        fearLevel={fearLevel} 
                        variant="circle" 
                        showLabel={true}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-text-medium mb-2">最小化樣式：</p>
                      <FearMeter 
                        fearLevel={fearLevel} 
                        variant="minimal" 
                        showLabel={true}
                      />
                    </div>
                  </div>
                </div>

                {isCriticalFear && (
                  <div className="mt-4 bg-horror-secondary/20 border-2 border-horror-secondary rounded p-4 animate-pulse">
                    <p className="text-horror-secondary font-bold text-center">
                      ⚠️ 極度恐懼狀態！
                    </p>
                  </div>
                )}
              </div>

              {/* 控制面板 */}
              <div className="bg-bg-surface border-2 border-horror-primary rounded-lg p-6">
                <h2 className="text-xl font-bold text-horror-primary mb-4">
                  遊戲控制
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Tooltip text="增加 15 點恐懼值，可能觸發驚嚇" position="top">
                    <Button 
                      onClick={handleScaryEvent}
                      variant="danger"
                      fullWidth
                    >
                      觸發恐怖事件 👻
                    </Button>
                  </Tooltip>
                  
                  <Tooltip text="減少 10 點恐懼值" position="top">
                    <Button 
                      onClick={handleCalmEvent}
                      variant="secondary"
                      fullWidth
                    >
                      冷靜下來 🧘
                    </Button>
                  </Tooltip>
                  
                  <Tooltip text="切換手電筒效果" position="bottom">
                    <Button 
                      onClick={() => setFlashlightEnabled(!flashlightEnabled)}
                      variant="secondary"
                      fullWidth
                    >
                      {flashlightEnabled ? '關閉' : '開啟'}手電筒 🔦
                    </Button>
                  </Tooltip>
                  
                  <Tooltip text="重新開始遊戲" position="bottom">
                    <Button 
                      onClick={handleReset}
                      variant="primary"
                      fullWidth
                    >
                      重置遊戲 🔄
                    </Button>
                  </Tooltip>
                </div>
              </div>

              {/* 狀態資訊 */}
              <div className="bg-bg-surface border-2 border-horror-primary rounded-lg p-6">
                <h2 className="text-xl font-bold text-horror-primary mb-4">
                  系統狀態
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-bg-deep rounded p-3">
                    <p className="text-text-low mb-1">恐懼值</p>
                    <p className="text-horror-primary font-bold text-xl">
                      {fearLevel}
                    </p>
                  </div>
                  
                  <div className="bg-bg-deep rounded p-3">
                    <p className="text-text-low mb-1">驚嚇次數</p>
                    <p className="text-horror-primary font-bold text-xl">
                      {jumpScareCount} / 5
                    </p>
                  </div>
                  
                  <div className="bg-bg-deep rounded p-3">
                    <p className="text-text-low mb-1">音效</p>
                    <p className={`font-bold text-xl ${isAudioEnabled ? 'text-green-500' : 'text-gray-500'}`}>
                      {isAudioEnabled ? '✓ 啟用' : '✗ 關閉'}
                    </p>
                  </div>
                  
                  <div className="bg-bg-deep rounded p-3">
                    <p className="text-text-low mb-1">手電筒</p>
                    <p className={`font-bold text-xl ${flashlightEnabled ? 'text-horror-accent' : 'text-gray-500'}`}>
                      {flashlightEnabled ? '✓ 開啟' : '✗ 關閉'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 說明 */}
              <div className="bg-bg-surface border border-horror-primary rounded-lg p-4">
                <p className="text-text-medium text-sm">
                  <strong className="text-horror-primary">提示：</strong> 
                  點擊「觸發恐怖事件」來增加恐懼值。當恐懼值夠高時，可能會觸發驚嚇效果。
                  環境管理器會根據恐懼值自動調整背景音效和隨機事件的頻率。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AmbientManager>
  );
}

// 應用程式根組件（包含 Provider）
function FullDemo() {
  return (
    <ErrorBoundary>
      <ToastProvider maxToasts={5}>
        <GameDemo />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default FullDemo;
