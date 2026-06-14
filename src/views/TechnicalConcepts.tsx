import React, { useState } from 'react';
import technicalConcepts from '../data/technicalConcepts.json';
import { Card } from '../components/ui/Card';
import { ComingSoon } from '../components/ui/ComingSoon';
import { Cpu, Database, Network, Boxes, Binary, Server, FileQuestion, ArrowLeft, ExternalLink, ClipboardList, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Feature flags ──────────────────────────────────────────────────────────
// Set to `false` once the respective links are ready to publish.
const TESTS_COMING_SOON = true;
const MATERIALS_COMING_SOON = false;
// ────────────────────────────────────────────────────────────────────────────

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  database: Database,
  network: Network,
  boxes: Boxes,
  binary: Binary,
  server: Server,
};

type Concept = (typeof technicalConcepts)[number];

// ─── Subject detail page ─────────────────────────────────────────────────────
const SubjectDetailPage: React.FC<{
  concept: Concept;
  onBack: () => void;
}> = ({ concept, onBack }) => {
  const Icon = ICONS[concept.icon] ?? FileQuestion;

  return (
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
          <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-zinc-500">Technical Concepts</span>
            <h2 className="text-xl font-semibold text-zinc-100">{concept.subject}</h2>
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
            <p className="text-xs text-zinc-500">Subject-specific mock tests via Google Forms</p>
          </div>
        </div>

        {/* ── Toggle: TESTS_COMING_SOON ── */}
        {TESTS_COMING_SOON ? (
          <ComingSoon message={`${concept.subject} MCQ tests are being set up. Check back soon!`} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concept.tests.map((test) => (
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
            <p className="text-xs text-zinc-500">Notes and quick references via Google Drive</p>
          </div>
        </div>

        {/* ── Toggle: MATERIALS_COMING_SOON ── */}
        {MATERIALS_COMING_SOON ? (
          <ComingSoon message={`${concept.subject} study materials are being compiled. Check back soon!`} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concept.studyMaterials.map((material) => (
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
};

// ─── Main page ────────────────────────────────────────────────────────────────
export const TechnicalConcepts: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConcept = technicalConcepts.find((c) => c.id === activeId);

  if (activeConcept) {
    return (
      <SubjectDetailPage
        concept={activeConcept}
        onBack={() => setActiveId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Technical Concepts</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Mock tests and study materials for core CS subjects.
        </p>
      </div>

      {/* Subject cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {technicalConcepts.map((concept) => {
          const Icon = ICONS[concept.icon] ?? FileQuestion;
          return (
            <Card
              key={concept.id}
              onClick={() => setActiveId(concept.id)}
              className="flex flex-col justify-between h-full group cursor-pointer"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-5 text-zinc-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">{concept.subject}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">{concept.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-medium">
                <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">View &rarr;</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
