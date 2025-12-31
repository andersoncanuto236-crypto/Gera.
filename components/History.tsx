
import React, { useState, useEffect } from 'react';
import { HistoryItem, UserSettings } from '../types';
import { repurposeContent } from '../services/geminiService';

interface HistoryProps {
  settings?: UserSettings;
}

const History: React.FC<HistoryProps> = ({ settings }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  
  // Repurposing State
  const [repurposeId, setRepurposeId] = useState<string | null>(null);
  const [repurposeFormat, setRepurposeFormat] = useState('E-mail Marketing');
  const [repurposedText, setRepurposedText] = useState('');
  const [loadingRepurpose, setLoadingRepurpose] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gera_history') || '[]');
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    if (window.confirm("Limpar tudo?")) {
      setHistory([]);
      localStorage.removeItem('gera_history');
    }
  };

  const handleRepurpose = async (content: string) => {
    if (!settings) return;
    setLoadingRepurpose(true);
    setRepurposedText('');
    try {
      const res = await repurposeContent(content, repurposeFormat, settings);
      setRepurposedText(res);
    } catch (e) {
      setRepurposedText("Erro ao reciclar.");
    } finally {
      setLoadingRepurpose(false);
    }
  };

  const closeRepurpose = () => {
    setRepurposeId(null);
    setRepurposedText('');
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Histórico de Inteligência<span className="text-brand-600">.</span></h2>
          <p className="text-gray-500 font-medium">Rastreie cada sugestão e post gerado.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-gray-100 p-1 rounded-xl flex border border-gray-200">
             <button onClick={() => setViewMode('cards')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${viewMode === 'cards' ? 'bg-white shadow text-brand-600' : 'text-gray-500'}`}><i className="fas fa-th-large"></i></button>
             <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${viewMode === 'table' ? 'bg-white shadow text-brand-600' : 'text-gray-500'}`}><i className="fas fa-table"></i></button>
           </div>
           <button onClick={clearHistory} className="bg-red-50 text-red-600 px-6 py-2 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-100 transition">Limpar Histórico</button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-[40px]">
           <i className="fas fa-folder-open text-gray-200 text-6xl mb-4"></i>
           <p className="text-gray-400 font-bold">Nenhum rastro de inteligência encontrado.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-panel rounded-[40px] overflow-hidden shadow-2xl border-white/50">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                 <tr>
                    <th className="p-6 font-black text-[10px] uppercase text-gray-400 tracking-widest">Data / Hora</th>
                    <th className="p-6 font-black text-[10px] uppercase text-gray-400 tracking-widest">Tema</th>
                    <th className="p-6 font-black text-[10px] uppercase text-gray-400 tracking-widest text-center">Formato</th>
                    <th className="p-6 font-black text-[10px] uppercase text-gray-400 tracking-widest">Gancho Principal</th>
                    <th className="p-6 font-black text-[10px] uppercase text-gray-400 tracking-widest">Ação</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {history.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-50/30 transition-colors group">
                       <td className="p-6 text-xs font-bold text-gray-400">{formatDate(item.timestamp)}</td>
                       <td className="p-6 text-sm font-black text-gray-900">{item.topic}</td>
                       <td className="p-6 text-center">
                          <span className="bg-white px-3 py-1 rounded-full border border-gray-100 text-[10px] font-bold text-gray-600 shadow-sm">{item.content.type}</span>
                       </td>
                       <td className="p-6 text-xs text-gray-500 italic max-w-xs truncate">"{item.content.hook}"</td>
                       <td className="p-6 flex gap-2">
                          <button onClick={() => navigator.clipboard.writeText(item.content.caption)} className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-600 hover:text-white transition shadow-sm" title="Copiar"><i className="far fa-copy"></i></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {history.map((item) => (
              <div key={item.id} className="glass-panel p-8 rounded-[40px] shadow-xl hover:shadow-2xl transition duration-500 border-white/50 relative">
                 <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-gray-300 uppercase">{formatDate(item.timestamp)}</span>
                    <span className="bg-brand-600 text-white px-3 py-0.5 rounded-full text-[9px] font-bold">{item.content.type}</span>
                 </div>
                 <h4 className="font-black text-gray-900 text-lg mb-2 leading-tight">{item.topic}</h4>
                 <p className="text-xs text-gray-500 italic mb-6">"{item.content.hook}"</p>
                 
                 {repurposeId === item.id ? (
                   <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 animate-fade-in absolute inset-0 z-10 overflow-y-auto">
                     <div className="flex justify-between items-center mb-4">
                        <h5 className="font-black text-[10px] uppercase text-brand-600 tracking-widest">Reciclagem de Conteúdo</h5>
                        <button onClick={closeRepurpose} className="text-slate-400 hover:text-red-500"><i className="fas fa-times"></i></button>
                     </div>
                     {!repurposedText ? (
                       <div className="space-y-3">
                         <select value={repurposeFormat} onChange={e => setRepurposeFormat(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-700 outline-none">
                           <option>E-mail Marketing</option>
                           <option>Roteiro de Reels</option>
                           <option>Post LinkedIn</option>
                           <option>Thread Twitter</option>
                         </select>
                         <button onClick={() => handleRepurpose(item.content.caption)} disabled={loadingRepurpose} className={`w-full py-3 bg-brand-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest ${buttonHoverClasses}`}>
                           {loadingRepurpose ? <i className="fas fa-spinner fa-spin"></i> : 'Gerar Novo Formato'}
                         </button>
                       </div>
                     ) : (
                       <div className="space-y-3">
                         <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-600 h-40 overflow-y-auto whitespace-pre-line">
                           {repurposedText}
                         </div>
                         <button onClick={() => navigator.clipboard.writeText(repurposedText)} className={`w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest ${buttonHoverClasses}`}>
                           Copiar Resultado
                         </button>
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="flex gap-2">
                     <button onClick={() => navigator.clipboard.writeText(item.content.caption)} className="flex-1 py-3 bg-brand-50 text-brand-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-100 transition"><i className="far fa-copy mr-1"></i> Copiar</button>
                     <button onClick={() => setRepurposeId(item.id)} className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition"><i className="fas fa-recycle mr-1"></i> Transformar</button>
                   </div>
                 )}
              </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default History;
