import React, { useState } from 'react';
import resourcesData from '../data/resources.json';
import { Card } from '../components/ui/Card';
import { ExternalLink, Link2, FileText, BookOpen, MonitorPlay } from 'lucide-react';

type Tab = { label: string; dataCategory: string; icon: React.ReactNode };

export const Resources: React.FC = () => {
  const tabs: Tab[] = [
    {
      label: 'Resume Templates & resources',
      dataCategory: 'Resume',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      label: 'Video Playlists',
      dataCategory: 'Subject Video Playlists',
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
    {
      label: 'Mock Interview Platforms',
      dataCategory: 'Mock Interview Platforms',
      icon: <MonitorPlay className="w-3.5 h-3.5" />,
    },
  ];

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

  const filteredResources = resourcesData.resources.filter(
    (res) => res.category === activeTab.dataCategory
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Resources</h2>
        <p className="text-sm text-zinc-500 mt-1">Resumes, CS/IT subject video playlists and mock interview platforms.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-800">
        {tabs.map((tab) => {
          const isActive = activeTab.label === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${isActive
                  ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800/60'
                }`}
            >
              <span className={isActive ? 'text-zinc-700' : 'text-zinc-500'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
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
                <span className="px-2.5 py-1 rounded-md text-[10px] font-medium border border-blue-500/20 bg-blue-500/15 text-blue-400">
                  {res.category}
                </span>
                <Link2 className="w-4 h-4 text-zinc-600" />
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-semibold text-zinc-100 mb-2 leading-snug">
                {res.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {res.description}
              </p>
            </div>

            {/* Tags and Action buttons */}
            <div className="space-y-4 pt-4 border-t border-zinc-800/80">
              {/* Tags pills */}
              <div className="flex flex-wrap gap-1.5">
                {res.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[9px] font-bold rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
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
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
