import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuestionDeckProps {
  title: string;
  eyebrow?: string;
  questions: Question[];
  onBack: () => void;
}

export const QuestionDeck: React.FC<QuestionDeckProps> = ({ title, eyebrow, questions, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOption !== null || showAnswer;

  const reset = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      reset();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      reset();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          {eyebrow && <span className="text-xs font-medium text-zinc-500">{eyebrow}</span>}
          <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card hoverable={false} className="border border-zinc-800 bg-zinc-900/40">
          {/* Progress */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
            <span className="text-xs font-medium text-zinc-400 font-mono">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex gap-1">
              {questions.map((q, idx) => (
                <span
                  key={q.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex
                      ? 'bg-blue-500'
                      : idx < currentIndex
                        ? 'bg-blue-900 border border-blue-800'
                        : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <h3 className="text-lg font-semibold text-zinc-100 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3.5 mb-6">
            {currentQuestion.options.map((option, idx) => {
              const optionLabel = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === option;

              let optionStyle = 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/55 text-zinc-300';
              let feedbackIcon: React.ReactNode = null;

              if (showAnswer || selectedOption !== null) {
                const isCorrect = option === currentQuestion.answer;
                if (isCorrect) {
                  optionStyle = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold';
                  feedbackIcon = <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
                } else if (isSelected) {
                  optionStyle = 'border-rose-500/30 bg-rose-500/10 text-rose-400';
                  feedbackIcon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
                } else {
                  optionStyle = 'border-zinc-800 text-zinc-500 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-blue-500 bg-blue-500/5 text-blue-400 font-semibold';
              }

              return (
                <button
                  key={option}
                  disabled={isAnswered}
                  onClick={() => !isAnswered && setSelectedOption(option)}
                  className={`w-full p-4 rounded-xl border text-left text-sm flex items-center justify-between gap-4 transition-all duration-200 ${optionStyle} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono border ${
                        isSelected
                          ? 'bg-blue-500 border-blue-400 text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {optionLabel}
                    </span>
                    <span>{option}</span>
                  </div>
                  {feedbackIcon}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAnswer(true)}
                disabled={showAnswer}
                className="flex items-center gap-2 px-3 py-1.5"
              >
                <Eye className="w-4 h-4" />
                Show Answer
              </Button>

              {showAnswer && (
                <Button
                  variant="ghost"
                  onClick={() => setShowExplanation((s) => !s)}
                  className="flex items-center gap-2 px-3 py-1.5 text-blue-400 hover:text-blue-300"
                >
                  {showExplanation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showExplanation ? 'Hide Explanation' : 'View Explanation'}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" disabled={currentIndex === 0} onClick={handlePrev} className="p-2 rounded-xl">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                disabled={currentIndex === questions.length - 1}
                onClick={handleNext}
                className="p-2 rounded-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Explanation */}
        {showAnswer && showExplanation && (
          <div className="glass-panel p-5 rounded-xl space-y-2.5 animate-fade-in-up">
            <h4 className="text-xs font-medium text-zinc-400">Explanation</h4>
            <p className="text-sm font-medium text-zinc-200">
              Correct answer: <span className="text-emerald-400 font-semibold">{currentQuestion.answer}</span>
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-800">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
