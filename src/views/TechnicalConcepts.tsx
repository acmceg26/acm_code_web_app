import React, { useState } from 'react';
import rawTechnicalConcepts from '../data/technicalConcepts.json';
import { Card } from '../components/ui/Card';
import { Cpu, Database, Network, Boxes, Binary, Server, FileQuestion, ArrowLeft, ExternalLink, ClipboardList, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type StudyMaterial = {
  id: string;
  title: string;
  description: string;
  driveUrl: string;
};

type TechnicalTest = {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  formUrl: string;
  bankUrl: string;
};

type ResourceConcept = {
  id: string;
  subject: string;
  icon: string;
  description: string;
  studyMaterials: StudyMaterial[];
};

type TechnicalConceptsData = {
  tests: TechnicalTest[];
  resources: ResourceConcept[];
};

const technicalConceptsData = rawTechnicalConcepts as TechnicalConceptsData;

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  database: Database,
  network: Network,
  boxes: Boxes,
  binary: Binary,
  server: Server,
};

const TechnicalTestCard: React.FC<{
  concept: ResourceConcept;
  test: TechnicalTest;
}> = ({ concept, test }) => (
  <Card className="flex flex-col justify-between h-full">
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <ClipboardList className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {concept.subject}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-zinc-100 mb-1">{test.title}</h4>
      <p className="text-xs text-zinc-400 leading-relaxed">{test.description}</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-800 mt-4">
      <a
        href={test.formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2.5 text-xs font-semibold text-blue-300 transition-colors hover:border-blue-400/40 hover:bg-blue-500/15 hover:text-blue-200"
      >
        Open Test
        <ExternalLink className="w-3 h-3" />
      </a>
      <a
        href={test.bankUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-xs font-semibold text-emerald-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/15 hover:text-emerald-200"
      >
        Question Bank
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  </Card>
);

const SubjectResourcesPage: React.FC<{
  concept: ResourceConcept;
  onBack: () => void;
}> = ({ concept, onBack }) => {
  const Icon = ICONS[concept.icon] ?? FileQuestion;

  return (
    <div className="space-y-8 animate-fade-in-up">
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

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <FileText className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Study Materials</h3>
            <p className="text-xs text-zinc-500">Question banks, notes, and quick references via Google Drive</p>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export const TechnicalConcepts: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConcept = technicalConceptsData.resources.find((resource) => resource.id === activeId);

  if (activeConcept) {
    return <SubjectResourcesPage concept={activeConcept} onBack={() => setActiveId(null)} />;
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Technical Concepts</h2>
        <p className="text-sm text-zinc-500 mt-1">
          A test hub for Google Forms mock tests and a separate resource library for each subject.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Technical Tests</h3>
            <p className="text-xs text-zinc-500">Google Form mock tests with a question-bank shortcut in each card</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalConceptsData.tests.map((test) => {
            const concept = technicalConceptsData.resources.find((resource) => resource.id === test.subjectId);

            if (!concept) {
              return null;
            }

            return <TechnicalTestCard key={test.id} concept={concept} test={test} />;
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <FileText className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Subject Resources</h3>
            <p className="text-xs text-zinc-500">Open a subject to view only its study materials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {technicalConceptsData.resources.map((concept) => {
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
                  <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">View resources &rarr;</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
