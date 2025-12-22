
import React, { useState } from 'react';
import UploadManager from './UploadManager';
import { CourseData, ProficiencyLevel } from '../types';
import { PROFICIENCY_LEVELS } from '../constants';

interface SettingsViewProps {
  availableCourses: CourseData[];
  onCourseSwitch: (courseId: string) => void;
  onCourseLoaded: (course: CourseData, mediaMap: Map<string, string>) => void;
  onResetProgress: () => void;
  currentProficiency: ProficiencyLevel;
  onUpdateProficiency: (level: ProficiencyLevel) => void;
  currentCourseId: string;
  autoOpenLanguages?: boolean;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  availableCourses,
  onCourseSwitch,
  onCourseLoaded, 
  onResetProgress, 
  currentProficiency, 
  onUpdateProficiency,
  currentCourseId,
  autoOpenLanguages = false
}) => {
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(autoOpenLanguages);

  const LanguageSelector = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {availableCourses.map((course) => (
        <button
          key={course.id}
          onClick={() => {
            onCourseSwitch(course.id);
            setIsLanguageModalOpen(false);
          }}
          className={`p-5 rounded-2xl flex items-center space-x-4 border-2 transition-all group ${
            currentCourseId === course.id 
              ? 'bg-blue-50 border-[#1cb0f6] shadow-[0_4px_0_#1cb0f6]' 
              : 'bg-white border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
            🌐
          </div>
          <div className="text-left">
            <p className="font-black text-gray-800">{course.language}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase">{course.courseTitle}</p>
          </div>
          {currentCourseId === course.id && (
            <div className="ml-auto text-[#1cb0f6] font-black">✓</div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-800">Settings</h1>
        <p className="text-gray-500 font-bold">Customize your learning experience and manage course data.</p>
      </div>

      {/* Language Switcher Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">My Languages</h2>
          <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="duo-card p-6 bg-blue-50/30 border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-sm">🌐</div>
            <div>
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Active Language</p>
              <h3 className="text-2xl font-black text-blue-700">{availableCourses.find(c => c.id === currentCourseId)?.language || 'None'}</h3>
            </div>
          </div>
          <button 
            onClick={() => setIsLanguageModalOpen(true)}
            className="w-full md:w-auto p-4 px-8 rounded-xl font-black bg-white text-[#1cb0f6] border-2 border-[#1cb0f6] hover:bg-blue-50 transition-all shadow-[0_4px_0_#1cb0f6] active:translate-y-1 active:shadow-none"
          >
            SWITCH LANGUAGE
          </button>
        </div>

        {/* Modal Popup */}
        {isLanguageModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full space-y-8 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-800">Select Language</h2>
                <button onClick={() => setIsLanguageModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-600 font-bold">✕</button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <LanguageSelector />
              </div>
              <button 
                onClick={() => setIsLanguageModalOpen(false)}
                className="w-full p-4 rounded-2xl font-black text-white bg-[#1cb0f6] border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Proficiency Stage Selection */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Learning Stage</h2>
          <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PROFICIENCY_LEVELS.map((info) => (
            <button
              key={info.level}
              onClick={() => onUpdateProficiency(info.level)}
              className={`duo-card p-4 flex flex-col items-center text-center space-y-3 transition-all transform active:scale-95 group border-2 ${
                currentProficiency === info.level
                  ? 'border-[#1cb0f6] bg-[#ddf4ff] shadow-[0_4px_0_#1cb0f6]'
                  : 'border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
              }`}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                <img src={info.imageUrl} className="w-full h-full object-cover" alt={info.name} />
              </div>
              <div>
                <h3 className={`font-black text-sm ${currentProficiency === info.level ? 'text-[#1cb0f6]' : 'text-gray-700'}`}>
                  {info.name}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                  {info.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Course Management Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Upload New Material</h2>
          <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
        </div>
        <div className="bg-white rounded-3xl overflow-hidden">
          <UploadManager onCourseLoaded={onCourseLoaded} />
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
            <button className="w-12 h-6 bg-[#58cc02] rounded-full relative flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
            </button>
          </div>
          <div className="duo-card p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-gray-800">Motivational Messages</h3>
              <p className="text-xs text-gray-400 font-bold">Show cheers from characters</p>
            </div>
            <button className="w-12 h-6 bg-[#58cc02] rounded-full relative flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
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
  );
};

export default SettingsView;
