import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface TopicDeck {
  topic: string;
  description: string;
  questions: Question[];
}

interface AptitudeCardProps {
  topics: TopicDeck[];
  onBackToCategories: () => void;
  categoryTitle: string;
}

export const AptitudeCard: React.FC<AptitudeCardProps> = ({ 
  topics, 
  onBackToCategories, 
  categoryTitle 
}) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicDeck | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const startPractice = (topic: TopicDeck) => {
    setSelectedTopic(topic);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (!selectedTopic) return;
    if (currentQuestionIndex < selectedTopic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (!selectedTopic) return;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowAnswer(false);
      setShowExplanation(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (showAnswer) return; // Disallow changes after showing answer
    setSelectedOption(option);
  };

    if (selectedTopic) {
      const questions = selectedTopic.questions;
      const currentQuestion = questions[currentQuestionIndex];
      const isAnswered = selectedOption !== null || showAnswer;

      return (
      <div className="space-y-6 animate-fade-in-up">
        {/* practice deck header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedTopic(null)}
            className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-medium text-zinc-500">{categoryTitle}</span>
            <h2 className="text-xl font-semibold text-zinc-100">{selectedTopic.topic}</h2>
          </div>
        </div>

        {/* Practice Arena */}
        <div className="max-w-3xl mx-auto space-y-6">
          <Card hoverable={false} className="border border-zinc-800 bg-zinc-900/40 relative overflow-hidden">
            {/* Progress indicators */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800/80">
              <span className="text-xs font-medium text-zinc-400 font-mono">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex gap-1">
                {questions.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentQuestionIndex 
                        ? 'bg-blue-500' 
                        : idx < currentQuestionIndex 
                          ? 'bg-blue-950 border border-blue-800' 
                          : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-lg font-bold text-zinc-100 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Options Deck */}
            <div className="grid grid-cols-1 gap-3.5 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = selectedOption === option;
                
                let optionStyle = 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/55 text-zinc-300';
                let feedbackIcon = null;

                if (showAnswer || selectedOption !== null) {
                  const isCorrectAnswer = option === currentQuestion.answer;
                  if (isCorrectAnswer) {
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
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-4 rounded-xl border text-left text-sm flex items-center justify-between gap-4 transition-all duration-200 ${optionStyle} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono border ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-400 text-white' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}>
                        {optionLabel}
                      </span>
                      <span>{option}</span>
                    </div>
                    {feedbackIcon}
                  </button>
                );
              })}
            </div>

            {/* Control buttons inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
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
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-2 px-3 py-1.5 text-blue-400 hover:text-blue-300"
                  >
                    {showExplanation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showExplanation ? 'Hide Explanation' : 'View Explanation'}
                  </Button>
                )}
              </div>

              {/* Next / Prev Paginations */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePrev}
                  className="p-2 rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={handleNext}
                  className="p-2 rounded-xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Explanation block */}
          {showAnswer && showExplanation && (
            <div className="glass-panel p-5 rounded-xl space-y-2.5 animate-fade-in-up">
              <h4 className="text-xs font-medium text-zinc-400">Explanation</h4>
              <p className="text-sm font-medium text-zinc-200">
                Correct answer: <span className="text-emerald-400 font-semibold">{currentQuestion.answer}</span>
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono whitespace-pre-line bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-800">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Category Heading */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToCategories}
          className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-medium text-zinc-500">Aptitude</span>
          <h2 className="text-xl font-semibold text-zinc-100">{categoryTitle}</h2>
        </div>
      </div>

      {/* Grid of topic cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {topics.map((topic) => (
          <Card 
            key={topic.topic} 
            onClick={() => startPractice(topic)}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center mb-4 border border-zinc-700">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">{topic.topic}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">{topic.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-medium">
              <span className="text-zinc-500">{topic.questions.length} question sets</span>
              <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">Practice &rarr;</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
