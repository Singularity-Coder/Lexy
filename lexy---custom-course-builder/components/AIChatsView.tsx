
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AICharacter, ChatMessage } from '../types';
import { MYTHICAL_CHARACTERS } from '../constants'

interface AIChatsViewProps {
  currentLanguage: string;
}

const AIChatsView: React.FC<AIChatsViewProps> = ({ currentLanguage }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<AICharacter>(MYTHICAL_CHARACTERS[0]);
  const [viewMode, setViewMode] = useState<'list' | 'chat'>('list'); // For mobile toggle logic
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    'zeus': [
      { role: 'model', text: "Mortal! I sense you are learning the nuances of the tongue. How can the King of Olympus assist your journey?", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
    ],
    'athena': [
       { role: 'model', text: "Knowledge is the greatest weapon. Greetings, student. Shall we refine your understanding together?", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
    ]
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistories, selectedCharacter, viewMode]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setChatHistories(prev => ({
      ...prev,
      [selectedCharacter.id]: [...(prev[selectedCharacter.id] || []), userMsg]
    }));
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are ${selectedCharacter.name}, ${selectedCharacter.role}. Personality: ${selectedCharacter.personality}.
      The student is learning ${currentLanguage}. Respond to their message in character.
      Student says: "${inputValue}"
      Keep responses relatively short, thematic, and encouraging for a language learner.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      const modelMsg: ChatMessage = {
        role: 'model',
        text: response.text || "My thunders are silent for now. Try again, seeker.",
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };

      setChatHistories(prev => ({
        ...prev,
        [selectedCharacter.id]: [...(prev[selectedCharacter.id] || []), modelMsg]
      }));
    } catch (error) {
      console.error("AI Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCharacterSelect = (char: AICharacter) => {
    setSelectedCharacter(char);
    setViewMode('chat'); // Switch to chat view on mobile
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Main Container - End to End */}
      <div className="flex-1 flex overflow-hidden border-t-2 border-gray-100">
        
        {/* Left Sidebar: Character Grid - Hidden on mobile when viewing chat */}
        <div className={`${viewMode === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] border-r-2 border-gray-100 flex-col bg-gray-50/20 overflow-hidden shrink-0`}>
          {/* Header Section */}
          <div className="p-8 border-b-2 border-gray-100 bg-white shrink-0">
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">AI Chats</h1>
            <p className="text-sm text-gray-400 font-bold mt-2 leading-relaxed">
              Chat with Gods, Mythical creatures and other historical figures of <span className="text-[#ad46ff] font-black">{currentLanguage}</span> language
            </p>
          </div>

          {/* 2x2 Grid Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
            <div className="grid grid-cols-2 gap-4">
              {MYTHICAL_CHARACTERS.map(char => {
                const isActive = selectedCharacter.id === char.id;
                
                return (
                  <button
                    key={char.id}
                    onClick={() => handleCharacterSelect(char)}
                    className={`flex flex-col items-stretch text-center rounded-3xl transition-all border-2 overflow-hidden group ${
                      isActive 
                        ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-[0_4px_0_#c4b5fd]' 
                        : 'bg-white border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
                    }`}
                  >
                    {/* End-to-End Image Section */}
                    <div className="h-[120px] w-full overflow-hidden shrink-0">
                      <img 
                        src={char.avatar} 
                        alt={char.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    
                    {/* Text Section Below Image */}
                    <div className="p-4 flex flex-col items-center">
                      <h3 className={`font-black text-sm truncate w-full ${isActive ? 'text-purple-700' : 'text-gray-800'}`}>
                        {char.name}
                      </h3>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 truncate w-full ${isActive ? 'text-purple-500' : 'text-gray-300'}`}>
                        {char.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Pane: Conversation Area - Hidden on mobile when viewing list */}
        <div className={`${viewMode === 'list' ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col relative bg-white`}>
          {/* Active Character Header */}
          <div className="p-5 px-8 bg-white border-b-2 border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              {/* Mobile Back Button */}
              <button 
                onClick={() => setViewMode('list')}
                className="md:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100"
              >
                ←
              </button>
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm bg-gray-50">
                <img src={selectedCharacter.avatar} alt={selectedCharacter.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-black text-gray-800 text-lg leading-tight">{selectedCharacter.name}</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                   {selectedCharacter.role}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="hidden sm:flex w-10 h-10 rounded-xl bg-gray-50 items-center justify-center text-gray-400 hover:text-[#ad46ff] hover:bg-purple-50 transition-all">📞</button>
              <button className="hidden sm:flex w-10 h-10 rounded-xl bg-gray-50 items-center justify-center text-gray-400 hover:text-[#ad46ff] hover:bg-purple-50 transition-all">📹</button>
              <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">⋮</button>
            </div>
          </div>

          {/* Messages Window Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide bg-gray-50/10"
          >
            {/* Centered Character Context Box */}
            <div className="flex justify-center mb-12">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-gray-100 text-center max-w-sm shadow-sm animate-in fade-in zoom-in duration-500">
                 <div className="w-14 h-14 bg-gray-50 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl shadow-inner border border-gray-100">📜</div>
                 <p className="text-[10px] font-black text-[#ad46ff] uppercase tracking-[0.2em] mb-3">Character Bio</p>
                 <p className="text-sm font-bold text-gray-500 leading-relaxed italic">"{selectedCharacter.description}"</p>
              </div>
            </div>

            {(chatHistories[selectedCharacter.id] || []).map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}>
                <div className="max-w-[85%] md:max-w-[65%]">
                  <div className={`p-4 md:p-5 px-6 md:px-7 rounded-[1.5rem] shadow-sm text-sm font-bold leading-relaxed transition-all ${
                    msg.role === 'user'
                      ? 'bg-[#ad46ff] text-white rounded-tr-none border-b-4 border-[#8439a3]'
                      : 'bg-white text-gray-800 rounded-tl-none border-2 border-gray-100 border-b-4'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`mt-2 text-[9px] font-black text-gray-300 uppercase tracking-widest px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 px-6 rounded-2xl rounded-tl-none border-2 border-gray-100 border-b-4 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-4 md:p-8 bg-white border-t-2 border-gray-100 shrink-0">
            <div className="max-w-4xl mx-auto flex items-center gap-3 md:gap-5">
              <button className="hidden sm:flex w-14 h-14 rounded-2xl bg-gray-50 items-center justify-center text-3xl hover:bg-gray-100 transition-all active:scale-90 border-2 border-transparent hover:border-gray-200">📎</button>
              <div className="flex-1 relative">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Message your tutor..."
                  className="w-full p-4 md:p-5 px-6 md:px-8 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] font-bold outline-none focus:border-[#ad46ff] focus:bg-white transition-all text-sm md:text-base shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-2 px-4 md:px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    inputValue.trim() 
                      ? 'text-[#ad46ff] hover:bg-purple-50' 
                      : 'text-gray-300 pointer-events-none'
                  }`}
                >
                  SEND
                </button>
              </div>
              <button className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl md:text-3xl hover:bg-gray-100 transition-all active:scale-90 border-2 border-transparent hover:border-gray-200">🎙️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatsView;
