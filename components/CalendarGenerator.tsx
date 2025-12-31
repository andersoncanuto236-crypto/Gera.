
import React, { useState } from 'react';
import { UserSettings, CalendarDay } from '../types';
import { generateCalendar } from '../services/geminiService';

interface CalendarGeneratorProps {
  settings: UserSettings;
  onAction?: () => void;
}

const CalendarGenerator: React.FC<CalendarGeneratorProps> = ({ settings, onAction }) => {
  const [plan, setPlan] = useState('');
  const [duration, setDuration] = useState<'WEEK' | 'MONTH'>('WEEK');
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateCalendar(settings, plan, duration);
      setDays(data);
      if (onAction) onAction();
    } catch (e) {
      alert("Erro ao planejar.");
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (id: string, field: keyof CalendarDay, value: string) => {
    setDays(days.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const exportToGoogle = (day: CalendarDay) => {
    const title = encodeURIComponent(`[GERA] Post: ${day.topic}`);
    const details = encodeURIComponent(`Briefing: ${day.brief}\nTipo: ${day.type}`);
    const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(gUrl, '_blank');
  };

  const inputClasses = "flex-1 bg-white border-2 border-black rounded-3xl p-5 outline-none font-bold text-black focus:ring-4 focus:ring-brand-500/10 shadow-sm placeholder-gray-400";
  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-fade-in-up">
      <div className="glass-panel p-10 rounded-[40px] shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <h2 className="text-3xl font-black text-white leading-none">Agenda Estratégica<span className="text-brand-600">.</span></h2>
           <div className="bg-white/5 p-1.5 rounded-2xl flex border border-white/10 backdrop-blur-sm">
             <button onClick={() => setDuration('WEEK')} className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${duration === 'WEEK' ? 'bg-brand-600 shadow-xl text-white' : 'text-slate-400 hover:text-white'}`}>Semana</button>
             <button onClick={() => setDuration('MONTH')} className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${duration === 'MONTH' ? 'bg-brand-600 shadow-xl text-white' : 'text-slate-400 hover:text-white'}`}>Mês</button>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <input value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="Foco do período? (Lançamento, Branding...)" className={inputClasses} />
          <button onClick={handleGenerate} disabled={loading} className={`bg-brand-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl shadow-brand-500/30 hover:bg-brand-700 transition flex items-center justify-center gap-3 ${buttonHoverClasses}`}>
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-magic"></i> Gerar Planejamento</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {days.map((day) => (
          <div key={day.id} className="glass-panel-light rounded-[40px] overflow-hidden border-white flex flex-col h-full hover:-translate-y-3 transition-all duration-500 shadow-2xl group">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <input 
                  value={day.day} 
                  onChange={e => updateDay(day.id, 'day', e.target.value)}
                  className="bg-transparent font-black text-gray-900 text-lg uppercase w-full outline-none"
                />
                <button onClick={() => exportToGoogle(day)} className={`w-8 h-8 text-brand-600 hover:scale-110 transition ${buttonHoverClasses}`} title="Exportar para Google Agenda">
                  <i className="fab fa-google"></i>
                </button>
             </div>
             
             <div className="p-8 flex-1 space-y-5">
                <select 
                  value={day.type} 
                  onChange={e => updateDay(day.id, 'type', e.target.value as any)}
                  className="bg-brand-600 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-md outline-none"
                >
                  <option value="POST">POST</option>
                  <option value="REELS">REELS</option>
                  <option value="STORY">STORY</option>
                </select>
                
                <textarea 
                  value={day.topic} 
                  onChange={e => updateDay(day.id, 'topic', e.target.value)}
                  className="w-full bg-transparent text-xl font-black text-gray-900 leading-tight outline-none resize-none h-20"
                />
                <textarea 
                  value={day.brief} 
                  onChange={e => updateDay(day.id, 'brief', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-500 leading-relaxed font-medium outline-none resize-none h-24"
                />
             </div>
             
             <div className="p-4 bg-gray-900 flex justify-between items-center group-hover:bg-brand-600 transition-colors">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Manual Mode</span>
                <i className="fas fa-edit text-white/50"></i>
             </div>
          </div>
        ))}
        
        {/* Adicionar Dia Manual */}
        <button 
          onClick={() => setDays([...days, { id: Math.random().toString(), day: 'Novo Dia', topic: 'Ideia de Post', type: 'POST', brief: 'Descrição do post...', bestTime: '18:00' }])}
          className={`glass-panel rounded-[40px] border-dashed border-white/20 flex flex-col items-center justify-center p-10 min-h-[400px] text-slate-500 hover:text-white transition-all ${buttonHoverClasses}`}
        >
          <i className="fas fa-plus-circle text-4xl mb-4"></i>
          <span className="font-black uppercase tracking-widest text-xs">Adicionar Manualmente</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarGenerator;
