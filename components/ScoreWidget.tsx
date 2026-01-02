import React from 'react';

interface ScoreWidgetProps {
  score: number;
}

const ScoreWidget: React.FC<ScoreWidgetProps> = ({ score }) => (
  <div className="mb-8 px-6">
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[24px] p-5 border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-brand-500/20 transition"></div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Autoridade Digital</span>
        <span className="text-xl font-black text-white">{score}<span className="text-xs text-slate-500">/100</span></span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
        <div className="bg-brand-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]" style={{ width: `${score}%` }}></div>
      </div>
      <p className="text-[8px] text-slate-500 mt-2 font-bold uppercase tracking-widest text-right">Gera Score</p>
    </div>
  </div>
);

export default ScoreWidget;
