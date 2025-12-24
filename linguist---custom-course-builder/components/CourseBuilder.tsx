
import React, { useState } from 'react';
import { CourseData, DictionaryEntry, GrammarLesson, CultureItem, Unit } from '../types';

interface CourseBuilderProps {
  onCourseSaved: (course: CourseData) => void;
  onCancel: () => void;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ onCourseSaved, onCancel }) => {
  const [step, setStep] = useState(0);
  const [course, setCourse] = useState<Partial<CourseData>>({
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

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

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
    // Add default unit if none provided for valid structure
    const finalCourse: CourseData = {
      ...course,
      units: course.units?.length ? course.units : [
        {
          id: 'unit-init',
          title: 'Introduction',
          color: 'bg-[#58cc02]',
          lessons: [
            { id: 'l1', title: 'Hello', description: 'Basic greetings', status: 'available', exercises: [] }
          ]
        }
      ]
    } as CourseData;
    
    onCourseSaved(finalCourse);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(course, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${course.language || 'course'}_data.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-8">
          <button 
            onClick={onCancel} 
            className="text-gray-400 font-black hover:text-gray-600 transition-colors uppercase tracking-widest text-xs flex items-center gap-2"
          >
            ← CANCEL
          </button>
          
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Sections</h3>
            <nav className="space-y-1">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`w-full flex items-center p-4 rounded-2xl font-black text-sm transition-all transform active:scale-95 space-x-4 border-2 ${
                    step === idx 
                      ? 'bg-[#ddf4ff] text-[#1cb0f6] border-[#84d8ff]' 
                      : 'text-gray-400 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="uppercase tracking-wider text-xs">{s.title}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-4 border-t-2 border-gray-100 space-y-3">
             <button 
              onClick={handleFinish}
              className="w-full p-4 bg-[#58cc02] text-white rounded-2xl font-black shadow-[0_4px_0_#46a302] hover:bg-[#46a302] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[10px]"
             >
                FINISH CREATION
             </button>
             
             <button 
              onClick={handleExportJSON}
              className="w-full p-4 bg-white text-gray-400 rounded-2xl font-black border-2 border-gray-100 shadow-[0_4px_0_#e5e5e5] hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[10px]"
             >
                EXPORT TO JSON
             </button>

             <p className="mt-3 text-[10px] text-center text-gray-400 font-bold leading-relaxed px-2">
               Save and sync your progress to start learning now.
             </p>
          </div>
        </div>

        {/* Main Workspace Card */}
        <div className="flex-1 duo-card p-10 bg-white min-h-[500px] flex flex-col border-2 border-gray-100">
          <div className="flex-1">
            {step === 0 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-gray-800">New Language Journey</h2>
                  <p className="text-gray-500 font-bold text-lg">First, tell us what we are building.</p>
                </div>
                <div className="space-y-8 max-w-md mx-auto pt-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Language</label>
                    <input 
                      type="text" 
                      placeholder="e.g. English"
                      className="w-full p-6 rounded-2xl border-2 border-gray-200 focus:border-[#1cb0f6] font-black outline-none bg-gray-50 text-gray-800 placeholder-gray-300 text-xl"
                      value={course.language}
                      onChange={e => updateCourse('language', e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Course Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. English Mastery"
                      className="w-full p-6 rounded-2xl border-2 border-gray-200 focus:border-[#1cb0f6] font-black outline-none bg-gray-50 text-gray-800 placeholder-gray-300 text-xl"
                      value={course.courseTitle}
                      onChange={e => updateCourse('courseTitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-gray-800">Dictionary Builder</h2>
                  <p className="text-gray-500 font-bold text-lg">Add words and phrases that will appear in the course.</p>
                </div>
                
                <DictionaryBuilder 
                  items={course.dictionary || []} 
                  onUpdate={(items) => updateCourse('dictionary', items)} 
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-gray-800">Grammar Lab</h2>
                  <p className="text-gray-500 font-bold text-lg">Explain the rules of your language with examples.</p>
                </div>
                
                <GrammarBuilder 
                  items={course.grammar || []} 
                  onUpdate={(items) => updateCourse('grammar', items)} 
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-gray-800">Culture & Media</h2>
                  <p className="text-gray-500 font-bold text-lg">Add YouTube links, landmarks, and cultural fun facts.</p>
                </div>
                
                <CultureBuilder 
                  items={course.cultureItems || []} 
                  onUpdate={(items) => updateCourse('cultureItems', items)} 
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in duration-300 flex-1 flex flex-col justify-center text-center py-10">
                 <span className="text-8xl mb-4">🚀</span>
                 <h2 className="text-4xl font-black text-gray-800">Units & Lessons</h2>
                 <p className="text-gray-500 font-bold text-lg max-w-sm mx-auto">
                   Once finished, units will be generated automatically based on your vocabulary and grammar inputs.
                 </p>
              </div>
            )}
          </div>

          <div className="mt-10 pt-10 border-t-2 border-gray-50 flex justify-end gap-4">
            <button 
              onClick={prevStep} 
              disabled={step === 0}
              className={`p-4 px-10 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-gray-100 transition-all ${step === 0 ? 'hidden' : 'hover:bg-gray-50'}`}
            >
              Back
            </button>
            
            {step === steps.length - 1 ? (
              <button 
                onClick={handleFinish}
                className="p-4 px-12 bg-[#58cc02] text-white rounded-2xl font-black shadow-[0_4px_0_#46a302] hover:scale-105 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
              >
                SYNC & FINISH
              </button>
            ) : (
              <button 
                onClick={nextStep}
                className="p-4 px-16 bg-[#1cb0f6] text-white rounded-2xl font-black shadow-[0_4px_0_#1899d6] hover:scale-105 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-sm"
              >
                CONTINUE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const DictionaryBuilder = ({ items, onUpdate }: { items: DictionaryEntry[], onUpdate: (items: DictionaryEntry[]) => void }) => {
  const [newEntry, setNewEntry] = useState<Partial<DictionaryEntry>>({ word: '', translation: '', definition: '', example: '', isPhrase: false });

  const add = () => {
    if (!newEntry.word || !newEntry.translation) return;
    onUpdate([...items, { ...newEntry, id: `dict-${Date.now()}` } as DictionaryEntry]);
    setNewEntry({ word: '', translation: '', definition: '', example: '', isPhrase: false });
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input 
            placeholder="Word" 
            className="p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-blue-400 bg-white text-gray-800" 
            value={newEntry.word}
            onChange={e => setNewEntry(prev => ({...prev, word: e.target.value}))}
          />
          <input 
            placeholder="Translation" 
            className="p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-blue-400 bg-white text-gray-800" 
            value={newEntry.translation}
            onChange={e => setNewEntry(prev => ({...prev, translation: e.target.value}))}
          />
        </div>
        <textarea 
          placeholder="Definition (Optional)" 
          className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-blue-400 h-20 bg-white text-gray-800" 
          value={newEntry.definition}
          onChange={e => setNewEntry(prev => ({...prev, definition: e.target.value}))}
        />
        <div className="flex items-center gap-4">
           <button 
            onClick={() => setNewEntry(prev => ({...prev, isPhrase: !prev.isPhrase}))}
            className={`p-2 px-4 rounded-lg font-black text-[10px] border-2 transition-all ${newEntry.isPhrase ? 'bg-purple-100 border-purple-400 text-purple-600' : 'bg-white border-gray-100 text-gray-400'}`}
           >
             PHRASE MODE: {newEntry.isPhrase ? 'ON' : 'OFF'}
           </button>
           <button onClick={add} className="flex-1 bg-gray-800 text-white p-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Add to Dictionary</button>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {items.map(item => (
          <div key={item.id} className="p-3 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-between group">
            <div className="flex gap-4 items-center">
              <span className="font-black text-gray-800">{item.word}</span>
              <span className="text-blue-500 font-bold">→ {item.translation}</span>
            </div>
            <button onClick={() => remove(item.id)} className="text-red-300 hover:text-red-500 transition-colors">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const GrammarBuilder = ({ items, onUpdate }: { items: GrammarLesson[], onUpdate: (items: GrammarLesson[]) => void }) => {
  const [newEntry, setNewEntry] = useState<Partial<GrammarLesson>>({ title: '', content: '', examples: [] });

  const add = () => {
    if (!newEntry.title || !newEntry.content) return;
    onUpdate([...items, { ...newEntry, id: `gram-${Date.now()}` } as GrammarLesson]);
    setNewEntry({ title: '', content: '', examples: [] });
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
        <input 
          placeholder="Rule Title (e.g. Present Tense)" 
          className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-purple-400 bg-white text-gray-800" 
          value={newEntry.title}
          onChange={e => setNewEntry(prev => ({...prev, title: e.target.value}))}
        />
        <textarea 
          placeholder="Explanation of the rule..." 
          className="w-full p-3 rounded-xl border-2 border-gray-100 font-bold outline-none focus:border-purple-400 h-28 bg-white text-gray-800" 
          value={newEntry.content}
          onChange={e => setNewEntry(prev => ({...prev, content: e.target.value}))}
        />
        <button onClick={add} className="w-full bg-gray-800 text-white p-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Save Rule</button>
      </div>

      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {items.map(item => (
          <div key={item.id} className="p-4 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-between">
            <h4 className="font-black text-gray-700">{item.title}</h4>
            <button onClick={() => remove(item.id)} className="text-red-300 hover:text-red-500">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CultureBuilder = ({ items, onUpdate }: { items: CultureItem[], onUpdate: (items: CultureItem[]) => void }) => {
  const [newEntry, setNewEntry] = useState<Partial<CultureItem>>({ 
    title: '', 
    category: 'Famous people', 
    description: '', 
    mediaUrl: '',
    type: 'video',
    platform: 'YouTube'
  });

  const categories = [
    'Famous people', 'Art & Masterpieces', 'Books', 'Movies & TV series', 'Music & Artists', 'Folklore & Traditions', 'Icons & Landmarks', 'Religion & Beliefs', 'Festivals'
  ];

  const add = () => {
    if (!newEntry.title || !newEntry.mediaUrl) return;
    
    // Extract YT ID for thumbnail if it's YouTube
    let thumb = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop';
    if (newEntry.mediaUrl.includes('youtube.com') || newEntry.mediaUrl.includes('youtu.be')) {
      const vid = newEntry.mediaUrl.split('v=')[1] || newEntry.mediaUrl.split('/').pop();
      if (vid) thumb = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
    }

    onUpdate([...items, { ...newEntry, id: `cult-${Date.now()}`, thumbnailUrl: thumb } as CultureItem]);
    setNewEntry({ title: '', category: 'Famous people', description: '', mediaUrl: '', type: 'video', platform: 'YouTube' });
  };

  const remove = (id: string) => onUpdate(items.filter(i => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input 
            placeholder="Item Title" 
            className="p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-orange-400 bg-white text-gray-800" 
            value={newEntry.title}
            onChange={e => setNewEntry(prev => ({...prev, title: e.target.value}))}
          />
          <select 
            className="p-3 rounded-xl border-2 border-gray-100 font-bold outline-none focus:border-orange-400 bg-white text-gray-800"
            value={newEntry.category}
            onChange={e => setNewEntry(prev => ({...prev, category: e.target.value as any}))}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <input 
          placeholder="YouTube URL or Link" 
          className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-orange-400 bg-white text-gray-800" 
          value={newEntry.mediaUrl}
          onChange={e => setNewEntry(prev => ({...prev, mediaUrl: e.target.value}))}
        />
        <textarea 
          placeholder="Brief description or fun fact..." 
          className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-orange-400 h-20 bg-white text-gray-800" 
          value={newEntry.description}
          onChange={e => setNewEntry(prev => ({...prev, description: e.target.value}))}
        />
        <button onClick={add} className="w-full bg-gray-800 text-white p-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Add Culture Item</button>
      </div>

      <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {items.map(item => (
          <div key={item.id} className="p-3 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-black text-gray-700">{item.title}</span>
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{item.category}</span>
            </div>
            <button onClick={() => remove(item.id)} className="text-red-300 hover:text-red-500">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseBuilder;
