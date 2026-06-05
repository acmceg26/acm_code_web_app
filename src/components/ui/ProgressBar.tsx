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
            className="text-slate-800"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className="text-indigo-500 transition-all duration-500 ease-out"
            stroke="url(#progress-gradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" /> {/* indigo-400 */}
              <stop offset="100%" stopColor="#ec4899" /> {/* pink-500 */}
            </linearGradient>
          </defs>
        </svg>
        {showText && (
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-100 font-mono leading-none">{cleanProgress}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Complete</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
          <span className="text-sm font-bold text-slate-200 font-mono">{cleanProgress}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${cleanProgress}%` }}
        />
      </div>
    </div>
  );
};
