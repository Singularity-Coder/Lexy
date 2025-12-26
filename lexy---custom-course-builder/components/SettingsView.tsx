
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
  onUpdateProficiency: (level: ProficiencyLevel) => void;
  currentCourseId: string;
  selectedMascotId: string;
  onUpdateMascot: (mascotId: string) => void;
  brandFont: string;
  onUpdateBrandFont: (font: string) => void;
  onCreateCourse?: () => void;
  notificationSettings: NotificationSettings;
  onUpdateNotifications: (settings: NotificationSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  availableCourses,
  onCourseSwitch,
  onCourseLoaded, 
  onResetProgress, 
  currentProficiency, 
  onUpdateProficiency,
  currentCourseId,
  selectedMascotId,
  onUpdateMascot,
  brandFont,
  onUpdateBrandFont,
  onCreateCourse,
  notificationSettings,
  onUpdateNotifications
}) => {
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isMascotModalOpen, setIsMascotModalOpen] = useState(false);

  const currentLevelInfo = PROFICIENCY_LEVELS.find(l => l.level === currentProficiency) || PROFICIENCY_LEVELS[0];
  const currentMascot = MASCOTS.find(m => m.id === selectedMascotId) || MASCOTS[0];

  const LanguageSelector = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 pb-8">
      {availableCourses.map((course) => (
        <button
          key={course.id}
          onClick={() => {
            onCourseSwitch(course.id);
            setIsLanguageModalOpen(false);
          }}
          className={`p-5 rounded-2xl flex items-center transition-all group ${
            currentCourseId === course.id 
              ? 'bg-purple-100 border-2 border-purple-200 text-purple-700 shadow-[0_4px_0_#c4b5fd]' 
              : 'bg-white border-2 border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
          }`}
        >
          <div className="text-left">
            <p className="font-black text-gray-800">{course.language}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{course.courseTitle}</p>
          </div>
        </button>
      ))}
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

  const StageSelector = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 px-4 pb-8 pt-2">
      {PROFICIENCY_LEVELS.map((info) => (
        <button
          key={info.level}
          onClick={() => {
            onUpdateProficiency(info.level);
            setIsStageModalOpen(false);
          }}
          className={`flex flex-col items-stretch text-center rounded-[2.5rem] transition-all transform active:scale-95 group overflow-hidden border-2 ${
            currentProficiency === info.level
              ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-[0_4px_0_#c4b5fd]'
              : 'bg-white border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
          }`}
        >
          {/* Perfect 1:1 Square Image Section */}
          <div className="aspect-square w-full overflow-hidden bg-gray-50">
            <img 
              src={info.imageUrl} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              alt={info.name} 
            />
          </div>
          
          {/* Text Section Below Image - Adjusted for balance with the square format */}
          <div className="p-4 md:p-5 space-y-1 bg-inherit">
            <h3 className={`font-black text-sm md:text-base ${currentProficiency === info.level ? 'text-purple-700' : 'text-gray-800'}`}>
              {info.name}
            </h3>
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
              {info.description}
            </p>
          </div>
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
      <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Settings</h1>
          <p className="text-lg text-gray-500 font-bold mt-1">Customize your learning experience and manage course data.</p>
        </div>

        {/* Language Switcher Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">My Languages</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="duo-card p-6 bg-purple-50/10 border-purple-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div>
                <h3 className="text-2xl font-black text-[#ad46ff]">{availableCourses.find(c => c.id === currentCourseId)?.language || 'None'}</h3>
              </div>
            </div>
            <button 
              onClick={() => setIsLanguageModalOpen(true)}
              className="w-full md:w-auto p-4 px-8 rounded-2xl font-black bg-purple-100 text-purple-700 shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest text-xs"
            >
              SWITCH LANGUAGE
            </button>
          </div>
        </section>

        {/* Proficiency Stage Selection */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Learning Stage</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="duo-card p-6 bg-purple-50/10 border-purple-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
                <img src={currentLevelInfo.imageUrl} className="w-full h-full object-cover" alt={currentLevelInfo.name} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-[#ad46ff]">{currentLevelInfo.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{currentLevelInfo.description}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsStageModalOpen(true)}
              className="w-full md:w-auto p-4 px-8 rounded-2xl font-black bg-purple-100 text-purple-700 shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest text-xs"
            >
              CHANGE STAGE
            </button>
          </div>
        </section>

        {/* Mascot Selection */}
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

        {/* Brand Style Section */}
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

        {/* Course Management */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Course Management</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create New Course Card */}
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

            {/* Import JSON Card */}
            <div className="duo-card p-8 bg-white flex flex-col justify-between">
               <div className="space-y-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-gray-100">📂</div>
                  <div>
                     <h3 className="text-xl font-black text-gray-700">Import JSON</h3>
                     <p className="text-sm text-gray-400 font-bold leading-relaxed">Upload a .json file containing course data to instantly add it to your library.</p>
                  </div>
               </div>
               <div className="mt-8">
                  <UploadManager onCourseLoaded={onCourseLoaded} />
               </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
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
                if (confirm("Are you absolutely sure? All progress will be lost!")) {
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

      {/* Stage Selection Modal - Narrowed slightly and vertical spacing reduced */}
      {isStageModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-[3rem] p-8 max-w-4xl w-full space-y-3 shadow-2xl animate-in zoom-in duration-300 mx-6">
            <div className="flex items-center justify-between border-b-2 border-gray-50 pb-4 px-2">
              <h2 className="text-3xl font-black text-gray-800">Select Learning Stage</h2>
              <button 
                onClick={() => setIsStageModalOpen(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl text-gray-400 hover:text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto scrollbar-hide">
              <StageSelector />
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
