
import React, { useMemo } from 'react';
import { Unit, Lesson } from '../types';

interface LessonTreeProps {
  units: Unit[];
  onStartLesson: (lesson: Lesson) => void;
}

const LinguistCharacter = () => (
  <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 drop-shadow-xl animate-bounce pointer-events-none">
    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <circle cx="50" cy="55" r="40" fill="#ce82ff" />
      <path d="M50 15C28 15 10 33 10 55C10 77 28 95 50 95C72 95 90 77 90 55C90 33 72 15 50 15Z" fill="#ce82ff" />
      {/* Belly */}
      <path d="M50 35C35 35 25 45 25 60C25 75 35 85 50 85C65 85 75 75 75 60C75 45 65 35 50 35Z" fill="#e8c7ff" />
      {/* Eyes */}
      <circle cx="35" cy="45" r="8" fill="white" />
      <circle cx="65" cy="45" r="8" fill="white" />
      <circle cx="37" cy="47" r="3" fill="black" />
      <circle cx="67" cy="47" r="3" fill="black" />
      {/* Beak */}
      <path d="M45 55L50 62L55 55H45Z" fill="#ff9600" />
      {/* Wings */}
      <path d="M10 50C5 50 0 60 5 70" stroke="#ce82ff" strokeWidth="6" strokeLinecap="round" />
      <path d="M90 50C95 50 100 60 95 70" stroke="#ce82ff" strokeWidth="6" strokeLinecap="round" />
    </svg>
    {/* Shadow */}
    <div className="w-10 h-2 bg-black/10 rounded-[100%] mx-auto mt-2 blur-[1px]" />
  </div>
);

const LessonTree: React.FC<LessonTreeProps> = ({ units, onStartLesson }) => {
  // Find the single global position for the character
  const globalCurrentLessonId = useMemo(() => {
    let lastCompleted = null;
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        if (lesson.status === 'available') return lesson.id;
        if (lesson.status === 'completed') lastCompleted = lesson.id;
      }
    }
    return lastCompleted || (units[0]?.lessons[0]?.id);
  }, [units]);

  // We'll use a fixed number of columns for the desktop serpentine layout
  const cols = 5;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-24">
      {units.map((unit, unitIdx) => (
        <div key={unit.id} className="relative space-y-16">
          {/* Unit Header - Full width box matching drawing */}
          <div className="w-full">
            <div className={`${unit.color} p-8 px-12 rounded-3xl text-white shadow-xl relative overflow-hidden group border-b-8 border-black/10`}>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                 <span className="text-9xl">🎯</span>
               </div>
               <div className="relative z-10">
                  <h2 className="text-lg font-black opacity-80 uppercase tracking-[0.3em] mb-2">
                    Unit {unitIdx + 1}
                  </h2>
                  <h1 className="text-4xl font-black">{unit.title}</h1>
               </div>
            </div>
          </div>

          {/* Path of Lessons - Serpentine Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-20 relative px-4">
            {unit.lessons.map((lesson, idx) => {
              const isCharacterHere = lesson.id === globalCurrentLessonId;
              const isCompleted = lesson.status === 'completed';
              const isLocked = lesson.status === 'locked';
              const isLastInUnit = idx === unit.lessons.length - 1;

              // Path logic:
              // 1. Horizontal line to the right if not at the end of the row
              // 2. Vertical line down if at the end of a row
              const isEndOfRowDesktop = (idx + 1) % 5 === 0;
              const isEndOfRowMobile = (idx + 1) % 2 === 0;

              return (
                <div key={lesson.id} className="relative flex justify-center items-center h-24">
                  
                  {/* PATH LINES */}
                  {!isLastInUnit && (
                    <>
                      {/* Desktop Horizontal Line */}
                      <div className={`hidden md:block absolute h-3 bg-gray-200 -z-10 top-1/2 -translate-y-1/2 rounded-full transition-colors ${isCompleted ? 'bg-[#58cc02]' : ''} ${
                        isEndOfRowDesktop 
                        ? 'w-3 h-24 top-full left-1/2 -translate-x-1/2' 
                        : 'w-full left-1/2'
                      }`} />

                      {/* Mobile Horizontal Line */}
                      <div className={`md:hidden absolute h-2 bg-gray-200 -z-10 top-1/2 -translate-y-1/2 rounded-full transition-colors ${isCompleted ? 'bg-[#58cc02]' : ''} ${
                        isEndOfRowMobile 
                        ? 'w-2 h-24 top-full left-1/2 -translate-x-1/2' 
                        : 'w-full left-1/2'
                      }`} />
                    </>
                  )}

                  {/* Inter-unit connector */}
                  {isLastInUnit && unitIdx < units.length - 1 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-32 bg-gray-100 -z-20 rounded-full" />
                  )}

                  <div className="relative group">
                    {/* Character jumping above the specific current lesson */}
                    {isCharacterHere && <LinguistCharacter />}

                    <button
                      disabled={isLocked}
                      onClick={() => onStartLesson(lesson)}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 relative z-10 ${
                        isLocked
                          ? 'bg-gray-100 border-b-[6px] md:border-b-[8px] border-gray-200'
                          : isCompleted
                          ? 'bg-[#58cc02] border-b-[6px] md:border-b-[8px] border-[#46a302]'
                          : 'bg-[#1cb0f6] border-b-[6px] md:border-b-[8px] border-[#1899d6]'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {isCompleted ? (
                          <span className="text-4xl md:text-5xl text-white drop-shadow-md">✓</span>
                        ) : isLocked ? (
                          <span className="text-2xl md:text-3xl text-gray-400">🔒</span>
                        ) : (
                          <span className="text-3xl md:text-4xl text-white drop-shadow-md">⭐</span>
                        )}
                      </div>
                    </button>

                    {/* Active pulse effect */}
                    {!isLocked && !isCompleted && (
                      <div className="absolute inset-0 -m-2 border-4 border-blue-200 rounded-full animate-pulse pointer-events-none" />
                    )}

                    {/* Lesson Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 opacity-0 group-hover:opacity-100 transition-all bg-white duo-card p-4 shadow-2xl z-50 w-64 pointer-events-none text-center rounded-2xl border-2 border-gray-100 translate-y-2 group-hover:translate-y-0">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t-2 border-l-2 border-gray-100" />
                      <p className="font-black text-gray-800 text-sm uppercase tracking-wider mb-1">
                        {isLocked ? "Keep Learning!" : lesson.title}
                      </p>
                      <p className="text-xs text-gray-400 font-bold leading-relaxed">{lesson.description}</p>
                      {!isLocked && !isCompleted && (
                        <div className="mt-3 text-[10px] font-black text-blue-500 uppercase flex items-center justify-center gap-1">
                          <span className="animate-bounce">⚡</span> Play Now
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonTree;
