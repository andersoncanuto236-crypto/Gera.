
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
  script?: string;
  type: 'POST' | 'REELS';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  topic: string;
  content: GeneratedContent;
}

export interface CalendarDay {
  id: string;
  day: string;
  topic: string;
  type: 'POST' | 'REELS' | 'STORY';
  brief: string;
  bestTime?: string;
  holidayInfo?: string;
  contentBody?: string;
}

export interface DashboardMetric {
  date: string;
  likes: number;
  views: number;
  conversions: number;
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
  title: string;
  content: string;
  timestamp: number;
}

export type ViewState = 'login' | 'home' | 'generator' | 'calendar' | 'pricing' | 'history' | 'dashboard' | 'notes' | 'deep-analysis' | 'management';
