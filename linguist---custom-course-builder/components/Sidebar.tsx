
import React from 'react';
import { PROFICIENCY_LEVELS } from '../constants';
import { ProficiencyLevel } from '../types';

interface SidebarProps {
  onNavClick: (view: 'home' | 'settings' | 'profile' | 'vocabulary' | 'writing' | 'culture') => void;
  activeView: string;
  xp: number;
  proficiencyLevel: ProficiencyLevel;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavClick, activeView, xp, proficiencyLevel }) => {
  const navItems = [
    { id: 'home', label: 'LEARN', icon: '🏠' },
    { id: 'vocabulary', label: 'VOCABULARY', icon: '📖' },
    { id: 'writing', label: 'WRITING', icon: '✏️' },
    { id: 'culture', label: 'CULTURE', icon: '🌍' },
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

      {/* Level Badge Under Logo */}
      <div className="mb-8 p-3 bg-gray-50 rounded-2xl flex items-center space-x-3 border-2 border-gray-100 shadow-sm transition-all hover:bg-gray-100 cursor-pointer group" onClick={() => onNavClick('settings')}>
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
          <img src={currentLevelInfo.imageUrl} className="w-full h-full object-cover" alt={currentLevelInfo.name} />
        </div>
        <div className="overflow-hidden">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Stage</p>
          <p className="font-black text-gray-700 text-sm truncate">{currentLevelInfo.name}</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id as any)}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl font-black transition-all transform active:scale-95 ${
              activeView === item.id 
                ? 'bg-[#ddf4ff] text-[#1cb0f6] border-2 border-[#84d8ff]' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="tracking-widest text-xs uppercase">{item.label}</span>
          </button>
        ))}

        <div className="mt-8 p-4 duo-card bg-gray-50/50 border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Daily Goal</h3>
          </div>
          <div className="progress-bar !h-2">
             <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
          </div>
          <p className="text-[11px] font-black text-gray-500">{goalProgress} / 100 XP</p>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t-2 border-gray-100 space-y-4">
        <div className="flex items-center justify-between text-orange-500 font-black">
          <div className="flex items-center space-x-2">
            <span>🔥</span>
            <span className="text-xs">STREAK</span>
          </div>
          <span>5</span>
        </div>
        <div className="flex items-center justify-between text-red-500 font-black">
           <div className="flex items-center space-x-2">
            <span>❤️</span>
            <span className="text-xs">HEARTS</span>
          </div>
          <span>∞</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
