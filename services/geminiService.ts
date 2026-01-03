
import { GoogleGenAI, Type } from "@google/genai";
import { UserSettings, GeneratedContent, CalendarDay, DashboardMetric, Goal, HistoryItem, Note } from "../types";
import { sanitize, getSafeApiKey } from "./security";

const getAiClient = () => {
  const apiKey = getSafeApiKey();
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_CORE = `
Você é o motor do Gera. Um sistema de decisão pragmático.
Não dê aulas. Não use Markdown (** ou ###).
Seja direto. Use parágrafos simples.
SEGURANÇA: Nunca inclua tags <script> ou HTML nas respostas.
Foco: Decidir o que postar, criar o conteúdo ou avaliar resultados.
`;

export const analyzeBusinessProfile = async (
  name: string,
  city: string,
  description: string
): Promise<{ niche: string; audience: string; tone: string }> => {
  const ai = getAiClient();
  const prompt = `Analise este negócio: ${name} em ${city}. Descrição: ${description}. Defina Nicho, Público-Alvo e Tom de Voz ideais para redes sociais.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          niche: { type: Type.STRING },
          audience: { type: Type.STRING },
          tone: { type: Type.STRING }
        },
        required: ["niche", "audience", "tone"]
      }
    }
  });
  const data = JSON.parse(response.text || '{}');
  return {
    niche: sanitize(data.niche),
    audience: sanitize(data.audience),
    tone: sanitize(data.tone)
  };
};

export const generatePost = async (
  settings: UserSettings,
  topic: string,
  type: 'POST' | 'REELS' | 'STORY',
  goal: string
): Promise<GeneratedContent> => {
  const ai = getAiClient();
  const prompt = `
    ${SYSTEM_CORE}
    CLIENTE: ${settings.businessName} (${settings.niche}).
    PÚBLICO: ${settings.audience}.
    TEMA: ${topic}. FORMATO: ${type}. OBJETIVO: ${goal}.
    Gere um post pronto para uso. Linguagem humana real.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          caption: { type: Type.STRING },
          cta: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          imageSuggestion: { type: Type.STRING },
          bestTime: { type: Type.STRING }
        },
        required: ["hook", "caption", "cta", "hashtags", "imageSuggestion", "bestTime"]
      }
    }
  });

  const raw = JSON.parse(response.text || '{}');
  return {
    hook: sanitize(raw.hook),
    caption: sanitize(raw.caption),
    cta: sanitize(raw.cta),
    hashtags: (raw.hashtags || []).map((h: string) => sanitize(h)),
    imageSuggestion: sanitize(raw.imageSuggestion),
    bestTime: sanitize(raw.bestTime),
    type: type
  };
};

// --- NOVA FUNÇÃO: MULTIPLICADOR DE CONTEÚDO ---
export const multiplyContent = async (
  settings: UserSettings,
  originalContent: GeneratedContent
): Promise<{ reelsScript: string; storySequence: string[]; linkedinText: string }> => {
  const ai = getAiClient();
  const prompt = `
    ${SYSTEM_CORE}
    Aja como um editor chefe de social media.
    Baseado neste post original: "${originalContent.caption}"
    Do cliente: ${settings.businessName} (${settings.tone}).
    
    Crie 3 adaptações EXATAS:
    1. Um roteiro de Reels de 30s (falado, direto).
    2. Uma sequência de 3 Stories interativos (com enquete).
    3. Um texto curto e provocativo para LinkedIn/Threads.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reelsScript: { type: Type.STRING, description: "Roteiro completo narrado" },
          storySequence: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Texto para 3 stories" },
          linkedinText: { type: Type.STRING, description: "Texto corporativo/curto" }
        },
        required: ["reelsScript", "storySequence", "linkedinText"]
      }
    }
  });

  const raw = JSON.parse(response.text || '{}');
  return {
    reelsScript: sanitize(raw.reelsScript),
    storySequence: (raw.storySequence || []).map((s: string) => sanitize(s)),
    linkedinText: sanitize(raw.linkedinText)
  };
};

// --- NOVA FUNÇÃO: ROBIN HOOD (REMIX) ---
export const remixContent = async (
  settings: UserSettings,
  sourceText: string,
  type: 'POST' | 'REELS' | 'STORY'
): Promise<GeneratedContent> => {
  const ai = getAiClient();
  const prompt = `
    ${SYSTEM_CORE}
    TAREFA: Remix Robin Hood.
    Pegue este texto de referência (concorrente/inspiração): "${sourceText}"
    
    Reescreva-o TOTALMENTE para o negócio: ${settings.businessName}.
    Nicho: ${settings.niche}. Tom: ${settings.tone}.
    
    Regras:
    1. Mantenha a estrutura viral/lógica da referência.
    2. Troque todos os exemplos e jargões para o nicho do usuário.
    3. GARANTA que seja original (sem plágio).
    4. Formato de saída: ${type}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          caption: { type: Type.STRING },
          cta: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          imageSuggestion: { type: Type.STRING },
          bestTime: { type: Type.STRING }
        },
        required: ["hook", "caption", "cta", "hashtags", "imageSuggestion", "bestTime"]
      }
    }
  });

  const raw = JSON.parse(response.text || '{}');
  return {
    hook: sanitize(raw.hook),
    caption: sanitize(raw.caption),
    cta: sanitize(raw.cta),
    hashtags: (raw.hashtags || []).map((h: string) => sanitize(h)),
    imageSuggestion: sanitize(raw.imageSuggestion),
    bestTime: sanitize(raw.bestTime),
    type: type
  };
};

export const generateCalendar = async (
  settings: UserSettings,
  plan: string,
  duration: 'WEEK' | 'MONTH'
): Promise<CalendarDay[]> => {
  const ai = getAiClient();
  const prompt = `
    ${SYSTEM_CORE}
    Gere um plano de conteúdo para ${settings.businessName} (${settings.niche}).
    Duração: ${duration}. Plano: ${plan}.
    Gere sugestões de posts com data (ISO YYYY-MM-DD), dia da semana, tema, formato (POST, REELS, STORY) e briefing.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            date: { type: Type.STRING },
            day: { type: Type.STRING },
            topic: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["POST", "REELS", "STORY"] },
            brief: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["pending", "done"] }
          },
          required: ["id", "date", "day", "topic", "type", "brief", "status"]
        }
      }
    }
  });

  const rawArray = JSON.parse(response.text || '[]');
  return rawArray.map((d: any) => ({
    ...d,
    topic: sanitize(d.topic),
    brief: sanitize(d.brief),
    day: sanitize(d.day)
  }));
};

export const getDecisionMatrix = async (
  settings: UserSettings,
  records: CalendarDay[]
): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
    ${SYSTEM_CORE}
    Analise os posts realizados de ${settings.businessName}:
    ${JSON.stringify(records.filter(r => r.status === 'done'))}
    
    Ação: Para cada tipo de post ou tema, decida: REPETIR, AJUSTAR ou PARAR.
    Seja curto. Um parágrafo por decisão.
  `;
  const response = await ai.models.generateContent({ model: "gemini-3-pro-preview", contents: prompt });
  return sanitize(response.text || "Sem dados suficientes para decidir.");
};

export const suggestTodayAction = async (settings: UserSettings): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
    ${SYSTEM_CORE}
    Nicho: ${settings.niche}. O que postar HOJE para gerar venda ou autoridade?
    Dê uma única sugestão direta.
  `;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return sanitize(response.text || "Poste um bastidor do seu trabalho hoje.");
};

export const repurposeContent = async (
  content: string, 
  format: string, 
  settings: UserSettings
): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Transforme este conteúdo em um novo formato: ${format}. Conteúdo original: "${content}". 
    Mantenha o tom de voz da marca ${settings.businessName}.`;
  
  const response = await ai.models.generateContent({ 
    model: "gemini-3-flash-preview", 
    contents: prompt 
  });
  return sanitize(response.text || "");
};

export const getDashboardFeedback = async (
  settings: UserSettings, 
  metrics: DashboardMetric[]
): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Como estrategista de growth, analise os números de ${settings.businessName}: ${JSON.stringify(metrics)}. 
    Forneça um feedback prático e direto sobre a performance.`;
  
  const response = await ai.models.generateContent({ 
    model: "gemini-3-pro-preview", 
    contents: prompt 
  });
  return sanitize(response.text || "");
};

export const suggestDashboardGoals = async (settings: UserSettings): Promise<any[]> => {
  const ai = getAiClient();
  const prompt = `Sugira 3 metas estratégicas (KPIs) para ${settings.businessName} (${settings.niche}).`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            target: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ['likes', 'views', 'conversions'] }
          },
          required: ["label", "target", "type"]
        }
      }
    }
  });
  const data = JSON.parse(response.text || '[]');
  return data.map((g: any) => ({ ...g, label: sanitize(g.label) }));
};

export const getDeepAudit = async (settings: UserSettings, history: string[]): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Realize uma auditoria profunda da estratégia de conteúdo de ${settings.businessName}. 
    Histórico de temas: ${history.join(', ')}. Identifique padrões e melhorias.`;
  
  const response = await ai.models.generateContent({ 
    model: "gemini-3-pro-preview", 
    contents: prompt 
  });
  return sanitize(response.text || "");
};

export const getManagementDiagnosis = async (
  settings: UserSettings,
  metrics: DashboardMetric[],
  goals: Goal[],
  history: HistoryItem[],
  notes: Note[]
): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Diagnóstico Estratégico Completo para ${settings.businessName}. 
    Métricas: ${JSON.stringify(metrics)}
    Metas: ${JSON.stringify(goals)}
    Posts: ${JSON.stringify(history.map(h => h.topic))}
    Notas/Ideias: ${JSON.stringify(notes.map(n => n.text))}`;
  
  const response = await ai.models.generateContent({ 
    model: "gemini-3-pro-preview", 
    contents: prompt 
  });
  return sanitize(response.text || "");
};

export const strategicResearch = async (settings: UserSettings, query: string): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Pesquisa de mercado e tendências estratégicas para ${settings.businessName}: ${query}`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return sanitize(response.text || "");
};
