import React from 'react';
import { useTracker } from '../hooks/useTracker';
import { DashboardStats } from '../components/features/DashboardStats';
import { ActivityLog } from '../components/features/ActivityLog';
import { CompletionDonut } from '../components/features/CompletionDonut';
import { Calendar, BookOpen } from 'lucide-react';

interface DashboardProps {
  userName?: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ userName }) => {
  const { metrics } = useTracker();

  // Get current date string for greeting banner
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getEncouragement = (percent: number) => {
    if (percent === 0) return 'Pick a sheet and check off your first problem.';
    if (percent < 20) return 'A few done. Keep a steady pace.';
    if (percent < 50) return "You're making progress through the sheets.";
    if (percent < 80) return 'More than halfway through your problems.';
    return 'Almost through the full set.';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome & Progress Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Welcome Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-500">Placement preparation</span>
            <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">
              {getGreeting()}{userName ? `, ${userName}` : ''}
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">
              {getEncouragement(metrics.percentCompleted)}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-500" />
              <span>{metrics.totalProblemsCount} questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span>Progress saved</span>
            </div>
          </div>
        </div>

        {/* Completion donut, broken down by difficulty */}
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center">
          <CompletionDonut />
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
