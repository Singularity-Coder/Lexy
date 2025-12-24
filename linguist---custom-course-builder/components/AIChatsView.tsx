
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AICharacter, ChatMessage } from '../types';
import { MYTHICAL_CHARACTERS } from '../constants'

interface AIChatsViewProps {
  currentLanguage: string;
}

const AIChatsView: React.FC<AIChatsViewProps> = ({ currentLanguage }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<AICharacter>(MYTHICAL_CHARACTERS[0]);
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
  }, [chatHistories, selectedCharacter]);

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

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Subtitle Header */}
      <div className="p-6 border-b-2 border-gray-100 bg-white z-10">
        <h1 className="text-3xl font-black text-gray-800">AI Chats</h1>
        <p className="text-gray-400 font-bold">
          Chat with Gods, Mythical creatures and other historical figures of <span className="text-[#1cb0f6]">{currentLanguage}</span> language
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Character List */}
        <div className="w-80 border-r-2 border-gray-100 flex flex-col bg-gray-50/30 overflow-y-auto">
          {MYTHICAL_CHARACTERS.map(char => {
            const history = chatHistories[char.id] || [];
            const lastMsg = history[history.length - 1];
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                className={`flex items-center gap-4 p-4 transition-all border-b border-gray-100 ${
                  selectedCharacter.id === char.id ? 'bg-[#ddf4ff]' : 'hover:bg-white'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm border-2 border-white overflow-hidden">
                    <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-black text-gray-800 text-sm truncate">{char.name}</h3>
                    {lastMsg && <span className="text-[10px] text-gray-400 font-bold">{lastMsg.timestamp}</span>}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 truncate mb-1">{char.role}</p>
                  {lastMsg && <p className="text-xs text-gray-500 truncate leading-tight italic">"{lastMsg.text}"</p>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Pane: Conversation */}
        <div className="flex-1 flex flex-col relative bg-gray-50/50">
          {/* Active Character Header */}
          <div className="p-4 bg-white border-b-2 border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
                <img src={selectedCharacter.avatar} alt={selectedCharacter.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-black text-gray-800 text-sm">{selectedCharacter.name}</h2>
                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Online</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="text-gray-300 hover:text-blue-500 transition-colors">📞</button>
              <button className="text-gray-300 hover:text-blue-500 transition-colors">📹</button>
              <button className="text-gray-300 hover:text-gray-500 transition-colors">⋮</button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
          >
            {/* Context Info */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-gray-100 text-center max-w-sm shadow-sm">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Character Bio</p>
                 <p className="text-xs font-bold text-gray-600 leading-relaxed">{selectedCharacter.description}</p>
              </div>
            </div>

            {(chatHistories[selectedCharacter.id] || []).map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}>
                <div className={`max-w-[70%] group relative`}>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm font-bold leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1cb0f6] text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none border-2 border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`mt-1 text-[9px] font-black text-gray-300 uppercase tracking-tighter ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border-2 border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t-2 border-gray-100">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <button className="text-2xl hover:scale-110 transition-transform">📎</button>
              <div className="flex-1 relative">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Message your tutor..."
                  className="w-full p-4 pr-12 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold outline-none focus:border-[#1cb0f6] transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1cb0f6] disabled:opacity-30 hover:scale-110 transition-all font-black"
                >
                  SEND
                </button>
              </div>
              <button className="text-2xl hover:scale-110 transition-transform">🎙️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatsView;
