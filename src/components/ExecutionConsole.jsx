import React, { useEffect, useRef } from 'react';
import { X, Terminal, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function ExecutionConsole({ logs, isOpen, onClose, onClear }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[110] bg-[#0f1115] border-t border-[#1e2227] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] animate-slide-up">
      <div className="flex items-center justify-between px-4 py-2 bg-[#181a1f] border-b border-[#1e2227]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Terminal / Output</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onClear}
            className="text-[10px] font-bold text-[var(--text-muted)] hover:text-white flex items-center gap-1 transition-colors"
          >
            <Trash2 size={12} /> Clear
          </button>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-48 overflow-y-auto p-4 font-mono text-xs leading-relaxed custom-scrollbar bg-[#0f1115]"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[var(--text-muted)] italic opacity-50">
            No output yet. Click 'Run' to execute code.
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={`mb-1.5 flex gap-3 ${log.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
              <span className="text-[var(--text-muted)] opacity-30 select-none">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
              <span className="whitespace-pre-wrap">{log.content}</span>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
