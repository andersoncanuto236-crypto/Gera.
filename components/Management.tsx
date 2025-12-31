
import React, { useState, useEffect } from 'react';
import { UserSettings, DashboardMetric, Goal, Note, HistoryItem } from '../types';
import { getManagementDiagnosis, suggestDashboardGoals, strategicResearch } from '../services/geminiService';

interface ManagementProps {
  settings: UserSettings;
}

const Management: React.FC<ManagementProps> = ({ settings }) => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingResearch, setLoadingResearch] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(false);

  useEffect(() => {
    setMetrics(JSON.parse(localStorage.getItem('gera_metrics') || '[]'));
    setGoals(JSON.parse(localStorage.getItem('gera_goals') || '[]'));
    setHistory(JSON.parse(localStorage.getItem('gera_history') || '[]'));
    setNotes(JSON.parse(localStorage.getItem('gera_notes') || '[]'));
  }, []);

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      const res = await getManagementDiagnosis(settings, metrics, goals, history, notes);
      setDiagnosis(res);
    } catch (e) {
      setDiagnosis("Erro ao realizar diagnóstico estratégico.");
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = async () => {
    if (!researchQuery.trim()) return;
    setLoadingResearch(true);
    try {
      const res = await strategicResearch(settings, researchQuery);
      setResearchResult(res);
    } catch (e) {
      setResearchResult("Erro na pesquisa estratégica.");
    } finally {
      setLoadingResearch(false);
    }
  };

  const handleSuggestGoals = async () => {
    setLoadingGoals(true);
    try {
      const suggested = await suggestDashboardGoals(settings);
      const newGoals: Goal[] = suggested.map(s => ({
        id: Math.random().toString(),
        label: s.label || 'Meta',
        target: s.target || 100,
        current: 0,
        type: s.type as any
      }));
      const updated = [...goals, ...newGoals];
      setGoals(updated);
      localStorage.setItem('gera_goals', JSON.stringify(updated));
    } catch (e) {
      alert("Erro ao sugerir metas.");
    } finally {
      setLoadingGoals(false);
    }
  };

  const buttonHoverClasses = "transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter">Ponto de Gestão<span className="text-brand-600">.</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Diagnóstico Sênior & Correção de Rota</p>
        </div>
        <button 
          onClick={runDiagnosis} 
          disabled={loading} 
          className={`bg-brand-600 text-white px-10 py-5 rounded-[32px] font-black shadow-xl shadow-brand-500/20 text-xs uppercase tracking-widest flex items-center gap-3 ${buttonHoverClasses}`}
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-chess-knight"></i>}
          Gerar Diagnóstico Estratégico
        </button>
      </div>

      {/* Strategic Research Bar */}
      <div className="glass-panel p-8 rounded-[40px] border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl"></div>
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
           <i className="fas fa-search-location"></i> Pesquisa Estratégica
        </h4>
        <div className="flex gap-4">
          <input 
            value={researchQuery} 
            onChange={e => setResearchQuery(e.target.value)}
            placeholder="Ex: Como lidar com a queda de alcance no meu nicho?"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          <button 
            onClick={handleResearch} 
            disabled={loadingResearch}
            className={`bg-white text-black px-8 rounded-2xl font-black text-xs uppercase tracking-widest ${buttonHoverClasses}`}
          >
            {loadingResearch ? <i className="fas fa-spinner fa-spin"></i> : 'Analisar'}
          </button>
        </div>
        {researchResult && (
          <div className="mt-6 p-8 bg-brand-500/5 border border-brand-500/10 rounded-3xl animate-fade-in">
             <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">{researchResult}</p>
             <button onClick={() => setResearchResult('')} className="mt-4 text-[9px] font-black uppercase text-slate-500 hover:text-white transition">Limpar Pesquisa</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {diagnosis && (
            <div className="bg-slate-900 border border-brand-500/20 p-10 rounded-[40px] shadow-2xl animate-fade-in">
              <h4 className="text-brand-500 font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                <i className="fas fa-microchip"></i> Análise do Mentor Estratégico
              </h4>
              <p className="text-slate-100 text-xl font-medium leading-relaxed whitespace-pre-wrap">{diagnosis}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-[40px] border-white/5 space-y-6">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gargalos do Perfil</h4>
               <div className="space-y-4">
                 <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500"><i className="fas fa-history"></i></div>
                   <div>
                     <p className="text-white font-black text-xs">{history.length}</p>
                     <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Execuções de Conteúdo</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500"><i className="fas fa-lightbulb"></i></div>
                   <div>
                     <p className="text-white font-black text-xs">{notes.length}</p>
                     <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Ideias Não Executadas</p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="glass-panel p-8 rounded-[40px] border-white/5 flex flex-col justify-center items-center text-center space-y-4">
               <div className="w-16 h-16 bg-brand-600/10 rounded-full flex items-center justify-center text-brand-500">
                  <i className="fas fa-compass text-2xl"></i>
               </div>
               <h4 className="text-white font-black text-lg">Decisão Inteligente</h4>
               <p className="text-slate-400 text-xs font-medium leading-relaxed">
                 O Ponto de Gestão não é sobre o que você postou ontem, mas sobre como o perfil se comporta como um todo para converter seguidores em lucro.
               </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-panel-light p-10 rounded-[40px] shadow-2xl border-white space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Metas Atuais</h3>
                <button 
                  onClick={handleSuggestGoals} 
                  disabled={loadingGoals}
                  className="text-brand-600 hover:text-brand-700 transition"
                >
                  {loadingGoals ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus"></i>}
                </button>
              </div>
              
              <div className="space-y-6">
                {goals.length === 0 ? (
                  <p className="text-slate-400 italic text-sm">Use o Ponto de Gestão para sugerir metas.</p>
                ) : goals.slice(0, 4).map(g => (
                  <div key={g.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{g.label}</span>
                      <span className="text-xs font-black text-slate-900">{Math.round((g.current/g.target)*100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-brand-600 h-full rounded-full" style={{ width: `${Math.min(100, (g.current/g.target)*100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-black/40 p-8 rounded-[40px] border border-white/5 backdrop-blur-md">
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="fas fa-eye text-brand-500"></i> Visão de Gestor
              </h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed italic">
                "Pare de postar para métricas de ego. O Ponto de Gestão analisa se sua autoridade está crescendo ou se você é apenas mais um no feed."
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Management;
