
import React, { useState, useEffect } from 'react';
import { UserSettings, DashboardMetric, Goal } from '../types';
import { getDashboardFeedback, suggestDashboardGoals } from '../services/geminiService';

interface DashboardProps {
  settings: UserSettings;
  onUpdateSettings?: (s: UserSettings) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ settings, onUpdateSettings }) => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [aiFeedback, setAiFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(false);
  
  const labels = settings.metricLabels || {
    likes: 'Curtidas',
    views: 'Views',
    conversions: 'Conversões'
  };

  const [isEditingLabels, setIsEditingLabels] = useState(false);
  const [tempLabels, setTempLabels] = useState(labels);

  useEffect(() => {
    setMetrics(JSON.parse(localStorage.getItem('gera_metrics') || '[]'));
    setGoals(JSON.parse(localStorage.getItem('gera_goals') || '[]'));
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('gera_goals', JSON.stringify(updatedGoals));
  };

  const updateGoalProgress = (id: string, delta: number) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const newVal = Math.max(0, g.current + delta);
        return { ...g, current: newVal };
      }
      return g;
    });
    saveGoals(updated);
  };

  const saveLabels = () => {
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, metricLabels: tempLabels });
    }
    setIsEditingLabels(false);
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
      saveGoals(updated);
    } catch (e) {
      alert("Erro ao sugerir metas.");
    } finally {
      setLoadingGoals(false);
    }
  };

  const getAiOpinion = async () => {
    setLoadingFeedback(true);
    try {
      const fb = await getDashboardFeedback(settings, metrics.slice(0, 5));
      setAiFeedback(fb);
    } catch (e) {
      setAiFeedback("Erro ao consultar estratégia.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const inputClasses = "w-full bg-white border-2 border-black rounded-2xl p-4 text-black font-bold outline-none focus:ring-4 focus:ring-brand-500/20";
  const buttonHoverClasses = "transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Growth Dashboard<span className="text-brand-600">.</span></h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Monitoramento de Resultados</p>
            <button onClick={() => setIsEditingLabels(!isEditingLabels)} className="text-[9px] text-brand-500 font-black uppercase tracking-widest hover:underline">
              {isEditingLabels ? '[ Cancelar ]' : '[ Personalizar KPIs ]'}
            </button>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={handleSuggestGoals} disabled={loadingGoals} className={`bg-white text-black px-6 py-4 rounded-[24px] font-black shadow-xl text-[10px] uppercase tracking-widest flex items-center gap-2 ${buttonHoverClasses}`}>
             {loadingGoals ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bullseye"></i>}
             Sugerir Metas
           </button>
           <button onClick={getAiOpinion} disabled={loadingFeedback} className={`bg-brand-600 text-white px-6 py-4 rounded-[24px] font-black shadow-xl shadow-brand-500/20 text-[10px] uppercase tracking-widest flex items-center gap-2 ${buttonHoverClasses}`}>
             {loadingFeedback ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-robot"></i>}
             Opinião IA
           </button>
        </div>
      </div>

      {isEditingLabels && (
        <div className="glass-panel p-8 rounded-[32px] border-brand-500/20 animate-fade-in flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-500">KPI Principal</label>
            <input value={tempLabels.likes} onChange={e => setTempLabels({...tempLabels, likes: e.target.value})} className={inputClasses} />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-500">KPI Secundário</label>
            <input value={tempLabels.views} onChange={e => setTempLabels({...tempLabels, views: e.target.value})} className={inputClasses} />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-500">Conversão</label>
            <input value={tempLabels.conversions} onChange={e => setTempLabels({...tempLabels, conversions: e.target.value})} className={inputClasses} />
          </div>
          <button onClick={saveLabels} className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl">Salvar</button>
        </div>
      )}

      <div className="space-y-8">
        {aiFeedback && (
          <div className="bg-brand-600 p-10 rounded-[40px] shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">Análise Rápida de Performance</h4>
            <p className="text-white text-xl font-medium leading-relaxed whitespace-pre-wrap">{aiFeedback}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(g => (
            <div key={g.id} className="glass-panel p-8 rounded-[32px] border-white/5 flex flex-col justify-between hover:border-white/10 transition group">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full">
                    {g.type === 'likes' ? labels.likes : g.type === 'views' ? labels.views : labels.conversions}
                  </span>
                  <button onClick={() => {
                     const updated = goals.filter(x => x.id !== g.id);
                     saveGoals(updated);
                  }} className="text-slate-600 hover:text-red-500 transition"><i className="fas fa-times"></i></button>
                </div>
                
                <h4 className="font-black text-white text-lg mb-4 truncate">{g.label}</h4>
                
                {/* Editable Controls */}
                <div className="flex items-center justify-between bg-black/20 rounded-xl p-2 mb-4">
                   <button 
                     onClick={() => updateGoalProgress(g.id, -10)}
                     className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
                   >
                     <i className="fas fa-minus text-xs"></i>
                   </button>
                   <div className="text-center">
                     <span className="block text-2xl font-black text-white leading-none">{g.current}</span>
                     <span className="text-[8px] uppercase text-slate-500 font-bold">Atual</span>
                   </div>
                   <button 
                     onClick={() => updateGoalProgress(g.id, 10)}
                     className="w-8 h-8 rounded-lg bg-brand-600 hover:bg-brand-500 flex items-center justify-center text-white transition shadow-lg"
                   >
                     <i className="fas fa-plus text-xs"></i>
                   </button>
                </div>

                <div className="flex justify-between items-end mb-1">
                   <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Alvo: {g.target}</p>
                   <p className="text-white text-xs font-black">{Math.round((g.current / g.target) * 100)}%</p>
                </div>
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                <div className="bg-brand-600 h-full rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-all duration-500" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }}></div>
              </div>
            </div>
          ))}
          
          <button 
             onClick={() => {
                const newGoal: Goal = { id: Date.now().toString(), label: 'Nova Meta', target: 100, current: 0, type: 'likes' };
                saveGoals([...goals, newGoal]);
             }}
             className="glass-panel border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center p-10 hover:bg-white/5 transition group cursor-pointer"
          >
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-500 group-hover:scale-110 transition">
               <i className="fas fa-plus text-2xl"></i>
             </div>
             <p className="mt-4 text-slate-500 font-black uppercase text-xs tracking-widest group-hover:text-white">Criar Meta Manual</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
