import React from 'react';
import { useTracker } from '../hooks/useTracker';
import { DashboardStats } from '../components/features/DashboardStats';
import { ActivityLog } from '../components/features/ActivityLog';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Sparkles, Calendar, BookOpen } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { metrics } = useTracker();

  // Get current date string for greeting banner
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getEncouragement = (percent: number) => {
    if (percent === 0) return 'Select a track in DSA Sheets and solve your first question!';
    if (percent < 20) return 'Great start! Keep solving to build your placement momentum!';
    if (percent < 50) return 'Halfway there! You are doing amazing, stay consistent!';
    if (percent < 80) return 'Almost ready! Product companies are waiting for you!';
    return 'Outstanding! You are interview-ready, keep polishing!';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome & Progress Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Welcome Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-indigo-500/5 blur-3xl" />
          
          <div className="space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Placement Prep Season 2026
            </span>
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              {getGreeting()}, Future Engineer!
            </h2>
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
              {getEncouragement(metrics.percentCompleted)}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-slate-800/60 relative z-10 text-xs text-slate-450 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>{metrics.totalProblemsCount} Curated Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span>Session History Active</span>
            </div>
          </div>
        </div>

        {/* Circular Overall Progress Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center bg-slate-900/50">
          <ProgressBar 
            progress={metrics.percentCompleted} 
            variant="circle" 
            size={140} 
            strokeWidth={12} 
          />
        </div>
      </div>

      {/* Stats and Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left Column: Difficulty stats & Topic graph */}
        <div className="lg:col-span-2">
          <DashboardStats />
        </div>

        {/* Right Column: Recent solve timeline */}
        <div className="lg:col-span-1 h-full">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};
