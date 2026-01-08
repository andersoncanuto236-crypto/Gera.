
import React from 'react';
import { UserSettings } from '../types';

interface DashboardProps {
  settings: UserSettings;
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto py-10 animate-fade-in min-h-[60vh] flex flex-col justify-center">
      <div className="text-center space-y-8">
        <div className="inline-block relative">
          <div className="w-20 h-20 bg-brand-600 rounded-3xl mx-auto flex items-center justify-center text-3xl text-white shadow-2xl mb-6 border-4 border-[#0D171D]">
            {settings.businessName.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0D171D] flex items-center justify-center" title="Conexão com Backend Segura">
            <i className="fas fa-shield-alt text-[8px] text-white"></i>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{settings.businessName}</h2>
          <p className="text-brand-500 font-bold uppercase tracking-widest text-[10px] bg-brand-500/10 px-4 py-1.5 rounded-full inline-block">
            {settings.niche}
          </p>
        </div>

        <div className="glass-panel p-10 rounded-[40px] border-white/5 space-y-6 transform hover:scale-[1.01] transition-all duration-500">
           <p className="text-slate-400 text-sm font-medium leading-relaxed">
             Sua estratégia está configurada para falar com <strong>{settings.audience}</strong> usando um tom <strong>{settings.tone}</strong>.
           </p>

           <div className="pt-4 space-y-4">
             <button 
               onClick={() => onNavigate('/app/create')}
               className="w-full py-6 bg-brand-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-brand-500/20 hover:bg-brand-500 transition-all flex items-center justify-center gap-3"
             >
               <i className="fas fa-plus-circle text-lg"></i>
               Criar Novo Conteúdo
             </button>
             
             <div className="flex items-center justify-center gap-2 opacity-30">
               <i className="fas fa-lock text-[8px]"></i>
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">Criptografia de Ponta a Ponta Ativa</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
