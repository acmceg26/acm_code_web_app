import React, { useState } from 'react';
import aptitudeData from '../data/aptitude.json';
import { AptitudeCard } from '../components/features/AptitudeCard';
import { Card } from '../components/ui/Card';
import { Calculator, Compass, BookOpen } from 'lucide-react';

type CategoryType = 'quantitative' | 'logical' | 'verbal';

export const AptitudePractice: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);

  const categories = [
    {
      id: 'quantitative' as CategoryType,
      title: 'Quantitative Aptitude',
      description: 'Numerical concepts, algebra, permutations, combinations, and core mathematical puzzles.',
      icon: Calculator,
      gradient: 'from-blue-500/10 to-indigo-500/10 border-indigo-500/20 text-indigo-400',
      topicsCount: aptitudeData.quantitative.length,
    },
    {
      id: 'logical' as CategoryType,
      title: 'Logical Reasoning',
      description: 'Deductive syllogisms, family relations, critical thinking, and abstract patterns.',
      icon: Compass,
      gradient: 'from-purple-500/10 to-pink-500/10 border-pink-500/20 text-pink-400',
      topicsCount: aptitudeData.logical.length,
    },
    {
      id: 'verbal' as CategoryType,
      title: 'Verbal Ability',
      description: 'Grammar analysis, paragraph reading, corrections, and sentence logic checks.',
      icon: BookOpen,
      gradient: 'from-emerald-500/10 to-teal-500/10 border-teal-500/20 text-emerald-400',
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
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Aptitude & Logical Skills</span>
        <h2 className="text-2xl font-extrabold text-slate-100 mt-0.5">Aptitude Practice</h2>
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
                <div className={`w-12 h-12 rounded-2xl bg-slate-900 border flex items-center justify-center mb-5 ${cat.gradient}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-indigo-400 transition-colors mb-2">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold">
                <span className="text-slate-500 font-mono">{cat.topicsCount} Topics Curated</span>
                <span className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                  Select Category &rarr;
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
