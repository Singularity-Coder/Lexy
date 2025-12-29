
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
import AIChatsView from './components/AIChatsView';
import CourseBuilder from './components/CourseBuilder';
import { CourseData, Lesson, UserStats, Exercise, ProficiencyLevel, NotificationSettings, ViewType } from './types';
import { DUMMY_COURSE, PROFICIENCY_LEVELS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [availableCourses, setAvailableCourses] = useState<CourseData[]>(() => {
    const saved = localStorage.getItem('lexi_courses_v1');
    return saved ? JSON.parse(saved) : [DUMMY_COURSE];
  });
  const [course, setCourse] = useState<CourseData>(DUMMY_COURSE);
  const [mediaMap, setMediaMap] = useState<Map<string, string>>(new Map());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  
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
    selectedMascotId: 'girl',
    brandFont: 'Pacifico, cursive',
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
    const saved = localStorage.getItem('lexi_stats_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.selectedMascotId === undefined) parsed.selectedMascotId = 'girl';
      if (parsed.brandFont === undefined) parsed.brandFont = 'Pacifico, cursive';
      if (parsed.lessonsCompleted === undefined) {
        return { ...parsed, ...INITIAL_STATS, xp: parsed.xp, level: parsed.level };
      }
      return parsed;
    }
    return INITIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem('lexi_stats_v1', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('lexi_courses_v1', JSON.stringify(availableCourses));
  }, [availableCourses]);

  useEffect(() => {
    const active = availableCourses.find(c => c.id === stats.currentCourseId);
    if (active) setCourse(active);
  }, [stats.currentCourseId, availableCourses]);

  const handleCourseLoaded = (newCourse: CourseData, newMediaMap: Map<string, string>) => {
    // 1. Identify conflict by ID ONLY
    setAvailableCourses(prev => {
      const existingIdx = prev.findIndex(c => newCourse.id && c.id === newCourse.id);

      if (existingIdx !== -1) {
        // OVERWRITE CASE
        const updated = [...prev];
        updated[existingIdx] = newCourse;
        return updated;
      }
      // NEW COURSE CASE
      return [...prev, newCourse];
    });

    // 2. Switch to the newly loaded/updated course
    setStats(prev => ({ 
      ...prev, 
      currentCourseId: newCourse.id
    }));
    
    setMediaMap(newMediaMap);
    setEditingCourse(null);
    setActiveView('home');
  };

  const handleCourseSwitch = (courseId: string) => {
    setStats(prev => ({ ...prev, currentCourseId: courseId }));
    setActiveView('home');
  };

  const handleSidebarNav = (view: ViewType) => {
    if (view !== 'course-builder') setEditingCourse(null);
    setActiveView(view);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleUpdateProficiency = (newLevel: ProficiencyLevel) => {
    setStats(prev => ({ ...prev, proficiencyLevel: newLevel }));
    setActiveView('home');
  };

  const handleUpdateMascot = (mascotId: string) => {
    setStats(prev => ({ ...prev, selectedMascotId: mascotId }));
  };

  const handleUpdateBrandFont = (font: string) => {
    setStats(prev => ({ ...prev, brandFont: font }));
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
        savedWordIds: { ...prev.savedWordIds, [language]: newSaved }
      };
    });
  };

  const handleUpdateNotifications = (settings: NotificationSettings) => {
    setStats(prev => ({ ...prev, notifications: settings }));
  };

  const handleResetProgress = () => {
    if(window.confirm("Reset everything?")) {
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
        totalTimeMinutes: prev.totalTimeMinutes + 15,
        accuracy: Math.round(newAccuracy),
        perfectLessons: isPerfect ? prev.perfectLessons + 1 : prev.perfectLessons
      };
    });
    setActiveLesson(null);
  };

  const handleEditCurrentCourse = () => {
    const current = availableCourses.find(c => c.id === stats.currentCourseId);
    if (current) {
      setEditingCourse(current);
      setActiveView('course-builder');
    } else {
      setEditingCourse(course);
      setActiveView('course-builder');
    }
  };

  const filteredUnits = course.units.filter(u => !u.level || u.level === stats.proficiencyLevel);
  const currentLevelName = PROFICIENCY_LEVELS.find(l => l.level === stats.proficiencyLevel)?.name || 'Beginner';

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
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        brandFont={stats.brandFont}
      />

      <main className="flex-1 relative transition-all duration-300 md:pl-72 bg-white min-h-screen">
        <div className="md:hidden p-4 border-b-2 border-gray-100 flex items-center justify-between sticky top-0 bg-white z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">☰</span>
              </button>
              <span className="text-2xl text-purple-600" style={{ fontFamily: stats.brandFont }}>Lexy</span>
           </div>
           <div className="flex gap-2">
             <div className="flex items-center gap-1 p-2 px-3 bg-orange-50 text-orange-500 rounded-xl font-black text-xs border border-orange-100">
               <span>🔥</span> {stats.streak}
             </div>
             <div className="flex items-center gap-1 p-2 px-3 bg-red-50 text-red-500 rounded-xl font-black text-xs border border-red-100">
               <span>❤️</span> {stats.hearts}
             </div>
           </div>
        </div>

        {activeView === 'home' && (
          <div className="py-10 pb-12 max-w-4xl mx-auto px-4 bg-white">
             <div className="mb-4 px-4 text-left">
                <h1 className="text-4xl font-black text-gray-800 tracking-tight">{course.language}</h1>
                <p className="text-lg text-gray-500 font-bold mt-1">Level: {currentLevelName}</p>
             </div>
             {stats.failedExercises.length > 0 && (
               <div className="mt-4 p-4 bg-purple-100 rounded-2xl border-2 border-purple-200 flex items-center justify-between">
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
             <LessonTree 
              units={filteredUnits} 
              onStartLesson={handleStartLesson} 
              selectedMascotId={stats.selectedMascotId}
             />
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
        {activeView === 'ai-chats' && <AIChatsView currentLanguage={course.language} />}
        
        {activeView === 'course-builder' && (
          <CourseBuilder 
            key={editingCourse?.id || 'new'}
            initialCourse={editingCourse || undefined}
            onCourseSaved={(c) => handleCourseLoaded(c, new Map())} 
            onCancel={() => { setEditingCourse(null); setActiveView('settings'); }} 
          />
        )}
        
        {activeView === 'settings' && (
          <SettingsView 
            availableCourses={availableCourses}
            onCourseSwitch={handleCourseSwitch}
            onCourseLoaded={handleCourseLoaded} 
            onResetProgress={handleResetProgress}
            currentProficiency={stats.proficiencyLevel}
            onUpdateProficiency={handleUpdateProficiency}
            currentCourseId={stats.currentCourseId}
            selectedMascotId={stats.selectedMascotId}
            onUpdateMascot={handleUpdateMascot}
            brandFont={stats.brandFont}
            onUpdateBrandFont={handleUpdateBrandFont}
            onCreateCourse={() => setActiveView('course-builder')}
            onEditCourse={handleEditCurrentCourse}
            notificationSettings={stats.notifications}
            onUpdateNotifications={handleUpdateNotifications}
          />
        )}
        {activeView === 'review' && <ReviewMode exercises={stats.failedExercises} onClose={() => setActiveView('home')} />}
        {activeLesson && <LessonSession lesson={activeLesson} mediaMap={mediaMap} onFinish={handleFinishLesson} onQuit={() => setActiveLesson(null)} />}
      </main>
    </div>
  );
};

export default App;
