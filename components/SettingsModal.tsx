import React, { useEffect, useState } from 'react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  settings: UserSettings;
  onSave: (s: UserSettings) => Promise<void>;
  isOpen: boolean;
}

function getErrorMessage(err: unknown) {
  if (!err) return 'Erro desconhecido.';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;

  // Supabase às vezes retorna objetos com "message"
  const maybeAny = err as any;
  if (maybeAny?.message) return String(maybeAny.message);
  if (maybeAny?.error_description) return String(maybeAny.error_description);

  try {
    return JSON.stringify(err);
  } catch {
    return 'Erro desconhecido.';
  }
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, isOpen }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [slowSaving, setSlowSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
      setError('');
      setIsSaving(false);
      setSlowSaving(false);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!formData.businessName || !formData.niche || !formData.audience || !formData.tone) {
      setError('Todos os 4 campos são obrigatórios para a estratégia funcionar.');
      return;
    }

    setIsSaving(true);
    setSlowSaving(false);
    setError('');

    // Se demorar demais, mostramos aviso
    const t = window.setTimeout(() => setSlowSaving(true), 12000);

    try {
      await onSave(formData);
      // se deu certo, o modal some automaticamente quando o profile atualizar (needsOnboarding = false)
    } catch (err) {
      console.error('Falha ao salvar onboarding:', err);
      setError(`Não foi possível salvar. Motivo: ${getErrorMessage(err)}`);
    } finally {
      window.clearTimeout(t);
      setIsSaving(false);
    }
  };

  const inputClasses =
    'w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-medium text-sm';
  const labelClasses =
    'block text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 ml-1';

  return (
    <div className="fixed inset-0 bg-[#0D171D]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="max-w-lg w-full my-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Novo Projeto</h2>
          <p className="text-slate-400 text-sm">Defina o contexto para a IA trabalhar por você.</p>
        </div>

        <div className="glass-panel p-8 rounded-[32px] border-white/10 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 text-center">
              {error}
            </div>
          )}

          {slowSaving && !error && (
            <div className="p-3 bg-yellow-500/10 text-yellow-300 text-xs font-bold rounded-xl border border-yellow-500/20 text-center">
              Está demorando mais do que o normal. Isso costuma indicar bloqueio de permissão (RLS) ou falha de rede.
            </div>
          )}

          <div>
            <label className={labelClasses}>Nome do Negócio</label>
            <input
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Ex: Consultoria Silva"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>O que você vende? (Nicho)</label>
            <input
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              placeholder="Ex: Consultoria Financeira para Pequenas Empresas"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Quem é seu cliente ideal?</label>
            <input
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              placeholder="Ex: Empresários de 30 a 50 anos..."
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Qual o tom de voz da marca?</label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className={`${inputClasses} appearance-none cursor-pointer`}
            >
              <option value="" disabled>
                Selecione um tom...
              </option>
              <option value="Profissional e Direto">Profissional e Direto</option>
              <option value="Informal e Divertido">Informal e Divertido</option>
              <option value="Educativo e Inspirador">Educativo e Inspirador</option>
              <option value="Sofisticado e Exclusivo">Sofisticado e Exclusivo</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Salvando...' : 'Criar Projeto e Começar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
