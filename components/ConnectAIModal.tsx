
import React, { useState } from 'react';
import { setSessionKey } from '../services/security';

interface ConnectAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

const ConnectAIModal: React.FC<ConnectAIModalProps> = ({ isOpen, onClose, onConnected }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConnect = () => {
    if (!key.trim().startsWith('AIza')) {
      setError('Chave inválida. Deve começar com "AIza".');
      return;
    }
    setSessionKey(key.trim());
    onConnected();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0D171D] border border-white/10 w-full max-w-md rounded-[32px] p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Conectar IA</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Plano Starter (BYOK)</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed bg-brand-500/10 p-4 rounded-xl border border-brand-500/20">
            <i className="fas fa-shield-alt mr-2 text-brand-500"></i>
            <strong>Segurança Máxima:</strong> Sua chave é usada apenas nesta sessão e nunca é salva em nossos servidores.
          </p>

          <div>
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Gemini API Key</label>
             <input 
               type="password"
               value={key}
               onChange={e => setKey(e.target.value)}
               placeholder="Cole sua chave aqui..."
               className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition font-mono text-sm"
             />
             {error && <p className="text-red-400 text-xs font-bold mt-2 ml-1">{error}</p>}
          </div>

          <button 
            onClick={handleConnect}
            className="w-full py-4 bg-white text-brand-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all mt-4"
          >
            Conectar e Gerar
          </button>
          
          <button onClick={onClose} className="w-full py-2 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-white">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectAIModal;
