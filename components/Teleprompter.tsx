
import React, { useState, useEffect, useRef } from 'react';

interface TeleprompterProps {
  text: string;
  onClose: () => void;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ text, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // 1 to 5
  const [fontSize, setFontSize] = useState(48);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current && isPlaying) {
        scrollRef.current.scrollTop += speed * 0.5;
        animationRef.current = requestAnimationFrame(scroll);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(scroll);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speed]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
      {/* Header controls */}
      <div className="p-4 flex items-center justify-between bg-zinc-900 border-b border-zinc-800 z-10">
        <button onClick={onClose} className="text-white bg-zinc-800 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-700">
          <i className="fas fa-times mr-2"></i> Fechar
        </button>
        
        <div className="flex gap-4 items-center">
           <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-xl">
             <i className="fas fa-text-height text-zinc-400 text-xs"></i>
             <input 
               type="range" 
               min="24" 
               max="80" 
               value={fontSize} 
               onChange={(e) => setFontSize(Number(e.target.value))}
               className="w-20 accent-brand-500 h-1"
             />
           </div>
           
           <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-xl">
             <i className="fas fa-tachometer-alt text-zinc-400 text-xs"></i>
             <input 
               type="range" 
               min="1" 
               max="10" 
               value={speed} 
               onChange={(e) => setSpeed(Number(e.target.value))}
               className="w-20 accent-brand-500 h-1"
             />
           </div>
        </div>
      </div>

      {/* Scrolling Area */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto relative no-scrollbar"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <div className="h-[40vh]"></div> {/* Spacer start */}
        <div className="px-6 md:px-20 max-w-4xl mx-auto text-white leading-snug font-bold text-center transition-all duration-300 select-none pb-20" style={{ fontSize: `${fontSize}px` }}>
          {text.split('\n').map((line, i) => (
            <p key={i} className="mb-8">{line}</p>
          ))}
        </div>
        <div className="h-[40vh]"></div> {/* Spacer end */}
      </div>

      {/* Overlay Play Button (if paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 top-16 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-brand-600/90 rounded-full flex items-center justify-center text-white shadow-2xl animate-pulse-subtle">
            <i className="fas fa-play text-2xl ml-1"></i>
          </div>
        </div>
      )}
      
      {/* Footer hint */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest bg-black/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
          Toque na tela para {isPlaying ? 'Pausar' : 'Gravar'}
        </p>
      </div>
    </div>
  );
};

export default Teleprompter;
