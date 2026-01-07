
import React, { useState, useEffect } from 'react';
import { ViewState, UserSettings } from './types';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SettingsModal from './components/SettingsModal';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import History from './components/History';
import CalendarGenerator from './components/CalendarGenerator';
import Management from './components/Management';
import Teleprompter from './components/Teleprompter';
import { SecureStorage } from './services/security';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [teleprompterText, setTeleprompterText] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = SecureStorage.getItem('settings');
    return saved || { businessName: '', niche: '', audience: '', tone: '' };
  });

  useEffect(() => {
    const session = SecureStorage.getItem('session');
    if (session) {
      setView('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setView('dashboard');
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    SecureStorage.setItem('settings', newSettings);
  };

  const handleLogout = () => {
    SecureStorage.removeItem('session');
    setView('landing');
  };

  // Fluxo Inicial: Landing Page -> Login
  if (view === 'landing') return <LandingPage onStart={() => setView('login')} />;
  if (view === 'login') return <Login onLogin={handleLogin} />;

  // Se estiver logado mas sem configurações, mostra o Modal de Configuração como Bloqueio
  const needsOnboarding = !settings.businessName;

  return (
    <div className="min-h-screen flex flex-col bg-[#0D171D] text-slate-200 font-sans">
      {needsOnboarding && (
        <SettingsModal 
          isOpen={true} 
          settings={settings} 
          onSave={handleSaveSettings} 
        />
      )}

      {/* Teleprompter Global Overlay */}
      {teleprompterText && (
        <Teleprompter 
          text={teleprompterText} 
          onClose={() => setTeleprompterText(null)} 
        />
      )}

      {/* Navegação Simplificada */}
      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto z-40 bg-[#0D171D]/90 backdrop-blur-xl border-t md:border-b md:border-t-0 border-white/5 py-4 px-6 flex justify-center md:justify-between items-center shadow-2xl">
         <div className="hidden md:flex items-center gap-2 group cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs group-hover:rotate-12 transition-transform">G</div>
            <span className="font-bold text-white tracking-tighter">Gera.</span>
         </div>
         
         <div className="flex items-center gap-8 md:gap-6 bg-white/5 md:bg-transparent px-8 py-3 rounded-full md:p-0 border border-white/5 md:border-0 shadow-2xl md:shadow-none">
            {[
              { id: 'dashboard', icon: 'fa-home', label: 'Início' },
              { id: 'create', icon: 'fa-plus-circle', label: 'Criar' },
              { id: 'calendar', icon: 'fa-calendar-alt', label: 'Agenda' },
              { id: 'management', icon: 'fa-chess-knight', label: 'Gestão' },
              { id: 'history', icon: 'fa-history', label: 'Arquivo' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`flex flex-col md:flex-row items-center gap-2 transition-all ${view === item.id ? 'text-brand-500 scale-110 md:scale-100 font-bold' : 'text-slate-500 hover:text-white'}`}
              >
                <i className={`fas ${item.icon} text-lg md:text-sm`}></i>
                <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">{item.label}</span>
              </button>
            ))}
         </div>

         <button onClick={handleLogout} className="hidden md:block text-[10px] font-black uppercase text-slate-600 hover:text-red-500 tracking-widest transition-colors">Sair</button>
      </nav>

      <main className="flex-1 p-6 pb-32 md:pt-28 md:pb-12 max-w-5xl mx-auto w-full">
        {view === 'dashboard' && <Dashboard settings={settings} onNavigate={setView as any} />}
        {view === 'create' && <Generator settings={settings} onOpenTeleprompter={(text) => setTeleprompterText(text)} />}
        {view === 'calendar' && <CalendarGenerator settings={settings} />}
        {view === 'management' && <Management settings={settings} />}
        {view === 'history' && <History />}
      </main>
    </div>
  );
};

export default App;
