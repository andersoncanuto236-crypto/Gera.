
import { GoogleGenAI, Type } from "@google/genai";
import { UserSettings, GeneratedContent, CalendarDay, Goal, DashboardMetric, Note, HistoryItem } from "../types";
import { MANAGEMENT_PERSONA } from "../utils/prompts";

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || '';
  if (!apiKey) {
    console.error("API Key not found!");
  }
  return new GoogleGenAI({ apiKey });
};

export const getManagementDiagnosis = async (
  settings: UserSettings, 
  metrics: DashboardMetric[], 
  goals: Goal[],
  history: HistoryItem[],
  notes: Note[]
): Promise<string> => {
  try {
    const ai = getAiClient();
    const labels = settings.metricLabels || { likes: 'Curtidas', views: 'Views', conversions: 'Conversões' };
    
    const prompt = `
      ${MANAGEMENT_PERSONA}

      ANALISE ESTE PERFIL DE NEGÓCIO COMPLETAMENTE:
      Nome: ${settings.businessName}
      Nicho de Mercado: ${settings.niche}
      Público Alvo: ${settings.audience}
      Tom de Voz Definido: ${settings.tone}
      Cargo do Usuário: ${settings.jobTitle}

      DADOS DE GESTÃO:
      - Metas Ativas e Progresso: ${JSON.stringify(goals)}
      - Tópicos Recentes Criados: ${JSON.stringify(history.map(h => h.topic).slice(0, 10))}
      - Volume de Ideias Paradas (Backlog): ${notes.length}
      - O que o usuário valoriza (Labels): ${JSON.stringify(labels)}

      TAREFA:
      Escreva um diagnóstico estratégico de 3 parágrafos.
      Parágrafo 1: Diagnóstico de Identidade. O conteúdo criado (histórico) faz sentido para o público alvo e nicho descritos?
      Parágrafo 2: Análise de Performance/Metas. Estamos longe ou perto das metas? O que os números dizem sobre a tração atual?
      Parágrafo 3: Ordem de Correção. Dê uma instrução clara do que deve mudar na próxima semana para atingir o público certo.

      LEMBRE-SE: TEXTO LIMPO. SEM SÍMBOLOS ESPECIAIS.
    `;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash-exp", contents: prompt });
    return response.text || "Dados insuficientes para uma análise estratégica profunda.";
  } catch (error) {
    console.error("Error generating management diagnosis:", error);
    return "Erro ao gerar diagnóstico.";
  }
};

export const strategicResearch = async (settings: UserSettings, query: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      ${MANAGEMENT_PERSONA}
      Pesquisa Estratégica sobre: "${query}".
      Analise o contexto de ${settings.niche} em ${settings.city}.
      Retorne um texto limpo, profissional e sem jargões de IA. Sem markdown.
    `;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash-exp", contents: prompt });
    return response.text || "Sem insights para esta pesquisa.";
  } catch (error) {
    console.error("Error in strategic research:", error);
    return "Erro na pesquisa estratégica.";
  }
};

export const generateSocialContent = async (
  settings: UserSettings,
  topic: string,
  contentType: 'POST' | 'REELS',
  goal: string,
  additionalInfo?: string
): Promise<GeneratedContent> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Estrategista Sênior. Gere post humano.
      CLIENTE: ${settings.businessName} (${settings.niche}).
      TEMA: ${topic}. FORMATO: ${contentType}. OBJETIVO: ${goal}.
      Linguagem 100% humana. Sem clichês de IA.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
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

    return { ...JSON.parse(response.text || '{}'), type: contentType } as GeneratedContent;
  } catch (error) {
    console.error("Error generating social content:", error);
    throw new Error("Falha ao gerar conteúdo.");
  }
};

export const suggestDashboardGoals = async (settings: UserSettings): Promise<Partial<Goal>[]> => {
  try {
    const ai = getAiClient();
    const prompt = `Sugira 3 metas reais para ${settings.niche}. JSON: [{label, target, type: 'likes'|'views'|'conversions'}]`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
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
              type: { type: Type.STRING, enum: ["likes", "views", "conversions"] }
            },
            required: ["label", "target", "type"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error suggesting goals:", error);
    return [];
  }
};

export const refineIntent = async (intent: string): Promise<any> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Refine: "${intent}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTheme: { type: Type.STRING },
            suggestedFormat: { type: Type.STRING, enum: ["POST", "REELS"] },
            suggestedGoal: { type: Type.STRING },
            suggestedAdditionalInfo: { type: Type.STRING }
          },
          required: ["suggestedTheme", "suggestedFormat", "suggestedGoal", "suggestedAdditionalInfo"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error refining intent:", error);
    return {};
  }
};

export const getDeepAudit = async (settings: UserSettings, history: string[]): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Auditoria 360: ${settings.businessName} (${settings.niche}). Histórico: ${history.join(", ")}.`
    });
    return response.text || "";
  } catch (error) {
    console.error("Error getting deep audit:", error);
    return "Erro na auditoria.";
  }
};

export const getDashboardFeedback = async (settings: UserSettings, metrics: any): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Analise métricas: ${JSON.stringify(metrics)}. Texto limpo, sem markdown.`
    });
    return response.text || "";
  } catch (error) {
    console.error("Error getting dashboard feedback:", error);
    return "Erro no feedback.";
  }
};

export const generateAgentTip = async (settings: UserSettings): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Dica tática curta para ${settings.niche}.`
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating agent tip:", error);
    return "Erro ao gerar dica.";
  }
};

export const generateCalendar = async (settings: UserSettings, plan: string, duration: string): Promise<CalendarDay[]> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Calendário ${duration} para ${settings.niche}. Foco: ${plan}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              topic: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["POST", "REELS", "STORY"] },
              brief: { type: Type.STRING },
              bestTime: { type: Type.STRING }
            },
            required: ["day", "topic", "type", "brief"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]').map((d: any) => ({ ...d, id: Math.random().toString(36).substr(2, 9) }));
  } catch (error) {
    console.error("Error generating calendar:", error);
    return [];
  }
};

export const analyzeBusinessProfile = async (businessName: string, city: string, description: string): Promise<any> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Analise: ${description}.`,
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
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing business profile:", error);
    return {};
  }
};

export const repurposeContent = async (originalContent: string, targetFormat: string, settings: UserSettings): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Aja como um Editor Sênior. Recicle o seguinte conteúdo para o formato: ${targetFormat}.
      Conteúdo Original: "${originalContent}"
      Nicho: ${settings.niche}. Tom: ${settings.tone}.
      Retorne APENAS o novo conteúdo adaptado, pronto para copiar e colar. Texto Limpo.
    `;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash-exp", contents: prompt });
    return response.text || "Erro ao reciclar conteúdo.";
  } catch (error) {
    console.error("Error repurposing content:", error);
    return "Erro ao reciclar conteúdo.";
  }
};

export const simulateCritique = async (content: string, settings: UserSettings): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      SIMULADOR DE PERSONA: "O CLIENTE DIFÍCIL".
      Aja como o público-alvo deste post: ${settings.audience}. Você é cético, ocupado e exigente.
      Conteúdo para avaliar: "${content}"

      TAREFA:
      Critique este conteúdo. Diga por que você passaria direto ou por que não clicaria.
      Seja duro, mas construtivo. Use 1 parágrafo curto.
      Comece com: "Eu não clicaria porque..."
      Texto Limpo.
    `;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash-exp", contents: prompt });
    return response.text || "Sem crítica disponível.";
  } catch (error) {
    console.error("Error simulating critique:", error);
    return "Erro ao simular crítica.";
  }
};
