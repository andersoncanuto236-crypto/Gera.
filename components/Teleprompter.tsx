
import React, { useState, useEffect, useRef } from 'react';

interface TeleprompterProps {
  text: string;
  onClose: () => void;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ text, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); 
  const [fontSize, setFontSize] = useState(42);
  const [isMirrored, setIsMirrored] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current && isPlaying) {
        scrollRef.current.scrollTop += speed * 0.4;
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
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
      {/* Header controls - High contrast */}
      <div className="p-4 flex items-center justify-between bg-zinc-950 border-b border-white/10 z-10">
        <button 
          onClick={onClose} 
          className="text-white bg-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-times"></i> Encerrar
        </button>
        
        <div className="flex gap-4 items-center">
           <button 
             onClick={() => setIsMirrored(!isMirrored)}
             className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${isMirrored ? 'bg-brand-600 text-white' : 'bg-white/5 text-zinc-400'}`}
             title="Inverter Texto (Espelho)"
           >
             <i className="fas fa-columns"></i>
           </button>

           <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
             <div className="flex items-center gap-2">
               <i className="fas fa-text-height text-zinc-500 text-xs"></i>
               <input 
                 type="range" 
                 min="24" 
                 max="100" 
                 value={fontSize} 
                 onChange={(e) => setFontSize(Number(e.target.value))}
                 className="w-24 accent-brand-500 h-1 cursor-pointer"
               />
             </div>
             
             <div className="flex items-center gap-2 border-l border-white/10 pl-4">
               <i className="fas fa-tachometer-alt text-zinc-500 text-xs"></i>
               <input 
                 type="range" 
                 min="1" 
                 max="15" 
                 value={speed} 
                 onChange={(e) => setSpeed(Number(e.target.value))}
                 className="w-24 accent-brand-500 h-1 cursor-pointer"
               />
             </div>
           </div>
        </div>
      </div>

      {/* Scrolling Area */}
      <div 
        ref={scrollRef} 
        className={`flex-1 overflow-y-auto relative no-scrollbar cursor-pointer ${isMirrored ? 'scale-x-[-1]' : ''}`}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <div className="h-[45vh]"></div> {/* Padding inicial p/ leitura no centro */}
        
        {/* Eye Line Guide */}
        <div className="fixed top-1/2 left-0 right-0 h-24 bg-brand-500/10 border-y border-brand-500/20 pointer-events-none -translate-y-1/2 z-0"></div>

        <div 
          className="px-6 md:px-32 max-w-6xl mx-auto text-white leading-tight font-black text-center transition-all duration-300 select-none pb-[50vh] relative z-10" 
          style={{ fontSize: `${fontSize}px` }}
        >
          {text.split('\n').map((line, i) => (
            <p key={i} className="mb-12 drop-shadow-2xl">{line}</p>
          ))}
        </div>
      </div>

      {/* Floating Bottom State */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20 pointer-events-none">
         {!isPlaying && (
           <div className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest animate-bounce shadow-2xl shadow-white/20">
             Toque para Iniciar
           </div>
         )}
         {isPlaying && (
           <div className="flex items-center gap-3 bg-red-600 px-6 py-3 rounded-full animate-pulse shadow-2xl">
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <span className="text-white font-black text-[10px] uppercase tracking-widest">Gravando</span>
           </div>
         )}
      </div>

      {/* Overlay Play Button (Visual Feedback) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm">
          <div className="w-28 h-28 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-3xl">
            <i className="fas fa-play text-3xl ml-2"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teleprompter;
