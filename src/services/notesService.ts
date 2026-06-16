import { supabase } from '../lib/supabase';

export type Result = { ok: true } | { ok: false; message: string };

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/** All of the signed-in user's notes, as a { problemId: body } map. */
export async function fetchNotes(): Promise<Record<string, string>> {
  const uid = await currentUserId();
  if (!uid) return {};

  // Explicit user_id filter (defense in depth alongside RLS).
  const { data, error } = await supabase
    .from('notes')
    .select('problem_id, body')
    .eq('user_id', uid);

  if (error) {
    console.error('fetchNotes:', error.message);
    return {};
  }

  const map: Record<string, string> = {};
  (data ?? []).forEach((r) => {
    map[r.problem_id as string] = (r.body as string) ?? '';
  });
  return map;
}

/**
 * Save a note. An empty/whitespace body removes the note row entirely so we
 * don't accumulate blank rows. Upserts on (user_id, problem_id).
 */
export async function saveNote(problemId: string, body: string): Promise<Result> {
  const uid = await currentUserId();
  if (!uid) return { ok: false, message: 'Not signed in.' };

  if (!body.trim()) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('user_id', uid)
      .eq('problem_id', problemId);
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  }

  const { error } = await supabase
    .from('notes')
    .upsert({ user_id: uid, problem_id: problemId, body }, { onConflict: 'user_id,problem_id' });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

/** Wipe all of the signed-in user's notes. */
export async function clearNotes(): Promise<Result> {
  const uid = await currentUserId();
  if (!uid) return { ok: false, message: 'Not signed in.' };

  const { error } = await supabase.from('notes').delete().eq('user_id', uid);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
