
import React, { useState, useEffect } from 'react';
import { Note } from '../types';

interface NotesProps {
  onAction?: () => void;
}

const Notes: React.FC<NotesProps> = ({ onAction }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gera_notes') || '[]');
    setNotes(saved);
  }, []);

  const addNote = () => {
    if (!content.trim()) return;
    const newNote: Note = { id: Date.now().toString(), title: title || 'Sem título', content, timestamp: Date.now() };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('gera_notes', JSON.stringify(updated));
    setTitle('');
    setContent('');
    if (onAction) onAction();
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('gera_notes', JSON.stringify(updated));
  };

  const inputClasses = "w-full bg-white border-2 border-black rounded-2xl p-4 text-black font-bold outline-none focus:ring-4 focus:ring-brand-500/20";
  const buttonHoverClasses = "transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg";

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-5xl font-black text-white tracking-tighter">Ideias & Insights<span className="text-brand-600">.</span></h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Guarde tudo o que vier à mente</p>
      </div>

      <div className="glass-panel-light p-10 rounded-[40px] space-y-6 shadow-2xl border-white">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da Ideia..." className={inputClasses} />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Descreva seu insight..." className={`${inputClasses} h-32`} />
        <button onClick={addNote} className={`w-full py-5 bg-black text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl ${buttonHoverClasses}`}>
          Salvar Anotação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map(n => (
          <div key={n.id} className="glass-panel p-8 rounded-[32px] border-white/5 relative group">
            <button onClick={() => deleteNote(n.id)} className="absolute top-6 right-6 text-slate-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
              <i className="fas fa-trash"></i>
            </button>
            <h4 className="font-black text-white text-lg mb-2">{n.title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{n.content}</p>
            <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              {new Date(n.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
