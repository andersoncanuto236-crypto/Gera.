
import { GoogleGenAI } from "@google/genai";
import { getSessionKey, sanitize } from "./security";

/**
 * API BRIDGE (The "Hidden Backend")
 */

const initAI = () => {
  // Tenta obter a chave da sessão (BYOK)
  const apiKey = getSessionKey();
  
  // Se não houver chave (usuário Free tentando burlar ou Paid sem configurar), lança erro
  if (!apiKey) throw new Error("MISSING_API_KEY");
  
  return new GoogleGenAI({ apiKey });
};

export const executeAIService = async (options: {
  model: string;
  prompt: string;
  schema?: any;
  systemInstruction?: string;
  tools?: any[];
}) => {
  try {
    const ai = initAI();
    
    const response = await ai.models.generateContent({
      model: options.model,
      contents: options.prompt,
      config: {
        systemInstruction: options.systemInstruction,
        responseMimeType: options.schema ? "application/json" : undefined,
        responseSchema: options.schema,
        temperature: 0.7,
        tools: options.tools,
      },
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("EMPTY_RESPONSE");
    
    if (options.schema) {
        return JSON.parse(textOutput);
    }

    let finalOutput = textOutput;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      const urls: string[] = [];
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) urls.push(chunk.web.uri);
        if (chunk.maps?.uri) urls.push(chunk.maps.uri);
      });
      
      if (urls.length > 0) {
        const uniqueUrls = Array.from(new Set(urls));
        finalOutput += "\n\n**Fontes e Referências:**\n" + uniqueUrls.map(url => `- [${url}](${url})`).join("\n");
      }
    }

    return sanitize(finalOutput);
  } catch (error: any) {
    console.error("[AI SERVICE ERROR]", error.message);
    throw error;
  }
};
