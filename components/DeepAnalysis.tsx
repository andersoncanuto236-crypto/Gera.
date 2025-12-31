
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { getDeepAudit } from '../services/geminiService';

interface DeepAnalysisProps {
  settings: UserSettings;
}

const DeepAnalysis: React.FC<DeepAnalysisProps> = ({ settings }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const history = JSON.parse(localStorage.getItem('gera_history') || '[]').map((h: any) => h.topic);
      const res = await getDeepAudit(settings, history);
      setAnalysis(res);
    } catch (e) {
      setAnalysis("Erro ao processar auditoria.");
    } finally {
      setLoading(false);
    }
  };

  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-2">Análise Profunda 360°</h3>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">A IA cruzará seu perfil, histórico e tendências.</p>
        
        {!analysis ? (
          <button onClick={runAnalysis} disabled={loading} className={`bg-white text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl ${buttonHoverClasses}`}>
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-search-plus mr-2"></i>}
            Iniciar Auditoria Completa
          </button>
        ) : (
          <div className="animate-fade-in space-y-6">
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
              <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">{analysis}</p>
            </div>
            <button onClick={() => setAnalysis('')} className="text-brand-500 font-black text-[10px] uppercase tracking-widest hover:underline">Novo Diagnóstico</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepAnalysis;
