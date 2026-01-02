import React from 'react';
import { ViewState, UserSettings } from '../types';
import ScoreWidget from './ScoreWidget';

interface SidebarProps {
  score: number;
  view: ViewState;
  settings: UserSettings;
  onNavigate: (view: ViewState) => void;
  onOpenSettings: () => void;
}

const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

const Sidebar: React.FC<SidebarProps> = ({ score, view, settings, onNavigate, onOpenSettings }) => {
  return (
    <aside className="hidden md:flex flex-col w-80 glass-panel border-r border-white/5 fixed h-full z-20">
      <div className="p-10 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="logo-shape-sm shadow-lg"><span className="text-white text-xl font-black">G</span></div>
          <span className="font-black text-3xl text-white tracking-tighter">Gera.</span>
        </div>
        <button onClick={onOpenSettings} aria-label="Abrir Configurações" className={`text-slate-500 hover:text-white transition ${buttonHoverClasses}`}>
          <i className="fas fa-cog text-xl"></i>
        </button>
      </div>

      <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar" aria-label="Navegação Principal">
        <ScoreWidget score={score} />

        {[
          { id: 'home', icon: 'fa-home', label: 'Início' },
          { id: 'management', icon: 'fa-chess', label: 'Gestão' },
          { id: 'dashboard', icon: 'fa-chart-pie', label: 'Métricas' },
          { id: 'generator', icon: 'fa-wand-sparkles', label: 'Criar' },
          { id: 'calendar', icon: 'fa-calendar-alt', label: 'Agenda' },
          { id: 'notes', icon: 'fa-sticky-note', label: 'Notas' },
          { id: 'history', icon: 'fa-history', label: 'Histórico' },
          { id: 'pricing', icon: 'fa-gem', label: 'Planos' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ViewState)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${view === item.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'} ${buttonHoverClasses}`}
          >
            <i className={`fas ${item.icon} w-5`}></i> {item.label}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-white/5">
        <div className="bg-slate-900/80 rounded-[32px] p-5 border border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
              {settings.avatar ? <img src={settings.avatar} className="w-full h-full object-cover" alt="avatar" /> : <span className="text-xl font-black">G</span>}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate">{settings.businessName || 'Configurar'}</p>
              <p className="text-[9px] text-brand-500 font-black uppercase tracking-widest truncate">{settings.niche || 'Estrategia'}</p>
            </div>
          </div>
          <button onClick={onOpenSettings} className={`w-full py-3 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/5 ${buttonHoverClasses}`}>
            Configurações
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
