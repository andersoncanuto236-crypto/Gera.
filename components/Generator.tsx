
import React, { useState } from 'react';
import { UserSettings, GeneratedContent } from '../types';
import { canUseAI } from '../src/lib/plan';
import { generatePostV1, generateScript } from '../services/geminiService';
import { SecureStorage, getSessionKey } from '../services/security';
import PaywallModal from './PaywallModal';
import ConnectAIModal from './ConnectAIModal';

interface GeneratorProps {
  settings: UserSettings;
  onOpenTeleprompter?: (text: string) => void;
  onUpdatePlan: (plan?: 'PAID') => void;
}

const Generator: React.FC<GeneratorProps> = ({ settings, onOpenTeleprompter, onUpdatePlan }) => {
  // Mode State
  const [mode, setMode] = useState<'MANUAL' | 'IA'>('MANUAL');
  
  // Paywall & Auth State
  const [showPaywall, setShowPaywall] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  
  // Input States (Shared)
  const [objective, setObjective] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [context, setContext] = useState('');
  
  // Manual Inputs
  const [manualHook, setManualHook] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualCta, setManualCta] = useState('');

  // Processing States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Switch Mode Logic
  const handleModeSwitch = (newMode: 'MANUAL' | 'IA') => {
    if (newMode === 'IA' && !canUseAI(settings.plan)) {
      setShowPaywall(true);
      return;
    }
    setMode(newMode);
  };

  const handleUpgrade = () => {
     onUpdatePlan('PAID');
     setShowPaywall(false);
  };

  const executeGeneration = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await generatePostV1(settings, objective, platform, context);
      setResult(res);
      
      const history = SecureStorage.getItem('history') || [];
      SecureStorage.setItem('history', [
        { id: Date.now().toString(), timestamp: Date.now(), content: res },
        ...history
      ]);

    } catch (e: any) {
      console.error(e);
      if (e.message === "MISSING_API_KEY") {
         setShowKeyInput(true);
      } else {
         setError("Não foi possível gerar o conteúdo agora.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (mode === 'MANUAL') {
       // Manual "Generation" just packages the text
       const manualRes: GeneratedContent = {
         metaObjective: objective || 'Manual',
         hook: manualHook,
         content: manualContent,
         cta: manualCta,
         platform: platform,
         type: 'Manual'
       };
       setResult(manualRes);
       return;
    }

    // IA Mode Check
    if (!canUseAI(settings.plan)) {
       setShowPaywall(true);
       return;
    }

    if (!getSessionKey()) {
       setShowKeyInput(true);
       return;
    }

    await executeGeneration();
  };

  const handleConvertToScript = async () => {
     if (!result) return;
     if (!canUseAI(settings.plan)) {
        setShowPaywall(true);
        return;
     }
     if (!getSessionKey()) {
        setShowKeyInput(true);
        return;
     }

     setLoading(true);
     try {
       const script = await generateScript(settings, result.content.substring(0, 100));
       setResult({ ...result, content: script, metaObjective: 'Roteiro (IA)' });
     } catch (e) {
       console.error(e);
     } finally {
       setLoading(false);
     }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado!");
  };

  const objectives = [
    { id: 'Venda', icon: 'fa-shopping-cart', label: 'Vender', desc: 'Oferta direta' },
    { id: 'Autoridade', icon: 'fa-star', label: 'Autoridade', desc: 'Expertise' },
    { id: 'Educar', icon: 'fa-book-open', label: 'Educar', desc: 'Ensinar algo' },
    { id: 'Engajamento', icon: 'fa-comments', label: 'Engajar', desc: 'Gerar conversa' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-24">
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        onUpgrade={handleUpgrade}
        featureName="Gerador de Conteúdo"
      />
      
      <ConnectAIModal
        isOpen={showKeyInput}
        onClose={() => setShowKeyInput(false)}
        onConnected={() => { setShowKeyInput(false); executeGeneration(); }}
      />

      {/* Mode Switcher */}
      {!result && (
        <div className="flex justify-center mb-8">
           <div className="bg-white/5 p-1 rounded-2xl flex border border-white/5">
              <button 
                onClick={() => handleModeSwitch('MANUAL')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'MANUAL' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Editor Manual
              </button>
              <button 
                onClick={() => handleModeSwitch('IA')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'IA' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <i className="fas fa-bolt"></i> IA Automática {!canUseAI(settings.plan) && <i className="fas fa-lock text-[8px] opacity-50 ml-1"></i>}
              </button>
           </div>
        </div>
      )}

      {!result ? (
        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-center text-sm font-bold">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          {/* Platform & Objective (Common) */}
          <div className="glass-panel p-6 rounded-[32px] space-y-6">
             <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl">
               {['Instagram', 'LinkedIn', 'TikTok'].map(p => (
                 <button 
                   key={p} 
                   onClick={() => setPlatform(p)}
                   className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition ${
                     platform === p ? 'bg-white text-brand-900 shadow-md' : 'text-slate-500 hover:text-white'
                   }`}
                 >
                   {p}
                 </button>
               ))}
             </div>
             
             {/* Objective Selection */}
              <div className="grid grid-cols-4 gap-2">
                {objectives.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => setObjective(obj.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                      objective === obj.id 
                        ? 'bg-brand-600 border-brand-500 text-white shadow-lg' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <i className={`fas ${obj.icon} text-lg mb-2`}></i>
                    <span className="text-[8px] font-black uppercase tracking-widest">{obj.label}</span>
                  </button>
                ))}
              </div>
          </div>

          {mode === 'MANUAL' ? (
             /* Manual Editor */
             <div className="glass-panel p-8 rounded-[32px] space-y-6 animate-fade-in">
                <div>
                   <label className="text-[9px] font-black uppercase text-brand-500 tracking-widest ml-1 mb-2 block">Hook (Gancho)</label>
                   <input 
                     value={manualHook}
                     onChange={e => setManualHook(e.target.value)}
                     className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white font-bold"
                     placeholder="A frase inicial que prende atenção..."
                   />
                </div>
                <div>
                   <label className="text-[9px] font-black uppercase text-brand-500 tracking-widest ml-1 mb-2 block">Desenvolvimento</label>
                   <textarea 
                     value={manualContent}
                     onChange={e => setManualContent(e.target.value)}
                     className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white resize-none"
                     placeholder="O corpo do seu conteúdo..."
                   />
                </div>
                <div>
                   <label className="text-[9px] font-black uppercase text-brand-500 tracking-widest ml-1 mb-2 block">CTA (Chamada)</label>
                   <input 
                     value={manualCta}
                     onChange={e => setManualCta(e.target.value)}
                     className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white font-bold"
                     placeholder="O que o usuário deve fazer?"
                   />
                </div>
             </div>
          ) : (
             /* IA Inputs */
             <div className="glass-panel p-6 rounded-[32px] space-y-4 animate-fade-in">
               <textarea 
                 value={context}
                 onChange={e => setContext(e.target.value)}
                 placeholder="Contexto extra para a IA (opcional)..."
                 className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white placeholder-slate-600 text-sm outline-none focus:border-brand-500 transition h-24 resize-none"
               />
             </div>
          )}

          <button 
             onClick={handleGenerate}
             disabled={loading || !objective}
             className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
               mode === 'IA' ? 'bg-brand-600 text-white hover:bg-brand-500 shadow-brand-500/20' : 'bg-white text-slate-900 hover:bg-slate-200'
             }`}
           >
             {loading ? <i className="fas fa-spinner fa-spin"></i> : (
               mode === 'IA' ? <><i className="fas fa-bolt"></i> Gerar com IA</> : <><i className="fas fa-save"></i> Organizar Rascunho</>
             )}
           </button>
        </div>
      ) : (
        // Result View
        <div className="animate-fade-in-up space-y-6 pb-12">
          <div className="glass-panel-light p-8 rounded-[40px] border-4 border-white/50 shadow-2xl relative">
             <div className="flex justify-between items-start mb-6">
               <span className="bg-brand-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{result.type} • {result.platform}</span>
               <button onClick={() => setResult(null)} className="text-slate-400 hover:text-red-500 transition"><i className="fas fa-times text-xl"></i></button>
             </div>

             <div className="space-y-6 text-slate-900">
               {result.hook && (
                <div>
                  <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest mb-1">Gancho (Hook)</p>
                  <p className="text-lg font-black text-slate-800 leading-tight">{result.hook}</p>
                </div>
               )}

               <div>
                  <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest mb-2">Conteúdo</p>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 whitespace-pre-line font-medium text-base leading-relaxed text-gray-800">
                    {result.content}
                  </div>
               </div>

               {result.cta && (
                 <div className="bg-brand-50 p-4 rounded-2xl flex items-center gap-4 border border-brand-100">
                   <div className="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 text-xs shadow-sm"><i className="fas fa-bullhorn"></i></div>
                   <div>
                      <p className="text-[9px] font-black uppercase text-brand-700 tracking-widest">CTA</p>
                      <p className="text-sm font-bold text-brand-900">{result.cta}</p>
                   </div>
                 </div>
               )}
             </div>

             <div className="pt-8 flex flex-col sm:flex-row gap-4">
               <button onClick={() => copyToClipboard(`${result.hook}\n\n${result.content}\n\n${result.cta}`)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition shadow-xl active:scale-95">
                 <i className="far fa-copy mr-2"></i> Copiar
               </button>
               
               {onOpenTeleprompter && (
                 <button 
                  onClick={() => onOpenTeleprompter(result.content)} 
                  className="flex-1 py-4 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 transition shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-video"></i> Teleprompter
                </button>
               )}
               
               {/* "Melhorar com IA" só aparece no modo manual ou se o usuario quiser refinar. Botão protegido */}
               <button onClick={handleConvertToScript} disabled={loading} className="px-6 py-4 bg-gray-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition active:scale-95 group relative">
                 {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic text-brand-500"></i>}
                 {!canUseAI(settings.plan) && <div className="absolute -top-1 -right-1 bg-black text-white text-[8px] p-1 rounded-full"><i className="fas fa-lock"></i></div>}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;
