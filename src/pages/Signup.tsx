import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUp(email, password, `${window.location.origin}/auth/callback`);
      alert('Conta criada! Verifique seu e-mail para confirmar e depois faça login.');
      navigate('/login');
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D171D] text-slate-200 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-xl font-black">Criar conta</h1>

        {error && (
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-slate-400">E-mail</label>
          <input
            className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 outline-none"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seuemail@empresa.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-slate-400">Senha</label>
          <input
            className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button
          className="w-full rounded-lg bg-brand-600 hover:bg-brand-500 transition-colors px-4 py-2 font-black disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Criando...' : 'Criar conta'}
        </button>

        <p className="text-sm text-slate-400">
          Já tem conta? <Link className="text-brand-400 hover:underline" to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
