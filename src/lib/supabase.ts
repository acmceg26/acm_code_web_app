import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase env vars. Create a .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).',
  );
}

const REMEMBER_KEY = 'code.auth.remember';

/**
 * Record the "remember me" choice. Must be called BEFORE signing in so the
 * session gets written to the right store. Defaults to remembered.
 */
export function setRemember(remember: boolean): void {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
  } catch {
    /* storage unavailable (e.g. private mode) */
  }
}

function rememberEnabled(): boolean {
  try {
    return localStorage.getItem(REMEMBER_KEY) !== 'false';
  } catch {
    return true;
  }
}

/**
 * Remember-aware session storage:
 *  - remember ON  → localStorage  (survives restarts; auto-refresh keeps it alive
 *                   for a long time — the user is let straight in on later visits)
 *  - remember OFF → sessionStorage (cleared when the browser/tab closes)
 * Reads fall back across both stores so the session is found wherever it lives.
 */
const rememberAwareStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key) ?? sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (rememberEnabled()) {
        localStorage.setItem(key, value);
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

// The anon key is safe to ship in the frontend: Row-Level Security on every
// table restricts each user to their own rows.
export const supabase = createClient(url, anonKey, {
  auth: {
    storage: rememberAwareStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
