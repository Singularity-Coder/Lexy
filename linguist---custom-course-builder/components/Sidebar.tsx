
import React from 'react';
import { PROFICIENCY_LEVELS } from '../constants';
import { ProficiencyLevel } from '../types';

interface SidebarProps {
  onNavClick: (view: 'home' | 'settings' | 'profile' | 'vocabulary' | 'writing' | 'culture' | 'grammar' | 'games' | 'search' | 'notifications' | 'my-lists') => void;
  activeView: string;
  xp: number;
  streak: number;
  hearts: number;
  proficiencyLevel: ProficiencyLevel;
  currentLanguage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavClick, activeView, xp, streak, hearts, proficiencyLevel, currentLanguage }) => {
  const navItems = [
    { id: 'home', label: 'LEARN', icon: '🏠' },
    { id: 'search', label: 'SEARCH', icon: '🔍' },
    { id: 'vocabulary', label: 'VOCABULARY', icon: '📖' },
    { id: 'my-lists', label: 'MY LISTS', icon: '📂' },
    { id: 'grammar', label: 'GRAMMAR', icon: '📝' },
    { id: 'games', label: 'GAMES', icon: '🎮' },
    { id: 'writing', label: 'WRITING', icon: '✏️' },
    { id: 'culture', label: 'CULTURE', icon: '🌍' },
    { id: 'notifications', label: 'REMINDERS', icon: '🔔' },
    { id: 'profile', label: 'PROFILE', icon: '👤' },
    { id: 'settings', label: 'SETTINGS', icon: '⚙️' },
  ];

  const goalProgress = xp % 100;
  const currentLevelInfo = PROFICIENCY_LEVELS.find(l => l.level === proficiencyLevel) || PROFICIENCY_LEVELS[0];

  return (
    <div className="w-64 border-r-2 border-gray-100 h-screen fixed left-0 top-0 p-6 flex flex-col hidden md:flex z-50 bg-white">
      <div className="text-3xl font-extrabold text-[#58cc02] mb-1 tracking-tighter italic">
        LINGUIST
      </div>

      <div className="mb-6 space-y-4">
        {/* Merged Language & Stage Card */}
        <div 
          onClick={() => onNavClick('settings')}
          className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-sm flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
            <img src={currentLevelInfo.imageUrl} className="w-full h-full object-cover" alt={currentLevelInfo.name} />
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center space-x-1">
               <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">Learning</span>
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none truncate"> {currentLanguage}</span>
            </div>
            <p className="font-black text-gray-700 text-sm truncate mt-0.5">{currentLevelInfo.name}</p>
          </div>
        </div>

        {/* Stats Section: Streak and Hearts */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 p-2 rounded-xl bg-orange-50 border border-orange-100 font-black text-orange-500">
            <span>🔥</span>
            <span className="text-xs">{streak}</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-xl bg-red-50 border border-red-100 font-black text-red-500">
            <span>❤️</span>
            <span className="text-xs">{hearts}</span>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="p-3 duo-card bg-gray-50/50 border-gray-100 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-[9px] text-gray-400 uppercase tracking-widest">Daily Goal</h3>
            <span className="text-[9px] font-black text-gray-500">{goalProgress}%</span>
          </div>
          <div className="progress-bar !h-2">
             <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id as any)}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl font-black transition-all transform active:scale-95 ${
              activeView === item.id 
                ? 'bg-[#ddf4ff] text-[#1cb0f6] border-2 border-[#84d8ff]' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="tracking-widest text-[10px] uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t-2 border-gray-100">
        <div className="flex items-center justify-between text-yellow-600 font-black">
          <div className="flex items-center space-x-2">
            <span>⚡</span>
            <span className="text-[10px]">TOTAL XP</span>
          </div>
          <span className="text-xs">{xp}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
