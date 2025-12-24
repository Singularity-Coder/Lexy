
import React from 'react';
import { PROFICIENCY_LEVELS, SIDEBAR_NAV_ITEMS as navItems } from '../constants';
import { ProficiencyLevel } from '../types';

interface SidebarProps {
  onNavClick: (view: 'home' | 'settings' | 'profile' | 'vocabulary' | 'writing' | 'culture' | 'grammar' | 'games' | 'search' | 'notifications' | 'my-lists' | 'ai-chats') => void;
  activeView: string;
  xp: number;
  streak: number;
  hearts: number;
  proficiencyLevel: ProficiencyLevel;
  currentLanguage: string;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onNavClick, 
  activeView, 
  xp, 
  streak, 
  hearts, 
  proficiencyLevel, 
  currentLanguage,
  isOpen,
  onToggle
}) => {
  const goalProgress = xp % 100;
  const currentLevelInfo = PROFICIENCY_LEVELS.find(l => l.level === proficiencyLevel) || PROFICIENCY_LEVELS[0];

  return (
    <>
      {/* Mobile Overlay - Only visible when open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] md:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container - Always visible on desktop (w-72), slide-in on mobile */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-white border-r-2 border-gray-100 z-[70] transition-transform duration-300 ease-in-out transform flex flex-col w-72 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Area */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="text-3xl font-black text-[#58cc02] tracking-tighter italic select-none">
            LINGUIST
          </div>
          {/* Mobile-only close button */}
          <button 
            onClick={onToggle}
            className="md:hidden p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-4 pb-10 space-y-8">
          <div className="space-y-5">
            {/* Language & Stage Card */}
            <div 
              onClick={() => {
                onNavClick('settings');
                if (window.innerWidth < 768) onToggle();
              }}
              className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-sm flex items-center space-x-4 cursor-pointer hover:bg-gray-100 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                <img src={currentLevelInfo.imageUrl} className="w-full h-full object-cover" alt={currentLevelInfo.name} />
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center space-x-1">
                   <span className="text-[11px] font-black text-[#1cb0f6] uppercase tracking-[0.15em] leading-none truncate">{currentLanguage}</span>
                </div>
                <p className="font-black text-gray-700 text-base truncate mt-0.5">{currentLevelInfo.name}</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-3">
              {/* Daily Goal Pill - Styled like the other stats */}
              <div className="flex flex-col space-y-2.5 p-3 px-4 rounded-2xl bg-blue-50 border border-blue-100 font-black text-blue-600 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🎯</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.1em]">Daily Goal</span>
                  </div>
                  <span className="text-xs font-black">{goalProgress}%</span>
                </div>
                <div className="w-full h-2 bg-blue-100/50 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                    style={{ width: `${goalProgress}%` }} 
                   />
                </div>
              </div>

              {/* Grid for Streak and Hearts */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-orange-50 border border-orange-100 font-black text-orange-500 shadow-sm">
                  <span className="text-xl">🔥</span>
                  <span className="text-sm">{streak}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-red-50 border border-red-100 font-black text-red-500 shadow-sm">
                  <span className="text-xl">❤️</span>
                  <span className="text-sm">{hearts}</span>
                </div>
              </div>

              {/* Total XP Pill */}
              <div className="flex items-center space-x-3 p-3 px-4 rounded-2xl bg-yellow-50 border border-yellow-100 font-black text-yellow-600 shadow-sm">
                <span className="text-xl">⚡</span>
                <div className="flex justify-between items-center flex-1">
                  <span className="text-[11px] font-black uppercase tracking-[0.1em]">Total XP</span>
                  <span className="text-sm">{xp}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavClick(item.id as any);
                  if (window.innerWidth < 768) onToggle();
                }}
                className={`w-full flex items-center p-3.5 px-4 rounded-2xl font-bold transition-all transform active:scale-95 space-x-4 border-2 ${
                  activeView === item.id 
                    ? 'bg-[#ddf4ff] text-[#1cb0f6] border-[#84d8ff]' 
                    : 'text-gray-500 border-transparent hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="tracking-tight text-base font-black uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
