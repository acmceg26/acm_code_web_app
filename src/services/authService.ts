import { supabase, setRemember } from '../lib/supabase';

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  year: number;
  rollNumber: string;
  department?: string;
  campus?: string;
  batch?: string;
}

export type SignUpResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { ok: false; reason: 'exists' | 'error'; message: string };

const EXISTS_MESSAGE = 'A user with this email already exists.';

/**
 * Creates a new auth user. The student details are passed as user_metadata
 * (snake_case keys) so the `handle_new_user` trigger can populate the
 * `profiles` row automatically.
 *
 * "User already exists" is detected in BOTH Supabase configurations:
 *  - email confirmation OFF → signUp returns an explicit "already registered" error
 *  - email confirmation ON  → signUp hides duplicates (anti-enumeration) and
 *    instead returns a user with an empty `identities` array
 */
export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  // A freshly created account stays signed in long-term by default.
  setRemember(true);

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        year: input.year,
        roll_number: input.rollNumber,
        department: input.department ?? null,
        campus: input.campus ?? null,
        batch: input.batch ?? null,
      },
    },
  });

  if (error) {
    if (/already registered|already exists|user already/i.test(error.message)) {
      return { ok: false, reason: 'exists', message: EXISTS_MESSAGE };
    }
    return { ok: false, reason: 'error', message: error.message };
  }

  // Anti-enumeration case: existing email returns a user with no identities.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { ok: false, reason: 'exists', message: EXISTS_MESSAGE };
  }

  // No session means email confirmation is required before the user can sign in.
  return { ok: true, needsEmailConfirmation: !data.session };
}

export type SignInResult = { ok: true } | { ok: false; message: string };

/**
 * Signs an existing user in. `remember` decides whether the session is stored
 * long-term (localStorage) or only for the current browser session.
 */
export async function signIn(email: string, password: string, remember: boolean): Promise<SignInResult> {
  setRemember(remember);

  // Distinguish "not registered" from "wrong password" — Supabase returns the
  // same error for both, so check existence first via a server-side RPC.
  const { data: exists, error: existsError } = await supabase.rpc('user_exists', { p_email: email });
  if (!existsError && exists === false) {
    return { ok: false, message: 'No account found with this email. Please sign up first.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (/invalid login credentials/i.test(error.message)) {
      return { ok: false, message: 'Incorrect password.' };
    }
    if (/email not confirmed/i.test(error.message)) {
      return { ok: false, message: 'Please confirm your email before signing in.' };
    }
    return { ok: false, message: error.message };
  }

  return { ok: true };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export type ResetPasswordResult = { ok: true } | { ok: false; message: string };

/**
 * Email-less password reset. Calls the `reset-password` Edge Function, which
 * updates the password directly via the service_role key (the browser cannot
 * change another user's password). See the function for the security caveat.
 */
export async function resetPassword(email: string, password: string): Promise<ResetPasswordResult> {
  const { data, error } = await supabase.functions.invoke('reset-password', {
    body: { email, password },
  });

  if (error) {
    // Non-2xx responses surface here; the Response is on error.context.
    let message = 'Could not reset the password. Please try again.';
    try {
      const ctx = (error as { context?: Response }).context;
      if (ctx && typeof ctx.json === 'function') {
        const body = await ctx.json();
        if (body?.error) message = body.error;
      }
    } catch {
      /* keep the generic message */
    }
    return { ok: false, message };
  }

  if (data?.ok) return { ok: true };
  return { ok: false, message: data?.error ?? 'Could not reset the password.' };
}
