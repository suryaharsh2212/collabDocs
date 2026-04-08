import React, { useState, useEffect } from 'react';
import { DOMSerializer } from 'prosemirror-model';
import { TEMPLATES } from '../lib/templates';

export default function SnippetSidebar({ onClose, tiptapEditor }) {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' or 'snippets'
  const [snippets, setSnippets] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = () => {
    try {
      const stored = localStorage.getItem('collabdocs_snippets');
      if (stored) {
        setSnippets(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failure loading snippets', e);
    }
  };

  const saveSnippetList = (newList) => {
    localStorage.setItem('collabdocs_snippets', JSON.stringify(newList));
    setSnippets(newList);
  };

  // Extract currently selected blocks from TipTap as raw HTML
  const getSelectionHTML = () => {
    if (!tiptapEditor) return '';
    const { state } = tiptapEditor;
    const { selection } = state;
    if (selection.empty) return '';

    const fragment = selection.content().content;
    const dom = DOMSerializer.fromSchema(state.schema).serializeFragment(fragment);
    
    const div = document.createElement('div');
    div.appendChild(dom);
    return div.innerHTML;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const html = getSelectionHTML();
    if (!html) {
      alert("Please highlight text/blocks in the editor first before saving a snippet.");
      return;
    }

    const newSnippet = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      html: html,
      timestamp: new Date().toISOString()
    };

    saveSnippetList([...snippets, newSnippet]);
    setIsAdding(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDelete = (id) => {
    saveSnippetList(snippets.filter(s => s.id !== id));
  };

  const handleInsert = (snippet) => {
    if (tiptapEditor) {
      tiptapEditor.chain().focus().insertContent(snippet.html).run();
    }
  };

  return (
    <>
      <style>{`
        @keyframes popIn {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to   { transform: translateY(0) scale(1);    opacity: 1; }
        }
        .snippet-widget {
          animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .snippet-content::-webkit-scrollbar { width: 5px; }
        .snippet-content::-webkit-scrollbar-track { background: transparent; }
        .snippet-content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>

      <div className="snippet-widget fixed bottom-6 right-6 w-[380px] h-[550px] flex flex-col bg-[var(--surface-1)] border border-[var(--surface-3)] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] z-[101] backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col px-5 pt-5 pb-3 border-b border-[var(--surface-3)] bg-[var(--surface-2)]/80 rounded-t-3xl gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-none mb-1">Asset Gallery</h3>
                <p className="text-[10px] text-[var(--text-muted)] font-medium">Templates & Reusable Blocks</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-3)] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-[var(--surface-3)] rounded-xl border border-[var(--surface-4)]">
            <button 
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'templates' ? 'bg-[var(--surface-1)] text-indigo-400 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
            >
              Templates
            </button>
            <button 
              onClick={() => setActiveTab('snippets')}
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'snippets' ? 'bg-[var(--surface-1)] text-fuchsia-400 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
            >
              Snippets
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="snippet-content flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {activeTab === 'templates' ? (
            <div className="flex flex-col gap-4 animate-fade-in-scale">
               <div className="grid grid-cols-1 gap-3">
                 {TEMPLATES.filter(t => t.id !== 'blank').map(t => (
                   <button 
                    key={t.id} 
                    onClick={() => handleInsert({ html: t.html })}
                    className="group bg-[var(--surface-2)]/50 border border-[var(--surface-3)] rounded-2xl p-4 text-left transition-all hover:border-indigo-500/50 hover:bg-[var(--surface-2)] hover:shadow-lg active:scale-[0.98]"
                   >
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-[var(--surface-3)] border border-[var(--surface-4)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: `inset 0 0 10px ${t.brandColor}20` }}>{t.icon}</div>
                       <div className="flex-1">
                         <div className="text-[13px] font-bold text-white mb-0.5 group-hover:text-indigo-300 transition-colors">{t.title}</div>
                         <div className="text-[10px] text-[var(--text-muted)] leading-tight">{t.desc}</div>
                       </div>
                     </div>
                     <div className="flex mt-3 pt-3 border-t border-[var(--surface-3)] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Insert Template &rarr;</span>
                     </div>
                   </button>
                 ))}
               </div>
            </div>
          ) : (
            <>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-fuchsia-600/10 border border-dashed border-fuchsia-500/40 rounded-2xl text-sm font-bold text-fuchsia-300 hover:border-fuchsia-500 hover:bg-fuchsia-600/20 transition-all shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Save Selection
                </button>
              )}

              {isAdding && (
                <div className="bg-[var(--surface-2)] p-5 rounded-2xl border border-[var(--surface-3)] shadow-inner animate-pop-in">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></div>
                     <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest">New Snippet Configuration</span>
                  </div>
                  <form onSubmit={handleSave} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">Snippet Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Hero Section"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="bg-[var(--surface-1)] border border-[var(--surface-4)] rounded-2xl px-5 py-3.5 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-fuchsia-500/60 focus:ring-4 focus:ring-fuchsia-500/10 transition-all shadow-inner w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">Description</label>
                      <input
                        type="text"
                        placeholder="Briefly describe this block..."
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                        className="bg-[var(--surface-1)] border border-[var(--surface-4)] rounded-2xl px-5 py-3.5 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-fuchsia-500/60 focus:ring-4 focus:ring-fuchsia-500/10 transition-all shadow-inner w-full"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-2xl py-3.5 text-xs font-bold transition-all shadow-lg active:scale-95">
                        Save to Library
                      </button>
                      <button type="button" onClick={() => setIsAdding(false)} className="px-6 bg-[var(--surface-3)] hover:bg-[var(--surface-4)] text-[var(--text-primary)] rounded-2xl py-3.5 text-xs font-bold transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Snippet List */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.15em] text-[var(--text-muted)] opacity-60 flex items-center gap-2">
                  <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full"></span>
                  Your Collection ({snippets.length})
                </h4>
                {snippets.length === 0 && !isAdding ? (
                  <div className="text-center py-16 opacity-40">
                    <p className="text-sm font-medium">Your library is empty.</p>
                    <p className="text-[10px] mt-1">Highlight some text to get started.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {snippets.map(s => (
                      <div key={s.id} className="bg-[var(--surface-2)]/50 border border-[var(--surface-3)] rounded-2xl p-4 relative group transition-all hover:border-fuchsia-500/50 hover:bg-[var(--surface-2)] hover:shadow-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-0.5">{s.title}</h4>
                            {s.description && <p className="text-[10px] text-[var(--text-secondary)]">{s.description}</p>}
                          </div>
                          <button onClick={() => handleDelete(s.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-400 transition-all p-1.5 bg-[var(--surface-3)] rounded-lg">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                        <div className="flex gap-2 mt-4">
                           <button onClick={() => handleInsert(s)} className="flex-1 text-[11px] font-bold py-2.5 bg-fuchsia-600/10 hover:bg-fuchsia-600 text-fuchsia-400 hover:text-white rounded-xl shadow-sm transition-all border border-fuchsia-500/30">
                             Insert Block
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
