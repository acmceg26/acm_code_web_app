import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import dsaData from '../data/dsaSheets.json';
import { supabase } from '../lib/supabase';
import {
  fetchSolvedProblems,
  addSolvedProblem,
  removeSolvedProblem,
  clearSolvedProblems,
} from '../services/progressService';
import {
  fetchNotes,
  saveNote as persistNote,
  clearNotes,
} from '../services/notesService';

export interface SolvedProblem {
  problemId: string;
  title: string;
  topic: string;
  difficulty: string;
  platform: string;
  solvedAtTimestamp: number;
}

export type NoteSaveState = 'saving' | 'saved' | 'error';

export interface TrackerContextType {
  solvedProblems: SolvedProblem[];
  notes: Record<string, string>;
  noteStatus: Record<string, NoteSaveState>;
  toggleProblem: (problem: Omit<SolvedProblem, 'solvedAtTimestamp'>) => void;
  isSolved: (problemId: string) => boolean;
  saveNote: (problemId: string, noteText: string) => void;
  getNote: (problemId: string) => string;
  clearAllProgress: () => void;
  metrics: {
    totalProblemsCount: number;
    totalSolvedCount: number;
    easyTotal: number;
    easySolved: number;
    mediumTotal: number;
    mediumSolved: number;
    hardTotal: number;
    hardSolved: number;
    percentCompleted: number;
    solvedByTopic: Record<string, number>;
    totalByTopic: Record<string, number>;
  };
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [noteStatus, setNoteStatus] = useState<Record<string, NoteSaveState>>({});
  // Tracks which user's progress is currently loaded, so we only refetch when
  // the signed-in user actually changes (auth fires on every token refresh).
  const loadedUserRef = useRef<string | null>(null);
  // Per-problem debounce timers for persisting notes to the DB.
  const noteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Solved problems AND notes are DB-backed (cross-device, per-user). Subscribe
  // to auth: on sign-in (or session restore on a new device) fetch this user's
  // progress and notes; on sign-out clear them so nothing leaks across accounts.
  useEffect(() => {
    let active = true;

    const handleSession = async (uid: string | null) => {
      if (uid === loadedUserRef.current) return; // no change
      loadedUserRef.current = uid;

      if (!uid) {
        setSolvedProblems([]);
        setNotes({});
        setNoteStatus({});
        return;
      }

      const [dbRows, dbNotes] = await Promise.all([fetchSolvedProblems(), fetchNotes()]);
      if (!active) return;
      setSolvedProblems(dbRows.map((r) => ({ ...r, platform: '' })));
      setNotes(dbNotes);
    };

    supabase.auth.getSession().then(({ data }) => handleSession(data.session?.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isSolved = (problemId: string) => {
    return solvedProblems.some((p) => p.problemId === problemId);
  };

  // Optimistic toggle: update the UI immediately, persist to the DB in the
  // background, and roll back if the write fails.
  const toggleProblem = async (problem: Omit<SolvedProblem, 'solvedAtTimestamp'>) => {
    const prev = solvedProblems;
    const exists = prev.some((p) => p.problemId === problem.problemId);

    if (exists) {
      setSolvedProblems(prev.filter((p) => p.problemId !== problem.problemId));
      const res = await removeSolvedProblem(problem.problemId);
      if (!res.ok) {
        console.error('Failed to remove solved problem:', res.message);
        setSolvedProblems(prev);
      }
    } else {
      const newSolved: SolvedProblem = { ...problem, solvedAtTimestamp: Date.now() };
      setSolvedProblems([newSolved, ...prev]);
      const res = await addSolvedProblem({
        problemId: problem.problemId,
        title: problem.title,
        topic: problem.topic,
        difficulty: problem.difficulty,
      });
      if (!res.ok) {
        console.error('Failed to add solved problem:', res.message);
        setSolvedProblems(prev);
      }
    }
  };

  // Update the note locally right away (responsive typing), then debounce the
  // DB write so we persist ~600ms after the user stops typing rather than on
  // every keystroke.
  const saveNote = (problemId: string, noteText: string) => {
    setNotes((prev) => ({ ...prev, [problemId]: noteText }));
    setNoteStatus((prev) => ({ ...prev, [problemId]: 'saving' }));

    if (noteTimers.current[problemId]) clearTimeout(noteTimers.current[problemId]);
    noteTimers.current[problemId] = setTimeout(async () => {
      const res = await persistNote(problemId, noteText);
      setNoteStatus((prev) => ({ ...prev, [problemId]: res.ok ? 'saved' : 'error' }));
      if (!res.ok) console.error('Failed to save note:', res.message);
    }, 600);
  };

  const getNote = (problemId: string) => {
    return notes[problemId] || '';
  };

  const clearAllProgress = async () => {
    if (window.confirm('Are you sure you want to clear all your progress and notes? This cannot be undone.')) {
      const prevSolved = solvedProblems;
      const prevNotes = notes;
      setSolvedProblems([]);
      setNotes({});

      const [solvedRes, notesRes] = await Promise.all([clearSolvedProblems(), clearNotes()]);
      if (!solvedRes.ok) {
        console.error('Failed to clear progress:', solvedRes.message);
        setSolvedProblems(prevSolved);
      }
      if (!notesRes.ok) {
        console.error('Failed to clear notes:', notesRes.message);
        setNotes(prevNotes);
      }
    }
  };

  // Compile metrics
  // Extract all problems to find totals by difficulty/topic
  const allProblemsMap = new Map<string, { id: string; title: string; topic: string; difficulty: 'Easy' | 'Medium' | 'Hard' }>();
  
  // Gather from sheets (sheet -> level -> topic -> problems).
  // NOTE: Company & OA Prep is currently "coming soon" / disabled, so its core
  // questions are intentionally excluded from the totals — only available
  // sections count toward the problem total.
  dsaData.sheets.forEach((sheet) => {
    sheet.levels.forEach((level) => {
      level.topics.forEach((topic) => {
        topic.problems.forEach((prob) => {
          allProblemsMap.set(prob.id, {
            id: prob.id,
            title: prob.title,
            topic: topic.name,
            difficulty: prob.difficulty as 'Easy' | 'Medium' | 'Hard',
          });
        });
      });
    });
  });

  const totalProblemsCount = allProblemsMap.size;
  
  let easyTotal = 0;
  let mediumTotal = 0;
  let hardTotal = 0;
  const totalByTopic: Record<string, number> = {};

  allProblemsMap.forEach((prob) => {
    if (prob.difficulty === 'Easy') easyTotal++;
    else if (prob.difficulty === 'Medium') mediumTotal++;
    else if (prob.difficulty === 'Hard') hardTotal++;

    totalByTopic[prob.topic] = (totalByTopic[prob.topic] || 0) + 1;
  });

  // Calculate solved breakdown
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;
  const solvedByTopic: Record<string, number> = {};

  solvedProblems.forEach((solved) => {
    // Look up in our known problems map or fallback to the difficulty/topic present on the solved object
    const known = allProblemsMap.get(solved.problemId);
    const difficulty = known ? known.difficulty : solved.difficulty;
    const topic = known ? known.topic : solved.topic;

    if (difficulty === 'Easy') easySolved++;
    else if (difficulty === 'Medium') mediumSolved++;
    else if (difficulty === 'Hard') hardSolved++;

    solvedByTopic[topic] = (solvedByTopic[topic] || 0) + 1;
  });

  const totalSolvedCount = solvedProblems.length;
  const percentCompleted = totalProblemsCount > 0 
    ? Math.round((totalSolvedCount / totalProblemsCount) * 100) 
    : 0;

  const metrics = {
    totalProblemsCount,
    totalSolvedCount,
    easyTotal,
    easySolved,
    mediumTotal,
    mediumSolved,
    hardTotal,
    hardSolved,
    percentCompleted,
    solvedByTopic,
    totalByTopic,
  };

  return (
    <TrackerContext.Provider value={{
      solvedProblems,
      notes,
      noteStatus,
      toggleProblem,
      isSolved,
      saveNote,
      getNote,
      clearAllProgress,
      metrics
    }}>
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (context === undefined) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
