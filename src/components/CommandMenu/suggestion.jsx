import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import CommandList from './CommandList';
import { 
  Heading1, Heading2, Code, Table as TableIcon, CheckSquare, 
  Lightbulb, Zap, Type, AlignLeft, Layout
} from 'lucide-react';
import { TEMPLATES } from '../../lib/templates';

export default {
  items: ({ query }) => {
    // 1. Static Core Formatting Commands
    const coreCommands = [
      {
        title: 'Ask AI Assistant',
        description: 'Get help writing content.',
        icon: <Zap size={16} className="text-indigo-400" />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).run();
          window.dispatchEvent(new CustomEvent('collabdocs:open-ai'));
        },
      },
      {
        title: 'Heading 1',
        description: 'Large section heading.',
        icon: <Heading1 size={16} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
        },
      },
      {
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: <Heading2 size={16} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
        },
      },
      {
        title: 'Text List',
        description: 'A standard bullet list.',
        icon: <AlignLeft size={16} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: 'Code Block',
        description: 'Syntax-highlighted code.',
        icon: <Code size={16} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
      },
      {
        title: 'Table',
        description: 'Insert a 3x3 data table.',
        icon: <TableIcon size={16} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        },
      },
      {
        title: 'Task List',
        description: 'Track your tasks with checkboxes.',
        icon: <CheckSquare size={16} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      {
        title: 'Callout Note',
        description: 'Draw attention with a styled box.',
        icon: <Lightbulb size={16} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setBlockquote().run();
        },
      },
    ];
    
    // 1.5 Template Commands
    const templateCommands = TEMPLATES.filter(t => t.id !== 'blank').map(t => ({
      title: `Template: ${t.title}`,
      description: t.desc,
      icon: <Layout size={16} className="text-indigo-400" />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).insertContent(t.html).run();
      },
    }));

    // 2. Load custom snippets from localStorage
    const loadCustomSnippets = () => {
      try {
        const stored = localStorage.getItem('collabdocs_snippets');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.map(snippet => ({
            title: snippet.title,
            description: snippet.description || 'Custom User Snippet',
            icon: <Type size={16} />,
            command: ({ editor, range }) => {
              editor.chain().focus().deleteRange(range).insertContent(snippet.html).run();
            }
          }));
        }
      } catch (e) {
        console.error("Failed to parse custom snippets", e);
      }
      return [];
    };

    const customCommands = loadCustomSnippets();
    
    // Combine and fuzzy search
    const allCommands = [...coreCommands, ...templateCommands, ...customCommands];

    return allCommands
      .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: props => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) return;

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);
        if (!props.clientRect) return;

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
