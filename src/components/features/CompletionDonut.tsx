import React from 'react';
import { useTracker } from '../../hooks/useTracker';

const SIZE = 150;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

// Color guide: easy = green, medium = yellow, hard = red
const COLORS = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
} as const;

export const CompletionDonut: React.FC = () => {
  const { metrics } = useTracker();

  const total = metrics.totalProblemsCount;

  const segments = [
    { key: 'easy', label: 'Easy', color: COLORS.easy, solved: metrics.easySolved, count: metrics.easyTotal },
    { key: 'medium', label: 'Medium', color: COLORS.medium, solved: metrics.mediumSolved, count: metrics.mediumTotal },
    { key: 'hard', label: 'Hard', color: COLORS.hard, solved: metrics.hardSolved, count: metrics.hardTotal },
  ];

  // Each arc's length is proportional to that difficulty's *solved* count out of
  // all problems, so the coloured portion of the ring equals overall completion.
  let cumulativeFraction = 0;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE}>
          {/* Track (unsolved remainder) */}
          <circle
            className="text-zinc-800"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={STROKE}
            r={RADIUS}
            cx={CENTER}
            cy={CENTER}
          />
          {/* Coloured arcs by difficulty */}
          {segments.map((seg) => {
            const fraction = total > 0 ? seg.solved / total : 0;
            const dash = fraction * CIRCUMFERENCE;
            const rotation = -90 + cumulativeFraction * 360;
            cumulativeFraction += fraction;

            if (dash <= 0) return null;

            return (
              <circle
                key={seg.key}
                stroke={seg.color}
                fill="transparent"
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeLinecap="butt"
                r={RADIUS}
                cx={CENTER}
                cy={CENTER}
                transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-zinc-100 font-mono leading-none">
            {metrics.percentCompleted}%
          </span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mt-1">
            Complete
          </span>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div className="w-full mt-6 space-y-2">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </span>
            <span className="font-mono text-zinc-300">
              {seg.solved}
              <span className="text-zinc-500"> / {seg.count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
