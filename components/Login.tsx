
import React, { useState } from 'react';
import { SecureStorage } from '../services/security';

const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 60, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="28" cy="46" r="10" fill="#5E90C9" />
    <circle cx="48" cy="28" r="10" fill="#5E90C9" />
    <circle cx="68" cy="48" r="10" fill="#5E90C9" />
    <circle cx="48" cy="68" r="10" fill="#5E90C9" />
    <path d="M28 46C38 46 38 28 48 28M48 28C58 28 58 48 68 48M68 48C58 48 58 68 48 68M48 68C38 68 38 46 28 46Z" stroke="#5E90C9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface LoginProps {
  onLogin: (name: string, avatar?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      if ((window as any).aistudio) {
        try {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (!hasKey) {
             await (window as any).aistudio.openSelectKey();
          }
        } catch (err) {
          console.warn("Ambiente AI Studio não detectado.");
        }
      }

      // Simulação de login com delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 1200));

      const googleUser = {
        name: "Estrategista",
        email: "user@example.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100",
        token: `gs-auth-${Math.random().toString(36).substring(7)}`
      };

      // Armazenamento com validação de integridade
      SecureStorage.setItem('session', googleUser);
      onLogin(googleUser.name, googleUser.avatar);

    } catch (err) {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0D171D]">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-500/10 rounded-full blur-[120px] animate-pulse-subtle"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-brand-500/5 rounded-full blur-[120px] animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full glass-panel rounded-[48px] p-12 shadow-2xl animate-fade-in-up relative z-10 text-center">
        <div className="mb-10">
          <LogoIcon className="mx-auto mb-6 animate-float" size={80} />
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Gera<span className="text-brand-500">.</span></h1>
          <p className="text-slate-400 font-medium text-sm px-4 leading-relaxed">
            Gestão estratégica e inteligente para acelerar sua presença digital com segurança.
          </p>
        </div>
        <div className="space-y-6">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-[10px] font-bold uppercase tracking-widest">{error}</div>}
          <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white text-slate-900 h-16 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50">
            {loading ? <i className="fas fa-circle-notch fa-spin text-brand-500 text-lg"></i> : (
              <><img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" /><span>Entrar no Dashboard</span></>
            )}
          </button>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-loose px-8">
            Verificamos a integridade dos seus dados localmente a cada sessão. Estratégia protegida e resiliente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
