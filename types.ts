
export interface UserSettings {
  businessName: string;
  city: string;
  niche: string;
  audience: string;
  tone: string;
  jobTitle?: string;
  avatar?: string;
  metricLabels?: {
    likes: string;
    views: string;
    conversions: string;
  };
}

export interface GeneratedContent {
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
  imageSuggestion: string;
  bestTime: string;
  type: 'POST' | 'REELS' | 'STORY';
  
  // Campos opcionais do Multiplicador
  multiplied?: {
    reelsScript?: string;
    storySequence?: string[]; // Array de textos para sequencia
    linkedinText?: string;
  };
}

export interface CalendarDay {
  id: string;
  date: string; // ISO string
  day: string;  // Friendly label (e.g., "Hoje", "Segunda")
  topic: string;
  type: 'POST' | 'REELS' | 'STORY';
  brief: string;
  status: 'pending' | 'done';
  resultNotes?: string;
  contentBody?: string;
  bestTime?: string;
}

export interface HistoryItem {
  id: string;
  topic: string;
  content: GeneratedContent;
  timestamp: number;
}

export interface DashboardMetric {
  likes: number;
  views: number;
  conversions: number;
  timestamp: number;
}

export interface Goal {
  id: string;
  label: string;
  target: number;
  current: number;
  type: 'likes' | 'views' | 'conversions';
}

export interface Note {
  id: string;
  text: string;
  timestamp: number;
}

export type ViewState = 'login' | 'today' | 'calendar' | 'create' | 'register' | 'decision';
