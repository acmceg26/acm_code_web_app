import React from 'react';
import { Sun, Moon, BookOpen, Building2, Brain } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';
import acmLogoDark from '../../assets/acm-logo-dark.png';
import acmLogoBright from '../../assets/acm-logo-bright.png';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  theme: Theme;
  toggleTheme: () => void;
}

const FEATURES = [
  { icon: BookOpen, label: 'Curated DSA sheets' },
  { icon: Building2, label: 'Company prep' },
  { icon: Brain, label: 'Aptitude practice' },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
  theme,
  toggleTheme,
}) => {
  const logo = theme === 'dark' ? acmLogoDark : acmLogoBright;
  const logoBg = theme === 'dark' ? 'bg-black' : 'bg-white';

  return (
    <div className="min-h-screen app-bg text-zinc-100 flex">
      {/* Left: product preview (desktop only) */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-1/2 relative overflow-hidden border-r border-zinc-900 flex-col p-12">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-100 h-80 rounded-full bg-blue-500/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-100 h-80 rounded-full bg-blue-500/25 blur-3xl" />

        {/* Brand + headline + features, grouped and vertically centered (left-aligned) */}
        <div className="relative flex-1 flex flex-col items-start justify-center gap-12 max-w-md mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="ACM-CEG Student Chapter" className={`h-10 w-auto rounded-md ${logoBg}`} />
            <div>
              <h1 className="font-bold text-zinc-100 text-lg leading-tight tracking-tight">C.O.D.E</h1>
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">Intern and Placement Prep Tracker</span>
            </div>
          </div>

          {/* Headline + description */}
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-zinc-100 tracking-tight leading-snug">
              Your placement prep,<br></br>{' '}
              <span className="bg-blue-500/15 text-zinc-100 px-1.5 py-0.5 rounded-md box-decoration-clone">
                all in one place
              </span>
              .
            </h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
              Track sheets, company rounds, and aptitude — and watch your progress add up by difficulty.
            </p>
          </div>

          {/* Feature points, stacked horizontally */}
          <div className="grid grid-cols-3 gap-10 w-full max-w-md">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-lg border border-zinc-800 bg-zinc-900/40"
              >
                <span className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-xs font-medium text-zinc-300 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-8 text-center text-xs text-zinc-500">ACM-CEG Student Chapter</div>
      </aside>

      {/* Right: form */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-end p-4">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm animate-fade-in-up">
            {/* Brand (mobile only — desktop shows it in the left panel) */}
            <div className="lg:hidden flex flex-col items-center gap-3 mb-7">
              <img src={logo} alt="ACM-CEG Student Chapter" className={`h-11 w-auto rounded-md ${logoBg}`} />
              <div className="text-center">
                <h1 className="font-bold text-zinc-100 text-lg leading-tight tracking-tight">C.O.D.E</h1>
                <span className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">Intern and Placement Prep Tracker</span>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
              <p className="text-sm text-zinc-500 mt-1 mb-6">{subtitle}</p>
              {children}
            </div>

            <p className="text-center text-sm text-zinc-400 mt-5">{footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
