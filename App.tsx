
import React, { useState, useEffect } from 'react';
import { ViewState, UserSettings } from './types';
import Generator from './components/Generator';
import CalendarGenerator from './components/CalendarGenerator';
import Pricing from './components/Pricing';
import SettingsModal from './components/SettingsModal';
import Login from './components/Login';
import AIAgent from './components/AIAgent';
import History from './components/History';
import Dashboard from './components/Dashboard';
import Notes from './components/Notes';
import DeepAnalysis from './components/DeepAnalysis';
import Management from './components/Management';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [score, setScore] = useState(0);
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('gera_settings');
    return saved ? JSON.parse(saved) : {
      businessName: '',
      city: '',
      niche: '',
      audience: '',
      tone: '',
      jobTitle: '',
      avatar: '',
      metricLabels: { likes: 'Curtidas', views: 'Views', conversions: 'Conversões' }
    };
  });

  useEffect(() => {
    localStorage.setItem('gera_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const savedScore = parseInt(localStorage.getItem('gera_score') || '0');
    setScore(savedScore);
  }, []);

  const handleAction = (points: number) => {
    const newScore = Math.min(100, score + points);
    setScore(newScore);
    localStorage.setItem('gera_score', newScore.toString());
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    setView('home');
    if (!settings.businessName || !settings.niche) {
      setTimeout(() => setIsSettingsOpen(true), 500);
    }
  };

  if (view === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  const isProfileConfigured = !!settings.niche && !!settings.businessName;

  const handleNavigation = (targetView: ViewState) => {
    if (!isProfileConfigured && ['generator', 'calendar', 'dashboard', 'notes', 'history', 'management'].includes(targetView)) {
      alert("Por favor, configure seu perfil de negócio primeiro.");
      setIsSettingsOpen(true);
      return;
    }
    setView(targetView);
  };

  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="relative flex flex-col items-center justify-center py-12 md:py-32 px-4 text-center space-y-12 animate-fade-in-up">
            <div className="glass-card px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block mb-2 text-brand-500 border-brand-500/20 shadow-xl shadow-brand-500/5">
              Inteligência Estratégica
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <div className="logo-shape shadow-2xl animate-float">
                <span className="text-white text-4xl font-black">G</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-extrabold text-white tracking-tighter">
                Gera<span className="text-brand-600">.</span>
              </h1>
            </div>

            <p className="text-xl md:text-3xl font-light text-slate-300 max-w-3xl leading-relaxed">
              Olá, <strong className="text-white">{userName}</strong>. Pronto para dominar o nicho de 
              <span className="text-brand-600 font-bold italic"> {settings.niche || 'seu negócio'}</span>?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 mt-6">
              <button onClick={() => handleNavigation('generator')} className={`bg-brand-600 text-white px-14 py-6 rounded-[32px] text-lg font-black shadow-2xl shadow-brand-500/30 hover:bg-brand-700 ${buttonHoverClasses}`}>
                <i className="fas fa-magic mr-3"></i> Criar Conteúdo
              </button>
              <button onClick={() => handleNavigation('management')} className={`glass-panel text-white px-14 py-6 rounded-[32px] text-lg font-black hover:bg-white/10 shadow-xl border-white/10 ${buttonHoverClasses}`}>
                <i className="fas fa-chess mr-3"></i> Ponto de Gestão
              </button>
            </div>
          </div>
        );
      case 'generator': return <Generator settings={settings} onAction={() => handleAction(5)} />;
      case 'calendar': return <CalendarGenerator settings={settings} onAction={() => handleAction(3)} />;
      case 'dashboard': return <Dashboard settings={settings} onUpdateSettings={setSettings} />;
      case 'management': return <Management settings={settings} />;
      case 'notes': return <Notes onAction={() => handleAction(1)} />;
      case 'history': return <History settings={settings} />;
      case 'pricing': return <Pricing />;
      default: return null;
    }
  };

  const ScoreWidget = () => (
    <div className="mb-8 px-6">
       <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[24px] p-5 border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-brand-500/20 transition"></div>
         <div className="flex justify-between items-end mb-2">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Autoridade Digital</span>
           <span className="text-xl font-black text-white">{score}<span className="text-xs text-slate-500">/100</span></span>
         </div>
         <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
           <div className="bg-brand-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]" style={{ width: `${score}%` }}></div>
         </div>
         <p className="text-[8px] text-slate-500 mt-2 font-bold uppercase tracking-widest text-right">Gera Score</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen flex text-slate-200 font-sans selection:bg-brand-500/30 selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-80 glass-panel border-r border-white/5 fixed h-full z-20">
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="logo-shape-sm shadow-lg"><span className="text-white text-xl font-black">G</span></div>
            <span className="font-black text-3xl text-white tracking-tighter">Gera.</span>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className={`text-slate-500 hover:text-white transition ${buttonHoverClasses}`}>
            <i className="fas fa-cog text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
          <ScoreWidget />
          
          {[
            { id: 'home', icon: 'fa-home', label: 'Início' },
            { id: 'management', icon: 'fa-chess', label: 'Gestão' },
            { id: 'dashboard', icon: 'fa-chart-pie', label: 'Métricas' },
            { id: 'generator', icon: 'fa-wand-sparkles', label: 'Criar' },
            { id: 'calendar', icon: 'fa-calendar-alt', label: 'Agenda' },
            { id: 'notes', icon: 'fa-sticky-note', label: 'Notas' },
            { id: 'history', icon: 'fa-history', label: 'Histórico' },
            { id: 'pricing', icon: 'fa-gem', label: 'Planos' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => handleNavigation(item.id as ViewState)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${view === item.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'} ${buttonHoverClasses}`}
            >
              <i className={`fas ${item.icon} w-5`}></i> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
           <div className="bg-slate-900/80 rounded-[32px] p-5 border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                  {settings.avatar ? <img src={settings.avatar} className="w-full h-full object-cover" /> : <span className="text-xl font-black">G</span>}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black truncate">{settings.businessName || 'Configurar'}</p>
                  <p className="text-[9px] text-brand-500 font-black uppercase tracking-widest truncate">{settings.niche || 'Estrategia'}</p>
                </div>
              </div>
              <button onClick={() => setIsSettingsOpen(true)} className={`w-full py-3 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/5 ${buttonHoverClasses}`}>
                Configurações
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-80 flex flex-col min-h-screen relative">
        {/* Mobile Header */}
        <div className="md:hidden glass-panel border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="logo-shape-sm"><span className="text-white font-bold">G</span></div>
            <span className="font-black text-xl text-white">Gera.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/50 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              <span className="text-[10px] font-black text-white">{score}</span>
            </div>
            <button onClick={() => setIsSettingsOpen(true)} className={`w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 ${buttonHoverClasses}`}>
               <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-12 max-w-7xl mx-auto w-full flex-1 z-10">
          {renderContent()}
        </div>

        {isProfileConfigured && <AIAgent settings={settings} />}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
};

export default App;
