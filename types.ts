
export type UserPlan = 'FREE' | 'PAID';

export interface UserSettings {
  businessName: string;
  niche: string; // Tipo de negócio
  audience: string;
  tone: string;
  avatar?: string;
  plan: UserPlan; // Novo campo obrigatório
}

export interface GeneratedContent {
  metaObjective: string; 
  hook: string;          
  content: string;       
  cta?: string;          
  platform: string;
  type: string;          
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  content: GeneratedContent;
}

export type ViewState = 'landing' | 'login' | 'dashboard' | 'create' | 'history' | 'calendar' | 'teleprompter' | 'plans';

export interface CalendarDay {
  id: string;
  date?: string;
  day: string;
  topic: string;
  format: string;
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
