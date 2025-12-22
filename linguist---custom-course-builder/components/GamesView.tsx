
import React, { useState, useEffect, useMemo } from 'react';
import { DictionaryEntry } from '../types';

interface GamesViewProps {
  dictionary?: DictionaryEntry[];
}

type GameMode = 'menu' | 'scramble' | 'hangman' | 'crossword';

const GamesView: React.FC<GamesViewProps> = ({ dictionary = [] }) => {
  const [activeGame, setActiveGame] = useState<GameMode>('menu');
  const [score, setScore] = useState(0);

  if (dictionary.length < 5) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center space-y-6 px-6">
        <span className="text-7xl">🚧</span>
        <h1 className="text-4xl font-black text-gray-800">Need More Words!</h1>
        <p className="text-gray-500 font-bold max-w-md mx-auto leading-relaxed">
          Please upload a course with at least 5 dictionary entries to unlock the Game Studio. 
          Current count: {dictionary.length}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-gray-800 tracking-tight">Game Studio</h1>
          <p className="text-gray-500 font-bold">Learn through play and earn bonus XP!</p>
        </div>
        <div className="bg-yellow-100 p-3 px-6 rounded-2xl border-2 border-yellow-200 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-[10px] font-black text-yellow-600 uppercase">Session XP</p>
            <p className="text-xl font-black text-yellow-700">{score}</p>
          </div>
        </div>
      </div>

      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GameCard 
            title="Word Scramble" 
            desc="Rearrange tiles to form the correct word." 
            icon="🔠" 
            color="bg-blue-500" 
            onClick={() => setActiveGame('scramble')} 
          />
          <GameCard 
            title="Hangman" 
            desc="Guess the letters before your hearts run out." 
            icon="😵" 
            color="bg-red-500" 
            onClick={() => setActiveGame('hangman')} 
          />
          <GameCard 
            title="Mini Crossword" 
            desc="Solve clues to fill the intersecting grid." 
            icon="🧩" 
            color="bg-purple-500" 
            onClick={() => setActiveGame('crossword')} 
          />
        </div>
      )}

      {activeGame === 'scramble' && (
        <ScrambleGame dictionary={dictionary} onWin={() => setScore(s => s + 15)} onExit={() => setActiveGame('menu')} />
      )}

      {activeGame === 'hangman' && (
        <HangmanGame dictionary={dictionary} onWin={() => setScore(s => s + 20)} onExit={() => setActiveGame('menu')} />
      )}

      {activeGame === 'crossword' && (
        <CrosswordGame dictionary={dictionary} onWin={() => setScore(s => s + 50)} onExit={() => setActiveGame('menu')} />
      )}
    </div>
  );
};

/* --- SHARED COMPONENTS --- */

const GameCard: React.FC<{ title: string; desc: string; icon: string; color: string; onClick: () => void }> = ({ title, desc, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="duo-card p-8 group hover:border-[#1cb0f6] transition-all flex flex-col items-center text-center space-y-6"
  >
    <div className={`w-24 h-24 ${color} rounded-3xl flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="space-y-2">
      <h3 className="text-2xl font-black text-gray-800">{title}</h3>
      <p className="text-gray-500 font-bold text-sm leading-relaxed">{desc}</p>
    </div>
    <div className="w-full pt-4">
      <div className="bg-gray-100 text-gray-400 font-black text-[10px] uppercase py-2 rounded-xl group-hover:bg-[#1cb0f6] group-hover:text-white transition-colors">
        Play Now
      </div>
    </div>
  </button>
);

/* --- SCRAMBLE GAME --- */

const ScrambleGame: React.FC<{ dictionary: DictionaryEntry[]; onWin: () => void; onExit: () => void }> = ({ dictionary, onWin, onExit }) => {
  const [word, setWord] = useState<DictionaryEntry | null>(null);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const initGame = () => {
    const w = dictionary[Math.floor(Math.random() * dictionary.length)];
    setWord(w);
    setShuffled(w.word.split('').sort(() => Math.random() - 0.5));
    setSelected([]);
    setStatus('playing');
  };

  useEffect(initGame, [dictionary]);

  const handleTileClick = (idx: number) => {
    if (status !== 'playing') return;
    if (selected.includes(idx)) {
      setSelected(prev => prev.filter(i => i !== idx));
    } else {
      const newSelected = [...selected, idx];
      setSelected(newSelected);
      if (newSelected.length === word?.word.length) {
        const guess = newSelected.map(i => shuffled[i]).join('');
        if (guess.toLowerCase() === word.word.toLowerCase()) {
          setStatus('won');
          onWin();
        } else {
          setTimeout(() => setSelected([]), 500);
        }
      }
    }
  };

  return (
    <div className="duo-card p-10 bg-white flex flex-col items-center space-y-12 animate-in zoom-in duration-300">
      <div className="w-full flex justify-between items-center">
        <button onClick={onExit} className="text-gray-400 font-bold hover:text-gray-600">BACK</button>
        <span className="font-black text-blue-500 uppercase tracking-widest text-xs">Word Scramble</span>
        <div className="w-8" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Translation</p>
        <h2 className="text-4xl font-black text-gray-800 italic">"{word?.translation}"</h2>
      </div>

      <div className="flex flex-wrap gap-4 justify-center min-h-[80px] p-6 bg-gray-50 rounded-3xl w-full max-w-2xl border-2 border-dashed border-gray-200">
        {selected.map((idx, i) => (
          <div key={i} className="w-14 h-14 bg-white border-b-4 border-blue-500 rounded-xl flex items-center justify-center text-2xl font-black text-blue-600 shadow-sm animate-in zoom-in">
            {shuffled[idx]}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {shuffled.map((char, idx) => (
          <button
            key={idx}
            disabled={selected.includes(idx) || status !== 'playing'}
            onClick={() => handleTileClick(idx)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black transition-all ${
              selected.includes(idx)
                ? 'bg-gray-100 text-transparent border-none'
                : 'bg-white border-2 border-gray-200 border-b-4 hover:bg-gray-50 active:translate-y-1 active:border-b-0'
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      {status === 'won' && (
        <div className="text-center space-y-4">
          <p className="text-[#58cc02] font-black text-2xl">Perfect!</p>
          <button onClick={initGame} className="bg-[#58cc02] text-white p-4 px-10 rounded-2xl font-black shadow-[0_4px_0_#46a302]">NEXT WORD</button>
        </div>
      )}
    </div>
  );
};

/* --- HANGMAN GAME --- */

const HangmanGame: React.FC<{ dictionary: DictionaryEntry[]; onWin: () => void; onExit: () => void }> = ({ dictionary, onWin, onExit }) => {
  const [word, setWord] = useState<DictionaryEntry | null>(null);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [hearts, setHearts] = useState(5);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const initGame = () => {
    const w = dictionary[Math.floor(Math.random() * dictionary.length)];
    setWord(w);
    setGuessed([]);
    setHearts(5);
    setStatus('playing');
  };

  useEffect(initGame, [dictionary]);

  const handleGuess = (letter: string) => {
    if (status !== 'playing' || guessed.includes(letter)) return;
    setGuessed(prev => [...prev, letter]);
    
    if (!word?.word.toLowerCase().includes(letter.toLowerCase())) {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts === 0) setStatus('lost');
    } else {
      const allGuessed = word.word.split('').every(char => 
        char === ' ' || [...guessed, letter].includes(char.toLowerCase())
      );
      if (allGuessed) {
        setStatus('won');
        onWin();
      }
    }
  };

  return (
    <div className="duo-card p-10 bg-white flex flex-col items-center space-y-12 animate-in zoom-in duration-300">
      <div className="w-full flex justify-between items-center">
        <button onClick={onExit} className="text-gray-400 font-bold hover:text-gray-600">BACK</button>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-xl transition-all ${i < hearts ? 'grayscale-0 scale-110' : 'grayscale opacity-30'}`}>❤️</span>
          ))}
        </div>
        <div className="w-8" />
      </div>

      <div className="text-center space-y-4">
        <div className="bg-red-50 p-4 px-8 rounded-2xl inline-block border-2 border-red-100">
          <p className="text-red-400 font-black uppercase text-[10px] tracking-widest mb-1">Clue</p>
          <p className="text-lg font-bold text-red-700 italic">"{word?.translation}"</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {word?.word.split('').map((char, i) => (
          <div key={i} className={`w-12 h-16 flex items-center justify-center text-4xl font-black border-b-4 transition-all ${
            char === ' ' ? 'border-transparent' : guessed.includes(char.toLowerCase()) ? 'border-green-400 text-green-600' : 'border-gray-200 text-transparent'
          }`}>
            {guessed.includes(char.toLowerCase()) ? char.toUpperCase() : char === ' ' ? ' ' : '?'}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 w-full max-w-2xl">
        {"abcdefghijklmnopqrstuvwxyz".split('').map(l => (
          <button
            key={l}
            disabled={guessed.includes(l) || status !== 'playing'}
            onClick={() => handleGuess(l)}
            className={`p-3 rounded-xl font-black text-sm uppercase transition-all ${
              guessed.includes(l)
                ? word?.word.toLowerCase().includes(l) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-b-2 border-gray-200'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {status !== 'playing' && (
        <div className="text-center space-y-4 animate-in zoom-in">
          <h3 className={`text-3xl font-black ${status === 'won' ? 'text-[#58cc02]' : 'text-red-500'}`}>
            {status === 'won' ? 'Great Job!' : `Game Over! The word was "${word?.word}"`}
          </h3>
          <button onClick={initGame} className="bg-gray-800 text-white p-4 px-10 rounded-2xl font-black">PLAY AGAIN</button>
        </div>
      )}
    </div>
  );
};

/* --- MINI CROSSWORD GAME --- */

const CrosswordGame: React.FC<{ dictionary: DictionaryEntry[]; onWin: () => void; onExit: () => void }> = ({ dictionary, onWin, onExit }) => {
  // Simple generator that picks 3 words and attempts a very basic intersection
  const [grid, setGrid] = useState<any[]>([]);
  const [clues, setClues] = useState<{across: any[], down: any[]}>({across: [], down: []});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'playing' | 'won'>('playing');

  const generate = () => {
    // Picking words that are short for grid compatibility
    const candidates = dictionary.filter(w => w.word.length >= 3 && w.word.length <= 6);
    const w1 = candidates[Math.floor(Math.random() * candidates.length)];
    const w2 = candidates.find(w => w.id !== w1.id) || w1;
    
    // Simplest static layout for demonstration: 2 words crossing
    // Word 1: Across at (2, 1)
    // Word 2: Down at (1, 3)
    // We search for a pair that can cross
    let found = false;
    let crossData: any = null;

    for (let i = 0; i < w1.word.length; i++) {
      for (let j = 0; j < w2.word.length; j++) {
        if (w1.word[i].toLowerCase() === w2.word[j].toLowerCase()) {
          crossData = { w1, w2, intersection: { w1Idx: i, w2Idx: j } };
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      // Fallback: Just two independent words in the grid if no intersection found
      crossData = { w1, w2, intersection: null };
    }

    const newGrid = Array(7).fill(null).map(() => Array(7).fill(null));
    const acClues: any[] = [];
    const dnClues: any[] = [];

    // Across
    const startX = 2, startY = 1;
    w1.word.split('').forEach((char, i) => {
      newGrid[startX][startY + i] = { char, num: i === 0 ? 1 : null, type: 'across', id: `1-${i}` };
    });
    acClues.push({ num: 1, clue: w1.definition || w1.translation, answer: w1.word });

    // Down
    const dStartX = 1, dStartY = startY + (crossData.intersection?.w1Idx || 2);
    w2.word.split('').forEach((char, i) => {
      const existing = newGrid[dStartX + i][dStartY];
      newGrid[dStartX + i][dStartY] = { 
        char, 
        num: i === 0 ? 2 : (existing?.num || null), 
        type: existing ? 'both' : 'down',
        id: existing ? existing.id : `2-${i}`
      };
    });
    dnClues.push({ num: 2, clue: w2.definition || w2.translation, answer: w2.word });

    setGrid(newGrid);
    setClues({ across: acClues, down: dnClues });
    setInputs({});
    setStatus('playing');
  };

  useEffect(generate, [dictionary]);

  const handleInput = (row: number, col: number, val: string) => {
    if (status !== 'playing') return;
    const key = `${row}-${col}`;
    const newInputs = { ...inputs, [key]: val.toLowerCase() };
    setInputs(newInputs);

    // Check if all filled correctly
    let allCorrect = true;
    grid.forEach((r, rIdx) => {
      r.forEach((cell: any, cIdx: number) => {
        if (cell && newInputs[`${rIdx}-${cIdx}`] !== cell.char.toLowerCase()) {
          allCorrect = false;
        }
      });
    });

    if (allCorrect) {
      setStatus('won');
      onWin();
    }
  };

  return (
    <div className="duo-card p-10 bg-white flex flex-col md:flex-row gap-12 animate-in zoom-in duration-300">
      <div className="flex-1 flex flex-col items-center">
        <div className="grid grid-cols-7 gap-1 bg-gray-200 p-1 rounded-xl shadow-inner">
          {grid.map((row, rIdx) => (
            row.map((cell, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative ${cell ? 'bg-white' : 'bg-gray-100'}`}>
                {cell && (
                  <>
                    {cell.num && <span className="absolute top-0.5 left-1 text-[8px] font-black text-gray-400">{cell.num}</span>}
                    <input 
                      type="text" 
                      maxLength={1}
                      value={inputs[`${rIdx}-${cIdx}`] || ''}
                      onChange={(e) => handleInput(rIdx, cIdx, e.target.value)}
                      className={`w-full h-full text-center font-black text-xl uppercase outline-none focus:bg-blue-50 transition-colors ${status === 'won' ? 'text-green-600' : 'text-gray-800'}`}
                    />
                  </>
                )}
              </div>
            ))
          ))}
        </div>
      </div>

      <div className="md:w-72 space-y-8">
        <div className="space-y-4">
          <h3 className="font-black text-xs text-blue-500 uppercase tracking-widest border-b-2 border-blue-50 pb-2">Across</h3>
          {clues.across.map(c => (
            <div key={c.num} className="space-y-1">
              <p className="text-sm font-black text-gray-700">{c.num}. {c.clue}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="font-black text-xs text-purple-500 uppercase tracking-widest border-b-2 border-purple-50 pb-2">Down</h3>
          {clues.down.map(c => (
            <div key={c.num} className="space-y-1">
              <p className="text-sm font-black text-gray-700">{c.num}. {c.clue}</p>
            </div>
          ))}
        </div>

        {status === 'won' ? (
          <div className="pt-6 animate-in slide-in-from-bottom">
            <button onClick={generate} className="w-full bg-[#58cc02] text-white p-4 rounded-2xl font-black shadow-[0_4px_0_#46a302]">NEW PUZZLE</button>
          </div>
        ) : (
          <button onClick={onExit} className="w-full text-gray-400 font-bold hover:text-gray-600 pt-10">QUIT GAME</button>
        )}
      </div>
    </div>
  );
};

export default GamesView;
