
import React, { useState, useEffect } from 'react';
import { UserSettings, DashboardMetric, Goal, Note, HistoryItem } from '../types';
import { getManagementDiagnosis, suggestDashboardGoals, strategicResearch, getDeepAudit } from '../services/geminiService';

interface ManagementProps {
  settings: UserSettings;
}

const Management: React.FC<ManagementProps> = ({ settings }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'audit'>('strategy');
  
  // Data
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Strategy State
  const [diagnosis, setDiagnosis] = useState('');
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingResearch, setLoadingResearch] = useState(false);
  
  // Audit State
  const [auditResult, setAuditResult] = useState('');
  const [loadingAudit, setLoadingAudit] = useState(false);

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
  
  const runDeepAudit = async () => {
    setLoadingAudit(true);
    try {
      const historyTopics = history.map((h: any) => h.topic);
      const res = await getDeepAudit(settings, historyTopics);
      setAuditResult(res);
    } catch (e) {
      setAuditResult("Erro ao processar auditoria.");
    } finally {
      setLoadingAudit(false);
    }
  };

  const buttonHoverClasses = "transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Estratégia & Gestão<span className="text-brand-600">.</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Inteligência de Nível Executivo</p>
        </div>
        
        <div className="bg-slate-900/50 p-1.5 rounded-2xl flex border border-white/10 backdrop-blur-sm">
           <button 
             onClick={() => setActiveTab('strategy')} 
             className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'strategy' ? 'bg-brand-600 shadow-xl text-white' : 'text-slate-400 hover:text-white'}`}
           >
             Diagnóstico
           </button>
           <button 
             onClick={() => setActiveTab('audit')} 
             className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'audit' ? 'bg-brand-600 shadow-xl text-white' : 'text-slate-400 hover:text-white'}`}
           >
             Auditoria 360°
           </button>
        </div>
      </div>

      {activeTab === 'strategy' ? (
        <div className="space-y-8 animate-fade-in">
          {/* Strategic Research Bar */}
          <div className="glass-panel p-8 rounded-[40px] border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl"></div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <i className="fas fa-search-location"></i> Pesquisa de Mercado
            </h4>
            <div className="flex gap-4">
              <input 
                value={researchQuery} 
                onChange={e => setResearchQuery(e.target.value)}
                placeholder="Ex: Tendências para marketing imobiliário em 2024..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-4 focus:ring-brand-500/10"
              />
              <button 
                onClick={handleResearch} 
                disabled={loadingResearch}
                className={`bg-white text-black px-8 rounded-2xl font-black text-xs uppercase tracking-widest ${buttonHoverClasses}`}
              >
                {loadingResearch ? <i className="fas fa-spinner fa-spin"></i> : 'Pesquisar'}
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
              {!diagnosis ? (
                <div className="glass-panel border-dashed border-white/10 p-12 rounded-[40px] text-center flex flex-col items-center justify-center min-h-[300px]">
                   <i className="fas fa-chess-knight text-slate-600 text-5xl mb-6"></i>
                   <h3 className="text-2xl font-black text-white mb-2">Ponto de Gestão</h3>
                   <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">A IA analisará suas metas, histórico de posts e notas para criar um plano de correção estratégico.</p>
                   <button 
                      onClick={runDiagnosis} 
                      disabled={loading} 
                      className={`bg-brand-600 text-white px-10 py-5 rounded-[32px] font-black shadow-xl shadow-brand-500/20 text-xs uppercase tracking-widest flex items-center gap-3 ${buttonHoverClasses}`}
                    >
                      {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-play"></i>}
                      Rodar Diagnóstico
                    </button>
                </div>
              ) : (
                <div className="bg-slate-900 border border-brand-500/20 p-10 rounded-[40px] shadow-2xl animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <h4 className="text-brand-500 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                      <i className="fas fa-microchip"></i> Relatório do Mentor
                    </h4>
                    <button onClick={() => setDiagnosis('')} className="text-slate-500 hover:text-white transition"><i className="fas fa-redo"></i></button>
                  </div>
                  <p className="text-slate-100 text-lg font-medium leading-relaxed whitespace-pre-wrap relative z-10">{diagnosis}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
               <div className="glass-panel p-8 rounded-[40px] border-white/5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Dados Processados</h4>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                       <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500"><i className="fas fa-history"></i></div>
                       <div>
                         <p className="text-white font-black text-xs">{history.length}</p>
                         <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Posts Realizados</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                       <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500"><i className="fas fa-bullseye"></i></div>
                       <div>
                         <p className="text-white font-black text-xs">{goals.length}</p>
                         <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Metas Ativas</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                       <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500"><i className="fas fa-lightbulb"></i></div>
                       <div>
                         <p className="text-white font-black text-xs">{notes.length}</p>
                         <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Ideias em Backlog</p>
                       </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in bg-slate-900/50 p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
           
           <div className="text-center max-w-2xl mx-auto mb-10">
             <h3 className="text-2xl font-black text-white mb-2">Auditoria de Conteúdo 360°</h3>
             <p className="text-slate-400 text-sm">Uma análise profunda de tudo o que você já produziu para encontrar padrões de sucesso e fracasso.</p>
           </div>
           
           {!auditResult ? (
             <div className="text-center">
                <button onClick={runDeepAudit} disabled={loadingAudit} className={`bg-white text-black px-12 py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-brand-50 transition-colors ${buttonHoverClasses}`}>
                  {loadingAudit ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-search-plus mr-2"></i>}
                  Iniciar Varredura Completa
                </button>
                <p className="mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Pode levar alguns segundos</p>
             </div>
           ) : (
             <div className="animate-fade-in space-y-8">
               <div className="bg-white/5 p-10 rounded-[32px] border border-white/10 shadow-inner">
                 <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">{auditResult}</p>
               </div>
               <div className="text-center">
                 <button onClick={() => setAuditResult('')} className="text-brand-500 font-black text-xs uppercase tracking-widest hover:underline">Nova Auditoria</button>
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default Management;
