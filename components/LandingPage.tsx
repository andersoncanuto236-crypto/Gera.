
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#0D171D] text-white selection:bg-brand-500 selection:text-white relative overflow-hidden font-sans">
      
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
          Entrar
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-16 text-center relative z-20">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 border border-brand-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            Suite Criativa All-in-One
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
            Crie Posts Profissionais.<br />
            <span className="block pb-10 pt-2 bg-gradient-to-r from-brand-400 via-white to-brand-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(94,144,201,0.5)]">
              Grave Agora.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-lg font-medium leading-relaxed mb-12 drop-shadow-md">
            A única plataforma que une <strong>IA Generativa</strong>, <strong>Planejamento Semanal</strong> e um <strong>Estúdio de Gravação</strong> completo. Do bloqueio criativo ao vídeo pronto em minutos.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={onStart}
              className="w-full md:w-auto bg-brand-600 hover:bg-brand-500 text-white px-12 py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-brand-500/40 transition-all hover:-translate-y-2 active:translate-y-0 flex items-center justify-center gap-4 group"
            >
              Começar Agora <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
            
            <div className="flex items-center gap-3 bg-white/5 rounded-full px-6 py-4 border border-white/5 backdrop-blur-sm">
               <div className="flex text-yellow-400 text-xs">
                 <i className="fas fa-star"></i>
                 <i className="fas fa-star"></i>
                 <i className="fas fa-star"></i>
                 <i className="fas fa-star"></i>
                 <i className="fas fa-star"></i>
               </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-left">
                Aprovado por Criadores
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker - Versatility Proof */}
      <div className="w-full overflow-hidden border-y border-white/5 bg-black/20 py-4 relative z-10 mb-10">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-8 text-slate-500 font-black uppercase text-xs tracking-[0.2em]">
           <span>Marketing Digital</span> <span className="text-brand-500">•</span>
           <span>Nutrição</span> <span className="text-brand-500">•</span>
           <span>Advocacia</span> <span className="text-brand-500">•</span>
           <span>Imóveis</span> <span className="text-brand-500">•</span>
           <span>Fitness</span> <span className="text-brand-500">•</span>
           <span>E-commerce</span> <span className="text-brand-500">•</span>
           <span>Psicologia</span> <span className="text-brand-500">•</span>
           <span>Tecnologia</span> <span className="text-brand-500">•</span>
           <span>Educação</span> <span className="text-brand-500">•</span>
           <span>Finanças</span> <span className="text-brand-500">•</span>
           <span>Marketing Digital</span> <span className="text-brand-500">•</span>
           <span>Nutrição</span> <span className="text-brand-500">•</span>
           <span>Advocacia</span> <span className="text-brand-500">•</span>
           <span>Imóveis</span> <span className="text-brand-500">•</span>
           <span>Fitness</span> <span className="text-brand-500">•</span>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}</style>
      </div>

      {/* Feature Section: Teleprompter & Recording */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 bg-[#0D171D]">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
           <div className="space-y-8 text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-500/10 px-3 py-1 rounded-full">Novo Recurso</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-white">Seu Estúdio de Bolso.</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Transforme roteiros em vídeos na hora. O <strong>Teleprompter Integrado</strong> rola o texto enquanto você grava. 
                <br /><span className="text-brand-400 font-bold">100% Privado:</span> O vídeo é salvo direto no seu dispositivo, não no app.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                 {[
                   { icon: 'fa-robot', txt: 'Roteiros com IA' },
                   { icon: 'fa-video', txt: 'Gravação HD' },
                   { icon: 'fa-lock', txt: 'Privacidade Total' }
                 ].map(item => (
                   <div key={item.txt} className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors">
                     <i className={`fas ${item.icon} text-brand-500`}></i> {item.txt}
                   </div>
                 ))}
              </div>
              <button onClick={onStart} className="text-brand-500 font-black uppercase text-xs tracking-widest hover:text-white transition mt-4 inline-flex items-center gap-2">
                Experimentar Teleprompter <i className="fas fa-chevron-right text-[10px]"></i>
              </button>
           </div>

           {/* Animated Mockup - Teleprompter UI */}
           <div className="relative group animate-float">
              <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full group-hover:bg-brand-500/30 transition-colors"></div>
              <div className="relative bg-black border-4 border-zinc-800 rounded-[40px] aspect-[9/16] max-w-[300px] mx-auto overflow-hidden shadow-2xl flex flex-col">
                 {/* Mock UI */}
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20"></div>
                 
                 {/* Video Area */}
                 <div className="flex-1 bg-zinc-900 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                       <i className="fas fa-user text-9xl text-zinc-700"></i>
                    </div>
                    {/* Scrolling Text */}
                    <div className="absolute inset-0 flex items-center justify-center px-6">
                       <div className="text-center space-y-6 opacity-90 animate-pulse">
                          <p className="text-xl font-bold text-white/40">"...a melhor estratégia para..."</p>
                          <p className="text-2xl font-black text-white bg-black/40 px-2 py-1 rounded">"...crescer seu perfil hoje..."</p>
                          <p className="text-xl font-bold text-white/40">"...é a consistência."</p>
                       </div>
                    </div>
                 </div>

                 {/* Recording Button */}
                 <div className="h-24 bg-black/80 backdrop-blur absolute bottom-0 w-full flex items-center justify-center border-t border-white/10">
                    <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                       <div className="w-12 h-12 bg-red-600 rounded-full animate-pulse"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Grid de Funcionalidades */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 z-10 relative bg-[#0D171D]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Como funciona?</h2>
          <p className="text-slate-400 font-medium">Três passos simples para dominar seu nicho.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Generator */}
          <div className="glass-panel p-10 rounded-[40px] border-white/5 hover:border-brand-500/50 transition-all group hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
               <i className="fas fa-bolt text-9xl text-white"></i>
            </div>
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 text-2xl mb-8">
              <i className="fas fa-pen-fancy"></i>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter text-white">1. Gere o Post</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Defina o objetivo (Vender, Educar, Engajar), escolha a plataforma e receba ganchos virais, conteúdo denso e CTAs prontos.
            </p>
          </div>

          {/* Card 2: Calendar */}
          <div className="glass-panel p-10 rounded-[40px] border-white/5 hover:border-brand-500/50 transition-all group hover:-translate-y-2 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
               <i className="fas fa-calendar-alt text-9xl text-white"></i>
            </div>
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 text-2xl mb-8">
              <i className="fas fa-calendar-week"></i>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter text-white">2. Planeje a Semana</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Receba um plano de 7 dias com formatos (Reels, Stories, Posts) e temas estratégicos alinhados ao seu nicho.
            </p>
          </div>

           {/* Card 3: Teleprompter */}
           <div className="glass-panel p-10 rounded-[40px] border-white/5 hover:border-brand-500/50 transition-all group hover:-translate-y-2 relative overflow-hidden bg-white/5">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
               <i className="fas fa-video text-9xl text-white"></i>
            </div>
            <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 text-2xl mb-8">
              <i className="fas fa-camera"></i>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter text-white">3. Grave e Baixe</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Transforme textos em vídeo. Use o teleprompter, grave sem erros e baixe o arquivo para seu dispositivo.
            </p>
          </div>
        </div>
      </section>

      {/* API KEY EXPLANATION (BYOK) */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 z-10 relative bg-[#0D171D]">
         <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            <div className="space-y-8 animate-fade-in-up">
               <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
                     Pague menos pelo <br/>
                     <span className="text-brand-500">dobro de poder.</span>
                  </h2>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed">
                     A maioria dos apps cobra caro porque revende a inteligência. 
                     No Gera., você conecta sua própria chave (API Key) e paga preço de custo direto ao fornecedor (Google).
                  </p>
               </div>

               <div className="space-y-4">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex gap-4">
                     <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 text-xl shrink-0">
                        <i className="fas fa-wallet"></i>
                     </div>
                     <div>
                        <h4 className="text-white font-black uppercase text-sm mb-1">Economia Real</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                           Você só gasta o que usa. O Google oferece um plano gratuito generoso para testes e uso leve.
                        </p>
                     </div>
                  </div>
                  
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex gap-4">
                     <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 text-xl shrink-0">
                        <i className="fas fa-key"></i>
                     </div>
                     <div>
                        <h4 className="text-white font-black uppercase text-sm mb-1">O que é a Chave?</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                           Imagine que o Gera é o carro de luxo, e a API Key é o combustível. Você compra o combustível direto na refinaria (Google), sem pagar taxa extra.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="glass-panel p-8 md:p-10 rounded-[40px] border-brand-500/20 shadow-2xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <i className="fab fa-google text-9xl text-white"></i>
               </div>
               
               <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Como pegar sua chave</h3>
               
               <div className="space-y-6 relative z-10">
                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs shrink-0">1</div>
                     <div>
                        <p className="text-white font-bold text-sm mb-1">Acesse o Google AI Studio</p>
                        <p className="text-slate-400 text-xs">Vá para <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline decoration-brand-500/30">aistudio.google.com</a> e faça login com seu Gmail.</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs shrink-0">2</div>
                     <div>
                        <p className="text-white font-bold text-sm mb-1">Crie a Chave</p>
                        <p className="text-slate-400 text-xs">Clique no botão azul <strong>"Create API Key"</strong>.</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs shrink-0">3</div>
                     <div>
                        <p className="text-white font-bold text-sm mb-1">Copie e Use</p>
                        <p className="text-slate-400 text-xs">Copie o código gerado (começa com "AIza...") e cole dentro do Gera. quando for pedido.</p>
                     </div>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                     100% Seguro. Sua chave nunca é salva em nossos servidores.
                  </p>
               </div>
            </div>

         </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-white/5 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Dúvidas Frequentes</h2>
          <p className="text-slate-400 font-medium">Tudo o que você precisa saber antes de começar.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "Preciso saber programar?",
              a: "Não! O modelo BYOK é apenas copiar um código (sua chave) e colar no Gera. É feito uma única vez por sessão."
            },
            {
              q: "Funciona no celular?",
              a: "Sim! O Gera. é um Web App otimizado. Você pode gerar posts e usar o teleprompter direto do seu iPhone ou Android."
            },
            {
              q: "E se eu cancelar o plano pago?",
              a: "Você volta automaticamente para o plano Free (Manual). Seus dados salvos continuam acessíveis, mas a IA é bloqueada."
            },
            {
              q: "Meus dados de negócio são usados?",
              a: "Sua privacidade é prioridade. Usamos armazenamento local no seu navegador. Ninguém mais vê suas estratégias."
            }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-8 rounded-[32px] border-white/5 hover:border-brand-500/30 transition-all">
               <h4 className="text-white font-black text-sm uppercase tracking-wide mb-3">{item.q}</h4>
               <p className="text-slate-400 text-xs leading-relaxed font-medium">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-24 text-center border-t border-white/5 relative z-10 bg-[#0D171D]">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-brand-600 blur-3xl opacity-20 animate-pulse"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase relative text-white">Sua audiência<br />está esperando.</h2>
        </div>
        <br />
        <button 
          onClick={onStart}
          className="bg-white text-slate-900 px-16 py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto"
        >
          Criar Conta Grátis
        </button>
        
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">© 2024 Gera. App.</div>
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
             Feito para quem produz.
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
