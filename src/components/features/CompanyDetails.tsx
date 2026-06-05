import React from 'react';
import { DsaSheetTable } from './DsaSheetTable';
import { 
  Clock, 
  Layers, 
  Users, 
  ArrowLeft 
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo: string;
  oaDetails: {
    duration: string;
    questionsCount: number;
    difficulty: string;
    patterns: string[];
  };
  interviewFormats: {
    technicalRounds: number;
    hrCriteria: string;
    focusAreas: string[];
  };
  coreQuestions: {
    id: string;
    title: string;
    difficulty: string;
    platforms: {
      leetcode?: string;
      gfg?: string;
    };
    videoSolution?: string;
  }[];
}

interface CompanyDetailsProps {
  company: Company;
  onBack: () => void;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header / Back navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-450 hover:text-slate-100 transition-all flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Company Prep Profile</span>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-0.5">{company.name} Preparation</h2>
        </div>
      </div>

      {/* Grid: OA Details & Interview format */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OA Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-200 text-base">Online Assessment (OA) Specs</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Test Duration</span>
              <p className="font-bold text-slate-200">{company.oaDetails.duration}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Number of Questions</span>
              <p className="font-bold text-slate-200">{company.oaDetails.questionsCount} Coding Questions</p>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Typical Difficulty</span>
              <p className="font-bold text-slate-205">{company.oaDetails.difficulty}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Frequent OA Topics</span>
            <div className="flex flex-wrap gap-1.5">
              {company.oaDetails.patterns.map((pattern) => (
                <span 
                  key={pattern} 
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-950 text-slate-350 border border-slate-800/50"
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Format Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-200 text-base">Interview Round Formats</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Technical Rounds</span>
              <p className="font-bold text-slate-200">{company.interviewFormats.technicalRounds} Rounds</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Behavioral/HR Focus</span>
              <p className="font-bold text-slate-200 text-xs leading-relaxed">{company.interviewFormats.hrCriteria}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Key Focus Areas</span>
            <div className="flex flex-wrap gap-1.5">
              {company.interviewFormats.focusAreas.map((area) => (
                <span 
                  key={area} 
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-950 text-slate-350 border border-slate-800/50"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Questions Table Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-200 text-base">Top Interview Questions</h3>
        </div>
        <DsaSheetTable problems={company.coreQuestions} topicName={`${company.name} Core`} />
      </div>
    </div>
  );
};
