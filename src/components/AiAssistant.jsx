import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Wand2, Check, Copy, RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';
import { marked } from 'marked';

/**
 * AiAssistant — A floating, context-aware AI writing partner.
 */
export default function AiAssistant({ isOpen, onClose, editor, mode = 'doc', variant = 'modal' }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [useContext, setUseContext] = useState(true);
  const modalRef = useRef(null);
  const savedSelection = useRef(null);

  // Helper: Is this a TipTap editor?
  const isTipTap = editor && editor.getText && editor.chain;
  // Helper: Is this a Monaco editor?
  const isMonaco = editor && editor.getValue && !editor.getText;

  // Focus input and save selection when opened
  useEffect(() => {
    if (isOpen) {
      if (isTipTap) {
        savedSelection.current = {
          from: editor.state.selection.from,
          to: editor.state.selection.to
        };
      } else if (isMonaco) {
        savedSelection.current = editor.getSelection();
      }
      setTimeout(() => {
        document.getElementById('ai-prompt-input')?.focus();
      }, 100);
    }
  }, [isOpen, editor, isTipTap, isMonaco]);

  const handleAskAi = async () => {
    if (!prompt.trim()) return;

    // Check Daily Limit
    const today = new Date().toDateString();
    const stats = JSON.parse(localStorage.getItem('ai_assist_stats') || '{"date":"","count":0}');
    
    if (stats.date === today && stats.count >= 10) {
      setError('Daily limit reached (10 per day). See you tomorrow!');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      let context = '';
      if (useContext && editor) {
        if (isTipTap) context = editor.getText().slice(0, 5000);
        else if (isMonaco) context = editor.getValue().slice(0, 5000);
      }
      
      const response = await fetch(`${apiUrl}/api/ai/assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), context, mode })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI Failed');

      setResult(data.html); // This is now raw Markdown for 'code' mode
      
      localStorage.setItem('ai_assist_stats', JSON.stringify({
        date: today,
        count: (stats.date === today ? stats.count + 1 : 1)
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = (isReplace = false) => {
    if (!result || !editor) return;
    
    // Extract code block if in code mode, otherwise use raw result (HTML for docs)
    let contentToInsert = result;
    if (mode === 'code') {
      const codeMatch = result.match(/```(?:[a-zA-Z]*)\n?([\s\S]*?)```/);
      contentToInsert = codeMatch ? codeMatch[1].trim() : result;
    }

    if (isTipTap) {
      const { from, to } = savedSelection.current || editor.state.selection;
      if (isReplace) {
        editor.chain().focus().deleteRange({ from, to }).insertContent(contentToInsert).run();
      } else {
        editor.chain().focus().insertContentAt(to, contentToInsert).run();
      }
    } else if (isMonaco) {
      const selection = savedSelection.current || editor.getSelection();
      const range = isReplace ? selection : {
        startLineNumber: selection.endLineNumber,
        startColumn: selection.endColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn,
      };

      editor.executeEdits('ai-assistant', [{
        range: range,
        text: isReplace ? contentToInsert : '\n' + contentToInsert,
        forceMoveMarkers: true
      }]);
      editor.focus();
    }

    onClose();
    setResult('');
    setPrompt('');
  };

  if (!isOpen) return null;

  const isSidebar = variant === 'sidebar';

  return (
    <div className={isSidebar ? 'z-[100]' : 'fixed inset-0 z-[100] flex items-center justify-center p-4'}>
      {/* Backdrop (Only for Modal) */}
      {!isSidebar && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
          onClick={onClose} 
        />
      )}

      {/* Modal / Sidebar Container */}
      <div 
        ref={modalRef}
        className={`
          flex flex-col bg-[var(--surface-1)] border-l border-[var(--glass-border)] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-300
          ${isSidebar 
            ? 'fixed top-[120px] right-0 w-[480px] h-[calc(100vh-120px)] animate-slide-in-right z-[100]' 
            : 'relative w-full max-w-xl rounded-[2rem] animate-fade-in-scale border shadow-[0_0_100px_rgba(99,102,241,0.2)]'
          }
        `}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--glass-border)] flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">Ask with Crix</h3>
              <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{mode === 'code' ? 'Debugging & Dev Mode' : 'Content Partner'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-white transition-all underline-none border-none outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className={`p-8 flex flex-col ${isSidebar ? 'h-[calc(100%-80px)] overflow-y-auto custom-scrollbar' : ''}`}>
          {/* Main Input Area */}
          {!result ? (
            <div className="space-y-6">
              <div className="relative group">
                <textarea
                  id="ai-prompt-input"
                  rows={isSidebar ? 6 : 4}
                  className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] focus:border-indigo-500/50 rounded-2xl p-5 text-sm text-white placeholder-[var(--text-muted)] outline-none transition-all shadow-inner resize-none"
                  placeholder={mode === 'code' ? "Describe the bug or task (e.g., 'Fix the loop' or 'Refactor this function')..." : "Ask AI to help you write, refine, or summarize..."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAskAi();
                  }}
                />
                <div className="absolute bottom-4 right-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">
                  Ctrl + Enter
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={useContext}
                    onChange={(e) => setUseContext(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--glass-border)] bg-[var(--surface-3)] text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors uppercase tracking-widest">
                    Include Context
                  </span>
                </label>

                <button
                  onClick={handleAskAi}
                  disabled={isLoading || !prompt.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Analyze
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>
                </div>
              )}
            </div>
          ) : (
            /* Result Area */
            <div className="space-y-6 animate-fade-in flex-1 flex flex-col">
              <div className={`bg-[var(--surface-2)] border border-indigo-500/30 rounded-2xl p-6 overflow-y-auto custom-scrollbar ${isSidebar ? 'flex-1 mb-4' : 'max-h-[400px]'}`}>
                <div 
                  className="ai-report-content text-white" 
                  dangerouslySetInnerHTML={{ 
                    __html: mode === 'code' ? marked.parse(result) : result 
                  }} 
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleInsert(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Check size={16} />
                  Insert Only
                </button>
                <button
                  onClick={() => handleInsert(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[var(--surface-3)] hover:bg-[var(--surface-4)] text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-[var(--glass-border)] transition-all"
                >
                  <RefreshCw size={16} />
                  Replace
                </button>
                <button
                  onClick={() => setResult('')}
                  className="p-3.5 rounded-xl bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-white border border-[var(--glass-border)] transition-all"
                  title="Try Again"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info (Only for Sidebar) */}
        {isSidebar && (
           <div className="px-8 py-4 bg-[var(--surface-2)]/50 border-t border-[var(--glass-border)] flex items-center justify-between mt-auto">
              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                AI Helper • Online
              </span>
              <div className="flex items-center gap-1">
                {[1,2,3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

AiAssistant.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editor: PropTypes.object,
  mode: PropTypes.string,
  variant: PropTypes.string
};
