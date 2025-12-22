
import React from 'react';
import { Unit, Lesson } from '../types';

interface LessonTreeProps {
  units: Unit[];
  onStartLesson: (lesson: Lesson) => void;
}

const LessonTree: React.FC<LessonTreeProps> = ({ units, onStartLesson }) => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-12">
      {units.map((unit) => (
        <div key={unit.id} className="space-y-8">
          <div className={`${unit.color} p-6 rounded-2xl text-white shadow-lg`}>
            <h2 className="text-xl font-extrabold opacity-70 uppercase tracking-widest text-sm mb-1">
              Unit {unit.id.split('-')[1]}
            </h2>
            <h1 className="text-2xl font-black">{unit.title}</h1>
          </div>

          <div className="flex flex-col items-center space-y-8">
            {unit.lessons.map((lesson, idx) => {
              // Create a staggered effect for the tree
              const offset = (idx % 3 === 0) ? '0px' : (idx % 3 === 1) ? '40px' : '-40px';
              
              return (
                <div 
                  key={lesson.id} 
                  className="relative group"
                  style={{ transform: `translateX(${offset})` }}
                >
                  <button
                    disabled={lesson.status === 'locked'}
                    onClick={() => onStartLesson(lesson)}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${
                      lesson.status === 'locked'
                        ? 'bg-gray-200 border-b-8 border-gray-300'
                        : lesson.status === 'completed'
                        ? 'bg-[#ffc800] border-b-8 border-[#e5a500]'
                        : 'bg-[#58cc02] border-b-8 border-[#46a302]'
                    }`}
                  >
                    <span className="text-3xl">
                      {lesson.status === 'locked' ? '🔒' : lesson.status === 'completed' ? '⭐' : '📖'}
                    </span>
                  </button>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute top-0 left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white duo-card p-3 shadow-xl z-10 w-48 pointer-events-none">
                    <p className="font-bold text-gray-800">{lesson.title}</p>
                    <p className="text-xs text-gray-500">{lesson.description}</p>
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
