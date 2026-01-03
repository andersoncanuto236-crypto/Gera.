
import React, { useState, useEffect } from 'react';
import { UserSettings, CalendarDay, ViewState } from '../types';
import { suggestTodayAction } from '../services/geminiService';
import { SecureStorage } from '../services/security';

interface TodayProps {
  settings: UserSettings;
  onNavigate: (v: ViewState) => void;
}

const Today: React.FC<TodayProps> = ({ settings, onNavigate }) => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheduledPost, setScheduledPost] = useState<CalendarDay | null>(null);

  useEffect(() => {
    setLoading(true);
    // Busca do armazenamento seguro
    const calendar: CalendarDay[] = SecureStorage.getItem('calendar') || [];
    const todayStr = new Date().toISOString().split('T')[0];
    const found = calendar.find(c => c.date === todayStr && c.status === 'pending');
    
    if (found) {
      setScheduledPost(found);
      setLoading(false);
    } else {
      suggestTodayAction(settings).then(res => {
        setSuggestion(res);
        setLoading(false);
      });
    }
  }, [settings]);

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-10 animate-fade-in">
      <div className="text-center space-y-3">
        <p className="text-brand-500 font-black uppercase tracking-[0.4em] text-[10px]">Pilar 01: Ação Pragmática</p>
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">O que postar hoje?</h2>
      </div>

      <div className="glass-panel p-12 rounded-[48px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-brand-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <i className="fas fa-circle-notch fa-spin text-4xl text-brand-500"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Consultando Estratégia</span>
          </div>
        ) : (
          <div className="space-y-10 relative z-10">
            {scheduledPost ? (
              <div className="space-y-6">
                <span className="bg-brand-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20">Agendado p/ Agora</span>
                <h3 className="text-4xl font-black text-white leading-tight">{scheduledPost.topic}</h3>
                <p className="text-slate-300 text-xl font-medium leading-relaxed opacity-80">{scheduledPost.brief}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <span className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">Comando do Dia</span>
                <p className="text-3xl font-bold text-white leading-snug italic opacity-90">"{suggestion}"</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button onClick={() => onNavigate('create')} className="btn-primary flex-1 py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl">
                <i className="fas fa-magic mr-2"></i> Criar Agora
              </button>
              <button onClick={() => onNavigate('calendar')} className="btn-secondary flex-1 py-6 rounded-3xl font-black uppercase tracking-widest text-xs text-white hover:bg-white/10 transition-all duration-300">
                Ver Agenda
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button onClick={() => onNavigate('register')} className="glass-panel p-8 rounded-[32px] hover:bg-white/5 transition-all duration-300 text-left group">
          <i className="fas fa-check-circle text-brand-500 mb-4 block text-2xl group-hover:scale-110 transition-transform"></i>
          <p className="text-white font-black text-[11px] uppercase tracking-widest">Já postei</p>
          <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-tight">Registro Manual</p>
        </button>
        <button onClick={() => onNavigate('decision')} className="glass-panel p-8 rounded-[32px] hover:bg-white/5 transition-all duration-300 text-left group">
          <i className="fas fa-chess text-brand-500 mb-4 block text-2xl group-hover:scale-110 transition-transform"></i>
          <p className="text-white font-black text-[11px] uppercase tracking-widest">Decidir Ciclo</p>
          <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-tight">Ajustar ou Parar</p>
        </button>
      </div>
    </div>
  );
};

export default Today;
