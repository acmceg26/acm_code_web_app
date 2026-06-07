import { useState } from 'react';
import { TrackerProvider } from './context/TrackerContext';
import { Sidebar } from './components/features/Sidebar';
import { Dashboard } from './views/Dashboard';
import { DsaSheets } from './views/DsaSheets';
import { CompanyPrep } from './views/CompanyPrep';
import { AptitudePractice } from './views/AptitudePractice';
import { Resources } from './views/Resources';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import acmLogoDark from './assets/acm-logo-dark.png';
import acmLogoBright from './assets/acm-logo-bright.png';

type ViewType = 'dashboard' | 'dsa' | 'company' | 'aptitude' | 'resources';

function AppContent() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'dsa':
        return <DsaSheets />;
      case 'company':
        return <CompanyPrep />;
      case 'aptitude':
        return <AptitudePractice />;
      case 'resources':
        return <Resources />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen app-bg text-zinc-100 flex">
      {/* Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Mobile Header Bar */}
        <header className="flex items-center justify-between lg:hidden px-6 py-4 bg-zinc-900 border-b border-zinc-800 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <img
              src={theme === 'dark' ? acmLogoDark : acmLogoBright}
              alt="ACM-CEG Student Chapter"
              className={`h-7 w-auto rounded ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
            />
            <span className="font-bold text-zinc-100 text-sm tracking-tight">PrepVault</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* View Content Area */}
        <main className="flex-grow p-6 lg:p-10 max-w-7xl w-full mx-auto pb-20">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <TrackerProvider>
      <AppContent />
    </TrackerProvider>
  );
}

export default App;
