import React from 'react';
import { ArrowLeft, ExternalLink, GraduationCap } from 'lucide-react';

interface PlacementExperience {
  name: string;
  year: string;
  role: string;
  link: string;
}

interface Company {
  id: string;
  name: string;
  placementExperiences: PlacementExperience[];
}

interface PlacementExperiencesProps {
  company: Company;
  onBack: () => void;
}

export const PlacementExperiences: React.FC<PlacementExperiencesProps> = ({ company, onBack }) => {
  const experiences = company.placementExperiences ?? [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header / Back navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-medium text-zinc-500">Placement experiences</span>
          <h2 className="text-xl font-semibold text-zinc-100">{company.name}</h2>
        </div>
      </div>

      <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
        First-hand interview and OA write-ups from students placed at {company.name}. Open a
        blog to read their full experience.
      </p>

      {/* List of student blogs (company-scoped) */}
      {experiences.length === 0 ? (
        <div className="glass-panel rounded-xl p-10 text-center text-zinc-500 text-sm">
          No placement experiences shared yet for {company.name}.
        </div>
      ) : (
        <div className="glass-panel rounded-xl divide-y divide-zinc-800">
          {experiences.map((exp) => (
            <div
              key={`${exp.name}-${exp.year}`}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* <span className="w-9 h-9 shrink-0 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-sm font-semibold">
                  {exp.name.charAt(0)}
                </span> */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{exp.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Class of {exp.year}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {exp.role}
                    </span>
                  </div>
                </div>
              </div>

              {exp.link ? (
                <a
                  href={exp.link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-zinc-100 text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>Read blog</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span
                  title="Blog link coming soon"
                  className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-600 text-xs font-medium cursor-not-allowed"
                >
                  <span>Read blog</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Soon</span>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
