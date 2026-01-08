
import React, { useState, useEffect } from 'react';
import { UserSettings, CalendarDay } from '../types';
import { canUseAI } from '../src/lib/plan';
import { generateCalendar } from '../services/geminiService';
import { SecureStorage, getSessionKey } from '../services/security';
import PaywallModal from './PaywallModal';
import ConnectAIModal from './ConnectAIModal';

interface CalendarGeneratorProps {
  settings: UserSettings;
  onAction?: () => void;
  onUpdatePlan: (plan?: 'PAID') => void;
}

const CalendarGenerator: React.FC<CalendarGeneratorProps> = ({ settings, onAction, onUpdatePlan }) => {
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<CalendarDay[]>([]);
  
  const [showPaywall, setShowPaywall] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const saved = SecureStorage.getItem('calendar') || [];
    setDays(saved);
  }, []);

  const saveDays = (newDays: CalendarDay[]) => {
    setDays(newDays);
    SecureStorage.setItem('calendar', newDays);
  };

  const executeGeneration = async () => {
    setLoading(true);
    try {
      const data = await generateCalendar(settings, plan, 'WEEK');
      const updated = [...data, ...days];
      saveDays(updated);
      if (onAction) onAction();
    } catch (e: any) {
      if (e.message === "MISSING_API_KEY") {
         setShowKeyInput(true);
      } else {
         alert("Erro ao planejar agenda.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!canUseAI(settings.plan)) {
      setShowPaywall(true);
      return;
    }
    if (!getSessionKey()) {
      setShowKeyInput(true);
      return;
    }
    await executeGeneration();
  };

  const handleUpgrade = () => {
    onUpdatePlan('PAID');
    setShowPaywall(false);
  };

  // Manual Add
  const addManualDay = () => {
    const newDay: CalendarDay = {
      id: Date.now().toString(),
      day: 'Novo',
      topic: '',
      brief: '',
      format: 'POST',
      status: 'pending'
    };
    saveDays([newDay, ...days]);
  };

  const updateDay = (id: string, field: keyof CalendarDay, value: string) => {
    const updated = days.map(d => d.id === id ? { ...d, [field]: value } : d);
    saveDays(updated);
  };

  const deleteDay = (id: string) => {
    if(confirm('Remover este item?')) {
        const updated = days.filter(d => d.id !== id);
        saveDays(updated);
    }
  };
  
  const toggleStatus = (id: string) => {
    const updated = days.map(d => d.id === id ? { ...d, status: (d.status === 'done' ? 'pending' : 'done') as 'pending' | 'done' } : d);
    saveDays(updated);
  };

  const inputClasses = "flex-1 bg-white border-2 border-black rounded-3xl p-5 outline-none font-bold text-black focus:ring-4 focus:ring-brand-500/10 shadow-sm placeholder-gray-400";

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-fade-in-up">
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        onUpgrade={handleUpgrade} 
        featureName="Calendário Automático"
      />
      
      <ConnectAIModal
        isOpen={showKeyInput}
        onClose={() => setShowKeyInput(false)}
        onConnected={() => { setShowKeyInput(false); executeGeneration(); }}
      />

      <div className="glass-panel p-10 rounded-[40px] shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
             <h2 className="text-3xl font-black text-white leading-none">Agenda Semanal<span className="text-brand-600">.</span></h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Mode 2: Calendar</p>
           </div>
           
           <button onClick={() => saveDays([])} className="text-red-400 text-[10px] font-black uppercase tracking-widest hover:text-red-300">Limpar Agenda</button>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <input value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="Foco da semana? (Ex: Autoridade, Vendas...)" className={inputClasses} />
          <button onClick={handleGenerate} disabled={loading} className="bg-brand-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl shadow-brand-500/30 hover:bg-brand-700 transition flex items-center justify-center gap-3 relative overflow-hidden group">
            {!canUseAI(settings.plan) && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><i className="fas fa-lock"></i></div>}
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-magic"></i> Gerar Semana</>}
          </button>
        </div>
        
        <div className="flex justify-center">
           <button onClick={addManualDay} className="text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/5">
              <i className="fas fa-plus"></i> Adicionar Manualmente
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {days.map((day) => (
          <div key={day.id} className={`glass-panel-light rounded-[40px] overflow-hidden border-white flex flex-col h-full hover:-translate-y-3 transition-all duration-500 shadow-2xl group relative ${day.status === 'done' ? 'opacity-60' : ''}`}>
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <input value={day.day} onChange={e => updateDay(day.id, 'day', e.target.value)} className="bg-transparent font-black text-gray-900 text-lg uppercase w-full outline-none" />
                <div className="flex gap-2">
                   <button onClick={() => toggleStatus(day.id)} className={`w-8 h-8 rounded-full flex items-center justify-center transition ${day.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 hover:bg-green-100'}`}><i className="fas fa-check"></i></button>
                   <button onClick={() => deleteDay(day.id)} className="w-8 h-8 text-gray-300 hover:text-red-500 transition"><i className="fas fa-trash"></i></button>
                </div>
             </div>
             <div className="p-8 flex-1 space-y-5">
                <div className="bg-brand-600 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-md w-fit">
                  {day.format || 'POST'}
                </div>
                <textarea value={day.topic} onChange={e => updateDay(day.id, 'topic', e.target.value)} className="w-full bg-transparent text-xl font-black text-gray-900 leading-tight outline-none resize-none h-20 placeholder-gray-300" placeholder="Tema" />
                <textarea value={day.brief} onChange={e => updateDay(day.id, 'brief', e.target.value)} className="w-full bg-transparent text-sm text-gray-500 leading-relaxed font-medium outline-none resize-none h-24 placeholder-gray-300" placeholder="Briefing" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGenerator;
