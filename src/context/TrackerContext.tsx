import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import dsaData from '../data/dsaSheets.json';
import companyData from '../data/companies.json';
import { supabase } from '../lib/supabase';
import {
  fetchSolvedProblems,
  addSolvedProblem,
  addSolvedProblems,
  removeSolvedProblem,
  clearSolvedProblems,
} from '../services/progressService';

export interface SolvedProblem {
  problemId: string;
  title: string;
  topic: string;
  difficulty: string;
  platform: string;
  solvedAtTimestamp: number;
}

export interface TrackerContextType {
  solvedProblems: SolvedProblem[];
  notes: Record<string, string>;
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

const LOCAL_SOLVED_KEY = 'dsa_tracker_solved';

function readLocalSolved(): SolvedProblem[] {
  try {
    const raw = localStorage.getItem(LOCAL_SOLVED_KEY);
    return raw ? (JSON.parse(raw) as SolvedProblem[]) : [];
  } catch {
    return [];
  }
}

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  // Tracks which user's progress is currently loaded, so we only refetch when
  // the signed-in user actually changes (auth fires on every token refresh).
  const loadedUserRef = useRef<string | null>(null);

  // Solved problems are DB-backed (cross-device). Subscribe to auth: on sign-in
  // (or session restore on a new device) fetch this user's progress; on sign-out
  // clear it. Notes remain device-local (loaded from localStorage below).
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('dsa_tracker_notes');
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } catch (e) {
      console.error('Error reading notes from localStorage:', e);
    }

    let active = true;

    const handleSession = async (uid: string | null) => {
      if (uid === loadedUserRef.current) return; // no change
      loadedUserRef.current = uid;

      if (!uid) {
        setSolvedProblems([]);
        return;
      }

      const dbRows = await fetchSolvedProblems();
      if (!active) return;

      // One-time migration: if this account has no DB progress yet but there's
      // progress saved locally on this device, push it up so nothing is lost.
      const local = readLocalSolved();
      if (dbRows.length === 0 && local.length > 0) {
        await addSolvedProblems(
          local.map((p) => ({
            problemId: p.problemId,
            title: p.title,
            topic: p.topic,
            difficulty: p.difficulty,
          })),
        );
        if (!active) return;
        setSolvedProblems(local);
      } else {
        setSolvedProblems(dbRows.map((r) => ({ ...r, platform: '' })));
      }

      // The DB is now the source of truth; drop the local cache.
      localStorage.removeItem(LOCAL_SOLVED_KEY);
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

  // Sync notes to localStorage
  const saveNotesState = (updatedNotes: Record<string, string>) => {
    setNotes(updatedNotes);
    localStorage.setItem('dsa_tracker_notes', JSON.stringify(updatedNotes));
  };

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

  const saveNote = (problemId: string, noteText: string) => {
    const updated = { ...notes, [problemId]: noteText };
    saveNotesState(updated);
  };

  const getNote = (problemId: string) => {
    return notes[problemId] || '';
  };

  const clearAllProgress = async () => {
    if (window.confirm('Are you sure you want to clear all your progress and notes? This cannot be undone.')) {
      const prev = solvedProblems;
      setSolvedProblems([]);
      saveNotesState({});
      const res = await clearSolvedProblems();
      if (!res.ok) {
        console.error('Failed to clear progress:', res.message);
        setSolvedProblems(prev);
      }
    }
  };

  // Compile metrics
  // Extract all problems to find totals by difficulty/topic
  const allProblemsMap = new Map<string, { id: string; title: string; topic: string; difficulty: 'Easy' | 'Medium' | 'Hard' }>();
  
  // 1. Gather from sheets (sheet -> level -> topic -> problems)
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

  // 2. Gather from companies (in case they aren't in the sheets)
  companyData.forEach((company) => {
    company.coreQuestions.forEach((prob) => {
      allProblemsMap.set(prob.id, {
        id: prob.id,
        title: prob.title,
        topic: 'Company Core',
        difficulty: prob.difficulty as 'Easy' | 'Medium' | 'Hard',
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
