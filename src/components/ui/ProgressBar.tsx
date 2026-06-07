import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  variant?: 'line' | 'circle';
  size?: number; // size in pixels for circle
  strokeWidth?: number; // stroke weight for circle
  className?: string;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'line',
  size = 120,
  strokeWidth = 10,
  className = '',
  showText = true,
}) => {
  // Ensure progress is bounded
  const cleanProgress = Math.max(0, Math.min(100, progress));

  if (variant === 'circle') {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (cleanProgress / 100) * circumference;

    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            className="text-zinc-800"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className="text-blue-500 transition-all duration-500 ease-out"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {showText && (
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-zinc-100 font-mono leading-none">{cleanProgress}%</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mt-1">Complete</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Progress</span>
          <span className="text-sm font-bold text-zinc-200 font-mono">{cleanProgress}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${cleanProgress}%` }}
        />
      </div>
    </div>
  );
};
