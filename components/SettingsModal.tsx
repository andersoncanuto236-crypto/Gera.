import React, { useEffect, useRef } from 'react';
import { UserSettings } from '../types';
import { analyzeBusinessProfile } from '../services/geminiService';

interface SettingsModalProps {
  settings: UserSettings;
  onSave: (s: UserSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, isOpen, onClose }) => {
  const [formData, setFormData] = React.useState<UserSettings>(settings);
  const [description, setDescription] = React.useState('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Por favor, descreva seu negócio para que a IA possa analisar.');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      const analysis = await analyzeBusinessProfile(
        formData.businessName || 'Novo Negócio', 
        formData.city || 'Brasil', 
        description
      );
      
      setFormData(prev => ({
        ...prev,
        niche: analysis.niche || prev.niche,
        audience: analysis.audience || prev.audience,
        tone: analysis.tone || prev.tone
      }));
      
      setDescription(''); 
    } catch (err: any) {
      console.error("Erro na análise:", err);
      const msg = err.message || '';
      if (msg.includes('quota')) {
        setError('Limite de uso da IA atingido. Tente novamente mais tarde.');
      } else {
        setError('Erro ao analisar perfil. Verifique sua conexão.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveSettings = () => {
    onSave(formData);
    onClose();
  };

  const inputClasses = "w-full bg-white border-2 border-black rounded-xl p-3 text-black placeholder-gray-400 outline-none focus:ring-4 focus:ring-brand-500/20 transition-all font-bold shadow-sm";
  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
        
        {/* Header - Mais sólido e contrastado */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Configurar Negócio<span className="text-brand-600">.</span></h3>
          <button 
            onClick={onClose} 
            className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 ${buttonHoverClasses}`}
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-2xl border border-red-100 animate-shake flex items-start gap-3">
              <i className="fas fa-exclamation-triangle mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Identity Section */}
          <div className="space-y-6">
             <div className="flex flex-col items-center gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
               <div 
                 onClick={triggerFileInput}
                 className={`group relative w-32 h-32 rounded-[32px] bg-white border-4 border-white shadow-xl overflow-hidden cursor-pointer ${buttonHoverClasses}`}
               >
                 {formData.avatar ? (
                   <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-slate-50">
                     <i className="fas fa-camera text-4xl mb-2"></i>
                     <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Foto</span>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-brand-600/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <i className="fas fa-upload text-white text-2xl"></i>
                 </div>
               </div>
               
               <button 
                 onClick={triggerFileInput}
                 className={`text-xs font-black text-brand-700 hover:text-brand-900 bg-white px-6 py-2.5 rounded-full border border-brand-100 shadow-sm ${buttonHoverClasses}`}
               >
                 <i className="fas fa-image mr-2"></i> Mudar Foto de Perfil
               </button>
               <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             </div>

             <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome do Negócio</label>
                   <input
                     type="text"
                     placeholder="Ex: Minha Empresa"
                     value={formData.businessName}
                     onChange={e => setFormData({...formData, businessName: e.target.value})}
                     className={inputClasses}
                   />
                </div>
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cidade / Região</label>
                   <input
                     type="text"
                     placeholder="Ex: São Paulo, SP"
                     value={formData.city}
                     onChange={e => setFormData({...formData, city: e.target.value})}
                     className={inputClasses}
                   />
                </div>
                <div className="col-span-2">
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cargo / Função</label>
                   <input
                     type="text"
                     placeholder="Ex: CEO, Autônomo..."
                     value={formData.jobTitle || ''}
                     onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                     className={inputClasses}
                   />
                </div>
              </div>
          </div>

          {/* AI Magic Section */}
          <div className="bg-brand-600 p-8 rounded-[40px] shadow-2xl shadow-brand-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-xl text-white">
                  <i className="fas fa-wand-magic-sparkles"></i>
                </div>
                <label className="block text-sm font-black text-white uppercase tracking-wider">
                  Configurador Inteligente
                </label>
              </div>
              <p className="text-xs text-brand-100 mb-4 leading-relaxed font-bold">
                Descreva seu trabalho e a IA cuidará de definir seu nicho e público.
              </p>
              <textarea
                className="w-full bg-white border-2 border-black rounded-2xl p-4 text-black placeholder-slate-300 outline-none focus:ring-4 focus:ring-white/20 transition-all font-bold min-h-[100px] mb-4"
                placeholder="Diga: Sou fotógrafo e trabalho com eventos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !description.trim()}
                className={`w-full py-4 bg-white text-brand-700 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl ${buttonHoverClasses} ${isAnalyzing ? 'opacity-80 cursor-wait' : ''}`}
              >
                {isAnalyzing ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> 
                    <span className="animate-pulse">Analisando...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt"></i> 
                    <span>Gerar Perfil Perfeito</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { label: 'Nicho', val: 'niche' },
              { label: 'Público Alvo', val: 'audience' },
              { label: 'Tom de Voz', val: 'tone' }
            ].map((f) => (
              <div key={f.val}>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{f.label}</label>
                <input
                  type="text"
                  value={(formData as any)[f.val]}
                  onChange={e => setFormData({...formData, [f.val]: e.target.value})}
                  className={inputClasses}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Sólido */}
        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
          <button 
            onClick={onClose} 
            className={`px-8 py-3 text-gray-500 font-black text-sm rounded-2xl hover:bg-gray-200 ${buttonHoverClasses}`}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSaveSettings} 
            className={`px-10 py-3 bg-brand-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-500/20 ${buttonHoverClasses}`}
          >
            Salvar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;