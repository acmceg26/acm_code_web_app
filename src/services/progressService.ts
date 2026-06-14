import { supabase } from '../lib/supabase';

// What the app needs to persist a solved problem. `platform` is intentionally
// not stored (the column was dropped) — the link/platform lives in the bundled
// JSON, keyed by problem_id.
export interface SolvedProblemInput {
  problemId: string;
  title: string;
  topic: string;
  difficulty: string;
}

// A solved problem as read back from the DB.
export interface SolvedRow {
  problemId: string;
  title: string;
  topic: string;
  difficulty: string;
  solvedAtTimestamp: number;
}

export type Result = { ok: true } | { ok: false; message: string };

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/** All problems the signed-in user has marked solved, newest first. */
export async function fetchSolvedProblems(): Promise<SolvedRow[]> {
  const { data, error } = await supabase
    .from('solved_problems')
    .select('problem_id, title, topic, difficulty, solved_at')
    .order('solved_at', { ascending: false });

  if (error) {
    console.error('fetchSolvedProblems:', error.message);
    return [];
  }

  return (data ?? []).map((r) => ({
    problemId: r.problem_id as string,
    title: (r.title as string) ?? '',
    topic: (r.topic as string) ?? '',
    difficulty: (r.difficulty as string) ?? '',
    solvedAtTimestamp: r.solved_at ? new Date(r.solved_at as string).getTime() : Date.now(),
  }));
}

/** Mark one problem solved (idempotent via upsert on user_id + problem_id). */
export async function addSolvedProblem(p: SolvedProblemInput): Promise<Result> {
  const uid = await currentUserId();
  if (!uid) return { ok: false, message: 'Not signed in.' };

  const { error } = await supabase
    .from('solved_problems')
    .upsert(
      { user_id: uid, problem_id: p.problemId, title: p.title, topic: p.topic, difficulty: p.difficulty },
      { onConflict: 'user_id,problem_id' },
    );

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

/** Bulk upsert — used for the one-time localStorage → DB migration. */
export async function addSolvedProblems(list: SolvedProblemInput[]): Promise<Result> {
  if (list.length === 0) return { ok: true };
  const uid = await currentUserId();
  if (!uid) return { ok: false, message: 'Not signed in.' };

  const rows = list.map((p) => ({
    user_id: uid,
    problem_id: p.problemId,
    title: p.title,
    topic: p.topic,
    difficulty: p.difficulty,
  }));

  const { error } = await supabase
    .from('solved_problems')
    .upsert(rows, { onConflict: 'user_id,problem_id' });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

/** Un-mark a single problem. */
export async function removeSolvedProblem(problemId: string): Promise<Result> {
  const uid = await currentUserId();
  if (!uid) return { ok: false, message: 'Not signed in.' };

  const { error } = await supabase
    .from('solved_problems')
    .delete()
    .eq('user_id', uid)
    .eq('problem_id', problemId);

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

/** Wipe all of the signed-in user's solved problems. */
export async function clearSolvedProblems(): Promise<Result> {
  const uid = await currentUserId();
  if (!uid) return { ok: false, message: 'Not signed in.' };

  const { error } = await supabase.from('solved_problems').delete().eq('user_id', uid);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
