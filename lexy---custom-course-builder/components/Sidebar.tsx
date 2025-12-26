
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
  brandFont: string;
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
  onToggle,
  brandFont
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
          <div 
            className="text-4xl text-[#ad46ff] select-none"
            style={{ fontFamily: brandFont }}
          >
            Lexy
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
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-4 pb-10 space-y-8">
          <div className="space-y-5">
            {/* Language & Stage Card */}
            <div 
              onClick={() => {
                onNavClick('settings');
                if (window.innerWidth < 768) onToggle();
              }}
              className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm flex items-center space-x-4 cursor-pointer hover:bg-gray-100 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                <img src={currentLevelInfo.imageUrl} className="w-full h-full object-cover" alt={currentLevelInfo.name} />
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center space-x-1">
                   <span className="text-[11px] font-black text-[#ad46ff] uppercase tracking-[0.15em] leading-none truncate">{currentLanguage}</span>
                </div>
                <p className="font-black text-gray-700 text-base truncate mt-0.5">{currentLevelInfo.name}</p>
              </div>
            </div>

            {/* Unified Stats Box */}
            <div className="duo-card overflow-hidden border-gray-100 bg-white shadow-none">
              {/* Daily Goal Row */}
              <div className="p-3 px-4 bg-purple-50 border-b-2 border-gray-100 font-black text-purple-600 transition-colors">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">🎯</span>
                    <span className="text-[10px] uppercase tracking-widest leading-none">Daily Goal</span>
                  </div>
                  <span className="text-[10px] leading-none">{goalProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-purple-100/50 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-[#ad46ff] rounded-full transition-all duration-500" 
                    style={{ width: `${goalProgress}%` }} 
                   />
                </div>
              </div>

              {/* Total XP Row */}
              <div className="flex items-center justify-between p-3 px-4 border-b-2 border-gray-100 bg-yellow-50 font-black text-yellow-600 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">⚡</span>
                  <span className="text-[10px] uppercase tracking-widest leading-none">Total XP</span>
                </div>
                <span className="text-xs leading-none">{xp}</span>
              </div>

              {/* Streak and Hearts Row Grid */}
              <div className="grid grid-cols-2">
                <div className="flex items-center justify-center space-x-2 p-3 bg-orange-50 border-r-2 border-gray-100 font-black text-orange-500 transition-colors">
                  <span className="text-lg">🔥</span>
                  <span className="text-xs">{streak}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-3 bg-red-50 font-black text-red-500 transition-colors">
                  <span className="text-lg">❤️</span>
                  <span className="text-xs">{hearts}</span>
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
                    ? 'bg-purple-50 text-[#ad46ff] border-purple-100' 
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
