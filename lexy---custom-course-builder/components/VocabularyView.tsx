
import React, { useState, useMemo } from 'react';
import { ALPHABET } from '../constants';
import { DictionaryEntry, AlphabetItem } from '../types';

interface VocabularyViewProps {
  alphabet?: AlphabetItem[];
  dictionary?: DictionaryEntry[];
  savedWordIds: string[];
  onToggleSave: (wordId: string) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ alphabet, dictionary = [], savedWordIds, onToggleSave }) => {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'dictionary'>('alphabet');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dynamic Alphabet Logic
  const displayAlphabet = useMemo(() => {
    if (alphabet && alphabet.length > 0) {
      return alphabet;
    }
    // Fallback to constants if no custom alphabet provided
    return ALPHABET.map(char => ({ id: char, character: char } as AlphabetItem));
  }, [alphabet]);

  const vowels = ['A', 'E', 'I', 'O', 'U', 'a', 'e', 'i', 'o', 'u'];
  
  const sortedAlphabet = useMemo(() => {
    const v: AlphabetItem[] = [];
    const c: AlphabetItem[] = [];
    displayAlphabet.forEach(item => {
      if (vowels.includes(item.character)) v.push(item);
      else c.push(item);
    });
    return { vowels: v, consonants: c };
  }, [displayAlphabet]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const filteredDict = dictionary.filter(entry => 
    entry.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderWordCard = (entry: DictionaryEntry) => {
    const isSaved = savedWordIds.includes(entry.id);
    return (
      <div key={entry.id} className="duo-card p-6 bg-white hover:border-[#ad46ff] transition-all flex flex-col group">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-gray-800">{entry.word}</h3>
            <p className="text-lg font-bold text-[#ad46ff]">{entry.translation}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => speak(entry.word)}
              className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              🔊
            </button>
            <button 
              onClick={() => onToggleSave(entry.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isSaved ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-50 text-gray-300 hover:text-yellow-600'
              }`}
            >
              {isSaved ? '★' : '☆'}
            </button>
          </div>
        </div>
        {entry.definition && <p className="text-sm text-gray-500 font-bold mb-3 line-clamp-2">{entry.definition}</p>}
        {entry.example && (
          <div className="mt-auto pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">"{entry.example}"</p>
          </div>
        )}
      </div>
    );
  };

  const LetterButton: React.FC<{ item: AlphabetItem; type: 'vowel' | 'consonant' }> = ({ item, type }) => {
    const activeColors = type === 'vowel' 
      ? 'hover:border-[#ffc800] hover:bg-[#fff9e6] group-hover:text-[#ffc800]' 
      : 'hover:border-[#ad46ff] hover:bg-purple-50 group-hover:text-[#ad46ff]';
    return (
      <button
        onClick={() => speak(item.character)}
        className={`group duo-card p-5 flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 ${activeColors}`}
      >
        <span className="text-4xl font-black text-gray-800">{item.character}</span>
        {item.phonetic && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.phonetic}</span>}
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm shadow-inner transition-colors">
          🔊
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-gray-100 pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Vocabulary</h1>
          <p className="text-lg text-gray-500 font-bold mt-1">Build your repertoire word by word.</p>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          {[
            { id: 'alphabet', label: 'Alphabet', icon: '🔤' },
            { id: 'dictionary', label: 'Dictionary', icon: '📖' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-black text-xs uppercase transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-[#ad46ff] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'alphabet' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-300">
           {sortedAlphabet.vowels.length > 0 && (
             <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-700 uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-8 bg-yellow-400 rounded-full" /> Vowels
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                {sortedAlphabet.vowels.map((item) => <LetterButton key={item.id} item={item} type="vowel" />)}
              </div>
            </section>
           )}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-gray-700 uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-8 bg-[#ad46ff] rounded-full" /> Consonants
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {sortedAlphabet.consonants.map((item) => <LetterButton key={item.id} item={item} type="consonant" />)}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'dictionary' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-5 pl-14 duo-card text-lg font-bold outline-none focus:border-[#ad46ff] shadow-inner bg-gray-50"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400">🔍</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDict.length > 0 ? (
              filteredDict.map(renderWordCard)
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <span className="text-6xl">🏜️</span>
                <p className="text-xl font-black text-gray-300 uppercase tracking-widest">No words found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyView;
