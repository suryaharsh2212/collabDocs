import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, 
  List, Settings, Info, 
  Type, Layout, Eye,
  Navigation, Hash, Clock, FileText,
  MousePointer2, Upload, Sparkles, Loader2
} from 'lucide-react';
import { extractTextFromPDF } from '../utils/pdfExtractor';

export default function Sidebar({ editor, onClose, isVisible, showLineNumbers, onToggleLineNumbers, showPageNumbers, onTogglePageNumbers }) {
  const [activeTab, setActiveTab] = useState('outline');
  const [headings, setHeadings] = useState([]);
  const [importStatus, setImportStatus] = useState(null); // null | 'extracting' | 'reconstructing'

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setImportStatus('extracting');
    try {
      // 1. Local Extraction
      const rawText = await extractTextFromPDF(file);
      
      // 2. AI Reconstruction
      setImportStatus('reconstructing');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/import/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });

      if (!response.ok) throw new Error('AI reconstruction failed');
      const data = await response.json();

      // 3. Update Editor (Replace Content)
      editor.commands.setContent(data.html);
      
    } catch (err) {
      console.error('Import Error:', err);
      alert('Failed to import PDF. Try a different file or check your connection.');
    } finally {
      setImportStatus(null);
      // Reset file input
      e.target.value = '';
    }
  };

  // Generate Document Outline
  useEffect(() => {
    if (!editor) return;

    const updateOutline = () => {
      const { doc } = editor.state;
      const foundHeadings = [];
      
      doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          foundHeadings.push({
            level: node.attrs.level,
            text: node.textContent,
            pos
          });
        }
      });
      
      setHeadings(foundHeadings);
    };

    updateOutline();
    editor.on('update', updateOutline);
    return () => editor.off('update', updateOutline);
  }, [editor]);

  const scrollToHeading = (pos) => {
    editor.chain().focus().setTextSelection(pos).scrollIntoView().run();
  };

  const stats = editor ? {
    words: editor.storage.characterCount?.words() || 0,
    characters: editor.storage.characterCount?.characters() || 0,
  } : { words: 0, characters: 0 };

  if (!isVisible) return null;

  return (
    <div className="w-64 glass border-r border-[var(--glass-border)] flex flex-col h-full animate-fade-in relative z-30">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-300 flex items-center gap-2">
          <Layout size={14} />
          Doc Inspector
        </span>
        <button 
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--glass-border)]">
        {[
          { id: 'outline', icon: <List size={14} />, label: 'Outline' },
          { id: 'settings', icon: <Settings size={14} />, label: 'Styles' },
          { id: 'info', icon: <Info size={14} />, label: 'Stats' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-3 flex flex-col items-center gap-1 transition-all
              ${activeTab === tab.id 
                ? 'text-indigo-400 bg-indigo-500/5' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
              }
            `}
          >
            {tab.icon}
            <span className="text-[9px] font-bold uppercase tracking-tighter">{tab.label}</span>
            {activeTab === tab.id && <div className="absolute bottom-0 w-8 h-0.5 bg-indigo-500 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {activeTab === 'outline' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">Document Outline</h4>
            {headings.length > 0 ? (
              <div className="space-y-1">
                {headings.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToHeading(h.pos)}
                    className={`
                      block w-full text-left py-1.5 px-2 rounded-md text-xs transition-all hover:bg-[var(--surface-3)] group
                      ${h.level === 1 ? 'font-bold text-[var(--text-primary)] pl-2' : ''}
                      ${h.level === 2 ? 'text-[var(--text-secondary)] pl-4' : ''}
                      ${h.level >= 3 ? 'text-[var(--text-muted)] pl-6 text-[11px]' : ''}
                    `}
                  >
                    <span className="truncate block">
                      <span className="opacity-0 group-hover:opacity-40 mr-1 text-indigo-400">#</span>
                      {h.text || <em className="opacity-40">Untitled Section</em>}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center">
                <Hash size={32} className="mb-2" />
                <p className="text-[10px] font-bold">No headings found</p>
                <p className="text-[9px] mt-1 italic leading-tight">Use H1/H2 styles to<br/>generate navigation</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">View Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Show Line Numbers</span>
                  <div 
                    onClick={onToggleLineNumbers}
                    className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${showLineNumbers ? 'bg-indigo-500' : 'bg-[var(--surface-4)]'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${showLineNumbers ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Dark Mode Sync</span>
                  <div className="w-8 h-4 bg-indigo-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Page Numbers</span>
                  <div 
                    onClick={onTogglePageNumbers}
                    className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${showPageNumbers ? 'bg-indigo-500' : 'bg-[var(--surface-4)]'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${showPageNumbers ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--glass-border)]">
              <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">Page Layout</h4>
              <p className="text-[9px] text-[var(--text-muted)] italic leading-relaxed">
                Standard A4 virtual sizing is applied to the workspace (816px width). Margins are set to 2.5rem by default.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-[var(--surface-2)] border border-[var(--surface-4)] rounded-lg text-[10px] font-bold text-center">Portrait</button>
                <button className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-[10px] font-bold text-indigo-300 text-center">Landscape</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">Document Stats</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl bg-[var(--surface-3)]/50 border border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Type size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-[var(--text-muted)]">Words</p>
                    <p className="text-xl font-black">{stats.words}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface-3)]/50 border border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-[var(--text-muted)]">Characters</p>
                    <p className="text-xl font-black">{stats.characters}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 opacity-70">
              <div className="flex items-center gap-2 text-xs">
                <Clock size={12} className="text-[var(--brand-500)]" />
                <span className="text-[var(--text-muted)]">Real-time sync active</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MousePointer2 size={12} className="text-[var(--brand-500)]" />
                <span className="text-[var(--text-muted)]">Collaboration enabled</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Magic Import Portal */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">AI Intelligence</span>
          <span className="text-[7px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest border border-indigo-500/20">Beta (Text Only)</span>
        </div>
        <div className={`relative group h-12 rounded-xl border transition-all duration-500 overflow-hidden ${importStatus ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-white/10 hover:border-indigo-500/30'}`}>
          {/* Magic Shimmer Effect */}
          {importStatus && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />}

          <label className="absolute inset-0 cursor-pointer flex items-center px-4 gap-3">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleImport}
              className="hidden"
              disabled={!!importStatus}
            />
            
            <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all ${importStatus ? 'bg-indigo-500 animate-bounce' : 'bg-white/5 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'}`}>
              {importStatus ? <Sparkles size={14} className="text-white" /> : <Upload size={14} />}
            </div>

            <div className="flex-1 overflow-hidden">
              {importStatus ? (
                <p className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap animate-pulse">
                  Magic: Reading & Transforming...
                </p>
              ) : (
                <>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none text-wrap pr-4">Extract Text From PDF</p>
                  {/* <p className="text-[8px] text-[var(--text-muted)] font-medium truncate uppercase tracking-tighter">AI Reconstruction Portal</p>  */}
                </>
              )}
            </div>

            {!importStatus && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                 <Sparkles size={12} className="text-indigo-400 animate-pulse" />
              </div>
            )}
          </label>
        </div>
        <p className="mt-2 text-[7px] text-white/20 italic leading-tight px-1">
          * Beta: Layouts with complex graphics or images may be skipped.
        </p>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--surface-1)]">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-[var(--text-muted)]">V 2.0 (Premium)</span>
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="text-[9px] font-bold text-emerald-500">Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
