/**
 * DocPage.jsx — Document Editor Page
 *
 * Layout:
 * - Top: Toolbar (mode toggle, formatting, share, export, auth)
 * - Center: Editor (TipTap rich text or Monaco code editor)
 * - Top-right overlay: UserPresence (connected user avatars)
 *
 * Connects to the Yjs room and manages editor mode state.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useYjs } from '../hooks/useYjs';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { getTemplateById } from '../lib/templates';
import Toolbar from '../components/Toolbar';
import Editor from '../components/Editor';
import UserPresence from '../components/UserPresence';
import ExportPanel from '../components/ExportPanel';
import ChatSidebar from '../components/ChatSidebar';
import SnippetSidebar from '../components/SnippetSidebar';

export default function DocPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle, signOutUser } = useAuth();
  const { room, loading: roomLoading, updateTitle, updateContent } = useRoom(roomId);

  // Editor mode: 'richtext' or 'code'
  const [editorMode, setEditorMode] = useState('richtext');

  // Export panel visibility
  const [showExport, setShowExport] = useState(false);

  // Chat panel visibility
  const [showChat, setShowChat] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);

  // TipTap editor ref — set by Editor component for Toolbar formatting commands
  const [tiptapEditor, setTiptapEditor] = useState(null);
  
  // Notification state
  const [lastChatMessage, setLastChatMessage] = useState(null);
  const [showChatNotif, setShowChatNotif] = useState(false);

  // Editable title state
  const [localTitle, setLocalTitle] = useState('');

  // Sync local title when room data updates
  useEffect(() => {
    if (room?.title) {
      setLocalTitle(room.title);
    }
  }, [room?.title]);

  // Initialize Yjs with user info
  const userInfo = {
    name: user?.displayName || 'Guest',
    color: undefined, // auto-assigned based on clientID
  };
  const { ydoc, provider, connectedUsers, isConnected, updateUser } = useYjs(roomId, userInfo);

  // Update Yjs awareness when user signs in/out
  useEffect(() => {
    if (user) {
      updateUser({ name: user.displayName || 'User' });
    } else {
      updateUser({ name: 'Guest' });
    }
  }, [user, updateUser]);

  const handleTitleBlur = () => {
    const finalTitle = localTitle.trim() || '';
    if (finalTitle !== room?.title) {
      updateTitle(finalTitle);
    }
    setLocalTitle(finalTitle);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  // Get the HTML content from TipTap for exports
  const getEditorHTML = () => {
    if (tiptapEditor) {
      return tiptapEditor.getHTML();
    }
    return '<p>No content</p>';
  };

  // Word count calculation
  const getWordCount = () => {
    if (tiptapEditor) {
      const text = tiptapEditor.getText();
      return text.trim() ? text.trim().split(/\s+/).length : 0;
    }
    return 0;
  };

  // Redirect unauthorized users to home with redirect intent
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/?redirect=${roomId}`, { replace: true });
    }
  }, [authLoading, user, navigate, roomId]);

  // Handle Smart Templates Injection
  useEffect(() => {
    const handleMagicFormat = () => {
      if (!tiptapEditor) return;

      const lines = tiptapEditor.getText().split('\n');
      let newHtml = '';
      let processed = false;

      lines.forEach(line => {
        const trimmed = line.trim();
        // Pattern: api [name] [method] [params...]
        const apiMatch = trimmed.match(/^api\s+(\S+)\s+(get|post|put|delete|patch)\s*(.*)$/i);
        
        if (apiMatch) {
          processed = true;
          const [, name, method, paramsStr] = apiMatch;
          const params = paramsStr.split(/\s+/).filter(p => p.length > 0);
          
          newHtml += `<h2>API: ${name.toUpperCase()}</h2>`;
          newHtml += `<blockquote><strong>Method:</strong> <span style="background: ${method.toLowerCase() === 'post' ? '#10b981' : '#3b82f6'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${method.toUpperCase()}</span></blockquote>`;
          newHtml += `<p>Auto-generated reference for <code>${name}</code>.</p>`;
          
          if (params.length > 0) {
            newHtml += `<table><thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead><tbody>`;
            params.forEach(p => {
              newHtml += `<tr><td><code>${p}</code></td><td>String</td><td>...</td></tr>`;
            });
            newHtml += `</tbody></table>`;
          }
          newHtml += `<p></p>`;
        } else {
          newHtml += `<p>${line}</p>`;
        }
      });

      if (processed) {
        tiptapEditor.commands.setContent(newHtml);
      }
    };

    window.addEventListener('collabdocs:magic-format', handleMagicFormat);
    return () => window.removeEventListener('collabdocs:magic-format', handleMagicFormat);
  }, [tiptapEditor]);

  // Handle Smart Templates Injection
  useEffect(() => {
    if (tiptapEditor) {
      const params = new URLSearchParams(window.location.search);
      const templateId = params.get('template');
      
      // If no template requested, do nothing
      if (!templateId) return;

      // Check if document is basically empty (allowing for trailing spaces/newlines)
      const isBlank = tiptapEditor.isEmpty || tiptapEditor.getText().trim().length === 0;

      if (isBlank) {
        const template = getTemplateById(templateId);
        if (template && template.html) {
          tiptapEditor.commands.setContent(template.html);
        }
        
        // Wipe the template from the URL so it doesn't re-inject on accidental unmounts/refreshes
        window.history.replaceState({}, '', `/doc/${roomId}`);
      }
    }
  }, [tiptapEditor, roomId]);

  // Handle Periodic Content Persistence (Auto-save to Firestore)
  useEffect(() => {
    if (!tiptapEditor) return;

    let timeoutId;

    const handleUpdate = () => {
      // Debounce the save operation to 3 seconds after last type
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const html = tiptapEditor.getHTML();
        const textSnippet = tiptapEditor.getText().substring(0, 150);
        updateContent(html, textSnippet);
        console.log('Document auto-saved to Firestore');
      }, 3000);
    };

    tiptapEditor.on('update', handleUpdate);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      tiptapEditor.off('update', handleUpdate);
    };
  }, [tiptapEditor, updateContent]);

  // Handle Chat Notifications
  useEffect(() => {
    if (!ydoc) return;
    const ychat = ydoc.getArray('chatMessages');
    
    const observer = (event) => {
      // Only trigger if we aren't already looking at the chat
      if (showChat) return;

      const added = event.changes.added;
      if (added.size > 0) {
        const lastMsg = ychat.get(ychat.length - 1);
        
        // Don't notify if it's our own message
        if (lastMsg && lastMsg.uid !== user?.uid) {
          setLastChatMessage(lastMsg);
          setShowChatNotif(true);
          
          // Auto-hide after 6 seconds
          const timer = setTimeout(() => setShowChatNotif(false), 6000);
          return () => clearTimeout(timer);
        }
      }
    };

    ychat.observe(observer);
    return () => ychat.unobserve(observer);
  }, [ydoc, showChat, user?.uid]);

  // Clear notification when chat opens
  useEffect(() => {
    if (showChat) setShowChatNotif(false);
  }, [showChat]);

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="min-h-screen bg-[var(--surface-0)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-0)] flex flex-col">
      {/* Toolbar */}
      <Toolbar
        editorMode={editorMode}
        onModeChange={setEditorMode}
        tiptapEditor={tiptapEditor}
        onExport={() => setShowExport(true)}
        onToggleChat={() => {
          setShowChat((prev) => !prev);
          setShowSnippets(false);
        }}
        onToggleSnippets={() => {
          setShowSnippets((prev) => !prev);
          setShowChat(false);
        }}
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={signOutUser}
        roomId={roomId}
      />

      {/* Workspace Area: Editor + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main editor area */}
        <div className="flex-1 relative flex flex-col min-w-0">
          {/* Connection status */}
          <div className="px-4 py-1.5 flex items-center justify-between text-xs border-b border-[var(--surface-3)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'} ${isConnected ? 'animate-pulse' : ''}`} />
                <span className="text-[var(--text-muted)]">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[var(--text-muted)]">
                Room: <span className="text-[var(--text-secondary)] font-mono">{roomId}</span>
              </span>
            </div>

            {/* User presence - inline on status bar */}
            <div className="flex items-center gap-4">
              {showChatNotif && lastChatMessage && (
                <div 
                  className="chat-notification-pill group"
                  onClick={() => {
                    setShowChat(true);
                    setShowChatNotif(false);
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="opacity-80">New message from</span>
                  <span className="font-black text-white">{lastChatMessage.author}</span>
                  <span className="mx-1">•</span>
                  <span className="opacity-90 italic">"{lastChatMessage.text.length > 20 ? lastChatMessage.text.substring(0, 20) + '...' : lastChatMessage.text}"</span>
                </div>
              )}
              <UserPresence connectedUsers={connectedUsers} />
            </div>
          </div>

          {/* Editor - Scrollable Workspace */}
          <div className="flex-1 overflow-auto flex flex-col bg-[var(--surface-0)]">
            {ydoc && provider ? (
              <div className={editorMode === 'richtext' ? 'doc-workspace' : 'flex-1 flex flex-col'}>
                {editorMode === 'richtext' ? (
                  <div className="doc-paper animate-fade-in">
                    <div className="doc-paper-header">
                      <input
                        type="text"
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        className="text-4xl font-black bg-transparent border-none outline-none text-white w-full placeholder-[var(--text-muted)] focus:ring-0 text-left"
                        placeholder="Document Title"
                        id="doc-title-input"
                      />
                    </div>
                    <Editor
                      mode="richtext"
                      ydoc={ydoc}
                      provider={provider}
                      roomId={roomId}
                      onEditorReady={setTiptapEditor}
                    />
                  </div>
                ) : (
                  <Editor
                    mode="code"
                    ydoc={ydoc}
                    provider={provider}
                    roomId={roomId}
                    onEditorReady={setTiptapEditor}
                  />
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-[var(--text-muted)]">Initializing editor...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Persistent Floating Overlays (Z-Index Managed) */}
      {showChat && (
        <ChatSidebar
          ydoc={ydoc}
          user={user}
          onClose={() => setShowChat(false)}
        />
      )}

      {showSnippets && (
        <SnippetSidebar
          tiptapEditor={tiptapEditor}
          onClose={() => setShowSnippets(false)}
        />
      )}

      {/* Export Panel Modal */}
      {showExport && (
        <ExportPanel
          getHTML={getEditorHTML}
          getWordCount={getWordCount}
          title={room?.title || 'Untitled Document'}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}

