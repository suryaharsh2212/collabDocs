import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  FileText, Code, Share2, Download, MessageSquare, LogOut, Play,
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, List, ListOrdered, CheckSquare, 
  Table as TableIcon, Image as ImageIcon, Link as LinkIcon, 
   Quote, Code2, 
  Undo2, Redo2, Maximize2, Minimize2,
  Highlighter, Palette, ChevronDown, Plus, MoreHorizontal,
  Baseline, ArrowUpToLine, ArrowDownToLine,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Trash2, Sparkles, IndentDecrease, IndentIncrease, BetweenVerticalStart, Search
} from 'lucide-react';
import { ToolbarButton, ToolbarDropdown, ToolbarColorPicker } from './EditorUiComponents';
import UserPresence from './UserPresence';
import PremiumInput from './PremiumInput';

export default function Toolbar({
  isCodePage = false,
  codeLanguage,
  onLanguageChange,
  onRun,
  tiptapEditor,
  onExport,
  onToggleChat,
  onToggleSnippets,
  user,
  onSignIn,
  onSignOut,
  roomId,
  isFullscreen = false,
  onToggleFullscreen,
  onToggleAi,
  title,
  onTitleChange,
  onTitleBlur,
  onToggleFind,
  onToggleInvite,
  isConnected,
  connectedUsers,
  isRunning = false
}) {

  const [copied, setCopied] = useState(false);
  const [activeInputType, setActiveInputType] = useState(null); // 'table', 'image', 'link', or null
  const [showParticipants, setShowParticipants] = useState(false);


  /** Copy the current document URL to clipboard */
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  /** Dropdown Options */
  const fontOptions = [
    { label: 'Inter', value: '"Inter", sans-serif' },
    { label: 'Serif', value: 'serif', style: { fontFamily: 'serif' } },
    { label: 'Monospace', value: 'monospace', style: { fontFamily: 'monospace' } },
    { label: 'Roboto', value: '"Roboto", sans-serif', style: { fontFamily: '"Roboto", sans-serif' } },
    { label: 'Outfit', value: '"Outfit", sans-serif', style: { fontFamily: '"Outfit", sans-serif' } },
  ];

  const sizeOptions = [
    { label: '8pt', value: '8pt' },
    { label: '10pt', value: '10pt' },
    { label: '12pt', value: '12pt' },
    { label: '14pt', value: '14pt' },
    { label: '16pt', value: '16pt' },
    { label: '18pt', value: '18pt' },
    { label: '20pt', value: '20pt' },
    { label: '24pt', value: '24pt' },
    { label: '30pt', value: '30pt' },
    { label: '36pt', value: '36pt' },
  ];

  const headingOptions = [
    { label: 'Normal Text', value: '0' },
    { label: 'Heading 1', value: '1', style: { fontSize: '1.5rem', fontWeight: '800' } },
    { label: 'Heading 2', value: '2', style: { fontSize: '1.25rem', fontWeight: '700' } },
    { label: 'Heading 3', value: '3', style: { fontSize: '1.1rem', fontWeight: '600' } },
    { label: 'Heading 4', value: '4', style: { fontSize: '1rem', fontWeight: '600' } },
  ];

  const colorPalette = [
    '#ffffff', '#f8fafc', '#94a3b8', '#64748b', '#0f172a',
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#0ea5e9',
    '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'
  ];

  const spacingOptions = [
    { label: 'Line: Single', value: '1', type: 'line' },
    { label: 'Line: 1.15', value: '1.15', type: 'line' },
    { label: 'Line: 1.5', value: '1.5', type: 'line' },
    { label: 'Line: Double', value: '2', type: 'line' },
    { label: 'Para: 0px', value: '0px', type: 'para' },
    { label: 'Para: 8px', value: '8px', type: 'para' },
    { label: 'Para: 16px', value: '16px', type: 'para' },
    { label: 'Para: 24px', value: '24px', type: 'para' },
  ];

  const languageOptions = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
  ];

  /** Determine current values for dropdowns */
  const currentFont = tiptapEditor?.getAttributes('textStyle').fontFamily || '"Inter", sans-serif';
  const currentSize = tiptapEditor?.getAttributes('textStyle').fontSize || '12pt';
  const currentHeading = tiptapEditor?.isActive('heading') 
    ? tiptapEditor.getAttributes('heading').level.toString() 
    : '0';
  const currentColor = tiptapEditor?.getAttributes('textStyle').color || '#f8fafc';
  const currentHighlight = tiptapEditor?.getAttributes('highlight').color || null;

  return (
    <div className="sticky top-0 z-40 glass border-b border-[var(--glass-border)] transition-all">
      <div className="flex flex-col">
        {/* Top Section: App Identity & Main Actions */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--glass-border)] gap-4">
          <div className="flex items-center gap-3">
            <a href="/home" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-md group-hover:shadow-indigo-500/30 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <span className="font-black text-sm tracking-tight hidden md:block">CollabDocs</span>
            </a>
            
            <div className="w-px h-6 bg-[var(--surface-4)] mx-1" />

            <div className="flex items-center bg-[var(--surface-2)] rounded-lg p-0.5 border border-[var(--surface-4)]">
              {isCodePage ? (
                <span className="flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-indigo-300 shadow-sm cursor-default">
                  <Code size={12} strokeWidth={3} />
                  Code
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-indigo-300 shadow-sm cursor-default">
                  <FileText size={12} strokeWidth={3} />
                  Docs
                </span>
              )}
            </div>
            <div className="flex items-center flex-1 max-w-sm">
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                onBlur={onTitleBlur}
                className="bg-transparent border-none outline-none text-xs font-bold text-[var(--text-secondary)] focus:text-[var(--text-primary)] w-full placeholder-[var(--text-muted)] transition-colors px-1"
                placeholder="Write your File Name" 
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleInvite}
              className={`btn h-8 px-4 text-[10px] font-black uppercase tracking-widest btn-secondary transition-all`}
            >
              Invite
            </button>
            <button onClick={onExport} className="btn h-8 px-4 text-[10px] font-black uppercase tracking-widest btn-secondary">
              Export
            </button>
            {!isCodePage && (
              <button 
                onClick={onToggleAi}
                className="btn btn-primary h-8 px-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
              >
                <Sparkles size={12} />
                AI Help
              </button>
            )}
            <div className="w-px h-6 bg-[var(--surface-4)] mx-1" />
            {user ? (
              <button onClick={onSignOut} className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center ring-2 ring-[var(--surface-4)] hover:ring-indigo-500 transition-all">
                <span className="text-[10px] font-black text-white">{user.displayName?.[0]?.toUpperCase() || 'U'}</span>
              </button>
            ) : (
              <button onClick={onSignIn} className="btn h-8 px-4 text-[10px] font-black uppercase tracking-widest btn-primary">Sign In</button>
            )}
          </div>
        </div>

        {/* Bottom Section: Editor Tools */}
        <div className="flex items-center px-4 py-1.5 gap-1 overflow-visible no-scrollbar bg-[var(--surface-0)]/50">
          {!isCodePage && tiptapEditor && (
            <>
              {/* History Group */}
              <div className="flex items-center">
                <ToolbarButton 
                  icon={<Undo2 size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().undo().run()} 
                  tooltip="Undo (Ctrl+Z)"
                />
                <ToolbarButton 
                  icon={<Redo2 size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().redo().run()} 
                  tooltip="Redo (Ctrl+Y)"
                />
                <ToolbarButton 
                  icon={<Search size={16} />} 
                  onClick={onToggleFind} 
                  tooltip="Find & Replace"
                />
              </div>

              <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />

              {/* Text Style Group */}
              <div className="flex items-center gap-1">
                <ToolbarDropdown 
                  options={headingOptions} 
                  value={currentHeading}
                  onChange={(val) => {
                    if (val === '0') tiptapEditor.chain().focus().setParagraph().run();
                    else tiptapEditor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
                  }}
                  tooltip="Style"
                />
                <ToolbarDropdown 
                  options={fontOptions} 
                  value={currentFont}
                  onChange={(val) => tiptapEditor.chain().focus().setFontFamily(val).run()}
                  tooltip="Font"
                />
                <ToolbarDropdown 
                  options={sizeOptions} 
                  value={currentSize}
                  onChange={(val) => tiptapEditor.chain().focus().setFontSize(val).run()}
                  tooltip="Size"
                />
              </div>

              <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />

              {/* Basic Formatting Group */}
              <div className="flex items-center">
                <ToolbarButton 
                  icon={<Bold size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleBold().run()} 
                  active={tiptapEditor.isActive('bold')}
                  tooltip="Bold"
                />
                <ToolbarButton 
                  icon={<Italic size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleItalic().run()} 
                  active={tiptapEditor.isActive('italic')}
                  tooltip="Italic"
                />
                <ToolbarButton 
                  icon={<UnderlineIcon size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleUnderline().run()} 
                  active={tiptapEditor.isActive('underline')}
                  tooltip="Underline"
                />
                <ToolbarButton 
                  icon={<Strikethrough size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleStrike().run()} 
                  active={tiptapEditor.isActive('strike')}
                  tooltip="Strike"
                />
                <ToolbarColorPicker 
                  icon={<Baseline size={16} />} 
                  value={currentColor}
                  onChange={(val) => val ? tiptapEditor.chain().focus().setColor(val).run() : tiptapEditor.chain().focus().unsetColor().run()}
                  colors={colorPalette}
                  tooltip="Text Color"
                />
                <ToolbarColorPicker 
                  icon={<Highlighter size={16} />} 
                  value={currentHighlight}
                  onChange={(val) => val ? tiptapEditor.chain().focus().toggleHighlight({ color: val }).run() : tiptapEditor.chain().focus().unsetHighlight().run()}
                  colors={colorPalette}
                  tooltip="Highlight"
                />
              </div>

              <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />

              {/* Paragraph Group */}
              <div className="flex items-center">
                <ToolbarButton 
                  icon={<AlignLeft size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().setTextAlign('left').run()} 
                  active={tiptapEditor.isActive({ textAlign: 'left' })}
                  tooltip="Align Left"
                />
                <ToolbarButton 
                  icon={<AlignCenter size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().setTextAlign('center').run()} 
                  active={tiptapEditor.isActive({ textAlign: 'center' })}
                  tooltip="Align Center"
                />
                <ToolbarButton 
                  icon={<AlignRight size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().setTextAlign('right').run()} 
                  active={tiptapEditor.isActive({ textAlign: 'right' })}
                  tooltip="Align Right"
                />
                <ToolbarButton 
                  icon={<AlignJustify size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().setTextAlign('justify').run()} 
                  active={tiptapEditor.isActive({ textAlign: 'justify' })}
                  tooltip="Justify"
                />
                <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />
                <ToolbarButton 
                  icon={<IndentDecrease size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().outdent().run()} 
                  tooltip="Decrease Indent"
                />
                <ToolbarButton 
                  icon={<IndentIncrease size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().indent().run()} 
                  tooltip="Increase Indent"
                />
                <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />
                <ToolbarDropdown 
                  icon={<BetweenVerticalStart size={16} />}
                  options={spacingOptions}
                  onChange={(val, opt) => {
                    if (opt.type === 'line') tiptapEditor.chain().focus().setLineHeight(val).run();
                    else tiptapEditor.chain().focus().setParagraphSpacing(val).run();
                  }}
                  tooltip="Line & Paragraph Spacing"
                />
                <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />
                <ToolbarButton 
                  icon={<SubscriptIcon size={14} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleSubscript().run()} 
                  active={tiptapEditor.isActive('subscript')}
                  tooltip="Subscript"
                />
                <ToolbarButton 
                  icon={<SuperscriptIcon size={14} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleSuperscript().run()} 
                  active={tiptapEditor.isActive('superscript')}
                  tooltip="Superscript"
                />
              </div>

              <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />

              {/* Lists & Indent Group */}
              <div className="flex items-center">
                <ToolbarButton 
                  icon={<List size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleBulletList().run()} 
                  active={tiptapEditor.isActive('bulletList')}
                  tooltip="Bullet List"
                />
                <ToolbarButton 
                  icon={<ListOrdered size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleOrderedList().run()} 
                  active={tiptapEditor.isActive('orderedList')}
                  tooltip="Ordered List"
                />
                <ToolbarButton 
                  icon={<CheckSquare size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleTaskList().run()} 
                  active={tiptapEditor.isActive('taskList')}
                  tooltip="Task List"
                />
                <ToolbarButton 
                  icon={<List size={16} className="text-indigo-400" />} 
                  onClick={() => {
                    const { doc } = tiptapEditor.state;
                    const headings = [];
                    doc.descendants((node, pos) => {
                      if (node.type.name === 'heading') {
                        headings.push({ level: node.attrs.level, text: node.textContent, pos });
                      }
                    });

                    if (headings.length === 0) {
                      alert('No headings found to generate TOC');
                      return;
                    }

                    let tocHtml = '<h3>Table of Contents</h3><ul>';
                    headings.forEach(h => {
                      tocHtml += `<li style="margin-left: ${(h.level - 1) * 20}px"><a href="#${h.pos}">${h.text}</a></li>`;
                    });
                    tocHtml += '</ul><hr/>';
                    
                    tiptapEditor.chain().focus().insertContentAt(0, tocHtml).run();
                  }}
                  tooltip="Insert Table of Contents"
                />
              </div>

              <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />

              {/* Insert Group */}
              <div className="flex items-center">
                <ToolbarButton 
                  icon={<TableIcon size={16} />} 
                  onClick={() => setActiveInputType('table')} 
                  active={tiptapEditor.isActive('table')}
                  tooltip="Insert Table"
                />
                <ToolbarButton 
                  icon={<ImageIcon size={16} />} 
                  onClick={() => setActiveInputType('image')} 
                  tooltip="Insert Image"
                />
                <ToolbarButton 
                  icon={<LinkIcon size={16} />} 
                  onClick={() => setActiveInputType('link')} 
                  active={tiptapEditor.isActive('link')}
                  tooltip="Link"
                />
                {/* <ToolbarButton 
                  icon={<Youtube size={16} />} 
                  onClick={() => {
                    const url = window.prompt('Enter YouTube URL:');
                    if (url) tiptapEditor.commands.setYoutubeVideo({ src: url });
                  }} 
                  tooltip="Embed Video"
                /> */}
                <ToolbarButton 
                  icon={<Code2 size={16} />} 
                  onClick={() => tiptapEditor.chain().focus().toggleCodeBlock().run()} 
                  active={tiptapEditor.isActive('codeBlock')}
                  tooltip="Code Block"
                />
                <div className="w-px h-4 bg-[var(--surface-3)] mx-1" />
                <ToolbarButton 
                  icon={<Trash2 size={16} className="text-red-400" />} 
                  onClick={() => {
                    // Smart delete: Try to delete selection, then try to delete the focused node
                    tiptapEditor.chain().focus().deleteSelection().run();
                    // If selection was just a cursor, we might want to delete a node if it's selected
                    if (tiptapEditor.isActive('table')) tiptapEditor.chain().focus().deleteTable().run();
                    if (tiptapEditor.isActive('image')) tiptapEditor.chain().focus().deleteSelection().run(); // Images are usually handled by deleteSelection
                  }} 
                  tooltip="Delete Selection/Element"
                />
              </div>

              <div className="flex-1" />

              {/* App UI Actions */}
              <div className="flex items-center gap-1">
                <ToolbarButton 
                  icon={<MessageSquare size={16} />} 
                  onClick={onToggleChat} 
                  tooltip="Chat"
                />
                <ToolbarButton 
                  icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />} 
                  onClick={onToggleFullscreen} 
                  tooltip={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                />
              </div>
            </>
          )}

          {isCodePage && (
            <div className="flex items-center justify-between w-full py-1">
              <div className="flex items-center gap-3">
                <ToolbarDropdown
                  options={languageOptions}
                  value={codeLanguage}
                  onChange={(val) => onLanguageChange(val)}
                  label="Language"
                  className="bg-[var(--surface-3)] border-none"
                  tooltip="Change Programming Language"
                />
                <button
                  onClick={onRun}
                  disabled={isRunning}
                  className={`btn h-7 px-3 text-[10px] font-black uppercase tracking-widest border-none shadow-md transition-all ${
                    isRunning ? 'bg-emerald-600/50 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {isRunning ? (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Play size={12} fill="currentColor" />
                  )}
                  {isRunning ? 'Running...' : 'Run'}
                </button>

                <button
                  onClick={onToggleAi}
                  className="btn btn-primary h-7 px-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles size={12} />
                  AI Help
                </button>
                
                <div className="w-px h-4 bg-[var(--surface-4)] mx-2" />
                
                {/* Compact Status Info */}
                <div className="flex items-center gap-2 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'} ${isConnected ? 'animate-pulse' : ''}`} />
                    <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider">
                      {isConnected ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                  <span className="text-[var(--text-muted)] opacity-30">|</span>
                  <span className="text-[var(--text-muted)] font-mono opacity-80">{roomId}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <UserPresence connectedUsers={connectedUsers} />
                    <button 
                      onClick={() => setShowParticipants(!showParticipants)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${showParticipants ? 'bg-indigo-500 text-white' : 'bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-4)]'}`}
                      title="View Participants"
                    >
                      <ChevronDown size={14} className={`transition-transform duration-200 ${showParticipants ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {showParticipants && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-xl shadow-2xl p-3 z-50 animate-zoom-in">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Active Now</span>
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full font-bold">
                          {connectedUsers.length}
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {connectedUsers.map((u) => (
                          <div key={u.clientId} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors group">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black border border-white/10"
                              style={{ backgroundColor: u.color + '22', color: u.color }}
                            >
                              {u.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-white truncate flex items-center gap-1.5">
                                {u.name}
                                {u.isCurrentUser && <span className="text-[9px] opacity-40 font-medium">(You)</span>}
                              </p>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-px h-4 bg-[var(--surface-4)]" />

                <ToolbarButton 
                  icon={<MessageSquare size={16} />} 
                  onClick={onToggleChat} 
                  tooltip="Chat"
                />
                <ToolbarButton 
                  icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />} 
                  onClick={onToggleFullscreen} 
                  tooltip={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {activeInputType && (
        <PremiumInput 
          type={activeInputType}
          onClose={() => setActiveInputType(null)}
          initialValue={activeInputType === 'link' ? tiptapEditor.getAttributes('link').href : ''}
          onSubmit={(data) => {
            if (activeInputType === 'table') {
              tiptapEditor.chain().focus().insertTable({ rows: data.rows, cols: data.cols, withHeaderRow: true }).run();
            } else if (activeInputType === 'image') {
              tiptapEditor.chain().focus().setImage({ src: data }).run();
            } else if (activeInputType === 'link') {
              if (data === '') {
                tiptapEditor.chain().focus().extendMarkRange('link').unsetLink().run();
              } else {
                tiptapEditor.chain().focus().extendMarkRange('link').setLink({ href: data }).run();
              }
            }
            setActiveInputType(null);
          }}
        />
      )}
    </div>
  );
}

Toolbar.propTypes = {
  isCodePage: PropTypes.bool,
  codeLanguage: PropTypes.string,
  onLanguageChange: PropTypes.func,
  onRun: PropTypes.func,
  tiptapEditor: PropTypes.object,
  onExport: PropTypes.func.isRequired,
  onToggleChat: PropTypes.func.isRequired,
  onToggleSnippets: PropTypes.func.isRequired,
  user: PropTypes.object,
  onSignIn: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  isFullscreen: PropTypes.bool,
  onToggleFullscreen: PropTypes.func,
  onToggleAi: PropTypes.func,
  title: PropTypes.string,
  onTitleChange: PropTypes.func,
  onTitleBlur: PropTypes.func,
  onToggleFind: PropTypes.func
};
