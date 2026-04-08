import { useState, useEffect, useRef } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';
import { MonacoBinding } from 'y-monaco';

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
  const [editor, setEditor] = useState(null);
  const bindingRef = useRef(null);

  const handleEditorDidMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  useEffect(() => {
    if (!editor || !ydoc || !provider) return;

    // We use 'code' as the shared type name for code rooms
    const ytext = ydoc.getText('code');
    
    // Clean up previous binding if it exists
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

    return () => {
      if (binding) {
        binding.destroy();
        bindingRef.current = null;
      }
    };
  }, [editor, ydoc, provider]);

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
