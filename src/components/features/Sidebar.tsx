import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Building2, 
  Brain, 
  FolderOpen, 
  Trash2,
  X
} from 'lucide-react';
import { useTracker } from '../../hooks/useTracker';

type ViewType = 'dashboard' | 'dsa' | 'company' | 'aptitude' | 'resources';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  mobileOpen,
  setMobileOpen,
}) => {
  const { metrics, clearAllProgress } = useTracker();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Sheets', icon: BookOpen },
    { id: 'company', label: 'Company & OA Prep', icon: Building2 },
    { id: 'aptitude', label: 'Aptitude Practice', icon: Brain },
    { id: 'resources', label: 'Other Resources', icon: FolderOpen },
  ] as const;

  const handleSelect = (view: ViewType) => {
    setActiveView(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="font-extrabold text-white text-base">ACM</span>
            </div>
            <div>
              <h1 className="font-extrabold text-slate-100 text-lg leading-tight tracking-tight">PrepVault</h1>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Placement Tracker</span>
            </div>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-650/15' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Mini Profile / Reset Progress */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          {/* Mini progress stats */}
          <div className="mb-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
              <span>Overall Progress</span>
              <span className="font-mono text-slate-200">{metrics.totalSolvedCount}/{metrics.totalProblemsCount}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-500" 
                style={{ width: `${metrics.percentCompleted}%` }}
              />
            </div>
          </div>

          <button
            onClick={clearAllProgress}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-rose-950 hover:bg-rose-950/10 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-all duration-250 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Progress</span>
          </button>
        </div>
      </aside>
    </>
  );
};
