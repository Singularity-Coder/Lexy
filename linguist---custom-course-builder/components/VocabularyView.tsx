
import React from 'react';
import { ALPHABET } from '../constants';

const VocabularyView: React.FC = () => {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = ALPHABET.filter(letter => !vowels.includes(letter));

  const speak = (letter: string) => {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = 'en-US';
    // Slightly adjust pitch/rate for clarity if needed
    utterance.pitch = 1;
    utterance.rate = 0.9;
    window.speechSynthesis.cancel(); // Stop current speech before starting new one
    window.speechSynthesis.speak(utterance);
  };

  const LetterButton = ({ letter, type }: { letter: string; type: 'vowel' | 'consonant' }) => {
    const activeColors = type === 'vowel' 
      ? 'hover:border-[#ffc800] hover:bg-[#fff9e6] group-hover:text-[#ffc800]' 
      : 'hover:border-[#1cb0f6] hover:bg-[#ddf4ff] group-hover:text-[#1cb0f6]';
    
    const iconColors = type === 'vowel'
      ? 'group-hover:bg-[#ffc800] group-hover:text-white'
      : 'group-hover:bg-[#84d8ff] group-hover:text-white';

    const borderColors = type === 'vowel' ? 'hover:border-[#ffc800]' : 'hover:border-[#1cb0f6]';

    return (
      <button
        key={letter}
        onClick={() => speak(letter)}
        className={`group duo-card p-6 flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 ${activeColors} ${borderColors}`}
      >
        <span className={`text-5xl font-black text-gray-800 transition-colors`}>{letter}</span>
        <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-inner transition-colors ${iconColors}`}>
          🔊
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-16 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-gray-800 tracking-tight">Alphabet Explorer</h1>
        <p className="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed">
          Master the building blocks of English. Tap any letter to hear its core sound.
        </p>
      </div>

      {/* Vowels Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-black text-gray-700 uppercase tracking-widest">The Vowels</h2>
          <div className="h-1 flex-1 bg-yellow-100 rounded-full"></div>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-black uppercase">Core Sounds</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          {vowels.map((letter) => (
            <LetterButton key={letter} letter={letter} type="vowel" />
          ))}
        </div>
        <p className="text-sm text-gray-400 font-bold italic">Vowels are the breath of language. Every English word contains at least one!</p>
      </section>

      {/* Consonants Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-black text-gray-700 uppercase tracking-widest">The Consonants</h2>
          <div className="h-1 flex-1 bg-blue-100 rounded-full"></div>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase">Structure</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {consonants.map((letter) => (
            <LetterButton key={letter} letter={letter} type="consonant" />
          ))}
        </div>
      </section>

      <div className="duo-card p-10 bg-gradient-to-r from-[#1cb0f6]/5 to-[#1cb0f6]/10 border-[#84d8ff] flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-lg border-2 border-[#1cb0f6]/20">
          🎓
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-black text-blue-800 mb-2">Did You Know?</h3>
          <p className="text-blue-600 font-bold text-lg leading-relaxed">
            While there are only 26 letters in the alphabet, they can create over 40 distinct sounds! 
            The letter <span className="underline decoration-wavy">Y</span> is a "semi-vowel" because it can act as both a vowel (like in "sky") and a consonant (like in "yellow").
          </p>
        </div>
      </div>
    </div>
  );
};

export default VocabularyView;
