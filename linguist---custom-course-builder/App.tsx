
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LessonTree from './components/LessonTree';
import UploadManager from './components/UploadManager';
import LessonSession from './components/LessonSession';
import ReviewMode from './components/ReviewMode';
import VocabularyView from './components/VocabularyView';
import GrammarView from './components/GrammarView';
import GamesView from './components/GamesView';
import WritingPad from './components/WritingPad';
import CultureView from './components/CultureView';
import SettingsView from './components/SettingsView';
import SearchView from './components/SearchView';
import NotificationsView from './components/NotificationsView';
import ProfileView from './components/ProfileView';
import MyListsView from './components/MyListsView';
import { CourseData, Lesson, UserStats, Exercise, ProficiencyLevel, NotificationSettings } from './types';
import { DUMMY_COURSE } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'settings' | 'profile' | 'vocabulary' | 'review' | 'writing' | 'culture' | 'grammar' | 'games' | 'search' | 'notifications' | 'my-lists'>('home');
  const [autoOpenLanguages, setAutoOpenLanguages] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<CourseData[]>(() => {
    const saved = localStorage.getItem('linguist_courses_v2');
    return saved ? JSON.parse(saved) : [DUMMY_COURSE];
  });
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
    savedWordIds: {},
    currentCourseId: DUMMY_COURSE.id,
    notifications: {
      remindersEnabled: true,
      reminderTime: "09:00",
      soundEnabled: true,
      motivationalAlerts: true
    },
    achievements: [
      { id: '1', title: 'Early Bird', description: 'Complete a lesson before 9AM', icon: '☀️', requirement: 1, currentValue: 0, unlocked: false },
      { id: '2', title: 'XP Titan', description: 'Reach 1000 Total XP', icon: '⚡', requirement: 1000, currentValue: 0, unlocked: false },
      { id: '3', title: 'Perfect Streak', description: 'Reach a 7-day streak', icon: '🔥', requirement: 7, currentValue: 0, unlocked: false },
    ],
    lessonsCompleted: 0,
    totalTimeMinutes: 0,
    accuracy: 0,
    perfectLessons: 0,
  };

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('linguist_stats_v4');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration for new stats
      if (parsed.lessonsCompleted === undefined) {
        return { ...parsed, ...INITIAL_STATS, xp: parsed.xp, level: parsed.level };
      }
      return parsed;
    }
    return INITIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem('linguist_stats_v4', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('linguist_courses_v2', JSON.stringify(availableCourses));
  }, [availableCourses]);

  useEffect(() => {
    const active = availableCourses.find(c => c.id === stats.currentCourseId);
    if (active) setCourse(active);
  }, [stats.currentCourseId, availableCourses]);

  const handleCourseLoaded = (newCourse: CourseData, newMediaMap: Map<string, string>) => {
    const courseWithId = { ...newCourse, id: newCourse.id || `course-${Date.now()}` };
    setAvailableCourses(prev => {
      const exists = prev.findIndex(c => c.id === courseWithId.id);
      if (exists !== -1) {
        const updated = [...prev];
        updated[exists] = courseWithId;
        return updated;
      }
      return [...prev, courseWithId];
    });
    setStats(prev => ({ ...prev, currentCourseId: courseWithId.id }));
    setMediaMap(newMediaMap);
    setActiveView('home');
  };

  const handleCourseSwitch = (courseId: string) => {
    setStats(prev => ({ ...prev, currentCourseId: courseId }));
    setActiveView('home');
  };

  const handleSidebarNav = (view: any) => {
    if (view === 'settings') {
      setAutoOpenLanguages(true);
    } else {
      setAutoOpenLanguages(false);
    }
    setActiveView(view);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleUpdateProficiency = (newLevel: ProficiencyLevel) => {
    setStats(prev => ({ ...prev, proficiencyLevel: newLevel }));
    setActiveView('home');
  };

  const handleToggleSaveWord = (wordId: string) => {
    setStats(prev => {
      const language = course.language;
      const currentSaved = prev.savedWordIds[language] || [];
      const newSaved = currentSaved.includes(wordId)
        ? currentSaved.filter(id => id !== wordId)
        : [...currentSaved, wordId];
      
      return {
        ...prev,
        savedWordIds: {
          ...prev.savedWordIds,
          [language]: newSaved
        }
      };
    });
  };

  const handleUpdateNotifications = (settings: NotificationSettings) => {
    setStats(prev => ({ ...prev, notifications: settings }));
  };

  const handleResetProgress = () => {
    if(confirm("Reset everything?")) {
      setStats(INITIAL_STATS);
      setAvailableCourses([DUMMY_COURSE]);
      setActiveView('home');
    }
  };

  const handleFinishLesson = (xpGained: number, mistakes: Exercise[]) => {
    setAvailableCourses(prevCourses => {
      return prevCourses.map(c => {
        if (c.id === course.id) {
          const updatedCourse = { ...c };
          updatedCourse.units.forEach(unit => {
            unit.lessons.forEach((l, idx) => {
              if (l.id === activeLesson?.id) {
                l.status = 'completed';
                if (unit.lessons[idx + 1]) unit.lessons[idx + 1].status = 'available';
              }
            });
          });
          return updatedCourse;
        }
        return c;
      });
    });

    setStats(prev => {
      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const newLessonsCompleted = prev.lessonsCompleted + 1;
      const totalExercises = (activeLesson?.exercises.length || 0);
      const sessionAccuracy = totalExercises > 0 ? ((totalExercises - mistakes.length) / totalExercises) * 100 : 100;
      const newAccuracy = prev.accuracy === 0 ? sessionAccuracy : (prev.accuracy + sessionAccuracy) / 2;
      const isPerfect = mistakes.length === 0;

      const updatedAchievements = prev.achievements.map(a => {
        if (a.id === '2') return { ...a, currentValue: newXp, unlocked: newXp >= a.requirement };
        return a;
      });

      return { 
        ...prev, 
        xp: newXp, 
        level: newLevel, 
        failedExercises: [...prev.failedExercises, ...mistakes].slice(-20),
        achievements: updatedAchievements,
        lessonsCompleted: newLessonsCompleted,
        totalTimeMinutes: prev.totalTimeMinutes + 15, // Mock time
        accuracy: Math.round(newAccuracy),
        perfectLessons: isPerfect ? prev.perfectLessons + 1 : prev.perfectLessons
      };
    });

    setActiveLesson(null);
  };

  const filteredUnits = course.units.filter(u => !u.level || u.level === stats.proficiencyLevel);

  return (
    <div className="flex bg-white min-h-screen font-['Nunito'] select-none">
      <Sidebar 
        onNavClick={handleSidebarNav} 
        activeView={activeView} 
        xp={stats.xp}
        streak={stats.streak}
        hearts={stats.hearts}
        proficiencyLevel={stats.proficiencyLevel}
        currentLanguage={course.language}
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

        {activeView === 'vocabulary' && (
          <VocabularyView 
            dictionary={course.dictionary} 
            savedWordIds={stats.savedWordIds[course.language] || []}
            onToggleSave={handleToggleSaveWord}
          />
        )}
        {activeView === 'grammar' && <GrammarView lessons={course.grammar} />}
        {activeView === 'games' && <GamesView dictionary={course.dictionary} />}
        {activeView === 'writing' && <WritingPad />}
        {activeView === 'culture' && <CultureView books={course.books} cultureItems={course.cultureItems} />}
        {activeView === 'search' && <SearchView course={course} onToggleSaveWord={handleToggleSaveWord} savedWordIds={stats.savedWordIds[course.language] || []} />}
        {activeView === 'notifications' && <NotificationsView settings={stats.notifications} onUpdate={handleUpdateNotifications} />}
        {activeView === 'my-lists' && <MyListsView dictionary={course.dictionary} savedWordIds={stats.savedWordIds[course.language] || []} onToggleSaveWord={handleToggleSaveWord} />}
        {activeView === 'profile' && <ProfileView stats={stats} />}
        
        {activeView === 'settings' && (
          <SettingsView 
            availableCourses={availableCourses}
            onCourseSwitch={handleCourseSwitch}
            onCourseLoaded={handleCourseLoaded} 
            onResetProgress={handleResetProgress}
            currentProficiency={stats.proficiencyLevel}
            onUpdateProficiency={handleUpdateProficiency}
            currentCourseId={stats.currentCourseId}
            autoOpenLanguages={autoOpenLanguages}
          />
        )}
        {activeView === 'review' && <ReviewMode exercises={stats.failedExercises} onClose={() => setActiveView('home')} />}

        {activeLesson && <LessonSession lesson={activeLesson} mediaMap={mediaMap} onFinish={handleFinishLesson} onQuit={() => setActiveLesson(null)} />}
      </main>
    </div>
  );
};

export default App;
