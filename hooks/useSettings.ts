import { useState, useEffect } from 'react';
import { UserSettings } from '../types';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('gera_settings');
    return saved ? JSON.parse(saved) : {
      businessName: '',
      city: '',
      niche: '',
      audience: '',
      tone: '',
      jobTitle: '',
      avatar: '',
      metricLabels: { likes: 'Curtidas', views: 'Views', conversions: 'Conversões' }
    };
  });

  useEffect(() => {
    localStorage.setItem('gera_settings', JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings };
};
