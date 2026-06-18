import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { TrackerProvider } from './context/TrackerContext';
import { Sidebar } from './components/features/Sidebar';
import { Dashboard } from './views/Dashboard';
import { DsaSheets } from './views/DsaSheets';
import { CompanyPrep } from './views/CompanyPrep';
import { AptitudePractice } from './views/AptitudePractice';
import { TechnicalConcepts } from './views/TechnicalConcepts';
import { Contests } from './views/Contests';
import { Resources } from './views/Resources';
import { Profile } from './views/Profile';
import { Login } from './views/auth/Login';
import { Signup } from './views/auth/Signup';
import { ForgotPassword } from './views/auth/ForgotPassword';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme, type Theme } from './hooks/useTheme';
import { useAuth, getFirstName } from './hooks/useAuth';
import { signOut } from './services/authService';
import acmLogoDark from './assets/acm-logo-dark.png';
import acmLogoBright from './assets/acm-logo-bright.png';

interface AppLayoutProps {
  theme: Theme;
  toggleTheme: () => void;
  onLogout: () => void;
}

// Shared shell for all authenticated pages. The active section is rendered by
// the router via <Outlet />, so the URL is the single source of truth for which
// page is shown (refresh, back/forward, and shareable links all work).
function AppLayout({ theme, toggleTheme, onLogout }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen app-bg text-zinc-100 flex">
      {/* Navigation Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
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
            <span className="font-bold text-zinc-100 text-sm tracking-tight">C.O.D.E</span>
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Root() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, loading } = useAuth();

  // While the session is being restored, avoid flashing the login screen.
  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  const firstName = getFirstName(user);

  return (
    <Routes>
      {/* Public auth routes — redirect away if already signed in. */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login theme={theme} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup theme={theme} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword theme={theme} toggleTheme={toggleTheme} />}
      />

      {/* Protected app — one URL per section, under a shared layout. The layout
          element doubles as the auth guard: unauthenticated users are bounced
          to /login before any child page renders. */}
      <Route
        element={
          isAuthenticated ? (
            <AppLayout theme={theme} toggleTheme={toggleTheme} onLogout={signOut} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard userName={firstName} />} />
        <Route path="/dsa" element={<DsaSheets />} />
        <Route path="/company" element={<CompanyPrep />} />
        <Route path="/aptitude" element={<AptitudePractice />} />
        <Route path="/technical" element={<TechnicalConcepts />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <TrackerProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </TrackerProvider>
  );
}

export default App;
