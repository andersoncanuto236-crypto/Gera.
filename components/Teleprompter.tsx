
import React, { useState, useEffect, useRef } from 'react';

interface TeleprompterProps {
  text: string;
  onClose: () => void;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ text, onClose }) => {
  // State: Playback/Scroll
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); 
  const [fontSize, setFontSize] = useState(32); 
  const [isMirrored, setIsMirrored] = useState(false);
  
  // State: Camera & Recording
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // 1. Inicializar Câmera ao montar
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Gerencia a URL do vídeo gravado para preview
  useEffect(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setRecordedUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setRecordedUrl(null);
    }
  }, [videoBlob]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // 2. Lógica de Gravação
  const startRecording = () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const recorder = new MediaRecorder(stream);
    
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoBlob(blob);
    };

    recorder.start();
    setIsRecording(true);
    mediaRecorderRef.current = recorder;
    
    // Auto-start scroll when recording starts
    setIsPlaying(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPlaying(false); // Auto-stop scroll
    }
  };

  const downloadVideo = () => {
    if (!videoBlob) return;
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gera-video-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 3. Lógica de Scroll
  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current && isPlaying) {
        scrollRef.current.scrollTop += speed * 0.4;
        animationRef.current = requestAnimationFrame(scroll);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(scroll);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speed]);

  const reset = () => {
      setVideoBlob(null);
      if(scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in overflow-hidden">
      
      {/* Camada de Vídeo (Fundo) */}
      <div className="absolute inset-0 z-0">
         <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted // Mudo para evitar feedback de áudio local durante gravação
            className="w-full h-full object-cover transform scale-x-[-1]" // Espelhado para sensação de espelho
         ></video>
         {/* Overlay Escuro para Legibilidade do Texto */}
         <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Header controls (Aparece apenas se NÃO estiver no preview do vídeo) */}
      {!videoBlob && (
        <div className="p-4 flex items-center justify-between z-20 relative">
            <button 
            onClick={onClose} 
            className="text-white bg-black/50 backdrop-blur px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center gap-2"
            >
            <i className="fas fa-times"></i> Sair
            </button>
            
            {/* Configurações de Texto (Escondidas se estiver gravando) */}
            {!isRecording && (
                <div className="flex gap-4 items-center animate-fade-in">
                    <div className="flex items-center gap-4 bg-black/50 backdrop-blur px-6 py-2 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2">
                        <i className="fas fa-text-height text-white text-xs"></i>
                        <input 
                            type="range" 
                            min="24" 
                            max="80" 
                            value={fontSize} 
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-20 accent-brand-500 h-1 cursor-pointer"
                        />
                        </div>
                        
                        <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                        <i className="fas fa-tachometer-alt text-white text-xs"></i>
                        <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={speed} 
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-20 accent-brand-500 h-1 cursor-pointer"
                        />
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Review Screen (Preview do Vídeo) */}
      {videoBlob && recordedUrl ? (
         <div className="absolute inset-0 z-50 bg-[#0D171D] flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Vídeo Gravado</h3>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full inline-block">
                   <i className="fas fa-exclamation-triangle mr-1"></i> Não salvo no App
                </p>
            </div>
            
            {/* Player de Vídeo Nativo para "ver o video" */}
            <div className="w-full max-w-sm aspect-[9/16] bg-black rounded-[32px] overflow-hidden shadow-2xl border border-white/10 mb-8 relative">
                <video 
                    src={recordedUrl} 
                    controls 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col w-full max-w-sm gap-4">
               {/* Opção 1: Baixar */}
               <button 
                onClick={downloadVideo} 
                className="w-full bg-brand-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 group"
               >
                 <i className="fas fa-download group-hover:animate-bounce"></i> Baixar no Dispositivo
               </button>
               
               {/* Opção 2: Excluir */}
               <button 
                onClick={reset} 
                className="w-full bg-white/5 text-slate-400 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-red-500/10 hover:text-red-400 transition border border-white/5 flex items-center justify-center gap-3"
               >
                 <i className="fas fa-trash"></i> Excluir Vídeo
               </button>
            </div>
            
            <p className="mt-6 text-[10px] text-slate-500 font-medium text-center max-w-xs leading-relaxed">
                Este vídeo está apenas na memória temporária. <br/>
                Certifique-se de baixar antes de sair.
            </p>
         </div>
      ) : (
        /* Scrolling Area (Teleprompter Ativo) */
        <div 
            ref={scrollRef} 
            className={`flex-1 overflow-y-auto relative no-scrollbar cursor-pointer z-10 ${isMirrored ? 'scale-x-[-1]' : ''}`}
            onClick={() => {
                if(!isRecording) setIsPlaying(!isPlaying);
            }}
        >
            <div className="h-[40vh]"></div>
            
            <div className="fixed top-1/2 left-0 right-0 h-32 border-y border-white/10 bg-black/20 pointer-events-none -translate-y-1/2 z-0"></div>

            <div 
                className="px-8 md:px-32 max-w-4xl mx-auto text-white leading-tight font-bold text-center transition-all duration-300 select-none pb-[50vh] relative z-10 drop-shadow-lg" 
                style={{ fontSize: `${fontSize}px`, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
            >
            {text.split('\n').map((line, i) => (
                <p key={i} className="mb-8">{line}</p>
            ))}
            </div>
        </div>
      )}

      {/* Controles de Gravação (Escondido durante preview) */}
      {!videoBlob && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
            {!isRecording ? (
                <button 
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-red-600 hover:scale-110 transition-transform shadow-2xl"
                >
                    <div className="w-8 h-8 bg-white rounded-md"></div>
                </button>
            ) : (
                <button 
                    onClick={stopRecording}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/20 transition-colors shadow-2xl animate-pulse"
                >
                    <div className="w-8 h-8 bg-red-600 rounded-md"></div>
                </button>
            )}
            
            <p className="text-white font-black uppercase text-[10px] tracking-[0.2em] bg-black/50 px-3 py-1 rounded-full backdrop-blur">
                {isRecording ? "Gravando..." : "Toque para Gravar"}
            </p>
          </div>
      )}
    </div>
  );
};

export default Teleprompter;
