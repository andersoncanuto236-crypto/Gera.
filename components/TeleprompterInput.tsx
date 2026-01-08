
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { canUseAI } from '../src/lib/plan';
import { generateScript } from '../services/geminiService';
import { getSessionKey } from '../services/security';
import PaywallModal from './PaywallModal';
import ConnectAIModal from './ConnectAIModal';

interface TeleprompterInputProps {
  settings: UserSettings;
  onStart: (text: string) => void;
  onUpdatePlan: (plan?: 'PAID') => void;
}

const TeleprompterInput: React.FC<TeleprompterInputProps> = ({ settings, onStart, onUpdatePlan }) => {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showPaywall, setShowPaywall] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);

  const executeGeneration = async () => {
    setLoading(true);
    try {
      const script = await generateScript(settings, topic);
      setText(script);
    } catch (e: any) {
      if (e.message === "MISSING_API_KEY") {
         setShowKeyInput(true);
      } else {
         alert("Erro ao gerar roteiro.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic) return;
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
  
  const handleUpgrade = () => {
    onUpdatePlan('PAID');
    setShowPaywall(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-fade-in pb-24">
       <PaywallModal 
         isOpen={showPaywall} 
         onClose={() => setShowPaywall(false)} 
         onUpgrade={handleUpgrade}
         featureName="Roteiro com IA"
       />
       <ConnectAIModal
        isOpen={showKeyInput}
        onClose={() => setShowKeyInput(false)}
        onConnected={() => { setShowKeyInput(false); executeGeneration(); }}
      />

       <div className="text-center">
         <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Estúdio de Gravação</h2>
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Prepare seu roteiro antes de ligar a câmera</p>
       </div>

       <div className="glass-panel p-8 rounded-[40px] space-y-6">
          <div className="space-y-4">
             <div className="flex justify-between items-center">
               <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest ml-2">Opção A: Gerar com IA</label>
               {!canUseAI(settings.plan) && <span className="bg-white/10 px-2 py-1 rounded text-[8px] uppercase font-bold text-white"><i className="fas fa-lock mr-1"></i> Starter</span>}
             </div>
             <div className="flex gap-2 relative">
               <input 
                 value={topic}
                 onChange={e => setTopic(e.target.value)}
                 placeholder="Sobre o que você quer falar no vídeo?"
                 className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-500 outline-none focus:border-brand-500 transition"
               />
               <button 
                 onClick={handleGenerate}
                 disabled={loading || !topic}
                 className="bg-brand-600 text-white w-14 rounded-2xl hover:bg-brand-500 transition flex items-center justify-center disabled:opacity-50 shadow-lg"
               >
                 {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
               </button>
             </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase">OU DIGITE ABAIXO (GRÁTIS)</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest ml-2">Seu Roteiro Manual</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Cole seu texto ou escreva aqui..."
              className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-3xl p-6 text-lg text-white placeholder-slate-600 outline-none focus:border-brand-500 transition resize-none leading-relaxed"
            />
          </div>

          <button 
            onClick={() => onStart(text)}
            disabled={!text.trim()}
            className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-camera"></i> Abrir Câmera e Teleprompter
          </button>
       </div>
    </div>
  );
};

export default TeleprompterInput;
