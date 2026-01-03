
/**
 * Sanitiza strings para evitar execução de HTML/Scripts (Anti-XSS)
 * Protege contra conteúdos maliciosos que possam vir de respostas externas.
 */
export const sanitize = (str: string): string => {
  if (typeof str !== 'string') return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Recupera a API Key de forma segura, evitando quebras caso o objeto process não exista.
 */
export const getSafeApiKey = (): string => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Aviso: Ambiente de API_KEY não detectado.");
  }
  return "";
};

/**
 * Utilitário de Storage com Verificação de Integridade.
 * Garante que o app não quebre ao tentar ler dados corrompidos ou em formatos antigos.
 */
export const SecureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const dataToSave = {
        payload: value,
        v: "1.0", // Versão do schema para futuras migrações
        ts: Date.now()
      };
      localStorage.setItem(`_gs_${key}`, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Erro ao persistir dados:", e);
    }
  },
  
  getItem: (key: string): any => {
    try {
      const raw = localStorage.getItem(`_gs_${key}`);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      
      // Validação de Integridade: Verifica se o objeto tem a estrutura esperada
      if (parsed && typeof parsed === 'object' && 'payload' in parsed) {
        return parsed.payload;
      }
      
      // Fallback para dados antigos (compatibilidade)
      return parsed;
    } catch (e) {
      console.warn(`Dados corrompidos em ${key}. Limpando...`);
      localStorage.removeItem(`_gs_${key}`);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(`_gs_${key}`);
  }
};
