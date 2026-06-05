import React, { createContext, useContext, useState, useEffect } from 'react';
import dsaData from '../data/dsaSheets.json';
import companyData from '../data/companies.json';

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

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const storedSolved = localStorage.getItem('dsa_tracker_solved');
      if (storedSolved) {
        setSolvedProblems(JSON.parse(storedSolved));
      }
      const storedNotes = localStorage.getItem('dsa_tracker_notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (e) {
      console.error('Error reading localStorage data:', e);
    }
  }, []);

  // Sync solved problems to localStorage
  const saveSolvedProblems = (updated: SolvedProblem[]) => {
    setSolvedProblems(updated);
    localStorage.setItem('dsa_tracker_solved', JSON.stringify(updated));
  };

  // Sync notes to localStorage
  const saveNotesState = (updatedNotes: Record<string, string>) => {
    setNotes(updatedNotes);
    localStorage.setItem('dsa_tracker_notes', JSON.stringify(updatedNotes));
  };

  const isSolved = (problemId: string) => {
    return solvedProblems.some((p) => p.problemId === problemId);
  };

  const toggleProblem = (problem: Omit<SolvedProblem, 'solvedAtTimestamp'>) => {
    const exists = solvedProblems.find((p) => p.problemId === problem.problemId);
    if (exists) {
      // Remove it
      const updated = solvedProblems.filter((p) => p.problemId !== problem.problemId);
      saveSolvedProblems(updated);
    } else {
      // Add it
      const newSolved: SolvedProblem = {
        ...problem,
        solvedAtTimestamp: Date.now(),
      };
      saveSolvedProblems([newSolved, ...solvedProblems]);
    }
  };

  const saveNote = (problemId: string, noteText: string) => {
    const updated = { ...notes, [problemId]: noteText };
    saveNotesState(updated);
  };

  const getNote = (problemId: string) => {
    return notes[problemId] || '';
  };

  const clearAllProgress = () => {
    if (window.confirm('Are you sure you want to clear all your progress and notes? This cannot be undone.')) {
      saveSolvedProblems([]);
      saveNotesState({});
    }
  };

  // Compile metrics
  // Extract all problems to find totals by difficulty/topic
  const allProblemsMap = new Map<string, { id: string; title: string; topic: string; difficulty: 'Easy' | 'Medium' | 'Hard' }>();
  
  // 1. Gather from sheets
  dsaData.sheets.forEach((sheet) => {
    sheet.topics.forEach((topic) => {
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
