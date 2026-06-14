import React, { useState } from 'react';
import companyData from '../data/companies.json';
import { Card } from '../components/ui/Card';
import { ComingSoon } from '../components/ui/ComingSoon';
import { ArrowLeft, ExternalLink, ClipboardList, FileText } from 'lucide-react';

// ─── Feature flags ──────────────────────────────────────────────────────────
// Set to `false` once the respective links are ready to publish.
const TESTS_COMING_SOON = true;
const MATERIALS_COMING_SOON = true;
// ────────────────────────────────────────────────────────────────────────────

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
const CompanyLogo: React.FC<{ companyId: string; name: string; size?: 'sm' | 'lg' }> = ({
  companyId,
  name,
  size = 'sm',
}) => {
  const [failed, setFailed] = useState(false);
  const domain = COMPANY_DOMAINS[companyId];
  const dim = size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const imgDim = size === 'lg' ? 'w-9 h-9' : 'w-7 h-7';

  if (failed || !domain) {
    return (
      <div className={`${dim} rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center`}>
        <span className="font-semibold text-zinc-200 text-sm tracking-tight">{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className={`${dim} rounded-xl bg-white border border-black/10 flex items-center justify-center overflow-hidden`}>
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
        alt={`${name} logo`}
        className={`${imgDim} object-contain`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

// ─── Company detail page ─────────────────────────────────────────────────────
type Company = (typeof companyData)[number];

const CompanyDetailPage: React.FC<{
  company: Company;
  onBack: () => void;
}> = ({ company, onBack }) => (
  <div className="space-y-8 animate-fade-in-up">
    {/* Header */}
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-3">
        <CompanyLogo companyId={company.id} name={company.name} size="lg" />
        <div>
          <span className="text-xs font-medium text-zinc-500">Companies</span>
          <h2 className="text-xl font-semibold text-zinc-100">{company.name}</h2>
        </div>
      </div>
    </div>

    {/* ── Technical MCQs ───────────────────────────────────── */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <ClipboardList className="w-4 h-4 text-zinc-300" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Technical MCQs</h3>
          <p className="text-xs text-zinc-500">Company-specific mock tests via Google Forms</p>
        </div>
      </div>

      {/* ── Toggle: TESTS_COMING_SOON ── */}
      {TESTS_COMING_SOON ? (
        <ComingSoon message={`${company.name} MCQ tests are being set up. Check back soon!`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {company.tests.map((test) => (
            <a
              key={test.id}
              href={test.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="flex flex-col justify-between h-full cursor-pointer group-hover:border-blue-500/40 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <ClipboardList className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100 mb-1">{test.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{test.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-medium mt-4">
                  <span className="text-zinc-500">Google Forms</span>
                  <span className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
                    Open Test <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>

    {/* ── Study Materials ──────────────────────────────────── */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <FileText className="w-4 h-4 text-zinc-300" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Study Materials</h3>
          <p className="text-xs text-zinc-500">Interview prep guides and notes via Google Drive</p>
        </div>
      </div>

      {/* ── Toggle: MATERIALS_COMING_SOON ── */}
      {MATERIALS_COMING_SOON ? (
        <ComingSoon message={`${company.name} study materials are being compiled. Check back soon!`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {company.studyMaterials.map((material) => (
            <a
              key={material.id}
              href={material.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="flex flex-col justify-between h-full cursor-pointer group-hover:border-emerald-500/40 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100 mb-1">{material.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{material.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-medium mt-4">
                  <span className="flex items-center gap-1 text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    Open Material <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ─── Main page ───────────────────────────────────────────────────────────────
export const CompanyPrep: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const selectedCompany = companyData.find((c) => c.id === selectedCompanyId);

  if (selectedCompany) {
    return (
      <CompanyDetailPage
        company={selectedCompany}
        onBack={() => setSelectedCompanyId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Companies</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Mock tests and study materials for company-specific interview preparation.
        </p>
      </div>

      {/* Grid of company cards */}
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
                <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-tight bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 rounded-md">
                  {company.tests.length} test{company.tests.length !== 1 ? 's' : ''}
                </span>
              </div>

              <h3 className="text-base font-semibold text-zinc-100 mb-2">{company.name}</h3>

              <div className="space-y-2 text-xs text-zinc-400">
                <p className="line-clamp-1">
                  <span className="font-semibold text-zinc-500">OA:</span>{' '}
                  {company.oaDetails.duration} · {company.oaDetails.questionsCount} Questions
                </p>
                <p className="line-clamp-1">
                  <span className="font-semibold text-zinc-500">Difficulty:</span>{' '}
                  {company.oaDetails.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800 text-xs font-medium">
              <span className="text-zinc-500">Tests &amp; study materials</span>
              <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">View &rarr;</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
