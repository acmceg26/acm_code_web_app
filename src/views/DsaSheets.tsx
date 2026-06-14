import React from 'react';
import { useTracker } from '../hooks/useTracker';
import dsaData from '../data/dsaSheets.json';
import { Accordion } from '../components/ui/Accordion';
import { DsaSheetTable } from '../components/features/DsaSheetTable';
import { CheckCircle } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  platforms: { leetcode?: string; gfg?: string };
  videoSolution?: string;
}

export const DsaSheets: React.FC = () => {
  const { isSolved } = useTracker();

  // Flatten every sheet → level → topic into a single list of topics, grouped
  // by topic name. Problems that repeat across sheets/levels (same id) are
  // de-duplicated so each question shows once.
  const topicsMap = new Map<string, { name: string; problems: Problem[]; seen: Set<string> }>();
  const globalSeen = new Set<string>();
  let totalProblems = 0;
  let solvedProblemsCount = 0;

  dsaData.sheets.forEach((sheet) => {
    sheet.levels.forEach((level) => {
      level.topics.forEach((topic) => {
        let entry = topicsMap.get(topic.name);
        if (!entry) {
          entry = { name: topic.name, problems: [], seen: new Set() };
          topicsMap.set(topic.name, entry);
        }
        topic.problems.forEach((prob) => {
          if (!entry!.seen.has(prob.id)) {
            entry!.seen.add(prob.id);
            entry!.problems.push(prob as Problem);
          }
          if (!globalSeen.has(prob.id)) {
            globalSeen.add(prob.id);
            totalProblems++;
            if (isSolved(prob.id)) solvedProblemsCount++;
          }
        });
      });
    });
  });

  const topics = Array.from(topicsMap.values());

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

      {/* Statistics / Info Card */}
      <div className="glass-panel p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 flex-1 max-w-xl">
          <h3 className="font-bold text-zinc-200 text-base">All Problems</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every placement and intern problem in one place, grouped by topic.
          </p>
        </div>

        {/* Overall progress */}
        <div className="shrink-0 flex items-center gap-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
          <div className="text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Progress</span>
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
        {topics.map((topic) => {
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
