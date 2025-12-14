import React from 'react';

/**
 * FearMeter - 恐懼值顯示組件
 * 
 * 視覺化顯示玩家當前的恐懼程度
 * 恐懼值會影響遊戲體驗，如視野、音效等
 * 
 * @param fearLevel - 當前恐懼值 (0-100)
 * @param maxFear - 最大恐懼值 (預設 100)
 * @param showLabel - 是否顯示文字標籤
 * @param variant - 顯示樣式 (bar, circle, minimal)
 */

interface FearMeterProps {
  fearLevel: number;
  maxFear?: number;
  showLabel?: boolean;
  variant?: 'bar' | 'circle' | 'minimal';
}

export const FearMeter: React.FC<FearMeterProps> = ({
  fearLevel,
  maxFear = 100,
  showLabel = true,
  variant = 'bar'
}) => {
  // 確保恐懼值在合理範圍內
  const normalizedFear = Math.max(0, Math.min(fearLevel, maxFear));
  const percentage = (normalizedFear / maxFear) * 100;

  // 根據恐懼值決定顏色
  const getColorClass = () => {
    if (percentage < 30) return 'bg-green-500';
    if (percentage < 60) return 'bg-horror-accent';
    if (percentage < 85) return 'bg-orange-500';
    return 'bg-horror-secondary';
  };

  const getTextColorClass = () => {
    if (percentage < 30) return 'text-green-500';
    if (percentage < 60) return 'text-horror-accent';
    if (percentage < 85) return 'text-orange-500';
    return 'text-horror-secondary';
  };

  // 條形樣式
  if (variant === 'bar') {
    return (
      <div className="w-full max-w-xs" role="meter" aria-valuenow={normalizedFear} aria-valuemin={0} aria-valuemax={maxFear} aria-label="恐懼值">
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-medium text-sm font-medium">恐懼值</span>
            <span className={`text-sm font-bold ${getTextColorClass()}`}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div className="w-full h-4 bg-bg-deep border-2 border-horror-primary rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full ${getColorClass()} transition-all duration-500 ease-out rounded-full shadow-horror-glow`}
            style={{ width: `${percentage}%` }}
          >
            <div className="w-full h-full animate-pulse opacity-50 bg-white/20" />
          </div>
        </div>
        {percentage > 80 && (
          <p className="text-xs text-horror-secondary text-center mt-1 animate-pulse">
            極度恐懼！
          </p>
        )}
      </div>
    );
  }

  // 圓形樣式
  if (variant === 'circle') {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center" role="meter" aria-valuenow={normalizedFear} aria-valuemin={0} aria-valuemax={maxFear} aria-label="恐懼值">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            {/* 背景圓 */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-bg-deep"
            />
            {/* 進度圓 */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${getTextColorClass()} transition-all duration-500 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getTextColorClass()}`}>
              {Math.round(percentage)}
            </span>
          </div>
        </div>
        {showLabel && (
          <span className="text-text-medium text-sm mt-2">恐懼值</span>
        )}
      </div>
    );
  }

  // 最小化樣式
  return (
    <div className="inline-flex items-center gap-2" role="meter" aria-valuenow={normalizedFear} aria-valuemin={0} aria-valuemax={maxFear} aria-label="恐懼值">
      <div className="w-32 h-2 bg-bg-deep border border-horror-primary rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColorClass()} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${getTextColorClass()}`}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default FearMeter;
