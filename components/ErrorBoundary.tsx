import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-fade-in-up">
           <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
             <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
           </div>
           <h2 className="text-2xl font-black text-white mb-2">Algo deu errado</h2>
           <p className="text-slate-400 max-w-md mb-8">
             Ocorreu um erro inesperado ao carregar este componente. Tente recarregar a página.
           </p>
           <button
             onClick={() => window.location.reload()}
             className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition shadow-lg shadow-red-600/20"
           >
             Recarregar Página
           </button>
           {process.env.NODE_ENV === 'development' && this.state.error && (
             <div className="mt-8 p-4 bg-slate-900 rounded-xl border border-white/10 text-left w-full max-w-2xl overflow-auto">
               <pre className="text-xs text-red-400 font-mono">{this.state.error.toString()}</pre>
             </div>
           )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
