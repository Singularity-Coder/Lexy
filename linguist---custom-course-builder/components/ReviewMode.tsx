
import React, { useState } from 'react';
import { Exercise } from '../types';

interface ReviewModeProps {
  exercises: Exercise[];
  onClose: () => void;
}

const ReviewMode: React.FC<ReviewModeProps> = ({ exercises, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const current = exercises[currentIndex];

  if (!current) return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <span className="text-6xl">🎉</span>
      <h2 className="text-2xl font-black">All Caught Up!</h2>
      <p className="text-gray-500">You don't have any mistakes to review right now.</p>
      <button onClick={onClose} className="duo-btn-primary p-4 px-8 rounded-xl text-white font-black">GO BACK</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-12 flex flex-col items-center space-y-8">
      <div className="flex justify-between w-full px-4 items-center">
        <button onClick={onClose} className="text-gray-400 font-bold hover:text-gray-600">EXIT</button>
        <span className="font-black text-[#afafaf] uppercase tracking-widest text-sm">Reviewing Mistakes</span>
        <span className="font-black">{currentIndex + 1} / {exercises.length}</span>
      </div>

      <div 
        className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front duo-card border-4 border-gray-100 bg-white">
            <div className="flex flex-col items-center space-y-4">
              <span className="text-sm font-black text-[#1cb0f6] uppercase">Question</span>
              <h3 className="text-3xl font-black text-center">{current.question}</h3>
              <p className="text-gray-400 text-sm italic mt-4">Tap to reveal answer</p>
            </div>
          </div>
          <div className="flip-card-back bg-[#1cb0f6] border-4 border-[#1899d6]">
             <div className="flex flex-col items-center space-y-4">
              <span className="text-sm font-black text-white/50 uppercase">Answer</span>
              <h3 className="text-4xl font-black text-center">{current.answer}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 w-full px-4">
        <button 
          onClick={() => {
            setIsFlipped(false);
            if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
          }}
          disabled={currentIndex === 0}
          className="flex-1 p-4 duo-card font-black disabled:opacity-30"
        >
          PREVIOUS
        </button>
        <button 
          onClick={() => {
            setIsFlipped(false);
            if (currentIndex < exercises.length - 1) setCurrentIndex(currentIndex + 1);
            else onClose();
          }}
          className="flex-1 p-4 bg-[#58cc02] border-b-4 border-[#46a302] rounded-xl text-white font-black"
        >
          {currentIndex === exercises.length - 1 ? 'FINISH' : 'NEXT'}
        </button>
      </div>
    </div>
  );
};

export default ReviewMode;
