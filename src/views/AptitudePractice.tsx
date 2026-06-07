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
    </div>
  );
};
