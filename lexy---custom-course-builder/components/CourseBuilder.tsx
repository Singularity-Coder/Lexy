import React, { useState, useRef, useMemo, useEffect } from 'react';
import { CourseData, DictionaryEntry, GrammarLesson, CultureItem, Unit, CultureAsset, AICharacter, ProficiencyLevel, AlphabetItem } from '../types';
import { PROFICIENCY_LEVELS } from '../constants';
import JSZip from 'jszip';

// --- Unicode Character Generation Constants ---
const LANGUAGE_TO_SCRIPTS: Record<string, string[]> = {
  "English": ["Latin"],
  "French": ["Latin"],
  "German": ["Latin"],
  "Spanish": ["Latin"],
  "Vietnamese": ["Latin"],
  "Russian": ["Cyrillic"],
  "Ukrainian": ["Cyrillic"],
  "Bulgarian": ["Cyrillic"],
  "Serbian (Cyrillic)": ["Cyrillic"],
  "Greek": ["Greek"],
  "Hindi": ["Devanagari"],
  "Marathi": ["Devanagari"],
  "Nepali": ["Devanagari"],
  "Sanskrit": ["Devanagari"],
  "Bengali": ["Bengali"],
  "Punjabi (Gurmukhi)": ["Gurmukhi"],
  "Gujarati": ["Gujarati"],
  "Odia": ["Oriya"],
  "Tamil": ["Tamil"],
  "Telugu": ["Telugu"],
  "Kannada": ["Kannada"],
  "Malayalam": ["Malayalam"],
  "Sinhala": ["Sinhala"],
  "Arabic": ["Arabic"],
  "Persian": ["Arabic"],
  "Urdu": ["Arabic"],
  "Hebrew": ["Hebrew"],
  "Thai": ["Thai"],
  "Lao": ["Lao"],
  "Tibetan": ["Tibetan"],
  "Burmese (Myanmar)": ["Myanmar"],
  "Armenian": ["Armenian"],
  "Georgian": ["Georgian"],
  "Amharic (Ethiopic)": ["Ethiopic"],
  "Japanese": ["Hiragana", "Katakana", "Han"],
  "Chinese": ["Han"],
  "Korean": ["Hangul", "Han"]
};

const SCRIPT_RANGES: Record<string, [number, number][]> = {
  Latin: [[0x0000, 0x007F], [0x0080, 0x00FF], [0x0100, 0x017F], [0x0180, 0x024F], [0x1E00, 0x1EFF], [0x2C60, 0x2C7F], [0xA720, 0xA7FF], [0xAB30, 0xAB6F], [0xFB00, 0xFB4F], [0xFF00, 0xFFEF]],
  Greek: [[0x0370, 0x03FF], [0x1F00, 0x1FFF]],
  Cyrillic: [[0x0400, 0x04FF], [0x0500, 0x052F], [0x1C80, 0x1C8F], [0x2DE0, 0x2DFF], [0xA640, 0xA69F]],
  Arabic: [[0x0600, 0x06FF], [0x0750, 0x077F], [0x08A0, 0x08FF], [0xFB50, 0xFDFF], [0xFE70, 0xFEFF]],
  Devanagari: [[0x0900, 0x097F], [0xA8E0, 0xA8FF], [0x11B00, 0x11B5F]],
  Bengali: [[0x0980, 0x09FF]],
  Gurmukhi: [[0x0A00, 0x0A7F]],
  Gujarati: [[0x0A80, 0x0AFF]],
  Oriya: [[0x0B00, 0x0B7F]],
  Tamil: [[0x0B80, 0x0BFF]],
  Telugu: [[0x0C00, 0x0C7F]],
  Kannada: [[0x0C80, 0x0CFF]],
  Malayalam: [[0x0D00, 0x0D7F]],
  Sinhala: [[0x0D80, 0x0DFF]],
  Thai: [[0x0E00, 0x0E7F]],
  Lao: [[0x0E80, 0x0EFF]],
  Tibetan: [[0x0F00, 0x0FFF]],
  Myanmar: [[0x1000, 0x109F]],
  Hebrew: [[0x0590, 0x05FF]],
  Armenian: [[0x0530, 0x058F]],
  Georgian: [[0x10A0, 0x10FF], [0x1C90, 0x1CBF]],
  Ethiopic: [[0x1200, 0x137F], [0x1380, 0x139F], [0x2D80, 0x2DDF]],
  Hangul: [[0x1100, 0x11FF], [0x3130, 0x318F], [0xA960, 0xA97F], [0xAC00, 0xD7AF], [0xD7B0, 0xD7FF]],
  Hiragana: [[0x3040, 0x309F]],
  Katakana: [[0x30A0, 0x30FF], [0x31F0, 0x31FF], [0xFF65, 0xFF9F]],
  Han: [[0x3400, 0x4DBF], [0x4E00, 0x9FFF], [0xF900, 0xFAFF], [0x20000, 0x2A6DF], [0x2A700, 0x2B73F], [0x2B740, 0x2B81F], [0x2B820, 0x2CEAF], [0x2CEB0, 0x2EBEF], [0x30000, 0x3134F]],
};

interface CourseBuilderProps {
  onCourseSaved: (course: CourseData, originalId?: string) => void;
  onCancel: () => void;
  initialCourse?: CourseData;
}

const ITEMS_PER_PAGE = 24;

const CourseBuilder: React.FC<CourseBuilderProps> = ({ onCourseSaved, onCancel, initialCourse }) => {
  const [step, setStep] = useState(0);
  const [initialId] = useState(initialCourse?.id); 
  const [courseLevel, setCourseLevel] = useState<ProficiencyLevel>(initialCourse?.units?.[0]?.level || 1);
  const [course, setCourse] = useState<Partial<CourseData>>(initialCourse || {
    id: '', 
    courseTitle: '',
    language: '',
    units: [],
    alphabet: [],
    dictionary: [],
    grammar: [],
    cultureItems: [],
    aiCharacters: []
  });

  const updateCourse = (field: keyof CourseData, value: any) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { title: 'Basics', icon: '🌍' },
    { title: 'Alphabets', icon: '🔤' },
    { title: 'Dictionary', icon: '📖' },
    { title: 'Grammar', icon: '📝' },
    { title: 'Culture', icon: '🌍' },
    { title: 'AI Chats', icon: '💬' },
    { title: 'Units & Lessons', icon: '🎯' }
  ];

  const handleFinish = () => {
    if (!course.courseTitle || !course.language) {
      alert("Please fill in the 'Basics' (Target Language & Course Title) first!");
      setStep(0);
      return;
    }
    const finalCourse: CourseData = {
      ...course,
      units: (course.units?.length ? course.units : [
        {
          id: 'unit-init',
          title: 'Introduction',
          color: 'bg-[#ad46ff]',
          level: courseLevel,
          lessons: [
            { id: 'l1', title: 'Hello', description: 'Basic greetings', status: 'available', exercises: [] }
          ]
        }
      ]).map(u => ({ ...u, level: u.level || courseLevel }))
    } as CourseData;
    
    onCourseSaved(finalCourse, initialId);
  };

  const handleExportLexy = async () => {
    const zip = new JSZip();
    const cultureItemsCopy = JSON.parse(JSON.stringify(course.cultureItems || [])) as CultureItem[];
    const assetFolder = zip.folder("assets");

    for (const item of cultureItemsCopy) {
      if (item.assets) {
        for (const asset of item.assets) {
          if (asset.value.startsWith('data:')) {
            const parts = asset.value.split(';base64,');
            const base64Data = parts[1];
            const cleanName = asset.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const fileName = `asset_${Date.now()}_${cleanName}`;
            assetFolder?.file(fileName, base64Data, { base64: true });
            asset.value = `assets/${fileName}`;
          }
        }
      }
      if (item.thumbnailUrl && item.thumbnailUrl.startsWith('data:')) {
        const parts = item.thumbnailUrl.split(';base64,');
        const base64Data = parts[1];
        const fileName = `thumb_${item.id}_${Date.now()}.png`;
        assetFolder?.file(fileName, base64Data, { base64: true });
        item.thumbnailUrl = `assets/${fileName}`;
      }
    }

    zip.file("data/alphabet.json", JSON.stringify(course.alphabet || [], null, 2));
    zip.file("data/dictionary.json", JSON.stringify(course.dictionary || [], null, 2));
    zip.file("data/grammar.json", JSON.stringify(course.grammar || [], null, 2));
    zip.file("data/culture.json", JSON.stringify(cultureItemsCopy, null, 2));
    zip.file("data/units.json", JSON.stringify(course.units || [], null, 2));
    zip.file("data/ai_chats.json", JSON.stringify(course.aiCharacters || [], null, 2));
    
    const manifest = {
      format: "lexy-package",
      version: 1,
      fields: {
        title: course.courseTitle || "Untitled Course",
        description: `A custom language course for ${course.language}`,
        author: "Lexy User",
      },
      assets: {},
      dataFiles: {
        alphabet: { path: "data/alphabet.json", version: 1 },
        dictionary: { path: "data/dictionary.json", version: 1 },
        grammar: { path: "data/grammar.json", version: 1 },
        culture: { path: "data/culture.json", version: 1 },
        units: { path: "data/units.json", version: 1 },
        ai_chats: { path: "data/ai_chats.json", version: 1 }
      },
      courseId: course.language 
    };
    
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    const dataUri = URL.createObjectURL(blob);
    const exportFileDefaultName = `${(course.language || 'course').toLowerCase()}_bundle.lexy`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setTimeout(() => URL.revokeObjectURL(dataUri), 100);
  };

  const currentLevelInfo = PROFICIENCY_LEVELS.find(l => l.level === courseLevel) || PROFICIENCY_LEVELS[0];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 space-y-8 shrink-0">
          <button 
            onClick={onCancel} 
            className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center text-xl text-[#ad46ff] transition-all active:scale-90"
          >
            ←
          </button>
          
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Course Sections</h3>
            <nav className="space-y-2">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`w-full flex items-center p-4 rounded-3xl font-black text-sm transition-all transform active:scale-95 space-x-4 border-2 ${
                    step === idx 
                      ? 'bg-purple-50 text-[#ad46ff] border-purple-200 shadow-sm' 
                      : 'text-gray-400 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="uppercase tracking-wider text-[11px]">{s.title}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t-2 border-gray-100 space-y-4">
             <button 
              onClick={handleFinish}
              className="w-full p-5 bg-[#ad46ff] text-white rounded-[2rem] font-black shadow-[0_6px_0_#8439a3] hover:bg-[#8439a3] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
             >
                SYNC & FINISH
             </button>
             
             <button 
              onClick={handleExportLexy}
              className="w-full p-5 bg-white text-gray-400 rounded-[2rem] font-black border-2 border-gray-100 shadow-[0_6px_0_#e5e5e5] hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
             >
                EXPORT .LEXY
             </button>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 min-h-[600px] flex flex-col">
          {step === 0 && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-gray-800 tracking-tight">General Basics</h2>
                <p className="text-gray-500 font-bold text-lg">Define the identity of your new course.</p>
              </div>
              <div className="duo-card p-10 bg-white border-2 border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                  
                  <div className="lg:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Language Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Spanish"
                          className="w-full p-6 rounded-[1.8rem] border-2 border-gray-200 focus:border-[#ad46ff] font-black outline-none bg-gray-50 text-gray-800 placeholder-gray-300 text-xl transition-all"
                          value={course.language}
                          onChange={e => {
                            const val = e.target.value;
                            setCourse(prev => ({ ...prev, language: val, id: val }));
                          }}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Course Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Mastery"
                          className="w-full p-6 rounded-[1.8rem] border-2 border-gray-200 focus:border-[#ad46ff] font-black outline-none bg-gray-50 text-gray-800 placeholder-gray-300 text-xl transition-all"
                          value={course.courseTitle}
                          onChange={e => updateCourse('courseTitle', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Target Course Level</label>
                      <div className="relative group/select">
                        <select 
                          value={courseLevel}
                          onChange={(e) => setCourseLevel(Number(e.target.value) as ProficiencyLevel)}
                          className="w-full p-6 pr-12 rounded-[2rem] border-2 border-gray-200 focus:border-[#ad46ff] font-black outline-none bg-gray-50 text-gray-800 text-xl appearance-none cursor-pointer transition-all"
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <option key={level.level} value={level.level}>
                              Level {level.level}: {level.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xl font-black group-focus-within/select:text-purple-500 transition-colors">
                          ▼
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-400 italic px-2">
                        {currentLevelInfo.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-square max-w-[280px] lg:max-w-full rounded-[2.5rem] overflow-hidden border-2 border-gray-100 shadow-sm animate-in zoom-in duration-500 bg-gray-50">
                      <img 
                        src={currentLevelInfo.imageUrl} 
                        className="w-full h-full object-cover" 
                        alt={currentLevelInfo.name} 
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <AlphabetBuilder 
              items={course.alphabet || []} 
              onUpdate={(items) => updateCourse('alphabet', items)} 
            />
          )}

          {step === 2 && (
            <DictionaryBuilder 
              items={course.dictionary || []} 
              onUpdate={(items) => updateCourse('dictionary', items)} 
            />
          )}

          {step === 3 && (
            <GrammarBuilder 
              items={course.grammar || []} 
              onUpdate={(items) => updateCourse('grammar', items)} 
            />
          )}

          {step === 4 && (
            <CultureBuilder 
              items={course.cultureItems || []} 
              onUpdate={(items) => updateCourse('cultureItems', items)} 
            />
          )}

          {step === 5 && (
            <AICharactersBuilder
              items={course.aiCharacters || []}
              onUpdate={(items) => updateCourse('aiCharacters', items)}
            />
          )}

          {step === 6 && (
            <div className="space-y-10 animate-in fade-in duration-300 text-center py-20 duo-card bg-gray-50/50 border-dashed border-4 border-gray-200">
               <span className="text-9xl mb-6 inline-block">🎯</span>
               <h2 className="text-4xl font-black text-gray-800">Ready to build units?</h2>
               <p className="text-gray-500 font-bold text-xl max-w-lg mx-auto leading-relaxed">
                 Once you finish the dictionary and grammar modules, our AI engine will help structure units and lessons for you.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- CRUD SUB-COMPONENTS --- */

const AlphabetBuilder = ({ items, onUpdate }: { items: AlphabetItem[], onUpdate: (items: AlphabetItem[]) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [editingItem, setEditingItem] = useState<AlphabetItem | null>(null);
  const [form, setForm] = useState<Partial<AlphabetItem>>({ character: '', phonetic: '' });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = (item?: AlphabetItem) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ character: '', phonetic: '' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.character) {
      alert("Please provide the character.");
      return;
    }
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as AlphabetItem : i));
    } else {
      onUpdate([...items, { ...form, id: `a-${Date.now()}` } as AlphabetItem]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  // Native DnD Handlers
  const onDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const onDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...items];
    const item = newItems.splice(draggedIndex, 1)[0];
    newItems.splice(index, 0, item);
    onUpdate(newItems);
    setDraggedIndex(null);
  };

  const handleBulkGenerate = (generatedChars: string[]) => {
    const newItems: AlphabetItem[] = generatedChars.map(char => ({
      id: `a-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      character: char,
      phonetic: ''
    }));
    onUpdate([...items, ...newItems]);
    setShowGenerator(false);
  };

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const buttonClass = "bg-[#ad46ff] text-white p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:bg-[#8439a3] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[11px]";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Alphabets</h2>
            <span className="px-3 py-1 bg-purple-50 text-[#ad46ff] rounded-full text-[11px] font-black uppercase tracking-widest">
              {items.length} {items.length === 1 ? 'CHARACTER' : 'CHARACTERS'}
            </span>
          </div>
          <p className="text-gray-500 font-bold text-lg">Define characters and their sounds. Reorder as they should be taught.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowGenerator(true)}
            className={buttonClass}
          >
            + GENERATE
          </button>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-[#ad46ff] text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:bg-[#8439a3] active:translate-y-1 active:shadow-none transition-all"
            >
              <span className="text-xl">⋮</span>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] border-2 border-gray-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => { handleOpen(); setIsMenuOpen(false); }}
                  className="w-full p-4 px-6 text-left font-black text-[10px] uppercase tracking-[0.15em] text-gray-500 hover:bg-purple-50 hover:text-[#ad46ff] transition-all flex items-center gap-3 border-b border-gray-50"
                >
                  <span className="text-base">➕</span>
                  ADD CHARACTER
                </button>
                <button 
                  onClick={() => { setShowClearConfirm(true); setIsMenuOpen(false); }}
                  className="w-full p-4 px-6 text-left font-black text-[10px] uppercase tracking-[0.15em] text-red-400 hover:bg-red-50 transition-all flex items-center gap-3"
                >
                  <span className="text-base">🗑️</span>
                  CLEAR ALL
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedItems.map((item, idx) => {
          const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
          return (
            <div 
              key={item.id} 
              draggable 
              onDragStart={() => onDragStart(globalIdx)}
              onDragOver={(e) => onDragOver(e, globalIdx)}
              onDrop={() => onDrop(globalIdx)}
              className={`duo-card p-5 bg-white flex items-center justify-between group border-2 border-gray-100 transition-all cursor-grab active:cursor-grabbing ${draggedIndex === globalIdx ? 'opacity-40 grayscale scale-95 border-[#ad46ff]' : ''}`}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-50 rounded-[1.2rem] flex items-center justify-center text-3xl font-black text-gray-800 shadow-sm border border-gray-100">
                  {item.character}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Phonetic</h4>
                  <p className="text-[#ad46ff] font-black text-sm truncate max-w-[120px]">{item.phonetic || 'None'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button onClick={(e) => { e.stopPropagation(); handleOpen(item); }} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-sm">✏️</button>
                  <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-red-400 rounded-lg text-sm">🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
           <div className="col-span-full py-20 duo-card bg-gray-50/30 border-dashed flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-gray-200">abc</div>
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No characters added yet</p>
           </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center font-black text-gray-400 hover:border-purple-200 hover:text-purple-500 disabled:opacity-30 transition-all"
          >
            ←
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                  currentPage === i + 1 
                    ? 'bg-[#ad46ff] text-white shadow-[0_4px_0_#8439a3]' 
                    : 'bg-white border-2 border-gray-100 text-gray-400 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="w-10 h-10 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center font-black text-gray-400 hover:border-purple-200 hover:text-purple-500 disabled:opacity-30 transition-all"
          >
            →
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 space-y-6 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add'} Alphabet Character</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Character</label>
                <input placeholder="e.g. A or あ" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 text-2xl font-black text-center" value={form.character} onChange={e => setForm({...form, character: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phonetic / IPA</label>
                <input placeholder="e.g. /eɪ/ or /a/" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold" value={form.phonetic} onChange={e => setForm({...form, phonetic: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs">CANCEL</button>
              <button onClick={handleSave} className="flex-1 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] uppercase tracking-widest text-xs">SAVE</button>
            </div>
          </div>
        </div>
      )}

      {showGenerator && (
        <CharacterGeneratorModal 
          onGenerate={handleBulkGenerate} 
          onClose={() => setShowGenerator(false)} 
        />
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-[2rem] flex items-center justify-center text-4xl mx-auto border-2 border-red-50 shadow-inner">
                ⚠️
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Clear All?</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  This will permanently delete all <span className="text-red-500 font-black">{items.length}</span> characters from your course.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { onUpdate([]); setShowClearConfirm(false); }}
                  className="w-full p-4 bg-red-500 text-white rounded-2xl font-black shadow-[0_4px_0_#b91c1c] hover:bg-red-600 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
                >
                  YES, DELETE EVERYTHING
                </button>
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="w-full p-4 bg-white text-gray-400 rounded-2xl font-black border-2 border-gray-100 shadow-[0_4px_0_#e5e5e5] hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
                >
                  NO, KEEP THEM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CharacterGeneratorModal = ({ onGenerate, onClose }: { onGenerate: (chars: string[]) => void, onClose: () => void }) => {
  const [selectedLang, setSelectedLang] = useState("Hindi");
  const [categoryMode, setCategoryMode] = useState("LM");
  const [maxChars, setMaxChars] = useState(5000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const langNames = useMemo(() => Object.keys(LANGUAGE_TO_SCRIPTS).sort((a,b) => a.localeCompare(b)), []);

  const generateAsync = () => {
    setIsGenerating(true);
    setProgress(0);
    
    const workerCode = `
      self.onmessage = function(e) {
        const { selectedLang, categoryMode, maxChars, LANGUAGE_TO_SCRIPTS, SCRIPT_RANGES } = e.data;
        const scripts = LANGUAGE_TO_SCRIPTS[selectedLang] || [];
        const result = [];
        const seen = new Set();

        let totalCodepoints = 0;
        for (const script of scripts) {
          const ranges = SCRIPT_RANGES[script];
          if (ranges) {
            for (const range of ranges) {
              totalCodepoints += (range[1] - range[0] + 1);
            }
          }
        }

        if (totalCodepoints === 0) {
          self.postMessage({ type: 'result', value: [] });
          return;
        }

        let processed = 0;
        let lastReportedProgress = -1;

        for (const script of scripts) {
          const ranges = SCRIPT_RANGES[script];
          if (!ranges) continue;

          const scriptRe = new RegExp("\\\\p{Script=" + script + "}", "u");

          for (const [start, end] of ranges) {
            for (let cp = start; cp <= end; cp++) {
              processed++;
              
              if (processed % 100 === 0 || processed === totalCodepoints) {
                const currentProgress = Math.floor((processed / totalCodepoints) * 100);
                if (currentProgress > lastReportedProgress) {
                  self.postMessage({ type: 'progress', value: currentProgress });
                  lastReportedProgress = currentProgress;
                }
              }

              if (cp >= 0xD800 && cp <= 0xDFFF) continue;
              const ch = String.fromCodePoint(cp);
              
              if (scriptRe.test(ch)) {
                let matchesCategory = true;
                if (categoryMode === "L") matchesCategory = /\\p{L}/u.test(ch);
                else if (categoryMode === "LM") matchesCategory = /[\\p{L}\\p{M}]/u.test(ch);
                else if (categoryMode === "LN") matchesCategory = /[\\p{L}\\p{N}]/u.test(ch);

                if (matchesCategory && !seen.has(ch)) {
                  seen.add(ch);
                  result.push(ch);
                  if (result.length >= maxChars) {
                    self.postMessage({ type: 'progress', value: 100 });
                    self.postMessage({ type: 'result', value: result });
                    return;
                  }
                }
              }
            }
          }
        }
        self.postMessage({ type: 'progress', value: 100 });
        self.postMessage({ type: 'result', value: result });
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = (e) => {
      if (e.data.type === 'progress') {
        setProgress(e.data.value);
      } else if (e.data.type === 'result') {
        setIsGenerating(false);
        onGenerate(e.data.value);
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      console.error("Worker error:", err);
      setIsGenerating(false);
      worker.terminate();
    };

    worker.postMessage({
      selectedLang,
      categoryMode,
      maxChars,
      LANGUAGE_TO_SCRIPTS,
      SCRIPT_RANGES
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 space-y-8 animate-in zoom-in duration-300 shadow-2xl relative overflow-hidden">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
             <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-gray-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                  <circle className="text-[#ad46ff] stroke-current transition-all duration-300 ease-out" strokeWidth="8" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)} strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" transform="rotate(-90 50 50)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-[#ad46ff] text-xl">{progress}%</div>
             </div>
             <div className="text-center space-y-1">
                <p className="font-black text-gray-800 text-xl tracking-tight">Generating Characters...</p>
                <p className="text-xs font-bold text-gray-400">Consulting Unicode charts in the background</p>
             </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-3xl font-black text-gray-800 tracking-tight">Bulk Generator</h3>
          <p className="text-gray-500 font-bold">Import thousands of Unicode characters instantly by script.</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Choose Language</label>
            <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold text-gray-700">
              {langNames.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Character Category</label>
            <select value={categoryMode} onChange={(e) => setCategoryMode(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold text-gray-700">
              <option value="ALL">All in script range</option>
              <option value="LM">Letters + Marks (Recommended)</option>
              <option value="L">Letters only</option>
              <option value="LN">Letters + Numbers</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Max Character Count</label>
            <input type="number" value={maxChars} onChange={(e) => setMaxChars(Math.max(1, parseInt(e.target.value) || 0))} className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-black text-gray-700" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 p-5 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors">CANCEL</button>
          <button onClick={generateAsync} className="flex-1 p-5 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_6px_0_#8439a3] hover:bg-[#8439a3] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs">GENERATE ALL</button>
        </div>
      </div>
    </div>
  );
};

const DictionaryBuilder = ({ items, onUpdate }: { items: DictionaryEntry[], onUpdate: (items: DictionaryEntry[]) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DictionaryEntry | null>(null);
  const [form, setForm] = useState<Partial<DictionaryEntry>>({ word: '', translation: '', definition: '', example: '', isPhrase: false });

  const handleOpen = (item?: DictionaryEntry) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ word: '', translation: '', definition: '', example: '', isPhrase: false });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.word || !form.translation) {
      alert("Please provide at least the word and its translation.");
      return;
    }
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as DictionaryEntry : i));
    } else {
      onUpdate([...items, { ...form, id: `w-${Date.now()}` } as DictionaryEntry]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Dictionary</h2>
          <p className="text-gray-500 font-bold text-lg">Build the vocabulary list for your course.</p>
        </div>
        <button onClick={() => handleOpen()} className="bg-[#ad46ff] text-white p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:bg-purple-600 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[11px]">+ ADD WORD</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="duo-card p-6 bg-white flex flex-col group border-2 border-gray-100 transition-all hover:border-purple-200">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-gray-800">{item.word}</h3>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${item.isPhrase ? 'bg-purple-100 text-purple-600' : 'bg-purple-100 text-[#ad46ff]'}`}>{item.isPhrase ? 'Phrase' : 'Word'}</span>
                </div>
                <p className="text-lg font-bold text-[#ad46ff]">{item.translation}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleOpen(item)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-sm">✏️</button>
                <button onClick={() => remove(item.id)} className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-red-400 rounded-lg text-sm">🗑️</button>
              </div>
            </div>
            {item.definition && <p className="text-sm text-gray-500 font-bold mb-3 line-clamp-2">{item.definition}</p>}
          </div>
        ))}
        {items.length === 0 && (
           <div className="col-span-full py-20 duo-card bg-gray-50/30 border-dashed flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-gray-200">📖</div>
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No words added yet</p>
           </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 space-y-6 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add'} Word</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Word</label>
                  <input placeholder="e.g. Hello" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold" value={form.word} onChange={e => setForm({...form, word: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Translation</label>
                  <input placeholder="e.g. Hola" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold" value={form.translation} onChange={e => setForm({...form, translation: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Definition (Optional)</label>
                <textarea placeholder="Meaning in English..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold min-h-[80px]" value={form.definition} onChange={e => setForm({...form, definition: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Example Sentence</label>
                <textarea placeholder="How to use it..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold min-h-[80px]" value={form.example} onChange={e => setForm({...form, example: e.target.value})} />
              </div>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
                <input type="checkbox" checked={form.isPhrase} onChange={e => setForm({...form, isPhrase: e.target.checked})} className="w-5 h-5 accent-[#ad46ff]" />
                <span className="text-sm font-black text-gray-700 uppercase tracking-widest">Mark as multi-word phrase</span>
              </label>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs">CANCEL</button>
              <button onClick={handleSave} className="flex-1 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] uppercase tracking-widest text-xs">SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GrammarBuilder = ({ items, onUpdate }: { items: GrammarLesson[], onUpdate: (items: GrammarLesson[]) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GrammarLesson | null>(null);
  const [form, setForm] = useState<Partial<GrammarLesson>>({ title: '', content: '', examples: [] });
  const [exampleInput, setExampleInput] = useState('');

  const handleOpen = (item?: GrammarLesson) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ title: '', content: '', examples: [] });
    }
    setExampleInput('');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.content) {
      alert("Please provide a title and content for the rule.");
      return;
    }
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as GrammarLesson : i));
    } else {
      onUpdate([...items, { ...form, id: `g-${Date.now()}` } as GrammarLesson]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  const addExample = () => {
    if (exampleInput.trim()) {
      setForm(prev => ({ ...prev, examples: [...(prev.examples || []), exampleInput.trim()] }));
      setExampleInput('');
    }
  };

  const removeExample = (idx: number) => {
    setForm(prev => ({ ...prev, examples: (prev.examples || []).filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Grammar Lab</h2>
          <p className="text-gray-500 font-bold text-lg">Define structural rules and syntax patterns.</p>
        </div>
        <button onClick={() => handleOpen()} className="bg-[#ad46ff] text-white p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:bg-purple-600 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[11px]">+ ADD RULE</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div key={item.id} className="duo-card p-8 bg-white border-2 border-gray-100 group transition-all hover:border-[#ad46ff]">
            <div className="flex justify-between items-start mb-6">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-800">{item.title}</h3>
                  <div className="px-3 py-1 bg-purple-50 text-[#ad46ff] rounded-full text-[10px] font-black uppercase tracking-widest inline-block">Structure</div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => handleOpen(item)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl text-lg">✏️</button>
                  <button onClick={() => remove(item.id)} className="w-10 h-10 flex items-center justify-center hover:bg-red-50 text-red-400 rounded-xl text-lg">🗑️</button>
               </div>
            </div>
            <p className="text-gray-600 font-bold leading-relaxed mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">{item.content}</p>
            {item.examples && item.examples.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.examples.map((ex, i) => <span key={i} className="p-2 px-4 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100">"{ex}"</span>)}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
           <div className="py-20 duo-card bg-gray-50/30 border-dashed flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-gray-200">📝</div>
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No grammar rules added yet</p>
           </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 space-y-6 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add'} Grammar Rule</h3>
            <div className="space-y-5 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Rule Title</label>
                <input placeholder="e.g. Present Tense Conjugation" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-black" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Explanation</label>
                <textarea placeholder="Describe how the rule works..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold min-h-[120px]" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Example Sentences</label>
                <div className="flex gap-2">
                  <input placeholder="Add example..." className="flex-1 p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold" value={exampleInput} onChange={e => setExampleInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExample()} />
                  <button onClick={addExample} className="p-4 bg-gray-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest">ADD</button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {form.examples?.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 bg-purple-50 text-[#ad46ff] p-2 px-4 rounded-xl border border-purple-100 font-bold text-xs">
                      {ex}
                      <button onClick={() => removeExample(i)} className="text-red-400 hover:text-red-600">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs">CANCEL</button>
              <button onClick={handleSave} className="flex-1 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] uppercase tracking-widest text-xs">SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CultureBuilder = ({ items, onUpdate }: { items: CultureItem[], onUpdate: (items: CultureItem[]) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CultureItem | null>(null);
  const [form, setForm] = useState<Partial<CultureItem>>({ title: '', subtitle: '', category: 'Famous people', description: '', thumbnailUrl: '', assets: [] });

  const CATEGORIES = ['Famous people', 'Art & Masterpieces', 'Books', 'Movies & TV series', 'Music & Artists', 'Folklore & Traditions', 'Icons & Landmarks', 'Religion & Beliefs', 'Festivals'];

  const handleOpen = (item?: CultureItem) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ title: '', subtitle: '', category: 'Famous people', description: '', thumbnailUrl: '', assets: [] });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.description) {
      alert("Title and description are required.");
      return;
    }
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as CultureItem : i));
    } else {
      onUpdate([...items, { ...form, id: `c-${Date.now()}` } as CultureItem]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setForm(prev => ({ ...prev, thumbnailUrl: reader.result as string }));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addAsset = async (e: React.ChangeEvent<HTMLInputElement>, type: CultureAsset['type']) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const newAsset: CultureAsset = { type, value: reader.result as string, name: file.name };
        setForm(prev => ({ ...prev, assets: [...(prev.assets || []), newAsset] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAsset = (idx: number) => setForm(prev => ({ ...prev, assets: (prev.assets || []).filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Culture Explorer</h2>
          <p className="text-gray-500 font-bold text-lg">Add cultural context, videos, and media for learners.</p>
        </div>
        <button onClick={() => handleOpen()} className="bg-[#ad46ff] text-white p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:bg-purple-600 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[11px]">+ ADD ITEM</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="duo-card overflow-hidden bg-white border-2 border-gray-100 group transition-all hover:border-[#ad46ff]">
            <div className="h-40 bg-gray-100 relative">
              {item.thumbnailUrl ? <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt={item.title} /> : <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-50 text-gray-200 font-black">🌍</div>}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleOpen(item)} className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm">✏️</button>
                <button onClick={() => remove(item.id)} className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm text-red-400">🗑️</button>
              </div>
            </div>
            <div className="p-5 space-y-1">
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{item.category}</span>
              <h3 className="text-xl font-black text-gray-800 truncate">{item.title}</h3>
            </div>
          </div>
        ))}
        {items.length === 0 && (
           <div className="col-span-full py-20 duo-card bg-gray-50/30 border-dashed flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-gray-200">🌍</div>
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No culture items added yet</p>
           </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl p-8 space-y-6 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add'} Culture Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[65vh] overflow-y-auto px-1">
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value as any})} className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 font-bold outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Title</label>
                  <input placeholder="e.g. William Shakespeare" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-black" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                  <textarea placeholder="Tell the story..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold min-h-[140px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Thumbnail</label>
                  <div className="relative h-40 w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {form.thumbnailUrl ? <img src={form.thumbnailUrl} className="w-full h-full object-cover" /> : <span className="text-gray-300 font-black text-[10px] uppercase">Upload Cover</span>}
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Media Assets</label>
                  <div className="flex flex-wrap gap-2">
                    <label className="p-3 bg-purple-50 text-[#ad46ff] rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer">+ IMAGE <input type="file" accept="image/*" className="hidden" onChange={e => addAsset(e, 'image')} /></label>
                    <label className="p-3 bg-blue-50 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer">+ VIDEO <input type="file" accept="video/*" className="hidden" onChange={e => addAsset(e, 'video')} /></label>
                  </div>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto">
                    {form.assets?.map((asset, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <span className="text-[10px] font-bold text-gray-500 truncate">{asset.name}</span>
                        <button onClick={() => removeAsset(i)} className="text-gray-300 hover:text-red-400">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t-2 border-gray-50">
              <button onClick={() => setShowModal(false)} className="flex-1 p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs">CANCEL</button>
              <button onClick={handleSave} className="flex-1 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] uppercase tracking-widest text-xs">SAVE ITEM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AICharactersBuilder = ({ items, onUpdate }: { items: AICharacter[], onUpdate: (items: AICharacter[]) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AICharacter | null>(null);
  const [form, setForm] = useState<Partial<AICharacter>>({ name: '', role: '', avatar: '', description: '', personality: '' });

  const handleOpen = (item?: AICharacter) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ name: '', role: '', avatar: '', description: '', personality: '' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.role || !form.avatar) {
      alert("Name, Role, and Avatar are required.");
      return;
    }
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as AICharacter : i));
    } else {
      onUpdate([...items, { ...form, id: `ai-${Date.now()}` } as AICharacter]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setForm(prev => ({ ...prev, avatar: reader.result as string }));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">AI Tutors</h2>
          <p className="text-gray-500 font-bold text-lg">Create distinct personas for students to chat with.</p>
        </div>
        <button onClick={() => handleOpen()} className="bg-[#ad46ff] text-white p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:bg-purple-600 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[11px]">+ ADD CHARACTER</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((char) => (
          <div key={char.id} className="duo-card overflow-hidden bg-white border-2 border-gray-100 group transition-all hover:border-[#ad46ff] text-center">
            <div className="h-48 w-full overflow-hidden bg-gray-50 relative">
              <img src={char.avatar} className="w-full h-full object-cover" alt={char.name} />
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleOpen(char)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm">✏️</button>
                <button onClick={() => remove(char.id)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm text-red-400">🗑️</button>
              </div>
            </div>
            <div className="p-5 space-y-1">
              <h3 className="text-lg font-black text-gray-800">{char.name}</h3>
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">{char.role}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
           <div className="col-span-full py-20 duo-card bg-gray-50/30 border-dashed flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-gray-200">💬</div>
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No AI characters added yet</p>
           </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 space-y-6 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add'} AI Character</h3>
            <div className="space-y-4 max-h-[65vh] overflow-y-auto px-1">
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 group">
                   {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-[8px] font-black text-gray-300 uppercase text-center p-2">Upload Avatar</div>}
                   <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Name</label>
                  <input placeholder="e.g. Socrates" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-black" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Role</label>
                  <input placeholder="e.g. Philosopher" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                <textarea placeholder="Who are they?..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Personality</label>
                <textarea placeholder="How do they speak?..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold min-h-[80px]" value={form.personality} onChange={e => setForm({...form, personality: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs">CANCEL</button>
              <button onClick={handleSave} className="flex-1 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] uppercase tracking-widest text-xs">SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilder;