import React, { useState } from 'react';
import { useTracker } from '../../hooks/useTracker';
import { Checkbox } from '../ui/Checkbox';
import { 
  ExternalLink, 
  Video, 
  StickyNote, 
  Check, 
  Code2 
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  platforms: {
    leetcode?: string;
    gfg?: string;
  };
  videoSolution?: string;
}

interface DsaSheetTableProps {
  problems: Problem[];
  topicName: string;
}

export const DsaSheetTable: React.FC<DsaSheetTableProps> = ({ problems, topicName }) => {
  const { isSolved, toggleProblem, getNote, saveNote } = useTracker();
  
  // Track which problem IDs have notes expanded
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);
  
  // Temp notes input state for currently editing notes
  const [editingNoteText, setEditingNoteText] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(null);

  const toggleNotes = (problemId: string) => {
    if (expandedNotesId === problemId) {
      setExpandedNotesId(null);
    } else {
      setExpandedNotesId(problemId);
      setEditingNoteText(getNote(problemId));
      setSaveStatus(null);
    }
  };

  const handleNotesChange = (problemId: string, text: string) => {
    setEditingNoteText(text);
    setSaveStatus('saving');
    saveNote(problemId, text);
    
    // Simulate auto-save feedback delay
    const timer = setTimeout(() => {
      setSaveStatus('saved');
    }, 400);
    return () => clearTimeout(timer);
  };

  const getDifficultyStyles = (diff: string) => {
    const styles: Record<string, string> = {
      Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
      Medium: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
      Hard: 'text-rose-400 bg-rose-400/10 border-rose-500/20',
    };
    return styles[diff] || styles.Easy;
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4 w-12 text-center">Status</th>
            <th className="py-3 px-4">Problem Name</th>
            <th className="py-3 px-4 w-32 text-center">Difficulty</th>
            <th className="py-3 px-4 w-36 text-center">Platforms</th>
            <th className="py-3 px-4 w-24 text-center">Video</th>
            <th className="py-3 px-4 w-24 text-center">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {problems.map((problem) => {
            const solved = isSolved(problem.id);
            const noteExists = getNote(problem.id).trim().length > 0;
            const isNotesExpanded = expandedNotesId === problem.id;

            return (
              <React.Fragment key={problem.id}>
                {/* Main Problem Row */}
                <tr 
                  className={`group transition-colors duration-150 hover:bg-slate-900/35 
                    ${solved ? 'bg-slate-950/20 opacity-70' : ''}`}
                >
                  {/* Status Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={solved}
                        id={`check-${problem.id}`}
                        onChange={() => toggleProblem({
                          problemId: problem.id,
                          title: problem.title,
                          topic: topicName,
                          difficulty: problem.difficulty,
                          platform: problem.platforms.leetcode ? 'leetcode' : 'gfg'
                        })}
                      />
                    </div>
                  </td>

                  {/* Problem Name */}
                  <td className="py-3.5 px-4">
                    <span className={`text-sm font-semibold transition-all duration-200 
                      ${solved ? 'line-through text-slate-500 font-medium' : 'text-slate-200 group-hover:text-white'}`}
                    >
                      {problem.title}
                    </span>
                  </td>

                  {/* Difficulty Tag */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${getDifficultyStyles(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>

                  {/* Platforms */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {problem.platforms.leetcode && (
                        <a 
                          href={problem.platforms.leetcode} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Solve on LeetCode"
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-amber-500/40 bg-slate-950/50 text-slate-400 hover:text-amber-500 transition-all cursor-pointer"
                        >
                          <Code2 className="w-4 h-4" />
                        </a>
                      )}
                      {problem.platforms.gfg && (
                        <a 
                          href={problem.platforms.gfg} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Solve on GeeksforGeeks"
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-emerald-500/40 bg-slate-950/50 text-slate-400 hover:text-emerald-500 transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Video solution link */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center">
                      {problem.videoSolution ? (
                        <a 
                          href={problem.videoSolution} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Watch YouTube Solution"
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-500/40 bg-slate-950/50 text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-slate-700 text-xs font-medium">-</span>
                      )}
                    </div>
                  </td>

                  {/* Notes indicator/toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => toggleNotes(problem.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer relative 
                          ${isNotesExpanded 
                            ? 'bg-indigo-650/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5' 
                            : noteExists
                              ? 'bg-slate-800/40 border-slate-700 text-indigo-400'
                              : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-350 hover:border-slate-705'}`}
                        title="Add/View Notes"
                      >
                        <StickyNote className="w-4 h-4" />
                        {noteExists && !isNotesExpanded && (
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Notes Collapse Area */}
                {isNotesExpanded && (
                  <tr>
                    <td colSpan={6} className="bg-slate-900/15 p-4 border-b border-slate-800">
                      <div className="flex flex-col gap-2 max-w-3xl mx-auto pl-12 animate-fade-in-up">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                            <StickyNote className="w-3.5 h-3.5" />
                            Scratchpad Notes (Saved in Browser)
                          </span>
                          {saveStatus && (
                            <span className={`text-[10px] font-bold font-mono tracking-tight flex items-center gap-1 ${saveStatus === 'saving' ? 'text-slate-500' : 'text-emerald-400'}`}>
                              {saveStatus === 'saving' ? 'Saving...' : <><Check className="w-3 h-3" /> Saved</>}
                            </span>
                          )}
                        </div>
                        <textarea
                          value={editingNoteText}
                          onChange={(e) => handleNotesChange(problem.id, e.target.value)}
                          placeholder="Type code snippets, approach thoughts, or key patterns to watch out for..."
                          className="w-full min-h-[90px] p-3 text-xs bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl text-slate-350 placeholder-slate-600 focus:outline-none resize-y font-mono leading-relaxed"
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
