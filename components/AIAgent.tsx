
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { generateAgentTip } from '../services/geminiService';

interface AIAgentProps {
  settings: UserSettings;
}

const AIAgent: React.FC<AIAgentProps> = ({ settings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'intro' | 'tip'>('intro');

  useEffect(() => {
    const pref = localStorage.getItem('gera_agent_pref');
    
    if (pref === 'no') {
      setIsMinimized(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsMinimized(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleYes = async () => {
    setLoading(true);
    setHasInteracted(true);
    setStage('tip');
    localStorage.setItem('gera_agent_pref', 'yes');
    
    try {
      const generatedTip = await generateAgentTip(settings);
      setTip(generatedTip);
    } catch (e) {
      setTip("Mantenha a consistência em seus posts diários!");
    } finally {
      setLoading(false);
    }
  };

  const handleNo = () => {
    setIsMinimized(true);
    localStorage.setItem('gera_agent_pref', 'no');
    setTimeout(() => {
       setHasInteracted(false); 
       setStage('intro');
    }, 500);
  };

  const toggleAgent = () => {
    if (isMinimized) {
        setIsMinimized(false);
        if (!hasInteracted) setStage('intro');
    } else {
        setIsMinimized(true);
    }
  };

  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  if (!isVisible && isMinimized) return null;

  return (
    <>
      <button 
        onClick={toggleAgent}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-brand-500 to-blue-600 rounded-full shadow-2xl shadow-brand-500/40 flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 ${!isMinimized ? 'hidden' : 'block'}`}
      >
        <i className="fas fa-robot text-2xl"></i>
      </button>

      {!isMinimized && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[90vw] glass-panel rounded-[32px] shadow-2xl border border-white/20 animate-fade-in-up flex flex-col overflow-hidden max-h-[70vh]">
          <div className="bg-gradient-to-r from-brand-600 to-blue-600 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center border border-white/10">
                 <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="font-black text-white text-xs uppercase tracking-widest">Gera Assistant</span>
            </div>
            <button onClick={() => setIsMinimized(true)} className="text-white/70 hover:text-white transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="p-6 bg-slate-950/90 backdrop-blur-xl flex-1 overflow-y-auto custom-scrollbar">
            {stage === 'intro' && (
              <>
                <p className="text-slate-200 text-sm mb-6 leading-relaxed font-medium">
                  Olá! 👋 Notei que você atua no nicho de <span className="text-brand-500 font-black italic">{settings.niche}</span>. <br/><br/>
                  Gostaria de uma dica estratégica curta para aplicar hoje?
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleYes}
                    className={`w-full bg-brand-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 ${buttonHoverClasses}`}
                  >
                    Sim, quero!
                  </button>
                  <button 
                    onClick={handleNo}
                    className={`w-full bg-white/5 text-slate-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/5 ${buttonHoverClasses}`}
                  >
                    Agora não
                  </button>
                </div>
              </>
            )}

            {stage === 'tip' && (
              <>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <i className="fas fa-circle-notch fa-spin text-brand-500 text-3xl"></i>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Consultando Estrategista...</p>
                  </div>
                ) : (
                  <div className="animate-fade-in flex flex-col">
                    <div className="bg-brand-500/10 border border-brand-500/20 p-5 rounded-2xl mb-6 shadow-inner">
                      <p className="text-slate-100 text-sm leading-relaxed font-medium">
                        {tip}
                      </p>
                    </div>
                    <button 
                      onClick={handleYes}
                      className={`w-full py-4 bg-white text-brand-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl ${buttonHoverClasses}`}
                    >
                      <i className="fas fa-sync-alt mr-2"></i> Outra Dica
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="px-6 py-3 bg-slate-900/50 border-t border-white/5">
             <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest text-center">Powered by Gera Expert IA</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAgent;
