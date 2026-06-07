import { useCallback, useEffect, useState } from 'react';

export interface User {
  name?: string;
  email: string;
}

const STORAGE_KEY = 'auth_user';

// Frontend-only mock session. When "remember me" is on we persist to
// localStorage (survives restarts); otherwise sessionStorage (clears when the
// tab closes). No backend is involved.
function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

// First name for greetings — only from the registered name (set at signup).
// Returns null when there's no name, so the greeting stays plain.
export function getFirstName(user: User | null): string | null {
  if (user?.name && user.name.trim()) {
    return user.name.trim().split(/\s+/)[0];
  }
  return null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(readStoredUser);

  // Keep this tab in sync if another tab logs in/out.
  useEffect(() => {
    const sync = () => setUser(readStoredUser());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const login = useCallback((nextUser: User, remember: boolean) => {
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      other.removeItem(STORAGE_KEY);
    } catch {
      // storage unavailable (e.g. private mode) — session stays in memory only
    }
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  return { user, isAuthenticated: user !== null, login, logout };
}
