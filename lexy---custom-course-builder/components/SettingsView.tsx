
import React, { useState } from 'react';
import UploadManager from './UploadManager';
import { CourseData, ProficiencyLevel, NotificationSettings } from '../types';
import { PROFICIENCY_LEVELS, MASCOTS, FONT_OPTIONS } from '../constants';
import Mascot from './Mascot';

interface SettingsViewProps {
  availableCourses: CourseData[];
  onCourseSwitch: (courseId: string) => void;
  onCourseLoaded: (course: CourseData, mediaMap: Map<string, string>) => void;
  onResetProgress: () => void;
  currentProficiency: ProficiencyLevel;
  currentCourseId: string;
  selectedMascotId: string;
  onUpdateMascot: (mascotId: string) => void;
  brandFont: string;
  onUpdateBrandFont: (font: string) => void;
  onCreateCourse?: () => void;
  onEditCourse?: () => void;
  notificationSettings: NotificationSettings;
  onUpdateNotifications: (settings: NotificationSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  availableCourses,
  onCourseSwitch,
  onCourseLoaded, 
  onResetProgress, 
  currentProficiency, 
  currentCourseId,
  selectedMascotId,
  onUpdateMascot,
  brandFont,
  onUpdateBrandFont,
  onCreateCourse,
  onEditCourse,
  notificationSettings,
  onUpdateNotifications
}) => {
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isMascotModalOpen, setIsMascotModalOpen] = useState(false);

  const currentLevelInfo = PROFICIENCY_LEVELS.find(l => l.level === currentProficiency) || PROFICIENCY_LEVELS[0];
  const currentMascot = MASCOTS.find(m => m.id === selectedMascotId) || MASCOTS[0];
  const currentActiveCourse = availableCourses.find(c => c.id === currentCourseId);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEditCourse) {
      onEditCourse();
    }
  };

  const LanguageSelector = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 pb-8">
      {availableCourses.map((course) => {
        // Derive level from the first unit or default to current user proficiency for display if unit level missing
        const courseLevel = course.units?.[0]?.level || 1;
        const levelInfo = PROFICIENCY_LEVELS.find(l => l.level === courseLevel) || PROFICIENCY_LEVELS[0];

        return (
          <button
            key={course.id}
            onClick={() => {
              onCourseSwitch(course.id);
              setIsLanguageModalOpen(false);
            }}
            className={`p-4 rounded-2xl flex items-center gap-4 transition-all group ${
              currentCourseId === course.id 
                ? 'bg-purple-100 border-2 border-purple-200 text-purple-700 shadow-[0_4px_0_#c4b5fd]' 
                : 'bg-white border-2 border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
              <img src={levelInfo.imageUrl} className="w-full h-full object-cover" alt={levelInfo.name} />
            </div>
            <div className="text-left overflow-hidden">
              <p className="font-black text-gray-800 truncate">{course.language}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider truncate">
                {levelInfo.name}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const FontSelector = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 pb-8">
      {FONT_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => {
            onUpdateBrandFont(opt.id);
            setIsFontModalOpen(false);
          }}
          className={`p-6 rounded-2xl flex flex-col items-center justify-center border-2 transition-all group space-y-3 ${
            brandFont === opt.id 
              ? 'bg-purple-100 border-2 border-purple-200 text-purple-700 shadow-[0_4px_0_#c4b5fd]' 
              : 'bg-white border-2 border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
          }`}
        >
          <div 
            className="text-4xl group-hover:scale-110 transition-transform" 
            style={{ fontFamily: opt.id, color: brandFont === opt.id ? '#7e22ce' : '#1f2937' }}
          >
            Lexy
          </div>
          <p className={`text-[10px] font-black uppercase tracking-widest ${brandFont === opt.id ? 'text-purple-700' : 'text-gray-400'}`}>
            {opt.name}
          </p>
        </button>
      ))}
    </div>
  );

  const MascotSelector = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pb-8">
      {MASCOTS.map((mascot) => (
        <button
          key={mascot.id}
          onClick={() => {
            onUpdateMascot(mascot.id);
            setIsMascotModalOpen(false);
          }}
          className={`p-6 rounded-2xl flex flex-col items-center text-center space-y-3 transition-all transform active:scale-95 group border-2 ${
            selectedMascotId === mascot.id
              ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-[0_4px_0_#c4b5fd]'
              : 'bg-white border-2 border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
          }`}
        >
          <div className="mb-2 group-hover:scale-110 transition-transform">
            <Mascot id={mascot.id} size={50} />
          </div>
          <h3 className={`font-black text-sm ${selectedMascotId === mascot.id ? 'text-purple-700' : 'text-gray-800'}`}>
            {mascot.name}
          </h3>
        </button>
      ))}
    </div>
  );

  const togglePreference = (key: keyof NotificationSettings) => {
    onUpdateNotifications({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-12 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Settings</h1>
          <p className="text-lg text-gray-500 font-bold mt-1">Customize your learning experience and manage course data.</p>
        </div>

        {/* My Languages Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">My Languages</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="duo-card p-6 bg-purple-50/10 border-purple-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center flex-1 w-full gap-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
                <img src={currentLevelInfo.imageUrl} className="w-full h-full object-cover" alt={currentLevelInfo.name} />
              </div>

              <div className="flex-1 space-y-0.5">
                <h3 className="text-2xl font-black text-[#ad46ff] leading-none">
                  {currentActiveCourse?.language || 'None'}
                </h3>
                <p className="text-sm font-bold text-gray-400">
                  {currentLevelInfo.name}
                </p>
              </div>

              <button 
                type="button"
                onClick={handleEditClick}
                className="bg-white border-2 border-gray-100 p-4 px-8 rounded-2xl font-black text-gray-500 hover:bg-gray-100 shadow-[0_4px_0_#e5e5e5] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs relative z-10"
              >
                EDIT
              </button>
            </div>
            <button 
              onClick={() => setIsLanguageModalOpen(true)}
              className="w-full md:w-auto p-4 px-8 rounded-2xl font-black bg-purple-100 text-purple-700 shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest text-xs"
            >
              SWITCH LANGUAGE
            </button>
          </div>
        </section>

        {/* Mascot */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Choose Your Mascot</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="duo-card p-6 bg-purple-50/10 border-purple-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <Mascot id={selectedMascotId} size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#ad46ff]">{currentMascot.name}</h3>
              </div>
            </div>
            <button 
              onClick={() => setIsMascotModalOpen(true)}
              className="w-full md:w-auto p-4 px-8 rounded-2xl font-black bg-purple-100 text-purple-700 shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest text-xs"
            >
              CHANGE MASCOT
            </button>
          </div>
        </section>

        {/* Font Style */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Logo Font Style</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="duo-card p-6 bg-purple-50/10 border-purple-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div>
                <h3 className="text-3xl text-[#ad46ff]" style={{ fontFamily: brandFont }}>Lexy</h3>
              </div>
            </div>
            <button 
              onClick={() => setIsFontModalOpen(true)}
              className="w-full md:w-auto p-4 px-8 rounded-2xl font-black bg-purple-100 text-purple-700 shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest text-xs"
            >
              CHANGE STYLE
            </button>
          </div>
        </section>

        {/* Management */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Course Management</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="duo-card p-8 bg-purple-50 border-purple-200/50 flex flex-col justify-between">
               <div className="space-y-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-purple-200 text-[#ad46ff]">🛠️</div>
                  <div>
                     <h3 className="text-xl font-black text-[#ad46ff]">Build New Course</h3>
                     <p className="text-sm text-[#ad46ff]/70 font-bold leading-relaxed">Design your own curriculum step-by-step with characters, words, and grammar.</p>
                  </div>
               </div>
               <button 
                onClick={onCreateCourse}
                className="mt-8 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:scale-105 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
               >
                  CREATE COURSE
               </button>
            </div>

            <div className="duo-card p-8 bg-white flex flex-col justify-between">
               <div className="space-y-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-gray-100">📂</div>
                  <div>
                     <h3 className="text-xl font-black text-gray-700">Import LEXY</h3>
                     <p className="text-sm text-gray-400 font-bold leading-relaxed">Upload a .lexy file containing course data to instantly add it to your library.</p>
                  </div>
               </div>
               <div className="mt-8">
                  <UploadManager 
                    onCourseLoaded={onCourseLoaded} 
                    existingCourses={availableCourses.map(c => ({ id: c.id, language: c.language }))}
                  />
               </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Preferences</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="duo-card p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-gray-800">Sound Effects</h3>
                <p className="text-xs text-gray-400 font-bold">Play sounds during lessons</p>
              </div>
              <button 
                onClick={() => togglePreference('soundEnabled')}
                className={`w-14 h-8 rounded-full relative transition-all border-2 ${notificationSettings.soundEnabled ? 'bg-purple-100 border-purple-200' : 'bg-gray-100 border-gray-200'}`}
              >
                <div className={`absolute top-[2px] w-6 h-6 rounded-full transition-all shadow-sm ${notificationSettings.soundEnabled ? 'right-[2px] bg-[#ad46ff]' : 'left-[2px] bg-white'}`} />
              </button>
            </div>
            <div className="duo-card p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-gray-800">Motivational Messages</h3>
                <p className="text-xs text-gray-400 font-bold">Show cheers from characters</p>
              </div>
              <button 
                onClick={() => togglePreference('motivationalAlerts')}
                className={`w-14 h-8 rounded-full relative transition-all border-2 ${notificationSettings.motivationalAlerts ? 'bg-purple-100 border-purple-200' : 'bg-gray-100 border-gray-200'}`}
              >
                <div className={`absolute top-[2px] w-6 h-6 rounded-full transition-all shadow-sm ${notificationSettings.motivationalAlerts ? 'right-[2px] bg-[#ad46ff]' : 'left-[2px] bg-white'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">Danger Zone</h2>
            <div className="h-1 flex-1 bg-red-50 rounded-full"></div>
          </div>
          <div className="duo-card border-red-100 p-8 flex flex-col md:flex-row items-center justify-between bg-red-50/30">
            <div className="text-center md:text-left space-y-2 mb-6 md:mb-0">
              <h3 className="text-xl font-black text-red-600">Reset All Progress</h3>
              <p className="text-sm text-red-400 font-bold max-w-sm">
                This will permanently delete your XP, streaks, achievements, and saved words.
              </p>
            </div>
            <button 
              onClick={() => {
                if (window.confirm("Are you absolutely sure? All progress will be lost!")) {
                  onResetProgress();
                }
              }}
              className="p-4 px-10 rounded-2xl font-black text-white bg-red-500 border-b-4 border-red-700 active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest text-xs"
            >
              Reset Progress
            </button>
          </div>
        </section>
      </div>

      {/* Language Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full space-y-8 shadow-2xl animate-in zoom-in duration-300 mx-6">
            <div className="flex items-center justify-between border-b-2 border-gray-50 pb-4">
              <h2 className="text-3xl font-black text-gray-800">Select Language</h2>
              <button 
                onClick={() => setIsLanguageModalOpen(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl text-gray-400 hover:text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}

      {/* Font Selection Modal */}
      {isFontModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full space-y-8 shadow-2xl animate-in zoom-in duration-300 mx-6">
            <div className="flex items-center justify-between border-b-2 border-gray-50 pb-4">
              <h2 className="text-3xl font-black text-gray-800">Choose Logo Font</h2>
              <button 
                onClick={() => setIsFontModalOpen(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl text-gray-400 hover:text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
              <FontSelector />
            </div>
          </div>
        </div>
      )}

      {/* Mascot Selection Modal */}
      {isMascotModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full space-y-8 shadow-2xl animate-in zoom-in duration-300 mx-6">
            <div className="flex items-center justify-between border-b-2 border-gray-50 pb-4">
              <h2 className="text-3xl font-black text-gray-800">Choose Your Mascot</h2>
              <button 
                onClick={() => setIsMascotModalOpen(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl text-gray-400 hover:text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
              <MascotSelector />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsView;
