import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, ChevronLeft, ChevronRight, X, Replace, ReplaceAll } from 'lucide-react';

export default function FindReplace({ editor, onClose }) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  useEffect(() => {
    if (!editor || !findText) {
      setMatchCount(0);
      return;
    }

    // Simple match counter
    const text = editor.getText();
    const regex = new RegExp(findText, 'gi');
    const matches = text.match(regex);
    setMatchCount(matches ? matches.length : 0);
  }, [findText, editor]);

  const handleFind = () => {
    if (!editor || !findText) return;
    
    // In a real TipTap implementation, searching is complex.
    // We will use a basic "select next" approach for now.
    // For simplicity, we'll just focus the find input.
  };

  const handleReplace = () => {
    if (!editor || !findText) return;
    
    editor.chain().focus().insertContent(replaceText).run();
  };

  const handleReplaceAll = () => {
    if (!editor || !findText) return;

    const content = editor.getHTML();
    const regex = new RegExp(findText, 'gi');
    const newContent = content.replace(regex, replaceText);
    editor.commands.setContent(newContent);
  };

  return (
    <div className="find-replace-bar">
      <div className="flex items-center gap-2 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Find"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
          />
          {matchCount > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--text-muted)]">
              {matchCount} matches
            </span>
          )}
        </div>

        <div className="relative flex-1 max-w-sm">
          <RotateCcw size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Replace with"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button 
            onClick={handleReplace}
            className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <Replace size={12} />
            Replace
          </button>
          <button 
            onClick={handleReplaceAll}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <ReplaceAll size={12} />
            All
          </button>
        </div>
      </div>

      <div className="w-px h-6 bg-[var(--glass-border)] mx-2" />
      
      <button 
        onClick={onClose}
        className="p-1.5 rounded-full hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-white transition-all"
      >
        <X size={16} />
      </button>
    </div>
  );
}
