import { supabase } from '../lib/supabase';

export interface ProfileUpdate {
  name: string;
  rollNumber: string;
  year: number;
  department?: string;
  campus?: string;
  batch?: string;
}

export type UpdateProfileResult = { ok: true } | { ok: false; message: string };

/**
 * Updates the signed-in user's details in BOTH places they live:
 *  1. the `profiles` table (canonical store, RLS-guarded to the owner)
 *  2. auth user_metadata — so the active session refreshes and `useAuth`
 *     reflects the change immediately (the app reads display details from
 *     session metadata, not from a profiles query).
 *
 * Email is intentionally NOT editable here — changing it requires a separate
 * verification flow and would break the roll-number ⇄ email invariant.
 */
export async function updateProfile(input: ProfileUpdate): Promise<UpdateProfileResult> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { ok: false, message: 'You are not signed in.' };

  const fields = {
    name: input.name,
    roll_number: input.rollNumber,
    year: input.year,
    department: input.department ?? null,
    campus: input.campus ?? null,
    batch: input.batch ?? null,
  };

  // 1. Canonical store.
  const { error: profileError } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId);

  if (profileError) return { ok: false, message: profileError.message };

  // 2. Mirror into the session so the UI updates without a reload. This fires
  //    an onAuthStateChange (USER_UPDATED) that useAuth is subscribed to.
  const { error: metaError } = await supabase.auth.updateUser({ data: fields });
  if (metaError) return { ok: false, message: metaError.message };

  return { ok: true };
}
