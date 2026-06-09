import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  Brain,
  Cpu,
  Trophy,
  FolderOpen,
  Trash2,
  Sun,
  Moon,
  LogOut,
  X
} from 'lucide-react';
import { useTracker } from '../../hooks/useTracker';
import type { Theme } from '../../hooks/useTheme';
import acmLogoDark from '../../assets/acm-logo-dark.png';
import acmLogoBright from '../../assets/acm-logo-bright.png';

type ViewType = 'dashboard' | 'dsa' | 'company' | 'aptitude' | 'technical' | 'contests' | 'resources';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  mobileOpen,
  setMobileOpen,
  theme,
  toggleTheme,
  onLogout,
}) => {
  const { metrics, clearAllProgress } = useTracker();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Sheets', icon: BookOpen },
    { id: 'company', label: 'Company & OA Prep', icon: Building2 },
    { id: 'aptitude', label: 'Aptitude Practice', icon: Brain },
    { id: 'technical', label: 'Technical Concepts', icon: Cpu },
    { id: 'contests', label: 'Contests', icon: Trophy },
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
          className="fixed inset-0 bg-zinc-950/70 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-300 lg:translate-x-0 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-1.5">
            <img
              src={theme === 'dark' ? acmLogoDark : acmLogoBright}
              alt="ACM-CEG Student Chapter"
              className={`h-9 w-auto rounded-md ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
            />
            <div>
              <h1 className="font-bold text-zinc-100 text-lg leading-tight tracking-tight">C.O.D.E</h1>
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">Intern and Placement Prep Tracker</span>
            </div>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 lg:hidden"
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
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Mini Profile / Reset Progress */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          {/* Mini progress stats */}
          <div className="mb-4 p-3 rounded-lg bg-zinc-950/40 border border-zinc-800/50">
            <div className="flex justify-between text-xs font-medium text-zinc-400 mb-1.5">
              <span>Overall progress</span>
              <span className="font-mono text-zinc-200">{metrics.totalSolvedCount}/{metrics.totalProblemsCount}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.percentCompleted}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-2 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <button
            onClick={clearAllProgress}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-2 rounded-lg border border-zinc-800 hover:border-rose-900 hover:bg-rose-950/10 text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset all progress</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
