import React from 'react';
import { useTracker } from '../../hooks/useTracker';
import { Award, Zap, Flame, BarChart2 } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const { metrics } = useTracker();

  const difficultyStats = [
    {
      name: 'Easy Problems',
      solved: metrics.easySolved,
      total: metrics.easyTotal,
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
      barColor: 'from-emerald-500 to-teal-500',
      icon: Zap,
    },
    {
      name: 'Medium Problems',
      solved: metrics.mediumSolved,
      total: metrics.mediumTotal,
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      textColor: 'text-amber-400',
      barColor: 'from-amber-500 to-orange-500',
      icon: Flame,
    },
    {
      name: 'Hard Problems',
      solved: metrics.hardSolved,
      total: metrics.hardTotal,
      color: 'rose',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      textColor: 'text-rose-400',
      barColor: 'from-rose-500 to-red-500',
      icon: Award,
    },
  ];

  // Prepare topic distribution array
  const topics = Object.keys(metrics.totalByTopic).map((topicName) => {
    const solved = metrics.solvedByTopic[topicName] || 0;
    const total = metrics.totalByTopic[topicName];
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
    return { name: topicName, solved, total, percentage };
  }).sort((a, b) => b.percentage - a.percentage); // Sort by highest completion first

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {difficultyStats.map((stat) => {
          const Icon = stat.icon;
          const percentage = stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0;

          return (
            <div 
              key={stat.name}
              className={`glass-panel p-5 rounded-2xl border ${stat.borderColor} flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-500/[0.01] transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400">{stat.name}</span>
                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-3xl font-extrabold text-slate-100 font-mono">{stat.solved}</span>
                  <span className="text-sm text-slate-500">/ {stat.total}</span>
                </div>
                
                {/* Visual bar loader */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.barColor} rounded-full transition-all duration-550 ease-out`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Completion Rate</span>
                  <span className={`text-xs font-bold font-mono ${stat.textColor}`}>{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Topic-wise Progress Breakdown */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-slate-200 text-base">Solved Problems by Topic</h3>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            No topic data available. Solve questions to view distribution.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {topics.map((topic) => (
              <div key={topic.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-350 truncate pr-2" title={topic.name}>{topic.name}</span>
                  <span className="text-slate-400 font-mono shrink-0">
                    {topic.solved}/{topic.total} <span className="text-indigo-400/80 ml-1.5">({topic.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-900/60 rounded-full overflow-hidden border border-slate-800/20">
                  <div 
                    className="h-full bg-indigo-500/80 rounded-full transition-all duration-500"
                    style={{ width: `${topic.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
