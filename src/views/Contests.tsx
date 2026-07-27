import React from 'react';
import contestsData from '../data/contests.json';
import { BookOpen, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';

interface Contest {
  id: string;
  name: string;
  topic: string;
  internLink: string;
  placementLink: string;
}

const { contests } = contestsData as { contests: Contest[] };

export const Contests: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Contests</h2>
        <p className="text-sm text-zinc-500 mt-1">
          All C.O.D.E contest rounds — pick your track and start practicing.
        </p>
      </div>

      {/* Contest List */}
      <div className="space-y-4">
        {contests.map((contest) => (
          <div
            key={contest.id}
            className="glass-panel rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          >
            {/* Left — contest info */}
            <div className="flex items-start gap-4 min-w-0">
              <span className="w-10 h-10 shrink-0 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-blue-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-100">{contest.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{contest.topic}</p>
              </div>
            </div>

            {/* Right — link boxes */}
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              {/* Intern link */}
              <a
                href={contest.internLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 hover:text-blue-200 text-xs font-medium transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span>Intern Track</span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
              </a>

              {/* Placement link */}
              <a
                href={contest.placementLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400/50 hover:text-violet-200 text-xs font-medium transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span>Placement Track</span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
