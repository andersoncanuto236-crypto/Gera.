import React, { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { UserSettings } from './types';
import Landing from './src/pages/Landing';
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import AuthCallback from './src/pages/AuthCallback';
import ProtectedRoute from './src/routes/ProtectedRoute';
import { useAuth } from './src/contexts/AuthContext';
import { supabaseConfigError } from './src/lib/supabaseClient';
import SettingsModal from './components/SettingsModal';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import History from './components/History';
import CalendarGenerator from './components/CalendarGenerator';
import Teleprompter from './components/Teleprompter';
import TeleprompterInput from './components/TeleprompterInput';
import Pricing from './components/Pricing';
import SupabaseDataPanel from './components/SupabaseDataPanel';
import { SecureStorage } from './services/security';

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const { userPlan, profile, signOut } = useAuth();
  const [teleprompterText, setTeleprompterText] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = SecureStorage.getItem('settings');
    return saved || { businessName: '', niche: '', audience: '', tone: '', plan: 'FREE' };
  });

  useEffect(() => {
    setSettings((current) => ({ ...current, plan: userPlan }));
  }, [userPlan]);

  const handleSaveSettings = (newSettings: UserSettings) => {
    const updated = { ...newSettings, plan: userPlan } as UserSettings;
    setSettings(updated);
    SecureStorage.setItem('settings', updated);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleUpgrade = () => {
    navigate('/app/plans');
  };

  const needsOnboarding = !settings.businessName;

  const navItems = [
    { id: 'dashboard', icon: 'fa-home', label: 'Início', to: '/app', end: true },
    { id: 'create', icon: 'fa-plus-circle', label: 'Criar', to: '/app/create' },
    { id: 'teleprompter', icon: 'fa-video', label: 'Gravar', to: '/app/teleprompter' },
    { id: 'calendar', icon: 'fa-calendar-alt', label: 'Agenda', to: '/app/calendar' },
    { id: 'history', icon: 'fa-history', label: 'Arquivo', to: '/app/history' },
    { id: 'plans', icon: 'fa-crown', label: 'Planos', to: '/app/plans' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D171D] text-slate-200 font-sans">
      {needsOnboarding && (
        <SettingsModal
          isOpen={true}
          settings={settings}
          onSave={handleSaveSettings}
        />
      )}

      {teleprompterText && (
        <Teleprompter
          text={teleprompterText}
          onClose={() => setTeleprompterText(null)}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto z-40 bg-[#0D171D]/90 backdrop-blur-xl border-t md:border-b md:border-t-0 border-white/5 py-4 px-6 flex justify-center md:justify-between items-center shadow-2xl">
        <div className="hidden md:flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/app')}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs group-hover:rotate-12 transition-transform">G</div>
          <span className="font-bold text-white tracking-tighter">Gera.</span>
        </div>

        <div className="flex items-center gap-8 md:gap-6 bg-white/5 md:bg-transparent px-8 py-3 rounded-full md:p-0 border border-white/5 md:border-0 shadow-2xl md:shadow-none overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col md:flex-row items-center gap-2 transition-all min-w-[30px] ${
                  isActive ? 'text-brand-500 scale-110 md:scale-100 font-bold' : 'text-slate-500 hover:text-white'
                }`
              }
            >
              <i className={`fas ${item.icon} text-lg md:text-sm`}></i>
              <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${userPlan === 'PAID' ? 'text-brand-400 border-brand-500/30 bg-brand-500/10' : 'text-slate-500 border-white/10'}`}>
            {userPlan === 'PAID' ? 'Starter' : 'Free'}
          </span>
          <button onClick={handleLogout} className="text-[10px] font-black uppercase text-slate-600 hover:text-red-500 tracking-widest transition-colors">Sair</button>
        </div>
      </nav>

      <main className="flex-1 p-6 pb-32 md:pt-28 md:pb-12 max-w-5xl mx-auto w-full">
        <Routes>
          <Route
            path="/app"
            element={
              <>
                <Dashboard settings={settings} onNavigate={(path) => navigate(path)} />
                <div className="mt-10">
                  <SupabaseDataPanel />
                </div>
              </>
            }
          />
          <Route
            path="/app/create"
            element={
              <Generator
                settings={settings}
                onOpenTeleprompter={(text) => setTeleprompterText(text)}
                onUpdatePlan={handleUpgrade}
              />
            }
          />
          <Route
            path="/app/teleprompter"
            element={
              <TeleprompterInput
                settings={settings}
                onStart={(text) => setTeleprompterText(text)}
                onUpdatePlan={handleUpgrade}
              />
            }
          />
          <Route
            path="/app/calendar"
            element={<CalendarGenerator settings={settings} onUpdatePlan={handleUpgrade} />}
          />
          <Route path="/app/history" element={<History />} />
          <Route
            path="/app/plans"
            element={
              <Pricing
                currentPlan={userPlan}
                onUpgrade={handleUpgrade}
                onDowngrade={handleUpgrade}
              />
            }
          />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </main>

      {profile && (
        <div className="fixed bottom-24 right-6 hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[10px] uppercase tracking-widest text-slate-400">
          <span>{profile.email}</span>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  if (supabaseConfigError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D171D] text-slate-200 p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-black">Configuração do Supabase</h1>
          <p className="text-slate-400 text-sm">
            {supabaseConfigError} Atualize o ambiente e reinicie o app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
