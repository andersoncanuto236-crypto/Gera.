
import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { SecureStorage } from '../services/security';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = SecureStorage.getItem('history') || [];
    setHistory(saved);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white tracking-tighter">Histórico</h2>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2">Seus conteúdos gerados.</p>
      </div>

      {history.length === 0 ? (
        <div className="glass-panel p-10 rounded-[40px] text-center border-dashed border-white/10">
           <i className="fas fa-history text-slate-700 text-4xl mb-4"></i>
           <p className="text-slate-500 font-bold text-sm">Nada por aqui ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
           {history.map((item) => (
              <div key={item.id} className="glass-panel p-6 rounded-[32px] border-white/5 hover:border-brand-500/30 transition-all group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black uppercase bg-white/10 text-white px-2 py-1 rounded-md">{item.content.type}</span>
                       <span className="text-[9px] font-bold text-slate-500">{formatDate(item.timestamp)}</span>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(item.content.content)} className="text-slate-500 hover:text-white transition" title="Copiar"><i className="far fa-copy"></i></button>
                 </div>
                 <p className="text-sm font-medium text-slate-300 leading-relaxed line-clamp-3 mb-2">{item.content.content}</p>
                 <div className="flex items-center gap-2 text-[10px] text-brand-500 font-bold uppercase tracking-widest mt-4 opacity-50 group-hover:opacity-100 transition">
                   <i className="fas fa-bullseye"></i> {item.content.metaObjective}
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default History;
