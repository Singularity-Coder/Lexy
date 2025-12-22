
import React, { useState, useRef } from 'react';
import { Lesson, Exercise } from '../types';
import AIChat from './AIChat';
import { GoogleGenAI } from "@google/genai";

interface LessonSessionProps {
  lesson: Lesson;
  mediaMap: Map<string, string>;
  onFinish: (xpGained: number, mistakes: Exercise[]) => void;
  onQuit: () => void;
}

const LessonSession: React.FC<LessonSessionProps> = ({ lesson, mediaMap, onFinish, onQuit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [mistakes, setMistakes] = useState<Exercise[]>([]);
  const [shake, setShake] = useState(false);

  const currentExercise = lesson.exercises[currentIndex];
  const progress = ((currentIndex) / lesson.exercises.length) * 100;

  const handleCheck = async () => {
    let correct = false;
    if (currentExercise.type === 'multiple-choice') {
      correct = selectedOption === currentExercise.answer;
    } else if (currentExercise.type === 'text-translate') {
      correct = textInput.trim().toLowerCase() === currentExercise.answer.toLowerCase();
    } else if (currentExercise.type === 'word-sort') {
      correct = selectedWords.join(" ") === currentExercise.answer;
    } else {
      correct = true;
    }

    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setMistakes(prev => [...prev, currentExercise]);
    }

    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setTextInput("");
      setSelectedWords([]);
      setShowFeedback(false);
      setIsCorrect(null);
    } else {
      onFinish(lesson.exercises.length * 10, mistakes);
    }
  };

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else {
      setSelectedWords(prev => [...prev, word]);
    }
  };

  const renderExerciseContent = () => {
    if (!currentExercise) return null;
    const mediaUrl = currentExercise.mediaPath ? mediaMap.get(currentExercise.mediaPath) : null;

    return (
      <div className={`flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-300 ${shake ? 'shake' : ''}`}>
        <h2 className="text-3xl font-black text-gray-800 text-center px-4">
          {currentExercise.question}
        </h2>

        {mediaUrl && (
          <div className="w-64 h-64 duo-card overflow-hidden bg-gray-50 flex items-center justify-center p-2">
            {currentExercise.mediaPath?.endsWith('.mp4') ? (
              <video src={mediaUrl} className="w-full h-full object-contain" />
            ) : (
              <img src={mediaUrl} alt="Exercise" className="w-full h-full object-contain" />
            )}
          </div>
        )}

        {currentExercise.type === 'multiple-choice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            {currentExercise.options?.map((option) => (
              <button
                key={option}
                onClick={() => !showFeedback && setSelectedOption(option)}
                className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all transform hover:-translate-y-1 active:translate-y-0 ${
                  selectedOption === option
                    ? 'border-[#1cb0f6] bg-[#ddf4ff] text-[#1cb0f6] shadow-[0_4px_0_#1cb0f6]'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600 shadow-[0_4px_0_#e5e5e5]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentExercise.type === 'word-sort' && (
          <div className="w-full max-w-lg space-y-8">
            <div className="min-h-[100px] border-b-2 border-gray-200 p-4 flex flex-wrap gap-2 justify-center">
              {selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => !showFeedback && toggleWord(word)}
                  className="bg-white border-2 border-gray-200 p-3 px-5 rounded-xl font-bold shadow-[0_3px_0_#e5e5e5]"
                >
                  {word}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {(currentExercise.wordBank || []).map((word, idx) => (
                <button
                  key={idx}
                  disabled={selectedWords.includes(word) || showFeedback}
                  onClick={() => toggleWord(word)}
                  className={`p-3 px-5 rounded-xl font-bold transition-all ${
                    selectedWords.includes(word)
                      ? 'bg-gray-100 text-transparent border-transparent shadow-none'
                      : 'bg-white border-2 border-gray-200 shadow-[0_3px_0_#e5e5e5] hover:bg-gray-50'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentExercise.type === 'text-translate' && (
          <div className="w-full max-w-lg">
            <textarea
              value={textInput}
              onChange={(e) => !showFeedback && setTextInput(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-6 duo-card bg-gray-50 text-xl font-bold focus:outline-none focus:border-[#1cb0f6] min-h-[150px] shadow-inner"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-['Nunito']">
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full p-6 flex items-center space-x-6">
        <button onClick={onQuit} className="text-3xl text-gray-400 hover:text-gray-600 font-bold transition-colors">✕</button>
        <div className="flex-1 progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <button 
          onClick={() => setIsAiOpen(true)}
          className="bg-yellow-100 text-yellow-700 p-2 px-4 rounded-xl font-black flex items-center space-x-2 transition-colors"
        >
          <span>💡</span>
          <span className="hidden sm:inline">HELP</span>
        </button>
      </div>

      <AIChat currentExercise={currentExercise} isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      <div className="flex-1 overflow-y-auto py-10">
        <div className="max-w-4xl mx-auto px-4">
          {renderExerciseContent()}
        </div>
      </div>

      <div className={`p-8 border-t-2 transition-colors duration-500 ${
        showFeedback 
          ? isCorrect ? 'bg-[#d7ffb8] border-[#b8f28b]' : 'bg-[#ffdfe0] border-[#ffb8ba]'
          : 'bg-white border-gray-100'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            {showFeedback && (
              <div className="flex items-center space-x-4 animate-in slide-in-from-bottom duration-300">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl ${isCorrect ? 'bg-[#58cc02]' : 'bg-[#ff4b4b]'}`}>
                  {isCorrect ? '✓' : '✕'}
                </div>
                <div>
                  <h3 className={`text-2xl font-black ${isCorrect ? 'text-[#58a700]' : 'text-[#ea2b2b]'}`}>
                    {isCorrect ? 'Awesome!' : 'Correct Answer:'}
                  </h3>
                  {!isCorrect && <p className={`font-bold text-lg ${isCorrect ? 'text-[#58a700]' : 'text-[#ea2b2b]'}`}>{currentExercise.answer}</p>}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={showFeedback ? handleContinue : handleCheck}
            disabled={!selectedOption && !textInput && selectedWords.length === 0 && !showFeedback}
            className={`w-full md:w-48 p-4 rounded-xl font-extrabold text-white uppercase tracking-wider transition-all transform active:scale-95 ${
              showFeedback 
                ? isCorrect ? 'bg-[#58cc02] border-b-4 border-[#46a302]' : 'bg-[#ff4b4b] border-b-4 border-[#ea2b2b]'
                : (selectedOption || textInput || selectedWords.length > 0) 
                  ? 'bg-[#58cc02] border-b-4 border-[#46a302]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {showFeedback ? 'Continue' : 'Check'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonSession;
