import React, { useState } from 'react';
import { useTracker } from '../hooks/useTracker';
import dsaData from '../data/dsaSheets.json';
import { Accordion } from '../components/ui/Accordion';
import { DsaSheetTable } from '../components/features/DsaSheetTable';
import { CheckCircle } from 'lucide-react';

export const DsaSheets: React.FC = () => {
  const { isSolved } = useTracker();
  const [activeSheetId, setActiveSheetId] = useState(dsaData.sheets[0].id);

  // Find active sheet object
  const activeSheet = dsaData.sheets.find(s => s.id === activeSheetId) || dsaData.sheets[0];

  // Calculate stats specifically for the current sheet
  let totalProblems = 0;
  let solvedProblemsCount = 0;

  activeSheet.topics.forEach((topic) => {
    topic.problems.forEach((prob) => {
      totalProblems++;
      if (isSolved(prob.id)) {
        solvedProblemsCount++;
      }
    });
  });

  const activeSheetPercent = totalProblems > 0 
    ? Math.round((solvedProblemsCount / totalProblems) * 100) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">DSA Practice Roads</span>
        <h2 className="text-2xl font-extrabold text-slate-100 mt-0.5">DSA Track Sheets</h2>
      </div>

      {/* Sheets Navigation Bar (Pills style) */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-slate-800">
        {dsaData.sheets.map((sheet) => {
          const isActive = sheet.id === activeSheetId;
          return (
            <button
              key={sheet.id}
              onClick={() => setActiveSheetId(sheet.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                  : 'bg-slate-900 border border-slate-805/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {sheet.title}
            </button>
          );
        })}
      </div>

      {/* Sheet Specific Statistics / Info Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gradient-to-br from-slate-900/40 to-slate-950/20">
        <div className="space-y-1.5 flex-1 max-w-xl">
          <h3 className="font-bold text-slate-200 text-base">{activeSheet.title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{activeSheet.description}</p>
        </div>
        
        {/* Progress Metrics for this sheet */}
        <div className="shrink-0 flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sheet Progress</span>
            <span className="text-lg font-extrabold text-slate-200 font-mono">
              {solvedProblemsCount} <span className="text-xs font-medium text-slate-500">/ {totalProblems} solved</span>
            </span>
          </div>
          <div className="relative flex items-center justify-center w-12 h-12">
            {/* Simple SVGs circular indicator */}
            <svg className="transform -rotate-90 w-12 h-12">
              <circle
                className="text-slate-800"
                stroke="currentColor"
                fill="transparent"
                strokeWidth="4"
                r="18"
                cx="24"
                cy="24"
              />
              <circle
                className="text-indigo-400 transition-all duration-500"
                stroke="currentColor"
                fill="transparent"
                strokeWidth="4"
                strokeDasharray={18 * 2 * Math.PI}
                strokeDashoffset={18 * 2 * Math.PI - (activeSheetPercent / 100) * 18 * 2 * Math.PI}
                strokeLinecap="round"
                r="18"
                cx="24"
                cy="24"
              />
            </svg>
            <span className="absolute text-[10px] font-extrabold text-slate-200 font-mono">{activeSheetPercent}%</span>
          </div>
        </div>
      </div>

      {/* Accordions for each Topic */}
      <div className="space-y-4">
        {activeSheet.topics.map((topic) => {
          // Calculate topic solved count for badges
          let topicTotal = topic.problems.length;
          let topicSolved = topic.problems.filter(p => isSolved(p.id)).length;
          const isTopicFinished = topicSolved === topicTotal && topicTotal > 0;

          const badgeEl = (
            <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded-md border shrink-0 ${
              isTopicFinished 
                ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20' 
                : 'bg-slate-950 text-slate-400 border-slate-850'
            }`}>
              {topicSolved} / {topicTotal}
            </span>
          );

          return (
            <Accordion
              key={topic.name}
              title={
                <span className="flex items-center gap-2">
                  {isTopicFinished && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  <span>{topic.name}</span>
                </span>
              }
              badge={badgeEl}
            >
              <DsaSheetTable problems={topic.problems} topicName={topic.name} />
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};
