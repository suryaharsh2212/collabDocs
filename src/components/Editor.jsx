/**
 * Editor.jsx — Dual-mode Collaborative Editor
 *
 * Renders either:
 * - TipTap rich text editor (with StarterKit, Collaboration, CollaborationCursor)
 * - Monaco code editor (with y-monaco binding for collaborative editing)
 *
 * The mode is controlled via the `mode` prop from DocPage.
 *
 * COLLABORATION SETUP:
 * Both editors share the same Y.Doc but use different Y shared types:
 * - TipTap uses Y.XmlFragment('tiptap') — stores rich text structure
 * - Monaco uses Y.Text('monaco') — stores plain text
 *
 * This means rich text and code mode are separate documents within the same room.
 * Switching modes switches which shared type you're viewing/editing.
 */
import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import Image from '@tiptap/extension-image';
import SlashCommands from './CommandMenu';
import MonacoEditor from '@monaco-editor/react';
import PropTypes from 'prop-types';

/**
 * TipTap Rich Text Editor with Yjs collaboration
 */
function RichTextEditor({ ydoc, provider, onEditorReady }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // IMPORTANT: Disable the built-in history when using Collaboration.
        // The Collaboration extension provides its own undo/redo via Yjs,
        // which correctly handles concurrent edits from multiple users.
        history: false,
        codeBlock: false, // Turn off default codeblock, we use lowlight instead
      }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight,
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: true, allowBase64: true }),
      SlashCommands,
      // Collaboration extension — syncs editor content via the Yjs CRDT document.
      // Uses an XmlFragment shared type to preserve the rich text node structure.
      Collaboration.configure({
        document: ydoc,
        field: 'tiptap', // The shared type name — all clients must use the same name
      }),
      // CollaborationCursor — shows other users' cursor positions and selections.
      // Reads from the Yjs Awareness protocol, which is separate from document sync.
      // Each user's awareness state includes their name, color, and cursor position.
      CollaborationCursor.configure({
        provider: provider,
        user: provider.awareness.getLocalState()?.user || {
          name: 'Anonymous',
          color: '#6366f1',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px]',
      },
    },
  });

  // Expose the TipTap editor instance to parent for Toolbar commands
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
    return () => {
      if (onEditorReady) onEditorReady(null);
    };
  }, [editor, onEditorReady]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
}

RichTextEditor.propTypes = {
  ydoc: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
  onEditorReady: PropTypes.func,
};

/**
 * Monaco Code Editor with Yjs collaboration
 */
function CodeEditor({ ydoc, provider, roomId }) {
  const editorRef = useRef(null);
  const bindingRef = useRef(null);

  const handleEditorDidMount = async (editor) => {
    editorRef.current = editor;

    try {
      // Dynamically import y-monaco to avoid SSR issues
      const { MonacoBinding } = await import('y-monaco');

      // Get or create the Y.Text shared type for code content
      const ytext = ydoc.getText('monaco');

      // MonacoBinding connects the Y.Text to the Monaco editor model.
      // It handles:
      // - Syncing text changes bidirectionally (editor <-> yjs)
      // - Rendering remote cursors via the awareness protocol
      // - Managing selections from other users
      bindingRef.current = new MonacoBinding(
        ytext,
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );
    } catch (err) {
      console.error('Failed to initialize MonacoBinding:', err);
    }
  };

  // Cleanup binding on unmount
  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full min-h-[500px]">
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        options={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 14,
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
  roomId: PropTypes.string.isRequired,
};

/**
 * Main Editor component — switches between rich text and code modes
 */
export default function Editor({ mode, ydoc, provider, roomId, onEditorReady }) {
  return (
    <div className="flex-1 h-full">
      {mode === 'richtext' ? (
        <div className="w-full flex justify-center animate-fade-in">
          <div className="w-full max-w-3xl">
            <RichTextEditor
              ydoc={ydoc}
              provider={provider}
              onEditorReady={onEditorReady}
            />
          </div>
        </div>
      ) : (
        <div className="h-full animate-fade-in">
          <CodeEditor
            ydoc={ydoc}
            provider={provider}
            roomId={roomId}
          />
        </div>
      )}
    </div>
  );
}

Editor.propTypes = {
  /** Current editor mode: 'richtext' or 'code' */
  mode: PropTypes.oneOf(['richtext', 'code']).isRequired,
  /** Yjs document instance */
  ydoc: PropTypes.object.isRequired,
  /** Yjs WebSocket provider */
  provider: PropTypes.object.isRequired,
  /** Room identifier */
  roomId: PropTypes.string.isRequired,
  /** Callback to expose TipTap editor instance to parent */
  onEditorReady: PropTypes.func,
};
