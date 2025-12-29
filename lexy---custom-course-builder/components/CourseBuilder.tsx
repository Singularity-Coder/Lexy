
import React, { useState, useRef } from 'react';
import { CourseData, DictionaryEntry, GrammarLesson, CultureItem, Unit, CultureAsset } from '../types';
import JSZip from 'jszip';

interface CourseBuilderProps {
  onCourseSaved: (course: CourseData) => void;
  onCancel: () => void;
  initialCourse?: CourseData;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ onCourseSaved, onCancel, initialCourse }) => {
  const [step, setStep] = useState(0);
  const [course, setCourse] = useState<Partial<CourseData>>(initialCourse || {
    id: `course-${Date.now()}`,
    courseTitle: '',
    language: '',
    units: [],
    dictionary: [],
    grammar: [],
    cultureItems: []
  });

  const updateCourse = (field: keyof CourseData, value: any) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { title: 'Basics', icon: '🌍' },
    { title: 'Dictionary', icon: '📖' },
    { title: 'Grammar', icon: '📝' },
    { title: 'Culture', icon: '🌍' },
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
    
    onCourseSaved(finalCourse);
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
    
    const manifest = {
      format: "lexy-package",
      version: 1,
      fields: {
        title: course.courseTitle || "Untitled Course",
        description: `A custom language course for ${course.language}`,
        author: "Lexy User",
        language: course.language || "Unknown"
      },
      assets: {},
      dataFiles: {
        dictionary: { path: "data/dictionary.json", version: 1 },
        grammar: { path: "data/grammar.json", version: 1 },
        culture: { path: "data/culture.json", version: 1 },
        units: { path: "data/units.json", version: 1 }
      },
      courseId: course.id
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
                      onChange={e => updateCourse('language', e.target.value)}
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
    if (!form.word || !form.translation) return;
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as DictionaryEntry : i));
    } else {
      onUpdate([...items, { ...form, id: `dict-${Date.now()}` } as DictionaryEntry]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Dictionary</h2>
          <p className="text-gray-500 font-bold text-lg">Manage words and phrases in your curriculum.</p>
        </div>
        <button 
          onClick={() => handleOpen()}
          className="bg-purple-100 text-purple-700 p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
        >
          + ADD NEW ENTRY
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4 duo-card border-dashed bg-gray-50">
            <span className="text-6xl">📖</span>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No entries added yet</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="duo-card p-6 bg-white hover:border-[#ad46ff] transition-all group flex flex-col h-full border-2 border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-gray-800">{item.word}</h4>
                  <p className="text-lg font-bold text-[#ad46ff]">{item.translation}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleOpen(item)} className="p-2 text-gray-400 hover:text-blue-500">✏️</button>
                   <button onClick={() => remove(item.id)} className="p-2 text-gray-400 hover:text-red-500">🗑️</button>
                </div>
              </div>
              {item.definition && <p className="text-sm text-gray-400 font-bold mb-4 line-clamp-2">{item.definition}</p>}
              {item.isPhrase && <span className="mt-auto px-3 py-1 bg-purple-100 text-[#ad46ff] text-[9px] font-black uppercase tracking-widest rounded-lg w-fit">Phrase</span>}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b-2 border-gray-50 flex justify-between items-center">
               <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add New'} Entry</h3>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-black">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Original Word</label>
                  <input 
                    placeholder="e.g. Bonjour" 
                    className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-gray-50" 
                    value={form.word}
                    onChange={e => setForm(prev => ({...prev, word: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Translation</label>
                  <input 
                    placeholder="e.g. Hello" 
                    className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-gray-50" 
                    value={form.translation}
                    onChange={e => setForm(prev => ({...prev, translation: e.target.value}))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Definition (Optional)</label>
                <textarea 
                  placeholder="A basic greeting used during the day..." 
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] h-24 bg-gray-50" 
                  value={form.definition}
                  onChange={e => setForm(prev => ({...prev, definition: e.target.value}))}
                />
              </div>
              <div className="flex items-center justify-between">
                 <button 
                  onClick={() => setForm(prev => ({...prev, isPhrase: !prev.isPhrase}))}
                  className={`p-3 px-6 rounded-2xl font-black text-xs border-2 transition-all ${form.isPhrase ? 'bg-purple-100 border-purple-300 text-[#ad46ff]' : 'bg-white border-gray-100 text-gray-400'}`}
                 >
                   {form.isPhrase ? '✅ PHRASE MODE' : 'OFFICE MODE'}
                 </button>
                 <button 
                  onClick={handleSave}
                  className="p-4 px-10 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3]"
                 >
                   SAVE ENTRY
                 </button>
              </div>
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
    if (!form.title || !form.content) return;
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...form, id: i.id } as GrammarLesson : i));
    } else {
      onUpdate([...items, { ...form, id: `gram-${Date.now()}` } as GrammarLesson]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Grammar Lab</h2>
          <p className="text-gray-500 font-bold text-lg">Define language rules and provide clear examples.</p>
        </div>
        <button 
          onClick={() => handleOpen()}
          className="bg-purple-100 text-purple-700 p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
        >
          + ADD NEW RULE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4 duo-card border-dashed bg-gray-50">
            <span className="text-6xl">📝</span>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No rules defined</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="duo-card p-8 bg-white hover:border-[#ad46ff] transition-all group flex flex-col border-2 border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-black text-gray-800">{item.title}</h4>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleOpen(item)} className="p-2 text-gray-400 hover:text-blue-500">✏️</button>
                   <button onClick={() => remove(item.id)} className="p-2 text-gray-400 hover:text-red-500">🗑️</button>
                </div>
              </div>
              <p className="text-sm text-gray-500 font-bold leading-relaxed line-clamp-3">{item.content}</p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b-2 border-gray-50 flex justify-between items-center">
               <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add New'} Rule</h3>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-black">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Rule Name</label>
                <input 
                  placeholder="e.g. Present Tense, Noun Genders" 
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-gray-50" 
                  value={form.title}
                  onChange={e => setForm(prev => ({...prev, title: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Explanation</label>
                <textarea 
                  placeholder="Explain how the rule works..." 
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] h-40 bg-gray-50" 
                  value={form.content}
                  onChange={e => setForm(prev => ({...prev, content: e.target.value}))}
                />
              </div>
              <div className="flex justify-end">
                 <button 
                  onClick={handleSave}
                  className="p-4 px-10 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3]"
                 >
                   SAVE RULE
                 </button>
              </div>
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
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState<Partial<CultureItem>>({ 
    title: '', 
    category: 'Famous people', 
    description: '', 
    assets: []
  });
  
  const [ytLink, setYtLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Famous people', 'Art & Masterpieces', 'Books', 'Movies & TV series', 'Music & Artists', 'Folklore & Traditions', 'Icons & Landmarks', 'Religion & Beliefs', 'Festivals'
  ];

  const handleOpen = (item?: CultureItem) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({ title: '', category: 'Famous people', description: '', assets: [] });
    }
    setShowModal(true);
  };

  const addYtLink = () => {
    if (!ytLink.trim()) return;
    const newAsset: CultureAsset = {
      type: 'youtube',
      value: ytLink.trim(),
      name: `YouTube: ${ytLink.split('v=')[1] || ytLink.split('/').pop()}`
    };
    setForm(prev => ({ ...prev, assets: [...(prev.assets || []), newAsset] }));
    setYtLink('');
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newAssets: CultureAsset[] = [];
    
    for (const file of Array.from(files)) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      let type: CultureAsset['type'] = 'link';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type === 'application/pdf') type = 'pdf';

      newAssets.push({
        type,
        value: base64,
        name: file.name
      });
    }
    
    setForm(prev => ({ ...prev, assets: [...(prev.assets || []), ...newAssets] }));
  };

  const removeAsset = (idx: number) => {
    setForm(prev => ({
      ...prev,
      assets: (prev.assets || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSave = () => {
    if (!form.title) {
        alert("Please provide a title for the culture item.");
        return;
    }
    
    // Find a thumbnail from assets
    let thumb = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop';
    const ytAsset = form.assets?.find(a => a.type === 'youtube');
    const imgAsset = form.assets?.find(a => a.type === 'image');
    
    if (ytAsset) {
      const vid = ytAsset.value.split('v=')[1] || ytAsset.value.split('/').pop();
      if (vid) thumb = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
    } else if (imgAsset) {
      thumb = imgAsset.value;
    }

    const newItem = { 
      ...form, 
      id: editingItem?.id || `cult-${Date.now()}`, 
      thumbnailUrl: thumb,
      assets: form.assets || []
    } as CultureItem;

    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      onUpdate([...items, newItem]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Culture Hub</h2>
          <p className="text-gray-500 font-bold text-lg">Add multimedia content to make the course engaging.</p>
        </div>
        <button 
          onClick={() => handleOpen()}
          className="bg-purple-100 text-purple-700 p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
        >
          + ADD CULTURE ITEM
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4 duo-card border-dashed bg-gray-50">
            <span className="text-6xl">🌍</span>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No culture items yet</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="duo-card overflow-hidden bg-white hover:border-[#ad46ff] transition-all group flex flex-col border-2 border-gray-100">
              <div className="h-40 relative bg-gray-100">
                 <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt={item.title} />
                 <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); handleOpen(item); }} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm">✏️</button>
                    <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm">🗑️</button>
                 </div>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-black text-[#ad46ff] uppercase tracking-widest">{item.category}</span>
                <h4 className="text-xl font-black text-gray-800 truncate">{item.title}</h4>
                <p className="text-xs text-gray-400 font-bold line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 mx-6">
            <div className="p-8 border-b-2 border-gray-50 flex justify-between items-center bg-gray-50/30">
               <h3 className="text-2xl font-black text-gray-800">{editingItem ? 'Edit' : 'Add New'} Item</h3>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-black">✕</button>
            </div>
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Title</label>
                  <input 
                    placeholder="e.g. History of Paris" 
                    className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-gray-50/50" 
                    value={form.title}
                    onChange={e => setForm(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                  <select 
                    className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-gray-50/50"
                    value={form.category}
                    onChange={e => setForm(prev => ({...prev, category: e.target.value as any}))}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                <textarea 
                  placeholder="Share a fun fact or context..." 
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] h-24 bg-gray-50/50" 
                  value={form.description}
                  onChange={e => setForm(prev => ({...prev, description: e.target.value}))}
                />
              </div>

              <div className="space-y-4 border-2 border-dashed border-gray-200 p-6 rounded-[2rem] bg-gray-50/50">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block mb-2">Media Assets & Links</label>
                
                {/* YouTube Link Input */}
                <div className="flex gap-2 mb-4">
                  <input 
                    placeholder="Paste YouTube Link here..." 
                    className="flex-1 p-4 rounded-xl border-2 border-gray-100 font-bold outline-none focus:border-[#ad46ff] bg-white" 
                    value={ytLink}
                    onChange={e => setYtLink(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addYtLink()}
                  />
                  <button 
                    onClick={addYtLink}
                    className="bg-purple-100 text-purple-700 p-4 px-6 rounded-xl font-black shadow-[0_4px_0_#c4b5fd] hover:bg-purple-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[10px]"
                  >
                    ADD LINK
                  </button>
                </div>

                {/* File Dropzone */}
                <div 
                  className={`border-4 border-dashed rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                    isDragging 
                    ? 'border-[#ad46ff] bg-purple-50 scale-[1.02]' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
                >
                  <input type="file" multiple ref={fileInputRef} className="hidden" onChange={e => handleFileUpload(e.target.files)} />
                  <span className={`text-4xl block mb-2 transition-transform duration-300 ${isDragging ? 'scale-125 animate-bounce' : ''}`}>
                    {isDragging ? '📥' : '📤'}
                  </span>
                  <p className={`text-xs font-black uppercase tracking-widest transition-colors ${isDragging ? 'text-[#ad46ff]' : 'text-gray-400'}`}>
                    {isDragging ? 'Drop to Attach Files' : 'Drag & Drop Files or Click to Browse'}
                  </p>
                  <p className="text-[9px] text-gray-300 font-bold mt-1">Videos, Audio, PDFs, Images supported</p>
                </div>

                {/* Attachments List */}
                <div className="space-y-2 mt-4">
                  {(form.assets || []).map((asset, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 px-4 bg-white rounded-xl border-2 border-gray-100 animate-in slide-in-from-left duration-200">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-xl">
                          {asset.type === 'youtube' ? '📺' : asset.type === 'image' ? '🖼️' : asset.type === 'video' ? '🎬' : asset.type === 'audio' ? '🎵' : asset.type === 'pdf' ? '📄' : '🔗'}
                        </span>
                        <span className="text-xs font-bold text-gray-600 truncate">{asset.name}</span>
                      </div>
                      <button onClick={() => removeAsset(idx)} className="text-gray-300 hover:text-red-500 font-black p-1">✕</button>
                    </div>
                  ))}
                  {(form.assets || []).length === 0 && (
                    <p className="text-center text-[10px] font-bold text-gray-300 italic py-2">No attachments added yet</p>
                  )}
                </div>
              </div>

              {/* Action Button Area */}
              <div className="flex justify-end pt-6 pb-12">
                 <button 
                  onClick={handleSave}
                  className="p-5 px-12 bg-[#ad46ff] text-white rounded-[1.5rem] font-black shadow-[0_6px_0_#8439a3] hover:bg-[#8439a3] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
                 >
                   SAVE CULTURE ITEM
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilder;
