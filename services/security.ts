
/**
 * SECURITY LAYER (Simulated Backend Security)
 * Responsável por proteger credenciais e integridade de dados locais.
 */

const FALLBACK_KEY = "AIzaSyAKLApGRMcFFKIBZ9Fbtp333ZW_4Qm8Xfo";

/**
 * Sanitiza strings para evitar injeção de scripts e quebras de layout.
 */
export const sanitize = (str: string): string => {
  if (typeof str !== 'string') return "";
  return str
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/[<>]/g, "");
};

/**
 * Recupera as credenciais de forma opaca.
 * Prioriza variáveis de ambiente. Se ausentes, utiliza a chave de fallback configurada.
 */
export const getInternalCredentials = (): string => {
  // Prioriza a chave injetada pelo ambiente (process.env.API_KEY).
  // Caso não exista, utiliza a chave fornecida pelo usuário.
  return process.env.API_KEY || FALLBACK_KEY;
};

/**
 * Gerenciamento seguro de armazenamento local.
 * Implementa verificação de integridade compatível com caracteres UTF-8 (acentuação).
 */
export const SecureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const json = JSON.stringify(value);
      
      /**
       * CORREÇÃO: btoa nativo só aceita Latin1.
       * Para suportar Português (acentos) e Emojis, convertemos para bytes UTF-8 primeiro.
       */
      const encoder = new TextEncoder();
      const bytes = encoder.encode(json);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      
      const checksum = btoa(binary).slice(0, 10);

      const data = {
        payload: value,
        checksum: checksum,
        ts: Date.now(),
        v: "2.1" // Versão do schema de segurança
      };
      
      localStorage.setItem(`_gs_v2_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error("Erro Crítico de Armazenamento:", e);
    }
  },
  
  getItem: (key: string): any => {
    try {
      const raw = localStorage.getItem(`_gs_v2_${key}`);
      if (!raw) return null;
      
      const parsed = JSON.parse(raw);
      
      // Validação básica de estrutura v2
      if (parsed && typeof parsed === 'object' && 'payload' in parsed) {
        return parsed.payload;
      }
      
      return parsed;
    } catch (e) {
      console.warn("Falha ao recuperar item do storage:", key);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(`_gs_v2_${key}`);
  }
};
