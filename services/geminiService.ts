
import { UserSettings, GeneratedContent, CalendarDay, HistoryItem, DashboardMetric, Goal, Note } from "../types";
import { executeAIService } from "./api-bridge";
import { Type } from "@google/genai";

/**
 * BUSINESS LOGIC LAYER
 * Transforma pedidos do usuário em comandos para o Bridge.
 */

const SYSTEM_INSTRUCTION = "Você é o Gera, o motor de inteligência de uma agência de elite. Gere conteúdo final, pronto para copiar e postar.";

export const generatePostV1 = async (
  settings: UserSettings,
  objective: string,
  platform: string,
  context?: string
): Promise<GeneratedContent> => {
  const prompt = `
    CLIENTE: ${settings.businessName} (${settings.niche})
    TARGET: ${settings.audience}
    TOM: ${settings.tone}
    OBJETIVO: ${objective}
    PLATAFORMA: ${platform}
    CONTEXTO EXTRA: ${context || "Nenhum."}
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      metaObjective: { type: Type.STRING },
      idea: { type: Type.STRING },
      content: { type: Type.STRING },
      cta: { type: Type.STRING },
    },
    required: ["metaObjective", "idea", "content", "cta"]
  };

  const data = await executeAIService({
    // Basic text task: use gemini-3-flash-preview
    model: "gemini-3-flash-preview",
    prompt,
    schema,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  return { ...data, platform, type: objective };
};

export const generateCalendar = async (
  settings: UserSettings,
  plan: string,
  duration: 'WEEK' | 'MONTH'
): Promise<CalendarDay[]> => {
  const prompt = `Gere uma agenda editorial de ${duration === 'WEEK' ? '7 dias' : '15 dias'} para ${settings.businessName}. Foco: ${plan}`;
  
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        day: { type: Type.STRING },
        topic: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['POST', 'REELS', 'STORY'] },
        brief: { type: Type.STRING }
      },
      required: ["day", "topic", "type", "brief"]
    }
  };

  const data = await executeAIService({
    // Basic text task: use gemini-3-flash-preview
    model: "gemini-3-flash-preview",
    prompt,
    schema,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  // Explicitly cast status to 'pending' to satisfy CalendarDay status literal type
  return data.map((item: any) => ({
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    status: 'pending' as 'pending'
  }));
};

export const suggestTodayAction = async (settings: UserSettings): Promise<string> => {
  return await executeAIService({
    // Basic text task: use gemini-3-flash-preview
    model: "gemini-3-flash-preview",
    prompt: `Qual a melhor ação de marketing única para ${settings.businessName} hoje? Responda em uma frase curta e impactante.`,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

/**
 * Realiza uma auditoria profunda do histórico de conteúdo.
 */
export const getDeepAudit = async (settings: UserSettings, history: string[]): Promise<string> => {
  const prompt = `Realize uma auditoria profunda de 360 graus para o negócio ${settings.businessName}. 
  Histórico de temas abordados: ${history.join(', ')}. 
  Analise padrões de sucesso, falhas de comunicação e sugira melhorias estratégicas baseadas em dados.`;

  return await executeAIService({
    // Complex reasoning task: use gemini-3-pro-preview
    model: "gemini-3-pro-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

/**
 * Gera um diagnóstico estratégico baseado em métricas e metas.
 */
export const getManagementDiagnosis = async (
  settings: UserSettings, 
  metrics: DashboardMetric[], 
  goals: Goal[], 
  history: HistoryItem[], 
  notes: Note[]
): Promise<string> => {
  const prompt = `Realize um diagnóstico estratégico executivo para ${settings.businessName}. 
  Metas Atuais: ${JSON.stringify(goals)}. 
  Métricas de Desempenho: ${JSON.stringify(metrics)}. 
  Histórico Recente (Ideias): ${JSON.stringify(history.map(h => h.content.idea))}. 
  Notas e Backlog: ${JSON.stringify(notes)}.
  Identifique gargalos e crie um plano de ação corretivo de alto nível.`;

  return await executeAIService({
    // Complex reasoning task: use gemini-3-pro-preview
    model: "gemini-3-pro-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

/**
 * Sugere novas metas para o dashboard.
 */
export const suggestDashboardGoals = async (settings: UserSettings): Promise<string> => {
  const prompt = `Sugira 3 metas SMART (Específicas, Mensuráveis, Atingíveis, Relevantes e com Prazo) para o negócio ${settings.businessName} no nicho ${settings.niche}.`;
  return await executeAIService({
    model: "gemini-3-flash-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

/**
 * Realiza pesquisa estratégica com acesso à web.
 */
export const strategicResearch = async (settings: UserSettings, query: string): Promise<string> => {
  const prompt = `Pesquisa Estratégica de Mercado para ${settings.businessName}: ${query}. 
  Forneça tendências atuais, insights competitivos e recomendações práticas baseadas em dados recentes da web.`;
  
  return await executeAIService({
    // Complex task requiring search: use gemini-3-pro-preview
    model: "gemini-3-pro-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ googleSearch: {} }]
  });
};

/**
 * Gera uma matriz de decisão para encerramento de ciclos.
 */
export const getDecisionMatrix = async (settings: UserSettings, records: CalendarDay[]): Promise<string> => {
  const prompt = `Analise os seguintes registros de execução de conteúdo para ${settings.businessName}: ${JSON.stringify(records)}. 
  Gere uma Matriz de Decisão que oriente se a estratégia atual deve ser Mantida, Pivotada ou Encerrada. 
  Justifique com base no ROI estratégico percebido.`;
  
  return await executeAIService({
    // Complex reasoning task: use gemini-3-pro-preview
    model: "gemini-3-pro-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};
