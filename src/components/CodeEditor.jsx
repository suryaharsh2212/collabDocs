import { useEffect, useRef } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';

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

// Force @monaco-editor/react to use the locally bundled instance
// This prevents version conflicts and tokenizer bugs!
loader.config({ monaco });

export default function CodeEditor({ ydoc, provider, language }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const bindingRef = useRef(null);

  const handleEditorDidMount = (editor, m) => {
    editorRef.current = editor;
    monacoRef.current = m;
  };

  useEffect(() => {
    if (!editorRef.current || !ydoc || !provider) return;

    let binding;

    const initBinding = async () => {
      try {
        const { MonacoBinding } = await import('y-monaco');
        const ytext = ydoc.getText('code');
        
        // Clean up previous binding if it exists
        if (bindingRef.current) {
          bindingRef.current.destroy();
        }

        binding = new MonacoBinding(
          ytext,
          editorRef.current.getModel(),
          new Set([editorRef.current]),
          provider.awareness
        );
        bindingRef.current = binding;
      } catch (err) {
        console.error('Failed to initialize MonacoBinding:', err);
      }
    };

    initBinding();

    return () => {
      if (binding) {
        binding.destroy();
        bindingRef.current = null;
      }
    };
  }, [ydoc, provider]);

  return (
    <div className="h-full min-h-[500px]">
      <MonacoEditor
        key={language}
        height="100%"
        language={language}
        theme="vs-dark"
        options={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 15,
          lineHeight: 1.6,
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          renderLineHighlight: 'gutter',
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

CodeEditor.propTypes = {
  ydoc: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
  language: PropTypes.string,
};
