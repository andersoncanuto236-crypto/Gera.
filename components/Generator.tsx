
import React, { useState } from 'react';
import { UserSettings, GeneratedContent } from '../types';
import { generatePostV1 } from '../services/geminiService';
import { SecureStorage } from '../services/security';

interface GeneratorProps {
  settings: UserSettings;
  onOpenTeleprompter?: (text: string) => void;
}

const Generator: React.FC<GeneratorProps> = ({ settings, onOpenTeleprompter }) => {
  // Input States
  const [objective, setObjective] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [context, setContext] = useState('');
  
  // Processing States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!objective) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await generatePostV1(settings, objective, platform, context);
      setResult(res);
      
      // Save to History
      const history = SecureStorage.getItem('history') || [];
      SecureStorage.setItem('history', [
        { id: Date.now().toString(), timestamp: Date.now(), content: res },
        ...history
      ]);

    } catch (e: any) {
      console.error(e);
      let msg = "Não foi possível gerar o conteúdo agora.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Conteúdo copiado!");
  };

  const objectives = [
    { id: 'Venda', icon: 'fa-shopping-cart', label: 'Vender', desc: 'Oferta direta e conversão' },
    { id: 'Autoridade', icon: 'fa-star', label: 'Posicionar', desc: 'Mostrar expertise e confiança' },
    { id: 'Educar', icon: 'fa-book-open', label: 'Educar', desc: 'Ensinar algo ao público' },
    { id: 'Engajamento', icon: 'fa-comments', label: 'Engajar', desc: 'Gerar comentários e likes' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-24">
      {/* Header */}
      {!result && (
        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Criar Conteúdo</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Foco Estratégico & Tom de Voz</p>
        </div>
      )}

      {!result ? (
        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-center text-sm font-bold">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          {/* Step 1: Objective */}
          <div className="grid grid-cols-2 gap-4">
            {objectives.map((obj) => (
              <button
                key={obj.id}
                onClick={() => setObjective(obj.id)}
                className={`p-6 rounded-[32px] border text-left transition-all duration-300 group ${
                  objective === obj.id 
                    ? 'bg-brand-600 border-brand-500 text-white shadow-xl scale-[1.02]' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-3 ${
                   objective === obj.id ? 'bg-white text-brand-600' : 'bg-black/20'
                }`}>
                  <i className={`fas ${obj.icon}`}></i>
                </div>
                <h3 className={`font-black uppercase text-xs mb-1 ${objective === obj.id ? 'text-white' : 'text-slate-300'}`}>{obj.label}</h3>
                <p className={`text-[9px] font-medium leading-tight ${objective === obj.id ? 'text-brand-100' : 'text-slate-500'}`}>{obj.desc}</p>
              </button>
            ))}
          </div>

          {/* Step 2 & 3: Platform & Context */}
          <div className="glass-panel p-6 rounded-[32px] space-y-6">
             <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl">
               {['Instagram', 'LinkedIn', 'YouTube', 'TikTok'].map(p => (
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

             <textarea 
               value={context}
               onChange={e => setContext(e.target.value)}
               placeholder="Contexto opcional (ex: Promoção de Black Friday, lançamento de curso...)"
               className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white placeholder-slate-600 text-sm outline-none focus:border-brand-500 transition h-24 resize-none"
             />

             <button 
               onClick={handleGenerate}
               disabled={loading || !objective}
               className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 disabled:opacity-50 hover:bg-brand-500 transition-all flex items-center justify-center gap-3 active:scale-95"
             >
               {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-bolt"></i> Gerar Conteúdo Premium</>}
             </button>
          </div>
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
               <div>
                 <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest mb-1">Estratégia sugerida</p>
                 <p className="text-sm font-medium text-slate-500 leading-snug">{result.metaObjective}</p>
               </div>

               <div>
                  <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest mb-2">Conteúdo Final</p>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 whitespace-pre-line font-medium text-base leading-relaxed text-gray-800">
                    {result.content}
                  </div>
               </div>

               {result.cta && (
                 <div className="bg-brand-50 p-4 rounded-2xl flex items-center gap-4 border border-brand-100">
                   <div className="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 text-xs shadow-sm"><i className="fas fa-bullhorn"></i></div>
                   <div>
                      <p className="text-[9px] font-black uppercase text-brand-700 tracking-widest">Chamada para Ação</p>
                      <p className="text-sm font-bold text-brand-900">{result.cta}</p>
                   </div>
                 </div>
               )}
             </div>

             <div className="pt-8 flex flex-col sm:flex-row gap-4">
               <button onClick={() => copyToClipboard(result.content)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition shadow-xl active:scale-95">
                 <i className="far fa-copy mr-2"></i> Copiar Texto
               </button>
               
               {onOpenTeleprompter && (
                 <button 
                  onClick={() => onOpenTeleprompter(result.content)} 
                  className="flex-1 py-4 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 transition shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-video"></i> Grave com Teleprompter
                </button>
               )}
               
               <button onClick={() => setResult(null)} className="px-6 py-4 bg-gray-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition active:scale-95">
                 Recriar
               </button>
             </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic leading-relaxed">
               Dica: O teleprompter ajuda a manter o contato visual com a câmera enquanto você lê seu roteiro perfeito.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;
