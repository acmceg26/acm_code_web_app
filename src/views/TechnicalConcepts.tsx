import React, { useState } from 'react';
import technicalConcepts from '../data/technicalConcepts.json';
import { Card } from '../components/ui/Card';
import { QuestionDeck } from '../components/features/QuestionDeck';
import { Cpu, Database, Network, Boxes, Binary, Server, FileQuestion } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  database: Database,
  network: Network,
  boxes: Boxes,
  binary: Binary,
  server: Server,
};

export const TechnicalConcepts: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConcept = technicalConcepts.find((c) => c.id === activeId);

  if (activeConcept) {
    return (
      <QuestionDeck
        eyebrow="Technical Concepts"
        title={activeConcept.subject}
        questions={activeConcept.questions}
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
          Quick MCQ practice across core CS subjects. Find learning material under Other Resources.
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
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <FileQuestion className="w-3.5 h-3.5" />
                  {concept.questions.length} questions
                </span>
                <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">Practice &rarr;</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
