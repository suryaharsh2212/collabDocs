import React from 'react';
import { BubbleMenu } from '@tiptap/react';
import { 
  Trash2, Plus, ArrowDown, ArrowRight, 
  AlignLeft, AlignCenter, AlignRight,
  Maximize, Minimize, Minus
} from 'lucide-react';

export default function ContextMenus({ editor }) {
  if (!editor) return null;

  return (
    <>
      {/* Table Context Menu */}
      <BubbleMenu 
        editor={editor} 
        shouldShow={({ editor }) => editor.isActive('table')}
        tippyOptions={{ duration: 100, placement: 'top-start' }}
        className="glass border border-[var(--glass-border)] rounded-xl p-1 shadow-2xl flex items-center gap-1 z-50 overflow-hidden"
      >
        <div className="flex items-center p-1 gap-1">
          <MenuButton 
            icon={<ArrowDown size={14} />} 
            onClick={() => editor.chain().focus().addRowAfter().run()}
            tooltip="Add Row Below"
          />
          <MenuButton 
            icon={<ArrowRight size={14} />} 
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            tooltip="Add Col Right"
          />
          <div className="w-px h-4 bg-[var(--surface-4)] mx-0.5" />
          <MenuButton 
            icon={<Trash2 size={14} className="text-red-400" />} 
            onClick={() => editor.chain().focus().deleteTable().run()}
            tooltip="Delete Table"
          />
        </div>
      </BubbleMenu>

      {/* Image Context Menu */}
      <BubbleMenu 
        editor={editor} 
        shouldShow={({ editor }) => editor.isActive('image')}
        tippyOptions={{ duration: 100, placement: 'top' }}
        className="glass border border-[var(--glass-border)] rounded-xl p-1 shadow-2xl flex items-center gap-1 z-50 overflow-hidden"
      >
        <div className="flex items-center p-1 gap-1">
          <MenuButton 
            icon={<AlignLeft size={14} />} 
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            tooltip="Align Left"
          />
          <MenuButton 
            icon={<AlignCenter size={14} />} 
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            tooltip="Align Center"
          />
          <MenuButton 
            icon={<AlignRight size={14} />} 
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            tooltip="Align Right"
          />
          <div className="w-px h-4 bg-[var(--surface-4)] mx-0.5" />
          <MenuButton 
            icon={<Trash2 size={14} className="text-red-400" />} 
            onClick={() => editor.chain().focus().deleteSelection().run()}
            tooltip="Delete Image"
          />
        </div>
      </BubbleMenu>
    </>
  );
}

function MenuButton({ icon, onClick, active = false, tooltip }) {
  return (
    <button
      onClick={onClick}
      className={`
        p-1.5 rounded-lg transition-all flex items-center justify-center
        ${active 
          ? 'bg-indigo-500/20 text-indigo-300' 
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-white'
        }
      `}
      title={tooltip}
    >
      {icon}
    </button>
  );
}
