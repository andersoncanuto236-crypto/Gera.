import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseConfigError } from '../lib/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finalizeAuth = async () => {
      if (supabaseConfigError || !supabase) {
        navigate('/login', { replace: true });
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        navigate('/login', { replace: true });
        return;
      }

      navigate('/app', { replace: true });
    };

    finalizeAuth();
  }, [navigate]);

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
    <div className="min-h-screen flex items-center justify-center bg-[#0D171D] text-slate-200 p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-black">Confirmando acesso</h1>
        <p className="text-slate-400 text-sm">Aguarde enquanto validamos sua sessão.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
