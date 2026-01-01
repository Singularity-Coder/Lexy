
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CourseData, DictionaryEntry, GrammarLesson, CultureItem } from '../types';
import { GoogleGenAI } from "@google/genai";

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
  const [isListening, setIsListening] = useState(false);
  const [semanticResults, setSemanticResults] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [suggestedLetters, setSuggestedLetters] = useState<string[]>([]);

  // Extract unique starting characters and words from the vocabulary for context
  const vocabularyContext = useMemo(() => {
    if (!course.dictionary) return [];
    const context = new Set<string>();
    course.dictionary.forEach(entry => {
      if (entry.word && entry.word.length > 0) {
        context.add(entry.word[0].toUpperCase());
        if (entry.word.length < 10) context.add(entry.word);
      }
    });
    return Array.from(context);
  }, [course.dictionary]);

  // Robust Canvas Sizing with ResizeObserver
  useEffect(() => {
    if (searchMode !== 'handwriting' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#ad46ff';
        ctx.lineWidth = 14;
      }
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(parent);
    resize(); // Initial call

    return () => resizeObserver.disconnect();
  }, [searchMode]);

  const recognizeDrawing = async () => {
    if (!hasDrawn || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Convert canvas to base64
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const base64Data = dataUrl.split(',')[1];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const contextPreview = vocabularyContext.slice(0, 100).join(', ');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg'
              }
            },
            {
              text: `Identify the handwritten character or short word in this image. 
              The user is learning a course that includes these characters/words: ${contextPreview}.
              Return a JSON array of the top 6 most likely characters (single letters/symbols) or words from the course that match this drawing. 
              Prioritize items that exist in the provided list.
              Return ONLY the JSON array, e.g., ["H", "A", "L", "S"].`
            }
          ]
        }
      });

      const aiText = response.text || '[]';
      const aiSuggestions: string[] = JSON.parse(aiText.match(/\[.*\]/s)?.[0] || '[]');
      setSuggestedLetters(aiSuggestions.slice(0, 6));
    } catch (error) {
      console.error("Handwriting recognition failed:", error);
    }
  };

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

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      if (searchMode === 'semantic') {
        handleSemanticSearch(transcript);
      }
    };
    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const results = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (searchMode === 'semantic') {
      return {
        vocab: (course.dictionary || []).filter(entry => semanticResults.includes(entry.id)),
        grammar: [],
        culture: []
      };
    }

    if (!query) return { vocab: [], grammar: [], culture: [] };

    return {
      vocab: (course.dictionary || []).filter(entry => 
        entry.word.toLowerCase().startsWith(query) || 
        entry.translation.toLowerCase().includes(query) ||
        (entry.definition && entry.definition.toLowerCase().includes(query))
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSearchTerm('');
      setHasDrawn(false);
      setSuggestedLetters([]);
    }
  };

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const ctx = canvas.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const ctx = canvas.getContext('2d');
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      recognizeDrawing();
    }
  };

  const hasResults = results.vocab.length > 0 || results.grammar.length > 0 || results.culture.length > 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-500 pb-32">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Explore Course</h1>
          <p className="text-lg text-gray-500 font-bold">Discover language content.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-100/80 rounded-2xl shrink-0 border border-gray-200/50">
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
                setHasDrawn(false);
                setSuggestedLetters([]);
              }}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                searchMode === mode.id 
                  ? 'bg-white text-[#ad46ff] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Container */}
      <div className="space-y-3">
        <div className="bg-gray-50 border-4 border-gray-100 rounded-[2rem] p-3 shadow-inner transition-all focus-within:border-purple-100">
          {searchMode !== 'handwriting' ? (
            <div className="relative flex items-center">
              <span className="absolute left-6 text-3xl text-gray-400 pointer-events-none group-focus-within:text-purple-400 transition-colors">
                🔍
              </span>
              <input 
                autoFocus
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (searchMode === 'semantic') handleSemanticSearch(e.target.value);
                }}
                className="w-full p-5 pl-20 bg-white rounded-[1.5rem] border-2 border-gray-200/50 text-xl font-bold outline-none focus:border-[#ad46ff] transition-all placeholder:text-gray-300"
              />
              <button 
                onClick={startVoiceSearch}
                className={`absolute right-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-50 text-gray-400 hover:bg-purple-50 hover:text-purple-500'
                }`}
                title="Voice Search"
              >
                {isListening ? '⏹️' : '🎙️'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-white h-72 w-full overflow-hidden shadow-inner border-2 border-dashed border-gray-100 rounded-[1.5rem] cursor-crosshair group-canvas">
                 <canvas 
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full"
                 />
                 <div className="absolute top-4 left-6 bg-white/80 p-1 rounded text-[10px] font-black text-gray-300 uppercase pointer-events-none tracking-widest">
                   Write a character
                 </div>
              </div>
              <div className="flex justify-between items-center px-2">
                 <button 
                  onClick={clearCanvas} 
                  className="p-3 px-8 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-2xl text-[11px] hover:bg-gray-50 uppercase tracking-widest transition-all"
                 >
                   Clear
                 </button>
                 <div className="flex gap-2">
                   {suggestedLetters.map(l => (
                     <button 
                      key={l} 
                      onClick={() => setSearchTerm(l)} 
                      className={`min-w-[44px] h-11 px-4 rounded-2xl font-black transition-all transform active:scale-90 ${
                        searchTerm.toLowerCase() === l.toLowerCase() 
                          ? 'bg-[#ad46ff] text-white shadow-[0_4px_0_#8439a3]' 
                          : 'bg-white border-2 border-gray-100 text-gray-400 hover:bg-gray-50'
                      }`}
                     >
                       {l}
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </div>
        
        {searchMode === 'semantic' && (
          <div className="px-6 animate-in slide-in-from-top duration-300">
            <p className="text-sm font-bold text-gray-400 italic">
              Search by meaning, not just words. Try "things to eat" or "emotions".
            </p>
            {isSearching && (
              <p className="mt-2 text-xs font-black text-[#ad46ff] animate-pulse">Consulting Gemini AI...</p>
            )}
          </div>
        )}
      </div>

      {/* Results Area */}
      {!searchTerm.trim() ? (
        <div className="py-24 text-center space-y-6 flex flex-col items-center animate-in zoom-in duration-500">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/588/588395.png" 
            alt="Pencil" 
            className="w-24 h-24 opacity-30 grayscale brightness-110"
          />
          <p className="text-xl font-bold text-gray-300">Start exploring to find gems</p>
        </div>
      ) : !hasResults ? (
        <div className="py-24 text-center space-y-6 flex flex-col items-center">
          <span className="text-8xl grayscale opacity-30">🏜️</span>
          <p className="text-xl font-bold text-gray-300">No matches found for "{searchTerm}"</p>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          {results.vocab.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#ad46ff]" />
                 <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                   Vocabulary ({results.vocab.length})
                 </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.vocab.map(entry => (
                  <div key={entry.id} className="duo-card p-6 bg-white flex items-center justify-between group hover:border-[#ad46ff] transition-all animate-in slide-in-from-bottom duration-300">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-800">{entry.word}</h3>
                      <p className="text-[#ad46ff] font-bold mt-1">{entry.translation}</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => speak(entry.word)} className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100">🔊</button>
                       <button 
                        onClick={() => onToggleSaveWord(entry.id)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border ${
                          savedWordIds.includes(entry.id) 
                          ? 'bg-yellow-50 text-yellow-600 border-yellow-100' 
                          : 'bg-gray-50 text-gray-300 border-gray-100'
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
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#ad46ff]" />
                 <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Grammar Rules ({results.grammar.length})
                 </h2>
              </div>
              <div className="space-y-4">
                {results.grammar.map(rule => (
                  <div key={rule.id} className="duo-card p-6 bg-white border-l-8 border-[#ad46ff] animate-in slide-in-from-left duration-300">
                    <h3 className="text-lg font-black text-gray-800 mb-2">{rule.title}</h3>
                    <p className="text-sm text-gray-500 font-bold leading-relaxed">{rule.content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.culture.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                 <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Culture & Facts ({results.culture.length})
                 </h2>
              </div>
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
