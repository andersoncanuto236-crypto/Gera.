import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import {
  listCalendarItems,
  listDrafts,
  saveManualCalendarItem,
  saveManualDraft,
  type CalendarItemRecord,
  type DraftRecord
} from '../src/services/supabaseData';

const SupabaseDataPanel: React.FC = () => {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);
  const [calendarItems, setCalendarItems] = useState<CalendarItemRecord[]>([]);
  const [draftContent, setDraftContent] = useState('');
  const [calendarContent, setCalendarContent] = useState('');
  const [calendarDate, setCalendarDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const [draftList, calendarList] = await Promise.all([
        listDrafts(user.id),
        listCalendarItems(user.id)
      ]);
      setDrafts(draftList);
      setCalendarItems(calendarList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSaveDraft = async () => {
    if (!user) {
      setError('Você precisa estar logado para salvar.');
      return;
    }
    if (!draftContent.trim()) {
      setError('Digite o conteúdo do draft.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await saveManualDraft(user.id, draftContent.trim());
      setDraftContent('');
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o draft.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCalendarItem = async () => {
    if (!user) {
      setError('Você precisa estar logado para salvar.');
      return;
    }
    if (!calendarContent.trim()) {
      setError('Descreva o item do calendário.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await saveManualCalendarItem(user.id, calendarContent.trim(), calendarDate || undefined);
      setCalendarContent('');
      setCalendarDate('');
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o item do calendário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-[40px] border-white/10 space-y-6 shadow-2xl">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-black text-white tracking-tight">Integração Supabase</h3>
        <p className="text-slate-400 text-xs font-medium">
          CRUD básico para drafts e calendário (source=manual).
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 text-red-300 text-xs font-bold rounded-2xl border border-red-500/20">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-brand-500">Salvar Draft Manual</h4>
          <textarea
            value={draftContent}
            onChange={(event) => setDraftContent(event.target.value)}
            placeholder="Escreva o draft manual..."
            className="w-full h-28 bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition"
          />
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-brand-500 transition disabled:opacity-50"
          >
            Salvar Draft
          </button>
          <div className="space-y-2">
            {drafts.length === 0 ? (
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sem drafts ainda.</p>
            ) : (
              drafts.map((draft) => (
                <div key={draft.id} className="text-xs text-slate-300 border border-white/5 rounded-xl p-3">
                  <p className="font-bold text-slate-400">{new Date(draft.created_at).toLocaleString()}</p>
                  <p>{draft.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-brand-500">Salvar Item do Calendário</h4>
          <input
            type="date"
            value={calendarDate}
            onChange={(event) => setCalendarDate(event.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-3 text-sm text-white outline-none focus:border-brand-500 transition"
          />
          <textarea
            value={calendarContent}
            onChange={(event) => setCalendarContent(event.target.value)}
            placeholder="Descreva a publicação ou tarefa..."
            className="w-full h-24 bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition"
          />
          <button
            onClick={handleSaveCalendarItem}
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-brand-500 transition disabled:opacity-50"
          >
            Salvar Item
          </button>
          <div className="space-y-2">
            {calendarItems.length === 0 ? (
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sem itens ainda.</p>
            ) : (
              calendarItems.map((item) => (
                <div key={item.id} className="text-xs text-slate-300 border border-white/5 rounded-xl p-3">
                  <p className="font-bold text-slate-400">
                    {item.scheduled_for ? new Date(item.scheduled_for).toLocaleDateString() : 'Sem data'}
                  </p>
                  <p>{item.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseDataPanel;
