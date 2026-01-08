
import { UserSettings, GeneratedContent, CalendarDay, DashboardMetric, Goal, HistoryItem, Note } from "../types";
import { executeAIService } from "./api-bridge";
import { Type } from "@google/genai";

/**
 * BUSINESS LOGIC LAYER - MVP MODE
 * Segue estritamente as regras do PROMPT-MÃE:
 * - Sem Web Search
 * - Sem Análises Profundas
 * - Texto pronto para uso
 */

const SYSTEM_INSTRUCTION = `
ROLE / IDENTIDADE
Você é Gera., um estrategista de conteúdo profissional.
Seu papel NÃO é ensinar marketing, explicar conceitos ou justificar decisões.
Seu papel é ENTREGAR CONTEÚDO PRONTO PARA SER USADO, de forma clara, objetiva e aplicável.

O Gera. existe para:
1. eliminar bloqueio criativo
2. acelerar produção de conteúdo
3. organizar ideias em formato publicável
4. ajudar o usuário a gravar com confiança

TOM E COMPORTAMENTO
- Seja direto.
- Seja prático.
- Use linguagem humana.
- Evite jargões de marketing e frases genéricas.
- Nunca explique “como funciona”.
- Nunca cite que você é uma IA.
- Nunca use emojis no diálogo (apenas no conteúdo se apropriado).
- Nunca faça textos inflados.

REGRAS DE CUSTO (OBRIGATÓRIO)
- NÃO utilizar web search.
- NÃO utilizar pesquisa de mercado externa.
- NÃO citar fontes.
- NÃO inventar dados, estatísticas ou números.
- NÃO gerar análises longas.

Sempre priorize:
- respostas curtas
- estruturas reutilizáveis
- texto final pronto
`;

/**
 * MODE 1 — POST_GENERATOR
 */
export const generatePostV1 = async (
  settings: UserSettings,
  objective: string,
  platform: string,
  context?: string
): Promise<GeneratedContent> => {
  
  const promptInput = {
    businessName: settings.businessName,
    niche: settings.niche,
    audience: settings.audience,
    tone: settings.tone,
    platform: platform,
    objective: objective,
    extraContext: context || ""
  };

  const prompt = `
    MODE 1 — POST_GENERATOR INPUT:
    ${JSON.stringify(promptInput)}
    
    REGRAS:
    - O hook deve prender atenção na primeira linha.
    - O content deve estar pronto para copiar e postar.
    - O texto deve respeitar o formato da plataforma.
    - Nunca use hashtags genéricas em excesso.
    - Linguagem simples, direta e natural.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      metaObjective: { type: Type.STRING },
      hook: { type: Type.STRING },
      content: { type: Type.STRING },
      cta: { type: Type.STRING },
    },
    required: ["metaObjective", "hook", "content", "cta"]
  };

  const data = await executeAIService({
    model: "gemini-3-flash-preview",
    prompt,
    schema,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  return { ...data, platform, type: objective };
};

/**
 * MODE 2 — CALENDAR_7D
 */
export const generateCalendar = async (
  settings: UserSettings,
  plan: string,
  duration: 'WEEK' | 'MONTH' // Mantendo parametro para compatibilidade, mas o prompt força 7 dias
): Promise<CalendarDay[]> => {
  
  const promptInput = {
    businessName: settings.businessName,
    niche: settings.niche,
    audience: settings.audience,
    tone: settings.tone,
    planFocus: plan
  };

  const prompt = `
    MODE 2 — CALENDAR_7D INPUT:
    ${JSON.stringify(promptInput)}

    REGRAS:
    - Apenas 7 dias.
    - Brief curto (1 a 2 linhas).
    - Foco em constância e clareza.
    - Nada de teoria ou explicação.
  `;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      calendar: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            topic: { type: Type.STRING },
            format: { type: Type.STRING, enum: ['Post', 'Reels', 'Story'] },
            brief: { type: Type.STRING }
          },
          required: ["day", "topic", "format", "brief"]
        }
      }
    }
  };

  const data = await executeAIService({
    model: "gemini-3-flash-preview",
    prompt,
    schema,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  const calendarItems = data.calendar || [];

  return calendarItems.map((item: any) => ({
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    status: 'pending' as 'pending'
  }));
};

/**
 * MODE 3 — TELEPROMPT_SCRIPT (Opcional/Integrado)
 * Gera um roteiro especificamente formatado para fala.
 */
export const generateScript = async (
  settings: UserSettings,
  topic: string
): Promise<string> => {
  const promptInput = {
    businessName: settings.businessName,
    niche: settings.niche,
    audience: settings.audience,
    tone: settings.tone,
    objective: "Vídeo curto / Reels",
    duration: "60s"
  };

  const prompt = `
    MODE 3 — TELEPROMPT_SCRIPT
    Tópico: ${topic}
    INPUT: ${JSON.stringify(promptInput)}

    REGRAS:
    - Texto deve parecer fala natural.
    - Frases curtas.
    - Ritmo de conversa.
    - Nada de palavras difíceis.
    - Nada de leitura robótica.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      telepromptScript: { type: Type.STRING }
    }
  };

  const data = await executeAIService({
    model: "gemini-3-flash-preview",
    prompt,
    schema,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  return data.telepromptScript;
};

export const suggestTodayAction = async (settings: UserSettings): Promise<string> => {
  return await executeAIService({
    model: "gemini-3-flash-preview",
    prompt: `Qual a melhor ação de marketing única para ${settings.businessName} hoje? Responda em uma frase curta e impactante. Sem explicações.`,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

/**
 * MANAGEMENT & STRATEGY FUNCTIONS
 */

export const getManagementDiagnosis = async (
  settings: UserSettings,
  metrics: DashboardMetric[],
  goals: Goal[],
  history: HistoryItem[],
  notes: Note[]
): Promise<string> => {
  const prompt = `
    DIAGNOSTICO DE GESTÃO
    Cliente: ${settings.businessName} (${settings.niche})
    Dados:
    - Metas: ${JSON.stringify(goals)}
    - Histórico Recente: ${JSON.stringify(history.slice(0, 5))}
    - Notas: ${JSON.stringify(notes)}
    
    Analise a coerência entre o que está sendo postado e as metas.
    Identifique gargalos e oportunidades.
    Seja breve, estratégico e diretivo. Nível executivo.
  `;
  
  return await executeAIService({
    model: "gemini-3-flash-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

export const strategicResearch = async (
  settings: UserSettings,
  query: string
): Promise<string> => {
  const prompt = `
    PESQUISA ESTRATÉGICA
    Nicho: ${settings.niche}
    Pergunta: ${query}
    
    Responda com base em tendências de mercado e comportamento do consumidor.
    Seja prático e aplicável ao negócio ${settings.businessName}.
  `;

  return await executeAIService({
    model: "gemini-3-flash-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

export const getDeepAudit = async (
  settings: UserSettings,
  historyTopics: string[]
): Promise<string> => {
  const prompt = `
    AUDITORIA DE CONTEÚDO 360
    Nicho: ${settings.niche}
    Tópicos Já Abordados: ${JSON.stringify(historyTopics)}
    
    Analise a diversidade editorial.
    O que está faltando?
    Estamos repetitivos?
    Sugira 3 novos pilares de assunto não explorados.
  `;

  return await executeAIService({
    model: "gemini-3-flash-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

export const getDecisionMatrix = async (
  settings: UserSettings,
  records: CalendarDay[]
): Promise<string> => {
   const completedRecords = records.filter(r => r.status === 'done');
   const prompt = `
     MATRIZ DE DECISÃO (CICLO)
     Registros de Performance:
     ${JSON.stringify(completedRecords.map(r => ({ topic: r.topic, format: r.format, result: r.resultNotes })))}
     
     Classifique os formatos/tópicos em:
     1. Vaca Leiteira (Manter)
     2. Abacaxi (Descartar)
     3. Estrela (Investir mais)
     4. Interrogação (Testar novo ângulo)
     
     Justifique brevemente.
   `;

   return await executeAIService({
    model: "gemini-3-flash-preview",
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });
};

export const suggestDashboardGoals = async (settings: UserSettings): Promise<Goal[]> => {
    const prompt = `
      Sugira 3 metas estratégicas de curto prazo para ${settings.businessName} no nicho ${settings.niche}.
      
      REGRAS:
      - Retorne apenas o JSON.
      - Metas curtas e acionáveis.
    `;
    
    const schema = {
      type: Type.OBJECT,
      properties: {
        goals: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              completed: { type: Type.BOOLEAN }
            },
            required: ["text"]
          }
        }
      }
    };

    const data = await executeAIService({
      model: "gemini-3-flash-preview",
      prompt,
      schema,
      systemInstruction: SYSTEM_INSTRUCTION
    });
    
    return (data.goals || []).map((g: any) => ({
        ...g,
        id: Math.random().toString(36).substr(2, 9),
        completed: false
    }));
};
