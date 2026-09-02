import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTracker } from '../hooks/useTracker';
import { useDsaData } from '../context/DsaDataContext';
import { slugify } from '../lib/dsaData';
import { Accordion } from '../components/ui/Accordion';
import { DsaSheetTable } from '../components/features/DsaSheetTable';
import { CheckCircle } from 'lucide-react';

export const DsaSheets: React.FC = () => {
  const { isSolved } = useTracker();
  const { topics } = useDsaData();
  const location = useLocation();

  // A topic can be deep-linked with a `#topic-<slug>` hash (e.g. from the
  // Dashboard's "Solved Problems by Topic" list): that accordion opens and
  // scrolls into view. `userOpen` holds explicit toggles, which win over the
  // hash so the user can still collapse a topic they were linked to.
  const hashTopicSlug = location.hash.startsWith('#topic-')
    ? location.hash.slice('#topic-'.length)
    : null;
  const [userOpen, setUserOpen] = useState<Record<string, boolean>>({});
  const isTopicOpen = (name: string) =>
    userOpen[name] ?? (hashTopicSlug !== null && slugify(name) === hashTopicSlug);

  useEffect(() => {
    if (!hashTopicSlug) return;
    const el = document.getElementById(`topic-${hashTopicSlug}`);
    if (!el) return; // topic not present (yet) — nothing to scroll to
    const id = requestAnimationFrame(() =>
      el.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
    return () => cancelAnimationFrame(id);
  }, [hashTopicSlug, topics.length]);

  // Overall progress counts each problem id once, even if it appears in
  // multiple topics (e.g. a problem shared between Arrays and Heap).
  const globalSeen = new Set<string>();
  let totalProblems = 0;
  let solvedProblemsCount = 0;
  topics.forEach((topic) => {
    topic.problems.forEach((prob) => {
      if (globalSeen.has(prob.id)) return;
      globalSeen.add(prob.id);
      totalProblems++;
      if (isSolved(prob.id)) solvedProblemsCount++;
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
              id={`topic-${slugify(topic.name)}`}
              open={isTopicOpen(topic.name)}
              onOpenChange={(next) =>
                setUserOpen((prev) => ({ ...prev, [topic.name]: next }))
              }
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
