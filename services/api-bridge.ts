
import { GoogleGenAI, Type } from "@google/genai";
import { getInternalCredentials, sanitize } from "./security";

/**
 * API BRIDGE (The "Hidden Backend")
 * Este arquivo isola o SDK e a Chave de API de todo o resto do app.
 */

const initAI = () => {
  const apiKey = getInternalCredentials();
  if (!apiKey) throw new Error("INTERNAL_AUTH_FAILED");
  // Always use the named parameter apiKey for initialization
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
    
    // Always use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: options.model,
      contents: options.prompt,
      config: {
        systemInstruction: options.systemInstruction,
        // responseMimeType is required when responseSchema is used
        responseMimeType: options.schema ? "application/json" : undefined,
        responseSchema: options.schema,
        temperature: 0.7,
        tools: options.tools,
      },
    });

    // The GenerateContentResponse object features a text property (not a method).
    const textOutput = response.text;
    if (!textOutput) throw new Error("EMPTY_RESPONSE");
    
    // If we're expecting JSON, return the parsed response immediately.
    if (options.schema) {
        return JSON.parse(textOutput);
    }

    let finalOutput = textOutput;

    // Search Grounding: Extract URLs from groundingChunks and append them to the text output.
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

    // Retorno sanitizado para segurança
    return sanitize(finalOutput);
  } catch (error: any) {
    console.error("[BACKEND ERROR]", error.message);
    throw error;
  }
};
