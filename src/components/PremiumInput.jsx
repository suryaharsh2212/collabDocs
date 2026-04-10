import React, { useState, useEffect, useRef } from 'react';
import { X, Table as TableIcon, Image as ImageIcon, Link as LinkIcon, Plus, Check } from 'lucide-react';

export default function PremiumInput({ type, onClose, onSubmit, initialValue = '' }) {
  const [value1, setValue1] = useState(type === 'table' ? '3' : initialValue);
  const [value2, setValue2] = useState(type === 'table' ? '3' : '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (type === 'table') {
      onSubmit({ rows: parseInt(value1) || 3, cols: parseInt(value2) || 3 });
    } else {
      onSubmit(value1);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'table': return 'Insert Table';
      case 'image': return 'Insert Image';
      case 'link': return 'Insert Link';
      default: return 'Input';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'table': return <TableIcon size={18} className="text-indigo-400" />;
      case 'image': return <ImageIcon size={18} className="text-emerald-400" />;
      case 'link': return <LinkIcon size={18} className="text-sky-400" />;
      default: return <Plus size={18} />;
    }
  };

  return (
    <div className="fixed top-24 right-8 z-[100] animate-slide-in-right">
      <div className="w-80 glass border border-[var(--glass-border)] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)] bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] flex items-center justify-center">
              {getIcon()}
            </div>
            <span className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
              {getTitle()}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {type === 'table' ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Rows</label>
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  max="20"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Cols</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
                {type === 'image' ? 'Image URL' : 'Link URL'}
              </label>
              <input
                ref={inputRef}
                type="text"
                placeholder={type === 'image' ? 'https://example.com/image.jpg' : 'https://google.com'}
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-brand text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Check size={16} strokeWidth={3} />
            {type === 'table' ? 'Insert Table' : (type === 'image' ? 'Insert Image' : 'Apply Link')}
          </button>
        </div>
      </div>
    </div>
  );
}
