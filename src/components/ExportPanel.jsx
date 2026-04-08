/**
 * ExportPanel.jsx — Document Export Modal
 */
import { useState } from 'react';
import PropTypes from 'prop-types';
import TurndownService from 'turndown';

export default function ExportPanel({ getHTML, getWordCount, title, onClose }) {
  const [exporting, setExporting] = useState(null);
  const wordCount = getWordCount();

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
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a1a; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    code { background: #f0f0f0; padding: 0.15rem 0.3rem; border-radius: 3px; font-family: monospace; }
    blockquote { border-left: 3px solid #6366f1; padding-left: 1rem; color: #666; font-style: italic; }
    h1, h2, h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <h1 style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 10px;">${title}</h1>
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
      const turndown = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-',
      });
      const markdown = `# ${title}\n\n${turndown.turndown(html)}`;
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html, title }),
      });

      if (!response.ok) {
        throw new Error('PDF export failed on server');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'export'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Failed to export PDF. Ensure the API server is running.');
    } finally {
      setExporting(null);
      onClose();
    }
  };

  const exportOptions = [
    {
      id: 'html',
      label: 'HTML',
      description: 'Clean HTML document',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      action: exportHTML,
      color: '#fb923c',
    },
    {
      id: 'markdown',
      label: 'Markdown',
      description: 'Raw Markdown (.md)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      action: exportMarkdown,
      color: '#34d399',
    },
    {
      id: 'pdf',
      label: 'PDF',
      description: 'Printable PDF document',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      ),
      action: exportPDF,
      color: '#f472b6',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass rounded-2xl p-6 w-full max-w-md animate-fade-in-scale">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Export Document</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-4 rounded-xl bg-[var(--surface-1)] border border-[var(--surface-3)]">
          <p className="text-white font-medium mb-1 truncate" title={title}>{title || 'Untitled Document'}</p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>~{wordCount} words</span>
            <span>•</span>
            <span>Rich text export</span>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.action}
              disabled={exporting !== null}
              className="
                w-full flex items-center gap-4 p-4 rounded-xl
                bg-[var(--surface-2)] border border-[var(--surface-4)]
                hover:border-indigo-500/30 hover:bg-[var(--surface-3)]
                transition-all group text-left
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: option.color + '20', color: option.color }}
              >
                {exporting === option.id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  option.icon
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{option.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{option.description}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-auto text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

ExportPanel.propTypes = {
  getHTML: PropTypes.func.isRequired,
  getWordCount: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
