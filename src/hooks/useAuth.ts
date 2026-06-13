import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  rollNumber?: string;
  department?: string;
  campus?: string;
  year?: number;
  batch?: string;
}

// Map a Supabase session into our app User shape, reading the student details
// from user_metadata (set at signup).
function mapUser(session: Session | null): User | null {
  const u = session?.user;
  if (!u) return null;
  const m = (u.user_metadata ?? {}) as Record<string, unknown>;
  const yearRaw = m.year;
  return {
    id: u.id,
    email: u.email ?? '',
    name: typeof m.name === 'string' ? m.name : undefined,
    rollNumber: typeof m.roll_number === 'string' ? m.roll_number : undefined,
    department: typeof m.department === 'string' ? m.department : undefined,
    campus: typeof m.campus === 'string' ? m.campus : undefined,
    year: typeof yearRaw === 'number' ? yearRaw : yearRaw ? Number(yearRaw) : undefined,
    batch: typeof m.batch === 'string' ? m.batch : undefined,
  };
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Restore any existing session on load (lets "remembered" users straight in).
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(mapUser(data.session));
      setLoading(false);
    });

    // React to sign-in / sign-out / token-refresh across this and other tabs.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session));
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAuthenticated: user !== null, loading };
}
