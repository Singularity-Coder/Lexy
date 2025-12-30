
import React, { useState, useRef } from 'react';
import { CourseData, DictionaryEntry, GrammarLesson, CultureItem, Unit, CultureAsset, AICharacter } from '../types';
import JSZip from 'jszip';

interface CourseBuilderProps {
  onCourseSaved: (course: CourseData, originalId?: string) => void;
  onCancel: () => void;
  initialCourse?: CourseData;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ onCourseSaved, onCancel, initialCourse }) => {
  const [step, setStep] = useState(0);
  const [initialId] = useState(initialCourse?.id); // Track the ID we started with
  const [course, setCourse] = useState<Partial<CourseData>>(initialCourse || {
    id: '', // Will be set by language
    courseTitle: '',
    language: '',
    units: [],
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
      units: course.units?.length ? course.units : [
        {
          id: 'unit-init',
          title: 'Introduction',
          color: 'bg-[#ad46ff]',
          lessons: [
            { id: 'l1', title: 'Hello', description: 'Basic greetings', status: 'available', exercises: [] }
          ]
        }
      ]
    } as CourseData;
    
    // Pass back the new data and the original ID to handle renames
    onCourseSaved(finalCourse, initialId);
  };

  const handleExportLexy = async () => {
    const zip = new JSZip();
    
    // Create a copy of culture items for JSON so we can replace base64 with relative paths
    const cultureItemsCopy = JSON.parse(JSON.stringify(course.cultureItems || [])) as CultureItem[];
    const assetFolder = zip.folder("assets");

    // Extract binary assets
    for (const item of cultureItemsCopy) {
      if (item.assets) {
        for (const asset of item.assets) {
          // Check if it's a data URL (base64)
          if (asset.value.startsWith('data:')) {
            const parts = asset.value.split(';base64,');
            const base64Data = parts[1];
            // Sanitize file name
            const cleanName = asset.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const fileName = `asset_${Date.now()}_${cleanName}`;
            
            // Add file to ZIP
            assetFolder?.file(fileName, base64Data, { base64: true });
            
            // Replace base64 with relative path in the JSON copy
            asset.value = `assets/${fileName}`;
          }
        }
      }
      
      // Handle the thumbnail too if it's base64
      if (item.thumbnailUrl && item.thumbnailUrl.startsWith('data:')) {
        const parts = item.thumbnailUrl.split(';base64,');
        const base64Data = parts[1];
        const fileName = `thumb_${item.id}_${Date.now()}.png`;
        assetFolder?.file(fileName, base64Data, { base64: true });
        item.thumbnailUrl = `assets/${fileName}`;
      }
    }

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
        dictionary: { path: "data/dictionary.json", version: 1 },
        grammar: { path: "data/grammar.json", version: 1 },
        culture: { path: "data/culture.json", version: 1 },
        units: { path: "data/units.json", version: 1 },
        ai_chats: { path: "data/ai_chats.json", version: 1 }
      },
      courseId: course.language // Course ID is now the language name
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

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 space-y-8 shrink-0">
          <button 
            onClick={onCancel} 
            className="text-gray-400 font-black hover:text-[#ad46ff] transition-colors uppercase tracking-widest text-xs flex items-center gap-2"
          >
            ← CANCEL BUILDER
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
              <div className="duo-card p-10 bg-white border-2 border-gray-100 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Language Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Spanish, High Valyrian"
                      className="w-full p-6 rounded-3xl border-2 border-gray-200 focus:border-[#ad46ff] font-black outline-none bg-gray-50 text-gray-800 placeholder-gray-300 text-xl transition-all"
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
                      placeholder="e.g. Beginner Mastery"
                      className="w-full p-6 rounded-3xl border-2 border-gray-200 focus:border-[#ad46ff] font-black outline-none bg-gray-50 text-gray-800 placeholder-gray-300 text-xl transition-all"
                      value={course.courseTitle}
                      onChange={e => updateCourse('courseTitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <DictionaryBuilder 
              items={course.dictionary || []} 
              onUpdate={(items) => updateCourse('dictionary', items)} 
            />
          )}

          {step === 2 && (
            <GrammarBuilder 
              items={course.grammar || []} 
              onUpdate={(items) => updateCourse('grammar', items)} 
            />
          )}

          {step === 3 && (
            <CultureBuilder 
              items={course.cultureItems || []} 
              onUpdate={(items) => updateCourse('cultureItems', items)} 
            />
          )}

          {step === 4 && (
            <AICharactersBuilder
              items={course.aiCharacters || []}
              onUpdate={(items) => updateCourse('aiCharacters', items)}
            />
          )}

          {step === 5 && (
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

// Fix: Add DictionaryBuilder sub-component
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
      alert("Please fill in both the word and its translation.");
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
          <p className="text-gray-500 font-bold text-lg">Add words and phrases to your course.</p>
        </div>
        <button 
          onClick={() => handleOpen()}
          className="bg-purple-100 text-[#ad46ff] p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[11px]"
        >
          + ADD ITEM
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="duo-card p-5 bg-white flex items-center justify-between group border-2 border-gray-100">
            <div>
              <h4 className="font-black text-gray-800">{item.word}</h4>
              <p className="text-[#ad46ff] font-bold text-sm">{item.translation}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpen(item)} className="p-2 hover:bg-gray-100 rounded-lg">✏️</button>
              <button onClick={() => remove(item.id)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 space-y-6 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add'} Dictionary Entry</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Word</label>
                <input placeholder="Word" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50" value={form.word} onChange={e => setForm({...form, word: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Translation</label>
                <input placeholder="Translation" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50" value={form.translation} onChange={e => setForm({...form, translation: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Definition</label>
              <textarea placeholder="Definition" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] h-24 bg-gray-50" value={form.definition} onChange={e => setForm({...form, definition: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Example</label>
              <input placeholder="Example Sentence" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50" value={form.example} onChange={e => setForm({...form, example: e.target.value})} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-2">
              <input type="checkbox" checked={form.isPhrase} onChange={e => setForm({...form, isPhrase: e.target.checked})} className="w-5 h-5 accent-[#ad46ff]" />
              <span className="font-bold text-gray-600 text-sm">This is a common phrase</span>
            </label>
            <div className="flex gap-4 pt-4">
              <button onClick={handleSave} className="flex-1 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] uppercase tracking-widest text-xs">SAVE</button>
              <button onClick={() => setShowModal(false)} className="flex-1 p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fix: Add GrammarBuilder sub-component
const GrammarBuilder = ({ items, onUpdate }: { items: GrammarLesson[], onUpdate: (items: GrammarLesson[]) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GrammarLesson | null>(null);
  const [form, setForm] = useState<Partial<GrammarLesson>>({ title: '', content: '', examples: [] });
  const [newExample, setNewExample] = useState('');

  const handleOpen = (item?: GrammarLesson) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ title: '', content: '', examples: [] });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.content) {
      alert("Please provide both a title and the rule content.");
      return;
    }
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as GrammarLesson : i));
    } else {
      onUpdate([...items, { ...form, id: `g-${Date.now()}` } as GrammarLesson]);
    }
    setShowModal(false);
  };

  const addExample = () => {
    if (newExample.trim()) {
      setForm({ ...form, examples: [...(form.examples || []), newExample.trim()] });
      setNewExample('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Grammar</h2>
          <p className="text-gray-500 font-bold text-lg">Explain the fundamental rules of the language.</p>
        </div>
        <button onClick={() => handleOpen()} className="bg-purple-100 text-[#ad46ff] p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 uppercase tracking-widest text-[11px]">+ ADD RULE</button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="duo-card p-6 bg-white flex justify-between items-center group border-2 border-gray-100">
            <div className="flex-1">
              <h4 className="text-xl font-black text-gray-800">{item.title}</h4>
              <p className="text-gray-400 text-sm font-bold line-clamp-1 mt-1">{item.content}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpen(item)} className="p-2 hover:bg-gray-100 rounded-lg">✏️</button>
              <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="p-2 hover:bg-red-50 text-red-400 rounded-lg">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 space-y-6 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add'} Grammar Rule</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Rule Title</label>
              <input placeholder="e.g. Present Tense" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] font-bold bg-gray-50" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Rule Content</label>
              <textarea placeholder="Describe the grammar rule..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] h-32 bg-gray-50" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Example Sentences</label>
              <div className="flex gap-2">
                <input placeholder="Add a clear example..." className="flex-1 p-3 rounded-xl border-2 border-gray-100 outline-none bg-gray-50" value={newExample} onChange={e => setNewExample(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExample()} />
                <button onClick={addExample} className="p-3 px-6 bg-[#ad46ff] text-white rounded-xl font-black text-xs uppercase tracking-widest">ADD</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {form.examples?.map((ex, i) => (
                  <div key={i} className="bg-purple-50 text-[#ad46ff] p-2 px-3 rounded-lg text-xs font-bold flex items-center gap-2 border border-purple-100">
                    {ex}
                    <button onClick={() => setForm({...form, examples: form.examples?.filter((_, idx) => idx !== i)})} className="hover:text-red-500 font-black">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleSave} className="flex-1 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] uppercase tracking-widest text-xs">SAVE</button>
              <button onClick={() => setShowModal(false)} className="flex-1 p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fix: Add CultureBuilder sub-component
const CultureBuilder = ({ items, onUpdate }: { items: CultureItem[], onUpdate: (items: CultureItem[]) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CultureItem | null>(null);
  const [form, setForm] = useState<Partial<CultureItem>>({ title: '', category: 'Famous people', description: '', thumbnailUrl: '', assets: [] });

  const categories = [
    'Famous people', 'Art & Masterpieces', 'Books', 'Movies & TV series',
    'Music & Artists', 'Folklore & Traditions', 'Icons & Landmarks',
    'Religion & Beliefs', 'Festivals'
  ];

  const handleOpen = (item?: CultureItem) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ title: '', category: 'Famous people', description: '', thumbnailUrl: '', assets: [] });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.description) {
      alert("Please fill in the title and description.");
      return;
    }
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as CultureItem : i));
    } else {
      onUpdate([...items, { ...form, id: `c-${Date.now()}` } as CultureItem]);
    }
    setShowModal(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumb' | 'asset', assetIdx?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'thumb') {
        setForm({ ...form, thumbnailUrl: base64 });
      } else if (assetIdx !== undefined) {
        const newAssets = [...(form.assets || [])];
        newAssets[assetIdx] = { ...newAssets[assetIdx], value: base64 };
        setForm({ ...form, assets: newAssets });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Culture</h2>
          <p className="text-gray-500 font-bold text-lg">Curate cultural stories, icons, and media galleries.</p>
        </div>
        <button onClick={() => handleOpen()} className="bg-purple-100 text-[#ad46ff] p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 uppercase tracking-widest text-[11px]">+ ADD ITEM</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="duo-card overflow-hidden bg-white group border-2 border-gray-100 flex flex-col">
            <div className="h-40 bg-gray-100 relative overflow-hidden">
              {item.thumbnailUrl && <img src={item.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                <button onClick={() => handleOpen(item)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">✏️</button>
                <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">🗑️</button>
              </div>
            </div>
            <div className="p-5 space-y-1 flex-1">
              <h4 className="font-black text-gray-800 truncate text-lg leading-tight">{item.title}</h4>
              <p className="text-[10px] font-black text-[#ad46ff] uppercase tracking-[0.2em]">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 space-y-6 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl font-black text-gray-800">Culture Item Details</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Item Title</label>
                <input placeholder="e.g. Machu Picchu" className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                <select className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] bg-gray-50 font-bold" value={form.category} onChange={e => setForm({...form, category: e.target.value as any})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Description</label>
              <textarea placeholder="Write a captivating story or description..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#ad46ff] h-32 bg-gray-50" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Main Thumbnail</label>
              <div className="flex gap-6 items-center p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 rounded-2xl bg-white overflow-hidden border-2 border-gray-100 flex items-center justify-center shrink-0">
                  {form.thumbnailUrl ? <img src={form.thumbnailUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-3xl">🖼️</span>}
                </div>
                <div className="flex-1 space-y-2">
                   <p className="text-[10px] font-bold text-gray-400">High-quality square images work best.</p>
                   <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'thumb')} className="text-xs font-black text-purple-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-4">
               <div className="flex justify-between items-center border-b-2 border-gray-50 pb-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Media Gallery</label>
                 <button onClick={() => setForm({...form, assets: [...(form.assets || []), { type: 'youtube', name: 'New Media Piece', value: '' }]})} className="bg-purple-50 text-[#ad46ff] p-2 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-100">+ ADD ASSET</button>
               </div>
               <div className="space-y-4">
                 {form.assets?.map((asset, idx) => (
                   <div key={idx} className="p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl space-y-4 shadow-sm animate-in slide-in-from-top duration-200">
                     <div className="flex gap-3">
                       <select className="p-3 bg-white rounded-xl text-xs font-black border-2 border-gray-100 outline-none focus:border-[#ad46ff]" value={asset.type} onChange={e => {
                         const newAssets = [...(form.assets || [])];
                         newAssets[idx].type = e.target.value as any;
                         setForm({...form, assets: newAssets});
                       }}>
                         <option value="youtube">YouTube</option>
                         <option value="image">Image</option>
                         <option value="video">Video</option>
                         <option value="audio">Audio</option>
                         <option value="pdf">PDF</option>
                         <option value="link">Link</option>
                       </select>
                       <input className="flex-1 p-3 bg-white rounded-xl text-xs font-bold border-2 border-gray-100 outline-none focus:border-[#ad46ff]" placeholder="Label (e.g. 'Intro Video')" value={asset.name} onChange={e => {
                         const newAssets = [...(form.assets || [])];
                         newAssets[idx].name = e.target.value;
                         setForm({...form, assets: newAssets});
                       }} />
                       <button onClick={() => setForm({...form, assets: form.assets?.filter((_, i) => i !== idx)})} className="w-10 h-10 bg-white text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 shadow-sm">🗑️</button>
                     </div>
                     {asset.type === 'youtube' || asset.type === 'link' ? (
                       <input className="w-full p-3 bg-white rounded-xl text-xs font-bold border-2 border-gray-100 outline-none focus:border-[#ad46ff]" placeholder="Paste full URL here..." value={asset.value} onChange={e => {
                         const newAssets = [...(form.assets || [])];
                         newAssets[idx].value = e.target.value;
                         setForm({...form, assets: newAssets});
                       }} />
                     ) : (
                       <div className="flex items-center gap-4 p-2 px-4 bg-white rounded-xl border-2 border-gray-100">
                         <span className="text-xl">📁</span>
                         <input type="file" onChange={e => handleFileUpload(e, 'asset', idx)} className="text-xs font-black text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-gray-100 file:text-gray-600" />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button onClick={handleSave} className="flex-1 p-5 bg-[#ad46ff] text-white rounded-[1.5rem] font-black shadow-[0_6px_0_#8439a3] uppercase tracking-widest text-xs">SAVE CHANGES</button>
              <button onClick={() => setShowModal(false)} className="flex-1 p-5 bg-gray-100 text-gray-400 rounded-[1.5rem] font-black uppercase tracking-widest text-xs">CANCEL</button>
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
  const [form, setForm] = useState<Partial<AICharacter>>({ name: '', role: '', description: '', personality: '', avatar: '' });

  const handleOpen = (item?: AICharacter) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ name: '', role: '', description: '', personality: '', avatar: 'https://i.pinimg.com/736x/d1/f4/b3/d1f4b350c48dc8dc2b376c1b73a7b250.jpg' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.role || !form.personality) {
        alert("Please fill in Name, Role, and Personality.");
        return;
    }
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as AICharacter : i));
    } else {
      onUpdate([...items, { ...form, id: `char-${Date.now()}` } as AICharacter]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">AI Characters</h2>
          <p className="text-gray-500 font-bold text-lg">Define custom AI tutors for your course.</p>
        </div>
        <button 
          onClick={() => handleOpen()}
          className="bg-purple-100 text-[#ad46ff] p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[11px] whitespace-nowrap"
        >
          + ADD CHARACTER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full py-24 text-center space-y-6 duo-card border-dashed bg-gray-50 flex flex-col items-center justify-center">
            <span className="text-7xl opacity-40">💬</span>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No characters added yet</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="duo-card overflow-hidden bg-white hover:border-[#ad46ff] transition-all group flex flex-col border-2 border-gray-100">
              <div className="h-40 relative bg-gray-100 overflow-hidden">
                 <img src={item.avatar} className="w-full h-full object-cover" alt={item.name} />
                 <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpen(item)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm hover:scale-110">✏️</button>
                    <button onClick={() => remove(item.id)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm hover:scale-110">🗑️</button>
                 </div>
              </div>
              <div className="p-5 space-y-1">
                <h4 className="text-xl font-black text-gray-800 truncate">{item.name}</h4>
                <p className="text-xs font-black text-[#ad46ff] uppercase tracking-widest">{item.role}</p>
                <p className="text-xs text-gray-400 font-bold line-clamp-2 mt-2 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b-2 border-gray-50 flex justify-between items-center bg-gray-50/30">
               <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add'} Character</h3>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-black text-xl">✕</button>
            </div>
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Character Name</label>
                  <input 
                    placeholder="e.g. Socrates" 
                    className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-gray-50/50" 
                    value={form.name}
                    onChange={e => setForm(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Role/Title</label>
                  <input 
                    placeholder="e.g. Ancient Philosopher" 
                    className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-gray-50/50" 
                    value={form.role}
                    onChange={e => setForm(prev => ({...prev, role: e.target.value}))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Avatar Image URL</label>
                <input 
                  placeholder="Paste an image URL..." 
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-gray-50/50" 
                  value={form.avatar}
                  onChange={e => setForm(prev => ({...prev, avatar: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Origin Story (Displayed to User)</label>
                <textarea 
                  placeholder="Describe where this character is from..." 
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] h-20 bg-gray-50/50" 
                  value={form.description}
                  onChange={e => setForm(prev => ({...prev, description: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Personality Prompt (AI Instructions)</label>
                <textarea 
                  placeholder="Tell the AI how to behave. e.g. 'Speak formally and use metaphors about the sea...'" 
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] h-32 bg-gray-50/50" 
                  value={form.personality}
                  onChange={e => setForm(prev => ({...prev, personality: e.target.value}))}
                />
              </div>

              <div className="flex justify-end pt-4 pb-4">
                 <button 
                  onClick={handleSave}
                  className="p-4 px-12 bg-[#ad46ff] text-white rounded-[1.5rem] font-black shadow-[0_6px_0_#8439a3] hover:bg-[#8439a3] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
                 >
                   SAVE CHARACTER
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fix: Export CourseBuilder as default
export default CourseBuilder;
