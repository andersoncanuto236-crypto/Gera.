
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#0D171D] text-white selection:bg-brand-500 selection:text-white relative overflow-hidden">
      
      {/* Background Abstract Layer */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-500/10 rounded-full blur-[120px] animate-pulse-subtle pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-brand-500/5 rounded-full blur-[120px] animate-pulse-subtle pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navbar Minimalista */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-30 animate-fade-in">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform">G</div>
          <span className="font-bold text-2xl tracking-tighter">Gera<span className="text-brand-500">.</span></span>
        </div>
        <button 
          onClick={onStart}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 backdrop-blur-md"
        >
          Acessar App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative z-20">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 border border-brand-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            Inteligência Artificial de Elite
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 uppercase italic">
            Domine suas <br />
            {/* Ajuste crítico: padding-bottom generoso para evitar corte do texto gradiente */}
            <span className="block pb-10 pt-2 bg-gradient-to-r from-brand-500 via-white to-brand-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(94,144,201,0.5)]">
              Redes Sociais
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-200 text-lg md:text-xl font-medium leading-relaxed mb-12 drop-shadow-md">
            Crie roteiros magnéticos, posts de autoridade e gerencie seu calendário com IA. O fim da página em branco para o seu negócio.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={onStart}
              className="w-full md:w-auto bg-brand-600 hover:bg-brand-500 text-white px-12 py-7 rounded-[32px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-brand-500/40 transition-all hover:-translate-y-2 active:translate-y-0 flex items-center justify-center gap-4 group"
            >
              Começar Agora Grátis <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
            
            <div className="flex items-center gap-4 bg-white/5 rounded-full px-6 py-3 border border-white/5 backdrop-blur-sm">
               <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0D171D] bg-zinc-800 flex items-center justify-center overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest text-left">
                +2k Estratégistas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: Teleprompter */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5 bg-[#0D171D]">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8 text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="text-brand-500 font-black uppercase text-[10px] tracking-widest">Recurso Exclusivo</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-white">O Teleprompter que salva seu Reels.</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Pare de gaguejar ou esquecer o roteiro. Nossa IA gera o script e o teleprompter flutuante permite que você grave olhando fixo para o seu público.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                 {['Velocidade IA', 'Fonte Gigante', 'Modo Espelho', 'Auto-Scroll'].map(feat => (
                   <div key={feat} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors">
                     <i className="fas fa-check text-brand-500"></i> {feat}
                   </div>
                 ))}
              </div>
           </div>

           {/* Animated Mockup */}
           <div className="relative group animate-float">
              <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full group-hover:bg-brand-500/30 transition-colors"></div>
              <div className="relative bg-zinc-900 border-[10px] border-zinc-800 rounded-[60px] aspect-[9/16] max-w-[320px] mx-auto overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/80 to-transparent z-10 p-8 flex justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                 </div>
                 
                 <div className="pt-40 px-8 text-center space-y-8 animate-pulse">
                    <p className="text-2xl font-black text-white/90 leading-snug">"Olá pessoal! Hoje vou mostrar como a IA pode transformar..."</p>
                    <p className="text-2xl font-black text-white/40 leading-snug">"...seu negócio em uma máquina de vendas no Instagram!"</p>
                 </div>

                 <div className="absolute bottom-12 left-0 right-0 px-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center">
                       <i className="fas fa-pause text-white"></i>
                       <div className="w-1/2 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-brand-500"></div>
                       </div>
                       <i className="fas fa-cog text-white"></i>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Grid de Benefícios */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 z-10 relative bg-[#0D171D]">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: 'fa-wand-sparkles', title: 'Criação Imediata', desc: 'Esqueça o bloqueio criativo. Gere roteiros, legendas e calendários em segundos.' },
            { icon: 'fa-shield-halved', title: 'Segurança Máxima', desc: 'Seus dados e estratégias são armazenados localmente e criptografados.' },
            { icon: 'fa-chart-pie', title: 'Visão Estratégica', desc: 'IA que analisa seu nicho e sugere os melhores horários e temas para postar.' }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-10 rounded-[40px] border-white/5 hover:border-brand-500/30 transition-all group hover:-translate-y-2">
              <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 text-2xl mb-8 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter text-white">{item.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-32 text-center border-t border-white/5 relative z-10 bg-[#0D171D]">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-brand-600 blur-2xl opacity-20 animate-pulse"></div>
          <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter uppercase relative text-white">Pare de postar,<br />comece a crescer.</h2>
        </div>
        <br />
        <button 
          onClick={onStart}
          className="bg-white text-slate-900 px-16 py-8 rounded-[32px] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto"
        >
          Acessar Plataforma <i className="fas fa-chevron-right"></i>
        </button>
        
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">© 2024 Gera. IA. Built for Professionals.</div>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <a href="#" className="hover:text-white transition">Privacidade</a>
             <a href="#" className="hover:text-white transition">Segurança</a>
             <a href="#" className="hover:text-white transition">Suporte</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
