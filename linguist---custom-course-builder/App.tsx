
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LessonTree from './components/LessonTree';
import UploadManager from './components/UploadManager';
import LessonSession from './components/LessonSession';
import ReviewMode from './components/ReviewMode';
import VocabularyView from './components/VocabularyView';
import WritingPad from './components/WritingPad';
import CultureView from './components/CultureView';
import SettingsView from './components/SettingsView';
import { CourseData, Lesson, UserStats, Exercise, ProficiencyLevel } from './types';
import { DUMMY_COURSE } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'settings' | 'profile' | 'vocabulary' | 'review' | 'writing' | 'culture'>('home');
  const [course, setCourse] = useState<CourseData>(DUMMY_COURSE);
  const [mediaMap, setMediaMap] = useState<Map<string, string>>(new Map());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  const INITIAL_STATS: UserStats = {
    xp: 0,
    level: 1,
    proficiencyLevel: 1,
    streak: 0,
    hearts: 5,
    gems: 100,
    lastActiveDate: new Date().toISOString(),
    failedExercises: [],
    achievements: [
      { id: '1', title: 'Early Bird', description: 'Complete a lesson before 9AM', icon: '☀️', requirement: 1, currentValue: 0, unlocked: false },
      { id: '2', title: 'XP Titan', description: 'Reach 1000 Total XP', icon: '⚡', requirement: 1000, currentValue: 0, unlocked: false },
      { id: '3', title: 'Perfect Streak', description: 'Reach a 7-day streak', icon: '🔥', requirement: 7, currentValue: 0, unlocked: false },
    ]
  };

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('linguist_stats_v2');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem('linguist_stats_v2', JSON.stringify(stats));
  }, [stats]);

  const handleCourseLoaded = (newCourse: CourseData, newMediaMap: Map<string, string>) => {
    setCourse(newCourse);
    setMediaMap(newMediaMap);
    setActiveView('home');
  };

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleUpdateProficiency = (newLevel: ProficiencyLevel) => {
    setStats(prev => ({ ...prev, proficiencyLevel: newLevel }));
    // In a real app, we might want to auto-scroll to the first unit of this level
    setActiveView('home');
  };

  const handleResetProgress = () => {
    setStats(INITIAL_STATS);
    const resetCourse = JSON.parse(JSON.stringify(DUMMY_COURSE));
    resetCourse.units.forEach((unit: any) => {
      unit.lessons.forEach((l: any, idx: number) => {
        l.status = (unit.id === 'unit-1' && idx === 0) ? 'available' : 'locked';
      });
    });
    setCourse(resetCourse);
    setActiveView('home');
  };

  const handleFinishLesson = (xpGained: number, mistakes: Exercise[]) => {
    const updatedCourse = { ...course };
    updatedCourse.units.forEach(unit => {
      unit.lessons.forEach((l, idx) => {
        if (l.id === activeLesson?.id) {
          l.status = 'completed';
          if (unit.lessons[idx + 1]) unit.lessons[idx + 1].status = 'available';
        }
      });
    });

    setStats(prev => {
      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      const updatedAchievements = prev.achievements.map(a => {
        if (a.id === '2') return { ...a, currentValue: newXp, unlocked: newXp >= a.requirement };
        return a;
      });

      return { 
        ...prev, 
        xp: newXp, 
        level: newLevel, 
        failedExercises: [...prev.failedExercises, ...mistakes].slice(-20),
        achievements: updatedAchievements
      };
    });

    setCourse(updatedCourse);
    setActiveLesson(null);
  };

  // Filter course material based on chosen level
  const filteredUnits = course.units.filter(u => !u.level || u.level === stats.proficiencyLevel);

  return (
    <div className="flex bg-white min-h-screen font-['Nunito'] select-none">
      <Sidebar 
        onNavClick={setActiveView as any} 
        activeView={activeView} 
        xp={stats.xp} 
        proficiencyLevel={stats.proficiencyLevel}
      />

      <main className="flex-1 md:ml-64 relative">
        <div className="md:hidden p-4 border-b-2 border-gray-100 flex items-center justify-between sticky top-0 bg-white z-40">
           <span className="text-2xl font-extrabold text-[#58cc02] tracking-tighter italic">LINGUIST</span>
        </div>

        {activeView === 'home' && (
          <div className="pb-24 max-w-4xl mx-auto px-4">
             <div className="mt-8 mb-4 p-4 text-center">
                <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">
                  Level Stage {stats.proficiencyLevel}
                </h2>
             </div>
             {stats.failedExercises.length > 0 && (
               <div className="mt-8 p-6 bg-purple-100 rounded-2xl border-2 border-purple-200 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">🎯</span>
                    <div>
                      <h3 className="text-xl font-black text-purple-800">Targeted Practice</h3>
                      <p className="text-purple-600 font-bold">Review {stats.failedExercises.length} tricky words</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveView('review')} className="bg-purple-500 text-white p-3 px-6 rounded-xl font-black shadow-[0_4px_0_#8439a3]">START</button>
               </div>
             )}
             <LessonTree units={filteredUnits} onStartLesson={handleStartLesson} />
          </div>
        )}

        {activeView === 'vocabulary' && <VocabularyView />}
        {activeView === 'writing' && <WritingPad />}
        {activeView === 'culture' && <CultureView />}
        {activeView === 'settings' && (
          <SettingsView 
            onCourseLoaded={handleCourseLoaded} 
            onResetProgress={handleResetProgress}
            currentProficiency={stats.proficiencyLevel}
            onUpdateProficiency={handleUpdateProficiency}
          />
        )}
        {activeView === 'review' && <ReviewMode exercises={stats.failedExercises} onClose={() => setActiveView('home')} />}

        {activeView === 'profile' && (
          <div className="max-w-3xl mx-auto mt-12 p-8 space-y-10">
            <div className="flex items-center space-x-8">
              <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center text-7xl border-4 border-gray-50">🦉</div>
              <div className="flex-1">
                <h2 className="text-4xl font-black">Learner Lvl {stats.level}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{v: stats.streak, l: 'STREAK', i: '🔥'}, {v: stats.xp, l: 'TOTAL XP', i: '⚡'}, {v: stats.level, l: 'LEVEL', i: '🏆'}, {v: stats.gems, l: 'GEMS', i: '💎'}].map((s, i) => (
                <div key={i} className="duo-card p-6 flex flex-col items-center">
                  <span className="text-3xl mb-1">{s.i}</span>
                  <span className="text-2xl font-black">{s.v}</span>
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeLesson && <LessonSession lesson={activeLesson} mediaMap={mediaMap} onFinish={handleFinishLesson} onQuit={() => setActiveLesson(null)} />}
      </main>
    </div>
  );
};

export default App;
