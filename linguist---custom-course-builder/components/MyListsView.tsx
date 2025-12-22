
import React, { useState, useMemo } from 'react';
import { DictionaryEntry } from '../types';

interface MyListsViewProps {
  dictionary?: DictionaryEntry[];
  savedWordIds: string[];
  onToggleSaveWord: (wordId: string) => void;
}

const MyListsView: React.FC<MyListsViewProps> = ({ dictionary = [], savedWordIds, onToggleSaveWord }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'words' | 'phrases'>('all');

  const savedItems = useMemo(() => {
    return dictionary.filter(item => savedWordIds.includes(item.id));
  }, [dictionary, savedWordIds]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return savedItems;
    if (activeFilter === 'words') return savedItems.filter(i => !i.isPhrase);
    if (activeFilter === 'phrases') return savedItems.filter(i => i.isPhrase);
    return savedItems;
  }, [savedItems, activeFilter]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-800 tracking-tight">My Collections</h1>
          <p className="text-lg text-gray-500 font-bold max-w-2xl">
            Everything you've bookmarked while exploring the course.
          </p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-2xl shrink-0">
          {[
            { id: 'all', label: 'All', icon: '📁' },
            { id: 'words', label: 'Words', icon: '📝' },
            { id: 'phrases', label: 'Phrases', icon: '💬' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-black text-xs uppercase transition-all ${
                activeFilter === tab.id 
                  ? 'bg-white text-blue-500 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-32 text-center space-y-6 max-w-md mx-auto animate-in zoom-in duration-300">
          <span className="text-8xl">🏜️</span>
          <h3 className="text-3xl font-black text-gray-800">Your list is empty</h3>
          <p className="text-gray-500 font-bold text-lg leading-relaxed">
            Go to the Search or Dictionary sections and tap the star to save your favorite vocabulary!
          </p>
          <div className="pt-4">
             <div className="h-1 bg-gray-100 rounded-full w-24 mx-auto" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="duo-card p-6 bg-white hover:border-blue-400 transition-all flex flex-col group animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-gray-800">{item.word}</h3>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${item.isPhrase ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {item.isPhrase ? 'Phrase' : 'Word'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-500">{item.translation}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => speak(item.word)}
                    className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    🔊
                  </button>
                  <button 
                    onClick={() => onToggleSaveWord(item.id)}
                    className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center hover:bg-yellow-200 transition-all"
                  >
                    ★
                  </button>
                </div>
              </div>
              {item.definition && <p className="text-sm text-gray-500 font-bold mb-3 line-clamp-2">{item.definition}</p>}
              {item.example && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 italic">"{item.example}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListsView;
