import { supabase, supabaseConfigError } from '../lib/supabaseClient';

export interface DraftRecord {
  id: string;
  content: string;
  source: string;
  created_at: string;
}

export interface CalendarItemRecord {
  id: string;
  content: string;
  source: string;
  scheduled_for: string | null;
  created_at: string;
}

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase não configurado.');
  }
};

export const listDrafts = async (userId: string): Promise<DraftRecord[]> => {
  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }
  ensureSupabase();

  const { data, error } = await supabase
    .from('drafts')
    .select('id, content, source, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const saveManualDraft = async (userId: string, content: string): Promise<DraftRecord> => {
  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }
  ensureSupabase();

  const { data, error } = await supabase
    .from('drafts')
    .insert({ user_id: userId, content, source: 'manual' })
    .select('id, content, source, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const listCalendarItems = async (userId: string): Promise<CalendarItemRecord[]> => {
  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }
  ensureSupabase();

  const { data, error } = await supabase
    .from('calendar_items')
    .select('id, content, source, scheduled_for, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const saveManualCalendarItem = async (
  userId: string,
  content: string,
  scheduledFor?: string
): Promise<CalendarItemRecord> => {
  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }
  ensureSupabase();

  const { data, error } = await supabase
    .from('calendar_items')
    .insert({
      user_id: userId,
      content,
      source: 'manual',
      scheduled_for: scheduledFor ?? null
    })
    .select('id, content, source, scheduled_for, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
