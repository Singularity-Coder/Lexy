
import React from 'react';
import { NotificationSettings } from '../types';

interface NotificationsViewProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ settings, onUpdate }) => {
  const toggle = (key: keyof NotificationSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  const setTime = (time: string) => {
    onUpdate({ ...settings, reminderTime: time });
  };

  const testNotification = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      new Notification("Lexi Reminder!", {
        body: "Time for your daily language lesson! Stay on your streak. 🔥",
        icon: "https://cdn-icons-png.flaticon.com/512/3253/3253215.png"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-12 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Reminders</h1>
        <p className="text-lg text-gray-500 font-bold mt-1">Stay consistent and never miss a streak.</p>
      </div>

      <div className="space-y-6">
        <div className="duo-card p-8 bg-white space-y-8">
          {/* Daily Reminders */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                ⏰
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-800">Daily Reminders</h3>
                <p className="text-sm text-gray-400 font-bold">We'll nudge you if you forget to study.</p>
              </div>
            </div>
            <button 
              onClick={() => toggle('remindersEnabled')}
              className={`w-14 h-8 rounded-full relative transition-all border-2 ${settings.remindersEnabled ? 'bg-purple-100 border-purple-200' : 'bg-gray-100 border-gray-200'}`}
            >
              <div className={`absolute top-[2px] w-6 h-6 rounded-full transition-all shadow-sm ${settings.remindersEnabled ? 'right-[2px] bg-[#ad46ff]' : 'left-[2px] bg-white'}`} />
            </button>
          </div>

          {settings.remindersEnabled && (
            <div className="pl-20 animate-in slide-in-from-top duration-200">
               <div className="flex items-center space-x-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Time:</label>
                  <input 
                    type="time" 
                    value={settings.reminderTime}
                    onChange={(e) => setTime(e.target.value)}
                    className="p-3 duo-card border-none bg-gray-50 font-black text-blue-500 outline-none focus:ring-2 ring-blue-100"
                  />
               </div>
            </div>
          )}

          <div className="h-0.5 bg-gray-50 w-full" />

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                🎵
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-800">Sound Notifications</h3>
                <p className="text-sm text-gray-400 font-bold">Play motivational sounds and alerts.</p>
              </div>
            </div>
            <button 
              onClick={() => toggle('soundEnabled')}
              className={`w-14 h-8 rounded-full relative transition-all border-2 ${settings.soundEnabled ? 'bg-purple-100 border-purple-200' : 'bg-gray-100 border-gray-200'}`}
            >
              <div className={`absolute top-[2px] w-6 h-6 rounded-full transition-all shadow-sm ${settings.soundEnabled ? 'right-[2px] bg-[#ad46ff]' : 'left-[2px] bg-white'}`} />
            </button>
          </div>

          <div className="h-0.5 bg-gray-50 w-full" />

          {/* Motivational Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                🌟
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-800">Motivational Alerts</h3>
                <p className="text-sm text-gray-400 font-bold">Get cheering messages and streak updates.</p>
              </div>
            </div>
            <button 
              onClick={() => toggle('motivationalAlerts')}
              className={`w-14 h-8 rounded-full relative transition-all border-2 ${settings.motivationalAlerts ? 'bg-purple-100 border-purple-200' : 'bg-gray-100 border-gray-200'}`}
            >
              <div className={`absolute top-[2px] w-6 h-6 rounded-full transition-all shadow-sm ${settings.motivationalAlerts ? 'right-[2px] bg-[#ad46ff]' : 'left-[2px] bg-white'}`} />
            </button>
          </div>
        </div>

        <button 
          onClick={testNotification}
          className="w-full p-5 duo-card bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors"
        >
          Test Notification Signal
        </button>
      </div>

      <div className="duo-card p-12 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100 flex flex-col md:flex-row items-center gap-10">
        <div className="text-7xl">💡</div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-purple-800">Pro Tip</h3>
          <p className="text-purple-600 font-bold leading-relaxed">
            Consistency is key! Users who set reminders are <span className="text-purple-700 font-black">3x more likely</span> to complete their first course unit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
