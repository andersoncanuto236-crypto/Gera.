
import React, { useState, useEffect } from 'react';
import { ViewState, UserSettings, CalendarDay } from './types';
import Login from './components/Login';
import SettingsModal from './components/SettingsModal';
import Today from './components/Today';
import CalendarGenerator from './components/CalendarGenerator';
import Generator from './components/Generator';
import Register from './components/Register';
import Decision from './components/Decision';
import { SecureStorage } from './services/security';

const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 60, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="28" cy="46" r="10" fill="#5E90C9" />
    <circle cx="48" cy="28" r="10" fill="#5E90C9" />
    <circle cx="68" cy="48" r="10" fill="#5E90C9" />
    <circle cx="48" cy="68" r="10" fill="#5E90C9" />
    <path d="M28 46C38 46 38 28 48 28M48 28C58 28 58 48 68 48M68 48C58 48 58 68 48 68M48 68C38 68 38 46 28 46Z" stroke="#5E90C9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Utilizando SecureStorage para carregar as configurações criptografadas
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = SecureStorage.getItem('settings');
    return saved || {
      businessName: '',
      city: '',
      niche: '',
      audience: '',
      tone: '',
      jobTitle: '',
      avatar: ''
    };
  });

  useEffect(() => {
    const session = SecureStorage.getItem('session');
    if (session) {
      setUserName(session.name);
      if (!settings.avatar && session.avatar) {
        setSettings(prev => ({ ...prev, avatar: session.avatar }));
      }
      setView('today');
    }
  }, []);

  useEffect(() => {
    SecureStorage.setItem('settings', settings);
  }, [settings]);

  const handleLogin = (name: string, avatar?: string) => {
    setUserName(name);
    if (avatar && !settings.avatar) {
      setSettings(prev => ({ ...prev, avatar }));
    }
    setView('today');
    if (!settings.businessName || !settings.niche) {
      setTimeout(() => setIsSettingsOpen(true), 500);
    }
  };

  const handleLogout = () => {
    SecureStorage.removeItem('session');
    setUserName('');
    setView('login');
  };

  if (view === 'login') return <Login onLogin={handleLogin} />;

  const handleNavigation = (targetView: ViewState) => {
    if (!settings.niche && targetView !== 'today') {
      setIsSettingsOpen(true);
      return;
    }
    setView(targetView);
  };

  const renderContent = () => {
    switch (view) {
      case 'today': return <Today settings={settings} onNavigate={handleNavigation} />;
      case 'calendar': return <CalendarGenerator settings={settings} />;
      case 'create': return <Generator settings={settings} />;
      case 'register': return <Register settings={settings} />;
      case 'decision': return <Decision settings={settings} />;
      default: return null;
    }
  };

  const navItems = [
    { id: 'today', icon: 'fa-bolt', label: 'Hoje' },
    { id: 'calendar', icon: 'fa-calendar-alt', label: 'Agenda' },
    { id: 'create', icon: 'fa-plus-circle', label: 'Criar' },
    { id: 'register', icon: 'fa-list-check', label: 'Registro' },
    { id: 'decision', icon: 'fa-chess', label: 'Decisão' },
  ];

  return (
    <div className="min-h-screen flex text-slate-200 font-sans">
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-white/5 fixed h-full z-20">
        <div className="p-10 flex items-center gap-3">
          <LogoIcon size={32} />
          <span className="font-bold text-2xl text-white tracking-tighter">Gera.</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNavigation(item.id as ViewState)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${view === item.id ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <i className={`fas ${item.icon} w-5 text-center`}></i> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-4">
           <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 text-slate-500 hover:text-white transition group">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 overflow-hidden border border-white/10 group-hover:border-brand-500 transition-colors">
                 {settings.avatar ? <img src={settings.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">G</div>}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest truncate max-w-[100px]">{settings.businessName || 'Perfil'}</p>
                <p className="text-[8px] text-slate-600 font-bold uppercase">Configurar</p>
              </div>
           </button>
           <button onClick={handleLogout} className="w-full text-center text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-red-500 transition-colors py-2">Sair da Conta</button>
        </div>
      </aside>
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        <div className="md:hidden fixed bottom-6 left-6 right-6 glass-panel rounded-3xl border border-white/10 flex justify-around p-4 z-50 shadow-2xl">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNavigation(item.id as ViewState)} className={`flex flex-col items-center gap-1 ${view === item.id ? 'text-brand-500' : 'text-slate-500'}`}>
              <i className={`fas ${item.icon} text-lg`}></i>
              <span className="text-[8px] font-black uppercase">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-6 md:p-12 max-w-6xl mx-auto w-full flex-1 mb-24 md:mb-0">
          {renderContent()}
        </div>
      </main>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onSave={setSettings} />
    </div>
  );
};

export default App;
