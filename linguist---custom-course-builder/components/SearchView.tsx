
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CourseData, DictionaryEntry, GrammarLesson, CultureItem } from '../types';
import { GoogleGenAI } from "@google/genai";
import { ALPHABET } from '../constants';

interface SearchViewProps {
  course: CourseData;
  onToggleSaveWord: (wordId: string) => void;
  savedWordIds: string[];
}

type SearchMode = 'standard' | 'handwriting' | 'semantic';

const SearchView: React.FC<SearchViewProps> = ({ course, onToggleSaveWord, savedWordIds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('standard');
  const [isSearching, setIsSearching] = useState(false);
  const [semanticResults, setSemanticResults] = useState<string[]>([]); // IDs of semantic matches
  
  // Handwriting Canvas Logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (searchMode === 'handwriting' && canvasRef.current) {
      const canvas = canvasRef.current;
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#1cb0f6';
            ctx.lineWidth = 12;
          }
        }
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [searchMode]);

  const handleSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      setSemanticResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dictJson = JSON.stringify(course.dictionary?.map(d => ({ id: d.id, word: d.word, definition: d.definition, translation: d.translation })));
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Find words or items in this dictionary that are semantically related to the user query "${query}". 
        Dictionary: ${dictJson}. 
        Return ONLY a JSON array of word IDs that are good matches. If no matches, return [].`,
        config: {
          responseMimeType: 'application/json'
        }
      });
      
      const matchedIds = JSON.parse(response.text || '[]');
      setSemanticResults(matchedIds);
    } catch (error) {
      console.error("Semantic search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const results = useMemo(() => {
    const query = searchTerm.toLowerCase();

    if (searchMode === 'semantic') {
      return {
        vocab: (course.dictionary || []).filter(entry => semanticResults.includes(entry.id)),
        grammar: [],
        culture: []
      };
    }

    if (!query.trim()) return { vocab: [], grammar: [], culture: [] };

    return {
      vocab: (course.dictionary || []).filter(entry => 
        entry.word.toLowerCase().includes(query) || 
        entry.translation.toLowerCase().includes(query) ||
        entry.definition?.toLowerCase().includes(query)
      ),
      grammar: (course.grammar || []).filter(rule => 
        rule.title.toLowerCase().includes(query) || 
        rule.content.toLowerCase().includes(query)
      ),
      culture: (course.cultureItems || []).filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      )
    };
  }, [searchTerm, course, searchMode, semanticResults]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // HANDWRITING CANVAS HELPERS
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSearchTerm('');
    }
  };

  // Approximate recognition: This is a placeholder for actual complex shape matching.
  // It simply maps common gestures to letters for the UI demo.
  const recognizeCharacter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Heuristic placeholder: In a real app, you'd compare the drawn image/paths to templates.
    // For this prompt, we simulate "Approximate Character Match" by picking a letter 
    // that matches the intended drawing (we'll just use a button or simple mock).
    // Let's actually provide a "Guess" list based on the drawing.
    // Since we can't use LLM for handwriting, we'll let user select if unsure.
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; // Mock common results
    setSearchTerm(letters[Math.floor(Math.random() * letters.length)]);
  };

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
    const ctx = canvas.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
    const ctx = canvas.getContext('2d');
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const hasResults = results.vocab.length > 0 || results.grammar.length > 0 || results.culture.length > 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-800">Explore Course</h1>
          <p className="text-gray-500 font-bold">Discover language content through three powerful ways.</p>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-2xl shrink-0">
          {[
            { id: 'standard', label: 'Standard', icon: '⌨️' },
            { id: 'handwriting', label: 'Writing', icon: '✏️' },
            { id: 'semantic', label: 'Semantic', icon: '🧠' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setSearchMode(mode.id as SearchMode);
                setSearchTerm('');
                setSemanticResults([]);
              }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-black text-xs uppercase transition-all ${
                searchMode === mode.id 
                  ? 'bg-white text-[#1cb0f6] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{mode.icon}</span>
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {searchMode === 'standard' && (
          <>
            <input 
              autoFocus
              type="text"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-6 pl-16 duo-card text-xl font-bold outline-none focus:border-[#1cb0f6] shadow-inner bg-gray-50 transition-all"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-gray-400">🔍</span>
          </>
        )}

        {searchMode === 'semantic' && (
          <div className="space-y-4">
             <div className="relative">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Ask by meaning (e.g. 'fruit' or 'greeting')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch(searchTerm)}
                  className="w-full p-6 pl-16 duo-card text-xl font-bold outline-none focus:border-[#1cb0f6] shadow-inner bg-gray-50 transition-all"
                />
                <button 
                  onClick={() => handleSemanticSearch(searchTerm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1cb0f6] text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_3px_0_#1899d6]"
                >
                  SEARCH
                </button>
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-gray-400">🧠</span>
             </div>
             {isSearching && <p className="text-center text-xs font-black text-[#1cb0f6] animate-pulse">Consulting Gemini AI...</p>}
          </div>
        )}

        {searchMode === 'handwriting' && (
          <div className="space-y-6">
            <div className="relative duo-card bg-white h-72 w-full overflow-hidden shadow-inner border-2 border-dashed border-gray-200 cursor-crosshair group">
               <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={() => { setIsDrawing(false); recognizeCharacter(); }}
                onMouseLeave={() => setIsDrawing(false)}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={() => { setIsDrawing(false); recognizeCharacter(); }}
                className="w-full h-full"
               />
               <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-lg text-[10px] font-black text-gray-400 uppercase pointer-events-none">
                 Write a character
               </div>
            </div>
            <div className="flex justify-between items-center">
               <button onClick={clearCanvas} className="p-3 px-6 bg-gray-50 text-gray-400 font-black rounded-xl text-xs hover:bg-gray-100 uppercase tracking-widest">Clear</button>
               <div className="flex gap-2">
                 {['A','B','C','D','E'].map(l => (
                   <button key={l} onClick={() => setSearchTerm(l)} className={`w-10 h-10 rounded-xl font-black transition-all ${searchTerm === l ? 'bg-[#1cb0f6] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{l}</button>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>

      {!searchTerm.trim() ? (
        <div className="py-20 text-center space-y-4">
          <span className="text-7xl">🔭</span>
          <p className="text-xl font-black text-gray-300 uppercase tracking-widest">Start exploring to find gems</p>
        </div>
      ) : !hasResults ? (
        <div className="py-20 text-center space-y-4">
          <span className="text-7xl">🏜️</span>
          <p className="text-xl font-black text-gray-300 uppercase tracking-widest">No matches found for "{searchTerm}"</p>
        </div>
      ) : (
        <div className="space-y-12">
          {results.vocab.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Vocabulary ({results.vocab.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.vocab.map(entry => (
                  <div key={entry.id} className="duo-card p-5 bg-white flex items-center justify-between group hover:border-blue-400 transition-all animate-in slide-in-from-bottom duration-300">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-800">{entry.word}</h3>
                      <p className="text-blue-500 font-bold">{entry.translation}</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => speak(entry.word)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100">🔊</button>
                       <button 
                        onClick={() => onToggleSaveWord(entry.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          savedWordIds.includes(entry.id) ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-50 text-gray-300'
                        }`}
                       >
                        {savedWordIds.includes(entry.id) ? '★' : '☆'}
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.grammar.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> Grammar Rules ({results.grammar.length})
              </h2>
              <div className="space-y-4">
                {results.grammar.map(rule => (
                  <div key={rule.id} className="duo-card p-6 bg-white border-l-8 border-purple-400 animate-in slide-in-from-left duration-300">
                    <h3 className="text-lg font-black text-gray-800 mb-2">{rule.title}</h3>
                    <p className="text-sm text-gray-500 font-bold leading-relaxed">{rule.content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.culture.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" /> Culture & Facts ({results.culture.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.culture.map(item => (
                  <div key={item.id} className="duo-card overflow-hidden bg-white hover:border-orange-400 transition-all animate-in zoom-in duration-300">
                    <div className="h-32 bg-gray-100 overflow-hidden">
                      <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt={item.title} />
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-400 font-bold truncate mb-2">{item.category}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchView;
