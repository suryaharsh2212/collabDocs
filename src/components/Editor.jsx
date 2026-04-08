/**
 * Editor.jsx — TipTap Rich Text Collaborative Editor
 */
import { useEffect } from 'react';
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
import PropTypes from 'prop-types';

export default function Editor({ ydoc, provider, onEditorReady }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        codeBlock: false,
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
      Collaboration.configure({
        document: ydoc,
        field: 'tiptap',
      }),
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
    <div className="w-full flex justify-center animate-fade-in">
      <div className="w-full max-w-3xl">
        <div className="tiptap-editor">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

Editor.propTypes = {
  ydoc: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
  onEditorReady: PropTypes.func,
};
