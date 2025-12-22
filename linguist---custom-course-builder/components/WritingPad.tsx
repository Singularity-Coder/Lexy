
import React, { useRef, useState, useEffect } from 'react';
import { ALPHABET } from '../constants';

const WritingPad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(ALPHABET[0]);
  const [showGuide, setShowGuide] = useState(true);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        setupContext();
        drawGuide();
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [selectedLetter, showGuide]);

  const setupContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#4b4b4b';
      ctx.lineWidth = 14;
    }
  };

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (showGuide) {
      ctx.save();
      ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.75}px Nunito`;
      ctx.fillStyle = '#f3f4f6';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedLetter, canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
  };

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGuide();
      setupContext(); // re-apply stroke styles
    }
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(selectedLetter);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-gray-800">Writing Studio</h1>
        <p className="text-gray-500 font-bold">Pick a letter and practice your handwriting!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 duo-card p-6 h-[520px] flex flex-col space-y-4">
          <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs">Pick a Letter</h3>
          <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`p-3 rounded-xl font-black text-xl transition-all ${
                  selectedLetter === letter
                    ? 'bg-[#1cb0f6] text-white shadow-[0_4px_0_#1899d6]'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="relative duo-card bg-white w-full h-[520px] overflow-hidden cursor-crosshair shadow-inner border-4 border-gray-100 touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              <button
                onClick={clearCanvas}
                className="bg-white border-2 border-gray-200 p-4 px-8 rounded-2xl font-black text-gray-500 hover:bg-gray-100 shadow-[0_4px_0_#e5e5e5] active:translate-y-1 active:shadow-none transition-all"
              >
                CLEAR
              </button>
              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`p-4 px-8 rounded-2xl font-black shadow-[0_4px_0_#c4b5fd] active:translate-y-1 active:shadow-none transition-all ${
                  showGuide ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
                }`}
              >
                GUIDE: {showGuide ? 'ON' : 'OFF'}
              </button>
            </div>
            
            <button
              onClick={speak}
              className="bg-[#1cb0f6] text-white p-4 px-10 rounded-2xl font-black shadow-[0_4px_0_#1899d6] hover:bg-[#1899d6] active:translate-y-1 active:shadow-none flex items-center gap-3 transition-all"
            >
              <span className="text-xl">🔊</span>
              <span>LISTEN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingPad;
