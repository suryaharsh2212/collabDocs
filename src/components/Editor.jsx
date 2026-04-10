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
import { ResizableImage } from '../lib/ResizableImage';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CharacterCount from '@tiptap/extension-character-count';
import { FontSize, LineHeight, Indent, ParagraphSpacing, GlobalAlignment } from '../lib/editorExtensions';
import SlashCommands from './CommandMenu';
import PropTypes from 'prop-types';

export default function Editor({ ydoc, provider, onEditorReady }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        codeBlock: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      LineHeight,
      Indent,
      ParagraphSpacing,
      GlobalAlignment,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image', 'table'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-400 underline underline-offset-4 cursor-pointer',
        },
      }),
      Youtube.configure({
        inline: false,
        width: 640,
        height: 480,
      }),
      Subscript,
      Superscript,
      Typography,
      CharacterCount,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Heading ' + node.attrs.level;
          }
          return "Press '/' for commands...";
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({ multicolor: true }),
      CodeBlockLowlight.configure({ lowlight }),
      ResizableImage.configure({ inline: false, allowBase64: true }),
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
        class: 'focus:outline-none min-h-[500px] pb-32',
        spellcheck: 'true',
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
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
}

Editor.propTypes = {
  ydoc: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
  onEditorReady: PropTypes.func,
};
