import React, { useState } from 'react';
import companyData from '../data/companies.json';
import { CompanyDetails } from '../components/features/CompanyDetails';
import { Card } from '../components/ui/Card';

export const CompanyPrep: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const selectedCompany = companyData.find(c => c.id === selectedCompanyId);

  // Helper to render customized modern logos/initials for companies
  const renderCompanyLogo = (companyId: string, name: string) => {
    const configurations: Record<string, { gradient: string; text: string }> = {
      google: { gradient: 'from-blue-500 via-red-500 to-yellow-500', text: 'G' },
      amazon: { gradient: 'from-amber-500 to-orange-600', text: 'A' },
      microsoft: { gradient: 'from-blue-600 to-teal-500', text: 'M' },
      'goldman-sachs': { gradient: 'from-yellow-600 via-yellow-500 to-amber-600', text: 'GS' },
      zoho: { gradient: 'from-red-500 via-blue-500 to-green-500', text: 'Z' },
      tcs: { gradient: 'from-blue-700 to-indigo-850', text: 'TCS' },
    };

    const config = configurations[companyId] || { gradient: 'from-slate-700 to-slate-900', text: name.charAt(0) };

    return (
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${config.gradient} flex items-center justify-center shadow-md border border-white/5`}>
        <span className="font-extrabold text-white text-base tracking-tight">{config.text}</span>
      </div>
    );
  };

  if (selectedCompany) {
    return (
      <CompanyDetails 
        company={selectedCompany} 
        onBack={() => setSelectedCompanyId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Target Recruitment</span>
        <h2 className="text-2xl font-extrabold text-slate-100 mt-0.5">Company Wise & OA Prep</h2>
      </div>

      {/* Grid Layout of Company Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companyData.map((company) => (
          <Card
            key={company.id}
            onClick={() => setSelectedCompanyId(company.id)}
            className="flex flex-col justify-between group h-full cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                {renderCompanyLogo(company.id, company.name)}
                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tight bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-850">
                  {company.coreQuestions.length} core questions
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-indigo-400 transition-colors mb-2">
                {company.name}
              </h3>
              
              <div className="space-y-2 text-xs text-slate-400">
                <p className="line-clamp-1">
                  <span className="font-semibold text-slate-500">OA:</span> {company.oaDetails.duration} &bull; {company.oaDetails.questionsCount} Questions
                </p>
                <p className="line-clamp-1">
                  <span className="font-semibold text-slate-500">Rounds:</span> {company.interviewFormats.technicalRounds} Tech &bull; {company.interviewFormats.hrCriteria.split(' ')[0]} Focus
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold">
              <span className="text-slate-500 group-hover:text-slate-400 transition-colors">View Interview Strategy</span>
              <span className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                Analyze &rarr;
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
