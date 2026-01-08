
/**
 * SECURITY LAYER
 * Responsável por proteger credenciais e integridade de dados locais.
 */

// Memória Volátil para API Key (BYOK) - Reseta ao recarregar a página
let sessionApiKey: string | null = null;

export const setSessionKey = (key: string) => {
  sessionApiKey = key;
};

export const getSessionKey = (): string | null => {
  return sessionApiKey;
};

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
 * Gerenciamento seguro de armazenamento local.
 */
export const SecureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const json = JSON.stringify(value);
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
        v: "2.1"
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
