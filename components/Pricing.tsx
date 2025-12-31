
import React, { useState } from 'react';

const Pricing: React.FC = () => {
  const [postsCount, setPostsCount] = useState(50);
  const [hasAgencyTools, setHasAgencyTools] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 pb-32 animate-fade-in-up">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Escolha sua Potência<span className="text-brand-600">.</span></h2>
        <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">Dos primeiros passos à dominação absoluta do nicho.</p>
        
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-xs font-black uppercase tracking-widest ${!compareMode ? 'text-white' : 'text-slate-500'}`}>Visualização Cards</span>
          <button onClick={() => setCompareMode(!compareMode)} className="w-14 h-8 bg-white/10 rounded-full relative p-1 transition-all">
            <div className={`w-6 h-6 bg-brand-600 rounded-full shadow-lg transition-transform ${compareMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-xs font-black uppercase tracking-widest ${compareMode ? 'text-white' : 'text-slate-500'}`}>Tabela Técnica</span>
        </div>
      </div>

      {!compareMode ? (
        <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-20">
          {/* FREE */}
          <div className="glass-panel p-10 rounded-[40px] flex flex-col border-white/5 hover:border-brand-500/20 transition-all">
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-2">Free</h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-black text-white">R$ 0</span>
                <span className="text-slate-500 font-bold ml-1">/mês</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-400"><i className="fas fa-check text-brand-500"></i> 10 posts por mês</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-400"><i className="fas fa-check text-brand-500"></i> Assistente IA Básico</li>
            </ul>
            <button className="w-full py-5 bg-white/5 text-slate-500 rounded-3xl font-black uppercase text-xs">Seu Plano</button>
          </div>

          {/* PRO */}
          <div className="bg-brand-600 p-10 rounded-[40px] flex flex-col text-white shadow-2xl scale-105 z-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="mb-10 relative z-10">
              <h3 className="text-xl font-bold text-brand-200 uppercase tracking-widest mb-2">Pro Creator</h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-black">R$ 59</span>
                <span className="text-brand-200 font-bold ml-1">/mês</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-1 relative z-10">
              <li className="flex items-center gap-3 text-sm font-bold"><i className="fas fa-check text-brand-200"></i> Ilimitado (Estratégico)</li>
              <li className="flex items-center gap-3 text-sm font-bold"><i className="fas fa-check text-brand-200"></i> Dashboard de Growth</li>
              <li className="flex items-center gap-3 text-sm font-bold"><i className="fas fa-check text-brand-200"></i> Exportação p/ Google</li>
              <li className="flex items-center gap-3 text-sm font-bold"><i className="fas fa-check text-brand-200"></i> Auditoria Profunda 360°</li>
            </ul>
            <button className={`w-full py-5 bg-white text-brand-600 rounded-3xl font-black shadow-xl uppercase text-xs ${buttonHoverClasses}`}>Assinar Agora</button>
          </div>

          {/* ENTERPRISE */}
          <div className="glass-panel p-10 rounded-[40px] flex flex-col border-white/5 relative overflow-hidden">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-brand-500 uppercase tracking-widest mb-2">Enterprise</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-white">Consultar Vendas</span>
              </div>
            </div>
            <div className="space-y-6 flex-1">
               <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                 <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2">Personalização Total</p>
                 <p className="text-sm text-slate-400 font-medium">Escolha todos os recursos que sua empresa precisa para escalar a presença digital.</p>
               </div>
               <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><i className="fas fa-plus text-brand-500"></i> Multi-contas</li>
                 <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><i className="fas fa-plus text-brand-500"></i> API Exclusiva</li>
                 <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><i className="fas fa-plus text-brand-500"></i> Suporte Prioritário</li>
               </ul>
            </div>
            <button className={`w-full py-5 bg-brand-600 text-white rounded-3xl font-black mt-8 uppercase text-xs ${buttonHoverClasses}`}>Falar Conosco</button>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-[40px] overflow-hidden shadow-2xl border-white/5 animate-fade-in">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="p-8 font-black text-xs uppercase text-slate-500 tracking-widest">Recurso Estratégico</th>
                <th className="p-8 font-black text-xs text-center uppercase">Free</th>
                <th className="p-8 font-black text-xs text-center uppercase text-brand-500">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { f: 'Estrategista IA Sênior', free: 'Básico', pro: 'Full Persona' },
                { f: 'Humanização de Texto (Sem Jargões)', free: '—', pro: '✓' },
                { f: 'Dashboard de Métricas/Metas', free: '—', pro: '✓' },
                { f: 'Deep Analysis Mensal', free: '—', pro: '✓' },
                { f: 'Horário de Postagem Sugerido', free: '—', pro: '✓' },
                { f: 'Espaço de Anotações', free: '✓', pro: 'Ilimitado' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-8 font-black text-slate-300 text-sm">{row.f}</td>
                  <td className="p-8 text-center text-slate-500 font-bold">{row.free}</td>
                  <td className="p-8 text-center text-brand-500 font-black">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Pricing;
