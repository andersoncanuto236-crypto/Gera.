import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const emailRedirectTo = new URL('/auth/callback', window.location.origin).toString();
      await signUp(email, password, emailRedirectTo);
      setMessage('Conta criada! Verifique seu email se precisar confirmar.');
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
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
          <div className="w-20 h-20 rounded-3xl bg-brand-600 flex items-center justify-center text-white font-black mx-auto mb-6">G</div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Criar Conta</h1>
          <p className="text-slate-400 font-medium text-sm px-4 leading-relaxed">
            Comece sua estratégia com uma conta gratuita.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-200 text-[10px] font-bold uppercase tracking-widest text-center">
              {message}
            </div>
          )}

          <label className="block text-[10px] font-black text-brand-500 uppercase tracking-widest">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@email.com"
              className="mt-2 w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              required
            />
          </label>

          <label className="block text-[10px] font-black text-brand-500 uppercase tracking-widest">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Crie uma senha segura"
              className="mt-2 w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 h-14 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin text-brand-500 text-lg"></i> : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
          <Link to="/login" className="hover:text-brand-400 transition-colors">
            Já tenho conta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
