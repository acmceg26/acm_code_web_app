import React, { useState } from 'react';
import aptitudeData from '../data/aptitude.json';
import { AptitudeCard } from '../components/features/AptitudeCard';
import { Card } from '../components/ui/Card';
import { Calculator, Compass, BookOpen, ExternalLink, FileText, ClipboardList } from 'lucide-react';

type CategoryType = 'quantitative' | 'logical' | 'verbal';

export const AptitudePractice: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);

  const categories = [
    {
      id: 'quantitative' as CategoryType,
      title: 'Quantitative Aptitude',
      description: 'Numerical concepts, algebra, permutations, combinations, and core mathematical puzzles.',
      icon: Calculator,
      iconClass: 'border-zinc-700 text-zinc-300',
      topicsCount: aptitudeData.quantitative.length,
    },
    {
      id: 'logical' as CategoryType,
      title: 'Logical Reasoning',
      description: 'Deductive syllogisms, family relations, critical thinking, and abstract patterns.',
      icon: Compass,
      iconClass: 'border-zinc-700 text-zinc-300',
      topicsCount: aptitudeData.logical.length,
    },
    {
      id: 'verbal' as CategoryType,
      title: 'Verbal Ability',
      description: 'Grammar analysis, paragraph reading, corrections, and sentence logic checks.',
      icon: BookOpen,
      iconClass: 'border-zinc-700 text-zinc-300',
      topicsCount: aptitudeData.verbal.length,
    },
  ];

  if (activeCategory) {
    const activeTopics = aptitudeData[activeCategory] || [];
    const activeTitle = categories.find(c => c.id === activeCategory)?.title || '';
    
    return (
      <AptitudeCard
        topics={activeTopics}
        categoryTitle={activeTitle}
        onBackToCategories={() => setActiveCategory(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Aptitude Practice</h2>
        <p className="text-sm text-zinc-500 mt-1">Quantitative, logical, and verbal question sets.</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex flex-col justify-between group cursor-pointer h-full"
            >
              <div>
                <div className={`w-11 h-11 rounded-lg bg-zinc-800 border flex items-center justify-center mb-5 ${cat.iconClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-medium">
                <span className="text-zinc-500">{cat.topicsCount} topics</span>
                <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">Open &rarr;</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Aptitude Tests ─────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Aptitude Tests</h3>
            <p className="text-xs text-zinc-500">Timed mock tests via Google Forms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aptitudeData.tests.map((test) => (
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
      </div>

      {/* ── Study Materials ────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <FileText className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Study Materials</h3>
            <p className="text-xs text-zinc-500">Notes and resources via Google Drive</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aptitudeData.studyMaterials.map((material) => (
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
                  <span className="text-zinc-500">Google Drive</span>
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
