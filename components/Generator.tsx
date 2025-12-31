
import React, { useState } from 'react';
import { UserSettings, GeneratedContent } from '../types';
import { generateSocialContent, refineIntent, simulateCritique } from '../services/geminiService';
import DeepAnalysis from './DeepAnalysis';

interface GeneratorProps {
  settings: UserSettings;
  onAction?: () => void;
}

const Generator: React.FC<GeneratorProps> = ({ settings, onAction }) => {
  const [intent, setIntent] = useState('');
  const [contentType, setContentType] = useState<'POST' | 'REELS'>('POST');
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('Venda');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Critique State
  const [critique, setCritique] = useState('');
  const [loadingCritique, setLoadingCritique] = useState(false);

  const handleRefine = async () => {
    if (!intent) return;
    setRefining(true);
    try {
      const refined = await refineIntent(intent);
      setTopic(refined.suggestedTheme);
      setContentType(refined.suggestedFormat);
      setGoal(refined.suggestedGoal);
      setAdditionalInfo(refined.suggestedAdditionalInfo);
    } catch (e) {
      alert("Erro ao refinar intenção.");
    } finally {
      setRefining(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setCritique('');
    try {
      const data = await generateSocialContent(settings, topic, contentType, goal, additionalInfo);
      setResult(data);
      const historyItem = { id: Date.now().toString(), timestamp: Date.now(), topic, content: data };
      const hist = JSON.parse(localStorage.getItem('gera_history') || '[]');
      localStorage.setItem('gera_history', JSON.stringify([historyItem, ...hist]));
      if (onAction) onAction();
    } catch (err) {
      alert('Erro ao gerar conteúdo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCritique = async () => {
    if (!result) return;
    setLoadingCritique(true);
    try {
      const res = await simulateCritique(result.caption, settings);
      setCritique(res);
    } catch (e) {
      setCritique("Erro ao simular cliente.");
    } finally {
      setLoadingCritique(false);
    }
  };

  const inputClasses = "w-full bg-white border-2 border-black rounded-2xl p-4 text-black placeholder-gray-400 outline-none focus:ring-4 focus:ring-brand-500/20 transition-all font-bold shadow-sm";
  const buttonHoverClasses = "transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-fade-in-up">
      <div className="flex justify-center gap-4">
         <button onClick={() => setShowAnalysis(false)} className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!showAnalysis ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500'}`}>Criador</button>
         <button onClick={() => setShowAnalysis(true)} className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showAnalysis ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500'}`}>Deep Analysis</button>
      </div>

      {showAnalysis ? (
        <DeepAnalysis settings={settings} />
      ) : (
        <div className="space-y-8">
          {/* Top Intent Box */}
          <div className="glass-panel p-8 rounded-[40px] shadow-2xl border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <i className="fas fa-sparkles text-brand-500"></i> Intenção Estratégica
            </h3>
            <div className="relative">
              <textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Ex: Quero vender mais consultorias mostrando meus bastidores..."
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[120px] focus:ring-4 focus:ring-brand-500/10 outline-none font-medium transition-all text-white"
              />
              <button onClick={handleRefine} disabled={refining || !intent} className={`absolute bottom-4 right-4 bg-brand-600 text-white px-6 py-3 rounded-2xl font-black transition shadow-lg ${buttonHoverClasses}`}>
                {refining ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                Refinar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
              <div className="glass-panel-light p-10 rounded-[40px] space-y-8 shadow-2xl border-white">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Formato & Objetivo</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={contentType} onChange={(e) => setContentType(e.target.value as any)} className={inputClasses}>
                      <option value="POST">Post Estático</option>
                      <option value="REELS">Vídeo Reels</option>
                    </select>
                    <select value={goal} onChange={(e) => setGoal(e.target.value)} className={inputClasses}>
                      <option value="Venda">Venda</option>
                      <option value="Autoridade">Autoridade</option>
                      <option value="Engajamento">Engajamento</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Tema Definido</label>
                  <input value={topic} onChange={(e) => setTopic(e.target.value)} className={inputClasses} />
                </div>

                <button onClick={handleGenerate} disabled={loading} className={`w-full py-6 bg-black text-white rounded-[32px] font-black text-lg shadow-2xl flex items-center justify-center gap-3 ${buttonHoverClasses}`}>
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-rocket"></i>}
                  Gerar Estratégia Completa
                </button>
              </div>

              {/* RESULTADO APARECE AQUI AGORA */}
              {result && (
                <div className="glass-panel-light p-8 rounded-[40px] shadow-2xl border-white animate-fade-in-up space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                       <span className="bg-brand-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/10">{result.type}</span>
                       <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                         <i className="fas fa-clock text-brand-500"></i> {result.bestTime}
                       </span>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(result.caption)} className={`text-brand-600 font-black text-xs uppercase tracking-widest px-4 py-2 bg-brand-50 rounded-xl ${buttonHoverClasses}`}>COPIAR</button>
                  </div>
                  
                  <div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gancho (Headline)</p>
                      <p className="text-2xl font-black leading-tight text-slate-900">"{result.hook}"</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mt-6">
                      <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <i className="fas fa-camera"></i> Dica Visual
                      </p>
                      <p className="text-sm text-slate-600 font-medium italic leading-relaxed">
                        {result.imageSuggestion}
                      </p>
                    </div>

                    <div className="mt-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Legenda Humanizada</p>
                      <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed font-medium">{result.caption}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {result.hashtags.map(t => <span key={t} className="text-brand-700 font-black text-[9px] bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-100 uppercase">#{t}</span>)}
                    </div>
                  </div>
                  
                  {/* Persona Simulator Button */}
                  <div className="pt-4 border-t border-slate-100">
                    {!critique ? (
                       <button onClick={handleCritique} disabled={loadingCritique} className={`w-full py-3 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-100 transition ${buttonHoverClasses}`}>
                         {loadingCritique ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user-secret mr-2"></i>}
                         Simular "Cliente Chato"
                       </button>
                    ) : (
                       <div className="bg-red-50 p-6 rounded-3xl border border-red-100 animate-fade-in">
                          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">
                            <i className="fas fa-user-secret"></i> A Crítica
                          </p>
                          <p className="text-red-800 text-sm font-medium italic leading-relaxed">"{critique}"</p>
                       </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar info / Histórico rápido ou Instruções */}
            <div className="space-y-6">
               <div className="glass-panel p-8 rounded-[40px] border-white/5">
                  <h4 className="font-black text-xs text-slate-400 uppercase mb-4 tracking-widest">Dica de Especialista</h4>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                      "Lembre-se: O segredo está nos primeiros 3 segundos do seu vídeo ou na primeira frase do seu post estático."
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;
