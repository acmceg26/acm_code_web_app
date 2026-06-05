import { useState } from 'react';
import { TrackerProvider } from './context/TrackerContext';
import { Sidebar } from './components/features/Sidebar';
import { Dashboard } from './views/Dashboard';
import { DsaSheets } from './views/DsaSheets';
import { CompanyPrep } from './views/CompanyPrep';
import { AptitudePractice } from './views/AptitudePractice';
import { Resources } from './views/Resources';
import { Menu } from 'lucide-react';

type ViewType = 'dashboard' | 'dsa' | 'company' | 'aptitude' | 'resources';

function AppContent() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Mobile Header Bar */}
        <header className="flex items-center justify-between lg:hidden px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center">
              <span className="font-extrabold text-white text-xs">ACM</span>
            </div>
            <span className="font-extrabold text-slate-100 text-sm tracking-tight">PrepVault</span>
          </div>
          
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-450 hover:text-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
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
