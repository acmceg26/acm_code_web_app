import React, { useState } from 'react';
import resourcesData from '../data/resources.json';
import { Card } from '../components/ui/Card';
import { ExternalLink, Link2 } from 'lucide-react';

export const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Core CS Subjects', 'System Design', 'Resume Templates', 'Mock Interview Platforms'];

  const filteredResources = activeCategory === 'All'
    ? resourcesData.resources
    : resourcesData.resources.filter(res => res.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core CS Subjects':
        return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      case 'System Design':
        return 'text-purple-400 border-purple-500/20 bg-purple-500/5';
      case 'Resume Templates':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'Mock Interview Platforms':
        return 'text-pink-400 border-pink-500/20 bg-pink-500/5';
      default:
        return 'text-slate-400 border-slate-800 bg-slate-900/50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Pre-compiled Resources</span>
        <h2 className="text-2xl font-extrabold text-slate-100 mt-0.5">Preparation Materials</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                : 'bg-slate-900 border border-slate-805/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => (
          <Card 
            key={res.id} 
            hoverable={true} 
            className="flex flex-col justify-between h-full relative"
          >
            <div>
              {/* Category Indicator Tag */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryColor(res.category)}`}>
                  {res.category}
                </span>
                <Link2 className="w-4 h-4 text-slate-600" />
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-extrabold text-slate-200 mb-2 leading-snug">
                {res.title}
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed mb-6">
                {res.description}
              </p>
            </div>

            {/* Tags and Action buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              {/* Tags pills */}
              <div className="flex flex-wrap gap-1.5">
                {res.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-950 text-slate-400 border border-slate-850"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Link button */}
              <a 
                href={res.link} 
                target="_blank" 
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-750 bg-slate-900/40 hover:bg-slate-850 hover:text-white text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Visit Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
