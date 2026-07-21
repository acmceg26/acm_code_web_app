import React, { useState } from 'react';
import companyData from '../data/companies.json';
import { Card } from '../components/ui/Card';
import { ComingSoon } from '../components/ui/ComingSoon';
import { ArrowLeft, ExternalLink, ClipboardList, Users } from 'lucide-react';

// ─── Feature flag ───────────────────────────────────────────────────────────
// Set to `true` to hide the section behind a "Coming Soon" screen.
const COMING_SOON = false;
// ────────────────────────────────────────────────────────────────────────────

// Brand domains used to fetch each company's logo.
const COMPANY_DOMAINS: Record<string, string> = {
  amazon: 'amazon.com',
  appian: 'appian.com',
  'wells-fargo': 'wellsfargo.com',
  accolite: 'accolite.com',
  apple: 'apple.com',
  'american-express': 'americanexpress.com',
  walmart: 'walmart.com',
  aptiv: 'aptiv.com',
  'athena-health': 'athenahealth.com',
  'arista-networks': 'arista.com',
  'aspire-systems': 'aspiresys.com',
  'western-digital': 'westerndigital.com',
  accenture: 'accenture.com',
  bny: 'bny.com',
  zoho: 'zoho.com',
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

type Company = (typeof companyData)[number];
type Question = Company['questions'][number];

// Badge colour by question type (OA vs Interview).
const typeStyles = (type: string) =>
  type === 'OA'
    ? 'text-amber-400 bg-amber-400/10 border-amber-500/20'
    : 'text-blue-400 bg-blue-400/10 border-blue-500/20';

// ─── Company detail page ─────────────────────────────────────────────────────
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

    {/* ── Questions asked ──────────────────────────────────── */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <ClipboardList className="w-4 h-4 text-zinc-300" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Questions Asked</h3>
          <p className="text-xs text-zinc-500">
            OA & interview questions shared by students who interviewed here.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {company.questions.map((q: Question) => (
          <a
            key={q.id}
            href={q.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:border-blue-500/40 hover:bg-zinc-900/70 transition-colors px-4 py-3"
          >
            <span className="flex-1 text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
              {q.title}
            </span>
            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-md border ${typeStyles(q.type)}`}>
              {q.type}
            </span>
            {q.year && (
              <span className="shrink-0 text-[10px] font-mono font-bold text-zinc-500">{q.year}</span>
            )}
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-zinc-500 group-hover:text-blue-400 transition-colors" />
          </a>
        ))}
      </div>
    </div>

    {/* ── Placement Experiences (inactive for now) ─────────── */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <Users className="w-4 h-4 text-zinc-300" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Placement Experiences</h3>
          <p className="text-xs text-zinc-500">First-hand interview write-ups from students.</p>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 px-4 py-6 text-center">
        <p className="text-sm text-zinc-500">Placement experiences will be added soon.</p>
      </div>
    </div>
  </div>
);

// ─── Main page ───────────────────────────────────────────────────────────────
export const CompanyPrep: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // ── Coming Soon screen ────────────────────────────────────────────────────
  if (COMING_SOON) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Companies</h2>
          <p className="text-sm text-zinc-500 mt-1">Company-specific OA & interview questions shared by students.</p>
        </div>
        <ComingSoon message="Company-specific questions are being set up. Check back soon!" />
      </div>
    );
  }
  // ──────────────────────────────────────────────────────────────────────────

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
          Company-specific OA &amp; interview questions shared by students.
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
                  {company.questions.length} question{company.questions.length !== 1 ? 's' : ''}
                </span>
              </div>

              <h3 className="text-base font-semibold text-zinc-100 mb-2">{company.name}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                OA &amp; interview questions from students who interviewed at {company.name}.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800 text-xs font-medium">
              <span className="text-zinc-500">Questions &amp; experiences</span>
              <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">View &rarr;</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
