import { useState, useEffect, useRef } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';
import { MonacoBinding } from 'y-monaco';
import { 
  Sun, Moon, Type, AlignJustify, ArrowUpToLine, ArrowDownToLine, 
  Settings2, ChevronDown, Sparkles, Check, Copy
} from 'lucide-react';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Configure Vite Web Workers for Monaco
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new jsonWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker();
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker();
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    return new editorWorker();
  }
};

loader.config({ monaco });

export default function CodeEditor({ ydoc, provider, language, onEditorReady }) {
  const [editor, setEditor] = useState(null);
  const bindingRef = useRef(null);
  
  // Editor Customization State
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('ce_fontSize')) || 15);
  const [lineHeight, setLineHeight] = useState(() => Number(localStorage.getItem('ce_lineHeight')) || 1.6);
  const [padding, setPadding] = useState(() => Number(localStorage.getItem('ce_padding')) || 16);
  const [theme, setTheme] = useState(() => localStorage.getItem('ce_theme') || 'collabdocs-dark');
  const [copied, setCopied] = useState(false);

  const handleEditorDidMount = (editorInstance, monaco) => {
    // Define custom dark theme
    monaco.editor.defineTheme('collabdocs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0b0d17',
        'editor.lineHighlightBackground': '#1a1d2e',
        'editorGutter.background': '#0b0d17',
      }
    });

    // Define custom light theme
    monaco.editor.defineTheme('collabdocs-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#f8fafc',
        'editor.lineHighlightBackground': '#f1f5f9',
        'editorGutter.background': '#f8fafc',
      }
    });
    
    monaco.editor.setTheme(theme);
    setEditor(editorInstance);

    if (onEditorReady) onEditorReady(editorInstance);
  };



  useEffect(() => {
    if (editor) {
      monaco.editor.setTheme(theme);
      localStorage.setItem('ce_theme', theme);
    }
  }, [theme, editor]);

  useEffect(() => {
    localStorage.setItem('ce_fontSize', fontSize);
    localStorage.setItem('ce_lineHeight', lineHeight);
    localStorage.setItem('ce_padding', padding);
  }, [fontSize, lineHeight, padding]);

  useEffect(() => {
    if (!editor || !ydoc || !provider) return;

    const ytext = ydoc.getText('code');
    
    if (bindingRef.current) {
      bindingRef.current.destroy();
    }

    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
    bindingRef.current = binding;

    // Dynamic Cursor CSS Injection
    const styleId = 'y-monaco-cursor-dynamic';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    const updateCursorStyles = () => {
      const states = provider.awareness.getStates();
      let css = '';
      states.forEach((state, clientId) => {
        if (state.user && clientId !== provider.awareness.clientID) {
          const { name, color } = state.user;
          css += `
            .yRemoteSelection-${clientId} {
              background-color: ${color}33;
            }
            .yRemoteSelectionHead-${clientId} {
              position: absolute;
              border-left: 2px solid ${color};
              height: 100%;
              box-sizing: border-box;
              z-index: 10;
            }
            .yRemoteSelectionHead-${clientId}::after {
              content: '${name}';
              position: absolute;
              background-color: ${color};
              color: white;
              font-size: 10px;
              padding: 1px 6px;
              border-radius: 4px 4px 4px 0px;
              top: -16px;
              left: -2px;
              white-space: nowrap;
              font-family: 'Inter', sans-serif;
              font-weight: 800;
              pointer-events: none;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              text-transform: uppercase;
              letter-spacing: 0.5px;
              opacity: 1;
            }
          `;
        }
      });
      style.innerHTML = css;
    };

    provider.awareness.on('change', updateCursorStyles);
    updateCursorStyles(); // Initial burst

    return () => {
      if (binding) {
        binding.destroy();
        bindingRef.current = null;
      }
      provider.awareness.off('change', updateCursorStyles);
    };
  }, [editor, ydoc, provider]);


  const handleCopy = async () => {
    if (!editor) return;
    try {
      await navigator.clipboard.writeText(editor.getValue());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="h-full flex flex-col min-h-[500px]">
      {/* Compact Control Bar */}
      <div className="px-4 py-1 border-b border-[var(--surface-3)] bg-[var(--surface-1)]/50 flex items-center justify-between gap-4 select-none h-9">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--surface-4)]">
            <Type size={12} className="text-[var(--text-muted)]" />
            <input 
              type="number" 
              value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-8 bg-transparent text-[10px] font-bold text-white outline-none"
              min="10" max="30"
            />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--surface-4)]">
            <AlignJustify size={12} className="text-[var(--text-muted)]" />
            <input 
              type="number" 
              step="0.1"
              value={lineHeight} 
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-8 bg-transparent text-[10px] font-bold text-white outline-none"
              min="1" max="3"
            />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--surface-4)]">
            <ArrowUpToLine size={12} className="text-[var(--text-muted)]" />
            <input 
              type="number" 
              value={padding} 
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-8 bg-transparent text-[10px] font-bold text-white outline-none"
              min="0" max="100"
            />
          </div>
          <div className="w-px h-3 bg-[var(--surface-4)] mx-1" />
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 h-6 px-3 rounded-md border transition-all ${
              copied 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-[var(--surface-2)] border-[var(--surface-4)] text-[var(--text-muted)] hover:text-white hover:border-indigo-500/50'
            }`}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span className="text-[9px] font-black uppercase tracking-widest">
              {copied ? 'Copied' : 'Copy'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'collabdocs-dark' ? 'collabdocs-light' : 'collabdocs-dark')}
            className={`flex items-center gap-2 h-6 px-2.5 rounded-md border transition-all ${
              theme === 'collabdocs-dark' 
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20' 
                : 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
            }`}
          >
            {theme === 'collabdocs-dark' ? <Moon size={11} /> : <Sun size={11} />}
            <span className="text-[9px] font-black uppercase tracking-widest">
              {theme === 'collabdocs-dark' ? 'COSMIC' : 'CLASSIC'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <MonacoEditor
          key={`${language}-${theme}`}
          height="100%"
          language={language}
          theme={theme}
          options={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: fontSize,
            lineHeight: fontSize * lineHeight,
            minimap: { enabled: false },
            padding: { top: padding, bottom: padding },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'off',
            smoothScrolling: true,

            renderLineHighlight: 'gutter',
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            scrollbar: {
              vertical: 'visible',
              useShadows: false,
              verticalScrollbarSize: 10,
            }
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}

CodeEditor.propTypes = {
  ydoc: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
  language: PropTypes.string,
  onEditorReady: PropTypes.func
};
