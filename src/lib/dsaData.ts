import bundled from '../data/dsaSheets.json';
import { parseCsv } from './csv';

export interface DsaProblem {
  id: string;
  title: string;
  difficulty: string;
  platforms: { leetcode?: string; gfg?: string };
  videoSolution?: string;
}

export interface DsaTopic {
  name: string;
  problems: DsaProblem[];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

/**
 * Derive a STABLE problem id when the sheet's ID cell is left blank.
 *
 * The id comes from the problem link (LeetCode/GFG slug), so:
 *  - it's deterministic — the same link always yields the same id;
 *  - the same problem added under two topics (same link) shares one id, so a
 *    solve marks it everywhere, exactly like an explicit shared id.
 * Falls back to a title slug only when there's no link.
 */
export function deriveId(link: string, title: string): string {
  const url = (link || '').trim();
  const lc = url.match(/leetcode\.com\/problems\/([^/?#]+)/i);
  if (lc) return `lc-${lc[1].toLowerCase()}`;

  if (/geeksforgeeks\.org/i.test(url)) {
    const prob = url.match(/\/problems\/([^/?#]+)/i);
    if (prob) return `gfg-${slugify(prob[1])}`;
    // e.g. .../dsa/some-article-name/  →  take the last word-y path segment
    const segs = url.replace(/[?#].*$/, '').split('/').filter((s) => s && !/^\d+$/.test(s));
    const last = segs[segs.length - 1];
    if (last) return `gfg-${slugify(last)}`;
  }

  if (url) return `q-${slugify(url.replace(/^https?:\/\//i, ''))}`;
  return `t-${slugify(title)}`;
}

// Normalise the difficulty string coming from a sheet into the canonical
// Easy/Medium/Hard the DB check-constraint and metrics expect.
function normalizeDifficulty(raw: string): string {
  if (/hard/i.test(raw)) return 'Hard';
  if (/medium/i.test(raw)) return 'Medium';
  if (/easy/i.test(raw)) return 'Easy';
  return raw || 'Medium';
}

// Merge a flat list of (topicName, problem) into ordered topics, de-duplicating
// problems by id within each topic (first occurrence wins).
function collect(entries: Array<{ topic: string; problem: DsaProblem }>): DsaTopic[] {
  const map = new Map<string, { name: string; problems: DsaProblem[]; seen: Set<string> }>();
  for (const { topic, problem } of entries) {
    let e = map.get(topic);
    if (!e) {
      e = { name: topic, problems: [], seen: new Set() };
      map.set(topic, e);
    }
    if (e.seen.has(problem.id)) continue;
    e.seen.add(problem.id);
    e.problems.push(problem);
  }
  return [...map.values()].map((e) => ({ name: e.name, problems: e.problems }));
}

// The bundled JSON, flattened to topics — used as the instant-paint default and
// the offline fallback when the sheet can't be fetched.
export function bundledTopics(): DsaTopic[] {
  const entries: Array<{ topic: string; problem: DsaProblem }> = [];
  bundled.sheets.forEach((s) =>
    s.levels.forEach((l) =>
      l.topics.forEach((t) =>
        t.problems.forEach((p) => entries.push({ topic: t.name, problem: p as DsaProblem })),
      ),
    ),
  );
  return collect(entries);
}

// Parse a published Google-Sheet CSV into topics. Columns are matched by header
// name (case-insensitive), so column order doesn't matter. Required: Topic, ID,
// Title. Optional: Difficulty, LeetCode, GFG, Video.
export function topicsFromCsv(text: string): DsaTopic[] {
  const rows = parseCsv(text).filter((r) => r.some((c) => c.trim() !== ''));
  if (rows.length < 2) throw new Error('Sheet has no data rows');

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const c = {
    topic: idx('topic'),
    id: idx('id'),
    title: idx('title'),
    difficulty: idx('difficulty'),
    leetcode: idx('leetcode'),
    gfg: idx('gfg'),
    video: idx('video'),
  };
  // ID is optional — when blank it's derived from the link (see deriveId).
  if (c.topic < 0 || c.title < 0) {
    throw new Error('Sheet must have Topic and Title columns');
  }

  const get = (row: string[], i: number) => (i >= 0 && i < row.length ? (row[i] || '').trim() : '');

  const entries: Array<{ topic: string; problem: DsaProblem }> = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const topic = get(row, c.topic);
    const title = get(row, c.title);
    if (!topic || !title) continue; // skip incomplete rows

    const platforms: { leetcode?: string; gfg?: string } = {};
    const lc = get(row, c.leetcode);
    if (lc) platforms.leetcode = lc;
    const gfg = get(row, c.gfg);
    if (gfg) platforms.gfg = gfg;

    // Explicit id wins (keeps existing progress stable); otherwise derive one.
    const id = get(row, c.id) || deriveId(lc || gfg, title);

    const problem: DsaProblem = {
      id,
      title,
      difficulty: normalizeDifficulty(get(row, c.difficulty)),
      platforms,
    };
    const video = get(row, c.video);
    if (video) problem.videoSolution = video;

    entries.push({ topic, problem });
  }

  return collect(entries);
}
