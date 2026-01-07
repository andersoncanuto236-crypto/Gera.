
import React, { useState, useEffect } from 'react';
import { CalendarDay, UserSettings } from '../types';
import { SecureStorage } from '../services/security';

const Register: React.FC<{ settings: UserSettings }> = ({ settings }) => {
  const [items, setItems] = useState<CalendarDay[]>([]);

  useEffect(() => {
    // Carregamento via SecureStorage para compatibilidade com dados criptografados
    const calendar: CalendarDay[] = SecureStorage.getItem('calendar') || [];
    setItems(calendar);
  }, []);

  const saveItems = (updated: CalendarDay[]) => {
    setItems(updated);
    SecureStorage.setItem('calendar', updated);
  };

  const updateResult = (id: string, notes: string) => {
    // Explicitly typing updated as CalendarDay[] to avoid inference issues with the spread operator
    const updated: CalendarDay[] = items.map(i => i.id === id ? { ...i, resultNotes: notes, status: 'done' as const } : i);
    saveItems(updated);
  };

  const toggleStatus = (id: string) => {
    // Casting the result of the ternary to the expected literal union type to prevent string inference
    const updated: CalendarDay[] = items.map(i => i.id === id ? { ...i, status: (i.status === 'done' ? 'pending' : 'done') as 'pending' | 'done' } : i);
    saveItems(updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter">Registro de Atividade</h2>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2">Pilar 04: Memória Segura</p>
      </div>

      <div className="space-y-6">
        {items.length === 0 ? (
          <p className="text-center text-slate-500 py-20 font-bold uppercase text-xs tracking-widest">Nada agendado para registrar.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className={`glass-panel p-8 rounded-[32px] flex flex-col md:flex-row gap-8 items-start transition-opacity ${item.status === 'done' ? 'opacity-50' : ''}`}>
               <div className="flex-1 space-y-2">
                 <div className="flex items-center gap-3">
                   <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest">{item.type}</span>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.date}</span>
                 </div>
                 <h4 className="text-xl font-black text-white">{item.topic}</h4>
                 <p className="text-xs text-slate-500">{item.brief}</p>
               </div>
               
               <div className="w-full md:w-80 space-y-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition ${item.status === 'done' ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-500 border border-white/5'}`}
                    >
                      {item.status === 'done' ? 'Postado' : 'Não Postado'}
                    </button>
                  </div>
                  <input 
                    placeholder="Resultado simples? (Ex: 10 cliques)" 
                    value={item.resultNotes || ''}
                    onChange={e => updateResult(item.id, e.target.value)}
                    className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-500 transition"
                  />
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Register;
