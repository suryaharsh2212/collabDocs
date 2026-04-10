/**
 * ExportPanel.jsx — Document Export Modal
 */
import { useState } from 'react';
import PropTypes from 'prop-types';
import TurndownService from 'turndown';

export default function ExportPanel({ getHTML, getWordCount, title, onClose, isCode = false }) {
  const [exporting, setExporting] = useState(null);
  const [view, setView] = useState('options');
  const [margins, setMargins] = useState({ top: 25, right: 25, bottom: 25, left: 25 });
  const [indentation, setIndentation] = useState(0);
  const [zoom, setZoom] = useState(0.8); 
  const [pageRange, setPageRange] = useState('full');
  
  const wordCount = getWordCount();
  const htmlContent = getHTML();

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const marginPresets = [
    { name: 'Normal', values: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 } },
    { name: 'Narrow', values: { top: 12.7, right: 12.7, bottom: 12.7, left: 12.7 } },
    { name: 'Wide', values: { top: 25.4, right: 50.8, bottom: 25.4, left: 50.8 } },
  ];

  const exportHTML = () => {
    setExporting('html');
    try {
      const html = getHTML();
      const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'CollabDocs Export'}</title>
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 2rem; line-height: 1.6; color: #1a1a1a; background: #fff; }
    h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #111; text-align: center; }
    h2 { font-size: 1.8rem; margin-top: 2rem; margin-bottom: 0.8rem; color: #333; }
    h3 { font-size: 1.4rem; margin-top: 1.5rem; margin-bottom: 0.6rem; color: #444; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; table-layout: auto; }
    th, td { border: 1px solid #ddd; padding: 12px 15px; text-align: left; }
    th { background-color: #f8f9fa; font-weight: bold; color: #333; }
    tr:nth-child(even) { background-color: #fafafa; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 14px; margin-bottom: 1.5rem; }
    code { font-family: inherit; background: rgba(0,0,0,0.05); padding: 0.2rem 0.4rem; border-radius: 4px; }
    pre code { background: transparent; padding: 0; }
    blockquote { border-left: 4px solid #6366f1; padding: 1rem 1.5rem; background: #f9f9ff; color: #444; font-style: italic; border-radius: 0 8px 8px 0; margin: 1.5rem 0; }
    img { max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 1.5rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    [style*="text-align: center"] { text-align: center; }
    [style*="text-align: center"] img, [style*="text-align: center"] table { margin-left: auto !important; margin-right: auto !important; }
    [style*="text-align: right"] { text-align: right; }
    [style*="text-align: right"] img, [style*="text-align: right"] table { margin-left: auto !important; margin-right: 0 !important; }
    ul[data-type="taskList"] { list-style: none; padding-left: 0; }
    ul[data-type="taskList"] li { display: flex; align-items: flex-start; margin-bottom: 0.5rem; }
    ul[data-type="taskList"] input[type="checkbox"] { margin-right: 10px; margin-top: 5px; }
  </style>
</head>
<body>
  <h1 style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 30px;">${title}</h1>
  ${html}
</body>
</html>`;
      downloadFile(fullHTML, `${title || 'export'}.html`, 'text/html');
    } finally {
      setExporting(null);
      onClose();
    }
  };

  const exportMarkdown = () => {
    setExporting('markdown');
    try {
      const html = getHTML();
      let markdown = '';
      if (isCode) {
        const div = document.createElement('div');
        div.innerHTML = html;
        markdown = `# ${title}\n\n\`\`\`\n${div.innerText || div.textContent}\n\`\`\``;
      } else {
        const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
        turndown.keep(['table']);
        markdown = `# ${title}\n\n${turndown.turndown(html)}`;
      }
      downloadFile(markdown, `${title || 'export'}.md`, 'text/markdown');
    } finally {
      setExporting(null);
      onClose();
    }
  };

  const exportPDF = async () => {
    setExporting('pdf');
    try {
      const html = getHTML();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/export/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, title, margins, indentation }),
      });

      if (!response.ok) throw new Error('PDF export failed');
      const blob = await response.blob();
      downloadFile(blob, `${title || 'export'}.pdf`, 'application/pdf');
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Failed to export PDF.');
    } finally {
      setExporting(null);
      onClose();
    }
  };

  const exportOptions = [
    { id: 'html', label: 'HTML', description: 'Clean document file', icon: '🌐', action: exportHTML, color: '#fb923c' },
    { id: 'markdown', label: 'Markdown', description: 'Raw document code', icon: 'M↓', action: exportMarkdown, color: '#34d399' },
    { id: 'pdf', label: 'PDF', description: 'Pro printable document', icon: '📄', action: () => setView('pdf-settings'), color: '#f472b6' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className={`relative glass rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl flex flex-col ${view === 'options' ? 'max-w-md w-full' : 'max-w-[95vw] w-full h-[90vh]'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            {view !== 'options' && (
              <button onClick={() => setView('options')} className="btn btn-ghost btn-sm group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back</span>
              </button>
            )}
            <h2 className="text-xl font-bold text-white tracking-tight">
              {view === 'options' ? (isCode ? 'Export Snippet' : 'Export Studio') : 'PDF Layout & Print Preview'}
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon hover:rotate-90 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {view === 'options' ? (
          <div className="p-6 space-y-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white font-semibold text-lg mb-1 truncate">{title || 'Untitled'}</p>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">~{wordCount} Words</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {exportOptions.map((opt) => (
                <button key={opt.id} onClick={opt.action} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group text-left">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl text-xl" style={{ backgroundColor: `${opt.color}20`, color: opt.color }}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold">{opt.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{opt.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-80 border-r border-white/10 bg-black/20 p-6 overflow-y-auto custom-scrollbar space-y-8">
              
              <section>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 block">Page Selection</label>
                <div className="grid grid-cols-1 gap-2">
                  {['full', 'current'].map(r => (
                    <button key={r} onClick={() => setPageRange(r)} className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${pageRange === r ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}>
                      {r === 'full' ? 'Complete Document' : 'Current Page Only'}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 block">Presets</label>
                <div className="grid grid-cols-1 gap-2">
                  {marginPresets.map(p => (
                    <button key={p.name} onClick={() => setMargins(p.values)} className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 text-xs text-white/80 transition-all text-left truncate">
                      {p.name}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 block">Custom Margins (mm)</label>
                {['top', 'bottom', 'left', 'right'].map(side => (
                  <div key={side} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-white/60 uppercase">{side}</span>
                      <span className="text-indigo-400">{margins[side]}mm</span>
                    </div>
                    <input type="range" min="0" max="80" step="1" value={margins[side]} onChange={(e) => setMargins({...margins, [side]: parseInt(e.target.value)})} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                ))}
              </section>

              <section className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-white/60 uppercase tracking-widest">Indentation</span>
                  <span className="text-emerald-400">{indentation}mm</span>
                </div>
                <input type="range" min="0" max="40" step="1" value={indentation} onChange={(e) => setIndentation(parseInt(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </section>

              <div className="pt-6 border-t border-white/10">
                <button onClick={exportPDF} disabled={exporting} className="w-full btn btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                  {exporting ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Generate PDF
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Layout Preview Pane */}
            <div className="flex-1 bg-black/40 p-12 overflow-y-auto custom-scrollbar relative flex flex-col items-center group">
              
              {/* Zoom Controls Overlay */}
              <div className="absolute top-6 right-8 flex items-center gap-4 bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setZoom(Math.max(0.4, zoom - 0.1))} className="btn btn-ghost btn-sm text-lg">−</button>
                <span className="text-xs font-mono text-white/60 w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="btn btn-ghost btn-sm text-lg">+</button>
              </div>

              {/* Multi-Page Canvas (Windowed Rendering) */}
              <div 
                className="flex flex-col gap-[15mm] transition-all duration-300 origin-top"
                style={{ transform: `scale(${zoom})` }}
              >
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="relative bg-white shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden flex-shrink-0"
                    style={{
                      width: '210mm',
                      height: '297mm',
                      padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
                      color: '#1a1a1a',
                    }}
                  >
                    <style dangerouslySetInnerHTML={{ __html: `
                      .preview-pg-${i} { 
                        transform: translateY(${-i * 297}mm);
                        font-family: 'Inter', system-ui, sans-serif;
                      }
                      .preview-pg-${i} * { margin-bottom: 0.8rem; line-height: 1.6; }
                      .preview-pg-${i} p { text-indent: ${indentation}mm; color: #1a1a1a !important; font-size: 11pt; }
                      .preview-pg-${i} h1 { font-size: 24pt; margin-bottom: 1.5rem; text-align: center; }
                      .preview-pg-${i} h2 { font-size: 18pt; margin-top: 2rem; margin-bottom: 1rem; border: none; }
                      .preview-pg-${i} table { width: 100% !important; border-collapse: collapse; margin: 1.5rem 0; table-layout: auto; }
                      .preview-pg-${i} td, .preview-pg-${i} th { border: 1px solid #ddd !important; padding: 10px !important; font-size: 10pt; }
                      .preview-pg-${i} img { max-width: 100% !important; height: auto !important; border-radius: 6px; display: block; margin: 1.5rem 0; }
                    ` }} />
                    <div 
                       className={`preview-pg-${i} text-left`}
                       dangerouslySetInnerHTML={{ __html: htmlContent }} 
                    />

                    {/* Page Marker */}
                    <div className="absolute top-4 left-4 text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] opacity-30 select-none">
                      Page {i + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* End of Document marker */}
              <div className="flex flex-col items-center gap-4 opacity-30 pb-40 mt-10">
                 <div className="w-1 h-12 bg-white/20 rounded-full" />
                 <div className="text-[10px] text-white uppercase tracking-[1em] font-black">
                   End of Preview
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ExportPanel.propTypes = {
  getHTML: PropTypes.func.isRequired,
  getWordCount: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isCode: PropTypes.bool,
};
