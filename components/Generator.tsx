
import React, { useState } from 'react';
import { UserSettings, GeneratedContent } from '../types';
import { generatePost, multiplyContent, remixContent } from '../services/geminiService';
import { SecureStorage } from '../services/security';
import Teleprompter from './Teleprompter';

const Generator: React.FC<{ settings: UserSettings }> = ({ settings }) => {
  // Modes: Scratch vs Robin Hood
  const [mode, setMode] = useState<'scratch' | 'remix'>('scratch');

  // Input States
  const [topic, setTopic] = useState('');
  const [remixSource, setRemixSource] = useState('');
  const [type, setType] = useState<'POST' | 'REELS' | 'STORY'>('POST');
  const [goal, setGoal] = useState('Venda');
  
  // Processing States
  const [loading, setLoading] = useState(false);
  const [multiplying, setMultiplying] = useState(false);
  
  // Result States
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [displayTab, setDisplayTab] = useState<'original' | 'reels' | 'story' | 'linkedin'>('original');

  // Utility States
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  const handleGenerate = async () => {
    if (mode === 'scratch' && !topic) return;
    if (mode === 'remix' && !remixSource) return;

    setLoading(true);
    setResult(null);
    setDisplayTab('original');

    try {
      let res: GeneratedContent;
      
      if (mode === 'scratch') {
        res = await generatePost(settings, topic, type, goal);
      } else {
        // Robin Hood Mode
        res = await remixContent(settings, remixSource, type);
      }
      
      setResult(res);
      saveToHistory(res, mode === 'scratch' ? topic : 'Remix Robin Hood');
    } catch (e) {
      alert("Erro ao gerar conteúdo. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleMultiply = async () => {
    if (!result) return;
    setMultiplying(true);
    try {
      const multipliedData = await multiplyContent(settings, result);
      const updatedResult = { ...result, multiplied: multipliedData };
      setResult(updatedResult);
      setDisplayTab('reels'); // Auto switch to show magic
      
      // Update history
      const history = SecureStorage.getItem('history') || [];
      if (history.length > 0) {
        history[0].content = updatedResult; // Update most recent
        SecureStorage.setItem('history', history);
      }

    } catch (e) {
      alert("Erro ao multiplicar conteúdo.");
    } finally {
      setMultiplying(false);
    }
  };

  const saveToHistory = (content: GeneratedContent, topicLabel: string) => {
    const history = SecureStorage.getItem('history') || [];
    SecureStorage.setItem('history', [{ id: Date.now().toString(), topic: topicLabel, content, timestamp: Date.now() }, ...history]);
  };

  // Helper to get text for teleprompter depending on active tab
  const getTeleprompterText = () => {
    if (!result) return '';
    if (displayTab === 'original') return result.caption;
    if (displayTab === 'reels') return result.multiplied?.reelsScript || '';
    if (displayTab === 'story') return (result.multiplied?.storySequence || []).join('\n\n---\n\n');
    if (displayTab === 'linkedin') return result.multiplied?.linkedinText || '';
    return '';
  };

  const inputClasses = "w-full bg-white border-2 border-black rounded-2xl p-4 text-black font-bold outline-none focus:ring-4 focus:ring-brand-500/20 transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-24">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter">Criar Conteúdo</h2>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2">Pilar 03: Execução</p>
      </div>

      {/* Input Section */}
      <div className="glass-panel p-1 rounded-[40px] relative">
        {/* Mode Switcher */}
        <div className="flex bg-black/20 p-1.5 rounded-[38px] mb-2 mx-1 mt-1">
           <button 
             onClick={() => setMode('scratch')} 
             className={`flex-1 py-3 rounded-[34px] text-xs font-black uppercase tracking-widest transition-all ${mode === 'scratch' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
           >
             <i className="fas fa-pen-nib mr-2"></i> Do Zero
           </button>
           <button 
             onClick={() => setMode('remix')} 
             className={`flex-1 py-3 rounded-[34px] text-xs font-black uppercase tracking-widest transition-all ${mode === 'remix' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
           >
             <i className="fas fa-bow-arrow mr-2"></i> Robin Hood (Remix)
           </button>
        </div>

        <div className="p-8 space-y-6">
          {mode === 'scratch' ? (
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">O que vamos comunicar?</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ex: Benefícios da consultoria..." className={inputClasses} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-brand-500 tracking-widest ml-1"><i className="fas fa-shield-alt"></i> Anti-Plágio Ativo</label>
              </div>
              <textarea 
                value={remixSource} 
                onChange={e => setRemixSource(e.target.value)} 
                placeholder="Cole aqui o texto do concorrente ou referência. A IA irá reescrever com seu tom de voz e nicho..." 
                className={`${inputClasses} h-32 resize-none leading-relaxed`} 
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Formato Final</label>
               <select value={type} onChange={e => setType(e.target.value as any)} className={inputClasses}>
                 <option value="POST">Post Estático</option>
                 <option value="REELS">Reels / Vídeo</option>
                 <option value="STORY">Story</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Objetivo</label>
               <select value={goal} onChange={e => setGoal(e.target.value)} className={inputClasses}>
                 <option value="Venda">Venda</option>
                 <option value="Autoridade">Autoridade</option>
                 <option value="Engajamento">Engajamento</option>
               </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={loading || (mode === 'scratch' ? !topic : !remixSource)}
            className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 disabled:opacity-50 hover:bg-brand-500 transition-colors"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'scratch' ? 'Gerar Conteúdo' : 'Remixar Conteúdo')}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="glass-panel-light p-8 rounded-[40px] animate-fade-in-up space-y-6 relative border-4 border-white/50">
          
          {/* Action Bar (Multiply) */}
          {!result.multiplied ? (
             <div className="bg-brand-50 p-6 rounded-[32px] flex items-center justify-between gap-4 border border-brand-100">
               <div>
                 <h4 className="text-brand-800 font-black text-sm uppercase tracking-wider">Multiplicador de Conteúdo</h4>
                 <p className="text-brand-600 text-xs">Transforme este post em 3 formatos (Reels, Story, LinkedIn) com 1 clique.</p>
               </div>
               <button 
                 onClick={handleMultiply}
                 disabled={multiplying}
                 className="bg-brand-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
               >
                 {multiplying ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-layer-group mr-2"></i> Multiplicar</>}
               </button>
             </div>
          ) : (
             // Tabs for Multiplied Content
             <div className="flex bg-gray-100 p-1 rounded-2xl overflow-x-auto">
               {[
                 { id: 'original', label: 'Original', icon: 'fa-file-alt' },
                 { id: 'reels', label: 'Roteiro Reels', icon: 'fa-video' },
                 { id: 'story', label: 'Seq. Stories', icon: 'fa-images' },
                 { id: 'linkedin', label: 'LinkedIn', icon: 'fa-briefcase' },
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setDisplayTab(tab.id as any)}
                   className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center justify-center gap-2 ${displayTab === tab.id ? 'bg-white text-brand-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   <i className={`fas ${tab.icon}`}></i> {tab.label}
                 </button>
               ))}
             </div>
          )}

          {/* Content Display Area */}
          <div className="space-y-4 text-slate-900 min-h-[200px]">
             {displayTab === 'original' && (
               <>
                 <div className="flex justify-between items-start">
                    <p className="text-2xl font-black">"{result.hook}"</p>
                    <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase">{result.type}</span>
                 </div>
                 <p className="text-sm font-medium leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-3xl border border-gray-100">{result.caption}</p>
                 <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest"><i className="fas fa-camera mr-1"></i> Visual: {result.imageSuggestion}</p>
               </>
             )}

             {displayTab === 'reels' && result.multiplied?.reelsScript && (
               <div className="bg-gray-900 text-white p-8 rounded-3xl border border-gray-800 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/20 rounded-full blur-xl"></div>
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-4">Roteiro de 30s</h5>
                 <p className="whitespace-pre-line leading-relaxed font-medium">{result.multiplied.reelsScript}</p>
               </div>
             )}

             {displayTab === 'story' && result.multiplied?.storySequence && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {result.multiplied.storySequence.map((story, i) => (
                   <div key={i} className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-3xl text-white shadow-lg relative">
                      <span className="absolute top-4 right-4 text-white/50 text-4xl font-black">{i+1}</span>
                      <p className="text-sm font-bold mt-4 leading-snug">{story}</p>
                   </div>
                 ))}
               </div>
             )}

             {displayTab === 'linkedin' && result.multiplied?.linkedinText && (
               <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-blue-900">
                  <i className="fab fa-linkedin text-2xl mb-4 text-blue-700"></i>
                  <p className="whitespace-pre-line font-medium text-sm leading-relaxed">{result.multiplied.linkedinText}</p>
               </div>
             )}
          </div>
          
          {/* Action Buttons Footer */}
          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <button 
              onClick={() => navigator.clipboard.writeText(getTeleprompterText())} 
              className="flex-1 py-4 bg-gray-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition"
            >
              <i className="far fa-copy mr-2"></i> Copiar Texto
            </button>
            
            {/* Teleprompter Trigger - Only visible for scripts/text heavy formats */}
            {(displayTab === 'reels' || displayTab === 'original') && (
              <button 
                onClick={() => setShowTeleprompter(true)} 
                className="flex-1 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fas fa-video"></i> Gravar (Teleprompter)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Teleprompter Overlay */}
      {showTeleprompter && (
        <Teleprompter 
          text={getTeleprompterText()} 
          onClose={() => setShowTeleprompter(false)} 
        />
      )}
    </div>
  );
};

export default Generator;
