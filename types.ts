
export interface UserSettings {
  businessName: string;
  niche: string; // Tipo de negócio
  audience: string;
  tone: string;
  avatar?: string;
}

export interface GeneratedContent {
  metaObjective: string; // 1. Content Objective
  idea: string;          // 2. Content Idea
  content: string;       // 3. Final Content (Ready to post)
  cta?: string;          // 4. Optional CTA
  platform: string;
  type: string;          // Objetivo selecionado (Venda, Autoridade...)
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  content: GeneratedContent;
}

// Navegação completa incluindo Landing Page
export type ViewState = 'landing' | 'login' | 'dashboard' | 'create' | 'history' | 'management' | 'calendar';

export interface CalendarDay {
  id: string;
  date?: string;
  day: string;
  topic: string;
  type: 'POST' | 'REELS' | 'STORY';
  brief: string;
  status: 'pending' | 'done';
  resultNotes?: string;
}

export interface DashboardMetric {
    label: string;
    value: string;
    trend: string;
    icon: string;
}

export interface Goal {
    id: string;
    text: string;
    completed: boolean;
}

export interface Note {
    id: string;
    content: string;
    timestamp: number;
}
