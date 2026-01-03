
import React, { useState } from 'react';
import { UserSettings, CalendarDay } from '../types';
import { getDecisionMatrix } from '../services/geminiService';
import { SecureStorage } from '../services/security';

const Decision: React.FC<{ settings: UserSettings }> = ({ settings }) => {
  const [matrix, setMatrix] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDecide = async () => {
    setLoading(true);
    // Uso do SecureStorage para ler registros criptografados
    const records: CalendarDay[] = SecureStorage.getItem('calendar') || [];
    try {
      const res = await getDecisionMatrix(settings, records);
      setMatrix(res);
    } catch (e) {
      setMatrix("Erro ao processar estratégia de ciclo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter">Matriz de Decisão</h2>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2">Pilar 05: Ciclos</p>
      </div>

      {!matrix ? (
        <div className="glass-panel p-12 rounded-[40px] text-center space-y-6 border-dashed border-white/10">
           <i className="fas fa-chess-knight text-6xl text-slate-700"></i>
           <div className="space-y-2">
             <h3 className="text-2xl font-black text-white">Fechar Ciclo de Estratégia</h3>
             <p className="text-slate-500 text-sm max-w-sm mx-auto">A IA analisará seus registros criptografados para decidir o futuro do conteúdo.</p>
           </div>
           <button 
             onClick={handleDecide}
             disabled={loading}
             className="bg-brand-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-500/20 disabled:opacity-50"
           >
             {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Rodar Matriz de Decisão'}
           </button>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-slate-900 border border-brand-500/20 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black uppercase text-brand-500 tracking-[0.2em]">Diagnóstico de Ciclo</span>
                <button onClick={() => setMatrix('')} className="text-slate-500 hover:text-white transition"><i className="fas fa-redo"></i></button>
             </div>
             <div className="text-slate-200 text-lg leading-relaxed space-y-6 whitespace-pre-wrap">
               {matrix}
             </div>
          </div>
          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Decida com base no lucro, não no ego.</p>
        </div>
      )}
    </div>
  );
};

export default Decision;
