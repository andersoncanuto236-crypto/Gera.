
import React from 'react';

const Pricing: React.FC = () => {
  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 pb-32 animate-fade-in-up">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Planos<span className="text-brand-600">.</span></h2>
        <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">Comece grátis. Escale quando estiver pronto.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-20">
        {/* FREE */}
        <div className="glass-panel p-10 rounded-[40px] flex flex-col border-white/5 hover:border-brand-500/20 transition-all">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-2">Starter</h3>
            <div className="flex items-baseline">
              <span className="text-5xl font-black text-white">R$ 0</span>
              <span className="text-slate-500 font-bold ml-1">/mês</span>
            </div>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-400"><i className="fas fa-check text-brand-500"></i> Geração de Posts</li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-400"><i className="fas fa-check text-brand-500"></i> Histórico Básico</li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-400"><i className="fas fa-check text-brand-500"></i> 1 Projeto</li>
          </ul>
          <button className="w-full py-5 bg-white/5 text-slate-500 rounded-3xl font-black uppercase text-xs">Plano Atual</button>
        </div>

        {/* PRO */}
        <div className="bg-brand-600 p-10 rounded-[40px] flex flex-col text-white shadow-2xl scale-105 z-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="mb-10 relative z-10">
            <h3 className="text-xl font-bold text-brand-200 uppercase tracking-widest mb-2">Pro Creator</h3>
            <div className="flex items-baseline">
              <span className="text-5xl font-black">R$ 49</span>
              <span className="text-brand-200 font-bold ml-1">/mês</span>
            </div>
          </div>
          <ul className="space-y-4 mb-10 flex-1 relative z-10">
            <li className="flex items-center gap-3 text-sm font-bold"><i className="fas fa-check text-brand-200"></i> Gerações Ilimitadas</li>
            <li className="flex items-center gap-3 text-sm font-bold"><i className="fas fa-check text-brand-200"></i> Multiplicador de Conteúdo</li>
            <li className="flex items-center gap-3 text-sm font-bold"><i className="fas fa-check text-brand-200"></i> Modo Robin Hood (Remix)</li>
            <li className="flex items-center gap-3 text-sm font-bold"><i className="fas fa-check text-brand-200"></i> Teleprompter Integrado</li>
          </ul>
          <button className={`w-full py-5 bg-white text-brand-600 rounded-3xl font-black shadow-xl uppercase text-xs ${buttonHoverClasses}`}>Assinar Pro</button>
        </div>

        {/* ENTERPRISE */}
        <div className="glass-panel p-10 rounded-[40px] flex flex-col border-white/5 relative overflow-hidden opacity-60">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-600 uppercase tracking-widest mb-2">Agency</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-black text-white">Em Breve</span>
            </div>
          </div>
          <div className="space-y-6 flex-1">
             <p className="text-sm text-slate-400 font-medium">Para agências que gerenciam múltiplos clientes e precisam de fluxo colaborativo.</p>
             <ul className="space-y-3">
               <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><i className="fas fa-lock text-slate-700"></i> Multi-Projetos</li>
               <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><i className="fas fa-lock text-slate-700"></i> API Dedicada</li>
             </ul>
          </div>
          <button disabled className="w-full py-5 bg-white/5 text-slate-600 rounded-3xl font-black mt-8 uppercase text-xs cursor-not-allowed">Aguarde</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
