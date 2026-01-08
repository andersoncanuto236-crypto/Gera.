
import React from 'react';
import { UserPlan } from '../types';

interface PricingProps {
  currentPlan: UserPlan;
  onUpgrade: () => void;
  onDowngrade: () => void;
}

const Pricing: React.FC<PricingProps> = ({ currentPlan, onUpgrade, onDowngrade }) => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 pb-32 animate-fade-in-up">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Escolha seu Ritmo<span className="text-brand-600">.</span>
        </h2>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto text-sm md:text-base">
          O Gera. é gratuito para organizar. O plano Starter serve para quem quer velocidade.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start relative">
        
        {/* PLANO FREE */}
        <div className={`glass-panel p-8 md:p-10 rounded-[40px] border-white/5 transition-all ${currentPlan === 'FREE' ? 'border-brand-500/50 shadow-brand-500/10' : 'opacity-80 hover:opacity-100'}`}>
          <div className="mb-8">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Modo Manual</span>
            <h3 className="text-3xl font-black text-white mt-4 mb-2">Free</h3>
            <p className="text-slate-400 text-sm font-medium">Para quem tem tempo e precisa de organização.</p>
          </div>
          
          <div className="mb-8">
            <span className="text-4xl font-black text-white">R$ 0</span>
            <span className="text-slate-500 font-bold ml-1">/mês</span>
          </div>

          <div className="space-y-4 mb-10">
            <FeatureItem active text="Editor de Conteúdo Manual" />
            <FeatureItem active text="Calendário Editorial (Arrastar e Soltar)" />
            <FeatureItem active text="Teleprompter Básico" />
            <FeatureItem active text="Organização de Ideias" />
            <FeatureItem inactive text="Geração de Conteúdo com IA" />
            <FeatureItem inactive text="Roteiros Automáticos" />
            <FeatureItem inactive text="Planejamento Semanal em 1 Clique" />
          </div>

          {currentPlan === 'FREE' ? (
            <button disabled className="w-full py-5 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest cursor-default border border-white/5">
              Seu Plano Atual
            </button>
          ) : (
            <button onClick={onDowngrade} className="w-full py-5 bg-transparent text-slate-500 hover:text-white rounded-2xl font-black uppercase text-xs tracking-widest border border-white/10 hover:border-white/30 transition-all">
              Voltar para o Free
            </button>
          )}
        </div>

        {/* PLANO STARTER */}
        <div className={`bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] border transition-all relative overflow-hidden group ${currentPlan === 'PAID' ? 'border-brand-500 shadow-2xl shadow-brand-500/20' : 'border-brand-500/30 hover:border-brand-500/60'}`}>
          {/* Destaque Visual */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none group-hover:bg-brand-600/20 transition-all duration-700"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/30">Aceleração com IA</span>
              <h3 className="text-3xl font-black text-white mt-4 mb-2">Starter</h3>
              <p className="text-brand-100 text-sm font-medium">Para quem quer produzir conteúdo em segundos.</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-5xl font-black text-white">R$ 29</span>
                <span className="text-slate-400 font-bold ml-1 text-sm">/mês</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-2">+ Custo da sua própria chave (BYOK)</p>
            </div>

            <div className="space-y-4 mb-10">
              <FeatureItem active highlight text="Tudo do plano Free" />
              <FeatureItem active highlight text="Gerador de Posts Ilimitado (IA)" />
              <FeatureItem active highlight text="Criador de Roteiros de Vídeo (IA)" />
              <FeatureItem active highlight text="Calendário Automático (7 dias)" />
              <FeatureItem active highlight text="Traga sua própria Chave (BYOK)" />
              <FeatureItem active highlight text="Histórico Completo" />
            </div>

            {currentPlan === 'PAID' ? (
              <button disabled className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-default shadow-lg shadow-brand-500/20">
                <i className="fas fa-check mr-2"></i> Plano Ativo
              </button>
            ) : (
              <button onClick={onUpgrade} className="w-full py-5 bg-white text-brand-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                Assinar Starter
              </button>
            )}
            
            <p className="text-center mt-4 text-[9px] text-slate-500 font-medium">
              Pagamento seguro. Cancele quando quiser. <br/>
              A chave da API (OpenAI/Gemini) é inserida por você.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string; active: boolean; highlight?: boolean; inactive?: boolean }> = ({ text, active, highlight, inactive }) => (
  <div className={`flex items-center gap-3 ${inactive ? 'opacity-40' : ''}`}>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${inactive ? 'bg-white/5 text-slate-500' : (highlight ? 'bg-brand-500 text-white' : 'bg-white/10 text-white')}`}>
      <i className={`fas ${inactive ? 'fa-minus' : 'fa-check'}`}></i>
    </div>
    <span className={`text-sm font-bold ${highlight ? 'text-white' : 'text-slate-400'}`}>{text}</span>
  </div>
);

export default Pricing;
