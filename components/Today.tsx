
import React, { useState, useEffect } from 'react';
import { UserSettings, ViewState } from '../types';
import { suggestTodayAction } from '../services/geminiService';

interface TodayProps {
  settings: UserSettings;
  onNavigate: (v: ViewState) => void;
}

const Today: React.FC<TodayProps> = ({ settings, onNavigate }) => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    suggestTodayAction(settings).then(res => {
      setSuggestion(res);
      setLoading(false);
    });
  }, [settings]);

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-10 animate-fade-in">
      <div className="text-center space-y-3">
        <p className="text-brand-500 font-black uppercase tracking-[0.4em] text-[10px]">Foco do Dia</p>
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">O que postar hoje?</h2>
      </div>

      <div className="glass-panel p-12 rounded-[48px] shadow-2xl relative overflow-hidden group border-white/10">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-brand-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <i className="fas fa-circle-notch fa-spin text-4xl text-brand-500"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Consultando Estratégia</span>
          </div>
        ) : (
          <div className="space-y-10 relative z-10">
            <div className="space-y-6">
              <span className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">Sugestão da IA</span>
              <p className="text-3xl font-bold text-white leading-snug italic opacity-90">"{suggestion}"</p>
            </div>

            <div className="pt-6">
              <button onClick={() => onNavigate('create')} className="w-full py-6 bg-brand-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
                <i className="fas fa-magic"></i> Criar Conteúdo Agora
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          Mantenha a consistência. Gere valor, não ruído.
        </p>
      </div>
    </div>
  );
};

export default Today;
