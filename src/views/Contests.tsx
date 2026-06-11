import React from 'react';
import contestsData from '../data/contests.json';
import { Accordion } from '../components/ui/Accordion';
import { CalendarClock, Calendar, Clock, Trophy, Users, ExternalLink } from 'lucide-react';
import { ComingSoon } from '../components/ui/ComingSoon';

// ─── Feature flag ───────────────────────────────────────────────────────────
// Set to `false` once contest content is ready to publish.
const COMING_SOON = true;
// ────────────────────────────────────────────────────────────────────────────


const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const startsIn = (iso: string): string => {
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs <= 0) return 'Starting soon';
  const mins = Math.round(diffMs / 60000);
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h`;
  return `in ${mins}m`;
};

const rankColor = (rank: number): string => {
  if (rank === 1) return 'text-amber-400';
  if (rank === 2) return 'text-zinc-300';
  if (rank === 3) return 'text-orange-400';
  return 'text-zinc-500';
};

const PlatformBadge: React.FC<{ platform: string }> = ({ platform }) => (
  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
    {platform}
  </span>
);

export const Contests: React.FC = () => {
  const { upcoming, completed } = contestsData;

  // ── Coming Soon screen ──────────────────────────────────────────────────
  if (COMING_SOON) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Contests</h2>
          <p className="text-sm text-zinc-500 mt-1">Upcoming rounds and leaderboards from past contests.</p>
        </div>
        <ComingSoon message="Contest listings and leaderboards are being set up. Check back soon!" />
      </div>
    );
  }
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Contests</h2>
        <p className="text-sm text-zinc-500 mt-1">Upcoming rounds and leaderboards from past contests.</p>
      </div>

      {/* Upcoming */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Upcoming</h3>
        </div>

        {upcoming.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-sm text-zinc-500">
            No upcoming contests scheduled.
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((c) => (
              <div
                key={c.id}
                className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-10 h-10 shrink-0 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-blue-400">
                    <CalendarClock className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-zinc-100">{c.name}</p>
                      <PlatformBadge platform={c.platform} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatWhen(c.startsAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {c.durationMins} min
                      </span>
                      <span className="font-medium text-blue-400">{startsIn(c.startsAt)}</span>
                    </div>
                  </div>
                </div>

                {c.link ? (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-zinc-100 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <span>Go to contest</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span
                    title="Link coming soon"
                    className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-600 text-xs font-medium cursor-not-allowed"
                  >
                    <span>Details</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Soon</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed + leaderboards */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Past contests &amp; leaderboards</h3>
        </div>

        {completed.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-sm text-zinc-500">
            No past contests yet.
          </div>
        ) : (
          <div className="space-y-3">
            {completed.map((contest, index) => (
              <Accordion
                key={contest.id}
                defaultOpen={index === 0}
                title={
                  <span className="flex items-center gap-2">
                    <span>{contest.name}</span>
                    <PlatformBadge platform={contest.platform} />
                  </span>
                }
                badge={
                  <span className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="hidden sm:flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {contest.participants}
                    </span>
                    <span>{formatDay(contest.heldOn)}</span>
                  </span>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[360px]">
                    <thead>
                      <tr className="text-[11px] text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                        <th className="py-2 px-3 w-16">Rank</th>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {contest.leaderboard.map((entry) => (
                        <tr key={entry.rank} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className={`font-mono font-bold ${rankColor(entry.rank)}`}>
                              #{entry.rank}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-zinc-200">{entry.name}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-300">{entry.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Accordion>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
