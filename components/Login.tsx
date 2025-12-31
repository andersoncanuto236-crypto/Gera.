import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerificationPending, setIsVerificationPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false);
      if (isSignUp) {
        setIsVerificationPending(true);
      } else {
        onLogin(name || email.split('@')[0] || 'Usuário');
      }
    }, 1200);
  };

  const handleConfirmVerification = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(name || email.split('@')[0] || 'Usuário');
    }, 1000);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    // Simulate Google Auth
    setTimeout(() => {
      setLoading(false);
      onLogin('Usuário Google');
    }, 1500);
  };

  const handleResendEmail = () => {
    alert(`E-mail de confirmação reenviado para ${email}`);
  };

  const inputClasses = "w-full bg-white border-2 border-black rounded-2xl px-5 py-4 text-black placeholder-slate-300 outline-none focus:ring-4 focus:ring-brand-500/20 transition-all font-bold shadow-sm";
  const buttonHoverClasses = "transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-xl";

  if (isVerificationPending) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-[40px] p-10 shadow-2xl animate-fade-in-up relative overflow-hidden text-center border-white/10">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-brand-500 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl shadow-brand-500/20 mb-8 animate-pulse-subtle">
               <i className="fas fa-envelope-open-text text-4xl text-white"></i>
            </div>
            
            <h2 className="text-3xl font-black text-white tracking-tight mb-4 uppercase">Verifique seu e-mail</h2>
            <p className="text-slate-400 mb-10 font-medium leading-relaxed">
              Enviamos um link de confirmação para <br/>
              <span className="text-brand-500 font-black italic">{email}</span>. <br/>
              Confirme para liberar sua inteligência.
            </p>

            <div className="space-y-4">
              <button 
                onClick={handleConfirmVerification}
                disabled={loading}
                className={`w-full py-5 bg-gradient-to-r from-brand-600 to-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-brand-500/30 flex justify-center items-center gap-3 ${buttonHoverClasses}`}
              >
                {loading ? (
                  <><i className="fas fa-circle-notch fa-spin"></i> Verificando...</>
                ) : (
                  <>Já confirmei <i className="fas fa-check"></i></>
                )}
              </button>
              
              <button 
                onClick={handleResendEmail}
                className={`w-full py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-brand-500 transition-colors ${buttonHoverClasses}`}
              >
                Reenviar e-mail
              </button>

              <button 
                onClick={() => setIsVerificationPending(false)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-colors mt-6 block w-full"
              >
                <i className="fas fa-arrow-left mr-2"></i> Voltar para o cadastro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel rounded-[40px] p-10 shadow-2xl animate-fade-in-up relative overflow-hidden border-white/10">
        
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl shadow-brand-500/20 mb-6 transform rotate-3">
             <span className="text-5xl font-black text-white">G</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Gera<span className="text-brand-600">.</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            {isSignUp ? 'Crie sua conta grátis.' : 'Inteligência que Cria.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {isSignUp && (
            <div className="animate-fade-in">
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Nome Completo</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                placeholder="Maria Silva"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">E-mail Corporativo</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Sua Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-gradient-to-r from-brand-600 to-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 flex justify-center items-center gap-3 mt-4 ${buttonHoverClasses}`}
          >
            {loading ? (
              <><i className="fas fa-circle-notch fa-spin"></i> Processando...</>
            ) : (
              <>{isSignUp ? 'Criar Conta' : 'Acessar'} <i className="fas fa-arrow-right"></i></>
            )}
          </button>
        </form>

        <div className="relative z-10 my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest">
            <span className="px-3 bg-slate-950 text-slate-600">ou entre com</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleAuth}
          disabled={loading}
          className={`relative z-10 w-full py-4 bg-white border-2 border-black rounded-[24px] font-black text-xs text-black flex justify-center items-center gap-4 ${buttonHoverClasses}`}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          <span>Google Workspace</span>
        </button>
        
        <div className="mt-10 text-center relative z-10">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            {isSignUp ? 'Já tem uma conta?' : 'Novo por aqui?'} 
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="ml-2 text-brand-500 font-black hover:underline focus:outline-none"
            >
              {isSignUp ? 'Fazer Login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;