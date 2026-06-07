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
        <h2 className="text-xl font-semibold text-zinc-100">DSA Sheets</h2>
        <p className="text-sm text-zinc-500 mt-1">Problem sets grouped by topic.</p>
      </div>

      {/* Sheets Navigation Bar (Pills style) */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-zinc-800">
        {dsaData.sheets.map((sheet) => {
          const isActive = sheet.id === activeSheetId;
          return (
            <button
              key={sheet.id}
              onClick={() => setActiveSheetId(sheet.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {sheet.title}
            </button>
          );
        })}
      </div>

      {/* Sheet Specific Statistics / Info Card */}
      <div className="glass-panel p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 flex-1 max-w-xl">
          <h3 className="font-bold text-zinc-200 text-base">{activeSheet.title}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">{activeSheet.description}</p>
        </div>
        
        {/* Progress Metrics for this sheet */}
        <div className="shrink-0 flex items-center gap-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
          <div className="text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Sheet Progress</span>
            <span className="text-lg font-bold text-zinc-200 font-mono">
              {solvedProblemsCount} <span className="text-xs font-medium text-zinc-500">/ {totalProblems} solved</span>
            </span>
          </div>
          <div className="relative flex items-center justify-center w-12 h-12">
            {/* Simple SVGs circular indicator */}
            <svg className="transform -rotate-90 w-12 h-12">
              <circle
                className="text-zinc-800"
                stroke="currentColor"
                fill="transparent"
                strokeWidth="4"
                r="18"
                cx="24"
                cy="24"
              />
              <circle
                className="text-blue-400 transition-all duration-500"
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
            <span className="absolute text-[10px] font-bold text-zinc-200 font-mono">{activeSheetPercent}%</span>
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
                ? 'bg-emerald-500/50 text-emerald-400 border-emerald-500/20' 
                : 'bg-zinc-950 text-zinc-400 border-zinc-800'
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
