
import React from 'react';
import UploadManager from './UploadManager';
import { CourseData, ProficiencyLevel } from '../types';
import { PROFICIENCY_LEVELS } from '../constants';

interface SettingsViewProps {
  onCourseLoaded: (course: CourseData, mediaMap: Map<string, string>) => void;
  onResetProgress: () => void;
  currentProficiency: ProficiencyLevel;
  onUpdateProficiency: (level: ProficiencyLevel) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  onCourseLoaded, 
  onResetProgress, 
  currentProficiency, 
  onUpdateProficiency 
}) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-800">Settings</h1>
        <p className="text-gray-500 font-bold">Customize your learning experience and manage course data.</p>
      </div>

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
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Course Management</h2>
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
              This will permanently delete your XP, streaks, achievements, and mistakes history. This action cannot be undone.
            </p>
          </div>
          <button 
            onClick={() => {
              if (confirm("Are you absolutely sure? All your hard-earned progress will be lost!")) {
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
