
import React from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onUpgrade, featureName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0D171D] border border-brand-500/30 w-full max-w-md rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none"></div>

        <div className="text-center space-y-6 relative z-10">
          <div className="w-16 h-16 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-lock text-brand-500 text-2xl"></i>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Acelere com IA</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              O recurso <strong>{featureName}</strong> é exclusivo do plano Starter. 
              Planeje manualmente de graça ou use a IA para ganhar tempo.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left space-y-3">
             <div className="flex items-center gap-3 text-xs text-slate-300 font-bold">
               <i className="fas fa-check text-brand-500"></i> Conteúdo Ilimitado
             </div>
             <div className="flex items-center gap-3 text-xs text-slate-300 font-bold">
               <i className="fas fa-check text-brand-500"></i> Calendário Automático
             </div>
             <div className="flex items-center gap-3 text-xs text-slate-300 font-bold">
               <i className="fas fa-check text-brand-500"></i> Traga sua Chave (BYOK)
             </div>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              onClick={onUpgrade}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-500/20"
            >
              Liberar Gera. Starter
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition"
            >
              Continuar no Modo Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
