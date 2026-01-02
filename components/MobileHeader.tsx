import React from 'react';

interface MobileHeaderProps {
  score: number;
  onOpenSettings: () => void;
}

const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

const MobileHeader: React.FC<MobileHeaderProps> = ({ score, onOpenSettings }) => {
  return (
    <div className="md:hidden glass-panel border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="logo-shape-sm"><span className="text-white font-bold">G</span></div>
        <span className="font-black text-xl text-white">Gera.</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-slate-900/50 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500"></div>
          <span className="text-[10px] font-black text-white">{score}</span>
        </div>
        <button onClick={onOpenSettings} aria-label="Abrir Configurações" className={`w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 ${buttonHoverClasses}`}>
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
