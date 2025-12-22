
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Exercise } from '../types';

interface AIChatProps {
  currentExercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ currentExercise, isOpen, onClose }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The student is currently working on this exercise: "${currentExercise.question}". The correct answer is "${currentExercise.answer}". The student asks: "${userMsg}". Provide a helpful, encouraging hint or explanation without giving away the full answer immediately. Keep it short and friendly like a language teacher.`,
      });

      setMessages(prev => [...prev, {role: 'model', text: response.text || "I'm having a bit of trouble connecting. Try again!"}]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-24 w-80 h-96 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl flex flex-col z-[60] overflow-hidden animate-in slide-in-from-right duration-300">
      <div className="bg-[#1cb0f6] p-4 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🤖</span>
          <span className="font-black">AI Tutor</span>
        </div>
        <button onClick={onClose} className="hover:opacity-70 font-bold">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none">
          Hi! Stuck on <b>"{currentExercise.question}"</b>? Ask me anything about it!
        </div>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${
              m.role === 'user' 
                ? 'bg-[#1cb0f6] text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-gray-400 animate-pulse italic">Thinking...</div>}
      </div>

      <div className="p-3 border-t flex space-x-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for a hint..."
          className="flex-1 bg-gray-50 border p-2 rounded-xl outline-none focus:border-[#1cb0f6]"
        />
        <button onClick={handleSend} className="bg-[#1cb0f6] text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
          →
        </button>
      </div>
    </div>
  );
};

export default AIChat;
