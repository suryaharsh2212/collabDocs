/**
 * Toolbar.jsx — Editor Toolbar
 *
 * Features:
 * - Mode toggle: "Rich Text" vs "Code" pill buttons
 * - Rich text formatting: Bold, Italic, Underline, H1, H2, Bullet List, Code Block
 *   (all wired to TipTap editor commands via the editor instance prop)
 * - Share button: copies current URL to clipboard with "Copied!" toast
 * - Export button: opens the ExportPanel
 * - Auth button: Sign in / Sign out (Firebase Google auth)
 */
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

export default function Toolbar({
  editorMode,
  tiptapEditor,
  onExport,
  onToggleChat,
  onToggleSnippets,
  user,
  onSignIn,
  onSignOut,
  roomId,
}) {
  const [copied, setCopied] = useState(false);

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

  /** Check if a TipTap formatting option is currently active */
  const isActive = (name, attrs) => {
    if (!tiptapEditor) return false;
    return tiptapEditor.isActive(name, attrs);
  };

  /** Format button helper */
  const FormatButton = ({ icon, command, active, tooltip, disabled }) => (
    <button
      onClick={command}
      disabled={disabled}
      className={`
        btn btn-icon text-sm transition-all
        ${active
          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
      `}
      title={tooltip}
    >
      {icon}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 glass border-b border-[var(--glass-border)]">
      <div className="flex items-center justify-between px-4 py-2 gap-3">
        {/* Left section: Logo + Mode Toggle */}
        <div className="flex items-center gap-4">
          {/* Back to home */}
          <a
            href="/"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-brand flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
          </a>

          {/* Separator */}
          <div className="w-px h-6 bg-[var(--surface-4)]" />

          {/* Mode Toggle */}
          <div className="flex items-center bg-[var(--surface-2)] rounded-lg p-0.5 border border-[var(--surface-4)]">
            <button
              onClick={() => onModeChange('richtext')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                editorMode === 'richtext'
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              id="mode-richtext-btn"
            >
              ✍️ Rich Text
            </button>
            <button
              onClick={() => onModeChange('code')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                editorMode === 'code'
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              id="mode-code-btn"
            >
              💻 Code
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-[var(--surface-4)]" />

          {/* Rich Text Formatting Buttons — only visible in richtext mode */}
          {editorMode === 'richtext' && tiptapEditor && (
            <div className="flex items-center gap-1 animate-fade-in">
              <FormatButton
                icon={<span className="font-bold">B</span>}
                command={() => tiptapEditor.chain().focus().toggleBold().run()}
                active={isActive('bold')}
                tooltip="Bold (Ctrl+B)"
              />
              <FormatButton
                icon={<span className="italic">I</span>}
                command={() => tiptapEditor.chain().focus().toggleItalic().run()}
                active={isActive('italic')}
                tooltip="Italic (Ctrl+I)"
              />
              <FormatButton
                icon={<span className="underline">U</span>}
                command={() => tiptapEditor.chain().focus().toggleUnderline().run()}
                active={isActive('underline')}
                tooltip="Underline (Ctrl+U)"
              />

              <div className="w-px h-5 bg-[var(--surface-4)] mx-1" />

              <FormatButton
                icon={<span className="text-xs font-bold">H1</span>}
                command={() => tiptapEditor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={isActive('heading', { level: 1 })}
                tooltip="Heading 1"
              />
              <FormatButton
                icon={<span className="text-xs font-bold">H2</span>}
                command={() => tiptapEditor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={isActive('heading', { level: 2 })}
                tooltip="Heading 2"
              />

              <div className="w-px h-5 bg-[var(--surface-4)] mx-1" />

              <FormatButton
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                }
                command={() => tiptapEditor.chain().focus().toggleBulletList().run()}
                active={isActive('bulletList')}
                tooltip="Bullet List"
              />
              <FormatButton
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 20 6" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                }
                command={() => tiptapEditor.chain().focus().toggleTaskList().run()}
                active={isActive('taskList')}
                tooltip="Task List"
              />

              <div className="w-px h-5 bg-[var(--surface-4)] mx-1" />

              <FormatButton
                icon={<span className="font-bold bg-yellow-500/80 text-yellow-100 rounded px-1 text-[10px]">Hl</span>}
                command={() => tiptapEditor.chain().focus().toggleHighlight().run()}
                active={isActive('highlight')}
                tooltip="Highlight"
              />

              <div className="w-px h-5 bg-[var(--surface-4)] mx-1" />

              <FormatButton
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                }
                command={() => tiptapEditor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                active={isActive('table')}
                tooltip="Insert Table"
              />

              <div className="w-px h-5 bg-[var(--surface-4)] mx-1" />

              <FormatButton
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                }
                command={() => {
                  const url = window.prompt('Enter image URL:');
                  if (url) tiptapEditor.chain().focus().setImage({ src: url }).run();
                }}
                active={isActive('image')}
                tooltip="Insert Image"
              />

              <FormatButton
                icon={
                  <span className="text-xs">💡</span>
                }
                command={() => tiptapEditor.chain().focus().toggleBlockquote().run()}
                active={isActive('blockquote')}
                tooltip="Callout Box"
              />

              <FormatButton
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 18 22 12" />
                    <rect x="2" y="6" width="10" height="10" rx="1" />
                  </svg>
                }
                command={() => tiptapEditor.chain().focus().toggleCodeBlock().run()}
                active={isActive('codeBlock')}
                tooltip="Code Block"
              />

              <div className="w-px h-5 bg-[var(--surface-4)] mx-1" />

              <FormatButton
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                }
                command={onToggleSnippets}
                tooltip="Snippet Library"
              />

              <FormatButton
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
                    <path d="M15 15l1-1" />
                    <path d="M9 9l-1 1" />
                  </svg>
                }
                command={() => {
                  if (tiptapEditor) {
                    const text = tiptapEditor.getText();
                    // Basic pattern matching for auto-formatting
                    if (text.toLowerCase().includes('api ') && text.toLowerCase().includes(' post')) {
                      if (window.confirm("Found potential API shorthand. Auto-format document?")) {
                          // We will implement the full engine logic in a separate utility call
                          // but for now, trigger a custom event or logic
                          tiptapEditor.commands.focus();
                          const event = new CustomEvent('collabdocs:magic-format');
                          window.dispatchEvent(event);
                      }
                    } else {
                      alert("No obvious formatting patterns found yet. Try typing something like 'api login post username password'");
                    }
                  }
                }}
                tooltip="Magic Format (Auto-Structure)"
              />
            </div>
          )}
        </div>

        {/* Right section: Share, Export, Auth */}
        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className={`btn text-xs ${copied ? 'btn-primary' : 'btn-secondary'} transition-all`}
            id="share-btn"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                Share
              </>
            )}
          </button>

          <button
            onClick={onExport}
            className="btn btn-secondary text-xs"
            id="export-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>

          {/* Chat Button */}
          <button
            onClick={onToggleChat}
            className="btn btn-secondary text-xs"
            id="chat-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Chat
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-[var(--surface-4)]" />

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-6 h-6 rounded-full ring-1 ring-[var(--surface-4)]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-[10px] font-bold text-white">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-xs font-medium text-[var(--text-secondary)] hidden sm:inline">
                  {user.displayName}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="btn btn-ghost text-xs"
                id="sign-out-btn"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="btn btn-secondary text-xs"
              id="sign-in-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Toolbar.propTypes = {
  /** Current editor mode: 'richtext' or 'code' */
  editorMode: PropTypes.oneOf(['richtext', 'code']).isRequired,
  /** Callback to change editor mode */
  onModeChange: PropTypes.func.isRequired,
  tiptapEditor: PropTypes.object,
  /** Callback to open export panel */
  onExport: PropTypes.func.isRequired,
  /** Callback to toggle chat sidebar */
  onToggleChat: PropTypes.func.isRequired,
  /** Current Firebase user object (null if not logged in) */
  user: PropTypes.object,
  /** Callback for sign-in action */
  onSignIn: PropTypes.func.isRequired,
  /** Callback for sign-out action */
  onSignOut: PropTypes.func.isRequired,
  /** Current room ID */
  roomId: PropTypes.string.isRequired,
};
