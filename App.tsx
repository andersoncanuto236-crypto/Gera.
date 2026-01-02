
import React, { useState } from 'react';
import { ViewState } from './types';
import Generator from './components/Generator';
import CalendarGenerator from './components/CalendarGenerator';
import Pricing from './components/Pricing';
import SettingsModal from './components/SettingsModal';
import Login from './components/Login';
import AIAgent from './components/AIAgent';
import History from './components/History';
import Dashboard from './components/Dashboard';
import Notes from './components/Notes';
import Management from './components/Management';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import { useSettings } from './hooks/useSettings';
import { useScore } from './hooks/useScore';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  
  const { settings, setSettings } = useSettings();
  const { score, handleAction } = useScore();

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

  return (
    <div className="min-h-screen flex text-slate-200 font-sans selection:bg-brand-500/30 selection:text-white">
      <Sidebar
        score={score}
        view={view}
        settings={settings}
        onNavigate={handleNavigation}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 md:ml-80 flex flex-col min-h-screen relative">
        <MobileHeader score={score} onOpenSettings={() => setIsSettingsOpen(true)} />

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
