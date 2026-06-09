import React, { useState } from 'react';
import companyData from '../data/companies.json';
import { CompanyDetails } from '../components/features/CompanyDetails';
import { PlacementExperiences } from '../components/features/PlacementExperiences';
import { Card } from '../components/ui/Card';

// Brand domains used to fetch each company's logo.
const COMPANY_DOMAINS: Record<string, string> = {
  google: 'google.com',
  amazon: 'amazon.com',
  microsoft: 'microsoft.com',
  'goldman-sachs': 'goldmansachs.com',
  zoho: 'zoho.com',
  tcs: 'www.tcs.com',
};

// Renders the real company logo on a white tile, falling back to the
// company initial if the logo can't be loaded.
const CompanyLogo: React.FC<{ companyId: string; name: string }> = ({ companyId, name }) => {
  const [failed, setFailed] = useState(false);
  const domain = COMPANY_DOMAINS[companyId];

  if (failed || !domain) {
    return (
      <div className="w-11 h-11 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
        <span className="font-semibold text-zinc-200 text-sm tracking-tight">{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className="w-11 h-11 rounded-lg bg-white border border-black/10 flex items-center justify-center overflow-hidden">
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
        alt={`${name} logo`}
        width={28}
        height={28}
        className="w-7 h-7 object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

export const CompanyPrep: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [showExperiences, setShowExperiences] = useState(false);

  const selectedCompany = companyData.find(c => c.id === selectedCompanyId);

  if (selectedCompany) {
    if (showExperiences) {
      return (
        <PlacementExperiences
          company={selectedCompany}
          onBack={() => setShowExperiences(false)}
        />
      );
    }

    return (
      <CompanyDetails
        company={selectedCompany}
        onBack={() => {
          setSelectedCompanyId(null);
          setShowExperiences(false);
        }}
        onViewExperiences={() => setShowExperiences(true)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Companies</h2>
        <p className="text-sm text-zinc-500 mt-1">Online assessment formats and interview questions by company.</p>
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
                <CompanyLogo companyId={company.id} name={company.name} />
                <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-tight bg-blue-500/15 border border-blue-500/20">
                  {company.coreQuestions.length} core questions
                </span>
              </div>
              
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                {company.name}
              </h3>
              
              <div className="space-y-2 text-xs text-zinc-400">
                <p className="line-clamp-1">
                  <span className="font-semibold text-zinc-500">OA:</span> {company.oaDetails.duration} &bull; {company.oaDetails.questionsCount} Questions
                </p>
                <p className="line-clamp-1">
                  <span className="font-semibold text-zinc-500">Rounds:</span> {company.interviewFormats.technicalRounds} Tech &bull; {company.interviewFormats.hrCriteria.split(' ')[0]} Focus
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800 text-xs font-medium">
              <span className="text-zinc-500">OA &amp; interview details</span>
              <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">View &rarr;</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
