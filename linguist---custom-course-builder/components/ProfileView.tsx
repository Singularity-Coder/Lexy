
import React from 'react';
import { UserStats } from '../types';

interface ProfileViewProps {
  stats: UserStats;
}

const ProfileView: React.FC<ProfileViewProps> = ({ stats }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row items-center gap-8 border-b-2 border-gray-100 pb-12">
        <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center text-8xl border-4 border-white shadow-xl">🦉</div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-5xl font-black text-gray-800 tracking-tight">Learner Profile</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <span className="px-4 py-2 bg-blue-50 text-[#1cb0f6] rounded-full font-black text-xs uppercase tracking-widest border border-blue-100">
               Rank: Silver League
             </span>
             <span className="px-4 py-2 bg-green-50 text-[#58cc02] rounded-full font-black text-xs uppercase tracking-widest border border-green-100">
               Member Since Feb 2024
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { v: stats.streak, l: 'STREAK', i: '🔥', c: 'text-orange-500' },
          { v: stats.xp, l: 'TOTAL XP', i: '⚡', c: 'text-yellow-500' },
          { v: stats.level, l: 'LEARNER LVL', i: '🏆', c: 'text-blue-500' },
          { v: stats.gems, l: 'GEMS', i: '💎', c: 'text-red-500' }
        ].map((s, i) => (
          <div key={i} className="duo-card p-6 flex flex-col items-center group hover:scale-105 transition-transform cursor-default">
            <span className={`text-4xl mb-3 ${s.c} filter drop-shadow-sm`}>{s.i}</span>
            <span className="text-3xl font-black text-gray-800">{s.v}</span>
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{s.l}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Extended Stats */}
        <div className="duo-card p-8 space-y-8 bg-gray-50/30">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Learning Progress
          </h3>
          <div className="space-y-6">
            <StatRow label="Lessons Completed" value={stats.lessonsCompleted} icon="📖" />
            <StatRow label="Time Spent (Est.)" value={`${stats.totalTimeMinutes}m`} icon="⏳" />
            <StatRow label="Vocabulary Size" value={Object.values(stats.savedWordIds).flat().length} icon="📚" />
            <StatRow label="Average Accuracy" value={`${stats.accuracy}%`} icon="🎯" />
            <StatRow label="Perfect Lessons" value={stats.perfectLessons} icon="✨" />
          </div>
        </div>

        {/* Achievements */}
        <div className="duo-card p-8 space-y-8">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400" /> Achievements
          </h3>
          <div className="space-y-4">
            {stats.achievements.map((a) => (
              <div key={a.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${a.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100 grayscale opacity-60'}`}>
                <div className="text-3xl">{a.icon}</div>
                <div className="flex-1">
                   <p className="font-black text-sm text-gray-800 leading-tight">{a.title}</p>
                   <p className="text-[10px] font-bold text-gray-400">{a.description}</p>
                   {a.unlocked ? (
                     <p className="text-[10px] font-black text-yellow-600 mt-1 uppercase tracking-widest">Unlocked!</p>
                   ) : (
                     <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-gray-300" style={{ width: `${Math.min(100, (a.currentValue / a.requirement) * 100)}%` }} />
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-bold text-gray-600">{label}</span>
    </div>
    <span className="font-black text-gray-800 text-lg">{value}</span>
  </div>
);

export default ProfileView;
