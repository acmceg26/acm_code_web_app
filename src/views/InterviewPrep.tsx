import React from 'react';
import { Card } from '../components/ui/Card';
import { Lightbulb, FileText, Speech, MailPlus, ExternalLink, Link2 } from 'lucide-react';

// ─── Editable content ───────────────────────────────────────────────────────
// TODO: swap the placeholder links for the real ACM-CEG resources.
const GENERAL_TIPS: string[] = [
  'Research the company and the role the night before — know its products, recent news, and the JD.',
  'Revise your own resume line by line; be ready to talk in depth about every project and claim on it.',
  'Think out loud in DSA rounds. Clarify inputs, state your approach and complexity before you code.',
  'Use the STAR format (Situation, Task, Action, Result) for behavioural and HR questions.',
  'Keep 3–4 thoughtful questions ready for the interviewer — it signals genuine interest.',
  'Mock interview with a friend at least once; practise saying your self-introduction out loud.',
];

interface PrepResource {
  title: string;
  description: string;
  tags: string[];
  link: string;
}

const PREP_RESOURCES: PrepResource[] = [
  {
    title: 'Resume Template',
    description: 'A clean, single-page ATS-friendly resume template used by ACM-CEG seniors. Make a copy and fill in your details.',
    tags: ['resume', 'template'],
    link: 'https://docs.google.com/',
  },
  {
    title: 'Self Intro Prompt',
    description: 'A guided prompt to script a crisp 60–90 second "Tell me about yourself" — background, projects, and what you are looking for.',
    tags: ['self-intro', 'prompt'],
    link: 'https://docs.google.com/',
  },
  {
    title: 'Referral Email Template',
    description: 'A short, polite cold-email / LinkedIn message template for asking alumni and employees for a referral.',
    tags: ['referral', 'outreach'],
    link: 'https://docs.google.com/',
  },
];
// ────────────────────────────────────────────────────────────────────────────

const RESOURCE_ICONS = [FileText, Speech, MailPlus];

export const InterviewPrep: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Interview Prep</h2>
        <p className="text-sm text-zinc-500 mt-1">
          General tips plus templates and prompts to get interview-ready.
        </p>
      </div>

      {/* Big general-tips card */}
      <div className="glass-panel rounded-xl border border-blue-500/25 bg-gradient-to-br from-blue-600/12 via-indigo-600/8 to-transparent p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">General Interview Tips</h3>
            <p className="text-xs text-zinc-500">Applies to OA, technical and HR rounds.</p>
          </div>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {GENERAL_TIPS.map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-zinc-300 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Small resource cards — same layout as Other Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PREP_RESOURCES.map((res, i) => {
          const Icon = RESOURCE_ICONS[i] ?? FileText;
          return (
            <Card key={res.title} hoverable className="flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-zinc-300" />
                  </div>
                  <Link2 className="w-4 h-4 text-zinc-600" />
                </div>

                <h3 className="text-base font-semibold text-zinc-100 mb-2 leading-snug">{res.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">{res.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                <div className="flex flex-wrap gap-1.5">
                  {res.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[9px] font-bold rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <a
                  href={res.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
