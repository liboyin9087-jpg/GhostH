import React, { useState } from 'react';
import CRTOverlay from './components/CRTOverlay';
import TalismanGenerator from './components/TalismanGenerator';
import CursedButton from './components/CursedButton';
import { useSoulBinding } from './hooks/useSoulBinding';

/**
 * 募資頁面範例 - 完整整合版
 * 
 * 整合功能：
 * 1. 333 秒靈魂契約倒數計時
 * 2. AI 鬼魂導遊系統
 * 3. 分頁切換懲罰機制
 * 4. 動態 CRT 雜訊效果
 * 5. 符咒生成器
 * 6. 詛咒按鈕效果
 */

const LandingPage: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [showTalisman, setShowTalisman] = useState(false);
  
  const { 
    timeLeft, 
    formattedTime,
    isCursed, 
    currentMessage, 
    messageIntensity,
    glitchIntensity, 
    isContractReady,
    resetTimer,
  } = useSoulBinding({
    startTime: 333,
    onCursed: () => {
      // 可以在這裡觸發音效或其他效果
      console.log('玩家被詛咒了！');
    },
    onContractReady: () => {
      console.log('契約已就緒！');
    }
  });

  const handleContractSign = () => {
    if (!isContractReady) return;
    
    // 顯示符咒生成器
    setShowTalisman(true);
    
    // 這裡可以接入實際的募資流程
    // 例如：導向募資平台、開啟付款視窗等
    console.log('契約已簽訂！玩家:', playerName || '匿名倖存者');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  // 根據訊息強度決定樣式
  const getMessageStyle = () => {
    switch (messageIntensity) {
      case 'high':
        return 'text-red-600 text-3xl animate-pulse';
      case 'medium':
        return 'text-orange-500 text-2xl';
      default:
        return 'text-yellow-500 text-xl';
    }
  };

  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-black ${isCursed ? 'animate-pulse' : ''}`}>
      
      {/* 背景雜訊層 - 強度隨 Hook 改變 */}
      <CRTOverlay intensity={glitchIntensity * 100} />

      {/* 👻 AI 鬼魂導遊對話框 */}
      {currentMessage && (
        <div className="fixed top-1/4 left-0 right-0 text-center z-50 pointer-events-none px-4">
          <div className={`${getMessageStyle()} font-serif bg-black/80 inline-block px-6 py-3 border-2 border-current rounded animate-fade-in`}>
            <p className="font-mono text-xs text-gray-400 mb-1">SYSTEM_MSG</p>
            <p>{currentMessage}</p>
          </div>
        </div>
      )}

      {/* 主內容區 */}
      <div className="flex flex-col items-center justify-center min-h-screen z-10 relative px-4 py-20">
        
        {/* 標題 */}
        <h1 className="text-4xl md:text-6xl text-gray-200 font-bold mb-4 text-center">
          靈異連線：蝕骨杏林
        </h1>
        <p className="text-gray-400 text-sm md:text-base mb-8 text-center max-w-2xl">
          台灣首款 Meta Horror 恐怖遊戲 | 當你接起錯誤的電話，就成為醫院詛咒的一部分
        </p>

        {/* 🕒 倒數計時器 */}
        {!isContractReady && (
          <div className="mb-8">
            <div className="text-red-900 font-mono text-sm mb-2 text-center">
              CONNECTION_STABLE
            </div>
            <div className="text-5xl font-mono text-gray-300 tracking-wider">
              {formattedTime}
            </div>
            <div className="text-gray-500 text-xs mt-2 text-center">
              *請勿切換分頁，否則時間將重置
            </div>
          </div>
        )}

        {/* 名字輸入欄 */}
        {!showTalisman && (
          <div className="mb-8 w-full max-w-md">
            <label className="block text-gray-400 text-sm mb-2 font-mono">
              輸入你的名字（將印在符咒上）
            </label>
            <input
              type="text"
              value={playerName}
              onChange={handleNameChange}
              placeholder="例：小雅"
              maxLength={10}
              className="w-full bg-stone-900 border border-stone-700 rounded px-4 py-2 text-gray-200 focus:outline-none focus:border-green-500 font-mono"
            />
          </div>
        )}

        {/* 📝 契約按鈕 */}
        <div className="mb-12">
          {isContractReady ? (
            // 狀態 A: 存活後，變成契約模式
            <CursedButton
              onClick={handleContractSign}
              className="px-12 py-6 bg-red-900 text-white font-serif text-2xl border-4 border-double border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.6)]"
            >
              🩸 簽下生死狀
            </CursedButton>
          ) : (
            // 狀態 B: 一般模式 (尚未解鎖)
            <button 
              className="px-8 py-3 bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700 rounded"
              disabled
            >
              等待連線穩定... ({timeLeft}s)
            </button>
          )}
        </div>

        {/* 符咒生成器 */}
        {showTalisman && (
          <div className="animate-fade-in">
            <h2 className="text-2xl text-gray-200 font-bold mb-6 text-center">
              🔮 你的護身符
            </h2>
            <TalismanGenerator
              playerName={playerName || '倖存者'}
              fearLevel={Math.floor((1 - timeLeft / 333) * 100)}
              survivalTime={333 - timeLeft}
            />
            
            {/* 重新開始按鈕 */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setShowTalisman(false);
                  resetTimer();
                }}
                className="text-gray-500 hover:text-gray-300 underline text-sm"
              >
                重新開始倒數
              </button>
            </div>
          </div>
        )}

        {/* 說明文字 */}
        {!showTalisman && (
          <div className="mt-12 max-w-2xl text-gray-400 text-sm space-y-4">
            <p className="text-center">
              ⚠️ 這不是普通的募資頁面
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
              <li>保持視窗開啟 333 秒，解鎖「契約模式」</li>
              <li>AI 會在過程中與你對話，請仔細聆聽</li>
              <li>切換分頁將觸發懲罰機制（時間重置）</li>
              <li>成功存活後，可下載專屬符咒分享到社群</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* 懲罰時的全螢幕覆蓋 */}
      {isCursed && (
        <div className="fixed inset-0 bg-red-600 mix-blend-multiply z-[100] flex items-center justify-center animate-pulse">
          <h1 className="text-6xl md:text-9xl font-black text-black">別走!</h1>
        </div>
      )}

      {/* CSS 動畫定義 */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
