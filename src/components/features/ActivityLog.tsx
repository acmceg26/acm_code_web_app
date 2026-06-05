import React, { useState, useEffect } from 'react';
import { useTracker } from '../../hooks/useTracker';
import { CheckCircle2, Calendar } from 'lucide-react';

export const ActivityLog: React.FC = () => {
  const { solvedProblems } = useTracker();
  const [timeUpdater, setTimeUpdater] = useState(0);

  // Trigger re-render every 30 seconds to update relative times
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdater(t => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (timestamp: number) => {
    // Reference the timeUpdater state to ensure refresh on update
    const diff = Date.now() - timestamp;
    const secs = Math.floor(diff / 1000);
    
    if (secs < 10) return 'just now';
    if (secs < 60) return `${secs}s ago`;
    
    const mins = Math.floor(secs / 65);
    if (mins < 60) return `${mins}m ago`;
    
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const styles: Record<string, string> = {
      Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };
    return (
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${styles[difficulty] || styles.Easy}`}>
        {difficulty}
      </span>
    );
  };

  const recentSolved = solvedProblems.slice(0, 5);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col h-full">
      <div className="hidden">{timeUpdater}</div>
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse-ring rounded-full" />
        <h3 className="font-bold text-slate-200 text-base">Recently Solved</h3>
      </div>

      {recentSolved.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-10 text-center text-slate-500">
          <Calendar className="w-10 h-10 text-slate-750 mb-3" />
          <p className="text-sm font-medium">No recent activity</p>
          <p className="text-xs text-slate-600 mt-1 max-w-[200px]">Problems you complete will appear here in real-time.</p>
        </div>
      ) : (
        <div className="flex-grow space-y-4">
          {recentSolved.map((item) => (
            <div 
              key={`${item.problemId}-${item.solvedAtTimestamp}`}
              className="relative pl-6 pb-2 border-l border-slate-805 last:border-0 last:pb-0 group"
            >
              {/* Timeline dot */}
              <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-900 group-hover:bg-indigo-500 group-hover:border-indigo-500/50 transition-colors duration-250" />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-slate-205 text-sm truncate hover:text-slate-100 transition-colors">
                      {item.title}
                    </h4>
                    {getDifficultyBadge(item.difficulty)}
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {item.topic}
                  </span>
                </div>
                
                <div className="shrink-0 flex items-center gap-2 text-right">
                  <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tight bg-slate-950/40 px-2 py-1 rounded-md border border-slate-850">
                    {getRelativeTime(item.solvedAtTimestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
